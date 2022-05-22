import Utils from "../utils/utils";
import VirtualViewManager from "./virtual-view/virtual-view-manager";

/**
 *
 * @param viewElement{HTMLElement}
 * @returns {ViewElementHelper}
 */
export default function ViewElementHelperCreator(viewElement) {

    /**
     *
     * @param selector{string|HTMLElement}
     * @constructor
     */
    function ViewElementHelperFunction(selector) {
        return new ViewElementHelper(viewElement, selector);
    }

    return ViewElementHelperFunction;
}

export class ViewElementHelper {
    /**
     *
     * @param viewElement {HTMLElement}
     * @param selector {string|HTMLElement|null}
     */
    constructor(viewElement, selector = null) {
        this._viewElement = viewElement;
        if(selector === null) {
            this._selectedElement = viewElement;
        } else if (selector instanceof HTMLElement) {
            this._selectedElement = selector;
        } else {
            this._selectedElement = this._viewElement.querySelector(selector);

        }
    }

    /**
     * Sets the onClick Event
     * @param handler {function}
     * @returns {ViewElementHelper}
     */
    onClick(handler) {
        Utils.onClick(this._selectedElement, handler);
        return this;
    }

    /**
     * Sets the onClick Event and it's removed after the first execution
     * @param handler {function}
     */
    onClickOnce(handler) {
        Utils.onClickOnce(this._selectedElement, handler);
    }



    /**
     * Sets an event listener to the element. Same functionality that addEventListener
     * @param eventName {string}
     * @param handler {function}
     * @returns {ViewElementHelper}
     */
    on(eventName, handler) {
        Utils.addEventListener(this._selectedElement,eventName, handler);
        return this;
    }

    /**
     * Sets an event listener to the element
     * @param eventName {string}
     * @param handler {function}
     * @returns {ViewElementHelper}
     */
    addEventListener(eventName, handler) {
        Utils.addEventListener(this._selectedElement,eventName, handler);
        return this;
    }


    /**
     * Sets an event listener to the element that is removed after the first execution
     * @param eventName {string}
     * @param handler {function}
     * @returns {ViewElementHelper}
     */
    addOnePlayEventListener(eventName, handler) {
        Utils.addOnePlayEventListener(this._selectedElement, eventName, handler);
        return this;
    }

    /**
     * Removes a previous set listener to the element
     * @param eventName {string}
     * @param handler {function}
     */
    removeEventListener(eventName, handler) {
        Utils.removeEventListener(this._selectedElement, eventName, handler);
        return this;
    }

    /**
     * Sets the inner HTML of the element
     * @param content {string}
     */
    html(content = null) {
        if(content === null) {
            /**
             * Returns the inner HTML of the element
             * @returns {string}
             */
            return this._selectedElement.innerHTML;
        }
        this._selectedElement.innerHTML = content;
        return this;
    }

    /**
     * Sets the inner Text of the element
     * @param text {string}
     */
    text(text = null) {
        if(text === null) {
            /**
             * Returns the inner Text of the element
             * @returns {string}
             */
            return this._selectedElement.innerText;
        }
        this._selectedElement.innerText = text;
        return this;
    }

    /**
     * Sets the value of the element
     * @param value {string}
     */
    val(value = null) {
        if(value === null) {
            /**
             * Returns the value of the element
             * @returns {string}
             */
            return this._selectedElement.value;
        }
        this._selectedElement.value = value;
        return this;
    }


    /**
     * Sets the value of an element's property
     * @param property {string}
     * @param value {string}
     */
    prop(property, value = null) {
        if(value === null) {
            /**
             * Returns the value of an element's property
             * @returns {string}
             */
            return this._selectedElement[property];
        }
        this._selectedElement[property] = value;
        return this;
    }


    /**
     * Add the css class with className to the selected element
     * @param className {string}
     * @returns {ViewElementHelper}
     */
    addClass(className) {
        this._selectedElement.classList.add(className);
        return this;
    }

    /**
     * Removes the css class with className to the selected element
     * @param className {string}
     * @returns {ViewElementHelper}
     */
    removeClass(className) {
        this._selectedElement.classList.remove(className);
        return this;
    }

    hasClass(className) {
        return this._selectedElement.classList.contains(className);
    }

    /**
     * Toggles the css class with className to the selected element
     * @param className {string}
     * @returns {ViewElementHelper}
     */
    toggleClass(className) {
        if (this.hasClass(className)) {
            this.removeClass(className);
        }else {
            this.addClass(className)
        }
        return this;
    }

    /**
     * Sets an css property to the element. Is the same as element.style.propertyName = value
     * @param propertyName {string}
     * @param value {string}
     * @returns {ViewElementHelper}
     */
    css(propertyName, value = null) {
        if(value === null) {
            /**
             * Returns the computed value of the element's css property
             * @returns {string}
             */
            return window.getComputedStyle(this._selectedElement, null).getPropertyValue(propertyName);
        }
        this._selectedElement.style[propertyName] = value;
        return this;
    }


    /**
     * Shows the element by setting display block
     * @returns {ViewElementHelper}
     */
    show() {
        this._selectedElement.style.display = "block";
        return this;
    }

    /**
     * Hides the element by setting display none
     * @returns {ViewElementHelper}
     */
    hide() {
        this._selectedElement.style.display = "none";
        return this;
    }

    /**
     * Returns a list of ViewHelpers of the associated children
     * @returns {*[]}
     */
    children() {
        let result = [];
        let children = Array.from(this._selectedElement.children);
        for (let i=0; i<children.length; i++){
            result.push(new ViewElementHelper(this._viewElement, children[i]));
        }
        return result;
    }

    /**
     * Returns a selected element boundaries
     * @returns {*[]}
     */
    getBoundingClientRect() {
        return this._selectedElement.getBoundingClientRect();
    }

    /**
     * Prepend element to selected element
     * @param element {ViewElementHelper}
     */
    prepend(element) {
        this._selectedElement.prepend(element._selectedElement);
    }

    /**
     * Append element to selected element
     * @param element {ViewElementHelper}
     */
    append(element) {
        this._selectedElement.append(element._selectedElement);
    }

    getContext(context) {
        return this._selectedElement.getContext(context);
    }

    createClippingMask(topPercentage, rightPercentage, bottomPercentage, leftPercentage) {
        const virtualHeight = VirtualViewManager.getInstance()._virtualViewHeight;
        const virtualWidth = VirtualViewManager.getInstance()._virtualViewWidth;
        const realX1 = leftPercentage * virtualWidth / 100;
        const realX2 = rightPercentage * virtualWidth / 100;
        const realY1 = topPercentage * virtualHeight / 100;
        const realY2 = bottomPercentage * virtualHeight / 100;
        this._selectedElement.style.clipPath = `polygon(0 0, 0 ${virtualHeight}px, ${realX1}px ${virtualHeight}px, ${realX1}px ${realY1}px, ${realX2}px ${realY1}px, ${realX2}px ${realY2}px, ${realX1}px ${realY2}px, ${realX1}px ${virtualHeight}px, ${virtualWidth}px ${virtualHeight}px, ${virtualWidth}px 0)`;
    }

    toString() {
        return this._selectedElement.outerHTML;
    }

    getHTMLElement() {
        return this._selectedElement;
    }

    focus() {
        this._selectedElement.focus();
    }

    blur() {
        this._selectedElement.blur();
    }
}