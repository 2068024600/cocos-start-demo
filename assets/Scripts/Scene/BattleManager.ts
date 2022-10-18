import { _decorator, Component, Node, Layers } from 'cc';
import { TileMapManage } from '../Tile/TileMapManager';
const { ccclass, property } = _decorator;
import { createUINode, loadSpriteFrameResource } from '../../Utils';
import DataManager from '../../RunTime/DataManager'
import levels, { IEntity, ILevel } from '../../Levels';
import { TILE_HEIGHT, TILE_WIDTH } from '../Tile/TileManager';
import { PlayerManager } from '../Player/PlayerManager';
import { WoodenSkeletonManager } from '../WoodenSkeleton/WoodenSkeletonManager';
import EventResource from '../../RunTime/EventManager';
import { EVENT_TYPE, SPIKES_TYPE_ENUM } from '../../Enums';
import { DoorManager } from '../Door/DoorManager';
import { IronSkeletonManager } from '../IronSkeleton/IronSkeletonManager';
import { BurstManager } from '../Burst/BurstManager';
import { SpikesManager } from '../Spikes/SpikesManager';

@ccclass('BatterManage')
export class BatterManage extends Component {

    level: ILevel
    // 舞台结点
    stage: Node
    // 瓦片地图结点
    tileMap: Node

    /**
     * 进入下一关
     */
    nextLevel() {
        this.destroyNode();
        DataManager.instance.level++;
        this.initlevel(DataManager.instance.level);
    }

    /**
     * 销毁结点
     */
    destroyNode() {
        this.stage.destroyAllChildren()
    }

    start() {
        // 搭建舞台
        this.generateStage();
        // // 加载资源
        // this.loadResource();
        // 加载关卡数据
        this.initlevel(DataManager.instance.level);
    }

    async initlevel(levelNum: number) {
        const level = levels[`level${levelNum}`]
        if (level) {

            DataManager.instance.mapInfo = level.mapInfo,
            DataManager.instance.mapRowCount = level.mapInfo.length
            DataManager.instance.mapColCount = level.mapInfo[0].length

            // 生成地图
            await this.generateTileMap();
            // 生成敌人
            await this.generateEnemy();
            // 生成门
            await this.generateDoor();
            // 生成地裂
            await this.generateBurst();
            // 生成地刺
            await this.generateSpikes();
            // 生成人物
            await this.generatePlayer(level.playerInfo);
        }
    }

    /**
     * 搭建舞台
     */
    generateStage() {
        // 创建node搭建平台
        this.stage = createUINode();
        this.stage.setParent(this.node);
    }

    /**
     * 设置stage偏移量
     */
    setStageOffset() {
        const { mapRowCount, mapColCount } = DataManager.instance;
        // 设置x轴偏移量
        const xOffset = mapRowCount * TILE_WIDTH / 2 - 20
        const yOffset = mapColCount * TILE_HEIGHT / 2 + 100
        this.stage.setPosition(-xOffset, yOffset)
    }

    /**
     * 生成地图
     */
    async generateTileMap() {

        // 创建瓦片地图
        this.tileMap = createUINode();
        this.tileMap.setParent(this.stage);

        // 添加瓦片
        const tileMapManager = this.tileMap.addComponent(TileMapManage);
        await tileMapManager.init();

        // 设置舞台位置,使整个地图居中
        this.setStageOffset();
    }

    /**
     * 生成角色
     */
    async generatePlayer(playerInfo: IEntity) {
        const player = createUINode();
        player.setParent(this.stage);
        const playerManager = player.addComponent(PlayerManager);
        await playerManager.init(playerInfo);
        DataManager.instance.playerInfo = playerManager;
        // 怪物自动转向到人物方向
        EventResource.instance.exec(EVENT_TYPE.PLAYER_BOTH);
    }

    /**
     * 生成敌人
     */
    async generateEnemy() {
        const woodenSkeleton = createUINode();
        woodenSkeleton.setParent(this.stage);
        const woodenSkeletonManager = woodenSkeleton.addComponent(WoodenSkeletonManager);
        await woodenSkeletonManager.init();
        DataManager.instance.enemyInfo.push(woodenSkeletonManager);
        const ironSkeleton = createUINode();
        ironSkeleton.setParent(this.stage);
        const ironSkeletonManager = ironSkeleton.addComponent(IronSkeletonManager);
        await ironSkeletonManager.init();
        DataManager.instance.enemyInfo.push(ironSkeletonManager);
    }

    /**
     * 生成门
     */
    async generateDoor() {
        const door = createUINode();
        door.setParent(this.stage);
        const doorManager = door.addComponent(DoorManager);
        await doorManager.init();
        DataManager.instance.doorInfo = doorManager;
    }

    /**
     * 生成地裂
     */
    async generateBurst() {
        const burst = createUINode();
        burst.setParent(this.stage);
        const burstManager = burst.addComponent(BurstManager);
        await burstManager.init();
        DataManager.instance.burstInfo.push(burstManager);
    }

    /**
     * 生成地刺
     */
    async generateSpikes() {
        const spikes = createUINode();
        spikes.setParent(this.stage);
        const spikesManager = spikes.addComponent(SpikesManager);
        await spikesManager.init({
            x: 2,
            y: -5,
            type: SPIKES_TYPE_ENUM.SPIKES_FOUR,
            number: 0,
            totalNumber: 5
        });
        DataManager.instance.spikesInfo.push(spikesManager);
    }
}
