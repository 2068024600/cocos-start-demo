import { _decorator, AnimationComponent } from 'cc';
const { ccclass, property } = _decorator;
import { ENTITY_STATE_ENUM, PARAMS_NAME_ENUM, PARAMS_SPIKES_NUMBER_ENUM } from '../../Enums'
import { getParamTrigget, getParamNumber, StateMachine } from '../../Base/StateMachine';
import { SubStateMachine } from '../../Base/SubStateMachine';
import { SpikesOneSubMachine } from './SpikesOneSubMachine';

@ccclass('SpikesStateMachines')
export class SpikesStateMachines extends StateMachine {

  async init() {
    this.animationComponent = this.addComponent(AnimationComponent);

    this.initParams();
    this.initStateMachines();
    await Promise.all(this.resource);
  }

  initParams() {
    this.params.set(PARAMS_NAME_ENUM.SPIKES_ONE, getParamTrigget(false));
    this.params.set(PARAMS_NAME_ENUM.SPIKES_NUMBER, getParamNumber(0));
  }

  initStateMachines() {
    this.stateMachines.set(PARAMS_NAME_ENUM.SPIKES_ONE, new SpikesOneSubMachine(this));
  }

  run() {
    switch (this.currentState) {
      case this.stateMachines.get(PARAMS_NAME_ENUM.SPIKES_ONE):
        if (this.params.get(PARAMS_NAME_ENUM.SPIKES_ONE).value) {
          this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.SPIKES_ONE);
        }
        break;
      default:
        this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.SPIKES_ONE);
        break;
    }
  }

}
