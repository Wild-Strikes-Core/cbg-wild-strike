
// You can write more code here

/* START OF COMPILED CODE */

/* START-USER-IMPORTS */
/* END-USER-IMPORTS */

export default class GM_Inventory extends Phaser.Scene {

	constructor() {
		super("GM_Inventory");

		/* START-USER-CTR-CODE */
		// Write your code here.
		/* END-USER-CTR-CODE */
	}

	editorCreate(): void {

		// btnBACK
		const btnBACK = this.add.image(832, 464, "5G_btnBack");

		this.btnBACK = btnBACK;

		this.events.emit("scene-awake");
	}

	private btnBACK!: Phaser.GameObjects.Image;

	/* START-USER-CODE */

	// Write your code here

	create() {

		this.editorCreate();
	}

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
