import { ContainerSlot, EnchantmentList, ItemEnchantsComponent, ItemStack, Player } from "@minecraft/server";

export class Lore extends Array {
    constructor(containerSlot: ContainerSlot);
    /**
     * 最後の行に説明文を追加します。
     * @param text 追加するテキスト。
     */
    append(text: string): void;
    /**
     * 最初の行に説明文を追加します。
     * @param text 追加するテキスト。
     */
    prepend(text: string): void;
    /**
     * loreに格納されている配列を説明文に適用します。
     */
    update(): void;
    /**
     * 特定の行の説明文を削除します。
     * @param index 削除する行のインデックス。    
     * 未指定の場合、最後の行を削除します。
     */
    remove(index?: number): void;
}

export class SlotEnchantments extends Array {
    constructor(slot: Slot);
    /**
     * エンチャントのコンポーネント。
     */
    readonly component: ItemEnchantsComponent;
    /**
     * 特定のidのエンチャントに関する情報を取得します。
     * @param id 取得するエンチャントのid。
     */
    get(id: string): SlotEnchantment;
    /**
     * 指定のエンチャントをアイテムに付与します。
     * @param enchantment 付与するエンチャント。
     */
    add(enchantment: SlotEnchantment): void;
    /**
     * 指定のエンチャントをアイテムから削除します。
     * @param id 削除するエンチャントのid。
     */
    remove(id: string): void;
    /**
     * すべてのエンチャントをこのアイテムから削除します。
     */
    clear(): void;
    /**
     * 特定のidのエンチャントがこのアイテムに付与されているかどうかを返します。
     * @param id 取得するエンチャントのid。
     */
    has(id: string): boolean;
}

interface SlotEnchantment {
    readonly id: string;
    readonly level: number;
    readonly maxLevel: number;
}

export class SlotDurability {
    constructor(slot: Slot);
    /**
     * アイテムの現在の耐久値。
     */
    readonly value: number;
    /**
     * アイテムの現在のダメージ値。
     */
    readonly damage: number;
    /**
     * アイテムの最大耐久値。
     */
    readonly maxValue: number;
    /**
     * アイテムの耐久値を指定の値に設定します。    
     * 0未満を指定した場合、アイテムを破壊します。
     * @param durability 耐久値。
     */
    setDurability(durability: number): void;
    /**
     * アイテムのダメージ値を指定の値に設定します。    
     * 最大耐久値超過の値を指定した場合、アイテムを破壊します。
     * @param damage ダメージ値。
     */
    setDamage(damage: number): void;
}

export class Slot {
    constructor(player: Player, id: number | string);
    /**
     * スロットのid。
     */
    readonly id: number | string;
    /**
     * アイテムの説明文。
     */
    lore: Lore;
    /**
     * アイテムのエンチャント。
     */
    enchantments: SlotEnchantments;
    /**
     * アイテムの耐久。
     */
    readonly durability: SlotDurability | null;
    /**
     * このスロットに入っているアイテムを取得します。
     */
    get(replaceToAir?: boolean): ItemStack | null;
    /**
     * このスロットのアイテムを指定のアイテムに置き換えます。
     * @param itemStack 置き換えるアイテム。
     */
    override(itemStack?: ItemStack): void;
}