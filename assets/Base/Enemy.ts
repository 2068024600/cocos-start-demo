import { _decorator } from 'cc';
import DataManager from '../RunTime/DataManager';
import EventResource from '../RunTime/EventManager';
import { EVENT_TYPE, DIRECTION_ENUM, ENTITY_STATE_ENUM } from '../Enums';
import { Entity } from '../Base/Entity';
import { IEntity } from '../Levels';
const { ccclass, property } = _decorator;

@ccclass('Enemy')
export abstract class Enemy extends Entity {

    abstract init(enemy: IEntity): void;

    onLoad() {
        EventResource.instance.add(EVENT_TYPE.PLAYER_BOTH, this.onchangeDirection, this);
        EventResource.instance.add(EVENT_TYPE.PLAYER_MOVE_END, this.onchangeDirection, this);
        EventResource.instance.add(EVENT_TYPE.ENEMY_DEATH, this.death, this);
    }

    onDestroy() {
        EventResource.instance.remove(EVENT_TYPE.PLAYER_BOTH, this.onchangeDirection);
        EventResource.instance.remove(EVENT_TYPE.PLAYER_MOVE_END, this.onchangeDirection);
        EventResource.instance.remove(EVENT_TYPE.ENEMY_DEATH, this.death);
    }

    update() {
        super.updatePosition();
    }

    onchangeDirection() {
        /**
         * 怪物死亡无法进行操作
         */
        if (this.state === ENTITY_STATE_ENUM.DEATH) {
            return;
        }
        const {x: playerX, y: playerY } = DataManager.instance.playerInfo;
        const x = Math.abs(playerX - this.x);
        const y = Math.abs(playerY - this.y);
        if (x === y) {
            return;
        }
        if (playerX >= this.x && playerY >= this.y) {
            // 第一象限
            x > y ? this.direction = DIRECTION_ENUM.RIGHT : this.direction = DIRECTION_ENUM.TOP
        } else if (playerX <= this.x && playerY >= this.y) {
            // 第二象限
            x > y ? this.direction = DIRECTION_ENUM.LEFT : this.direction = DIRECTION_ENUM.TOP
        } else if (playerX <= this.x && playerY <= this.y) {
            // 第三象限
            x > y ? this.direction = DIRECTION_ENUM.LEFT : this.direction = DIRECTION_ENUM.BOTTOM
        } else if (playerX >= this.x && playerY <= this.y) {
            // 第四象限
            x > y ? this.direction = DIRECTION_ENUM.RIGHT : this.direction = DIRECTION_ENUM.BOTTOM
        }
        this.state = ENTITY_STATE_ENUM.IDLE;
    }

    death(id: string) {
        if (id === this.id) {
            this.state = ENTITY_STATE_ENUM.DEATH;
        }
    }

}

