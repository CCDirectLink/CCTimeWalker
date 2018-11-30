if(!cc)
	throw "No Modloader Found!";

document.body.addEventListener('modsLoaded', function () {
	var timewalker = new function(){
		var proxies = undefined;
		
		ig.input.bind(84, "slowTime");
		ig.input.bind(82, "resetTime");
		ig.input.bind(67, "stopTime");
		
		function onUpdate(){
			var player = cc.ig.playerInstance();
			var currentProxies;
			
			if(player !== null && 
					(currentProxies = simplify.getEntityProxies(player)) !== proxies){
				modifyProxies(currentProxies, 0.2);
			}
			
			
			if(ig.input.state("slowTime") || ig.input.state("resetTime") || ig.input.state("stopTime"))
				new cc.ig.combatActions.REMOVE_PROXIES({sticking: false, group:"aura"}).start(cc.ig.playerInstance());
			
			if(ig.input.state("slowTime") || ig.input.state("stopTime")) {
				if (ig.input.state("slowTime"))
					modifyProxies(currentProxies, 0.2)
				else
					modifyProxies(currentProxies, Math.pow(0.2, 10))
				simplify.runAction(new cc.ig.combatActions.SHOOT_PROXY({ align: "BOTTOM", proxy:"infiniteSlowMo", offset:{x:0,y:0,z:0} }), cc.ig.playerInstance());
			}
		}
		
		function modifyProxies(currentProxies, time){
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