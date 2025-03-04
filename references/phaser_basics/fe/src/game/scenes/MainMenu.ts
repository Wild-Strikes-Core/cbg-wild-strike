import { GameObjects, Scene } from "phaser";

import { EventBus } from "../EventBus";

export class MainMenu extends Scene {
    background: GameObjects.Image;
    logo: GameObjects.Image;
    title: GameObjects.Text;
    logoTween: Phaser.Tweens.Tween | null;
    public cursors: any;
    public keys: any;

    public player: Phaser.GameObjects.Sprite;

    constructor() {
        super("MainMenu");
    }

    preload() {}

    create() {
        this.player = this.add.sprite(512, 384, "character.png");
        this.cursors = this.input.keyboard!.createCursorKeys();
        this.keys = this!.input!.keyboard!.addKeys({
            W: Phaser.Input.Keyboard.KeyCodes.W,
            A: Phaser.Input.Keyboard.KeyCodes.A,
            S: Phaser.Input.Keyboard.KeyCodes.S,
            D: Phaser.Input.Keyboard.KeyCodes.D,
            SPACE: Phaser.Input.Keyboard.KeyCodes.SPACE,
        });

        EventBus.emit("current-scene-ready", this);
    }

    changeScene() {
        if (this.logoTween) {
            this.logoTween.stop();
            this.logoTween = null;
        }
        this.scene.start("Game");
    }

    update() {
        if (this.keys.A.isDown) {
            const x = this.player.x - 5;
            const y = this.player.y;
            this.player.x = x;
        }

        if (this.keys.D.isDown) {
            const x = this.player.x + 5;
            this.player.x = x;
            const y = this.player.y;
        }

        if (this.keys.W.isDown) {
            const y = this.player.y - 5;
            const x = this.player.x;
            this.player.y = y;
        }

        if (this.keys.S.isDown) {
            const y = this.player.y + 5;
            const x = this.player.x;
            this.player.y = y;
        }
    }

    moveLogo(reactCallback: ({ x, y }: { x: number; y: number }) => void) {
        if (this.logoTween) {
            if (this.logoTween.isPlaying()) {
                this.logoTween.pause();
            } else {
                this.logoTween.play();
            }
        } else {
            this.logoTween = this.tweens.add({
                targets: this.logo,
                x: { value: 750, duration: 3000, ease: "Back.easeInOut" },
                y: { value: 80, duration: 1500, ease: "Sine.easeOut" },
                yoyo: true,
                repeat: -1,
                onUpdate: () => {
                    if (reactCallback) {
                        reactCallback({
                            x: Math.floor(this.logo.x),
                            y: Math.floor(this.logo.y),
                        });
                    }
                },
            });
        }
    }
}

