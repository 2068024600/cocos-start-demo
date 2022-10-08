import State from './State';
import { StateMachine } from './StateMachine';

export abstract class SubStateMachine {
  private _currentState: State = null;
  stateMachines: Map<string, State> = new Map();

  constructor(public fms: StateMachine) {}

  public get currentState() {
      return this._currentState;
  }

  public set currentState(state: State) {
      this._currentState = state;
      this._currentState.run()
  }

  abstract run(): void;

}
