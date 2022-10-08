import { _decorator, Component, Node, Sprite, SpriteFrame, resources, UITransform, Layers } from 'cc';
const { ccclass, property } = _decorator;
import { TileManager } from './TileManager';
import { createUINode, loadSpriteFrameResource, randomIntValue } from '../../Utils';
import DataManager from '../../RunTime/DataManager';
import ResourcesManager from '../../RunTime/ResourceManager';

@ccclass('TileMapManage')
export class TileMapManage extends Component {

    async init() {

      // 加载图片资源
      const mapResouces = await ResourcesManager.instance.mapResouces;

      // 若地图加载不成功
      if (!mapResouces) {
        console.error("地图资源加载失败！！！")
        return;
      }

      let tileManagerList = []

      const { mapInfo } = DataManager.instance;
      for (let i=0; i<mapInfo.length; i++) {
        const col = mapInfo[i];
        tileManagerList[i]=[]
        for (let j=0; j<col.length; j++) {
          const tile = col[j];
          if (tile.src === null || tile.type === null) {
            continue;
          }

          const node = createUINode();
          node.setParent(this.node);

          // 获取每个瓦片的图片资源
          let number = tile.src;
          if ((number === 1 || number === 5 || number === 9) && i % 2 === 0 && j % 2 === 0) {
            number = randomIntValue(number, number+3);
          }
          const tilesrc = `tile (${number})`;
          const spriteFrame = mapResouces.find(item => item.name === tilesrc);

          // 添加地图瓦片
          const tileManager = node.addComponent(TileManager);
          tileManager.init(mapInfo[i][j].type, spriteFrame, i, j);
          tileManagerList[i][j] = tileManager
        }
      }

      DataManager.instance.tileMapInfo = tileManagerList;
    }

}
