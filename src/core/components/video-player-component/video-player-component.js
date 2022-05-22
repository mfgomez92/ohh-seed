import Component from "../component";
import O3h from "../../api/o3h";
import VirtualViewManager from '../../view/virtual-view/virtual-view-manager';

export default class VideoPlayerComponent extends Component {

    /**
     *
     * @param {ViewElementHelper} htmlContainer
     * @param {VideoResource} videoResource
     * @param {boolean} loop
     * @param {boolean} showProgressBar
     * @param {ViewElementHelper} maskTarget
     */
    constructor(htmlContainer, loop = false, showProgressBar = false, maskTarget = null) {
        super();

        this._loop = loop;
        this._isFrontCamera = null;
        this._volume = 1;
        this._showProgressBar = showProgressBar;
        this._htmlContainer = htmlContainer;
        this._componentPosition = this._calculatePosition();
        if(O3h.getInstance().isStub()) {
            this._maskTargets = [...document.querySelectorAll("body > div:not(.stub-layer, .native-buttons-layer)")].map((v) => this.$(v));
        } else {
            this._maskTargets = [maskTarget === null ? this.$(document.body) : maskTarget];
        }

        this._currentVideoComponent = null;
        this._videoLayout = null;

        this.start();
    }

    play() {
        if(this._currentVideoComponent === null) {
            console.error("Video resource not set. You must set a video using setVideo method.");
            return;
        }
        this._currentVideoComponent.resume();
    }

    pause() {
        if(this._currentVideoComponent === null) {
            console.error("Video resource not set. You must set a video using setVideo method.");
            return;
        }
        this._currentVideoComponent.pause();
    }

    reset() {
        if(this._currentVideoComponent === null) {
            console.error("Video resource not set. You must set a video using setVideo method.");
            return;
        }
        this._currentVideoComponent.reset();
    }

    setVolume(volume) {
        if(this._currentVideoComponent === null) {
            console.error("Video resource not set. You must set a video using setVideo method.");
            return;
        }
        this._volume = volume;
        this._currentVideoComponent.setVolume(volume);
    }

    setLoop(loop) {
        this._loop = loop;
    }

    async setVideo(videoResource) {
        await this._createLayout();
        if (this._currentVideoComponent && this._currentVideoComponent.isCameraComponent()) {
            this._currentVideoComponent.stopCamera();
        }
        this._currentVideoComponent = await O3h.Component.createVideoComponent(videoResource, this._loop, this._showProgressBar);
        await this._videoLayout.setComponents([this._currentVideoComponent]);
        await this._videoLayout.show();
        this._applyClippingMask();
    }

    async playCamera(front = true) {
        this._isFrontCamera = front;
        await this._createLayout();
        this._currentVideoComponent = await O3h.Component.createCameraComponent(front);
        await this._videoLayout.setComponents([this._currentVideoComponent]);
        await this._videoLayout.show();
        this._applyClippingMask();
    }

    startRecording() {
        if(!this._currentVideoComponent.isCameraComponent) {
            return;
        }
        this._currentVideoComponent.startRecording();
    }

    async stopRecordingAndGetVideo(duration = 0) {
        if(!this._currentVideoComponent.isCameraComponent) {
            return;
        }
        return await this._currentVideoComponent.stopRecording(duration);
    }

    isFrontCamera() {
        return this._isFrontCamera;
    }

    _calculatePosition() {
        const rect = this._htmlContainer.getBoundingClientRect();

        return {
            x1: rect.x,
            x2: rect.x + rect.width,
            y1: rect.y,
            y2: rect.y + rect.height
        };
    }

    _applyClippingMask() {
        const realX1 = this._componentPosition.x1;
        const realX2 = this._componentPosition.x2;
        const realY1 = this._componentPosition.y1;
        const realY2 = this._componentPosition.y2;
        const virtualHeight = VirtualViewManager.getInstance()._virtualViewHeight;
        const virtualWidth = VirtualViewManager.getInstance()._virtualViewWidth;

        this._maskTargets.forEach(e => e.css("clipPath", `polygon(0 0, 0 ${virtualHeight}px, ${realX1}px ${virtualHeight}px, ${realX1}px ${realY1}px, ${realX2}px ${realY1}px, ${realX2}px ${realY2}px, ${realX1}px ${realY2}px, ${realX1}px ${virtualHeight}px, ${virtualWidth}px ${virtualHeight}px, ${virtualWidth}px 0)`));
    }

    async _createLayout() {
        const heightRatio = 100 / VirtualViewManager.getInstance()._realViewHeight;
        const widthRatio = 100 / VirtualViewManager.getInstance()._realViewWidth;
        const topPercentage = this._componentPosition.y1 * heightRatio;
        const leftPercentage = this._componentPosition.x1 * widthRatio;
        const rightPercentage = this._componentPosition.x2 * widthRatio;
        const bottomPercentage = this._componentPosition.y2 * heightRatio;
        this._videoLayout = await O3h.Layout.createLayout(O3h.Layout.TYPE.CUSTOM_SINGLE, new O3h.Layout.ComponentPosition(topPercentage, rightPercentage, bottomPercentage, leftPercentage));
    }

    beforeComponentEnds() {
        this._maskTargets.forEach(e => e.css("clipPath", ""));
        if(this._currentVideoComponent !== null) {
            this._currentVideoComponent.reset();
            this._currentVideoComponent = null;
        }
        this._videoLayout = null;
    }
}