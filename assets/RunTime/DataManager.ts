import { Enemy } from "../Base/Enemy";
import { Entity } from "../Base/Entity";
import Singleton from "../Base/Singleton"
import { ITile } from "../Levels"
import { DoorManager } from "../Scripts/Door/DoorManager";
import { PlayerManager } from "../Scripts/Player/PlayerManager";
import { SpikesManager } from "../Scripts/Spikes/SpikesManager";
import { TileManager } from "../Scripts/Tile/TileManager";

export default class DataManager extends Singleton {

  static get instance() {
    return super.getInstance<DataManager>();
  }

  reset() {
    this.mapInfo = [[]]
    this.mapRowCount = 0;
    this.mapColCount = 0;

    this.playerInfo = null;
    this.enemyInfo = [];
    this.tileMapInfo = [[]];
    this.doorInfo = null;
    this.burstInfo = [];
    this.spikesInfo = [];
  }

  /**
   * 关卡数
   */
  level = 1;

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
