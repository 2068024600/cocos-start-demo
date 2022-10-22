import { _decorator, Component, director, ProgressBar, resources } from 'cc';
const { ccclass, property } = _decorator

@ccclass('LoadingManager')
export class LoadingManager extends Component {
  @property(ProgressBar)
  bar: ProgressBar

  onLoad() {
    this.preLoad()
  }

  preLoad() {
    director.preloadScene('Battle')
    resources.preloadDir(
      'texture',
      (cur, total) => {
        this.bar.progress = cur / total
      },
      async err => {
        if (err) {
          await new Promise(rs => {
            setTimeout(rs, 2000)
          })
          this.preLoad()
          return
        }

        director.loadScene('Battle')
      },
    )
  }
}
