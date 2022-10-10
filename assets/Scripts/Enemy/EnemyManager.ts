import { _decorator, UITransform, Sprite } from 'cc';
import DataManager from '../../RunTime/DataManager';
import EventResource from '../../RunTime/EventManager';
import { TILE_HEIGHT, TILE_WIDTH } from '../Tile/TileManager';
import { PLAYERACTION_TYPE, EVENT_TYPE, DIRECTION_ENUM, ENTITY_STATE_ENUM, ENTITY_TYPE_ENUM } from '../../Enums';
import { Entity } from '../../Base/Entity';
import { EnemyStateMachine } from './EnemyStateMachine';
const { ccclass, property } = _decorator;

// 人物大小
const ENEMY_WIDTH = TILE_WIDTH * 4;
const ENEMY_HEIGHT = TILE_HEIGHT * 4;

@ccclass('EnemyManager')
export class EnemyManager extends Entity {

    async init() {
        super.initParams({
            x: 7,
            y: -6,
            direction: DIRECTION_ENUM.TOP,
            state: ENTITY_STATE_ENUM.IDLE,
            type: ENTITY_TYPE_ENUM.PALYER
        });

        const sprite = this.addComponent(Sprite);
        sprite.sizeMode = Sprite.SizeMode.CUSTOM;

        const transform = this.addComponent(UITransform);
        transform.setContentSize(ENEMY_WIDTH, ENEMY_HEIGHT);

        this.fsm = this.addComponent(EnemyStateMachine)
        await this.fsm.init()
        // 设置人物初始状态
        this.state = ENTITY_STATE_ENUM.IDLE
    }

    update() {
        super.updatePosition();
    }

}

