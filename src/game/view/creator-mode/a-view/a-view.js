import View, {ViewOutput} from "../../../../core/view/view";
import html from "./a-view.html";
import "./a-view.scss";
import Utils from "../../../../core/utils/utils"
import { TransitionType } from "../../../../core/view/view-manager";

export default class AView extends View {
    constructor() {
        super(html);
        this.number = 0;
        this.$(".a-view-input").addEventListener("input", (e) => {
            this.number = e.target.value;
        })
        this.$(".b-view-button").onClick(this.onClick.bind(this));
    }

    onClick() {
        this.onOutroEnds(async () => {
            await Utils.waitForMilliseconds(500);
            return new AView.Output(this.number);
        }).end(TransitionType.CROSS_FADE);
    }



    static getPreloadContext() {
        return require.context('./', true, /preload\/*/);
    }
}
AView.Output = class extends ViewOutput {
    constructor(state) {
        super(state);
    }
}
