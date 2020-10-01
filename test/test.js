'use strict';
var expect = require('chai').expect;
const Mafia = require("../typings/package.js");

describe('Plurality mechanic', () => {
    it('should return Google', () => {
           const Game = new Mafia.Game();
           const Google = Game.addPlayer("Google")
           const Hidden = Game.addPlayer("Hidden")
             Google.votes = 3;
             const lynched = Game.players.getByMaxVotes();
             expect(lynched.name).to.equal("Google");
    });

    it("should return Hidden", () => {
        const Game = new Mafia.Game();
        const Google = Game.addPlayer("Google")
        const Hidden = Game.addPlayer("Hidden")
          Google.votes = 3;
          Hidden.votes = 5;
          const lynched = Game.players.getByMaxVotes();
          expect(lynched.name).to.equal("Hidden");
    });

});

describe('Role choosing: Amount', () => {
   it ('should return Citizen', () => {
    const Game = new Mafia.Game();
    Game.roles.addRole("Citizen", "Town", "BlahBlah", false, false, 1, null, null);
      const output = Game.roles.any();
      expect(output.name).to.equal("Citizen");
   });

   it('should retturn false (Any)', () => {
    const Game = new Mafia.Game();
    Game.roles.addRole("Citizen", "Town", "BlahBlah", false, false, 1, null, null);
      const output = Game.roles.any();
      const output1 = Game.roles.any();
      expect(output1).to.equal(false);
   });

   it('should return false (fromSide)', () => {
    const Game = new Mafia.Game();
    Game.roles.addRole("Citizen", "Town", "Citizen", false, true, null, null, null);
  //  Game.roles.addRole("Sheriff", "Town", "Investigative", false, false, null, null, null);
      const output1 = Game.roles.fromSide("Town");
      expect(output1).to.equal(false);
   });

     it('should return Sheriff (fromAlign)', () => {
    const Game = new Mafia.Game();
    Game.roles.addRole("Citizen", "Town", "Citizen", false, true, null, null, null);
    Game.roles.addRole("Sheriff", "Town", "Investigative", false, false, null, 4, null);
      const output1 = Game.roles.fromAlign("Town", "Investigative")
      expect(output1.name).to.equal("Sheriff");
   }); 


});

describe("Game Phases", () => {
   
    it("should return Day (set)", () => {
        const Game = new Mafia.Game();
        Game.phases.addPhase("Day", 20, "Night").addPhase("Night", 30, "Day").setFirst("Day");
        expect(Game.phases.first.name).to.equal("Day");
    });

    it("should return Night (first cycle)", () => {
        const Game = new Mafia.Game();
        Game.phases.addPhase("Day", 20, "Night").addPhase("Night", 30, "Day").setFirst("Day");
        Game.phases.move("first");
        Game.phases.move("cycle");
        expect(Game.phases.current.name).to.equal("Night");
    });

    it("should return Day (second cycle)", () => {
        const Game = new Mafia.Game();
        Game.phases.addPhase("Day", 20, "Night").addPhase("Night", 30, "Day").setFirst("Day");
        Game.phases.move("first");
        Game.phases.move("cycle");
        Game.phases.move("cycle");
        expect(Game.phases.current.name).to.equal("Day");
    });

    it("should return Night (third cycle)", () => {
        const Game = new Mafia.Game();
        Game.phases.addPhase("Day", 20, "Night").addPhase("Night", 30, "Day").setFirst("Day");
        Game.phases.move("first");
        Game.phases.move("cycle");
        Game.phases.move("cycle");
        Game.phases.move("cycle");
        expect(Game.phases.current.name).to.equal("Night");
    });

    it("should return Day (third cycle + 3 phases)", () => {
        const Game = new Mafia.Game();
        Game.phases.addPhase("Day", 20, "Middle").addPhase("Night", 30, "Day").addPhase("Middle", 15, "Night").setFirst("Day");
        Game.phases.move("first");
        Game.phases.move("cycle");
        Game.phases.move("cycle");
        Game.phases.move("cycle");
        expect(Game.phases.current.name).to.equal("Day");
    });
});

describe("Game pause and resume", () => {

    it("should return True (paused)", () => {
        const Game = new Mafia.Game();

        Game.start();
        Game.pause();

        expect(Game.paused).to.equal(true)
    });

    it("should return False (paused)", () => {
        const Game = new Mafia.Game();

        Game.start();
        Game.pause();
        Game.resume();

        expect(Game.paused).to.equal(false)
    });

});

describe("Win listener", () => {
       
       it ("should return Town", () => {
        const Game = new Mafia.Game();
        Game.events.setWinListener(() => {
             if (Game.sides.getSideSize("Town") >= 1) return new Mafia.DeclareWinner("Town", true);
               return new Mafia.DeclareWinner("Noone", false)
        });
        Game.roles.addRole("Citizen", "Town", "Citizen", false, false, null, null, null);
         Game.addPlayer("GoogleFeud");
         Game.rolelist = ["Sheriff"];
         Game.start();
         Game.on("win", side =>  expect(side.name).to.equal("Town"))
    });

    it ("Should return Coven", () => {
        const Game = new Mafia.Game();
        Game.events.setWinListener(() => {
             if (Game.sides.getSideSize("Town") >= 1) return new Mafia.DeclareWinner("Town", true);
              if (Game.sides.getSideSize("Coven") >= Game.sides.getSideSize("Town")) return new Mafia.DeclareWinner("Coven", true);
              return new Mafia.DeclareWinner("Town", false);
        });
        Game.roles.addRole("Citizen", "Town", "Citizen", false, false, null, null, null);
        Game.roles.addRole("CovenLeader", "Coven", "Citizen", false, false, null, null, null);
         Game.addPlayer("GoogleFeud");
         Game.addPlayer("Quck")
         Game.rolelist = ["Sheriff", "Random Coven"];
         Game.start();
         Game.on("win", side =>  expect(side.name).to.equal("Coven"))
    });
}); 

describe("Players", () => {

    it("Should return Quck", () => {
    const Game = new Mafia.Game();
    Game.events.setMajority(1);
    Game.events.setWinListener(() => {
        // if (Game.sides.getSideSize("Town") >= 1) return new Mafia.DeclareWinner("Town", true);
        //  if (Game.sides.getSideSize("Coven") >= Game.sides.getSideSize("Town")) return new Mafia.DeclareWinner("Coven", true);
        if (Game.playercount == 1) return new Mafia.DeclareWinner("Draw", true)
          return new Mafia.DeclareWinner("Town", false);
    });
    Game.roles.addRole("Citizen", "Town", "Citizen", false, false, null, null, null);
    Game.roles.addRole("CovenLeader", "Coven", "Citizen", false, false, null, null, null);
    const Google = Game.addPlayer("GoogleFeud");
    const Quck = Game.addPlayer("Quck");
    Game.rolelist = ["Sheriff", "Random Coven"];
    Game.start();
 
    Game.on("Day", phase => Google.vote(Quck));

    Game.on("lynch", player => {
        expect(player.name).to.equal("Quck")
    });
});

it("Should return GoogleFeud", () => {

});
const Game = new Mafia.Game();
Game.events.setMajority(2);
Game.events.setWinListener(() => {
    // if (Game.sides.getSideSize("Town") >= 1) return new Mafia.DeclareWinner("Town", true);
    //  if (Game.sides.getSideSize("Coven") >= Game.sides.getSideSize("Town")) return new Mafia.DeclareWinner("Coven", true);
    if (Game.playercount == 1) return new Mafia.DeclareWinner("Draw", true)
      return new Mafia.DeclareWinner("Town", false);
});
Game.roles.addRole("Citizen", "Town", "Citizen", false, false, null, null, null);
Game.roles.addRole("CovenLeader", "Coven", "Citizen", false, false, null, null, null);
const Google = Game.addPlayer("GoogleFeud");
const Quck = Game.addPlayer("Quck");
Game.rolelist = ["Sheriff", "Random Coven"];
Game.start();

Game.on("Day", phase => {
    Google.votesFor(Quck);
    Google.unvote();
    Quck.vote(Google);
    Google.vote(Google);
});

Game.on("lynch", player => {
    expect(player.name).to.equal("GoogleFeud")
});

});


describe("Rolelist Filler", () => {
    it("Should return Sheriff", () => {
        const Game = new Mafia.Game();
        Game.roles.addRole("Citizen", "Town", "Citizen", false, true, null, null, null);
        Game.roles.addRole("Sheriff", "Town", "Investigative", false, false, null, 4, null);
        Game.roles.addRole("Vigilante", "Town", "Killing", false, false, null, 5, null);

        Game.roles.setRules((role, side, align) => {
             if (role.name == "Citizen" && side == "Random" && align == "Town") return false;
             if (role.name == "Vigilante" && side == "Random" && align == "Town") return false;
        });

        const output = Game.roles.fill("Random", "Town");
        expect(output.name).to.equal("Sheriff");
    });
});

