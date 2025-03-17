# How to play

## `Press Arena`
![image](https://github.com/user-attachments/assets/041e30b4-a308-4f06-9bfb-85588d96be79)


## `Wait for opponent`
![image](https://github.com/user-attachments/assets/a07afc83-a08c-44df-bf35-873969755d3e)


## `Fight each other`

First player to lose 100 health points loses

```
Right Click: Attack
W: Jump
A: Left
D: Right 
```
![image](https://github.com/user-attachments/assets/27f4aadd-2a8b-4737-b306-c0ab8fe3d144)


# Game Architecture Documentation

This document explains the architecture of the multiplayer fighting game, focusing on both server and client components.

## Server: `index.ts`

The server handles all multiplayer functionality including match management, player synchronization, and game state broadcasting.

### Key Components

- **Socket.IO Server**: Manages real-time communication between clients
- **Matches System**: Tracks active matches and player state
- **Timer System**: Manages match duration and synchronizes time across clients
- **Movement & Attack Handling**: Processes player actions and broadcasts to opponents

### Important Functions

- **`io.on("connection")`**: Entry point for all client connections
- **`socket.on("findMatch")`**: Pairs waiting players and creates match rooms
- **`socket.on("playerMovement")`**: Updates and broadcasts player position & state
- **`socket.on("playerAttack")`**: Handles attack events and notifies opponents
- **Match timer**: Server-side timer that broadcasts updates via `timerUpdate` event

## Client: `M_Game.ts`

Main game scene that orchestrates the entire battle experience.

### Key Components

- **Player Sprites**: Local and remote player representations
- **Manager Initialization**: Sets up all game subsystems
- **Socket Handling**: Communicates with server for multiplayer

### Important Functions

- **`create()`**: Initializes the scene, connects to server, and sets up all systems
- **`setupSocketHandlers()`**: Configures event listeners for multiplayer updates
- **`initializeManagers()`**: Creates and connects all manager instances
- **`updateTimer()`**: Updates the UI based on server time broadcasts
- **`handleMatchEnd()`**: Processes match completion

## Client: `MultiplayerManager.ts`

Handles all network-related functionality for the game.

### Key Components

- **Socket Connection**: Reference to the Socket.IO connection
- **Remote Player Management**: Creates and updates opponent sprites
- **Game State Synchronization**: Ensures consistent game state across clients

### Important Functions

- **`setupSocketHandlers()`**: Sets up Socket.IO event listeners
- **`addOtherPlayer()`**: Creates sprites for other connected players
- **`updateOtherPlayer()`**: Updates remote player position & animation
- **`update()`**: Sends position updates at regular intervals
- **`cleanup()`**: Removes event listeners and disposes resources

## Client: `PlayerManager.ts`

Manages the local player character including movement, attacks, and state.

### Key Components

- **Player Physics**: Phaser physics body and collision handling
- **Input Controls**: Keyboard and mouse input processing
- **Animation State**: Manages player animation transitions
- **Stamina Management**: Handles player energy resources

### Important Functions

- **`initialize()`**: Sets up player sprite, physics, and initial state
- **`setupControls()`**: Configures keyboard input handlers
- **`setupAttackHandlers()`**: Sets up mouse input for attack actions
- **`handleAttack()`**: Processes attack inputs and triggers animations
- **`update()`**: Updates player state based on input and game conditions

## Client: `SceneManager.ts`

Manages the game environment including cameras, backgrounds, and scene elements.

### Key Components

- **Camera System**: Main and UI camera management
- **Background Elements**: Parallax background effects
- **Collision Objects**: Ground tiles and platforms

### Important Functions

- **`setupCameraFollow()`**: Configures camera to track the player
- **`updateCameraZoom()`**: Dynamically adjusts zoom based on player speed
- **`setUIIgnoreGameplay()`**: Separates UI and gameplay camera layers
- **`setupBackground()`**: Configures parallax scrolling effects
- **`setupBrowserEventHandlers()`**: Prevents default browser actions like space scrolling

## Client: `UIManager.ts`

Handles all user interface elements like health bars, timers, and skill icons.

### Key Components

- **Player Information**: Health, stamina, and name displays
- **Match Timer**: Visual countdown display
- **Skill Icons**: UI for player abilities

### Important Functions

- **`startMatchTimer()`**: Sets up the match timer display
- **`updateTimer()`**: Updates timer based on server messages
- **`setPlayerNames()`**: Updates player name displays
- **`getUIElements()`**: Returns all UI elements for camera configuration
- **`getSkillIcons()`**: Provides skill icon references for input feedback

## Client: `playerMovement.ts`

Utility module that handles detailed player movement mechanics.

### Key Components

- **Movement Logic**: Processing directional input
- **Animation Selection**: Choosing the right animation for player state
- **Stamina Integration**: Movement effects on stamina consumption

### Important Functions

- **`handlePlayerMovement()`**: Core function that processes all movement input
- Animation state detection (idle, walk, run, jump, crouch)
- Directional movement handling with speed variations
- Skill button feedback visualization

## Client: `staminaManager.ts`

Utility class that manages player energy resources.

### Key Components

- **Stamina State**: Tracking current and maximum stamina
- **Regeneration System**: Automatic stamina recovery
- **Visual Feedback**: UI display of stamina levels

### Important Functions

- **`useStamina()`**: Consumes stamina for player actions
- **`regenerateStamina()`**: Automatically recovers stamina over time
- **`hasEnoughStamina()`**: Checks if player can perform stamina-consuming actions
- **`updateStaminaDisplay()`**: Updates visual representation of stamina

## Communication Flow

1. Player inputs are processed by `PlayerManager`
2. State changes are sent to server via `MultiplayerManager`
3. Server in `index.ts` validates and broadcasts to opponents
4. Remote players receive updates through their `MultiplayerManager`
5. Visual representation is updated by each manager in their domain

This architecture separates concerns while maintaining a robust synchronization system for multiplayer gameplay.
