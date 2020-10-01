const Unit = require("../Unit.js");

/**
 * Structure: Role
 * This is a *structure* class. Represents a Mafia Role.
 */


class Role {
    constructor(name, side, alignment, unique, blocked, amount, priority, action) {
        /**
         * Property: name
         * The role's name.
         * 
         * *Type*: <String: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String>
         * 
         */
        this.name = name;
        /**
         * Property: side
         * The side the role is in.
         * 
         * *Type*: <String: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String>
         * 
         */
        this.side = side;
        /**
         * Property: alignment
         * The alignment the role is in.
         * 
         * *Type*: <String: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String>
         */
        this.alignment = alignment;
        /**
         * Property: priority
         * The role's night action priority.
         * 
         * *Type:* <Number: https://www.w3schools.com/js/js_numbers.asp>
         * 
         */
        this.priority = priority
        /**
         * Property: unique
         * If the role is unique or not.
         * 
         * *Type:* <Boolean: https://www.w3schools.com/js/js_booleans.asp>
         * 
         */
        this.unique = unique;
        /**
         * Property: blocked
         * If the role is blocked or not.
         * 
         * *Type:* <Boolean: https://www.w3schools.com/js/js_booleans.asp>
         */
        this.blocked = blocked || false;
        /**
         * Property: amount
         * How many instances of the role can exist in a single game. 
         * 
         *  *Type:* <Number: https://www.w3schools.com/js/js_numbers.asp>
         */
        this.amount = amount;
        /**
         * Property: action
         * The role's night action.
         * 
         * *Type:* <Function: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions>
         * 
         */
        this.action = action;

        /**
         * Property: sepa
         * If the role has 2 words inside it's name, the name  "SerialKiller" for example. This property stores the separated name. ("Serial Killer")
         * 
         * *Type*: <String: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String>
         */
        this.sepa = this.name.replace(/([A-Z])/g, ' $1').trim();

                            /**
          * Property: tags
          * All role tags. Tags are basically additional Role properties, added by you. 
          * 
          * *Type:* <Unit> < any, any >
          */
         this.tags = new Unit();
    }

    /**
     * Functions: setSide
     * Sets the role's side.
     * 
     * Parameters:
     *  side - A side (<String: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String>)
     * 
     * Returns:
     * This <Role> class.
     * 
     */

    setSide(side) {
        this.side = side;
        return this;
    }

    /**
     * Functions: setAlignment
     * Sets the role's alignment.
     * 
     * Parameters:
     *  alignment - An alignment (<String: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String>)
     * 
     * Returns:
     * This <Role> class.
     */

    setAlignment(alignment) {
        this.alignment = alignment;
        return this;
    }

    /**
     * Functions: isUnique
     * Set the role's unique property
     * 
     * Parameters:
     * bool - True or False (<Boolean: https://www.w3schools.com/js/js_booleans.asp>)
     * 
     * Returns:
     * This <Role> class.
     * 
     */

    isUnique(bool) {
        this.unique = bool;
        return this;
    }

    /**
     * Functions: isBlocked
     * Set the role's blocked property.
     * 
     * Parameters:
     *  bool - True or False (<Boolean: https://www.w3schools.com/js/js_booleans.asp>)
     * 
     * Returns:
     * This <Role> class.
     */

    isBlocked(bool) {
        this.blocked = bool;
        return this;
    }

    /**
     * 
     * Functions: setAmount
     * Set the role's amount property.
     * 
     * Parameters: 
     *  amount - The amount (<Number: https://www.w3schools.com/js/js_numbers.asp>)
     * 
     * Returns:
     * This <Role> class.
     */

    setAmount(amount) {
        this.amount = amount;
        return this;
    }

    /**
     * 
     * Functions: setAction
     * Set the role's night action
     * 
     * Parameters: 
     *  fn - A function with parameters (player, target, type.) (<Function: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions>)
     * 
     * Returns:
     * This <Role> class.
     */

    setAction(fn) {
       this.action = fn;
       return this;
    }

    /**
     * Functions: setName
     * Set the role's name.
     * 
     * Parameters:
     *  name - The name. (<String: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String>)
     * 
     * Returns:
     * This <Role> class.
     */

    setName(name) {
        this.name = name;
        return this;
    }

    /**
     * Functions: setPriority
     * Set the role's priority.
     * 
     * Parameters:
     * priority - The priority, 1-6 (<Number: https://www.w3schools.com/js/js_numbers.asp>)
     * 
     * Returns:
     * This <Role> class.
     */

    setPriority(priority) {
        this.priority = priority;
        return this;
    }


        /**
     * Functions: addTag
     * Adds a tag to the role's <tags> unit.
     * 
     * Parameters:
     * key - The tag's key. (any)
     * val - The value. (any)
     * 
     * Returns:
     * This <Role> class.
     */


    addTag(key, val) {
        this.tags.set(key, val);
        return this;
    }

 
}

module.exports = Role;
