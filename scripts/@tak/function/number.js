function toNumber(string) {
    if (typeof string === "string" && !Number.isNaN(Number(string)) && string !== "" && !string.includes(" ") && string !== null) return Number(string);
}

function isAbsolutelyNumber(value) {
    if (typeof value === "number" && !Number.isNaN(value)) return true;
    return false;
}

export const numberFunctions = {
    toNumber,
    isAbsolutelyNumber
};
