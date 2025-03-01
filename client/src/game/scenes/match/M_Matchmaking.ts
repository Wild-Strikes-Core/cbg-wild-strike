
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

		// background
		const background = this.physics.add.image(960, 540, "Space Background");
		background.scaleX = 1.4612663364490137;
		background.scaleY = 1.4612663364490137;
		background.body.setSize(1920, 1080, false);

		// bloomFx
		background.preFX!.addBloom(16777215, 1, 1, 1, 1, 4);

		// vignetteFx
		background.preFX!.addVignette(0.5, 0.5, 0.6, 0.5);

		// bgCloudsTWO
		const bgCloudsTWO = this.add.image(1024, 752, "2G_bgClouds_1");
		bgCloudsTWO.scaleX = 2.4929575936045327;
		bgCloudsTWO.scaleY = 2.4929575936045327;

		// bgCloudsONE
		const bgCloudsONE = this.add.image(1136, 288, "2G_bgClouds_2");
		bgCloudsONE.scaleX = 2.414775497570459;
		bgCloudsONE.scaleY = 2.414775497570459;

		// image_2
		const image_2 = this.add.image(528, 608, "M_charONE");
		image_2.scaleX = 1.310153805177419;
		image_2.scaleY = 1.310153805177419;

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

		this.background = background;
		this.bgCloudsTWO = bgCloudsTWO;
		this.bgCloudsONE = bgCloudsONE;
		this.loader = loader;

		this.events.emit("scene-awake");
	}

	private background!: Phaser.Physics.Arcade.Image;
	private bgCloudsTWO!: Phaser.GameObjects.Image;
	private bgCloudsONE!: Phaser.GameObjects.Image;
	private loader!: Phaser.GameObjects.Text;

	/* START-USER-CODE */

	// Write your code here

	create() {

		this.editorCreate();

		this.fakeLoad(5);
	}

	update ()
	{
		this.bgCloudsONE.x -= 0.8;
		this.bgCloudsTWO.x -= 0.8;

		// Reset cloud positions when they move off screen
        if (this.bgCloudsONE.x < -1000) {
            this.bgCloudsONE.x = 2600;
        }
        if (this.bgCloudsTWO.x < -1000) {
            this.bgCloudsTWO.x = 2600;
        }
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
