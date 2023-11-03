import { world, system, WorldBeforeEvents, PlayerPlaceBlockBeforeEvent, Vector, PlayerInteractWithBlockBeforeEvent } from "@minecraft/server";

import { ScoreboardValueChangeAfterEvent, ScoreboardValueChangeAfterEventSignal } from "./WorldAfterEvents.js";

export class ScoreboardValueChangeBeforeEvent extends ScoreboardValueChangeAfterEvent {
    constructor(paticipant, objective, values) {
        super(paticipant, objective, values);
    }
    #cancelToggle = false;
    get cancel() {
        return this.#cancelToggle;
    }
    set cancel(bool) {
        if (typeof bool !== "boolean") return;
        this.#cancelToggle = bool;
        ScoreboardValueChangeBeforeEvent.scoreboardLog[this.objective.id][this.paticipant.id].detectable = false;
        this.objective.setScore(this.paticipant, this.beforeValue);
    }
    static runningFunctions = [];
    static scoreboardLog = {};
}

export class ScoreboardValueChangeBeforeEventSignal extends ScoreboardValueChangeAfterEventSignal {
    subscribe(callbackFn) {
        const runId = system.runInterval(() => {
            for (const objective of world.scoreboard.getObjectives()) {
                if (ScoreboardValueChangeBeforeEvent.scoreboardLog[objective.id] === undefined) {
                    ScoreboardValueChangeBeforeEvent.scoreboardLog[objective.id] = {};
                }
                for (const paticipant of objective.getParticipants()) {
                    const value = objective.getScore(paticipant);
                    if (ScoreboardValueChangeBeforeEvent.scoreboardLog[objective.id][paticipant.id] === undefined) {
                        ScoreboardValueChangeBeforeEvent.scoreboardLog[objective.id][paticipant.id] = { detectable: true, value: value ?? null};
                    }
                    else if (ScoreboardValueChangeBeforeEvent.scoreboardLog[objective.id][paticipant.id].value !== value && ScoreboardValueChangeBeforeEvent.scoreboardLog[objective.id][paticipant.id].detectable === true) {
                        callbackFn(new ScoreboardValueChangeBeforeEvent(
                            paticipant, objective, { before: ScoreboardValueChangeBeforeEvent.scoreboardLog[objective.id][paticipant.id].value, after: value }
                        ));
                        ScoreboardValueChangeBeforeEvent.scoreboardLog[objective.id][paticipant.id].value = value ?? null;
                    }
                    else {
                        ScoreboardValueChangeBeforeEvent.scoreboardLog[objective.id][paticipant.id].value = value ?? null;
                        ScoreboardValueChangeBeforeEvent.scoreboardLog[objective.id][paticipant.id].detectable = true;
                    }
                }
            }
        });
        ScoreboardValueChangeBeforeEvent.runningFunctions.push({ id: runId, function: callbackFn });
        return callbackFn;
    }

    unsubscribe(callbackFn) {
        if (ScoreboardValueChangeBeforeEvent.runningFunctions.map(run => run.function).includes(callbackFn)) {
            const runId = ScoreboardValueChangeBeforeEvent.runningFunctions.find(run => run.function === callbackFn).id;
            system.clearRun(runId);
        }
        return callbackFn;
    }
}

const invertedFaces = {
    North: { x: 0, y: 0, z: -1 },
    South: { x: 0, y: 0, z: 1 },
    East: { x: 1, y: 0, z: 0 },
    West: { x: -1, y: 0, z: 0 },
    Up: { x: 0, y: 1, z: 0 },
    Down: { x: 0, y: -1, z: 0 }
};

PlayerPlaceBlockBeforeEvent.prototype.getPlacedLocation = function() {
    return Vector.add(this.block.location, invertedFaces[this.face]);
}

PlayerInteractWithBlockBeforeEvent.prototype.getPlacedLocation = function() {
    return Vector.add(this.block.location, invertedFaces[this.face]);
}

WorldBeforeEvents.prototype.scoreboardValueChange = new ScoreboardValueChangeBeforeEventSignal();
