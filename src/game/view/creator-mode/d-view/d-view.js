import View, {ViewOutput} from "../../../../core/view/view";
import html from "./d-view.html";
import "./d-view.scss";
import Utils from "../../../../core/utils/utils"
import { TransitionType } from "../../../../core/view/view-manager";

export default class DView extends View {
    constructor() {
        super(html);
        this.$(".b-view-button").onClick(this.onClick.bind(this));
    }
    onClick() {
        this.onOutroEnds(async () => {
            await Utils.waitForMilliseconds(500);
            return new DView.Output(8);
        }).end(TransitionType.CROSS_FADE);
    }
    static getPreloadContext() {
        return require.context('./', true, /preload\/*/);
    }
}
DView.Output = class extends ViewOutput {
    constructor(state) {
        super(state);
    }
}
