import { bossFlash } from './boss.js';
let attackBox, attackDebug, isAttacking = false, canAttack = true, hasHit = false;
const attackDuration = 200;
const attackCooldown = 470;

export function handleAttacks() {
  if (!attackBox || !attackBox.body) return;
  updateAttackBoxPosition.call(this);
  if (Phaser.Input.Keyboard.JustDown(this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.J)) && canAttack && !isAttacking) {
    isAttacking = true;
    hasHit = false;
    canAttack = false;
    attackBox.body.enable = true;
    attackBox.visible = true;
    attackDebug.setVisible(true);
    updateAttackBoxPosition.call(this);
    setTimeout(() => {
      isAttacking = false;
      attackBox.visible = false;
      attackBox.body.enable = false;
      attackDebug.clear();
      attackDebug.setVisible(false);
    }, attackDuration);
    setTimeout(() => {
      canAttack = true;
    }, attackCooldown);
  }
}

export function createAttackBox() {
  attackBox = this.add.rectangle(0, 0, 400, 300);
  this.physics.add.existing(attackBox);
  attackBox.body.setAllowGravity(false);
  attackBox.body.setImmovable(true);
  attackBox.body.enable = false;
  attackBox.visible = false;
  attackDebug = this.add.graphics();
  attackDebug.lineStyle(2, 0xff0000, 1);
  attackDebug.setVisible(false);
  this.physics.add.overlap(attackBox, this.bossBody, onAttackHitBoss, null, this);
}

function updateAttackBoxPosition() {
  if (!isAttacking) return;
  const player = this.player;
  const cursors = this.input.keyboard.createCursorKeys();
  let offsetX = 0, offsetY = 0, attackDistance = 60;
  if (cursors.up.isDown) offsetY = -(player.height / 2 + attackBox.height / 2 + attackDistance);
  else if (cursors.down.isDown) offsetY = player.height / 2 + attackBox.height / 2 + attackDistance;
  else if (cursors.left.isDown || !this.facingRight) offsetX = -(player.width / 2 + attackBox.width / 2 + attackDistance);
  else offsetX = player.width / 2 + attackBox.width / 2 + attackDistance;
  attackBox.setPosition(player.x + offsetX, player.y + offsetY);
  attackBox.body.reset(attackBox.x, attackBox.y);
  attackDebug.clear();
  attackDebug.lineStyle(2, 0xff0000, 1);
  attackDebug.strokeRect(attackBox.getBounds().x, attackBox.getBounds().y, attackBox.width, attackBox.height);
}

function onAttackHitBoss(attack, boss) {
  if (!isAttacking || hasHit) return;
  boss.health -= 1;
  hasHit = true;
  bossFlash(boss);
  if (boss.health <= 0) boss.disableBody(true, true);
}