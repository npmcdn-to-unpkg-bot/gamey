canvasToBlob = (canvas) ->
  new Promise (resolve, reject) ->
    canvas.toBlob (blob) ->
      resolve blob

module.exports =
  img2Blob: (img, x=0, y=0, width=img.width, height=img.height) ->
    new Promise (resolve, reject) ->
      canvas = img.ownerDocument.createElement "canvas"
      canvas.width = width
      canvas.height = height

      context = canvas.getContext("2d")
      context.drawImage(img, -x, -y)

      canvas.toBlob resolve

  blob2img: (blob) ->
    url = URL.createObjectURL(blob)

    cleanup = ->
      URL.revokeObjectURL(url)

    new Promise (resolve, reject) ->
      img = new Image
      img.onload = ->
        cleanup()
        resolve img
      img.onerror = (e) ->
        cleanup()
        reject e

      img.src = url

  defaultSpritesheetBlob: ->
    size = 512

    canvas = document.createElement "canvas"
    canvas.width = canvas.height = size

    context = canvas.getContext('2d')

    context.beginPath()
    context.rect(0, 0, size, size)
    context.fillStyle = "#FF00FF"
    context.fill()

    canvasToBlob(canvas)

  composeSprite: (base, sprite, frame) ->
    blob2img(sprite)
    .then (img) ->

      context.clearRect(x, y, width, height)
      context.drawImage(img, x, y, width, height)