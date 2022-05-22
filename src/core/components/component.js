import EventEmitter from "../utils/event-emitter";
import Utils from "../utils/utils";
import ViewElementHelperCreator, { ViewElementHelper } from "../view/view-element-helper";

export default class Component extends EventEmitter {
    /**
     *
     * This class is similar to the View. It's used to show components within a View. This class doesn't handle transitions.
     * Creates the component using the html provided but it doesn't add to the web until start function is called.
     * The created element will have the style class "component" and the name of the js class in kebab-case.
     *
     * @param html {string} : The html of the view
     * @param parent {HTMLElement|ViewElementHelper} : Parent element of the component. If null the view will be added to the body.
     * @param autoAddToDOM {boolean} : if false, add
     */
    constructor(html = null, parent = null, autoAddToDOM = true) {
        super();

        this._inputData = null;

        if(parent instanceof ViewElementHelper) {
            this._parent = parent.getHTMLElement();
        } else {
            this._parent = parent == null ? document.body : parent;
        }


        if (html != null) {
            /**
             *
             * @type {HTMLElement}
             */
            this.componentElement = document.createElement("div");
            this.componentElement.innerHTML = html;
            this.componentElement.classList.add("component", Utils.camelToKebabCase(this.constructor.name));
        }

        /**
         *
         * @type {Promise<ViewOutput|null>}
         */
        this._callbackPromise = null;
        this._autoAddToDOM = ((html != null) && autoAddToDOM);

        /**
         *
         * @type {function(string|HTMLElement):ViewElementHelper}
         */
        this.$ = ViewElementHelperCreator(this.componentElement);


    }

    /**
     *
     * Starts the new component. It adds the html to the page
     * This function resolves once the component ends.
     *
     * @param inputData : Input provided to the View
     * @returns {Promise<ComponentOutput|null>} : Resolved once the component ends
     */
    async start(inputData = null) {
        if (this._autoAddToDOM) {
            this.addComponentToDOM();
        }
        this._inputData = inputData;
        this._callbackPromise = Utils.deferredPromise(); // Resolved when the view ends.
        await this.onComponentStart();
        return this._callbackPromise.promise;
    }

    async onComponentStart() {

    }

    /**
     * Ends the component and also resolve the start promise

     */
    async end(output) {
        await this.beforeComponentEnds();
        this.removeComponentFromDOM();
        this._callbackPromise.resolve(output);
    }


    /**
     * Removes the component element from the DOM
     */
    removeComponentFromDOM() {
        if (this.componentElement) {
            this.componentElement.remove();
        }
    }

    /**
     * Excecutes before ending the component
     */
    async beforeComponentEnds() {
    }

    /**
     * Adds the previously created component element to de DOM
     */
    addComponentToDOM() {
        this._parent.prepend(this.componentElement);
    }

    /**
     * Fades out the component and resolves after the component is not visible.
     * Created for be called from de View Manager .
     * @returns {Promise<void>}
     */
    async fadeOut() {
        this.$().addClass('fade-out');
        await Utils.waitForSeconds(0.8);
    }

    /**
     * Hides the component
     */
    hide() {
        this.$().css("visibility", "hidden");
    }

    /**
     * Shows the component
     */
    show() {
        this.$().css("visibility", "visible");
    }


}


export class ComponentOutput {

}
