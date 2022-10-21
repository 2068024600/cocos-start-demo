import State from "../../Base/State";
import { StateMachine } from "../../Base/StateMachine";
import { SubStateMachine } from "../../Base/SubStateMachine";
import { PARAMS_NAME_DIRECTION_ENUM, PARAMS_NAME_ENUM, DIRECTION_ENUM } from "../../Enums";

const PATH = "texture/ironskeleton/death"

export class DeathSubMachine extends SubStateMachine {

  constructor(public fms: StateMachine) {
    super(fms);
    this.stateMachines.set(PARAMS_NAME_DIRECTION_ENUM.TOP, new State(fms, `${PATH}/top`));
    this.stateMachines.set(PARAMS_NAME_DIRECTION_ENUM.RIGHT, new State(fms, `${PATH}/right`));
    this.stateMachines.set(PARAMS_NAME_DIRECTION_ENUM.BOTTOM, new State(fms, `${PATH}/bottom`));
    this.stateMachines.set(PARAMS_NAME_DIRECTION_ENUM.LEFT, new State(fms, `${PATH}/left`));
  }

  run() {
    const value = this.fms.getParam(PARAMS_NAME_ENUM.DIRECTION).value;
    this.currentState = this.stateMachines.get(DIRECTION_ENUM[value as number]);
  }

}
