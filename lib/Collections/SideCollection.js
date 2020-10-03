const Unit = require("../Unit.js");
const Side = require("../Structures/Side.js");
/**
 * Class: SideCollection
 * A class that stores all information about a given side. That includes Players, Roles and factional kills. Only accessible through the game object, after the game has started. If you try to access this class before that, it will return *null*.
 * 
 * *Example:*
 * 
 * --- Code
 * game.sides.collected.get("Mafia") // Gives you the Mafia side object.
 * 
 * game.sides.getSideSize("Mafia") // Gives you how many players are there in the Mafia side
 * 
 * ---
 * 
 */
class SideCollection extends Unit {
	constructor(game) {
		super();
		this.game = game;
		game.roles.forEach(role => {
			if (!this.has(role.side)) this.set(role.side, new Side(role.side));
			this.get(role.side).roles.set(role.name, role);
		});
		game.players.forEach(player => {
			this.get(player.role.side).players.set(player.name, player);
		});
	}
	removePlayer(name) {
		let player = this.game.alive.get(name);
		if (!player) return false;
		this.get(player.role.side).players.delete(name);
		return true;
	}
	addPlayer(player) {
		this.get(player.role.side).players.set(player.name, player);
	}
	/**
	 * Function: sizeOf
	 * Gets the amount of players that are in the side.
	 * 
	 * Parameters:
	 *  side - The side to get the amount of players from. (<String: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String>)
	 * 
	 * Returns:
	 * 
	 * The player amount of the side.
	 */
	sizeOf(side) {
		if (!this.has(side)) return null;
		return this.game.alive.findAll(p => p.role.side == side).size;
	}
}
module.exports = SideCollection;