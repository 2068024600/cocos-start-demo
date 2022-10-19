import Singleton from "../Base/Singleton";

interface IFunc {
  func: Function,
  ctx: unknown,
  priority: number
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
   * @param priority 优先级
   */
  add(eventName: string, func: Function, ctx?: unknown, priority?: number) {
    if (this.eventMap.has(eventName)) {
      this.eventMap.get(eventName).push({func, ctx, priority: priority || 0});
    } else {
      this.eventMap.set(eventName, [{func, ctx, priority: priority || 0}]);
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
      let func = this.eventMap.get(eventName).sort((a, b) => a.priority - b.priority);
      func.forEach(({func, ctx}) => {
        ctx ? func.apply(ctx, param) : func(param);
      })
    } else {
      console.error("事件名称不存在...停止执行");
    }
  }

  /**
   * 清除事件中心
   */
  clear() {
    this.eventMap.clear();
  }
}
