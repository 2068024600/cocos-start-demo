import level1 from "./level1";
import level2 from "./level2";
import { PARAMS_NAME_DIRECTIO_ENUM, ENTITY_STATE_ENUM, ENTITY_TYPE_ENUM, SPIKES_TYPE_ENUM, TILE_TYPE_ENUM } from '../Enums'

export interface ITile {
  src: number | null,
  type: TILE_TYPE_ENUM | null
}

export interface IEntity {
  x: number;
  y: number;
  direction: PARAMS_NAME_DIRECTIO_ENUM;
  state: ENTITY_STATE_ENUM;
  type: ENTITY_TYPE_ENUM;
}

export interface ISpike {
  x: number;
  y: number;
  /**
   * 刺类型
   */
  type: SPIKES_TYPE_ENUM;
  /**
   * 当前刺数量
   */
  number: number;
  /**
   * 刺总数量
   */
  totalNumber: number;
}

/**
 * 定义ILevel的数据结构
 */
export interface ILevel {
  mapInfo: Array<Array<ITile>>,
  player: IEntity,
  enemies: Array<IEntity>,
  door: IEntity,
  bursts: Array<IEntity>,
  spikes: Array<ISpike>
}

const levels: Record<string, ILevel> = {
  level1,
  level2
}

export default levels;
