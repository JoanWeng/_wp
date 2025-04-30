// player.js
let player, cursors, jumpKey, dashKey, attackKey;
let moveSpeed = 120, baseSpeed = 120, maxSpeed = 550, accel = 5;
let isMoving = false;
let jumpForce = -350, baseJump = -350, maxJump = -500, jumpAccel = 3, isJumping = false;
let canDash = true, isDashing = false, airDashUsed = false;
let facingRight = true;
export function createPlayer() {
  player = this.physics.add.sprite(800, 2640, 'player');
  player.setCollideWorldBounds(true);
  player.setDisplaySize(100, 330);
  this.cameras.main.startFollow(player);
  cursors = this.input.keyboard.addKeys({ up: Phaser.Input.Keyboard.KeyCodes.W, left: Phaser.Input.Keyboard.KeyCodes.A, down: Phaser.Input.Keyboard.KeyCodes.S, right: Phaser.Input.Keyboard.KeyCodes.D });
  jumpKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
  dashKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.L);
  attackKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.J);
  this.physics.add.collider(player, this.ground);
}

export function updatePlayer() {
  if (!player.body) return;
  isMoving = false;
  if (player.body.onFloor()) airDashUsed = false;
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
    moveSpeed = isMoving ? Math.min(moveSpeed + accel, maxSpeed) : baseSpeed;
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
  if (Phaser.Input.Keyboard.JustDown(dashKey) && canDash && !isDashing) {
    if (player.body.onFloor() || (!player.body.onFloor() && !airDashUsed)) {
      isDashing = true;
      canDash = false;
      if (!player.body.onFloor()) airDashUsed = true;
      const dir = facingRight ? 1 : -1;
      player.setVelocityX(dir * 1200);
      player.body.allowGravity = false;
      player.setVelocityY(0);
      setTimeout(() => {
        isDashing = false;
        player.body.allowGravity = true;
      }, 400);
      setTimeout(() => {
        canDash = true;
      }, 650);
    }
  }
}