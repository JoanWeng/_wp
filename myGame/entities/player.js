// entities/player.js - 玩家相關邏輯

import { entities, movement, controls, gameFlow } from '../gameState.js';

/**
 * 創建玩家
 * @param {Phaser.Scene} scene - 當前場景
 */
export function createPlayer(scene) {
  // 建立玩家精靈
  entities.player = scene.physics.add.sprite(800, 2640, 'player');
  entities.player.setCollideWorldBounds(true);
  entities.player.health = 6;
  entities.player.setDisplaySize(105, 330);
  entities.player.body.setOffset(0, 0);

  // 可以在這裡添加玩家的動畫設定
  // setupPlayerAnimations(scene);
}

/**
 * 處理玩家的移動、跳躍和衝刺
 * @param {Phaser.Scene} scene - 當前場景
 */
export function handlePlayerMovement(scene) {
  // 重設移動狀態
  movement.isMoving = false;

  // 著地時重設空中衝刺狀態
  if (entities.player.body.onFloor()) {
    movement.dash.airUsed = false;
  }
  
  // 非衝刺狀態下處理基本移動
  if (!movement.dash.isActive) {
    entities.player.setVelocityX(0);
    handleBasicMovement();
    handleJump();
  }
  
  // 處理衝刺
  handleDash(scene);
}

/**
 * 處理基本左右移動
 */
function handleBasicMovement() {
  if (controls.cursors.left.isDown) {
    movement.isMoving = true;
    movement.facingRight = false;
    entities.player.setVelocityX(-movement.speed.current);
  } else if (controls.cursors.right.isDown) {
    movement.isMoving = true;
    movement.facingRight = true;
    entities.player.setVelocityX(movement.speed.current);
  }

  // 移動時速度逐漸增加
  if (movement.isMoving) {
    if (movement.speed.current < movement.speed.max) {
      movement.speed.current += movement.speed.accel;
      if (movement.speed.current > movement.speed.max) {
        movement.speed.current = movement.speed.max;
      }
    }
  } else {
    // 未移動時重設速度
    movement.speed.current = movement.speed.base;
  }
}

/**
 * 處理跳躍邏輯
 */
function handleJump() {
  // 初始跳躍
  if (controls.jumpKey.isDown && entities.player.body.onFloor() && !movement.jump.isActive) {
    movement.jump.isActive = true;
    movement.jump.force = movement.jump.base;
    entities.player.setVelocityY(movement.jump.force);
  }

  // 長按跳躍增強
  if (movement.jump.isActive && controls.jumpKey.isDown && entities.player.body.velocity.y < 0) {
    if (movement.jump.force > movement.jump.max) {
      movement.jump.force -= movement.jump.accel;
      entities.player.setVelocityY(movement.jump.force);
    }
  }

  // 鬆開跳躍鍵或下落時結束跳躍狀態
  if (!controls.jumpKey.isDown || entities.player.body.velocity.y >= 0) {
    movement.jump.isActive = false;
    movement.jump.force = movement.jump.base;
  }
}

/**
 * 處理衝刺邏輯
 * @param {Phaser.Scene} scene - 當前場景
 */
function handleDash(scene) {
  if (Phaser.Input.Keyboard.JustDown(controls.dashKey) && movement.dash.canUse && !movement.dash.isActive) {
    // 只有在地面上或空中未使用過衝刺時才允許衝刺
    if (entities.player.body.onFloor() || (!entities.player.body.onFloor() && !movement.dash.airUsed)) {
      movement.dash.isActive = true;
      movement.dash.canUse = false;
  
      // 如果是空中衝刺，標記已使用
      if (!entities.player.body.onFloor()) {
        movement.dash.airUsed = true;
      }
  
      // 設定衝刺方向和速度
      const direction = movement.facingRight ? 1 : -1;
      entities.player.setVelocityX(direction * movement.dash.speed);
  
      // 衝刺時暫時關閉重力和垂直速度
      entities.player.body.allowGravity = false;
      entities.player.setVelocityY(0);
  
      // 衝刺結束後恢復重力
      scene.time.delayedCall(movement.dash.duration, () => {
        movement.dash.isActive = false;
        entities.player.body.allowGravity = true;
      });
  
      // 衝刺冷卻結束後允許再次衝刺
      scene.time.delayedCall(movement.dash.cooldown, () => {
        movement.dash.canUse = true;
      });
    }
  }
}

/**
 * 設置玩家動畫 (如果需要的話)
 * @param {Phaser.Scene} scene - 當前場景
 */
function setupPlayerAnimations(scene) {
  // 這裡可以添加玩家的動畫設定
  // 例如：
  /*
  scene.anims.create({
    key: 'player-idle',
    frames: scene.anims.generateFrameNumbers('player', { start: 0, end: 3 }),
    frameRate: 8,
    repeat: -1
  });
  
  scene.anims.create({
    key: 'player-run',
    frames: scene.anims.generateFrameNumbers('player', { start: 4, end: 11 }),
    frameRate: 12,
    repeat: -1
  });
  */
}