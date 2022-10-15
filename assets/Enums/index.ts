export enum TILE_TYPE_ENUM {
  /**
   * 横向墙壁
   */
  WALL_ROW = 'WALL_ROW',
  /**
   * 竖向墙壁
   */
  WALL_COLUMN = 'WALL_COLUMN',
  /**
   * 左上角垂直墙壁
   */
  WALL_LEFT_TOP = 'WALL_LEFT_TOP',
  /**
   * 左下角垂直墙壁
   */
  WALL_LEFT_BOTTOM = 'WALL_BUTTOM_TOP',
  /**
   * 右上角垂直墙壁
   */
  WALL_RIGHT_TOP = 'WALL_RIGHT_TOP',
  /**
   * 右下角垂直墙壁
   */
  WALL_RIGHT_BOTTOM = 'WALL_RIGHT_BOTTOM',
  /**
   * 悬崖
   */
  CLIFF_CENTER = 'CLIFF_CENTER',
  /**
   * 左侧悬崖
   */
  CLIFF_LEFT = 'CLIFF_LEFT',
  /**
   * 右侧悬崖
   */
  CLIFF_RIGHT = 'CLIFF_RIGHT',
  /**
   * 地板
   */
  FLOOR = 'FLOOR'
}

/**
 * 场景事件类型
 */
export enum EVENT_TYPE {
  /**
   * 下一关
   */
  NEXT_LEVEL = 'NEXT_LEVEL',
  /**
   * 人物移动
   */
  PLAYER_MOVE = 'PLAYER_MOVE',
  /**
   * 人物移动结束
   */
  PLAYER_MOVE_END = 'PLAYER_MOVE_END',
  /**
   * 人物生成
   */
  PLAYER_BOTH = 'PLAYER_BOTH',
  /**
   * 人物死亡
   */
  PLAYER_DEATH = 'PLAYER_DEATH',
  /**
   * 怪物死亡
   */
  ENEMY_DEATH = 'ENEMY_DEATH',
  /**
   * 开门
   */
  DOOR_OPEN = 'DOOR_OPEN'
}

/**
 * 人物动作类型
 */
export enum PLAYERACTION_TYPE {
  /**
   * 人物向上移动
   */
  UP_MOVE = 'UP_MOVE',
  /**
   * 人物向下移动
   */
  DOWN_MOVE = 'DOWN_MOVE',
  /**
   * 人物向左移动
   */
  LEFT_MOVE = 'LEFT_MOVE',
  /**
   * 人物向右移动
   */
  RIGHT_MOVE = 'RIGHT_MOVE',
  /**
   * 人物顺时针转动
   */
  CLOCKWISE = 'CLOCKWISE',
  /**
   * 人物逆时针转动
   */
  ANTICLOCKWISE = 'ANTICLOCKWISE'
}

/**
 * 有限状态机参数数据枚举
 */
export enum PARAMS_NAME_ENUM {
  /**
   * 闲置状态
   */
  IDLE = 'IDLE',
  /**
  * 顺时针旋转
  */
  CLOCKWISE = 'CLOCKWISE',
  /**
  * 逆时针旋转
  */
  ANTICLOCKWISE = 'ANTICLOCKWISE',
  /**
   * 方向枚举
   */
  DIRECTION = 'DIRECTION',
  /**
   * 前进阻塞
   */
  BLOCK_FRONT = 'BLOCK_FRONT',
  /**
   * 后退阻塞
   */
  BLOCK_BACK = 'BLOCK_BACK',
  /**
   * 左移阻塞
   */
  BLOCK_LEFT = 'BLOCK_LEFT',
  /**
   * 右移阻塞
   */
  BLOCK_RIGHT = 'BLOCK_RIGHT',
  /**
   * 左旋阻塞
   */
  BLOCK_TURNLEFT = 'BLOCK_TURNLEFT',
  /**
   * 右旋阻塞
   */
  BLOCK_TURNRIGHT = 'BLOCK_TURNRIGHT',
  /**
   * 攻击
   */
  ATTACK = 'ATTACK',
  /**
   * 死亡
   */
  DEATH = 'DEATH',
}

export enum PARAMS_NAME_DIRECTIO_ENUM {
  TOP = 'TOP',
  RIGHT = 'RIGHT',
  BOTTOM = 'BOTTOM',
  LEFT = 'LEFT',
}
/**
 * 有限状态机参数类型枚举
 */
 export enum FSM_PARAM_TYPE_ENUM {
  NUMBER = 'NUMBER',
  TRIGGER = 'TRIGGER',
}

/**
 * 方向枚举
 */
export enum DIRECTION_ENUM {
  TOP = 0,
  RIGHT = 1,
  BOTTOM = 2,
  LEFT = 3,
}

/**
 * 实体状态
 */
export enum ENTITY_STATE_ENUM {
  /**
   * 闲置状态
   */
  IDLE = 'IDLE',
  /**
   * 顺时针旋转
   */
  CLOCKWISE = 'CLOCKWISE',
  /**
   * 逆时针旋转
   */
  ANTICLOCKWISE = 'ANTICLOCKWISE',
  /**
   * 前进阻塞
   */
  BLOCK_FRONT = 'BLOCK_FRONT',
  /**
   * 后退阻塞
   */
  BLOCK_BACK = 'BLOCK_BACK',
  /**
   * 左移阻塞
   */
  BLOCK_LEFT = 'BLOCK_LEFT',
  /**
   * 右移阻塞
   */
  BLOCK_RIGHT = 'BLOCK_RIGHT',
  /**
   * 左旋阻塞
   */
  BLOCK_TURNLEFT = 'BLOCK_TURNLEFT',
  /**
   * 右旋阻塞
   */
  BLOCK_TURNRIGHT = 'BLOCK_TURNRIGHT',
  /**
   * 攻击
   */
  ATTACK = 'ATTACK',
  /**
   * 死亡
   */
  DEATH = 'DEATH',
}

export enum ENTITY_TYPE_ENUM {
  /**
   * 玩家
   */
  PALYER = 'PALYER',
  /**
   * 敌人
   */
  ENEMY = 'ENEMY',
  /**
   * 门
   */
  DOOR = 'DOOR'
}
