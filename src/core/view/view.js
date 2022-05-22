import ViewManager, {TransitionType} from "./view-manager";
import "./view.scss";
import Utils from "../utils/utils";
import ViewElementHelperCreator from "./view-element-helper";
import O3h from "../api/o3h";

export default class View {

    /**
     *
     * Creates the view using the html provided but it doesn't add to the web until start function is called.
     * The created element will have the style class "view" and the name of the js class in kebab-case.
     *
     * @param html {string} : The html of the view
     * @param parent {HTMLElement} : Parent element of the view. If null the view will be added to the body.
     * @param autoAddToDOM {boolean} : if false, add
     */
    constructor(html, parent = null, autoAddToDOM = true, hasGoBackButton = false, disableBICall = false) {
        this._inputData = null;
        this._parent = parent == null ? document.body : parent;
        /**
         *
         * @type {HTMLElement}
         */
        this.viewElement = document.createElement("div");
        this.viewElement.innerHTML = html;
        this.viewElement.classList.add("view", Utils.camelToKebabCase(this.constructor.name));
        /**
         *
         * @type {Promise<ViewOutput|null>}
         */
        this._callbackPromise = null;
        this._autoAddToDOM = autoAddToDOM;
        this._disableBICall = disableBICall;

        /**
         *
         * @type {null|function(): Promise<ViewOutput|null>}
         */
        this.onIntroStartsEventHandler = null;
        /**
         *
         * @type {null|function(): Promise<ViewOutput|null>}
         */
        this.onIntroEndsEventHandler = null;
        /**
         *
         * @type {null|function(): Promise<ViewOutput|null>}
         */
        this.onOutroStartsEventHandler = null;
        /**
         *
         * @type {null|function(): Promise<ViewOutput|null>}
         */
        this.onOutroEndsEventHandler = null;

        /**
         *
         * @type {function(string|HTMLElement):ViewElementHelper}
         */
        this.$ = ViewElementHelperCreator(this.viewElement);

        if (hasGoBackButton) {
            this._goBackButton = this.$(document.createElement("div")).addClass("go-back-button");
            this._goBackButton.onClick(this.goBack.bind(this));
            this.$().prepend(this._goBackButton);
        }
    }

    /**
     *
     * Starts the new view. It adds the html to the page and starts the transition from the previous page (via ViewManager)
     * This function resolves once the view ends.
     *
     * @param inputData : Input provided to the View
     * @returns {Promise<ViewOutput|null>} : Resolved once the view ends
     */
    async start(inputData = null) {
        if (this._autoAddToDOM) {
            this.addViewToDOM();
        }
        this._inputData = inputData;
        this._callbackPromise = Utils.deferredPromise(); // Resolved when the view ends.
        await ViewManager.getInstance().viewStarts(this);

        /**
         * Notifies BI service that current view started if corresponds
         */
        if(!this._disableBICall) {
            O3h.getInstance().getAnalyticsService().setPage(this.getPageNameForBI());
        }

        return this._callbackPromise.promise;
    }

    /**
     * Mark the view for end when a new view starts and make the transition, also resolve the start promise
     * @param transitionType {TransitionType}
     */
    end(transitionType) {
        ViewManager.getInstance().viewEnds(this, transitionType);
    }


    /**
     *
     * @param eventHandler {function(): Promise<ViewOutput|null>}
     */
    onIntroStarts(eventHandler) {
        this.onIntroStartsEventHandler = eventHandler;
        return this; // For fluent interface
    }

    /**
     *
     * @param eventHandler {function(): Promise<ViewOutput|null>}
     */
    onIntroEnds(eventHandler) {
        this.onIntroEndsEventHandler = eventHandler;
        return this; // For fluent interface
    }

    /**
     * Sets the handler, if the execution of the handler returns an element, the view resolves on that moment.
     * @param eventHandler {function(): Promise<ViewOutput|null>}
     */
    onOutroStarts(eventHandler) {
        this.onOutroStartsEventHandler = eventHandler;
        return this; // For fluent interface
    }

    /**
     * Sets the handler, if the execution of the handler returns an element, the view resolves on that moment.
     * @param eventHandler {function(): Promise<ViewOutput|null>}
     */
    onOutroEnds(eventHandler) {
        this.onOutroEndsEventHandler = eventHandler;
        return this; // For fluent interface
    }

    goBack() {
        let output = new ViewOutput(ViewOutput.STATE.BACK);
        this.onOutroEnds(async () => {
            return output;
        }).end(TransitionType.CROSS_FADE);
    }

    /**
     * Removes the view element from the DOM
     */
    removeViewFromDOM() {
        this.viewElement.remove();
    }

    /**
     * Adds the previously created view element to de DOM
     */
    addViewToDOM() {
        this._parent.prepend(this.viewElement);
    }

    /**
     * Fades out the view and resolves after the view is not visible.
     * Created for be called from de View Manager .
     * @returns {Promise<void>}
     */
    async fadeOut() {
        this.viewElement.classList.add('fade-out');
        await Utils.waitForSeconds(0.8);
    }

    /**
     * Resolves the promise created on start. This function is called from the ViewManager
     * @param viewOutput {ViewOutput | null}
     */
    resolveView(viewOutput) {
        if (this._callbackPromise != null) {
            this._callbackPromise.resolve(viewOutput);
        }
    }

    getInputData() {
        return this._inputData;
    }

    /**
     * Returns class name by default, or override it to custumize BI page name
     * It is used to call BI service in O3H API.
     */
     getPageNameForBI() {
        return this.constructor.name.replace("View", "");
    }


    // HELPERS

    /**
     * Adds the click event to the element identified by the querySelector
     * @param querySelector
     * @param handler
     */
    onClick(querySelector, handler) {
        Utils.onClick(this.viewElement.querySelector(querySelector), handler);
    }

    /**
     * Adds the an event listener to the element identified by the querySelector
     * @param querySelector
     * @param eventName
     * @param handler
     */
    addEventListener(querySelector, eventName, handler) {
        Utils.addEventListener(this.viewElement.querySelector(querySelector), eventName, handler);
    }


    /**
     * Returns the element identified by the querySelector
     * @param querySelector
     * @returns {HTMLElement}
     */
    getElement(querySelector) {
        return this.viewElement.querySelector(querySelector);
    }

    static getPreloadContext() {
        if (O3h.getInstance().isStub()) {
            alert("Se debe implementar la función getPreloadContext en " + this.name + ". Ver la consola para más info");
            debug.log("Se debe implementar la función getPreloadContext en " + this.name + ".\n La función debe ser: \n " +
                "static getPreloadContext() {\n" +
                "   return require.context('./', true, /preload\\/*/);\n" +
                "}");
        }
    }
}


export class ViewOutput {

    /**
     *
     * @param state{ViewOutput.STATE}
     */
    constructor(state) {
        this.state = state;
    }

    getState() {
        return this.state;
    }

}

ViewOutput.STATE = {
    NEXT: "next",
    BACK: "back",
    RETRY: "retry",
    TEST_GAME: "test-game"
}
