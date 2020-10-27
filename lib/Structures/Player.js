const Unit = require("../Unit.js")
const NightAction = require("./NightAction.js");
const MafiaError = require("./MafiaError.js");
/**
 * Structure: Player
 * This is a *structure* class. Represents a player.
 */
class Player {
	constructor(name, game) {
		/**
		 * Property: name
		 * The player's name.
		 * 
		 * *Type:* <String: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String>
		 */
		this.name = name;
		/**
		 * Property: role
		 * The player's role.
		 * 
		 * *Type:* <Role>
		 */
		this.role = null;
		/**
		 * Property: dead
		 * If the player is dead or not.
		 * 
		 * *Type:* <Boolean: https://www.w3schools.com/js/js_booleans.asp>
		 */
		this.dead = false;
		/**
		 * Property: roleblocked
		 * If the player is roleblocked or not.
		 * 
		 * *Type:* <Boolean: https://www.w3schools.com/js/js_booleans.asp>
		 */
		this.roleblocked = null;
		/**
		 * Property: selectedAction
		 * The player's target and type of action. Starts off as null, but when a night action is set it becomes a <NightAction> class.
		 * 
		 * *Type:* <NightAction>
		 */
		this.selectedAction = null;
		/**
		 * Property: voters
		 * All other players who have voted this players. Mapped by their name.
		 * 
		 * *Type:* <Unit> < <String: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String>, <Player> >
		 */
		this.voters = new Unit();
		/**
		 * Property: voted
		 * Who this player has voted.
		 * 
		 * *Type:* <Player>
		 */
		this.voted = null;
		/**
		 * Property: votes
		 * How many votes the players has.
		 * 
		 * *Type:* <Number: https://www.w3schools.com/js/js_numbers.asp>
		 */
		this.votes = 0;
		/**
		 * Property: facKiller
		 * If the player is the killer of the faction for the night.
		 * 
		 * *Type:* <Boolean: https://www.w3schools.com/js/js_booleans.asp>
		 */
		this.facKiller = false;
		/**
		 * Property: game
		 * The game the player's in.
		 * 
		 * *Type:* <Game>
		 */
		this.game = game;
		/**
		 * Property: votePower
		 * How much should the votee's votes be incremented by when this player votes. Default is 1.
		 * 
		 * *Type:* <Number: https://www.w3schools.com/js/js_numbers.asp>
		 */
		this.votePower = 1;
		/**
		 * Property: tags
		 * All player tags. Tags are basically additional Player properties, added by you. 
		 * 
		 * *Type:* <Unit> < any, any >
		 */
		this.tags = new Unit();

		this.score = 0;
	}
	/**
	 * Function: clear
	 * Clears the player's <roleblocked>, <voters>, <votes>, <facKiller> and <voted>
	 * 
	 * *NOTE:* This function is already called at the end of every phase.
	 */
	clear() {
		this.roleblocked = null;
		this.votes = 0;
		this.facKiller = false;
		this.voted = null;
		this.voters.clear();
		this.score = 0;
	}
	/**
	 * Function: kills
	 * Kills the selected player. Emits the game's *kill* event.
	 * 
	 * Parameters:
	 *  player - The player who's going to get killed by this player.(<String: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String> OR <Player>)
	 * 
	 */
	kills(player) {
		let Killer;
		if (typeof player == "string") Killer = this.game.alive.get(player);
		else Killer = player;
		if (!Killer) return new MafiaError("Player", `${player} doesn't exist or is dead.`, `Player#kills`)
		Killer.dead = true;
		if (this.game.events.majority && this.game.events.autoScaleMaj == true) this.game.events.majority = this.game.setMaj();
		this.game.playercount--;
		this.game.alive.delete(Killer.name);
		this.game.dead.set(Killer.name, Killer);
		this.game.sides.removePlayer(Killer.name);
		this.game.emit("kill", Killer, this);
		process.nextTick(() => Killer.clear());
	}
	/**
	 * Function: kill
	 * Kills this player.
	 * 
	 */
	kill() {
		this.dead = true;
		if (this.game.events.majority && this.game.events.autoScaleMaj == true) this.game.events.majority = this.game.setMaj();
		this.game.playercount--;
		this.game.alive.delete(this.name);
		this.game.dead.set(this.name, this);
		this.game.sides.removePlayer(this.name);
		this.game.emit("kill", this, null);
		process.nextTick(() => this.clear());
	}
	/**
	 * Function: votesFor
	 * Emits the *vote* event. This player votes for the selected votee.
	 * 
	 * Parameters:
	 * votee - The player that this player is voting for (<String: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String> OR <Player> OR 'nolynch')
	 */
	votesFor(votee) {
		if (votee == "nolynch") {
			this.game.nolynch.votes++;
			this.voted = 'nolynch';
			this.game.nolynch.voters.set(this.name, this);
			this.game.emit("vote", this, 'nolynch');
		} else {
			if (!votee) return new MafiaError("Player", `The votee parameter is requiured!`, `Player#votesFor`)
			let Votee;
			if (typeof votee == "string") Votee = this.game.alive.get(votee);
			else Votee = votee;
			if (!Votee) return new MafiaError("Player", `${votee} doesn't exist or is dead.`, `Player#votesFor`)
			this.voted = Votee;
			Votee.voters.set(this.name, this);
			Votee.votes = Votee.votes + this.votePower;
			this.game.emit("vote", this, Votee);
		}
	}
	/**
	 * Function: unvote
	 * Emits the *unvote* event. This player unvotes the voted by him player (or nolynch).
	 */
	unvote() {
		const Votee = this.voted;
		if (Votee == "nolynch") {
			this.voted = null;
			this.game.nolynch.votes--;
			this.game.nolynch.voters.delete(this.name);
			this.game.emit("unvote", this, 'nolynch');
		} else {
			if (!Votee) return;
			this.voted = null;
			Votee.voters.delete(this.name);
			Votee.votes = Votee.votes - this.votePower;
			this.game.emit("unvote", this, Votee);
		}
	}
	/**
	 * Function: lynch
	 * Lynches the player. Emits the *lynch* event.
	 * 
	 * Parameters:
	 *  way - The way of lynching (Majority / Plurality) (<String: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String>)
	 * 
	 */
	lynch(way) {
		this.dead = true;
		if (this.game.events.majority && this.game.events.autoScaleMaj == true) this.game.events.majority = this.game.setMaj();
		this.game.playercount--;
		this.game.alive.delete(this.name);
		this.game.dead.set(this.name, this);
		this.game.sides.removePlayer(this.name);
		this.game.emit("lynch", this, way);
		process.nextTick(() => this.clear());
	}
	/**
	 * Function: revive
	 * Revives this player. Emits the *revive* event.
	 * 
	 * Parameters:
	 *  reviver - The reviver who's going to revive the player.(<String: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String> OR <Player>)
	 * 
	 */
	revive(reviver) {
		let Reviver;
		if (typeof reviver == "string") Reviver = this.game.dead.get(reviver);
		else Reviver = reviver;
		this.dead = false;
		
		if (this.game.events.majority && this.game.events.autoScaleMaj == true) this.game.events.majority = this.game.setMaj();
		
		this.game.playercount++;
		this.game.dead.delete(this.name);
		this.game.alive.set(this.name, this);
		this.game.sides.addPlayer(this);
		this.game.emit("revive", this, Reviver);
	}
	/**
	 * Function: remove
	 * Removes this player from the game. Emits the *remove* event.
	 *
	 * 
	 */
	remove() {
		this.game.players.delete(this.name);
		this.game.playercount--;
		if (this.game.sides) this.game.sides.removePlayer(this.name);
		if (this.game.alive.has(this.name)) {
			this.game.alive.delete(this.name);
			if (this.game.events.majority && this.game.events.autoScaleMaj == true) this.game.events.majority = this.game.setMaj();
		}
		if (this.game.dead.has(this.name)) this.game.dead.delete(this.name);
		this.game.emit("remove", this);
	}
	/**
	 * Function: voteNoLynch
	 * Votes for the game's <Nolynch> class. Emits the *vote* event with the votee being the string "nolynch".
	 * 
	 */
	voteNoLynch() {
		this.game.nolynch.voters.set(this.name, this);
		this.game.nolynch.votes = this.game.nolynch.votes + this.votePower;
		this.voted = "nolynch";
		this.game.emit('vote', this, "nolynch");
	}
	/**
	 * Function: unvoteNoLynch
	 * Unvotes for the game's <Nolynch> class. Emits the *unvote* event with the votee being the string "nolynch".
	 * 
	 */
	unvoteNoLynch() {
		if (!this.game.nolynch.voters.has(this.name)) return;
		this.game.nolynch.voters.delete(this.name);
		this.game.nolynch.votes = this.game.nolynch.votes - this.votePower;
		this.voted = null;
	}
	/**
	 * Function: setAction
	 * Sets this player's night action.
	 * 
	 * Parameters:
	 *  target - The player's target. (required) (<String: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String> OR <Player>)
	 *  type - Optional parameter to pass to the players role action. (ANY)
	 *  facKIll - If this will be a factional kill. (<Boolean: https://www.w3schools.com/js/js_booleans.asp>)
	 */
	setAction(target, type, facKill) {
		let Target;
		if (typeof target == "string") Target = this.game.players.get(target);
		else Target = target;
		if (!Target) return new MafiaError("Player", `${target} doesn't exist!`, `Player#setAction`)
		this.selectedAction = new NightAction(Target, type);
		if (facKill == true) {
			this.game.sides.get(this.role.side).setFactionalKill(this, Target);
			this.game.emit('factionalKill', this, Target)
		}
		this.game.emit('setAction', this, Target, type)
	}
}
module.exports = Player;