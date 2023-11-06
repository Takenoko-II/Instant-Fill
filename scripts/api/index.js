import { ItemStack, Player, Vector } from "@minecraft/server";

export function isInsFillTool(itemStack) {
    if (!(itemStack instanceof ItemStack)) return false;
    if (itemStack.getLore()[0] === "§9@Instant-Fill") return true;
    else return false;
}

export function subscribeAsInsFillTool(itemStack) {
    if (!(itemStack instanceof ItemStack)) return;
    itemStack.setLore(["§9@Instant-Fill"]);
    return itemStack;
}

export function undo(player) {
    if (!(player instanceof Player)) return;
    const lastStructure = StructureData.get(player).slice(-1)[0];
    if (lastStructure === undefined) {
        player.sendMessage("§cfillの履歴がありません");
        return false;
    }
    else {
        const { x, y, z } = lastStructure.location;
        const { successCount } = player.runCommand(`structure load "${StructureData.getName(player, lastStructure.count)}" ${x} ${y} ${z}`);
        if (successCount > 0) {
            player.sendMessage("undoしました §7(保存id: " + lastStructure.count.toString() + ")");
            StructureData.pop(player);
            return true;
        }
        return false;
    }
}

export class StructureData {
    constructor(player, minLocation) {
        if (!(player instanceof Player)) return;
        this.player = player;
        this.id = player.id;
        this.location = minLocation;
        this.count = JSON.parse(player.getDynamicProperty("structures") ?? "[]").slice(-1)[0]?.count ?? 0;
        this.count++;
        this.name = `{\\"id\\";${this.id},\\"count\\";${this.count},\\"location\\";{\\"x\\";${this.location.x},\\"y\\";${this.location.y},\\"z\\";${this.location.z}}}`;
    }
    save() {
        const forSave = JSON.parse(this.name.split("\\").join("").split(";").join(":"));
        const array = StructureData.get(this.player);
        array.push(forSave);
        this.player.setDynamicProperty("structures", JSON.stringify(array));
    }
    static getName(player, count) {
        if (!(player instanceof Player)) return;
        const structures = this.get(player);
        const targetData = structures.find(data => data.count === count);
        if (targetData === undefined) return;
        return `{\\"id\\";${targetData.id},\\"count\\";${targetData.count},\\"location\\";{\\"x\\";${targetData.location.x},\\"y\\";${targetData.location.y},\\"z\\";${targetData.location.z}}}`;
    }
    static pop(player) {
        if (!(player instanceof Player)) return;
        const structures = this.get(player);
        structures.pop();
        player.setDynamicProperty("structures", JSON.stringify(structures));
    }
    static get(player) {
        if (!(player instanceof Player)) return;
        return JSON.parse(player.getDynamicProperty("structures") ?? "[]");
    }
}

export function showRange(player, particleOptions = { id: "minecraft:endrod" }) {
    if (!(player instanceof Player)) return;
    const start = player.getDynamicProperty("start");
    const end = player.getDynamicProperty("end");
    if (start === undefined || end === undefined) return;
    const min = Vector.min(start, end);
    const max = Vector.max(start, end);
    if (!(min && max)) return;
    const vectors = [];
    for (let x = min.x; x <= max.x + 1; x += 0.5) {
        vectors.push({ x, y: min.y, z: min.z }, { x, y: min.y, z: max.z + 1 }, { x, y: max.y + 1, z: min.z }, { x, y: max.y + 1, z: max.z + 1 });
    }
    for (let y = min.y; y <= max.y + 1; y += 0.5) {
        vectors.push({ x: min.x, y, z: min.z }, { x: min.x, y, z: max.z + 1 }, { x: max.x + 1, y, z: min.z }, { x: max.x + 1, y, z: max.z + 1 });
    }
    for (let z = min.z; z <= max.z + 1; z += 0.5) {
        vectors.push({ x: min.x, y: min.y, z }, { x: min.x, y: max.y + 1, z }, { x: max.x + 1, y: min.y, z }, { x: max.x + 1, y: max.y + 1, z });
    }
    for (const vector of vectors) {
        if (player.dimension.getBlock(vector)) {
            player.dimension.spawnParticle(particleOptions.id, vector, particleOptions?.variables);
        }
    }
}

export { openMainForm, openSettingForm } from "./form";

export const particleSettingsDefault = {
    id: "minecraft:colored_flame_particle",
    show: true,
    color: { r: 0, g: 1, b: 0 },
    space: 1.0
};
