import { ItemStack, MolangVariableMap, Player, Vector3 } from "@minecraft/server";

export function isInsFillTool(itemStack: ItemStack): boolean;

export function subscribeAsInsFillTool(itemStack: ItemStack): ItemStack | undefined;

export function undo(player: Player): boolean;

export class StructureData {
    constructor(player: Player, minLocation: Vector3);
    readonly id: string;
    readonly location: Vector3;
    readonly count: number;
    readonly name: string;
    save(): void;
    static get(player: Player): StructureData;
    static getName(player: Player, count: number): string | undefined;
    static pop(player: Player): void;
}

export function showRange(player: Player, particleOptions?: ParticleOptions): void;

interface ParticleOptions {
    readonly id: string;
    readonly variables: MolangVariableMap;
    readonly chance: number;
}