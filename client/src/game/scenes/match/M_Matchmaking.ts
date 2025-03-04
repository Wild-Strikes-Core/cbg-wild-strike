// You can write more code here

/* START OF COMPILED CODE */

/* START-USER-IMPORTS */
/* END-USER-IMPORTS */
import { SOCKET } from "@/socket";
import { io, Socket } from "socket.io-client";

export default class M_Matchmaking extends Phaser.Scene {
    socket!: Socket;

    constructor() {
        super("M_Matchmaking");
    }

    editorCreate(): void {
        const playerCharSprite = this.add.image(528, 608, "M_charONE");
        playerCharSprite.scaleX = 1.310153805177419;
        playerCharSprite.scaleY = 1.310153805177419;

        // image_3
        this.add.image(160, 176, "M_playerCard");

        // btnCancel
        const btnCancel = this.add.image(1424, 704, "M_btnCancel");
        btnCancel.scaleX = 1.419003049417908;
        btnCancel.scaleY = 1.419003049417908;

        // text_1
        const text_1 = this.add.text(1168, 416, "", {});
        text_1.scaleX = 1.4657553250177893;
        text_1.scaleY = 1.4657553250177893;
        text_1.text = "Finding a Match";
        text_1.setStyle({
            fontFamily: "Arial",
            fontSize: "48px",
            fontStyle: "bold",
        });

        // loader
        const loader = this.add.text(1392, 496, "", {});
        loader.scaleX = 1.4657553250177893;
        loader.scaleY = 1.4657553250177893;
        loader.text = "...";
        loader.setStyle({
            fontFamily: "Arial",
            fontSize: "48px",
            fontStyle: "bold",
        });

        // playerName
        const playerName = this.add.text(32, 144, "", {});
        playerName.text = "Player Naem";
        playerName.setStyle({
            align: "center",
            fontFamily: "Arial",
            fontSize: "64px",
            fontStyle: "bold",
        });

        this.playerCharSprite = playerCharSprite;
        this.btnCancel = btnCancel;
        this.loader = loader;
        this.playerName = playerName;

        this.events.emit("scene-awake");
    }

    private playerCharSprite!: Phaser.GameObjects.Image;
    private btnCancel!: Phaser.GameObjects.Image;
    private loader!: Phaser.GameObjects.Text;
    private playerName!: Phaser.GameObjects.Text;

    /* START-USER-CODE */

    // Write your code here

    create() {
        this.socket = SOCKET;
        this.socket.connect();

        this.editorCreate();

        // Set up camera fade-in entrance transition
        this.setupEntranceTransition();

        this.btnCancel.setInteractive();
        this.btnCancel.on("pointerdown", () => {
            this.cameras.main.fadeOut(180, 0, 0, 0);

            this.cameras.main.once("camerafadeoutcomplete", () => {
                this.tweens.add({
                    targets: this.btnCancel,
                    scale: "*=0.9",
                    duration: 100,
                    yoyo: true,
                    onComplete: () => {
                        this.scene.start("MainMenu");
                    },
                });
            });
        });

        this.btnCancel.on("pointerover", () => {
            this.btnCancel.setTint(0xffff66);
        });

        this.btnCancel.on("pointerout", () => {
            this.btnCancel.clearTint();
        });

        this.socket.emit("findMatch");

        this.socket.on("matchFound", (data) => {
            this.cameras.main!.fadeOut(400, 0, 0, 0);
            this.cameras.main.once("camerafadeoutcomplete", () => {
                this.scene.start("M_MatchFound");
            });
        });

        let dots = [".", "..", "..."];
        let index = 0;

        this.time.addEvent({
            delay: 250, // Update every 200ms
            callback: () => {
                this.loader.text = dots[index];
                index = (index + 1) % dots.length;
            },
        });

        // this.fakeLoad(5);
    }

    // Create a smooth camera fade-in entrance transition
    setupEntranceTransition() {
        // Start with black screen
        this.cameras.main.fadeIn(800, 0, 0, 0, (_: any, progress: any) => {
            // Custom cubic easing for smoother fade-in
            // This applies a cubic ease-in curve to the default linear camera fade
            const easedProgress = Math.pow(progress, 3);
            this.cameras.main.setAlpha(easedProgress);
        });
    }

    private fakeLoad(seconds: integer) {
        let dots = [".", "..", "..."];
        let index = 0;

        let timer = this.time.addEvent({
            delay: 250, // Update every 200ms
            repeat: seconds * 4 - 1, // Repeat for the given duration in 200ms intervals
            callback: () => {
                this.loader.text = dots[index];
                index = (index + 1) % dots.length;
            },
        });

        this.time.delayedCall(seconds * 1000, () => {
            // Delay more than IDUNNOms of the tweens duration
            this.cameras.main.fadeOut(400, 0, 0, 0);
            this.cameras.main.once("camerafadeoutcomplete", () => {
                this.scene.start("M_MatchFound");
            });
        });
    }

    /* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here

