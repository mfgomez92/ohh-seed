import View from "../../../../core/view/view";
import html from "./creator-b-view.html";
import "./creator-b-view.scss";
import CreatorCView from "../creator-c-view/creator-c-view";
import {TransitionType} from "../../../../core/view/view-manager";

export default class CreatorBView extends View {
    constructor() {
        super(html);
        this.onIntroStarts(async () => {
            this.number=parseInt(this._inputData.number)+5
            this.getElement(".container").innerText = this.number;
        })
        this.$(".creator-c-view-button").onClick(this.exitWithOutput.bind(this, "creator-c-view"));
    }
    
    exitWithOutput() {
        this.onOutroStarts(async () => {
                return new CreatorCView().start({number:this.number});
            })
            .end(TransitionType.CROSS_FADE);
    }

    static getPreloadContext() {
        return require.context('./', true, /preload\/*/);
    }
}

