import { Dimension, Player, Entity } from "@minecraft/server";

export class ChatCommandType {
    /**
     * コマンドの種類を新たに作成します。
     * @param id コマンドの種類のid。
     * @param prefix この種類のコマンドの接頭辞。
     * @param internal この種類のコマンドが実行された際に呼び出される関数。
     */
    constructor(id: string, prefix: string, internal?: (arg: ChatCommandTypeExecuteData) => void);
    /**
     * コマンドの種類のid。
     */
    readonly id: string;
    /**
     * この種類のコマンドの接頭辞。
     */
    readonly prefix:string;
    /**
     * 文字列を解析し、この種類のコマンドであればtrueを返します。
     * @param command 解析する文字列。
     */
    check(command: string): boolean;
    /**
     * 文字列を解析し、この種類のコマンドであれば実行します。
     * @param source コマンドの実行者。
     * @param command 実行するコマンド。
     */
    parse(source: Dimension | Player | Entity, command: string): boolean | null;
    /**
     * この種類のコマンドの一覧を表示します。
     */
    openList(player: Player): void;
    /**
     * コマンドの種類のリスト。
     */
    static readonly list: ChatCommandType[];
}

export class ChatCommandArguments {
    /**
     * コマンドの引数データを新たに作成します。
     * @param minCount 実行に必要となる引数の数。
     * @param list 引数のデータ。
     */
    constructor(minCount?: number, list?: ChatCommandArgument[]);
    /**
     * 実行に必要となる引数の数。
     */
    readonly min: number;
    /**
     * 引数のデータ。
     */
    readonly list: ChatCommandArgument[];
    /**
     * 文字列の配列を型変換します。
     */
    convert(args: string[]): ChatCommandExecuteArgument[];
}


interface ChatCommandArgument {
    /**
     * 引数のid。
     */
    readonly id: string;
    /**
     * 引数の型。
     */
    readonly type: "string" | "number" | "boolean" | "object" | "array" | "undefined" | "null" | "any";
    /**
     * 引数に受け取ることができる値のリスト。
     */
    readonly allowValues?: any[];
}

export class ChatCommand {
    /**
     * 新しくコマンドを作成します。
     * @param type コマンドの種類。
     * @param name コマンド名。
     * @param internal コマンドが実行されたときに呼び出される関数。
     * @param argumentOptions このコマンドの引数に関するオプション。
     */
    constructor(type: ChatCommandType, name: string, internal: (arg: ChatCommandExecuteData) => any, options: { permission: "member" | "operator" | "console", argument: ChatCommandArguments });
    /**
     * コマンド名。
     */
    readonly name: string;
    /**
     * コマンドが実行されたときに呼び出される関数。
     */
    readonly run: (arg: ChatCommandExecuteData) => any;
    /**
     * このコマンドの引数に関するデータ。
     */
    readonly arguments: ChatCommandArguments;
    /**
     * このコマンドの実行に必要な権限レベル。
     */
    readonly permission: "member" | "operator" | "console";
    /**
     * このコマンドの種類のid。
     */
    readonly typeId: string;
    /**
     * 登録されているコマンドのリスト。
     */
    static readonly list: ChatCommand[];
    /**
     * コマンドを使えるように登録する。
     * @param command 登録するコマンドのデータ。
     */
    static register(command: ChatCommand): void;
    /**
     * コマンドを実行します。
     * @param source コマンドの実行者。
     * @param command 実行するコマンド。
     */
    static execute(source: Dimension | Player | Entity, command: string): boolean | null;
}

export class ChatCommandExecuteData {
    constructor(source: Dimension | Player | Entity, args: ChatCommandExecuteArgument[], messageOptions: ChatCommandErrorMessageData);
    /**
     * コマンドの実行者。
     */
    readonly source: Dimension | Player | Entity;
    /**
     * 渡された引数のうち特定のidの引数を取得する。
     */
    getArg(id: string): any;
    /**
     * 渡された引数のうちすべての引数を取得する。
     */
    getAllArgs(): any[];
    /**
     * コマンドの実行結果を通知するかどうか。
     */
    sendOutput: boolean;
    /**
     * コマンドの実行が失敗するかどうか。
     */
    fail: boolean;
    /**
     * コマンドの種類のid。
     */
    readonly typeId: string;
    /**
     * コマンド名。
     */
    readonly commandName: string;
}

interface ChatCommandExecuteArgument {
    /**
     * 引数のid。
     */
    readonly id: string;
    /**
     * 引数の値。
     */
    readonly value: any;
}

interface ChatCommandErrorMessageData {
    /**
     * コマンドの種類のid。
     */
    readonly typeId: string;
    /**
     * コマンド名。
     */
    readonly commandName: string;
    /**
     * コマンドの失敗・実行結果通知に関するフラグ。
     */
    readonly flags: { fail: boolean, sendOutput: boolean };
}

export class ChatCommandTypeExecuteData {
    constructor(source: Dimension | Player | Entity, messageOptions: ChatCommandErrorMessageData);
    /**
     * コマンドの実行者。
     */
    readonly source: Dimension | Player | Entity;
    /**
     * コマンドの実行結果を通知するかどうか。
     */
    sendOutput: boolean;
    /**
     * コマンドの実行が失敗するかどうか。
     */
    readonly fail: boolean;
    /**
     * コマンドの種類のid。
     */
    readonly typeId: string;
    /**
     * コマンド名。
     */
    readonly commandName: string;
}