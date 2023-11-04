import { Dimension, Player, Entity } from "@minecraft/server";

export class ChatCommandType {
    /**
     * コマンドの種類を新たに作成します。
     * @param id コマンドの種類のid。
     * @param prefix この種類のコマンドの接頭辞。
     */
    constructor(id: string, prefix: string);
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
     * コマンドの種類のリスト。
     */
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
    constructor(type: ChatCommandType, name: string, internal: (arg: ChatCommandExecuteData) => any, argumentOptions: ChatCommandArguments);
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
    constructor(source:Dimension | Player | Entity , args: ChatCommandExecuteArgument[], messageOptions: ChatCommandErrorMessageData);
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
     * コマンドの種類の名前。
     */
    readonly typeName: string;
    /**
     * コマンド名。
     */
    readonly commandName: string;
}