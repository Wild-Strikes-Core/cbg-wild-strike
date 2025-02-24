
// You can write more code here

/* START OF COMPILED CODE */

/* START-USER-IMPORTS */
/* END-USER-IMPORTS */

export default class M_Game extends Phaser.Scene {

	constructor() {
		super("M_Game");

		/* START-USER-CTR-CODE */
		// Write your code here.
		/* END-USER-CTR-CODE */
	}

	editorCreate(): void {

		// image_1
		const image_1 = this.add.image(960, 528, "2M_mapBG");
		image_1.scaleX = 1.0264943761149121;
		image_1.scaleY = 1.0264943761149121;
		image_1.alpha = 0.3;
		image_1.alphaTopLeft = 0.3;
		image_1.alphaTopRight = 0.3;
		image_1.alphaBottomLeft = 0.3;
		image_1.alphaBottomRight = 0.3;

		// image_2
		const image_2 = this.add.image(1056, 960, "2M_land");
		image_2.scaleX = 0.8021897715596248;
		image_2.scaleY = 0.8021897715596248;

		this.events.emit("scene-awake");
	}

	/* START-USER-CODE */

	// Write your code here

	create() {

		this.editorCreate();
	}

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
