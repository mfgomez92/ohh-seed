export default class Polyfills {
    constructor() {
    }

    static load() {
        Polyfills.promiseAny();
    }    
}

Polyfills.promiseAny = function() {
    if (Promise.any == null) {            
        Promise.any = async (iterable
        ) => {
            return Promise.all(
            [...iterable].map(promise => {
                return new Promise((resolve, reject) =>
                Promise.resolve(promise).then(reject, resolve)
                );
            })
            ).then(
            errors => Promise.reject(errors),
            value => Promise.resolve(value)
            );
        };
    }    
}        