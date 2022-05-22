import View, {ViewOutput} from "../../../../core/view/view";
import html from "./test-home-view.html";
import "./test-home-view.scss";
import {TransitionType} from "../../../../core/view/view-manager";

export default class TestHomeView extends View {

    constructor() {
        super(html);
        this.$(".test-virtual-view-button").onClick(this.exitWithOutput.bind(this, "This is test mode"));
        this.$(".test-leaderboard-pre-view-button").onClick(this.exitWithOutput.bind(this, "leaderboard-pre"));
        this.$(".test-leaderboard-post-view-button").onClick(this.exitWithOutput.bind(this, "leaderboard-post"));
        this.$(".test-video-player-view-button").onClick(this.exitWithOutput.bind(this, "video-player"));
    }

    exitWithOutput(outputText) {
        this.onOutroStarts(async () => {
                return new ViewOutput(outputText);
            })
            .end(TransitionType.CROSS_FADE);
    }

    static getPreloadContext() {
        return require.context('./', true, /preload\/*/);
    }

}