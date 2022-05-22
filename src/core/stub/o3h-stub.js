import O3h, {O3hMode} from "../api/o3h";
import Utils from "../utils/utils";
import Debug from "../utils/debug";
import html from "./stub-layer/stub-layer.html";
import "./stub-layer/stub-layer.scss";



export default class O3hStub extends O3h {

    constructor() {
        super();
        console.log("constructor O3hStub");

        O3h._instance = this;
        
        this._fullScreenRecorder = null;
        this._screenRecorderPermissionsGranted = null;

        this.analyticService = null;
        this.userDataService = null;
        this.systemSettingsService = null;
        this.replayRecorder = null;
        this.replayDataAggregateProperties = {};

        O3h.Component = O3hStub.Component;
        O3h.Layout = O3hStub.Layout;
        O3h.FaceTracker = O3hStub.FaceTracker;
        O3h.HighlightController = O3hStub.HighlightController;

        window.debug = new Debug(true);

        document.body.prepend(Utils.createHTMLFragmentFromString(html));
        
        this.stubLayer = document.body.querySelector(".stub-layer");        
        this.stubSystemSettings = document.body.querySelector(".system-settings");        
    }

    getIsDevServer() {
        return true;
    }


    /**
     *
     * @returns {boolean}
     */
    isStub() {
        return true;
    }


    /**
     *
     * @returns {O3hMode}
     */
    getMode() {
        if (Utils.getURLGetParameterByName("audience") == "true") {
            return O3hMode.AUDIENCE;
        }
        if (Utils.getURLGetParameterByName("CreatorSubmissionProcessing") == "true") {
            return O3hMode.CREATOR_SUBMISSION_PROCESSING;
        }
        if (Utils.getURLGetParameterByName("test") == "true") {
            return O3hMode.TEST;
        }
        return O3hMode.CREATOR;
    }

    /**
     *
     */
    initializeAnalyticsService() {
        this.analyticService = new O3hStub.Analytics();
    }


    /**
     *
     */
    initializeUserDataService() {
        this.userDataService = new O3hStub.UserDataService();
    }

    /**
     *
     */
    initializeSystemSettingsService() {
        this.systemSettingsService = new O3hStub.SystemSettingsService();
    }

    /**
     *
     */
     initializeReplayRecorder() {
        this.replayRecorder = new O3hStub.ReplayRecorder();      
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
     *
     * @returns {O3h.SystemSettingsService}
     */
    getSystemSettingsService() {
        if (this.systemSettingsService == null) {
            this.initializeSystemSettingsService();
        }
        return this.systemSettingsService;
    }

    /**
     * Replay Recorder
     * @returns {O3h.ReplayRecorder}
     */
     getReplayRecorder() {
        if (!this.replayRecorder) {
            this.initializeReplayRecorder();
        }
        return this.replayRecorder;
    }

    /**
     * Speech to text
     * @returns {SpeechToTextService}
     */
    getSpeechToTextService() {
        console.log("Got SpeechToTextService");
        return {
            setTargetPhrases: function(phrase) {
                console.log("Setted target phrase: " + phrase);
            },
            startTranscribing: function() {
                console.log("Started transcribing");
                return {
                    subscribe: async function(callback) {
                        console.log("Subscribed to transcription");
                        await Utils.waitForMilliseconds(1000);
                        callback("test word");
                    }
                }
                
            },
            stopTranscribing: function() {
                console.log("Stopped transcribing");
            }
       };
    }  

    /**
     * Face tracker
     * @returns {O3h.FaceTracker}
     */
    async getFaceTracker(cameraComponent) {
        console.log("Got face tracker");
        return new O3hStub.FaceTracker();        
    }

    // Global settings UI

    showSystemSettings() {        
        this.stubSystemSettings.classList.remove("hidden");
    }

    hideSystemSettings() {
        this.stubSystemSettings.classList.add("hidden");
    }


    /**
     * Opens the gallery and let user pick a video
     * @returns {Promise<O3h.VideoResource>}
     */
    async pickVideo() {
         // Call Giphy API and returns a VideoResource with a random gif url
         let gifRequest = await (await fetch("https://api.giphy.com/v1/gifs/random?api_key=0UTRbFtkMxAplrohufYco5IY74U8hOes")).json();
         let gifUrl = gifRequest.data.images.original.url;         
        return new O3hStub.VideoResource(gifUrl);
    }

    /**
     * Opens the gallery and let user pick a video
     * @param url
     * @returns {O3h.VideoResource}
     */
    getVideoFromUrl(url) {
        return new O3hStub.VideoResource(url);
    }

    /**
     * Forces asking user for recording permission
     */
    async askForRecordingScreenPermission() {
        console.warn("Asked for recording screen permission"); 
    }

    /**
     * Starts recording the full screen. This must be finished by calling finishFullScreenRecording
     */
    async startFullScreenRecording() {
        console.warn(`Started full screen recording`);
    }

    _addHighlightToFullScreenRecording(type, level) {
        console.log("Add Highlight to Full Screen Recording");
    }

    /**
     * Finishes recording the full screen.
     * @returns {Promise<O3h.VideoResource>}
     */
    async finishFullScreenRecording(duration = 0) {
        await Utils.waitForMilliseconds(duration);
        return this.pickVideo();
    }

    /**
     *
     * @returns {O3h.NativeRecordButton}
     */
    async getNativeRecordButton(x, y, height, color, backgroundColor, fontOptions) {
        console.warn(`Creating a NativeRecordButton { ${x}, ${y}, ${height}, ${color}, ${backgroundColor}, ${fontOptions} }`);
        return new O3hStub.NativeRecordButton();
    }

    /**
     *
     * @param layoutType {O3h.Layout.TYPE}
     * @returns {O3h.Layout}
     */
    createLayout(layoutType) {
        return O3hStub.Layout.createLayout(layoutType);
    }

    getConfigValue(key) {
        return null;
    }

    /**
     *
     * @param resource {O3h.Resource}
     */
    addAssetToOutput(resource) {
        console.warn(`Added asset ${resource.name} to AssetManager`);
    }

    /**
     *
     * @param video {O3h.VideoAsset}
     * @param frameTimeInSeconds {number}
     * @returns {O3h.ImageAsset}
     */
     async getVideoFrame(video, frameTimeInSeconds) {
        console.warn("Got video frame");
    }

    /**
     *
     * @param image {O3h.ImageAsset}
     */
    shareImage(image) {
        console.warn("Shared image");
    }

    async getVideoFromInput(key) {
        return this.pickVideo();
    }

    /**
     * Starts the module (hide the o3h loading screen)
     * @returns {Promise<void>}
     */
    async startModule() {
        console.warn(`Start Module`);
    }

    /**
     *
     * @param score {Number}
     */
    completeModule(score) {
        console.warn(`Completed module with score ${score}`);
    }

    /**
     * Returns de name of the creator
     * @returns {Promise<string>}
     */
     async getCreatorName() {        
        let creatorUserInfo = await this.getUserDataService().getCreatorUserInformation();
        return creatorUserInfo.getName();
    }

    /**
     * Returns de avatar url of the creator
     * @returns {Promise<string>}
     */
    async getCreatorAvatarImageUrl() {
        let creatorUserInfo = await this.getUserDataService().getCreatorUserInformation();
        return creatorUserInfo.getAvatarImageUrl();
    }

    /**
     * Returns de name of the active user
     * @returns {Promise<string>}
     */
    async getActiveUserName() {        
        let activeUserInfo = await this.getUserDataService().getActiveUserInformation();
        return activeUserInfo.getName();
    }

    /**
     * Returns de avatar url of the active user
     * @returns {Promise<string>}
     */
    async getActiveUserAvatarImageUrl() {
        let activeUserInfo = await this.getUserDataService().getActiveUserInformation();
        return activeUserInfo.getAvatarImageUrl();
    }

    /**
     * Increments an aggregation property by <increment> server side
     * @param {string} key 
     * @param {number} increment 
     */
    addIncrementToAggregateProperty(key, increment = 1) {     
        this.replayDataAggregateProperties[key] = increment;
    } 

    /**
     * Returns collection of aggregation properties and their values
     * @returns {Promise.<object.<string, string>>}
     */
    getAggregatePropertiesAndValues() {
        return this.replayDataAggregateProperties;
    }

    /**
     * Returns collection of properties and their values
     * @returns {<object.<string, string>>}
     */
     getPropertiesAndValues() {
        console.log("Got properties");
    }

    /**
     * Add a property and its value to replay data
     * @param propertyKey {string}
     * @param propertyValue {any}
     */
     async addPropertyToReplayData(propertyKey, propertyValue) {        
        console.log("Save property " + propertyKey + " with value " + propertyValue);
    }

}


O3hStub.Analytics = class {

    constructor() {
    }

    setPage(val) {
        console.warn("O3H Stub Analytics: setPage " + val);
    }

    logCustomEvent(key, val) {
        console.warn(`O3H Stub Analytics: logCustomEvent [${key},${val}]`);
    }

    replay() {
        console.warn(`O3H Stub Analytics: replay `);
    }


}


O3hStub.ImageResource = class extends O3h.ImageResource {
    constructor(url) {
        super();
        this.url = url;
    }


    async getImageUrl() {
        return this.url;
    }
}


O3hStub.AudioResource = class extends O3h.AudioResource {
    constructor(url) {
        super();
        this.url = url;
        /**
         *
         * @type {HTMLAudioElement}
         */

    }

    async getAudioUrl() {
        return this.url;
    }

    async play() {
        await this.audioElement.play();
    }

    pause() {
        this.audioElement.pause();
    }

    getDuration() {
        return this.audioElement.duration;
    }

    async load() {
        this.audioElement = new Audio(this.url);
        return new Promise((resolve, reject) => {
            this.audioElement.onloadeddata = () => resolve();
        });
    }


    seek(time) {
        this.audioElement.currentTime = time;
    }

    async getCurrentPosition() {
        return this.audioElement.currentTime;
    }

}

O3hStub.VideoResource = class extends O3h.VideoResource {
    constructor(url) {
        super();
        this.url = url;
    }

    async getPath() {
        await Utils.waitForMilliseconds(300);
        return this.url;
    }
}

O3hStub.NativeRecordButton = class extends O3h.NativeRecordButton {
    constructor() {
        super();
        console.warn(`O3H Stub new NativeRecordButton `);
    }

    show() {
        console.warn(`O3H Stub NativeRecordButton: show `);
    }

    hide() {
        console.warn(`O3H Stub NativeRecordButton: hide `);
    }

    startCountdown() {
        console.warn(`O3H Stub NativeRecordButton: startCountdown `);
    }

    resetCountdown(seconds = 0) {
        console.warn(`O3H Stub NativeRecordButton: resetCountdown { ${seconds} seconds }`);
    }

    pauseCountdown() {
        console.warn(`O3H Stub NativeRecordButton: pauseCountdown `);
    }

    setClickedEventHandler(handler) {
        console.warn(`O3H Stub NativeRecordButton: setClickedEventHandler ${handler.name} `);
    }

    setCountdownEndedEventHandler(handler) {
        console.warn(`O3H Stub NativeRecordButton: setCountdownEndedEventHandler ${handler.name} `);
    }
}


O3hStub.Component = class extends O3h.Component {

    constructor(isCameraComponent = false) {
        super();
        this._loop = true;
        this._showProgressBar = false;
        this._videoResource = null;
        this._isCameraComponent = isCameraComponent;
    }


    /**
     * Creates a video component without setting the video, use prepareVideo after show the layout
     * @param loop {boolean}
     * @param showProgressBar {boolean}
     * @returns {O3h.Component}
     */
    static async createEmptyVideoComponent(loop = true, showProgressBar = false) {
        await Utils.waitForMilliseconds(300);
        console.log("Creationg Empty Video Component")
        let instance = new O3hStub.Component();
        instance.loop = loop;
        instance.showProgressBar = showProgressBar;
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
        await Utils.waitForMilliseconds(300);
        console.log("Creationg Video Component")
        let instance = new O3hStub.Component();
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
        await Utils.waitForMilliseconds(300);                
        console.log("Creationg Camera Component")
        return new O3hStub.Component(true);
    }

    stopCamera() {
        console.log("Stoppped camera component");
    }

    restartCamera() {
        console.log("Restarted camera component");
    }

    startRecording() {
        console.log("Started recording camera component");
    }

    stopRecording(delay = 0) {
        console.log("Stopped recording camera component after " + delay + " seconds");
    }

    async play() {
        let layout = document.querySelector(".stub-layout");
        if(layout) {
            layout.innerText = "";
        }
        await Utils.waitForMilliseconds(300);
        console.log("Play component");
    }

    pause() {
        let layout = document.querySelector(".stub-layout");
        if(layout) {
            layout.innerText = "Pause";
        }
        console.log("Pause component");
    }

    resume() {
        let layout = document.querySelector(".stub-layout");
        if(layout) {
            layout.innerText = "";
        }
        console.log("Resume component");
    }

    reset() {
        let layout = document.querySelector(".stub-layout");
        if(layout) {
            layout.innerText = "Reset";
        }
        console.log("Reset component");
    }

    setVolume(volume) {
        let layout = document.querySelector(".stub-layout");
        if(layout) {
            layout.innerText = "Volume: " + volume;
        }
        console.log("Setting component volume to: " + volume);
    }


    /**
     *
     * @param {Array<number>}
     * @returns {Promise<Array<O3h.ImageResource>>}
     */
    async captureFrames(framesPositions) {
        await Utils.waitForMilliseconds(300);
        return [new O3hStub.ImageResource("https://i.ytimg.com/vi/0Cab3XqSDQ0/maxresdefault.jpg")];
    }

    /**
     *
     * @param videoResource
     * @returns {Promise<void>}
     */
    async prepareVideo(videoResource) {
        console.log("prepareVideo");
        await Utils.waitForMilliseconds(300);
    }

    /**
     * Returns the length of the video associated with this component in milliseconds
     * @returns {Promise<number>}
     */
    async getVideoLength() {
        await Utils.waitForMilliseconds(300);
        return 3000;
    }

    /**
     * Returns the video resource contained in this component
     * @returns {VideoResource}
     */
    getVideoResource() {
        return new O3hStub.VideoResource("https://file-examples-com.github.io/uploads/2017/04/file_example_MP4_480_1_5MG.mp4");
    }

    isCameraComponent() {
        return this._isCameraComponent;
    }

    isEmptyComponent() {
        return this._videoResource === null && !this._isCameraComponent;
    }

}


O3hStub.Layout = class extends O3h.Layout {

    constructor() {
        super();
    }

    static createLayout(layoutType, componentPosition = null) {       
        let layout = document.querySelector(".stub-layout");
        if(!layout) {
            layout = document.createElement("div");
            layout.classList.add("stub-layout", "hidden");
            document.querySelector(".stub-layer").prepend(layout);
        }
    
        switch (layoutType) {
            case O3h.Layout.TYPE.FULLSCREEN:
                layout.style.height = "100vh";
                layout.style.width = "100vw";
                let componentFullscreen = document.createElement("div");
                componentFullscreen.style.position = "fixed";
                componentFullscreen.style.height = "100%";
                componentFullscreen.style.width = "100%";  
                componentFullscreen.style.top = "0";  
                componentFullscreen.style.backgroundColor = "aquamarine"; 
                componentFullscreen.classList.add("component-fullscreen");
                layout.appendChild(componentFullscreen);
                break;
            case O3h.Layout.TYPE.CUSTOM_SINGLE:            
                layout.style.top = componentPosition.top + "%";          
                layout.style.left = componentPosition.left + "%";
                layout.style.height = (componentPosition.bottom - componentPosition.top) + "%";
                layout.style.width = (componentPosition.right - componentPosition.left) + "%";
                let componentCustomSingle = document.createElement("div");
                componentCustomSingle.style.position = "absolute";
                componentCustomSingle.style.height = "100%";
                componentCustomSingle.style.width = "100%";  
                componentCustomSingle.style.top = "0";  
                componentCustomSingle.style.backgroundColor = "aquamarine"; 
                componentCustomSingle.classList.add("component-custom-single");
                layout.appendChild(componentCustomSingle);
                break;
            case O3h.Layout.TYPE.CUSTOM_MULTI:
                componentPosition.forEach((v, k) => {
                    let componentCustomMulti = document.createElement("div");
                    componentCustomMulti.style.position = "fixed";
                    componentCustomMulti.classList.add("component-" + k);
                    componentCustomMulti.style.top = v.top + "%";          
                    componentCustomMulti.style.left = v.left + "%";
                    componentCustomMulti.style.height = (v.bottom - v.top) + "%";
                    componentCustomMulti.style.width = (v.right - v.left) + "%";       
                    componentCustomMulti.style.backgroundColor = k % 2 === 0 ? "aqua" : "aquamarine"; 
                    layout.appendChild(componentCustomMulti);          
                });      
                break;
        }
        
        let toPrint = "Creating layout of type " + layoutType;
        if (componentPosition != null) {
            toPrint += `with position top:${componentPosition.top} right:${componentPosition.right} bottom:${componentPosition.bottom} left:${componentPosition.left} `
        }
        console.log(toPrint);
        return new O3hStub.Layout();
    }


    /**
     *
     * @param autoplayComponents
     * @returns {Promise<void>}
     */
    async show(autoplayComponents = true) {
        let layout = document.querySelector(".stub-layout");
        if(layout) {
            layout.classList.remove("hidden");
        }
        console.log("showing layout");
        await Utils.waitForMilliseconds(300);
    }

    /**
     *
     * @param components {[O3hStub.Component]}
     */
    async setComponents(components) {
        let layout = document.querySelector(".stub-layout");
        if(!layout) {
            console.error("No layout available... you must create one before adding a component.");
            return;
        }

        let componentElements = layout.children;

        components.forEach((v, k) => {
            if(v.isCameraComponent()) {   
                if(componentElements[k].querySelector(".stub-camera-component") !== null) {
                    return; // If already exist do nothing
                }            
                let cameraComponent = document.createElement("p");
                cameraComponent.classList.add("stub-camera-component");
                cameraComponent.innerText = "Camera front or back";
                componentElements[k].style.backgroundImage = "";       
                componentElements[k].appendChild(cameraComponent)   
            } else if(!v.isEmptyComponent()) {
                componentElements[k].style.backgroundImage = "url('" + v._videoResource.url + "')";
                componentElements[k].innerText = "";
            }
        });
        
         

        await Utils.waitForMilliseconds(300);
    }


    static async resetLayout() {
        let layout = document.querySelector(".stub-layout");
        if(layout) {
            layout.remove();
        }
        console.log("resetting layout");
        await Utils.waitForMilliseconds(300);
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


O3hStub.FaceTracker = class extends O3h.FaceTracker {
    /**
     *
     * @param faceTracker {FaceTracker}
     */
    constructor() {
        super();

        this.o3h = O3h.getInstance().o3h;
        this.isTracking = false;  
        this.subscribeSimulatorTimer = null;
        this.currentSimulatorTimerId = null;
    }

    start() {
        this.subscribeSimulatorTimer();
    }

    stop() {
        console.log("Stopped face tracker");
        clearInterval(this.currentSimulatorTimerId);
    }

    destroy() {        
        this.stop();
        console.log("Destroyed face tracker");
    }

    addFaceAddedEvent(event) {
        // Llamo inmediatamente como que se agregó una cara
        let toRet = {};
        toRet.Id = 0;
        event(toRet);
    }


    addFaceRemovedEvent(event) {

    }


    subscribeToNosePosition(onNextPosition, onFaceRemoved = null) {
        this. subscribeToFacePartPosition("NoseBridge4", onNextPosition, onFaceRemoved);
    }

    subscribeToFacePartPosition(facePart, onNextPosition, onFaceRemoved) {
        console.log("Subscribed to " + facePart + " position");
        const initialX = window.innerWidth / 2;
        const initialY = window.innerHeight / 2;
        const maxY = (window.innerHeight / 2) - 300;
        let fakeCoordinates = { y: initialY, x: initialX};        
        this.subscribeSimulatorTimer = () => {
            this.currentSimulatorTimerId = setInterval(
            () => {
                if(fakeCoordinates.y <= maxY) {
                    fakeCoordinates.y = initialY;
                } else {
                    fakeCoordinates.y -= 10;
                }                
                onNextPosition(fakeCoordinates);
            },
            100);
        };
        
    }

}


O3hStub.HighlightController = class extends O3h.HighlightController {
    constructor() {
        super();

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

O3hStub.ImageSegmentationService = class extends O3h.ImageSegmentationService {

    constructor() {
        super();
        
    }

    /**
     * @returns {O3h.ImageSegmentationService}
     */
    static async createSegmentation(cameraComponent, width, height, canvas) {
        console.warn("Created Segmentation");
    }

    start() {
        console.warn("Started Segmentation");
    }

    stop() {
        console.warn("Stopped Segmentation");
    }

    async _updateCanvas(textureData) {        
    }


    getService() {
       
    }

    getSubject() {
    }
    
}

O3hStub.UserDataService = class extends O3h.UserDataService {

    constructor() {
        super();
    }

    async getActiveUserInformation() {       
        return new O3hStub.UserInformation("Bart Simpson", "https://pbs.twimg.com/profile_images/742157461155631104/kZIsuvmU_400x400.jpg");
    }

    async getCreatorUserInformation() {       
        return new O3hStub.UserInformation("Marge Simpson", "https://www.filo.news/__export/1569964045225/sites/claro/img/2019/10/01/muere_la_mujer_que_inspirx_a_marge_simpson.jpeg_423682103.jpeg");
    }

    async getLeaderboard() {
        return new O3hStub.Leaderboard();
    }
}

O3hStub.UserInformation = class extends O3h.UserInformation {

    constructor(name = "Homer Simpson", url = "https://pyxis.nymag.com/v1/imgs/1f6/bed/2325a6b72ed3990a857b5de86f9b770c17-16-homer-simpson.rsquare.w330.jpg") {
        super();

        this._name = name;
        this._url = url;
    }

    getName() {
        return this._name;
    }

    getAvatarImageUrl() {
        return this._url;
    }
}

O3hStub.Leaderboard = class extends O3h.Leaderboard {

    constructor() {
        super();
    }

    async getEntries() {
        let mockEntries = [];
        const totalEntries = 12;
        const hostUserRank = 4;
        const hostReplayUserRank = 5;
        const activeUserRank = null;        
        for(let i = 0; i < totalEntries; i++) {
            let mockName, mockAvatarUrl;        
            if((i + 1) === hostUserRank || (i + 1) === hostReplayUserRank) {
                mockName = (await (await O3hStub.getInstance().getUserDataService()).getCreatorUserInformation()).getName();
                mockAvatarUrl = (await (await O3hStub.getInstance().getUserDataService()).getCreatorUserInformation()).getAvatarImageUrl();
            } else if((i + 1) === activeUserRank) {
                mockName = (await (await O3hStub.getInstance().getUserDataService()).getActiveUserInformation()).getName();    
                mockAvatarUrl = (await (await O3hStub.getInstance().getUserDataService()).getActiveUserInformation()).getAvatarImageUrl();    
            } else {
                mockName = "Lisa Simpson" + i;
                mockAvatarUrl = "https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/the-simpsons-lisa-1589201259.jpg?crop=0.563xw:1.00xh;0.247xw,0&resize=480:*";
            }
            let entry = new O3h.LeaderboardEntry(i + 1, Math.ceil(180 - i * 5), new O3hStub.UserInformation(mockName, mockAvatarUrl), (i + 1) === hostUserRank ? true : false, (i + 1) === activeUserRank ? true : false);           
            mockEntries.push(entry);
        }
        return mockEntries;
    }

    async getGlobalEntries() {
        let mockEntries = [];
        const totalEntries = 20;
        const hostUserRank = 5;
        const hostReplayUserRank = null;
        const activeUserRank = null;        
        for(let i = 0; i < totalEntries; i++) {
            let mockName;
            if((i + 1) === hostUserRank || (i + 1) === hostReplayUserRank) {
                mockName = (await (await O3hStub.getInstance().getUserDataService()).getCreatorUserInformation()).getName();
            } else if((i + 1) === activeUserRank) {
                mockName = (await (await O3hStub.getInstance().getUserDataService()).getActiveUserInformation()).getName();    
            } else {
                mockName = "Lisa Simpson" + i;
            }
            let entry = new O3h.LeaderboardEntry(i + 1, Math.ceil(300 - i * 5), new O3hStub.UserInformation(mockName), (i + 1) === hostUserRank ? true : false, (i + 1) === activeUserRank ? true : false);           
            mockEntries.push(entry);
        }
        return mockEntries;
    }
}

O3hStub.LeaderboardEntry = class extends O3h.LeaderboardEntry {

    constructor(rank, score, user, isOwner = false, isActiveUser = false) {
        super(rank, score, user, isOwner, isActiveUser);       
    }   
    
}

O3hStub.SystemSettingsService = class extends O3h.SystemSettingsService {
    
    constructor() {  
        super();     
    }

    /**
     * Returns a publisher object
     */
    async getSystemSettingsUpdates() {
    }

    showSystemSettings() {
    }

    hideSystemSettings() {
    }
}

O3hStub.ReplayRecorder = class extends O3h.ReplayRecorder {

    constructor() {
        super();
    }

    addAggregateIncrementProperty(key, increment = 1) {
        console.log(`Added ${increment} to property ${key}`);
    }

    addProperty(propertyKey, propertyValue) {
        console.log(`Added property: ${propertyKey}, value: ${propertyValue}`);
    }

    async getReplayData() {
        console.log("Got replay data");
    }
    
}

O3hStub.ExitCondition = class extends O3h.ExitCondition {

    constructor(score, notForConsideration) {
        super();
        this.score = score;
        this.notForConsideration = notForConsideration;
    }

}