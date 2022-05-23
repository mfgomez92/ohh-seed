import View from "../../../../core/view/view";
import CreatorBView from "../creator-b-view/creator-b-view";
import html from "./creator-a-view.html";
import "./creator-a-view.scss";
import {TransitionType} from "../../../../core/view/view-manager";

export default class CreatorAView extends View {
    constructor() {
        super(html);
        this.$(".creator-b-view-button").onClick(this.exitWithOutput.bind(this, "creator-b-view"));
    }
    exitWithOutput() {
        this.onOutroStarts(async () => {
                return new CreatorBView().start();
            })
            .end(TransitionType.CROSS_FADE);
    }

    static getPreloadContext() {
        return require.context('./', true, /preload\/*/);
    }
}

