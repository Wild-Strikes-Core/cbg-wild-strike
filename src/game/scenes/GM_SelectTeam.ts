
// You can write more code here

/* START OF COMPILED CODE */

/* START-USER-IMPORTS */
/* END-USER-IMPORTS */

export default class GM_SelectTeam extends Phaser.Scene {

	constructor() {
		super("GM_SelectTeam");

		/* START-USER-CTR-CODE */
		// Write your code here.
		/* END-USER-CTR-CODE */
	}

	editorCreate(): void {

		// btnSAVE
		const btnSAVE = this.add.image(960, 944, "8G_btnSAVE");

		// selectTeam
		const selectTeam = this.add.container(272, 624);
		selectTeam.blendMode = Phaser.BlendModes.SKIP_CHECK;

		// image_2
		const image_2 = this.add.image(272, 96, "8G_containerINACTIVE");
		selectTeam.add(image_2);

		// image
		const image = this.add.image(480, 96, "8G_containerINACTIVE");
		selectTeam.add(image);

		// image_4
		const image_4 = this.add.image(896, 96, "8G_containerINACTIVE");
		selectTeam.add(image_4);

		// image_5
		const image_5 = this.add.image(1104, 96, "8G_containerINACTIVE");
		selectTeam.add(image_5);

		// image_3
		const image_3 = this.add.image(688, 96, "8G_containerACTIVE");
		image_3.scaleX = 1.4555550764038239;
		image_3.scaleY = 1.4555550764038239;
		selectTeam.add(image_3);

		// btnLEFT
		const btnLEFT = this.add.image(80, 96, "8G_btnLEFT");
		selectTeam.add(btnLEFT);

		// btnRIGHT
		const btnRIGHT = this.add.image(1296, 96, "8G_btnRIGHT");
		selectTeam.add(btnRIGHT);

		// image_6
		const image_6 = this.add.image(976, 208, "8G_teamTITLE");
		image_6.scaleX = 1.5094924615757046;
		image_6.scaleY = 1.5094924615757046;

		// btnBACK
		const btnBACK = this.add.image(224, 128, "5G_btnBack");

		this.btnSAVE = btnSAVE;
		this.btnLEFT = btnLEFT;
		this.btnRIGHT = btnRIGHT;
		this.selectTeam = selectTeam;
		this.btnBACK = btnBACK;

		this.events.emit("scene-awake");
	}

	private btnSAVE!: Phaser.GameObjects.Image;
	private btnLEFT!: Phaser.GameObjects.Image;
	private btnRIGHT!: Phaser.GameObjects.Image;
	private selectTeam!: Phaser.GameObjects.Container;
	private btnBACK!: Phaser.GameObjects.Image;

	/* START-USER-CODE */

	// Write your code here

	create() {

		this.editorCreate();

        const addButtonInteraction = (button: Phaser.GameObjects.Image, targetScene: string = "NONE") => {
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

                    if (targetScene !== "NONE") {
                        // Fade out with a slight delay
                        this.time.delayedCall(150, () => { // Delay more than 50ms of the tweens duration
                            this.cameras.main.fadeOut(400, 0, 0, 0);
                            this.cameras.main.once('camerafadeoutcomplete', () => {
                                // const nextScene = this.scene.get(targetScene);
                                // nextScene.cameras.main.fadeIn(400, 0, 0, 0);
                                this.scene.start(targetScene);
                            });
                        });
                    }

                    button.setInteractive();
                });
        };

		addButtonInteraction(this.btnBACK, "MainMenu");
		addButtonInteraction(this.btnSAVE);
		addButtonInteraction(this.btnRIGHT);
		addButtonInteraction(this.btnLEFT);
	}

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
