/**
 * ダブルクォーテーションやエスケープ、2連続以上のスペースなどを考慮した文字列分割を行います。
 * @param {string} string 分割される文字列。
 * @param {string} separator 区切り文字。1文字である必要があります。
 * @param {string} quote クォーテーションの役割を果たす文字。
 * @returns {string[]}
 * @beta この関数は不完全です。
 */
function advancedSplit(string, separator, quote) {
    const result = [];
    let current = "";
    let insideQuotes = false;
    let insideBraces = false;
    let insideList = false;

    if (separator.length !== 1) throw new Error("separator's charactor counts must be 1, but "+String(separator.length));
    if (quote.length !== 1) throw new Error("quote's charactor counts must be 1, but "+String(quote.length));

    /**
     * @param {number} nowIndex 
     * @returns {boolean}
     */
    function existSeparatorInFuture(nowIndex) {
        const futureString = string.slice(nowIndex + 1);

        for (let i = 0; i < futureString.length; i++) {
            const charBefore = futureString.charAt(i - 1);
            const char = futureString.charAt(i);

            if (char === quote && charBefore !== "\\") return true;
            else continue;
        }

        return false;
    }

    for (let i = 0; i < string.length; i++) {
        const charBefore = string.charAt(i - 1);
        const char = string.charAt(i);

        if (char === separator && !insideQuotes && current.length && !insideBraces && !insideList) {
            result.push(current);
            current = "";
        }
        else if (char === "{" && !insideQuotes && !insideBraces) {
            insideBraces = true;
            current += char;
        }
        else if (char === "}" && !insideQuotes && insideBraces) {
            insideBraces = false;
            current += char;
        }
        else if (char === "[" && !insideQuotes && !insideList) {
            insideList = true;
            current += char;
        }
        else if (char === "]" && !insideQuotes && insideList) {
            insideList = false;
            current += char;
        }
        else if (char === quote && charBefore !== "\\"/* && !insideBraces*/) {
            if (existSeparatorInFuture(i)) insideQuotes = !insideQuotes;
            else if (insideQuotes) {
                insideQuotes = false;
            }
        }
        else if (char !== "\\") {
            current += char;
        }

        if (current.length && i === string.length - 1) {
            result.push(current);
        }
    }

    return result.filter(string => string !== " ");
}

export class StringFunctions {
    static advancedSplit = advancedSplit;
}