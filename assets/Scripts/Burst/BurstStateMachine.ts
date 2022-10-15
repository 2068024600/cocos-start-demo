import { _decorator, AnimationComponent, AnimationClip } from 'cc';
const { ccclass, property } = _decorator;
import { PARAMS_NAME_ENUM } from '../../Enums'
import { getParamTrigget, StateMachine } from '../../Base/StateMachine';
import State from '../../Base/State';

@ccclass('BurstStateMachine')
export class BurstStateMachine extends StateMachine {

  async init() {
    this.animationComponent = this.addComponent(AnimationComponent);

    this.initParams();
    this.initStateMachines();
    await Promise.all(this.resource);
  }

  initParams() {
    this.params.set(PARAMS_NAME_ENUM.IDLE, getParamTrigget(false));
    this.params.set(PARAMS_NAME_ENUM.ATTACK, getParamTrigget(false));
    this.params.set(PARAMS_NAME_ENUM.DEATH, getParamTrigget(false));
  }

  initStateMachines() {
    this.stateMachines.set(PARAMS_NAME_ENUM.IDLE, new State(this, "texture/burst/idle", AnimationClip.WrapMode.Loop));
    this.stateMachines.set(PARAMS_NAME_ENUM.ATTACK, new State(this, "texture/burst/attack"));
    this.stateMachines.set(PARAMS_NAME_ENUM.DEATH, new State(this, "texture/burst/death"));
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

}
