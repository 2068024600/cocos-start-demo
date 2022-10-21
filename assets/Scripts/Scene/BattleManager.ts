import { _decorator, Component, Node, Layers } from 'cc';
import { TileMapManage } from '../Tile/TileMapManager';
const { ccclass, property } = _decorator;
import { createUINode, request } from '../../Utils';
import DataManager, { IData } from '../../RunTime/DataManager'
import levels, { IEntity, ILevel, ISpike } from '../../Levels';
import { TILE_HEIGHT, TILE_WIDTH } from '../Tile/TileManager';
import { PlayerManager } from '../Player/PlayerManager';
import { WoodenSkeletonManager } from '../WoodenSkeleton/WoodenSkeletonManager';
import EventResource from '../../RunTime/EventManager';
import { ENTITY_STATE_ENUM, ENTITY_TYPE_ENUM, EVENT_TYPE } from '../../Enums';
import { DoorManager } from '../Door/DoorManager';
import { IronSkeletonManager } from '../IronSkeleton/IronSkeletonManager';
import { BurstManager } from '../Burst/BurstManager';
import { SpikesManager } from '../Spikes/SpikesManager';

const IP = "http://101.34.173.203:8080";
// const IP = "http://127.0.0.1:8080";

@ccclass('BatterManage')
export class BatterManage extends Component {

    level: ILevel;
    // 舞台结点
    stage: Node;
    // 瓦片地图结点
    tileMap: Node;

    onLoad() {
        // 这里的99代表这个函数最后执行
        EventResource.instance.add(EVENT_TYPE.PLAYER_MOVE_END, this.checkNextLevel, this, 99);
        EventResource.instance.add(EVENT_TYPE.PLAYER_MOVE_END, this.save, this, 99);
    }

    async start() {
        // 搭建舞台
        this.generateStage();
        // // 加载资源
        // this.loadResource();
        // if (await this.login()) {
        //     // 加载云端存档
        //     this.load();
        // } else {
        //     // 加载本地关卡数据
        //     this.initlevel(DataManager.instance.level);
        // }
        this.initlevel(DataManager.instance.level);
    }

    onDestroy() {
        EventResource.instance.remove(EVENT_TYPE.PLAYER_MOVE_END, this.checkNextLevel);
        EventResource.instance.remove(EVENT_TYPE.PLAYER_MOVE_END, this.save);
    }

    /**
     * 进入下一关
     */
    nextLevel() {
        this.destroyNode();
        DataManager.instance.reset();
        DataManager.instance.level++;
        this.initlevel(DataManager.instance.level);
    }

    /**
     * 销毁结点
     */
    destroyNode() {
        this.stage.destroyAllChildren();
    }

    async initlevel(levelNum: number) {

        const level = levels[`level${levelNum}`]
        if (level) {

            const { mapInfo, player, enemies, door, bursts, spikes } = level;

            DataManager.instance.mapInfo = mapInfo;
            DataManager.instance.mapRowCount = mapInfo.length;
            DataManager.instance.mapColCount = mapInfo[0].length;
            DataManager.instance.level = levelNum;

            // 生成地图
            await this.generateTileMap();
            // 生成敌人
            await this.generateEnemy(enemies);
            // 生成门
            await this.generateDoor(door);
            // 生成地裂
            await this.generateBurst(bursts);
            // 生成地刺
            await this.generateSpikes(spikes);
            // 生成人物
            await this.generatePlayer(player);

            await this.save();
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
    async generateEnemy(enemies: Array<IEntity>) {

        for (const enemy of enemies) {
            if (enemy.type === ENTITY_TYPE_ENUM.WOODEN_SKELETON_ENEMY) {
                const woodenSkeleton = createUINode();
                woodenSkeleton.setParent(this.stage);
                const woodenSkeletonManager = woodenSkeleton.addComponent(WoodenSkeletonManager);
                await woodenSkeletonManager.init(enemy);
                DataManager.instance.enemyInfo.push(woodenSkeletonManager);
            } else if (enemy.type === ENTITY_TYPE_ENUM.IRON_SKELETON_ENEMY) {
                const ironSkeleton = createUINode();
                ironSkeleton.setParent(this.stage);
                const ironSkeletonManager = ironSkeleton.addComponent(IronSkeletonManager);
                await ironSkeletonManager.init(enemy);
                DataManager.instance.enemyInfo.push(ironSkeletonManager);
            }
        }
    }

    /**
     * 生成门
     */
    async generateDoor(door: IEntity) {
        const doorNode = createUINode();
        doorNode.setParent(this.stage);
        const doorManager = doorNode.addComponent(DoorManager);
        await doorManager.init(door);
        DataManager.instance.doorInfo = doorManager;
    }

    /**
     * 生成地裂
     */
    async generateBurst(bursts: Array<IEntity>) {
        for (const burst of bursts) {
            const burstNode = createUINode();
            burstNode.setParent(this.stage);
            const burstManager = burstNode.addComponent(BurstManager);
            await burstManager.init(burst);
            DataManager.instance.burstInfo.push(burstManager);
        }
    }

    /**
     * 生成地刺
     */
    async generateSpikes(spikes: Array<ISpike>) {
        for (const spike of spikes) {
            const spikeNode = createUINode();
            spikeNode.setParent(this.stage);
            const spikesManager = spikeNode.addComponent(SpikesManager);
            await spikesManager.init(spike);
            DataManager.instance.spikesInfo.push(spikesManager);
        }
    }

    /**
     * 检查是否能进入下一关
     */
    checkNextLevel() {
        const {x: playerX, y: playerY} = DataManager.instance.playerInfo;
        const {x: doorX, y: doorY, state} = DataManager.instance.doorInfo;
        if (playerX === doorX && playerY === doorY && state === ENTITY_STATE_ENUM.DEATH) {
            // 进入下一关
            this.nextLevel();
        }
    }

    /**
     * 登录
     */
    async login() {
        let isLogin = false;
        const id = localStorage.getItem("crampedRoomPlayerId") || "";
        await request("GET", `${IP}/web/rest/levelRest/login?id=${id}`).then(res => {
            const id = res.id;
            if (id) {
                localStorage.setItem("crampedRoomPlayerId", id);
                isLogin = true;
            }
        }).catch(err => console.error(err));

        return isLogin;
    }

    /**
     * 保存
     */
    async save() {
        const id = localStorage.getItem("crampedRoomPlayerId");
        if (id) {
            request("POST", `${IP}/web/rest/levelRest/save`, {
                id: id,
                ...DataManager.instance.getData()
            });
        }
    }

    /**
     * 加载
     */
    async load() {
        const id = localStorage.getItem("crampedRoomPlayerId");
        if (id) {
            request("GET", `${IP}/web/rest/levelRest/getLevel?id=${id}`).then(res => {
                if (res.res) {
                    this.loadLevel(res.levelInfo);
                } else {
                    this.initlevel(DataManager.instance.level);
                }
            }).catch(err => console.error(err));
        }
    }

    /**
     * 加载存档
     * @param loadData
     * @returns
     */
    async loadLevel(loadData: IData) {
        // 若云端无存档，则加载本地
        if (!loadData) {
            this.initlevel(DataManager.instance.level);
            return;
        } else {

            const {level, player, enemies, door, bursts, spikes } = loadData
            const levelInfo = levels[`level${level}`]
            if (levelInfo) {

                DataManager.instance.mapInfo = levelInfo.mapInfo;
                DataManager.instance.mapRowCount = levelInfo.mapInfo.length;
                DataManager.instance.mapColCount = levelInfo.mapInfo[0].length;
                DataManager.instance.level = level;

                // 生成地图
                await this.generateTileMap();
                // 生成敌人
                await this.generateEnemy(enemies);
                // 生成门
                await this.generateDoor(door);
                // 生成地裂
                await this.generateBurst(bursts);
                // 生成地刺
                await this.generateSpikes(spikes);
                // 生成人物
                await this.generatePlayer(player);

                await this.save();
            }
        }

    }
}
