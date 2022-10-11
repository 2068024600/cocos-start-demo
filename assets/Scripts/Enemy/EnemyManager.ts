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

    onLoad() {
        EventResource.instance.add(EVENT_TYPE.PLAYER_BOTH, this.onchangeDirection, this);
        EventResource.instance.add(EVENT_TYPE.ENEMY_TURN, this.onchangeDirection, this);
    }

    update() {
        super.updatePosition();
    }

    onchangeDirection(init = false) {
        const {x: playerX, y: playerY } = DataManager.instance.playerInfo;
        const x = Math.abs(playerX - this.x);
        const y = Math.abs(playerY - this.y);
        if (x === y && !init) {
            return;
        }
        this.state = ENTITY_STATE_ENUM.IDLE;
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

        /* 敌人攻击逻辑当玩家距离敌人一格位置后,发动攻击 */
        if (x+y === 1) {
            this.state = ENTITY_STATE_ENUM.ATTACK;
        }
      }

}

