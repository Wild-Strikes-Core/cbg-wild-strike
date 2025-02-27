
// You can write more code here

/* START OF COMPILED CODE */

/* START-USER-IMPORTS */
/* END-USER-IMPORTS */

export default class M_Matchmaking extends Phaser.Scene {

	constructor() {
		super("M_Matchmaking");

		/* START-USER-CTR-CODE */
		// Write your code here.
		/* END-USER-CTR-CODE */
	}

	editorCreate(): void {

		// image_1
		const image_1 = this.add.image(544, 576, "M_charTWO");
		image_1.scaleX = 1.4199690280632038;
		image_1.scaleY = 1.4199690280632038;

		// image_2
		const image_2 = this.add.image(224, 640, "M_charONE");
		image_2.scaleX = 1.310153805177419;
		image_2.scaleY = 1.310153805177419;

		// image
		const image = this.add.image(848, 640, "M_charTHREE");
		image.scaleX = 1.4199690280632038;
		image.scaleY = 1.4199690280632038;

		// image_3
		this.add.image(160, 176, "M_playerCard");

		// image_4
		const image_4 = this.add.image(1424, 704, "M_btnCancel");
		image_4.scaleX = 1.419003049417908;
		image_4.scaleY = 1.419003049417908;

		// text_1
		const text_1 = this.add.text(1168, 416, "", {});
		text_1.scaleX = 1.4657553250177893;
		text_1.scaleY = 1.4657553250177893;
		text_1.text = "Finding a Match";
		text_1.setStyle({ "fontFamily": "Arial", "fontSize": "48px", "fontStyle": "bold" });

		// loader
		const loader = this.add.text(1392, 496, "", {});
		loader.scaleX = 1.4657553250177893;
		loader.scaleY = 1.4657553250177893;
		loader.text = "...";
		loader.setStyle({ "fontFamily": "Arial", "fontSize": "48px", "fontStyle": "bold" });

		this.loader = loader;

		this.events.emit("scene-awake");
	}

	private loader!: Phaser.GameObjects.Text;

	/* START-USER-CODE */

	// Write your code here

	create() {

		this.editorCreate();

		this.fakeLoad(5);
	}

	private fakeLoad(seconds: integer) {
		let dots = [".", "..", "..."];
		let index = 0;
		
		let timer = this.time.addEvent({
			delay: 250, // Update every 200ms
			repeat: (seconds * 4) - 1, // Repeat for the given duration in 200ms intervals
			callback: () => {                        
				this.loader.text = dots[index];
				index = (index + 1) % dots.length;
			}
		});

		this.time.delayedCall((seconds) * 1000, () => { // Delay more than 50ms of the tweens duration
			this.cameras.main.fadeOut(400, 0, 0, 0);
			this.cameras.main.once('camerafadeoutcomplete', () => {
				// const nextScene = this.scene.get(targetScene);
				// nextScene.cameras.main.fadeIn(400, 0, 0, 0);
				this.scene.start('M_Game');
			});
		});
	}



	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
