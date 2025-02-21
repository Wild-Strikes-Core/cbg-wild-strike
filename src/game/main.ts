import { Boot } from './scenes/Boot';
import { LandingPage } from './scenes/LandingPage';

// GAME MENU
import { GameMenu } from './scenes/GameMenu';
import { GM_About as About } from './scenes/GM_About';
import { GM_Inventory as Inventory } from './scenes/GM_Inventory';
import { GM_Leaderboards as Leaderboards } from './scenes/GM_Leaderboards';
import { GM_Settings as Settings } from './scenes/GM_Settings';
import { GM_Teams as Teams } from './scenes/GM_Teams';
import { GM_Warriors as Warriors } from './scenes/GM_Warriors';


import { AUTO, Game } from 'phaser';
import { Preloader } from './scenes/Preloader';

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
        GameMenu,
        About,
        Inventory,
        Leaderboards,
        Settings,
        Teams,
        Warriors,
    ]
};

const StartGame = (parent: string) => {

    return new Game({ ...config, parent });

}

export default StartGame;
