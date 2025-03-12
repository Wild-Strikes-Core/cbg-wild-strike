import { StaminaManager } from "./staminaManager";

/**
 * Configuration interface for player movement parameters
 * Controls the speed values for different movement types
 */
export interface MovementConfig {
    walkSpeed: number;   // Base movement speed when walking
    runSpeed: number;    // Faster movement speed when running (uses stamina)
    jumpSpeed: number;   // Vertical velocity applied when jumping
    crouchSpeed: number; // Slower movement speed when crouching
}

/**
 * Animation keys interface to define the animation names for player states
 * These should correspond to animation keys registered with the sprite
 */
export interface AnimationKeys {
    idle: string;      // Animation played when player is standing still
    walk: string;      // Animation played when player is walking
    jump: string;      // Animation played when player is jumping upward
    fall: string;      // Animation played when player is falling downward
    run: string;       // Optional animation played when player is running
    crouch: string;    // Animation played when player is crouching still
    crouchWalk: string; // Animation played when player is walking while crouched
}

/**
 * Interface for skill UI icons that will receive visual feedback
 */
export interface SkillUIIcons {
    skillE?: Phaser.GameObjects.Image;  // UI element for E skill
    skillQ?: Phaser.GameObjects.Image;  // UI element for Q skill
    skillR?: Phaser.GameObjects.Image;  // UI element for R skill
}

// Track the previous crouch state between function calls
let prevCrouchState = false;

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
    let doubleJumpUsed = player.getData('doubleJumpUsed') || false;
    let isRunning = false;
    let isCrouching = cursors.down?.isDown || false;
    let isDodging = cursors.ctrl?.isDown || false; // Track dodge state
    let currentAnimation = '';
    let justDoubleJumped = false;
    
    // Apply white tint when dodging
    if (isDodging) {
        player.setTint(0xffffff);
        console.log("Player is dodging!");
    } else {
        // Clear tint if not dodging and not using double jump
        if (!player.getData('doubleJumpUsed')) {
            player.clearTint();
        }
    }
    
    // Add footstep sound handling
    const isMoving = player.body.velocity.x !== 0;
    const lastFootstep = player.getData('lastFootstep') || 0;
    const currentTime = player.scene.time.now;
    // Different intervals for different movement types
    const footstepInterval = isRunning ? 300 : 450; // Faster footsteps when running
    
    // Play footstep sounds only when moving on the ground
    if (isMoving && onGround && currentTime - lastFootstep > footstepInterval) {
        player.scene.sound.play('Footstep', { volume: 0.4 });
        player.setData('lastFootstep', currentTime);
        
        // Return footstep event for network broadcasting
        return { isRunning, isCrouching, justDoubleJumped, isDodging, playSound: 'Footstep' };
    }
    
    // Detect crouch state change (for animation triggering)
    const crouchStateChanged = isCrouching !== prevCrouchState;
    prevCrouchState = isCrouching;
    
    // Play crouch animation once when entering crouch state
    if (crouchStateChanged && isCrouching && onGround) {
        player.play(animationKeys.crouch, true);
    }
    
    // Store the player's current position before any movement
    const prevX = player.x;
    
    // Calculate actual movement speed based on state
    let currentWalkSpeed = config.walkSpeed;
    let currentRunSpeed = config.runSpeed;
    
    // Reduce speed when crouching
    if (isCrouching) {
        currentWalkSpeed = config.crouchSpeed || config.walkSpeed * 0.5;
        currentRunSpeed = currentWalkSpeed; // Can't run while crouching
    }
    
    // HORIZONTAL MOVEMENT HANDLING
    if (cursors.left.isDown) {
        // LEFT MOVEMENT
        // Check if player is attempting to run (shift key + enough stamina) and not crouching
        if (cursors.shift.isDown && !isCrouching && staminaManager && staminaManager.hasEnoughStamina(0.5)) {
            // Running left at higher speed
            player.setVelocityX(-currentRunSpeed);
            isRunning = true;
            //staminaManager.useStamina(0.5);
        } else {
            // Walking left at normal or crouch speed
            player.setVelocityX(-currentWalkSpeed);
        }
        
        // Flip sprite to face left - do this separately from movement
        player.setFlipX(true);
        
        // Set appropriate animation when on ground
        if (onGround) {
            if (isCrouching) {
                currentAnimation = animationKeys.crouchWalk;
            } else {
                currentAnimation = isRunning && animationKeys.run ? animationKeys.run : animationKeys.walk;
            }
        }
    } else if (cursors.right.isDown) {
        // RIGHT MOVEMENT
        // Check if player is attempting to run (shift key + enough stamina) and not crouching
        if (cursors.shift.isDown && !isCrouching && staminaManager && staminaManager.hasEnoughStamina(0.5)) {
            // Running right at higher speed
            player.setVelocityX(currentRunSpeed);
            isRunning = true;
            //staminaManager.useStamina(0.5);
        } else {
            // Walking right at normal or crouch speed
            player.setVelocityX(currentWalkSpeed);
        }
        
        // Flip sprite to face right - do this separately from movement
        player.setFlipX(false);
        
        // Set appropriate animation when on ground
        if (onGround) {
            if (isCrouching) {
                currentAnimation = animationKeys.crouchWalk;
            } else {
                currentAnimation = isRunning && animationKeys.run ? animationKeys.run : animationKeys.walk;
            }
        }
    } else {
        // NO HORIZONTAL MOVEMENT - IDLE STATE
        player.setVelocityX(0);
        
        // Don't change the flip direction when idle - maintain last direction
        
        if (onGround) {
            // Only set idle animation when not crouching
            // For crouch, we only play the animation once when state changes
            if (!isCrouching) {
                currentAnimation = animationKeys.idle;
            } else if (crouchStateChanged) {
                // Already handled above, but this ensures it's not overridden
                currentAnimation = '';
            }
        }
    }
    
    // If position changed due to flipping, restore it
    if (player.x !== prevX && player.body.velocity.x === 0) {
        player.x = prevX;
    }
    
    if (onGround) {
        doubleJumpUsed = false;
        player.setData('doubleJumpUsed', false);
    }
    
    // JUMP HANDLING - Only allow when not crouching
    if (cursors.up.isDown && onGround && !isCrouching) {
        // Jump with extra stamina cost if stamina system is active
        if (staminaManager && staminaManager.hasEnoughStamina(10)) {
            // Apply vertical velocity for jump
            player.setVelocityY(config.jumpSpeed);
            // Leap forward based on the direction the player is facing
            player.setVelocityX(player.flipX ? -config.walkSpeed * 2 : config.walkSpeed * 2);
            currentAnimation = animationKeys.jump;
            //staminaManager.useStamina(10);
        } else if (!staminaManager) {
            // If no stamina system is used, player can always jump
            player.setVelocityY(config.jumpSpeed);
            // Leap forward based on the direction the player is facing
            player.setVelocityX(player.flipX ? -config.walkSpeed * 2 : config.walkSpeed * 2);
            currentAnimation = animationKeys.jump;
        }
        player.setData('lastJumpTime', player.scene.time.now);
    } else if (cursors.up.isDown && !onGround && !isCrouching && !doubleJumpUsed) {
        const now = player.scene.time.now;
        const lastJumpTime = player.getData('lastJumpTime') || 0;
        if (now - lastJumpTime > 200) {
            justDoubleJumped = true;
            player.setVelocityY(config.jumpSpeed);
            player.setData('doubleJumpUsed', true);
            player.setData('lastJumpTime', now);
            player.setTint(0x99ff99);
            player.scene.time.delayedCall(200, () => {
                player.clearTint();
            });
            currentAnimation = animationKeys.jump;
        }
    }
    
    // AIRBORNE HANDLING
    // If player is in the air and no other animation has been set
    if (!onGround && !currentAnimation) {
        // Use jump animation when moving up, fall animation when moving down
        if (player.body.velocity.y < 0) {
            currentAnimation = animationKeys.jump;
        } else {
            currentAnimation = animationKeys.fall;
        }
    }
    
    // ANIMATION PLAYBACK
    // Only change the animation if it's different from the current one
    if (currentAnimation && 
        player.anims.currentAnim?.key !== currentAnimation) {
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

    return { isRunning, isCrouching, justDoubleJumped, isDodging };
}
