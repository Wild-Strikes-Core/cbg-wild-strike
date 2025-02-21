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

		// bgClouds
		const bgClouds = this.add.layer();
		bgClouds.blendMode = Phaser.BlendModes.SKIP_CHECK;

		// bgCloudsTWO
		const bgCloudsTWO = this.add.image(736, 688, "2G_bgClouds_1");
		bgCloudsTWO.scaleX = 2.4929575936045327;
		bgCloudsTWO.scaleY = 2.4929575936045327;
		bgClouds.add(bgCloudsTWO);

		// bgCloudsONE
		const bgCloudsONE = this.add.image(848, 336, "2G_bgClouds_2");
		bgCloudsONE.scaleX = 2.414775497570459;
		bgCloudsONE.scaleY = 2.414775497570459;
		bgClouds.add(bgCloudsONE);

		// menuBTNS_1
		const menuBTNS_1 = this.add.layer();
		menuBTNS_1.blendMode = Phaser.BlendModes.SKIP_CHECK;

		// image_2
		const image_2 = this.add.image(1531, 470, "2G_btnsBackground");
		image_2.scaleX = 1.866553479953844;
		image_2.scaleY = 1.866553479953844;
		menuBTNS_1.add(image_2);

		// image_1
		const image_1 = this.add.image(1680, 656, "2G_btnSettings");
		image_1.scaleX = 1.291935634726196;
		image_1.scaleY = 1.291935634726196;
		menuBTNS_1.add(image_1);

		// image_3
		const image_3 = this.add.image(1536, 656, "2G_btnTeam");
		image_3.scaleX = 1.291935634726196;
		image_3.scaleY = 1.291935634726196;
		menuBTNS_1.add(image_3);

		// image_4
		const image_4 = this.add.image(1392, 656, "2G_btnLeaderboards");
		image_4.scaleX = 1.291935634726196;
		image_4.scaleY = 1.291935634726196;
		menuBTNS_1.add(image_4);

		// image_8
		const image_8 = this.add.image(1536, 464, "2G_btnArena");
		image_8.scaleX = 1.0624955964435157;
		image_8.scaleY = 1.0624955964435157;
		menuBTNS_1.add(image_8);

		// image_5
		this.add.image(960, 944, "2G_btnInventory");

		// image_6
		this.add.image(656, 944, "2G_btnAbout");

		// image_7
		this.add.image(352, 944, "2G_btnWarriors");

		// image_9
		const image_9 = this.add.image(464, 160, "2G_Player_Name_Card");
		image_9.scaleX = 0.8582378709610599;
		image_9.scaleY = 0.8582378709610599;

		this.bgCloudsTWO = bgCloudsTWO;
		this.bgCloudsONE = bgCloudsONE;

		this.events.emit("scene-awake");
	}

	private bgCloudsTWO!: Phaser.GameObjects.Image;
	private bgCloudsONE!: Phaser.GameObjects.Image;

	/* START-USER-CODE */
    logoTween: Phaser.Tweens.Tween | null;

	// Write your code here
    create ()
    {
        this.editorCreate();

        EventBus.emit('current-scene-ready', this);
    }

    update() 
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

    changeScene ()
    {
        this.scene.start('Game');
    }
    /* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
export { MainMenu };