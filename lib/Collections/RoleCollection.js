const Role = require("../Structures/Role.js");
const Unit = require("../Unit.js");
const RolelistFiller = require("../Structures/RolelistFiller");
const MafiaError = require("../Structures/MafiaError.js");
/**
 * Class: RoleCollection
 * A class that stores all roles. Only available through the <Game> class. Extends the <Unit> class.
 * 
 * *Example:*
 * 
 * --- Code
 * game.roles.addRole("Citizen", "Town", "Casual", false, true, null, null, null);
 * game.roles.addRole("Sheriff", "Town", "Investigative", false, false, 10, (player, target) => console.log(`You checked ${target.name} last night! They are a ${target.role.name}`));
 * game.roles.addRole("Goon", "Mafia", "Killing", true, false, 1, (player, target) => Game.kill(target, player));
 * 
 * game.roles.roles.get("Citizen") // Gets the Citizen role. Doesn't matter if it's unique or blocked.
 * game.roles.any() // Can return "Sheriff" or "Goon" (only once).
 * game.roles.fromSide("Town") // Can only return "Sheriff", if "Citizen" wasn't blocked, it would return citizen too.
 * game.roles.fromAlign("Town", "Casual") // Nothing, error will be thrown
 * game.roles.fromAlign("Town", "Investigative") // Sheriff only
 * 
 * game.roles.fillRolelist(["Any", "Random Town"]) // Sheriff and Sheriff | Goon or Sheriff
 * game.roles.fillRolelist(["Random Town", "Citizen"]) // Sheriff and Citizen. Roles called by name get returned, no matter if unique or blocked.
 */
class RoleCollection extends Unit {
	constructor() {
		super();
		/**
		 * Property: holder
		 * A <Unit> that stores all roles. 
		 * 
		 * *Difference between the class and <holder>*: The class unit doesn't get edited, while if a unique role gets returned from <any>, <fromSide> or <fromAlign>, the script will remove that role from the <holder> unit.
		 * 
		 * *Type:* <Unit> < <String: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String>, <Role> >
		 */
		this.holder = new Unit();
		/**
		 * Property: rules
		 * Any rolelist filling "rules" applied to the role collection. An example of a *rule* is for example, "Town Killing" roles specifically not spawning in a "Random Town" fill.
		 * 
		 * *Example:*
		 *  
		 * --- Code
		 * Game.roles.setRules((role, side, align) => {
		 *  if (role.side == "Town" && role.alignment == "Killing" && side == "Random" && align == "Town") return false;
		 *    return true;
		 * });
		 * ---
		 * That makes it so "Town Killing" roles don't spawn in a "Random Town" fill.
		 * 
		 * *Type:* <Function: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions>
		 */
		this.rules;
	}
	/** 
	 * Function: set
	 * Adds a <Role> to the <roles> and <holder> units.
	 * 
	 * Parameters:
	 * 
	 * name - The name of the role (<String: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String>)
	 * side - The side of the role (<String: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String>)
	 * alignment - The alignment of the role (<String: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String>)
	 * unique - If the role is unique or not (<Boolean: https://www.w3schools.com/js/js_booleans.asp>)
	 * blocked - If the role is blocked or not (<Boolean: https://www.w3schools.com/js/js_booleans.asp>)
	 * amount - How many instances of this role are possible in a game (<Number: https://www.w3schools.com/js/js_numbers.asp>)
	 * action - The role's action. (Function => parameters - (player (<Player>), target (<Player>), type (Any) ))
	 * 
	 * Returns:
	 * 
	 * This <RoleCollection> class.
	 */
	set(name, side, alignment, unique, blocked, amount, priority, action) {
		super.set(name, new Role(name, side, alignment, unique, blocked, amount, priority, action));
		this.holder.set(name, new Role(name, side, alignment, unique, blocked, amount, priority, action));
		return this.get(name);
	}
	/**
	 * Function: addPreset
	 * Adds a preset <Role> to the <roles> and <holder> units. That means, you give an already created <Role>.
	 * 
	 * Parameters:
	 * role - A <Role>
	 * 
	 * 
	 * Returns:
	 * 
	 * This <RoleCollection> class.
	 */
	addPreset(role) {
		super.set(role.name, role);
		this.holder.set(role.name, role);
		return this;
	}
	build(role) {
		let res = new Role();
		for (let key of Object.keys(role)) {
			let val = role[key];
			let keyv = key.toLowerCase();
			if (keyv == "name") res.setName(val);
			else if (keyv == "side") res.setSide(val)
			else if (keyv == 'alignment') res.setAlignment(val)
			else if (keyv == 'priority') res.setPriority(val)
			else if (keyv == 'action') res.setAction(val)
			else if (keyv == 'amount') res.setAmount(val)
			else if (keyv == 'unique') res.isUnique(val)
			else if (keyv == 'blocked') res.isBlocked(val);
			else res.addTag(key, val);
		}
		super.set(res.name, res);
		this.holder.set(res.name, res);
		return this;
	}
	/**
	 * Function: setRules
	 * Set the rules.
	 * 
	 * Parameters:
	 * fn - A function with parameters (<Role>, <String: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String>, <String: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String>)
	 * 
	 * See Also: 
	 * 
	 *  If you want to know what is a rule and how it works see <rules>.
	 */
	setRules(fn) {
		this.rules = fn;
	}
	getByName(name) {
		if (!this.holder.has(name)) return false;
		let role = this.holder.get(name);
		if (role.blocked == true) return false;
		if (role.unique) this.holder.delete(name);
		if (role.amount && role.amount == 1) this.holder.delete(name);
		if (role.amount) this.holder.amount--;
		return role.name;
	}
	/**
	 * Function: any
	 *   Get *any* role from the <roles>.
	 * 
	 * Returns:
	 * 
	 * A <Role>
	 * 
	 */
	any() {
		let role = false;
		const uses = new Unit();
		this.holder.transfer(uses);
		do {
			if (uses.size == 0) return new MafiaError("RoleCollection", "Couldn't get any role.", "RoleCollection#any")
			const rand = this.holder.random();
			uses.delete(rand.name);
			if (rand.blocked == false) {
				if (rand.amount) {
					if (rand.amount >= 1) {
						role = rand;
						if (rand.unique == true) this.holder.delete(rand.name);
						rand.amount--;
						if (rand.amount == 0) this.holder.delete(rand.name);
					}
				} else {
					role = rand;
					if (rand.unique == true) this.holder.delete(rand.name);
				}
			}
		} while (role == false);
		return role;
	}
	/**
	 * Function: fromSide
	 * Get a <Role> from a side.
	 * 
	 * Parameters:
	 *  side - A side name (<String: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String>)
	 * 
	 * Returns:
	 * 
	 * A <Role>
	 */
	fromSide(side) {
		let role = false;
		let possible = this.holder.findAll(r => r.side == side);
		do {
			if (possible.size == 0) return new MafiaError("RoleCollection", "Couldn't get any role.", "RoleCollection#fromSide" + side)
			const rand = possible.random();
			possible.delete(rand.name);
			if (rand.blocked == false) {
				if (rand.amount) {
					if (rand.amount >= 1) {
						role = rand;
						if (rand.unique == true) this.holder.delete(rand.name);
						rand.amount--;
						if (rand.amount == 0) this.holder.delete(rand.name);
					}
				} else {
					role = rand;
					if (rand.unique == true) this.holder.delete(rand.name);
				}
			}
		} while (role == false);
		return role;
	}
	/**
	 * Function: fromAlign
	 * Get a <Role> from a side and an alignment.
	 * 
	 * Parameters:
	 *  side - side name (<String: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String>)
	 *  alignment - alignment name (<String: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String>)
	 * 
	 * Returns:
	 * 
	 * A <Role>
	 */
	fromAlign(side, alignment) {
		// console.log(this.holder);
		let role = false;
		const possible = this.holder.findAll(r => r.side == side && r.alignment == alignment);
		// console.log(possible, side, alignment);
		do {
			if (possible.size == 0) return new MafiaError("RoleCollection", "Couldn't get any role.", "RoleCollection#fromAlign" + side + alignment);
			const rand = possible.random();
			possible.delete(rand.name);
			if (rand.blocked == false) {
				if (rand.amount) {
					if (rand.amount >= 1) {
						role = rand;
						if (rand.unique == true) this.holder.delete(rand.name);
						rand.amount--;
						if (rand.amount == 0) this.holder.delete(rand.name);
					}
				} else {
					role = rand;
					if (rand.unique == true) this.holder.delete(rand.name);
				}
			}
		} while (role == false);
		return role;
	}
	/**
	 * Functions: fill
	 * Fills a rolelist filler. (ex. "Random Town", "Town Killing", "Any", "Citizen")
	 * 
	 * Parameters:
	 *  side - The side. It doesn't have to be an actual side. Can be "Any", "Random" or a role name. (<String: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String>)
	 *  align - Can be a role alignment or a side, if the side parameter is "Random". Can be null if the side parameter is "Any" or a role name. (<String: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String>)
	 *
	 * Example:
	 * 
	 * --- Code
	 * Game.roles.fill("Town", "Investigative")
	 * Game.roles.fill("Any")
	 * Game.roles.fill("Citizen")
	 * Game.roles.fill("Random", "Town")
	 * 
	 * ---
	 * 
	 * Returns:
	 * 
	 * <Role>
	 */
	fill(side, align) {
		// console.log('fill', side, align);
		let og = false;
		if (this.has(side)) {
			let role = super.get(side);
			og = role;
		} else if (side.toLowerCase() == "any") {
			do {
				let role = this.any();
				if (this.rules && this.rules(role, side, align)) og = role;
			} while (!og)
		} else if (side.toLowerCase() == "random") {
			do {
				let role = this.fromSide(align);
				if (this.rules && this.rules(role, side, align)) og = role;
			} while (!og)
		} else {
			do {
				let role = this.fromAlign(side, align);
				if (this.rules && this.rules(role, side, align)) og = role;
			} while (!og)
		}
		// console.log('role', og.name);
		return og;
	}
	/**
	 * Function: fillRolelist
	 * Fills the given <Array: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array> with role objects.
	 * 
	 * *NOTE:* The Game object already executes this function when the <start> method is called.
	 * 
	 * Parameters:
	 *  rolelist: An <Array: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array> of role types. (ex. "Any", "Random <Side>", "<Side> <Alignment>", "<Role Name>")
	 * 
	 * Returns:
	 * 
	 * <RolelistFiller> 
	 */
	fillRolelist(rolelist) {
		let filled = new RolelistFiller();
		rolelist.forEach(val => {
			const side = val.split(" ")[0];
			const align = val.split(" ")[1];
			let role = this.fill(side, align);
			filled.roleNames.push(role.name);
			filled.roles.set(role.name, role);
		});
		return filled;
	}
	/**   fillRolelist(rolelist) {
		   let filled = new RolelistFiller();
		   rolelist.forEach(val => {
			   const side = val.split(" ")[0];
			   const align = val.split(" ")[1];
			   if (this.collected.has(side)) {
				   const role = this.collected.get(side);
				  // console.log(role, val);
				   filled.roleNames.push(role.name);
				   filled.roles.set(role.name, role);
			   }else if (side.toLowerCase() == "any") {
			   } 
		   });
	   } **/
}
module.exports = RoleCollection;