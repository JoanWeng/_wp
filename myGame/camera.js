export function setupCameraTransition() {
    this.exitZone = this.physics.add.staticSprite(3655, 2590, null).setSize(100, 380).setVisible(false);
    this.physics.add.overlap(this.player, this.exitZone, onReachExit, null, this);
  }
  
  function onReachExit(player, zone) {
    if (!this.cameras.main._reachedExit) {
      this.cameras.main._reachedExit = true;
      this.inputEnabled = false;
      player.setVelocity(0, 0);
      player.body.allowGravity = false;
      this.cameras.main.stopFollow();
      this.cameras.main.setBounds(3700, 0, 4200, 3000);
      this.time.delayedCall(0, () => {
        player.setPosition(5000, 2640);
        player.body.updateFromGameObject();
        this.cameras.main.pan(player.x + 1000, player.y, 800, 'Power2');
        this.time.delayedCall(1000, () => {
          this.cameras.main.startFollow(player);
          this.inputEnabled = true;
          player.body.allowGravity = true;
        });
      });
      const leftExitBlock = this.physics.add.staticSprite(3785, 2590, null).setSize(20, 380).setVisible(false);
      const rightExitBlock = this.physics.add.staticSprite(7820, 2590, null).setSize(20, 380).setVisible(false);
      this.physics.add.collider(player, leftExitBlock);
      this.physics.add.collider(player, rightExitBlock);
      this.physics.add.collider(this.bossBody, leftExitBlock);
      this.physics.add.collider(this.bossCollider, leftExitBlock);
      this.physics.add.collider(this.bossBody, rightExitBlock);
      this.physics.add.collider(this.bossCollider, rightExitBlock);
    }
  }
  