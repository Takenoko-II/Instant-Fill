import { Vector3 } from "@minecraft/server";

declare module "@minecraft/server" {
    interface Dimension {
        setBlock(location: Vector3, id: string, blockStates?: Record<string, string | number | boolean>): void;
        fill(start: Vector3, end: Vector3, toBlock: BlockInfo, fromBlock?: BlockInfo): void;
    }
}

interface BlockInfo {
    id: string,
    blockStates: Record<string, string | number | boolean>;
}
