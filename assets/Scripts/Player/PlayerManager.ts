import { _decorator, UITransform, Sprite } from 'cc';
import DataManager from '../../RunTime/DataManager';
import EventResource from '../../RunTime/EventManager';
import { TILE_HEIGHT, TILE_WIDTH } from '../Tile/TileManager';
import { PLAYERACTION_TYPE, EVENT_TYPE, DIRECTION_ENUM, ENTITY_STATE_ENUM } from '../../Enums'
import { PlayerStateMachine } from './PlayerStateMachine';
import { Entity } from '../../Base/Entity';
import { IEntity } from '../../Levels';
const { ccclass, property } = _decorator;

// 人物大小
const PLAYER_WIDTH = TILE_WIDTH * 4;
const PLAYER_HEIGHT = TILE_HEIGHT * 4;

@ccclass('PlayerManager')
export class PlayerManager extends Entity {

    // 定义人物坐标
    targetX: number;
    targetY: number;
    /**
     * 人物是否正在移动
     */
    isMoving = false;

    /**
     * 移动速度
     */
    private readonly speed: number = 1 / 10;


    onLoad() {
        EventResource.instance.add(EVENT_TYPE.PLAYER_MOVE, this.inputHandle, this)
        EventResource.instance.add(EVENT_TYPE.PLAYER_DEATH, this.death, this);
    }

    update() {
        if (this.x < this.targetX) {
            this.x += this.speed
        } else if (this.x > this.targetX) {
            this.x -= this.speed
        }

        if (this.y < this.targetY) {
            this.y += this.speed
        } else if (this.y > this.targetY) {
            this.y -= this.speed
        }

        // 防止人物移动完成后，贴图闪烁的问题
        if (Math.abs(this.x - this.targetX) <= 0.1 && Math.abs(this.y - this.targetY) <= 0.1 && this.isMoving) {
            this.x = this.targetX;
            this.y = this.targetY;
            this.isMoving = false;
            DataManager.instance.playerInfo = this;
            EventResource.instance.exec(EVENT_TYPE.ENEMY_TURN);
            EventResource.instance.exec(EVENT_TYPE.ENEMY_ATK);
        }
        // 设置人物的位置
        super.updatePosition()
    }

    inputHandle(playerActionType: PLAYERACTION_TYPE) {
        /**
         * 若人物已经死亡或者正在做攻击动作
         */
        if (this.state === ENTITY_STATE_ENUM.DEATH || this.state === ENTITY_STATE_ENUM.ATTACK) {
            return;
        }
        const id = this.attack(playerActionType);
        if (id) {
            this.state = ENTITY_STATE_ENUM.ATTACK;
            EventResource.instance.exec(EVENT_TYPE.ENEMY_DEATH, [id]);
            EventResource.instance.exec(EVENT_TYPE.DOOR_OPEN);
            return;
        }
        if (this.willBlock(playerActionType)) {
            switch (playerActionType) {
                case PLAYERACTION_TYPE.UP_MOVE: this.state = ENTITY_STATE_ENUM.BLOCK_FRONT;break;
                case PLAYERACTION_TYPE.DOWN_MOVE: this.state = ENTITY_STATE_ENUM.BLOCK_BACK;break;
                case PLAYERACTION_TYPE.LEFT_MOVE: this.state = ENTITY_STATE_ENUM.BLOCK_LEFT;break;
                case PLAYERACTION_TYPE.RIGHT_MOVE: this.state = ENTITY_STATE_ENUM.BLOCK_RIGHT;break;
                case PLAYERACTION_TYPE.ANTICLOCKWISE: this.state = ENTITY_STATE_ENUM.BLOCK_TURNLEFT;break;
                case PLAYERACTION_TYPE.CLOCKWISE: this.state = ENTITY_STATE_ENUM.BLOCK_TURNRIGHT;break;
            }
            return;
        }
        this.move(playerActionType);
    }

    /**
     * 人物移动逻辑
     * @param playerActionType
     */
    move(playerActionType: PLAYERACTION_TYPE) {
        if (playerActionType === PLAYERACTION_TYPE.UP_MOVE) {
            this.targetY++;
            this.isMoving = true;
        } else if (playerActionType === PLAYERACTION_TYPE.DOWN_MOVE) {
            this.targetY--;
            this.isMoving = true;
        } else if (playerActionType === PLAYERACTION_TYPE.LEFT_MOVE) {
            this.targetX--;
            this.isMoving = true;
        } else if (playerActionType === PLAYERACTION_TYPE.RIGHT_MOVE) {
            this.targetX++;
            this.isMoving = true;
        } else if (playerActionType === PLAYERACTION_TYPE.CLOCKWISE) {
            this.state = ENTITY_STATE_ENUM.CLOCKWISE;
            this.direction = (this.direction + 1) % 4;
        } else if (playerActionType === PLAYERACTION_TYPE.ANTICLOCKWISE) {
            this.state = ENTITY_STATE_ENUM.ANTICLOCKWISE;
            this.direction = (this.direction + 4 - 1) % 4;
        }
    }

    /**
     * 人物死亡逻辑
     */
    death() {
        this.state = ENTITY_STATE_ENUM.DEATH;
    }

    /**
     * 人物攻击逻辑
     * @param playerActionType
     */
    attack(playerActionType: PLAYERACTION_TYPE) {
        /**
         * 当有敌人在人物朝向方向且距离两格远时，攻击敌人
         */
        const enemyList = DataManager.instance.enemyInfo.filter(value => value.state !== ENTITY_STATE_ENUM.DEATH);
        for (const enemy of enemyList) {
            const {x: enemyX, y: enemyY, id: enemyId} = enemy;
            if (
                this.direction === DIRECTION_ENUM.TOP &&
                playerActionType === PLAYERACTION_TYPE.UP_MOVE &&
                enemyY === this.targetY + 2 &&
                enemyX === this.x
              ) {
                return enemyId
              } else if (
                this.direction === DIRECTION_ENUM.BOTTOM &&
                playerActionType === PLAYERACTION_TYPE.DOWN_MOVE &&
                enemyY === this.targetY - 2 &&
                enemyX === this.x
              ) {
                return enemyId
              } else if (
                this.direction === DIRECTION_ENUM.LEFT &&
                playerActionType === PLAYERACTION_TYPE.LEFT_MOVE &&
                enemyX === this.targetX - 2 &&
                enemyY === this.y
              ) {
                return enemyId
              } else if (
                this.direction === DIRECTION_ENUM.RIGHT &&
                playerActionType === PLAYERACTION_TYPE.RIGHT_MOVE &&
                enemyX === this.targetX + 2 &&
                enemyY === this.y
              ) {
                return enemyId
              }
        }
        return '';
    }

    async init(playerInfo: IEntity) {
        this.fsm = this.addComponent(PlayerStateMachine)
        await this.fsm.init();

        const sprite = this.addComponent(Sprite);
        sprite.sizeMode = Sprite.SizeMode.CUSTOM;

        const transform = this.addComponent(UITransform);
        transform.setContentSize(PLAYER_WIDTH, PLAYER_HEIGHT);

        /**
         * 参数初始化
         */
        super.initParams(playerInfo);
        this.targetX = playerInfo.x;
        this.targetY = playerInfo.y;
    }

    willBlock(playerActionType: PLAYERACTION_TYPE) {
        const {targetX: x, targetY: y, direction} = this;
        const { tileMapInfo, doorInfo } = DataManager.instance;

        if (playerActionType === PLAYERACTION_TYPE.UP_MOVE) {
            /**
             * 人物向上移动
             */
            if (direction === DIRECTION_ENUM.TOP) {
                /**
                 * 人物方向朝上
                 */
                const playerNextY = y + 1;
                const weaponNextY = y + 2;
                /**
                 * 判断人物是否即将越过边界
                 */
                if (playerNextY > 0) {
                    return true;
                }
                /**
                 * 判断是否是门
                 */
                if (doorInfo.x === this.x && (doorInfo.y === playerNextY || doorInfo.y === weaponNextY) && doorInfo.state === ENTITY_STATE_ENUM.IDLE) {
                    return true;
                }
                const playerNextTile = tileMapInfo[x][Math.abs(playerNextY)];
                const weaponNextTile = tileMapInfo[x][Math.abs(weaponNextY)];
                if (playerNextTile?.moveable && weaponNextTile?.turnable) {

                } else {
                    return true;
                }
            } else if (direction === DIRECTION_ENUM.RIGHT) {
                /**
                 * 人物方向朝右
                 */
                const playerNextY = y + 1;
                const weaponNextX = x + 1;
                const weaponNextY = y + 1;
                if (playerNextY > 0) {
                    return true;
                }
                /**
                 * 判断是否是门
                 */
                if ((doorInfo.x === this.x || doorInfo.x === weaponNextX) && (doorInfo.y === playerNextY || doorInfo.y === weaponNextY) && doorInfo.state === ENTITY_STATE_ENUM.IDLE) {
                    return true;
                }
                const playerNextTile = tileMapInfo[x][Math.abs(playerNextY)];
                const weaponNextTile = tileMapInfo[weaponNextX][Math.abs(weaponNextY)];
                if (playerNextTile?.moveable && weaponNextTile?.turnable) {

                } else {
                    return true;
                }
            } else if (direction === DIRECTION_ENUM.BOTTOM) {
                /**
                 * 人物方向朝下
                 */
                const playerNextY = y + 1;
                const weaponNextY = y;
                if (playerNextY > 0) {
                    return true;
                }
                /**
                 * 判断是否是门
                 */
                if (doorInfo.x === this.x && (doorInfo.y === playerNextY || doorInfo.y === weaponNextY) && doorInfo.state === ENTITY_STATE_ENUM.IDLE) {
                    return true;
                }
                const playerNextTile = tileMapInfo[x][Math.abs(playerNextY)];
                const weaponNextTile = tileMapInfo[x][Math.abs(weaponNextY)];
                if (playerNextTile?.moveable && weaponNextTile?.turnable) {

                } else {
                    return true;
                }
            } else if (direction === DIRECTION_ENUM.LEFT) {
                /**
                 * 人物方向朝左
                 */
                const playerNextY = y + 1;
                const weaponNextX = x - 1;
                const weaponNextY = y + 1;
                if (playerNextY > 0) {
                    return true;
                }
                /**
                 * 判断是否是门
                 */
                 if ((doorInfo.x === this.x || doorInfo.x === weaponNextX) && (doorInfo.y === playerNextY || doorInfo.y === weaponNextY) && doorInfo.state === ENTITY_STATE_ENUM.IDLE) {
                    return true;
                }
                const playerNextTile = tileMapInfo[x][Math.abs(playerNextY)];
                const weaponNextTile = tileMapInfo[weaponNextX][Math.abs(weaponNextY)];
                if (playerNextTile?.moveable && weaponNextTile?.turnable) {

                } else {
                    return true;
                }
            }
        } else if (playerActionType === PLAYERACTION_TYPE.RIGHT_MOVE) {
            /**
             * 人物向右移动
             */
            if (direction === DIRECTION_ENUM.TOP) {
                /**
                 * 人物方向朝上
                 */
                const playerNextX = x + 1;
                const weaponNextX = x + 1;
                const weaponNextY = y + 1;
                if (playerNextX > tileMapInfo.length) {
                    return true;
                }
                /**
                 * 判断是否是门
                 */
                if ((doorInfo.x === playerNextX || doorInfo.x === weaponNextX) && (doorInfo.y === this.y || doorInfo.y === weaponNextY) && doorInfo.state === ENTITY_STATE_ENUM.IDLE) {
                    return true;
                }
                const playerNextTile = tileMapInfo[playerNextX][Math.abs(y)];
                const weaponNextTile = tileMapInfo[weaponNextX][Math.abs(weaponNextY)];
                if (playerNextTile?.moveable && weaponNextTile?.turnable) {

                } else {
                    return true;
                }
            } else if (direction === DIRECTION_ENUM.RIGHT) {
                /**
                 * 人物方向朝右
                 */
                const playerNextX = x + 1;
                const weaponNextX = x + 2;
                if (playerNextX > tileMapInfo.length) {
                    return true;
                }
                /**
                 * 判断是否是门
                 */
                if ((doorInfo.x === playerNextX || doorInfo.x === weaponNextX) && doorInfo.y === this.y && doorInfo.state === ENTITY_STATE_ENUM.IDLE) {
                    return true;
                }
                const playerNextTile = tileMapInfo[playerNextX][Math.abs(y)];
                const weaponNextTile = tileMapInfo[weaponNextX][Math.abs(y)];
                if (playerNextTile?.moveable && weaponNextTile?.turnable) {

                } else {
                    return true;
                }
            } else if (direction === DIRECTION_ENUM.BOTTOM) {
                /**
                 * 人物方向朝下
                 */
                const playerNextX = x + 1;
                const weaponNextX = x + 1;
                const weaponNextY = y - 1;
                if (playerNextX > tileMapInfo.length) {
                    return true;
                }
                /**
                 * 判断是否是门
                 */
                if ((doorInfo.x === playerNextX || doorInfo.x === weaponNextX) && (doorInfo.y === this.y || doorInfo.y === weaponNextY) && doorInfo.state === ENTITY_STATE_ENUM.IDLE) {
                    return true;
                }
                const playerNextTile = tileMapInfo[playerNextX][Math.abs(y)];
                const weaponNextTile = tileMapInfo[weaponNextX][Math.abs(weaponNextY)];
                if (playerNextTile?.moveable && weaponNextTile?.turnable) {

                } else {
                    return true;
                }
            } else if (direction === DIRECTION_ENUM.LEFT) {
                /**
                 * 人物方向朝左
                 */
                const playerNextX = x + 1;
                const weaponNextX = x;
                if (playerNextX > tileMapInfo.length) {
                    return true;
                }
                /**
                 * 判断是否是门
                 */
                if ((doorInfo.x === playerNextX || doorInfo.x === weaponNextX) && doorInfo.y === this.y && doorInfo.state === ENTITY_STATE_ENUM.IDLE) {
                    return true;
                }
                const playerNextTile = tileMapInfo[playerNextX][Math.abs(y)];
                const weaponNextTile = tileMapInfo[weaponNextX][Math.abs(y)];
                if (playerNextTile?.moveable && weaponNextTile?.turnable) {

                } else {
                    return true;
                }
            }
        } else if (playerActionType === PLAYERACTION_TYPE.DOWN_MOVE) {
            /**
             * 人物向下移动
             */
            if (direction === DIRECTION_ENUM.TOP) {
                /**
                 * 人物方向朝上
                 */
                const playerNextY = y - 1;
                const weaponNextY = y;
                if (Math.abs(playerNextY) > tileMapInfo[0].length) {
                    return true;
                }
                /**
                 * 判断是否是门
                 */
                if (doorInfo.x === this.x && (doorInfo.y === playerNextY || doorInfo.y === weaponNextY) && doorInfo.state === ENTITY_STATE_ENUM.IDLE) {
                    return true;
                }
                const playerNextTile = tileMapInfo[x][Math.abs(playerNextY)];
                const weaponNextTile = tileMapInfo[x][Math.abs(weaponNextY)];
                if (playerNextTile?.moveable && weaponNextTile?.turnable) {

                } else {
                    return true;
                }
            } else if (direction === DIRECTION_ENUM.RIGHT) {
                /**
                 * 人物方向朝右
                 */
                const playerNextY = y - 1;
                const weaponNextX = x + 1;
                const weaponNextY = y - 1;
                if (Math.abs(playerNextY) > tileMapInfo[0].length) {
                    return true;
                }
                /**
                 * 判断是否是门
                 */
                if ((doorInfo.x === this.x || doorInfo.x === weaponNextX) && (doorInfo.y === playerNextY || doorInfo.y === weaponNextY) && doorInfo.state === ENTITY_STATE_ENUM.IDLE) {
                    return true;
                }
                const playerNextTile = tileMapInfo[x][Math.abs(playerNextY)];
                const weaponNextTile = tileMapInfo[weaponNextX][Math.abs(weaponNextY)];
                if (playerNextTile?.moveable && weaponNextTile?.turnable) {

                } else {
                    return true;
                }
            } else if (direction === DIRECTION_ENUM.BOTTOM) {
                /**
                 * 人物方向朝下
                 */
                const playerNextY = y - 1;
                const weaponNextY = y - 2;
                if (Math.abs(playerNextY) > tileMapInfo[0].length) {
                    return true;
                }
                /**
                 * 判断是否是门
                 */
                if (doorInfo.x === this.x && (doorInfo.y === playerNextY || doorInfo.y === weaponNextY) && doorInfo.state === ENTITY_STATE_ENUM.IDLE) {
                    return true;
                }
                const playerNextTile = tileMapInfo[x][Math.abs(playerNextY)];
                const weaponNextTile = tileMapInfo[x][Math.abs(weaponNextY)];
                if (playerNextTile?.moveable && weaponNextTile?.turnable) {

                } else {
                    return true;
                }
            } else if (direction === DIRECTION_ENUM.LEFT) {
                /**
                 * 人物方向朝左
                 */
                const playerNextY = y - 1;
                const weaponNextX = x - 1;
                const weaponNextY = y - 1;
                if (Math.abs(playerNextY) > tileMapInfo[0].length) {
                    return true;
                }
                /**
                 * 判断是否是门
                 */
                if ((doorInfo.x === this.x || doorInfo.x === weaponNextX) && (doorInfo.y === playerNextY || doorInfo.y === weaponNextY) && doorInfo.state === ENTITY_STATE_ENUM.IDLE) {
                    return true;
                }
                const playerNextTile = tileMapInfo[x][Math.abs(playerNextY)];
                const weaponNextTile = tileMapInfo[weaponNextX][Math.abs(weaponNextY)];
                if (playerNextTile?.moveable && weaponNextTile?.turnable) {

                } else {
                    return true;
                }
            }
        } else if (playerActionType === PLAYERACTION_TYPE.LEFT_MOVE) {
            /**
             * 人物向左移动
             */
             if (direction === DIRECTION_ENUM.TOP) {
                /**
                 * 人物方向朝上
                 */
                const playerNextX = x - 1;
                const weaponNextX = x - 1;
                const weaponNextY = y + 1;
                if (playerNextX < 0) {
                    return true;
                }
                /**
                 * 判断是否是门
                 */
                 if ((doorInfo.x === playerNextX || doorInfo.x === weaponNextX) && doorInfo.y === weaponNextY && doorInfo.state === ENTITY_STATE_ENUM.IDLE) {
                    return true;
                }
                const playerNextTile = tileMapInfo[playerNextX][Math.abs(y)];
                const weaponNextTile = tileMapInfo[weaponNextX][Math.abs(weaponNextY)];
                if (playerNextTile?.moveable && weaponNextTile?.turnable) {

                } else {
                    return true;
                }
            } else if (direction === DIRECTION_ENUM.RIGHT) {
                /**
                 * 人物方向朝右
                 */
                const playerNextX = x - 1;
                const weaponNextX = x;
                if (playerNextX < 0) {
                    return true;
                }
                /**
                 * 判断是否是门
                 */
                if ((doorInfo.x === playerNextX || doorInfo.x === weaponNextX) && doorInfo.y === this.y && doorInfo.state === ENTITY_STATE_ENUM.IDLE) {
                    return true;
                }
                const playerNextTile = tileMapInfo[playerNextX][Math.abs(y)];
                const weaponNextTile = tileMapInfo[weaponNextX][Math.abs(y)];
                if (playerNextTile?.moveable && weaponNextTile?.turnable) {

                } else {
                    return true;
                }
            } else if (direction === DIRECTION_ENUM.BOTTOM) {
                /**
                 * 人物方向朝下
                 */
                const playerNextX = x - 1;
                const weaponNextX = x - 1;
                const weaponNextY = y - 1;
                if (playerNextX < 0) {
                    return true;
                }
                /**
                 * 判断是否是门
                 */
                if ((doorInfo.x === playerNextX || doorInfo.x === weaponNextX) && (doorInfo.y === weaponNextY || doorInfo.y === this.y) && doorInfo.state === ENTITY_STATE_ENUM.IDLE) {
                    return true;
                }
                const playerNextTile = tileMapInfo[playerNextX][Math.abs(y)];
                const weaponNextTile = tileMapInfo[weaponNextX][Math.abs(weaponNextY)];
                if (playerNextTile?.moveable && weaponNextTile?.turnable) {

                } else {
                    return true;
                }
            } else if (direction === DIRECTION_ENUM.LEFT) {
                /**
                 * 人物方向朝左
                 */
                const playerNextX = x - 1;
                const weaponNextX = x - 2;
                if (playerNextX < 0) {
                    return true;
                }
                /**
                 * 判断是否是门
                 */
                if ((doorInfo.x === playerNextX || doorInfo.x === weaponNextX) && doorInfo.y === this.y && doorInfo.state === ENTITY_STATE_ENUM.IDLE) {
                    return true;
                }
                const playerNextTile = tileMapInfo[playerNextX][Math.abs(y)];
                const weaponNextTile = tileMapInfo[weaponNextX][Math.abs(y)];
                if (playerNextTile?.moveable && weaponNextTile?.turnable) {

                } else {
                    return true;
                }
            }
        } else if (playerActionType === PLAYERACTION_TYPE.ANTICLOCKWISE){
            /**
             * 人物逆时针旋转
             */
            let weaponNextX : number;
            let weaponNextY : number;
            if (direction === DIRECTION_ENUM.TOP) {
                /**
                 * 人物方向朝上
                 */
                weaponNextX = x - 1;
                weaponNextY = y + 1;
            } else if (direction === DIRECTION_ENUM.RIGHT) {
                /**
                 * 人物方向朝右
                 */
                weaponNextX = x + 1;
                weaponNextY = y + 1;
            } else if (direction === DIRECTION_ENUM.BOTTOM) {
                /**
                 * 人物方向朝下
                 */
                weaponNextX = x + 1;
                weaponNextY = y - 1;
            } else if (direction === DIRECTION_ENUM.LEFT) {
                /**
                 * 人物方向朝上
                 */
                weaponNextX = x - 1;
                weaponNextY = y - 1;
            }

            if (tileMapInfo[x][Math.abs(weaponNextY)].turnable &&
                 tileMapInfo[weaponNextX][Math.abs(weaponNextY)].turnable &&
                  tileMapInfo[weaponNextX][Math.abs(y)].turnable) {

            } else {
                return true;
            }

        } else if (playerActionType === PLAYERACTION_TYPE.CLOCKWISE){
            /**
             * 人物逆时针旋转
             */
            let weaponNextX : number;
            let weaponNextY : number;
            if (direction === DIRECTION_ENUM.TOP) {
                /**
                 * 人物方向朝上
                 */
                weaponNextX = x + 1;
                weaponNextY = y + 1;
            } else if (direction === DIRECTION_ENUM.RIGHT) {
                /**
                 * 人物方向朝右
                 */
                weaponNextX = x + 1;
                weaponNextY = y - 1;
            } else if (direction === DIRECTION_ENUM.BOTTOM) {
                /**
                 * 人物方向朝下
                 */
                weaponNextX = x - 1;
                weaponNextY = y - 1;
            } else if (direction === DIRECTION_ENUM.LEFT) {
                /**
                 * 人物方向朝上
                 */
                weaponNextX = x - 1;
                weaponNextY = y + 1;
            }

            if (tileMapInfo[x][Math.abs(weaponNextY)].turnable &&
                 tileMapInfo[weaponNextX][Math.abs(weaponNextY)].turnable &&
                  tileMapInfo[weaponNextX][Math.abs(y)].turnable) {

            } else {
                return true;
            }

        }
        return false;
    }

}

