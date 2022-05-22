/**
 * @enum {number}
 * @readonly
 * @typedef
 */
export const O3hMode = {
    AUDIENCE: 1,
    CREATOR: 2,
    CREATOR_SUBMISSION_PROCESSING: 3,
    TEST: 4
}


export default class O3h {

    constructor() {

    }

    /**
     *
     * @returns {O3h}
     */
    static getInstance() {
        return O3h._instance;
    }

    /**
     * Returns true if we are running the module in a dev server
     * @returns {boolean}
     */
    getIsDevServer() {

    }

    /**
     *
     * @returns {boolean}
     */
    isStub() {
        throw new Error("not implemented");
    }


    /**
     *
     * @returns {O3hMode}
     */
    getMode() {
        throw new Error("not implemented");
    }

    /**
     *
     */
    initializeAnalyticsService() {
        throw new Error("not implemented");
    }

    /**
     *
     */
     initializeUserDataService() {
        throw new Error("not implemented");
    }


    /**
     *  System Settings Service
     */

     initializeSystemSettingsService() {
        throw new Error("Not implemented");
    }

    /**
     *  Replay Recorder
     */

     initializeReplayRecorder() {
        throw new Error("Not implemented");
    }

    /**
     *
     * @returns {O3h.Analytics}
     */
    getAnalyticsService() {
        throw new Error("not implemented");
    }

    /**
     *
     * @returns {O3h.UserDataService}
     */
    getUserDataService() {
        throw new Error("not implemented");
    }

    /**
     *
     * @returns {O3h.Leaderboard}
     */
    getLeaderboard() {
        throw new Error("not implemented");
    }

    /**
     *
     * @returns {O3h.SystemSettingsService}
     */
    getSystemSettingsService() {
        throw new Error("Not implemented");
    }


    /**
     *
     * @returns {O3h.ReplayRecorder}
     */
    getReplayRecorder() {
        throw new Error("Not implemented");
    }
    
    /**
     *
     * @returns {SpeechToTextService}
     */
    getSpeechToTextService() {
        throw new Error("Not implemented");
    }

    /**
     *
     * @returns {O3h.FaceTracker}
     */
    async getFaceTracker(cameraComponent) {
        throw new Error("Not implemented");
    }



    // Global settings UI

    showSystemSettings() {
        throw new Error("Not implemented");
    }

    hideSystemSettings() {
        throw new Error("Not implemented");
    }

    /**
     * Opens the gallery and let user pick a video
     * @returns {Promise<O3h.VideoResource>}
     */
    async pickVideo() {
        throw new Error("not implemented");
    }

    /**
     * Opens the gallery and let user pick a video
     * @param url
     * @returns {O3h.VideoResource}
     */
    getVideoFromUrl(url) {
        throw new Error("not implemented");
    }

    /**
     * Forces asking user for recording permission
     */
     async askForRecordingScreenPermission() {
        throw new Error("not implemented");
    }

    /**
     * Records the full screen and returns the video resource
     * @returns {Promise<O3h.VideoResource>}
     */
    async startFullScreenRecording() {
        throw new Error("not implemented");
    }

    /**
     * Type must be HighlightType of o3h
     * @param type {numer}
     * @param level {number}
     * @private
     */
    _addHighlightToFullScreenRecording(type, level) {
    }


    /**
     * Finishes recording the full screen.
     * @returns {Promise<O3h.VideoResource>}
     */
    async finishFullScreenRecording(duration = 0) {

    }

    /**
     *
     * @returns {O3h.NativeRecordButton}
     */
    getNativeRecordButton(x, y, height, color, backgroundColor, fontOptions) {
        throw new Error("not implemented");
    }


    /**
     *
     * @param layoutType {O3h.Layout.TYPE}
     * @returns {O3h.Layout}
     */
    createLayout(layoutType) {
        throw new Error("not implemented");
    }

    /**
     *
     * @param resource {O3h.Resource}
     */
    addAssetToOutput(resource) {
        throw new Error("not implemented");
    }

    /**
     *
     * @param video {O3h.VideoAsset}
     * @param frameTimeInSeconds {number}
     * @returns {O3h.ImageAsset}
     */
     async getVideoFrame(video, frameTimeInSeconds) {
        throw new Error("not implemented");
    }

    /**
     *
     * @param image {O3h.ImageAsset}
     */
    shareImage(image) {
        throw new Error("not implemented");
    }

    /**
     * Returns the video passed to the module as input with key
     * @param key
     * @returns {O3h.VideoResource}
     */
    async getVideoFromInput(key){
        throw new Error("not implemented");
    }


    /**
     * Starts the module (hide the o3h loading screen)
     * @returns {Promise<void>}
     */
    async startModule() {

    }

    /**
     *
     * @param score {Number} 
     */
    completeModule(score) {    
        throw new Error("not implemented");    
    }

    /**
     * Get a config value passed to the module
     * @param key {string}
     * @returns {string|null}
     */
    getConfigValue(key) {

    }


    /**
     * Returns de name of the creator
     * @returns {Promise<string>}
     */
    async getCreatorName() {
    }

    /**
     * Returns de avatar url of the creator
     * @returns {Promise<string>}
     */
    async getCreatorAvatarImageUrl() {
    }

    /**
     * Returns de name of the active user
     * @returns {Promise<string>}
     */
    async getActiveUserName() {
    }

    /**
     * Returns de avatar url of the active user
     * @returns {Promise<string>}
     */
    async getActiveUserAvatarImageUrl() {
    }

    /**
     * Increments an aggregation property by <increment> server side
     * @param {string} key 
     * @param {number} increment 
     */
    addIncrementToAggregateProperty(key, increment = 1) {       
    }

    /**
     * Returns collection of aggregation properties and their values
     * @returns {Promise.<object.<string, string>>}
     */
    async getAggregatePropertiesAndValues() {        
    }

    /**
     * Returns collection of properties and their values
     * @returns {<object.<string, string>>}
     */
    getPropertiesAndValues() {        
    }

    /**
     * Add a property and its value to replay data
     * @param propertyKey {string}
     * @param propertyValue {any}
     */
     async addPropertyToReplayData(propertyKey, propertyValue) {        
    }

}


O3h._instance = null;


O3h.Analytics = class {
    constructor() {
    }

    setPage(val) {
    }

    logCustomEvent(key, val) {
    }

    replay() {
    }
}


O3h.Resource = class {
    constructor() {
        /**
         * Name of the asset, used to store and restore the asset.
         * @type {string | null}
         */
        this.name = null;
    }

    /**
     * Returns the name of the Resource
     * @returns {string|null}
     */
    getName() {
        return this.name;
    }

    /**
     * Sets the name of the resource
     * @param name
     */
    setName(name) {
        this.name = name;
    }
}


O3h.ImageResource = class extends O3h.Resource {
    constructor() {
        super();
    }


    async getImageUrl() {
    }
}


O3h.AudioResource = class extends O3h.Resource {
    constructor() {
        super();
    }

    async getAudioUrl() {

    }
}

O3h.VideoResource = class extends O3h.Resource {
    constructor() {
        super();
    }

    async getPath() {

    }
}

O3h.NativeRecordButton = class {
    constructor() {        
    }

    show() {
    }

    hide() {
    }

    startCountdown() {     
    }

    resetCountdown(seconds = 0) {
    }

    pauseCountdown() {
    }

    setClickedEventHandler(handler) {
    }
    
    setCountdownEndedEventHandler(handler) {
    }
}


/***
 *
 *  Layout and component usage
 *
 *  Example of layouts create layouts:
 *      let layout = O3h.Layout.createLayout(O3h.Layout.TYPE.CUSTOM_SINGLE, new O3h.Layout.ComponentPosition(10, 90, 90, 10));
 *      let layout = O3h.Layout.createLayout(O3h.Layout.TYPE.FULLSCREEN);
 *
 *  Example of creating components:
 *      let cameraComponent = await O3h.Component.createCameraComponent(true);
 *      let videoComponent = await O3h.Component.createVideoComponent(video);
 *
 *  Example of setting the components to the layouts:
 *      await layout.setComponents([cameraComponent, videoComponent]);
 *
 */


O3h.Component = class {

    constructor() {
    }


    /**
     * Creates a video component without setting the video, use prepareVideo after show the layout
     * @param loop {boolean}
     * @param showProgressBar {boolean}
     * @returns {O3h.Component}
     */
    static async createEmptyVideoComponent(loop = true, showProgressBar = false) {

    }


    /**
     *
     * @param videoResource {O3h.VideoResource}
     * @param loop {boolean}
     * @param showProgressBar {boolean}
     * @returns {O3h.Component}
     */
    static async createVideoComponent(videoResource, loop = true, showProgressBar = false) {

    }

    /**
     *
     * @param front {boolean}
     * @returns {O3h.Component}
     */
    static async createCameraComponent(front = true) {

    }

    stopCamera() {
        
    }

    restartCamera() {
        
    }

    startRecording() {
        
    }

    stopRecording() {
        
    }


    /**
     * Play video if component is video
     * @returns {Promise<void>}
     */
    async play() {

    }


    /**
     * Pause the functionality of the component
     */
    pause() {
    }

    /**
     * Resume the functionality of the component
     */
    resume() {
    }

    reset() {        
    }

    setVolume() {        
    }


    /**
     *
     * @param {Array<number>}
     * @returns {Promise<Array<O3h.ImageResource>>}
     */
    async captureFrames(framesPositions) {

    }

    /**
     *
     * @param videoResource {O3h.VideoResource}
     * @returns {Promise<void>}
     */
    async prepareVideo(videoResource) {

    }

    /**
     * Returns the length of the video associated with this component in milliseconds
     * @returns {Promise<number>}
     */
    async getVideoLength() {

    }

    /**
     * Returns the video resource contained in this component
     * @returns {VideoResource}
     */
    getVideoResource() {
    }

    isEmptyComponent() {
    }

    /**
     * Returns the bounds of the component.
     * Definition of the structure: https://www.oooh.tv/docs/module-o3h.Component.html#getBounds
     * @returns {Promise<*>}
     */
    async getBounds() {

    }

}


O3h.Layout = class {

    constructor() {

    }


    /**
     *
     * @param layoutType {O3h.Layout.TYPE}
     * @returns {O3h.Layout}
     */
    static createLayout(layoutType) {
    }

    /**
     *
     * @param autoplayComponents
     * @returns {Promise<void>}
     */
    async show(autoplayComponents = true) {

    }

    /**
     *
     * @param components {[O3h.Component]}
     */
    async setComponents(components) {

    }


    static async resetLayout() {

    }

}
O3h.Layout.TYPE = {
    FULLSCREEN: 1,
    VERTICAL_EVEN_SPLIT: 2,
    CUSTOM_SINGLE: 3,
    CUSTOM_MULTI: 4
}

O3h.Layout.ComponentPosition = class {
    constructor(top, right, bottom, left) {
        this.top = top;
        this.right = right;
        this.bottom = bottom;
        this.left = left;
    }
}

O3h.FaceTracker = class {
    /**
     *
     * @param faceTracker {FaceTracker}
     */
    constructor(faceTracker) {
    }

    start() {

    }

    stop() {
        
    }

    destroy() {
        
    }

    /**
     * Adds an add face event. Is a wrapper of the api
     * https://www.oooh.tv/docs/module-o3h.FaceTracker.html
     * @param event {function}
     */
    addFaceAddedEvent(event) {

    }

    /**
     * Adds a remove face event. Is a wrapper of the api
     * https://www.oooh.tv/docs/module-o3h.FaceTracker.html
     * @param event {function}
     */
    addFaceRemovedEvent(event) {

    }

    subscribeToNosePosition(onNextPosition, onFaceRemoved = null) {

    }

    subscribeToFacePartPosition(facePart, onNextPosition, onFaceRemoved) {
        
    }

}

O3h.HighlightController = class {
    constructor(){

    }
}

O3h.ImageSegmentationService = class {

    constructor() {
    
    }

    /**
     * @returns {O3h.ImageSegmentationService}
     */
    static async createSegmentation(cameraComponent, width, height, canvas) {
       
    }

    start() {
    }

    stop() {
    }

    async _updateCanvas(textureData) {         
    }

    getService() {    
    }

    getSubject() {        
    }
    
}


O3h.UserDataService = class {
    
    constructor() {       
    }

    async getActiveUserInformation() {
       
    }

    async getCreatorUserInformation() {
       
    }

    async getLeaderboard() {
       
    }
}

O3h.UserInformation = class {

    constructor() {        
    }

    getName() {
    }

    getAvatarImageUrl() {
    }
}

O3h.Leaderboard = class {

    constructor() {        
    }

    getEntries() {
    }

    getGlobalEntries() {
    }
}

O3h.LeaderboardEntry = class {

    constructor(rank = null, score = null, user = null, isOwner = false, isActiveUser = false) {
        this._rank = rank;
        this._score = score;
        this._user = user;
        this._isOwner = isOwner;
        this._isActiveUser = isActiveUser;
    }  
    
    getRank() {
        return this._rank;
    }

    setRank(rank) {
        this._rank = rank;
    }

    getScore() {
        return this._score;
    }

    setScore(score) {
        this._score = score;
    }

    getUserInformation() {
        return this._user;
    }

    setUserInformation(userInformation) {
        this._user = userInformation;
    }

    isOwner() {
        return this._isOwner;
    }

    setIsOwner(isOwner) {
        this._isOwner = isOwner;
    }

    isActiveUser() {
        return this._isActiveUser;
    }

    setIsActiveUser(isActiveUser) {
        this._isActiveUser = isActiveUser;
    }   

    compareRank(entryToCompare) {
        if(this.getRank() === null) {
            return 1;
        }
        if(this.getRank() < entryToCompare.getRank()) {
            return -1;
        } else {
            return 1;
        }
    }
}

O3h.SystemSettingsService = class {
    
    constructor() {
       
    }

    async getSystemSettingsUpdates() {
        throw new Error("Not implemented");       
    }

    showSystemSettings() {
        throw new Error("Not implemented");
    }

    hideSystemSettings() {
        throw new Error("Not implemented");
    }
}

O3h.ReplayRecorder = class {

    constructor() {
    
    }

    addAggregateIncrementProperty() {
        throw new Error("Not implemented");
    }

    addProperty(propertyKey, propertyValue) {
        throw new Error("Not implemented");
    }

    async getReplayData() {
        throw new Error("Not implemented");
    }
    
}

O3h.ExitCondition = class {

    constructor() {        
    }

}