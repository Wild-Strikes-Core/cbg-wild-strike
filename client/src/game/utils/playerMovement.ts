import { StaminaManager } from "./staminaManager";

export interface MovementConfig {
    walkSpeed: number;
    runSpeed: number;
    jumpSpeed: number;
}

export interface AnimationKeys {
    idle: string;
    walk: string;
    jump: string;
    run?: string;
}

/**
 * Handle player movement with stamina integration
 */
export function handlePlayerMovement(
    player: Phaser.Physics.Arcade.Sprite,
    cursors: any,
    config: MovementConfig,
    animationKeys: AnimationKeys,
    staminaManager?: StaminaManager
) {
    const onGround = player.body.touching.down || player.body.blocked.down;
    let isRunning = false;
    let currentAnimation = '';
    
    // Calculate movement
    if (cursors.left.isDown) {
        // Check if shift is pressed and we have stamina manager and enough stamina for running
        if (cursors.shift.isDown && staminaManager && staminaManager.hasEnoughStamina(0.5)) {
            // Running
            player.setVelocityX(-config.runSpeed);
            isRunning = true;
            //staminaManager.useStamina(0.5); // Use stamina while running
        } else {
            // Walking
            player.setVelocityX(-config.walkSpeed);
        }
        
        player.setFlipX(true);
        
        if (onGround) {
            currentAnimation = isRunning && animationKeys.run ? animationKeys.run : animationKeys.walk;
        }
    } else if (cursors.right.isDown) {
        // Check if shift is pressed and we have stamina manager and enough stamina for running
        if (cursors.shift.isDown && staminaManager && staminaManager.hasEnoughStamina(0.5)) {
            // Running
            player.setVelocityX(config.runSpeed);
            isRunning = true;
            //staminaManager.useStamina(0.5); // Use stamina while running
        } else {
            // Walking
            player.setVelocityX(config.walkSpeed);
        }
        
        player.setFlipX(false);
        
        if (onGround) {
            currentAnimation = isRunning && animationKeys.run ? animationKeys.run : animationKeys.walk;
        }
    } else {
        // Idle state
        player.setVelocityX(0);
        
        if (onGround) {
            currentAnimation = animationKeys.idle;
        }
    }
    
    // Handle jumping
    if (cursors.up.isDown && onGround) {
        // Jump with extra stamina cost
        if (staminaManager && staminaManager.hasEnoughStamina(10)) {
            player.setVelocityY(config.jumpSpeed);
            currentAnimation = animationKeys.jump;
            //staminaManager.useStamina(10); // Use stamina for jumping
        } else if (!staminaManager) {
            // If no stamina manager, still allow jumping
            player.setVelocityY(config.jumpSpeed);
            currentAnimation = animationKeys.jump;
        }
    }
    
    // Set animation if in air and no other animation is set
    if (!onGround && !currentAnimation) {
        currentAnimation = animationKeys.jump;
    }
    
    // Only change animation if we need to
    if (currentAnimation && player.anims.currentAnim?.key !== currentAnimation) {
        console.log(`Playing animation: ${currentAnimation}`); // Debug log
        player.play(currentAnimation, true);
    }
}
