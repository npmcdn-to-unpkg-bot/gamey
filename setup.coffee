style = document.createElement "style"
style.innerText = """
  html {
    background-color: #112;
    height: 100%;
  }
  body {
    margin: 0;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
"""
document.head.appendChild style


document.body.addEventListener 'contextmenu', (e) ->
  e.preventDefault()
  return
