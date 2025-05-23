// scenes/mainScene.js - 主遊戲場景

import { entities, movement, combat, controls, gameFlow, resetGameState } from '../gameState.js';
import { createPlayer, handlePlayerMovement } from '../entities/player.js';
import { createBoss, handleBossLogic, onAttackHitBoss, bossFlash } from '../entities/boss.js';
import { createLevel } from '../entities/level.js';
import { createAttackSystem, updateAttackBoxPosition } from '../utils/attackSystem.js';

export default class MainScene extends Phaser.Scene {
  constructor() {
    super('MainScene');
  }

  preload() {
    // 載入資源
    this.load.image('background', 'assets/background.png');
    this.load.spritesheet('player', 'assets/player.png', { frameWidth: 150, frameHeight: 380 });
    this.load.image('npc', 'assets/npc.png');
    this.load.image('boss', 'assets/boss.png');
    this.load.image('ground', 'assets/ground.png');
  }

  create() {
    this.cameras.main.setZoom(0.5); 

    // 設定世界邊界
    this.cameras.main.setBounds(0, 0, 8000, 3000);
    this.physics.world.setBounds(0, 0, 8000, 3000);

    // 添加背景
    this.add.image(0, 0, 'background').setOrigin(0);

    // 重設遊戲狀態
    resetGameState();

    // 創建關卡元素 (ground, wall, exitZone)
    createLevel(this);

    // 創建玩家
    createPlayer(this);

    // 創建NPC
    entities.npc = this.physics.add.sprite(2700, 2650, 'npc');
    entities.npc.setCollideWorldBounds(true);
    entities.npc.setDisplaySize(110, 260);

    // 創建Boss
    createBoss(this);

    // 創建攻擊系統
    createAttackSystem(this);

    // 設定各種碰撞關係
    this.setupCollisions();

    // 相機跟隨玩家
    this.cameras.main.startFollow(entities.player);

    // 設定控制鍵
    this.setupControls();
  }

  update() {
    if (!gameFlow.inputEnabled) return;

    // 處理玩家移動、跳躍和衝刺
    handlePlayerMovement(this);

    // 處理攻擊邏輯
    this.handleAttack();

    // 更新攻擊框位置
    updateAttackBoxPosition();

    // 更新Boss碰撞體位置
    entities.bossCollider.setPosition(entities.bossBody.x, entities.bossBody.y);
  }

  setupCollisions() {
    this.physics.add.collider(entities.bossBody, entities.ground);
    this.physics.add.collider(entities.player, entities.bossCollider);
    this.physics.add.collider(entities.player, entities.ground);
    this.physics.add.collider(entities.npc, entities.ground);
    this.physics.add.collider(entities.player, entities.wall);
    this.physics.add.collider(entities.bossBody, entities.wall);

    // 出入口檢測
    this.physics.add.overlap(entities.player, entities.exitZone, this.onReachExit, null, this);

    // 攻擊碰撞檢測
    this.physics.add.overlap(combat.attackBox, entities.bossBody, onAttackHitBoss, null, this);
  }

  setupControls() {
    // 設定移動鍵
    controls.cursors = this.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      right: Phaser.Input.Keyboard.KeyCodes.D
    });

    // 設定動作鍵
    controls.jumpKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    controls.dashKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.L);
    controls.attackKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.J);
  }

  handleAttack() {
    if (Phaser.Input.Keyboard.JustDown(controls.attackKey) && combat.canAttack && !combat.isAttacking) {
      combat.isAttacking = true;
      combat.hasHit = false;
      combat.canAttack = false; // 立刻進入冷卻狀態

      combat.attackBox.body.enable = true;
      combat.attackBox.visible = true;
      combat.attackDebug.setVisible(true);

      // 攻擊框跟著角色動作，持續更新位置
      updateAttackBoxPosition();

      // 攻擊持續時間到，結束攻擊
      this.time.delayedCall(combat.attackDuration, () => {
        combat.isAttacking = false;
        combat.attackBox.visible = false;
        combat.attackBox.body.enable = false;
        combat.attackDebug.clear();
        combat.attackDebug.setVisible(false);
      });

      // 冷卻時間到，允許再次攻擊
      this.time.delayedCall(combat.attackCooldown, () => {
        combat.canAttack = true;
      });
    }
  }

  onReachExit(player, zone) {
    // 只設定一次，避免重複觸發
    if (!this.cameras.main._reachedExit) {
      this.cameras.main._reachedExit = true;
      gameFlow.inputEnabled = false;
      player.setVelocity(0, 0);               // 停止移動與跳躍
      player.body.allowGravity = false;
      
      // 暫停攝影機跟隨（避免馬上跳回）
      this.cameras.main.stopFollow();
      // 改變攝影機活動範圍
      this.cameras.main.setBounds(3700, 0, 4200, 3000);

      // 延遲傳送與攝影機平移，讓引擎有時間處理
      this.time.delayedCall(0, () => {
        player.setPosition(5000, 2630);
        player.body.updateFromGameObject();

        this.cameras.main.pan(player.x + 1000, player.y, 800, 'Power2');

        this.time.delayedCall(1000, () => {
          this.cameras.main.startFollow(player);
          gameFlow.inputEnabled = true;
          player.body.allowGravity = true;
        });
      });

      // 建立左邊封門碰撞箱
      entities.leftExitBlock = this.physics.add.staticSprite(3785, 2590, null)
        .setSize(20, 380)
        .setVisible(false);

      // 建立右邊封門碰撞箱
      entities.rightExitBlock = this.physics.add.staticSprite(7820, 2590, null)
        .setSize(20, 380)
        .setVisible(false);

      // 添加碰撞關係
      this.physics.add.collider(entities.player, entities.leftExitBlock);
      this.physics.add.collider(entities.player, entities.rightExitBlock);
      this.physics.add.collider(entities.bossBody, entities.leftExitBlock);
      this.physics.add.collider(entities.bossCollider, entities.leftExitBlock);
      this.physics.add.collider(entities.bossBody, entities.rightExitBlock);
      this.physics.add.collider(entities.bossCollider, entities.rightExitBlock);
    }
  }
}