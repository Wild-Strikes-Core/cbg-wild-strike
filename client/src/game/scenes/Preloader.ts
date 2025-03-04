// You can write more code here

/* START OF COMPILED CODE */

/* START-USER-IMPORTS */
/* END-USER-IMPORTS */

export default class Preloader extends Phaser.Scene {

	constructor() {
		super("Preloader");

		/* START-USER-CTR-CODE */
		// Write your code here.
		/* END-USER-CTR-CODE */
	}

	editorCreate(): void {

		this.events.emit("scene-awake");
	}

	/* START-USER-CODE */

	// Write your code here
    init ()
    {

		this.editorCreate();

        //  This is the progress bar itself. It will increase in size from the left based on the % of progress.
        const bar = this.add.rectangle(726, 524, 4, 28, 0xffffff)

        //  Use the 'progress' event emitted by the LoaderPlugin to update the loading bar
        this.load.on('progress', (progress: number) => {

            //  Update the progress bar (our bar is 464px wide, so 100% = 464px)
            bar.width = 4 + (460 * progress);

        });
    }

    preload ()
    {
        
        this.load.pack('gameMenu', 'assets/gameMenu-asset-pack.json');
        this.load.pack('landingPage', 'assets/landingPage-asset-pack.json');
        this.load.pack('settingsMenu', 'assets/settingsMenu-asset-pack.json');
      
        this.load.pack('listofteamsMenu','assets/listofteamsMenu-asset-pack.json');
        this.load.pack('victoryPage','assets/victoryPage-asset-pack.json');
        this.load.pack('defeatPage','assets/defeatPage-asset-pack.json');
        this.load.pack('drawPage','assets/drawPage-asset-pack.json');
      
        this.load.pack('aboutMenu', 'assets/aboutMenu-asset-pack.json');
        this.load.pack('invMenu', 'assets/invMenu-asset-pack.json');
        this.load.pack('leadMENU', 'assets/leadMENU-asset-pack.json');

        this.load.pack('selectTeam', 'assets/selectTeam-asset-pack.json');

        this.load.pack('matchMaking', 'assets/Match/matchMaking-asset-pack.json');
        this.load.pack('map', 'assets/Match/map-asset-pack.json');

        this.load.pack('sprite_heroP1', 'assets/Sprites/Hero_P1-pack.json');
        this.load.pack('tiles', 'assets/Match/02 - Map/tiles-asset-pack.json');

        
    }

    create ()
    {
        //  When all the assets have loaded, it's often worth creating global objects here that the rest of the game can use.
        //  For example, you can define global animations here, so we can use them in other scenes.

        //  Move to the MainMenu. You could also swap this for a Scene Transition, such as a camera fade.
        this.scene.start('LandingPage');
    }
    /* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
