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
        } = {}
    ) {
        this.scene = scene;
        this.socket = socket;
        this.localPlayer = localPlayer;
        
        // Apply configuration
        this.positionUpdateInterval = config.positionUpdateInterval || this.positionUpdateInterval;
        
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
            animation: "_Idle_Idle"
        });

        // Set up attack input handlers
        this.setupAttackHandlers();
    }
    
    /**
     * Set the scene manager reference for camera integration
     */
    setSceneManager(sceneManager: SceneManager): void {
        this.sceneManager = sceneManager;
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
    }
    
    /**
     * Create a new player sprite for other connected players
     */
    private addOtherPlayer(id: string, playerInfo: any): void {
        // Create a new sprite for the other player
        const otherPlayer = this.scene.physics.add.sprite(
            playerInfo.x,
            playerInfo.y,
            "_Idle",
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
        
        // Set initial animation if provided
        if (playerInfo.animation) {
            otherPlayer.play(playerInfo.animation);
        } else {
            otherPlayer.play('_Idle_Idle');
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
                otherPlayer.play('_Idle_Idle');
                console.log(`Player ${id} forced to idle after attack ended`);
            }
            // Case 1: Starting a new attack - always allow this
            else if (isNewAttack && !isCurrentAttack) {
                otherPlayer.play(newAnim);
                
                // Set up auto-transition to idle when attack animation completes
                otherPlayer.once('animationcomplete', () => {
                    // Only transition to idle if we're still in the same attack animation
                    if (otherPlayer.anims.currentAnim?.key === newAnim) {
                        otherPlayer.play('_Idle_Idle');
                        console.log(`Attack animation completed for player ${id}, auto-transitioning to idle`);
                    }
                });
            }
            // Case 2: Regular animation transitions (not attacks)
            else if (!isCurrentAttack && currentAnim !== newAnim) {
                // Only change non-attack animations if we're not in the middle of an attack
                otherPlayer.play(newAnim);
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
                animation: this.localPlayer.anims.currentAnim?.key || '_Idle_Idle',
                flipX: this.localPlayer.flipX,
                velocityX: this.localPlayer.body.velocity.x,
                velocityY: this.localPlayer.body.velocity.y
            });
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
        
        // Clean up all other player sprites
        Object.values(this.otherPlayers).forEach(player => {
            const nameTag = player.getData("nameTag");
            if (nameTag) nameTag.destroy();
            player.destroy();
        });
        
        this.otherPlayers = {};
    }

    /**
     * Set up mouse input handlers for attacks
     */
    private setupAttackHandlers(): void {
        this.scene.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
            if (pointer.leftButtonDown()) {
                this.handleAttack('left');
            } else if (pointer.rightButtonDown()) {
                this.handleAttack('right');
            }
        });
        
        // Prevent context menu on right click
        this.scene.game.canvas.addEventListener('contextmenu', (e) => {
            e.preventDefault();
        });
    }

    /**
     * Handle player attack actions
     * 
     * @param attackType - Type of attack ('left' for normal, 'right' for heavy)
     */
    private handleAttack(attackType: 'left' | 'right'): void {
        // Don't allow attacks if already attacking
        if (this.localPlayer.anims.currentAnim?.key.includes('_Attack') || this.localPlayer.getData('isAttacking')) {
            console.log("Attack canceled - already attacking");
            return;
        }
        
        // Play appropriate animation based on attack type
        const animationKey = attackType === 'left' ? '_Attack' : '_Attack2';
        
        this.localPlayer.setData('isAttacking', true);
        
        if (attackType === 'right') {
            this.localPlayer.setVelocityY(0);
        }

        this.localPlayer.play({
            key: animationKey,
            frameRate: attackType === 'left' ? 10 : 8, // Slower for heavy attack
            repeat: 0
        });
        
        if (attackType === 'right') {
            this.localPlayer.setVelocityX(0);
        }
        
        // Send attack to server for multiplayer - MOVEMENT DATA
        this.socket.emit("playerMovement", {
            x: this.localPlayer.x,
            y: this.localPlayer.y,
            animation: animationKey,
            flipX: this.localPlayer.flipX,
            isAttacking: true
        });
        
        // Also emit a dedicated attack event with more details
        this.socket.emit("playerAttack", {
            x: this.localPlayer.x,
            y: this.localPlayer.y,
            attackType: attackType, 
            direction: this.localPlayer.flipX ? 'left' : 'right'
        });
        
        // Return to idle state when animation is fully complete
        this.localPlayer.once('animationcomplete', () => {
            console.log("Attack animation complete, returning to idle");
            this.localPlayer.setData('isAttacking', false);
            // Use the correct idle animation
            this.localPlayer.play('_Idle_Idle');
            
            // IMPORTANT: Tell other players that we're done attacking
            this.socket.emit("playerMovement", {
                x: this.localPlayer.x,
                y: this.localPlayer.y,
                animation: "_Idle_Idle",
                flipX: this.localPlayer.flipX,
                isAttacking: false
            });
        });
    }
}