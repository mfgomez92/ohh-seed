import SplashView from "../view/common/splash-view/splash-view";
import CreatorAView from "../view/creator-mode/creator-a-view/creator-a-view";
import CreatorBView from "../view/creator-mode/creator-b-view/creator-b-view";
import CreatorCView from "../view/creator-mode/creator-c-view/creator-c-view";
import CreatorDView from "../view/creator-mode/creator-d-view/creator-d-view";
import PlayMode, {PlayModeState} from "./play-mode";
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
        await Preloader.preloadViewInQueue(CreatorAView);
        await Preloader.preloadViewInQueue(CreatorBView);
        await Preloader.preloadViewInQueue(CreatorCView);
        await Preloader.preloadViewInQueue(CreatorDView);
    }
}

CreatorMode.InitialState = class extends PlayModeState {
    async process() {

        let output;
        output = await (new CreatorAView().start());

        if(output.state === "creator-b-view") {
            output = await (new CreatorBView().start());
        } else if(output.state === "creator-c-view") {
            output = await (new CreatorCView().start());
        } else if(output.state === "creator-d-view") {
            output = await (new CreatorDView().start());
        } else {
            output = await (new CreatorAView().start());
        }
    }
}
