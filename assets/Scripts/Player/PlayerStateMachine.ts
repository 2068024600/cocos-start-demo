import { _decorator, AnimationClip, AnimationComponent } from 'cc';
const { ccclass, property } = _decorator;
import { FSM_PARAM_TYPE_ENUM, PARAMS_NAME_ENUM } from '../../Enums'
import State from '../../Base/State';
import { getParamTrigget, getParamNumber, StateMachine } from '../../Base/StateMachine';
import { SubStateMachine } from '../../Base/SubStateMachine';
import { IdleSubMachine } from './IdleSubMachine';
import { ClockWiseSubMachine } from './ClockWiseSubMachine';
import { AntiClockWiseSubMachine } from './AntiClockWiseSubMachine';

@ccclass('PlayerStateMachine')
export class PlayerStateMachine extends StateMachine {

  async init() {
    this.animationComponent = this.addComponent(AnimationComponent);

    this.initParams();
    this.initStateMachines();
    this.initAnimationTrigger();
    await Promise.all(this.resource);
  }

  initParams() {
    this.params.set(PARAMS_NAME_ENUM.IDLE, getParamTrigget(false));
    this.params.set(PARAMS_NAME_ENUM.CLOCKWISE, getParamTrigget(false));
    this.params.set(PARAMS_NAME_ENUM.ANTICLOCKWISE, getParamTrigget(false));
    this.params.set(PARAMS_NAME_ENUM.DIRECTION, getParamNumber(0));
  }

  initStateMachines() {
    this.stateMachines.set(PARAMS_NAME_ENUM.IDLE, new IdleSubMachine(this));
    this.stateMachines.set(PARAMS_NAME_ENUM.CLOCKWISE, new ClockWiseSubMachine(this));
    this.stateMachines.set(PARAMS_NAME_ENUM.ANTICLOCKWISE, new AntiClockWiseSubMachine(this));
  }

  run() {
    switch (this.currentState) {
      case this.stateMachines.get(PARAMS_NAME_ENUM.CLOCKWISE):
      case this.stateMachines.get(PARAMS_NAME_ENUM.ANTICLOCKWISE):
      case this.stateMachines.get(PARAMS_NAME_ENUM.IDLE):
        if (this.params.get(PARAMS_NAME_ENUM.CLOCKWISE).value) {
          this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.CLOCKWISE);
        } else if (this.params.get(PARAMS_NAME_ENUM.IDLE).value){
          this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.IDLE);
        } else if (this.params.get(PARAMS_NAME_ENUM.ANTICLOCKWISE).value){
          this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.ANTICLOCKWISE);
        }
        break;
      default:
        this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.IDLE);
        break;
    }
  }

  initAnimationTrigger() {
    this.animationComponent.on(AnimationComponent.EventType.FINISHED, ()=>{
      const name = this.animationComponent.defaultClip.name;
      const trigger = 'turn';
      if (name.includes(trigger)) {
        this.setParam(PARAMS_NAME_ENUM.IDLE, getParamTrigget(true));
      }
    })
  }

}
