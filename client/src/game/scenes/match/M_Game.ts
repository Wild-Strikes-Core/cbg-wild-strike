// You can write more code here

/* START OF COMPILED CODE */

/* START-USER-IMPORTS */
/* END-USER-IMPORTS */

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

		// image_1
		const image_1 = this.add.image(960, 528, "2M_mapBG");
		image_1.scaleX = 1.0264943761149121;
		image_1.scaleY = 1.0264943761149121;
		image_1.alpha = 0.3;
		image_1.alphaTopLeft = 0.3;
		image_1.alphaTopRight = 0.3;
		image_1.alphaBottomLeft = 0.3;
		image_1.alphaBottomRight = 0.3;

		// tilesprite_1
		const tilesprite_1 = this.add.tileSprite(32, 1040, 64, 64, "world_tileset", 1) as Phaser.GameObjects.TileSprite & { body: Phaser.Physics.Arcade.StaticBody };
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
		const tilesprite = this.add.tileSprite(112, 1040, 64, 64, "world_tileset", 1) as Phaser.GameObjects.TileSprite & { body: Phaser.Physics.Arcade.StaticBody };
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
		const tilesprite_2 = this.add.tileSprite(192, 1040, 64, 64, "world_tileset", 1) as Phaser.GameObjects.TileSprite & { body: Phaser.Physics.Arcade.StaticBody };
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
		const tilesprite_3 = this.add.tileSprite(272, 1040, 64, 64, "world_tileset", 1) as Phaser.GameObjects.TileSprite & { body: Phaser.Physics.Arcade.StaticBody };
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
		const tilesprite_4 = this.add.tileSprite(352, 1040, 64, 64, "world_tileset", 1) as Phaser.GameObjects.TileSprite & { body: Phaser.Physics.Arcade.StaticBody };
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
		const tilesprite_5 = this.add.tileSprite(432, 1040, 64, 64, "world_tileset", 1) as Phaser.GameObjects.TileSprite & { body: Phaser.Physics.Arcade.StaticBody };
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
		const tilesprite_6 = this.add.tileSprite(512, 1040, 64, 64, "world_tileset", 1) as Phaser.GameObjects.TileSprite & { body: Phaser.Physics.Arcade.StaticBody };
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
		const tilesprite_7 = this.add.tileSprite(592, 1040, 64, 64, "world_tileset", 1) as Phaser.GameObjects.TileSprite & { body: Phaser.Physics.Arcade.StaticBody };
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
		const player = this.physics.add.sprite(176, 624, "Hero_P1", 50);
		player.scaleX = 3.2106757654804943;
		player.scaleY = 3.2106757654804943;
		player.body.gravity.y = 10000;
		player.body.setOffset(24, 14);
		player.body.setSize(18, 32, false);

		// collider
		this.physics.add.collider(player, tilesprite_1);

		this.tilesprite_1 = tilesprite_1;
		this.tilesprite = tilesprite;
		this.tilesprite_2 = tilesprite_2;
		this.tilesprite_3 = tilesprite_3;
		this.tilesprite_4 = tilesprite_4;
		this.tilesprite_5 = tilesprite_5;
		this.tilesprite_6 = tilesprite_6;
		this.tilesprite_7 = tilesprite_7;
		this.player = player;

		this.events.emit("scene-awake");
	}

	private tilesprite_1!: Phaser.GameObjects.TileSprite & { body: Phaser.Physics.Arcade.StaticBody };
	private tilesprite!: Phaser.GameObjects.TileSprite & { body: Phaser.Physics.Arcade.StaticBody };
	private tilesprite_2!: Phaser.GameObjects.TileSprite & { body: Phaser.Physics.Arcade.StaticBody };
	private tilesprite_3!: Phaser.GameObjects.TileSprite & { body: Phaser.Physics.Arcade.StaticBody };
	private tilesprite_4!: Phaser.GameObjects.TileSprite & { body: Phaser.Physics.Arcade.StaticBody };
	private tilesprite_5!: Phaser.GameObjects.TileSprite & { body: Phaser.Physics.Arcade.StaticBody };
	private tilesprite_6!: Phaser.GameObjects.TileSprite & { body: Phaser.Physics.Arcade.StaticBody };
	private tilesprite_7!: Phaser.GameObjects.TileSprite & { body: Phaser.Physics.Arcade.StaticBody };
	private player!: Phaser.Physics.Arcade.Sprite;

	/* START-USER-CODE */

    // Define movement speed and jump power
    private moveSpeed = 300;
    private jumpSpeed = -650;
    private cursors!: any;

    // Write your code here

    create() {
        this.editorCreate();

		// Add colliders for all other tilesprites
		this.physics.add.collider(this.player, this.tilesprite);
		this.physics.add.collider(this.player, this.tilesprite_2);
		this.physics.add.collider(this.player, this.tilesprite_3);
		this.physics.add.collider(this.player, this.tilesprite_4);
		this.physics.add.collider(this.player, this.tilesprite_5);
		this.physics.add.collider(this.player, this.tilesprite_6);
		this.physics.add.collider(this.player, this.tilesprite_7);

        // Define controls - changed to include space for jump
        this.cursors = this.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D,
            jump: Phaser.Input.Keyboard.KeyCodes.SPACE
        });

		// Set initial animation
		this.player.play('IDLEHero');
	}
	update() {
		const { left, right, jump, up, down } = this.cursors;
		const onGround = this.player.body.blocked.down || this.player.body.touching.down;
		let Moving = false;
        // Animation transitions
        // Set initial animation if none is playing
        if (!this.player.anims.isPlaying) {
            this.player.play('IDLEHero');
        }

        

        // Reset horizontal velocity when no keys pressed
        if (!left.isDown && !right.isDown) {
            this.player.setVelocityX(0);
        }

        // Check for horizontal movement
        if (left.isDown) {
            this.player.setVelocityX(-this.moveSpeed);
            this.player.flipX = true;
            Moving = true;
        } else if (right.isDown) {
            this.player.setVelocityX(this.moveSpeed);
            this.player.flipX = false;
            Moving = true;
        }

        // Jump logic
        if ((jump.isDown || up.isDown) && onGround) {
            this.player.setVelocityY(this.jumpSpeed);
            this.player.play('jump', true);
        }

        // Fast fall when pressing S key in mid-air
        if (!onGround && down.isDown) {
            this.player.setVelocityY(this.moveSpeed);
        }

            // Handle animations based on player state
            if (onGround) {
			if (Moving) {
				if (this.player.anims.currentAnim?.key !== 'hero_P1-walkHero') {
					this.player.play('hero_P1-walkHero', true);
				}
			} else {
				if (this.player.anims.currentAnim?.key !== 'IDLEHero') {
					this.player.play('IDLEHero', true);
				}
			}
		} else if (this.player.anims.currentAnim?.key !== 'jump') {
			// Player is in the air and not already playing jump animation
			this.player.play('jump', true);
		}

    }
    /* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here

