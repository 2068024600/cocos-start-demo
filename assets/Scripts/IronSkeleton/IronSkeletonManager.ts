import { _decorator, UITransform, Sprite } from 'cc';
import { TILE_HEIGHT, TILE_WIDTH } from '../Tile/TileManager';
import { DIRECTION_ENUM, ENTITY_STATE_ENUM, ENTITY_TYPE_ENUM } from '../../Enums';
import { Enemy } from '../../Base/Enemy';
import { IronSkeletonStateMachine } from './IronSkeletonStateMachine';
import { IEntity } from '../../Levels';
const { ccclass, property } = _decorator;

// 人物大小
const ENEMY_WIDTH = TILE_WIDTH * 4;
const ENEMY_HEIGHT = TILE_HEIGHT * 4;

@ccclass('IronSkeletonManager')
export class IronSkeletonManager extends Enemy {

    async init(enemy: IEntity) {
        this.fsm = this.addComponent(IronSkeletonStateMachine);
        await this.fsm.init();

        const sprite = this.addComponent(Sprite);
        sprite.sizeMode = Sprite.SizeMode.CUSTOM;

        const transform = this.addComponent(UITransform);
        transform.setContentSize(ENEMY_WIDTH, ENEMY_HEIGHT);

        super.initParams(enemy);
    }

    update() {
        super.updatePosition();
    }

}

