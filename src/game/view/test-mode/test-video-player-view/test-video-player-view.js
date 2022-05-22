import html from "./test-video-player-view.html";
import View, { ViewOutput } from "../../../../core/view/view";
import "./test-video-player-view.scss";
import VideoPlayerComponent from "../../../../core/components/video-player-component/video-player-component";
import O3h from "../../../../core/api/o3h";
import { TransitionType } from "../../../../core/view/view-manager";

export default class TestVideoPlayerView extends View {
    constructor() {
        super(html, null, true, true);

        this._videoPlayerComponent = null;
        
        this.onIntroStarts(() => {
            let componentContainer = this.$(".player-target");            
            this._videoPlayerComponent = new VideoPlayerComponent(componentContainer);

            this.$(".play").onClick(this.play.bind(this));
            this.$(".pause").onClick(this.pause.bind(this));
            this.$(".reset").onClick(this.reset.bind(this));
            this.$(".pick").onClick(this.pick.bind(this));
            this.$(".loud").onClick(this.loud.bind(this));
            this.$(".quiet").onClick(this.quiet.bind(this));
            this.$(".camera").onClick(this.camera.bind(this));
        });        
    }
    

    play() {
        this._videoPlayerComponent.play();
    }

    pause() {
        this._videoPlayerComponent.pause();
    }

    reset() {
        this._videoPlayerComponent.reset();
    }

    async pick() {
        let videoResource = await O3h.getInstance().pickVideo();
        if(videoResource) {
            await this._videoPlayerComponent.setVideo(videoResource);
        }
    }

    async camera() {        
        await this._videoPlayerComponent.playCamera(false);        
    }

    loud() {
        this._videoPlayerComponent.setVolume(1);
    }

    quiet() {
        this._videoPlayerComponent.setVolume(.1);
    }

    goBack() {
        let output = new ViewOutput(ViewOutput.STATE.BACK);   
        this._videoPlayerComponent.end();    
        this.onOutroEnds(async () => {
            return output;
        }).end(TransitionType.FULL_SCREEN);   
    }


    static getPreloadContext() {
        return require.context('./', true, /preload\/*/);
    }
}