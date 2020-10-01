
/**
 * Class: NightAction
 * This is a *structure* class. Represents a player's night action.
 */

class NightAction {
    constructor(target, type) {
        /**
         * Property: target
         * The player's target.
         * 
         * *Type:* <Player>
         */
        this.target = target;
        /**
         * Property: type
         * An optional parameter to pass to the role's action.
         * 
         * *Type:* Any
         */
        this.type = type;
    }

    /**
     * Functions: setTarget
     * Set the player's target.
     * 
     * Parameters:
     *  target - The target (<Player>)
     * 
     */

    setTarget(target) {
        this.target = target;
    }

    /**
     * Functions: setType
     * Set the type of the action.
     * 
     * Parameters:
     *  type - Any 
     * 
     */

    setType(type) {
        this.type = type;
    }

    /**
     * Functions: clear
     *  Clears the player's target and type.
     *
     */

    clear() {
        this.target = null;
        this.type = null;
    }

}

module.exports = NightAction;