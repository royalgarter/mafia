const Unit = require("../Unit.js");
/**
 * Structure: RolelistFiller
 * This is a *structure* class. It's returned from the <fillRolelist> method.
 */
class RolelistFiller {
	constructor() {
		/**
		 * Property: roles
		 * All roles chosen from the <fillRolelist> method.
		 * 
		 * *Type:* <Unit> < <String: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String>, <Role> >
		 */
		this.roles = new Unit();
		/**
		 * Property: roleNames
		 * All role names chosen from the <fillRolelist> method.
		 * 
		 * *Type:* <Array: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array>
		 * 
		 */
		this.roleNames = [];
	}
}
module.exports = RolelistFiller;