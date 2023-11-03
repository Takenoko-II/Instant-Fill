import { ItemStack, Enchantment } from "@minecraft/server";

ItemStack.prototype.lore = function() {
    let lore = this.getLore();

    lore.add = (value, location) => {
        if (typeof location == "number") lore.splice(location + 1, 0, value);
        else if (typeof location == "string") {
            switch (location) {
                case "first":
                    lore.unshift(value);
                    break;
                case "last":
                    lore.push(value);
                    break;
            }
        }

        this.setLore(lore);
    }

    lore.remove = (location) => {
        if (typeof location == "number") lore.splice(location, 1);
        else if (typeof location == "string") {
            switch (location) {
                case "first":
                    lore.shift();
                    break;
                case "last":
                    lore.pop();
                    break;
            }
        }

        this.setLore(lore);
    }

    lore.set = (value, location) => {
        if (typeof location == "number") lore.splice(location, 1, value);
        else if (typeof location == "string") {
            switch (location) {
                case "first":
                    lore.shift();
                    lore.unshift(value);
                    break;
                case "last":
                    lore.pop();
                    lore.push(value);
                    break;
            }
        }

        this.setLore(lore);
    }

    lore.get = (location) => {
        if (typeof location == "number") return lore[location];
        else if (typeof location == "string") {
            switch (location) {
                case "first":
                    return lore[0];
                case "last":
                    return lore.slice(-1)[0];
            }
        }
    }

    lore.reset = () => {
        this.setLore([]);
    }

    return lore;
}

ItemStack.prototype.getEnchantments = function() {
    const EnchantmentsArray = Array.from(this.getComponent("enchantments").enchantments);
    const enchantmentComponent = this.getComponent("enchantments");
    const enchantmentList = enchantmentComponent.enchantments;

    const Result = [];

    EnchantmentsArray.forEach(ench => {
        const Enchant = {
            id: ench.type.id,
            level: ench.level,
            maxLevel: ench.type.maxLevel,
            delete: () => {
                enchantmentList.removeEnchantment(ench.type.id);

                enchantmentComponent.enchantments = enchantmentList;

                this.getSlot(slot).override(itemStack);
            }
        };
        Result.push(Enchant);
    });

    Result.add = (Enchant = { id: "", level: 1 }) => {
        try {
            enchantmentList.addEnchantment(new Enchantment(Enchant.id, Enchant.level));

            enchantmentComponent.enchantments = enchantmentList;

            return true;
        }
        catch (Error) {
            return false;
        }
    }

    Result.remove = (EnchantId) => {
        try {
            enchantmentList.removeEnchantment(EnchantId);

            enchantmentComponent.enchantments = enchantmentList;

            return true;
        }
        catch (Error) {
            return false;
        }
    }

    Result.canAddTest = (Enchant = { id: "", level: 1 }) => {
        try {
            if ( enchantmentList.canAddEnchantment(new Enchantment(Enchant.id, Enchant.level)) ) return true;
            else return false;
        }
        catch (Error) {
            return false;
        }
    }

    Result.slot = enchantmentList.slot;

    return Result;
}

ItemStack.prototype.getEnchantment = function(enchantId) {
    try {
        const enchantmentComponent = this.getComponent("enchantments");
        const enchantmentList = this.getComponent("enchantments").enchantments;
        const enchantment = enchantmentList.getEnchantment(enchantId);

        return {
            id: enchantment.type.id,
            level: enchantment.level,
            maxLevel: enchantment.type.maxLevel,
            delete: () => {
                enchantmentList.removeEnchantment(enchantment.type.id);

                enchantmentComponent.enchantments = enchantmentList;
            }
        };
    }
    catch (e) {
        return null;
    }
}

ItemStack.prototype.hasEnchantment = function(enchantId = "") {
    try {
        const enchantmentList = this.getComponent("enchantments").enchantments;

        if (enchantId) {
            if (enchantmentList.hasEnchantment(enchantId)) return true;
            else return false;
        }
        else {
            const hasEnchantment = (Array.from(enchantmentList)[0]) ? true : false;
            return hasEnchantment;
        }
    }
    catch (e) {
        return false;
    }
}

ItemStack.prototype.getDurability = () => {
    try {
        const durabilityComponent = this.getComponent("durability");

        return {
            damage: durabilityComponent.damage,
            durability: durabilityComponent.maxDurability - durabilityComponent.damage,
            maxDurability: durabilityComponent.maxDurability,
            damageChance: durabilityComponent.getDamageChance(),
            setDurability: (durability) => {
                if (durability > durabilityComponent.maxDurability) return false;

                durabilityComponent.damage = durabilityComponent.maxDurability - durability;

                return true;
            },
            setDamage: (damage) => {
                if (damage < 0) return false;

                durabilityComponent.damage = damage;

                return true;
            },
            break: () => {
                this.playSound("random.break");
                return new ItemStack("air");
            }
        };
    }
    catch (e) {
        return null;
    }
}

ItemStack.prototype.getCooldown = () => {
    try {
        const cooldownComponent = this.getComponent("cooldown");

        return {
            category: cooldownComponent.cooldownCategory,
            ticks: cooldownComponent.cooldownTicks,
            start: (player) => {
                cooldownComponent.startCooldown(player);
            }
        };
    }
    catch (e) {
        return null;
    }
}

ItemStack.prototype.set = function(player, slot) {
    player.getSlot(slot).override(this);
}
