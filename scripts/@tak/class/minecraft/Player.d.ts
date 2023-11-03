import * as Minecraft from "@minecraft/server";

import { Slot } from "../original/Slot";

import { PlayerSlotTypeNames } from "../original/PlayerSlotTypes";

declare module "@minecraft/server" {
    interface Player {
        /**
         * プレイヤーのインベントリ内のスロットを取得します。
         * @prototype
         */
        public getSlot(id: number|string): Slot;
        /**
         * プレイヤーのインベントリ内のスロットを複数取得します。
         * @param slotType スロットの種類。
         */
        public getSlots(slotType: PlayerSlotTypeNames | "inventory" | "equipment" | "armor" | "hotbar" | "hand"): Slot[];
        /**
         * プレイヤーのゲームモードを取得します。
         */
        public getGameMode(): string;
        /**
         * プレイヤーをエンティティクラスに変換します。
         * 見つからなかった場合はプレイヤークラスをそのまま返します。
         * @prototype
         */
        public toEntityClass(): Minecraft.Entity | Minecraft.Player;
        /**
         * プレイヤーにタイトルを表示します。
         */
        public title(string: string, fadeIn?: number, stay?: number, fadeOut?: number): {
            /**
             * プレイヤーにサブタイトルを表示します。
             */
            public subtitle(subTitleString: string): void
        };
        /**
         * プレイヤーにアクションバーを表示します。
         */
        public actionbar(string: string): void;
        /**
         * プレイヤーの滑空を強制的に停止します。
         */
        public stopGliding(): boolean;
        /**
         * プレイヤーの飛行を強制的に停止します。
         */
        public stopFlying(): boolean;
        /**
         * プレイヤーに2tickの間「test」というタイトルを表示します。
         */
        public test(): Minecraft.Player;
        /**
         * 
         */
        public getDataBase(): PlayerDataBase;
    }
}

export class PlayerDataBase {
    constructor(player: Minecraft.Player);
    /**
     * このデータベースが保存されているプレイヤー。
     */
    readonly player: Minecraft.Player;
    /**
     * 指定されたkeyに対応するvalueを取得します。
     * @param key 
     */
    get(key: string): number | string | boolean | object | undefined;
    /**
     * 指定されたkeyでvalueを保存します。
     * @param key 
     * @param value 
     */
    set(key: string, value: number | string | boolean | object | undefined): void;
    /**
     * 指定されたkeyに対応するvalueを削除します。
     * @param key 
     */
    delete(key: string): void;
    /**
     * 指定されたkeyが存在するかどうかを返します。
     */
    has(key: string): boolean;
    /**
     * 全てのkeyに対応するvalueを削除します。
     * @param key 
     */
    clear(): void;
    /**
     * データベース全体を取得します。
     */
    getAllData(): object;
}