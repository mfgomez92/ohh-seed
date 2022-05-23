import View from "../../../../core/view/view";
import html from "./creator-b-view.html";
import "./creator-b-view.scss";
import CreatorCView from "../creator-c-view/creator-c-view";
import {TransitionType} from "../../../../core/view/view-manager";

export default class CreatorBView extends View {
    constructor() {
        super(html);
        this.$(".creator-c-view-button").onClick(this.exitWithOutput.bind(this, "creator-c-view"));
    }

    exitWithOutput() {
        this.onOutroStarts(async () => {
                return new CreatorCView().start();
            })
            .end(TransitionType.CROSS_FADE);
    }

    static getPreloadContext() {
        return require.context('./', true, /preload\/*/);
    }
}

