import { world, system } from "@minecraft/server";

import { isInsFillTool, openMainForm, openSettingForm } from "./api/index";

world.afterEvents.itemUse.subscribe(event => {
    if (!isInsFillTool(event.itemStack) || event.source.getDynamicProperty("interactCooldown") > 0) return;
    system.runTimeout(() => {
        if (!event.source.isSneaking) openMainForm(event.source);
        else openSettingForm(event.source);
    });
});
