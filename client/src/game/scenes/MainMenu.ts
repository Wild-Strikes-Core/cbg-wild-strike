// You can write more code here

/* START OF COMPILED CODE */

/* START-USER-IMPORTS */
import bgClouds from "../../components/bgClouds";
/* END-USER-IMPORTS */

export default class MainMenu extends Phaser.Scene {
    constructor() {
        super("MainMenu");

        /* START-USER-CTR-CODE */
        // Write your code here.
        /* END-USER-CTR-CODE */
    }

    editorCreate(): void {
        // bgClouds
        const bgClouds = this.add.layer();
        bgClouds.blendMode = Phaser.BlendModes.SKIP_CHECK;

        // menuBTNS_1
        const menuBTNS_1 = this.add.layer();
        menuBTNS_1.blendMode = Phaser.BlendModes.SKIP_CHECK;

        // leaderboardsContainer
        const leaderboardsContainer = this.add.image(
            464,
            544,
            "2G_btnsBackground"
        );
        leaderboardsContainer.scaleX = 2.2795097751295637;
        leaderboardsContainer.scaleY = 2.2795097751295637;
        menuBTNS_1.add(leaderboardsContainer);

        // btnARENA
        const btnARENA = this.add.image(1392, 592, "2G_btnArena");
        btnARENA.scaleX = 1.4346425946756112;
        btnARENA.scaleY = 1.4346425946756112;
        menuBTNS_1.add(btnARENA);

        // btnABOUT
        const btnABOUT = this.add.image(1536, 960, "2G_btnAbout");

        // btnWARRIORS
        const btnWARRIORS = this.add.image(1232, 960, "2G_btnWarriors");

        // nameContainer
        const nameContainer = this.add.image(464, 208, "2G_Player_Name_Card");
        nameContainer.scaleX = 0.8582378709610599;
        nameContainer.scaleY = 0.8582378709610599;

        // playerName
        const playerName = this.add.text(272, 176, "", {});
        playerName.text = "Player Naem";
        playerName.setStyle({
            align: "center",
            fontFamily: "Arial",
            fontSize: "64px",
            fontStyle: "bold",
        });

        this.leaderboardsContainer = leaderboardsContainer;
        this.btnARENA = btnARENA;
        this.btnABOUT = btnABOUT;
        this.btnWARRIORS = btnWARRIORS;
        this.nameContainer = nameContainer;
        this.playerName = playerName;

        this.events.emit("scene-awake");
    }

    private leaderboardsContainer!: Phaser.GameObjects.Image;
    private btnARENA!: Phaser.GameObjects.Image;
    private btnABOUT!: Phaser.GameObjects.Image;
    private btnWARRIORS!: Phaser.GameObjects.Image;
    private nameContainer!: Phaser.GameObjects.Image;
    private playerName!: Phaser.GameObjects.Text;

    /* START-USER-CODE */
    logoTween: Phaser.Tweens.Tween | null;
    private clouds: bgClouds[] = [];

    // Write your code here
    create() {
        this.editorCreate();

        // Create a flashy entrance transition for the scene
        this.createSceneEntrance();

        // Set up initial states for all UI components
        const buttons = [this.btnARENA, this.btnABOUT, this.btnWARRIORS];

        // Set initial state for all UI elements with more dynamic starting positions
        buttons.forEach((button, index) => {
            button.originalY = button.y;
            button.originalX = button.x;

            // Randomize starting positions for more dynamic feel
            const direction = index % 2 === 0 ? 1 : -1;
            button.x += 50 * direction;
            button.y += 200;
            button.setAlpha(0);
            button.setScale(button.scaleX * 0.7, button.scaleY * 0.7);
        });

        // Set initial state for player name card - shrink from center
        this.nameContainer.originalY = this.nameContainer.y;
        this.nameContainer.setAlpha(0.5);
        this.nameContainer.setScale(
            this.nameContainer.scaleX * 0.5,
            this.nameContainer.scaleY * 0.5
        );

        // Player name starts invisible
        this.playerName.originalY = this.playerName.y;
        this.playerName.setAlpha(0);

        // Leaderboards container starts smaller and rotated slightly
        this.leaderboardsContainer.originalX = this.leaderboardsContainer.x;
        this.leaderboardsContainer.setAlpha(0.3);
        this.leaderboardsContainer.rotation = -0.05;
        this.leaderboardsContainer.setScale(
            this.leaderboardsContainer.scaleX * 0.8,
            this.leaderboardsContainer.scaleY * 0.8
        );

        // Animate everything almost simultaneously with offset timing

        // Fast camera fade-in
        this.cameras.main.fadeIn(250, 0, 0, 0);

        // Animate the name container first - quick pop-in
        this.tweens.add({
            targets: this.nameContainer,
            scaleX: this.nameContainer.scaleX / 0.5,
            scaleY: this.nameContainer.scaleY / 0.5,
            alpha: 1,
            duration: 300,
            ease: "Back.out(1.8)", // More pronounced pop effect
            onComplete: () => {
                // Once container is in, quickly fade in the name text with a slight scale effect
                this.tweens.add({
                    targets: this.playerName,
                    alpha: 1,
                    duration: 200,
                    ease: "Sine.easeOut",
                });
            },
        });

        // Almost immediately animate the leaderboards container
        this.time.delayedCall(100, () => {
            this.tweens.add({
                targets: this.leaderboardsContainer,
                scaleX: this.leaderboardsContainer.scaleX / 0.8,
                scaleY: this.leaderboardsContainer.scaleY / 0.8,
                rotation: 0,
                alpha: 1,
                duration: 350,
                ease: "Back.out(1.2)",
            });
        });

        // Animate buttons with quick sequential stagger
        this.time.delayedCall(150, () => {
            buttons.forEach((button, index) => {
                this.tweens.add({
                    targets: button,
                    x: button.originalX,
                    y: button.originalY,
                    scaleX: button.scaleX / 0.7,
                    scaleY: button.scaleY / 0.7,
                    alpha: 1,
                    delay: index * 60, // Very short stagger for quick sequence
                    duration: 350,
                    ease: "Back.out(1.7)", // More dynamic bounce
                    onComplete: () => {
                        // Add subtle hover animation once in place
                        this.tweens.add({
                            targets: button,
                            y: button.originalY - 5,
                            duration: 1200,
                            yoyo: true,
                            repeat: -1,
                            ease: "Sine.easeInOut",
                        });
                    },
                });
            });
        });

        // Standard button interaction for hover effects
        const setupButtonBase = (button: Phaser.GameObjects.Image) => {
            button
                .setInteractive({ cursor: "pointer" })
                .on("pointerover", () => {
                    button.setTint(0xffff66);
                    // Scale up the button slightly on hover
                    this.tweens.add({
                        targets: button,
                        scaleX: button.scaleX * 1.1,
                        scaleY: button.scaleY * 1.1,
                        duration: 100,
                    });
                })
                .on("pointerout", () => {
                    button.clearTint();
                    // Scale back to normal size
                    this.tweens.add({
                        targets: button,
                        scaleX: button.scaleX / 1.1,
                        scaleY: button.scaleY / 1.1,
                        duration: 100,
                    });
                });
        };

        // Dynamic "Strike" transition for Arena button
        const setupArenaTransition = () => {
            setupButtonBase(this.btnARENA);

            this.btnARENA.on("pointerdown", () => {
                // Disable further interactions during transition
                buttons.forEach((b) => b.disableInteractive());

                // Flash effect on the button
                this.tweens.add({
                    targets: this.btnARENA,
                    alpha: { from: 1, to: 0.3 },
                    yoyo: true,
                    duration: 80,
                    repeat: 1,
                    onComplete: () => {
                        // Energetic pulse and zoom effect
                        this.tweens.add({
                            targets: this.btnARENA,
                            scaleX: this.btnARENA.scaleX * 1.3,
                            scaleY: this.btnARENA.scaleY * 1.3,
                            alpha: 0,
                            duration: 300,
                            ease: "Back.easeIn",
                            onComplete: () => {
                                // Create a white flash overlay for the "strike" effect
                                const flash = this.add.rectangle(
                                    this.cameras.main.centerX,
                                    this.cameras.main.centerY,
                                    this.cameras.main.width * 2,
                                    this.cameras.main.height * 2,
                                    0xffffff
                                );
                                flash.alpha = 0;
                                flash.depth = 1000;

                                // Add camera shake for impact
                                this.cameras.main.shake(200, 0.01);

                                // Flash then fade to black
                                this.tweens.add({
                                    targets: flash,
                                    alpha: { from: 0, to: 0.8 },
                                    duration: 100,
                                    yoyo: true,
                                    onComplete: () => {
                                        // Create a circular mask that will reveal the next scene
                                        const circle = this.add.circle(
                                            this.btnARENA.x,
                                            this.btnARENA.y,
                                            50,
                                            0x000000
                                        );
                                        circle.depth = 999;

                                        // Expand the circle to create a reveal effect
                                        this.tweens.add({
                                            targets: circle,
                                            radius: 1500,
                                            duration: 600,
                                            ease: "Cubic.easeIn",
                                            onComplete: () => {
                                                this.time.delayedCall(
                                                    1000,
                                                    () => {
                                                        this.scene.start(
                                                            "M_Matchmaking"
                                                        );
                                                    }
                                                );
                                            },
                                        });
                                    },
                                });
                            },
                        });
                    },
                });
            });
        };

        // Casual transition for secondary buttons
        const setupCasualTransition = (
            button: Phaser.GameObjects.Image,
            targetScene: string
        ) => {
            setupButtonBase(button);

            button.on("pointerdown", () => {
                // Disable further interactions during transition
                buttons.forEach((b) => b.disableInteractive());

                // Gentle pulse animation
                this.tweens.add({
                    targets: button,
                    scale: "*=1.1",
                    duration: 100,
                    yoyo: true,
                    onComplete: () => {
                        // Create a smooth slide and fade transition
                        this.tweens.add({
                            targets: buttons,
                            y: "+=50",
                            alpha: 0,
                            duration: 400,
                            ease: "Sine.easeInOut",
                        });

                        // Fade out the scene
                        this.tweens.add({
                            targets: this.cameras.main,
                            alpha: 0,
                            duration: 800,
                            ease: "Sine.easeInOut",
                            onComplete: () => {
                                this.scene.start(targetScene);
                            },
                        });
                    },
                });
            });
        };

        if (this.textures.exists("2G_bgClouds_2")) {
            // Second cloud a bit lower
            const movingClouds2 = new bgClouds(this, 1200, 450);
            this.add.existing(movingClouds2);
            movingClouds2.speed = 30; // Slower speed for parallax effect

            // Third cloud
            const movingClouds3 = new bgClouds(this, 900, 200);
            this.add.existing(movingClouds3);
            movingClouds3.speed = 40;
        } else {
            console.warn(
                "Cloud texture '2G_bgClouds_2' not found. Clouds will not be displayed."
            );
        }

        // Apply the appropriate transition to each button
        setupArenaTransition();
        setupCasualTransition(this.btnABOUT, "GM_About");
        setupCasualTransition(this.btnWARRIORS, "GM_Warriors");
    }

    // Create a simple entrance effect for the scene
    createSceneEntrance() {
        // Create a black overlay that will fade out
        const overlay = this.add.rectangle(
            this.cameras.main.centerX,
            this.cameras.main.centerY,
            this.cameras.main.width * 2,
            this.cameras.main.height * 2,
            0x000000
        );
        overlay.depth = 1000;
        overlay.alpha = 1;

        // Simple fade out animation
        this.tweens.add({
            targets: overlay,
            alpha: 0,
            duration: 500,
            ease: "Linear",
            onComplete: () => {
                overlay.destroy();
            },
        });
    }

    changeScene() {
        this.scene.start("LandingPage");
    }
    /* END-USER-CODE */
}

/* END OF COMPILED CODE */

