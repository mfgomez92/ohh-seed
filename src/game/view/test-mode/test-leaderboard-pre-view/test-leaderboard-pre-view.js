import View from "../../../../core/view/view";
import html from "./test-leaderboard-pre-view.html";
import "./test-leaderboard-pre-view.scss";
import LeaderboardComponent from "../../../../core/components/leaderboard-component/leaderboard-component";
import Utils from "../../../../core/utils/utils";

export default class TestLeaderboardPreView extends View {

    constructor() {
        super(html, null, true, true);
        this._leaderboardComponent = new LeaderboardComponent(this.viewElement.querySelector(".container"));
        
        this.onIntroStarts(async () => {
            
            
            if(this._inputData.leaderboardType === "pre") {               
                this.getElement(".view-title").innerText = "LEADERBOARD PRE TEST";
                this._leaderboardComponent.showPre();
            } else if(this._inputData.leaderboardType === "post") {
                this.getElement(".view-title").innerText = "LEADERBOARD POST TEST";
                this._leaderboardComponent.showPost(this._inputData.score);                
            }
        });

        this.onIntroEnds(async () => {
            await Utils.waitForMilliseconds(1000);
            this._leaderboardComponent.showTopAchievement(this._inputData.score);
        });
        
    }

    static getPreloadContext() {
        return require.context('./', true, /preload\/*/);
    }
}