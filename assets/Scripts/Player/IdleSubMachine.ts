import { AnimationClip } from "cc";
import State from "../../Base/State";
import { StateMachine } from "../../Base/StateMachine";
import { SubStateMachine } from "../../Base/SubStateMachine";
import { PARAMS_NAME_DIRECTIO_ENUM, PARAMS_NAME_ENUM, DIRECTION_ENUM } from "../../Enums";

const PATH = "texture/player/idle"

export class IdleSubMachine extends SubStateMachine {

  constructor(public fms: StateMachine) {
    super(fms);
    this.stateMachines.set(PARAMS_NAME_DIRECTIO_ENUM.TOP, new State(fms, `${PATH}/top`, AnimationClip.WrapMode.Loop));
    this.stateMachines.set(PARAMS_NAME_DIRECTIO_ENUM.RIGHT, new State(fms, `${PATH}/right`, AnimationClip.WrapMode.Loop));
    this.stateMachines.set(PARAMS_NAME_DIRECTIO_ENUM.BOTTOM, new State(fms, `${PATH}/bottom`, AnimationClip.WrapMode.Loop));
    this.stateMachines.set(PARAMS_NAME_DIRECTIO_ENUM.LEFT, new State(fms, `${PATH}/left`, AnimationClip.WrapMode.Loop));
  }

  run() {
    const value = this.fms.getParam(PARAMS_NAME_ENUM.DIRECTION).value;
    this.currentState = this.stateMachines.get(DIRECTION_ENUM[value as number]);
  }

}
