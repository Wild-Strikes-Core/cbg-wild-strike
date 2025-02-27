
// You can write more code here

/* START OF COMPILED CODE */

/* START-USER-IMPORTS */
/* END-USER-IMPORTS */

export default class VictoryPage extends Phaser.Scene {

	constructor() {
		super("VictoryPage");

		/* START-USER-CTR-CODE */
		// Write your code here.
		/* END-USER-CTR-CODE */
	}

	editorCreate(): void {

		// bgClouds
		const bgClouds = this.add.tileSprite(976, 288, 1029, 242, "Purple_Green_Pixel_Illustration_Game_Presentation__2_-removebg-preview");
		bgClouds.scaleX = 2;
		bgClouds.scaleY = 2;

		// bgClouds_1
		const bgClouds_1 = this.add.tileSprite(1008, 1072, 1029, 242, "Purple_Green_Pixel_Illustration_Game_Presentation__2_-removebg-preview");
		bgClouds_1.scaleX = 2;
		bgClouds_1.scaleY = 2;

		// platform_1
		const platform_1 = this.add.image(512, 1136, "1 (2)");

		// platform_2
		const platform_2 = this.add.image(960, 1136, "1 (2)");

		// platform_3
		const platform_3 = this.add.image(1392, 1136, "1 (2)");

		// eloBanner
		const eloBanner = this.add.image(960, 848, "1");

		// victoryText
		const victoryText = this.add.image(960, 128, "1 (1)");

		// WLD
		const wLD = this.add.image(960, 416, "1 (3)");

		this.bgClouds = bgClouds;
		this.bgClouds_1 = bgClouds_1;
		this.platform_1 = platform_1;
		this.platform_2 = platform_2;
		this.platform_3 = platform_3;
		this.eloBanner = eloBanner;
		this.victoryText = victoryText;
		this.wLD = wLD;

		this.events.emit("scene-awake");
	}

	private bgClouds!: Phaser.GameObjects.TileSprite;
	private bgClouds_1!: Phaser.GameObjects.TileSprite;
	private platform_1!: Phaser.GameObjects.Image;
	private platform_2!: Phaser.GameObjects.Image;
	private platform_3!: Phaser.GameObjects.Image;
	private eloBanner!: Phaser.GameObjects.Image;
	private victoryText!: Phaser.GameObjects.Image;
	private wLD!: Phaser.GameObjects.Image;

	/* START-USER-CODE */

	// Write your code here

	create() {

		this.editorCreate();

		this.eloBanner.setAlpha(0);
		this.platform_1.setAlpha(0);
		this.platform_2.setAlpha(0);
		this.platform_3.setAlpha(0);
		this.victoryText.setAlpha(0);
		this.wLD.setAlpha(0);

		this.startAnimationSequence();
	}

	update() {
		[this.bgClouds, this.bgClouds_1].forEach(cloud => cloud.tilePositionX += 1);
	}

	startAnimationSequence() {
		console.log("Starting animation sequence...");

		// Platforms rise animation
		this.tweens.add({ 
			targets: this.platform_1, 
			y: 608, 
			alpha: 1, 
			duration: 2000, 
			ease: 'Power2',
			onComplete: () => console.log("Platform 1 animation complete.")
		});

		// Delay platform 2 movement
		this.time.delayedCall(500, () => {
			this.tweens.add({ 
				targets: this.platform_2, 
				y: 560, 
				alpha: 1, 
				duration: 2000, 
				ease: 'Power2',
				onComplete: () => console.log("Platform 2 animation complete.")
			});
		});

		// Delay platform 3 movement
		this.time.delayedCall(1000, () => {
			this.tweens.add({ 
				targets: this.platform_3, 
				y: 608, 
				alpha: 1, 
				duration: 2000, 
				ease: 'Power2',
				onComplete: () => console.log("Platform 3 animation complete.")
			});
		});

		// Victory text fade-in animation
		this.tweens.add({ targets: this.victoryText, alpha: 1, duration: 2000, ease: 'Linear' });

		// Elo banner fade-in animation
		this.tweens.add({ targets: this.eloBanner, alpha: 1, duration: 2000, ease: 'Linear' });

		// Delay 8s before hiding platforms and showing WLD text
		this.time.delayedCall(8000, () => {
			console.log("Fading out platforms, showing WLD...");
			this.tweens.add({ targets: [this.platform_1, this.platform_2, this.platform_3], alpha: 0, duration: 2000, ease: 'Linear' });
			this.tweens.add({ targets: this.wLD, alpha: 1, duration: 2000, ease: 'Linear' });
		});

		// Delay 18s before fading out scene and transitioning to MenuScene
		this.time.delayedCall(18000, () => {
			console.log("Fading out scene...");
			this.cameras.main.fadeOut(2000, 0, 0, 0);
			this.time.delayedCall(2000, () => {
				console.log("Switching to MenuScene...");
				this.scene.start("DefeatPage");
			});
		});
	}
	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
