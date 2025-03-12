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
        // Initialize the scene content
        this.editorCreate();
        
        // Connect to the server
        this.socket.connect();
        
        // Create initial player sprites (will be managed by controllers)
        // This ensures compatibility with existing code
        this.myPlayer.sprite = this.physics.add.sprite(608, 752, "_Idle", 0);
        this.configurePlayerSprite(this.myPlayer.sprite);
        
        this.otherPlayer.sprite = this.physics.add.sprite(900, 752, "_Idle", 0); 
        this.configurePlayerSprite(this.otherPlayer.sprite);
        this.otherPlayer.sprite.setTint(0xAAAAAA); // Light gray tint for opponent
        
        // Initialize the managers
        this.initializeManagers();
        
        // Set up socket event handlers
        this.setupSocketHandlers();
        
        // Emit 'playerJoined' event to the server with initial player position
        this.socket.emit("playerJoined", {
            x: this.myPlayer.sprite.x,
            y: this.myPlayer.sprite.y,
            animation: "_Idle_Idle"
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
        sprite.play('_Idle_Idle');
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
        // Listen for arena state updates (for 1v1 matches)
        this.socket.on("arenaStateChanged", (data) => {
            console.log("Arena state changed:", data);
            
            // Determine if we're player 1 or player 2
            const isPlayer1 = data.player1?.id === this.socket.id;
            
            // Update the other player's position based on arena state
            if (isPlayer1 && data.player2) {
                // We are player 1, so update the position of the other player (player 2)
                this.updateOtherPlayerPosition(data.player2.x, data.player2.y);
            } else if (!isPlayer1 && data.player1) {
                // We are player 2, so update the position of the other player (player 1)
                this.updateOtherPlayerPosition(data.player1.x, data.player1.y);
            }
        });
    }
    
    /**
     * Update the other player's position (for 1v1 matches)
     */
    private updateOtherPlayerPosition(x: number, y: number): void {
        if (!this.otherPlayer.sprite) return;
        
        // Record current position
        const prevX = this.otherPlayer.sprite.x;
        
        // Smoothly move the player to the new position
        this.tweens.add({
            targets: this.otherPlayer.sprite,
            x: x,
            y: y,
            duration: 80,
            ease: 'Linear'
        });
        
        // Update flip direction based on movement
        if (x < prevX) {
            this.otherPlayer.sprite.setFlipX(true);
        } else if (x > prevX) {
            this.otherPlayer.sprite.setFlipX(false);
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
     * Update method called each frame
     */
    update(time: number, delta: number): void {
        // Update player manager
        if (this.playerManager) {
            this.playerManager.update(time, delta);
            
            // Update camera zoom based on player speed
            if (this.sceneManager) {
                this.sceneManager.updateCameraZoom(
                    this.playerManager.getSpeed(),
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

