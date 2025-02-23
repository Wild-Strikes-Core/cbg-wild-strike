
// You can write more code here

/* START OF COMPILED CODE */

/* START-USER-IMPORTS */
/* END-USER-IMPORTS */

export default class GM_Warriors extends Phaser.Scene {

	constructor() {
		super("GM_Warriors");

		/* START-USER-CTR-CODE */
		// Write your code here.
		/* END-USER-CTR-CODE */
	}

	editorCreate(): void {

		// bgClouds
		const bgClouds = this.add.image(1056, 560, "2G_bgClouds_1");
		bgClouds.scaleX = 3.3066851319295054;
		bgClouds.scaleY = 3.3066851319295054;

		// image_1
		this.add.image(1312, 640, "2G_statContainer");

		// btnLEFT
		const btnLEFT = this.add.image(304, 800, "8G_btnLEFT");

		// btnRIGHT
		const btnRIGHT = this.add.image(512, 800, "8G_btnRIGHT");

		// btnBACK
		const btnBACK = this.add.image(224, 128, "5G_btnBack");

		// image_4
		this.add.image(960, 160, "2G_titleWARRIORS");

		this.bgClouds = bgClouds;
		this.btnLEFT = btnLEFT;
		this.btnRIGHT = btnRIGHT;
		this.btnBACK = btnBACK;

		this.events.emit("scene-awake");
	}

	private bgClouds!: Phaser.GameObjects.Image;
	private btnLEFT!: Phaser.GameObjects.Image;
	private btnRIGHT!: Phaser.GameObjects.Image;
	private btnBACK!: Phaser.GameObjects.Image;

	/* START-USER-CODE */

	// Write your code here

    create() {
        this.editorCreate();

        // Add interactions for each button
        this.addButtonInteraction(this.btnBACK, "MainMenu"); 
        this.addButtonInteraction(this.btnLEFT);
        this.addButtonInteraction(this.btnRIGHT); 
    }

    private addButtonInteraction(button: Phaser.GameObjects.Image, targetScene: string = "NONE") {
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

                if (targetScene !== "NONE")
                {
                    // Fade out with a slight delay
                    this.time.delayedCall(150, () => {
                        this.cameras.main.fadeOut(400, 0, 0, 0);
                        this.cameras.main.once('camerafadeoutcomplete', () => {
                            this.scene.start(targetScene);
                        });
                    });
                }

                button.setInteractive();
            });
    }

	update () {

		this.bgClouds.x -= 0.8;

		// Reset cloud positions when they move off screen
        if (this.bgClouds.x < -1000) {
            this.bgClouds.x = 2600;
        }
	}

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
