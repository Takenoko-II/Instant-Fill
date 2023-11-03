import { Vector } from "@minecraft/server";

declare module "@minecraft/server" {
    interface Entity {
        /**
         * エンティティの位置ベクトルにベクトルを加算し表示します。
         * @param direction 
         * @param id 
         */
        displayDirection(direction: Vector3, id?: string): void;
        /**
         * エンティティの視線を基準とした相対座標のx, y, z成分の単位ベクトルを返します。
        */
        getAxisDirections(): AxisDirections;
        /**
         * エンティティの周囲のブロックのidをテストします。
         */
        detect(id: string | string[], relativeLocation?: Vector3): boolean;
    }
}

interface AxisDirections {
    readonly x: Vector;
    readonly y: Vector;
    readonly z: Vector;
}
