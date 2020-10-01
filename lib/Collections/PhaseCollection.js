const Phase = require("../Structures/Phase.js");
const Unit = require("../Unit.js");

/**
 * Class: PhaseCollection
 * This class stores all phases and things like the current and firts phase. Only accessible through the game object. Extends the <Unit> class.
 * 
 */

class PhaseCollection extends Unit {
    constructor() {
        super();
        /**
         * Property: first
         * The first <Phase>
         * 
         * *Type:* <Phase>
         */
        this.first = null;
        /**
         * Property: current
         * The current <Phase>
         * 
         * *Type:* <Phase>
         */
        this.current = null;
    }

    /**
     * Method: set
     * Adds a phase to the <collected> unit.
     *
     * Parameters:
     * 
     * name - The name of the phase (<String: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String>)
     * duration - How long should the phase last (<Number: https://www.w3schools.com/js/js_numbers.asp>)
     * next - What Phase is after this one (<String: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String>)
     * clean - If at the end of this phase votes, voters, etc should be cleared. Default is *true* (<Boolean: https://www.w3schools.com/js/js_booleans.asp>)
     * 
     * Returns: 
     * 
     * This <PhaseCollection> Class
     */

    set(name, duration, next, clean) {
        super.set(name, new Phase(name, duration, next, clean));
        return this;
    }

    /**
     * Method: setFirst
     * Sets the first phase.
     * 
     * Parameters:
     *  name - The name of the phase. (String)
     * 
     * Returns: 
     * 
     * This <PhaseCollection> Class
     */

    setFirst(name) {
        this.first = this.get(name);
        return this;
    }

    /**
     * Method: move
     * Sets <current> to the next one.
     * 
     * *Note:* This method is executed at the end of every phase by the Game class.
     * 
     * Parameters:
     * type - Can be either "first" or "cycle" (String)
     * 
     */

    move(type) {
        if (type.toLowerCase() == 'first') this.current = this.first;
        if (type.toLowerCase() == "cycle") this.current = this.find(p => p.name == this.current.next);
    }
}


module.exports =  PhaseCollection;