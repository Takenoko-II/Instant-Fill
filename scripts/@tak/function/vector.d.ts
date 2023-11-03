import { Vector } from "@minecraft/server";

interface Vector2 {
    x: number;
    y: number;
}

interface Vector3 {
    x: number;
    y: number;
    z: number;
}

interface VectorFunctions {
    /**
     * 片方の位置からもう片方の位置への単位ベクトルを返します。
     * @param fromLocation 
     * @param toLocation 
     */
    getDirectionFromTwoLocation(fromLocation: Vector3, toLocation: Vector3): Vector;
    /**
     * 渡されたベクトルの長さを返します。
     * @param vector 任意のベクトル。
     */
    getVectorLength(vector: Vector3): number;
    /**
     * 渡されたベクトルと向きが等しい単位ベクトルを返します。
     * 長さをmagnificationにより指定することもできます。
     * @param vector 任意のベクトル。
     * @param magnification ベクトルの長さの倍率。
     */
    getUnitVector(vector: Vector3, magnification?: number): Vector

    /**
     * 単位ベクトルを回転に変換します。
     * @param vector 任意の単位ベクトル。
     */
    getRotationFromVector(vector: Vector3): Vector2
}

export const vectorFunctions: VectorFunctions;
