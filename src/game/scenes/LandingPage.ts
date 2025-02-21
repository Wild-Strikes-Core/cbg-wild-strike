// You can write more code here

/* START OF COMPILED CODE */

/* START-USER-IMPORTS */
/* END-USER-IMPORTS */

export default class LandingPage extends Phaser.Scene {

	constructor() {
		super("LandingPage");

		/* START-USER-CTR-CODE */
		// Write your code here.
		/* END-USER-CTR-CODE */
	}

	editorCreate(): void {

		// bgLayer
		const bgLayer = this.add.layer();
		bgLayer.blendMode = Phaser.BlendModes.SKIP_CHECK;

		// bgClouds
		const bgClouds = this.add.tileSprite(976, 320, 1029, 242, "Purple_Green_Pixel_Illustration_Game_Presentation__2_-removebg-preview");
		bgClouds.scaleX = 2;
		bgClouds.scaleY = 2;
		bgLayer.add(bgClouds);

		// playBtn
		const playBtn = this.add.image(960, 864, "Purple_Green_Pixel_Illustration_Game_Presentation-removebg-preview");

		// wildstrikeLogo
		const wildstrikeLogo = this.add.image(960, 480, "WildStrike-Logo-trans");
		wildstrikeLogo.scaleX = 0.5;
		wildstrikeLogo.scaleY = 0.5;

		this.bgClouds = bgClouds;
		this.playBtn = playBtn;

		this.events.emit("scene-awake");
	}

	private bgClouds!: Phaser.GameObjects.TileSprite;
	private playBtn!: Phaser.GameObjects.Image;

	/* START-USER-CODE */

	// Write your code here

	create() {
		this.editorCreate();
	
		this.cameras.main.fadeIn(180, 0, 0, 0);

		const playBtn = this.playBtn; 
		playBtn.setInteractive({ cursor: 'pointer' });
	
		playBtn.on("pointerdown", () => {
			this.cameras.main.fadeOut(180, 0, 0, 0);
            this.cameras.main.once('camerafadeoutcomplete', () => {
			this.scene.start("MainMenu");
			});
		});
	
		playBtn.on("pointerover", () => {
			playBtn.setTint(0xffff66); // Yellow highlight
		});
	
		playBtn.on("pointerout", () => {
			playBtn.clearTint();
		});
	
	}

	update() {
		this.bgClouds.tilePositionX += 1; // No more "property does not exist" error
	}

    changeScene ()
    {
        this.scene.start("MainMenu"); 
    }

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here