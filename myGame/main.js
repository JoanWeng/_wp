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

let player;
let npc;
let bossBody;
let bossCollider;
let cursors;
let ground;
let wall;
let exitZone;
let leftExitBlock;
let rightExitBlock;

let moveSpeed = 120;
const baseSpeed = 120;
const maxSpeed = 550;
const accel = 5;
let isMoving = false;

let jumpKey;
let jumpForce = -350;
const baseJump = -350;
const maxJump = -500;
const jumpAccel = 3;
let isJumping = false;

let dashKey;
let canDash = true;
let isDashing = false;
let airDashUsed = false;

const dashSpeed = 1200;
const dashTime = 400;
const dashCooldown = 650;
let facingRight = true;

let attackBox;
let attackDebug;
let isAttacking = false;
let canAttack = true;
const attackDuration = 200; // 攻擊存在時間
const attackCooldown = 470; // 攻擊冷卻時間
let hasHit = false;

let inputEnabled = true;

function preload() {
  this.load.image('background', 'assets/background.png');
  this.load.spritesheet('player', 'assets/player.png', { frameWidth: 150, frameHeight: 380 });
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

  wall = this.physics.add.staticGroup();
  wall.create(3700, 1200, 'ground')
  .setDisplaySize(190, 2400)
  .refreshBody();

  wall.create(7905, 1200, 'ground')
  .setDisplaySize(190, 2400)
  .refreshBody();

  // --- 出入口偵測區 ---
  exitZone = this.physics.add.staticSprite(3655, 2590, null) // 剛好貼合出入口
  .setSize(100, 380)
  .setVisible(false);

  player = this.physics.add.sprite(800, 2640, 'player',);
  player.setCollideWorldBounds(true);
  player.health = 6;
  player.setDisplaySize(115,280);
  player.body.setOffset(0, 0);
  
  npc = this.physics.add.sprite(2700, 2650, 'npc');
  npc.setCollideWorldBounds(true);
  npc.setDisplaySize(110,260);

  // 建立 boss 物理實體：實際受重力與地板碰撞
  bossBody = this.physics.add.sprite(7000, 2605, 'boss');
  bossBody.setCollideWorldBounds(true);
  bossBody.setImmovable(false); // 可動，受重力
  bossBody.setDrag(Infinity, 0); // 水平不滑動
  bossBody.health = 50;
  bossBody.setDisplaySize(110,350);

  // 建立用來與 player 碰撞的 hitbox，不受重力影響
  bossCollider = this.physics.add.sprite(7000, 2605, 'boss');
  bossCollider.setImmovable(true); // 不會被推
  bossCollider.body.allowGravity = false; // 不受重力影響
  bossCollider.setVisible(false); // 不顯示圖像（僅碰撞用）
  bossCollider.body.setSize(110,350);

  // 建立攻擊區（無填色）
  attackBox = this.add.rectangle(0, 0, 400, 300);
  this.physics.add.existing(attackBox);
  attackBox.body.setAllowGravity(false);
  attackBox.body.setImmovable(true);
  attackBox.body.enable = false; // 初始不啟用
  attackBox.visible = false;     // 不顯示本體

  // Debug 邊框顯示用
  attackDebug = this.add.graphics();
  attackDebug.lineStyle(2, 0xff0000, 1);
  attackDebug.setVisible(false);
  
  this.physics.add.collider(bossBody, ground);
  this.physics.add.collider(player, bossCollider);
  this.physics.add.collider(player, ground);
  this.physics.add.collider(npc, ground);
  this.physics.add.collider(player, wall);
  this.physics.add.collider(bossBody, wall);
  
  this.physics.add.overlap(player, exitZone, onReachExit, null, this);
  this.physics.add.overlap(attackBox, bossBody, onAttackHitBoss, null, this);

  this.cameras.main.startFollow(player);

  cursors = this.input.keyboard.addKeys({ //.createCursorKeys() 改成方向鍵
    up: Phaser.Input.Keyboard.KeyCodes.W,
    left: Phaser.Input.Keyboard.KeyCodes.A,
    down: Phaser.Input.Keyboard.KeyCodes.S,
    right: Phaser.Input.Keyboard.KeyCodes.D
});
  jumpKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
  dashKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.L);
  attackKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.J);
}

function update() {
  if (!inputEnabled) return;

  isMoving = false;

  if (player.body.onFloor()) {
    airDashUsed = false;
  }
  
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
    if (jumpKey.isDown && player.body.onFloor() && !isJumping) {
      isJumping = true;
      jumpForce = baseJump;
      player.setVelocityY(jumpForce);
    }

    if (isJumping && jumpKey.isDown && player.body.velocity.y < 0) {
      if (jumpForce > maxJump) {
        jumpForce -= jumpAccel;
        player.setVelocityY(jumpForce);
      }
    }

    if (!jumpKey.isDown || player.body.velocity.y >= 0) {
      isJumping = false;
      jumpForce = baseJump;
    }
  }

  // 衝刺處理
  if (Phaser.Input.Keyboard.JustDown(dashKey) && canDash && !isDashing) {
    if (player.body.onFloor() || (!player.body.onFloor() && !airDashUsed)) {
      isDashing = true;
      canDash = false;
  
      if (!player.body.onFloor()) {
        airDashUsed = true; // 空中衝刺後，標記已使用
      }
  
      const dir = facingRight ? 1 : -1;
      player.setVelocityX(dir * dashSpeed);
  
      player.body.allowGravity = false;
      player.setVelocityY(0);
  
      setTimeout(() => {
        isDashing = false;
        player.body.allowGravity = true;
      }, dashTime);
  
      setTimeout(() => {
        canDash = true;
      }, dashCooldown);
    }
  }
  
  if (Phaser.Input.Keyboard.JustDown(attackKey) && canAttack && !isAttacking) {
    isAttacking = true;
    hasHit = false;
    canAttack = false; // 立刻進入冷卻狀態
  
    attackBox.body.enable = true;
    attackBox.visible = true;
    attackDebug.setVisible(true);
  
    // 攻擊框跟著角色動作，持續更新位置
    updateAttackBoxPosition();
  
    // 攻擊持續時間到，結束攻擊
    setTimeout(() => {
      isAttacking = false;
      attackBox.visible = false;
      attackBox.body.enable = false;
      attackDebug.clear();
      attackDebug.setVisible(false);
    }, attackDuration);
  
    // 冷卻時間到，允許再次攻擊
    setTimeout(() => {
      canAttack = true;
    }, attackCooldown);
  }
  updateAttackBoxPosition();

  
  // 每幀更新 bossCollider 跟隨 bossBody
  bossCollider.setPosition(bossBody.x, bossBody.y);
}

function updateAttackBoxPosition() {
  if (!isAttacking) return;

  let offsetX = 0;
  let offsetY = 0;
  const attackDistance = 60;

  if (cursors.up.isDown) {
    offsetY = - (player.height / 2 + attackBox.height / 2 + attackDistance);
  } else if (cursors.down.isDown) {
    offsetY = (player.height / 2 + attackBox.height / 2 + attackDistance);
  } else if (cursors.left.isDown || !facingRight) {
    offsetX = - (player.width / 2 + attackBox.width / 2 + attackDistance);
  } else if (cursors.right.isDown || facingRight) {
    offsetX = (player.width / 2 + attackBox.width / 2 + attackDistance);
  }

  attackBox.setPosition(player.x + offsetX, player.y + offsetY);
  attackBox.body.reset(attackBox.x, attackBox.y);

  attackDebug.clear();
  attackDebug.lineStyle(2, 0xff0000, 1);
  attackDebug.strokeRect(
    attackBox.getBounds().x,
    attackBox.getBounds().y,
    attackBox.width,
    attackBox.height
  );
}

function onAttackHitBoss(attack, boss) {
  if (!isAttacking || hasHit) return; // 已命中過就不再扣血

  boss.health -= 1;
  hasHit = true; // 本次攻擊已經命中

  bossFlash(boss);

  if (boss.health <= 0) {
    boss.disableBody(true, true);
  }
}

function bossFlash(boss) {
  let flashCount = 0;
  const flashMax = 4; // 閃爍次數（每次一亮一暗算一次）
  const flashInterval = 100; // 每次閃爍的間隔（毫秒）

  const flashTimer = setInterval(() => {
    boss.alpha = boss.alpha === 1 ? 0.3 : 1; // 在透明和正常之間切換
    flashCount++;

    if (flashCount >= flashMax) {
      clearInterval(flashTimer);
      boss.alpha = 1; // 最後恢復正常
    }
  }, flashInterval);
}

function onReachExit(player, zone) {
  // 只設定一次，避免重複觸發
  if (!this.cameras.main._reachedExit) {
    this.cameras.main._reachedExit = true;
    inputEnabled = false;
    player.setVelocity(0, 0);               // 停止移動與跳躍
    player.body.allowGravity = false;
    
    // 暫停攝影機跟隨（避免馬上跳回）
    this.cameras.main.stopFollow();
    // 改變攝影機活動範圍
    this.cameras.main.setBounds(3700, 0, 4200, 3000);

    // 延遲傳送與攝影機平移，讓引擎有時間處理
    this.time.delayedCall(0, () => {
      player.setPosition(5000, 2640);
      player.body.updateFromGameObject();

      this.cameras.main.pan(player.x + 1000, player.y, 800, 'Power2');

      this.time.delayedCall(1000, () => {
          this.cameras.main.startFollow(player);
          inputEnabled = true;
          player.body.allowGravity = true;
        });
      });

    // 建立左邊封門碰撞箱
    leftExitBlock = this.physics.add.staticSprite(3785, 2590, null)
      .setSize(20, 380)
      .setVisible(false);

    // 建立右邊封門碰撞箱
    rightExitBlock = this.physics.add.staticSprite(7820, 2590, null)
      .setSize(20, 380)
      .setVisible(false);

    this.physics.add.collider(player, leftExitBlock);
    this.physics.add.collider(player, rightExitBlock);
    this.physics.add.collider(bossBody, leftExitBlock);
    this.physics.add.collider(bossCollider, leftExitBlock);
    this.physics.add.collider(bossBody, rightExitBlock);
    this.physics.add.collider(bossCollider, rightExitBlock);
  }
}
