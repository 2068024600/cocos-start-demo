import Singleton from "../Base/Singleton";

interface IFunc {
  func: Function,
  ctx: unknown
}

export default class EventResource extends Singleton {

  static get instance() {
    return super.getInstance<EventResource>();
  }

  private eventMap : Map<string, Array<IFunc>> = new Map();

  /**
   * 新增事件
   * @param eventName 事件名称
   * @param func 事件函数
   */
  add(eventName: string, func: Function, ctx?: unknown) {
    if (this.eventMap.has(eventName)) {
      this.eventMap.get(eventName).push({func, ctx});
    } else {
      this.eventMap.set(eventName, [{func, ctx}]);
    }
  }

  /**
   * 移除事件
   * @param eventName 事件名称
   * @param func 事件函数
   */
  remove(eventName: string, func: Function) {
    if (this.eventMap.has(eventName)) {
      const index = this.eventMap.get(eventName).findIndex(value => value.func == func);
      index > -1 && this.eventMap.get(eventName).splice(index);
    }
  }

  /**
   * 执行事件
   * @param eventName 事件名称
   * @param param 事件函数参数
   */
  exec(eventName: string, param?: unknown[]) {
    if (this.eventMap.has(eventName)) {
      this.eventMap.get(eventName).forEach(({func, ctx}) => {
        ctx ? func.apply(ctx, param) : func(param);
      })
    }
  }

  /**
   * 清除事件中心
   */
  clear() {
    this.eventMap.clear();
  }
}
