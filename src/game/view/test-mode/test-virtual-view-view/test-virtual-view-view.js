import html from "./test-virtual-view-view.html";
import View from "../../../../core/view/view";
import "./test-virtual-view-view.scss";

export default class TestVirtualViewView extends View {
    constructor() {
        super(html, null, true, true);
        this.onIntroStarts(()=>{
            this.$(".content").html(this._inputData);
        });
    }

    static getPreloadContext() {
        return require.context('./', true, /preload\/*/);
    }

}