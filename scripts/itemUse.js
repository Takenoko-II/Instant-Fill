import { world, system, Vector, BlockPermutation } from "@minecraft/server";

import { ModalFormData } from "@minecraft/server-ui";

import { isInsFillTool, StructureData } from "./api/index";

world.afterEvents.itemUse.subscribe(event => {
    if (!isInsFillTool(event.itemStack) || event.source.getDynamicProperty("interactCooldown") > 0) return;
    const start = event.source.getDynamicProperty("start");
    const end = event.source.getDynamicProperty("end");
    const id = event.source.getDynamicProperty("blockId");
    const states = JSON.parse(event.source.getDynamicProperty("blockStates") ?? "{}");
    if (start === undefined || end === undefined) {
        event.source.sendMessage("§cブロックを左クリックで範囲を設定してください");
        return;
    }
    const { x: x1, y: y1, z: z1 } = Vector.min(start, end);
    const { x: x2, y: y2, z: z2 } = Vector.max(start, end);
    system.runTimeout(() => {
        if (start === undefined || end === undefined) {
            event.source.sendMessage("座標を設定してください");
            return;
        }
        const form = new ModalFormData();
        form.title("Instant Fill")
        .textField("ブロックIDの設定", "ここにIDを入力", id)
        .toggle("空気のみfillする", false)
        .textField("置き換えるブロック", "未入力の場合全ブロックが置き換えられます")
        .show(event.source).then(({ canceled, formValues }) => {
            if (canceled) return;
            if (formValues[0] === undefined) {
                event.source.sendMessage("ブロックを設定してください");
                return;
            }
            let block;
            try { block = BlockPermutation.resolve(formValues[0], (formValues[0] === id) ? states : undefined); }
            catch (e) {
                event.source.sendMessage(`§c${formValues[0]}は無効なブロックです`);
                return;
            }
            let options = { matchingBlock: undefined };
            if (formValues[1] === true) options.matchingBlock = BlockPermutation.resolve("minecraft:air");
            try { if (formValues[2] !== "" && formValues[2] !== undefined) options.matchingBlock = BlockPermutation.resolve(formValues[2]); }
            catch (e) {
                event.source.sendMessage(`§c${formValues[2]}は無効なブロックです`);
                return;
            }

            const newStructure = new StructureData(event.source, { x: x1, y: y1, z: z1 });
            event.source.runCommand(`structure save "${newStructure.name}" ${x1} ${y1} ${z1} ${x2} ${y2} ${z2} false disk true`);
            newStructure.save();
            event.source.sendMessage("地形を保存しました §7(保存id: " + newStructure.count.toString() + ")");

            event.source.dimension.fillBlocks(start, end, block, options);
        });
    });
});
