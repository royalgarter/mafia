
/**
 * Structure: MafiaError
 * Represents a custom error from the mafia code.
 */

 class MafiaError {
     /**
      * Constructor: MafiaError
      * Throw the error in a pretty way.
      * 
      * Parameters:
      * name - The error's name. (<String: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String>)
      * desc - The error's description. (<String: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String>)
      * location - The error's location. (<String: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String>)
      */
     constructor(name, desc, location) {
          throw new RangeError(`${name}: \x1b[31m'${desc}'\x1b[0m at \x1b[36m${location}\x1b[0m`);
     }
 }

 module.exports = MafiaError;