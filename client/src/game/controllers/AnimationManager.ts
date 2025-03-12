import { Socket } from "socket.io-client";

/**
 * Interface for animation states
 */
export interface AnimationState {
    isMoving: boolean;
    isJumping: boolean;
    isFalling: boolean;
    isAttacking: boolean;
    isCrouching: boolean;
    isRunning: boolean;
    isIdle: boolean;
    direction: 'left' | 'right';
}

/**
 * Interface for animation configuration
 */
export interface AnimationConfig {
    idle: string;
    walk: string;
    run: string;
    jump: string;
    fall: string;
    crouch: string;
    crouchWalk: string;
    attack: string;
    attack2: string;
    // Additional animations can be added here
}

/**
 * AnimationManager - Manages sprite animations for players and other entities:
 * - Animation state tracking
 * - Animation transitions
 * - Attack animations
 * - Multiplayer synchronization
 */
export class AnimationManager {
    // The sprite this manager controls
    private sprite: Phaser.Physics.Arcade.Sprite;
    
    // Scene reference
    private scene: Phaser.Scene;
    
    // Animation configuration
    private config: AnimationConfig;
    
    // Socket for multiplayer events
    private socket?: Socket;
    
    // Entity ID (for multiplayer)
    private entityId?: string;
    
    // Current animation state
    private currentState: AnimationState = {
        isMoving: false,
        isJumping: false,
        isFalling: false,
        isAttacking: false,
        isCrouching: false,
        isRunning: false,
        isIdle: true,
        direction: 'right'
    };
    
    // For tracking animation changes
    private lastAnimation: string = '';
    private lastAnimationTime: number = 0;
    private animationThrottleTime: number = 150; // ms to prevent flickering
    
    // Debugging
    private debug: boolean = false;
    
    /**
     * Creates an animation manager
     * 
     * @param scene - Scene this manager belongs to
     * @param sprite - Sprite to animate
     * @param config - Animation configuration
     * @param options - Additional options
     */
    constructor(
        scene: Phaser.Scene,
        sprite: Phaser.Physics.Arcade.Sprite,
        config: AnimationConfig,
        options: {
            socket?: Socket;
            entityId?: string;
            debug?: boolean;
        } = {}
    ) {
        this.scene = scene;
        this.sprite = sprite;
        this.config = config;
        this.socket = options.socket;
        this.entityId = options.entityId;
        this.debug = options.debug || false;
        
        // Set initial direction based on sprite's flipX
        this.currentState.direction = this.sprite.flipX ? 'left' : 'right';
        
        // Play initial idle animation
        this.playAnimation(this.config.idle);
        
        if (this.debug) {
            console.log(`[AnimManager] Created for sprite with initial animation: ${this.config.idle}`);
        }
    }
    
    /**
     * Update animation based on physics state
     * 
     * @param velocityX - Horizontal velocity
     * @param velocityY - Vertical velocity
     * @param onGround - Whether entity is on the ground
     * @param isRunning - Whether entity is running (vs walking)
     * @param isCrouching - Whether entity is crouching
     * @param time - Current game time
     */
    update(
        velocityX: number,
        velocityY: number,
        onGround: boolean,
        isRunning: boolean = false,
        isCrouching: boolean = false,
        time: number = 0
    ): void {
        // Skip animation updates if currently attacking
        if (this.currentState.isAttacking) {
            return;
        }
        
        // Update direction based on velocity
        if (velocityX !== 0) {
            this.setDirection(velocityX < 0 ? 'left' : 'right');
        }
        
        // Update state based on physics
        const isMoving = Math.abs(velocityX) > 0.5;
        const isJumping = !onGround && velocityY < 0;
        const isFalling = !onGround && velocityY >= 0;
        
        // Store previous state for comparison
        const prevState = { ...this.currentState };
        
        // Update current state
        this.currentState = {
            isMoving,
            isJumping,
            isFalling,
            isAttacking: false, // We're in update, so not attacking
            isCrouching,
            isRunning: isMoving && isRunning,
            isIdle: !isMoving && !isJumping && !isFalling && !isCrouching,
            direction: prevState.direction
        };
        
        // Determine which animation to play based on state
        let targetAnim = this.config.idle; // Default
        
        if (this.currentState.isJumping) {
            targetAnim = this.config.jump;
        } else if (this.currentState.isFalling) {
            targetAnim = this.config.fall;
        } else if (this.currentState.isCrouching) {
            targetAnim = this.currentState.isMoving ? this.config.crouchWalk : this.config.crouch;
        } else if (this.currentState.isMoving) {
            targetAnim = this.currentState.isRunning ? this.config.run : this.config.walk;
        }
        
        // Check if animation should change
        if (this.shouldChangeAnimation(targetAnim, time)) {
            this.playAnimation(targetAnim);
            this.lastAnimation = targetAnim;
            this.lastAnimationTime = time;
            
            if (this.debug) {
                console.log(`[AnimManager] Changing animation to: ${targetAnim}`);
            }
        }
    }
    
    /**
     * Determine if animation should change based on target and timing
     */
    private shouldChangeAnimation(targetAnim: string, time: number): boolean {
        // If it's the same animation, don't change
        if (targetAnim === this.lastAnimation) {
            return false;
        }
        
        // If it's the idle animation, only change if enough time has passed
        // This prevents flickering between animations
        if (targetAnim === this.config.idle) {
            return (time - this.lastAnimationTime) > this.animationThrottleTime;
        }
        
        // For non-idle animations, change immediately
        return true;
    }
    
    /**
     * Set the direction the sprite is facing
     * 
     * @param direction - 'left' or 'right'
     */
    setDirection(direction: 'left' | 'right'): void {
        if (this.currentState.direction !== direction) {
            this.currentState.direction = direction;
            this.sprite.setFlipX(direction === 'left');
        }
    }
    
    /**
     * Play an attack animation with proper handling
     * 
     * @param heavy - Whether to use heavy attack
     */
    playAttack(heavy: boolean = false): void {
        // Don't allow attacks if already attacking
        if (this.currentState.isAttacking) {
            if (this.debug) {
                console.log("[AnimManager] Attack canceled - already attacking");
            }
            return;
        }
        
        // Set state to attacking
        this.currentState.isAttacking = true;
        
        // Determine which attack animation to use
        const attackAnim = heavy ? this.config.attack2 : this.config.attack;
        
        if (this.debug) {
            console.log(`[AnimManager] Playing attack animation: ${attackAnim}`);
        }
        
        // Play the attack animation
        this.sprite.play({
            key: attackAnim,
            frameRate: heavy ? 8 : 10, // Slower for heavy attack
            repeat: 0
        });
        
        // Stop horizontal velocity for heavy attacks
        if (heavy && this.sprite.body) {
            this.sprite.setVelocityX(0);
            this.sprite.setVelocityY(0);
        }
        
        // If connected to multiplayer, emit attack event
        if (this.socket && this.entityId) {
            this.socket.emit("playerAttack", {
                id: this.entityId,
                x: this.sprite.x,
                y: this.sprite.y,
                attackType: heavy ? 'right' : 'left',
                direction: this.currentState.direction
            });
            
            // Also emit movement update with attack animation
            this.socket.emit("playerMoved", {
                id: this.entityId,
                x: this.sprite.x,
                y: this.sprite.y,
                animation: attackAnim,
                flipX: this.sprite.flipX,
                isAttacking: true
            });
        }
        
        // Clean up after animation completes
        this.sprite.off('animationcomplete'); // Remove any existing handlers
        this.sprite.once('animationcomplete', () => {
            if (this.debug) {
                console.log("[AnimManager] Attack animation complete");
            }
            
            this.currentState.isAttacking = false;
            this.playAnimation(this.config.idle);
            
            // Notify multiplayer that attack is done
            if (this.socket && this.entityId) {
                this.socket.emit("playerMoved", {
                    id: this.entityId,
                    x: this.sprite.x,
                    y: this.sprite.y,
                    animation: this.config.idle,
                    flipX: this.sprite.flipX,
                    isAttacking: false
                });
            }
        });
        
        // Safety timer - force end attack state if animation complete doesn't fire
        this.scene.time.delayedCall(1000, () => {
            if (this.currentState.isAttacking) {
                if (this.debug) {
                    console.log("[AnimManager] Safety timer triggered to end attack");
                }
                this.currentState.isAttacking = false;
                this.playAnimation(this.config.idle);
            }
        });
    }
    
    /**
     * Force a specific animation to play (bypasses state logic)
     * 
     * @param key - Animation key to play
     */
    forceAnimation(key: string): void {
        if (!key) return;
        
        this.playAnimation(key);
        this.lastAnimation = key;
    }
    
    /**
     * Safely play an animation with error handling
     * 
     * @param key - Animation key to play
     */
    private playAnimation(key: string): void {
        if (!this.sprite || !key) return;
        
        try {
            // Only change if not already playing this animation
            if (this.sprite.anims.currentAnim?.key !== key) {
                this.sprite.anims.play(key, true);
            }
        } catch (error) {
            console.error(`[AnimManager] Error playing animation ${key}:`, error);
        }
    }
    
    /**
     * Get the current animation key
     */
    getCurrentAnimation(): string {
        return this.sprite.anims.currentAnim?.key || '';
    }
    
    /**
     * Get the current animation state
     */
    getState(): AnimationState {
        return { ...this.currentState };
    }
    
    /**
     * Check if sprite is currently attacking
     */
    isAttacking(): boolean {
        return this.currentState.isAttacking;
    }
    
    /**
     * Set debug mode
     */
    setDebug(debug: boolean): void {
        this.debug = debug;
    }
    
    /**
     * Clean up resources when no longer needed
     */
    destroy(): void {
        // Remove animation callbacks
        this.sprite.off('animationcomplete');
    }
}
