import "./@tak/extender";

import "./breakBlock.js";

import "./interact.js";

import "./itemUse.js";

import { world, system, MolangVariableMap, Player } from "@minecraft/server";

import { isInsFillTool, particleSettingsDefault, showRange, subscribeAsInsFillTool, undo } from "./api/index.js";

import { ChatCommand, ChatCommandArguments, ChatCommandType } from "./@tak/extender";

system.runInterval(() => {
    for (const player of world.getAllPlayers()) {
        if (!isInsFillTool(player.getSlot("Mainhand").get())) return;
        const particleSettings = JSON.parse(player.getDynamicProperty("particles") ?? JSON.stringify(particleSettingsDefault));
        if (particleSettings.show === false) return;
        const variable = new MolangVariableMap();
        variable.setColorRGB("variable.color", { red: particleSettings.color.r, blue: particleSettings.color.b, green: particleSettings.color.g });
        showRange(player, {
            id: particleSettings.id,
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

ChatCommand.register(new ChatCommand(type, "help",data => {
    if (!(data.source instanceof Player)) data.fail = true;
    if (data.getArg("command")) {
        const existFlag = type.form.showSpecific(data.source, data.getArg("command"));
        if (!existFlag) data.fail = true;
    }
    else type.form.showList(data.source);
}, {
    argument: new ChatCommandArguments(0, [
        { id: "command", type: "string" }
    ])
}));
