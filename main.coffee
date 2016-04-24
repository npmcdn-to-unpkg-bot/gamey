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
customObjects = null

preload = ->
  game.load.crossOrigin = "Anonymous"

  game.load.spritesheet('button', 'https://s3.amazonaws.com/whimsyspace-databucket-1g3p6d9lcl6x1/danielx/data/n4lN8edpcmdsAoBzeZ9-xFW7JW2WaUofe_tlkqo--8s', 193, 71)
  game.load.image('background', "https://s3.amazonaws.com/whimsyspace-databucket-1g3p6d9lcl6x1/danielx/data/f3I-1TlC9lsqkWBLXVsFaENRqTfLJGLYBPZf2k73OiA")

click = do ->
  childWindow = null
  embedder = null
  i = 0

  Phaser.Game.prototype.editTexture = (name, blob) ->
    embedder.loadFile blob

  return ->
    console.log "click"

    embedder = Embedder "https://danielx.net/pixel-editor/",
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

          addObject game, customObjects,
            name: name
            x: x
            y: y

        i += 1
        game.load.start()

    childWindow = embedder.remoteTaregt()

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

  customObjects = game.add.group()

global.game = new Phaser.Game 800, 600, Phaser.AUTO, 'phaser-example',
  preload: preload
  create: create
  enableDebug: true

img2Blob = (img) ->
  new Promise (resolve, reject) ->
    canvas = img.ownerDocument.createElement "canvas"
    canvas.width = img.width
    canvas.height = img.height

    context = canvas.getContext("2d")
    context.drawImage(img, 0, 0)

    canvas.toBlob resolve

addObject = (game, group, data) ->
  {x, y, name} = data

  sprite = group.create x, y, name

  # Physics!
  game.physics.arcade.enable sprite
  sprite.body.collideWorldBounds = true
  sprite.body.gravity.y = 500

  # Make sprite clickable
  sprite.inputEnabled = true
  sprite.events.onInputDown.add ->
    console.log "clicky!"
    # Use this texture to load into editor
    img = sprite.texture.baseTexture.source

    img2Blob(img).then (blob) ->
      game.editTexture name, blob

  return sprite

# Want to save assets, game data, and game state
Phaser.Game.prototype.save = ->
  # TODO: Serialize all custom objects
  # TODO: Persist spritesheets
  # TODO: Persist level/world data
  objects: customObjects.children.map (child) ->
    name: child.key
    x: child.x
    y: child.y

Phaser.Game.prototype.restore = (data) ->
  # Clear all custom objects
  customObjects.removeAll()
  # Add all objects from the data
  data.objects.forEach (objectData) ->
    addObject game, customObjects, objectData

  # TODO: Set up spritesheets
