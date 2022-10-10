import { _decorator, AnimationComponent } from 'cc';
const { ccclass, property } = _decorator;
import { PARAMS_NAME_ENUM } from '../../Enums'
import { getParamTrigget, getParamNumber, StateMachine } from '../../Base/StateMachine';
import { IdleSubMachine } from './IdleSubMachine';

@ccclass('EnemyStateMachine')
export class EnemyStateMachine extends StateMachine {

  async init() {
    this.animationComponent = this.addComponent(AnimationComponent);

    this.initParams();
    this.initStateMachines();
    await Promise.all(this.resource);
  }

  initParams() {
    this.params.set(PARAMS_NAME_ENUM.IDLE, getParamTrigget(false));
    this.params.set(PARAMS_NAME_ENUM.DIRECTION, getParamNumber(0));
  }

  initStateMachines() {
    this.stateMachines.set(PARAMS_NAME_ENUM.IDLE, new IdleSubMachine(this));
  }

  run() {
    this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.IDLE);
  }

}
