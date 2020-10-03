/**
 * Class: ActionManager
 * The class that prioritises all night actions and then executes them.
 * 
 * You should execute night actions through here, and not:
 * 
 * --- Code
 * const Google = Game.players.get("Google");
 * Google.role.action(Google.selectedAction);
 * ---
 * 
 * That piece of code exdcutes a player's action right there and then.
 * 
 * Actions can be *set* at any time, but *must* be executed at once in order the Mafia game to be fair.
 */
class ActionManager {
	constructor(game) {
		/**
		 * Property: playerlist
		 * All players with a night action stored by their priority in an array. This property is automatically updated, so you shouldn't touch unless experimenting.
		 * 
		 * *Type:* <Object: https://www.w3schools.com/js/js_object_definition.asp>
		 * 
		 */
		this.playerlist = {
			list1: [],
			list2: [],
			list3: [],
			list4: [],
			list5: [],
			list6: []
		}
		this.game = game;
	}
	/**
	 * Function: refresh
	 * Refreshes the contents inside the <playerlist>. This function is automatically called before the <executeAll> function is executed.
	 */
	refresh() {
		this.playerlist = {
			list1: [],
			list2: [],
			list3: [],
			list4: [],
			list5: [],
			list6: []
		}
		this.game.alive.forEach((val, key) => {
			if (val.role.priority == 1) this.playerlist.list1.push({
				priority: val.role.priority,
				player: val
			});
			if (val.role.priority == 2) this.playerlist.list2.push({
				priority: val.role.priority,
				player: val
			});
			if (val.role.priority == 3) this.playerlist.list3.push({
				priority: val.role.priority,
				player: val
			});
			if (val.role.priority == 4) this.playerlist.list4.push({
				priority: val.role.priority,
				player: val
			});
			if (val.role.priority == 5) this.playerlist.list5.push({
				priority: val.role.priority,
				player: val
			});
			if (val.role.priority == 6) this.playerlist.list4.push({
				priority: val.role.priority,
				player: val
			});
		});
	}
	/**
	 * Function: executeV1
	 * Executes all night actions based on the <playerlist>. 
	 * 
	 * *NOTE:* Players who are <roleblocked> / their role doesn't have an <action> won't be executed.
	 * 
	 * See Also:
	 * 
	 * <executeV1 vs executeV2: https://github.com/GoogleFeud/Codename-Mafia/wiki/executeV1-vs.-executeV2>
	 */
	executeV1() {
		this.refresh();
		for (let k of Object.keys(this.playerlist)) {
			if (this.playerlist[k].length >= 1) {
				const list1 = this.playerlist[k];
				for (let i = 0; i < list1.length; i++) {
					if (list1[i].player.roleblocked != true) {
						if (list1[i].player.selectedAction && list1[i].player.selectedAction.target) {
							if (list1[i].player.role.action) {
								list1[i].player.role.action(list1[i].player, list1[i].player.selectedAction.target, list1[i].player.selectedAction.type);
								this.game.emit('executeAction', list1[i].player, list1[i].player.selectedAction)
								list1[i].player.selectedAction = null;
							}
						}
					}
				}
			}
		}
	}
	/**
	 * Function: executeV2
	 * Executes all night actions based on the given list.  
	 * 
	 * *NOTE:* Players who are <roleblocked> / their role doesn't have an <action> won't be executed.
	 * 
	 * Parameters:
	 * list - a <PriorityList>
	 * 
	 * See Also:
	 * 
	 * <executeV1 vs executeV2: https://github.com/GoogleFeud/Codename-Mafia/wiki/executeV1-vs.-executeV2>
	 */
	executeV2(list) {
		list.forEach(val => {
			this.game.players.findAll(p => p.role.name == val).forEach(player => {
				if (!player) return;
				if (!player.selectedAction || !player.selectedAction.target || player.roleblocked == true) return;
				player.role.action(player, player.selectedAction.target, player.selectedAction.type);
				this.game.emit('executeAction', player, player.selectedAction);
				player.selectedAction = null;
			});
		});
	}
}
module.exports = ActionManager