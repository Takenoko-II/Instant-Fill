import { world, system, Dimension, Player, Entity } from "@minecraft/server";

import { ActionFormData } from "@minecraft/server-ui";

import { StringFunctions, numberFunctions } from "../../../@tak/extender";

function permissionCheck(source, permission) {
    if (source instanceof Dimension) {
        switch (permission) {
            case "console":
            case "operator":
            case "member":
                return true;
            default:
                return null;
        }
    }
    else if (source instanceof Player) {
        switch (permission) {
            case "console":
                return false;
            case "operator":
                if (source.isOp()) return true;
                else return false;
            case "member":
                return true;
            default:
                return null;
        }
    }
    else if (source instanceof Entity) {
        switch (permission) {
            case "console":
            case "operator":
                return false;
            case "member":
                return true;
            default:
                return null;
        }
    }
    else return null;
}

export class ChatCommandType {
    constructor(id, prefix, internal = () => undefined) {
        if (typeof id !== "string") throw new Error("idは文字列である必要があります");
        if (typeof prefix !== "string") throw new Error("prefixは文字列である必要があります");
        if (typeof internal !== "function") throw new Error("internalは関数である必要があります");
        this.id = id;
        this.prefix = prefix;
        this.internal = internal;
        ChatCommandType.list.push(this);
    }
    check(command) {
        const splited = StringFunctions.advancedSplit(command, " ", "\"");
        if (splited[0] === this.prefix) return true;
        else return false;
    }
    parse(source, command) {
        if (!(source instanceof Dimension || source instanceof Player || source instanceof Entity)) throw new Error("sourceはDimensionかPlayerかEntityである必要があります");
        if (!this.check(command)) return null;
        const splited = StringFunctions.advancedSplit(command, " ", "\"");
        const commandName = splited[1];
        const commandArgsNotParsed = splited.slice(2);
        const targetCommand = ChatCommand.list.find(cmd => cmd.name === commandName && cmd.typeId === this.id);
        const internalFlags = {
            fail: false,
            sendOutput: true
        };
        if (commandName === undefined || targetCommand === undefined || commandArgsNotParsed.length < (targetCommand?.arguments?.min ?? 0)) {
            internalFlags.fail = true;
        }
        system.runTimeout(() => {
            this.internal(new ChatCommandTypeExecuteData(source, { flags: internalFlags, typeId: this.id, commandName: commandName }));
        });
        if (commandName === undefined) {
            system.runTimeout(() => {
                if (internalFlags.sendOutput === true) world.sendMessage(`@${source.name ?? source.typeId ?? source.id} ran ${this.id} type command: §cmissing command name`);
            });
            return false;
        }
        else if (targetCommand === undefined) {
            system.runTimeout(() => {
                if (internalFlags.sendOutput === true) world.sendMessage(`@${source.name ?? source.typeId ?? source.id} ran ${this.id} type command - ${commandName}: §cunknown command`);
            });
            return false;
        }
        else if (!permissionCheck(source, targetCommand.permission)) {
            system.runTimeout(() => {
                if (internalFlags.sendOutput === true) world.sendMessage(`@${source.name ?? source.typeId ?? source.id} ran ${this.id} type command - ${commandName}: §cinsufficient permission level`);
            });
            return false;
        }
        else if (commandArgsNotParsed.length < targetCommand.arguments.min) {
            system.runTimeout(() => {
                if (internalFlags.sendOutput === true) world.sendMessage(`@${source.name ?? source.typeId ?? source.id} ran ${this.id} type command - ${targetCommand.name}: §cmissing arguments`);
            });
            return false;
        }
        else if (targetCommand) {
            const result = targetCommand.arguments.convert(commandArgsNotParsed);
            const executeData = new ChatCommandExecuteData(source, result, { flags: internalFlags, typeId: this.id, commandName: targetCommand.name });
            system.runTimeout(() => {
                let returner = targetCommand.run(executeData);
                if (typeof returner === "object") returner = JSON.stringify(returner);
                if (internalFlags.sendOutput === true && returner !== undefined) world.sendMessage(`@${source.name ?? source.typeId ?? source.id} ran ${this.id} type command - ${targetCommand.name}: §a${returner}`);
                else if (internalFlags.sendOutput === true) world.sendMessage(`@${source.name ?? source.typeId ?? source.id} ran ${this.id} type command - ${targetCommand.name}`);
            });
            return true;
        }
        return false;
    }
    form = {
        show: (player) => {
            const commands = ChatCommand.list.filter(command => command.typeId === this.id);
            const form = new ActionFormData().title("ChatCommand List").body("コマンド一覧");
            for (const command of commands) {
                form.button("§l§q" + command.name);
            }
            form.show(player).then(({ selection, cancelationReason }) => {
                if (cancelationReason === "UserBusy") system.run(show);
                if (selection === undefined) return;
                const selected = commands[selection];
                const description = [
                    `コマンド名: ${selected.name}`,
                    "",
                    `実行に必要な引数の数: ${selected.arguments.min}以上`,
                    "",
                    `実行に必要な権限レベル: ${selected.permission}以上`,
                    "",
                    `引数: §3${JSON.stringify(selected.arguments.list, undefined, 4)}§r`,
                    "",
                    "内部処理: §q" + selected.run.toString().replace(/§/g, "(section)") + "§r"
                ];
                new ActionFormData().title("ChatCommand List - " + selected.name).body(description.join("\n"))
                .button("§lBack", "textures/ui/back_button_default")
                .show(player).then(({ selection }) => {
                    if (selection === 0) show();
                });
            });
        }
    }
    static list = [];
}

export class ChatCommandArguments {
    constructor(minCount = 0, list = []) {
        if (!(typeof minCount === "number" && minCount >= 0 && Number.isInteger(minCount))) throw new Error("minCountは0以上の整数である必要があります");
        if (typeof list !== "object") throw new Error("listはChatCommandArgumentsである必要があります");
        this.min = minCount;
        this.list = list;
    }
    convert(args) {
        if (!Array.isArray(args)) throw new Error("argsは配列である必要があります");
        if (args.includes(e => typeof e !== "string")) throw new Error("argsは文字列の配列である必要があります");
        const result = [];
        this.list.forEach((argument, index) => {
            const targetString = args[index];
            let value;
            switch (argument.type) {
                case "string": {
                    value = String(targetString);
                    break;
                }
                case "number": {
                    value = numberFunctions.toNumber(targetString);
                    break;
                }
                case "boolean": {
                    switch (targetString) {
                        case "true":
                        case "1":
                            value = true;
                            break;
                        case "false":
                        case "null":
                        case "undefined":
                        case "0":
                            value = false;
                            break;
                    }
                    break;
                }
                case "undefined": {
                    value = undefined;
                    break;
                }
                case "null": {
                    value = null;
                    break;
                }
                case "object": {
                    try {
                        value = JSON.parse(targetString);
                    }
                    catch (e) {}
                    break;
                }
                case "array": {
                    try {
                        value = JSON.parse(targetString);
                    }
                    catch (e) {}
                    break;
                }
                case "any": {
                    switch (targetString) {
                        case "":
                        case undefined:
                        case "undefined":
                            value = undefined;
                            break;
                        case "null":
                            value = null;
                            break;
                        case "NaN":
                            value = NaN;
                            break;
                        case "true":
                            value = true;
                            break;
                        case "false":
                            value = false;
                            break;
                        default:
                            if (numberFunctions.toNumber(targetString) !== undefined) value = numberFunctions.toNumber(targetString);
                            else if (targetString.startsWith("\"") && targetString.endsWith("\"")) value = String(targetString);
                            else {
                                try { value = JSON.parse(value); }
                                catch (e) {
                                    value = String(targetString);
                                }
                            }
                    }
                    break;
                }
                default:
                    value = undefined;
            }
            if (Array.isArray(argument.allowValues)) {
                value = argument.allowValues.includes(value) ? value : undefined;
            }
            result.push({ id: argument.id, value });
        });
        return result;
    }
}

export class ChatCommandExecuteData {
    constructor(source, args, messageOptions) {
        if (!(source instanceof Dimension || source instanceof Player || source instanceof Entity)) throw new Error("sourceはDimensionかPlayerかEntityである必要があります");
        if (!Array.isArray(args)) throw new Error("argsはChatCommandExecuteArgument[]である必要があります");
        this.source = source;
        this.list = args;
        this.flags = messageOptions.flags;
        this.typeId = messageOptions.typeId;
        this.commandName = messageOptions.commandName;
    }
    getArg(id) {
        return this.list.find(arg => arg.id === id)?.value;
    }
    getAllArgs() {
        return this.list.map(arg => arg.value);
    }
    get sendOutput() {
        return this.flags.sendOutput
    }
    set sendOutput(value) {
        if (typeof value === "boolean") {
            this.flags.sendOutput = value;
        }
    }
    get fail() {
        return this.flags.fail;
    }
    set fail(value) {
        if (typeof value === "boolean") {
            this.flags.fail = value;
            if (value === true) {
                if (this.flags.sendOutput === true) world.sendMessage(`@${this.source.name ?? this.source.typeId ?? this.source.id} ran ${this.typeId} type command - ${this.commandName}: §cerror while executing command`);
                throw "§cerror while executing command§f";
            }
        }
    }
}

export class ChatCommandTypeExecuteData {
    constructor(source, messageOptions) {
        if (!(source instanceof Dimension || source instanceof Player || source instanceof Entity)) throw new Error("sourceはDimensionかPlayerかEntityである必要があります");
        this.source = source;
        this.flags = messageOptions.flags;
        this.typeId = messageOptions.typeId;
        this.commandName = messageOptions.commandName;
    }
    get sendOutput() {
        return this.flags.sendOutput
    }
    set sendOutput(value) {
        if (typeof value === "boolean") {
            this.flags.sendOutput = value;
        }
    }
    get fail() {
        return this.flags.fail;
    }
    set fail(value) {
        throw `§ccannot set "fail" to ${value} - property "fail" is read-only`;
    }
}

export class ChatCommand {
    constructor(type, name, internal, options = { argument: new ChatCommandArguments(), permission: "member" }) {
        if (!(type instanceof ChatCommandType)) throw new Error("typeはChatCommandTypeである必要があります");
        if (typeof name !== "string") throw new Error("nameは文字列である必要があります");
        if (typeof internal !== "function") throw new Error("internalは関数である必要があります");
        if (options !== undefined && typeof options !== "object") throw new Error("optionsはオブジェクトである必要があります");
        this.name = name;
        this.run = internal;
        this.arguments = options.argument ?? new ChatCommandArguments();
        this.permission = options.permission ?? "member";
        this.typeId = type.id;
    }
    static list = [];
    static register(command) {
        if (!(command instanceof ChatCommand)) throw new Error("commandはChatCommandである必要があります");
        this.list.push(command);
    }
    static execute(source, command) {
        if (!(source instanceof Dimension || source instanceof Player || source instanceof Entity)) throw new Error("sourceはDimensionかPlayerかEntityである必要があります");
        if (typeof command !== "string") throw new Error("commandは文字列である必要があります");
        const targetType = ChatCommandType.list.find(type => type.check(command));
        if (targetType) return targetType.parse(source, command);
        else return null;
    }
}

world.beforeEvents.chatSend.subscribe(event => {
    if (ChatCommand.execute(event.sender, event.message) !== null) event.cancel = true;
});
