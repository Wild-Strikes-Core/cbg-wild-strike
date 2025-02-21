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
        this.add.image(450, 100, 'playerNameCard').setScale(0.8).setDepth(100);


        EventBus.emit('current-scene-ready', this);
    }

    changeScene ()
    {
        this.scene.start('LandingPage');
    }
}
