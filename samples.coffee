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
