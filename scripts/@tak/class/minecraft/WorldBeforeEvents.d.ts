import * as Minecraft from "@minecraft/server";

declare module "@minecraft/server" {
    interface WorldBeforeEvents {
        readonly scoreboardValueChange: ScoreboardValueChangeBeforeEventSignal;
    }
    interface ScoreboardValueChangeBeforeEvent {
        readonly paticipant: Minecraft.ScoreboardIdentity;
        readonly objective: ScoreboardObjective;
        readonly beforeValue: number;
        readonly afterValue: number;
        cancel: boolean;
    }
    interface ScoreboardValueChangeBeforeEventSignal {
        subscribe(callbackFn: (arg: ScoreboardValueChangeBeforeEvent) => void): (arg: ScoreboardValueChangeBeforeEvent) => void;
        unsubscribe(callbackFn: (arg: ScoreboardValueChangeBeforeEvent) => void): (arg: ScoreboardValueChangeBeforeEvent) => void;
    }
    interface PlayerPlaceBlockBeforeEvent {
        getPlacedLocation(): Vector3;
    }
}
