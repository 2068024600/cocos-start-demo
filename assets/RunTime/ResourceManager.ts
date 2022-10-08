import { SpriteFrame } from "cc";
import Singleton from "../Base/Singleton";
import { loadSpriteFrameResource } from "../Utils";


export default class ResourcesManager extends Singleton {

  static get instance() {
    return super.getInstance<ResourcesManager>();
  }

  /**
   * 关卡资源
   */
  mapResouces = loadSpriteFrameResource("texture/tile/tile");
  /**
   * 人物资源
   */
  playerResources = loadSpriteFrameResource("texture/player/idle/top");
}
