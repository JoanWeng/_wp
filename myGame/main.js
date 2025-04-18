const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: {
      preload,
      create
    }
  };
  
  const game = new Phaser.Game(config);
  
  function preload() {
    this.load.image('logo', 'assets/030.png');
  }
  
  function create() {
    this.add.image(400, 300, 'logo');
  }  