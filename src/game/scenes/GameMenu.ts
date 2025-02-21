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

        this.add.image(1500, 500, 'G_btnsBG').setScale(1.8,1.8).setDepth(50);

        this.add.image(600, 400, 'G_BG-Clouds1').setScale(1.6,1.6).setDepth(1);
        this.add.image(2200, 300, 'G_BG-Clouds2').setScale(1.6,1.6).setDepth(2);

        const arenaBTN = this.add.image(1500, 450, 'G_btnArena').setScale(1.0,1.0).setDepth(101);
        arenaBTN.setInteractive({ cursor: 'pointer' });

        const warriorsBTN = this.add.image(300, 960, 'G_btnWarriors').setDepth(100);
        warriorsBTN.setInteractive({ cursor: 'pointer' });
        warriorsBTN.on('pointerdown', () => {
            this.cameras.main.fadeOut(180, 0, 0, 0);
            this.cameras.main.once('camerafadeoutcomplete', () => {
            this.scene.start("Warriors"); 
            });
        });

        
        const aboutBTN = this.add.image(600, 960, 'G_btnAbout').setDepth(100);
        aboutBTN.setInteractive({ cursor: 'pointer' });
        aboutBTN.on('pointerdown', () => {
            this.cameras.main.fadeOut(180, 0, 0, 0);
            this.cameras.main.once('camerafadeoutcomplete', () => {
            this.scene.start("About"); 
            });
        });

        
        const inventoryBTN = this.add.image(900, 960, 'G_btnInventory').setDepth(100);
        inventoryBTN.setInteractive({ cursor: 'pointer' });
        inventoryBTN.on('pointerdown', () => {
            this.cameras.main.fadeOut(180, 0, 0, 0);
            this.cameras.main.once('camerafadeoutcomplete', () => {
            this.scene.start("Inventory"); 
            });
        });

        const leaderboardsBTN = this.add.image(1380, 680, 'G_btnLeaderboards').setDepth(80);
        leaderboardsBTN.setInteractive({ cursor: 'pointer' }); 
        leaderboardsBTN.on('pointerdown', () => {
            this.cameras.main.fadeOut(180, 0, 0, 0);
            this.cameras.main.once('camerafadeoutcomplete', () => {
            this.scene.start("Leaderboards"); 
            });
        });


        const teamsBTN = this.add.image(1500, 680, 'G_btnTeam').setDepth(80);
        teamsBTN.setInteractive({ cursor: 'pointer' });
        teamsBTN.on('pointerdown', () => {
            this.cameras.main.fadeOut(180, 0, 0, 0);
            this.cameras.main.once('camerafadeoutcomplete', () => {
            this.scene.start("Teams"); 
            });
        });

        const settingsBTN = this.add.image(1620, 680, 'G_btnSettings').setDepth(80);
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
