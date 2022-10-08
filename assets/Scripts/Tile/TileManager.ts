
import { _decorator, Component, Sprite, SpriteFrame, UITransform } from 'cc';
import { TILE_TYPE_ENUM } from '../../Enums';
const { ccclass, property } = _decorator;

// 设置瓦片宽高
export const TILE_WIDTH = 55;
export const TILE_HEIGHT = 55;

const MOVEABLE_TYPE = [TILE_TYPE_ENUM.FLOOR];
const TURNABLE_TYPE = [TILE_TYPE_ENUM.FLOOR, TILE_TYPE_ENUM.CLIFF_CENTER, TILE_TYPE_ENUM.CLIFF_LEFT, TILE_TYPE_ENUM.CLIFF_RIGHT];

@ccclass('TileManager')
export class TileManager extends Component {

    type: TILE_TYPE_ENUM;
    moveable: boolean = false;
    turnable: boolean = false;

    init(type: TILE_TYPE_ENUM, spriteFrame : SpriteFrame, i: number, j: number) {
        this.type = type;
        if (MOVEABLE_TYPE.indexOf(type) > -1) {
            this.moveable = true;
        }
        if (TURNABLE_TYPE.indexOf(type) > -1) {
            this.turnable = true;
        }

        // 设置每个瓦片的图片资源
        const sprite = this.node.addComponent(Sprite);
        sprite.sizeMode = Sprite.SizeMode.CUSTOM;
        sprite.spriteFrame = spriteFrame;

        // 设置UI的矩形信息
        const transform = this.node.addComponent(UITransform);
        transform.setContentSize(TILE_WIDTH, TILE_HEIGHT);

        // 设置node的位置
        this.node.setPosition(i * TILE_WIDTH, -j * TILE_HEIGHT);
    }
}
