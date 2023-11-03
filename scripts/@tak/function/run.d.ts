import { Entity, EntityQueryOptions, Player } from "@minecraft/server";

interface HigherOrderFunctions {
    /**
     * コールバック関数を指定回数実行し、返り値を全て格納した配列を返します。
     */
    runRepeat(callbackFn: (arg: runRepeatData) => any | void, count: number): any[];
    /**
     * 指定した条件のプレイヤー全てに対してコールバックを毎tick実行します。
     */
    runPlayers(callbackFn: (arg: runPlayerData) => void, options: EntityQueryOptions): void;
    /**
     * 指定した条件のエンティティ全てに対してコールバックを毎tick実行します。
     */
    runEntities(callbackFn: (arg: runEntityData) => void, options: EntityQueryOptions): void;
}

interface runRepeatData {
    /**
     * コールバックが呼び出された回数。
     */
    readonly count: number;
    /**
     * 前回までのコールバックが返してきた値の配列。
     */
    readonly currentResults: any[];
}

interface runPlayerData {
    /**
     * それぞれのプレイヤー。
     */
    readonly player: Player;
    /**
     * すべてのプレイヤーに対する常時実行を停止します。
     */
    stop: () => void;
}

interface runEntityData {
    /**
     * それぞれのエンティティ。
     */
    readonly entity: Entity;
    /**
     * すべてのエンティティに対する常時実行を停止します。
     */
    stop: () => void;
}

export const higherOrderFunctions: HigherOrderFunctions;
