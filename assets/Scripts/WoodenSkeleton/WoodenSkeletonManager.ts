import { _decorator, UITransform, Sprite } from 'cc';
import DataManager from '../../RunTime/DataManager';
import EventResource from '../../RunTime/EventManager';
import { TILE_HEIGHT, TILE_WIDTH } from '../Tile/TileManager';
import { EVENT_TYPE, DIRECTION_ENUM, ENTITY_STATE_ENUM, ENTITY_TYPE_ENUM } from '../../Enums';
import { WoodenSkeletonStateMachine } from './WoodenSkeletonStateMachine';
import { Enemy } from '../../Base/Enemy';
import { IEntity } from '../../Levels';
const { ccclass, property } = _decorator;

// 人物大小
const ENEMY_WIDTH = TILE_WIDTH * 4;
const ENEMY_HEIGHT = TILE_HEIGHT * 4;

@ccclass('WoodenSkeletonManager')
export class WoodenSkeletonManager extends Enemy {

    async init(enemy: IEntity) {
        this.fsm = this.addComponent(WoodenSkeletonStateMachine);
        await this.fsm.init();

        const sprite = this.addComponent(Sprite);
        sprite.sizeMode = Sprite.SizeMode.CUSTOM;

        const transform = this.addComponent(UITransform);
        transform.setContentSize(ENEMY_WIDTH, ENEMY_HEIGHT);

        super.initParams(enemy);
    }

    onLoad() {
        super.onLoad();
        EventResource.instance.add(EVENT_TYPE.PLAYER_MOVE_END, this.attack, this);
    }

    onDestroy() {
        super.onDestroy();
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
        const x = Math.abs(playerX - this.x);
        const y = Math.abs(playerY - this.y);

        /* 敌人攻击逻辑: 当玩家距离敌人一格位置后,发动攻击 */
        if (x+y === 1) {
            this.state = ENTITY_STATE_ENUM.ATTACK;
            // 角色死亡
            EventResource.instance.exec(EVENT_TYPE.PLAYER_DEATH, [ENTITY_STATE_ENUM.DEATH]);
        }
    }

}

