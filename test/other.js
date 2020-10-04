const Mafia = require("../package.js");
const Game = new Mafia.Game();
Game.roles.set("Sheriff", "Town", "Investigative", false, false, null, 3, (player, target, type) => {
	console.log("Activated! SHERIFF")
	if (target.role.side == "Mafia") return console.log(`${target.name} is Mafia!`);
	else console.log(`${target.name} is not suspicious!`);
});
const Citizen = new Mafia.Structures.Role("Citizen").setSide("Town").setName("Citizen").setAlignment("Citizen").isUnique(false).isBlocked(false).setAmount(10)
Game.roles.addPreset(Citizen);
const Goon = new Mafia.Structures.Role("Goon", "Mafia", "Killing", false, false, 100, 5, (player, target, type) => {
	console.log("Activated! GOON!");
	player.kills(target);
});
Game.roles.set("Vigilante", "Town", "Killing", false, false, null, 5, (player, target, type) => {
	console.log("Activated! VIGILANTE!")
	player.kills(target);
});
Game.roles.addPreset(Mafia.PremadeRoles.get("Escort"));
Game.roles.addPreset(Goon);
Game.roles.setRules((role, side, align) => {
	if (role.side == "Town" && role.alignment == "Killing" && side == "Random" && align == "Town") return false;
	return true;
});
Game.rolelist = ["Escort", "Vigilante", "Sheriff", "Goon"]
const list = new Mafia.PriorityList({
	1: "Escort",
	2: "Framer",
	3: "Sheriff",
	4: ["Goon", "Vigilante"]
});
Game.phases.set("Discussion", 20, "Voting", false).set("Night", 10, "Discussion", false).set("Secret Phase", 20, "Day", false).set("Voting", 20, "Night", false).setFirst("Discussion");
//Game.events.setPlurality(true);
Game.events.setMajority(10);
Game.events.setAutoScale(true);
Game.events.setWinListener(() => {
	if (Game.playercount == 3 && !Game.double) return "Everyone";
	if (Game.sides.sizeOf("Mafia") >= Game.sides.sizeOf("Town")) return "Mafia";
	if (Game.sides.sizeOf("Mafia") == 0) return "Town";
	else return false;
});
/** Game.events.addEvent("on3", () => {
	if (Game.timer == 10) return true;
		return false;
}, () => {
	Game.goToPhase("Secret Phase", true);
}).setOnce(true); **/
const Hidden = Game.addPlayer("Hidden");
const Google = Game.addPlayer("Google");
const Someone = Game.addPlayer("Someone");
const Noone = Game.addPlayer("Noone");
Game.events.majority = 2;
Game.on("begin", () => {
	console.log("Game is beginning!");
});
Game.on("win", side => {
	if (side == "Draw") return console.log("It's a draw!");
	console.log(side.name || side + " wins!")
	setTimeout(() => {
		Game.double = true;
		Game.addPlayer("Google")
		Game.addPlayer("Hidden")
		Game.addPlayer("Manatee");
		Game.rolelist = ["Any", "Any", "Any"];
		Game.start()
	}, 3000);
});
Game.on("AddRole", (player, role) => {
	console.log(`${player.name} is ${role.name}`);
})
Game.on("Discussion", phase => {
	console.log(`Majority is: ${Game.events.majority}`)
	console.log(phase.name);
	Google.votesFor("Hidden");
	if (Hidden.votes == 1) {
		Game.skipPhase();
		phase.skipped = true;
	}
});
Game.on("Discussion-End", phase => {
	console.log(phase.skipped);
	if (phase.skipped == true) console.log("THis phase was skipped!");
});
Game.on("Voting", (phase) => {
	Hidden.kill();
	//     console.log(Hidden.voters.map(p => p.name));  
});
Game.on("Secret Phase", () => console.log("A secret phase??"));
Game.on("Night", phase => {
	console.log(`Alive Players: ${Game.alive.map(p => p.name).join("\n")}`)
	Google.setAction("Hidden", "notype");
	Noone.setAction("Google", "notype");
	Someone.setAction("Someone", "notype");
	Hidden.setAction("Noone", "notype");
	//Game.alive.findAll(p => p.role.name == "Goon").forEach(val => Game.setAction(val, "Hidden", "notype"));
	console.log(`It's Night ${phase.count}`);
});
Game.on("Night-End", async phase => {
	const res = await Game.actionManager.executeV2(list);
	console.log(res);
});
Game.on("lynch", lynchee => {
	console.log(`${lynchee.name} will be lynched!`);
	console.log(lynchee.voters.map(p => p.name));
});
Game.on("vote", (voter, votee) => {
	console.log(`${voter.name} has voted ${votee.name}. ${votee.name} has ${votee.votes} votes.`);
});
Game.on("kill", (player, killer) => {
	if (killer) console.log(`${player.name} has been killed by ${killer.name || "noone!"}`)
	else console.log(`${player.name} has mysteriously died!`);
});
Game.on("factionalKill", (player, target) => {
	console.log(`${player.name} is now doing the factional kill. Their target is ${target.name}!`)
});
try {
	Game.start();
} catch (err) {
	console.log(err)
};