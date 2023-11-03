import { world, system, WorldAfterEvents, WorldBeforeEvents, System } from "@minecraft/server";

export class PlayerStartSprintAfterEvent {
    constructor(player) {
        this.player = player;
    }
    static runningFunctions = [];
}

export class PlayerStartSprintAfterEventSignal {
    subscribe(callbackFn) {
        const runId = system.runInterval(() => {
            for (const player of world.getPlayers()) {
                if (player.sprintTick === undefined) player.sprintTick = 2;
                else player.sprintTick = player.toEntityClass().isSprinting ? player.sprintTick + 1 : 0;
                if (player.sprintTick === 1) callbackFn(new PlayerStartSprintAfterEvent(player));
            }
        });
        PlayerStartSprintAfterEvent.runningFunctions.push({ id: runId, function: callbackFn });
        return callbackFn;
    }

    unsubscribe(callbackFn) {
        if (PlayerStartSprintAfterEvent.runningFunctions.map(run => run.function).includes(callbackFn)) {
            const runId = PlayerStartSprintAfterEvent.runningFunctions.find(run => run.function === callbackFn).id;
            system.clearRun(runId);
        }
        return callbackFn;
    }
}

export class PlayerStopSprintAfterEvent {
    constructor(player) {
        this.player = player;
    }
    static runningFunctions = [];
}

export class PlayerStopSprintAfterEventSignal {
    subscribe(callbackFn) {
        const runId = system.runInterval(() => {
            for (const player of world.getPlayers()) {
                if (player.noSprintTick === undefined) player.noSprintTick = 2;
                else player.noSprintTick = !player.toEntityClass().isSprinting ? player.noSprintTick + 1 : 0;
                if (player.noSprintTick === 1) callbackFn(new PlayerStopSprintAfterEvent(player));
            }
        });
        PlayerStopSprintAfterEvent.runningFunctions.push({ id: runId, function: callbackFn });
        return callbackFn;
    }

    unsubscribe(callbackFn) {
        if (PlayerStopSprintAfterEvent.runningFunctions.map(run => run.function).includes(callbackFn)) {
            const runId = PlayerStopSprintAfterEvent.runningFunctions.find(run => run.function === callbackFn).id;
            system.clearRun(runId);
        }
        return callbackFn;
    }
}

export class PlayerStartSneakAfterEvent {
    constructor(player) {
        this.player = player;
    }
    static runningFunctions = [];
}

export class PlayerStartSneakAfterEventSignal {
    subscribe(callbackFn) {
        const runId = system.runInterval(() => {
            for (const player of world.getPlayers()) {
                if (player.sneakTick === undefined) player.sneakTick = 2;
                else player.sneakTick = player.isSneaking ? player.sneakTick + 1 : 0;
                if (player.sneakTick === 1) callbackFn(new PlayerStartSneakAfterEvent(player));
            }
        });
        PlayerStartSneakAfterEvent.runningFunctions.push({ id: runId, function: callbackFn });
        return callbackFn;
    }

    unsubscribe(callbackFn) {
        if (PlayerStartSneakAfterEvent.runningFunctions.map(run => run.function).includes(callbackFn)) {
            const runId = PlayerStartSneakAfterEvent.runningFunctions.find(run => run.function === callbackFn).id;
            system.clearRun(runId);
        }
        return callbackFn;
    }
}

export class PlayerStopSneakAfterEvent {
    constructor(player) {
        this.player = player;
    }
    static runningFunctions = [];
}

export class PlayerStopSneakAfterEventSignal {
    subscribe(callbackFn) {
        const runId = system.runInterval(() => {
            for (const player of world.getPlayers()) {
                if (player.noSneakTick === undefined) player.noSneakTick = 2;
                else player.noSneakTick = (player.isSneaking === false) ? player.noSneakTick + 1 : 0;
                if (player.noSneakTick === 1) callbackFn(new PlayerStopSneakAfterEvent(player));
            }
        });
        PlayerStopSneakAfterEvent.runningFunctions.push({ id: runId, function: callbackFn });
        return callbackFn;
    }

    unsubscribe(callbackFn) {
        if (PlayerStopSneakAfterEvent.runningFunctions.map(run => run.function).includes(callbackFn)) {
            const runId = PlayerStopSneakAfterEvent.runningFunctions.find(run => run.function === callbackFn).id;
            system.clearRun(runId);
        }
        return callbackFn;
    }
}

export class PlayerStartPressJumpAfterEvent {
    constructor(player) {
        this.player = player;
    }
    static runningFunctions = [];
}

export class PlayerStartPressJumpAfterEventSignal {
    subscribe(callbackFn) {
        const runId = system.runInterval(() => {
            for (const player of world.getPlayers()) {
                if (player.jumpTick === undefined) player.jumpTick = 2;
                else player.jumpTick = player.isJumping ? player.jumpTick + 1 : 0;
                if (player.jumpTick === 1) callbackFn(new PlayerStartPressJumpAfterEvent(player));
            }
        });
        PlayerStartPressJumpAfterEvent.runningFunctions.push({ id: runId, function: callbackFn });
        return callbackFn;
    }

    unsubscribe(callbackFn) {
        if (PlayerStartPressJumpAfterEvent.runningFunctions.map(run => run.function).includes(callbackFn)) {
            const runId = PlayerStartPressJumpAfterEvent.runningFunctions.find(run => run.function === callbackFn).id;
            system.clearRun(runId);
        }
        return callbackFn;
    }
}

export class PlayerDetectableActions {
    constructor(type = "sneak") {
        const value = PlayerDetectableActions.list.find(object => object.name === type);
        this.name = value.name;
        this.property = value.property;
    }
    static list = [
        { name: "sneak", property: "isSneaking" },
        { name: "sprint", property: "isSprinting" },
        { name: "jump", property: "isJumping" },
        { name: "sleep", property: "isSleeping"},
        { name: "climb", property: "isClimbing" },
        { name: "swim", property: "isSwimming" },
        { name: "fall", property: "isFalling" },
        { name: "onGround", property: "isOnGround" },
        { name: "glide", property: "isGliding" },
        { name: "fly", property: "isFlying" },
        { name: "inWater", property: "isInWater" },
        { name: "emote", property: "isEmoting" }
    ];
}

export class PlayerStartActionAfterEvent {
    constructor(player, actionType) {
        this.player = player;
        this.actionType = actionType;
    }
    static actionTypes = PlayerDetectableActions.list.map(action => action.name);
    static runningFunctions = [];
}

export class PlayerStartActionAfterEventSignal {
    subscribe(callbackFn) {
        const runId = system.runInterval(() => {
            for (const player of world.getPlayers()) {
                function watchAction(action = {name:"",property:""}) {
                    const condition = (player[action.property] === undefined) ? player.toEntityClass()[action.property] : player[action.property];
                    if (player[action.name] === undefined) player[action.name] = 2;
                    else player[action.name] = condition ? player[action.name] + 1 : 0;
                    if (player[action.name] === 1) return action.name;
                    else return undefined;
                }

                PlayerDetectableActions.list.forEach(action => {
                    const watchResult = watchAction(action);
                    if (watchResult) callbackFn(new PlayerStartActionAfterEvent(player, watchResult));
                });
            }
            PlayerStartActionAfterEvent.runningFunctions.push({ id: runId, function: callbackFn });
        });
        return callbackFn;
    }

    unsubscribe(callbackFn) {
        if (PlayerStartActionAfterEvent.runningFunctions.map(run => run.function).includes(callbackFn)) {
            const runId = PlayerStartActionAfterEvent.runningFunctions.find(run => run.function === callbackFn).id;
            system.clearRun(runId);
        }
        return callbackFn;
    }
}

export class PlayerStopActionAfterEvent {
    constructor(player, actionType) {
        this.player = player;
        this.actionType = actionType;
    }
    static actionTypes = PlayerDetectableActions.list.map(action => action.name);
    static runningFunctions = [];
}

export class PlayerStopActionAfterEventSignal {
    subscribe(callbackFn) {
        const runId = system.runInterval(() => {
            for (const player of world.getPlayers()) {
                function watchAction(action = { name:"", property:"" }) {
                    const condition = (player[action.property] === undefined) ? player.toEntityClass()[action.property] : player[action.property];
                    if (player[action.name] === undefined) player[action.name] = 2;
                    else player[action.name] = !condition ? player[action.name] + 1 : 0;
                    if (player[action.name] === 1) return action.name;
                    else return undefined;
                }

                PlayerDetectableActions.list.forEach(action => {
                    const watchResult = watchAction(action);
                    if (watchResult) callbackFn(new PlayerStopActionAfterEvent(player, watchResult));
                });
            }
            PlayerStopActionAfterEvent.runningFunctions.push({ id: runId, function: callbackFn });
        });
        return callbackFn;
    }

    unsubscribe(callbackFn) {
        if (PlayerStopActionAfterEvent.runningFunctions.map(run => run.function).includes(callbackFn)) {
            const runId = PlayerStopActionAfterEvent.runningFunctions.find(run => run.function === callbackFn).id;
            system.clearRun(runId);
        }
        return callbackFn;
    }
}

export class TickAfterEvent {
    constructor(tick, lastUnix) {
        this.currentTick = tick;
        this.deltaTime = Date.now() - lastUnix;
    }
    static runningFunctions = [];
}

const unixTimes = [Date.now()];

export class TickAfterEventSignal {
    subscribe(callbackFn) {
        let tick = 0;
        const runId = system.runInterval(() => {
            tick++;
            callbackFn(new TickAfterEvent(system.currentTick, unixTimes.slice(-1)[0]));
            unixTimes.push(Date.now());
            if (tick > 2) unixTimes.shift();
        });
        TickAfterEvent.runningFunctions.push({ id: runId, function: callbackFn });
        return callbackFn;
    }

    unsubscribe(callbackFn) {
        if (TickAfterEvent.runningFunctions.map(run => run.function).includes(callbackFn)) {
            const runId = TickAfterEvent.runningFunctions.find(run => run.function === callbackFn).id;
            system.clearRun(runId);
        }
        return callbackFn;
    }
}

export class ScoreboardValueChangeAfterEvent {
    constructor(paticipant, objective, values) {
        this.paticipant = paticipant;
        this.objective = objective;
        this.beforeValue = values.before;
        this.afterValue = values.after;
    }
    static runningFunctions = [];
    static scoreboardLog = {};
}

export class ScoreboardValueChangeAfterEventSignal {
    subscribe(callbackFn) {
        const runId = system.runInterval(() => {
            for (const objective of world.scoreboard.getObjectives()) {
                if (ScoreboardValueChangeAfterEvent.scoreboardLog[objective.id] === undefined) {
                    ScoreboardValueChangeAfterEvent.scoreboardLog[objective.id] = {};
                }
                for (const paticipant of objective.getParticipants()) {
                    const value = objective.getScore(paticipant);
                    if (ScoreboardValueChangeAfterEvent.scoreboardLog[objective.id][paticipant.id] === undefined) {
                        ScoreboardValueChangeAfterEvent.scoreboardLog[objective.id][paticipant.id] = { detectable: true, value: value ?? null};
                    }
                    else if (ScoreboardValueChangeAfterEvent.scoreboardLog[objective.id][paticipant.id].value !== value && ScoreboardValueChangeAfterEvent.scoreboardLog[objective.id][paticipant.id].detectable === true) {
                        callbackFn(new ScoreboardValueChangeAfterEvent(
                            paticipant, objective, { before: ScoreboardValueChangeAfterEvent.scoreboardLog[objective.id][paticipant.id].value, after: value }
                        ));
                        ScoreboardValueChangeAfterEvent.scoreboardLog[objective.id][paticipant.id].value = value ?? null;
                    }
                    else {
                        ScoreboardValueChangeAfterEvent.scoreboardLog[objective.id][paticipant.id].value = value ?? null;
                        ScoreboardValueChangeAfterEvent.scoreboardLog[objective.id][paticipant.id].detectable = true;
                    }
                }
            }
        });
        ScoreboardValueChangeAfterEvent.runningFunctions.push({ id: runId, function: callbackFn });
        return callbackFn;
    }

    unsubscribe(callbackFn) {
        if (ScoreboardValueChangeAfterEvent.runningFunctions.map(run => run.function).includes(callbackFn)) {
            const runId = ScoreboardValueChangeAfterEvent.runningFunctions.find(run => run.function === callbackFn).id;
            system.clearRun(runId);
        }
        return callbackFn;
    }
}

export class ItemUsingAfterEvent {
    constructor(source, itemStack, useDuration) {
        this.source = source;
        this.itemStack = itemStack;
        this.useDuration = useDuration;
    }
    static runningFunctions = [];
    static map = new Map();
}

world.afterEvents.itemStartUse.subscribe(({ source, itemStack }) => {
    ItemUsingAfterEvent.map.set(source, { itemStack, useDuration: 1 });
});

world.afterEvents.itemStopUse.subscribe(({ source }) => {
    ItemUsingAfterEvent.map.delete(source);
});

export class ItemUsingAfterEventSignal {
    subscribe(callbackFn) {
        const runId = system.runInterval(() => {
            world.getAllPlayers().forEach(player => {
                const data = ItemUsingAfterEvent.map.get(player);
                if (!data?.itemStack) return;
                callbackFn(new ItemUsingAfterEvent(player, data.itemStack, data.useDuration));
                ItemUsingAfterEvent.map.set(player, { itemStack: data.itemStack, useDuration: data.useDuration + 1 });
            });
        });
        ItemUsingAfterEvent.runningFunctions.push({ id: runId, function: callbackFn });
        return callbackFn;
    }
    unsubscribe(callbackFn) {
        if (ItemUsingAfterEvent.runningFunctions.map(run => run.function).includes(callbackFn)) {
            const runId = ItemUsingAfterEvent.runningFunctions.find(run => run.function === callbackFn).id;
            system.clearRun(runId);
        }
        return callbackFn;
    }
}

WorldAfterEvents.prototype.playerStartSprint = new PlayerStartSprintAfterEventSignal();
WorldAfterEvents.prototype.playerStopSprint = new PlayerStopSprintAfterEventSignal();
WorldAfterEvents.prototype.playerStartSneak = new PlayerStartSneakAfterEventSignal();
WorldAfterEvents.prototype.playerStopSneak = new PlayerStopSneakAfterEventSignal();
WorldAfterEvents.prototype.playerStartPressJump = new PlayerStartPressJumpAfterEventSignal();
WorldAfterEvents.prototype.playerStartAction = new PlayerStartActionAfterEventSignal();
WorldAfterEvents.prototype.playerStopAction = new PlayerStopActionAfterEventSignal();
WorldAfterEvents.prototype.tick = new TickAfterEventSignal();
WorldAfterEvents.prototype.scoreboardValueChange = new ScoreboardValueChangeAfterEventSignal();
WorldAfterEvents.prototype.itemUsing = new ItemUsingAfterEventSignal();
