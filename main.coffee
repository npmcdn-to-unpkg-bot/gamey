require "./setup"

{blob2img, defaultSpritesheetBlob, img2Blob} = require "./util"

Spritesheet = require "./spritesheet"

db = require("./db")()

Embedder = require "embedder"
customObjects = null
debugText = null
spritesheet = null

cursors = null
player = null

click = do ->
  childWindow = null
  embedder = null
  activeFrame = 0

  Phaser.Game.prototype.editTexture = (name, frame) ->
    # TODO: This should be passed through to the editor rather than stored here
    # to avoid race conditions
    activeFrame = frame

    spritesheet.getBlob(frame).then (blob) ->
      embedder.loadFile blob

  return ->
    console.log "click"

    embedder = Embedder "https://danielx.net/pixel-editor/",
      childLoaded: ->
        console.log "Editor Loaded"
      save: (data) ->
        console.log "Save"

        blob2img(data.image)
        .then (img) ->
          spritesheet.compose(img, activeFrame)

          # Need to update cache?
          game.cache.addSpriteSheet('spritesheet', "", spritesheet.canvas(), spritesheet.spriteWidth(), spritesheet.spriteHeight())

          customObjects.children.map (obj) ->
            obj.loadTexture("spritesheet", obj.frame)

          return

    childWindow = embedder.remoteTaregt()

create = ->
  game.stage.backgroundColor = '#182d3b'

  background = game.add.tileSprite(0, 0, 800, 600, 'background')

  button = game.add.button(game.world.centerX - 95, 400, 'button', click, this, 2, 1, 0)

  # Controls
  cursors = game.input.keyboard.createCursorKeys()

  # Physics
  game.physics.arcade.gravity.y = 500

  # Player
  player = game.add.sprite(16, 32, 'dude')
  game.physics.enable(player, Phaser.Physics.ARCADE)
  player.body.collideWorldBounds = true

  customObjects = game.add.group()

  db.objects.get "objects"
  .then (data) ->
    if data
      game.restore data

  # Text!
  debugText = game.add.text 0, 0, "",
    fill: "#080"

  # Game Input
  game.input.onDown.add ({x, y}) ->
    console.log "get down"

  # Hotkeys
  ["ZERO", "ONE", "TWO", "THREE"].forEach (key, i) ->
    game.input.keyboard.addKey(Phaser.Keyboard[key])
    .onDown.add ->
      name = "spritesheet"

      x = Math.floor(game.width * Math.random())|0
      y = 100

      addObject game, customObjects,
        name: name
        x: x
        y: y
        frame: i

  game.input.keyboard.addKey(Phaser.Keyboard.S)
  .onDown.add ->
    writeSpritesheet()
    writeGameObjects()

update = ->
  debugText.text = game.time.fps

  if (cursors.left.isDown)
    player.body.velocity.x = -150

  if (cursors.right.isDown)
    player.body.velocity.x = 150

  # Physics, Collision!
  game.physics.arcade.collide(player, customObjects, collisionHandler, processHandler, this)

  game.physics.arcade.collide(customObjects, customObjects, collisionHandler, processHandler, this)

db.objects.get "spritesheet"
.then (spritesheet) ->
  if spritesheet
    return spritesheet
  else
    defaultSpritesheetBlob()
    .then (blob) ->
      data =
        id: "spritesheet"
        blob: blob
        spriteWidth: 32
        spriteHeight: 32
        width: 512
        height: 512

      db.objects.put data
      .then ->
        data

.then ({blob, width, height, spriteWidth, spriteHeight}) ->
  blob2img(blob)
  .then (img) ->
    spritesheet = Spritesheet spriteWidth, spriteHeight, width, height, img
.then (spritesheet) ->
  console.log spritesheet
  canvas = spritesheet.canvas()

  preload = ->
    game.time.advancedTiming = true

    game.load.crossOrigin = "Anonymous"

    # NOTE: You can pass a canvas as the data arg here, cool undocumented feature!
    game.cache.addSpriteSheet('spritesheet', "", spritesheet.canvas(), spritesheet.spriteWidth(), spritesheet.spriteHeight())
    game.load.spritesheet('button', 'https://s3.amazonaws.com/whimsyspace-databucket-1g3p6d9lcl6x1/danielx/data/n4lN8edpcmdsAoBzeZ9-xFW7JW2WaUofe_tlkqo--8s', 193, 71)
    game.load.image('background', "https://s3.amazonaws.com/whimsyspace-databucket-1g3p6d9lcl6x1/danielx/data/f3I-1TlC9lsqkWBLXVsFaENRqTfLJGLYBPZf2k73OiA")

  global.game = game = new Phaser.Game 800, 600, Phaser.AUTO, document.body,
    create: create
    enableDebug: true
    preload: preload
    update: update

addObject = (game, group, data) ->
  {x, y, name, frame} = data

  sprite = group.create x, y, name

  sprite.frame = frame ? 0

  # TODO: Custom classes/mixins

  # Physics!
  game.physics.arcade.enable sprite
  sprite.body.collideWorldBounds = true

  # Make sprite clickable
  sprite.inputEnabled = true
  sprite.events.onInputDown.add ->
    game.editTexture name, sprite.frame

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
    frame: child.frame

Phaser.Game.prototype.restore = (data) ->
  # Clear all custom objects
  customObjects.removeAll()
  # Add all objects from the data
  data.objects.forEach (objectData) ->
    addObject game, customObjects, objectData

  # TODO: Set up spritesheets

collisionHandler = (player, dealy) ->

processHandler = ->
  true

writeSpritesheet = ->
  spritesheet.getData().then (data) ->
    data.id = "spritesheet"

    db.objects.put data

writeGameObjects = ->
  data = game.save()
  data.id = "objects"

  db.objects.put data
