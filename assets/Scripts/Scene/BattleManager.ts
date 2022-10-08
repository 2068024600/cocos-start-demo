import { _decorator, Component, Node, Layers } from 'cc';
import { TileMapManage } from '../Tile/TileMapManager';
const { ccclass, property } = _decorator;
import { createUINode, loadSpriteFrameResource } from '../../Utils';
import DataManager from '../../RunTime/DataManager'
import levels, { ILevel } from '../../Levels';
import { TILE_HEIGHT, TILE_WIDTH } from '../Tile/TileManager';
import ResourcesManager from '../../RunTime/ResourceManager';
import EventResource from '../../RunTime/EventManager';
import { EVENT_TYPE } from '../../Enums';
import { PlayerManager } from '../Player/PlayerManager';

@ccclass('BatterManage')
export class BatterManage extends Component {

    level: ILevel
    // 舞台结点
    stage: Node
    // 瓦片地图结点
    tileMap: Node

    // onLoad() {
    //     // 绑定进入下一关事件
    //     EventResource.instance.add(EVENT_TYPE.NEXT_LEVEL, this.destroyNode, this);
    //     EventResource.instance.add(EVENT_TYPE.NEXT_LEVEL, this.nextLevel, this);
    // }

    // onDestroy() {
    //     // 解绑事件
    //     EventResource.instance.remove(EVENT_TYPE.NEXT_LEVEL, this.destroyNode);
    //     EventResource.instance.remove(EVENT_TYPE.NEXT_LEVEL, this.nextLevel);
    // }

    /**
     * 进入下一关
     */
    nextLevel() {
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

    initlevel(levelNum: number) {
        const level = levels[`level${levelNum}`]
        if (level) {

            DataManager.instance.mapInfo = level.mapInfo,
            DataManager.instance.mapRowCount = level.mapInfo.length
            DataManager.instance.mapColCount = level.mapInfo[0].length

            DataManager.instance.playerInfo = level.playerInfo;

            // 生成地图
            this.generateTileMap();
            // 生成人物
            this.generatePlayer();
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

    // async loadResource() {
    //     // 加载地图资源路径
    //     const path = "texture/tile/tile";
    //     const spriteFrames = await loadSpriteFrameResource(path);
    //     if (spriteFrames) {
    //         ResourcesManager.instance.mapResouces = spriteFrames;
    //         const tileMapManager = this.tileMap.getComponent(TileMapManage);
    //         tileMapManager.init()
    //     }
    // }

    /**
     * 生成地图
     */
    generateTileMap() {

        // 创建瓦片地图
        this.tileMap = createUINode();
        this.tileMap.setParent(this.stage);

        // 添加瓦片
        const tileMapManager = this.tileMap.addComponent(TileMapManage);
        tileMapManager.init();

        // 设置舞台位置,使整个地图居中
        this.setStageOffset();
    }

    /**
     * 生成角色
     */
    generatePlayer() {
        const player = createUINode();
        player.setParent(this.stage);
        const playerManager = player.addComponent(PlayerManager);
        playerManager.init();
    }

}
