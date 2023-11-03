import { Enchantment, ItemEnchantsComponent, ItemStack } from "@minecraft/server";

class Lore extends Array {
    constructor(containerSlot) {
        const lore = containerSlot.getLore();
        super(...lore);
        this.containerSlot = containerSlot;
    }
    append(text) {
        if (typeof text !== "string") throw new Error("not a string");
        const lore = this;
        lore.push(text);
        this.containerSlot.setLore(lore);
    }
    prepend(text) {
        if (typeof text !== "string") throw new Error("not a string");
        const lore = this;
        lore.unshift(text);
        this.containerSlot.setLore(lore);
    }
    remove(index = this.length - 1) {
        const lore = Array(...this);
        lore.splice(index, 1);
        this.containerSlot.setLore(lore);
    }
    update() {
        this.containerSlot.setLore(this);
    }
}

class SlotEnchantments extends Array {
    constructor(slot) {
        const itemStack = slot.get();
        const component = itemStack.getComponent("enchantments");
        const array = Array.from(component.enchantments).map(enchantment => ({
            id: enchantment.type.id,
            level: enchantment.level,
            maxLevel: enchantment.type.maxLevel
        }));
        super(...array);
        this.itemStack = itemStack;
        this.component = component;
        this.enchantmentList = component.enchantments;
        this.slot = slot;
    }
    get(id) {
        return this.find(enchantment => enchantment.i === id);
    }
    add({ id, level }) {
        const enchantment = new Enchantment(id, level);
        if (!this.enchantmentList.canAddEnchantment(enchantment)) return;
        this.enchantmentList.addEnchantment(enchantment);
        this.component.enchantments = this.enchantmentList;
        this.slot.override(this.itemStack);
    }
    remove(id) {
        this.enchantmentList.removeEnchantment(id);
        this.component.enchantments = this.enchantmentList;
        this.slot.override(this.itemStack);
    }
    clear() {
        this.component.removeAllEnchantments();
        this.slot.override(this.itemStack);
    }
    has(id) {
        return this.enchantmentList.hasEnchantment(id);
    }
}

class SlotDurability {
    constructor(slot) {
        try {
            this.itemStack = slot.get()
            this.component = this.itemStack.getComponent("durability");
            this.damage = this.component.damage;
            this.value = this.component.maxDurability - this.damage;
            this.maxValue = this.component.maxDurability;
            this.slot = slot;
        }
        catch (e) { return null; }
    }
    setDurability(durability) {
        if (durability > this.maxValue) return;
        else if (durability < 0) {
            this.break();
            return;
        }
        this.component.damage = this.maxValue - durability;
        this.slot.override(this.itemStack);
    }
    setDamage(damage) {
        if (damage < 0) return;
        else if (damage > this.maxValue) {
            this.break();
            return;
        }
        this.component.damage = damage;
        this.slot.override(this.itemStack);
    }
}

export class Slot {
    constructor(player, id) {
        switch (typeof id) {
            case "number":
                this.containerSlot = player.getComponent("inventory").container.getSlot(id);
                break;
            case "string":
                this.containerSlot = player.getComponent("equippable").getEquipmentSlot(id);
                break;
            default:
                throw new Error("Invalid slotId type: " + typeof id);
        }
        this.id = id;
    }
    get(replaceToAir = true) {
        const itemStack = this.containerSlot.getItem();
        if (itemStack === undefined && replaceToAir === true) return new ItemStack("air");
        else if (itemStack === undefined && replaceToAir === false) return null;
        else return itemStack;
    }
    override(itemStack = this.containerSlot.getItem()) {
        if (!(itemStack instanceof ItemStack)) throw new Error("not an itemStack (" + typeof itemStack + ")");
        this.containerSlot.setItem(itemStack);
    }
    get lore() {
        return new Lore(this.containerSlot);
    }
    set lore(array) {
        if (array.find(e => typeof e !== "string")) throw new Error("includes non-string element");
        this.containerSlot.setLore(array);
    }
    get enchantments() {
        return new SlotEnchantments(this);
    }
    set enchantments(array) {
        if (array.find(e => e.id === undefined || e.level === undefined)) throw new Error("includes non-enchantment element");
        this.enchantments.clear();
        for (const ench of array) {
            this.enchantments.add(ench);
        }
    }
    get durability() {
        return new SlotDurability(this);
    }
}
