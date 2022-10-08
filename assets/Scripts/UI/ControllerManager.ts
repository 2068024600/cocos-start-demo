
import { _decorator, Component, Node, Event } from 'cc';
import EventResource from '../../RunTime/EventManager';
const { ccclass, property } = _decorator;
import { EVENT_TYPE, PLAYERACTION_TYPE } from '../../Enums'


@ccclass('ControllerManager')
export class ControllerManager extends Component {

    /**
     * 角色动作控制
     * @param playerActionType 角色动作类型
     */
    playerAction(evt: Event, playerActionType: PLAYERACTION_TYPE) {
        EventResource.instance.exec(EVENT_TYPE.PLAYER_MOVE, [playerActionType]);
    }

}
