style = document.createElement "style"
style.innerText = """
  body {
    margin: 0;
  }
"""
document.head.appendChild style

preload = ->
  console.log 'duder'

  game.load.crossOrigin = "Anonymous"

  game.load.spritesheet('button', 'https://s3.amazonaws.com/whimsyspace-databucket-1g3p6d9lcl6x1/danielx/data/n4lN8edpcmdsAoBzeZ9-xFW7JW2WaUofe_tlkqo--8s', 193, 71)
  game.load.image('background', "https://s3.amazonaws.com/whimsyspace-databucket-1g3p6d9lcl6x1/danielx/data/f3I-1TlC9lsqkWBLXVsFaENRqTfLJGLYBPZf2k73OiA")

create = ->
  console.log "yolo!"
  game.stage.backgroundColor = '#182d3b'

  background = game.add.tileSprite(0, 0, 800, 600, 'background')

  button = game.add.button(game.world.centerX - 95, 400, 'button', (-> console.log 'heyy'), this, 2, 1, 0)

  # button.onInputOver.add(over, this)
  # button.onInputOut.add(out, this)
  # button.onInputUp.add(up, this)

global.game = new Phaser.Game 800, 600, Phaser.AUTO, 'phaser-example',
  preload: preload
  create: create
  enableDebug: true
