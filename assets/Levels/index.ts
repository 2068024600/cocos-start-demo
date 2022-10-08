import level1 from "./level1";
import level2 from "./level2";
import { TILE_TYPE_ENUM } from '../Enums'

export interface ITile {
  src: number | null,
  type: TILE_TYPE_ENUM | null
}

export interface IPlayer {
  position: {
    x: number,
    y: number
  }
}

/**
 * 定义ILevel的数据结构
 */
export interface ILevel {
  mapInfo: Array<Array<ITile>>,
  playerInfo: IPlayer
}

const levels: Record<string, ILevel> = {
  level1,
  level2
}

export default levels;
