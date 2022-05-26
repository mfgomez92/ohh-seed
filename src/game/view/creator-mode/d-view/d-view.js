import View, { ViewOutput } from "../../../../core/view/view";
import html from "./d-view.html";
import "./d-view.scss";
import Utils from "../../../../core/utils/utils";
import { TransitionType } from "../../../../core/view/view-manager";

export default class DView extends View {

  constructor() {
    super(html);
    this.$(".b-view-button").onClick(this.onClick.bind(this));
    this.$(".promise-button").onClick(()=> this.promise());
    this.$(".promise-button-5").onClick(()=>this.onClickPromise(5));
    this.$(".promise-button-7").onClick(()=>this.onClickPromise(7));
    this.onIntroStarts(() => {
        this.onClickPromise(5);
    })
  }

  onClick() {
    this.onOutroEnds(async () => {
      await Utils.waitForMilliseconds(500);
      return new DView.Output(8);
    }).end(TransitionType.CROSS_FADE);
  }

  promise(duration=0) {
    return new Promise(function (resolve, reject) {
      setTimeout(function () {
          console.log("Click!")
        resolve();
      }, `${duration}000`);
    });
  }

  async onClickPromise(duration) {
    await this.promise(duration);
    alert("Click "+ duration)
  }

  static getPreloadContext() {
    return require.context("./", true, /preload\/*/);
  }
}
DView.Output = class extends ViewOutput {
  constructor(state) {
    super(state);
  }
};
