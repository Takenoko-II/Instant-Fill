import { world, system } from "@minecraft/server";

import { isInsFillTool } from "./api/index";

world.beforeEvents.playerBreakBlock.subscribe(event => {
    if (!isInsFillTool(event.itemStack)) return;
    event.cancel = true;
    system.runTimeout(() => {
        event.player.setDynamicProperty("start", event.player.getDynamicProperty("end"));
        event.player.setDynamicProperty("end", event.block.location);
        event.player.playSound("random.click", { volume: 10, pitch: 1.5 });
        event.player.sendMessage("座標を設定しました: " + JSON.stringify(event.block.location));
    });
});
