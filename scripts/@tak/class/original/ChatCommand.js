import { world, system, Dimension, Player, Entity } from "@minecraft/server";

import { StringFunctions, numberFunctions } from "../../../@tak/extender";

export class ChatCommandType {
    constructor(id, prefix) {
        if (!(typeof id === "string" && typeof prefix === "string")) throw new Error("idとprefixはともに文字列である必要があります");
        this.id = id;
        this.prefix = prefix;
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
        const targetCommand = ChatCommand.list.find(cmd => cmd.name === commandName);
        if (commandName === undefined) {
            world.sendMessage(`@${source.name} ran ${this.id} type command: §cmissing command name`);
            return false;
        }
        else if (targetCommand === undefined) {
            world.sendMessage(`@${source.name} ran ${this.id} type command - ${commandName}: §cunknown command`);
            return false;
        }
        else if (commandArgsNotParsed.length < targetCommand.arguments.min) {
            world.sendMessage(`@${source.name} ran ${this.id} type command - ${targetCommand.name}: §cmissing arguments`);
            return false;
        }
        else if (targetCommand) {
            const result = targetCommand.arguments.convert(commandArgsNotParsed);
            const executeData = new ChatCommandExecuteData(source, result, { typeName: this.id, commandName: targetCommand.name });
            system.runTimeout(() => {
                let returner = targetCommand.run(executeData);
                if (typeof returner === "object") returner = JSON.stringify(returner);
                if (executeData.sendOutputInternal === true && returner !== undefined) world.sendMessage(`@${source.name} ran ${this.id} type command - ${targetCommand.name}: §a${returner}`);
                else if (executeData.sendOutputInternal === true) world.sendMessage(`@${source.name} ran ${this.id} type command - ${targetCommand.name}`);
            });
            return true;
        }
        return false;
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
        this.sendOutputInternal = true;
        this.failInternal = false;
        this.typeName = messageOptions.typeName;
        this.commandName = messageOptions.commandName;
    }
    getArg(id) {
        return this.list.find(arg => arg.id === id)?.value;
    }
    getAllArgs() {
        return this.list.map(arg => arg.value);
    }
    get sendOutput() {
        return this.sendOutputInternal;
    }
    set sendOutput(value) {
        if (typeof value === "boolean") {
            this.sendOutputInternal = value;
        }
    }
    get fail() {
        return this.failInternal;
    }
    set fail(value) {
        if (typeof value === "boolean") {
            this.failInternal = value;
            if (value === true) {
                world.sendMessage(`@${this.source.name} ran ${this.typeName} type command - ${this.commandName}: §cerror while executing command`);
                throw "§cerror while executing command§f";
            }
        }
    }
}

export class ChatCommand {
    constructor(type, name, internal, argumentOptions = new ChatCommandArguments()) {
        if (!(type instanceof ChatCommandType)) throw new Error("typeはChatCommandTypeである必要があります");
        if (typeof name !== "string") throw new Error("nameは文字列である必要があります");
        if (typeof internal !== "function") throw new Error("internalは関数である必要があります");
        if (argumentOptions !== undefined && typeof argumentOptions !== "object") throw new Error("argumentOptionsはオブジェクトである必要があります");
        this.name = name;
        this.run = internal;
        this.arguments = argumentOptions;
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
