import Component from "../component";
import html from "./overlay-messager-component.html";
import "./overlay-messager-component.scss";

export default class OverlayMessagerComponent extends Component {
    
    constructor(parent = null) {
        super(html, parent)
        this._messageQueue = [];
        this._isShowingMessages = false;
    }

    static getInstance() {
        if(OverlayMessagerComponent.instance === null) {
            OverlayMessagerComponent.instance = new OverlayMessagerComponent();
        }
        return OverlayMessagerComponent.instance;
    }

    addMessageToQueue(message) {        
        this._messageQueue.push(message);
        if(!this._isShowingMessages) {
            this._showMessages();
        }                
    }

    addToQueue(messages) {    
        messages.forEach(m => this._messageQueue.push(m));           
        if(!this._isShowingMessages) {
            this._showMessages();
        }                
    }

    async _showMessages() {
        this.addComponentToDOM();
        this._isShowingMessages = true;
        while(this._messageQueue.length > 0) {
            let duration = this._messageQueue.length > 1 ? OverlayMessagerComponent.SHORT_DURATION : OverlayMessagerComponent.DURATION;
            const message = this._messageQueue.shift();                        
            await message.show(duration);
        }
        this._isShowingMessages = false;
        this.removeComponentFromDOM();
    }


}

OverlayMessagerComponent.instance = null;
OverlayMessagerComponent.SHORT_DURATION = 1500;
OverlayMessagerComponent.DURATION = 2500;