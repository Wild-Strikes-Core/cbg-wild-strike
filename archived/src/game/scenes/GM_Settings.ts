// You can write more code here

/* START OF COMPILED CODE */

/* START-USER-IMPORTS */
import { EventBus } from '../EventBus';
/* END-USER-IMPORTS */

export default class GM_Settings extends Phaser.Scene {

	constructor() {
		super("GM_Settings");

		/* START-USER-CTR-CODE */
		// Write your code here.
		/* END-USER-CTR-CODE */
	}

	editorCreate(): void {

		// titleSetting
		const titleSetting = this.add.image(976, 144, "5G_titleSetting");
		titleSetting.scaleX = 0.8898481920954107;
		titleSetting.scaleY = 0.8898481920954107;

		// btnBACK
		const btnBACK = this.add.image(224, 128, "5G_btnBack");

		// btnLOGOUT
		const btnLOGOUT = this.add.image(416, 928, "5G_btnLogout");
		btnLOGOUT.scaleX = 0.773009459221538;
		btnLOGOUT.scaleY = 0.773009459221538;

		// btnTERMS
		const btnTERMS = this.add.image(880, 928, "5G_btnTermsAndServices");
		btnTERMS.scaleX = 0.773009459221538;
		btnTERMS.scaleY = 0.773009459221538;

		// btnACCOUNT
		const btnACCOUNT = this.add.image(1440, 928, "5G_btnLinkAccount");
		btnACCOUNT.scaleX = 0.773009459221538;
		btnACCOUNT.scaleY = 0.773009459221538;

		this.titleSetting = titleSetting;
		this.btnBACK = btnBACK;
		this.btnLOGOUT = btnLOGOUT;
		this.btnTERMS = btnTERMS;
		this.btnACCOUNT = btnACCOUNT;

		this.events.emit("scene-awake");
	}

	private titleSetting!: Phaser.GameObjects.Image;
	private btnBACK!: Phaser.GameObjects.Image;
	private btnLOGOUT!: Phaser.GameObjects.Image;
	private btnTERMS!: Phaser.GameObjects.Image;
	private btnACCOUNT!: Phaser.GameObjects.Image;

	/* START-USER-CODE */

	// Write your code here

	create() {
		this.editorCreate(); // Call this first!

		const addButtonInteraction = (button: Phaser.GameObjects.Image) => {
			button.setInteractive({ cursor: 'pointer' })
				.on('pointerover', () => button.setTint(0xffff66))
				.on('pointerout', () => button.clearTint());
		};

		// Add interactions to all buttons
		addButtonInteraction(this.btnBACK);
		addButtonInteraction(this.btnLOGOUT);
		addButtonInteraction(this.btnTERMS);
		addButtonInteraction(this.btnACCOUNT);

		// Add click handler for back button
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
