
const STATE = Object.freeze({
  READY: 'ready',
  PLAY: 'play',
  PAUSE: 'pause',
  OVER: 'over'
})
/**
 * Game 游戏组件核心代码
 * import { Game, addZero } from './miniGame'
 * 1、包括游戏需要的状态管理#state
 * let game = new Game()
 * game.stage // 包含状态 ready\play\pause\over
 *
 * 2、包含一个tick计时系统
 * game.addEventListener('tick', e => {
      e.detail
    })
 *
 */

export class Game extends EventTarget {
  #state  //游戏状态
  #elapsedTime //游戏总时间

  constructor() {
    super()
    this.#state = STATE.READY
  }
  // 游戏开始
  start() {
    let _this = this
    this.#state = STATE.PLAY
    this.#elapsedTime = 0

    let startTime = null;
    let lastTime = null;

    function gameLoop(timestamp) {
      if (!startTime) {
        startTime = timestamp;
      }
      lastTime = timestamp - startTime;
      // 在这里更新游戏状态
      let tickEvent = new CustomEvent("tick", { detail: { deltaTime: _this.lastTime } })
      _this.dispatchEvent(tickEvent)
      // 增加时间
      this.#elapsedTime += timestamp;
      if (_this.#state == STATE.PLAY) requestAnimationFrame(gameLoop);
    }

    requestAnimationFrame(gameLoop);
    this.dispatchEvent(new CustomEvent("change", { detail: { state: this.#state } }))
  }
  // 发送游戏暂停事件
  pause() {
    this.#state = STATE.PAUSE
    this.dispatchEvent(new CustomEvent("pause", { detail: { state: this.#state } }))
  }
  // 发送游戏结束事件
  over() {
    this.#state = STATE.OVER
    this.dispatchEvent(new CustomEvent("over", { detail: { state: this.#state, elapsedTime: this.#elapsedTime } }))
  }

  stop() {
    this.#state = STATE.OVER
    this.dispatchEvent(new CustomEvent("stop", { detail: { state: this.#state } }))
  }
  getTime() {
    return this.#elapsedTime
  }

  /**
  * Returns the value of the private `#state` property.
  *
  * @return {any} The value of the `#state` property.
  */
  get state() {
    return this.#state
  }
}
/**
 * 格式化数字，给个位数填0
 * @param params  9
 * @returns ‘09’
 */
export const addZero = (params) => {
  return params < 10 ? '0' + params : params
}