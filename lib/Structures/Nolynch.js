const Unit = require("../Unit.js");

/**
 * Class: Nolynch
 * This is a *structure* class. Represents nolynch.
 */

class Nolynch {
    constructor() {
        /**
         * Parameter: enabled
         * If nolynch is enabled or not. If it isn't, the game will ignore it.
         * 
         * *Type:* <Boolean: https://www.w3schools.com/js/js_booleans.asp>
         */
        this.enabled = false;
        /**
         * Property: voters
         * Which players have voted for nolynch, mapped by their names.
         * 
         * *Type:* <Unit> < <String: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String>, <Player> >
         */
        this.voters = new Unit();
        /**
         * Property: votes
         * How many votes nolynch has.
         * 
         * *Type:* <Number: https://www.w3schools.com/js/js_numbers.asp>
         */
        this.votes = 0;
    }

    /**
     * Function: clear
     * Clears this instance by setting the votes to 0 and clearing the voters Unit.
     */

    clear() {
        this.votes = 0;
        this.voters.clear();
    }
}

module.exports = Nolynch;