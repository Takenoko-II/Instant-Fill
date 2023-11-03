import { numberFunctions } from "../extender";

function isEnableArray(value) {
    if (Array.isArray(value) && value[0] !== undefined) return true;
    return false;
}

function includesNaN(array) {
    for (const value of array) {
        if (!numberFunctions.isAbsolutelyNumber(value)) return true;
    }
    return false;
}

/**
 * 配列内の最小の数を返します。
 * @param {number[]} array 数値型の配列。
 * @returns {number}
 */
function getMinInArray(array) {
    if (!isEnableArray(array) || includesNaN(array)) return undefined;
    return array.reduce((a, b) => Math.min(a, b));
}

/**
 * 配列内の最大の数を返します。
 * @param {number[]} array 数値型の配列。
 * @returns {number}
 */
function getMaxInArray(array) {
    if (!isEnableArray(array) || includesNaN(array)) return undefined;
    return array.reduce((a, b) => Math.max(a, b));
}

/**
 * 配列内の全ての値の平均値を返します。
 * @param {number[]} array 数値型の配列。
 * @returns {number}
 */
function getAverageInArray(array) {
    if (!isEnableArray(array) || includesNaN(array)) return undefined;
    return array.reduce((a, b) => a + b) / array.length;
}

/**
 * 配列内の全ての値の中央値を返します。
 * @param {number[]} array 数値型の配列。
 * @returns {number}
 */
function getMedianInArray(array) {
    if (!isEnableArray(array) || includesNaN(array)) return undefined;
    const halfLength = (array.length / 2) | 0;
    const sorted = array.sort((a, b) => a - b);

    if ((array.length % 2) === 0) return (sorted[halfLength] + sorted[halfLength - 1]) / 2;
    else return sorted[halfLength];
}

export class ArrayFunctions {
    static getMinInArray = getMinInArray;
    static getMaxInArray = getMaxInArray;
    static getAverageInArray = getAverageInArray;
    static getMedianInArray = getMedianInArray;
}