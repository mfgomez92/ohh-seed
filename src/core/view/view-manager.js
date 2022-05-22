import View from "./view";
import ViewOverlay from "./view-overlay";
import Preloader from "../utils/preloader";


export default class ViewManager {

    constructor() {
        /**
         *
         * @type {View}
         * @private
         */
        this._viewToEnd = null;
        this._transitionType = null;
    }

    /**
     *
     * @param view {View}
     * @returns {Promise<void>}
     */
    async viewStarts(view) {
        // Si todavía no hay vista para terminar no hago la transición
        await Preloader.waitForViewPreloaded(view.constructor);
        if (this._viewToEnd != null) {            
            if (this._transitionType == TransitionType.FULL_SCREEN) {
                await this._processIntroStarts(view);
                await ViewOverlay.getInstance().deactivate();
                await this._processIntroEnds(view);
            } else if (this._transitionType == TransitionType.CROSS_FADE) {
                await this._processIntroStarts(view);
                await this._viewToEnd.fadeOut();
                await this._processIntroEnds(view);
                this._viewToEnd.removeViewFromDOM();
            }
        } else {
            // First view
            await this._processIntroStarts(view);
            await this._processIntroEnds(view);
        }
    }

    /**
     * Mark the view for end when a new view starts and make the transition
     * @param view {View}
     * @param transitionType {TransitionType}
     */
    async viewEnds(view, transitionType) {
        this._viewToEnd = view;
        this._transitionType = transitionType;
        if (this._transitionType == TransitionType.FULL_SCREEN) {
            await this._processOutroStart();
            await ViewOverlay.getInstance().activate();
            await this._processOutroEnds();
            this._viewToEnd.removeViewFromDOM();
        }else if (this._transitionType == TransitionType.CROSS_FADE) {
            await this._processOutroStart();
            await this._processOutroEnds();
        }
    }


    /**
     * Singleton method
     * @returns {ViewManager}
     */
    static getInstance() {
        if (ViewManager.instance == null) {
            ViewManager.instance = new ViewManager();
        }
        return ViewManager.instance;
    }

    async _processOutroStart() {
        if (this._viewToEnd.onOutroStartsEventHandler != null) {
            let output = await this._viewToEnd.onOutroStartsEventHandler();
            if (output != null) {
                this._viewToEnd.resolveView(output);
            }
        }
    }

    async _processOutroEnds() {
        if (this._viewToEnd.onOutroEndsEventHandler != null) {
            let output = await this._viewToEnd.onOutroEndsEventHandler();
            if (output != null) {
                this._viewToEnd.resolveView(output);
            }
        }
        this._viewToEnd.resolveView(null); // Resolves the view if no handlers were set.
    }

    async _processIntroStarts(view) {
        if (view.onIntroStartsEventHandler != null) {
            await view.onIntroStartsEventHandler();
        }
    }

    async _processIntroEnds(view) {
        if (view.onIntroEndsEventHandler != null) {
            await view.onIntroEndsEventHandler();
        }
    }
}

ViewManager.instance = null;

export const TransitionType = {
    FULL_SCREEN: 'fade-black',
    CROSS_FADE: 'cross-fade'
}
