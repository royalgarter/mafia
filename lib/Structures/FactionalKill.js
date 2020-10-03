/**
 * Structure: FactionalKill
 * This class allows a faction only one kill per phase.
 */
class FactionalKill {
	constructor(killer, target) {
		/**
		 * Property: killer
		 * The player who's gonna kill
		 * 
		 * *Type:* <Player>
		 */
		this.killer = killer;
		/**
		 * Property: target
		 * The killer's target
		 * 
		 * *Type:* <Player>
		 * 
		 */
		this.target = target;
	}
	clear() {
		this.killer = null;
		this.target = null;
	}
}
module.exports = FactionalKill;