import { world, system, Player, Entity, DimensionTypes } from "@minecraft/server";

import { numberFunctions  } from "../../@tak/extender";

function runRepeat(callbackFn, count = 1) {
    if (typeof callbackFn !== "function" || !numberFunctions.isAbsolutelyNumber(count)) return undefined;
    const results = [];
    for (let i = 0; i < count; i++) {
        const result = callbackFn({ count: i + 1, currentResults: results });
        results.push(result);
    }
    return results;
}

function runPlayers(callbackFn, options = undefined) {
    const runId = system.runInterval(() => {
        for (const player of world.getPlayers(options)) {
            callbackFn({ player: player, stop: () => { system.clearRun(runId) } });
        }
    });
}

function runEntities(callbackFn, options = undefined) {
    const dimensionTypes = DimensionTypes.getAll();
    const runId = system.runInterval(() => {
        for (const dimension of dimensionTypes) {
            for (const entity of world.getDimension(dimension.typeId).getEntities(options)) {
                callbackFn({ entity: entity, stop: () => { system.clearRun(runId) } });
            }
        }
    });
}

export const higherOrderFunctions = { runRepeat, runPlayers, runEntities };
