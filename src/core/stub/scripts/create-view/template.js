import View, {ViewOutput} from "../../../../core/view/view";
import html from "./%kebab-name%.html";
import "./%kebab-name%.scss";

export default class %CamelName% extends View {

    constructor() {
        super(html);
    }

    static getPreloadContext() {
        return require.context('./', true, /preload\/*/);
    }

}

%CamelName%.Output = class extends ViewOutput {
    /**
     *
     * @param state {%CamelName%.Output.STATE}
     */
    constructor(state) {
        super(state);
    }
}

%CamelName%.Output.STATE = {
    NEXT:"next",
}