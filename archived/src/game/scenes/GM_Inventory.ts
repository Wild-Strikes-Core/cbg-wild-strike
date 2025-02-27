
// You can write more code here

/* START OF COMPILED CODE */

/* START-USER-IMPORTS */
/* END-USER-IMPORTS */

export default class GM_Inventory extends Phaser.Scene {

	constructor() {
		super("GM_Inventory");

		/* START-USER-CTR-CODE */
		// Write your code here.
		/* END-USER-CTR-CODE */
	}

	editorCreate(): void {

		// btnBACK
		const btnBACK = this.add.image(224, 128, "5G_btnBack");

		// inventory
		const inventory = this.add.container(147.4894485473633, 176);
		inventory.blendMode = Phaser.BlendModes.SKIP_CHECK;
		inventory.scaleX = 1.1039545963152655;
		inventory.scaleY = 1.1039545963152655;

		// invContainerBG
		const invContainerBG = this.add.image(736, 416, "9G_invContainer");
		invContainerBG.scaleX = 2.2206310815079697;
		invContainerBG.scaleY = 2.2206310815079697;
		inventory.add(invContainerBG);

		// inv_rowONE
		const inv_rowONE = this.add.container(144, 160);
		inv_rowONE.blendMode = Phaser.BlendModes.SKIP_CHECK;
		inventory.add(inv_rowONE);

		// slot1
		const slot1 = this.add.image(80, 80, "9G_invSlot");
		slot1.scaleX = 0.817259210209954;
		slot1.scaleY = 0.817259210209954;
		inv_rowONE.add(slot1);

		// slot2
		const slot2 = this.add.image(288, 80, "9G_invSlot");
		slot2.scaleX = 0.817259210209954;
		slot2.scaleY = 0.817259210209954;
		inv_rowONE.add(slot2);

		// slot3
		const slot3 = this.add.image(496, 80, "9G_invSlot");
		slot3.scaleX = 0.817259210209954;
		slot3.scaleY = 0.817259210209954;
		inv_rowONE.add(slot3);

		// slot4
		const slot4 = this.add.image(704, 80, "9G_invSlot");
		slot4.scaleX = 0.817259210209954;
		slot4.scaleY = 0.817259210209954;
		inv_rowONE.add(slot4);

		// slot5
		const slot5 = this.add.image(912, 80, "9G_invSlot");
		slot5.scaleX = 0.817259210209954;
		slot5.scaleY = 0.817259210209954;
		inv_rowONE.add(slot5);

		// slot6
		const slot6 = this.add.image(1120, 80, "9G_invSlot");
		slot6.scaleX = 0.817259210209954;
		slot6.scaleY = 0.817259210209954;
		inv_rowONE.add(slot6);

		// inv_rowTWO
		const inv_rowTWO = this.add.container(144, 352);
		inv_rowTWO.blendMode = Phaser.BlendModes.SKIP_CHECK;
		inventory.add(inv_rowTWO);

		// slot
		const slot = this.add.image(80, 80, "9G_invSlot");
		slot.scaleX = 0.817259210209954;
		slot.scaleY = 0.817259210209954;
		inv_rowTWO.add(slot);

		// slot_1
		const slot_1 = this.add.image(288, 80, "9G_invSlot");
		slot_1.scaleX = 0.817259210209954;
		slot_1.scaleY = 0.817259210209954;
		inv_rowTWO.add(slot_1);

		// slot_2
		const slot_2 = this.add.image(496, 80, "9G_invSlot");
		slot_2.scaleX = 0.817259210209954;
		slot_2.scaleY = 0.817259210209954;
		inv_rowTWO.add(slot_2);

		// slot_3
		const slot_3 = this.add.image(704, 80, "9G_invSlot");
		slot_3.scaleX = 0.817259210209954;
		slot_3.scaleY = 0.817259210209954;
		inv_rowTWO.add(slot_3);

		// slot_4
		const slot_4 = this.add.image(912, 80, "9G_invSlot");
		slot_4.scaleX = 0.817259210209954;
		slot_4.scaleY = 0.817259210209954;
		inv_rowTWO.add(slot_4);

		// slot_5
		const slot_5 = this.add.image(1120, 80, "9G_invSlot");
		slot_5.scaleX = 0.817259210209954;
		slot_5.scaleY = 0.817259210209954;
		inv_rowTWO.add(slot_5);

		// inv_rowTHREE
		const inv_rowTHREE = this.add.container(144, 544);
		inv_rowTHREE.blendMode = Phaser.BlendModes.SKIP_CHECK;
		inventory.add(inv_rowTHREE);

		// slot_6
		const slot_6 = this.add.image(80, 80, "9G_invSlot");
		slot_6.scaleX = 0.817259210209954;
		slot_6.scaleY = 0.817259210209954;
		inv_rowTHREE.add(slot_6);

		// slot_7
		const slot_7 = this.add.image(288, 80, "9G_invSlot");
		slot_7.scaleX = 0.817259210209954;
		slot_7.scaleY = 0.817259210209954;
		inv_rowTHREE.add(slot_7);

		// slot_8
		const slot_8 = this.add.image(496, 80, "9G_invSlot");
		slot_8.scaleX = 0.817259210209954;
		slot_8.scaleY = 0.817259210209954;
		inv_rowTHREE.add(slot_8);

		// slot_9
		const slot_9 = this.add.image(704, 80, "9G_invSlot");
		slot_9.scaleX = 0.817259210209954;
		slot_9.scaleY = 0.817259210209954;
		inv_rowTHREE.add(slot_9);

		// slot_10
		const slot_10 = this.add.image(912, 80, "9G_invSlot");
		slot_10.scaleX = 0.817259210209954;
		slot_10.scaleY = 0.817259210209954;
		inv_rowTHREE.add(slot_10);

		// slot_11
		const slot_11 = this.add.image(1120, 80, "9G_invSlot");
		slot_11.scaleX = 0.817259210209954;
		slot_11.scaleY = 0.817259210209954;
		inv_rowTHREE.add(slot_11);

		// titleINV
		this.add.image(960, 192, "9G_titleINV");

		this.btnBACK = btnBACK;
		this.slot1 = slot1;
		this.slot2 = slot2;
		this.slot3 = slot3;
		this.slot4 = slot4;
		this.slot5 = slot5;
		this.slot6 = slot6;
		this.inv_rowONE = inv_rowONE;
		this.slot = slot;
		this.slot_1 = slot_1;
		this.slot_2 = slot_2;
		this.slot_3 = slot_3;
		this.slot_4 = slot_4;
		this.slot_5 = slot_5;
		this.inv_rowTWO = inv_rowTWO;
		this.slot_6 = slot_6;
		this.slot_7 = slot_7;
		this.slot_8 = slot_8;
		this.slot_9 = slot_9;
		this.slot_10 = slot_10;
		this.slot_11 = slot_11;
		this.inv_rowTHREE = inv_rowTHREE;

		this.events.emit("scene-awake");
	}

	private btnBACK!: Phaser.GameObjects.Image;
	private slot1!: Phaser.GameObjects.Image;
	private slot2!: Phaser.GameObjects.Image;
	private slot3!: Phaser.GameObjects.Image;
	private slot4!: Phaser.GameObjects.Image;
	private slot5!: Phaser.GameObjects.Image;
	private slot6!: Phaser.GameObjects.Image;
	private inv_rowONE!: Phaser.GameObjects.Container;
	private slot!: Phaser.GameObjects.Image;
	private slot_1!: Phaser.GameObjects.Image;
	private slot_2!: Phaser.GameObjects.Image;
	private slot_3!: Phaser.GameObjects.Image;
	private slot_4!: Phaser.GameObjects.Image;
	private slot_5!: Phaser.GameObjects.Image;
	private inv_rowTWO!: Phaser.GameObjects.Container;
	private slot_6!: Phaser.GameObjects.Image;
	private slot_7!: Phaser.GameObjects.Image;
	private slot_8!: Phaser.GameObjects.Image;
	private slot_9!: Phaser.GameObjects.Image;
	private slot_10!: Phaser.GameObjects.Image;
	private slot_11!: Phaser.GameObjects.Image;
	private inv_rowTHREE!: Phaser.GameObjects.Container;

	/* START-USER-CODE */

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
                            // const nextScene = this.scene.get(targetScene);
                            // nextScene.cameras.main.fadeIn(400, 0, 0, 0);
                            this.scene.start(targetScene);
                        });
                    });
                });
        };

		addButtonInteraction(this.btnBACK, "MainMenu");
	}

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
