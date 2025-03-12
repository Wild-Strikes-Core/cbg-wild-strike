// You can write more code here

/* START OF COMPILED CODE */

/* START-USER-IMPORTS */
/* END-USER-IMPORTS */

export default class M_MatchFound extends Phaser.Scene {
    constructor() {
        super("M_MatchFound");

        /* START-USER-CTR-CODE */
        // Write your code here.
        /* END-USER-CTR-CODE */
    }

    editorCreate(): void {
        // image_3
        const image_3 = this.add.image(146, 216, "M_playerCard");

        // playerName
        const playerName = this.add.text(18, 184, "", {});
        playerName.text = "Player Naem";
        playerName.setStyle({
            align: "center",
            fontFamily: "Arial",
            fontSize: "64px",
            fontStyle: "bold",
        });

        // image
        const image = this.add.image(1761, 216, "M_playerCard");

        // playerName_1
        const playerName_1 = this.add.text(1521, 184, "", {});
        playerName_1.text = "Player Naem";
        playerName_1.setStyle({
            align: "center",
            fontFamily: "Arial",
            fontSize: "64px",
            fontStyle: "bold",
        });

        // playerCharSprite
        const playerCharSprite = this.add.image(447, 555, "M_charONE");
        playerCharSprite.scaleX = 1.310153805177419;
        playerCharSprite.scaleY = 1.310153805177419;

        // enemyCharSprite
        const enemyCharSprite = this.add.image(1359, 555, "M_charONE");
        enemyCharSprite.scaleX = 1.310153805177419;
        enemyCharSprite.scaleY = 1.310153805177419;
        enemyCharSprite.flipX = true;

        // vs
        const vs = this.add.text(834, 486, "", {});
        vs.text = "V.S";
        vs.setStyle({
            align: "center",
            fontFamily: "Arial",
            fontSize: "128px",
            fontStyle: "bold",
        });

        this.image_3 = image_3;
        this.playerName = playerName;
        this.image = image;
        this.playerName_1 = playerName_1;
        this.playerCharSprite = playerCharSprite;
        this.enemyCharSprite = enemyCharSprite;
        this.vs = vs;

        this.events.emit("scene-awake");
    }

    private image_3!: Phaser.GameObjects.Image;
    private playerName!: Phaser.GameObjects.Text;
    private image!: Phaser.GameObjects.Image;
    private playerName_1!: Phaser.GameObjects.Text;
    private playerCharSprite!: Phaser.GameObjects.Image;
    private enemyCharSprite!: Phaser.GameObjects.Image;
    private vs!: Phaser.GameObjects.Text;

    /* START-USER-CODE */

    // Write your code here

    create() {
        this.editorCreate();

        // Set up initial states for elements
        this.setupInitialStates();

        // Create entrance animations
        this.animateSceneEntrance();

        // Add auto-transition to battle after animations
        this.time.delayedCall(3500, () => {
            this.transitionToBattle();
        });
    }

    setupInitialStates() {
        // Use direct references to the class properties instead of getByName
        // Hide player names initially
        this.playerName.setAlpha(0);
        this.playerName_1.setAlpha(0);

        // Move player cards off screen
        this.image_3.x = -300; // Using class property instead of getByName
        this.image.x = this.cameras.main.width + 300; // Using class property instead of getByName

        // Character sprites start invisible and small
        this.playerCharSprite.setAlpha(0);
        this.playerCharSprite.setScale(0.5);

        this.enemyCharSprite.setAlpha(0);
        this.enemyCharSprite.setScale(0.5);

        // VS text starts invisible and large
        this.vs.setAlpha(0);
        this.vs.setScale(2);
    }

    animateSceneEntrance() {
        // Use direct references
        // Camera flash to start
        this.cameras.main.flash(300, 0, 0, 0);

        // 1. Animate player cards sliding in
        this.tweens.add({
            targets: this.image_3, // Use class property
            x: 146, // Original position
            duration: 600,
            ease: "Back.out(1.5)",
            onComplete: () => {
                // Fade in player name
                this.tweens.add({
                    targets: this.playerName,
                    alpha: 1,
                    duration: 300,
                });
            },
        });

        this.tweens.add({
            targets: this.image, // Use class property
            x: 1761, // Original position
            duration: 600,
            ease: "Back.out(1.5)",
            onComplete: () => {
                // Fade in enemy name
                this.tweens.add({
                    targets: this.playerName_1,
                    alpha: 1,
                    duration: 300,
                });
            },
        });

        // 2. After a short delay, animate character sprites
        this.time.delayedCall(800, () => {
            // Player character animation
            this.tweens.add({
                targets: this.playerCharSprite,
                alpha: 1,
                scaleX: 1.31, // Original scale
                scaleY: 1.31,
                x: "+= 50", // Move slightly right
                duration: 500,
                ease: "Back.out(1.5)",
                onComplete: () => {
                    // Bounce back to position
                    this.tweens.add({
                        targets: this.playerCharSprite,
                        x: 447, // Original position
                        duration: 150,
                        ease: "Power1.out",
                    });

                    // Add idle animation
                    this.addIdleAnimation(this.playerCharSprite);
                },
            });

            // Enemy character animation with slight delay
            this.time.delayedCall(200, () => {
                this.tweens.add({
                    targets: this.enemyCharSprite,
                    alpha: 1,
                    scaleX: 1.31, // Original scale
                    scaleY: 1.31,
                    x: "-= 50", // Move slightly left
                    duration: 500,
                    ease: "Back.out(1.5)",
                    onComplete: () => {
                        // Bounce back to position
                        this.tweens.add({
                            targets: this.enemyCharSprite,
                            x: 1359, // Original position
                            duration: 150,
                            ease: "Power1.out",
                        });

                        // Add idle animation
                        this.addIdleAnimation(this.enemyCharSprite, true);
                    },
                });
            });
        });

        // 3. Finally, animate the VS text with a strong impact
        this.time.delayedCall(1500, () => {
            // Camera shake for impact
            this.cameras.main.shake(200, 0.01);

            // Flash effect behind VS text
            const flashCircle = this.add.circle(834, 486, 100, 0xffff00, 0);
            flashCircle.setDepth(-1);

            this.tweens.add({
                targets: flashCircle,
                alpha: 0.7,
                scale: 2,
                duration: 300,
                yoyo: true,
                onComplete: () => {
                    flashCircle.destroy();
                },
            });

            // VS text animation
            this.tweens.add({
                targets: this.vs,
                alpha: 1,
                scale: 1,
                duration: 400,
                ease: "Back.out(1.7)",
            });

            // Add a pulsing effect to the VS text
            this.time.delayedCall(400, () => {
                this.tweens.add({
                    targets: this.vs,
                    scale: 1.1,
                    duration: 500,
                    yoyo: true,
                    repeat: -1,
                    ease: "Sine.easeInOut",
                });
            });
        });
    }

    transitionToBattle() {
        // Camera flash
        this.cameras.main.flash(300, 255, 255, 255);

        // Fade out to the next scene
        this.cameras.main.once("cameraflashcomplete", () => {
            this.cameras.main.fadeOut(400);

            this.cameras.main.once("camerafadeoutcomplete", () => {
                this.scene.start("M_Game"); // Replace with your actual battle scene key
            });
        });
    }

    addIdleAnimation(
        charSprite: Phaser.GameObjects.Image,
        isEnemy: boolean = false
    ) {
        // Create a subtle breathing/idle animation
        const originalY = charSprite.y;

        this.tweens.add({
            targets: charSprite,
            y: originalY - 10,
            duration: 1200,
            yoyo: true,
            repeat: -1,
            ease: "Sine.easeInOut",
        });

        // Add a subtle sideways tilt for dynamic posing
        const lean = isEnemy ? -0.03 : 0.03;

        this.tweens.add({
            targets: charSprite,
            rotation: lean,
            duration: 1800,
            yoyo: true,
            repeat: -1,
            ease: "Sine.easeInOut",
            delay: 300, // Offset from the vertical movement
        });
    }

    /* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here

