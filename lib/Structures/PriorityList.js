/**
 * Class: PriorityList 
 * 
 * Taken straight out of the "priorities" module by GoogleFeud.  But instead of providing a `size` parameter for the constructor, you'll pass the raw object itself.
 * 
 * 
 * Documentation: https://github.com/GoogleFeud/PriorityList/blob/master/documentation.md
 * 
 */

    class PriorityList {


    constructor(raw) {
        this._priorities = raw || {};
        this.locked = false;
    } 

    /**
     * @param {Number} index The place index
     * @param {any} value The value
     * 
     * Adds a value to the index.
     */

    add(index, value) {
        if (this.locked) return;
       if (typeof this._priorities[index] == "undefined") this._priorities[index] = value;
       else if (this._priorities[index] instanceof Array) this._priorities[index].push(value);
         else  {
             let t = this._priorities[index];
             this._priorities[index] = [];
             this._priorities[index].push(t);
             this._priorities[index].push(value);
    }
}


    /**
     * 
     * @param {callback} cb - What the function should do with every value.
     *
     */


    forEach(cb) {
        for (let index of Object.keys(this._priorities)) {
             if (this._priorities[index] instanceof Array) {
              if (this._priorities[index]) this._priorities[index].forEach((val, indexED) => cb(val, index, indexED));
             }else if (this._priorities[index]) cb(this._priorities[index], index, 0);
        }
   }

   /**
    * 
    * @param {any} value - The value.
    * @returns {{index: Number, value: any, subIndex: Number}} Returns the value's index and subIndex, along with the value itself.
    */

   getByVal(value) {
    let res = false;
    this.forEach((val, index, valIndex) => {
         if (value == val && res == false) { res = {index: Number(index), value: val, subIndex: valIndex} }
    });
    return res;
}
 /**
  * 
  * @param {Number} index The index to search in
  * @param {Number} [subindex] If there are multiple values in that index, add this
  * @returns {{index: Number, value: any, subIndex: Number}} Returns the value's index and subIndex, along with the value itself.
  */


  getByPos(index, subindex) {
      if (this._priorities[index] instanceof Array) return {value: this._priorities[index][subindex], index: index, subindex: subindex};
        else return {value: this._priorities[index], index: index, subindex: subindex}
  }

/**
    * 
    * @param {callback} fn 
    * @returns {{index: Number, value: any, subIndex: Number}} Returns the value's index and subIndex, along with the value itself.
    * 
    * Similar to Array#find
    */

   find(fn) {
    let res = false;
    this.forEach((val, index, valIndex) => {
         if (fn(val, index, valIndex) && res == false) { res = {index: Number(index), value: val, subIndex: valIndex} }
    });
    return res;
   }


    /**
     * 
     * @param {Any} value The value to be removed 
     */

    remove(value) {
        if (this.locked) return;
        const index = this.getByVal(value).index;
        if (this._priorities[index] instanceof Array) {
            this._priorities[index].splice(this._priorities[index].indexOf(value), 1) 
            if (this._priorities[index].length == 1) this._priorities[index] = this._priorities[index][0];
        }
          else this._priorities[index] = undefined;
    }

    /**
     * 
     * @param {any} val1 The compared value.
     * @param {any} val2 The value to compare the first value.
     * 
     * If val1 is a lower priority than val2, it will return 'lower',
     * If val1 is a higher priority than val2, it will return 'higher'
     */


    compare(val1, val2) {
        const value1 = this.getByVal(val1);
        const value2 = this.getByVal(val2);
        if (!value1 || !value2) return false;
        if (value1.index > value2.index) return 'lower'
         else if (value1.index < value2.index) return 'higher'
         else if (value1.subIndex > value2.subIndex) return 'lower'
         else if (value1.subIndex < value2.subIndex) return 'higher';
           else return false;
    }

    /**
     * 
     * @param  {...any} items The items to order
     * 
     * Orders the items based on their priorities on this list.
     */

    order(...items) {
         let res = [];
         this.forEach(val => {
             if (items.some(item => item == val)) res.push(val);
         });
         return res;
    }

    /**
     * 
     * @param  {...any} items The items
     * 
     * Returns the item with the highest priority, based on this list. 
     */

    highestOf(...items) {
        let res = false;
        this.forEach(val => {
              if (items.some(item => item == val) && res == false) res = val;
        });
        return res;
    }

    /**
     * 
     * @param  {...any} items The items
     * 
     * Returns the item with the lowest priority, based on this list.
     */

    lowestOf(...items) {
        let res = false;
        this.forEach(val => {
              if (items.some(item => item == val)) res = val;
        });
        return res;
    }

    /**
     * @property {any} highest The value with the highest priority.
     */

    get highest() {
        if (this._priorities[1] instanceof Array) return this._priorities[1][0]
        else return this._priorities[1];
    }

    /**
     * @property {any} lowest The value with the lowest priority.
     */

    get lowest() {
        let res = false;
        this.forEach(val => {
            res = val;
        });
        return res;
    }

    /**
     * @property {Array} values - All values in an array, indexed by their priorities.
     */

    get values() {
        let res = [];
        this.forEach(val => {
           res.push(val);
        });
        return res;
    }

    /**
     * 
     * @param {callback} filter 
     * 
     * Similar to Array#filter but returns a new instance of this class.
     */
    filter(filter) {
       const res = new PriorityList();
       this.forEach((value, index, valIndex) => {
          if (filter(value, index, valIndex)) res.add(index, value);
       });
       return res;
    }

    /**
     * @param {callback} fn 
     * 
     * Similar to Array#map
     */

    map(fn) {
       let result = [];
       this.forEach((value, index, subIndex) => {
            result.push(fn(value, index, subIndex));
       });
       return result;
    }

    /**
     * Locks the List. Values cannot be added / removed.
     */

    lock() {
        this.locked = true;
    }

    static load(raw, size) {
        let res = new PriorityList(size);
        for (let item of Object.keys(raw)) {
            res._priorities[item] = raw[item];
        }
        return res;
    }

    get size() {
       let s;
       this.forEach(() => {
          s++;
       });
       return s;
    }

}

module.exports = PriorityList;