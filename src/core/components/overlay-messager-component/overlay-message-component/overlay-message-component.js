import Utils from "../../../utils/utils";
import Component from "../../component";
import OverlayMessagerComponent from "../overlay-messager-component";
import html from "./overlay-message-component.html";
import "./overlay-message-component.scss";
import variables from '../overlay-messager-component.scss';

export default class OverlayMessageComponent extends Component {
    constructor(text) {
        super(html, OverlayMessagerComponent.getInstance().componentElement);

        this._text = text;
        this.$(".overlay-message-text").html(this._text);
    }

    async show(duration) {
        this.start();
        await Utils.waitForMilliseconds(duration);
        this.$().addClass("hide");        
        await Utils.waitForMilliseconds(parseInt(variables.overlayMessageAnimationDuration));
    }
}