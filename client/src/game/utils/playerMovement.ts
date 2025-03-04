import { StaminaManager } from "./staminaManager";

/**
 * Configuration interface for player movement parameters
 * Controls the speed values for different movement types
 */
export interface MovementConfig {
    walkSpeed: number;   // Base movement speed when walking
    runSpeed: number;    // Faster movement speed when running (uses stamina)
    jumpSpeed: number;   // Vertical velocity applied when jumping
}

/**
 * Animation keys interface to define the animation names for player states
 * These should correspond to animation keys registered with the sprite
 */
export interface AnimationKeys {
    idle: string;    // Animation played when player is standing still
    walk: string;    // Animation played when player is walking
    jump: string;    // Animation played when player is in the air
    run: string;    // Optional animation played when player is running
}

/**
 * Interface for skill UI icons that will receive visual feedback
 */
export interface SkillUIIcons {
    skillE?: Phaser.GameObjects.Image;  // UI element for E skill
    skillQ?: Phaser.GameObjects.Image;  // UI element for Q skill
    skillR?: Phaser.GameObjects.Image;  // UI element for R skill
}

/**
 * Handle player movement with stamina integration
 * 
 * This function manages player movement, animations, and stamina consumption
 * based on input controls and configurable parameters.
 * 
 * @param player - The player sprite to control
 * @param cursors - Keyboard input cursors from Phaser's input system
 * @param config - Movement configuration settings (speeds)
 * @param animationKeys - Keys for the different animation states
 * @param staminaManager - Optional stamina manager to handle stamina consumption
 * @param skillIcons - Optional skill UI icons for visual feedback
 */
export function handlePlayerMovement(
    player: Phaser.Physics.Arcade.Sprite,
    cursors: any,
    config: MovementConfig,
    animationKeys: AnimationKeys,
    staminaManager?: StaminaManager,
    skillIcons?: SkillUIIcons
) {
    // Check if the player is touching the ground
    const onGround = player.body.touching.down || player.body.blocked.down;
    let isRunning = false;
    let currentAnimation = '';
    
    // HORIZONTAL MOVEMENT HANDLING
    if (cursors.left.isDown) {
        // LEFT MOVEMENT
        // Check if player is attempting to run (shift key + enough stamina)
        if (cursors.shift.isDown && staminaManager && staminaManager.hasEnoughStamina(0.5)) {
            // Running left at higher speed
            player.setVelocityX(-config.runSpeed);
            isRunning = true;
            //staminaManager.useStamina(0.5); // Use stamina while running 
        } else {
            // Walking left at normal speed
            player.setVelocityX(-config.walkSpeed);
        }
        
        // Flip sprite to face left
        player.setFlipX(true);
        
        // Set appropriate animation when on ground
        if (onGround) {
            currentAnimation = isRunning && animationKeys.run ? animationKeys.run : animationKeys.walk;
        }
    } else if (cursors.right.isDown) {
        // RIGHT MOVEMENT
        // Check if player is attempting to run (shift key + enough stamina)
        if (cursors.shift.isDown && staminaManager && staminaManager.hasEnoughStamina(0.5)) {
            // Running right at higher speed
            player.setVelocityX(config.runSpeed);
            isRunning = true;
            //staminaManager.useStamina(0.5); // Use stamina while running - currently commented out
        } else {
            // Walking right at normal speed
            player.setVelocityX(config.walkSpeed);
        }
        
        // Flip sprite to face right (no flip)
        player.setFlipX(false);
        
        // Set appropriate animation when on ground
        if (onGround) {
            currentAnimation = isRunning && animationKeys.run ? animationKeys.run : animationKeys.walk;
        }
    } else {
        // NO HORIZONTAL MOVEMENT - IDLE STATE
        player.setVelocityX(0);
        
        if (onGround) {
            currentAnimation = animationKeys.idle;
        }
    }
    
    // JUMP HANDLING
    // Player can only jump when on the ground
    if (cursors.up.isDown && onGround) {
        // Jump with extra stamina cost if stamina system is active
        if (staminaManager && staminaManager.hasEnoughStamina(10)) {
            // Apply vertical velocity for jump
            player.setVelocityY(config.jumpSpeed);
            currentAnimation = animationKeys.jump;
            //staminaManager.useStamina(10); // Use stamina for jumping - currently commented out
        } else if (!staminaManager) {
            // If no stamina system is used, player can always jump
            player.setVelocityY(config.jumpSpeed);
            currentAnimation = animationKeys.jump;
        }
        // Note: If stamina system is active but not enough stamina, jump doesn't occur
    }
    
    // AIRBORNE HANDLING
    // If player is in the air and no other animation has been set, use jump animation
    if (!onGround && !currentAnimation) {
        currentAnimation = animationKeys.jump;
    }
    
    // ANIMATION PLAYBACK
    // Only change the animation if it's different from the current one
    // This prevents animation restart flicker
    if (currentAnimation && player.anims.currentAnim?.key !== currentAnimation) {
        console.log(`Playing animation: ${currentAnimation}`); // Debug logging
        player.play(currentAnimation, true);
    }

    // Detect skill key presses and apply visual feedback
    if (cursors.skillE?.isDown) {
        console.log("E skill button pressed");
        if (skillIcons?.skillE) {
            skillIcons.skillE.setTint(0xffff00); // Apply yellow tint
        }
        // Skill E functionality will go here later
    } else if (skillIcons?.skillE) {
        skillIcons.skillE.clearTint(); // Clear tint when key is released
    }
    
    if (cursors.skillQ?.isDown) {
        console.log("Q skill button pressed");
        if (skillIcons?.skillQ) {
            skillIcons.skillQ.setTint(0xffff00); // Apply yellow tint
        }
        // Skill Q functionality will go here later
    } else if (skillIcons?.skillQ) {
        skillIcons.skillQ.clearTint(); // Clear tint when key is released
    }
    
    if (cursors.skillR?.isDown) {
        console.log("R skill button pressed");
        if (skillIcons?.skillR) {
            skillIcons.skillR.setTint(0xffff00); // Apply yellow tint
        }
        // Skill R functionality will go here later
    } else if (skillIcons?.skillR) {
        skillIcons.skillR.clearTint(); // Clear tint when key is released
    }
}
