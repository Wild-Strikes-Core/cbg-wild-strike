import { Boot } from './scenes/Boot';
import { LandingPage } from './scenes/LandingPage';

import { GameMenu } from './scenes/GameMenu';
import { GM_Settings as Settings } from './scenes/GM_Settings';

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
    scene: [
        Boot,
        Preloader,
        GameMenu,
        Settings,
        LandingPage,
    ]
};

const StartGame = (parent: string) => {

    return new Game({ ...config, parent });

}

export default StartGame;
