import "./@tak/extender";

import "./breakBlock.js";

import "./interact.js";

import "./itemUse.js";

import { world, system, MolangVariableMap, Player } from "@minecraft/server";

import { isInsFillTool, showRange, subscribeAsInsFillTool, undo } from "./api/index.js";

import { ChatCommand, ChatCommandType } from "./@tak/extender";

system.runInterval(() => {
    for (const player of world.getAllPlayers()) {
        if (!isInsFillTool(player.getSlot("Mainhand").get())) return;
        const variable = new MolangVariableMap();
        variable.setColorRGB("variable.color", { red: 0, blue: 0, green: 1 });
        showRange(player, {
            id: "minecraft:colored_flame_particle",
            variables: variable,
            chance: 0.4
        });
    }
}, 20);

const type = new ChatCommandType("instant-fill", "@ins");

ChatCommand.register(new ChatCommand(type, "undo", data => {
    if (!(data.source instanceof Player)) data.fail = true;
    return undo(data.source);
}));

ChatCommand.register(new ChatCommand(type, "subscribe", data => {
    if (!(data.source instanceof Player)) data.fail = true;
    const slot = data.source.getSlot("Mainhand");
    const tool = subscribeAsInsFillTool(slot.get(false));
    if (tool) {
        slot.override(tool);
        return "登録に成功しました";
    }
    else return "アイテムを手に持ってください";
}));
