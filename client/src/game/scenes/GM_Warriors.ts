
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

		// btnBACK
		const btnBACK = this.add.image(224, 128, "5G_btnBack");

		// image_4
		this.add.image(960, 160, "2G_titleWARRIORS");

		// container_1
		const container_1 = this.add.container(800, 832);
		container_1.blendMode = Phaser.BlendModes.SKIP_CHECK;

		// btnLEFT
		const btnLEFT = this.add.image(64, 64, "8G_btnLEFT");
		container_1.add(btnLEFT);

		// btnRIGHT
		const btnRIGHT = this.add.image(272, 64, "8G_btnRIGHT");
		container_1.add(btnRIGHT);

		this.btnBACK = btnBACK;
		this.btnLEFT = btnLEFT;
		this.btnRIGHT = btnRIGHT;

		this.events.emit("scene-awake");
	}

	private btnBACK!: Phaser.GameObjects.Image;
	private btnLEFT!: Phaser.GameObjects.Image;
	private btnRIGHT!: Phaser.GameObjects.Image;

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
	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
