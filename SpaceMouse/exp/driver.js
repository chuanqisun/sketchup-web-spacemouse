/**
 * Gamepad API wrapper for the SpaceNavigator axes
 */
class SpaceNavigator {
  constructor() {
    navigator.getGamepads(); // first call to trigger connection

    this.spaceNavigator = this.getSpaceNavigator();
  }

  getAxes() {
    const spaceNavigator = this.getSpaceNavigator();
    return spaceNavigator && spaceNavigator.axes ? spaceNavigator.axes : [0, 0, 0, 0, 0, 0];
  }

  getSpaceNavigator() {
    const gamepadList = [...navigator.getGamepads()];
    return gamepadList.find(gamepad => this.isSpaceMouse(gamepad));
  }

  /**
   *
   * @param {Gamepad} gamepad
   */
  isSpaceMouse(gamepad) {
    if (!gamepad) return false;
    if (!gamepad.id) return false;
    if (gamepad.id.indexOf('3Dconnexion Universal Receiver') < 0) return false;
    if (gamepad.axes.length !== 6) return false;

    return true;
  }
}

/**
 * calculating speed and translation at each tick
 */
class PhysicsEngine {
  constructor() {
    this.previousTime = null;
    this.spaceNavigator = new SpaceNavigator();
    this.velocity = { x: 0, y: 0 };
    this.friction = 0.2;
    window.requestAnimationFrame(() => this.step());
  }

  step() {
    const nowTime = performance.now();
    const delta = nowTime - this.previousTime;
    this.previousTime = nowTime;
    // console.log(delta);
    const [fX, _1, _2, _3, _4, _5] = this.spaceNavigator.getAxes();

    if (fX > 0) {
      this.velocity.x = Math.min(10, this.velocity.x + fX);
    } else if (fX < 0) {
      this.velocity.x = Math.max(-10, this.velocity.x + fX);
    } else {
      this.velocity.x = Math.abs(this.velocity.x) > 0.1 ? this.velocity.x / delta : 0;
    }

    // console.dir(this.velocity.x * delta);
    const deltaX = this.velocity.x * delta;
    parent.postMessage({ pluginMessage: { type: 'mouse-update', deltaX } }, '*');

    window.requestAnimationFrame(() => this.step());
  }
}

new PhysicsEngine();
