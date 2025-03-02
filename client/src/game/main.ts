import Boot from "./scenes/Boot";
import Preloader from "./scenes/Preloader";

import LandingPage from "./scenes/LandingPage";

// GameMenu
import MainMenu from "./scenes/MainMenu";
import GM_About from "./scenes/GM_About";

// InGameSequence
import VictoryPage from "./scenes/VictoryPage";
import DefeatPage from "./scenes/DefeatPage";
import DrawPage from "./scenes/DrawPage";

import GM_Warriors from "./scenes/GM_Warriors";

// In-game
import M_Matchmaking from "./scenes/match/M_Matchmaking";
import M_MatchFound from "./scenes/match/M_MatchFound";
import M_Game from "./scenes/match/M_Game";
import { AUTO, Game } from "phaser";

//  Find out more information about the Game Config at:
//  https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.Core.GameConfig
const config: Phaser.Types.Core.GameConfig = {
    type: AUTO,
    width: 1920,
    height: 1080,
    pixelArt: true,
    parent: "game-container",
    backgroundColor: "#1a022b",

    physics: {
        default: 'arcade',
        arcade: {
            gravity : {
                x: 0,
                y: 0
            },
            fps: 60,
            debug: true,
        }
    },

    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },

    scene: [
        Boot,
        Preloader,
        LandingPage,
        MainMenu,
        GM_About,
        GM_Warriors,
        VictoryPage,
        DefeatPage,
        DrawPage,
        M_Matchmaking,
        M_MatchFound,
        M_Game,
    ]
};

const StartGame = (parent: string) => {
    return new Game({ ...config, parent });
};

export default StartGame;

