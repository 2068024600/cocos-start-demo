import { _decorator, UITransform, Sprite } from 'cc';
import DataManager from '../../RunTime/DataManager';
import EventResource from '../../RunTime/EventManager';
import { TILE_HEIGHT, TILE_WIDTH } from '../Tile/TileManager';
import { EVENT_TYPE, DIRECTION_ENUM, ENTITY_STATE_ENUM, ENTITY_TYPE_ENUM } from '../../Enums';
import { BurstStateMachine } from './BurstStateMachine';
import { Entity } from '../../Base/Entity';
import { IEntity } from '../../Levels';
const { ccclass, property } = _decorator;

@ccclass('BurstManager')
export class BurstManager extends Entity {

    async init(burst: IEntity) {
        this.fsm = this.addComponent(BurstStateMachine);
        await this.fsm.init();

        const sprite = this.addComponent(Sprite);
        sprite.sizeMode = Sprite.SizeMode.CUSTOM;

        const transform = this.addComponent(UITransform);
        transform.setContentSize(TILE_WIDTH, TILE_HEIGHT);

        super.initParams(burst);
    }

    onLoad() {
        EventResource.instance.add(EVENT_TYPE.PLAYER_MOVE_END, this.attack, this);
    }

    onDestroy() {
        EventResource.instance.remove(EVENT_TYPE.PLAYER_MOVE_END, this.attack);
    }

    update() {
        super.updatePosition();
    }

    attack() {
        /**
         * 怪物死亡无法进行操作
         */
        if (this.state === ENTITY_STATE_ENUM.DEATH) {
            return;
        }
        const {x: playerX, y: playerY } = DataManager.instance.playerInfo;

        if (this.x == playerX && this.y === playerY && this.state === ENTITY_STATE_ENUM.IDLE) {
            this.state = ENTITY_STATE_ENUM.ATTACK;
            return;
        }
        if (this.state === ENTITY_STATE_ENUM.ATTACK) {
            this.state = ENTITY_STATE_ENUM.DEATH;
            if (this.x == playerX && this.y === playerY) {
                // 玩家死亡
                EventResource.instance.exec(EVENT_TYPE.PLAYER_DEATH, [ENTITY_STATE_ENUM.AIRDEATH]);
                return;
            }
        }
    }

}

