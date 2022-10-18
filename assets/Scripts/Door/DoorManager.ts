import { _decorator, Component, Node, Sprite, UITransform } from 'cc';
import { Entity } from '../../Base/Entity';
import { DIRECTION_ENUM, ENTITY_STATE_ENUM, ENTITY_TYPE_ENUM, EVENT_TYPE } from '../../Enums';
import { IEntity } from '../../Levels';
import DataManager from '../../RunTime/DataManager';
import EventResource from '../../RunTime/EventManager';
import { TILE_WIDTH, TILE_HEIGHT } from '../Tile/TileManager';
import { DoorStateMachine } from './DoorStateMachine';
const { ccclass, property } = _decorator;

const DOOR_WIDTH = TILE_WIDTH * 4;
const DOOR_HEIGHT = TILE_HEIGHT * 4;

@ccclass('DoorManager')
export class DoorManager extends Entity {

    onLoad() {
        EventResource.instance.add(EVENT_TYPE.DOOR_OPEN, this.onOpen, this);
    }

    onDestroy() {
        EventResource.instance.remove(EVENT_TYPE.DOOR_OPEN, this.onOpen);
    }

    async init(door: IEntity) {
        this.fsm = this.addComponent(DoorStateMachine);
        await this.fsm.init();

        const sprite = this.addComponent(Sprite);
        sprite.sizeMode = Sprite.SizeMode.CUSTOM;
        const transform = this.addComponent(UITransform);
        transform.setContentSize(DOOR_WIDTH, DOOR_HEIGHT);

        super.initParams(door);

        super.updatePosition();
    }

    onOpen() {
        const enemyList = DataManager.instance.enemyInfo.filter(value => value.state !== ENTITY_STATE_ENUM.DEATH);
        /**
         * 场上的敌人已经全部死亡
         */
        if (enemyList.length === 0 && this.state !== ENTITY_STATE_ENUM.DEATH) {
            this.state = ENTITY_STATE_ENUM.DEATH;
        }
    }

}
