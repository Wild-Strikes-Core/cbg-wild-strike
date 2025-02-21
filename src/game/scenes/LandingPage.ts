import { GameObjects, Scene } from 'phaser';

import { EventBus } from '../EventBus';

export class LandingPage extends Scene
{
    background: GameObjects.Image;
    logo: GameObjects.Image;
    title: GameObjects.Text;
    logoTween: Phaser.Tweens.Tween | null;

    constructor ()
    {
        super('LandingPage');
    }

    create ()
    {

        // this.title = this.add.text(512, 460, 'PLAY', {
        //     fontFamily: 'Arial Black', fontSize: 38, color: '#ffffff',
        //     stroke: '#000000', strokeThickness: 8,
        //     align: 'center'
        // }).setOrigin(0.5).setDepth(100);

        // Add the play button image
        const playBTN = this.add.image(960, 750, 'playButton').setDepth(100);
        playBTN.setInteractive({cursor: 'pointer'});
        playBTN.on('pointerdown', () => {
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
