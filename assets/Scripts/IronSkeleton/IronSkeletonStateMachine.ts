import { _decorator, AnimationComponent } from 'cc';
const { ccclass, property } = _decorator;
import { ENTITY_STATE_ENUM, PARAMS_NAME_ENUM } from '../../Enums'
import { getParamTrigget, getParamNumber, StateMachine } from '../../Base/StateMachine';
import { IdleSubMachine } from './IdleSubMachine';
import { DeathSubMachine } from './DeathSubMachine';
import { IronSkeletonManager } from './IronSkeletonManager';

@ccclass('IronSkeletonStateMachine')
export class IronSkeletonStateMachine extends StateMachine {

  async init() {
    this.animationComponent = this.addComponent(AnimationComponent);

    this.initParams();
    this.initStateMachines();
    await Promise.all(this.resource);
  }

  initParams() {
    this.params.set(PARAMS_NAME_ENUM.IDLE, getParamTrigget(false));
    this.params.set(PARAMS_NAME_ENUM.DEATH, getParamTrigget(false));
    this.params.set(PARAMS_NAME_ENUM.DIRECTION, getParamNumber(0));
  }

  initStateMachines() {
    this.stateMachines.set(PARAMS_NAME_ENUM.IDLE, new IdleSubMachine(this));
    this.stateMachines.set(PARAMS_NAME_ENUM.DEATH, new DeathSubMachine(this));
  }

  run() {
    switch (this.currentState) {
      case this.stateMachines.get(PARAMS_NAME_ENUM.DEATH):
      case this.stateMachines.get(PARAMS_NAME_ENUM.IDLE):
        if (this.params.get(PARAMS_NAME_ENUM.IDLE).value) {
          this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.IDLE);
        } else if (this.params.get(PARAMS_NAME_ENUM.DEATH).value) {
          this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.DEATH);
        }
        break;
      default:
        this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.IDLE);
        break;
    }
  }

}
