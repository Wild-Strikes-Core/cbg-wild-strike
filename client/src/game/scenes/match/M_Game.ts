// You can write more code here

/* START OF COMPILED CODE */

/* START-USER-IMPORTS */
import { SOCKET } from "@/socket";
import { Socket } from "socket.io-client";
import { PlayerManager } from "../../controllers/PlayerManager";
import { SceneManager } from "../../controllers/SceneManager";
import { UIManager } from "../../controllers/UIManager";
import { MultiplayerManager } from "../../controllers/MultiplayerManager";
/* END-USER-IMPORTS */

export default class M_Game extends Phaser.Scene {

	constructor() {
		super("M_Game");

		/* START-USER-CTR-CODE */
        // Write your code here.
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
		const tilesprite_1 = this.add.tileSprite(752, 1040, 64, 64, "world_tileset", 1) as Phaser.GameObjects.TileSprite & { body: Phaser.Physics.Arcade.StaticBody };
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
		const tilesprite = this.add.tileSprite(832, 1040, 64, 64, "world_tileset", 1) as Phaser.GameObjects.TileSprite & { body: Phaser.Physics.Arcade.StaticBody };
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
		const player1Name = this.add.text(256, 80, "", {});
		player1Name.scaleX = 0.8749634497392944;
		player1Name.scaleY = 0.8749634497392944;
		player1Name.text = "Player 1 Name";
		player1Name.setStyle({ "align": "center", "fontFamily": "Sans-serif", "fontSize": "42px", "fontStyle": "bold italic", "shadow.stroke": true });

		// player2Name
		const player2Name = this.add.text(1408, 80, "", {});
		player2Name.scaleX = 0.8749634497392944;
		player2Name.scaleY = 0.8749634497392944;
		player2Name.text = "Player 2 Name";
		player2Name.setStyle({ "align": "center", "fontFamily": "Sans-serif", "fontSize": "42px", "fontStyle": "bold italic", "shadow.stroke": true });

		this.bgIMAGE = bgIMAGE;
		this.tilesprite_1 = tilesprite_1;
		this.tilesprite = tilesprite;
		this.player1HP = player1HP;
		this.player1STA = player1STA;
		this.p1infoContainer = p1infoContainer;
		this.p2infoContainer = p2infoContainer;
		this.skillContainerCTR = skillContainerCTR;
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

	private bgIMAGE!: Phaser.GameObjects.Image;
	private tilesprite_1!: Phaser.GameObjects.TileSprite & { body: Phaser.Physics.Arcade.StaticBody };
	private tilesprite!: Phaser.GameObjects.TileSprite & { body: Phaser.Physics.Arcade.StaticBody };
	private player1HP!: Phaser.GameObjects.Text;
	private player1STA!: Phaser.GameObjects.Text;
	private p1infoContainer!: Phaser.GameObjects.Image;
	private p2infoContainer!: Phaser.GameObjects.Image;
	private skillContainerCTR!: Phaser.GameObjects.Container;
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
    } = {};
    
    // Other players registry
    private otherPlayers: { [id: string]: Phaser.Physics.Arcade.Sprite } = {};

    // Manager instances
    private playerManager?: PlayerManager;
    private sceneManager?: SceneManager;
    private uiManager?: UIManager;
    private multiplayerManager?: MultiplayerManager;
    
    create() {
        // Initialize the scene content from the scene editor
        this.editorCreate();
        
        console.log("Scene created, connecting to server");
        
        // Connect to the server
        this.socket.connect();
        
        // Create player sprites
        this.createPlayerSprites();
        
        // Set up socket event handlers
        this.setupSocketHandlers();
        
        // Initialize the managers
        this.initializeManagers();
        
        // Position update tracking for the server
        this.lastPositionUpdate = 0;
        this.positionUpdateInterval = 50; // ms between updates
        
        // Emit 'playerJoined' event to the server with initial player position
        this.socket.emit("playerJoined", {
            x: this.myPlayer.sprite!.x,
            y: this.myPlayer.sprite!.y,
            animation: "_Idle_Idle"
        });
        
        console.log("Player joined event emitted");
        
        // Make sure we constantly emit our position for multiplayer
        this.time.addEvent({
            delay: 50, // Send position updates every 50ms
            callback: this.sendPositionUpdate,
            callbackScope: this,
            loop: true
        });
    }
    
    /**
     * Configure a player sprite with standard physics settings
     */
    private configurePlayerSprite(sprite: Phaser.Physics.Arcade.Sprite): void {
        sprite.setInteractive(new Phaser.Geom.Rectangle(0, 0, 120, 80), Phaser.Geom.Rectangle.Contains);
        sprite.scaleX = 3;
        sprite.scaleY = 3;
        sprite.setOrigin(0, 0);
        sprite.body.gravity.y = 10000;
        sprite.body.setOffset(45, 40);
        sprite.body.setSize(30, 40, false);
        
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
     */
    private initializeManagers(): void {
        // Setup ground tiles array
        const groundTiles = [this.tilesprite, this.tilesprite_1];
        
        // Create the scene manager
        this.sceneManager = new SceneManager(
            this,
            this.bgIMAGE,
            groundTiles,
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
                skillContainer: this.skillContainerCTR,
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
            this.player1STA
        );
        
        // Update myPlayer reference to the managed sprite
        this.myPlayer.sprite = this.playerManager.getPlayer();
        
        // Initialize multiplayer manager
        this.multiplayerManager = new MultiplayerManager(
            this,
            this.socket,
            this.myPlayer.sprite,
            { positionUpdateInterval: 50 }
        );
        
        // Connect the multiplayer manager with scene manager
        this.multiplayerManager.setSceneManager(this.sceneManager);
        
        // Set cameras to follow player
        this.sceneManager.setupCameraFollow(this.myPlayer.sprite);
        
        // Configure camera ignore lists
        const uiElements = this.uiManager.getUIElements();
        this.sceneManager.setMainIgnoreUI(uiElements);
        
        // Create array of gameplay elements to be ignored by UI camera
        const gameplayElements = [
            this.bgIMAGE,
            this.myPlayer.sprite,
            this.otherPlayer.sprite,
            ...groundTiles,
            this.player1HP,
            this.player1STA
        ];
        this.sceneManager.setUIIgnoreGameplay(gameplayElements);
        
        // Add colliders between both players and ground
        this.playerManager.addColliders(groundTiles);
        groundTiles.forEach(tile => {
            this.physics.add.collider(this.otherPlayer.sprite!, tile);
        });
        
        // Start the match timer
        this.uiManager.startMatchTimer();
        
        // Listen for match end event from the UI manager
        this.events.on('matchEnded', this.handleMatchEnd, this);
    }

    /**
     * Set up socket event handlers for multiplayer
     */
    private setupSocketHandlers(): void {
        console.log("Setting up socket handlers");
        
        // Explicitly unsubscribe from events to prevent duplicate handlers
        this.socket.off("arenaStateChanged");
        this.socket.off("playerAttack");
        
        // Track the last received animation to prevent flickering
        let lastReceivedAnimation = '_Idle_Idle';
        
        // Listen for arena state updates (for 1v1 matches)
        this.socket.on("arenaStateChanged", (data) => {
            // Only process if opponent sprite exists
            if (!this.otherPlayer.sprite) {
                console.error("Opponent sprite not initialized");
                return;
            }
            
            // Get opponent data based on our player ID
            const isPlayer1 = data.player1?.id === this.socket.id;
            const opponentData = isPlayer1 ? data.player2 : data.player1;
            
            if (!opponentData) {
                console.error("Opponent data missing in arena state");
                return;
            }
            
            // Store current and previous positions
            const prevX = this.otherPlayer.sprite.x;
            const prevY = this.otherPlayer.sprite.y;
            
            // Directly update position without tweens to avoid conflicts
            this.otherPlayer.sprite.x = opponentData.x;
            this.otherPlayer.sprite.y = opponentData.y;
            
            // Calculate movement deltas
            const deltaX = opponentData.x - prevX;
            const deltaY = opponentData.y - prevY;
            
            // Don't change animation if attacking
            if (this.otherPlayer.sprite.getData('isAttacking')) {
                console.log("Skipping animation update - player is attacking");
                return;
            }
            
            // Update flip direction based on movement or provided flipX
            if (opponentData.flipX !== undefined) {
                this.otherPlayer.sprite.setFlipX(opponentData.flipX);
            } else if (Math.abs(deltaX) > 2) {
                this.otherPlayer.sprite.setFlipX(deltaX < 0);
            }
            
            // Use provided animation if available
            let newAnimation = '_Idle_Idle';
            
            // If the server provides an explicit animation, use it
            if (opponentData.animation) {
                newAnimation = opponentData.animation;
            } 
            // Otherwise, determine animation based on movement
            else {
                if (Math.abs(deltaX) > 3) {
                    newAnimation = '_Run';
                } else if (deltaY < -3) {
                    newAnimation = '_Jump';
                } else if (deltaY > 3) {
                    newAnimation = '_Fall';
                } else if (opponentData.animState?.crouching) {
                    newAnimation = opponentData.animState.isMoving ? '_CrouchWalk' : '_CrouchFull';
                }
            }
            
            // Prevent animation flickering by requiring either:
            // 1. A significant amount of time between animation changes (~300ms)
            // 2. A definitive animation change that's not just a transition to idle
            const shouldUpdateAnimation = 
                (newAnimation !== lastReceivedAnimation) &&
                (newAnimation !== '_Idle_Idle' || !this.otherPlayer.sprite.anims.isPlaying);
                
            if (shouldUpdateAnimation) {
                // Store the new animation as the last received
                lastReceivedAnimation = newAnimation;
                
                console.log(`Playing animation for other player: ${newAnimation}`);
                try {
                    // Use stop() before play() to reset animation and prevent issues
                    this.otherPlayer.sprite.anims.stop();
                    
                    // Force the animation to play from the start
                    this.otherPlayer.sprite.anims.play(newAnimation, true);
                    
                    // Don't let animation complete handlers interrupt
                    if (newAnimation !== '_Idle_Idle' && !newAnimation.includes('_Attack')) {
                        // Remove any existing complete listeners to prevent interruptions
                        this.otherPlayer.sprite.off('animationcomplete');
                    }
                } catch (error) {
                    console.error(`Failed to play animation ${newAnimation}:`, error);
                }
            }
        });
        
        // Handle attack events
        this.socket.on("playerAttack", (data) => {
            console.log("Attack event received:", data);
            
            // Skip our own attacks
            if (data.id === this.socket.id || !this.otherPlayer.sprite) {
                return;
            }
            
            // Get attack type
            const attackType = data.attackType || 'left';
            const animKey = attackType === 'left' ? '_Attack' : '_Attack2';
            
            console.log(`Playing attack animation: ${animKey}`);
            
            // Set up attack state
            this.otherPlayer.sprite.setData('isAttacking', true);
            
            // Stop any current animation properly
            this.otherPlayer.sprite.anims.stop();
            
            try {
                // Play attack animation
                this.otherPlayer.sprite.anims.play({
                    key: animKey,
                    frameRate: attackType === 'left' ? 10 : 8,
                    repeat: 0
                });
                
                // Remove any existing animation complete listeners first
                this.otherPlayer.sprite.off('animationcomplete');
                
                // Add animation complete handler
                this.otherPlayer.sprite.once('animationcomplete', () => {
                    console.log("Attack animation complete, going to idle");
                    if (this.otherPlayer.sprite) {
                        this.otherPlayer.sprite.setData('isAttacking', false);
                        this.otherPlayer.sprite.anims.play('_Idle_Idle', true);
                    }
                });
                
                // Safety timer: if animation complete doesn't fire, reset after a delay
                this.time.delayedCall(1200, () => {
                    if (this.otherPlayer.sprite && this.otherPlayer.sprite.getData('isAttacking')) {
                        console.log("Safety timer: resetting attack state");
                        this.otherPlayer.sprite.setData('isAttacking', false);
                        // Only reset if still in attack animation
                        if (this.otherPlayer.sprite.anims.currentAnim?.key.includes('_Attack')) {
                            this.otherPlayer.sprite.anims.play('_Idle_Idle', true);
                        }
                    }
                });
            } catch (error) {
                console.error("Error playing attack animation:", error);
            }
        });
    }
    
    /**
     * Create initial player sprites (will be managed by controllers)
     * This ensures compatibility with existing code
     */
    private createPlayerSprites(): void {
        console.log("Creating player sprites");
        
        // Create the player sprites
        this.myPlayer.sprite = this.physics.add.sprite(608, 752, "_Idle", 0);
        this.configurePlayerSprite(this.myPlayer.sprite);
        
        // Create opponent sprite at different position
        this.otherPlayer.sprite = this.physics.add.sprite(900, 752, "_Idle", 0);
        this.configurePlayerSprite(this.otherPlayer.sprite);
        this.otherPlayer.sprite.setTint(0xAAAAAA); // Light gray tint
        
        console.log("Player sprites created");
        
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
        const animKeys = Object.keys(this.anims.anims.entries);
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
        const isJumping = !this.myPlayer.sprite.body.touching.down;
        const isMoving = Math.abs(this.myPlayer.sprite.body.velocity.x) > 0.5;
        const animState = {
            idle: !isMoving && !isJumping,
            running: isMoving && !isJumping,
            jumping: isJumping && this.myPlayer.sprite.body.velocity.y < 0,
            falling: isJumping && this.myPlayer.sprite.body.velocity.y > 0,
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
            velocityX: this.myPlayer.sprite.body.velocity.x,
            velocityY: this.myPlayer.sprite.body.velocity.y,
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
                const speed = Math.abs(this.myPlayer.sprite.body.velocity.x);
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
    }

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here

