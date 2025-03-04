// You can write more code here

/* START OF COMPILED CODE */

/* START-USER-IMPORTS */
/* END-USER-IMPORTS */

export default class GM_About extends Phaser.Scene {

	constructor() {
		super("GM_About");

		/* START-USER-CTR-CODE */
		// Write your code here.
		/* END-USER-CTR-CODE */
	}

	editorCreate(): void {

		// btnBACK
		const btnBACK = this.add.image(224, 128, "5G_btnBack");

		// devPictures
		const devPictures = this.add.container(272, 380);
		devPictures.blendMode = Phaser.BlendModes.SKIP_CHECK;

		// image
		const image = this.add.image(960, 160, "4G_devZoks");
		devPictures.add(image);

		// image_4
		const image_4 = this.add.image(1232, 160, "4G_devJeyz");
		devPictures.add(image_4);

		// image_1
		const image_1 = this.add.image(144, 160, "4G_devSquishy");
		devPictures.add(image_1);

		// image_3
		const image_3 = this.add.image(416, 160, "4G_devCarts");
		devPictures.add(image_3);

		// image_2
		const image_2 = this.add.image(688, 160, "4G_devSquishy");
		devPictures.add(image_2);

		// image_5
		this.add.image(960, 160, "4G_titleDEV");

		// text_1
		const text_1 = this.add.text(270.5, 752, "", {});
		text_1.text = "Wild Strikes is a fast-paced, turn-based battle game that combines strategic card selection with skill-based movement and aiming. Choose your team, position them on the battlefield, and unleash powerful attacks using unique ability cards. Move freely within your turn, take cover, and master combos to outplay your opponents. Defeat all enemy characters to claim victory in intense, action-packed matches!        ";
		text_1.setStyle({ "align": "center", "fontFamily": "Negrita Pro", "fontSize": "40px", "maxLines": 8 });
		text_1.setWordWrapWidth(1400, true);
		text_1.setName("gameDescription"); // Add a name to the text element

		this.btnBACK = btnBACK;
		this.gameDescription = text_1; // Store text reference

		this.events.emit("scene-awake");
	}

	private btnBACK!: Phaser.GameObjects.Image;
	private gameDescription!: Phaser.GameObjects.Text; // Add this property

	/* START-USER-CODE */

	// Write your code here

	create() {
		this.editorCreate();
		
		// Fade in camera effect
		this.cameras.main.fadeIn(800, 0, 0, 0);
		
		// Get all elements that need animation
		const devContainer = this.children.getByName('devPictures') as Phaser.GameObjects.Container;
		const devImages = devContainer ? devContainer.getAll() : [];
		const titleText = this.children.getByName('4G_titleDEV') as Phaser.GameObjects.Image;
		
		// Animate developer images
		devImages.forEach((image, index) => {
			// Start images off-screen above their final position
			image.y -= 200;
			image.alpha = 0;
			
			// Animate them dropping in with a staggered delay
			this.tweens.add({
				targets: image,
				y: '+=200',
				alpha: 1,
				delay: 100 + (index * 150),
				duration: 800,
				ease: 'Bounce.Out'
			});
		});
		
		// Animate title
		if (titleText) {
			titleText.setScale(0.5);
			titleText.alpha = 0;
			
			this.tweens.add({
				targets: titleText,
				scale: 1,
				alpha: 1,
				duration: 1000,
				delay: 200,
				ease: 'Back.Out'
			});
		}
		
		 // Fix text animation - use the direct reference instead of trying to find by name
		if (this.gameDescription) {
			const fullText = this.gameDescription.text;
			
			// Store the full text and start with empty
			this.gameDescription.setText('');
			this.gameDescription.alpha = 0;
			
			// First fade in the empty text container
			this.tweens.add({
				targets: this.gameDescription,
				alpha: 1,
				duration: 300,
				delay: 800,
				onComplete: () => {
					// Create a typing effect with a timer
					let i = 0;
					const typewriterEvent = this.time.addEvent({
						delay: 10, // Speed of typing (lower = faster)
						callback: () => {
							this.gameDescription.text += fullText[i];
							i++;
							
							// Optional: Add sound every few characters
							if (i % 5 === 0) {
								// this.sound.play('typing', { volume: 0.1 });
							}
							
							// Stop when we've typed all characters
							if (i === fullText.length) {
								typewriterEvent.destroy();
							}
						},
						callbackScope: this,
						repeat: fullText.length - 1
					});
				}
			});
		}

		const addButtonInteraction = (button: Phaser.GameObjects.Image, targetScene: string) => {
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

					// Fade out with a slight delay
					this.time.delayedCall(150, () => { // Delay more than 50ms of the tweens duration
						this.cameras.main.fadeOut(400, 0, 0, 0);
						this.cameras.main.once('camerafadeoutcomplete', () => {
							// const nextScene = this.scene.get(targetScene);
							// nextScene.cameras.main.fadeIn(400, 0, 0, 0);
							this.scene.start(targetScene);
						});
					});
				});
		};

		// Animate the back button
		this.btnBACK.alpha = 0;
		this.tweens.add({
			targets: this.btnBACK,
			alpha: 1,
			x: '+=20',
			duration: 500,
			delay: 300,
			ease: 'Power2'
		});

		addButtonInteraction(this.btnBACK, "MainMenu");
	}

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
