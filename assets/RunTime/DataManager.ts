import { Enemy } from "../Base/Enemy";
import { Entity } from "../Base/Entity";
import Singleton from "../Base/Singleton"
import { IEntity, ISpike, ITile } from "../Levels"
import { DoorManager } from "../Scripts/Door/DoorManager";
import { PlayerManager } from "../Scripts/Player/PlayerManager";
import { SpikesManager } from "../Scripts/Spikes/SpikesManager";
import { TileManager } from "../Scripts/Tile/TileManager";

export interface IData {
  level: number;
  player: IEntity,
  enemies: Array<IEntity>,
  door: IEntity,
  bursts: Array<IEntity>,
  spikes: Array<ISpike>
}

export default class DataManager extends Singleton {

  static get instance() {
    return super.getInstance<DataManager>();
  }

  reset() {
    this.mapInfo = [[]];
    this.tileMapInfo = [[]];
    this.mapRowCount = 0;
    this.mapColCount = 0;

    this.playerInfo = null;
    this.enemyInfo = [];
    this.doorInfo = null;
    this.burstInfo = [];
    this.spikesInfo = [];
  }

  getData():IData {
    const player = {
      x: this.playerInfo?.x,
      y: this.playerInfo?.y,
      direction: this.playerInfo?.direction,
      state: this.playerInfo?.state,
      type: this.playerInfo?.type,
    }

    const enemies: Array<IEntity> = [];
    for (const enemy of this.enemyInfo) {
      enemies.push({
        x: enemy?.x,
        y: enemy?.y,
        direction: enemy?.direction,
        state: enemy?.state,
        type: enemy?.type,
      })
    }

    const door = {
      x: this.doorInfo?.x,
      y: this.doorInfo?.y,
      direction: this.doorInfo?.direction,
      state: this.doorInfo?.state,
      type: this.doorInfo?.type,
    }

    const bursts: Array<IEntity> = [];
    for (const burst of this.burstInfo) {
      bursts.push({
        x: burst?.x,
        y: burst?.y,
        direction: burst?.direction,
        state: burst?.state,
        type: burst?.type,
      })
    }

    const spikes: Array<ISpike> = [];
    for (const spike of this.spikesInfo) {
      spikes.push({
        x: spike?.x,
        y: spike?.y,
        type: spike?.type,
        number: spike?.number,
        totalNumber: spike?.totalNumber
      })
    }

    return {
      level: DataManager.instance.level,
      player: player,
      enemies: enemies,
      door: door,
      bursts: bursts,
      spikes: spikes
    }
  }

  /**
   * 关卡数
   */
  level = 4;

  /**
   * 地图数据
   */
  mapInfo: Array<Array<ITile>>;

  /**
   * 地图行数
   */
  mapRowCount = 0;

  /**
   * 地图列数
   */
  mapColCount = 0;

  /**
   * 人物信息
   */
  playerInfo: PlayerManager;

  /**
   * 敌人信息
   */
  enemyInfo: Array<Enemy> = [];

  /**
   * 地图瓦片信息
   */
  tileMapInfo: Array<Array<TileManager>>;

  /**
   * 门信息
   */
  doorInfo: DoorManager;

  burstInfo: Array<Entity> = [];

  spikesInfo: Array<SpikesManager> = [];
}
