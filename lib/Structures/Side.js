const Unit = require("../Unit.js");
const FactionalKill = require("./FactionalKill.js")

/**
 * Structure: Side
 * This is a *structure* class. Represents a side.
 * 
 */

class Side {
    constructor(name) {

        /**
         * Property: name
         * The side's name.
         * 
         * *Type:* <String: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String>
         */
        this.name = name;
        /**
         * Property: players
         * All players that are on this side.
         * 
         * *Type:* <Unit> < <String: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String>, <Player> >
         */
        this.players = new Unit();
        /**
         * Property: roles
         * All roles that are on this side.
         * 
         * *Type:* <Unit> < <String: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String>, <Role> >
         * 
         */
        this.roles = new Unit();
        /**
         * Property: factionKill
         * Here the factional kill is stored. A factional kill means that only 1 member from that side can kill, usually during the night. Currently this module does not support automated faction killing so you'll have to set it up yourself. There should be a tutorial in the tutorials page.
         * 
         * *Type:* Any
         */
        this.factionKill = new FactionalKill(null, null);
    }


  /**
         * Property: setFactionalKill
         * Sets the factional kill. The previous factional kill holder's action gets cleared. 
         * 
         * Parameters:
         *  player - The player who's going to kill (<Player>)
         *  target - The player's target. (<Player>)
         */
    setFactionalKill(player, target) {
        this.factionKill = new FactionalKill(player, target);
       const prev = this.players.find(p => p.facKiller == true);
       if (prev) {
        prev.facKiller = false;
        prev.selectedAction = null;
       }
        player.facKiller = true;
    }
}

module.exports = Side;