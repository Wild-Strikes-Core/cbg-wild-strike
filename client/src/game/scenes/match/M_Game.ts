// You can write more code here

/* START OF COMPILED CODE */

/* START-USER-IMPORTS */
/* END-USER-IMPORTS */
import { io, Socket } from "socket.io-client";
export default class M_Game extends Phaser.Scene {
    public cursors: any;
    public player: Phaser.GameObjects.Image;
    public socket: Socket;
    public playerId: string | undefined;
    public players: any = {};
    constructor() {
        super("M_Game");

        /* START-USER-CTR-CODE */
        // Write your code here.
        /* END-USER-CTR-CODE */
    }

    preload() {
        this.socket = io("http://localhost:3001");
    }

    editorCreate(): void {}

    /* START-USER-CODE */

    // Write your code here

    create() {
        this.playerId = this.socket.id;

        this.socket.on("currentPlayers", (serverPlayers) => {
            console.log(serverPlayers);

            this.players = serverPlayers;

            console.log(this.players);

            for (let id in this.players) {
                console.log(id);

                // this.players[id].sprite = this.add.sprite(
                //     this.players[id].x,
                //     this.players[id].y,
                //     "M_charTWO"
                // );
            }
        });

        this.socket.on("newPlayer", (newPlayer) => {
            console.log(newPlayer);

            if (this.socket.id == this.playerId) {
                this.add.sprite(newPlayer.x, newPlayer.y, "M_charTWO");
            } else {
                this.players[newPlayer.id] = {
                    x: newPlayer.x,
                    y: newPlayer.y,
                    sprite: this.add.sprite(
                        newPlayer.x,
                        newPlayer.y,
                        "M_charTWO"
                    ),
                };
            }
        });

        this.socket.on("playerDisconnected", (id) => {
            if (this.players[id]) {
                this.players[id].sprite.destroy();
                delete this.players[id];
            }
        });

        const x = Math.floor(Math.random() * 500) + 1;
        const y = Math.floor(Math.random() * 500) + 1;
        this.player = this.add.sprite(x, y, "M_charTWO");

        // this.socket.emit("newPlayer", { x, y });

        // this.player = this.add.sprite(x, y, "M_charTWO");

        // this.socket.emit("newPlayer", { x: 960, y: 528 });

        // this.socket.on("newPlayer", (player) => {
        //     this.players[player.id] = player;
        //     this.players[player.id].sprite = this.add.sprite(
        //         player.x,
        //         player.y,
        //         "M_charTWO"
        //     );
        // });

        // this.socket.on("playerMove", (player) => {
        //     if (this.players[player.id]) {
        //         this.players[player.id].sprite.setPosition(player.x, player.y);
        //     }
        // });

        // this.player.scaleX = 1.0264943761149121;
        // this.player.scaleY = 1.0264943761149121;
        // this.player.alpha = 0.3;
        // this.player.alphaTopLeft = 0.3;
        // this.player.alphaTopRight = 0.3;
        // this.player.alphaBottomLeft = 0.3;
        // this.player.alphaBottomRight = 0.3;

        // // image_2
        // const image_2 = this.add.image(1056, 960, "2M_land");
        // image_2.scaleX = 0.8021897715596248;
        // image_2.scaleY = 0.8021897715596248;

        // this.events.emit("scene-awake");

        // const char1 = this.add.image(544, 576, "M_charTWO");
        // char1.scaleX = 1.4199690280632038;
        // char1.scaleY = 1.4199690280632038;

        this.cursors = this.input.keyboard!.createCursorKeys();
    }

    update() {
        if (this.cursors.left.isDown) {
            const x = this.player.x - 5;
            const y = this.player.y;
            this.player.x = x;

            // this.socket.emit("message", { x, y });
        }

        if (this.cursors.right.isDown) {
            const x = this.player.x + 5;
            this.player.x = x;
            const y = this.player.y;

            // this.socket.emit("message", { x, y });
        }

        if (this.cursors.up.isDown) {
            const y = this.player.y - 5;
            const x = this.player.x;
            this.player.y = y;

            // this.socket.emit("message", { x, y });
        }

        if (this.cursors.down.isDown) {
            const y = this.player.y + 5;
            const x = this.player.x;
            this.player.y = y;

            // this.socket.emit("message", { x, y });
        }
        // else if (cursors.right.isDown)
        // {
        //     player.setVelocityX(160);

        //     player.anims.play('right', true);
        // }
        // else
        // {
        //     player.setVelocityX(0);

        //     player.anims.play('turn');
        // }

        // if (cursors.up.isDown && player.body.touching.down)
        // {
        //     player.setVelocityY(-330);
        // }
    }

    // update(time: number, delta: number) {
    // 	const { w, a, s, d } = this?.input?.keyboard?.;

    // 	// Reset velocity
    // 	this.player.setVelocity(0);

    // 	// WASD movement
    // 	if (w.isDown) this.player.setVelocityY(-this.speed);
    // 	if (s.isDown) this.player.setVelocityY(this.speed);
    // 	if (a.isDown) this.player.setVelocityX(-this.speed);
    // 	if (d.isDown) this.player.setVelocityX(this.speed);
    //   }

    /* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here

