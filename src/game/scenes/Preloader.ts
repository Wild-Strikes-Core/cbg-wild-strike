import { Scene } from 'phaser';

export class Preloader extends Scene
{
    constructor ()
    {
        super('Preloader');
    }

    init ()
    {
        //  We loaded this image in our Boot Scene, so we can display it here
        this.add.image(512, 384, 'background');

        //  A simple progress bar. This is the outline of the bar.
        this.add.rectangle(512, 384, 468, 32).setStrokeStyle(1, 0xffffff);

        //  This is the progress bar itself. It will increase in size from the left based on the % of progress.
        const bar = this.add.rectangle(512-230, 384, 4, 28, 0xffffff);

        //  Use the 'progress' event emitted by the LoaderPlugin to update the loading bar
        this.load.on('progress', (progress: number) => {

            //  Update the progress bar (our bar is 464px wide, so 100% = 464px)
            bar.width = 4 + (460 * progress);

        });
    }

    preload ()
    {
        //  Load the assets for the game - Replace with your own assets
        this.load.setPath('assets');

        this.load.image('logo', 'logo.png');
        this.load.image('star', 'star.png');

        // Landing Page
        this.load.image('playButton', 'game/01 - Landing Page/1L_play-button.png');

        // GameMenu
        this.load.image('G_BG-Clouds1', 'game/02 - Game Menu/2G_bgClouds_1.png');
        this.load.image('G_BG-Clouds2', 'game/02 - Game Menu/2G_bgClouds_2.png');

        this.load.image('playerNameCard', 'game/02 - Game Menu/2G_Player_Name_Card.png');
        
        this.load.image('G_btnsBG', 'game/02 - Game Menu/2G_btnsBackground.png');

        this.load.image('G_btnAbout', 'game/02 - Game Menu/2G_btnAbout.png');
        this.load.image('G_btnInventory', 'game/02 - Game Menu/2G_btnInventory.png');
        this.load.image('G_btnWarriors', 'game/02 - Game Menu/2G_btnWarriors.png');

        this.load.image('G_btnSettings', 'game/02 - Game Menu/2G_btnSettings.png');
        this.load.image('G_btnTeam', 'game/02 - Game Menu/2G_btnTeam.png');
        this.load.image('G_btnLeaderboards', 'game/02 - Game Menu/2G_btnLeaderboards.png');
    }

    create ()
    {
        //  When all the assets have loaded, it's often worth creating global objects here that the rest of the game can use.
        //  For example, you can define global animations here, so we can use them in other scenes.

        //  Move to the MainMenu. You could also swap this for a Scene Transition, such as a camera fade.
        this.scene.start('LandingPage');
    }
}
