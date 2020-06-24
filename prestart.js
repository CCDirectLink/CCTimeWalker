sc.TimeWalkerMod = ig.GameAddon.extend({
	proxiesLoaded: false,
	slowActive: false,
	stopActive: false,

	init() {
		this.parent('TimeWalkerMod');

		// Users have to unbind these keybindings first though because
		// sc.KeyBinder loads configured keybindings after GameAddons are
		// initialized. Can be fixed by using sc.OPTIONS_DEFINITION, but this
		// needs input-api in ccloader 2, so I'll fix this in the ccloader 3
		// forwardport.
		ig.input.bind(ig.KEY.T, 'slowTime');
		ig.input.bind(ig.KEY.R, 'resetTime');
		ig.input.bind(ig.KEY.C, 'stopTime');
	},

	onLevelLoadStart() {
		this.slowActive = false;
		this.stopActive = false;
	},

	_initProxies() {
		if (ig.game.playerEntity.infinteStop || !ig.game.playerEntity.proxies.lightningSlowMo) {
			return;
		}

		this._initProxy('infinteStop', 0.0001);
		this._initProxy('infinteSlowMo', 0.2);

		this.proxiesLoaded = true;
	},

	/**
	 * @param {string} name
	 * @param {number} factor
	 */
	_initProxy(name, factor) {
		const player = ig.game.playerEntity;
		const proxy = player.proxies[name] = this._clone(player.proxies.lightningSlowMo);
		const data = proxy.data = this._clone(proxy.data);
		const action = data.action = this._clone(data.action);

		let step = action.rootStep = this._clone(action.rootStep);
		step.group = name;

		step = step._nextStep = this._clone(step._nextStep); //Copy, assign and edit
		step.group = name;

		step = step._nextStep = this._clone(step._nextStep);
		step = step._nextStep = this._clone(step._nextStep);
		step.factor = factor;

		step = step._nextStep = this._clone(step._nextStep);
		step.time = -1;
	},

	onPostUpdate() {
		const player = ig.game.playerEntity;
		if (!player) {
			return;
		}

		this._initProxies(player);
		if (!this.proxiesLoaded) {
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
		this._spawnProxy('infinteSlowMo');
	},

	_stop() {
		this._reset();
		this.stopActive = true;
		this._spawnProxy('infinteStop');
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
	},

	_clone(obj) {
		const result = Object.assign({}, obj);
		result.__proto__ = obj.__proto__;
		return result;
	}
});

ig.addGameAddon(() => (sc.timewalker = new sc.TimeWalkerMod()));
