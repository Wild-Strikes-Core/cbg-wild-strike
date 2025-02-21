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

		// btnSETTINGS
		const btnSETTINGS = this.add.image(1680, 656, "2G_btnSettings");
		btnSETTINGS.scaleX = 1.291935634726196;
		btnSETTINGS.scaleY = 1.291935634726196;
		menuBTNS_1.add(btnSETTINGS);

		// btnTEAM
		const btnTEAM = this.add.image(1536, 656, "2G_btnTeam");
		btnTEAM.scaleX = 1.291935634726196;
		btnTEAM.scaleY = 1.291935634726196;
		menuBTNS_1.add(btnTEAM);

		// btnLEADERBOARDS
		const btnLEADERBOARDS = this.add.image(1392, 656, "2G_btnLeaderboards");
		btnLEADERBOARDS.scaleX = 1.291935634726196;
		btnLEADERBOARDS.scaleY = 1.291935634726196;
		menuBTNS_1.add(btnLEADERBOARDS);

		// btnARENA
		const btnARENA = this.add.image(1536, 464, "2G_btnArena");
		btnARENA.scaleX = 1.0624955964435157;
		btnARENA.scaleY = 1.0624955964435157;
		menuBTNS_1.add(btnARENA);

		// btnINVENTORY
		const btnINVENTORY = this.add.image(960, 944, "2G_btnInventory");

		// btnABOUT
		const btnABOUT = this.add.image(656, 944, "2G_btnAbout");

		// btnWARRIORS
		const btnWARRIORS = this.add.image(352, 944, "2G_btnWarriors");

		// image_9
		const image_9 = this.add.image(464, 160, "2G_Player_Name_Card");
		image_9.scaleX = 0.8582378709610599;
		image_9.scaleY = 0.8582378709610599;

		this.bgCloudsTWO = bgCloudsTWO;
		this.bgCloudsONE = bgCloudsONE;
		this.btnSETTINGS = btnSETTINGS;
		this.btnTEAM = btnTEAM;
		this.btnLEADERBOARDS = btnLEADERBOARDS;
		this.btnARENA = btnARENA;
		this.btnINVENTORY = btnINVENTORY;
		this.btnABOUT = btnABOUT;
		this.btnWARRIORS = btnWARRIORS;

		this.events.emit("scene-awake");
	}

	private bgCloudsTWO!: Phaser.GameObjects.Image;
	private bgCloudsONE!: Phaser.GameObjects.Image;
	private btnSETTINGS!: Phaser.GameObjects.Image;
	private btnTEAM!: Phaser.GameObjects.Image;
	private btnLEADERBOARDS!: Phaser.GameObjects.Image;
	private btnARENA!: Phaser.GameObjects.Image;
	private btnINVENTORY!: Phaser.GameObjects.Image;
	private btnABOUT!: Phaser.GameObjects.Image;
	private btnWARRIORS!: Phaser.GameObjects.Image;

	/* START-USER-CODE */
    logoTween: Phaser.Tweens.Tween | null;

	// Write your code here
    create() {
        this.editorCreate();

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
                            const nextScene = this.scene.get(targetScene);
                            nextScene.cameras.main.fadeIn(400, 0, 0, 0);
                            this.scene.start(targetScene);
                        });
                    });
                });
        };

        // Add interactions for all buttons with their corresponding scenes
        addButtonInteraction(this.btnSETTINGS, 'GM_Settings');
        addButtonInteraction(this.btnTEAM, 'GM_SelectTeam');
        addButtonInteraction(this.btnLEADERBOARDS, 'GM_Settings'); // You might want to change this to a proper leaderboards scene
        addButtonInteraction(this.btnARENA, 'MainGame');
        addButtonInteraction(this.btnINVENTORY, 'GM_Inventory');
        addButtonInteraction(this.btnABOUT, 'GM_About');
        addButtonInteraction(this.btnWARRIORS, 'GM_SelectTeam');

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
        this.scene.start('GM_Settings');
    }
    /* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
export { MainMenu };