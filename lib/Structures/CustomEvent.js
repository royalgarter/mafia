/**
 * Class: CustomEvent
 * This is a *structure* class. Represents a custom event for the game object.
 */


class CustomEvent {
    constructor(id, checker, executor) {
             /**
          * Property: id
          * The event's id. It's ID is called when you want to delete the event or deactivate the event.
          * 
          *  *Type:* <String: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String>
          */
        this.id = id;
               /**
          * Property: checker
          * The event's checker function. If the <checker> function returns true, the <executor> function will be executed. Function params for this function is the current phase.
          * 
          *  *Type:* <Function: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions>
          */
        this.checker = checker;

          /**
          * Property: executor
          * The event's executor function. Executes when the <checker> function returns true. Function param for this function is the current phase.
          * 
          *  *Type:* <Function: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions>
          */

        this.executor = executor;
        /**
         * Property: active
         * If set to false, the event is going to exist, just never be triggered. Default is true.
         * 
         * *Type:* <Boolean: https://www.w3schools.com/js/js_booleans.asp>
         */
        this.active = true;
        /**
         * Property: once
         * If set to true, the event is going to be executed just once, and then the <active> property will be set to false. Default is false.
         * 
         * *Type:* <Boolean: https://www.w3schools.com/js/js_booleans.asp>
         */
        this.once = false;

    }

       /**
         * Function: setActive
         * Sets the <active> property on this instance. 
         * 
         * Parameters:
         * bool - If set to false, the event is going to exist, just never be triggered. (<Boolean: https://www.w3schools.com/js/js_booleans.asp>)
         * 
         * Returns:
         * This <CustomEvent> class.
         */

    setActive(bool) {
        this.active = bool;
        return this;
    }

          /**
         * Function: setOnce
         * Sets the <once> property on this instance. 
         * 
         * Parameters:
         * bool - If set to true, the event is going to be executed just once, and then the <active> property will be set to false. (<Boolean: https://www.w3schools.com/js/js_booleans.asp>)
         * 
         * Returns:
         * This <CustomEvent> class.
         */

    setOnce(bool) {
        this.once = bool;
        return this;
    }
}

module.exports = CustomEvent;