import { NumberRange } from "../../../@tak/extender";

export class Random extends NumberRange {
    /**
     * 乱数の範囲データを作成します。
     * @param value1 任意の値。
     * @param value2 任意の値。
     */
    constructor(value1: number, value2?: number);
    /**
     * この範囲の中の値を返すXorshiftオブジェクト。
     */
    readonly xorshift: Xorshift;
    /**
     * 範囲データから乱数を生成します。
     */
    generate(): number;
    /**
     * 渡された配列をシャッフルします。
     */
    static shuffle(array: any[]): any[];
    /**
     * 1を100%として、渡された数値の確率でtrueを返します。    
     * 外れるとfalseを返します。
     * @param chance trueを返す確率。
     */
    static chance(chance: number): boolean;
}

export class Xorshift {
    /**
     * Xorshiftデータを作成します。
     * @param seed シード値。
     */
    constructor(seed: number);
    #x: number;
    #y: number;
    #z: number;
    /**
     * シード値。
     */
    seed: number;
    /**
     * シード値を基に乱数を生成します。
     */
    rand(): number;
    /**
     * シード値を基に生成した乱数の大きさを、さらに範囲のデータを基に縮めます。
     */
    restrict(range?: NumberRange): number;
}
