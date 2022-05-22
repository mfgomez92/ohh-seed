import Spinner from "../utils/spinner/spinner";
import Utils from "../utils/utils";

export default class ViewOverlay {


    constructor() {
        this._isActive = false;
        this._spinnerThreshold = 500;  
        this._timer = null; 
    }

    static getInstance() {
        if (ViewOverlay.instance == null) {
            ViewOverlay.instance = new ViewOverlay();
        }
        return ViewOverlay.instance;
    }

    isActive() {
        return this._isActive;
    }

    async activate(showSpinner = true) {
        document.body.classList.add("view-overlay"); // styles in view.scss
        this._isActive = true;
        await Utils.waitForMilliseconds(500);
        if(showSpinner) {
            this._timer = setTimeout(function() {
                Spinner.getInstance().show();
            }, this._spinnerThreshold);
        }        
    }

    async deactivate() {
        if(this._timer) {
            clearTimeout(this._timer);
            this._timer = null;
            Spinner.getInstance().hide();
        }      
        if (this._isActive) {
            document.body.classList.add("overlay-hide");
            this._isActive = false;
            await Utils.waitForMilliseconds(500);
            document.body.classList.remove("overlay-hide", "view-overlay");
        }
    }

}

ViewOverlay.instance = null;