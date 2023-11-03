import { world, ItemStack, GameMode, EquipmentSlot, Enchantment, Player, Vector } from "@minecraft/server";

import { Slot } from "../../../@tak/extender";

import { PlayerSlotTypes } from "../../../@tak/extender";

Player.prototype.getSlot = function(id) {
    return new Slot(this, id);
}

Player.prototype.getSlots = function(slotType) {
    const result = [];
    for (let i = 0; i < this.getComponent("inventory").container.size; i++) {
        result.push(this.getSlot(i));
    }
    for (const equipmentName of Object.getOwnPropertyNames(EquipmentSlot)) {
        result.push(new Slot(this, equipmentName));
    }
    if (slotType !== undefined) return result.filter(slot => PlayerSlotTypes[slotType].includes(slot.id));
    else return result;
}

Player.prototype.getGameMode = function() {
    for ( const modeIdentifier in GameMode ) {
        const matchPlayers = world.getPlayers({
            name: this.name,
            id: this.id,
            gameMode: modeIdentifier
        });

        if ( matchPlayers.length === 1 ) return modeIdentifier;
    }
}

Player.prototype.toEntityClass = function() {
    let entityClass = this.dimension.getEntities({ type: "minecraft:player", name: this.name, id: this.id })[0];
    entityClass.playerClass = this;
    if (!entityClass) entityClass = this;
    return entityClass;
}

Player.prototype.title = function(string = " ", fadeIn = 20, stay = 40, fadeOut = 20) {
    this.onScreenDisplay.setTitle(string, {
        fadeInDuration: fadeIn,
        stayDuration: stay,
        fadeOutDuration: fadeOut
    });

    return {
        subtitle: (subTitleString = "") => {
            this.onScreenDisplay.setTitle(string, {
                fadeInDuration: fadeIn,
                stayDuration: stay,
                fadeOutDuration: fadeOut,
                subtitle: subTitleString
            });
        }
    };
}

Player.prototype.actionbar = function(string = "") {
    this.onScreenDisplay.setActionBar(string);
}

Player.prototype.stopGliding = function() {
    const gameMode = this.getGameMode();

    if (gameMode === "spectator" || !this.isGliding) return false;

    this.runCommand("gamemode spectator");
    this.runCommand(`gamemode ${gameMode}`);

    return true;
}

Player.prototype.stopFlying = function() {
    const gameMode = this.getGameMode();

    if (gameMode !== "creative" || !this.isFlying) return false;

    this.runCommand("gamemode a");
    this.runCommand(`gamemode ${gameMode}`);

    return true;
}

Player.prototype.test = function() {
    this.title("test", 0, 2, 0);
    return this;
}

export class PlayerDataBase {
    constructor(player) {
        this.player = player;
    }
    get(key) {
        const propertyString = this.player.getDynamicProperty("dataBase") ?? "{}";
        const property = JSON.parse(propertyString);
        return property[key];
    }
    set(key, value) {
        if (typeof key !== "string") throw new Error("PlayerDataBase key type must be string")
        const propertyString = this.player.getDynamicProperty("dataBase") ?? "{}";
        const property = JSON.parse(propertyString);
        property[key] = value;
        this.player.setDynamicProperty("dataBase", JSON.stringify(property));
    }
    delete(key) {
        const propertyString = this.player.getDynamicProperty("dataBase") ?? "{}";
        const property = JSON.parse(propertyString);
        property[key] = null;
        delete property[key];
        this.player.setDynamicProperty("dataBase", JSON.stringify(property));
    }
    has(key) {
        if (this.get(key) === undefined) return false;
        return true;
    }
    clear() {
        this.player.setDynamicProperty("dataBase", undefined);
    }
    getAllData() {
        const propertyString = this.player.getDynamicProperty("dataBase") ?? "{}";
        return JSON.parse(propertyString);
    }
}

Player.prototype.getDataBase = function() {
    return new PlayerDataBase(this);
}
