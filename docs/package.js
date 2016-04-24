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
    "main.coffee": {
      "path": "main.coffee",
      "content": "style = document.createElement \"style\"\nstyle.innerText = \"\"\"\n  html {\n    background-color: #112;\n    height: 100%;\n  }\n  body {\n    margin: 0;\n    height: 100%;\n    display: flex;\n    align-items: center;\n    justify-content: center;\n  }\n\"\"\"\ndocument.head.appendChild style\n\nEmbedder = require \"embedder\"\ncustomObjects = null\n\npreload = ->\n  game.load.crossOrigin = \"Anonymous\"\n\n  game.load.spritesheet('button', 'https://s3.amazonaws.com/whimsyspace-databucket-1g3p6d9lcl6x1/danielx/data/n4lN8edpcmdsAoBzeZ9-xFW7JW2WaUofe_tlkqo--8s', 193, 71)\n  game.load.image('background', \"https://s3.amazonaws.com/whimsyspace-databucket-1g3p6d9lcl6x1/danielx/data/f3I-1TlC9lsqkWBLXVsFaENRqTfLJGLYBPZf2k73OiA\")\n\nclick = do ->\n  childWindow = null\n  embedder = null\n  i = 0\n\n  Phaser.Game.prototype.editTexture = (name, blob) ->\n    embedder.loadFile blob\n\n  return ->\n    console.log \"click\"\n\n    embedder = Embedder \"https://danielx.net/pixel-editor/\",\n      childLoaded: ->\n        console.log \"Editor Loaded\"\n      save: (data) ->\n        console.log \"Save\"\n        url = URL.createObjectURL(data.image)\n\n        name = \"yolo#{i}\"\n        game.load.image(name, url)\n        game.load.onLoadComplete.addOnce ->\n          x = Math.floor(game.width * Math.random())|0\n          y = Math.floor(game.width * Math.random())|0\n\n          addObject game, customObjects,\n            name: name\n            x: x\n            y: y\n\n        i += 1\n        game.load.start()\n\n    childWindow = embedder.remoteTaregt()\n\ncreate = ->\n  game.stage.backgroundColor = '#182d3b'\n\n  background = game.add.tileSprite(0, 0, 800, 600, 'background')\n\n  button = game.add.button(game.world.centerX - 95, 400, 'button', click, this, 2, 1, 0)\n\n  button.onInputOver.add ->\n    console.log 'over'\n  button.onInputOut.add ->\n    console.log 'out'\n  button.onInputUp.add ->\n    console.log 'up'\n  button.onInputDown.add ->\n    console.log 'down'\n\n  customObjects = game.add.group()\n\nglobal.game = new Phaser.Game 800, 600, Phaser.AUTO, 'phaser-example',\n  preload: preload\n  create: create\n  enableDebug: true\n\nimg2Blob = (img) ->\n  new Promise (resolve, reject) ->\n    canvas = img.ownerDocument.createElement \"canvas\"\n    canvas.width = img.width\n    canvas.height = img.height\n\n    context = canvas.getContext(\"2d\")\n    context.drawImage(img, 0, 0)\n\n    canvas.toBlob resolve\n\naddObject = (game, group, data) ->\n  {x, y, name} = data\n\n  sprite = group.create x, y, name\n\n  # Physics!\n  game.physics.arcade.enable sprite\n  sprite.body.collideWorldBounds = true\n  sprite.body.gravity.y = 500\n\n  # Make sprite clickable\n  sprite.inputEnabled = true\n  sprite.events.onInputDown.add ->\n    console.log \"clicky!\"\n    # Use this texture to load into editor\n    img = sprite.texture.baseTexture.source\n\n    img2Blob(img).then (blob) ->\n      game.editTexture name, blob\n\n  return sprite\n\n# Want to save assets, game data, and game state\nPhaser.Game.prototype.save = ->\n  # TODO: Serialize all custom objects\n  # TODO: Persist spritesheets\n  # TODO: Persist level/world data\n  objects: customObjects.children.map (child) ->\n    name: child.key\n    x: child.x\n    y: child.y\n\nPhaser.Game.prototype.restore = (data) ->\n  # Clear all custom objects\n  customObjects.removeAll()\n  # Add all objects from the data\n  data.objects.forEach (objectData) ->\n    addObject game, customObjects, objectData\n\n  # TODO: Set up spritesheets\n",
      "mode": "100644",
      "type": "blob"
    },
    "pixie.cson": {
      "path": "pixie.cson",
      "content": "remoteDependencies: [\n  \"https://cdnjs.cloudflare.com/ajax/libs/phaser/2.4.6/phaser.min.js\"\n]\ndependencies:\n  embedder: \"distri/embedder:v0.1.1\"\n",
      "mode": "100644",
      "type": "blob"
    },
    "TODO.md": {
      "path": "TODO.md",
      "content": "TODO\n====\n\nLoad and update a game object's image in pixel editor\n\nSave and restore game state\n\nLive edit tilemap\n\nLive edit game object properties\n\nSave / Restore local storage\n\nSave to S3 / external\n\nDone\n====\n\nDraw an image in pixel editor and make it into a sprite\n",
      "mode": "100644"
    }
  },
  "distribution": {
    "main": {
      "path": "main",
      "content": "(function() {\n  var Embedder, addObject, click, create, customObjects, img2Blob, preload, style;\n\n  style = document.createElement(\"style\");\n\n  style.innerText = \"html {\\n  background-color: #112;\\n  height: 100%;\\n}\\nbody {\\n  margin: 0;\\n  height: 100%;\\n  display: flex;\\n  align-items: center;\\n  justify-content: center;\\n}\";\n\n  document.head.appendChild(style);\n\n  Embedder = require(\"embedder\");\n\n  customObjects = null;\n\n  preload = function() {\n    game.load.crossOrigin = \"Anonymous\";\n    game.load.spritesheet('button', 'https://s3.amazonaws.com/whimsyspace-databucket-1g3p6d9lcl6x1/danielx/data/n4lN8edpcmdsAoBzeZ9-xFW7JW2WaUofe_tlkqo--8s', 193, 71);\n    return game.load.image('background', \"https://s3.amazonaws.com/whimsyspace-databucket-1g3p6d9lcl6x1/danielx/data/f3I-1TlC9lsqkWBLXVsFaENRqTfLJGLYBPZf2k73OiA\");\n  };\n\n  click = (function() {\n    var childWindow, embedder, i;\n    childWindow = null;\n    embedder = null;\n    i = 0;\n    Phaser.Game.prototype.editTexture = function(name, blob) {\n      return embedder.loadFile(blob);\n    };\n    return function() {\n      console.log(\"click\");\n      embedder = Embedder(\"https://danielx.net/pixel-editor/\", {\n        childLoaded: function() {\n          return console.log(\"Editor Loaded\");\n        },\n        save: function(data) {\n          var name, url;\n          console.log(\"Save\");\n          url = URL.createObjectURL(data.image);\n          name = \"yolo\" + i;\n          game.load.image(name, url);\n          game.load.onLoadComplete.addOnce(function() {\n            var x, y;\n            x = Math.floor(game.width * Math.random()) | 0;\n            y = Math.floor(game.width * Math.random()) | 0;\n            return addObject(game, customObjects, {\n              name: name,\n              x: x,\n              y: y\n            });\n          });\n          i += 1;\n          return game.load.start();\n        }\n      });\n      return childWindow = embedder.remoteTaregt();\n    };\n  })();\n\n  create = function() {\n    var background, button;\n    game.stage.backgroundColor = '#182d3b';\n    background = game.add.tileSprite(0, 0, 800, 600, 'background');\n    button = game.add.button(game.world.centerX - 95, 400, 'button', click, this, 2, 1, 0);\n    button.onInputOver.add(function() {\n      return console.log('over');\n    });\n    button.onInputOut.add(function() {\n      return console.log('out');\n    });\n    button.onInputUp.add(function() {\n      return console.log('up');\n    });\n    button.onInputDown.add(function() {\n      return console.log('down');\n    });\n    return customObjects = game.add.group();\n  };\n\n  global.game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', {\n    preload: preload,\n    create: create,\n    enableDebug: true\n  });\n\n  img2Blob = function(img) {\n    return new Promise(function(resolve, reject) {\n      var canvas, context;\n      canvas = img.ownerDocument.createElement(\"canvas\");\n      canvas.width = img.width;\n      canvas.height = img.height;\n      context = canvas.getContext(\"2d\");\n      context.drawImage(img, 0, 0);\n      return canvas.toBlob(resolve);\n    });\n  };\n\n  addObject = function(game, group, data) {\n    var name, sprite, x, y;\n    x = data.x, y = data.y, name = data.name;\n    sprite = group.create(x, y, name);\n    game.physics.arcade.enable(sprite);\n    sprite.body.collideWorldBounds = true;\n    sprite.body.gravity.y = 500;\n    sprite.inputEnabled = true;\n    sprite.events.onInputDown.add(function() {\n      var img;\n      console.log(\"clicky!\");\n      img = sprite.texture.baseTexture.source;\n      return img2Blob(img).then(function(blob) {\n        return game.editTexture(name, blob);\n      });\n    });\n    return sprite;\n  };\n\n  Phaser.Game.prototype.save = function() {\n    return {\n      objects: customObjects.children.map(function(child) {\n        return {\n          name: child.key,\n          x: child.x,\n          y: child.y\n        };\n      })\n    };\n  };\n\n  Phaser.Game.prototype.restore = function(data) {\n    customObjects.removeAll();\n    return data.objects.forEach(function(objectData) {\n      return addObject(game, customObjects, objectData);\n    });\n  };\n\n}).call(this);\n",
      "type": "blob"
    },
    "pixie": {
      "path": "pixie",
      "content": "module.exports = {\"remoteDependencies\":[\"https://cdnjs.cloudflare.com/ajax/libs/phaser/2.4.6/phaser.min.js\"],\"dependencies\":{\"embedder\":\"distri/embedder:v0.1.1\"}};",
      "type": "blob"
    }
  },
  "progenitor": {
    "url": "https://danielx.net/editor/"
  },
  "entryPoint": "main",
  "remoteDependencies": [
    "https://cdnjs.cloudflare.com/ajax/libs/phaser/2.4.6/phaser.min.js"
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