import "./virtual-view.scss";

export default class VirtualViewManager {

    /**
     * This class was created to adjust views to fit on all devices. See doc:
     * To use it add the style class to the div .virtual-view-container
     *
     */

    constructor() {
        /**
         *
         * @type {VirtualViewManager}
         */
        VirtualViewManager.instance = this;

        this.viewScale = 1;

        this._updateView();
        window.addEventListener('resize', this._updateView.bind(this));
    }


    _updateView() {
        // alert(document.documentElement.clientHeight);
        this._realViewWidth = document.documentElement.clientWidth;
        this._realViewHeight = document.documentElement.clientHeight;
        this._virtualViewWidth = 980; // Width of the view in iphone X
        this._virtualViewHeight = 2122; // Height of the view in iphone X
        this.viewScale = this._realViewHeight / this._virtualViewHeight;
        let root = document.documentElement;
        root.style.setProperty("--virtual-view-width", this._virtualViewWidth + "px");
        root.style.setProperty("--virtual-view-height", this._virtualViewHeight + "px");
        root.style.setProperty("--virtual-view-scale", this.viewScale);
    }


    /**
     *
     * @returns {VirtualViewManager}
     */
    static getInstance() {
        return VirtualViewManager.instance;
    }


    getRealCoordinateX(virtualCoordinateX) {
        return (virtualCoordinateX - (this._virtualViewWidth * 0.5)) * this.viewScale + (this._virtualViewWidth * 0.5);
    }

    getRealCoordinateY(virtualCoordinateY) {
        return virtualCoordinateY * this.viewScale;
    }

    getRealRelativeCoordinateX(virtualCoordinateX) {
        return this.getRealCoordinateX(virtualCoordinateX) / this._realViewWidth * 100;
    }

    getRealRelativeCoordinateY(virtualCoordinateY) {
        return this.getRealCoordinateY(virtualCoordinateY) / this._realViewHeight * 100;
    }

}


VirtualViewManager.instance = null;