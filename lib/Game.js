const EventEmitter = require("events").EventEmitter;
const Unit = require("./Unit.js");
const Roles = require("./Collections/RoleCollection.js");
const Phases = require("./Collections/PhaseCollection");
const Nolynch = require("./Structures/Nolynch.js");
const Listeners = require("./Listeners.js");
const Player = require("./Structures/Player.js");
const ActManager = require("./ActionManager.js");
const SideCollection = require("./Collections/SideCollection.js");
const MafiaError = require("./Structures/MafiaError.js");
const Timer = require("./Timer.js");

function getByMaxVotes(unit) {
	let nums = [];
	unit.forEach(val => {
		nums.push(val.votes);
	});
	if (nums.some(n => n >= 1)) return unit.find(p => p.votes == Math.max(...nums));
	else return null;
}
/**
 * Class: Game
 * The main class. 
 */
/**
 * *Example:*
 * 
 * --- Code
 * const Game = new Mafia.Game();
 * 
 *Game.roles.addRole("Citizen", "Town", "Casual", false, true, null, null, null); // Add a role
 * 
 * Game.rolelist = ["Any", "Random Town", "Goon"]
 * 
 * Game.phases.addPhase("Day", 90, "Night").addPhase("Night", 120, "Day").setFirst("Day");
 * 
 *  Game.events.setWinListener(() => {
 *    if (game.sides.getSideSize("Mafia") > game.sides.getSideSize("Town")) return new DeclareWinner("Mafia", true);
 *      if (game.sides.getSideSize("Mafia") == 0) return new DeclareWinner("Town", true);
 *         return new DeclareWinner("Draw", false);
 * });
 * 
 * Game.events.setMajority(2)
 * Game.events.setAutoScale(true);
 * Game.events.setPlurality(false)
 * 
 * Game.addPlayer("Google") //Adding a player
 * Game.addPlayer("Hidden")
 * Game.addPlayer("BS")
 * 
 * Game.start();
 * 
 * Game.on("AddRole", (player, role) => { // Handle an event
 *     console.log(`${player.name} is ${role.name}`);
 * });
 * 
 * Game.on("kill", (victim, murderer) => {
 *      console.log(`${victim.name} was killed by ${murderer.name}`);
 * });
 */
/**@namespace */
class Game extends EventEmitter {
	constructor() {
		super();
		// Group: Properties
		/**
		 * Property: roles
		 * The game's roles.
		 * 
		 * *Type:* <RoleCollection>
		 */
		this.roles = new Roles();
		/**
		 * Property: players
		 * The game's players.
		 * 
		 * *Type:* <Unit> < <String: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String>, <Player> >
		 */
		this.players = new Unit();
		/**
		 * Property: alive
		 * The game's ALIVE players
		 * 
		 * *Type:* <Unit> < <String: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String>, <Player> >
		 */
		this.alive = new Unit();
		/**
		 * Property: dead
		 * The game's dead players. 
		 * 
		 * *Type:* <Unit> < <String: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String>, <Player> >
		 */
		this.dead = new Unit();
		/**
		 * Property: rolelist
		 * The game's rolelist.
		 * 
		 * *Type:* <Array: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array>
		 */
		this.rolelist = [];
		/**
		 * Property: playercount
		 * How many ALIVE players there are in the game.
		 * 
		 * *Type:* <Number: https://www.w3schools.com/js/js_numbers.asp>
		 */
		this.playercount = 0;
		/**
		 * Property: phases
		 * The game's phases.
		 * 
		 * *Type:* <PhaseCollection>
		 */
		this.phases = new Phases();
		/**
		 * Property: nolynch
		 * The game's nolynch structure.
		 * 
		 * *Type:* <Nolynch>
		 */
		this.nolynch = new Nolynch();
		/**
		 * Property: listeners
		 * The game's listeners. Win listener, Majority and Plurality.
		 * 
		 * *Type:* <Listeners>
		 */
		this.events = new Listeners();
		/**
		 * Property: actionManager
		 * The game's action manager. All night actions are collected and executed there.
		 * 
		 * *Type:* <ActionManager>
		 */
		this.actionManager = new ActManager(this);
		/**
		 * Property: timer
		 * The game's timer.
		 * 
		 * *Type:* <Number: https://www.w3schools.com/js/js_numbers.asp>
		 */
		this.timer = null;
		/**
		 * Property: sides
		 * The game's sides collection. This property is *NULL* until the game starts.
		 * 
		 * *Type:* <SideCollection>
		 */
		this.sides = null;
		/**
		 * Property: paused
		 * If the game is paused or not.
		 * 
		 * *Type:* <Boolean: https://www.w3schools.com/js/js_booleans.asp>
		 */
		this.paused = false;
		/**
		 * Property: started
		 * If the game has started or not.
		 * 
		 * *Type:* <Boolean: https://www.w3schools.com/js/js_booleans.asp>
		 */
		this.started = false;
		/**
		 * Property: tags
		 * All game tags. Tags are basically additional Game properties, added by you. 
		 * 
		 * *Type:* <Unit> < any, any >
		 */
		this.tags = new Unit();
	}
	//Group: Functions
	/**
	 * Function: addPlayer
	 * Adds a player to the game.
	 * 
	 * Parameters:
	 *  name - The player's name (<String: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String>)
	 * 
	 * Returns:
	 * The just created <Player>
	 */
	addPlayer(name) {
		if (!name) throw new MafiaError("Game", "Player name is required.", 'Game#addPlayer');
		this.players.set(name, new Player(name, this));
		this.playercount++;
		if (this.events.majority && this.events.autoScaleMaj == true) this.events.majority = this.setMaj();
		return this.players.get(name);
	}
	/**
	 * Function: resetStat
	 * Resets that stat for every player.
	 * 
	 * Parameters:
	 *  fn - The callback function to be executed on every player. 
	 *
	 */
	resetStat(fn) {
		this.players.forEach(val => {
			fn(val);
		});
	}

	start(filler, usePresetRole) {
		if (this.players.size != this.rolelist.length) return new MafiaError("Game error", "Playercount doesn't match rolelist length.", "Game#start")
		this.started = true;
		if (this.playercount != this.players.size) this.playercount = this.players.size;
		this.emit('begin');
		this.players.transfer(this.alive);
		let roles;
		if (filler) roles = filler;
		else roles = this.roles.fillRolelist(this.rolelist);
		this.players.forEach(val => {
			const r = (usePresetRole && val.role) ? val.role.name : roles.roleNames[Math.floor(Math.random() * roles.roleNames.length)];
			val.role = roles.roles.get(r);
			roles.roleNames.splice(roles.roleNames.indexOf(r), 1);
			this.emit("AddRole", val, roles.roles.get(r));
		});
		this.emit("RolesAdded");
		this.sides = new SideCollection(this);
		this.phases.move("first");
		this.timer = new Timer(this, (timer) => {
			const check = this.events.win(this);
			if (typeof check == 'string') {
				let win = this.sides.get(check);
				if (typeof win == 'undefined') win = check;
				this.emit('win', win);
				this.clear();
			} else {
				if (this.events.customEvents.length >= 1) {
					for (var i = 0; i < this.events.customEvents.length; ++i) {
						let event = this.events.customEvents[i];
						if (event.active && event.checker(this.phases.current) == true) {
							event.executor(this.phases.current);
							if (event.once) event.active = false;
							break;
						}
					}
				}
				if (this.timer.elapsed == 1) {
					this.emit(this.phases.current.name, this.phases.current);
					this.emit('newphase', this);
				}
				if (this.events.majority) {
					const player = this.alive.find(p => p.votes >= this.events.majority);
					if (player) {
						player.lynch(player.name, "Majority");
						this.emit(`${this.phases.current.name}-End`, this.phases.get(this.phases.current.name));
						this.atTheEndofTheDay(this.phases.current.clean);
					} else if (this.nolynch.votes == this.events.majority && this.nolynch.enabled == true) {
						this.emit("nolynch", this.nolynch);
					}
				}
				if (this.timer.elapsed >= this.phases.current.duration) {
					if (this.events.plurality == true) {
						const player = getByMaxVotes(this.alive);
						if (player) {
							player.lynch(player.name, "Plurality");
						}
					}
					this.emit(`${this.phases.current.name}-End`, this.phases.get(this.phases.current.name));
					this.atTheEndofTheDay(this.phases.current.clean);
				}
			}
		});
	}
	/**
	 * Function: pause
	 * Pauses the game.
	 */
	pause() {
		this.timer.paused = true;
		this.paused = true;
	}
	/**
	 * Function: resume
	 * Resumes the game.
	 */
	resume() {
		this.timer.paused = false;
		this.paused = false;
	}
	/**
	 * Function: copy
	 * Copies this instance.
	 * 
	 * Returns:
	 * The copied instance. (<Game>)
	 */
	copy() {
		let game = new Game();
		for (let item of Object.keys(this)) {
			game[item] = this[item];
		}
		return game;
	}
	/**
	 * Function: clear
	 * Clears this instance (Experimental). Clears everything but the game's settings and roles.
	 * 
	 */
	clear() {
		this.started = false;
		this.players.clear();
		this.alive.clear();
		this.dead.clear();
		this.nolynch.clear();
		this.playercount = 0;
		this.timer.clearLoop();
		this.phases.forEach(val => {
			val.count = 1;
		});
		this.events.customEvents.forEach(e => {
			if (e.once) e.active = true;
		});
		this.sides = null;
		this.paused = false;
	}
	/**
	 * Function: setMaj
	 * Resumes Scales the majority to the player count.
	 */
	setMaj(m) {
		let thing = m || Math.ceil((this.alive.size || this.playercount) / 2 + 0.5);
		this.events.setMajority(thing);
		return thing;
	}
	/**
	 * Function: skipPhase
	 * Skips the current phase.
	 */
	skipPhase() {
		let last = this.phases.current;
		this.emit(`${this.phases.current.name}-End`, this.phases.current);
		this.emit("skipPhase", this.phases.current, last)
		this.atTheEndofTheDay(this.phases.current.clean);
	}
	/**
	 * Function: goToPhase
	 * Goes to the specified phase.
	 * 
	 * Parameters:
	 * phase - The name of the phase you'd like to go to. (<String: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String>)
	 * clear - If the function should clear voting/action player data and nolynch data. <Boolean: https://www.w3schools.com/js/js_booleans.asp>
	 */
	goToPhase(phase, clear) {
		if (!this.phases.has(phase)) return new MafiaError("Game", `${phase} isn't a phase.`, "Game#goToPhase")
		// this.emit(`${this.phases.current.name}-End`, this.phases.current);
		this.phases.current = this.phases.get(phase);
		// this.phases.current.count++;
		if (clear == true) {
			this.players.forEach((val) => {
				val.clear();
			});
			this.nolynch.voters.clear();
			this.nolynch.votes = 0;
		}
		this.timer.reset();
	}
	atTheEndofTheDay(clear) {
		this.phases.current.count++;
		if (clear == true) {
			// console.log('this.alive.size', this.alive.size)
			this.alive.forEach((val) => {
				// console.log('atTheEndofTheDay.val', typeof val, val ? val.namenick : null);
				val && val.clear && val.clear();
			});
			this.nolynch.voters.clear();
			this.nolynch.votes = 0;
		}
		this.phases.move("cycle");
		this.timer.reset();
	}
}
module.exports = Game;
/**
 * Group: Events
 * 
 * Function: begin
 * Emitted when the game begins.
 * 
 * --- Code
 * 
 * Game.on("begin", () => do.something)
 * 
 */
/**
 * Function: AddRole
 * Emitted when a role is added to a player.
 * 
 * Parameters:
 *  player - A <Player>
 *  role - A <Role>
 * 
 * --- Code
 * 
 * Game.on("AddRole", (player, role) => console.log(player.name, role.name));
 */
/**
 * Function: RolesAdded
 * Emited right after all roles are added to the players.
 * 
 * --- Code
 * 
 * Game.on("RolesAdded", () => do.something)
 */
/**
 * Function: _Phase_
 * Emitted when the _Phase_ begins. _Phase_ being one of your defined phases in the game's <PhaseCollection>. For ex, if you have defined a *Day* and *Night* phases, you'd have a 
 * *Game.on("Day", phase)*
 * and
 * *Game.on("Night", phase)*
 * events.
 * 
 * Parameters:
 * phase - The <Phase>
 */
/**
 * Functions: _Phase_-End
 * Emitted when the _Phase_ ends. _Phase_ being one of your defined phases in the game's <PhaseCollection>.
 * 
 * Parameters:
 * phase - The <Phase>
 * 
 * See Also:
 * <_Phase_>
 * 
 */
/**
 * Functions: win
 * Emitted when the <setWinListener> function returns a <DeclareWinner> structure with activator *true*.
 * 
 * Parameters:
 *  winner - The <Side> winner.
 */
/**
 * Functions: kill
 * Emitted when the <kill> function is called.
 * 
 * Parameters:
 *   player - The <Player> who got killed
 *   killer - The killer, <Player>.
 * 
 * --- Code
 * 
 * Game.on("kill", (player, murderer) => console.log(`${player.name} has been murdered by ${murderer.name}`));
 */
/**
 * Functions: revive
 * Emitted when the <revive> function is called.
 * 
 * Parameters:
 *  player - The revived <Player>
 *  reviver - The <Player> who's reviving the player.
 * 
 * --- Code
 * 
 * Game.on("revive", (player, reviver) => console.log(`${player.name} has been revived by ${reviver.name}`));
 */
/**
 * Functions: vote
 * Emitted when the <vote> function is called.
 * 
 * Parameters:
 *  voter - The <Player> who votes
 *  votee - The <Player> who's getting voted. If the player has voted for nolynch, it will be the string 'nolynch'.
 * 
 * --- Code
 * 
 * Game.on("vote", (voter, votee) => console.log(`${votee.name} has been voted by ${voter.name}`));
 * 
 */
/**
 * Functions: unvote
 * Emitted when the <unvote> function is called.
 * 
 * Parameters:
 *  voter - The <Player> who unvotes.
 *  votee - The <Player> who the voter unvotes. If the player has voted for nolynch, it will be the string 'nolynch'.
 * 
 * --- Code
 * 
 * Game.on("vote", (voter, votee) => console.log(`${voter.name} has unvoted ${votee.name}`));
 */
/**
 * Functions: lynch
 * Emitted when the <lynch> function is called.
 * 
 * Parameters:
 *  player - The <Player> that was lynched.
 *  way - The way they were lynched. (Plurality / Majority) (<String: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String>)
 * 
 * --- Code
 * 
 * Game.on("lynch", (player, way) => console.log(`${player.name} was lynched! Their role wss ${player.role}!`));
 */
/**
 * Functions: remove
 * Emitted when the <return> function is called.
 * 
 * Parameters:
 *  player - The <Player> that was removed.
 * 
 * --- Code
 * 
 * Game.on("remove", player => console.log(`${player.name} has been removed from the game.`))
 * 
 */
/**
 * Functions: skipPhase
 * Emitted when <skipPhase> is called.
 * 
 * Parameters:
 *  new - The new phase. (<Phase>)
 *  old - The old phase. (<Phase>)
 */
/**
 * Functions: nolynch
 * Emitted when the <Nolynch> class got the majority votes.
 */
/**
 * Functions: setAction
 * Emitted when the <setAction> function is called.
 * 
 * Parameters:
 *  player - The player who is doing the action (<Player>)
 *  target - The player's target, if any. (<Player>)
 *  type - The type (Any)
 */
/**
 * Functions: executeAction
 * Emitted when an action gets executed.
 * 
 * Parameters:
 *  player - The player who is doing the action (<Player>)
 *  action - The player's action. (<NightAction>)
 * 
 * --- Code
 * 
 * Game.on("executeAction", (player, action) => console.log(`${player.name} has ${action.type} ${action.target.name}`));
 */
/**
 * Functions: factionalKill
 * Emitted when someone decides to the factional kill.
 * 
 * Parameters:
 *  player - The player who's doing the factional kill. (<Player>)
 *  target - The player who's gonna get killed. (<Player>)
 */
/**
 * *Example:*
 * 
 * --- Code
 * const Game = new Mafia.Game();
 * 
 *Game.roles.addRole("Citizen", "Town", "Casual", false, true, null, null, null); // Add a role
 * 
 * Game.rolelist = ["Any", "Random Town", "Goon"]
 * 
 * Game.phases.addPhase("Day", 90, "Night").addPhase("Night", 120, "Day").setFirst("Day");
 * 
 *  Game.events.setWinListener(() => {
 *    if (game.sides.getSideSize("Mafia") > game.sides.getSideSize("Town")) return new DeclareWinner("Mafia", true);
 *      if (game.sides.getSideSize("Mafia") == 0) return new DeclareWinner("Town", true);
 *         return new DeclareWinner("Draw", false);
 * });
 * 
 * Game.events.setMajority(2)
 * Game.events.setAutoScale(true);
 * Game.events.setPlurality(false)
 * 
 * Game.addPlayer("Google") //Adding a player
 * Game.addPlayer("Hidden")
 * Game.addPlayer("BS")
 * 
 * Game.start();
 * 
 * Game.on("AddRole", (player, role) => { // Handle an event
 *     console.log(`${player.name} is ${role.name}`);
 * });
 * 
 * Game.on("kill", (victim, murderer) => {
 *      console.log(`${victim.name} was killed by ${murderer.name}`);
 * });
 */