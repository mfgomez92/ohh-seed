import Component from "../../component";
import html from "./leaderboard-entry-component.html";
import "./leaderboard-entry-component.scss";

export default class LeaderboardEntryComponent extends Component {

    /**
      *  @param parent {Element}
      *  @param userInfo {O3h.UserInformation}
      *  @param rank {Number}
      *  @param score {Number}
      *  @param isOwner {boolean}
      *  @param isActiveUser {boolean}
      *  @param isHostUser {boolean}
      *  @param podiumMetalRank {LeaderboardEntryComponent.PODIUM_METAL_RANK}
      *
      */
    constructor(parent, userInfo, rank, score, isOwner, isActiveUser, isHostUser, podiumMetalRank = null) {
        super(html, parent);      
                
        if(userInfo) {
            let imgElement = this.$(".avatar img");
            imgElement.prop("src", userInfo.getAvatarImageUrl());
            imgElement.removeClass("hidden");
            this.$(".username").html(userInfo.getName());
        } 
        
        this.$(".rank").html(rank || "-");
        this.$(".score").html(score || "-");
        
        if(isOwner) {
            this.$(".tag").html("host");
            this.$(".tag").removeClass("hidden");
        }

        if(isHostUser && !isOwner) {
            this.$(".tag").html("host replay");
            this.$(".tag").addClass("replay");
            this.$(".tag").removeClass("hidden");
        }

        if(isActiveUser) {
            this.$().addClass("active-user");
        }

        if(podiumMetalRank) {
            this.$().addClass(podiumMetalRank);            
        }

        
    }
}

LeaderboardEntryComponent.PODIUM_METAL_RANK = {
    GOLD_ENTRY: "gold-entry",
    SILVER_ENTRY: "silver-entry",
    BRONZE_ENTRY: "bronze-entry"
};