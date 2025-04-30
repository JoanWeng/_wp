import { preloadAssets } from './preload.js';
import { createPlayer, updatePlayer } from './player.js';
import { createBoss } from './preload.js';
import { handleAttacks } from './attack.js';
import { setupCameraTransition } from './camera.js';

const config = {
  type: Phaser.AUTO,
  width: 3300,
  height: 1620,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 1000 },
      debug: true
    }
  },
  scene: {
    preload,
    create,
    update
  }
};

const game = new Phaser.Game(config);

function preload() {
  preloadAssets.call(this);
}

function create() {
  createPlayer.call(this);
  createBoss.call(this);
  setupCameraTransition.call(this);
}

function update() {
  updatePlayer.call(this);
  handleAttacks.call(this);
}
