ccmod3.resources.jsonPatches.add('data/players/lea.json', (data) => {
	function initProxy(name, factor) {
		const proxy = ig.copy(data.proxies.lightningSlowMo);

		const actions = proxy.action;
		actions[0].group = name;
		actions[1].group = name;
		actions[3].factor = factor;
		actions[4].time = -1;

		data.proxies[name] = proxy;
	}

	initProxy('infiniteStop', 0.0001);
	initProxy('infiniteSlowMo', 0.2);
});

function initKeybinding(name, defaultKey, header = '') {
	sc.OPTIONS_DEFINITION[`keys-${name}`] = {
		type: 'CONTROLS',
		init: { key1: defaultKey },
		cat: sc.OPTION_CATEGORY.CONTROLS,
		hasDivider: header.length > 0,
		header
	};
}

initKeybinding('slowTime', ig.KEY.T, 'timewalker');
initKeybinding('resetTime', ig.KEY.R);
initKeybinding('stopTime', ig.KEY.C);

sc.TimeWalkerMod = ig.GameAddon.extend({
	slowActive: false,
	stopActive: false,

	init() {
		this.parent('TimeWalkerMod');
	},

	onLevelLoadStart() {
		this.slowActive = false;
		this.stopActive = false;
	},

	onPostUpdate() {
		const player = ig.game.playerEntity;
		if (!player) {
			return;
		}

		if (ig.input.pressed('resetTime')) {
			this._reset();
		}
		if (ig.input.pressed('slowTime') && !this.slowActive) {
			this._slow();
		}
		if (ig.input.pressed('stopTime') && !this.stopActive) {
			this._stop();
		}
	},

	_reset() {
		this.slowActive = false;
		this.stopActive = false;
		new ig.ACTION_STEP.REMOVE_PROXIES({sticking: false, group: 'aura'}).start(ig.game.playerEntity);
	},

	_slow() {
		this._reset();
		this.slowActive = true;
		this._spawnProxy('infiniteSlowMo');
	},

	_stop() {
		this._reset();
		this.stopActive = true;
		this._spawnProxy('infiniteStop');
	},

	/**
	 *
	 * @param {string} name
	 */
	_spawnProxy(name) {
		new ig.ACTION_STEP.SHOOT_PROXY({
			align: 'BOTTOM',
			proxy: name,
			offset: {x: 0, y: 0, z: 0}
		}).run(ig.game.playerEntity);
	}
});

ig.addGameAddon(() => (sc.timewalker = new sc.TimeWalkerMod()));
