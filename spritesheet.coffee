{img2Blob} = require "./util"

module.exports = (spriteWidth=32, spriteHeight=32, width=512, height=512, baseImage) ->
  spriteWidth = 32
  spriteHeight = 32

  width = 512
  height = 512

  canvas = document.createElement 'canvas'
  canvas.width = width
  canvas.height = height

  context = canvas.getContext('2d')
  context.drawImage(baseImage, 0, 0)

  self =
    # Get a blob for a specific frame of the sheet
    # Returns a promise for the blob
    getBlob: (frame) ->
      # Get the specific frame
      x = (frame % 16) * spriteWidth
      y = ((frame / 16)|0) * spriteHeight

      img2Blob(canvas, x, y, spriteWidth, spriteHeight)

    # Copy an image into a frame in this spritesheet
    compose: (img, frame) ->
      x = (frame % 16) * spriteWidth
      y = ((frame / 16)|0) * spriteHeight

      context.drawImage(img, x, y, spriteWidth, spriteHeight)

    getData: ->
      img2Blob(canvas, 0, 0, width, height)
      .then (blob) ->
        width: width
        height: height
        spriteWidth: spriteWidth
        spriteHeight: spriteHeight
        blob: blob

    spriteWidth: ->
      spriteWidth

    spriteHeight: ->
      spriteHeight

    canvas: ->
      canvas
