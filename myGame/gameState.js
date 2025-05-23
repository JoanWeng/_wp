// gameState.js - 集中管理遊戲狀態

// 物理實體
export const entities = {
    player: null,
    npc: null,
    bossBody: null,
    bossCollider: null,
    ground: null,
    wall: null,
    exitZone: null,
    leftExitBlock: null,
    rightExitBlock: null
  };
  
  // 玩家移動相關狀態
  export const movement = {
    // 基本移動
    speed: {
      current: 120,
      base: 120,
      max: 750,
      accel: 10
    },
    isMoving: false,
    facingRight: true,
    
    // 跳躍
    jump: {
      force: -350,
      base: -350,
      max: -450,
      accel: 3,
      isActive: false
    },
    
    // 衝刺
    dash: {
      canUse: true,
      isActive: false,
      airUsed: false,
      speed: 1200,
      duration: 400,
      cooldown: 650
    }
  };
  
  // 攻擊系統相關狀態
  export const combat = {
    attackBox: null,
    attackDebug: null,
    isAttacking: false,
    canAttack: true,
    attackDuration: 200, // 攻擊存在時間
    attackCooldown: 470, // 攻擊冷卻時間
    hasHit: false
  };
  
  // 控制相關
  export const controls = {
    cursors: null,
    jumpKey: null,
    dashKey: null,
    attackKey: null
  };
  
  // 遊戲流程控制
  export const gameFlow = {
    inputEnabled: true
  };
  
  // 重設遊戲狀態的函數 (用於場景重啟或新遊戲)
  export function resetGameState() {
    // 重設移動相關數值
    movement.speed.current = movement.speed.base;
    movement.isMoving = false;
    movement.facingRight = true;
    
    // 重設跳躍
    movement.jump.force = movement.jump.base;
    movement.jump.isActive = false;
    
    // 重設衝刺
    movement.dash.canUse = true;
    movement.dash.isActive = false;
    movement.dash.airUsed = false;
    
    // 重設攻擊狀態
    combat.isAttacking = false;
    combat.canAttack = true;
    combat.hasHit = false;
    
    // 重設遊戲流程控制
    gameFlow.inputEnabled = true;
  }