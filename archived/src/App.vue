<script setup lang="ts">
import Phaser from 'phaser';
import { ref, toRaw } from 'vue';
import  LandingPage from './game/scenes/LandingPage';
import PhaserGame from './game/PhaserGame.vue';

// The sprite can only be moved in the LandingPage Scene
const canMoveSprite = ref();

//  References to the PhaserGame component (game and scene are exposed)
const phaserRef = ref();


const changeScene = () => {

    const scene = toRaw(phaserRef.value.scene) as LandingPage;

    if (scene)
    {
        //  Call the changeScene method defined in the `LandingPage`, `Game` and `GameOver` Scenes
        scene.changeScene();
    }

}



// Event emitted from the PhaserGame component
const currentScene = (scene: LandingPage) => {

    canMoveSprite.value = (scene.scene.key !== "LandingPage");

}

</script>

<template>
    <PhaserGame ref="phaserRef" @current-active-scene="currentScene" />
    <div>
        <!-- Removed the change scene button -->
    </div>
</template>
