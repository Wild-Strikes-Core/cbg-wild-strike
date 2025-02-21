<script setup lang="ts">
import { ref, toRaw } from 'vue';
// import type { LandingPage } from './game/scenes/LandingPage';
import type { GameMenu } from './game/scenes/GameMenu';
import PhaserGame from './game/PhaserGame.vue';

// The sprite can only be moved in the MainMenu Scene
const canMoveSprite = ref();

//  References to the PhaserGame component (game and scene are exposed)
const phaserRef = ref();

const changeScene = () => {

    const scene = toRaw(phaserRef.value.scene) as GameMenu;

    if (scene)
    {
        //  Call the changeScene method defined in the `MainMenu`, `Game` and `GameOver` Scenes
        scene.changeScene();
    }

}


// Event emitted from the PhaserGame component
const currentScene = (scene: GameMenu) => {

    canMoveSprite.value = (scene.scene.key !== "GameMenu");

}

</script>

<template>
    <PhaserGame ref="phaserRef" @current-active-scene="currentScene" />
    <div>
        <div>
            <button class="button" @click="changeScene">Change Scene</button>
        </div>
    </div>
</template>