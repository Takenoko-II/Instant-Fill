import { BlockPermutation, Player, Vector } from "@minecraft/server";

import { ActionFormData, MessageFormData, ModalFormData } from "@minecraft/server-ui";

import { StructureData, particleSettingsDefault } from "./index";

export function openMainForm(player) {
    const start = player.getDynamicProperty("start");
    const end = player.getDynamicProperty("end");
    const id = player.getDynamicProperty("blockId");
    const states = JSON.parse(player.getDynamicProperty("blockStates") ?? "{}");
    const idReplaced = player.getDynamicProperty("blockIdReplaced");
    const statesReplaced = JSON.parse(player.getDynamicProperty("blockStatesReplaced") ?? "{}");
    if (start === undefined || end === undefined) {
        player.sendMessage("§cブロックを左クリックで範囲を設定してください");
        return;
    }
    const { x: x1, y: y1, z: z1 } = Vector.min(start, end);
    const { x: x2, y: y2, z: z2 } = Vector.max(start, end);
    if (start === undefined || end === undefined) {
        player.sendMessage("座標を設定してください");
        return;
    }
    new ModalFormData()
    .title("Instant Fill")
    .textField("ブロックIDの設定", "ここにIDを入力", id)
    .toggle("空気のみfillする", false)
    .textField("置き換えるブロック", "未入力の場合全ブロックが置き換えられます", idReplaced)
    .show(player).then(({ canceled, formValues }) => {
        if (canceled) return;
        if (formValues[0] === undefined) {
            player.sendMessage("ブロックを設定してください");
            return;
        }
        let block;
        try { block = BlockPermutation.resolve(formValues[0], (formValues[0] === id) ? states : undefined); }
        catch (e) {
            player.sendMessage(`§c${formValues[0]}は無効なブロックです`);
            return;
        }
        let options = { matchingBlock: undefined };
        if (formValues[1] === true) options.matchingBlock = BlockPermutation.resolve("minecraft:air");
        try { if (formValues[2] !== "" && formValues[2] !== undefined) options.matchingBlock = BlockPermutation.resolve(formValues[2], (formValues[2] === idReplaced) ? statesReplaced : undefined); }
        catch (e) {
            player.sendMessage(`§c${formValues[2]}は無効なブロックです`);
            return;
        }
    
        const newStructure = new StructureData(player, { x: x1, y: y1, z: z1 });
        const { successCount } = player.runCommand(`structure save "${newStructure.name}" ${x1} ${y1} ${z1} ${x2} ${y2} ${z2} false disk true`);
        if (successCount > 0) {
            player.setDynamicProperty("blockId", formValues[0]);
            player.setDynamicProperty("blockIdReplaced", formValues[2]);
            newStructure.save();
            player.sendMessage("地形を保存しました §7(保存id: " + newStructure.count.toString() + ")");
    
            player.dimension.fillBlocks(start, end, block, options);
        }
        else {
            player.sendMessage("§c地形の保存に失敗したため、fillをキャンセルしました");
        }
    });
}

export function openSettingForm(player) {
    if (!(player instanceof Player)) return;
    const settings = JSON.parse(player.getDynamicProperty("particles") ?? JSON.stringify(particleSettingsDefault));
    const particleTypes = [
        "minecraft:basic_flame_particle",
        "minecraft:blue_flame_particle",
        "minecraft:colored_flame_particle",
        "minecraft:endrod",
        "minecraft:obsidian_glow_dust_particle"
    ];
    new ActionFormData()
    .title("Instant Fill")
    .body("各種設定")
    .button("§l§q選択範囲表示の設定", "textures/blocks/structure_void")
    .button("§l§bブロックスポイトの設定", "textures/ui/copy")
    .button("§l§mこのアイテムの登録を解除する", "textures/ui/cancel")
    .show(player).then(({ canceled, selection }) => {
        if (canceled) return;
        switch (selection) {
            case 0: {
                new ModalFormData()
                .title("Instant Fill")
                .toggle("表示 / 非表示", settings.show)
                .dropdown("パーティクルの種類", particleTypes, particleTypes.indexOf(settings.id))
                .slider("パーティクルの色 - §cR§r", 0, 100, 1, settings.color.r * 100)
                .slider("パーティクルの色 - §aG§r", 0, 100, 1, settings.color.g * 100)
                .slider("パーティクルの色 - §9B§r", 0, 100, 1, settings.color.b * 100)
                .show(player).then(({ canceled, formValues }) => {
                    if (canceled) return;
                    const strigified = JSON.stringify({
                        id: particleTypes[formValues[1]],
                        show: formValues[0],
                        color: { r: formValues[2] / 100, g: formValues[3] / 100, b: formValues[4] / 100 }
                    });
                    player.sendMessage("保存しました: "+ strigified);
                    player.setDynamicProperty("particles", strigified);
                });
                break;
            }
            case 1: {
                const description = [
                    "fillするブロック: ",
                    "    id: " + (player.getDynamicProperty("blockId") ?? ""),
                    "    states: " + (player.getDynamicProperty("blockStates") ?? "{}"),
                    "置き換えられるブロック: ",
                    "    id: " + (player.getDynamicProperty("blockIdReplaced") ?? ""),
                    "    states: " + (player.getDynamicProperty("blockStatesReplaced") ?? "{}")
                ];
                const specialBlockIds = [undefined, "minecraft:air", "minecraft:water", "minecraft:flowing_water", "minecraft:lava", "minecraft:flowing_lava", "minecraft:light_block", "minecraft:structure_void"];
                new ModalFormData()
                .title("Instant Fill")
                .dropdown(description.join("\n") + "\n\nスポイトするブロック", ["fillするブロック", "置き換えられるブロック"], Number(player.getDynamicProperty("copyReplacedBlock") ?? 0))
                .dropdown("特殊ブロックのスポイト", ["スポイトしない", "空気 / minecraft:air", "水 / minecraft:water", "流水 / minecraft:flowing_water", "溶岩 / minecraft:lava", "溶岩流 / minecraft:flowing_lava", "ライトブロック / minecraft:light_block", "ストラクチャーヴォイド / minecraft:structure_void"])
                .show(player).then(({ canceled, formValues }) => {
                    if (canceled) return;
                    player.setDynamicProperty("copyReplacedBlock", (formValues[0] === 1) ? true : false);
                    if (formValues[1] !== 0) player.setDynamicProperty("blockId" + ((player.getDynamicProperty("copyReplacedBlock") ? "Replaced" : "")), specialBlockIds[formValues[1]]);
                    player.sendMessage("設定を適用しました");
                });
                break;
            }
            case 2: {
                if (player.getSlot("Mainhand").lore[0] === "§9@Instant-Fill") {
                    new MessageFormData()
                    .title("Instant Fill")
                    .body("本当に登録を解除しますか？")
                    .button1("§aはい")
                    .button2("§cいいえ")
                    .show(player).then(({ canceled, selection }) => {
                        if (canceled) return;
                        if (selection === 0) {
                            player.getSlot("Mainhand").lore.remove(0);
                            player.sendMessage("登録を解除しました");
                        }
                    });
                }
                else player.sendMessage("このアイテムは登録されていません");
            }
        }
    });
}
