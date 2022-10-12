import { Layers, Node, resources, SpriteFrame } from "cc";

/**
 * 创建Node
 * @returns
 */
export const createUINode = (): Node => {
  const node = new Node();
  node.layer = 1 << Layers.nameToLayer('UI_2D');
  return node;
}

/**
 * 加载SpriteFrameResource
 * @param path 资源路径
 * @returns
 */
export const loadSpriteFrameResource = (path: string) => {

    return new Promise<SpriteFrame[]>((resolve, reject) => {
      resources.loadDir(path, SpriteFrame, function (err, assets) {
        if (err) {
          reject(err);
          return
        }
        resolve(assets);
      });
    })
}

/**
 * 生成start - end的随机数
 * @param start
 * @param end
 */
export const randomIntValue = (start: number, end: number): number => {
  return Math.floor(start + (end - start) * Math.random());
}

const getNumberInString = (str: String) => {
  const reg = /\((\d+)\)/;
  return parseInt(str.match(reg)[1] || '0');
}

/**
 * spriteFrame资源排序
 * @param spriteFrames
 * @returns
 */
export const spriteFrameSort = (spriteFrames: Array<SpriteFrame>) => spriteFrames.sort((a, b) => getNumberInString(a.name) - getNumberInString(b.name))

/**
 * 生成指定长度的id
 * @param len
 * @returns
 */
export const generateNumString = (len: number) => Array.from({ length: len }).reduce<string>((total: string) => total + Math.floor(Math.random() * 10), '')
