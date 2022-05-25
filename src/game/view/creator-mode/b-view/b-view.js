import View from "../../../../core/view/view";
import html from "./b-view.html";
import "./b-view.scss";
import Utils from "../../../../core/utils/utils"
import { TransitionType } from "../../../../core/view/view-manager";


export default class BView extends View {
    constructor() {
        super(html);
        this.$(".c-view-button").onClick(this.onClick.bind(this));
    }
    onClick() {
        this.onOutroEnds(async () => {
            await Utils.waitForMilliseconds(500);
        }).end(TransitionType.CROSS_FADE);
    }

    static getPreloadContext() {
        return require.context('./', true, /preload\/*/);
    }
}
