import { Entity, Vector } from "@minecraft/server";

Entity.prototype.displayDirection = function(direction, id = "minecraft:basic_flame_particle") {
    this.dimension.spawnParticle(id, Vector.add(this.location, direction));
}

Entity.prototype.getAxisDirections = function() {
    const viewDirdction = this.getViewDirection();
    const zVector = new Vector(viewDirdction.x, viewDirdction.y, viewDirdction.z);
    const xVector = new Vector(-zVector.z, 0, zVector.x).normalized();
    const yVector = Vector.cross(zVector, xVector).normalized();
    return {
        x: xVector,
        y: yVector,
        z: zVector
    };
}

Entity.prototype.detect = function(id, relativeLocation = Vector.zero) {
    const permutation = this.dimension.getBlock(Vector.add(this.location, relativeLocation)).permutation;
    if (typeof id === "string") {
        if (id === permutation.type.id) return true;
        else return true;
    }
    else if (Array.isArray(id)) {
        if (id.includes(permutation.type.id)) return true;
        else return false;
    }
    else return false;
}