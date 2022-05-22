import PlayMode, {PlayModeState} from "./play-mode";
import SplashView from "../view/common/splash-view/splash-view";
import CreatorTestView from "../view/creator-mode/creator-test-view/creator-test-view";
import Preloader from "../../core/utils/preloader";
import O3h from "../../core/api/o3h";

export default class CreatorMode extends PlayMode {

    async start() {
        await super.start();
        await Preloader.preloadView(SplashView);
        this.preload(); // Preload all the rest of the views
        await O3h.getInstance().startModule();
        await (new SplashView()).start();
        await (new CreatorMode.InitialState).process();
    }

    /**
     * Acá se debería hacer el preloading de cada vista en orden según aparición de vistas.
     * Esta función se debe ejecutar justo antes de mostrar la Splash y no hacerle await, así se cargan los assets,
     * mientras se muestra la splash
     * @returns {Promise<void>}
     */
    async preload() {
        await Preloader.preloadViewInQueue(CreatorTestView);
    }
}

CreatorMode.InitialState = class extends PlayModeState {
    async process() {
        await (new CreatorTestView()).start();
    }
}


