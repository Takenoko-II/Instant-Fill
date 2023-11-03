import * as Minecraft from "@minecraft/server";

declare module "@minecraft/server" {
    interface WorldAfterEvents {
        readonly playerStartSprint: PlayerStartSprintAfterEventSignal;
        readonly playerStopSprint: PlayerStopSprintAfterEventSignal;
        readonly playerStartSneak: PlayerStartSneakAfterEventSignal;
        readonly playerStopSneak: PlayerStopSneakAfterEventSignal;
        readonly playerStartPressJump: PlayerStartPressJumpAfterEventSignal;
        readonly playerStartAction: PlayerStartActionAfterEventSignal;
        readonly playerStopAction: PlayerStopActionAfterEventSignal;
        readonly tick: TickAfterEventSignal;
        readonly scoreboardValueChange: ScoreboardValueChangeAfterEventSignal;
        readonly itemUsing: ItemUsingAfterEventSignal;
    }
    interface PlayerStartSprintAfterEventSignal {
        subscribe(callbackFn: (arg: PlayerStartSprintAfterEvent) => void): (arg: PlayerStartSprintAfterEvent) => void;
        unsubscribe(callbackFn: (arg: PlayerStartSprintAfterEvent) => void): (arg: PlayerStartSprintAfterEvent) => void;
    }
    interface PlayerStartSprintAfterEvent {
        readonly player: Minecraft.Player;
    }
    interface PlayerStopSprintAfterEventSignal {
        subscribe(callbackFn: (arg: PlayerStopSprintAfterEvent) => void): (arg: PlayerStopSprintAfterEvent) => void;
        unsubscribe(callbackFn: (arg: PlayerStopSprintAfterEvent) => void): (arg: PlayerStopSprintAfterEvent) => void;
    }
    interface PlayerStopSprintAfterEvent {
        readonly player: Minecraft.Player;
    }
    interface PlayerStartSneakAfterEventSignal {
        subscribe(callbackFn: (arg: PlayerStartSneakAfterEvent) => void): (arg: PlayerStartSneakAfterEvent) => void;
        unsubscribe(callbackFn: (arg: PlayerStartSneakAfterEvent) => void): (arg: PlayerStartSneakAfterEvent) => void;
    }
    interface PlayerStartSneakAfterEvent {
        readonly player: Minecraft.Player;
    }
    interface PlayerStopSneakAfterEventSignal {
        subscribe(callbackFn: (arg: PlayerStopSneakAfterEvent) => void): (arg: PlayerStopSneakAfterEvent) => void;
        unsubscribe(callbackFn: (arg: PlayerStopSneakAfterEvent) => void): (arg: PlayerStopSneakAfterEvent) => void;
    }
    interface PlayerStopSneakAfterEvent {
        readonly player: Minecraft.Player;
    }
    interface PlayerStartPressJumpAfterEventSignal {
        subscribe(callbackFn: (arg: PlayerStartPressJumpAfterEvent) => void): (arg: PlayerStartPressJumpAfterEvent) => void;
        unsubscribe(callbackFn: (arg: PlayerStartPressJumpAfterEvent) => void): (arg: PlayerStartPressJumpAfterEvent) => void;
    }
    interface PlayerStartPressJumpAfterEvent {
        readonly player: Minecraft.Player;
    }
    interface PlayerStartActionAfterEventSignal {
        subscribe(callbackFn: (arg: PlayerStartActionAfterEvent) => void): (arg: PlayerStartActionAfterEvent) => void;
        unsubscribe(callbackFn: (arg: PlayerStartActionAfterEvent) => void): (arg: PlayerStartActionAfterEvent) => void;
    }
    interface PlayerStartActionAfterEvent {
        readonly player: Minecraft.Player;
        readonly actionType: string;
    }
    interface PlayerStopActionAfterEventSignal {
        subscribe(callbackFn: (arg: PlayerStopActionAfterEvent) => void): (arg: PlayerStopActionAfterEvent) => void;
        unsubscribe(callbackFn: (arg: PlayerStopActionAfterEvent) => void): (arg: PlayerStopActionAfterEvent) => void;
    }
    interface PlayerStopActionAfterEvent {
        readonly player: Minecraft.Player;
        readonly actionType: string;
    }
    interface TickAfterEvent {
        readonly currentTick: number;
        readonly deltaTime: number;
    }
    interface TickAfterEventSignal {
        subscribe(callbackFn: (arg: TickAfterEvent) => void): (arg: TickAfterEvent) => void;
        unsubscribe(callbackFn: (arg: TickAfterEvent) => void): (arg: TickAfterEvent) => void;
    }
    interface ScoreboardValueChangeAfterEvent {
        readonly paticipant: Minecraft.ScoreboardIdentity;
        readonly objective: ScoreboardObjective;
        readonly beforeValue: number;
        readonly afterValue: number;
    }
    interface ScoreboardValueChangeAfterEventSignal {
        subscribe(callbackFn: (arg: ScoreboardValueChangeAfterEvent) => void): (arg: ScoreboardValueChangeAfterEvent) => void;
        unsubscribe(callbackFn: (arg: ScoreboardValueChangeAfterEvent) => void): (arg: ScoreboardValueChangeAfterEvent) => void;
    }
    interface ItemUsingAfterEvent {
        readonly source: Player;
        readonly itemStack: ItemStack;
        readonly useDuration: number;
    }
    interface ItemUsingAfterEventSignal {
        subscribe(callbackFn: (arg: ItemUsingAfterEvent) => void): (arg: ItemUsingAfterEvent) => void;
        unsubscribe(callbackFn: (arg: ItemUsingAfterEvent) => void): (arg: ItemUsingAfterEvent) => void;
    }
}
