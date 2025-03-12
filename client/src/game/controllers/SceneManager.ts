/**
 * SceneManager - Manages the game scene environment including:
 * - Cameras setup and configuration
 * - Background elements and parallax effects
 * - Tilemap and collision objects
 */
export class SceneManager {
    // Scene reference
    private scene: Phaser.Scene;
    
    // Cameras
    private mainCamera: Phaser.Cameras.Scene2D.Camera;
    private uiCamera: Phaser.Cameras.Scene2D.Camera;
    
    // Background elements
    private background: Phaser.GameObjects.Image;
    
    // Ground tiles/platforms
    private groundTiles: Phaser.GameObjects.TileSprite[] = [];
    
    // Camera settings
    private bestZoom: number = 1.5;
    private parallaxFactor: number = 0.4;
    
    // Event handler for preventing default browser actions
    private preventDefaultHandler: ((e: KeyboardEvent) => void) | null = null;
    
    /**
     * Create a scene manager
     * 
     * @param scene - The scene this manager belongs to
     * @param background - Background image for parallax effects
     * @param groundTiles - Array of tile sprites that make up the ground/platforms
     * @param config - Optional configuration
     */
    constructor(
        scene: Phaser.Scene,
        background: Phaser.GameObjects.Image,
        groundTiles: Phaser.GameObjects.TileSprite[],
        config: {
            bestZoom?: number,
            parallaxFactor?: number
        } = {}
    ) {
        this.scene = scene;
        this.background = background;
        this.groundTiles = groundTiles;
        
        // Apply configuration
        this.bestZoom = config.bestZoom || this.bestZoom;
        this.parallaxFactor = config.parallaxFactor || this.parallaxFactor;
        
        // Store reference to main camera
        this.mainCamera = scene.cameras.main;
        
        // Create a separate UI camera
        this.uiCamera = scene.cameras.add();
        this.uiCamera.setScroll(0, 0);
        
        // Configure background for parallax effect
        this.setupBackground();
        
        // Set up browser event handling
        this.setupBrowserEventHandlers();
    }
    
    /**
     * Set up browser event handlers to prevent default actions
     * (e.g. preventing spacebar from scrolling the page)
     */
    private setupBrowserEventHandlers(): void {
        // Prevent spacebar and ctrl from scrolling the page
        const preventDefaultKeys = (e: KeyboardEvent) => {
            if (e.code === 'Space' || e.ctrlKey) {
                e.preventDefault();
            }
        };
        
        // Add event listener
        window.addEventListener('keydown', preventDefaultKeys);
        
        // Store handler reference for cleanup
        this.preventDefaultHandler = preventDefaultKeys;
    }
    
    /**
     * Set up the background with parallax effect
     */
    private setupBackground(): void {
        // Configure the background for parallax effect
        this.background.setScrollFactor(this.parallaxFactor);
        
        // Add subtle animation to the background
        this.scene.tweens.add({
            targets: this.background,
            y: '+=5',
            duration: 3000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
    }
    
    /**
     * Configure camera to follow a target with zoom effect
     * 
     * @param target - The game object for the camera to follow
     */
    setupCameraFollow(target: Phaser.GameObjects.GameObject): void {
        // Add a camera zoom effect - starting further out for a dramatic zoom in
        this.mainCamera.setZoom(0.3);
        this.scene.tweens.add({
            targets: this.mainCamera,
            zoom: this.bestZoom,
            duration: 1200,
            ease: 'Power2'
        });
        
        // Set up camera to follow target with offset
        this.mainCamera.startFollow(target, true);
        this.mainCamera.setFollowOffset(0, -80);
        
        // Set camera bounds
        this.mainCamera.setBounds(0, 0, 1920, 1080);
    }
    
    /**
     * Update camera zoom based on target speed
     * 
     * @param speed - Current speed (typically player velocity magnitude)
     * @param threshold - Speed threshold to trigger zoom change
     */
    updateCameraZoom(speed: number, threshold: number): void {
        if (speed > threshold) {
            // Slightly zoom out when moving fast
            const runningZoom = this.bestZoom * 0.9;
            if (Math.abs(this.mainCamera.zoom - runningZoom) > 0.05) {
                this.scene.tweens.add({
                    targets: this.mainCamera,
                    zoom: runningZoom,
                    duration: 200,
                    ease: 'Sine.easeOut'
                });
            }
        } else if (this.mainCamera.zoom < this.bestZoom) {
            // Return to normal zoom when not moving fast
            this.scene.tweens.add({
                targets: this.mainCamera,
                zoom: this.bestZoom,
                duration: 300,
                ease: 'Sine.easeOut'
            });
        }
    }
    
    /**
     * Make UI camera ignore gameplay elements
     * 
     * @param gameplayElements - Array of gameplay elements to ignore
     */
    setUIIgnoreGameplay(gameplayElements: Phaser.GameObjects.GameObject[]): void {
        this.uiCamera.ignore(gameplayElements);
        
        // Make sure physics debug graphics are ignored
        this.scene.events.once('postupdate', () => {
            // Find any physics debug graphics and ignore them in the UI camera
            this.scene.children.each(child => {
                if (child instanceof Phaser.GameObjects.Graphics && 
                    (child.name === '__debugGraphics' || child.getData('isPhysicsDebug'))) {
                    this.uiCamera.ignore(child);
                }
            });
        });
        
        // If debug is enabled, make sure UI camera ignores it
        if (this.scene.physics.world.debugGraphic) {
            this.uiCamera.ignore(this.scene.physics.world.debugGraphic);
        }
    }
    
    /**
     * Make main camera ignore UI elements
     * 
     * @param uiElements - Array of UI elements to ignore
     */
    setMainIgnoreUI(uiElements: Phaser.GameObjects.GameObject[]): void {
        this.mainCamera.ignore(uiElements);
    }
    
    /**
     * Get all ground tiles/platforms
     */
    getGroundTiles(): Phaser.GameObjects.TileSprite[] {
        return this.groundTiles;
    }
    
    /**
     * Set camera bounds
     */
    setCameraBounds(x: number, y: number, width: number, height: number): void {
        this.mainCamera.setBounds(x, y, width, height);
    }
    
    /**
     * Get the main gameplay camera
     */
    getMainCamera(): Phaser.Cameras.Scene2D.Camera {
        return this.mainCamera;
    }
    
    /**
     * Get the UI camera
     */
    getUICamera(): Phaser.Cameras.Scene2D.Camera {
        return this.uiCamera;
    }
    
    /**
     * Clean up resources when this manager is no longer needed
     */
    destroy(): void {
        // Clean up the UI camera
        if (this.uiCamera) {
            this.uiCamera.destroy();
        }
        
        // Remove the event listener
        if (this.preventDefaultHandler) {
            window.removeEventListener('keydown', this.preventDefaultHandler);
            this.preventDefaultHandler = null;
        }
    }
}
