// You can write more code here

/* START OF COMPILED CODE */

/* START-USER-IMPORTS */
import { handlePlayerMovement } from "../../utils/playerMovement";
import { StaminaManager } from "../../utils/staminaManager";
/* END-USER-IMPORTS */

/**
 * Game scene representing the main gameplay area for a 2D platformer.
 * 
 * @class M_Game
 * @extends Phaser.Scene
 * @description This scene handles the core gameplay mechanics including:
 *  - Player character movement and physics
 *  - Terrain collision detection
 *  - Camera controls with dynamic zoom and follow
 *  - Parallax background effects
 *  - Player animations based on movement state
 *  - Stamina management system for running mechanics
 *  - Health and stamina display
 * 
 * The scene is set up with an initial dramatic camera zoom effect and
 * configures the player with movement capabilities including walking,
 * running, and jumping, all affected by stamina consumption.
 * 
 * UI elements such as health and stamina are positioned dynamically
 * to follow above the player character.
 */
export default class M_Game extends Phaser.Scene {

	constructor() {
		super("M_Game");

		/* START-USER-CTR-CODE */
        // Write your code here.
        this.moveSpeed = 300;  // Define player movement speed
        this.jumpSpeed = -1800; // Define player jump velocity
        /* END-USER-CTR-CODE */
	}

	editorCreate(): void {

		// bgIMAGE
		const bgIMAGE = this.add.image(960, 528, "2M_mapBG");
		bgIMAGE.scaleX = 1.0264943761149121;
		bgIMAGE.scaleY = 1.0264943761149121;
		bgIMAGE.alpha = 0.3;
		bgIMAGE.alphaTopLeft = 0.3;
		bgIMAGE.alphaTopRight = 0.3;
		bgIMAGE.alphaBottomLeft = 0.3;
		bgIMAGE.alphaBottomRight = 0.3;

		// tilesprite_1
		const tilesprite_1 = this.add.tileSprite(32, 1072, 64, 64, "world_tileset", 1) as Phaser.GameObjects.TileSprite & { body: Phaser.Physics.Arcade.StaticBody };
		tilesprite_1.scaleX = 1.3;
		tilesprite_1.scaleY = 1.3;
		this.physics.add.existing(tilesprite_1, true);
		tilesprite_1.body.moves = false;
		tilesprite_1.body.allowGravity = false;
		tilesprite_1.body.allowDrag = false;
		tilesprite_1.body.allowRotation = false;
		tilesprite_1.body.pushable = false;
		tilesprite_1.body.immovable = true;
		tilesprite_1.body.setSize(84, 84, false);

		// tilesprite
		const tilesprite = this.add.tileSprite(112, 1072, 64, 64, "world_tileset", 1) as Phaser.GameObjects.TileSprite & { body: Phaser.Physics.Arcade.StaticBody };
		tilesprite.scaleX = 1.3;
		tilesprite.scaleY = 1.3;
		this.physics.add.existing(tilesprite, true);
		tilesprite.body.moves = false;
		tilesprite.body.allowGravity = false;
		tilesprite.body.allowDrag = false;
		tilesprite.body.allowRotation = false;
		tilesprite.body.pushable = false;
		tilesprite.body.immovable = true;
		tilesprite.body.setSize(84, 84, false);

		// tilesprite_2
		const tilesprite_2 = this.add.tileSprite(192, 1072, 64, 64, "world_tileset", 1) as Phaser.GameObjects.TileSprite & { body: Phaser.Physics.Arcade.StaticBody };
		tilesprite_2.scaleX = 1.3;
		tilesprite_2.scaleY = 1.3;
		this.physics.add.existing(tilesprite_2, true);
		tilesprite_2.body.moves = false;
		tilesprite_2.body.allowGravity = false;
		tilesprite_2.body.allowDrag = false;
		tilesprite_2.body.allowRotation = false;
		tilesprite_2.body.pushable = false;
		tilesprite_2.body.immovable = true;
		tilesprite_2.body.setSize(84, 84, false);

		// tilesprite_3
		const tilesprite_3 = this.add.tileSprite(272, 1072, 64, 64, "world_tileset", 1) as Phaser.GameObjects.TileSprite & { body: Phaser.Physics.Arcade.StaticBody };
		tilesprite_3.scaleX = 1.3;
		tilesprite_3.scaleY = 1.3;
		this.physics.add.existing(tilesprite_3, true);
		tilesprite_3.body.moves = false;
		tilesprite_3.body.allowGravity = false;
		tilesprite_3.body.allowDrag = false;
		tilesprite_3.body.allowRotation = false;
		tilesprite_3.body.pushable = false;
		tilesprite_3.body.immovable = true;
		tilesprite_3.body.setSize(84, 84, false);

		// tilesprite_4
		const tilesprite_4 = this.add.tileSprite(352, 1072, 64, 64, "world_tileset", 1) as Phaser.GameObjects.TileSprite & { body: Phaser.Physics.Arcade.StaticBody };
		tilesprite_4.scaleX = 1.3;
		tilesprite_4.scaleY = 1.3;
		this.physics.add.existing(tilesprite_4, true);
		tilesprite_4.body.moves = false;
		tilesprite_4.body.allowGravity = false;
		tilesprite_4.body.allowDrag = false;
		tilesprite_4.body.allowRotation = false;
		tilesprite_4.body.pushable = false;
		tilesprite_4.body.immovable = true;
		tilesprite_4.body.setSize(84, 84, false);

		// tilesprite_5
		const tilesprite_5 = this.add.tileSprite(432, 1072, 64, 64, "world_tileset", 1) as Phaser.GameObjects.TileSprite & { body: Phaser.Physics.Arcade.StaticBody };
		tilesprite_5.scaleX = 1.3;
		tilesprite_5.scaleY = 1.3;
		this.physics.add.existing(tilesprite_5, true);
		tilesprite_5.body.moves = false;
		tilesprite_5.body.allowGravity = false;
		tilesprite_5.body.allowDrag = false;
		tilesprite_5.body.allowRotation = false;
		tilesprite_5.body.pushable = false;
		tilesprite_5.body.immovable = true;
		tilesprite_5.body.setSize(84, 84, false);

		// tilesprite_6
		const tilesprite_6 = this.add.tileSprite(512, 1072, 64, 64, "world_tileset", 1) as Phaser.GameObjects.TileSprite & { body: Phaser.Physics.Arcade.StaticBody };
		tilesprite_6.scaleX = 1.3;
		tilesprite_6.scaleY = 1.3;
		this.physics.add.existing(tilesprite_6, true);
		tilesprite_6.body.moves = false;
		tilesprite_6.body.allowGravity = false;
		tilesprite_6.body.allowDrag = false;
		tilesprite_6.body.allowRotation = false;
		tilesprite_6.body.pushable = false;
		tilesprite_6.body.immovable = true;
		tilesprite_6.body.setSize(84, 84, false);

		// tilesprite_7
		const tilesprite_7 = this.add.tileSprite(592, 1072, 64, 64, "world_tileset", 1) as Phaser.GameObjects.TileSprite & { body: Phaser.Physics.Arcade.StaticBody };
		tilesprite_7.scaleX = 1.3;
		tilesprite_7.scaleY = 1.3;
		this.physics.add.existing(tilesprite_7, true);
		tilesprite_7.body.moves = false;
		tilesprite_7.body.allowGravity = false;
		tilesprite_7.body.allowDrag = false;
		tilesprite_7.body.allowRotation = false;
		tilesprite_7.body.pushable = false;
		tilesprite_7.body.immovable = true;
		tilesprite_7.body.setSize(84, 84, false);

		// player
		const player = this.physics.add.sprite(304, 832, "Hero_P1", 50);
		player.scaleX = 3;
		player.scaleY = 3;
		player.body.gravity.y = 10000;
		player.body.setOffset(24, 14);
		player.body.setSize(18, 32, false);

		// tilesprite_8
		const tilesprite_8 = this.add.tileSprite(672, 1072, 64, 64, "world_tileset", 1) as Phaser.GameObjects.TileSprite & { body: Phaser.Physics.Arcade.StaticBody };
		tilesprite_8.scaleX = 1.3;
		tilesprite_8.scaleY = 1.3;
		this.physics.add.existing(tilesprite_8, true);
		tilesprite_8.body.moves = false;
		tilesprite_8.body.allowGravity = false;
		tilesprite_8.body.allowDrag = false;
		tilesprite_8.body.allowRotation = false;
		tilesprite_8.body.pushable = false;
		tilesprite_8.body.immovable = true;
		tilesprite_8.body.setSize(84, 84, false);

		// tilesprite_9
		const tilesprite_9 = this.add.tileSprite(752, 1072, 64, 64, "world_tileset", 1) as Phaser.GameObjects.TileSprite & { body: Phaser.Physics.Arcade.StaticBody };
		tilesprite_9.scaleX = 1.3;
		tilesprite_9.scaleY = 1.3;
		this.physics.add.existing(tilesprite_9, true);
		tilesprite_9.body.moves = false;
		tilesprite_9.body.allowGravity = false;
		tilesprite_9.body.allowDrag = false;
		tilesprite_9.body.allowRotation = false;
		tilesprite_9.body.pushable = false;
		tilesprite_9.body.immovable = true;
		tilesprite_9.body.setSize(84, 84, false);

		// tilesprite_10
		const tilesprite_10 = this.add.tileSprite(832, 1072, 64, 64, "world_tileset", 1) as Phaser.GameObjects.TileSprite & { body: Phaser.Physics.Arcade.StaticBody };
		tilesprite_10.scaleX = 1.3;
		tilesprite_10.scaleY = 1.3;
		this.physics.add.existing(tilesprite_10, true);
		tilesprite_10.body.moves = false;
		tilesprite_10.body.allowGravity = false;
		tilesprite_10.body.allowDrag = false;
		tilesprite_10.body.allowRotation = false;
		tilesprite_10.body.pushable = false;
		tilesprite_10.body.immovable = true;
		tilesprite_10.body.setSize(84, 84, false);

		// tilesprite_11
		const tilesprite_11 = this.add.tileSprite(912, 1072, 64, 64, "world_tileset", 1) as Phaser.GameObjects.TileSprite & { body: Phaser.Physics.Arcade.StaticBody };
		tilesprite_11.scaleX = 1.3;
		tilesprite_11.scaleY = 1.3;
		this.physics.add.existing(tilesprite_11, true);
		tilesprite_11.body.moves = false;
		tilesprite_11.body.allowGravity = false;
		tilesprite_11.body.allowDrag = false;
		tilesprite_11.body.allowRotation = false;
		tilesprite_11.body.pushable = false;
		tilesprite_11.body.immovable = true;
		tilesprite_11.body.setSize(84, 84, false);

		// tilesprite_12
		const tilesprite_12 = this.add.tileSprite(992, 1072, 64, 64, "world_tileset", 1) as Phaser.GameObjects.TileSprite & { body: Phaser.Physics.Arcade.StaticBody };
		tilesprite_12.scaleX = 1.3;
		tilesprite_12.scaleY = 1.3;
		this.physics.add.existing(tilesprite_12, true);
		tilesprite_12.body.moves = false;
		tilesprite_12.body.allowGravity = false;
		tilesprite_12.body.allowDrag = false;
		tilesprite_12.body.allowRotation = false;
		tilesprite_12.body.pushable = false;
		tilesprite_12.body.immovable = true;
		tilesprite_12.body.setSize(84, 84, false);

		// tilesprite_13
		const tilesprite_13 = this.add.tileSprite(1072, 1072, 64, 64, "world_tileset", 1) as Phaser.GameObjects.TileSprite & { body: Phaser.Physics.Arcade.StaticBody };
		tilesprite_13.scaleX = 1.3;
		tilesprite_13.scaleY = 1.3;
		this.physics.add.existing(tilesprite_13, true);
		tilesprite_13.body.moves = false;
		tilesprite_13.body.allowGravity = false;
		tilesprite_13.body.allowDrag = false;
		tilesprite_13.body.allowRotation = false;
		tilesprite_13.body.pushable = false;
		tilesprite_13.body.immovable = true;
		tilesprite_13.body.setSize(84, 84, false);

		// tilesprite_14
		const tilesprite_14 = this.add.tileSprite(1152, 1072, 64, 64, "world_tileset", 1) as Phaser.GameObjects.TileSprite & { body: Phaser.Physics.Arcade.StaticBody };
		tilesprite_14.scaleX = 1.3;
		tilesprite_14.scaleY = 1.3;
		this.physics.add.existing(tilesprite_14, true);
		tilesprite_14.body.moves = false;
		tilesprite_14.body.allowGravity = false;
		tilesprite_14.body.allowDrag = false;
		tilesprite_14.body.allowRotation = false;
		tilesprite_14.body.pushable = false;
		tilesprite_14.body.immovable = true;
		tilesprite_14.body.setSize(84, 84, false);

		// tilesprite_15
		const tilesprite_15 = this.add.tileSprite(1232, 1072, 64, 64, "world_tileset", 1) as Phaser.GameObjects.TileSprite & { body: Phaser.Physics.Arcade.StaticBody };
		tilesprite_15.scaleX = 1.3;
		tilesprite_15.scaleY = 1.3;
		this.physics.add.existing(tilesprite_15, true);
		tilesprite_15.body.moves = false;
		tilesprite_15.body.allowGravity = false;
		tilesprite_15.body.allowDrag = false;
		tilesprite_15.body.allowRotation = false;
		tilesprite_15.body.pushable = false;
		tilesprite_15.body.immovable = true;
		tilesprite_15.body.setSize(84, 84, false);

		// tilesprite_16
		const tilesprite_16 = this.add.tileSprite(1312, 1072, 64, 64, "world_tileset", 1) as Phaser.GameObjects.TileSprite & { body: Phaser.Physics.Arcade.StaticBody };
		tilesprite_16.scaleX = 1.3;
		tilesprite_16.scaleY = 1.3;
		this.physics.add.existing(tilesprite_16, true);
		tilesprite_16.body.moves = false;
		tilesprite_16.body.allowGravity = false;
		tilesprite_16.body.allowDrag = false;
		tilesprite_16.body.allowRotation = false;
		tilesprite_16.body.pushable = false;
		tilesprite_16.body.immovable = true;
		tilesprite_16.body.setSize(84, 84, false);

		// tilesprite_17
		const tilesprite_17 = this.add.tileSprite(1392, 1072, 64, 64, "world_tileset", 1) as Phaser.GameObjects.TileSprite & { body: Phaser.Physics.Arcade.StaticBody };
		tilesprite_17.scaleX = 1.3;
		tilesprite_17.scaleY = 1.3;
		this.physics.add.existing(tilesprite_17, true);
		tilesprite_17.body.moves = false;
		tilesprite_17.body.allowGravity = false;
		tilesprite_17.body.allowDrag = false;
		tilesprite_17.body.allowRotation = false;
		tilesprite_17.body.pushable = false;
		tilesprite_17.body.immovable = true;
		tilesprite_17.body.setSize(84, 84, false);

		// tilesprite_18
		const tilesprite_18 = this.add.tileSprite(1472, 1072, 64, 64, "world_tileset", 1) as Phaser.GameObjects.TileSprite & { body: Phaser.Physics.Arcade.StaticBody };
		tilesprite_18.scaleX = 1.3;
		tilesprite_18.scaleY = 1.3;
		this.physics.add.existing(tilesprite_18, true);
		tilesprite_18.body.moves = false;
		tilesprite_18.body.allowGravity = false;
		tilesprite_18.body.allowDrag = false;
		tilesprite_18.body.allowRotation = false;
		tilesprite_18.body.pushable = false;
		tilesprite_18.body.immovable = true;
		tilesprite_18.body.setSize(84, 84, false);

		// tilesprite_19
		const tilesprite_19 = this.add.tileSprite(1552, 1072, 64, 64, "world_tileset", 1) as Phaser.GameObjects.TileSprite & { body: Phaser.Physics.Arcade.StaticBody };
		tilesprite_19.scaleX = 1.3;
		tilesprite_19.scaleY = 1.3;
		this.physics.add.existing(tilesprite_19, true);
		tilesprite_19.body.moves = false;
		tilesprite_19.body.allowGravity = false;
		tilesprite_19.body.allowDrag = false;
		tilesprite_19.body.allowRotation = false;
		tilesprite_19.body.pushable = false;
		tilesprite_19.body.immovable = true;
		tilesprite_19.body.setSize(84, 84, false);

		// tilesprite_20
		const tilesprite_20 = this.add.tileSprite(1632, 1072, 64, 64, "world_tileset", 1) as Phaser.GameObjects.TileSprite & { body: Phaser.Physics.Arcade.StaticBody };
		tilesprite_20.scaleX = 1.3;
		tilesprite_20.scaleY = 1.3;
		this.physics.add.existing(tilesprite_20, true);
		tilesprite_20.body.moves = false;
		tilesprite_20.body.allowGravity = false;
		tilesprite_20.body.allowDrag = false;
		tilesprite_20.body.allowRotation = false;
		tilesprite_20.body.pushable = false;
		tilesprite_20.body.immovable = true;
		tilesprite_20.body.setSize(84, 84, false);

		// tilesprite_21
		const tilesprite_21 = this.add.tileSprite(1712, 1072, 64, 64, "world_tileset", 1) as Phaser.GameObjects.TileSprite & { body: Phaser.Physics.Arcade.StaticBody };
		tilesprite_21.scaleX = 1.3;
		tilesprite_21.scaleY = 1.3;
		this.physics.add.existing(tilesprite_21, true);
		tilesprite_21.body.moves = false;
		tilesprite_21.body.allowGravity = false;
		tilesprite_21.body.allowDrag = false;
		tilesprite_21.body.allowRotation = false;
		tilesprite_21.body.pushable = false;
		tilesprite_21.body.immovable = true;
		tilesprite_21.body.setSize(84, 84, false);

		// tilesprite_22
		const tilesprite_22 = this.add.tileSprite(1792, 1072, 64, 64, "world_tileset", 1) as Phaser.GameObjects.TileSprite & { body: Phaser.Physics.Arcade.StaticBody };
		tilesprite_22.scaleX = 1.3;
		tilesprite_22.scaleY = 1.3;
		this.physics.add.existing(tilesprite_22, true);
		tilesprite_22.body.moves = false;
		tilesprite_22.body.allowGravity = false;
		tilesprite_22.body.allowDrag = false;
		tilesprite_22.body.allowRotation = false;
		tilesprite_22.body.pushable = false;
		tilesprite_22.body.immovable = true;
		tilesprite_22.body.setSize(84, 84, false);

		// tilesprite_23
		const tilesprite_23 = this.add.tileSprite(1872, 1072, 64, 64, "world_tileset", 1) as Phaser.GameObjects.TileSprite & { body: Phaser.Physics.Arcade.StaticBody };
		tilesprite_23.scaleX = 1.3;
		tilesprite_23.scaleY = 1.3;
		this.physics.add.existing(tilesprite_23, true);
		tilesprite_23.body.moves = false;
		tilesprite_23.body.allowGravity = false;
		tilesprite_23.body.allowDrag = false;
		tilesprite_23.body.allowRotation = false;
		tilesprite_23.body.pushable = false;
		tilesprite_23.body.immovable = true;
		tilesprite_23.body.setSize(84, 84, false);

		// tilesprite_24
		const tilesprite_24 = this.add.tileSprite(1952, 1072, 64, 64, "world_tileset", 1) as Phaser.GameObjects.TileSprite & { body: Phaser.Physics.Arcade.StaticBody };
		tilesprite_24.scaleX = 1.3;
		tilesprite_24.scaleY = 1.3;
		this.physics.add.existing(tilesprite_24, true);
		tilesprite_24.body.moves = false;
		tilesprite_24.body.allowGravity = false;
		tilesprite_24.body.allowDrag = false;
		tilesprite_24.body.allowRotation = false;
		tilesprite_24.body.pushable = false;
		tilesprite_24.body.immovable = true;
		tilesprite_24.body.setSize(84, 84, false);

		// player1HP
		const player1HP = this.add.text(678, 708, "", {});
		player1HP.text = "Player 1 (100/100 HP)";
		player1HP.setStyle({ "fontSize": "24px", "fontStyle": "bold italic" });

		// player1STA
		const player1STA = this.add.text(672, 736, "", {});
		player1STA.text = "Player 1 (100/100 STA)";
		player1STA.setStyle({ "fontSize": "24px", "fontStyle": "bold italic" });

		// collider
		this.physics.add.collider(player, tilesprite_1);

		this.bgIMAGE = bgIMAGE;
		this.tilesprite_1 = tilesprite_1;
		this.tilesprite = tilesprite;
		this.tilesprite_2 = tilesprite_2;
		this.tilesprite_3 = tilesprite_3;
		this.tilesprite_4 = tilesprite_4;
		this.tilesprite_5 = tilesprite_5;
		this.tilesprite_6 = tilesprite_6;
		this.tilesprite_7 = tilesprite_7;
		this.player = player;
		this.tilesprite_8 = tilesprite_8;
		this.tilesprite_9 = tilesprite_9;
		this.tilesprite_10 = tilesprite_10;
		this.tilesprite_11 = tilesprite_11;
		this.tilesprite_12 = tilesprite_12;
		this.tilesprite_13 = tilesprite_13;
		this.tilesprite_14 = tilesprite_14;
		this.tilesprite_15 = tilesprite_15;
		this.tilesprite_16 = tilesprite_16;
		this.tilesprite_17 = tilesprite_17;
		this.tilesprite_18 = tilesprite_18;
		this.tilesprite_19 = tilesprite_19;
		this.tilesprite_20 = tilesprite_20;
		this.tilesprite_21 = tilesprite_21;
		this.tilesprite_22 = tilesprite_22;
		this.tilesprite_23 = tilesprite_23;
		this.tilesprite_24 = tilesprite_24;
		this.player1HP = player1HP;
		this.player1STA = player1STA;

		this.events.emit("scene-awake");
	}

	private bgIMAGE!: Phaser.GameObjects.Image;
	private tilesprite_1!: Phaser.GameObjects.TileSprite & { body: Phaser.Physics.Arcade.StaticBody };
	private tilesprite!: Phaser.GameObjects.TileSprite & { body: Phaser.Physics.Arcade.StaticBody };
	private tilesprite_2!: Phaser.GameObjects.TileSprite & { body: Phaser.Physics.Arcade.StaticBody };
	private tilesprite_3!: Phaser.GameObjects.TileSprite & { body: Phaser.Physics.Arcade.StaticBody };
	private tilesprite_4!: Phaser.GameObjects.TileSprite & { body: Phaser.Physics.Arcade.StaticBody };
	private tilesprite_5!: Phaser.GameObjects.TileSprite & { body: Phaser.Physics.Arcade.StaticBody };
	private tilesprite_6!: Phaser.GameObjects.TileSprite & { body: Phaser.Physics.Arcade.StaticBody };
	private tilesprite_7!: Phaser.GameObjects.TileSprite & { body: Phaser.Physics.Arcade.StaticBody };
	private player!: Phaser.Physics.Arcade.Sprite;
	private tilesprite_8!: Phaser.GameObjects.TileSprite & { body: Phaser.Physics.Arcade.StaticBody };
	private tilesprite_9!: Phaser.GameObjects.TileSprite & { body: Phaser.Physics.Arcade.StaticBody };
	private tilesprite_10!: Phaser.GameObjects.TileSprite & { body: Phaser.Physics.Arcade.StaticBody };
	private tilesprite_11!: Phaser.GameObjects.TileSprite & { body: Phaser.Physics.Arcade.StaticBody };
	private tilesprite_12!: Phaser.GameObjects.TileSprite & { body: Phaser.Physics.Arcade.StaticBody };
	private tilesprite_13!: Phaser.GameObjects.TileSprite & { body: Phaser.Physics.Arcade.StaticBody };
	private tilesprite_14!: Phaser.GameObjects.TileSprite & { body: Phaser.Physics.Arcade.StaticBody };
	private tilesprite_15!: Phaser.GameObjects.TileSprite & { body: Phaser.Physics.Arcade.StaticBody };
	private tilesprite_16!: Phaser.GameObjects.TileSprite & { body: Phaser.Physics.Arcade.StaticBody };
	private tilesprite_17!: Phaser.GameObjects.TileSprite & { body: Phaser.Physics.Arcade.StaticBody };
	private tilesprite_18!: Phaser.GameObjects.TileSprite & { body: Phaser.Physics.Arcade.StaticBody };
	private tilesprite_19!: Phaser.GameObjects.TileSprite & { body: Phaser.Physics.Arcade.StaticBody };
	private tilesprite_20!: Phaser.GameObjects.TileSprite & { body: Phaser.Physics.Arcade.StaticBody };
	private tilesprite_21!: Phaser.GameObjects.TileSprite & { body: Phaser.Physics.Arcade.StaticBody };
	private tilesprite_22!: Phaser.GameObjects.TileSprite & { body: Phaser.Physics.Arcade.StaticBody };
	private tilesprite_23!: Phaser.GameObjects.TileSprite & { body: Phaser.Physics.Arcade.StaticBody };
	private tilesprite_24!: Phaser.GameObjects.TileSprite & { body: Phaser.Physics.Arcade.StaticBody };
	private player1HP!: Phaser.GameObjects.Text;
	private player1STA!: Phaser.GameObjects.Text;

	/* START-USER-CODE */

    // Define movement speed and jump power
    private walkSpeed = 200;
    private runSpeed = 400;
    private jumpSpeed = -650;
    private cursors!: any;
    private staminaManager!: StaminaManager;
    private bestZoom = 1.5; // Increased from 0.7 for a closer view of the player
    private parallaxFactor = 0.4; // How much the background moves relative to the camera (0 = fixed, 1 = moves with camera)

    // Write your code here
    create() {
        this.editorCreate();

        // Configure the background for parallax effect
        // Take it out of the camera's scroll effects
        this.bgIMAGE.setScrollFactor(this.parallaxFactor);

        // Optional: add subtle animation to the background
        this.tweens.add({
            targets: this.bgIMAGE,
            y: '+=5',
            duration: 3000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // Add a camera zoom effect - starting further out for a dramatic zoom in
        this.cameras.main.setZoom(0.3);
        this.tweens.add({
            targets: this.cameras.main,
            zoom: this.bestZoom, // Now zooming in closer to the player
            duration: 1200, // Slightly longer for more dramatic effect
            ease: 'Power2'
        });

        // Set up camera to follow player with adjusted offset for closer zoom
        this.cameras.main.startFollow(this.player, true);
        this.cameras.main.setFollowOffset(0, -80); // Adjusted to better frame the player with closer zoom

        // Adjust camera bounds if needed for the closer zoom
        this.cameras.main.setBounds(0, 0, 1920, 1080);

        // Add a keyboard shortcut to adjust zoom (optional)
        this.input.keyboard.on('keydown-Z', () => {
            this.adjustZoom(this.cameras.main.zoom + 0.1);
        });

        this.input.keyboard.on('keydown-X', () => {
            this.adjustZoom(this.cameras.main.zoom - 0.1);
        });

		// Add colliders for all other tilesprites
		this.physics.add.collider(this.player, this.tilesprite);
		this.physics.add.collider(this.player, this.tilesprite_2);
		this.physics.add.collider(this.player, this.tilesprite_3);
		this.physics.add.collider(this.player, this.tilesprite_4);
		this.physics.add.collider(this.player, this.tilesprite_5);
		this.physics.add.collider(this.player, this.tilesprite_6);
		this.physics.add.collider(this.player, this.tilesprite_7);

		// Add colliders for tilesprite_8 through tilesprite_24
		this.physics.add.collider(this.player, this.tilesprite_8);
		this.physics.add.collider(this.player, this.tilesprite_9);
		this.physics.add.collider(this.player, this.tilesprite_10);
		this.physics.add.collider(this.player, this.tilesprite_11);
		this.physics.add.collider(this.player, this.tilesprite_12);
		this.physics.add.collider(this.player, this.tilesprite_13);
		this.physics.add.collider(this.player, this.tilesprite_14);
		this.physics.add.collider(this.player, this.tilesprite_15);
		this.physics.add.collider(this.player, this.tilesprite_16);
		this.physics.add.collider(this.player, this.tilesprite_17);
		this.physics.add.collider(this.player, this.tilesprite_18);
		this.physics.add.collider(this.player, this.tilesprite_19);
		this.physics.add.collider(this.player, this.tilesprite_20);
		this.physics.add.collider(this.player, this.tilesprite_21);
		this.physics.add.collider(this.player, this.tilesprite_22);
		this.physics.add.collider(this.player, this.tilesprite_23);
		this.physics.add.collider(this.player, this.tilesprite_24);

        // Position the HP text initially above the player
        this.positionHPTextAbovePlayer();

        // Define controls with simplified inputs
        this.cursors = this.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D,
            shift: Phaser.Input.Keyboard.KeyCodes.SHIFT
        });

        // Initialize the stamina manager
        this.staminaManager = new StaminaManager(this, this.player1STA, {
            maxStamina: 100,
            regenRate: 0.5,  // Amount to regenerate per tick
            regenDelay: 1000, // Delay before stamina starts regenerating
            updateFrequency: 100 // How often to update stamina regeneration
        });

		// Set initial animation
		this.player.play('IDLEHero');
	}

	update() {
		// Use the simplified movement system with stamina integration
        handlePlayerMovement(
            this.player,
            this.cursors,
            {
                walkSpeed: this.walkSpeed,
                runSpeed: this.runSpeed,
                jumpSpeed: this.jumpSpeed
            },
            {
                idle: 'IDLEHero',
                walk: 'hero_P1-walkHero',
                jump: 'jump',
                run: 'heroRUNHero'
                // You could add run: 'runAnimation' if you have a running animation
            },
            this.staminaManager // Pass the stamina manager
        );

        // Update HP text position to follow the player
        this.positionHPTextAbovePlayer();

        // Alternative implementation of parallax if the setScrollFactor doesn't work well
        // Manually position the background based on camera position
        // this.bgIMAGE.x = this.cameras.main.scrollX * this.parallaxFactor;
        // this.bgIMAGE.y = this.cameras.main.scrollY * this.parallaxFactor + 528; // Add original y position

        // Optional: Dynamic zoom based on player velocity for cinematic effect
        const playerSpeed = Math.abs(this.player.body.velocity.x);
        if (playerSpeed > this.runSpeed * 0.8) {
            // Slightly zoom out when running fast
            const runningZoom = this.bestZoom * 0.9;
            if (Math.abs(this.cameras.main.zoom - runningZoom) > 0.05) {
                this.tweens.add({
                    targets: this.cameras.main,
                    zoom: runningZoom,
                    duration: 200,
                    ease: 'Sine.easeOut'
                });
            }
        } else if (this.cameras.main.zoom < this.bestZoom) {
            // Return to normal zoom when not running
            this.tweens.add({
                targets: this.cameras.main,
                zoom: this.bestZoom,
                duration: 300,
                ease: 'Sine.easeOut'
            });
        }
    }

    // Position the HP and STA text centered above the player's head
    private positionHPTextAbovePlayer() {
        // Calculate position above player (adjust the Y offset as needed)
        const hpYOffset = -70; // Distance above player's head
        const staYOffset = -45; // Distance above player's head but below HP text

        // Center the texts horizontally on the player
        this.player1HP.setPosition(
            this.player.x - this.player1HP.width / 2, 
            this.player.y + hpYOffset
        );

        this.player1STA.setPosition(
            this.player.x - this.player1STA.width / 2, 
            this.player.y + staYOffset
        );
    }

    // Add a method to dynamically adjust parallax factor (optional)
    setParallaxFactor(factor: number) {
        this.parallaxFactor = factor;
        this.bgIMAGE.setScrollFactor(factor);
    }

    // Add a method to smoothly adjust zoom
    adjustZoom(targetZoom: number) {
        // Clamp the value to reasonable limits
        targetZoom = Phaser.Math.Clamp(targetZoom, 0.5, 2.0);

        this.tweens.add({
            targets: this.cameras.main,
            zoom: targetZoom,
            duration: 300,
            ease: 'Sine.easeInOut',
            onComplete: () => {
                this.bestZoom = targetZoom; // Update the best zoom value
            }
        });
    }

    // Clean up when scene is shut down
    shutdown() {
        // Clean up stamina manager resources
        if (this.staminaManager) {
            this.staminaManager.destroy();
        }
    }
    /* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here

