export default class EventEmitter {

    constructor() {

        this._eventHandlers = {};

    }

     /**
     * Let add a handler for component custom events (for now supports only one handler per event)
     * @param {String} eventName
     * @param {Function} handler
     */
      onEvent(eventName, handler) {
        this._eventHandlers[eventName] = handler;
    }

    /**
     * Trigger a component custom event
     * @param {String} eventName
     * @returns
     */
    triggerEvent(eventName) {
        if(eventName in this._eventHandlers) {
            this._eventHandlers[eventName]();
        }
    }

}