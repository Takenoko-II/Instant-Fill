import { world, system } from "@minecraft/server";

import { isInsFillTool } from "./api/index";

import { higherOrderFunctions } from "./@tak/extender";

world.beforeEvents.itemUseOn.subscribe(event => {
    if (!isInsFillTool(event.itemStack)) return;
    event.cancel = true;
    if (event.source.getDynamicProperty("interactCooldown") > 0) return;
    event.source.setDynamicProperty("interactCooldown", 10);
    system.runTimeout(() => {
        event.source.setDynamicProperty("blockId" + ((event.source.getDynamicProperty("copyReplacedBlock")) ? "Replaced" : ""), event.block.typeId);
        event.source.setDynamicProperty("blockStates" + ((event.source.getDynamicProperty("copyReplacedBlock")) ? "Replaced" : ""), JSON.stringify(event.block.permutation.getAllStates()));
        event.source.playSound("random.click", { volume: 10, pitch: 1.5 });
        event.source.sendMessage("ブロックを設定しました: " + JSON.stringify(event.block.typeId));
    });
});

higherOrderFunctions.runPlayers(({ player }) => {
    if (player.getDynamicProperty("interactCooldown") > 0) {
        player.setDynamicProperty("interactCooldown", (player.getDynamicProperty("interactCooldown") ?? 0) - 1);
    }
});
