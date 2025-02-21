import { EventBus } from '../EventBus';
import { Scene } from 'phaser';

export class GameMenu extends Scene
{
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;
    gameOverText : Phaser.GameObjects.Text;
    private cloud1: Phaser.GameObjects.Image;
    private cloud2: Phaser.GameObjects.Image;

    constructor ()
    {
        super('GameMenu');
    }

    create ()
    {
        this.add.image(450, 100, 'playerNameCard').setScale(0.8).setDepth(100);

        this.add.image(1500, 500, 'G_btnsBG').setScale(1.8,1.8).setDepth(50);

        // Store the clouds as a variable (for referencing)
        this.cloud1 = this.add.image(600, 400, 'G_BG-Clouds1').setScale(1.6,1.6).setDepth(1);
        this.cloud2 = this.add.image(2200, 300, 'G_BG-Clouds2').setScale(1.6,1.6).setDepth(2);

        const addButtonInteraction = (button: Phaser.GameObjects.Image) => {
            button.setInteractive({ cursor: 'pointer' })
                .on('pointerover', () => button.setTint(0xffff66))  // Yellow highlight
                .on('pointerout', () => button.clearTint());
        };

        const arenaBTN = this.add.image(1500, 450, 'G_btnArena').setScale(1.0).setDepth(101);
        addButtonInteraction(arenaBTN);

        const warriorsBTN = this.add.image(300, 960, 'G_btnWarriors').setDepth(100);
        addButtonInteraction(warriorsBTN);
        warriorsBTN.on('pointerdown', () => {
            this.cameras.main.fadeOut(180, 0, 0, 0);
            this.cameras.main.once('camerafadeoutcomplete', () => {
                this.scene.start("Warriors");   
            });
        });

        
        const aboutBTN = this.add.image(600, 960, 'G_btnAbout').setDepth(100);
        addButtonInteraction(aboutBTN);
        aboutBTN.on('pointerdown', () => {
            this.cameras.main.fadeOut(180, 0, 0, 0);
            this.cameras.main.once('camerafadeoutcomplete', () => {
            this.scene.start("About"); 
            });
        });

        
        const inventoryBTN = this.add.image(900, 960, 'G_btnInventory').setDepth(100);
        addButtonInteraction(inventoryBTN);
        inventoryBTN.on('pointerdown', () => {
            this.cameras.main.fadeOut(180, 0, 0, 0);
            this.cameras.main.once('camerafadeoutcomplete', () => {
            this.scene.start("Inventory"); 
            });
        });

        const leaderboardsBTN = this.add.image(1380, 680, 'G_btnLeaderboards').setDepth(80);
        addButtonInteraction(leaderboardsBTN);
        leaderboardsBTN.on('pointerdown', () => {
            this.cameras.main.fadeOut(180, 0, 0, 0);
            this.cameras.main.once('camerafadeoutcomplete', () => {
            this.scene.start("Leaderboards"); 
            });
        });


        const teamsBTN = this.add.image(1500, 680, 'G_btnTeam').setDepth(80);
        addButtonInteraction(teamsBTN);
        teamsBTN.on('pointerdown', () => {
            this.cameras.main.fadeOut(180, 0, 0, 0);
            this.cameras.main.once('camerafadeoutcomplete', () => {
            this.scene.start("Teams"); 
            });
        });

        const settingsBTN = this.add.image(1620, 680, 'G_btnSettings').setDepth(80);
        addButtonInteraction(settingsBTN);
        settingsBTN.on('pointerdown', () => {
            this.cameras.main.fadeOut(180, 0, 0, 0);
            this.cameras.main.once('camerafadeoutcomplete', () => {
            this.scene.start("Settings"); 
            });
        });

        EventBus.emit('current-scene-ready', this);
    }

    update()
    {
        // Move clouds from right to left
        this.cloud1.x -= 0.8;
        this.cloud2.x -= 0.8;

        // Reset cloud positions when they move off screen
        if (this.cloud1.x < -1000) {
            this.cloud1.x = 2600;
        }
        if (this.cloud2.x < -1000) {
            this.cloud2.x = 2600;
        }
    }

    changeScene ()
    {
        this.scene.start('Game');
    }
}
