if (!cc)
	throw "No Modloader Found!";

document.body.addEventListener('modsLoaded', function () {
	var timewalker = new function () {
		var proxies = undefined;

		ig.input.bind(84, "slowTime");
		ig.input.bind(82, "resetTime");
		ig.input.bind(67, "stopTime");
		
		clicked = {
			slowTime: false,
			stopTime: false
		}
		held = {
			slowTime: false,
			stopTime: false
		}
		active = {
			slowTime: false,
			stopTime: false
		}

		function onUpdate() {
			var player = cc.ig.playerInstance();
			var currentProxies;

			if (player !== null &&
				(currentProxies = simplify.getEntityProxies(player)) !== proxies) {
				modifyProxies(currentProxies, 0.2);
			}
			
			held.slowTime = ig.input.state("slowTime");
			held.stopTime = ig.input.state("stopTime");

			if (player !== null) {
				if (ig.input.state("resetTime")) {
					active.slowTime = false;
					active.stopTime = false;
					new cc.ig.combatActions.REMOVE_PROXIES({sticking: false, group: "aura"}).start(cc.ig.playerInstance());
				}

				else if (!clicked.slowTime && held.slowTime && !active.slowTime) {
					active.slowTime = true;
					active.stopTime = false;
					new cc.ig.combatActions.REMOVE_PROXIES({sticking: false, group: "aura"}).start(cc.ig.playerInstance());
					modifyProxies(currentProxies, 0.2);
					simplify.runAction(new cc.ig.combatActions.SHOOT_PROXY({
						align: "BOTTOM",
						proxy: "infiniteSlowMo",
						offset: {x: 0, y: 0, z: 0}
					}), cc.ig.playerInstance());
				
				} else if (!clicked.stopTime && held.stopTime && !active.stopTime) {
					active.slowTime = false;
					active.stopTime = true;
					new cc.ig.combatActions.REMOVE_PROXIES({sticking: false, group: "aura"}).start(cc.ig.playerInstance());
					modifyProxies(currentProxies, Math.pow(0.2, 10));
					simplify.runAction(new cc.ig.combatActions.SHOOT_PROXY({
						align: "BOTTOM",
						proxy: "infiniteSlowMo",
						offset: {x: 0, y: 0, z: 0}
					}), cc.ig.playerInstance());
				}
				
				if (clicked.slowTime != held.slowTime)
					clicked.slowTime = held.slowTime;
				
				if (clicked.stopTime != held.stopTime)
					clicked.stopTime = held.stopTime;
			}
		}

		function modifyProxies(currentProxies, time) {
			proxies = currentProxies;
			proxies.infiniteSlowMo = proxies.lightningSlowMo;
			var action = simplify.getProxyAction(proxies.infiniteSlowMo.data.action);

			action.group = "infinteSlowMo";
			action = simplify.getNextProxyAction(action);
			action.group = "infinteSlowMo";
			action = simplify.getNextProxyAction(simplify.getNextProxyAction(action));
			action[cc.ig.varNames.slowDownModifier] = time;
			action = simplify.getNextProxyAction(action);
			action.time = -1;
		}

		simplify.registerUpdate(onUpdate);
	}();
});
