style = document.createElement "style"
style.innerText = """
  html {
    background-color: #112;
    height: 100%;
  }
  body {
    margin: 0;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
"""
document.head.appendChild style

Embedder = require "embedder"

preload = ->
  game.load.crossOrigin = "Anonymous"

  game.load.spritesheet('button', 'https://s3.amazonaws.com/whimsyspace-databucket-1g3p6d9lcl6x1/danielx/data/n4lN8edpcmdsAoBzeZ9-xFW7JW2WaUofe_tlkqo--8s', 193, 71)
  game.load.image('background', "https://s3.amazonaws.com/whimsyspace-databucket-1g3p6d9lcl6x1/danielx/data/f3I-1TlC9lsqkWBLXVsFaENRqTfLJGLYBPZf2k73OiA")

click = do ->
  pixelEditorWindow = null
  return ->
    console.log "click"

    i = 0

    Embedder "https://danielx.net/pixel-editor/",
      childLoaded: ->
        console.log "Editor Loaded"
      save: (data) ->
        console.log "Save"
        url = URL.createObjectURL(data.image)

        name = "yolo#{i}"
        game.load.image(name, url)
        game.load.onLoadComplete.addOnce ->
          x = Math.floor(game.width * Math.random())|0
          y = Math.floor(game.width * Math.random())|0
          sprite = game.add.sprite x, y, name

          # Make sprite clickable
          sprite.inputEnabled = true
          sprite.events.onInputDown.add ->
            console.log "clicky!"

        i += 1
        game.load.start()

create = ->
  game.stage.backgroundColor = '#182d3b'

  background = game.add.tileSprite(0, 0, 800, 600, 'background')

  button = game.add.button(game.world.centerX - 95, 400, 'button', click, this, 2, 1, 0)

  button.onInputOver.add ->
    console.log 'over'
  button.onInputOut.add ->
    console.log 'out'
  button.onInputUp.add ->
    console.log 'up'
  button.onInputDown.add ->
    console.log 'down'

global.game = new Phaser.Game 800, 600, Phaser.AUTO, 'phaser-example',
  preload: preload
  create: create
  enableDebug: true

