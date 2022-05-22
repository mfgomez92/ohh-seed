import Game from "../../game/game";
import "../../index.scss";
import O3hStub from "./o3h-stub";
import O3hAPIExt from "../../core-ext/api/o3h-api-ext";


if (window.location.href.indexOf("localhost") > -1 || window.location.href.indexOf("forceStub") > -1) {
    let load = async function () {
        new O3hStub();
        new Game();
        await Game.getInstance().load();
        await Game.getInstance().start();
    };
    load();
} else {
    import(/* webpackIgnore: true */ "/api/o3hLoader.js").then(l => l.default).then(async (o3h) => {
        new O3hAPIExt(o3h, true);
        new Game();
        await Game.getInstance().load();
        await Game.getInstance().start();
    })
}
