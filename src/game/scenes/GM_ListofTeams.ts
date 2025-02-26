
// You can write more code here

/* START OF COMPILED CODE */

/* START-USER-IMPORTS */
/* END-USER-IMPORTS */

export default class GM_ListofTeams extends Phaser.Scene {

	constructor() {
		super("GM_ListofTeams");

		/* START-USER-CTR-CODE */
		// Write your code here.
		/* END-USER-CTR-CODE */
	}

	editorCreate(): void {

		// btnBACK
		const btnBACK = this.add.image(205, 156, "1__11_-removebg-preview");

		// image_3
		this.add.image(960, 195, "1__20_-removebg-preview");

		// btnCREATETEAM
		const btnCREATETEAM = this.add.image(960, 867, "1__23_-removebg-preview");

		// elementContainer.
		const elementContainer_ = this.add.container(0, 0);
		elementContainer_.blendMode = Phaser.BlendModes.SKIP_CHECK;

		// image_7
		this.add.image(581, 551, "1__21_-removebg-preview");

		// image_1
		this.add.image(554, 436, "1 (24)");

		// image_6
		this.add.image(900, 454, "1__22_-removebg-preview");

		this.btnBACK = btnBACK;
		this.btnCREATETEAM = btnCREATETEAM;

		this.events.emit("scene-awake");
	}

	private btnBACK!: Phaser.GameObjects.Image;
	private btnCREATETEAM!: Phaser.GameObjects.Image;

	/* START-USER-CODE */

	// Write your code here

	create() {
		this.editorCreate(); // Set up scene elements

		const addButtonInteraction = (button: Phaser.GameObjects.Image) => {
			button.setInteractive({ cursor: 'pointer' })
				.on('pointerover', () => button.setTint(0xffff66))
				.on('pointerout', () => button.clearTint());
		};

		addButtonInteraction(this.btnBACK);
		addButtonInteraction(this.btnCREATETEAM);

		this.btnBACK.on('pointerdown', () => {
            this.cameras.main.fadeOut(180, 0, 0, 0);
            this.cameras.main.once('camerafadeoutcomplete', () => {
                this.scene.start("MainMenu"); 
            });
		});
	}

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
