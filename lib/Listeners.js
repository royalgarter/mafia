const Event = require("./Structures/CustomEvent.js");
/**
 * Class: Listeners
 * A class that stores all listeners. That includes win listener, majority listener and plurality listener. You can add your own custom game listeners.
 * 
 * Majority and Plurality are turned off by default, a win listener is required for the <Game> to work.
 * 
 * *Example:*
 * 
 * --- Code
 * game.events.setWinListener(() => {
 *    if (game.sides.getSideSize("Mafia") > game.sides.getSideSize("Town")) return new DeclareWinner("Mafia", true);
 *      if (game.sides.getSideSize("Mafia") == 0) return new DeclareWinner("Town", true);
 *         return new DeclareWinner("Draw", false);
 * });
 * ---
 */
class Listeners {
	constructor() {
		/**
		 * Property: win
		 * The win listener.
		 * 
		 * *Type:* <Function: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions>
		 */
		this.win;
		/**
		 * Property: autoScaleMaj
		 * A setting. If set to true, the majority will auto-scale, meaning, every time a player dies / is revived, the majority will go up (if needed.). Ex. there are 12 players, majority is 6, a player gets revived, majority gets auto-scaled to 7.
		 * 
		 * *Type:* <Boolean: https://www.w3schools.com/js/js_booleans.asp>
		 */
		this.autoScaleMaj = false;
		/**
		 * Property: majority
		 * The majority listener. When set to a number, the majority listener will be activated.
		 * 
		 * *Type:* <Number: https://www.w3schools.com/js/js_numbers.asp>
		 */
		this.majority = false;
		/**
		 * Property: plurality
		 * The plurality listener. When set to true, the majority listener will be activated.
		 * 
		 * *Type:* <Boolean: https://www.w3schools.com/js/js_booleans.asp>
		 */
		this.plurality = false;
		/**
		 * Property: customEvents
		 * All custom events made by you.
		 * 
		 * *Type:* <Array: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array>
		 */
		this.customEvents = [];
	}
	/**
	 * Function: setWinListener
	 * Sets the win listener to the function. When it returns *new DeclareWinner(side, true)* the game will be stopped and *side* will win.
	 * 
	 * *NOTE:* The function must always return a <DeclareWinner> structure. An example is given above, at the beginning of this page.
	 * 
	 * Parameters:
	 * 
	 * fn - The win listener function.
	 * 
	 * Returns:
	 * 
	 * This <Listeners> Class.
	 */
	setWinListener(fn) {
		this.win = fn;
		return this;
	}
	/**
	 * Function: setMajority
	 * Activates the majority and sets the majority number to the selected value.
	 * 
	 * Parameters:
	 * maj - The majority (<Number: https://www.w3schools.com/js/js_numbers.asp>)
	 * 
	 * Returns:
	 * 
	 * This <Listeners> Class.
	 */
	setMajority(maj) {
		this.majority = maj;
		return this;
	}
	/**
	 * Function: setPlurality
	 * Activatates / Deactivates the plurality listener based on the bool parameter.
	 * 
	 * Parameters:
	 * bool - Activate (true) or Deactivate (false) (<Boolean: https://www.w3schools.com/js/js_booleans.asp>)
	 * 
	 * Returns:
	 * 
	 * This <Listeners> Class.
	 */
	setPlurality(bool) {
		this.plurality = bool;
		return this;
	}
	/**
	 * Function: setAutoScale
	 * Acivates / Deactivates auto majority scaling based on the bool parameter.
	 * 
	 * Parameters:
	 * bool - Activate (true) or Deactivate (false) (<Boolean: https://www.w3schools.com/js/js_booleans.asp>)
	 *  
	 * Returns:
	 *
	 * This <Listeners> Class.
	 */
	setAutoScale(bool) {
		this.autoScaleMaj = bool;
		return this;
	}
	/**
	 * Function: addEvent
	 * Adds a new custom event.
	 * 
	 * Parameters:
	 * id - The event's id. It's ID is called when you want to delete the event or deactivate the event.
	 * checker - The event's checker function. If the <checker> function returns true, the <executor> function will be executed. Function params for this function is the current phase.
	 * executor - The event's executor function. Executes when the <checker> function returns true. Function param for this function is the current phase.
	 *  
	 * Returns:
	 *
	 * The just created <CustomEvent>
	 */
	addEvent(id, checker, executor) {
		let event = new Event(id, checker, executor);
		this.customEvents.push(event);
		return event;
	}
	/**
	 * Function: removeEvent
	 * Removes a custom event.
	 * 
	 * Parameters:
	 * id - The event's id. 
	 */
	removeEvent(id) {
		let thing = this.customEvents.findIndex(event => event.id == id);
		this.customEvents.splice(thing, 1);
	}
	/**
	 * Function: getEvent
	 * Gets a custom event.
	 * 
	 * Parameters:
	 * id - The event's id. 
	 */
	getEvent(id) {
		let thing = this.customEvents.findIndex(event => event.id == id);
		return this.customEvents[thing];
	}
}
module.exports = Listeners;