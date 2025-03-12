import { StaminaManager } from "../utils/staminaManager";
import { handlePlayerMovement } from "../utils/playerMovement";
import { Socket } from "socket.io-client";
import { AnimationManager } from "./AnimationManager";
import { createPlayerSprite } from '../utils/spriteUtils';

/**
 * PlayerManager - Manages player-specific functionality, including:
 * - Player creation and initialization
 * - Movement control
 * - Animation management
 * - Combat and abilities
 * - Stats tracking (health, stamina)
 */
export class PlayerManager {
    // Scene reference
    private scene: Phaser.Scene;
    
    // Player sprite
    private player: Phaser.Physics.Arcade.Sprite;
    
    // Player stats display
    private hpText: Phaser.GameObjects.Text;
    private staminaText: Phaser.GameObjects.Text;
    
    // Input controls
    private cursors: any;
    
    // Socket connection for multiplayer
    private socket: Socket;
    
    // Stamina management
    private staminaManager: StaminaManager;
    
    // Animation management
    private animationManager?: AnimationManager;
    
    // Movement config
    private walkSpeed: number = 200;
    private runSpeed: number = 400;
    private jumpSpeed: number = -2000;
    private crouchSpeed: number = 150;
    
    // For tracking position updates
    private lastSentPosition = { x: 0, y: 0 };
    private positionUpdateInterval = 50; // ms between position updates
    private lastPositionUpdate = 0;
    
    // UI elements for skills
    private skillIcons: {
        skillE?: Phaser.GameObjects.Image;
        skillQ?: Phaser.GameObjects.Image;
        skillR?: Phaser.GameObjects.Image;
    };

    /**
     * Creates a player manager
     * 
     * @param scene - The scene this player belongs to
     * @param socket - Socket connection for multiplayer updates
     * @param config - Optional configuration settings
     */
    constructor(
        scene: Phaser.Scene, 
        socket: Socket,
        config: {
            walkSpeed?: number;
            runSpeed?: number;
            jumpSpeed?: number;
            crouchSpeed?: number;
            skillE?: Phaser.GameObjects.Image;
            skillQ?: Phaser.GameObjects.Image;
            skillR?: Phaser.GameObjects.Image;
        } = {}
    ) {
        this.scene = scene;
        this.socket = socket;
        
        // Apply configuration
        this.walkSpeed = config.walkSpeed || this.walkSpeed;
        this.runSpeed = config.runSpeed || this.runSpeed;
        this.jumpSpeed = config.jumpSpeed || this.jumpSpeed;
        this.crouchSpeed = config.crouchSpeed || this.crouchSpeed;
        
        // Store skill icons
        this.skillIcons = {
            skillE: config.skillE,
            skillQ: config.skillQ,
            skillR: config.skillR
        };
    }
    
    /**
     * Initialize the player
     * 
     * @param x - Initial X position
     * @param y - Initial Y position
     * @param hpText - Text for displaying health
     * @param staminaText - Text for displaying stamina
     */
    initialize(x: number, y: number, hpText: Phaser.GameObjects.Text, staminaText: Phaser.GameObjects.Text): void {
        // Create player sprite
        this.player = createPlayerSprite(this.scene, x, y);
        
        // Store text elements
        this.hpText = hpText;
        this.staminaText = staminaText;
        
        // Initialize stamina manager
        this.staminaManager = new StaminaManager(this.scene, staminaText, {
            maxStamina: 100,
            regenRate: 0.5,
            regenDelay: 1000,
            updateFrequency: 100
        });
        
        // Initialize animation manager
        this.animationManager = new AnimationManager(
            this.scene,
            this.player,
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
            {
                socket: this.socket,
                entityId: this.socket.id,
                debug: false
            }
        );
        
        // Set up input controls
        this.setupControls();
        
        // Set up attack input handlers
        this.setupAttackHandlers();
        
        // Set initial position for network updates
        this.lastSentPosition = { x: this.player.x, y: this.player.y };
    }
    
    /**
     * Set up keyboard controls for player movement
     */
    private setupControls(): void {
        this.cursors = this.scene.input.keyboard?.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.SPACE,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D,
            shift: Phaser.Input.Keyboard.KeyCodes.SHIFT,
            ctrl: Phaser.Input.Keyboard.KeyCodes.CTRL,
            // Add skill keys
            skillE: Phaser.Input.Keyboard.KeyCodes.E,
            skillQ: Phaser.Input.Keyboard.KeyCodes.Q,
            skillR: Phaser.Input.Keyboard.KeyCodes.R
        });
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
     * Add colliders between the player and tilesprites
     * 
     * @param tileSprites - Array of tilesprites to collide with
     */
    addColliders(tileSprites: Phaser.GameObjects.TileSprite[]): void {
        tileSprites.forEach(tile => {
            this.scene.physics.add.collider(this.player, tile);
        });
    }
    
    /**
     * Update player's state each frame
     * 
     * @param time - Current time
     * @param delta - Time since last frame
     */
    update(time: number, delta: number): void {
        // Skip movement handling if player is attacking
        if (this.animationManager?.isAttacking()) {
            // Only handle positioning HP text while attacking
            this.positionHPTextAbovePlayer();
            return;
        }
        
        // Fix the movement type
        const movement = handlePlayerMovement(
            this.player,
            this.cursors,
            {
                walkSpeed: this.walkSpeed,
                runSpeed: this.runSpeed,
                jumpSpeed: this.jumpSpeed,
                crouchSpeed: this.crouchSpeed
            },
            {
                idle: '_Idle_Idle',
                walk: '_Run',
                jump: '_Jump',
                fall: "_Fall",
                run: '_Run',
                crouch: "_CrouchFull",
                crouchWalk: "_CrouchWalk",
            },
            this.staminaManager,
            this.skillIcons
        );
        
        // Fix the movement properties
        const isRunning = (movement as any)?.isRunning || false;
        const isCrouching = (movement as any)?.isCrouching || false;

        // Update animation based on movement result
        if (this.animationManager) {
            this.animationManager.update(
                this.player.body?.velocity.x || 0,
                this.player.body?.velocity.y || 0,
                this.player.body?.touching.down || false,
                isRunning,
                isCrouching,
                time
            );
        }
        
        // Update HP text position to follow the player
        this.positionHPTextAbovePlayer();
        
        // Send position updates to server
        this.updateServerPosition(time);
    }
    
    /**
     * Send position updates to server at regular intervals
     * 
     * @param time - Current game time
     */
    private updateServerPosition(time: number): void {
        // Calculate if position has changed significantly
        const positionChanged = 
            Math.abs(this.player.x - this.lastSentPosition.x) > 0.5 || 
            Math.abs(this.player.y - this.lastSentPosition.y) > 0.5;
            
        // Get current animation information
        const currentAnim = this.player.anims.currentAnim?.key || '_Idle_Idle';
        
        // Only send updates at the configured interval or when animation changes
        const animChanged = this.player.getData('lastSentAnim') !== currentAnim;
        
        if ((positionChanged || animChanged) && 
            (time - this.lastPositionUpdate > this.positionUpdateInterval)) {
            // Update timestamps and cached values
            this.lastPositionUpdate = time;
            this.lastSentPosition.x = this.player.x;
            this.lastSentPosition.y = this.player.y;
            this.player.setData('lastSentAnim', currentAnim);
            
            // Detect player state
            const onGround = this.player.body?.touching.down;
            const isCrouching = currentAnim.includes('Crouch');
            const isAttacking = this.player.getData('isAttacking') === true;
            
            // Send detailed state to server
            this.socket.emit("playerMoved", {
                x: this.player.x,
                y: this.player.y,
                animation: currentAnim,
                flipX: this.player.flipX,
                velocityX: this.player.body?.velocity.x,
                velocityY: this.player.body?.velocity.y,
                // Include explicit state info to help with animation
                animState: {
                    onGround: onGround,
                    isCrouching: isCrouching,
                    isAttacking: isAttacking
                }
            });
        }
    }
    
    /**
     * Handle player attack actions
     * 
     * @param attackType - Type of attack ('left' for normal, 'right' for heavy)
     */
    handleAttack(attackType: 'left' | 'right'): void {
        // Use animation manager to handle attack
        if (this.animationManager) {
            this.animationManager.playAttack(attackType === 'right');
        }
    }
    
    /**
     * Position HP and Stamina text above player's head
     */
    private positionHPTextAbovePlayer(): void {
        // Calculate position above player (adjust the Y offset as needed)
        const hpYOffset = -40; // Distance above player's head
        const staYOffset = -15; // Distance below HP text

        // Center the texts horizontally on the player
        this.hpText.setPosition(
            this.player.x - this.hpText.width / 2, 
            this.player.y + hpYOffset
        );

        this.staminaText.setPosition(
            this.player.x - this.staminaText.width / 2, 
            this.player.y + staYOffset
        );
    }
    
    /**
     * Get the player sprite
     */
    getPlayer(): Phaser.Physics.Arcade.Sprite {
        return this.player;
    }
    
    /**
     * Get player's horizontal velocity magnitude (for camera effects)
     */
    getSpeed(): number {
        return Math.abs(this.player.body?.velocity.x ? this.player.body.velocity.x : 0);
    }
    
    /**
     * Get run speed threshold for camera effects
     */
    getRunSpeedThreshold(): number {
        return this.runSpeed * 0.8;
    }
    
    /**
     * Clean up resources when this manager is no longer needed
     */
    destroy(): void {
        // Clean up animation manager
        if (this.animationManager) {
            this.animationManager.destroy();
        }
        
        // Clean up stamina manager if it exists
        if (this.staminaManager) {
            this.staminaManager.destroy();
        }
        
        // Remove event listeners
        this.scene.game.canvas.removeEventListener('contextmenu', (e) => {
            e.preventDefault();
        });
    }
}
