canvasToBlob = (canvas) ->
  new Promise (resolve, reject) ->
    canvas.toBlob (blob) ->
      resolve blob

module.exports =
  img2Blob: (img) ->
    new Promise (resolve, reject) ->
      canvas = img.ownerDocument.createElement "canvas"
      canvas.width = img.width
      canvas.height = img.height
  
      context = canvas.getContext("2d")
      context.drawImage(img, 0, 0)
  
      canvas.toBlob resolve

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
