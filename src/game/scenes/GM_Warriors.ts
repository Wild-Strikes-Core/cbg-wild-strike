import { EventBus } from '../EventBus';
import { Scene } from 'phaser';

export class GM_Warriors extends Scene
{
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;
    gameOverText : Phaser.GameObjects.Text;

    constructor ()
    {
        super('Warriors');
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

        EventBus.emit('current-scene-ready', this);
    }

    changeScene ()
    {
        this.scene.start('GameMenu');
    }
}
