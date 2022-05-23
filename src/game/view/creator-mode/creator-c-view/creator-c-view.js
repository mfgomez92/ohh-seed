import View from "../../../../core/view/view";
import CreatorAView from "../creator-a-view/creator-a-view";
import CreatorDView from "../creator-d-view/creator-d-view";
import html from "./creator-c-view.html";
import "./creator-c-view.scss";
import {TransitionType} from "../../../../core/view/view-manager";

export default class CreatorCView extends View {
    constructor() {
        super(html);
        this.$(".creator-a-view-button").onClick(this.exitWithOutput.bind(this, "creator-a-view"));
        this.$(".creator-d-view-button").onClick(this.exitWithOutput.bind(this, "creator-d-view"));
    }

    exitWithOutput(outputText) {
        this.onOutroStarts(async () => {
            if(outputText === "creator-a-view") {
                return new CreatorAView().start();
            } else if(outputText === "creator-d-view") {
                return new CreatorDView().start();
            }
            })
            .end(TransitionType.CROSS_FADE);
    }

    static getPreloadContext() {
        return require.context('./', true, /preload\/*/);
    }
}
