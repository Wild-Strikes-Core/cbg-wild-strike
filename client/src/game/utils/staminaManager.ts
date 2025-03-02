/**
 * Utility for managing player stamina
 */

export interface StaminaConfig {
    maxStamina: number;
    regenRate: number;  // Amount of stamina to regenerate per tick
    regenDelay: number; // Time in ms before stamina starts regenerating after use
    updateFrequency: number; // How often (in ms) stamina regenerates
}

export class StaminaManager {
    private currentStamina: number;
    private readonly maxStamina: number;
    private regenRate: number;
    private regenDelay: number;
    private lastUseTime: number = 0;
    private regenTimer: Phaser.Time.TimerEvent | null = null;
    private scene: Phaser.Scene;
    private staminaText: Phaser.GameObjects.Text;

    constructor(scene: Phaser.Scene, staminaText: Phaser.GameObjects.Text, config: StaminaConfig) {
        this.scene = scene;
        this.staminaText = staminaText;
        this.maxStamina = config.maxStamina;
        this.currentStamina = config.maxStamina;
        this.regenRate = config.regenRate;
        this.regenDelay = config.regenDelay;
        
        // Set up regeneration timer
        this.regenTimer = this.scene.time.addEvent({
            delay: config.updateFrequency,
            callback: this.regenerateStamina,
            callbackScope: this,
            loop: true
        });
        
        // Initial update of stamina text
        this.updateStaminaDisplay();
    }

    /**
     * Use stamina for an action
     * @param amount Amount of stamina to use
     * @returns true if there was enough stamina, false if not
     */
    useStamina(amount: number): boolean {
        if (this.currentStamina >= amount) {
            this.currentStamina -= amount;
            this.lastUseTime = this.scene.time.now;
            this.updateStaminaDisplay();
            return true;
        }
        return false;
    }

    /**
     * Get the current stamina value
     */
    getStamina(): number {
        return this.currentStamina;
    }

    /**
     * Regenerate stamina over time
     */
    private regenerateStamina(): void {
        // Only regenerate after delay since last use
        if (this.scene.time.now - this.lastUseTime > this.regenDelay) {
            if (this.currentStamina < this.maxStamina) {
                this.currentStamina = Math.min(this.maxStamina, this.currentStamina + this.regenRate);
                this.updateStaminaDisplay();
            }
        }
    }

    /**
     * Update the stamina text display
     */
    private updateStaminaDisplay(): void {
        if (this.staminaText) {
            this.staminaText.setText(`Player 1 (${Math.floor(this.currentStamina)}/${this.maxStamina} STA)`);
        }
    }

    /**
     * Check if player has enough stamina for an action
     */
    hasEnoughStamina(amount: number): boolean {
        return this.currentStamina >= amount;
    }

    /**
     * Clean up resources when no longer needed
     */
    destroy(): void {
        if (this.regenTimer) {
            this.regenTimer.destroy();
            this.regenTimer = null;
        }
    }
}
