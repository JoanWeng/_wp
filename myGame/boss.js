let bossBody, bossCollider;

export function createBoss() {
  bossBody = this.physics.add.sprite(7000, 2605, 'boss');
  bossBody.setCollideWorldBounds(true);
  bossBody.setImmovable(false);
  bossBody.setDrag(Infinity, 0);
  bossBody.health = 50;
  bossBody.setDisplaySize(110, 350);

  bossCollider = this.physics.add.sprite(7000, 2605, 'boss');
  bossCollider.setImmovable(true);
  bossCollider.body.allowGravity = false;
  bossCollider.setVisible(false);
  bossCollider.body.setSize(110, 350);

  this.physics.add.collider(bossBody, this.ground);
  this.physics.add.collider(bossBody, this.wall);
  this.physics.add.collider(this.player, bossCollider);
}

export function updateBossCollider() {
  if (bossCollider && bossBody) {
    bossCollider.setPosition(bossBody.x, bossBody.y);
  }
}

export function bossFlash(boss) {
  let flashCount = 0;
  const flashMax = 4;
  const flashInterval = 100;
  const flashTimer = setInterval(() => {
    boss.alpha = boss.alpha === 1 ? 0.3 : 1;
    flashCount++;
    if (flashCount >= flashMax) {
      clearInterval(flashTimer);
      boss.alpha = 1;
    }
  }, flashInterval);
}