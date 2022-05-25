import View, {ViewOutput} from "../../../../core/view/view";
import html from "./b-view.html";
import "./b-view.scss";
import Utils from "../../../../core/utils/utils"
import { TransitionType } from "../../../../core/view/view-manager";


export default class BView extends View {
    constructor() {
        super(html);
        this.$(".c-view-button").onClick(this.onClick.bind(this));
        this.onIntroStarts(async () => {
            this.getElement(".container-number").innerText =  this._inputData.number;
        })
    }
    onClick() {
        this.onOutroEnds(async () => {
            await Utils.waitForMilliseconds(500);
            return new BView.Output(parseInt(this._inputData.number)+5);
        }).end(TransitionType.CROSS_FADE);
    }

    static getPreloadContext() {
        return require.context('./', true, /preload\/*/);
    }
}
BView.Output = class extends ViewOutput {
    constructor(state) {
        super(state);
    }
}
