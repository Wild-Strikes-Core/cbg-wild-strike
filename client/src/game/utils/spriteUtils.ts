import Phaser from 'phaser';

/**
 * Utility function to create a player sprite with common settings
 * 
 * @param scene - The scene this sprite belongs to
 * @param x - Initial X position
 * @param y - Initial Y position
 * @param texture - Texture key for the sprite
 * @param frame - Initial frame for the sprite
 * @returns The created player sprite
 */
export function createPlayerSprite(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string = "_Idle_Idle",
    frame: number = 0
): Phaser.Physics.Arcade.Sprite {
    const sprite = scene.physics.add.sprite(x, y, texture, frame);
    sprite.setInteractive(new Phaser.Geom.Rectangle(0, 0, 120, 80), Phaser.Geom.Rectangle.Contains);
    sprite.scaleX = 3;
    sprite.scaleY = 3;
    sprite.setOrigin(0, 0);
    if (sprite.body) {
        sprite.body.gravity.y = 10000;
        sprite.body.setOffset(45, 40);
        sprite.body.setSize(30, 40, false);
    }
    return sprite;
}