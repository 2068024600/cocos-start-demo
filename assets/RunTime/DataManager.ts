import Singleton from "../Base/Singleton"
import { IPlayer, ITile } from "../Levels"
import { TileManager } from "../Scripts/Tile/TileManager";

export default class DataManager extends Singleton {

  static get instance() {
    return super.getInstance<DataManager>();
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
  playerInfo: IPlayer;
  /**
   * 地图瓦片信息
   */
  tileMapInfo: Array<Array<TileManager>>
}
