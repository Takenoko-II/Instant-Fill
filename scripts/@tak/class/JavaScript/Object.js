import { world } from "@minecraft/server";

String.prototype.color = function() {
    return "§b" + this
    .replace(/const /g, "§9const§1 ")
    .replace(/function /g, "§9function§g ")
    .replace(/(new|instanceof|class) /g, match => "§9"+match+" §q")
    .replace(/(let|var) /g, match => "§9"+match+" §b")
    .replace(/(if|else|return|break|switch|continue|throw|for) /g, match => "§d"+match+" §b")
    .replace(/(this|constructor)/g, match => "§9"+match+"§b")
    .replace(/(static|get|set) /g, match => "§9"+match+" §b")
    .replace(/=>/g, "§9=>§b")
    .replace(/=(?!(>))/g, "§f=§b")
    .replace(/[\+\-\*\/]/g, match => "§f"+match+"§b")
    .replace(/(?!(\\))".*(?!(\\))"/g, match => "§6"+match+"§b")
    .replace(/(?<!§)[0-9]/g, match => "§a"+match+"§b")
    .replace(/[\<\?\:\;\!\[\]\{\}\(\)\.]/g, match => "§f"+match+"§b")
    .replace(/(?![^=])\>/g, "§f>§b")
    .replace(/(String|Number|Boolean|Array|Object|Function)/g, match => "§q"+match+"§b");
}

function objectStringify(object, indentation = 1) {
    let indentationString = "";
    for (let i = 0; i < indentation; i++) {
        indentationString += "    ";
    }
    let result = "{";
    const propertyNames = Object.getOwnPropertyNames(object);
    const colorData = {
        number: "a",
        bigint: "a",
        string: "6",
        boolean: "9",
        undefined: "9",
        function: "e",
        object: "9"
    };
    for (const propertyName of propertyNames) {
        if (String(object[propertyName]) === "[object Object]" && typeof object[propertyName] !== "string") {
            result += `\n${indentationString}${propertyName}: ${objectStringify(object[propertyName], indentation + 1)}`;
        }
        else {
            result += `\n${indentationString}${propertyName}: §${colorData[typeof object[propertyName]]}`;
            if (typeof object[propertyName] === "function" && String(object[propertyName]).endsWith("}")) {
                let functionString = String(object[propertyName]).color();
                result += functionString;
            }
            else {
                switch (typeof object[propertyName]) {
                    case "string":
                        result += `"${object[propertyName]}"`
                        break;
                    case "function":
                        result += String(object[propertyName]).color();
                        break;
                    default:
                        result += String(object[propertyName]);
                        break;
                }
            }
        }
        result += "§r";
        if (propertyNames.length - 1 !== propertyNames.findIndex(val => val === propertyName)) result += ",";
    }
    return result += `\n${indentationString.slice(4)}}`;
}

Object.prototype.cons = function() {
    switch (typeof this) {
        case "object":
            if (Array.isArray(this)) console.warn(`§s${this}`);
            else console.warn(objectStringify(this));
            break;
        case "function":
            console.warn(String(this).color());
            break;
        case "string":
            console.warn(`§6"${this}"`);
            break;
        case "number":
        case "bigint":
            console.warn(`§a${this}`);
            break;
        case "boolean":
        case "undefined":
            console.warn(`§9${this}`);
            break;
        default:
            console.warn(this);
            break;
    }
}

Object.prototype.chat = function() {
    switch (typeof this) {
        case "object":
            if (Array.isArray(this)) world.sendMessage(`§s${this}`);
            else world.sendMessage(objectStringify(this));
            break;
        case "function":
            world.sendMessage(String(this).color());
            break;
        case "string":
            world.sendMessage(`§6"${this}"`);
            break;
        case "number":
        case "bigint":
            world.sendMessage(`§a${this}`);
            break;
        case "boolean":
        case "undefined":
            world.sendMessage(`§9${this}`);
            break;
        default:
            world.sendMessage(this);
            break;
    }
}

Object.prototype.shallowCopy = function() {
    return Object.assign(this, {});
}
