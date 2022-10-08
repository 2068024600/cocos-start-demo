import { _decorator, AnimationClip, Sprite, animation, SpriteFrame } from 'cc';
import { loadSpriteFrameResource } from "../Utils";
import { StateMachine } from "./StateMachine";

// 人物播放的动画速度
const ANIMATION_SPEED = 1 / 8;

export default class State {
  constructor(
    private fms: StateMachine,
    private path: string,
    private wrapMode: AnimationClip.WrapMode = AnimationClip.WrapMode.Normal
  ) {
    this.init()
  }

  animationClip: AnimationClip

  async init() {
    const promise = loadSpriteFrameResource(this.path);
    this.fms.resource.push(promise)
    const spriteFrames = await promise;

    /**
     * 动画剪辑
     */
    this.animationClip = new AnimationClip();
    // 整个动画剪辑的周期
    this.animationClip.duration = ANIMATION_SPEED * spriteFrames.length;
    // 动画的循环模式,当前设置为循环播放
    this.animationClip.wrapMode = this.wrapMode;

    // 创建一个对象轨道
    const track = new animation.ObjectTrack();
    // 指定轨道路径，即指定目标对象为 Sprite 的 spriteFrame 属性
    track.path = new animation.TrackPath().toComponent(Sprite).toProperty('spriteFrame');
    const frames : Array<[number, SpriteFrame]> = spriteFrames.map((item, index) => [ANIMATION_SPEED * index, item]);
    track.channel.curve.assignSorted(frames);

    // 最后将轨道添加到动画剪辑以应用
    this.animationClip.name = this.path;
    this.animationClip.addTrack(track);

  }

  run() {
    // 播放动画
    this.fms.animationComponent.defaultClip = this.animationClip;
    this.fms.animationComponent.play();
  }
}
