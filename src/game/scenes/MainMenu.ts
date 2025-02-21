// You can write more code here

/* START OF COMPILED CODE */

/* START-USER-IMPORTS */
import { EventBus } from '../EventBus';
/* END-USER-IMPORTS */

export default class MainMenu extends Phaser.Scene {

	constructor() {
		super("MainMenu");

		/* START-USER-CTR-CODE */
		// Write your code here.
		/* END-USER-CTR-CODE */
	}

	editorCreate(): void {

		// menuBTNS_1
		const menuBTNS_1 = this.add.layer();
		menuBTNS_1.blendMode = Phaser.BlendModes.SKIP_CHECK;

		// image_2
		const image_2 = this.add.image(1531, 470, "2G_btnsBackground");
		image_2.scaleX = 1.53697456223443;
		image_2.scaleY = 1.53697456223443;
		menuBTNS_1.add(image_2);

		// image_1
		const image_1 = this.add.image(1408, 656, "2G_btnSettings");
		menuBTNS_1.add(image_1);

		// image_3
		this.add.image(1360, 528, "2G_btnTeam");

		// image_4
		this.add.image(1520, 544, "2G_btnLeaderboards");

		// image_5
		this.add.image(512, 272, "2G_btnInventory");

		// image_6
		this.add.image(752, 272, "2G_btnAbout");

		// image_7
		this.add.image(272, 496, "2G_btnWarriors");

		// image_8
		this.add.image(1408, 400, "2G_btnArena");

		// image_9
		this.add.image(512, 176, "2G_Player_Name_Card");

		this.events.emit("scene-awake");
	}

	/* START-USER-CODE */
    logoTween: Phaser.Tweens.Tween | null;

	// Write your code here
    create ()
    {
        this.editorCreate();

        EventBus.emit('current-scene-ready', this);
    }

    changeScene ()
    {
        this.scene.start('LandingPage');
    }
    /* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
export { MainMenu };