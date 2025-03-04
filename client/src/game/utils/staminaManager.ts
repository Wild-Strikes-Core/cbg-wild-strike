/**
 * StaminaManager - A utility class for managing player stamina in combat gameplay
 * 
 * This class handles all stamina-related mechanics including:
 * - Tracking current stamina levels
 * - Stamina consumption for actions
 * - Automatic regeneration over time
 * - Visual display updates
 * - Validation for stamina-consuming actions
 */

/**
 * Configuration settings for stamina behavior
 */
export interface StaminaConfig {
    maxStamina: number;     // Maximum stamina capacity
    regenRate: number;      // Amount of stamina to regenerate per tick (e.g. 0.5, 1.0)
    regenDelay: number;     // Time in ms before stamina starts regenerating after use (cooldown period)
    updateFrequency: number; // How often (in ms) the regeneration tick occurs (lower = smoother but more processing)
}

export class StaminaManager {
    // Current available stamina points
    private currentStamina: number;
    
    // Maximum possible stamina (cap)
    private readonly maxStamina: number;
    
    // How much stamina regenerates per tick
    private regenRate: number;
    
    // Delay before regeneration starts after using stamina (in ms)
    private regenDelay: number;
    
    // Timestamp of last stamina use (for calculating regen delay)
    private lastUseTime: number = 0;
    
    // Timer that handles the regeneration ticks
    private regenTimer: Phaser.Time.TimerEvent | null = null;
    
    // Reference to the game scene for accessing time and other systems
    private scene: Phaser.Scene;
    
    // Text display component that shows stamina value to the player
    private staminaText: Phaser.GameObjects.Text;

    /**
     * Creates a new stamina management system
     * 
     * @param scene - The Phaser scene this stamina belongs to (for timer access)
     * @param staminaText - Text object to display current stamina value
     * @param config - Configuration settings for stamina behavior
     * 
     * Example usage:
     * ```
     * const staminaText = this.add.text(10, 10, "", { color: "#ffffff" });
     * const stamina = new StaminaManager(this, staminaText, {
     *    maxStamina: 100,
     *    regenRate: 0.5,
     *    regenDelay: 1000,
     *    updateFrequency: 100
     * });
     * ```
     */
    constructor(scene: Phaser.Scene, staminaText: Phaser.GameObjects.Text, config: StaminaConfig) {
        this.scene = scene;
        this.staminaText = staminaText;
        this.maxStamina = config.maxStamina;
        this.currentStamina = config.maxStamina; // Start with full stamina
        this.regenRate = config.regenRate;
        this.regenDelay = config.regenDelay;
        
        // Set up automatic regeneration on a timer
        this.regenTimer = this.scene.time.addEvent({
            delay: config.updateFrequency,
            callback: this.regenerateStamina,
            callbackScope: this,
            loop: true
        });
        
        // Initialize the stamina display
        this.updateStaminaDisplay();
    }

    /**
     * Consume stamina for an action
     * 
     * @param amount - Amount of stamina to consume
     * @returns true if action was performed (enough stamina), false if not enough stamina
     * 
     * Example:
     * ```
     * // Player wants to perform a dash that costs 20 stamina
     * if (staminaManager.useStamina(20)) {
     *    // Perform dash action
     * } else {
     *    // Play "not enough stamina" feedback
     * }
     * ```
     */
    useStamina(amount: number): boolean {
        // Check if player has enough stamina for this action
        if (this.currentStamina >= amount) {
            // Deduct stamina cost
            this.currentStamina -= amount;
            
            // Record the time of use (to calculate regeneration delay)
            this.lastUseTime = this.scene.time.now;
            
            // Update the visual display
            this.updateStaminaDisplay();
            return true;
        }
        return false; // Not enough stamina
    }

    /**
     * Get the current stamina value
     * 
     * @returns Current stamina amount as a number
     * Useful for UI elements that need to show stamina bars or custom displays
     */
    getStamina(): number {
        return this.currentStamina;
    }

    /**
     * Regenerate stamina over time
     * This is called automatically on the timer established in the constructor
     * 
     * The regeneration only occurs after the regenDelay has passed since
     * the last stamina use, simulating a recovery period after exertion
     */
    private regenerateStamina(): void {
        // Only start regenerating after the delay period has passed
        if (this.scene.time.now - this.lastUseTime > this.regenDelay) {
            if (this.currentStamina < this.maxStamina) {
                // Increase stamina but don't exceed maximum
                this.currentStamina = Math.min(this.maxStamina, this.currentStamina + this.regenRate);
                
                // Update the visual indicator
                this.updateStaminaDisplay();
            }
        }
    }

    /**
     * Update the UI text display with current stamina values
     * 
     * This creates a formatted string showing current and maximum stamina
     * The values are floored to show whole numbers for better readability
     */
    private updateStaminaDisplay(): void {
        if (this.staminaText) {
            // Format: "Player 1 (current/max STA)"
            // Floor the current stamina to avoid decimal values in display
            this.staminaText.setText(`Player 1 (${Math.floor(this.currentStamina)}/${this.maxStamina} STA)`);
            
            // Additional visual feedback could be added here
            // For example, changing text color when stamina is low:
            /*
            if (this.currentStamina < this.maxStamina * 0.2) {
                this.staminaText.setStyle({ color: '#ff0000' });  // Red when low
            } else {
                this.staminaText.setStyle({ color: '#ffffff' });  // Normal color
            }
            */
        }
    }

    /**
     * Check if player has enough stamina for an action without consuming it
     * 
     * @param amount - Amount of stamina required for the action
     * @returns true if there is enough stamina, false otherwise
     * 
     * Useful for UI feedback, like graying out buttons when an action
     * cannot be performed due to insufficient stamina
     */
    hasEnoughStamina(amount: number): boolean {
        return this.currentStamina >= amount;
    }

    /**
     * Clean up resources when this manager is no longer needed
     * 
     * Should be called when transitioning between scenes or when
     * the player entity is destroyed to prevent memory leaks
     */
    destroy(): void {
        if (this.regenTimer) {
            this.regenTimer.destroy();
            this.regenTimer = null;
        }
    }
}
