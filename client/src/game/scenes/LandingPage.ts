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

		// background
		const background = this.physics.add.image(960, 528, "Space Background");
		background.scaleX = 1.4612663364490137;
		background.scaleY = 1.4612663364490137;
		background.body.setSize(1920, 1080, false);

		// bloomFx
		background.preFX!.addBloom(16777215, 1, 1, 1, 1, 4);

		// bgLayer
		const bgLayer = this.add.layer();
		bgLayer.blendMode = Phaser.BlendModes.SKIP_CHECK;

		// playBtn
		const playBtn = this.add.image(960, 864, "Purple_Green_Pixel_Illustration_Game_Presentation-removebg-preview");

		// wildstrikeLogo
		const wildstrikeLogo = this.add.image(960, 480, "WildStrike-Logo-trans");
		wildstrikeLogo.scaleX = 0.5;
		wildstrikeLogo.scaleY = 0.5;

		this.background = background;
		this.playBtn = playBtn;

		this.events.emit("scene-awake");
	}

	private background!: Phaser.Physics.Arcade.Image;
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
				this.tweens.add({
					targets: playBtn,
					scale: '*=0.9',
					duration: 100,
					yoyo: true,
					onComplete: () => {
						this.scene.start("MainMenu");
					}
				});
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
        
    }

    changeScene ()
    {
        // this.scene.start("MainMenu"); 
        this.scene.start("GM_SelectTeam"); 
    }

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here