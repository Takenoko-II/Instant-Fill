import { Dimension, BlockPermutation } from "@minecraft/server";

Dimension.prototype.setBlock = function(location, id, blockStates) {
    const block = this.getBlock(location);
    const permutation = BlockPermutation.resolve(id, blockStates);
    block.setPermutation(permutation);
}

Dimension.prototype.fill = function(start, end, toBlock, fromBlock = null) {
    const toPermutation = BlockPermutation.resolve(toBlock.id, toBlock.blockStates);
    const fromPermutation = BlockPermutation.resolve(fromBlock.id, fromBlock.blockStates);
    if (fromBlock) this.fillBlocks(start, end, toPermutation, { matchingBlock: fromPermutation });
    else this.fillBlocks(start, end, toPermutation);
}