// You can write more code here

/* START OF COMPILED CODE */

/* START-USER-IMPORTS */
import { SOCKET } from "@/socket";
import { Socket } from "socket.io-client";
import { PlayerManager } from "../../controllers/PlayerManager";
import { SceneManager } from "../../controllers/SceneManager";
import { UIManager } from "../../controllers/UIManager";
import { MultiplayerManager } from "../../controllers/MultiplayerManager";
import { AnimationManager } from "../../controllers/AnimationManager";
import { createPlayerSprite } from '../../utils/spriteUtils';
/* END-USER-IMPORTS */

export default class M_Game extends Phaser.Scene {

	constructor() {
		super("M_Game");

		/* START-USER-CTR-CODE */
        // Write your code here.
        /* END-USER-CTR-CODE */
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
		player1HP.setStyle({ "fontSize": "24px", "fontStyle": "bold italic" });

		// player1STA
		const player1STA = this.add.text(672, 736, "", {});
		player1STA.text = "(100/100 STA)";
		player1STA.setStyle({ "fontSize": "24px", "fontStyle": "bold italic" });

		// p1infoContainer
		const p1infoContainer = this.add.image(336, 112, "PlayerStats_Container");
		p1infoContainer.scaleX = 1.07;
		p1infoContainer.scaleY = 1.07;
		p1infoContainer.alpha = 0.8;
		p1infoContainer.alphaTopLeft = 0.8;
		p1infoContainer.alphaTopRight = 0.8;
		p1infoContainer.alphaBottomLeft = 0.8;
		p1infoContainer.alphaBottomRight = 0.8;

		// p2infoContainer
		const p2infoContainer = this.add.image(1584, 112, "PlayerStats_Container");
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
		const uiTimer = this.add.sprite(1760, 1008, "Timer_Container_Frames", 0);
		uiTimer.scaleX = 0.8191303940245613;
		uiTimer.scaleY = 0.8191303940245613;
		uiTimer.play("matchTimerAnimTimer_Container_Frames");

		// matchTimerText
		const matchTimerText = this.add.text(1728, 986, "", {});
		matchTimerText.text = "XX:XX";
		matchTimerText.setStyle({ "align": "center", "fontFamily": "Sans-serif", "fontSize": "42px", "fontStyle": "bold italic", "shadow.stroke": true });

		// player1Name
		const player1Name = this.add.text(200, 123, "", {});
		player1Name.scaleX = 0.7156265225589847;
		player1Name.scaleY = 0.7156265225589847;
		player1Name.text = "Player 1 Name";
		player1Name.setStyle({ "align": "center", "color": "#580000ff", "fontFamily": "Sans-serif", "fontSize": "42px", "fontStyle": "bold italic", "shadow.stroke": true });

		// player2Name
		const player2Name = this.add.text(1513, 123, "", {});
		player2Name.scaleX = 0.7156265225589847;
		player2Name.scaleY = 0.7156265225589847;
		player2Name.text = "Player 2 Name";
		player2Name.setStyle({ "align": "center", "color": "#580000ff", "fontFamily": "Sans-serif", "fontSize": "42px", "fontStyle": "bold italic", "shadow.stroke": true });

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

		this.events.emit("scene-awake");
	}

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

	/* START-USER-CODE */

    // Socket connection
    private socket: Socket = SOCKET;

    // Position update tracking for the server
    private lastPositionUpdate: number = 0;
    private positionUpdateInterval: number = 50; // ms between updates

    // Player state interfaces to match original implementation
    private myPlayer: {
        sprite?: Phaser.Physics.Arcade.Sprite;
        x?: number;
        y?: number;
        health?: number;
        flipX?: boolean;
        velocityX?: number;
        velocityY?: number;
    } = {};

    private otherPlayer: {
        sprite?: Phaser.Physics.Arcade.Sprite;
        x?: number;
        y?: number;
        health?: number;
        flipX?: boolean;
        velocityX?: number;
        velocityY?: number;
        animationManager?: AnimationManager;
    } = {};

    // Other players registry
    private otherPlayers: { [id: string]: Phaser.Physics.Arcade.Sprite } = {};
    private otherPlayerAnims: { [id: string]: AnimationManager } = {};

    // Match data from previous scene
    private matchData: { players?: { player1: { id: string; name: string; }; player2: { id: string; name: string; }; }; } = {};

    create() {
        // Initialize the scene content from the scene editor
        this.editorCreate();

        // Get match data from scene parameters
        this.matchData = (this.scene.settings.data as any)?.matchData || {};

        // Set player names if we have match data
        if (this.matchData && this.matchData.players) {
            const isPlayer1 = this.socket.id === this.matchData.players.player1.id;
            const localPlayerData = isPlayer1 ? this.matchData.players.player1 : this.matchData.players.player2;
            const opponentData = isPlayer1 ? this.matchData.players.player2 : this.matchData.players.player1;

            // Update UI with player names
            this.player1Name.setText(localPlayerData.name);
            this.player2Name.setText(opponentData.name);
        }

        // Adjust platform to fit camera width
        this.createPlatforms();

        // console.log("Scene created, connecting to server");

        // Connect to the server
        this.socket.connect();

        // Create player sprites
        this.createPlayerSprites();

        // Initialize the managers
        this.initializeManagers();

        // The following socket event emits should be handled by MultiplayerManager, not directly here
        // Remove or comment out socket emit calls that MultiplayerManager would handle

        // Position update tracking for the server - let MultiplayerManager handle this
        this.lastPositionUpdate = 0;
        this.positionUpdateInterval = 50; // ms between updates

        // This is now handled by MultiplayerManager
        /*
        this.socket.emit("playerJoined", {
            x: this.myPlayer.sprite!.x,
            y: this.myPlayer.sprite!.y,
            animation: "_Idle_Idle"
        });
        */

        // Use MultiplayerManager for position updates instead 
        /*
        this.time.addEvent({
            delay: 50,
            callback: this.sendPositionUpdate,
            callbackScope: this,
            loop: true
        });
        */

        // Listen for timer updates from the server
        this.socket.on("timerUpdate", (data) => {
            this.updateTimer(data.remainingTime);
        });

        // Listen for match end event
        this.socket.on("matchEnded", () => {
            this.handleMatchEnd();
        });

        // Play entrance animation
        this.createEntranceAnimation();

        this.sound.play("in-match", { loop: true, volume: 0.2 });
    }

    /**
     * Create an entrance animation for the match
     */
    private createEntranceAnimation(): void {
        // Store original positions of players for reference
        const myPlayerOriginalX = this.myPlayer.sprite!.x;
        const myPlayerOriginalY = this.myPlayer.sprite!.y;

        // Set initial game state
        // Pause physics to prevent early movement
        this.physics.pause();

        // Hide UI elements initially
        this.p1infoContainer.setAlpha(0);
        this.p2infoContainer.setAlpha(0);
        this.player1Name.setAlpha(0);
        this.player2Name.setAlpha(0);

        // Hide skill container
        const skillContainer = this.children.getByName('skillContainerCTR') as Phaser.GameObjects.Container;
        if (skillContainer) {
            skillContainer.setAlpha(0);
        }

        // Hide timer
        this.uiTimer.setAlpha(0);
        this.matchTimerText.setAlpha(0);

        // Start with a camera flash
        this.cameras.main.flash(500, 0, 0, 0);

        // Create a "FIGHT!" text that starts big and animates down
        const fightText = this.add.text(
            this.cameras.main.width / 2,
            this.cameras.main.height / 2,
            "FIGHT!",
            {
                fontFamily: 'Arial',
                fontSize: '120px',
                color: '#ffffff',
                stroke: '#000000',
                strokeThickness: 8,
                shadow: {
                    offsetX: 2,
                    offsetY: 2,
                    color: '#000',
                    blur: 5,
                    stroke: true,
                    fill: true
                }
            }
        );
        fightText.setOrigin(0.5);
        fightText.setAlpha(0);
        fightText.setScale(2);

        // Make fight text only appear in the UI camera, not the main camera
        fightText.setScrollFactor(0);
        
        // If we have a scene manager with cameras set up, make sure the fight text
        // is only rendered by one camera to prevent duplication
        if (this.sceneManager) {
            // Add to UI elements (will be seen in UI camera only)
            this.sceneManager.addToUIElements(fightText);
        }

        // Create a sequence of animations

        // 1. Fade in player info containers
        this.time.delayedCall(300, () => {
            this.tweens.add({
                targets: [this.p1infoContainer, this.p2infoContainer],
                alpha: 0.8,
                duration: 400,
                ease: 'Power2'
            });

            // Fade in player names with a slight delay
            this.time.delayedCall(200, () => {
                this.tweens.add({
                    targets: [this.player1Name, this.player2Name],
                    alpha: 1,
                    duration: 300,
                    ease: 'Power2'
                });
            });
        });

        // 2. Animate in the FIGHT! text
        this.time.delayedCall(800, () => {
            // Play a whoosh sound
            // this.sound.play('whoosh');

            // Zoom in and fade in the fight text
            this.tweens.add({
                targets: fightText,
                scale: 1,
                alpha: 1,
                duration: 300,
                ease: 'Back.out(1.5)',
                onComplete: () => {
                    // Shake the camera for emphasis
                    this.cameras.main.shake(200, 0.02);

                    // Add a pulsing effect
                    this.tweens.add({
                        targets: fightText,
                        scale: 1.1,
                        yoyo: true,
                        repeat: 1,
                        duration: 150,
                        ease: 'Sine.easeInOut'
                    });

                    // After a short delay, fade out the fight text
                    this.time.delayedCall(800, () => {
                        this.tweens.add({
                            targets: fightText,
                            alpha: 0,
                            scale: 1.5,
                            duration: 300,
                            ease: 'Power2',
                            onComplete: () => {
                                fightText.destroy();
                            }
                        });
                    });
                }
            });
        });

        // 3. Fade in the UI elements
        this.time.delayedCall(1500, () => {
            // Skill icons
            if (skillContainer) {
                this.tweens.add({
                    targets: skillContainer,
                    alpha: 1,
                    duration: 500,
                    ease: 'Power2'
                });
            }

            // Timer
            this.tweens.add({
                targets: [this.uiTimer, this.matchTimerText],
                alpha: 1,
                duration: 500,
                ease: 'Power2'
            });
        });

        // 4. Resume game after all animations
        this.time.delayedCall(2000, () => {
            // Resume physics
            this.physics.resume();

            // Make sure players are in their starting positions
            if (this.myPlayer.sprite) {
                this.myPlayer.sprite.x = myPlayerOriginalX;
                this.myPlayer.sprite.y = myPlayerOriginalY;
            }
        });
    }

    /**
     * Create a sprite for another player
     */
    private createOtherPlayerSprite(id: string, playerInfo: any): void {
        // console.log(`Creating other player sprite for ID: ${id}`, playerInfo);

        try {
            // Create a new sprite for the other player
            const otherPlayerSprite = this.physics.add.sprite(
                playerInfo.x || 900,
                playerInfo.y || 752,
                "_Idle_Idle",
                0
            );

            // Configure the sprite with physics settings
            this.configurePlayerSprite(otherPlayerSprite);

            // Set player color tint to differentiate from local player
            otherPlayerSprite.setTint(0xAAAAAA); // Light gray tint

            // Create animation manager for this player
            const animManager = new AnimationManager(
                this,
                otherPlayerSprite,
                {
                    idle: '_Idle_Idle',
                    walk: '_Run',
                    run: '_Run',
                    jump: '_Jump',
                    fall: '_Fall',
                    crouch: '_CrouchFull',
                    crouchWalk: '_CrouchWalk',
                    attack: '_Attack',
                    attack2: '_Attack2'
                },
                { debug: false }
            );

            // Store the player in our registry with socket ID as key
            this.otherPlayers[id] = otherPlayerSprite;
            this.otherPlayerAnims[id] = animManager;

            // If this is the first other player, also store in the otherPlayer reference 
            // for compatibility with existing code
            if (!this.otherPlayer.sprite) {
                this.otherPlayer.sprite = otherPlayerSprite;
                this.otherPlayer.animationManager = animManager;
            }

            // Create floating name tag above player
            const nameTag = this.add.text(
                otherPlayerSprite.x,
                otherPlayerSprite.y - 60,
                `Player ${id.substring(0, 4)}`, // Show part of the ID as name
                { fontSize: '16px', color: '#FFFFFF', stroke: '#000000', strokeThickness: 3 }
            );
            nameTag.setOrigin(0.5, 1);
            nameTag.setDepth(100);

            // Store the name tag with the player sprite
            otherPlayerSprite.setData('nameTag', nameTag);

            // Make sure the name tag is properly handled by cameras
            // Name tags should follow the player but be visible even during camera effects
            nameTag.setScrollFactor(1); // Follow the world (same as player)

            // Add to appropriate camera lists if scene manager exists
            if (this.sceneManager) {
                // Add sprite to gameplay elements (ignored by UI camera)
                this.sceneManager.addToGameplayElements(otherPlayerSprite);

                // Add name tag to UI elements (ignored by main camera)
                // Comment this line if you want name tags to move with the gameplay camera
                // this.sceneManager.addToUIElements(nameTag);
            }

            // console.log(`Other player sprite created for ID: ${id}`);

            // Add platform collider with a slight delay to ensure physics body is ready
            this.time.delayedCall(50, () => {
                this.addPlatformCollider(otherPlayerSprite);
                console.log(`Platform collider added to player ${id} with delay`);
            });

            console.log(`Other player sprite created for ID: ${id} with platform collider`);
        } catch (error) {
            console.error("Error creating other player sprite:", error);
        }
    }

    /**
     * Configure a player sprite with standard physics settings
     */
    private configurePlayerSprite(sprite: Phaser.Physics.Arcade.Sprite): void {
        sprite.setInteractive(new Phaser.Geom.Rectangle(0, 0, 120, 80), Phaser.Geom.Rectangle.Contains);
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
        sprite.setData('autoPlayIdleOnComplete', false);

        // Play initial animation
        try {
            sprite.anims.play('_Idle_Idle', true);
        } catch (error) {
            console.error("Error playing initial animation:", error);
        }
    }

    /**
     * Initialize all manager classes
     * This is where we connect all managers to each other
     */
    private initializeManagers(): void {
        // Create the scene manager
        this.sceneManager = new SceneManager(
            this,
            this.background,
            [this.background_2], // Add background_2 to parallax elements
            {
                bestZoom: 1.5,
                parallaxFactor: 0.4
            }
        );

        // Create the player manager
        this.playerManager = new PlayerManager(
            this,
            this.socket,
            {
                walkSpeed: 200,
                runSpeed: 400,
                jumpSpeed: -2000,
                crouchSpeed: 150,
                skillE: this.uiSkillONE,
                skillQ: this.uiSkillTWO,
                skillR: this.uiSkillTHREE
            }
        );

        // Create the UI manager
        this.uiManager = new UIManager(
            this,
            {
                p1infoContainer: this.p1infoContainer,
                p2infoContainer: this.p2infoContainer,
                player1Name: this.player1Name,
                player2Name: this.player2Name,
                uiTimer: this.uiTimer,
                matchTimerText: this.matchTimerText,
                uiSkillContainer: this.uiSkillContainer,
                uiSkillONE: this.uiSkillONE,
                uiSkillTWO: this.uiSkillTWO,
                uiSkillTHREE: this.uiSkillTHREE
            }
        );

        // Initialize the player manager with the local player sprite
        this.playerManager.initialize(
            this.myPlayer.sprite!.x, 
            this.myPlayer.sprite!.y, 
            this.player1HP, 
            this.player1STA,
            this.myPlayer.sprite // Pass the existing sprite to the manager
        );

        // Update myPlayer reference to the managed sprite (should be the same object)
        this.myPlayer.sprite = this.playerManager.getPlayer();

        // Initialize multiplayer manager
        this.multiplayerManager = new MultiplayerManager(
            this,
            this.socket,
            this.myPlayer.sprite,
            { 
                positionUpdateInterval: 50,
                platform: this.platform  // Pass the platform directly
            }
        );

        // Connect the multiplayer manager with scene manager
        this.multiplayerManager.setSceneManager(this.sceneManager);

        // IMPORTANT: Clear our otherPlayers registry since MultiplayerManager 
        // will now be the single source of truth for other players
        this.otherPlayers = {};
        this.otherPlayer = {};

        // Set cameras to follow player
        this.sceneManager.setupCameraFollow(this.myPlayer.sprite);

        // Configure camera ignore lists - collect ALL UI elements
        const uiElements = [
            this.p1infoContainer,
            this.p2infoContainer,
            this.player1Name, 
            this.player2Name,
            this.uiTimer,
            this.matchTimerText,
            ...this.uiManager.getUIElements() // Get any additional UI elements from the manager
        ];

        // Add the entire skill container to UI elements
        const skillContainer = this.children.getByName('skillContainerCTR');
        if (skillContainer) {
            uiElements.push(skillContainer);
        }

        // Make main camera ignore ALL UI elements
        this.sceneManager.setMainIgnoreUI(uiElements);

        // Create array of gameplay elements to be ignored by UI camera
        const gameplayElements = [
            this.background,
            this.myPlayer.sprite,
            this.platform,
            this.background_2,
            this.background_3,
            this.grass
        ].filter(elem => elem !== undefined);
        
        // Add other player sprite if it exists
        if (this.otherPlayer.sprite) {
            gameplayElements.push(this.otherPlayer.sprite);
        }
        
        // Add all other player sprites that exist
        Object.values(this.otherPlayers).forEach(sprite => {
            if (sprite) gameplayElements.push(sprite);
        });

        // Make UI camera ignore ALL gameplay elements
        this.sceneManager.setUIIgnoreGameplay(gameplayElements);

        // Add platform colliders to player
        if (this.platform && this.myPlayer.sprite) {
            this.addPlatformCollider(this.myPlayer.sprite);
        }

        // Add platform colliders between other player and ground only if it exists
        if (this.otherPlayer.sprite && this.platform) {
            this.addPlatformCollider(this.otherPlayer.sprite);
        }

        // Also add platform colliders for all otherPlayers
        Object.values(this.otherPlayers).forEach(otherPlayerSprite => {
            this.addPlatformCollider(otherPlayerSprite);
        });

        // Start the match timer
        // this.uiManager.startMatchTimer();

        // Listen for match end event from the UI manager
        this.events.on('matchEnded', this.handleMatchEnd, this);

        // Refresh platform colliders - force execution after initialization
        this.time.delayedCall(100, () => this.refreshAllPlatformColliders());
    }

    /**
     * Create initial player sprites (will be managed by controllers)
     * This ensures compatibility with existing code
     */
    private createPlayerSprites(): void {
        console.log("Creating player sprites");

        // Create the local player sprite
        this.myPlayer.sprite = createPlayerSprite(this, 608, 752);
        this.configurePlayerSprite(this.myPlayer.sprite);

        // Add platform collider to local player
        if (this.platform) {
            this.addPlatformCollider(this.myPlayer.sprite);
        }

        // We no longer need to set up socket handlers here since MultiplayerManager handles it
        // Just set up debugging info
        this.debugGameAssets();

        console.log("Player sprites created");
    }

    /**
     * Setup socket handlers to handle player spawning from server
     * Keep only the handlers that don't overlap with MultiplayerManager
     */
    private setupPlayerSpawning(): void {
        // Remove any previous listeners to prevent duplicates
        this.socket.off("currentPlayers");
        this.socket.off("newPlayer");
        this.socket.off("playerDisconnected");

        // Note: These event handlers are now handled by MultiplayerManager
        // Only keep this method for debugging purposes and texture listing

        // Debug: List loaded textures to confirm which ones are available
        console.log("=== LOADED TEXTURE KEYS ===");
        this.textures.list && Object.keys(this.textures.list).forEach(key => {
            console.log(`Texture: ${key}`);
        });

        // List available animations for debugging
        this.listAnimations();

        // Debug animation durations
        this.debugAnimationDurations();
    }

    /**
     * List all available animations for debugging
     */
    private listAnimations(): void {
        console.log("=== AVAILABLE ANIMATIONS ===");
        const animKeys = Object.keys((this.anims as any).anims.entries);
        animKeys.forEach(key => console.log(`Animation: ${key}`));
        console.log("===========================");
    }

    /**
     * Log animation durations for debugging
     */
    private debugAnimationDurations(): void {
        console.log("=== ANIMATION DURATIONS ===");
        const animKeys = Object.keys(this.anims.anims.entries);
        animKeys.forEach(key => {
            const anim = this.anims.get(key);
            if (anim) {
                // Calculate duration based on frameRate and frames
                const frameDuration = 1000 / (anim.frameRate || 24);
                const totalDuration = frameDuration * anim.frames.length;
                console.log(`Animation ${key}: ${totalDuration.toFixed(2)}ms (${anim.frames.length} frames @ ${anim.frameRate || 24}fps)`);
            }
        });
        console.log("==========================");
    }

    /**
     * Send position and animation data to the server
     * This creates a periodic update of player position and state
     */
    private sendPositionUpdate(): void {
        if (!this.myPlayer.sprite) return;

        // Get the current animation key
        const currentAnim = this.myPlayer.sprite.anims.currentAnim?.key || '_Idle_Idle';

        // Get player state information
        const isJumping = !this.myPlayer.sprite.body?.touching.down;
        const isMoving = Math.abs(this.myPlayer.sprite.body?.velocity.x ?? 0) > 0.5;
        const animState = {
            idle: !isMoving && !isJumping,
            running: isMoving && !isJumping,
            jumping: isJumping && this.myPlayer.sprite.body && this.myPlayer.sprite.body.velocity.y < 0,
            falling: isJumping && this.myPlayer.sprite.body && this.myPlayer.sprite.body.velocity.y > 0,
            attacking: currentAnim.includes('Attack'),
            crouching: currentAnim.includes('Crouch')
        };

        // Debug our animation state
        console.log(`Animation State:`, animState);
        console.log(`Current Animation: ${currentAnim}`);

        // Send detailed state information
        this.socket.emit("playerMoved", {
            x: this.myPlayer.sprite.x,
            y: this.myPlayer.sprite.y,
            animation: currentAnim,
            flipX: this.myPlayer.sprite.flipX,
            velocityX: this.myPlayer.sprite.body?.velocity.x,
            velocityY: this.myPlayer.sprite.body?.velocity.y,
            animState: animState
        });
    }

    /**
     * Update method called each frame
     */
    update(time: number, delta: number): void {
        // Update player manager for local player
        if (this.playerManager) {
            this.playerManager.update(time, delta);

            // Update camera zoom based on speed
            if (this.sceneManager && this.myPlayer.sprite) {
                const speed = this.myPlayer.sprite && this.myPlayer.sprite.body ? Math.abs(this.myPlayer.sprite.body.velocity.x) : 0;
                this.sceneManager.updateCameraZoom(
                    speed,
                    this.playerManager.getRunSpeedThreshold()
                );
            }
        }

        // Update multiplayer manager
        if (this.multiplayerManager) {
            this.multiplayerManager.update(time, delta);
        }

        // Debug - Periodically check platform colliders every 2 seconds
        if (time % 2000 < 20) {
            // Check if any player is missing a platform collider
            let needsColliderRefresh = false;

            if (this.myPlayer.sprite && !this.myPlayer.sprite.getData('platformCollider')) {
                needsColliderRefresh = true;
            }

            if (this.otherPlayer.sprite && !this.otherPlayer.sprite.getData('platformCollider')) {
                needsColliderRefresh = true;
            }

            // Refresh colliders if needed
            if (needsColliderRefresh) {
                console.log("Missing platform colliders detected, refreshing...");
                this.refreshAllPlatformColliders();
            }
        }
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
     * Clean up when scene is shut down
     */
    shutdown(): void {
        // Clean up all managers
        if (this.playerManager) {
            this.playerManager.destroy();
        }

        if (this.sceneManager) {
            this.sceneManager.destroy();
        }

        if (this.uiManager) {
            this.uiManager.destroy();
        }

        if (this.multiplayerManager) {
            this.multiplayerManager.cleanup();
        }

        // Clean up animation managers
        Object.values(this.otherPlayerAnims).forEach(animManager => {
            animManager.destroy();
        });
        this.otherPlayerAnims = {};

        // Disconnect from socket server
        if (this.socket && this.socket.connected) {
            this.socket.disconnect();
        }

        // Clean up socket event listeners
        this.socket.off("currentPlayers");
        this.socket.off("newPlayer");
        this.socket.off("playerDisconnected");
        this.socket.off("playerMoved");
        this.socket.off("arenaStateChanged");

        // Clean up event listeners
        this.events.off('matchEnded', this.handleMatchEnd, this);

        // Clean up all other player sprites
        Object.values(this.otherPlayers).forEach(player => {
            const nameTag = player.getData("nameTag");
            if (nameTag) nameTag.destroy();
            player.destroy();
        });
        this.otherPlayers = {};

        this.sound.stopByKey("in-match");
    }

    /**
     * Update the match timer display
     */
    private updateTimer(remainingTime: number): void {
        const minutes = Math.floor(remainingTime / 60);
        const seconds = remainingTime % 60;
        this.matchTimerText.setText(`${minutes}:${seconds < 10 ? '0' : ''}${seconds}`);
    }

    /**
     * Initialize player and set up related systems
     */
    initializePlayer(): void {
        // Create player manager instance
        this.playerManager = new PlayerManager(
            this,
            this.socket,
            {
                walkSpeed: 200,
                runSpeed: 400,
                jumpSpeed: -2000,
                crouchSpeed: 150,
                skillE: this.uiSkillONE,
                skillQ: this.uiSkillTWO,
                skillR: this.uiSkillTHREE
            }
        );

        // Initialize the player at spawn position
        this.playerManager.initialize(
            100, 450,
            this.playerHPText,
            this.playerStaminaText
        );

        // Add platform colliders to player
        if (this.platform) {
            this.physics.add.collider(this.playerManager.getPlayer(), this.platform);
        }
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
            const totalWidth = cameraWidth + (safetyMargin * 2);

            // Update both display width and physics body size
            this.platform.displayWidth = totalWidth;
            if (this.platform.body) {
                (this.platform.body as Phaser.Physics.Arcade.StaticBody).width = totalWidth;
                this.platform.body.setSize(totalWidth, this.platform.body.height, false);
            }

            // Position platform in the center of the camera view
            this.platform.x = cameraWidth / 2;

            // Ensure platform is enabled for physics
            if (this.platform.body) {
                this.platform.body.enable = true;
            }

            console.log(`Platform configured: width=${totalWidth}, position=(${this.platform.x}, ${this.platform.y})`);

            // Add collider to the player managed by PlayerManager
            if (this.playerManager && this.playerManager.getPlayer()) {
                this.physics.add.collider(this.playerManager.getPlayer(), this.platform);
            }

            // Update platform reference in the multiplayer manager
            if (this.multiplayerManager) {
                this.multiplayerManager.setPlatform(this.platform);
            }
        }
    }

    /**
     * Add platform collider to a player sprite
     * @param sprite - The player sprite to add collider to
     */
    private addPlatformCollider(sprite: Phaser.Physics.Arcade.Sprite): void {
        if (this.platform && sprite && sprite.body) {
            // Remove any existing colliders first to prevent duplicates
            this.physics.world.colliders.getActive()
                .filter(collider => 
                    (collider.object1 === sprite && collider.object2 === this.platform) || 
                    (collider.object1 === this.platform && collider.object2 === sprite))
                .forEach(collider => collider.destroy());

            // Add a fresh collider
            const collider = this.physics.add.collider(sprite, this.platform);

            // Store reference to help with debugging
            sprite.setData('platformCollider', collider);

            console.log(`Platform collider added to player at (${sprite.x}, ${sprite.y})`);
        } else {
            console.warn("Could not add platform collider - sprite, platform, or body is missing");
        }
    }

    /**
     * Refresh all platform colliders for all players
     */
    private refreshAllPlatformColliders(): void {
        // Check local player
        if (this.myPlayer.sprite) {
            this.addPlatformCollider(this.myPlayer.sprite);
        }

        // Check other player
        if (this.otherPlayer.sprite) {
            this.addPlatformCollider(this.otherPlayer.sprite);
        }

        // Check all other players
        Object.values(this.otherPlayers).forEach(player => {
            this.addPlatformCollider(player);
        });
    }

    /**
     * Debug game assets (textures, animations)
     */
    private debugGameAssets(): void {
        // Debug: List loaded textures to confirm which ones are available
        console.log("=== LOADED TEXTURE KEYS ===");
        this.textures.list && Object.keys(this.textures.list).forEach(key => {
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

