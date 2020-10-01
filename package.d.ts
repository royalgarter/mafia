//declare module "mafia" {

    import {EventEmitter} from 'events';

    export type callback<K, V> = (val: V, key: K) => any

    export class Unit<K, V> extends Map {
        public map(fn: callback<K, V>) : Array<V>
        public edit(key: K, val: V) : void
        public find(fn: callback<K, V>) : V
        public findAll(fn: callback<K, V>) : Unit<K, V>
        public random() : V
        public transfer(unit: Unit<K, V>) : Unit<K, V>
        public get(key: K) : V
    }

    export class Timer {
        public elapsed: Number
        public game: Game
        public fn: () => void
        public paused: Boolean
        public start: Number
        public loop: Timeout
        public seconds: Number
        public minutes: Number
        public timeleft: {seconds: Number, minutes: Number}
        public reset(): void
        public clearLoop(): void
    }

    export class Role {
        public name: string
        public side: string
        public alignment: string
        public priority?: Number
        public unique: boolean
        public amount?: Number
        public blocked: boolean
        public action: (player: Player, target: Player, type: any) => any
        public sepa: string
        public tags: Unit<any, any>
   
        public setName(name: string) : Role
        public setSide(side: string) : Role
        public setAlignment(alignment: string) : Role
        public isUnique(bool: Boolean) : Role
        public setAction(action: (player: Player, target: Player, type: any) => any) : Role
        public isBlocked(bool: Boolean) : Role
        public setAmount(amount: Number) : Role
        public setPriority(priority: Number): Role
        public addTag(key: any, value: any) : Role
     }

     export class Player {
         public name: string
         public role: Role
         public dead: boolean
         public votes: Number
         public voters: Unit<string, Player>
         public voted?: Player
         public selectedAction: NightAction
         public roleblocked: boolean
         public facKiller: boolean
         public game: Game
         public votePower: Number
         public tags: Unit<any, any>

         public clear() : void
         public kills(player: Player) : void
         public kill() : void
         public votesFor(votee: string|Player|"nolynch") : void
         public unvote() : void
         public lynch(way: string) : void
         public revive(reviver: string|Player|null) : void
         public remove() : void
         public voteNoLynch() : void
         public unvoteNoLynch() : void
         public setAction(target: Player, type: any, facKiller: boolean) : void
     }

     export class Phase {
         public name: string
         public duration: Number
         public next: string
         public count: Number
         public clean: boolean
     }

     export class Side {
         public name: string
         public players: Unit<string, Player>
         public roles: Unit<string, Role>
         public factionKill: FactionalKill

         public setFactionalKill(player: Player, target: Player) : void
     }

     export class Nolynch {
         public voters: Unit<string, Player>
         public votes: Number

         public clear() : void
     }

     export class RolelistFiller {
         public roles: Unit<string, Role>
         public roleNames: Array<string>
     }

     export class FactionalKill {
         public killer: Player
         public target: Player
     }

     export class NightAction {
         public target: Player
         public type: any

         public setTarget(target: Player) : void
         public setType(type: any) : void
         public clear() : void
     }

     export class CustomEvent {
         public id: string
         public checker: (phase: Phase) => boolean
         public executor: (phase: Phase) => any
         public active: boolean
         public once: boolean

         public setActive(bool: boolean) : CustomEvent
         public setOnce(bool: boolean) : CustomEvent
     }

     export class ActionManager {
        public playerlist: Object
        
        public refresh() : void
        public executeV1() : void
        public executeV2(list: PriorityList) : void 
     }

     export class PriorityList {
         public constructor(preset: Object);
     }

     export class MafiaError {
         public constructor(name: string, desc: string, location: string);
     }

     export class RoleCollection extends Unit<string, Role> {
         public holder: Unit<string, Role>
         public rules: Function
         
         public set(name: string, side: string, alignment: string, unique: boolean, blocked: boolean, amount: Number, priority: Number, action: (player: Player, target: Player, type: any) => any) : RoleCollection
         public addPreset(role: Role) : RoleCollection
         public build(role: Object) : RoleCollection
         public setRules(rules: (role: Role, side: string, alignment: string) => boolean) : RoleCollection
         public getByName(name: String) : String|false
         public any() : Role
         public fromSide(side: string) : Role
         public fromAlign(side: string, alignment: string) : Role
         public fill(side: string, alignment: string) : Role
         public fillRolelist(rolelist: Array<"Any"|"*RoleName*"|"Random *Side*"|"*Side* *Alignment*">) : RolelistFiller
     }

     export class PhaseCollection extends Unit<string, Phase> {
         public first: Phase
         public current: Phase
         
         public set(name: string, duration: Number, next: string, clean: boolean) : PhaseCollection
         public setFirst(name: string) : PhaseCollection
         public move(type: "first"|"cycle") : void
     }

     export class SideCollection extends Unit<string, Side> {
         public findPlayer(name: string) : Player|false
         public removePlayer(name: string) : void
         public addPlayer(player: Player) : void
         public sizeOf(side: string) : Number
         public isOutdated() : Boolean
     }

     export class Listeners {
         public win: (game: Game) => string|false
         public autoScaleMaj: boolean
         public majority: Number|null
         public plurality: boolean|null
         public customEvents: Array<CustomEvent>

         public setWinListener(win: (game: Game) => string|false): Listeners
         public setMajority(maj: Number): Listeners
         public setPlurality(plur: boolean): Listeners
         public setAutoScale(bool: boolean): Listeners
         public addEvent(id: string, checker: (phase: Phase) => boolean, executor: (phase: Phase) => any): CustomEvent
         public removeEvent(id: string) : void
         public getEvent(id: string) : CustomEvent
     }


    export class Game extends EventEmitter {
        public roles: RoleCollection
        public players: Unit<string, Player>
        public alive: Unit<string, Player>
        public dead: Unit<string, Player>
        public rolelist: Array<string>
        public playercount: Number
        public phases: PhaseCollection
        public nolynch: Nolynch
        public events: Listeners
        public actionManager: ActionManager
        public timer: Timer
        public sides?: SideCollection
        public paused: Boolean
        public started: Boolean
        public tags: Unit<any, any>

        public addPlayer(name: string) : Player 
        public resetStat(fn: (player: Player) => any) : void
        public start(filler: RolelistFiller) : void 
        public pause() : void
        public resume() : void
        public copy() : Game
        public clear() : void
        public setMaj() : void
        public goToPhase(phase: string, clear: boolean) : void
        public skipPhase() : void

        public on(event: "begin", listener: () => void)
        public on(event: "AddRole", listener: (player: Player, role: Role) => void)
        public on(event: "RolesAdded", listener: () => void)
        public on(event: "win", listener: (side: Side) => void)
        public on(event: "kill", listener: (player: Player, killer: Player|null) => void)
        public on(event: "revive", listener: (player: Player, reviver: Player|null) => void)
        public on(event: "vote", listener: (voter: Player, votee: Player|"nolynch") => void)
        public on(event: "unvote", listener: (voter: Player, votee: Player|"nolynch") => void)
        public on(event: "lynch", listener: (player: Player, way: string) => void)
        public on(event: "remove", listener: (player: Player) => void)
        public on(event: "skipPhase", listener: (newPhase: Phase, oldPhase: Phase) => void)
        public on(event: "nolynch", listener: () => void)
        public on(event: "setAction", listener: (player: Player, target: Player, type: any) => void)
        public on(event: "executeAction", listener: (player: Player, action: NightAction) => void)
        public on(event: "factionalKill", listener: (player: Player, target: Player) => void)
    }

//}


