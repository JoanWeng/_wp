// utils/attackSystem.js - 攻擊系統邏輯

import { entities, combat, controls } from '../gameState.js';

/**
 * 創建攻擊系統
 * @param {Phaser.Scene} scene - 當前場景
 */
export function createAttackSystem(scene) {
  // 建立攻擊區（無填色）
  combat.attackBox = scene.add.rectangle(0, 0, 400, 300);
  scene.physics.add.existing(combat.attackBox);
  combat.attackBox.body.setAllowGravity(false);
  combat.attackBox.body.setImmovable(true);
  combat.attackBox.body.enable = false; // 初始不啟用
  combat.attackBox.visible = false;     // 不顯示本體

  // Debug 邊框顯示用
  combat.attackDebug = scene.add.graphics();
  combat.attackDebug.lineStyle(2, 0xff0000, 1);
  combat.attackDebug.setVisible(false);
}

/**
 * 更新攻擊框位置，讓它跟隨玩家方向
 */
export function updateAttackBoxPosition() {
  if (!combat.isAttacking) return;

  let offsetX = 0;
  let offsetY = 0;
  const attackDistance = 60;

  // 根據按鍵方向決定攻擊框位置
  if (controls.cursors.up.isDown) {
    // 向上攻擊
    offsetY = -(entities.player.height / 2 + combat.attackBox.height / 2 + attackDistance);
  } else if (controls.cursors.down.isDown) {
    // 向下攻擊
    offsetY = (entities.player.height / 2 + combat.attackBox.height / 2 + attackDistance);
  } else if (controls.cursors.left.isDown || (entities.player.flipX === true)) {
    // 向左攻擊
    offsetX = -(entities.player.width / 2 + combat.attackBox.width / 2 + attackDistance);
  } else if (controls.cursors.right.isDown || (entities.player.flipX === false)) {
    // 向右攻擊
    offsetX = (entities.player.width / 2 + combat.attackBox.width / 2 + attackDistance);
  }

  // 設置攻擊框位置
  combat.attackBox.setPosition(entities.player.x + offsetX, entities.player.y + offsetY);
  combat.attackBox.body.reset(combat.attackBox.x, combat.attackBox.y);

  // 更新debug視覺效果
  updateAttackDebugGraphics();
}

/**
 * 更新攻擊框的Debug視覺效果
 */
function updateAttackDebugGraphics() {
  combat.attackDebug.clear();
  combat.attackDebug.lineStyle(2, 0xff0000, 1);
  combat.attackDebug.strokeRect(
    combat.attackBox.getBounds().x,
    combat.attackBox.getBounds().y,
    combat.attackBox.width,
    combat.attackBox.height
  );
}

/**
 * 設置不同類型的攻擊 (預留擴展用)
 * @param {string} attackType - 攻擊類型
 * @param {Phaser.Scene} scene - 當前場景
 */
export function setAttackType(attackType, scene) {
  // 這裡可以根據不同的攻擊類型設置不同的攻擊屬性
  // 例如：輕攻擊、重攻擊、特殊攻擊等
  
  switch (attackType) {
    case 'light':
      // 輕攻擊 - 快速但傷害較低
      combat.attackBox.width = 300;
      combat.attackBox.height = 200;
      combat.attackDuration = 150;
      combat.attackCooldown = 300;
      break;
      
    case 'heavy':
      // 重攻擊 - 緩慢但傷害較高
      combat.attackBox.width = 450;
      combat.attackBox.height = 350;
      combat.attackDuration = 350;
      combat.attackCooldown = 700;
      break;
      
    case 'special':
      // 特殊攻擊 - 範圍較大
      combat.attackBox.width = 500;
      combat.attackBox.height = 500;
      combat.attackDuration = 250;
      combat.attackCooldown = 1000;
      break;
      
    default:
      // 默認攻擊
      combat.attackBox.width = 400;
      combat.attackBox.height = 300;
      combat.attackDuration = 200;
      combat.attackCooldown = 470;
  }
  
  // 重新設置物理體積
  if (combat.attackBox.body) {
    combat.attackBox.body.setSize(combat.attackBox.width, combat.attackBox.height);
  }
}

/**
 * 執行攻擊
 * @param {Phaser.Scene} scene - 當前場景
 */
export function performAttack(scene) {
  if (combat.isAttacking || combat.inCooldown) return false;
  
  // 啟動攻擊
  combat.isAttacking = true;
  combat.attackBox.body.enable = true;
  
  // 根據當前方向更新攻擊框位置
  updateAttackBoxPosition();
  
  // 在開發模式顯示攻擊框
  if (combat.showDebug) {
    combat.attackDebug.setVisible(true);
  }
  
  // 設置攻擊持續時間
  scene.time.delayedCall(combat.attackDuration, () => {
    // 攻擊結束
    combat.isAttacking = false;
    combat.attackBox.body.enable = false;
    combat.attackDebug.setVisible(false);
    
    // 設置冷卻時間
    combat.inCooldown = true;
    scene.time.delayedCall(combat.attackCooldown, () => {
      combat.inCooldown = false;
    });
  });
  
  return true;
}

/**
 * 創建攻擊特效 (預留擴展用)
 * @param {Phaser.Scene} scene - 當前場景
 * @param {number} x - 特效x座標 
 * @param {number} y - 特效y座標
 */
export function createAttackEffect(scene, x, y) {
  // 這裡可以添加攻擊特效
  // 例如：揮舞效果、打擊特效等
}