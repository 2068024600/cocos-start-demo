import { _decorator, AnimationComponent } from 'cc';
const { ccclass, property } = _decorator;
import { PARAMS_NAME_ENUM } from '../../Enums'
import { getParamTrigget, getParamNumber, StateMachine } from '../../Base/StateMachine';
import { IdleSubMachine } from './IdleSubMachine';
import { ATKSubMachine } from './ATKSubMachine';
import { DeathSubMachine } from './DeathSubMachine';

@ccclass('EnemyStateMachine')
export class EnemyStateMachine extends StateMachine {

  async init() {
    this.animationComponent = this.addComponent(AnimationComponent);

    this.initParams();
    this.initStateMachines();
    this.initAnimationTrigger();
    await Promise.all(this.resource);
  }

  initParams() {
    this.params.set(PARAMS_NAME_ENUM.IDLE, getParamTrigget(false));
    this.params.set(PARAMS_NAME_ENUM.ATTACK, getParamTrigget(false));
    this.params.set(PARAMS_NAME_ENUM.DEATH, getParamTrigget(false));
    this.params.set(PARAMS_NAME_ENUM.DIRECTION, getParamNumber(0));
  }

  initStateMachines() {
    this.stateMachines.set(PARAMS_NAME_ENUM.IDLE, new IdleSubMachine(this));
    this.stateMachines.set(PARAMS_NAME_ENUM.ATTACK, new ATKSubMachine(this));
    this.stateMachines.set(PARAMS_NAME_ENUM.DEATH, new DeathSubMachine(this));
  }

  run() {
    switch (this.currentState) {
      case this.stateMachines.get(PARAMS_NAME_ENUM.ATTACK):
      case this.stateMachines.get(PARAMS_NAME_ENUM.DEATH):
      case this.stateMachines.get(PARAMS_NAME_ENUM.IDLE):
        if (this.params.get(PARAMS_NAME_ENUM.IDLE).value) {
          this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.IDLE);
        } else if (this.params.get(PARAMS_NAME_ENUM.ATTACK).value) {
          this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.ATTACK);
        } else if (this.params.get(PARAMS_NAME_ENUM.DEATH).value) {
          this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.DEATH);
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
      const trigger = ['attack'];
      if (trigger.find(value => name.includes(value))) {
        this.setParam(PARAMS_NAME_ENUM.IDLE, getParamTrigget(true));
      }
    })
  }

}
