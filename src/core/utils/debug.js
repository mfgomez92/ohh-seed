export default class Debug {

    constructor(devServer) {
        if (devServer) {
            return new PrintDebug();
        }else {
            return new NoPrintDebug();
        }
    }

    log(text) {

    }

    warn(text){

    }

    error (text) {

    }

}

export class NoPrintDebug {
    log(text) {

    }

    warn(text){

    }

    error (text) {

    }
}

export class PrintDebug {
    log(text) {
        console.groupCollapsed("%c >>> "+text, 'font-weight:bold; background-color: #c1c1ff; color: #4c4cff');
        console.trace();
        console.groupEnd();
    }

    warn(text){
        console.warn("%c >>>"+text, 'font-weight:bold; background-color: #fff4a8; color: #a59000');
    }

    error (text) {
        console.error("%c >>>"+text, 'font-weight:bold; background-color: #ff9cb3; color: #a30026');
    }
}