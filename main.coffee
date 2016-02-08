preload = ->
  # game.load.spritesheet('button', 'http://examples.phaser.io/assets/buttons/button_sprite_sheet.png', 193, 71)
  game.load.image('background', "https://s3.amazonaws.com/whimsyspace-databucket-1g3p6d9lcl6x1/danielx/data/f3I-1TlC9lsqkWBLXVsFaENRqTfLJGLYBPZf2k73OiA")

create = ->
  console.log "yolo!"
  game.stage.backgroundColor = '#182d3b'

  background = game.add.tileSprite(0, 0, 800, 600, 'background')

  # button = game.add.button(game.world.centerX - 95, 400, 'button', actionOnClick, this, 2, 1, 0)

  # button.onInputOver.add(over, this)
  # button.onInputOut.add(out, this)
  # button.onInputUp.add(up, this)

game = new Phaser.Game 800, 600, Phaser.AUTO, 'phaser-example',
  preload: preload
  create: create
