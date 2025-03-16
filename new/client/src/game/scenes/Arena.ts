// You can write more code here

/* START OF COMPILED CODE */

/* START-USER-IMPORTS */
import { PLAYER_1, PLAYER_2 } from "@/lib/constants";
import { SOCKET } from "@/lib/socket";
import { log } from "node:console";
import { Socket } from "socket.io-client";
// import { PlayerManager } from "../../controllers/PlayerManager";
// import { SceneManager } from "../../controllers/SceneManager";
// import { UIManager } from "../../controllers/UIManager";
// import { MultiplayerManager } from "../../controllers/MultiplayerManager";
// import { AnimationManager } from "../../controllers/AnimationManager";
// import { createPlayerSprite } from "../../utils/spriteUtils";
/* END-USER-IMPORTS */

export default class Arena extends Phaser.Scene {
    private background!: Phaser.GameObjects.Sprite;
    private background_2!: Phaser.GameObjects.Sprite;
    private background_3!: Phaser.GameObjects.Sprite;
    private grass!: Phaser.GameObjects.Sprite;
    private platform!: Phaser.Physics.Arcade.Image;
    private player1HP!: Phaser.GameObjects.Text;
    private player1STA!: Phaser.GameObjects.Text;
    private p1infoContainer!: Phaser.GameObjects.Image;
    private p2infoContainer!: Phaser.GameObjects.Image;
    private uiSkillContainer!: Phaser.GameObjects.Image;
    private uiSkillONE!: Phaser.GameObjects.Image;
    private uiSkillTWO!: Phaser.GameObjects.Image;
    private uiSkillTHREE!: Phaser.GameObjects.Image;
    private uiTimer!: Phaser.GameObjects.Sprite;
    private matchTimerText!: Phaser.GameObjects.Text;
    private player1Name!: Phaser.GameObjects.Text;
    private player2Name!: Phaser.GameObjects.Text;

    private KEYS!: any;
    /* START-USER-CODE */

    // Socket connection
    private socket: Socket = SOCKET;

    // Position update tracking for the server
    private lastPositionUpdate: number = 0;
    private positionUpdateInterval: number = 50; // ms between updates

    // Player state interfaces to match original implementation
    private MY_PLAYER: {
        sprite?: Phaser.Physics.Arcade.Sprite;
    } = {};

    private OTHER_PLAYER: {
        sprite?: Phaser.Physics.Arcade.Sprite;
    } = {};

    private GAME_STATE = {
        player1: {
            id: undefined,
            x: undefined,
            y: undefined,
            velocityX: 0,
            velocityY: 0,
            flipX: false,
        },
        player2: {
            id: undefined,
            x: undefined,
            y: undefined,
            velocityX: 0,
            velocityY: 0,
            flipX: true,
        },
    };
    // private otherPlayer: {
    //     sprite?: Phaser.Physics.Arcade.Sprite;
    //     x?: number;
    //     y?: number;
    //     health?: number;
    //     flipX?: boolean;
    //     velocityX?: number;
    //     velocityY?: number;
    //     animationManager?: AnimationManager;
    // } = {};

    // Other players registry
    private otherPlayers: { [id: string]: Phaser.Physics.Arcade.Sprite } = {};

    // Match data from previous scene
    private matchData: {
        players?: {
            player1: { id: string; name: string };
            player2: { id: string; name: string };
        };
    } = {};

    constructor() {
        super("Arena");
    }

    editorCreate(): void {
        // background
        const background = this.add.sprite(960, 544, "newMap", 0);

        // background_2
        const background_2 = this.add.sprite(960, 560, "newMap", 1);

        // background_3
        const background_3 = this.add.sprite(960, 656, "newMap", 2);

        // grass
        const grass = this.add.sprite(960, 656, "newMap", 3);

        // platform
        const platform = this.physics.add.staticImage(48, 1088, "M_playerCard");
        platform.scaleX = 5;
        platform.alpha = 0.1;
        platform.alphaTopLeft = 0.1;
        platform.alphaTopRight = 0.1;
        platform.alphaBottomLeft = 0.1;
        platform.alphaBottomRight = 0.1;
        platform.body.pushable = false;
        platform.body.immovable = true;
        platform.body.setSize(830, 171, false);

        // player1HP
        const player1HP = this.add.text(678, 708, "", {});
        player1HP.text = "(100/100 HP)";
        player1HP.setStyle({ fontSize: "24px", fontStyle: "bold italic" });

        // player1STA
        const player1STA = this.add.text(672, 736, "", {});
        player1STA.text = "(100/100 STA)";
        player1STA.setStyle({ fontSize: "24px", fontStyle: "bold italic" });

        // p1infoContainer
        const p1infoContainer = this.add.image(
            336,
            112,
            "PlayerStats_Container"
        );
        p1infoContainer.scaleX = 1.07;
        p1infoContainer.scaleY = 1.07;
        p1infoContainer.alpha = 0.8;
        p1infoContainer.alphaTopLeft = 0.8;
        p1infoContainer.alphaTopRight = 0.8;
        p1infoContainer.alphaBottomLeft = 0.8;
        p1infoContainer.alphaBottomRight = 0.8;

        // p2infoContainer
        const p2infoContainer = this.add.image(
            1584,
            112,
            "PlayerStats_Container"
        );
        p2infoContainer.scaleX = 1.07;
        p2infoContainer.scaleY = 1.07;
        p2infoContainer.flipX = true;
        p2infoContainer.alpha = 0.8;
        p2infoContainer.alphaTopLeft = 0.8;
        p2infoContainer.alphaTopRight = 0.8;
        p2infoContainer.alphaBottomLeft = 0.8;
        p2infoContainer.alphaBottomRight = 0.8;

        // skillContainerCTR
        const skillContainerCTR = this.add.container(16, 912);
        skillContainerCTR.blendMode = Phaser.BlendModes.SKIP_CHECK;
        skillContainerCTR.scaleX = 1.1450674740873885;
        skillContainerCTR.scaleY = 1.1450674740873885;

        // uiSkillContainer
        const uiSkillContainer = this.add.image(256, 80, "Skill_Container");
        uiSkillContainer.scaleX = 0.5;
        uiSkillContainer.scaleY = 0.5;
        skillContainerCTR.add(uiSkillContainer);

        // uiSkillONE
        const uiSkillONE = this.add.image(293, 84, "E_skill_icon");
        uiSkillONE.scaleX = 0.4;
        uiSkillONE.scaleY = 0.4;
        skillContainerCTR.add(uiSkillONE);

        // uiSkillTWO
        const uiSkillTWO = this.add.image(182, 84, "Q_Skill_Icon");
        uiSkillTWO.scaleX = 0.4;
        uiSkillTWO.scaleY = 0.4;
        skillContainerCTR.add(uiSkillTWO);

        // uiSkillTHREE
        const uiSkillTHREE = this.add.image(405, 84, "R_skill_icon");
        uiSkillTHREE.scaleX = 0.4;
        uiSkillTHREE.scaleY = 0.4;
        skillContainerCTR.add(uiSkillTHREE);

        // uiTimer
        const uiTimer = this.add.sprite(
            1760,
            1008,
            "Timer_Container_Frames",
            0
        );
        uiTimer.scaleX = 0.8191303940245613;
        uiTimer.scaleY = 0.8191303940245613;
        uiTimer.play("matchTimerAnimTimer_Container_Frames");

        // matchTimerText
        const matchTimerText = this.add.text(1728, 986, "", {});
        matchTimerText.text = "XX:XX";
        matchTimerText.setStyle({
            align: "center",
            fontFamily: "Sans-serif",
            fontSize: "42px",
            fontStyle: "bold italic",
            "shadow.stroke": true,
        });

        // player1Name
        const player1Name = this.add.text(200, 123, "", {});
        player1Name.scaleX = 0.7156265225589847;
        player1Name.scaleY = 0.7156265225589847;
        player1Name.text = "Player 1 Name";
        player1Name.setStyle({
            align: "center",
            color: "#580000ff",
            fontFamily: "Sans-serif",
            fontSize: "42px",
            fontStyle: "bold italic",
            "shadow.stroke": true,
        });

        // player2Name
        const player2Name = this.add.text(1513, 123, "", {});
        player2Name.scaleX = 0.7156265225589847;
        player2Name.scaleY = 0.7156265225589847;
        player2Name.text = "Player 2 Name";
        player2Name.setStyle({
            align: "center",
            color: "#580000ff",
            fontFamily: "Sans-serif",
            fontSize: "42px",
            fontStyle: "bold italic",
            "shadow.stroke": true,
        });

        this.background = background;
        this.background_2 = background_2;
        this.background_3 = background_3;
        this.grass = grass;
        this.platform = platform;
        this.player1HP = player1HP;
        this.player1STA = player1STA;
        this.p1infoContainer = p1infoContainer;
        this.p2infoContainer = p2infoContainer;
        this.uiSkillContainer = uiSkillContainer;
        this.uiSkillONE = uiSkillONE;
        this.uiSkillTWO = uiSkillTWO;
        this.uiSkillTHREE = uiSkillTHREE;
        this.uiTimer = uiTimer;
        this.matchTimerText = matchTimerText;
        this.player1Name = player1Name;
        this.player2Name = player2Name;
    }

    createPlayerSprite(
        scene: Phaser.Scene,
        x: number,
        y: number,
        texture: string = "_Idle_Idle",
        frame: number = 0
    ): Phaser.Physics.Arcade.Sprite {
        const sprite = scene.physics.add.sprite(x, y, texture, frame);
        sprite.setInteractive(
            new Phaser.Geom.Rectangle(0, 0, 120, 80),
            Phaser.Geom.Rectangle.Contains
        );
        sprite.scaleX = 3;
        sprite.scaleY = 3;
        sprite.setOrigin(0, 0);
        if (sprite.body) {
            sprite.body.gravity.y = 10000;
            sprite.body.setOffset(45, 40);
            sprite.body.setSize(30, 40, false);
        }
        return sprite;
    }

    private setupControls(): void {}

    create() {
        // Initialize the scene content from the scene editor
        this.editorCreate();

        this.socket.emit("playerReady", {
            player1: PLAYER_1,
            player2: PLAYER_2,
        });

        this.createPlatforms();

        this.KEYS = this.input.keyboard?.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D,
            down: Phaser.Input.Keyboard.KeyCodes.S,
        })!;

        this.socket.on("playerMoved", (data) => {
            this.GAME_STATE.player1.x = data.x;
            this.GAME_STATE.player1.y = data.y;

            this.GAME_STATE.player2.x = data.x;
            this.GAME_STATE.player2.y = data.y;

            if (this.socket.id != data.id) {
                this.OTHER_PLAYER.sprite?.setX(data.x);
                this.OTHER_PLAYER.sprite?.setY(data.y);

                this.OTHER_PLAYER.sprite?.setVelocityX(data.velocityX);
                this.OTHER_PLAYER.sprite?.setVelocityY(data.velocityY);
                this.OTHER_PLAYER.sprite?.setFlipX(data.flipX);
            }
        });

        this.socket.on("playersConnected", (data) => {
            this.GAME_STATE.player1 = {
                id: data.player1.id,
                x: data.player1.x,
                y: data.player1.y,
                velocityX: 0,
                velocityY: 0,
                flipX: false,
            };

            this.GAME_STATE.player2 = {
                id: data.player2.id,
                x: data.player2.x,
                y: data.player2.y,
                velocityX: 0,
                velocityY: 0,
                flipX: true,
            };

            if (this.socket.id == data.player1.id) {
                this.MY_PLAYER.sprite = this.createPlayerSprite(
                    this,
                    data.player1.x,
                    data.player1.y
                );

                this.OTHER_PLAYER.sprite = this.createPlayerSprite(
                    this,
                    data.player2.x,
                    data.player2.y
                );

                this.OTHER_PLAYER.sprite.setFlipX(true);
                this.MY_PLAYER.sprite.setFlipX(false);
            }

            if (this.socket.id == data.player2.id) {
                this.MY_PLAYER.sprite = this.createPlayerSprite(
                    this,
                    data.player2.x,
                    data.player2.y
                );

                this.OTHER_PLAYER.sprite = this.createPlayerSprite(
                    this,
                    data.player1.x,
                    data.player1.y
                );
                this.MY_PLAYER.sprite.setFlipX(true);
                this.OTHER_PLAYER.sprite.setFlipX(false);
            }

            this.configurePlayerSprite(this.MY_PLAYER.sprite!);
            this.configurePlayerSprite(this.OTHER_PLAYER.sprite!);

            if (this.platform) {
                this.addPlatformCollider(this.MY_PLAYER.sprite!);
                this.addPlatformCollider(this.OTHER_PLAYER.sprite!);
            }

            this.debugGameAssets();
        });

        this.sound.play("in-match", { loop: true, volume: 0.2 });
    }

    /**
     * Configure a player sprite with standard physics settings
     */
    private configurePlayerSprite(sprite: Phaser.Physics.Arcade.Sprite): void {
        sprite.setInteractive(
            new Phaser.Geom.Rectangle(0, 0, 120, 80),
            Phaser.Geom.Rectangle.Contains
        );
        sprite.scaleX = 3;
        sprite.scaleY = 3;
        sprite.setOrigin(0, 0);

        if (sprite.body) {
            sprite.body.gravity.y = 10000;
            sprite.body.setOffset(45, 40);
            sprite.body.setSize(30, 40, false);
        }

        // Important for attack animations: disable automatic animation complete callbacks
        // that would force a return to idle - we'll handle this specifically for attacks
        sprite.setData("autoPlayIdleOnComplete", false);

        // Play initial animation
        try {
            sprite.anims.play("_Idle_Idle", true);
        } catch (error) {
            console.error("Error playing initial animation:", error);
        }
    }

    /**
     * List all available animations for debugging
     */
    private listAnimations(): void {
        console.log("=== AVAILABLE ANIMATIONS ===");
        const animKeys = Object.keys((this.anims as any).anims.entries);
        animKeys.forEach((key) => console.log(`Animation: ${key}`));
        console.log("===========================");
    }

    /**
     * Log animation durations for debugging
     */
    private debugAnimationDurations(): void {
        console.log("=== ANIMATION DURATIONS ===");
        // @ts-ignore
        const animKeys = Object.keys(this.anims.anims.entries);
        animKeys.forEach((key) => {
            const anim = this.anims.get(key);
            if (anim) {
                // Calculate duration based on frameRate and frames
                const frameDuration = 1000 / (anim.frameRate || 24);
                const totalDuration = frameDuration * anim.frames.length;
                console.log(
                    `Animation ${key}: ${totalDuration.toFixed(2)}ms (${
                        anim.frames.length
                    } frames @ ${anim.frameRate || 24}fps)`
                );
            }
        });
        console.log("==========================");
    }

    /**
     * Update method called each frame
     */
    update(time: number, delta: number): void {
        if (
            !this.KEYS.left == undefined ||
            this.MY_PLAYER.sprite == undefined
        ) {
            return;
        }

        if (this.KEYS.left!.isDown) {
            this.MY_PLAYER.sprite!.setVelocityX(-200);
            this.MY_PLAYER.sprite.setFlipX(true);
        } else if (this.KEYS.right.isDown) {
            this.MY_PLAYER.sprite!.setVelocityX(200);
            this.MY_PLAYER.sprite.setFlipX(false);
        } else {
            this.MY_PLAYER.sprite!.setVelocityX(0);
        }

        if (this.GAME_STATE.player1.id == this.socket.id) {
            if (
                this.GAME_STATE.player1.x !== this.MY_PLAYER.sprite.x ||
                this.GAME_STATE.player1.y !== this.MY_PLAYER.sprite.y ||
                this.GAME_STATE.player1.velocityX !==
                    this.MY_PLAYER.sprite.body?.velocity.x ||
                this.GAME_STATE.player1.velocityY !==
                    this.MY_PLAYER.sprite.body?.velocity.y ||
                this.GAME_STATE.player1.flipX !== this.MY_PLAYER.sprite.flipX
            ) {
                this.socket.emit("playerMoved", {
                    x: this.MY_PLAYER.sprite.x,
                    y: this.MY_PLAYER.sprite.y,
                    velocityX: this.MY_PLAYER.sprite.body?.velocity.x,
                    velocityY: this.MY_PLAYER.sprite.body?.velocity.y,
                    flipX: this.MY_PLAYER.sprite.flipX,
                });
            }
        }

        if (this.GAME_STATE.player2.id == this.socket.id) {
            if (
                this.GAME_STATE.player2.x !== this.MY_PLAYER.sprite.x ||
                this.GAME_STATE.player2.y !== this.MY_PLAYER.sprite.y ||
                this.GAME_STATE.player2.velocityX !==
                    this.MY_PLAYER.sprite.body?.velocity.x ||
                this.GAME_STATE.player2.velocityY !==
                    this.MY_PLAYER.sprite.body?.velocity.y ||
                this.GAME_STATE.player2.flipX !== this.MY_PLAYER.sprite.flipX
            ) {
                this.socket.emit("playerMoved", {
                    x: this.MY_PLAYER.sprite.x,
                    y: this.MY_PLAYER.sprite.y,
                    velocityX: this.MY_PLAYER.sprite.body?.velocity.x,
                    velocityY: this.MY_PLAYER.sprite.body?.velocity.y,
                    flipX: this.MY_PLAYER.sprite.flipX,
                });
            }
        }

        // ✅ Jump only if touching the ground
        // if (this.CURSORS.up.isDown && this.player.body.touching.down) {
        //     this.player.setVelocityY(-330);
        // }

        // Update player manager for local player
        // if (this.playerManager) {
        //     this.playerManager.update(time, delta);

        //     // Update camera zoom based on speed
        //     if (this.sceneManager && this.myPlayer.sprite) {
        //         const speed =
        //             this.myPlayer.sprite && this.myPlayer.sprite.body
        //                 ? Math.abs(this.myPlayer.sprite.body.velocity.x)
        //                 : 0;
        //         this.sceneManager.updateCameraZoom(
        //             speed,
        //             this.playerManager.getRunSpeedThreshold()
        //         );
        //     }
        // }

        // Update multiplayer manager
        // if (this.multiplayerManager) {
        //     this.multiplayerManager.update(time, delta);
        // }

        // Debug - Periodically check platform colliders every 2 seconds
        // if (time % 2000 < 20) {
        //     // Check if any player is missing a platform collider
        //     let needsColliderRefresh = false;

        //     if (
        //         this.myPlayer.sprite &&
        //         !this.myPlayer.sprite.getData("platformCollider")
        //     ) {
        //         needsColliderRefresh = true;
        //     }

        //     // if (
        //     //     this.otherPlayer.sprite &&
        //     //     !this.otherPlayer.sprite.getData("platformCollider")
        //     // ) {
        //     //     needsColliderRefresh = true;
        //     // }

        //     // Refresh colliders if needed
        //     if (needsColliderRefresh) {
        //         console.log(
        //             "Missing platform colliders detected, refreshing..."
        //         );
        //         this.refreshAllPlatformColliders();
        //     }
        // }
    }

    /**
     * Handle end of match
     */
    private handleMatchEnd(): void {
        // Add additional logic for match end here
        console.log("Match has ended!");

        // Example: Show victory/defeat message, go to result screen, etc.
    }

    /**
     * Create platforms and level geometry
     */
    createPlatforms(): void {
        // Set up platform physics for the main platform
        if (this.platform) {
            this.platform.setOrigin(0.5, 0); // Center origin horizontally
            this.platform.setImmovable(true);

            // Adjust platform to match camera width with extra safety margin
            const cameraWidth = this.cameras.main.width;
            const safetyMargin = 400; // Extra width on each side
            const totalWidth = cameraWidth + safetyMargin * 2;

            // Update both display width and physics body size
            this.platform.displayWidth = totalWidth;
            if (this.platform.body) {
                (this.platform.body as Phaser.Physics.Arcade.StaticBody).width =
                    totalWidth;
                this.platform.body.setSize(
                    totalWidth,
                    this.platform.body.height,
                    false
                );
            }

            // Position platform in the center of the camera view
            this.platform.x = cameraWidth / 2;

            // Ensure platform is enabled for physics
            if (this.platform.body) {
                this.platform.body.enable = true;
            }

            console.log(
                `Platform configured: width=${totalWidth}, position=(${this.platform.x}, ${this.platform.y})`
            );

            // // Add collider to the player managed by PlayerManager
            // if (this.playerManager && this.playerManager.getPlayer()) {
            //     this.physics.add.collider(
            //         this.playerManager.getPlayer(),
            //         this.platform
            //     );
            // }

            // // Update platform reference in the multiplayer manager
            // if (this.multiplayerManager) {
            //     this.multiplayerManager.setPlatform(this.platform);
            // }
        }
    }

    /**
     * Add platform collider to a player sprite
     * @param sprite - The player sprite to add collider to
     */
    private addPlatformCollider(sprite: Phaser.Physics.Arcade.Sprite): void {
        if (this.platform && sprite && sprite.body) {
            // Remove any existing colliders first to prevent duplicates
            this.physics.world.colliders
                .getActive()
                .filter(
                    (collider) =>
                        (collider.object1 === sprite &&
                            collider.object2 === this.platform) ||
                        (collider.object1 === this.platform &&
                            collider.object2 === sprite)
                )
                .forEach((collider) => collider.destroy());

            // Add a fresh collider
            const collider = this.physics.add.collider(sprite, this.platform);

            // Store reference to help with debugging
            sprite.setData("platformCollider", collider);

            console.log(
                `Platform collider added to player at (${sprite.x}, ${sprite.y})`
            );
        } else {
            console.warn(
                "Could not add platform collider - sprite, platform, or body is missing"
            );
        }
    }

    /**
     * Debug game assets (textures, animations)
     */
    private debugGameAssets(): void {
        // Debug: List loaded textures to confirm which ones are available
        console.log("=== LOADED TEXTURE KEYS ===");
        this.textures.list &&
            Object.keys(this.textures.list).forEach((key) => {
                console.log(`Texture: ${key}`);
            });

        // List available animations for debugging
        this.listAnimations();

        // Debug animation durations
        this.debugAnimationDurations();
    }

    /* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here

