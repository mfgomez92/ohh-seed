import "./index.scss";
import Game from "./game/game";
import O3hAPIExt from "./core-ext/api/o3h-api-ext";

import(/* webpackIgnore: true */ "/api/o3hLoader.js").then(l => l.default).then(async (o3h) => {
        new O3hAPIExt(o3h);
        new Game();
        await Game.getInstance().start();
})