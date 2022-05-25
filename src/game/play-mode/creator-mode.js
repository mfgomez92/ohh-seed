import SplashView from "../view/common/splash-view/splash-view";
import AView from "../view/creator-mode/a-view/a-view";
import BView from "../view/creator-mode/b-view/b-view";
import CView from "../view/creator-mode/c-view/c-view";
import DView from "../view/creator-mode/d-view/d-view";
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

    async preload() {
        await Preloader.preloadViewInQueue(AView);
        await Preloader.preloadViewInQueue(BView);
        await Preloader.preloadViewInQueue(CView);
        await Preloader.preloadViewInQueue(DView);
    }

}
CreatorMode.InitialState = class extends PlayModeState {
    async process() {
            await (new AView().start());
            await (new CreatorMode.BState).process()
    }
}
CreatorMode.BState = class extends PlayModeState {
    async process() {
        await (new BView().start());
        let output;
        output = await (new CView().start());

        if(output.state === "a-view") {
            await (new CreatorMode.InitialState).process()
        } else  {
           await (new DView().start());
           await (new CreatorMode.BState).process()
        }
    }
}