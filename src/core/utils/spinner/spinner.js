import Utils from "../utils";
import "./spinner.scss";

export default class Spinner {

    constructor() {
        this.element = null,
        this.html = "<div class=\"lds-ring\"><div></div><div></div><div></div><div></div></div>";
    }

    show() {
        this.element = Utils.createHTMLElementFromString(this.html);
        document.body.append(this.element);
    }

    hide() {
        if (this.element !== null) {
            this.element.remove();
            this.element = null;
        }
    }

    static getInstance() {
        if (Spinner.instance === null) {
            Spinner.instance = new Spinner();
        }
        return Spinner.instance;
    }
}

Spinner.instance = null;