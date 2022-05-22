import O3h from "../../../core/api/o3h";
import OverlayMessageComponent from "../overlay-messager-component/overlay-message-component/overlay-message-component";
import OverlayMessagerComponent from "../overlay-messager-component/overlay-messager-component";
import Component from "../component";
import html from "./leaderboard-component.html";
import "./leaderboard-component.scss";
import LeaderboardEntryComponent from "./leaderboard-entry-component/leaderboard-entry-component";

export default class LeaderboardComponent extends Component {
    constructor(parent) {
        super(html, parent);

        this._activeUserInformation = null;
        this._podiumRankEntries = null;
        this._versusRankEntries = null;
        this._currentSessionPostEntry = null;
        this._achievements = [];

        this._highestHostEntry = null;
    }

    async showPre() {         
        await this._getLeaderboardData();        
        this._generateLeaderboardEntryComponents();
        this.$(".leaderboard-container").addClass("pre");
        this.$(".leaderboard-container").removeClass("post");
        this.addComponentToDOM();  
    }

    async showPost(score) {
        await this._getLeaderboardData(score);        
        this._generateLeaderboardEntryComponents();

        this.$(".leaderboard-container").addClass("post");
        this.$(".leaderboard-container").removeClass("pre");                   
        
        this.addComponentToDOM();        
    }
    
    async showTopAchievement(score) {
        await this._getLeaderboardData(score);       
        if(this._achievements.length > 0) {
            let topAchieve = this._achievements.reduce((prev, current) => prev.priority < current.priority ? prev : current);
            let achieveMessage;
            if(topAchieve === LeaderboardComponent.AchievementType.BEAT_THE_CREATOR) {
                achieveMessage = LeaderboardComponent.AchievementType.BEAT_THE_CREATOR.name.replace("{{creatorName}}", this._hostUserName);
            } else {
                achieveMessage = topAchieve.name;
            }
            OverlayMessagerComponent.getInstance().addMessageToQueue(new OverlayMessageComponent(achieveMessage));
        }
    }

    /**
     * 
     * @returns {number}
     */
    async getHostHighestScore(score = null) {
        await this._getLeaderboardData(score);        
        if(this._highestHostEntry) {
            return this._highestHostEntry.getScore();
        }
        return 0;
    }

    _generateLeaderboardEntryComponents() {
        let podiumContainer = this.componentElement.querySelector(".leaderboard-podium");
        for(let i = this._podiumRankEntries.length -1; i >= 0; i--) {
            let podiumEntry = this._podiumRankEntries[i];
            let isHostUser = false;
            if(podiumEntry.getUserInformation()) {
                isHostUser = podiumEntry.getUserInformation().getName() === this._hostUserName;               
            }
            let podiumMetalRank = null;
            if(i === 0) {
                podiumMetalRank = LeaderboardEntryComponent.PODIUM_METAL_RANK.GOLD_ENTRY;
            } else if(i === 1) {
                podiumMetalRank = LeaderboardEntryComponent.PODIUM_METAL_RANK.SILVER_ENTRY;            
            } else if(i === 2) {
                podiumMetalRank = LeaderboardEntryComponent.PODIUM_METAL_RANK.BRONZE_ENTRY;
            }
            let podiumEntryComponent = new LeaderboardEntryComponent(podiumContainer, podiumEntry.getUserInformation(), podiumEntry.getRank(), podiumEntry.getScore(), podiumEntry.isOwner(), podiumEntry.isActiveUser(), isHostUser, podiumMetalRank);
            podiumEntryComponent.start();
        }
        
        if(this._versusRankEntries.length > 0) {
            this.$(".leaderboard-separator").removeClass("hidden");
            let versusContainer = this.componentElement.querySelector(".leaderboard-versus");
            for(let i = this._versusRankEntries.length -1; i >= 0; i--) {
                let versusEntry = this._versusRankEntries[i];                       
                const isHostUser = versusEntry.isOwner() || versusEntry.getUserInformation().getName() === this._hostUserName;                    
                let versusEntryUserInfo = versusEntry.isActiveUser() ? this._activeUserInformation : versusEntry.getUserInformation();
                let versusEntryComponent = new LeaderboardEntryComponent(versusContainer, versusEntryUserInfo, versusEntry.getRank(), versusEntry.getScore(), versusEntry.isOwner(), versusEntry.isActiveUser(), isHostUser, null);               
                versusEntryComponent.start();
            }
        }        
    }  

    async _getLeaderboardData(score = null) {
        const isPost = score ? true : false;
        const userDataService = O3h.getInstance().getUserDataService();
        this._activeUserInformation = await userDataService.getActiveUserInformation();               
        this._hostUserName = (await userDataService.getCreatorUserInformation()).getName();         
        let leaderboard = await userDataService.getLeaderboard();
        this._entries = await leaderboard.getEntries();            

        let existingActiveUserEntry, existingOwnerEntry;
        let podiumRankEntries = [new O3h.LeaderboardEntry(null), new O3h.LeaderboardEntry(null), new O3h.LeaderboardEntry(null)];
        let versusRankEntries = [];      
        let activeUserEntryExists = false;   
        let newRankFound = false;
        let userNewRank = 0;          

        if(isPost) {
            // If received a score, prepare an entry to show it
            this._currentSessionPostEntry = new O3h.LeaderboardEntry(0, score, this._activeUserInformation, false, true);
            
            // Calculate New World Record Achievement
            let globalEntries = await leaderboard.getGlobalEntries();
            if(globalEntries[0] && score > globalEntries[0].getScore()) {
                this._achievements.push(LeaderboardComponent.AchievementType.NEW_WORLD_RECORD);
            }
        }

        for(const entry of this._entries) {            
            
            if(isPost) {
                // If received a score, calculate its rank based on existing entries and update created entry
                if(entry.getScore() <= score && !newRankFound) {                    
                    newRankFound = true;
                    userNewRank = entry.getRank();
                    if(entry.getScore() === score) {
                        userNewRank++;
                    }
                    this._currentSessionPostEntry.setRank(userNewRank);  
                    if(userNewRank === 1) {
                        this._achievements.push(LeaderboardComponent.AchievementType.NEW_HIGH_SCORE);
                    }                  
                }
            }

            if(newRankFound && entry.getScore() < score) {
                // Plus one to original rank to avoid holes and repeats
                entry.setRank(entry.getRank() + 1);                
            }  

            if(entry.getUserInformation().getName() === this._activeUserInformation.getName() && !entry.isOwner()) {
                entry.setIsActiveUser(true);            
                activeUserEntryExists = true;         
            }

            if(entry.isActiveUser()) {
                existingActiveUserEntry = entry;
            }

            if(entry.isOwner()) {
                 
                existingOwnerEntry = entry;
            }
        }
     
        
        if(isPost) {
            // If current score is lower than all entries set rank to last place
            if(!newRankFound) {
                this._currentSessionPostEntry.setRank(this._entries.length + 1);
            }
            // Put created current session entry in complete ranking
            this._entries.splice(this._currentSessionPostEntry.getRank() - 1, 0, this._currentSessionPostEntry);         

            // Calculate achievements
            if(existingActiveUserEntry && (score > existingActiveUserEntry.getScore())) {
                this._achievements.push(LeaderboardComponent.AchievementType.NEW_PERSONAL_BEST);
            }
            if(existingOwnerEntry && (score > existingOwnerEntry.getScore())) {      
                if(!this._achievements.includes(LeaderboardComponent.AchievementType.BEAT_THE_CREATOR)) {
                    this._achievements.push(LeaderboardComponent.AchievementType.BEAT_THE_CREATOR);
                }                
            }

            this._calculatePostEntries(podiumRankEntries, versusRankEntries);            
        } else {
            this._calculatePreEntries(podiumRankEntries, versusRankEntries, activeUserEntryExists);
        }

        versusRankEntries.sort((a, b) => a.compareRank(b));
        this._podiumRankEntries = podiumRankEntries;
        this._versusRankEntries = versusRankEntries;     
    }

    _calculatePreEntries(podiumRankEntries, versusRankEntries, activeUserEntryExists) {
        let hostEntries = [];
        let isHostInPodium = false;
        let isActiveInPodium = false;
        for (const entry of this._entries) {
            if (entry.getRank() <= 3) {
                podiumRankEntries[entry.getRank() - 1] = entry;
                if(entry.getUserInformation().getName() === this._hostUserName) {
                    isHostInPodium = true;
                }                
                if(entry.isActiveUser()) {
                    isActiveInPodium = true;
                }                
            } else if (entry.getRank() > 3 && entry.getUserInformation().getName() === this._hostUserName && !isHostInPodium) {
                hostEntries.push(entry);
            } else if (entry.getRank() > 3 && entry.isActiveUser() && !isActiveInPodium) {
                versusRankEntries.push(entry);
            }
        }

        // Prefer highest host score in case host and host replay exists in versus rank
        if (hostEntries.length > 0) {
            let highestEntry = hostEntries.reduce((prev, current) => (prev.getScore() > current.getScore()) ? prev : current);
            versusRankEntries.push(highestEntry);
        }

        if (!activeUserEntryExists) {
            // If active user does not has an entry in Oooh yet, 
            // we add to versus entries an empty one created by hand to show as blank in leaderboard pre
            let activeUserEntry = new O3h.LeaderboardEntry(null, null, this._activeUserInformation, null, true);
            versusRankEntries.push(activeUserEntry);
        }
    }

    _calculatePostEntries(podiumRankEntries, versusRankEntries) {
        let hostEntries = [];
        for(const entry of this._entries) {  
            if(entry.getUserInformation().getName() === this._hostUserName) {
                hostEntries.push(entry);
            }    
            if(entry.getRank() <= 3) {
                podiumRankEntries[entry.getRank() - 1] = entry;  
            }
        }

        if(this._currentSessionPostEntry.getRank() > 3) {
            versusRankEntries.push(this._currentSessionPostEntry);
        }

        // Calculate highest host entry in order to compare the score with user
        if (hostEntries.length > 0) {
            this._highestHostEntry = hostEntries.reduce((prev, current) => (prev.getScore() > current.getScore()) ? prev : current);
        }
    }
}

LeaderboardComponent.WAIT_FOR_ACHIEVEMENTS = 2000;

LeaderboardComponent.AchievementType = {
    NEW_WORLD_RECORD: {
        name: "New World Record!",
        priority: 1 
    },
    NEW_HIGH_SCORE: {
        name: "New High Score!",
        priority: 2 
    },
    BEAT_THE_CREATOR: {
        name: "Beat {{creatorName}}!",
        priority: 3 
    },
    NEW_PERSONAL_BEST: {
        name: "New Personal Best!",
        priority: 4 
    }
};