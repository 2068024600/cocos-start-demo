import { _decorator, AnimationComponent } from 'cc';
const { ccclass, property } = _decorator;
import { PARAMS_NAME_ENUM } from '../../Enums'
import { getParamTrigget, getParamNumber, StateMachine } from '../../Base/StateMachine';
import { SpikesOneSubMachine } from './SpikesOneSubMachine';
import { SpikesTwoSubMachine } from './SpikesTwoSubMachine';
import { SpikesThreeSubMachine } from './SpikesThreeSubMachine';
import { SpikesFourSubMachine } from './SpikesFourSubMachine';

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
    this.params.set(PARAMS_NAME_ENUM.SPIKES_TWO, getParamTrigget(false));
    this.params.set(PARAMS_NAME_ENUM.SPIKES_THREE, getParamTrigget(false));
    this.params.set(PARAMS_NAME_ENUM.SPIKES_FOUR, getParamTrigget(false));
    this.params.set(PARAMS_NAME_ENUM.SPIKES_NUMBER, getParamNumber(0));
  }

  initStateMachines() {
    this.stateMachines.set(PARAMS_NAME_ENUM.SPIKES_ONE, new SpikesOneSubMachine(this));
    this.stateMachines.set(PARAMS_NAME_ENUM.SPIKES_TWO, new SpikesTwoSubMachine(this));
    this.stateMachines.set(PARAMS_NAME_ENUM.SPIKES_THREE, new SpikesThreeSubMachine(this));
    this.stateMachines.set(PARAMS_NAME_ENUM.SPIKES_FOUR, new SpikesFourSubMachine(this));
  }

  run() {
    switch (this.currentState) {
      case this.stateMachines.get(PARAMS_NAME_ENUM.SPIKES_ONE):
      case this.stateMachines.get(PARAMS_NAME_ENUM.SPIKES_TWO):
      case this.stateMachines.get(PARAMS_NAME_ENUM.SPIKES_THREE):
      case this.stateMachines.get(PARAMS_NAME_ENUM.SPIKES_FOUR):
        if (this.params.get(PARAMS_NAME_ENUM.SPIKES_ONE).value) {
          this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.SPIKES_ONE);
        } else if (this.params.get(PARAMS_NAME_ENUM.SPIKES_TWO).value) {
          this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.SPIKES_TWO);
        } else if (this.params.get(PARAMS_NAME_ENUM.SPIKES_THREE).value) {
          this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.SPIKES_THREE);
        } else if (this.params.get(PARAMS_NAME_ENUM.SPIKES_FOUR).value) {
          this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.SPIKES_FOUR);
        }
        break;
      default:
        this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.SPIKES_ONE);
        break;
    }
  }

}
