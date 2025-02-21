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
        this.add.image(450, 100, 'playerNameCard').setScale(0.8).setDepth(100);

        this.add.image(1500, 500, 'G_btnsBG').setScale(1.8,1.8).setDepth(100);

        this.add.image(600, 400, 'G_BG-Clouds1').setScale(1.6,1.6).setDepth(1);
        this.add.image(2200, 300, 'G_BG-Clouds2').setScale(1.6,1.6).setDepth(2);

        this.add.image(1500, 450, 'G_btnArena').setScale(1.0,1.0).setDepth(101);


        this.add.image(300, 960, 'G_btnWarriors').setDepth(100);
        this.add.image(600, 960, 'G_btnAbout').setDepth(100);
        this.add.image(900, 960, 'G_btnInventory').setDepth(100);

        this.add.image(1380, 680, 'G_btnLeaderboards').setDepth(100);
        this.add.image(1500, 680, 'G_btnTeam').setDepth(100);

        const settingsBTN = this.add.image(1620, 680, 'G_btnSettings').setDepth(100);
        settingsBTN.setInteractive({ cursor: 'pointer' });
        settingsBTN.on('pointerdown', () => {
            this.cameras.main.fadeOut(180, 0, 0, 0);
            this.cameras.main.once('camerafadeoutcomplete', () => {
            this.scene.start("Settings"); 
            });
        });

        EventBus.emit('current-scene-ready', this);
    }

    changeScene ()
    {
        this.scene.start('Game');
    }
}
