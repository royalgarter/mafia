const Game = require("./lib/Game.js");

const structures = {
    Role: require("./lib/Structures/Role.js"),
    Player: require("./lib/Structures/Player.js"),
    NightAction: require("./lib/Structures/NightAction.js"),
    Nolynch: require("./lib/Structures/Nolynch.js"),
    Side: require("./lib/Structures/Side.js")
}

const Unit = require("./lib/Unit.js");
const Filler = require("./lib/Structures/RolelistFiller.js")
const PriorityList = require("./lib/Structures/PriorityList.js");

const PremadeRoles = require("./lib/Extras/PremadeRoles.js")

module.exports = {
    Game: Game,
    Structures: structures,
    Unit: Unit,
    PremadeRoles: PremadeRoles,
    RolelistFiller: Filler,
    PriorityList: PriorityList
}