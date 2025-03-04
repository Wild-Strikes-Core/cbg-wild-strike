import Phaser from "phaser";

export default class MoveCloudsLeft extends Phaser.GameObjects.Component {
    /**
     * @param {Phaser.GameObjects.Image} gameObject The game object this component belongs to.
     * @param {number} speed The speed at which the cloud moves horizontally.
     * @param {number} resetX The x-position to reset the cloud to when it moves off screen.
     */
    constructor(gameObject: Phaser.GameObjects.Image, speed: number = 100, resetX: number = 2000) {
        // @ts-ignore - Phaser.GameObjects.Component is actually not meant to be extended directly
        super(gameObject);

        this.gameObject = gameObject;
        this.speed = speed;
        this.resetX = resetX;

        // Add this game object to the update list
        gameObject.scene.events.on('update', this.update, this);
        
        // Make sure to clean up when the gameObject is destroyed
        gameObject.on('destroy', () => {
            gameObject.scene.events.off('update', this.update, this);
        });
    }

    gameObject: Phaser.GameObjects.Image;
    speed: number;
    resetX: number;

    update(time: number, delta: number): void {
        // Move the cloud to the left based on speed and delta time
        this.gameObject.x -= (this.speed * delta) / 1000;

        // Reset the cloud's position when it moves off the screen to the left
        if (this.gameObject.x < -this.gameObject.width) {
            this.gameObject.x = this.resetX;
        }
    }
}
