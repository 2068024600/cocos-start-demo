import State from "../../Base/State";
import { StateMachine } from "../../Base/StateMachine";
import { SubStateMachine } from "../../Base/SubStateMachine";
import { PARAMS_NAME_ENUM, PARAMS_SPIKES_NUMBER_ENUM, SPIKES_NUMBER_ENUM } from "../../Enums";

const PATH = "texture/spikes/spikestwo"

export class SpikesTwoSubMachine extends SubStateMachine {

  constructor(public fms: StateMachine) {
    super(fms);
    this.stateMachines.set(PARAMS_SPIKES_NUMBER_ENUM.ZERO, new State(fms, `${PATH}/zero`));
    this.stateMachines.set(PARAMS_SPIKES_NUMBER_ENUM.ONE, new State(fms, `${PATH}/one`));
    this.stateMachines.set(PARAMS_SPIKES_NUMBER_ENUM.TWO, new State(fms, `${PATH}/two`));
    this.stateMachines.set(PARAMS_SPIKES_NUMBER_ENUM.THREE, new State(fms, `${PATH}/three`));
  }

  run() {
    const value = this.fms.getParam(PARAMS_NAME_ENUM.SPIKES_NUMBER).value;
    this.currentState = this.stateMachines.get(SPIKES_NUMBER_ENUM[value as number]);
  }

}
