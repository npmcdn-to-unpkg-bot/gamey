window["STRd6/gamey:yolo"]({
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
    "pixie.cson": {
      "path": "pixie.cson",
      "content": "remoteDependencies: [\n  \"https://cdnjs.cloudflare.com/ajax/libs/phaser/2.4.4/phaser.min.js\"\n]\n",
      "mode": "100644"
    },
    "main.coffee": {
      "path": "main.coffee",
      "content": "# TODO: Figure out why this doesn't load in the iframe in the preview popup :(\n\nconsole.log 'heyy'\n\npreload = ->\n  console.log 'duder'\n\n  game.load.crossOrigin = \"Anonymous\"\n\n  game.load.spritesheet('button', 'https://s3.amazonaws.com/whimsyspace-databucket-1g3p6d9lcl6x1/danielx/data/n4lN8edpcmdsAoBzeZ9-xFW7JW2WaUofe_tlkqo--8s', 193, 71)\n  game.load.image('background', \"https://s3.amazonaws.com/whimsyspace-databucket-1g3p6d9lcl6x1/danielx/data/f3I-1TlC9lsqkWBLXVsFaENRqTfLJGLYBPZf2k73OiA\")\n\ncreate = ->\n  console.log \"yolo!\"\n  game.stage.backgroundColor = '#182d3b'\n\n  background = game.add.tileSprite(0, 0, 800, 600, 'background')\n\n  button = game.add.button(game.world.centerX - 95, 400, 'button', (-> console.log 'heyy'), this, 2, 1, 0)\n\n  # button.onInputOver.add(over, this)\n  # button.onInputOut.add(out, this)\n  # button.onInputUp.add(up, this)\n\nglobal.game = new Phaser.Game 800, 600, Phaser.AUTO, 'phaser-example',\n  preload: preload\n  create: create\n",
      "mode": "100644"
    }
  },
  "distribution": {
    "pixie": {
      "path": "pixie",
      "content": "module.exports = {\"remoteDependencies\":[\"https://cdnjs.cloudflare.com/ajax/libs/phaser/2.4.4/phaser.min.js\"]};",
      "type": "blob"
    },
    "main": {
      "path": "main",
      "content": "(function() {\n  var create, preload;\n\n  console.log('heyy');\n\n  preload = function() {\n    console.log('duder');\n    game.load.crossOrigin = \"Anonymous\";\n    game.load.spritesheet('button', 'https://s3.amazonaws.com/whimsyspace-databucket-1g3p6d9lcl6x1/danielx/data/n4lN8edpcmdsAoBzeZ9-xFW7JW2WaUofe_tlkqo--8s', 193, 71);\n    return game.load.image('background', \"https://s3.amazonaws.com/whimsyspace-databucket-1g3p6d9lcl6x1/danielx/data/f3I-1TlC9lsqkWBLXVsFaENRqTfLJGLYBPZf2k73OiA\");\n  };\n\n  create = function() {\n    var background, button;\n    console.log(\"yolo!\");\n    game.stage.backgroundColor = '#182d3b';\n    background = game.add.tileSprite(0, 0, 800, 600, 'background');\n    return button = game.add.button(game.world.centerX - 95, 400, 'button', (function() {\n      return console.log('heyy');\n    }), this, 2, 1, 0);\n  };\n\n  global.game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', {\n    preload: preload,\n    create: create\n  });\n\n}).call(this);\n",
      "type": "blob"
    }
  },
  "progenitor": {
    "url": "https://danielx.net/editor/v0.4.1/"
  },
  "entryPoint": "main",
  "remoteDependencies": [
    "https://cdnjs.cloudflare.com/ajax/libs/phaser/2.4.4/phaser.min.js"
  ],
  "repository": {
    "branch": "yolo",
    "default_branch": "master",
    "full_name": "STRd6/gamey",
    "homepage": null,
    "description": "Tastes a bit gamey",
    "html_url": "https://github.com/STRd6/gamey",
    "url": "https://api.github.com/repos/STRd6/gamey",
    "publishBranch": "gh-pages"
  },
  "dependencies": {}
});