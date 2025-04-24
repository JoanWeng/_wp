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

let player;
let npc;
let bossBody;
let bossCollider;
let cursors;
let ground;

let moveSpeed = 120;
const baseSpeed = 120;
const maxSpeed = 480;
const accel = 5;
let isMoving = false;

let jumpForce = -350;
const baseJump = -350;
const maxJump = -480;
const jumpAccel = 3;
let isJumping = false;

let dashKey;
let canDash = true;
let isDashing = false;
const dashSpeed = 800;
const dashTime = 400;
const dashCooldown = 700;
let facingRight = true;

let attackBox;
let isAttacking = false;

function preload() {
  this.load.image('background', 'assets/background.png');
  this.load.image('player', 'assets/player.png');
  this.load.image('npc', 'assets/npc.png');
  this.load.image('boss', 'assets/boss.png');
  this.load.image('ground', 'assets/ground.png');
}

function create() {
  this.cameras.main.setBounds(0, 0, 8000, 3000);
  this.physics.world.setBounds(0, 0, 8000, 3000);

  this.add.image(0, 0, 'background').setOrigin(0);

  
  ground = this.physics.add.staticGroup();
  ground.create(4000, 2890, 'ground') // 放在底部（中心對齊）
    .setDisplaySize(8000, 220) // 設定寬度與高度
    .refreshBody(); // 告訴 physics 更新碰撞區域

  
  player = this.physics.add.sprite(800, 2765, 'player');
  player.setCollideWorldBounds(true);
  player.health = 6;
  
  npc = this.physics.add.sprite(3000, 2765, 'npc');
  npc.setCollideWorldBounds(true);
  
  // 建立 boss 物理實體：實際受重力與地板碰撞
  bossBody = this.physics.add.sprite(7000, 2765, 'boss');
  bossBody.setCollideWorldBounds(true);
  bossBody.setImmovable(false); // 可動，受重力
  bossBody.setDrag(Infinity, 0); // 水平不滑動
  bossBody.health = 50; // 設定 boss 血量為 50

  // 建立用來與 player 碰撞的 hitbox，不受重力影響
  bossCollider = this.physics.add.sprite(7000, 2765, 'boss');
  bossCollider.setImmovable(true); // 不會被推
  bossCollider.body.allowGravity = false; // 不受重力影響
  bossCollider.setVisible(false); // 不顯示圖像（僅碰撞用）

  attackBox = this.add.rectangle(0, 0, 400, 300, 0xff0000, 0.3); // 半透明紅色
  this.physics.add.existing(attackBox);
  attackBox.body.setAllowGravity(false);
  attackBox.body.setImmovable(true);
  attackBox.setVisible(false); // 預設不顯示
  
  this.physics.add.collider(bossBody, ground);
  this.physics.add.collider(player, bossCollider);
  this.physics.add.collider(player, ground);
  this.physics.add.collider(npc, ground);


  this.cameras.main.startFollow(player);

  cursors = this.input.keyboard.createCursorKeys();
  dashKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.L);

}

function update() {
  isMoving = false;

  // 禁止在衝刺時干擾速度（地面與空中）
  if (!isDashing) {
    player.setVelocityX(0);

    if (cursors.left.isDown) {
      isMoving = true;
      facingRight = false;
      player.setVelocityX(-moveSpeed);
    } else if (cursors.right.isDown) {
      isMoving = true;
      facingRight = true;
      player.setVelocityX(moveSpeed);
    }

    if (isMoving) {
      if (moveSpeed < maxSpeed) {
        moveSpeed += accel;
        if (moveSpeed > maxSpeed) moveSpeed = maxSpeed;
      }
    } else {
      moveSpeed = baseSpeed;
    }

    // 跳躍處理
    if (cursors.up.isDown && player.body.onFloor() && !isJumping) {
      isJumping = true;
      jumpForce = baseJump;
      player.setVelocityY(jumpForce);
    }

    if (isJumping && cursors.up.isDown && player.body.velocity.y < 0) {
      if (jumpForce > maxJump) {
        jumpForce -= jumpAccel;
        player.setVelocityY(jumpForce);
      }
    }

    if (!cursors.up.isDown || player.body.velocity.y >= 0) {
      isJumping = false;
      jumpForce = baseJump;
    }
  }

  // 衝刺處理（空中或地面皆可）
  if (Phaser.Input.Keyboard.JustDown(dashKey) && canDash && !isDashing) {
    isDashing = true;
    canDash = false;

    const dir = facingRight ? 1 : -1;
    player.setVelocityX(dir * dashSpeed);

    // 暫停重力 → 避免上升或掉落
    player.body.allowGravity = false;
    player.setVelocityY(0); // 停止 Y 軸動作

    // 衝刺結束
    setTimeout(() => {
      isDashing = false;
      player.body.allowGravity = true;
    }, dashTime);

    // 冷卻結束
    setTimeout(() => {
      canDash = true;
    }, dashCooldown);
  }

  if (Phaser.Input.Keyboard.JustDown(dashKey)) {
    isAttacking = true;
    attackBox.setVisible(true);
  
    let offsetX = 0;
    let offsetY = 0;
  
    // 根據方向設定攻擊框位置
    if (cursors.up.isDown) {
      offsetY = -attackBox.height / 2;
    } else if (cursors.down.isDown) {
      offsetY = attackBox.height / 2;
    } else if (cursors.left.isDown || !facingRight) {
      offsetX = -attackBox.width / 2;
    } else if (cursors.right.isDown || facingRight) {
      offsetX = attackBox.width / 2;
    }
  
    attackBox.setPosition(player.x + offsetX, player.y + offsetY);
    attackBox.body.reset(attackBox.x, attackBox.y);
  
    // 設定顯示時間
    setTimeout(() => {
      isAttacking = false;
      attackBox.setVisible(false);
    }, 200);
  }
  
  console.log("Attack triggered at", attackBox.x, attackBox.y);

  // 每幀更新 bossCollider 跟隨 bossBody
  bossCollider.setPosition(bossBody.x, bossBody.y);
}
