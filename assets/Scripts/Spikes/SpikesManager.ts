
import { _decorator, Component, Node, SpriteFrame, UITransform, Sprite } from 'cc';
import { getParamNumber, getParamTrigget, StateMachine } from '../../Base/StateMachine';
import { ENTITY_STATE_ENUM, EVENT_TYPE, PARAMS_NAME_ENUM, SPIKES_TYPE_ENUM } from '../../Enums';
import DataManager from '../../RunTime/DataManager';
import EventResource from '../../RunTime/EventManager';
import { TILE_HEIGHT, TILE_WIDTH } from '../Tile/TileManager';
import { SpikesStateMachines } from './SpikesStateMachines';
const { ccclass, property } = _decorator;

const SPIKES_WIDTH = 4 * TILE_WIDTH;
const SPIKES_HEIGHT = 4 * TILE_HEIGHT;

@ccclass('SpikesManager')
export class SpikesManager extends Component {

    x: number;
    y: number;
    /**
     * 刺类型
     */
    private _type: SPIKES_TYPE_ENUM;
    /**
     * 当前刺数量
     */
    private _number: number;
    /**
     * 刺总数量
     */
    totalNumber: number;

    /**
     * 状态机
     */
    fsm: StateMachine;

    onLoad() {
        EventResource.instance.add(EVENT_TYPE.PLAYER_MOVE_END, this.onChangeNumber, this);
    }

    update() {
        this.node.setPosition(this.x * TILE_WIDTH, this.y * TILE_HEIGHT);
    }

    async init() {
        this.fsm = this.addComponent(SpikesStateMachines);
        await this.fsm.init();

        const sprite = this.addComponent(Sprite);
        sprite.sizeMode = Sprite.SizeMode.CUSTOM;
        const transform = this.addComponent(UITransform);
        transform.setContentSize(SPIKES_WIDTH, SPIKES_HEIGHT);

        this.x = 2;
        this.y = -5;
        this.type = SPIKES_TYPE_ENUM.SPIKES_ONE;
        this.number = 0;
        this.totalNumber = 2;

    }

    onChangeNumber() {
        const number = this.number + 1;
        this.number = number % (this.totalNumber + 1);

        // 死亡判断
        const {x: playerX, y: playerY} = DataManager.instance.playerInfo;
        if (playerX === this.x && playerY === this.y && this.number === this.totalNumber) {
            EventResource.instance.exec(EVENT_TYPE.PLAYER_DEATH, [ENTITY_STATE_ENUM.DEATH]);
        }
    }

    public get type() {
        return this._type;
    }

    public set type(type: SPIKES_TYPE_ENUM) {
        this._type = type;
        this.fsm.setParam(PARAMS_NAME_ENUM.SPIKES_ONE, getParamTrigget(true));
    }

    public set number(number: number) {
        this._number = number;
        this.fsm.setParam(PARAMS_NAME_ENUM.SPIKES_NUMBER, getParamNumber(number));
        this.fsm.setParam(PARAMS_NAME_ENUM.SPIKES_ONE, getParamTrigget(true));
    }

    public get number() {
        return this._number;
    }
}
