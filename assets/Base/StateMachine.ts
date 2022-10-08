import { _decorator, Component, AnimationComponent, SpriteFrame } from 'cc';
const { ccclass, property } = _decorator;
import { FSM_PARAM_TYPE_ENUM } from '../Enums'
import State from './State';
import { SubStateMachine } from './SubStateMachine';

interface IParmaValue {
  type: FSM_PARAM_TYPE_ENUM;
  value: number|boolean;
}

export const getParamTrigget = (value: boolean): IParmaValue => ({
  type: FSM_PARAM_TYPE_ENUM.TRIGGER,
  value
})

export const getParamNumber = (value: number): IParmaValue => ({
  type: FSM_PARAM_TYPE_ENUM.NUMBER,
  value
})

@ccclass('StateMachine')
export abstract class StateMachine extends Component {
  private _currentState: State|SubStateMachine = null;
  params: Map<string, IParmaValue> = new Map();
  stateMachines: Map<string, State|SubStateMachine> = new Map();

  animationComponent: AnimationComponent

  resource: Array<Promise<SpriteFrame[]>> = []

  public get currentState() {
      return this._currentState;
  }

  public set currentState(state: State|SubStateMachine) {
      this._currentState = state;
      this._currentState.run()
  }

  setParam(paramsName: string, value: IParmaValue) {
    this.params.set(paramsName, value);
    this.run();
    this.resetTrigger();
  }

  getParam(paramsName: string) {
    return this.params.get(paramsName);
  }

  resetTrigger() {
    for (const [_, value] of this.params) {
      if (value.type === FSM_PARAM_TYPE_ENUM.TRIGGER) {
        value.value = false;
      }
    }
  }

  abstract init(): void;
  abstract run(): void;

}
