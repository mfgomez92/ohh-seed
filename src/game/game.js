import O3h, {O3hMode} from "../core/api/o3h";
import AudienceMode from "./play-mode/audience-mode";
import CreatorMode from "./play-mode/creator-mode";
import SplashView from "./view/common/splash-view/splash-view";
import VirtualViewManager from "../core/view/virtual-view/virtual-view-manager";
import Preloader from "../core/utils/preloader";
import Audio from "../core/utils/audio";
import v from "../../version.json";
import TestMode from "./play-mode/test-mode";
import Polyfills from "../core/utils/polyfills";

export default class Game {


    constructor() {
        console.log("version: " + v.version);
        console.log("date: " + v.date);
        /**
         *
         * @type {TryNotToLaugh}
         */
        Game.instance = this;
        /**
         *
         * @type {PlayMode}
         */
        this.playMode = null;
        if (O3h.getInstance().getMode() === O3hMode.AUDIENCE) {
            this.playMode = new AudienceMode();
        }else if (O3h.getInstance().getMode() === O3hMode.CREATOR) {
            this.playMode = new CreatorMode();
        }else if (O3h.getInstance().getMode() === O3hMode.TEST) {
            this.playMode = new TestMode();
        }else if (O3h.getInstance().getMode() === O3hMode.CREATOR_SUBMISSION_PROCESSING ) {
            this.playMode = new TestMode();
        }
        O3h.getInstance().initializeAnalyticsService();
    }


    async load() {
        Polyfills.load();
        Audio.load();
        new VirtualViewManager();
    }

    async start() {
        await this.playMode.start();
    }


}


Game.getInstance = function () {
    return Game.instance;
}