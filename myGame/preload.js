export function preloadAssets() {
    this.load.image('background', 'assets/background.png');
    this.load.spritesheet('player', 'assets/player.png', { frameWidth: 150, frameHeight: 380 });
    this.load.image('npc', 'assets/npc.png');
    this.load.image('boss', 'assets/boss.png');
    this.load.image('ground', 'assets/ground.png');
  }