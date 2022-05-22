import O3h from "../../api/o3h";
import O3hAPI from "../../api/o3h-api";
import Utils from "../../utils/utils";
import Component from "../component";
import html from "./segmented-camera-component.html";
import "./segmented-camera-component.scss";


export default class SegmentedCameraComponent extends Component {
    constructor(parent, existingLayout = null) {
        super(html, parent);

        this.SEMENT_FACTOR = 0.4;
        this.SEGMENT_BASE_WIDTH = 980;
        this.SEGMENT_BASE_HEIGHT = 1743;
        this.segmentCanvasWidth = Math.trunc(this.SEGMENT_BASE_WIDTH * this.SEMENT_FACTOR);
        this.segmentCanvasHeight = Math.trunc(this.SEGMENT_BASE_HEIGHT * this.SEMENT_FACTOR);


        // If existing layout is passed, the component uses it to put camera feed.
        // Use case: when you have to show segmented camera feed over another Oooh video component
        this._layout = existingLayout;
        this._cameraComponent = null;
        this._segmentation = null;
        this._canvas = null;
        this.isStopped = false;
    }

    async load() {
        await this._createLayoutWithCameraComponent();
        await this._createSegmentation();
    }

    async _createLayoutWithCameraComponent() {
        this._cameraComponent = await O3h.Component.createCameraComponent();

        if (this._layout === null) {
            this._layout = O3h.Layout.createLayout(O3h.Layout.TYPE.FULLSCREEN);
            await this._layout.show();
        }
        await this._layout.setComponents([this._cameraComponent]);
    }


    async _createSegmentation() {
        this._canvas = this.$('.segmented-camera-canvas');
        this._segmentation = await O3hAPI.ImageSegmentationService.createSegmentation(this._cameraComponent, this.segmentCanvasWidth, this.segmentCanvasHeight, this._canvas);
        //TODO: this last api call must be to O3h.ImageSegmentationService.createSegmentation()
        this._segmentation.start();
        await this.fadeIn();
    }

    async fadeIn() {
        this._canvas.removeClass("fade-out");
        this._canvas.addClass("fade-in");
        await Utils.waitForMilliseconds(800);
    }

    async fadeOut() {
        this._canvas.removeClass("fade-in");
        this._canvas.addClass("fade-out");
        await Utils.waitForMilliseconds(800);
    }

    pause() {
        this._segmentation.stop();
    }

    stop() {
        this.isStopped = true;
        this._segmentation.stop();
        this._cameraComponent.stopCamera();
    }

    resume() {
        this._segmentation.start();
    }

    async restart() {
        this.isStopped = false;
        await this._cameraComponent.restartCamera();
        this._segmentation.start();
    }

    async beforeComponentEnds() {
        await this.fadeOut();
        this._segmentation.stop();
        this._cameraComponent.stopCamera();
        this._cameraComponent = null;
        this._layout = null;
    }


}