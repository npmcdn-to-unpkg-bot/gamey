(function(pkg) {
  (function() {
  var annotateSourceURL, cacheFor, circularGuard, defaultEntryPoint, fileSeparator, generateRequireFn, global, isPackage, loadModule, loadPackage, loadPath, normalizePath, publicAPI, rootModule, startsWith,
    __slice = [].slice;

  fileSeparator = '/';

  global = self;

  defaultEntryPoint = "main";

  circularGuard = {};

  rootModule = {
    path: ""
  };

  loadPath = function(parentModule, pkg, path) {
    var cache, localPath, module, normalizedPath;
    if (startsWith(path, '/')) {
      localPath = [];
    } else {
      localPath = parentModule.path.split(fileSeparator);
    }
    normalizedPath = normalizePath(path, localPath);
    cache = cacheFor(pkg);
    if (module = cache[normalizedPath]) {
      if (module === circularGuard) {
        throw "Circular dependency detected when requiring " + normalizedPath;
      }
    } else {
      cache[normalizedPath] = circularGuard;
      try {
        cache[normalizedPath] = module = loadModule(pkg, normalizedPath);
      } finally {
        if (cache[normalizedPath] === circularGuard) {
          delete cache[normalizedPath];
        }
      }
    }
    return module.exports;
  };

  normalizePath = function(path, base) {
    var piece, result;
    if (base == null) {
      base = [];
    }
    base = base.concat(path.split(fileSeparator));
    result = [];
    while (base.length) {
      switch (piece = base.shift()) {
        case "..":
          result.pop();
          break;
        case "":
        case ".":
          break;
        default:
          result.push(piece);
      }
    }
    return result.join(fileSeparator);
  };

  loadPackage = function(pkg) {
    var path;
    path = pkg.entryPoint || defaultEntryPoint;
    return loadPath(rootModule, pkg, path);
  };

  loadModule = function(pkg, path) {
    var args, content, context, dirname, file, module, program, values;
    if (!(file = pkg.distribution[path])) {
      throw "Could not find file at " + path + " in " + pkg.name;
    }
    if ((content = file.content) == null) {
      throw "Malformed package. No content for file at " + path + " in " + pkg.name;
    }
    program = annotateSourceURL(content, pkg, path);
    dirname = path.split(fileSeparator).slice(0, -1).join(fileSeparator);
    module = {
      path: dirname,
      exports: {}
    };
    context = {
      require: generateRequireFn(pkg, module),
      global: global,
      module: module,
      exports: module.exports,
      PACKAGE: pkg,
      __filename: path,
      __dirname: dirname
    };
    args = Object.keys(context);
    values = args.map(function(name) {
      return context[name];
    });
    Function.apply(null, __slice.call(args).concat([program])).apply(module, values);
    return module;
  };

  isPackage = function(path) {
    if (!(startsWith(path, fileSeparator) || startsWith(path, "." + fileSeparator) || startsWith(path, ".." + fileSeparator))) {
      return path.split(fileSeparator)[0];
    } else {
      return false;
    }
  };

  generateRequireFn = function(pkg, module) {
    var fn;
    if (module == null) {
      module = rootModule;
    }
    if (pkg.name == null) {
      pkg.name = "ROOT";
    }
    if (pkg.scopedName == null) {
      pkg.scopedName = "ROOT";
    }
    fn = function(path) {
      var otherPackage;
      if (typeof path === "object") {
        return loadPackage(path);
      } else if (isPackage(path)) {
        if (!(otherPackage = pkg.dependencies[path])) {
          throw "Package: " + path + " not found.";
        }
        if (otherPackage.name == null) {
          otherPackage.name = path;
        }
        if (otherPackage.scopedName == null) {
          otherPackage.scopedName = "" + pkg.scopedName + ":" + path;
        }
        return loadPackage(otherPackage);
      } else {
        return loadPath(module, pkg, path);
      }
    };
    fn.packageWrapper = publicAPI.packageWrapper;
    fn.executePackageWrapper = publicAPI.executePackageWrapper;
    return fn;
  };

  publicAPI = {
    generateFor: generateRequireFn,
    packageWrapper: function(pkg, code) {
      return ";(function(PACKAGE) {\n  var src = " + (JSON.stringify(PACKAGE.distribution.main.content)) + ";\n  var Require = new Function(\"PACKAGE\", \"return \" + src)({distribution: {main: {content: src}}});\n  var require = Require.generateFor(PACKAGE);\n  " + code + ";\n})(" + (JSON.stringify(pkg, null, 2)) + ");";
    },
    executePackageWrapper: function(pkg) {
      return publicAPI.packageWrapper(pkg, "require('./" + pkg.entryPoint + "')");
    },
    loadPackage: loadPackage
  };

  if (typeof exports !== "undefined" && exports !== null) {
    module.exports = publicAPI;
  } else {
    global.Require = publicAPI;
  }

  startsWith = function(string, prefix) {
    return string.lastIndexOf(prefix, 0) === 0;
  };

  cacheFor = function(pkg) {
    if (pkg.cache) {
      return pkg.cache;
    }
    Object.defineProperty(pkg, "cache", {
      value: {}
    });
    return pkg.cache;
  };

  annotateSourceURL = function(program, pkg, path) {
    return "" + program + "\n//# sourceURL=" + pkg.scopedName + "/" + path;
  };

  return publicAPI;

}).call(this);

  window.require = Require.generateFor(pkg);
})({
  "source": {
    "LICENSE": {
      "path": "LICENSE",
      "content": "The MIT License (MIT)\n\nCopyright (c) 2016 Daniel X Moore\n\nPermission is hereby granted, free of charge, to any person obtaining a copy\nof this software and associated documentation files (the \"Software\"), to deal\nin the Software without restriction, including without limitation the rights\nto use, copy, modify, merge, publish, distribute, sublicense, and/or sell\ncopies of the Software, and to permit persons to whom the Software is\nfurnished to do so, subject to the following conditions:\n\nThe above copyright notice and this permission notice shall be included in all\ncopies or substantial portions of the Software.\n\nTHE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\nIMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\nFITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE\nAUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER\nLIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,\nOUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE\nSOFTWARE.\n",
      "mode": "100644",
      "type": "blob"
    },
    "README.md": {
      "path": "README.md",
      "content": "# gamey\nTastes a bit gamey\n",
      "mode": "100644",
      "type": "blob"
    },
    "TODO.md": {
      "path": "TODO.md",
      "content": "TODO\n====\n\nLive edit game object properties\n\nSave to S3 / external\n\nDone\n====\n\nLoad and update a game object's image in pixel editor\n\nSave and restore game state\n\nLive edit tilemap\n\nDraw an image in pixel editor and make it into a sprite\n\nSave / Restore IndexedDB\n",
      "mode": "100644",
      "type": "blob"
    },
    "db.coffee": {
      "path": "db.coffee",
      "content": "# Super simple object DB\nmodule.exports = ->\n  db = new Dexie(\"objects\")\n  db.version(1).stores\n    objects: \"id\"\n\n  return db\n",
      "mode": "100644",
      "type": "blob"
    },
    "main.coffee": {
      "path": "main.coffee",
      "content": "require \"./setup\"\n\n{blob2img, defaultSpritesheetBlob, img2Blob} = require \"./util\"\n\nSpritesheet = require \"./spritesheet\"\n\ndb = require(\"./db\")()\n\nEmbedder = require \"embedder\"\ncustomObjects = null\ndebugText = null\nspritesheet = null\n\ncursors = null\nplayer = null\n\ndebugData = {}\naddDebug = (data) ->\n  Object.keys(data).forEach (key) ->\n    debugData[key] = data[key]\n\ncanJump = (player) ->\n  # Get a foot platform to test if we are standing on another sprite\n  playerFoot = player.getBounds()\n  playerFoot.top = playerFoot.y + playerFoot.height\n  playerFoot.height = 1\n\n  player.body.blocked.down or \n  customObjects.children.map (sprite) ->\n    sprite.getBounds()\n  .reduce (collides, bounds) ->\n    collides or Phaser.Rectangle.intersects(playerFoot, bounds)\n  , false\n\nplayerControls = (cursors, player) ->\n  if cursors.left.isDown\n    player.body.velocity.x = -150\n  else if cursors.right.isDown\n    player.body.velocity.x = 150\n  else\n    player.body.velocity.x = 0\n\n  if cursors.up.isDown and canJump(player)\n    player.body.velocity.y = -350\n\n  if !cursors.up.isDown and player.body.velocity.y < 0\n    player.body.velocity.y = 0\n\nclick = do ->\n  childWindow = null\n  embedder = null\n  activeFrame = 0\n\n  Phaser.Game.prototype.editTexture = (name, frame) ->\n    # TODO: This should be passed through to the editor rather than stored here\n    # to avoid race conditions\n    activeFrame = frame\n\n    spritesheet.getBlob(frame).then (blob) ->\n      embedder.loadFile blob\n\n  return ->\n    console.log \"click\"\n\n    embedder = Embedder \"https://danielx.net/pixel-editor/\",\n      childLoaded: ->\n        console.log \"Editor Loaded\"\n      save: (data) ->\n        console.log \"Save\"\n\n        blob2img(data.image)\n        .then (img) ->\n          spritesheet.compose(img, activeFrame)\n\n          # Need to update cache?\n          game.cache.addSpriteSheet('spritesheet', \"\", spritesheet.canvas(), spritesheet.spriteWidth(), spritesheet.spriteHeight())\n\n          customObjects.children.map (obj) ->\n            obj.loadTexture(\"spritesheet\", obj.frame)\n\n          return\n\n    childWindow = embedder.remoteTaregt()\n\ncreate = ->\n  game.stage.backgroundColor = '#182d3b'\n\n  background = game.add.tileSprite(0, 0, 800, 600, 'background')\n\n  # Blank Tilemap\n  map = addMapFromData game, mapData\n  game.mainLayer.resizeWorld()\n  currentTileIndex = 1\n\n  button = game.add.button(game.world.centerX - 95, 400, 'button', click, this, 2, 1, 0)\n\n  # Controls\n  cursors = game.input.keyboard.createCursorKeys()\n\n  # Physics\n  game.physics.arcade.gravity.y = 500\n\n  # Player\n  player = game.add.sprite(0, 0, 'dude')\n  game.physics.enable(player, Phaser.Physics.ARCADE)\n  player.body.collideWorldBounds = true\n\n  # Camera follow player\n  game.camera.follow(player)\n\n  customObjects = game.add.group()\n\n  db.objects.get \"objects\"\n  .then (data) ->\n    if data\n      game.restore data\n\n  # Text!\n  debugText = game.add.text 0, 0, \"\",\n    fill: \"#080\"\n\n  # Game Input\n  game.input.onDown.add ({worldX:x, worldY:y}) ->\n    map.putTile(currentTileIndex, game.mainLayer.getTileX(x), game.mainLayer.getTileY(y), game.mainLayer)\n    console.log \"get down\"\n\n  # Hotkeys\n  [\"ZERO\", \"ONE\", \"TWO\", \"THREE\"].forEach (key, i) ->\n    game.input.keyboard.addKey(Phaser.Keyboard[key])\n    .onDown.add ->\n      name = \"spritesheet\"\n\n      x = Math.floor(game.width * Math.random())|0\n      y = 100\n\n      addObject game, customObjects,\n        name: name\n        x: x\n        y: y\n        frame: i\n\n  game.input.keyboard.addKey(Phaser.Keyboard.S)\n  .onDown.add ->\n    writeSpritesheet()\n    writeGameObjects()\n    data = serializeTilemap(map)\n    data.id = \"map\"\n    db.objects.put data\n\n  game.input.keyboard.addKey(Phaser.Keyboard.A)\n  .onDown.add ->\n    serializeTilemap(map)\n\nupdate = ->\n  debugText.text = game.time.fps\n\n  # Physics, Collision!\n  game.physics.arcade.collide(player, customObjects, collisionHandler, processHandler, this)\n\n  game.physics.arcade.collide(customObjects, customObjects, collisionHandler, processHandler, this)\n\n  game.physics.arcade.collide(player, game.mainLayer)\n\n  playerControls(cursors, player)\n\nmapData = null\ndb.objects.get \"map\"\n.then (d) ->\n  if d\n    mapData = d\n  else\n    tileData = new Uint8Array 1200\n\n    [40...60].forEach (i) ->\n      tileData[i] = 1\n\n    mapData =\n      width: 40\n      height: 30\n      tileWidth: 32\n      tileHeight: 32\n      collision: [1]\n      layers: [\n        data: tileData\n        name: \"layer1\"\n        width: 40\n        height: 30\n      ]\n\ndb.objects.get \"spritesheet\"\n.then (spritesheet) ->\n  if spritesheet\n    return spritesheet\n  else\n    defaultSpritesheetBlob()\n    .then (blob) ->\n      data =\n        id: \"spritesheet\"\n        blob: blob\n        spriteWidth: 32\n        spriteHeight: 32\n        width: 512\n        height: 512\n\n      db.objects.put data\n      .then ->\n        data\n\n.then ({blob, width, height, spriteWidth, spriteHeight}) ->\n  blob2img(blob)\n  .then (img) ->\n    spritesheet = Spritesheet spriteWidth, spriteHeight, width, height, img\n.then (spritesheet) ->\n  console.log spritesheet\n  canvas = spritesheet.canvas()\n\n  preload = ->\n    game.time.advancedTiming = true\n\n    game.load.crossOrigin = \"Anonymous\"\n\n    # NOTE: You can pass a canvas as the data arg here, cool undocumented feature!\n    game.cache.addSpriteSheet('spritesheet', \"\", spritesheet.canvas(), spritesheet.spriteWidth(), spritesheet.spriteHeight())\n    game.load.spritesheet('button', 'https://s3.amazonaws.com/whimsyspace-databucket-1g3p6d9lcl6x1/danielx/data/n4lN8edpcmdsAoBzeZ9-xFW7JW2WaUofe_tlkqo--8s', 193, 71)\n    game.load.image('background', \"https://s3.amazonaws.com/whimsyspace-databucket-1g3p6d9lcl6x1/danielx/data/f3I-1TlC9lsqkWBLXVsFaENRqTfLJGLYBPZf2k73OiA\")\n\n  global.game = game = new Phaser.Game 800, 600, Phaser.AUTO, document.body,\n    create: create\n    enableDebug: true\n    preload: preload\n    update: update\n\naddObject = (game, group, data) ->\n  {x, y, name, frame} = data\n\n  sprite = group.create x, y, name\n\n  sprite.frame = frame ? 0\n\n  # TODO: Custom classes/mixins\n\n  # Physics!\n  game.physics.arcade.enable sprite\n  sprite.body.collideWorldBounds = true\n\n  # Make sprite clickable\n  sprite.inputEnabled = true\n  sprite.events.onInputDown.add (sprite, pointer) ->\n    if pointer.button is Phaser.Mouse.RIGHT_BUTTON\n      sprite.destroy()\n    else\n      game.editTexture name, sprite.frame\n\n  return sprite\n\n# Want to save assets, game data, and game state\nPhaser.Game.prototype.save = ->\n  # TODO: Persist level/world data\n\n  # Serialize custom objects\n  objects: customObjects.children.map (child) ->\n    name: child.key\n    x: child.x\n    y: child.y\n    frame: child.frame\n\nPhaser.Game.prototype.restore = (data) ->\n  # Clear all custom objects\n  customObjects.removeAll()\n  # Add all objects from the data\n  data.objects.forEach (objectData) ->\n    addObject game, customObjects, objectData\n\ncollisionHandler = (player, dealy) ->\n\nprocessHandler = ->\n  true\n\nwriteSpritesheet = ->\n  spritesheet.getData().then (data) ->\n    data.id = \"spritesheet\"\n\n    db.objects.put data\n\nwriteGameObjects = ->\n  data = game.save()\n  data.id = \"objects\"\n\n  db.objects.put data\n\nserializeLayer = (layer) ->\n  {data, name, width, height} = layer\n\n  tileData = new Uint8Array layer.width * layer.height\n\n  data.map (row, y) ->\n    row.map (tile, x) ->\n      tileData[y * width + x] = tile.index\n\n  name: name\n  data: tileData\n  width: width\n  height: height\n\nserializeTilemap = (map) ->\n  {width, height, tileWidth, tileHeight, layers} = map\n\n  data =\n    collision: [1] # TODO: Need to remember our collision settings on the map/layer so we can serialize them\n    width: width\n    height: height\n    tileWidth: tileWidth\n    tileHeight: tileHeight\n    layers: layers.map serializeLayer\n\n  console.log data\n\n  return data\n\naddMapFromData = (game, mapData) ->\n  {tileWidth, tileHeight, collision, layers} = mapData\n\n  map = game.add.tilemap()\n  map.setCollision(collision)\n\n  layers.forEach (layer, layerIndex) ->\n    {data, name, width, height} = layer\n\n    game.mainLayer = layer = map.create(name, width, height, tileWidth, tileHeight)\n\n    data.forEach (tileIndex, i) ->\n      x = i % width\n      y = (i / width)|0\n\n      if tileIndex and tileIndex != 255\n        map.putTile(tileIndex, x, y, layerIndex)\n\n  return map\n",
      "mode": "100644",
      "type": "blob"
    },
    "pixie.cson": {
      "path": "pixie.cson",
      "content": "remoteDependencies: [\n  \"https://cdnjs.cloudflare.com/ajax/libs/phaser/2.4.7/phaser.min.js\"\n  \"https://npmcdn.com/dexie@1.3.6/dist/dexie.min.js\"\n]\ndependencies:\n  embedder: \"distri/embedder:v0.1.1\"\n#entryPoint: \"dexie_test\"\n",
      "mode": "100644",
      "type": "blob"
    },
    "samples.coffee": {
      "path": "samples.coffee",
      "content": "\n# Button input events\n(button) ->\n  button.onInputOver.add ->\n    console.log 'over'\n  button.onInputOut.add ->\n    console.log 'out'\n  button.onInputUp.add ->\n    console.log 'up'\n  button.onInputDown.add ->\n    console.log 'down'\n\n# Displaying FPS\n# http://phaser.io/docs/2.4.6/Phaser.Time.html\n->\n  # setup\n  game.time.advancedTiming = true\n  \n  # update\n  someText.text = game.time.fps\n",
      "mode": "100644",
      "type": "blob"
    },
    "setup.coffee": {
      "path": "setup.coffee",
      "content": "style = document.createElement \"style\"\nstyle.innerText = \"\"\"\n  html {\n    background-color: #112;\n    height: 100%;\n  }\n  body {\n    margin: 0;\n    height: 100%;\n    display: flex;\n    align-items: center;\n    justify-content: center;\n  }\n\"\"\"\ndocument.head.appendChild style\n\n\ndocument.body.addEventListener 'contextmenu', (e) ->\n  e.preventDefault()\n  return\n",
      "mode": "100644",
      "type": "blob"
    },
    "spritesheet.coffee": {
      "path": "spritesheet.coffee",
      "content": "{img2Blob} = require \"./util\"\n\nmodule.exports = (spriteWidth=32, spriteHeight=32, width=512, height=512, baseImage) ->\n  spriteWidth = 32\n  spriteHeight = 32\n\n  width = 512\n  height = 512\n\n  canvas = document.createElement 'canvas'\n  canvas.width = width\n  canvas.height = height\n\n  context = canvas.getContext('2d')\n  context.drawImage(baseImage, 0, 0)\n\n  self =\n    # Get a blob for a specific frame of the sheet\n    # Returns a promise for the blob\n    getBlob: (frame) ->\n      # Get the specific frame\n      x = (frame % 16) * spriteWidth\n      y = ((frame / 16)|0) * spriteHeight\n\n      img2Blob(canvas, x, y, spriteWidth, spriteHeight)\n\n    # Copy an image into a frame in this spritesheet\n    compose: (img, frame) ->\n      x = (frame % 16) * spriteWidth\n      y = ((frame / 16)|0) * spriteHeight\n\n      context.clearRect(x, y, spriteWidth, spriteHeight)\n      context.drawImage(img, x, y, spriteWidth, spriteHeight)\n\n    getData: ->\n      img2Blob(canvas, 0, 0, width, height)\n      .then (blob) ->\n        width: width\n        height: height\n        spriteWidth: spriteWidth\n        spriteHeight: spriteHeight\n        blob: blob\n\n    spriteWidth: ->\n      spriteWidth\n\n    spriteHeight: ->\n      spriteHeight\n\n    canvas: ->\n      canvas\n",
      "mode": "100644",
      "type": "blob"
    },
    "util.coffee": {
      "path": "util.coffee",
      "content": "canvasToBlob = (canvas) ->\n  new Promise (resolve, reject) ->\n    canvas.toBlob (blob) ->\n      resolve blob\n\nmodule.exports =\n  img2Blob: (img, x=0, y=0, width=img.width, height=img.height) ->\n    new Promise (resolve, reject) ->\n      canvas = img.ownerDocument.createElement \"canvas\"\n      canvas.width = width\n      canvas.height = height\n\n      context = canvas.getContext(\"2d\")\n      context.drawImage(img, -x, -y)\n\n      canvas.toBlob resolve\n\n  blob2img: (blob) ->\n    url = URL.createObjectURL(blob)\n\n    cleanup = ->\n      URL.revokeObjectURL(url)\n\n    new Promise (resolve, reject) ->\n      img = new Image\n      img.onload = ->\n        cleanup()\n        resolve img\n      img.onerror = (e) ->\n        cleanup()\n        reject e\n\n      img.src = url\n\n  defaultSpritesheetBlob: ->\n    size = 512\n\n    canvas = document.createElement \"canvas\"\n    canvas.width = canvas.height = size\n\n    context = canvas.getContext('2d')\n\n    context.beginPath()\n    context.rect(0, 0, size, size)\n    context.fillStyle = \"#FF00FF\"\n    context.fill()\n\n    canvasToBlob(canvas)\n",
      "mode": "100644",
      "type": "blob"
    }
  },
  "distribution": {
    "db": {
      "path": "db",
      "content": "(function() {\n  module.exports = function() {\n    var db;\n    db = new Dexie(\"objects\");\n    db.version(1).stores({\n      objects: \"id\"\n    });\n    return db;\n  };\n\n}).call(this);\n",
      "type": "blob"
    },
    "main": {
      "path": "main",
      "content": "(function() {\n  var Embedder, Spritesheet, addDebug, addMapFromData, addObject, blob2img, canJump, click, collisionHandler, create, cursors, customObjects, db, debugData, debugText, defaultSpritesheetBlob, img2Blob, mapData, player, playerControls, processHandler, serializeLayer, serializeTilemap, spritesheet, update, writeGameObjects, writeSpritesheet, _ref;\n\n  require(\"./setup\");\n\n  _ref = require(\"./util\"), blob2img = _ref.blob2img, defaultSpritesheetBlob = _ref.defaultSpritesheetBlob, img2Blob = _ref.img2Blob;\n\n  Spritesheet = require(\"./spritesheet\");\n\n  db = require(\"./db\")();\n\n  Embedder = require(\"embedder\");\n\n  customObjects = null;\n\n  debugText = null;\n\n  spritesheet = null;\n\n  cursors = null;\n\n  player = null;\n\n  debugData = {};\n\n  addDebug = function(data) {\n    return Object.keys(data).forEach(function(key) {\n      return debugData[key] = data[key];\n    });\n  };\n\n  canJump = function(player) {\n    var playerFoot;\n    playerFoot = player.getBounds();\n    playerFoot.top = playerFoot.y + playerFoot.height;\n    playerFoot.height = 1;\n    return player.body.blocked.down || customObjects.children.map(function(sprite) {\n      return sprite.getBounds();\n    }).reduce(function(collides, bounds) {\n      return collides || Phaser.Rectangle.intersects(playerFoot, bounds);\n    }, false);\n  };\n\n  playerControls = function(cursors, player) {\n    if (cursors.left.isDown) {\n      player.body.velocity.x = -150;\n    } else if (cursors.right.isDown) {\n      player.body.velocity.x = 150;\n    } else {\n      player.body.velocity.x = 0;\n    }\n    if (cursors.up.isDown && canJump(player)) {\n      player.body.velocity.y = -350;\n    }\n    if (!cursors.up.isDown && player.body.velocity.y < 0) {\n      return player.body.velocity.y = 0;\n    }\n  };\n\n  click = (function() {\n    var activeFrame, childWindow, embedder;\n    childWindow = null;\n    embedder = null;\n    activeFrame = 0;\n    Phaser.Game.prototype.editTexture = function(name, frame) {\n      activeFrame = frame;\n      return spritesheet.getBlob(frame).then(function(blob) {\n        return embedder.loadFile(blob);\n      });\n    };\n    return function() {\n      console.log(\"click\");\n      embedder = Embedder(\"https://danielx.net/pixel-editor/\", {\n        childLoaded: function() {\n          return console.log(\"Editor Loaded\");\n        },\n        save: function(data) {\n          console.log(\"Save\");\n          return blob2img(data.image).then(function(img) {\n            spritesheet.compose(img, activeFrame);\n            game.cache.addSpriteSheet('spritesheet', \"\", spritesheet.canvas(), spritesheet.spriteWidth(), spritesheet.spriteHeight());\n            customObjects.children.map(function(obj) {\n              return obj.loadTexture(\"spritesheet\", obj.frame);\n            });\n          });\n        }\n      });\n      return childWindow = embedder.remoteTaregt();\n    };\n  })();\n\n  create = function() {\n    var background, button, currentTileIndex, map;\n    game.stage.backgroundColor = '#182d3b';\n    background = game.add.tileSprite(0, 0, 800, 600, 'background');\n    map = addMapFromData(game, mapData);\n    game.mainLayer.resizeWorld();\n    currentTileIndex = 1;\n    button = game.add.button(game.world.centerX - 95, 400, 'button', click, this, 2, 1, 0);\n    cursors = game.input.keyboard.createCursorKeys();\n    game.physics.arcade.gravity.y = 500;\n    player = game.add.sprite(0, 0, 'dude');\n    game.physics.enable(player, Phaser.Physics.ARCADE);\n    player.body.collideWorldBounds = true;\n    game.camera.follow(player);\n    customObjects = game.add.group();\n    db.objects.get(\"objects\").then(function(data) {\n      if (data) {\n        return game.restore(data);\n      }\n    });\n    debugText = game.add.text(0, 0, \"\", {\n      fill: \"#080\"\n    });\n    game.input.onDown.add(function(_arg) {\n      var x, y;\n      x = _arg.worldX, y = _arg.worldY;\n      map.putTile(currentTileIndex, game.mainLayer.getTileX(x), game.mainLayer.getTileY(y), game.mainLayer);\n      return console.log(\"get down\");\n    });\n    [\"ZERO\", \"ONE\", \"TWO\", \"THREE\"].forEach(function(key, i) {\n      return game.input.keyboard.addKey(Phaser.Keyboard[key]).onDown.add(function() {\n        var name, x, y;\n        name = \"spritesheet\";\n        x = Math.floor(game.width * Math.random()) | 0;\n        y = 100;\n        return addObject(game, customObjects, {\n          name: name,\n          x: x,\n          y: y,\n          frame: i\n        });\n      });\n    });\n    game.input.keyboard.addKey(Phaser.Keyboard.S).onDown.add(function() {\n      var data;\n      writeSpritesheet();\n      writeGameObjects();\n      data = serializeTilemap(map);\n      data.id = \"map\";\n      return db.objects.put(data);\n    });\n    return game.input.keyboard.addKey(Phaser.Keyboard.A).onDown.add(function() {\n      return serializeTilemap(map);\n    });\n  };\n\n  update = function() {\n    debugText.text = game.time.fps;\n    game.physics.arcade.collide(player, customObjects, collisionHandler, processHandler, this);\n    game.physics.arcade.collide(customObjects, customObjects, collisionHandler, processHandler, this);\n    game.physics.arcade.collide(player, game.mainLayer);\n    return playerControls(cursors, player);\n  };\n\n  mapData = null;\n\n  db.objects.get(\"map\").then(function(d) {\n    var tileData;\n    if (d) {\n      return mapData = d;\n    } else {\n      tileData = new Uint8Array(1200);\n      [40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59].forEach(function(i) {\n        return tileData[i] = 1;\n      });\n      return mapData = {\n        width: 40,\n        height: 30,\n        tileWidth: 32,\n        tileHeight: 32,\n        collision: [1],\n        layers: [\n          {\n            data: tileData,\n            name: \"layer1\",\n            width: 40,\n            height: 30\n          }\n        ]\n      };\n    }\n  });\n\n  db.objects.get(\"spritesheet\").then(function(spritesheet) {\n    if (spritesheet) {\n      return spritesheet;\n    } else {\n      return defaultSpritesheetBlob().then(function(blob) {\n        var data;\n        data = {\n          id: \"spritesheet\",\n          blob: blob,\n          spriteWidth: 32,\n          spriteHeight: 32,\n          width: 512,\n          height: 512\n        };\n        return db.objects.put(data).then(function() {\n          return data;\n        });\n      });\n    }\n  }).then(function(_arg) {\n    var blob, height, spriteHeight, spriteWidth, width;\n    blob = _arg.blob, width = _arg.width, height = _arg.height, spriteWidth = _arg.spriteWidth, spriteHeight = _arg.spriteHeight;\n    return blob2img(blob).then(function(img) {\n      return spritesheet = Spritesheet(spriteWidth, spriteHeight, width, height, img);\n    });\n  }).then(function(spritesheet) {\n    var canvas, game, preload;\n    console.log(spritesheet);\n    canvas = spritesheet.canvas();\n    preload = function() {\n      game.time.advancedTiming = true;\n      game.load.crossOrigin = \"Anonymous\";\n      game.cache.addSpriteSheet('spritesheet', \"\", spritesheet.canvas(), spritesheet.spriteWidth(), spritesheet.spriteHeight());\n      game.load.spritesheet('button', 'https://s3.amazonaws.com/whimsyspace-databucket-1g3p6d9lcl6x1/danielx/data/n4lN8edpcmdsAoBzeZ9-xFW7JW2WaUofe_tlkqo--8s', 193, 71);\n      return game.load.image('background', \"https://s3.amazonaws.com/whimsyspace-databucket-1g3p6d9lcl6x1/danielx/data/f3I-1TlC9lsqkWBLXVsFaENRqTfLJGLYBPZf2k73OiA\");\n    };\n    return global.game = game = new Phaser.Game(800, 600, Phaser.AUTO, document.body, {\n      create: create,\n      enableDebug: true,\n      preload: preload,\n      update: update\n    });\n  });\n\n  addObject = function(game, group, data) {\n    var frame, name, sprite, x, y;\n    x = data.x, y = data.y, name = data.name, frame = data.frame;\n    sprite = group.create(x, y, name);\n    sprite.frame = frame != null ? frame : 0;\n    game.physics.arcade.enable(sprite);\n    sprite.body.collideWorldBounds = true;\n    sprite.inputEnabled = true;\n    sprite.events.onInputDown.add(function(sprite, pointer) {\n      if (pointer.button === Phaser.Mouse.RIGHT_BUTTON) {\n        return sprite.destroy();\n      } else {\n        return game.editTexture(name, sprite.frame);\n      }\n    });\n    return sprite;\n  };\n\n  Phaser.Game.prototype.save = function() {\n    return {\n      objects: customObjects.children.map(function(child) {\n        return {\n          name: child.key,\n          x: child.x,\n          y: child.y,\n          frame: child.frame\n        };\n      })\n    };\n  };\n\n  Phaser.Game.prototype.restore = function(data) {\n    customObjects.removeAll();\n    return data.objects.forEach(function(objectData) {\n      return addObject(game, customObjects, objectData);\n    });\n  };\n\n  collisionHandler = function(player, dealy) {};\n\n  processHandler = function() {\n    return true;\n  };\n\n  writeSpritesheet = function() {\n    return spritesheet.getData().then(function(data) {\n      data.id = \"spritesheet\";\n      return db.objects.put(data);\n    });\n  };\n\n  writeGameObjects = function() {\n    var data;\n    data = game.save();\n    data.id = \"objects\";\n    return db.objects.put(data);\n  };\n\n  serializeLayer = function(layer) {\n    var data, height, name, tileData, width;\n    data = layer.data, name = layer.name, width = layer.width, height = layer.height;\n    tileData = new Uint8Array(layer.width * layer.height);\n    data.map(function(row, y) {\n      return row.map(function(tile, x) {\n        return tileData[y * width + x] = tile.index;\n      });\n    });\n    return {\n      name: name,\n      data: tileData,\n      width: width,\n      height: height\n    };\n  };\n\n  serializeTilemap = function(map) {\n    var data, height, layers, tileHeight, tileWidth, width;\n    width = map.width, height = map.height, tileWidth = map.tileWidth, tileHeight = map.tileHeight, layers = map.layers;\n    data = {\n      collision: [1],\n      width: width,\n      height: height,\n      tileWidth: tileWidth,\n      tileHeight: tileHeight,\n      layers: layers.map(serializeLayer)\n    };\n    console.log(data);\n    return data;\n  };\n\n  addMapFromData = function(game, mapData) {\n    var collision, layers, map, tileHeight, tileWidth;\n    tileWidth = mapData.tileWidth, tileHeight = mapData.tileHeight, collision = mapData.collision, layers = mapData.layers;\n    map = game.add.tilemap();\n    map.setCollision(collision);\n    layers.forEach(function(layer, layerIndex) {\n      var data, height, name, width;\n      data = layer.data, name = layer.name, width = layer.width, height = layer.height;\n      game.mainLayer = layer = map.create(name, width, height, tileWidth, tileHeight);\n      return data.forEach(function(tileIndex, i) {\n        var x, y;\n        x = i % width;\n        y = (i / width) | 0;\n        if (tileIndex && tileIndex !== 255) {\n          return map.putTile(tileIndex, x, y, layerIndex);\n        }\n      });\n    });\n    return map;\n  };\n\n}).call(this);\n",
      "type": "blob"
    },
    "pixie": {
      "path": "pixie",
      "content": "module.exports = {\"remoteDependencies\":[\"https://cdnjs.cloudflare.com/ajax/libs/phaser/2.4.7/phaser.min.js\",\"https://npmcdn.com/dexie@1.3.6/dist/dexie.min.js\"],\"dependencies\":{\"embedder\":\"distri/embedder:v0.1.1\"}};",
      "type": "blob"
    },
    "samples": {
      "path": "samples",
      "content": "(function() {\n  (function(button) {\n    button.onInputOver.add(function() {\n      return console.log('over');\n    });\n    button.onInputOut.add(function() {\n      return console.log('out');\n    });\n    button.onInputUp.add(function() {\n      return console.log('up');\n    });\n    return button.onInputDown.add(function() {\n      return console.log('down');\n    });\n  });\n\n  (function() {\n    game.time.advancedTiming = true;\n    return someText.text = game.time.fps;\n  });\n\n}).call(this);\n",
      "type": "blob"
    },
    "setup": {
      "path": "setup",
      "content": "(function() {\n  var style;\n\n  style = document.createElement(\"style\");\n\n  style.innerText = \"html {\\n  background-color: #112;\\n  height: 100%;\\n}\\nbody {\\n  margin: 0;\\n  height: 100%;\\n  display: flex;\\n  align-items: center;\\n  justify-content: center;\\n}\";\n\n  document.head.appendChild(style);\n\n  document.body.addEventListener('contextmenu', function(e) {\n    e.preventDefault();\n  });\n\n}).call(this);\n",
      "type": "blob"
    },
    "spritesheet": {
      "path": "spritesheet",
      "content": "(function() {\n  var img2Blob;\n\n  img2Blob = require(\"./util\").img2Blob;\n\n  module.exports = function(spriteWidth, spriteHeight, width, height, baseImage) {\n    var canvas, context, self;\n    if (spriteWidth == null) {\n      spriteWidth = 32;\n    }\n    if (spriteHeight == null) {\n      spriteHeight = 32;\n    }\n    if (width == null) {\n      width = 512;\n    }\n    if (height == null) {\n      height = 512;\n    }\n    spriteWidth = 32;\n    spriteHeight = 32;\n    width = 512;\n    height = 512;\n    canvas = document.createElement('canvas');\n    canvas.width = width;\n    canvas.height = height;\n    context = canvas.getContext('2d');\n    context.drawImage(baseImage, 0, 0);\n    return self = {\n      getBlob: function(frame) {\n        var x, y;\n        x = (frame % 16) * spriteWidth;\n        y = ((frame / 16) | 0) * spriteHeight;\n        return img2Blob(canvas, x, y, spriteWidth, spriteHeight);\n      },\n      compose: function(img, frame) {\n        var x, y;\n        x = (frame % 16) * spriteWidth;\n        y = ((frame / 16) | 0) * spriteHeight;\n        context.clearRect(x, y, spriteWidth, spriteHeight);\n        return context.drawImage(img, x, y, spriteWidth, spriteHeight);\n      },\n      getData: function() {\n        return img2Blob(canvas, 0, 0, width, height).then(function(blob) {\n          return {\n            width: width,\n            height: height,\n            spriteWidth: spriteWidth,\n            spriteHeight: spriteHeight,\n            blob: blob\n          };\n        });\n      },\n      spriteWidth: function() {\n        return spriteWidth;\n      },\n      spriteHeight: function() {\n        return spriteHeight;\n      },\n      canvas: function() {\n        return canvas;\n      }\n    };\n  };\n\n}).call(this);\n",
      "type": "blob"
    },
    "util": {
      "path": "util",
      "content": "(function() {\n  var canvasToBlob;\n\n  canvasToBlob = function(canvas) {\n    return new Promise(function(resolve, reject) {\n      return canvas.toBlob(function(blob) {\n        return resolve(blob);\n      });\n    });\n  };\n\n  module.exports = {\n    img2Blob: function(img, x, y, width, height) {\n      if (x == null) {\n        x = 0;\n      }\n      if (y == null) {\n        y = 0;\n      }\n      if (width == null) {\n        width = img.width;\n      }\n      if (height == null) {\n        height = img.height;\n      }\n      return new Promise(function(resolve, reject) {\n        var canvas, context;\n        canvas = img.ownerDocument.createElement(\"canvas\");\n        canvas.width = width;\n        canvas.height = height;\n        context = canvas.getContext(\"2d\");\n        context.drawImage(img, -x, -y);\n        return canvas.toBlob(resolve);\n      });\n    },\n    blob2img: function(blob) {\n      var cleanup, url;\n      url = URL.createObjectURL(blob);\n      cleanup = function() {\n        return URL.revokeObjectURL(url);\n      };\n      return new Promise(function(resolve, reject) {\n        var img;\n        img = new Image;\n        img.onload = function() {\n          cleanup();\n          return resolve(img);\n        };\n        img.onerror = function(e) {\n          cleanup();\n          return reject(e);\n        };\n        return img.src = url;\n      });\n    },\n    defaultSpritesheetBlob: function() {\n      var canvas, context, size;\n      size = 512;\n      canvas = document.createElement(\"canvas\");\n      canvas.width = canvas.height = size;\n      context = canvas.getContext('2d');\n      context.beginPath();\n      context.rect(0, 0, size, size);\n      context.fillStyle = \"#FF00FF\";\n      context.fill();\n      return canvasToBlob(canvas);\n    }\n  };\n\n}).call(this);\n",
      "type": "blob"
    }
  },
  "progenitor": {
    "url": "https://danielx.net/editor/"
  },
  "entryPoint": "main",
  "remoteDependencies": [
    "https://cdnjs.cloudflare.com/ajax/libs/phaser/2.4.7/phaser.min.js",
    "https://npmcdn.com/dexie@1.3.6/dist/dexie.min.js"
  ],
  "repository": {
    "branch": "master",
    "default_branch": "master",
    "full_name": "STRd6/gamey",
    "homepage": null,
    "description": "Tastes a bit gamey",
    "html_url": "https://github.com/STRd6/gamey",
    "url": "https://api.github.com/repos/STRd6/gamey",
    "publishBranch": "gh-pages"
  },
  "dependencies": {
    "embedder": {
      "source": {
        "LICENSE": {
          "path": "LICENSE",
          "content": "The MIT License (MIT)\n\nCopyright (c) 2016 \n\nPermission is hereby granted, free of charge, to any person obtaining a copy\nof this software and associated documentation files (the \"Software\"), to deal\nin the Software without restriction, including without limitation the rights\nto use, copy, modify, merge, publish, distribute, sublicense, and/or sell\ncopies of the Software, and to permit persons to whom the Software is\nfurnished to do so, subject to the following conditions:\n\nThe above copyright notice and this permission notice shall be included in all\ncopies or substantial portions of the Software.\n\nTHE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\nIMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\nFITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE\nAUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER\nLIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,\nOUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE\nSOFTWARE.\n",
          "mode": "100644",
          "type": "blob"
        },
        "README.md": {
          "path": "README.md",
          "content": "# embedder\nEmbed postmasterable windows in your app\n",
          "mode": "100644",
          "type": "blob"
        },
        "main.coffee": {
          "path": "main.coffee",
          "content": "Postmaster = require \"postmaster\"\n\nmodule.exports = (url, handlers, options={}) ->\n  {name, width, height} = options\n  width ?= 800\n  height ?= 600\n\n  childWindow = window.open url, name, \"width=#{width},height=#{height}\"\n\n  postmaster = Postmaster(handlers)\n  postmaster.remoteTarget = -> childWindow\n\n  # Return a proxy for easy Postmastering\n  proxy = new Proxy postmaster,\n    get: (target, property, receiver) ->\n      target[property] or\n      (args...) ->\n        target.invokeRemote property, args...\n\n  return proxy\n",
          "mode": "100644",
          "type": "blob"
        },
        "pixie.cson": {
          "path": "pixie.cson",
          "content": "version: \"0.1.1\"\ndependencies:\n  postmaster: \"distri/postmaster:v0.5.0\"\n",
          "mode": "100644",
          "type": "blob"
        },
        "test/main.coffee": {
          "path": "test/main.coffee",
          "content": "Embedder = require \"../main\"\n\ndescribe \"embedder\", ->\n  it \"should have the child window property\", ->\n    embedder = Embedder()\n\n    win = embedder.remoteTarget()\n    console.log win\n    assert win\n    win.close()\n",
          "mode": "100644"
        }
      },
      "distribution": {
        "main": {
          "path": "main",
          "content": "(function() {\n  var Postmaster,\n    __slice = [].slice;\n\n  Postmaster = require(\"postmaster\");\n\n  module.exports = function(url, handlers, options) {\n    var childWindow, height, name, postmaster, proxy, width;\n    if (options == null) {\n      options = {};\n    }\n    name = options.name, width = options.width, height = options.height;\n    if (width == null) {\n      width = 800;\n    }\n    if (height == null) {\n      height = 600;\n    }\n    childWindow = window.open(url, name, \"width=\" + width + \",height=\" + height);\n    postmaster = Postmaster(handlers);\n    postmaster.remoteTarget = function() {\n      return childWindow;\n    };\n    proxy = new Proxy(postmaster, {\n      get: function(target, property, receiver) {\n        return target[property] || function() {\n          var args;\n          args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];\n          return target.invokeRemote.apply(target, [property].concat(__slice.call(args)));\n        };\n      }\n    });\n    return proxy;\n  };\n\n}).call(this);\n",
          "type": "blob"
        },
        "pixie": {
          "path": "pixie",
          "content": "module.exports = {\"version\":\"0.1.1\",\"dependencies\":{\"postmaster\":\"distri/postmaster:v0.5.0\"}};",
          "type": "blob"
        },
        "test/main": {
          "path": "test/main",
          "content": "(function() {\n  var Embedder;\n\n  Embedder = require(\"../main\");\n\n  describe(\"embedder\", function() {\n    return it(\"should have the child window property\", function() {\n      var embedder, win;\n      embedder = Embedder();\n      win = embedder.remoteTarget();\n      console.log(win);\n      assert(win);\n      return win.close();\n    });\n  });\n\n}).call(this);\n",
          "type": "blob"
        }
      },
      "progenitor": {
        "url": "https://danielx.net/editor/"
      },
      "version": "0.1.1",
      "entryPoint": "main",
      "repository": {
        "branch": "v0.1.1",
        "default_branch": "master",
        "full_name": "distri/embedder",
        "homepage": null,
        "description": "Embed postmasterable windows in your app",
        "html_url": "https://github.com/distri/embedder",
        "url": "https://api.github.com/repos/distri/embedder",
        "publishBranch": "gh-pages"
      },
      "dependencies": {
        "postmaster": {
          "source": {
            "LICENSE": {
              "path": "LICENSE",
              "content": "The MIT License (MIT)\n\nCopyright (c) 2013 distri\n\nPermission is hereby granted, free of charge, to any person obtaining a copy of\nthis software and associated documentation files (the \"Software\"), to deal in\nthe Software without restriction, including without limitation the rights to\nuse, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of\nthe Software, and to permit persons to whom the Software is furnished to do so,\nsubject to the following conditions:\n\nThe above copyright notice and this permission notice shall be included in all\ncopies or substantial portions of the Software.\n\nTHE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\nIMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS\nFOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR\nCOPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER\nIN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN\nCONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.\n",
              "mode": "100644",
              "type": "blob"
            },
            "README.md": {
              "path": "README.md",
              "content": "postmaster\n==========\n\nSend and receive `postMessage` commands using promises to handle the results.\n",
              "mode": "100644",
              "type": "blob"
            },
            "main.coffee": {
              "path": "main.coffee",
              "content": "###\n\nPostmaster wraps the `postMessage` API with promises.\n\n###\n\ndefaultReceiver = self\nackTimeout = 1000\n\nmodule.exports = Postmaster = (self={}) ->\n  send = (data) ->\n    target = self.remoteTarget()\n    if !Worker? or target instanceof Worker\n      target.postMessage data\n    else\n      target.postMessage data, \"*\"\n\n  dominant = Postmaster.dominant()\n  self.remoteTarget ?= -> dominant\n  self.receiver ?= -> defaultReceiver\n  self.ackTimeout ?= -> ackTimeout\n\n  self.receiver().addEventListener \"message\", (event) ->\n    # Only listening to messages from `opener`\n    if event.source is self.remoteTarget() or !event.source\n      data = event.data\n      {type, method, params, id} = data\n\n      switch type\n        when \"ack\"\n          pendingResponses[id]?.ack = true\n        when \"response\"\n          pendingResponses[id].resolve data.result\n        when \"error\"\n          pendingResponses[id].reject data.error\n        when \"message\"\n          send\n            type: \"ack\"\n            id: id\n\n          Promise.resolve()\n          .then ->\n            if typeof self[method] is \"function\"\n              self[method](params...)\n            else\n              throw new Error \"`#{method}` is not a function\"\n          .then (result) ->\n            send\n              type: \"response\"\n              id: id\n              result: result\n          .catch (error) ->\n            if typeof error is \"string\"\n              message = error\n            else\n              message = error.message\n\n            send\n              type: \"error\"\n              id: id\n              error:\n                message: message\n                stack: error.stack\n\n  pendingResponses = {}\n  remoteId = 0\n\n  self.invokeRemote = (method, params...) ->\n    id = remoteId++\n\n    send\n      type: \"message\"\n      method: method\n      params: params\n      id: id\n\n    new Promise (resolve, reject) ->\n      clear = ->\n        clearTimeout pendingResponses[id].timeout\n        delete pendingResponses[id]\n\n      ackWait = self.ackTimeout()\n      timeout = setTimeout ->\n        pendingResponse = pendingResponses[id]\n        if pendingResponse and !pendingResponse.ack\n          clear()\n          reject new Error \"No ack received within #{ackWait}\"\n      , ackWait\n\n      pendingResponses[id] =\n        timeout: timeout\n        resolve: (result) ->\n          clear()\n          resolve(result)\n        reject: (error) ->\n          clear()\n          reject(error)\n\n  return self\n\nPostmaster.dominant = ->\n  if window? # iframe or child window context\n    opener or ((parent != window) and parent) or undefined\n  else # Web Worker Context\n    self\n\nreturn Postmaster\n",
              "mode": "100644",
              "type": "blob"
            },
            "pixie.cson": {
              "path": "pixie.cson",
              "content": "version: \"0.5.0\"\n",
              "mode": "100644",
              "type": "blob"
            },
            "test/postmaster.coffee": {
              "path": "test/postmaster.coffee",
              "content": "Postmaster = require \"../main\"\n\nscriptContent = ->\n  fn = ->\n    pm = Postmaster()\n    pm.echo = (value) ->\n      return value\n    pm.throws = ->\n      throw new Error(\"This always throws\")\n    pm.promiseFail = ->\n      Promise.reject new Error \"This is a failed promise\"\n\n  \"\"\"\n    var module = {};\n    Postmaster = #{PACKAGE.distribution.main.content};\n    (#{fn.toString()})();\n  \"\"\"\n\ninitWindow = (targetWindow) ->\n  targetWindow.document.write \"<script>#{scriptContent()}<\\/script>\"\n\ndescribe \"Postmaster\", ->\n  it \"should work with openened windows\", (done) ->\n    childWindow = open(\"\", null, \"width=200,height=200\")\n\n    initWindow(childWindow)\n\n    postmaster = Postmaster()\n    postmaster.remoteTarget = -> childWindow\n    postmaster.invokeRemote \"echo\", 5\n    .then (result) ->\n      assert.equal result, 5\n    .then ->\n      done()\n    , (error) ->\n      done(error)\n    .then ->\n      childWindow.close()\n\n  it \"should work with iframes\", (done) ->\n    iframe = document.createElement('iframe')\n    document.body.appendChild(iframe)\n\n    childWindow = iframe.contentWindow\n    initWindow(childWindow)\n\n    postmaster = Postmaster()\n    postmaster.remoteTarget = -> childWindow\n    postmaster.invokeRemote \"echo\", 17\n    .then (result) ->\n      assert.equal result, 17\n    .then ->\n      done()\n    , (error) ->\n      done(error)\n    .then ->\n      iframe.remove()\n\n  it \"should handle the remote call throwing errors\", (done) ->\n    iframe = document.createElement('iframe')\n    document.body.appendChild(iframe)\n\n    childWindow = iframe.contentWindow\n    initWindow(childWindow)\n\n    postmaster = Postmaster()\n    postmaster.remoteTarget = -> childWindow\n    postmaster.invokeRemote \"throws\"\n    .catch (error) ->\n      done()\n    .then ->\n      iframe.remove()\n\n  it \"should throwing a useful error when the remote doesn't define the function\", (done) ->\n    iframe = document.createElement('iframe')\n    document.body.appendChild(iframe)\n\n    childWindow = iframe.contentWindow\n    initWindow(childWindow)\n\n    postmaster = Postmaster()\n    postmaster.remoteTarget = -> childWindow\n    postmaster.invokeRemote \"someUndefinedFunction\"\n    .catch (error) ->\n      done()\n    .then ->\n      iframe.remove()\n\n  it \"should handle the remote call returning failed promises\", (done) ->\n    iframe = document.createElement('iframe')\n    document.body.appendChild(iframe)\n\n    childWindow = iframe.contentWindow\n    initWindow(childWindow)\n\n    postmaster = Postmaster()\n    postmaster.remoteTarget = -> childWindow\n    postmaster.invokeRemote \"promiseFail\"\n    .catch (error) ->\n      done()\n    .then ->\n      iframe.remove()\n\n  it \"should be able to go around the world\", (done) ->\n    iframe = document.createElement('iframe')\n    document.body.appendChild(iframe)\n\n    childWindow = iframe.contentWindow\n    initWindow(childWindow)\n\n    postmaster = Postmaster()\n    postmaster.remoteTarget = -> childWindow\n    postmaster.yolo = (txt) ->\n      \"heyy #{txt}\"\n    postmaster.invokeRemote \"invokeRemote\", \"yolo\", \"cool\"\n    .then (result) ->\n      assert.equal result, \"heyy cool\"\n    .then ->\n      done()\n    , (error) ->\n      done(error)\n    .then ->\n      iframe.remove()\n\n  it \"should work with web workers\", (done) ->\n    blob = new Blob [scriptContent()]\n    jsUrl = URL.createObjectURL(blob)\n\n    worker = new Worker(jsUrl)\n\n    base =\n      remoteTarget: -> worker\n      receiver: -> worker\n\n    postmaster = Postmaster(base)\n    postmaster.invokeRemote \"echo\", 17\n    .then (result) ->\n      assert.equal result, 17\n    .then ->\n      done()\n    , (error) ->\n      done(error)\n    .then ->\n      worker.terminate()\n\n  it \"should fail quickly when contacting a window that doesn't support Postmaster\", (done) ->\n    iframe = document.createElement('iframe')\n    document.body.appendChild(iframe)\n\n    childWindow = iframe.contentWindow\n    postmaster = Postmaster()\n    postmaster.remoteTarget = -> childWindow\n    postmaster.invokeRemote \"echo\", 5\n    .catch (e) ->\n      if e.message.match /no ack/i\n        done()\n      else\n        done(1)\n    .then ->\n      iframe.remove()\n",
              "mode": "100644",
              "type": "blob"
            }
          },
          "distribution": {
            "main": {
              "path": "main",
              "content": "\n/*\n\nPostmaster wraps the `postMessage` API with promises.\n */\n\n(function() {\n  var Postmaster, ackTimeout, defaultReceiver,\n    __slice = [].slice;\n\n  defaultReceiver = self;\n\n  ackTimeout = 1000;\n\n  module.exports = Postmaster = function(self) {\n    var dominant, pendingResponses, remoteId, send;\n    if (self == null) {\n      self = {};\n    }\n    send = function(data) {\n      var target;\n      target = self.remoteTarget();\n      if ((typeof Worker === \"undefined\" || Worker === null) || target instanceof Worker) {\n        return target.postMessage(data);\n      } else {\n        return target.postMessage(data, \"*\");\n      }\n    };\n    dominant = Postmaster.dominant();\n    if (self.remoteTarget == null) {\n      self.remoteTarget = function() {\n        return dominant;\n      };\n    }\n    if (self.receiver == null) {\n      self.receiver = function() {\n        return defaultReceiver;\n      };\n    }\n    if (self.ackTimeout == null) {\n      self.ackTimeout = function() {\n        return ackTimeout;\n      };\n    }\n    self.receiver().addEventListener(\"message\", function(event) {\n      var data, id, method, params, type, _ref;\n      if (event.source === self.remoteTarget() || !event.source) {\n        data = event.data;\n        type = data.type, method = data.method, params = data.params, id = data.id;\n        switch (type) {\n          case \"ack\":\n            return (_ref = pendingResponses[id]) != null ? _ref.ack = true : void 0;\n          case \"response\":\n            return pendingResponses[id].resolve(data.result);\n          case \"error\":\n            return pendingResponses[id].reject(data.error);\n          case \"message\":\n            send({\n              type: \"ack\",\n              id: id\n            });\n            return Promise.resolve().then(function() {\n              if (typeof self[method] === \"function\") {\n                return self[method].apply(self, params);\n              } else {\n                throw new Error(\"`\" + method + \"` is not a function\");\n              }\n            }).then(function(result) {\n              return send({\n                type: \"response\",\n                id: id,\n                result: result\n              });\n            })[\"catch\"](function(error) {\n              var message;\n              if (typeof error === \"string\") {\n                message = error;\n              } else {\n                message = error.message;\n              }\n              return send({\n                type: \"error\",\n                id: id,\n                error: {\n                  message: message,\n                  stack: error.stack\n                }\n              });\n            });\n        }\n      }\n    });\n    pendingResponses = {};\n    remoteId = 0;\n    self.invokeRemote = function() {\n      var id, method, params;\n      method = arguments[0], params = 2 <= arguments.length ? __slice.call(arguments, 1) : [];\n      id = remoteId++;\n      send({\n        type: \"message\",\n        method: method,\n        params: params,\n        id: id\n      });\n      return new Promise(function(resolve, reject) {\n        var ackWait, clear, timeout;\n        clear = function() {\n          clearTimeout(pendingResponses[id].timeout);\n          return delete pendingResponses[id];\n        };\n        ackWait = self.ackTimeout();\n        timeout = setTimeout(function() {\n          var pendingResponse;\n          pendingResponse = pendingResponses[id];\n          if (pendingResponse && !pendingResponse.ack) {\n            clear();\n            return reject(new Error(\"No ack received within \" + ackWait));\n          }\n        }, ackWait);\n        return pendingResponses[id] = {\n          timeout: timeout,\n          resolve: function(result) {\n            clear();\n            return resolve(result);\n          },\n          reject: function(error) {\n            clear();\n            return reject(error);\n          }\n        };\n      });\n    };\n    return self;\n  };\n\n  Postmaster.dominant = function() {\n    if (typeof window !== \"undefined\" && window !== null) {\n      return opener || ((parent !== window) && parent) || void 0;\n    } else {\n      return self;\n    }\n  };\n\n  return Postmaster;\n\n}).call(this);\n",
              "type": "blob"
            },
            "pixie": {
              "path": "pixie",
              "content": "module.exports = {\"version\":\"0.5.0\"};",
              "type": "blob"
            },
            "test/postmaster": {
              "path": "test/postmaster",
              "content": "(function() {\n  var Postmaster, initWindow, scriptContent;\n\n  Postmaster = require(\"../main\");\n\n  scriptContent = function() {\n    var fn;\n    fn = function() {\n      var pm;\n      pm = Postmaster();\n      pm.echo = function(value) {\n        return value;\n      };\n      pm.throws = function() {\n        throw new Error(\"This always throws\");\n      };\n      return pm.promiseFail = function() {\n        return Promise.reject(new Error(\"This is a failed promise\"));\n      };\n    };\n    return \"var module = {};\\nPostmaster = \" + PACKAGE.distribution.main.content + \";\\n(\" + (fn.toString()) + \")();\";\n  };\n\n  initWindow = function(targetWindow) {\n    return targetWindow.document.write(\"<script>\" + (scriptContent()) + \"<\\/script>\");\n  };\n\n  describe(\"Postmaster\", function() {\n    it(\"should work with openened windows\", function(done) {\n      var childWindow, postmaster;\n      childWindow = open(\"\", null, \"width=200,height=200\");\n      initWindow(childWindow);\n      postmaster = Postmaster();\n      postmaster.remoteTarget = function() {\n        return childWindow;\n      };\n      return postmaster.invokeRemote(\"echo\", 5).then(function(result) {\n        return assert.equal(result, 5);\n      }).then(function() {\n        return done();\n      }, function(error) {\n        return done(error);\n      }).then(function() {\n        return childWindow.close();\n      });\n    });\n    it(\"should work with iframes\", function(done) {\n      var childWindow, iframe, postmaster;\n      iframe = document.createElement('iframe');\n      document.body.appendChild(iframe);\n      childWindow = iframe.contentWindow;\n      initWindow(childWindow);\n      postmaster = Postmaster();\n      postmaster.remoteTarget = function() {\n        return childWindow;\n      };\n      return postmaster.invokeRemote(\"echo\", 17).then(function(result) {\n        return assert.equal(result, 17);\n      }).then(function() {\n        return done();\n      }, function(error) {\n        return done(error);\n      }).then(function() {\n        return iframe.remove();\n      });\n    });\n    it(\"should handle the remote call throwing errors\", function(done) {\n      var childWindow, iframe, postmaster;\n      iframe = document.createElement('iframe');\n      document.body.appendChild(iframe);\n      childWindow = iframe.contentWindow;\n      initWindow(childWindow);\n      postmaster = Postmaster();\n      postmaster.remoteTarget = function() {\n        return childWindow;\n      };\n      return postmaster.invokeRemote(\"throws\")[\"catch\"](function(error) {\n        return done();\n      }).then(function() {\n        return iframe.remove();\n      });\n    });\n    it(\"should throwing a useful error when the remote doesn't define the function\", function(done) {\n      var childWindow, iframe, postmaster;\n      iframe = document.createElement('iframe');\n      document.body.appendChild(iframe);\n      childWindow = iframe.contentWindow;\n      initWindow(childWindow);\n      postmaster = Postmaster();\n      postmaster.remoteTarget = function() {\n        return childWindow;\n      };\n      return postmaster.invokeRemote(\"someUndefinedFunction\")[\"catch\"](function(error) {\n        return done();\n      }).then(function() {\n        return iframe.remove();\n      });\n    });\n    it(\"should handle the remote call returning failed promises\", function(done) {\n      var childWindow, iframe, postmaster;\n      iframe = document.createElement('iframe');\n      document.body.appendChild(iframe);\n      childWindow = iframe.contentWindow;\n      initWindow(childWindow);\n      postmaster = Postmaster();\n      postmaster.remoteTarget = function() {\n        return childWindow;\n      };\n      return postmaster.invokeRemote(\"promiseFail\")[\"catch\"](function(error) {\n        return done();\n      }).then(function() {\n        return iframe.remove();\n      });\n    });\n    it(\"should be able to go around the world\", function(done) {\n      var childWindow, iframe, postmaster;\n      iframe = document.createElement('iframe');\n      document.body.appendChild(iframe);\n      childWindow = iframe.contentWindow;\n      initWindow(childWindow);\n      postmaster = Postmaster();\n      postmaster.remoteTarget = function() {\n        return childWindow;\n      };\n      postmaster.yolo = function(txt) {\n        return \"heyy \" + txt;\n      };\n      return postmaster.invokeRemote(\"invokeRemote\", \"yolo\", \"cool\").then(function(result) {\n        return assert.equal(result, \"heyy cool\");\n      }).then(function() {\n        return done();\n      }, function(error) {\n        return done(error);\n      }).then(function() {\n        return iframe.remove();\n      });\n    });\n    it(\"should work with web workers\", function(done) {\n      var base, blob, jsUrl, postmaster, worker;\n      blob = new Blob([scriptContent()]);\n      jsUrl = URL.createObjectURL(blob);\n      worker = new Worker(jsUrl);\n      base = {\n        remoteTarget: function() {\n          return worker;\n        },\n        receiver: function() {\n          return worker;\n        }\n      };\n      postmaster = Postmaster(base);\n      return postmaster.invokeRemote(\"echo\", 17).then(function(result) {\n        return assert.equal(result, 17);\n      }).then(function() {\n        return done();\n      }, function(error) {\n        return done(error);\n      }).then(function() {\n        return worker.terminate();\n      });\n    });\n    return it(\"should fail quickly when contacting a window that doesn't support Postmaster\", function(done) {\n      var childWindow, iframe, postmaster;\n      iframe = document.createElement('iframe');\n      document.body.appendChild(iframe);\n      childWindow = iframe.contentWindow;\n      postmaster = Postmaster();\n      postmaster.remoteTarget = function() {\n        return childWindow;\n      };\n      return postmaster.invokeRemote(\"echo\", 5)[\"catch\"](function(e) {\n        if (e.message.match(/no ack/i)) {\n          return done();\n        } else {\n          return done(1);\n        }\n      }).then(function() {\n        return iframe.remove();\n      });\n    });\n  });\n\n}).call(this);\n",
              "type": "blob"
            }
          },
          "progenitor": {
            "url": "https://danielx.net/editor/"
          },
          "version": "0.5.0",
          "entryPoint": "main",
          "repository": {
            "branch": "v0.5.0",
            "default_branch": "master",
            "full_name": "distri/postmaster",
            "homepage": null,
            "description": "Send and receive postMessage commands.",
            "html_url": "https://github.com/distri/postmaster",
            "url": "https://api.github.com/repos/distri/postmaster",
            "publishBranch": "gh-pages"
          },
          "dependencies": {}
        }
      }
    }
  }
});