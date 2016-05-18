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

debugData = {}
addDebug = (data) ->
  Object.keys(data).forEach (key) ->
    debugData[key] = data[key]

canJump = (player) ->
  # Get a foot platform to test if we are standing on another sprite
  playerFoot = player.getBounds()
  playerFoot.top = playerFoot.y + playerFoot.height
  playerFoot.height = 1

  player.body.blocked.down or
  customObjects.children.map (sprite) ->
    sprite.getBounds()
  .reduce (collides, bounds) ->
    collides or Phaser.Rectangle.intersects(playerFoot, bounds)
  , false

playerControls = (cursors, player) ->
  if cursors.left.isDown
    player.body.velocity.x = -150
  else if cursors.right.isDown
    player.body.velocity.x = 150
  else
    player.body.velocity.x = 0

  if cursors.up.isDown and canJump(player)
    player.body.velocity.y = -350

  if !cursors.up.isDown and player.body.velocity.y < 0
    player.body.velocity.y = 0

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

  # Blank Tilemap
  map = addMapFromData game, mapData
  game.mainLayer.resizeWorld()
  currentTileIndex = 1

  button = game.add.button(game.world.centerX - 95, 400, 'button', click, this, 2, 1, 0)

  # Controls
  cursors = game.input.keyboard.createCursorKeys()

  # Physics
  game.physics.arcade.gravity.y = 500

  # Player
  player = game.add.sprite(0, 0, 'dude')
  game.physics.enable(player, Phaser.Physics.ARCADE)
  player.body.collideWorldBounds = true

  # Camera follow player
  game.camera.follow(player)

  customObjects = game.add.group()

  db.objects.get "objects"
  .then (data) ->
    if data
      game.restore data

  # Text!
  debugText = game.add.text 0, 0, "",
    fill: "#080"

  # Game Input
  game.input.onDown.add ({worldX:x, worldY:y, button}) ->
    tileX = game.mainLayer.getTileX(x)
    tileY = game.mainLayer.getTileY(y)

    if button is Phaser.Mouse.RIGHT_BUTTON
      tile = map.getTile(tileX, tileY, game.mainLayer)
      index = tile?.index or 255
      console.log index
      if index != 255
        ;# TODO: Open an editor, editing a blob that will save to this index
    else
      map.putTile(currentTileIndex, tileX, tileY, game.mainLayer)

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
    data = serializeTilemap(map)
    data.id = "map"
    db.objects.put data

  game.input.keyboard.addKey(Phaser.Keyboard.A)
  .onDown.add ->
    serializeTilemap(map)
  
  game.input.keyboard.addKey(Phaser.Keyboard.T)
  .onDown.add ->
    

update = ->
  debugText.text = game.time.fps

  # Physics, Collision!
  game.physics.arcade.collide(player, customObjects, collisionHandler, processHandler, this)

  game.physics.arcade.collide(customObjects, customObjects, collisionHandler, processHandler, this)

  game.physics.arcade.collide(player, game.mainLayer)
  game.physics.arcade.collide(customObjects, game.mainLayer)

  playerControls(cursors, player)

mapData = null
db.objects.get "map"
.then (d) ->
  if d
    mapData = d
  else
    tileData = new Uint8Array 1200

    [40...60].forEach (i) ->
      tileData[i] = 1

    mapData =
      width: 40
      height: 30
      tileWidth: 32
      tileHeight: 32
      collision: [1]
      layers: [
        data: tileData
        name: "layer1"
        width: 40
        height: 30
      ]

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

  # TODO: Only set drag when on ground, less when in air
  sprite.body.drag.x = 500

  # Make sprite clickable
  sprite.inputEnabled = true
  sprite.events.onInputDown.add (sprite, pointer) ->
    if pointer.button is Phaser.Mouse.RIGHT_BUTTON
      sprite.destroy()
    else
      game.editTexture name, sprite.frame

  return sprite

# Want to save assets, game data, and game state
Phaser.Game.prototype.save = ->
  # TODO: Persist level/world data

  # Serialize custom objects
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

serializeLayer = (layer) ->
  {data, name, width, height} = layer

  tileData = new Uint8Array layer.width * layer.height

  data.map (row, y) ->
    row.map (tile, x) ->
      tileData[y * width + x] = tile.index

  name: name
  data: tileData
  width: width
  height: height

serializeTilemap = (map) ->
  {width, height, tileWidth, tileHeight, layers} = map

  data =
    collision: [1] # TODO: Need to remember our collision settings on the map/layer so we can serialize them
    width: width
    height: height
    tileWidth: tileWidth
    tileHeight: tileHeight
    layers: layers.map serializeLayer

  console.log data

  return data

addMapFromData = (game, mapData) ->
  {tileWidth, tileHeight, collision, layers} = mapData

  map = game.add.tilemap()
  map.setCollision(collision)

  layers.forEach (layer, layerIndex) ->
    {data, name, width, height} = layer

    game.mainLayer = layer = map.create(name, width, height, tileWidth, tileHeight)

    data.forEach (tileIndex, i) ->
      x = i % width
      y = (i / width)|0

      if tileIndex and tileIndex != 255
        map.putTile(tileIndex, x, y, layerIndex)

  return map
