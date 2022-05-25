import View, {ViewOutput} from "../../../../core/view/view";
import Utils from "../../../../core/utils/utils"
import { TransitionType } from "../../../../core/view/view-manager";
import html from "./c-view.html";
import "./c-view.scss";

export default class CView extends View {
    constructor() {
        super(html);
        this.$(".a-view-button").onClick(this.onClick.bind(this, "a-view"));
        this.$(".d-view-button").onClick(this.onClick.bind(this, "d-view"));
    }
    onClick(outputText) {
        this.onOutroEnds(async () => {
            await Utils.waitForMilliseconds(500);
            return new CView.Output(outputText);
        }).end(TransitionType.CROSS_FADE);
    }

    static getPreloadContext() {
        return require.context('./', true, /preload\/*/);
    }
}
CView.Output = class extends ViewOutput {
    constructor(state) {
        super(state);
    }
}
