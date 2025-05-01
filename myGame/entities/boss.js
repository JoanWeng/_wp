// entities/boss.js - Boss相關邏輯

import { entities, combat } from '../gameState.js';

/**
 * 創建Boss
 * @param {Phaser.Scene} scene - 當前場景
 */
export function createBoss(scene) {
  // 建立 boss 物理實體：實際受重力與地板碰撞
  entities.bossBody = scene.physics.add.sprite(7000, 2605, 'boss');
  entities.bossBody.setCollideWorldBounds(true);
  entities.bossBody.setImmovable(false); // 可動，受重力
  entities.bossBody.setDrag(Infinity, 0); // 水平不滑動
  entities.bossBody.health = 50;
  entities.bossBody.setDisplaySize(110, 350);

  // 建立用來與 player 碰撞的 hitbox，不受重力影響
  entities.bossCollider = scene.physics.add.sprite(7000, 2605, 'boss');
  entities.bossCollider.setImmovable(true); // 不會被推
  entities.bossCollider.body.allowGravity = false; // 不受重力影響
  entities.bossCollider.setVisible(false); // 不顯示圖像（僅碰撞用）
  entities.bossCollider.body.setSize(110, 350);
  
  // 可以在這裡設置Boss的動畫和行為邏輯
  // setupBossAnimations(scene);
  // setupBossBehavior(scene);
}

/**
 * 處理Boss的行為邏輯
 * @param {Phaser.Scene} scene - 當前場景
 */
export function handleBossLogic(scene) {
  // 這裡可以實現Boss的AI和行為模式
  // 例如追蹤玩家、攻擊模式切換等
}

/**
 * 處理玩家攻擊命中Boss
 * @param {Phaser.Physics.Arcade.Sprite} attack - 攻擊物件
 * @param {Phaser.Physics.Arcade.Sprite} boss - Boss物件
 */
export function onAttackHitBoss(attack, boss) {
  if (!combat.isAttacking || combat.hasHit) return; // 已命中過就不再扣血

  // 扣除Boss血量
  boss.health -= 1;
  combat.hasHit = true; // 本次攻擊已經命中

  // 命中閃爍效果
  bossFlash(boss);

  // 檢查Boss是否被擊敗
  if (boss.health <= 0) {
    boss.disableBody(true, true);
    // 這裡可以添加Boss被擊敗後的特效或事件
    // handleBossDefeat(scene);
  }
}

/**
 * Boss被擊中時的閃爍效果
 * @param {Phaser.Physics.Arcade.Sprite} boss - Boss物件
 */
export function bossFlash(boss) {
  let flashCount = 0;
  const flashMax = 4; // 閃爍次數（每次一亮一暗算一次）
  const flashInterval = 100; // 每次閃爍的間隔（毫秒）

  // 使用setInterval實現閃爍效果
  const flashTimer = setInterval(() => {
    boss.alpha = boss.alpha === 1 ? 0.3 : 1; // 在透明和正常之間切換
    flashCount++;

    if (flashCount >= flashMax) {
      clearInterval(flashTimer);
      boss.alpha = 1; // 最後恢復正常
    }
  }, flashInterval);
}

/**
 * 處理Boss被擊敗後的邏輯 (預留擴展用)
 * @param {Phaser.Scene} scene - 當前場景
 */
function handleBossDefeat(scene) {
  // 這裡可以實現Boss被擊敗後的特效、獎勵和關卡進程等
  // 例如：
  // 1. 播放爆炸效果
  // 2. 掉落道具
  // 3. 解鎖新區域
  // 4. 觸發後續劇情
}

/**
 * 設置Boss動畫 (預留擴展用)
 * @param {Phaser.Scene} scene - 當前場景
 */
function setupBossAnimations(scene) {
  // 這裡可以設置Boss的各種動畫
  // 例如：待機、攻擊、受傷等
}