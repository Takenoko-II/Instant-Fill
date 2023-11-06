import { BlockType, BlockPermutation, BlockFillOptions } from "@minecraft/server";

declare module "@minecraft/server" {
    interface Dimension {
        /**
         * 指定の座標のブロックを置き換えます。
         * @param location 置き換える座標。
         * @param id 設置するブロックのid。
         * @param blockStates 設置するブロックの状態。
         */
        setBlock(location: Vector3, id: string, blockStates?: Record<string, string | number | boolean>): void;
        /**
         * 指定の範囲のブロックを置き換え、エラーが発生した場合は理由の文字列を返します。
         * @param bigin 始点座標。
         * @param end 終点座標。
         * @param block 設置するブロック。
         * @param options fillのオプション。
         */
        tryFillBlocks(bigin: Vector3, end: Vector3, block: BlockPermutation | BlockType | string, options?: BlockFillOptions): number | string;
    }
}
