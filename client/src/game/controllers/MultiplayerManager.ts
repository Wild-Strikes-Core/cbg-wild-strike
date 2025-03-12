import { Socket } from "socket.io-client";
import { SceneManager } from "./SceneManager";

/**
 * MultiplayerManager - Handles all network-related functionality including:
 * - Socket event handling
 * - Remote player creation and updates
 * - Game state synchronization
 */
export class MultiplayerManager {
    // Scene reference
    private scene: Phaser.Scene;
    
    // Socket connection
    private socket: Socket;
    
    // Local player reference
    private localPlayer: Phaser.Physics.Arcade.Sprite;
    
    // Scene manager reference
    private sceneManager?: SceneManager;
    
    // Other players registry
    private otherPlayers: { [id: string]: Phaser.Physics.Arcade.Sprite } = {};
    
    // Position update interval settings
    private positionUpdateInterval: number = 50; // ms
    private lastPositionUpdate: number = 0;
    private lastSentPosition = { x: 0, y: 0 };
    
    // Platform reference
    private platform?: Phaser.Physics.Arcade.Image | Phaser.Physics.Arcade.StaticImage;
    
    /**
     * Create a multiplayer manager
     * 
     * @param scene - Scene this manager belongs to
     * @param socket - Socket.io connection
     * @param localPlayer - Reference to the local player sprite
     * @param config - Optional configuration
     */
    constructor(
        scene: Phaser.Scene,
        socket: Socket,
        localPlayer: Phaser.Physics.Arcade.Sprite,
        config: {
            positionUpdateInterval?: number;
            platform?: Phaser.Physics.Arcade.Image | Phaser.Physics.Arcade.StaticImage;
        } = {}
    ) {
        this.scene = scene;
        this.socket = socket;
        this.localPlayer = localPlayer;
        
        // Apply configuration
        this.positionUpdateInterval = config.positionUpdateInterval || this.positionUpdateInterval;
        this.platform = config.platform;
        
        // Initialize last sent position
        this.lastSentPosition = {
            x: this.localPlayer.x,
            y: this.localPlayer.y
        };
        
        // Set up socket event handlers
        this.setupSocketHandlers();
        
        // Register player with server
        this.socket.emit("playerJoined", {
            x: localPlayer.x,
            y: localPlayer.y,
            animation: "_Idle_Idle" // Make sure to use the correct animation key
        });
    }
    
    /**
     * Set the scene manager reference for camera integration
     */
    setSceneManager(sceneManager: SceneManager): void {
        this.sceneManager = sceneManager;
    }
    
    /**
     * Set platform reference for collision detection
     */
    setPlatform(platform: Phaser.Physics.Arcade.Image | Phaser.Physics.Arcade.StaticImage): void {
        this.platform = platform;
        
        // Add colliders for any existing players
        if (this.platform) {
            Object.values(this.otherPlayers).forEach(player => {
                this.addPlatformCollider(player);
            });
        }
    }
    
    /**
     * Set up socket event handlers
     */
    private setupSocketHandlers(): void {
        // Remove any previous listeners to prevent duplicates
        this.socket.off("currentPlayers");
        this.socket.off("newPlayer");
        this.socket.off("playerDisconnected");
        this.socket.off("playerMoved");
        this.socket.off("playerAttack");
        
        // Handle current players already in the game
        this.socket.on("currentPlayers", (players) => {
            console.log("Current players:", players);
            
            // Create sprites for existing players, excluding this client
            Object.keys(players).forEach(id => {
                if (id !== this.socket.id && !this.otherPlayers[id]) {
                    this.addOtherPlayer(id, players[id]);
                }
            });
        });
        
        // Handle new player connections
        this.socket.on("newPlayer", (playerInfo) => {
            console.log("New player joined:", playerInfo.id);
            // Only add if this isn't our player and doesn't already exist
            if (playerInfo.id !== this.socket.id && !this.otherPlayers[playerInfo.id]) {
                this.addOtherPlayer(playerInfo.id, playerInfo);
            }
        });
        
        // Handle player disconnection
        this.socket.on("playerDisconnected", (id) => {
            console.log("Player disconnected:", id);
            if (this.otherPlayers[id]) {
                const nameTag = this.otherPlayers[id].getData("nameTag");
                if (nameTag) nameTag.destroy();
                this.otherPlayers[id].destroy();
                delete this.otherPlayers[id];
            }
        });
        
        // Handle player movements
        this.socket.on("playerMoved", (playerInfo) => {
            if (playerInfo.id !== this.socket.id && this.otherPlayers[playerInfo.id]) {
                this.updateOtherPlayer(playerInfo.id, playerInfo);
            }
        });

        // Handle attack events
        this.socket.on("playerAttack", (data) => {
            console.log("Attack event received:", data);
            
            // Skip our own attacks
            if (data.id === this.socket.id || !this.otherPlayers[data.id]) {
                return;
            }
            
            const otherPlayer = this.otherPlayers[data.id];
            
            // Get attack type
            const attackType = data.attackType || 'left';
            const animKey = attackType === 'left' ? '_Attack' : '_Attack2';
            
            console.log(`Playing attack animation: ${animKey}`);
            
            // Set up attack state
            otherPlayer.setData('isAttacking', true);
            
            // Stop any current animation properly
            otherPlayer.anims.stop();
            
            try {
                // Play attack animation
                otherPlayer.anims.play({
                    key: animKey,
                    frameRate: attackType === 'left' ? 10 : 8,
                    repeat: 0
                });
                
                // Remove any existing animation complete listeners first
                otherPlayer.off('animationcomplete');
                
                // Add animation complete handler
                otherPlayer.once('animationcomplete', () => {
                    console.log("Attack animation complete, going to idle");
                    if (otherPlayer) {
                        otherPlayer.setData('isAttacking', false);
                        otherPlayer.anims.play('_Idle_Idle', true); // Use the correct idle animation
                    }
                });
                
                // Safety timer: if animation complete doesn't fire, reset after a delay
                this.scene.time.delayedCall(1200, () => {
                    if (otherPlayer && otherPlayer.getData('isAttacking')) {
                        console.log("Safety timer: resetting attack state");
                        otherPlayer.setData('isAttacking', false);
                        // Only reset if still in attack animation
                        if (otherPlayer.anims.currentAnim?.key.includes('_Attack')) {
                            otherPlayer.anims.play('_Idle_Idle', true); // Use the correct idle animation
                        }
                    }
                });
            } catch (error) {
                console.error("Error playing attack animation:", error);
                // Error recovery: try to reset to idle state
                try {
                    otherPlayer.setData('isAttacking', false);
                    otherPlayer.anims.play('_Idle_Idle', true);
                } catch (innerError) {
                    console.error("Failed to recover from animation error:", innerError);
                }
            }
        });
    }
    
    /**
     * Add platform collider to a sprite
     */
    private addPlatformCollider(sprite: Phaser.Physics.Arcade.Sprite): void {
        if (!this.platform || !sprite || !sprite.body) return;
        
        // Remove any existing colliders first to prevent duplicates
        this.scene.physics.world.colliders.getActive()
            .filter(collider => 
                (collider.object1 === sprite && collider.object2 === this.platform) || 
                (collider.object1 === this.platform && collider.object2 === sprite))
            .forEach(collider => collider.destroy());
        
        // Create new collider
        const collider = this.scene.physics.add.collider(sprite, this.platform);
        
        // Store reference to the collider
        sprite.setData('platformCollider', collider);
        
        console.log(`Platform collider added to multiplayer player at (${sprite.x}, ${sprite.y})`);
    }
    
    /**
     * Create a new player sprite for other connected players
     */
    private addOtherPlayer(id: string, playerInfo: any): void {
        console.log(`Creating other player sprite for ID: ${id} with texture key: "_Idle_Idle"`);
        
        // List available textures for debugging
        console.log("Available textures:", Object.keys(this.scene.textures.list));
        
        try {
            // Create a new sprite for the other player using the correct texture key
            const otherPlayer = this.scene.physics.add.sprite(
                playerInfo.x,
                playerInfo.y,
                "_Idle_Idle", // Use the correct texture key - same as the animation key
                0
            );

            // Configure other player sprite
            otherPlayer.setInteractive(new Phaser.Geom.Rectangle(0, 0, 120, 80), Phaser.Geom.Rectangle.Contains);
            otherPlayer.scaleX = 3;
            otherPlayer.scaleY = 3;
            otherPlayer.setOrigin(0, 0);
            otherPlayer.body.gravity.y = 10000;
            otherPlayer.body.setOffset(45, 40);
            otherPlayer.body.setSize(30, 40, false);
            
            // Debug logging for animation keyframes
            console.log("Animation frames for _Idle_Idle:", 
                this.scene.anims.get('_Idle_Idle')?.frames.length || "Animation not found");
            
            // Set player color tint to differentiate from local player
            otherPlayer.setTint(0xAAAAAA); // Light grey tint
            
            // Store the player in our registry
            this.otherPlayers[id] = otherPlayer;
            
            // Create floating name tag above other player
            const nameTag = this.scene.add.text(
                otherPlayer.x,
                otherPlayer.y - 60,
                `Player ${id.substring(0, 4)}`, // Show part of the ID as name
                { fontSize: '16px', color: '#FFFFFF', stroke: '#000000', strokeThickness: 3 }
            );
            nameTag.setOrigin(0.5, 1);
            nameTag.setDepth(100);
            
            // Store the name tag as a property of the player
            otherPlayer.setData('nameTag', nameTag);
            
            // Make UI camera ignore other players' elements if SceneManager is available
            if (this.sceneManager) {
                this.sceneManager.setUIIgnoreGameplay([otherPlayer, nameTag]);
            }
            
            // Add colliders with ground tiles if SceneManager is available
            if (this.sceneManager) {
                const groundTiles = this.sceneManager.getGroundTiles();
                groundTiles.forEach(tile => {
                    this.scene.physics.add.collider(otherPlayer, tile);
                });
            }
            
            // Add collider with platform
            if (this.platform) {
                this.addPlatformCollider(otherPlayer);
            }
            
            // Set initial animation - always use the animation key specified in the atlas
            try {
                // Try to play the animation provided in playerInfo or default to idle
                const animKey = playerInfo.animation || '_Idle_Idle';
                console.log(`Setting initial animation for player ${id}: ${animKey}`);
                otherPlayer.anims.play(animKey, true);
            } catch (error) {
                console.error("Failed to play initial animation:", error);
                // Fallback to directly playing the idle animation
                try {
                    otherPlayer.anims.play('_Idle_Idle', true);
                } catch (fallbackError) {
                    console.error("Fallback animation also failed:", fallbackError);
                }
            }
            
            console.log(`Other player sprite created for ID: ${id}`, 
                "Current animation:", otherPlayer.anims.currentAnim?.key || "none");
        } catch (error) {
            console.error("Error creating other player sprite:", error);
        }
    }
    
    /**
     * Update other player's position and animation
     */
    private updateOtherPlayer(id: string, playerInfo: any): void {
        const otherPlayer = this.otherPlayers[id];
        if (!otherPlayer) {
            console.log(`Player ${id} not found in otherPlayers!`);
            return;
        }
        
        // Smoothly move the player to the new position
        this.scene.tweens.add({
            targets: otherPlayer,
            x: playerInfo.x,
            y: playerInfo.y,
            duration: 80,
            ease: 'Linear'
        });
        
        // Update flip X based on velocity or provided flipX
        if (playerInfo.flipX !== undefined) {
            otherPlayer.setFlipX(playerInfo.flipX);
        } else if (playerInfo.velocityX !== undefined && playerInfo.velocityX !== 0) {
            otherPlayer.setFlipX(playerInfo.velocityX < 0);
        }
        
        // Handle attack state
        const wasAttacking = otherPlayer.getData('isAttacking') === true;
        
        // Update attack state data if provided
        if (playerInfo.isAttacking !== undefined) {
            otherPlayer.setData('isAttacking', playerInfo.isAttacking);
        }
        
        // Handle animation changes
        if (playerInfo.animation) {
            const currentAnim = otherPlayer.anims.currentAnim?.key || '';
            const newAnim = playerInfo.animation;
            
            // Detect animation changes
            const isNewAttack = newAnim.includes('_Attack');
            const isCurrentAttack = currentAnim.includes('_Attack');
            
            // Special case: Always force exit from attack to idle
            if (wasAttacking && playerInfo.isAttacking === false) {
                // If we were attacking but now we're not, immediately go to idle
                try {
                    otherPlayer.play('_Idle_Idle', true);
                    console.log(`Player ${id} forced to idle after attack ended`);
                } catch (error) {
                    console.error(`Error playing idle animation for player ${id}:`, error);
                }
            }
            // Case 1: Starting a new attack - always allow this
            else if (isNewAttack && !isCurrentAttack) {
                try {
                    otherPlayer.play(newAnim, true);
                    
                    // Set up auto-transition to idle when attack animation completes
                    otherPlayer.once('animationcomplete', () => {
                        // Only transition to idle if we're still in the same attack animation
                        if (otherPlayer.anims.currentAnim?.key === newAnim) {
                            otherPlayer.play('_Idle_Idle', true);
                            console.log(`Attack animation completed for player ${id}, auto-transitioning to idle`);
                        }
                    });
                } catch (error) {
                    console.error(`Error playing attack animation ${newAnim} for player ${id}:`, error);
                }
            }
            // Case 2: Regular animation transitions (not attacks)
            else if (!isCurrentAttack && currentAnim !== newAnim) {
                // Only change non-attack animations if we're not in the middle of an attack
                try {
                    otherPlayer.play(newAnim, true);
                } catch (error) {
                    console.error(`Error playing animation ${newAnim} for player ${id}:`, error);
                    // Try to recover by playing idle animation
                    try {
                        otherPlayer.play('_Idle_Idle', true);
                    } catch (fallbackError) {
                        console.error(`Fallback animation also failed for player ${id}:`, fallbackError);
                    }
                }
            }
        }
        
        // Update the name tag position
        const nameTag = otherPlayer.getData('nameTag');
        if (nameTag) {
            nameTag.setPosition(
                playerInfo.x + otherPlayer.displayWidth/2, 
                playerInfo.y - 20
            );
        }
    }
    
    /**
     * Update method called each frame for position sync
     * 
     * @param time - Current game time
     * @param delta - Time since last frame
     */
    update(time: number, delta: number): void {
        // Calculate if position has changed significantly
        const positionChanged = 
            Math.abs(this.localPlayer.x - this.lastSentPosition.x) > 0.5 || 
            Math.abs(this.localPlayer.y - this.lastSentPosition.y) > 0.5;
            
        // Only send updates at the configured interval
        if (positionChanged && (time - this.lastPositionUpdate > this.positionUpdateInterval)) {
            this.lastPositionUpdate = time;
            this.lastSentPosition.x = this.localPlayer.x;
            this.lastSentPosition.y = this.localPlayer.y;
            
            // Send position and animation state to server
            this.socket.emit("playerMovement", {
                x: this.localPlayer.x,
                y: this.localPlayer.y,
                animation: this.localPlayer.anims.currentAnim?.key || '_Idle_Idle', // Use correct idle animation key
                flipX: this.localPlayer.flipX,
                velocityX: this.localPlayer.body?.velocity.x || 0,
                velocityY: this.localPlayer.body?.velocity.y || 0
            });
        }
        
        // Check if any player needs platform colliders (every 2 seconds)
        if (this.platform && time % 2000 < 20) {
            let needsColliderRefresh = false;
            
            Object.values(this.otherPlayers).forEach(player => {
                if (!player.getData('platformCollider')) {
                    needsColliderRefresh = true;
                }
            });
            
            if (needsColliderRefresh) {
                console.log("Refreshing platform colliders for multiplayer players");
                Object.values(this.otherPlayers).forEach(player => {
                    this.addPlatformCollider(player);
                });
            }
        }
    }
    
    /**
     * Add colliders between other players and the provided game objects
     * 
     * @param objects - Game objects to add colliders with
     */
    addCollidersToOtherPlayers(objects: Phaser.Types.Physics.Arcade.ArcadeColliderType[]): void {
        Object.values(this.otherPlayers).forEach(player => {
            objects.forEach(object => {
                this.scene.physics.add.collider(player, object);
            });
        });
    }
    
    /**
     * Get a reference to all other player sprites
     */
    getOtherPlayers(): { [id: string]: Phaser.Physics.Arcade.Sprite } {
        return this.otherPlayers;
    }
    
    /**
     * Clean up resources when this manager is no longer needed
     */
    cleanup(): void {
        // Remove socket listeners
        this.socket.off("currentPlayers");
        this.socket.off("newPlayer");
        this.socket.off("playerDisconnected");
        this.socket.off("playerMoved");
        this.socket.off("playerAttack");
        
        // Clean up all other player sprites
        Object.values(this.otherPlayers).forEach(player => {
            const nameTag = player.getData("nameTag");
            if (nameTag) nameTag.destroy();
            player.destroy();
        });
        
        this.otherPlayers = {};
    }
}