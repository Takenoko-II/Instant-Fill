import { Vector } from "@minecraft/server";

function getDirectionFromTwoLocation(fromLocation, toLocation) {
    const difference = Vector.zero;
    for (const component in fromLocation) {
        difference[component] = toLocation[component] - fromLocation[component];
    }
    return getUnitVector(difference);
}

function getVectorLength(vector) {
    const instanceVector = new Vector(vector.x, vector.y, vector.z)
    return instanceVector.length();
}

function getUnitVector(vector, magnification = 1) {
    const resultVector = new Vector(0, 0, 0);
    for (const component in vector) {
        const resultComponent = vector[component] / getVectorLength(vector);
        resultVector[component] = resultComponent * magnification;
    }
    return resultVector;
}

function getRotationFromVector(vector) {
    const { x, y, z } = getUnitVector(vector);
    return {
        x: Math.atan2(x, z) * -180 / Math.PI,
        y: Math.asin(-y) * 180 / Math.PI
    };
}

function isVector3(value) {
    if (typeof value !== "object") return false;
    const propertyNames = Object.getOwnPropertyNames(value);
    if (propertyNames.every(e => ["x", "y", "z"].includes(e) && typeof value[e] === "number")) return true;
    return false;
}

export const vectorFunctions = {
    getDirectionFromTwoLocation,
    getVectorLength,
    getUnitVector,
    getRotationFromVector,
    isVector3
};
