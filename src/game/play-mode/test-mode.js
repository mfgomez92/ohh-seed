import { ViewOutput } from "../../core/view/view";
import SplashView from "../view/common/splash-view/splash-view";
import TestHomeView from "../view/test-mode/test-home-view/test-home-view";
import TestLeaderboardPreView from "../view/test-mode/test-leaderboard-pre-view/test-leaderboard-pre-view";
import TestVideoPlayerView from "../view/test-mode/test-video-player-view/test-video-player-view";
import TestVirtualViewView from "../view/test-mode/test-virtual-view-view/test-virtual-view-view";
import PlayMode, {PlayModeState} from "./play-mode";
import Preloader from "../../core/utils/preloader";
import O3h from "../../core/api/o3h";

export default class TestMode extends PlayMode {


    async start() {
        await super.start();
        await Preloader.preloadView(SplashView);
        this.preload();
        await O3h.getInstance().startModule();
        await (new SplashView()).start();
        await (new TestMode.InitialState()).process();
    }


    async preload() {
        await Preloader.preloadViewInQueue(TestHomeView);
        await Preloader.preloadViewInQueue(TestLeaderboardPreView);
        await Preloader.preloadViewInQueue(TestVideoPlayerView);
        await Preloader.preloadViewInQueue(TestVirtualViewView);
    }
}

TestMode.InitialState = class extends PlayModeState {
    async process() {

        let output;
        output = await (new TestHomeView().start());

        if(output.state === "leaderboard-pre") {
            output = await (new (TestLeaderboardPreView)).start({ leaderboardType: "pre" });
        } else if(output.state === "leaderboard-post") {
            output = await (new (TestLeaderboardPreView)).start({ leaderboardType: "post", score: 1500 });

        } else if(output.state === "video-player") {
            output = await (new (TestVideoPlayerView)).start();
        } else {
            output = await (new (TestVirtualViewView)).start(output.state); // le paso la salida del TestHomeView
        }

        console.log(output.state);

        if(output.state === ViewOutput.STATE.BACK) {
            await (new TestMode.InitialState()).process();
        }

    }
}