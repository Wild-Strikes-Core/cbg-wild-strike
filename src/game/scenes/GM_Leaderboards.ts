
// You can write more code here

/* START OF COMPILED CODE */

/* START-USER-IMPORTS */
/* END-USER-IMPORTS */

export default class GM_Leaderboards extends Phaser.Scene {

	constructor() {
		super("GM_Leaderboards");

		/* START-USER-CTR-CODE */
		// Write your code here.
		/* END-USER-CTR-CODE */
	}

	editorCreate(): void {

		// btnBACK
		const btnBACK = this.add.image(224, 128, "5G_btnBack");

		// image_1
		const image_1 = this.add.image(512, 540, "3G_imgTROPHY");
		image_1.scaleX = 1.6869874687477249;
		image_1.scaleY = 1.6869874687477249;

		// image_2
		this.add.image(512, 928, "3G_titleLEAD");

		// image_3
		const image_3 = this.add.image(1376, 528, "3G_leadCONTAINER");
		image_3.scaleX = 2.471252178470777;
		image_3.scaleY = 2.471252178470777;

		this.btnBACK = btnBACK;

		this.events.emit("scene-awake");
	}

	private btnBACK!: Phaser.GameObjects.Image;

	/* START-USER-CODE */

	// Write your code here

	create() {

		this.editorCreate();

		const addButtonInteraction = (button: Phaser.GameObjects.Image, targetScene: string) => {
            button.setInteractive({ cursor: 'pointer' })
                .on('pointerover', () => button.setTint(0xffff66))
                .on('pointerout', () => button.clearTint())
                .on('pointerdown', () => {
                    // Disable button interaction during transition
                    button.disableInteractive();

                    // Small scale effect, animation
                    this.tweens.add({
                        targets: button,
                        scale: '*=0.9',
                        duration: 100,
                        yoyo: true
                    });

                    // Fade out with a slight delay
                    this.time.delayedCall(150, () => { // Delay more than 50ms of the tweens duration
                        this.cameras.main.fadeOut(400, 0, 0, 0);
                        this.cameras.main.once('camerafadeoutcomplete', () => {
                            // const nextScene = this.scene.get(targetScene);
                            // nextScene.cameras.main.fadeIn(400, 0, 0, 0);
                            this.scene.start(targetScene);
                        });
                    });
                });
        };

		addButtonInteraction(this.btnBACK, "MainMenu");
	}

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
