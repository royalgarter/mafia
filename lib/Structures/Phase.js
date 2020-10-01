/**
 * Class: Phase
 * This is a *structure* class. Represents a phase.
 * 
 */


class Phase {
    constructor(name, duration, next, clean) {
        /**
         * Property: name
         * The phase's name
         * 
         * *Type:* <String: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String>
         */
        this.name = name;
        /**
         * Property: duration
         * The length of the phase.
         * 
         * *Type:* <Number: https://www.w3schools.com/js/js_numbers.asp>
         */
        this.duration = duration;
        /**
         * Property: next
         * The phase after this one.
         * 
         * *Type:* <String: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String>
         */
        this.next = next;
        /**
         * Property: count
         * How many times the game has goon through this phase.
         *
         * *Type:* <Number: https://www.w3schools.com/js/js_numbers.asp>
         */
        this.count = 1;

          /**
         * Property: clean
         * If the game should clean player votes, voters, etc after this phase. 
         *
         * *Type:* <Boolean: https://www.w3schools.com/js/js_booleans.asp>
         */
        this.clean = clean;

    }
}

module.exports = Phase;