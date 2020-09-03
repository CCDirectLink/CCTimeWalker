export default class Walker extends Plugin {
	constructor() {
		super();
		this.proxiesLoaded = false;
        
		this.slowActive = false;
		this.stopActive = false;
        
		this.lastslowTime = false;
		this.lastslowTime = false;
		this.lastresetTime = false;
	}

	prestart() {
		const self = this;
		sc.CrossCode.inject({
			init(...args) {
				this.parent(...args);

				this.addons.postUpdate.push(self);
				this.addons.levelLoaded.push(self);
				
				ig.input.bind(84, 'slowTime');
				ig.input.bind(82, 'resetTime');
				ig.input.bind(67, 'stopTime');
			}
		});
	}

	onPostUpdate() {
		const slowPressed = this._pressed('slowTime');
		const stopPressed = this._pressed('stopTime');
		const resetPressed = this._pressed('resetTime');

		const player = ig.game.playerEntity;
		if (!player) {
			return;
		}
        
		if (resetPressed) {
			this._reset();
		}
		if (slowPressed && !this.slowActive) {
			this._slow();
		}
		if (stopPressed && !this.stopActive) {
			this._stop();
		}
	}

	onLevelLoaded() {
		if (this.slowActive) {
			this._slow();
		} else if (this.stopActive) {
			this._stop();
		}
	}
    
	_reset() {
		this.slowActive = false;
		this.stopActive = false;
		ig.slowMotion.clearNamed('timeStop');
	}
    
	_slow() {
		this.slowActive = true;
		this.stopActive = false;
		const slowmo = ig.slowMotion.add(0.2, 0, 'timeStop');
		slowmo.addInverseEntity(ig.game.playerEntity);
	}
    
	_stop() {
		this.slowActive = false;
		this.stopActive = true;
		const slowmo = ig.slowMotion.add(0.0001, 0, 'timeStop');
		slowmo.addInverseEntity(ig.game.playerEntity);
	}
    
	/**
     * @param {string} name
     * @returns {boolean}
     */
	_pressed(name) {
		const last = this['last' + name];
		const current = ig.input.state(name);
		this['last' + name] = current;
		return !last && current;
	}
}