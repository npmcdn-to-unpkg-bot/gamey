module.exports = ->
  childWindow = null
  embedder = null
  activeFrame = 0

  open: ->
    if childWindow?.open
      # Load data
    else
      embedder = Embedder "https://danielx.net/pixel-editor/",
        childLoaded: ->
          console.log "Editor Loaded"
        save: (data) ->
          blob2img(data.image)
          .then (img) ->
            spritesheet.compose(img, activeFrame)

            # Need to update cache?
            game.cache.addSpriteSheet('spritesheet', "", spritesheet.canvas(), spritesheet.spriteWidth(), spritesheet.spriteHeight())

            customObjects.children.map (obj) ->
              obj.loadTexture("spritesheet", obj.frame)

            return

      childWindow = embedder.remoteTaregt()
