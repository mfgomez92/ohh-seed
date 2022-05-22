import View from "../../../../core/view/view";
import html from "./audience-test-view.html";
import "./audience-test-view.scss";

export default class AudienceTestView extends View {

    constructor() {
        super(html);       
    }

    static getPreloadContext() {
        return require.context('./', true, /preload\/*/);
    }

}