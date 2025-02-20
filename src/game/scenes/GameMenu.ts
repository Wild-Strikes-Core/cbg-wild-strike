import { EventBus } from '../EventBus';
import { Scene } from 'phaser';

export class GameMenu extends Scene
{
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;
    gameOverText : Phaser.GameObjects.Text;

    constructor ()
    {
        super('GameMenu');
    }

    create ()
    {
        this.add.image(100, 900, 'playerNameCard').setScale(0.5).setDepth(100);

        this.add.image(960, 750, 'G_btnsBG').setDepth(100);

        this.add.image(960, 750, '2G_bgClouds_1').setDepth(100);
        this.add.image(960, 750, '2G_bgClouds_2').setDepth(100);

        this.add.image(960, 750, 'G_btnAbout').setDepth(100);
        this.add.image(960, 750, 'G_btnWarriors').setDepth(100);
        this.add.image(960, 750, 'G_btnInventory').setDepth(100);

        this.add.image(960, 750, 'G_btnSettings').setDepth(100);
        this.add.image(960, 750, 'G_btnTeam').setDepth(100);
        this.add.image(960, 750, 'G_btnLeaderboards').setDepth(100);


        EventBus.emit('current-scene-ready', this);
    }

    changeScene ()
    {
        this.scene.start('Game');
    }
}
