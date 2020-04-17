App = require './App'

init = ->
  console.log "init"
  canvas = document.createElement("canvas")
  canvas.width = document.documentElement.clientWidth
  canvas.height = document.documentElement.clientHeight
  document.body.insertBefore(canvas, document.body.childNodes[0])
  canvasRect = canvas.getBoundingClientRect()

  window.app = new App(canvas)

  # canvas.addEventListener "touchstart", (e) ->
  #   console.log Object.keys(e.touches[0])
  #   x = e.touches[0].clientX - canvasRect.left
  #   y = e.touches[0].clientY - canvasRect.top
  #   window.app.click(x, y)

  canvas.addEventListener "mousedown", (e) ->
    x = e.clientX - canvasRect.left
    y = e.clientY - canvasRect.top
    window.app.click(x, y)

window.addEventListener('load', (e) ->
    init()
, false)
