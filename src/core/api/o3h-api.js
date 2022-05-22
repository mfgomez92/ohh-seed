import O3h, {O3hMode} from "./o3h";
import Utils from "../utils/utils";
import Debug, {NoPrintDebug, PrintDebug} from "../utils/debug";

export default class O3hAPI extends O3h {

    constructor(o3h, devServer = false) {
        super();
        this.o3h = o3h;

        this.o3h.Instance.adjustViewport("980px");
        /**
         *
         * @type {O3h.Analytics}
         */

        this._fullScreenRecorder = null;
        this._screenRecorderPermissionsGranted = null;

        this.analyticService = null;
        this.userDataService = null;
        this.systemSettingsService = null;
        this.replayRecorder = null;

        O3h.Component = O3hAPI.Component;
        O3h.Layout = O3hAPI.Layout;
        O3h.FaceTracker = O3hAPI.FaceTracker;
        O3h.HighlightController = O3hAPI.HighlightController;

        this._devServer = devServer;
        window.debug = new Debug(devServer);
    }



    getIsDevServer() {
        return this._devServer;
    }

    /**
     *
     * @returns {boolean}
     */
    isStub() {
        return false;
    }


    /**
     *
     * @returns {O3hMode}
     */
    getMode() {
        switch (this.o3h.Instance.playType) {
            case this.o3h.PlayType.Audience:
                return O3hMode.AUDIENCE;
            case this.o3h.PlayType.Creator:
                return O3hMode.CREATOR;
            case this.o3h.PlayType.CreatorSubmissionProcessing:
                return O3hMode.CREATOR_SUBMISSION_PROCESSING;
        }
    }

    /**
     *
     */
    initializeAnalyticsService() {
        try {
            this.analyticService = new O3hAPI.Analytics(this.o3h.Instance.getAnalyticService());
        } catch (e) {
            console.error("Couldn't initialize analytic service: '" + e + "'");
        }
    }

    /**
     *
     */
    initializeUserDataService() {
        try {
            this.userDataService = new O3hAPI.UserDataService(this.o3h.Instance.getUserDataService());
        } catch (e) {
            console.error("Couldn't initialize user data service: '" + e + "'");
        }
    }

    /**
     *
     */
    initializeSystemSettingsService() {
        try {
            this.systemSettingsService = new O3hAPI.SystemSettingsService(this.o3h.Instance.getSystemSettingsService());
        } catch (e) {
            console.error("Couldn't initialize system settings service: '" + e + "'");
        }
    }

    /**
     *
     */
    async initializeReplayRecorder() {
        try {
            this.replayRecorder = new O3hAPI.ReplayRecorder(await this.o3h.Instance.createReplayRecorder());
        } catch (e) {
            console.error("Couldn't initialize replay recorder: '" + e + "'");
        }
    }


    /**
     *
     * @returns {O3h.Analytics}
     */
    getAnalyticsService() {
        if (this.analyticService == null) {
            this.initializeAnalyticsService();
        }
        return this.analyticService;
    }

    /**
     *
     * @returns {O3h.UserDataService}
     */
    getUserDataService() {
        if (this.userDataService == null) {
            this.initializeUserDataService();
        }
        return this.userDataService;
    }


    /**
     * System Settings Service
     * @returns {O3h.SystemSettingsService}
     */
    getSystemSettingsService() {
        if (!this.systemSettingsService) {
            this.initializeSystemSettingsService();
        }
        return this.systemSettingsService;
    }

    /**
     * Replay Recorder
     * @returns {O3h.ReplayRecorder}
     */
    async getReplayRecorder() {
        if (!this.replayRecorder) {
            await this.initializeReplayRecorder();
        }
        return this.replayRecorder;
    }

    /**
     * Speech to text
     * @returns {SpeechToTextService}
     */
    async getSpeechToTextService() {
        let inputManager = this.o3h.Instance.getInputManager();
        return await inputManager.getSpeechToText();
    }

    /**
     * Face tracker
     * @returns {O3h.FaceTracker}
     */
    async getFaceTracker(cameraComponent) {
        let faceTracker;
        try {
            let inputManager = this.o3h.Instance.getInputManager();
            faceTracker = await inputManager.getFaceTracker(cameraComponent._getO3hComponent());
        } catch(error) {
            console.error("Could not initialize Face Traker: " + error);
        }
        return new O3hAPI.FaceTracker(faceTracker);
    }

    // Global settings UI

    showSystemSettings() {
        this.getSystemSettingsService().showSystemSettings();
    }

    hideSystemSettings() {
        this.getSystemSettingsService().hideSystemSettings();
    }


    /**
     * Opens the gallery and let user pick a video
     * @returns {Promise<O3h.VideoResource>}
     */
    async pickVideo() {
        try {
            let video = await this.o3h.Instance.getAssetManager().getVideoFromGallery("galleryVideo");
            return new O3hAPI.VideoResource(video);
        } catch(e) {
            return null;
        }
    }

    /**
     * Opens the gallery and let user pick a video
     * @returns {Promise<O3h.VideoResource>}
     */
     async pickImage() {
        try {
            let image = await this.o3h.Instance.getAssetManager().getImageFromGallery("galleryMedia");
            return new O3hAPI.ImageResource(image);
        } catch(e) {
            return null;
        }
    }


    getVideoFromUrl(url) {
        let videoObj = {};
        videoObj.path = url;
        videoObj.getVideoPath = function () {
            return this.path;
        };
        let video = new O3hAPI.VideoResource(videoObj);
        return video;
    }

    /**
     * Forces asking user for recording permission
     */
    async askForRecordingScreenPermission() {
        if (this.screenRecorderPermissionsGranted) {
            return;
        }
        let controlManager = this.o3h.Instance.getControlManager();
        this._fullScreenRecorder = await controlManager.getFullScreenRecorder();
        this._screenRecorderPermissionsGranted = (this._fullScreenRecorder != null);
    }


    /**
     * Starts recording the full screen. This must be finished by calling finishFullScreenRecording
     */
    async startFullScreenRecording() {
        if (!this._fullScreenRecorder) {
            let controlManager = this.o3h.Instance.getControlManager();
            this._fullScreenRecorder = await controlManager.getFullScreenRecorder();
            this._screenRecorderPermissionsGranted = (this._fullScreenRecorder != null);
        }
        this._fullScreenRecorder.startRecording();
    }


    _addHighlightToFullScreenRecording(type, level) {
        if (!this._fullScreenRecorder) {
            console.error("trying to add highlight to not setted fullscreen recorder")
        } else {
            this._fullScreenRecorder.addHighlight(type, level);
        }
    }

    /**
     * Finishes recording the full screen.
     * @returns {Promise<O3h.VideoResource>}
     */
    async finishFullScreenRecording(duration = 0) {
        return new O3hAPI.VideoResource(await this._fullScreenRecorder.stopRecording(duration));
    }

    /**
     *
     * @returns {O3h.NativeRecordButton}
     */
    async getNativeRecordButton(x, y, height, color, backgroundColor, fontOptions) {
        let button = await this.o3h.Instance.getNativeUIManager().createNativeRecordButton(x, y, height);
        button.setColor(color);
        button.setBackgroundColor(backgroundColor);
        button.setFont(fontOptions.size, fontOptions.color);
        return new O3hAPI.NativeRecordButton(button);
    }

    /**
     *
     * @param layoutType {O3h.Layout.TYPE}
     * @returns {O3h.Layout}
     */
    createLayout(layoutType) {
        return O3hAPI.Layout.createLayout(layoutType);
    }

    getConfigValue(key) {
        return this.o3h.Instance.getConfigValue(key);
    }


    /**
     *
     * @param resource {O3h.Resource}
     */
    addAssetToOutput(resource) {
        this.o3h.Instance.getAssetManager().addToOutput(resource.name, resource.video);
    }


    /**
     *
     * @param image {O3h.ImageResource}
     */
    shareImage(image) {
        return this.o3h.Instance.getAssetManager().shareImage(image.image);
    }

    async getVideoFromInput(key) {
        const videoAsset = this.o3h.Instance.getInputAsset(key);
        if (videoAsset == null) {
            return null;
        } else {
            return new O3hAPI.VideoResource(videoAsset);
        }
    }

    /**
     * Starts the module (hide the o3h loading screen)
     * @returns {Promise<void>}
     */
    async startModule() {
        return new Promise((resolve, reject) => {
            this.o3h.Instance.ready(async () => {
                resolve();
            });
        });
    }

    /**
     *
     * @param score {Number}
     */
    completeModule(score = 0, notForConsideration = false) {
        let exitCondition = new O3hAPI.ExitCondition(score, notForConsideration);
        this.o3h.Instance.completeModule(exitCondition);
    }



    /**
     * Returns de name of the creator
     * @returns {Promise<string>}
     */
    async getCreatorName() {
        let creatorUserInformation = await (this.getUserDataService()).getCreatorUserInformation();
        return creatorUserInformation.getName();
    }

    /**
     * Returns de avatar url of the creator
     * @returns {Promise<string>}
     */
    async getCreatorAvatarImageUrl() {
        let creatorUserInformation = await (this.getUserDataService()).getCreatorUserInformation();
        return creatorUserInformation.getAvatarImageUrl();
    }

    /**
     * Returns de name of the active user
     * @returns {Promise<string>}
     */
    async getActiveUserName() {
        let activeUserInfo = await (this.getUserDataService()).getActiveUserInformation();
        return activeUserInfo.getName();
    }

    /**
     * Returns de avatar url of the active user
     * @returns {Promise<string>}
     */
    async getActiveUserAvatarImageUrl() {
        let activeUserInfo = await (this.getUserDataService()).getActiveUserInformation();
        return activeUserInfo.getAvatarImageUrl();
    }

    /**
     * Increments an aggregation property by <increment> server side
     * @param {string} key
     * @param {number} increment
     */
    async addIncrementToAggregateProperty(propertyKey, increment = 1) {
        (await this.getReplayRecorder()).addAggregateIncrementProperty(propertyKey, increment);
        const replayData = await this.replayRecorder.getReplayData();
        this.o3h.Instance.getAssetManager().addToOutput("replayData", replayData);
    }

    /**
     * Returns collection of aggregation properties and their values
     * @returns {Promise.<object.<string, string>>}
     */
    async getAggregatePropertiesAndValues() {
        const replayData = this.o3h.Instance.getAssetManager().getInputAsset("replayData");
        if(!replayData) {
            throw new Error("Replay Data object does not exist on input assets.");
        }
        const replayPlayer = await replayData.createReplayPlayer();
        return await replayPlayer.getAggregatedProperties();
    }

    /**
     * Returns collection of properties and their values
     * @returns {Promise.<object.<string, string>>}
     */
    async getPropertiesAndValues(propertyKey = "replayData") {
        const replayData = this.o3h.Instance.getAssetManager().getInputAsset(propertyKey);
        if(!replayData) {
            console.error("Replay Data object does not exist on input assets.");
            return null;
        }
        const replayPlayer = await replayData.createReplayPlayer();
        return await replayPlayer.getProperties();
    }

    /**
     * Add a property and its value to replay data
     * @param propertyKey {string}
     * @param propertyValue {any}
     */
    async addPropertyToReplayData(propertyKey, propertyValue) {
        (await this.getReplayRecorder()).addProperty(propertyKey, propertyValue);
    }



}


O3hAPI.Analytics = class extends O3h.Analytics {

    constructor(analyticService) {
        super();
        this.analyticService = analyticService;
    }

    /**
     *
     * @param val
     */
    setPage(val) {
        if (this.analyticService) {
            this.analyticService.setPage(val);
        }
    }

    logCustomEvent(key, val) {
        if (this.analyticService) {
            this.analyticService.logCustomEvent(key, val);
        }
    }

    replay() {
        if (this.analyticService) {
            this.analyticService.replay();
        }
    }
}

O3hAPI.ImageResource = class extends O3h.ImageResource {
    constructor(imageAsset) {
        super();
        this.image = imageAsset;
    }

    async getImageUrl() {
        return this.image.getImageUrl();
    }


}

O3hAPI.AudioResource = class extends O3h.AudioResource {
    constructor(audioAsset) {
        super();
        this.audio = audioAsset;
    }

    async getAudioUrl() {
        return this.audio.getAudioUrl();
    }
}

O3hAPI.VideoResource = class extends O3h.VideoResource {
    constructor(videoAsset) {
        super();
        this.video = videoAsset;
    }

    async getPath() {
        return this.video.getVideoPath();
    }
}

O3hAPI.NativeRecordButton = class extends O3h.NativeRecordButton {
    constructor(button) {
        super();
        this.button = button;
    }

    show() {
        this.button.show();
    }

    hide() {
        this.button.hide();
    }

    startCountdown() {
        this.button.startCountdown();
    }

    resetCountdown(seconds = 0) {
        this.button.resetCountdown(seconds);
    }

    pauseCountdown() {
        this.button.pauseCountdown();
    }

    setClickedEventHandler(handler) {
        this.button.clickedEvent.add(handler);
    }

    setCountdownEndedEventHandler(handler) {
        this.button.countdownEndedEvent.add(handler);
    }
}


O3hAPI.Component = class extends O3h.Component {

    constructor(_o3hComponentConfig) {
        super();
        this._loop = true;
        this._showProgressBar = false,
        this._o3hComponentConfig = _o3hComponentConfig;
        this._o3hComponent = null;
        this._videoResource = null;
    }


    /**
     * Creates a video component without setting the video, use prepareVideo after show the layout
     * @param loop {boolean}
     * @param showProgressBar {boolean}
     * @returns {O3h.Component}
     */
    static async createEmptyVideoComponent(loop = true, showProgressBar = false) {
        let o3h = O3h.getInstance().o3h;
        let videoConfig = new o3h.VideoComponentConfig();
        videoConfig.progressBarVisible = showProgressBar;
        let instance = new O3hAPI.Component(videoConfig);
        instance._loop = loop;
        instance._showProgressBar = showProgressBar;
        return instance;
    }


    /**
     *
     * @param videoResource {O3h.VideoResource}
     * @param loop {boolean}
     * @param showProgressBar {boolean}
     * @returns {O3h.Component}
     */
    static async createVideoComponent(videoResource, loop = true, showProgressBar = false) {
        let o3h = O3h.getInstance().o3h;
        let videoConfig = new o3h.VideoComponentConfig();
        videoConfig.url = await videoResource.getPath();
        videoConfig.progressBarVisible = showProgressBar;
        let instance = new O3hAPI.Component(videoConfig);
        instance._loop = loop;
        instance._showProgressBar = showProgressBar;
        instance._videoResource = videoResource;
        return instance;
    }

    /**
     *
     * @param front {boolean}
     * @returns {O3h.Component}
     */
    static async createCameraComponent(front = true) {
        let o3h = O3h.getInstance().o3h;
        const cameraConfig = new o3h.CameraComponentConfig();
        if (!front) {
            cameraConfig.cameraType = o3h.CameraType.RearFacing;
        }
        cameraConfig.showRecordingUI = false;
        cameraConfig.enableBodyTracking = false;
        return new O3hAPI.Component(cameraConfig);
    }

    /**
     * Turn the camera off, to allow for the camera to be temporarily disabled without having to switch to a new layout
     */
    stopCamera() {
        if (this._o3hComponentConfig instanceof O3h.getInstance().o3h.CameraComponentConfig) {
            this._getO3hComponent().stopCamera();
        }
    }

    /**
     * Turn the camera back on again after turning it off with stopCamera()
     */
    async restartCamera() {
        if (this._o3hComponentConfig instanceof O3h.getInstance().o3h.CameraComponentConfig) {
            await this._getO3hComponent().restartCamera();
        }
    }

    /**
     * Start recording camera feed
     */
    startRecording() {
        if (this._o3hComponentConfig instanceof O3h.getInstance().o3h.CameraComponentConfig) {
            this._getO3hComponent().startRecording();
        }
    }

    /**
     * Stop recording camera feed
     * @param delay {number} Delay in seconds. Shows remaining secs indicator on screen
     * @returns {Promise<O3h.VideoResource>}}
     */
    async stopRecording(delay = 0) {
        if (this._o3hComponentConfig instanceof O3h.getInstance().o3h.CameraComponentConfig) {
            let videoResource = await this._getO3hComponent().stopRecording(delay);
            return new O3hAPI.VideoResource(videoResource);
        }
    }

    async play() {
        // Se le da play solo si es video
        if (this._o3hComponentConfig instanceof O3h.getInstance().o3h.VideoComponentConfig) {
            if (this._getO3hComponent() != null) {
                this._getO3hComponent().setLooping(this._loop);
                await this._getO3hComponent().playVideo();
            }
        }
    }

    pause() {
        if (this._o3hComponentConfig instanceof O3h.getInstance().o3h.VideoComponentConfig) {
            this._getO3hComponent().pause();
        }
    }

    resume() {
        if (this._o3hComponentConfig instanceof O3h.getInstance().o3h.VideoComponentConfig) {
            this._getO3hComponent().resume();
        }
    }

    reset() {
        this._getO3hComponent().reset();
    }

    setVolume(volume) {
        if (this._o3hComponentConfig instanceof O3h.getInstance().o3h.VideoComponentConfig) {
            this._getO3hComponent().setVolume(volume);
        }
    }

    /**
     * Receives an array with numbers from 0 to 1, relatives to video length
     * @param {Array<number>}
     * @returns {Promise<Array<O3h.ImageResource>>}
     */
    async captureFrames(framesPositions) {
        if (this._getO3hComponent() != null) {
            let assetManager = O3h.getInstance().o3h.Instance.getAssetManager();
            let framesImages = [];
            const videoLength = await this.getVideoLength() / 1000 - 1;
            for(let i = 0; i < framesPositions.length; i++) {
                let imageAsset = await assetManager.getVideoFrame(this._videoResource.video, Math.floor(framesPositions[i] * videoLength));
                framesImages.push(new O3hAPI.ImageResource(imageAsset));
            }
            return framesImages;
        }
    }


    async prepareVideo(videoResource) {
        await this._getO3hComponent().prepareVideo(await videoResource.getPath());
    }

    /**
     * Returns the length of the video associated with this component in milliseconds
     * @returns {Promise<number>}
     */
    async getVideoLength() {
        return this._getO3hComponent().getVideoLength();
    }

    /**
     * Returns the video resource contained in this component
     * @returns {VideoResource}
     */
    getVideoResource() {
        return this._videoResource;
    }

    isCameraComponent() {
        return this._o3hComponentConfig instanceof O3h.getInstance().o3h.CameraComponentConfig;
    }

    isEmptyComponent() {
        return this._videoResource === null;
    }

    _getO3hComponentConfig() {
        return this._o3hComponentConfig;
    }

    _setO3hComponent(component) {
        this._o3hComponent = component;
    }

    _getO3hComponent() {
        return this._o3hComponent;
    }

}


O3hAPI.Layout = class extends O3h.Layout {

    constructor() {
        super();
        this._o3hLayout = null;
        this._layoutDescription = null;
    }


    /**
     *
     * @param layoutType {O3h.Layout.TYPE}
     * @param componentPosition {O3h.Layout.ComponentPosition}
     * @returns {O3h.Layout}
     */
    static createLayout(layoutType, componentPosition = null) {
        let instance = new O3hAPI.Layout();
        let o3h = O3h.getInstance().o3h;
        switch (layoutType) {
            case O3h.Layout.TYPE.FULLSCREEN:
                instance._layoutDescription = {
                    childrenFlexDirection: o3h.Layout.Direction.Vertical,
                    children: [
                        {
                            id: '0',
                            anchor: o3h.Layout.Position.TopLeft,
                            pivot: o3h.Layout.Position.TopLeft,
                            offset: {
                                x: 0,
                                y: 0
                            },
                            size: {
                                x: 1,
                                y: 1
                            }
                        }
                    ]
                };
                break;
            case O3h.Layout.TYPE.VERTICAL_EVEN_SPLIT:
                instance._layoutDescription = {
                    childrenFlexDirection: o3h.Layout.Direction.Vertical,
                    children: [
                        {
                            id: '0',
                            flexRatio: 1
                        },
                        {
                            id: '1',
                            flexRatio: 1
                        }
                    ]
                };
                break;
            case O3h.Layout.TYPE.CUSTOM_SINGLE:
                instance._layoutDescription = {
                    children: [
                        {
                            id: '0',
                            anchor: o3h.Layout.Position.TopLeft,
                            pivot: o3h.Layout.Position.TopLeft,
                            offset: {
                                x: componentPosition.left * 0.01,
                                y: -componentPosition.top * 0.01
                            },
                            size: {
                                x: (componentPosition.right - componentPosition.left) * 0.01,
                                y: (componentPosition.bottom - componentPosition.top) * 0.01
                            }
                        }
                    ]
                }
                break;
            case O3h.Layout.TYPE.CUSTOM_MULTI:
                let childrenConfig = [];
                componentPosition.forEach((v, k) => {
                    childrenConfig.push(
                        {
                            id: "" + k,
                            anchor: o3h.Layout.Position.TopLeft,
                            pivot: o3h.Layout.Position.TopLeft,
                            offset: {
                                x: v.left * 0.01,
                                y: -v.top * 0.01
                            },
                            size: {
                                x: (v.right - v.left) * 0.01,
                                y: (v.bottom - v.top) * 0.01
                            }
                        });
                });
                instance._layoutDescription = { children: childrenConfig };
                break;
        }
        return instance;
    }


    /**
     *
     * @param autoplayComponents
     * @returns {Promise<void>}
     */
    async show(autoplayComponents = true, preserveActiveLayout = false) {
        if(autoplayComponents) {
            for (let i = 0; i < this.components.length; i++) {
                this.components[i].play();
            }
        }
        await this._o3hLayout.show(preserveActiveLayout);
    }

    /**
     *
     * @param components {[O3hAPI.Component]}
     */
    async setComponents(components) {
        this.components = components;
        let componentConfigurations = {};
        for (let i = 0; i < components.length; i++) {
            componentConfigurations["" + i] = components[i]._getO3hComponentConfig();
        }
        this._o3hLayout = await O3h.getInstance().o3h.Instance.createLayout(this._layoutDescription, componentConfigurations);
        for (let i = 0; i < components.length; i++) {
            components[i]._setO3hComponent(this._o3hLayout.getComponent("" + i));
        }
    }


    static async resetLayout() {
        const layout = await O3h.getInstance().o3h.Instance.createLayout("Full Screen");
        await layout.show();
    }

}


// Minimum distances from mid-screen for a face to be centered, in % of screen width (0.0134 = about 25 pixels, 0.055 = about 100 pixels, 0.067 = about 125 pixels, 0.079 = about 150 pixels)
const FACE_CENTERED_LIMIT = {
    x: window.innerWidth * 0.093 * (window.devicePixelRatio || 1),
    y: window.innerWidth * 0.093 * (window.devicePixelRatio || 1)
};
// Offset distance from mid-screen for face center point, in % of screen width (about -175 pixels)
const FACE_CENTERED_OFFSET = {
    x: window.innerHeight * 0 * (window.devicePixelRatio || 1),
    y: window.innerHeight * -0.093 * (window.devicePixelRatio || 1)
};


O3hAPI.FaceTracker = class extends O3h.FaceTracker {
    /**
     *
     * @param faceTracker {FaceTracker}
     */
    constructor(faceTracker) {
        super();

        this.o3h = O3h.getInstance().o3h;
        this.faceTracker = faceTracker;
        this.isTracking = false;
        this.faceLandmarksSubject = null;
    }

    start() {
        try {
            this.faceTracker.start();
            this.isTracking = true;
        } catch (e) {
            console.error("Error starting faceTracker: " + e);
        }
    }

    stop() {
        // Stop tracking faces
        if (this.isTracking === true) {
            try {
                this.faceTracker.stop();
                this.isTracking = false;
            } catch (e) {
                console.error("Error stopping faceTracker: " + e);
            }
        }
    }

    destroy() {
        try {
            this.isTracking = false;
            this.faceTracker.stop();
            this.faceTracker.destroy();
        } catch (e) {
            console.error("Error destroying faceTracker: " + e);
        }
    }

    addFaceAddedEvent(event) {
        this.faceTracker.FaceAddedEvent.add(event);
    }

    addFaceRemovedEvent(event) {
        this.faceTracker.FaceRemovedEvent.add(event);
    }

    subscribeToNosePosition(onNextPosition, onFaceRemoved = null) {
        this.subscribeToFacePartPosition(this.o3h.FacePointIndex.NoseBridge4, onNextPosition, onFaceRemoved);
    }

    subscribeToFacePartPosition(facePart, onNextPosition, onFaceRemoved) {
        this.addFaceAddedEvent(faceEvent => {
            if(faceEvent.Id !== null) {
                this.faceLandmarksSubject = this.faceTracker.subscribeToFaceLandmarks(faceEvent.Id);
                this.faceLandmarksSubject.subscribe(
                    facePointsArray => {
                        try {
                            const nosePosition = facePointsArray[facePart];
                            onNextPosition(nosePosition);
                        } catch (error) {
                            console.error("Unable to process face points", facePointsArray, error);
                        }
                    },
                    /* onComplete: */
                    () => {
                        // do nothing
                    },
                    /* onError: */
                    message => {
                        console.error("Error in subscribeToFaceLandmarks: " + message);
                    }
                );
            }
        });

        this.addFaceRemovedEvent(faceEvent => {
            this.faceLandmarksSubject.unsubscribe();
            if(typeof onFaceRemoved === "function") {
                onFaceRemoved(faceEvent);
            }
        });
    }
}

O3hAPI.HighlightController = class extends O3h.HighlightController {
    constructor() {
        super();
        this.o3h = O3h.getInstance().o3h;

        this.smileScore = 0;
        this.smileChangeScore = 0;
        this.endGameScore = 0;
        this.isTracking = false;

        this.prevSmile = 0;

        this.endGameWeight = 0.5;
    }

    updateBlendShapes(smile) {
        if (!this.isTracking)
            return;

        smile = Math.min(smile, 100) / 100;

        this.smileScore = Math.max(smile, this.smileScore);

        const smileChange = smile - this.prevSmile;
        this.prevSmile = smile;
        this.smileChangeScore = Math.max(smileChange, this.smileChangeScore);
    }

    recordEndGame() {
        this.endGameScore = this.endGameWeight;
    }

    start() {
        this.isTracking = true;
        this.recordingInterval = setInterval(() => this.recordHighlightScore(), 500);
    }

    stop() {
        this.isTracking = false;
        clearInterval(this.recordingInterval);

        this.recordHighlightScore();
    }

    recordHighlightScore() {
        let finalScore = (this.smileScore + this.smileChangeScore + this.endGameScore) / 3;
        finalScore = Math.floor(finalScore * 100);

        O3h.getInstance()._addHighlightToFullScreenRecording(this.o3h.HighlightType.Funny, finalScore);

        this.smileScore = 0;
        this.smileChangeScore = 0;
        this.endGameScore = 0;
    }
}


O3hAPI.ImageSegmentationService = class extends O3h.ImageSegmentationService {

    constructor() {
        super();
        this.service = null;
        this.subject = null;
        this.context = null;
        this.imageData = null;
    }

    /**
     * @returns {O3h.ImageSegmentationService}
     */
    static async createSegmentation(cameraComponent, width, height, canvas) {
        let instance = new O3hAPI.ImageSegmentationService();
        let o3h = O3h.getInstance().o3h;
        let service = await o3h.Instance.getInputManager().getImageSegmentationService(cameraComponent._getO3hComponent());
        let subject = service.subscribeToComposite(width, height);
        instance.service = service;
        instance.subject = subject;

        canvas.prop("height", height);
        canvas.prop("width", width);

        instance.context = canvas.getContext('2d');
        instance.imageData = new ImageData(width, height);

        instance.subject.subscribe(instance._updateCanvas.bind(instance), null, null);

        return instance;
    }

    start() {
        this.service.start();
    }

    stop() {
        this.service.stop();
    }

    async _updateCanvas(textureData) {
        await textureData.setImageData(this.imageData);
        this.context.putImageData(this.imageData, 0, 0);
    }

    getService() {
        return this.service;
    }

    getSubject() {
        return this.subject;
    }

}

O3hAPI.UserDataService = class extends O3h.UserDataService {

    constructor(userDataService) {
        super();
        this.userDataService = userDataService;
    }


    /**
     * @returns {O3h.UserInformation}
     */
    async getActiveUserInformation() {
        return new O3hAPI.UserInformation(await this.userDataService.getActiveUserInformation());
    }

    /**
     * @returns {O3h.UserInformation}
     */
    async getCreatorUserInformation() {
        return new O3hAPI.UserInformation(await this.userDataService.getCreatorUserInformation());
    }

    /**
     * @returns {O3h.Leaderboard}
     */
    async getLeaderboard() {
        return new O3hAPI.Leaderboard(await this.userDataService.getLeaderboard());
    }
}

O3hAPI.UserInformation = class extends O3h.UserInformation {

    constructor(userInformation) {
        super();
        this.userInformation = userInformation;
    }

    getName() {
        return this.userInformation.Name;
    }

    getAvatarImageUrl() {
        return this.userInformation.AvatarImageUrl;
    }
}

O3hAPI.Leaderboard = class extends O3h.Leaderboard {

    constructor(leaderboard) {
        super();
        this.leaderboard = leaderboard;
    }

    async getEntries() {
        let entries = [];
        for(const entry of this.leaderboard.Entries) {
            entries.push(new O3hAPI.LeaderboardEntry(entry.Rank, entry.Score, new O3hAPI.UserInformation(entry.User), entry.IsOwner));
        }
        return entries;
    }

    async getGlobalEntries() {
        let entries = [];

        for(const entry of this.leaderboard.GlobalEntries) {
            entries.push(new O3hAPI.LeaderboardEntry(entry.Rank, entry.Score, new O3hAPI.UserInformation(entry.User), entry.IsOwner));
        }
        return entries;
    }
}

O3hAPI.LeaderboardEntry = class extends O3h.LeaderboardEntry {
    constructor(rank, score, user, isOwner = false, isActiveUser = false) {
        super(rank, score, user, isOwner, isActiveUser);
    }



}

O3hAPI.SystemSettingsService = class extends O3h.SystemSettingsService {

    constructor(systemSettingsService) {
        super();
        this.systemSettingsService = systemSettingsService;
    }


    async getSystemSettingsUpdates() {
        return this.systemSettingsService.getSystemSettingsUpdates();
    }

    showSystemSettings() {
        this.systemSettingsService.showSystemSettings();
    }

    hideSystemSettings() {
        this.systemSettingsService.hideSystemSettings();
    }
}

O3hAPI.ReplayRecorder = class extends O3h.ReplayRecorder {

    constructor(replayRecorder) {
        super();
        this.replayRecorder = replayRecorder;
    }

    addAggregateIncrementProperty(key, increment = 1) {
        this.replayRecorder.addAggregateIncrementProperty(key, increment);
    }

    addProperty(propertyKey, propertyValue) {
        this.replayRecorder.addProperty(propertyKey, propertyValue);
    }

    async getReplayData() {
        return await this.replayRecorder.getReplayData();
    }
}

O3hAPI.ExitCondition = class extends O3h.ExitCondition {

    constructor(score, notForConsideration) {
        super();
        this.score = score;
        this.notForConsideration = notForConsideration;
    }

}