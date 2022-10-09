import { _decorator, AnimationClip, AnimationComponent } from 'cc';
const { ccclass, property } = _decorator;
import { FSM_PARAM_TYPE_ENUM, PARAMS_NAME_ENUM } from '../../Enums'
import State from '../../Base/State';
import { getParamTrigget, getParamNumber, StateMachine } from '../../Base/StateMachine';
import { SubStateMachine } from '../../Base/SubStateMachine';
import { IdleSubMachine } from './IdleSubMachine';
import { ClockWiseSubMachine } from './ClockWiseSubMachine';
import { AntiClockWiseSubMachine } from './AntiClockWiseSubMachine';
import { BlockBackSubMachine } from './BlockBackSubMachine';
import { BlockFrontSubMachine } from './BlockFrontSubMachine';
import { BlockLeftSubMachine } from './BlockLeftSubMachine';
import { BlockRightSubMachine } from './BlockRightSubMachine';
import { BlockTurnLeftSubMachine } from './BlockTurnLeftSubMachine';
import { BlockTurnRightSubMachine } from './BlockTurnRightSubMachine';

@ccclass('PlayerStateMachine')
export class PlayerStateMachine extends StateMachine {

  async init() {
    this.animationComponent = this.addComponent(AnimationComponent);

    this.initParams();
    this.initStateMachines();
    this.initAnimationTrigger();
    await Promise.all(this.resource);
  }

  initParams() {
    this.params.set(PARAMS_NAME_ENUM.IDLE, getParamTrigget(false));
    this.params.set(PARAMS_NAME_ENUM.CLOCKWISE, getParamTrigget(false));
    this.params.set(PARAMS_NAME_ENUM.ANTICLOCKWISE, getParamTrigget(false));
    this.params.set(PARAMS_NAME_ENUM.DIRECTION, getParamNumber(0));
    this.params.set(PARAMS_NAME_ENUM.BLOCK_BACK, getParamTrigget(false));
    this.params.set(PARAMS_NAME_ENUM.BLOCK_FRONT, getParamTrigget(false));
    this.params.set(PARAMS_NAME_ENUM.BLOCK_LEFT, getParamTrigget(false));
    this.params.set(PARAMS_NAME_ENUM.BLOCK_RIGHT, getParamTrigget(false));
    this.params.set(PARAMS_NAME_ENUM.BLOCK_TURNLEFT, getParamTrigget(false));
    this.params.set(PARAMS_NAME_ENUM.BLOCK_TURNRIGHT, getParamTrigget(false));
  }

  initStateMachines() {
    this.stateMachines.set(PARAMS_NAME_ENUM.IDLE, new IdleSubMachine(this));
    this.stateMachines.set(PARAMS_NAME_ENUM.CLOCKWISE, new ClockWiseSubMachine(this));
    this.stateMachines.set(PARAMS_NAME_ENUM.ANTICLOCKWISE, new AntiClockWiseSubMachine(this));
    this.stateMachines.set(PARAMS_NAME_ENUM.BLOCK_BACK, new BlockBackSubMachine(this));
    this.stateMachines.set(PARAMS_NAME_ENUM.BLOCK_FRONT, new BlockFrontSubMachine(this));
    this.stateMachines.set(PARAMS_NAME_ENUM.BLOCK_LEFT, new BlockLeftSubMachine(this));
    this.stateMachines.set(PARAMS_NAME_ENUM.BLOCK_RIGHT, new BlockRightSubMachine(this));
    this.stateMachines.set(PARAMS_NAME_ENUM.BLOCK_TURNLEFT, new BlockTurnLeftSubMachine(this));
    this.stateMachines.set(PARAMS_NAME_ENUM.BLOCK_TURNRIGHT, new BlockTurnRightSubMachine(this));
  }

  run() {
    switch (this.currentState) {
      case this.stateMachines.get(PARAMS_NAME_ENUM.CLOCKWISE):
      case this.stateMachines.get(PARAMS_NAME_ENUM.ANTICLOCKWISE):
      case this.stateMachines.get(PARAMS_NAME_ENUM.BLOCK_BACK):
      case this.stateMachines.get(PARAMS_NAME_ENUM.BLOCK_FRONT):
      case this.stateMachines.get(PARAMS_NAME_ENUM.BLOCK_LEFT):
      case this.stateMachines.get(PARAMS_NAME_ENUM.BLOCK_RIGHT):
      case this.stateMachines.get(PARAMS_NAME_ENUM.BLOCK_TURNLEFT):
      case this.stateMachines.get(PARAMS_NAME_ENUM.BLOCK_TURNRIGHT):
      case this.stateMachines.get(PARAMS_NAME_ENUM.IDLE):
        if (this.params.get(PARAMS_NAME_ENUM.CLOCKWISE).value) {
          this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.CLOCKWISE);
        } else if (this.params.get(PARAMS_NAME_ENUM.IDLE).value){
          this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.IDLE);
        } else if (this.params.get(PARAMS_NAME_ENUM.ANTICLOCKWISE).value){
          this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.ANTICLOCKWISE);
        } else if (this.params.get(PARAMS_NAME_ENUM.BLOCK_BACK).value){
          this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.BLOCK_BACK);
        } else if (this.params.get(PARAMS_NAME_ENUM.BLOCK_FRONT).value){
          this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.BLOCK_FRONT);
        } else if (this.params.get(PARAMS_NAME_ENUM.BLOCK_LEFT).value){
          this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.BLOCK_LEFT);
        } else if (this.params.get(PARAMS_NAME_ENUM.BLOCK_RIGHT).value){
          this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.BLOCK_RIGHT);
        } else if (this.params.get(PARAMS_NAME_ENUM.BLOCK_TURNLEFT).value){
          this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.BLOCK_TURNLEFT);
        } else if (this.params.get(PARAMS_NAME_ENUM.BLOCK_TURNRIGHT).value){
          this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.BLOCK_TURNRIGHT);
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
      const trigger = ['turn', 'block'];
      if (trigger.find(value => name.includes(value))) {
        this.setParam(PARAMS_NAME_ENUM.IDLE, getParamTrigget(true));
      }
    })
  }

}
