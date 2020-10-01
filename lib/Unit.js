
/**
 * Class: Unit
 * A class that stores almost all game information. Extends <Map: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map>.
 */

class Unit extends Map {
    constructor() {
        super();
    }

    /**
     * Function: map
    * Similar to <Array.map(): https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map>
     * Parameters:
     * func - A callback function that produces a new value out of the old one. Takes 2 parameters (in order): the value of the pair and the key of the pair
     * 
     * 
     * Returns:
     * 
     * <Array: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array>
     */
    map(func) {
        let res = [];
        for (let val of this.keys()) {
            let value = this.get(val);
             res.push(func(value, val))
            }
        return res;
    }

    forEach(func) {
        for (let val of this.keys()) {
            let value = this.get(val);
               func(value, val)
            }
    }

        /**
     * Function: edit
     * Edits the value of a key-value pair.
     *
     * Parameters:
     * key - The key
     * newval - The new value of the pair
     *   */


    edit(key, newval) {
        this.delete(key);
        this.set(key, newval);
    }

    /**
     * Function: find
     * Similar to <Array.find(): https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find>.
     *
     * Parameters:
     * func - A callback function that gets executed for each entry. Takes 2 parameters (in order): the value of the pair and the key of the entry
     * 
     * Returns:
     * 
     * The found value. If there isn't one, null.
     * 
     * See Also:
     * 
     * <findAll>
     *   */

    find(func) {
        let res = null;
       for (let val of this.keys()) {
         let value = this.get(val);
         if (func(value, val) == true && !res) res = value; 
         }
        return res;
    }

    /**
     * Function: findAll
     * Finds all entries in the unit based on the callback function.
     * 
     * Parameters:
     * func - A callback function that gets executed for each entry. Takes 2 parameters (in order): the value of the entry and the key of the entry
     * 
     * Returns:
     * 
     * A <Unit> <Any, Any>
     * 
     * See Also:
     * 
     * <find>
     */

    findAll(func) {
        let res = new Unit();
        for (let val of this.keys()) {
            let value = this.get(val);
            if (func(value, val) == true) res.set(val, value)
            }
        return res;
    }

/**
 * Function: random
 * Gets a random value.
 * 
 * Returns:
 * 
 * The random value.
 * 
 */

    random() {
        let keys = Array.from(this.keys());
        return this.get(keys[Math.floor(Math.random() * keys.length)]);
    }

/**
 * Function: transfer
 * Copies all entries in this <Unit> and pastes them in the given one. The given unit gets cleared before that.
 * 
 * Parameters:
 * 
 * unit - A <Unit>
 * 
 */

    transfer(unit) {
        unit.clear();
        for (let val of this.keys()) {
            let value = this.get(val);
                unit.set(val, value);
            }
    }


}

module.exports = Unit;