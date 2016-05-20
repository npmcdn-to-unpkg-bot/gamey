{blob2img} = require "./util"
Embedder = require "embedder"

module.exports = (saveHandler) ->
  childWindow = null
  embedder = null
  activeFrame = 0

  open: (blobPromise) ->
    load = ->
      blobPromise.then embedder.loadFile

    if childWindow?.open
      load()
    else
      embedder = Embedder "https://danielx.net/pixel-editor/",
        childLoaded: ->
          console.log "Editor Loaded"
          load()
        save: (data) ->
          blob2img(data.image)
          .then saveHandler

      childWindow = embedder.remoteTaregt()
