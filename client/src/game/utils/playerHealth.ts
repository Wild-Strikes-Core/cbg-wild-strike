/**
 * Player Health Management Utility
 * Handles health tracking, damage, healing, and display syncing for game entities
 * Used to create health systems with visual feedback for game characters
 */
export class PlayerHealth {
    // Current health points of the player
    private currentHealth: number;
    
    // Maximum possible health points
    private maxHealth: number;
    
    // Text display component that shows health information on screen
    private healthText: Phaser.GameObjects.Text;
    
    // Reference to the game scene for accessing game systems
    private scene: Phaser.Scene;
    
    // Name identifier for this health instance, displayed in UI
    private playerName: string;
    
    // Template for how health should appear in the UI
    private displayFormat: string;
    
    // Duration in milliseconds for damage/heal visual effects
    // Controls how long the text will appear colored when health changes
    private damageFlashDuration: number = 150;
    
    /**
     * Create a new player health tracker
     * @param scene The scene containing the player and text
     * @param healthText Text object to display health information
     * @param maxHealth Maximum health value
     * @param playerName Name to display in health text
     * @param startingHealth Initial health value (defaults to max)
     * @param displayFormat String format for health display
     */
    constructor(
        scene: Phaser.Scene,
        healthText: Phaser.GameObjects.Text,
        maxHealth: number = 100,
        playerName: string = "Player",
        startingHealth: number = maxHealth,
        displayFormat: string = "{name} ({current}/{max} HP)"
    ) {
        // Store references and initialize properties
        this.scene = scene;
        this.healthText = healthText;
        this.maxHealth = maxHealth;
        // Ensure starting health doesn't exceed maximum health
        this.currentHealth = Math.min(startingHealth, maxHealth);
        this.playerName = playerName;
        this.displayFormat = displayFormat;
        
        // Initialize the display text with current values
        this.updateDisplay();
    }
    
    /**
     * Deal damage to the player
     * @param amount Amount of damage to deal
     * @param showEffect Whether to show visual damage effect (red flash)
     * @returns Remaining health after damage
     */
    takeDamage(amount: number, showEffect: boolean = true): number {
        // Ensure damage is positive (absolute value) to prevent healing through this method
        amount = Math.abs(amount);
        
        // Apply damage, ensuring health doesn't go below 0 (no negative health)
        this.currentHealth = Math.max(0, this.currentHealth - amount);
        
        // Update the UI text display with new values
        this.updateDisplay();
        
        // Show damage effect if requested (red flash)
        if (showEffect) {
            this.showDamageEffect();
        }
        
        // Check for death condition and trigger events if needed
        if (this.currentHealth <= 0) {
            this.onDeath();
        }
        
        return this.currentHealth;
    }
    
    /**
     * Heal the player by increasing health points
     * @param amount Amount to heal
     * @param showEffect Whether to show visual healing effect (green flash)
     * @returns New health value after healing
     */
    heal(amount: number, showEffect: boolean = true): number {
        // Ensure heal amount is positive to prevent damage through this method
        amount = Math.abs(amount);
        
        // Apply healing, ensuring health doesn't exceed maximum allowed
        this.currentHealth = Math.min(this.maxHealth, this.currentHealth + amount);
        
        // Update the UI with new health value
        this.updateDisplay();
        
        // Show healing visual feedback if enabled
        if (showEffect) {
            this.showHealEffect();
        }
        
        return this.currentHealth;
    }
    
    /**
     * Set health to a specific value directly (bypasses damage/heal effects)
     * Useful for initialization and synchronization with server
     * @param value Health value to set
     * @returns New health value
     */
    setHealth(value: number): number {
        // Clamp value between 0 and max health
        this.currentHealth = Math.max(0, Math.min(this.maxHealth, value));
        this.updateDisplay();
        
        // Check for death condition
        if (this.currentHealth <= 0) {
            this.onDeath();
        }
        
        return this.currentHealth;
    }
    
    /**
     * Get current health value
     * @returns Current health value
     */
    getHealth(): number {
        return this.currentHealth;
    }
    
    /**
     * Get maximum health value
     * @returns Maximum health value
     */
    getMaxHealth(): number {
        return this.maxHealth;
    }
    
    /**
     * Set maximum health value
     * Can be used for power-ups or level-up mechanics
     * @param value New maximum health
     */
    setMaxHealth(value: number): void {
        // Ensure max health is at least 1 to prevent invalid health states
        this.maxHealth = Math.max(1, value);
        
        // Cap current health at new max if it exceeds the new maximum
        if (this.currentHealth > this.maxHealth) {
            this.currentHealth = this.maxHealth;
        }
        
        // Refresh the display to show new values
        this.updateDisplay();
    }
    
    /**
     * Check if player is alive
     * @returns True if health > 0, false otherwise
     */
    isAlive(): boolean {
        return this.currentHealth > 0;
    }
    
    /**
     * Handle player death
     * Emits an event for other game systems to react to death
     */
    private onDeath(): void {
        // Emit a death event that can be listened for by other game components
        // Example usage: scene.events.on('playerDeath', handlePlayerDeath);
        this.scene.events.emit('playerDeath', this);
    }
    
    /**
     * Update the health display text
     * Replaces template tokens with actual values
     */
    private updateDisplay(): void {
        // Replace tokens in the format string with current values
        let displayText = this.displayFormat
            .replace('{name}', this.playerName)
            .replace('{current}', this.currentHealth.toString())
            .replace('{max}', this.maxHealth.toString());
            
        // Update the text display if it exists
        if (this.healthText) {
            this.healthText.setText(displayText);
        }
    }
    
    /**
     * Show a visual effect for taking damage
     * Creates a brief red flash on the health text
     */
    private showDamageEffect(): void {
        // Flash the text red to indicate damage
        this.healthText.setTint(0xff0000);
        
        // Reset the color after the flash duration expires
        this.scene.time.delayedCall(this.damageFlashDuration, () => {
            this.healthText.clearTint();
        });
    }
    
    /**
     * Show a visual effect for healing
     * Creates a brief green flash on the health text
     */
    private showHealEffect(): void {
        // Flash the text green to indicate healing
        this.healthText.setTint(0x00ff00);
        
        // Reset the color after the flash duration expires
        this.scene.time.delayedCall(this.damageFlashDuration, () => {
            this.healthText.clearTint();
        });
    }
    
    /**
     * Position the health text relative to a target game object
     * Useful for health bars that follow moving characters
     * @param target The target object to position above
     * @param offsetY Y offset from target (negative values = above the target)
     */
    positionAbove(target: Phaser.GameObjects.GameObject, offsetY: number = -70): void {
        if (this.healthText && target) {
            // Center the text above the target with the specified offset
            this.healthText.setPosition(
                target.x - this.healthText.width / 2,
                target.y + offsetY
            );
        }
    }
}
