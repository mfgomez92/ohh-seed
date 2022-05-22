import createjs from "preload-js";
import Debug from "./debug";
import O3h from "../api/o3h";


export default class Preloader {
    static async preloadAll() {
        Debug.warn("Se está haciendo preloadAll, verificar si no se puede optimizar la carga");
        /**
         * Prelodea todos los archivos dentro de cualquier carpeta con nombre preload.
         * Hay que tener cuidado cuando se agregan cosas, porque algunos archivos rompen la carga
         */
        return new Promise(function (resolve, reject) {
            createjs.LoadQueue.loadTimeout = 10000000000000000;
            createjs.LoadQueue.LOAD_TIMEOUT = 10000000000000000;
            var queue = new createjs.LoadQueue(false);
            queue.on("complete", handleFileComplete);
            queue.on("error", error);
            let req = require.context('./../../', true, /preload\/*/);
            const paths = req.keys().map(req);

            var myManifest = [];
            paths.forEach(e => {
                if (typeof e === 'string') {
                    myManifest.push({src: e});

                }
            });
            queue.loadManifest(myManifest, true);

            function handleFileComplete(event) {
                resolve();
            }

            function error(event) {
                console.error("Error preloading file: " + event.item.src);
                resolve();
            }
        });
    }


    /**
     * Preloads all assets passed in the path array
     * @param paths
     * @returns {Promise<void>} Resolves after all assets finish the fecth
     */
    static async preloadAssets(paths) {
        if (paths == null || paths.length == 0) return;
        return new Promise(function (resolve, reject) {
            createjs.LoadQueue.loadTimeout = 10000000000000000;
            createjs.LoadQueue.LOAD_TIMEOUT = 10000000000000000;
            var queue = new createjs.LoadQueue(false);
            queue.on("complete", handleFileComplete);
            queue.on("error", error);
            var myManifest = [];
            paths.forEach(e => {
                if (typeof e === 'string') {
                    myManifest.push({src: e});

                }
            });
            queue.loadManifest(myManifest, true);

            function handleFileComplete(event) {
                resolve();
            }

            function error(event) {
                console.error("Error preloading file: " + event.item.src);
                resolve();
            }
        });
    }


    /**
     * Preloads all the assets of a the view and resolves after all are fetched
     * @param viewClass
     * @returns {Promise<void>}
     */
    static async preloadView(viewClass) {

        async function preload(viewClass) {
            let context = viewClass.getPreloadContext();
            const paths = context.keys().map(context);
            await Preloader.preloadAssets(paths);
        }

        let promise = preload(viewClass);
        Preloader.preloadPromisesByView[viewClass.name] = promise;
        return promise;
    }

    /**
     * Adds the view to a queue to preload all the assets of it and resolves after all are fetched.
     * @param viewClass
     * @returns {Promise<void>}
     */
    static async preloadViewInQueue(viewClass) {
        let preloadPromise = Preloader.preloadPromisesQueue.then(Preloader.preloadView.bind(this, viewClass)).catch(() => {
        });
        Preloader.preloadPromiseQueue = preloadPromise;
        Preloader.preloadPromisesByView[viewClass.name] = preloadPromise;
        await preloadPromise;
    }


    /**
     * Returns a promise that resolves once all the assets are fetched for that view
     * @param viewClass
     * @returns {Promise<*>}
     */
    static async waitForViewPreloaded(viewClass) {
        let preloadPromise = Preloader.preloadPromisesByView[viewClass.name];
        if (preloadPromise == null && O3h.getInstance().isStub()) {
            alert(`La clase ${viewClass.name} se está instanciando sin haber sido preloadada. Ver consola para más información`);
            debug.log(`La clase ${viewClass.name} se está instanciando sin haber sido preloadada. 
                Llamar a Preloader.loadView pasando por parámetro la clase. Usualmente en la clase del playmode correspondiente.`);
        }
        return preloadPromise;
    }


}

Preloader.preloadPromisesQueue = Promise.resolve();
Preloader.preloadPromisesByView = [];