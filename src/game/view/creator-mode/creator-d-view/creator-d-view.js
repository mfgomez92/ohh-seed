import View from "../../../../core/view/view";
import CreatorBView from "../creator-b-view/creator-b-view";
import html from "./creator-d-view.html";
import "./creator-d-view.scss";
import {TransitionType} from "../../../../core/view/view-manager";

export default class CreatorDView extends View {
    constructor() {
        super(html);
        this.$(".creator-b-view-button").onClick(this.exitWithOutput.bind(this, "creator-b-view"));
        this.number=8;
    }
    exitWithOutput() {
        this.onOutroStarts(async () => {
                return new CreatorBView().start({number: this.number});
            })
            .end(TransitionType.CROSS_FADE);
    }

    static getPreloadContext() {
        return require.context('./', true, /preload\/*/);
    }
}

