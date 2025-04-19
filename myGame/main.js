const config = {
  type: Phaser.AUTO,
  width: 2800,
  height: 1350,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 1000 }, // ✅ 加入重力
      debug: false
    }
  },
  scene: {
    preload,
    create,
    update
  }
};

const game = new Phaser.Game(config);

let player;
let cursors;
let ground;

function preload() {
  this.load.image('background', 'assets/background.png');
  this.load.image('player', 'assets/player.png');
  this.load.image('ground', 'assets/ground.png'); // ✅ 新增地板圖
}

function create() {
  this.cameras.main.setBounds(0, 0, 8000, 3000);
  this.physics.world.setBounds(0, 0, 8000, 3000);

  this.add.image(0, 0, 'background').setOrigin(0);

  // ✅ 加入地板
  ground = this.physics.add.staticGroup();
  ground.create(4000, 3000 - 110, 'ground') // 放在底部（中心對齊）
    .setDisplaySize(8000, 220) // 設定寬度與高度
    .refreshBody(); // 告訴 physics 更新碰撞區域

  // ✅ 玩家
  player = this.physics.add.sprite(100, 100, 'player');
  player.setCollideWorldBounds(true);

  // ✅ 鏡頭跟隨
  this.cameras.main.startFollow(player);

  // ✅ 玩家與地板碰撞
  this.physics.add.collider(player, ground);

  cursors = this.input.keyboard.createCursorKeys();
}

function update() {
  const speed = 300;

  player.setVelocityX(0);

  if (cursors.left.isDown) {
    player.setVelocityX(-speed);
  } else if (cursors.right.isDown) {
    player.setVelocityX(speed);
  }

  if (cursors.up.isDown && player.body.touching.down) {
    player.setVelocityY(-500); // 跳躍
  }
}
