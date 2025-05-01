// config.js - 遊戲配置和初始化

import MainScene from './scenes/mainScene.js';

// 遊戲配置
const config = {
  type: Phaser.AUTO,
  width: 1920,
  height: 1080,
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
  scene: MainScene
};

// 初始化遊戲
const game = new Phaser.Game(config);

export default game;