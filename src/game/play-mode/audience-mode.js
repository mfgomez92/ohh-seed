import PlayMode, {PlayModeState} from "./play-mode";
import AudienceTestView from "../view/audience-mode/audience-view-test/audience-test-view";
import SplashView from "../view/common/splash-view/splash-view";
import Preloader from "../../core/utils/preloader";
import CreatorTestView from "../view/creator-mode/creator-test-view/creator-test-view";
import O3h from "../../core/api/o3h";

export default class AudienceMode extends PlayMode {


    async start() {
        await super.start();
        await Preloader.preloadView(SplashView);
        this.preload(); // Preload all the rest of the views
        await O3h.getInstance().startModule();
        await (new SplashView()).start();
        await (new AudienceMode.InitialState()).process();
    }

    /**
     * Acá se debería hacer el preloading de cada vista en orden según aparición de vistas.
     * Esta función se debe ejecutar justo antes de mostrar la Splash y no hacerle await, así se cargan los assets,
     * mientras se muestra la splash
     * @returns {Promise<void>}
     */
    async preload() {
        await Preloader.preloadViewInQueue(AudienceTestView);
    }
}

AudienceMode.InitialState = class extends PlayModeState {
    async process() {
        await (new AudienceTestView()).start();
    }
}