/**
 * UIManager - Handles all UI-related functionality including:
 * - UI element positioning and visibility
 * - Match timer and time display
 * - Player information display
 */
export class UIManager {
    // Scene reference
    private scene: Phaser.Scene;
    
    // UI container elements
    private p1infoContainer: Phaser.GameObjects.Image;
    private p2infoContainer: Phaser.GameObjects.Image;
    
    // Player info texts
    private player1Name: Phaser.GameObjects.Text;
    private player2Name: Phaser.GameObjects.Text;
    
    // Match timer elements
    private uiTimer: Phaser.GameObjects.Sprite;
    private matchTimerText: Phaser.GameObjects.Text;
    private matchTime: number = 90; // 1 minute and 30 seconds
    private matchTimerEvent: Phaser.Time.TimerEvent | null = null;
    
    // Skill UI elements
    private skillContainer: Phaser.GameObjects.Container;
    private uiSkillContainer: Phaser.GameObjects.Image;
    private uiSkillONE: Phaser.GameObjects.Image;
    private uiSkillTWO: Phaser.GameObjects.Image; 
    private uiSkillTHREE: Phaser.GameObjects.Image;
    
    /**
     * Create a UI manager
     * @param scene - The scene this UI belongs to
     * @param ui - UI element references from the scene
     */
    constructor(scene: Phaser.Scene, ui: {
        p1infoContainer: Phaser.GameObjects.Image,
        p2infoContainer: Phaser.GameObjects.Image,
        player1Name: Phaser.GameObjects.Text,
        player2Name: Phaser.GameObjects.Text,
        uiTimer: Phaser.GameObjects.Sprite,
        matchTimerText: Phaser.GameObjects.Text,
        skillContainer?: Phaser.GameObjects.Container,
        uiSkillContainer?: Phaser.GameObjects.Image,
        uiSkillONE?: Phaser.GameObjects.Image,
        uiSkillTWO?: Phaser.GameObjects.Image,
        uiSkillTHREE?: Phaser.GameObjects.Image,
    }) {
        this.scene = scene;
        
        // Store UI element references
        this.p1infoContainer = ui.p1infoContainer;
        this.p2infoContainer = ui.p2infoContainer;
        this.player1Name = ui.player1Name;
        this.player2Name = ui.player2Name;
        this.uiTimer = ui.uiTimer;
        this.matchTimerText = ui.matchTimerText;
        
        // Set up skill UI if provided
        this.skillContainer = ui.skillContainer!;
        this.uiSkillContainer = ui.uiSkillContainer!;
        this.uiSkillONE = ui.uiSkillONE!;
        this.uiSkillTWO = ui.uiSkillTWO!;
        this.uiSkillTHREE = ui.uiSkillTHREE!;
        
        // Set UI elements to high depth
        this.setUIDepth();
    }
    
    /**
     * Set depth values for UI elements to ensure they appear on top
     */
    private setUIDepth(): void {
        this.p1infoContainer.setDepth(100);
        this.p2infoContainer.setDepth(100);
        this.player1Name.setDepth(101);
        this.player2Name.setDepth(101);
        this.uiTimer.setDepth(100);
        this.matchTimerText.setDepth(101);
        
        if (this.skillContainer) {
            this.skillContainer.setDepth(100);
        }
    }
    
    /**
     * Get all UI elements that should be handled by the UI camera
     */
    getUIElements(): Phaser.GameObjects.GameObject[] {
        const elements = [
            this.p1infoContainer,
            this.p2infoContainer,
            this.player1Name,
            this.player2Name,
            this.uiTimer,
            this.matchTimerText
        ];
        
        // Add skill UI elements if they exist
        if (this.skillContainer) {
            this.skillContainer.list.forEach(child => {
                if (child instanceof Phaser.GameObjects.Sprite || child instanceof Phaser.GameObjects.Text || child instanceof Phaser.GameObjects.Image) {
                    elements.push(child);
                }
            });
        }
        if (this.uiSkillContainer) elements.push(this.uiSkillContainer);
        if (this.uiSkillONE) elements.push(this.uiSkillONE);
        if (this.uiSkillTWO) elements.push(this.uiSkillTWO);
        if (this.uiSkillTHREE) elements.push(this.uiSkillTHREE);
        
        return elements;
    }
    
    /**
     * Get skill icon elements for player input integration
     */
    getSkillIcons(): { skillE?: Phaser.GameObjects.Image, skillQ?: Phaser.GameObjects.Image, skillR?: Phaser.GameObjects.Image } {
        return {
            skillE: this.uiSkillONE,
            skillQ: this.uiSkillTWO,
            skillR: this.uiSkillTHREE
        };
    }
    
    /**
     * Initialize and start the match timer
     */
    startMatchTimer(): void {
        // Set initial time to 1 minute and 30 seconds
        this.matchTime = 90;

        // Update the display initially
        this.updateMatchTimerDisplay();

        // Create a timer event that fires every second
        this.matchTimerEvent = this.scene.time.addEvent({
            delay: 1000,
            callback: this.updateMatchTimer,
            callbackScope: this,
            loop: true
        });
    }

    /**
     * Update the match timer (called every second)
     */
    private updateMatchTimer(): void {
        // Decrease the remaining time
        this.matchTime--;

        // Update the display
        this.updateMatchTimerDisplay();

        // Check if timer has reached zero
        if (this.matchTime <= 0) {
            // Stop the timer
            if (this.matchTimerEvent) {
                this.matchTimerEvent.remove();
                this.matchTimerEvent = null;
            }

            // Handle end of match logic
            this.handleMatchEnd();
        }
    }

    /**
     * Update the timer display with current time
     */
    private updateMatchTimerDisplay(): void {
        // Calculate minutes and seconds
        const minutes = Math.floor(this.matchTime / 60);
        const seconds = this.matchTime % 60;

        // Format as XX:XX
        const formattedTime = 
            (minutes < 10 ? '0' : '') + minutes + 
            ':' + 
            (seconds < 10 ? '0' : '') + seconds;

        // Update the text
        this.matchTimerText.setText(formattedTime);
    }

    /**
     * Handle match end logic
     */
    private handleMatchEnd(): void {
        // Logic for when the match timer hits zero
        this.matchTimerText.setText("00:00");
        
        // Emit an event that the game scene can listen to
        this.scene.events.emit('matchEnded');
        
        console.log("Match time has ended!");
    }

    /**
     * Set player names in the UI
     */
    setPlayerNames(player1Name: string, player2Name: string): void {
        this.player1Name.setText(player1Name);
        this.player2Name.setText(player2Name);
    }
    
    /**
     * Clean up resources when this manager is no longer needed
     */
    destroy(): void {
        // Clean up the timer when the scene is shut down
        if (this.matchTimerEvent) {
            this.matchTimerEvent.remove();
            this.matchTimerEvent = null;
        }
    }
}
