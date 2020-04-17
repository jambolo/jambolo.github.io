SudokuGenerator = require './SudokuGenerator'

BUTTON_HEIGHT = 0.06
FIRST_BUTTON_Y = 0.22
BUTTON_SPACING = 0.08
BUTTON_SEPARATOR = 0.03

buttonPos = (index) ->
  y = FIRST_BUTTON_Y + (BUTTON_SPACING * index)
  if index > 3
    y += BUTTON_SEPARATOR
  if index > 4
    y += BUTTON_SEPARATOR
  if index > 6
    y += BUTTON_SEPARATOR
  return y

class MenuView
  constructor: (@app, @canvas) ->
    @buttons =
      newEasy:
        y: buttonPos(0)
        text: "New Game: Easy"
        bgColor: "#337733"
        textColor: "#ffffff"
        click: @newEasy.bind(this)
      newMedium:
        y: buttonPos(1)
        text: "New Game: Medium"
        bgColor: "#777733"
        textColor: "#ffffff"
        click: @newMedium.bind(this)
      newHard:
        y: buttonPos(2)
        text: "New Game: Hard"
        bgColor: "#773333"
        textColor: "#ffffff"
        click: @newHard.bind(this)
      newExtreme:
        y: buttonPos(3)
        text: "New Game: Extreme"
        bgColor: "#771111"
        textColor: "#ffffff"
        click: @newExtreme.bind(this)
      reset:
        y: buttonPos(4)
        text: "Reset Puzzle"
        bgColor: "#773377"
        textColor: "#ffffff"
        click: @reset.bind(this)
      import:
        y: buttonPos(5)
        text: "Load Puzzle"
        bgColor: "#336666"
        textColor: "#ffffff"
        click: @import.bind(this)
      export:
        y: buttonPos(6)
        text: "Share Puzzle"
        bgColor: "#336666"
        textColor: "#ffffff"
        click: @export.bind(this)
      resume:
        y: buttonPos(7)
        text: "Resume"
        bgColor: "#777777"
        textColor: "#ffffff"
        click: @resume.bind(this)

    buttonWidth = @canvas.width * 0.8
    @buttonHeight = @canvas.height * BUTTON_HEIGHT
    buttonX = (@canvas.width - buttonWidth) / 2
    for buttonName, button of @buttons
      button.x = buttonX
      button.y = @canvas.height * button.y
      button.w = buttonWidth
      button.h = @buttonHeight

    buttonFontHeight = Math.floor(@buttonHeight * 0.4)
    @buttonFont = @app.registerFont("button", "#{buttonFontHeight}px saxMono, monospace")
    titleFontHeight = Math.floor(@canvas.height * 0.06)
    @titleFont = @app.registerFont("button", "#{titleFontHeight}px saxMono, monospace")
    subtitleFontHeight = Math.floor(@canvas.height * 0.02)
    @subtitleFont = @app.registerFont("button", "#{subtitleFontHeight}px saxMono, monospace")
    return

  draw: ->
    @app.drawFill(0, 0, @canvas.width, @canvas.height, "#333333")

    x = @canvas.width / 2
    shadowOffset = @canvas.height * 0.005

    y1 = @canvas.height * 0.05
    y2 = y1 + @canvas.height * 0.06
    y3 = y2 + @canvas.height * 0.06
    @app.drawTextCentered("Bad Guy", x + shadowOffset, y1 + shadowOffset, @titleFont, "#000000")
    @app.drawTextCentered("Sudoku", x + shadowOffset, y2 + shadowOffset, @titleFont, "#000000")
    @app.drawTextCentered("Bad Guy", x, y1, @titleFont, "#ffffff")
    @app.drawTextCentered("Sudoku", x, y2, @titleFont, "#ffffff")
    @app.drawTextCentered("It's like Sudoku, but you are the bad guy.", x, y3, @subtitleFont, "#ffffff")

    for buttonName, button of @buttons
      @app.drawRoundedRect(button.x + shadowOffset, button.y + shadowOffset, button.w, button.h, button.h * 0.3, "black", "black")
      @app.drawRoundedRect(button.x, button.y, button.w, button.h, button.h * 0.3, button.bgColor, "#999999")
      @app.drawTextCentered(button.text, button.x + (button.w / 2), button.y + (button.h / 2), @buttonFont, button.textColor)

    @app.drawLowerLeft("#{@app.holeCount()}/81")
    @app.drawVersion()

  click: (x, y) ->
    for buttonName, button of @buttons
      if (y > button.y) && (y < (button.y + @buttonHeight))
        # console.log "button pressed: #{buttonName}"
        button.click()
    return

  newEasy: ->
    @app.newGame(SudokuGenerator.difficulty.easy)

  newMedium: ->
    @app.newGame(SudokuGenerator.difficulty.medium)

  newHard: ->
    @app.newGame(SudokuGenerator.difficulty.hard)

  newExtreme: ->
    @app.newGame(SudokuGenerator.difficulty.extreme)

  reset: ->
    @app.reset()

  resume: ->
    @app.switchView("sudoku")

  export: ->
    if navigator.share != undefined
      navigator.share {
        title: "Sudoku Shared Game"
        text: @app.export()
      }
      return
    window.prompt("Copy this and paste to a friend:", @app.export())

  import: ->
    importString = window.prompt("Paste an exported game here:", "")
    loop
      if importString == null
        return
      if @app.import(importString)
        @app.switchView("sudoku")
        return
      importString = window.prompt("Invalid game, try again:", "")

module.exports = MenuView
