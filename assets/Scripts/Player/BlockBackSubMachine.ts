import State from "../../Base/State";
import { StateMachine } from "../../Base/StateMachine";
import { SubStateMachine } from "../../Base/SubStateMachine";
import { PARAMS_NAME_DIRECTION_ENUM, PARAMS_NAME_ENUM, DIRECTION_ENUM } from "../../Enums";

const PATH = 'texture/player';

export class BlockBackSubMachine extends SubStateMachine {

  constructor(public fms: StateMachine) {
    super(fms);
    this.stateMachines.set(PARAMS_NAME_DIRECTION_ENUM.TOP, new State(fms, `${PATH}/blockback/top`));
    this.stateMachines.set(PARAMS_NAME_DIRECTION_ENUM.RIGHT, new State(fms, `${PATH}/blockright/right`));
    this.stateMachines.set(PARAMS_NAME_DIRECTION_ENUM.BOTTOM, new State(fms, `${PATH}/blockfront/bottom`));
    this.stateMachines.set(PARAMS_NAME_DIRECTION_ENUM.LEFT, new State(fms, `${PATH}/blockleft/left`));
  }

  run() {
    const value = this.fms.getParam(PARAMS_NAME_ENUM.DIRECTION).value;
    this.currentState = this.stateMachines.get(DIRECTION_ENUM[value as number]);
  }

}
