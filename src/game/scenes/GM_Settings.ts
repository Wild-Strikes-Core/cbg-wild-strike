import { EventBus } from '../EventBus';
import { Scene } from 'phaser';

export class GM_Settings extends Scene
{
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;
    gameOverText : Phaser.GameObjects.Text;

    constructor ()
    {
        super('Settings');
    }

    create ()
    {
        const backBTN = this.add.image(250, 100, 'S_btnBack').setScale(0.8).setDepth(100);
        backBTN.setInteractive({cursor: 'pointer'});
        backBTN.on('pointerdown', () => {
            this.cameras.main.fadeOut(180, 0, 0, 0);
            this.cameras.main.once('camerafadeoutcomplete', () => {
               this.changeScene();
            });
        });

        this.add.image(1000, 100, 'S_title').setScale(0.8).setDepth(100);
        
        this.add.image(400, 940, 'S_btnLogout').setScale(0.8).setDepth(100);
        this.add.image(900, 940, 'S_btnTerms').setScale(0.8).setDepth(100);
        this.add.image(1480, 940, 'S_btnLinkAcc').setScale(0.8).setDepth(100);


        EventBus.emit('current-scene-ready', this);
    }

    changeScene ()
    {
        this.scene.start('GameMenu');
    }
}
