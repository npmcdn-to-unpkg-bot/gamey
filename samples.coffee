
# Button input events
(button) ->
  button.onInputOver.add ->
    console.log 'over'
  button.onInputOut.add ->
    console.log 'out'
  button.onInputUp.add ->
    console.log 'up'
  button.onInputDown.add ->
    console.log 'down'

# Displaying FPS
# http://phaser.io/docs/2.4.6/Phaser.Time.html
->
  # setup
  game.time.advancedTiming = true

  # update
  someText.text = game.time.fps
