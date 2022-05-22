import View from "../../../../core/view/view";
import html from "./creator-test-view.html";
import "./creator-test-view.scss";

export default class CreatorTestView extends View {
    constructor() {
        super(html);
    }

    static getPreloadContext() {
        return require.context('./', true, /preload\/*/);
    }
}

