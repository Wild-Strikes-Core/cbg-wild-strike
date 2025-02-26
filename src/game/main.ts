import Boot from './scenes/Boot';
import Preloader from './scenes/Preloader';

import LandingPage from './scenes/LandingPage';

import GameOver from './scenes/GameOver.ts';
import MainGame from './scenes/Game.ts';

// GameMenu
import MainMenu from './scenes/MainMenu.ts';
import GM_Settings from './scenes/GM_Settings.ts';
import GM_About from './scenes/GM_About.ts';
import GM_Inventory from './scenes/GM_Inventory.ts';
import GM_SelectTeam from './scenes/GM_SelectTeam.ts';
import GM_ListofTeams from './scenes/GM_ListofTeams';

// InGameSequence
import VictoryPage from './scenes/VictoryPage.ts';
import DefeatPage from './scenes/DefeatPage.ts';
import DrawPage from './scenes/DrawPage.ts';

import { AUTO, Game } from 'phaser';

//  Find out more information about the Game Config at:
//  https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.Core.GameConfig
const config: Phaser.Types.Core.GameConfig = {
    type: AUTO,
    width: 1920,
    height: 1080,
    parent: 'game-container',
    backgroundColor: '#1a022b',

    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    
    scene: [
        Boot,
        Preloader,
        LandingPage,
        MainMenu,
        GM_ListofTeams,
        MainGame,
        GM_Settings,
        GM_About,
        GM_Inventory,
        GM_SelectTeam,
        VictoryPage,
        DefeatPage,
        DrawPage,
        GameOver
    ]
};

const StartGame = (parent: string) => {

    return new Game({ ...config, parent });

}

export default StartGame;
