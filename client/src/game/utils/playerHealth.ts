/**
 * Player Health Management Utility
 * Handles health tracking, damage, healing, and display syncing
 */
export class PlayerHealth {
    private currentHealth: number;
    private maxHealth: number;
    private healthText: Phaser.GameObjects.Text;
    private scene: Phaser.Scene;
    private playerName: string;
    private displayFormat: string;
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
        this.scene = scene;
        this.healthText = healthText;
        this.maxHealth = maxHealth;
        this.currentHealth = Math.min(startingHealth, maxHealth);
        this.playerName = playerName;
        this.displayFormat = displayFormat;
        
        // Initialize the display text
        this.updateDisplay();
    }
    
    /**
     * Deal damage to the player
     * @param amount Amount of damage to deal
     * @param showEffect Whether to show visual damage effect
     * @returns Remaining health after damage
     */
    takeDamage(amount: number, showEffect: boolean = true): number {
        // Ensure damage is positive
        amount = Math.abs(amount);
        
        // Apply damage, ensuring health doesn't go below 0
        this.currentHealth = Math.max(0, this.currentHealth - amount);
        
        // Update the display
        this.updateDisplay();
        
        // Show damage effect if requested
        if (showEffect) {
            this.showDamageEffect();
        }
        
        // Check for death
        if (this.currentHealth <= 0) {
            this.onDeath();
        }
        
        return this.currentHealth;
    }
    
    /**
     * Heal the player
     * @param amount Amount to heal
     * @param showEffect Whether to show visual healing effect
     * @returns New health value after healing
     */
    heal(amount: number, showEffect: boolean = true): number {
        // Ensure heal amount is positive
        amount = Math.abs(amount);
        
        // Apply healing, ensuring health doesn't exceed max
        this.currentHealth = Math.min(this.maxHealth, this.currentHealth + amount);
        
        // Update the display
        this.updateDisplay();
        
        // Show healing effect if requested
        if (showEffect) {
            this.showHealEffect();
        }
        
        return this.currentHealth;
    }
    
    /**
     * Set health to a specific value
     * @param value Health value to set
     * @returns New health value
     */
    setHealth(value: number): number {
        this.currentHealth = Math.max(0, Math.min(this.maxHealth, value));
        this.updateDisplay();
        
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
     * @param value New maximum health
     */
    setMaxHealth(value: number): void {
        this.maxHealth = Math.max(1, value);
        
        // Cap current health at new max
        if (this.currentHealth > this.maxHealth) {
            this.currentHealth = this.maxHealth;
        }
        
        this.updateDisplay();
    }
    
    /**
     * Check if player is alive
     * @returns True if health > 0
     */
    isAlive(): boolean {
        return this.currentHealth > 0;
    }
    
    /**
     * Handle player death
     */
    private onDeath(): void {
        // Emit a death event that can be listened for
        this.scene.events.emit('playerDeath', this);
    }
    
    /**
     * Update the health display text
     */
    private updateDisplay(): void {
        // Replace tokens in the format string
        let displayText = this.displayFormat
            .replace('{name}', this.playerName)
            .replace('{current}', this.currentHealth.toString())
            .replace('{max}', this.maxHealth.toString());
            
        // Update the text
        if (this.healthText) {
            this.healthText.setText(displayText);
        }
    }
    
    /**
     * Show a visual effect for taking damage
     */
    private showDamageEffect(): void {
        // Flash the text red
        this.healthText.setTint(0xff0000);
        
        // Reset after a short delay
        this.scene.time.delayedCall(this.damageFlashDuration, () => {
            this.healthText.clearTint();
        });
    }
    
    /**
     * Show a visual effect for healing
     */
    private showHealEffect(): void {
        // Flash the text green
        this.healthText.setTint(0x00ff00);
        
        // Reset after a short delay
        this.scene.time.delayedCall(this.damageFlashDuration, () => {
            this.healthText.clearTint();
        });
    }
    
    /**
     * Position the health text relative to a target
     * @param target The target object to position above
     * @param offsetY Y offset from target
     */
    positionAbove(target: Phaser.GameObjects.GameObject, offsetY: number = -70): void {
        if (this.healthText && target) {
            this.healthText.setPosition(
                target.x - this.healthText.width / 2,
                target.y + offsetY
            );
        }
    }
}
