const RoleCollection = require("../Collections/RoleCollection");
const Role = require("../Structures/Role.js");

const Collection = new RoleCollection();

const Sheriff = new Role("Sheriff")
.setName("Sheriff")
.setSide("Town")
.setAlignment("Investigative")
.setPriority(3)
.isUnique(false)
.setAction((player, target) => {
    if (target.tags.get("framed") == true) return "Your target is member of the mafia!";
     if (target.role.side == "Mafia") return "Your target is member of the mafia!";
      if (target.role.name == "SerialKiller") return "Your target is a Serial Killer!";
         return "Your target is not suspicious!";
});

Collection.addPreset(Sheriff);

const Framer = new Role("Framer")
.setName("Framer")
.setSide("Neutral")
.setAlignment("Evil")
.setPriority(2)
.isUnique(false)
.setAction((player, target) => {
   target.tags.set("framed", true);
});

Collection.addPreset(Framer);

const Escort = new Role("Escort")
.setName("Escort")
.setSide("Town")
.setAlignment("Support")
.setPriority(1)
.isUnique(false)
.setAmount(3)
.setAction((player, target) => {
   target.roleblocked = true;
});

const Tracker = new Role("Tracker")
.setSide("Town")
.setAlignment("Investigative")
.setPriority(6)
.isUnique(false)
.setAction((player, target) => {
    if (target.selectedAction.target) return `${target.name} visited ${selectedAction.target.name} last night!`;
});

Collection.addPreset(Escort);
Collection.addPreset(Tracker);

module.exports = Collection;
