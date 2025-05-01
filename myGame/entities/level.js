// entities/level.js - 關卡元素相關邏輯

import { entities } from '../gameState.js';

/**
 * 創建關卡元素
 * @param {Phaser.Scene} scene - 當前場景
 */
export function createLevel(scene) {
  // 創建地面
  createGround(scene);
  
  // 創建牆壁
  createWalls(scene);
  
  // 創建出入口區域
  createExitZone(scene);
}

/**
 * 創建地面
 * @param {Phaser.Scene} scene - 當前場景
 */
function createGround(scene) {
  entities.ground = scene.physics.add.staticGroup();
  
  // 創建主地面
  entities.ground.create(4000, 2890, 'ground') // 放在底部（中心對齊）
    .setDisplaySize(8000, 220) // 設定寬度與高度
    .refreshBody(); // 告訴 physics 更新碰撞區域
}

/**
 * 創建牆壁
 * @param {Phaser.Scene} scene - 當前場景
 */
function createWalls(scene) {
  entities.wall = scene.physics.add.staticGroup();
  
  // 左邊界牆
  entities.wall.create(3700, 1200, 'ground')
    .setDisplaySize(190, 2400)
    .refreshBody();
  
  // 右邊界牆
  entities.wall.create(7905, 1200, 'ground')
    .setDisplaySize(190, 2400)
    .refreshBody();
}

/**
 * 創建出入口區域
 * @param {Phaser.Scene} scene - 當前場景
 */
function createExitZone(scene) {
  // 出入口檢測區域 - 不可見的碰撞區域
  entities.exitZone = scene.physics.add.staticSprite(3655, 2590, null) // 剛好貼合出入口
    .setSize(100, 380)
    .setVisible(false);
}

/**
 * 創建額外的平台 (預留擴展用)
 * @param {Phaser.Scene} scene - 當前場景
 */
export function createPlatforms(scene) {
  // 這裡可以創建額外的平台
  // 例如：
  /*
  const platforms = scene.physics.add.staticGroup();
  
  // 添加平台
  platforms.create(1500, 2300, 'ground')
    .setDisplaySize(300, 30)
    .refreshBody();
  
  platforms.create(2800, 2100, 'ground')
    .setDisplaySize(300, 30)
    .refreshBody();
  
  // 添加碰撞
  scene.physics.add.collider(entities.player, platforms);
  scene.physics.add.collider(entities.bossBody, platforms);
  */
}

/**
 * 創建機關和特殊區域 (預留擴展用)
 * @param {Phaser.Scene} scene - 當前場景
 */
export function createHazards(scene) {
  // 這裡可以創建危險區域或特殊機關
  // 例如：尖刺、熔岩、移動平台等
}

/**
 * 創建可收集物品 (預留擴展用)
 * @param {Phaser.Scene} scene - 當前場景
 */
export function createCollectibles(scene) {
  // 這裡可以創建可收集的物品
  // 例如：金幣、能量球、升級道具等
}