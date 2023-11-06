import { Dimension, BlockPermutation, BlockType } from "@minecraft/server";

import { vectorFunctions } from "../../../@tak/extender";

Dimension.prototype.setBlock = function(location, id, blockStates) {
    const block = this.getBlock(location);
    const permutation = BlockPermutation.resolve(id, blockStates);
    block.setPermutation(permutation);
}

Dimension.prototype.tryFillBlocks = function(bigin, end, block, options) {
    if (!vectorFunctions.isVector3(bigin)) return "第一引数の型が正しくありません"
    else if (!vectorFunctions.isVector3(end)) return "第二引数の型が正しくありません"
    else if (!(block instanceof BlockPermutation) && !(block instanceof BlockType) && typeof block !== "string") return "第三引数の型が正しくありません"
    else if (typeof options !== "object") return "第四引数の型が正しくありません";
    try {
        const replacedBlocksCount = this.fillBlocks(bigin, end, block, options);
        if (replacedBlocksCount > 0) return replacedBlocksCount;
        else return "fillがブロックを変更しませんでした"
    }
    catch (e) {
        return "fillの実行中にエラーが発生しました";
    }
}