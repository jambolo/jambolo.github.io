(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
var App, FontFaceObserver, MenuView, SudokuView, version;

FontFaceObserver = require('fontfaceobserver');

MenuView = require('./MenuView');

SudokuView = require('./SudokuView');

version = require('./version');

App = class App {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = this.canvas.getContext("2d");
    this.loadFont("saxMono");
    this.fonts = {};
    this.versionFontHeight = Math.floor(this.canvas.height * 0.02);
    this.versionFont = this.registerFont("version", `${this.versionFontHeight}px saxMono, monospace`);
    this.generatingFontHeight = Math.floor(this.canvas.height * 0.04);
    this.generatingFont = this.registerFont("generating", `${this.generatingFontHeight}px saxMono, monospace`);
    this.views = {
      menu: new MenuView(this, this.canvas),
      sudoku: new SudokuView(this, this.canvas)
    };
    this.switchView("sudoku");
  }

  measureFonts() {
    var f, fontName, ref;
    ref = this.fonts;
    for (fontName in ref) {
      f = ref[fontName];
      this.ctx.font = f.style;
      this.ctx.fillStyle = "black";
      this.ctx.textAlign = "center";
      f.height = Math.floor(this.ctx.measureText("m").width * 1.1); // best hack ever
      console.log(`Font ${fontName} measured at ${f.height} pixels`);
    }
  }

  registerFont(name, style) {
    var font;
    font = {
      name: name,
      style: style,
      height: 0
    };
    this.fonts[name] = font;
    this.measureFonts();
    return font;
  }

  loadFont(fontName) {
    var font;
    font = new FontFaceObserver(fontName);
    return font.load().then(() => {
      console.log(`${fontName} loaded, redrawing...`);
      this.measureFonts();
      return this.draw();
    });
  }

  switchView(view) {
    this.view = this.views[view];
    return this.draw();
  }

  newGame(difficulty) {
    // console.log "app.newGame(#{difficulty})"

    // @drawFill(0, 0, @canvas.width, @canvas.height, "#444444")
    // @drawTextCentered("Generating, please wait...", @canvas.width / 2, @canvas.height / 2, @generatingFont, "#ffffff")

    // window.setTimeout =>
    this.views.sudoku.newGame(difficulty);
    return this.switchView("sudoku");
  }

  // , 0
  reset() {
    this.views.sudoku.reset();
    return this.switchView("sudoku");
  }

  import(importString) {
    return this.views.sudoku.import(importString);
  }

  export() {
    return this.views.sudoku.export();
  }

  holeCount() {
    return this.views.sudoku.holeCount();
  }

  draw() {
    return this.view.draw();
  }

  click(x, y) {
    return this.view.click(x, y);
  }

  key(k) {
    return this.view.key(k);
  }

  drawFill(x, y, w, h, color) {
    this.ctx.beginPath();
    this.ctx.rect(x, y, w, h);
    this.ctx.fillStyle = color;
    return this.ctx.fill();
  }

  drawRoundedRect(x, y, w, h, r, fillColor = null, strokeColor = null) {
    this.ctx.roundRect(x, y, w, h, r);
    if (fillColor !== null) {
      this.ctx.fillStyle = fillColor;
      this.ctx.fill();
    }
    if (strokeColor !== null) {
      this.ctx.strokeStyle = strokeColor;
      this.ctx.stroke();
    }
  }

  drawRect(x, y, w, h, color, lineWidth = 1) {
    this.ctx.beginPath();
    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = lineWidth;
    this.ctx.rect(x, y, w, h);
    return this.ctx.stroke();
  }

  drawLine(x1, y1, x2, y2, color = "black", lineWidth = 1) {
    this.ctx.beginPath();
    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = lineWidth;
    this.ctx.lineCap = "butt";
    this.ctx.moveTo(x1, y1);
    this.ctx.lineTo(x2, y2);
    return this.ctx.stroke();
  }

  drawTextCentered(text, cx, cy, font, color) {
    this.ctx.font = font.style;
    this.ctx.fillStyle = color;
    this.ctx.textAlign = "center";
    return this.ctx.fillText(text, cx, cy + (font.height / 2));
  }

  drawLowerLeft(text, color = "white") {
    this.ctx = this.canvas.getContext("2d");
    this.ctx.font = this.versionFont.style;
    this.ctx.fillStyle = color;
    this.ctx.textAlign = "left";
    return this.ctx.fillText(text, 0, this.canvas.height - (this.versionFont.height / 2));
  }

  drawVersion(color = "white") {
    this.ctx = this.canvas.getContext("2d");
    this.ctx.font = this.versionFont.style;
    this.ctx.fillStyle = color;
    this.ctx.textAlign = "right";
    return this.ctx.fillText(`v${version}`, this.canvas.width - (this.versionFont.height / 2), this.canvas.height - (this.versionFont.height / 2));
  }

  drawArc(x1, y1, x2, y2, radius, color, lineWidth) {
    var M, P1, P2, Q, dCM, dMP1, dMQ, uMP1, uMQ;
    // Derived from https://github.com/jambolo/drawArc at 6c3e0d3
    P1 = {
      x: x1,
      y: y1
    };
    P2 = {
      x: x2,
      y: y2
    };
    // Determine the midpoint (M) from P1 to P2
    M = {
      x: (P1.x + P2.x) / 2,
      y: (P1.y + P2.y) / 2
    };
    // Determine the distance from M to P1
    dMP1 = Math.sqrt((P1.x - M.x) * (P1.x - M.x) + (P1.y - M.y) * (P1.y - M.y));
    // Validate the radius
    if ((radius == null) || radius < dMP1) {
      radius = dMP1;
    }
    // Determine the unit vector from M to P1
    uMP1 = {
      x: (P1.x - M.x) / dMP1,
      y: (P1.y - M.y) / dMP1
    };
    // Determine the unit vector from M to Q (just uMP1 rotated pi/2)
    uMQ = {
      x: -uMP1.y,
      y: uMP1.x
    };
    // Determine the distance from the center of the circle (C) to M
    dCM = Math.sqrt(radius * radius - dMP1 * dMP1);
    // Determine the distance from M to Q
    dMQ = dMP1 * dMP1 / dCM;
    // Determine the location of Q
    Q = {
      x: M.x + uMQ.x * dMQ,
      y: M.y + uMQ.y * dMQ
    };
    this.ctx.beginPath();
    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = lineWidth;
    this.ctx.lineCap = "round";
    this.ctx.moveTo(x1, y1);
    this.ctx.arcTo(Q.x, Q.y, x2, y2, radius);
    this.ctx.stroke();
  }

  drawPoint(x, y, r, color) {
    this.ctx.beginPath();
    this.ctx.fillStyle = color;
    this.ctx.arc(x, y, r, 0, 2 * Math.PI);
    this.ctx.fill();
  }

};

CanvasRenderingContext2D.prototype.roundRect = function(x, y, w, h, r) {
  if (w < 2 * r) {
    r = w / 2;
  }
  if (h < 2 * r) {
    r = h / 2;
  }
  this.beginPath();
  this.moveTo(x + r, y);
  this.arcTo(x + w, y, x + w, y + h, r);
  this.arcTo(x + w, y + h, x, y + h, r);
  this.arcTo(x, y + h, x, y, r);
  this.arcTo(x, y, x + w, y, r);
  this.closePath();
  return this;
};

module.exports = App;


},{"./MenuView":2,"./SudokuView":5,"./version":7,"fontfaceobserver":8}],2:[function(require,module,exports){
var BUTTON_HEIGHT, BUTTON_SEPARATOR, BUTTON_SPACING, FIRST_BUTTON_Y, MenuView, SudokuGenerator, buttonPos;

SudokuGenerator = require('./SudokuGenerator');

BUTTON_HEIGHT = 0.06;

FIRST_BUTTON_Y = 0.22;

BUTTON_SPACING = 0.08;

BUTTON_SEPARATOR = 0.03;

buttonPos = function(index) {
  var y;
  y = FIRST_BUTTON_Y + (BUTTON_SPACING * index);
  if (index > 3) {
    y += BUTTON_SEPARATOR;
  }
  if (index > 4) {
    y += BUTTON_SEPARATOR;
  }
  if (index > 6) {
    y += BUTTON_SEPARATOR;
  }
  return y;
};

MenuView = class MenuView {
  constructor(app, canvas) {
    var button, buttonFontHeight, buttonName, buttonWidth, buttonX, ref, subtitleFontHeight, titleFontHeight;
    this.app = app;
    this.canvas = canvas;
    this.buttons = {
      newEasy: {
        y: buttonPos(0),
        text: "New Game: Easy",
        bgColor: "#337733",
        textColor: "#ffffff",
        click: this.newEasy.bind(this)
      },
      newMedium: {
        y: buttonPos(1),
        text: "New Game: Medium",
        bgColor: "#777733",
        textColor: "#ffffff",
        click: this.newMedium.bind(this)
      },
      newHard: {
        y: buttonPos(2),
        text: "New Game: Hard",
        bgColor: "#773333",
        textColor: "#ffffff",
        click: this.newHard.bind(this)
      },
      newExtreme: {
        y: buttonPos(3),
        text: "New Game: Extreme",
        bgColor: "#771111",
        textColor: "#ffffff",
        click: this.newExtreme.bind(this)
      },
      reset: {
        y: buttonPos(4),
        text: "Reset Puzzle",
        bgColor: "#773377",
        textColor: "#ffffff",
        click: this.reset.bind(this)
      },
      import: {
        y: buttonPos(5),
        text: "Load Puzzle",
        bgColor: "#336666",
        textColor: "#ffffff",
        click: this.import.bind(this)
      },
      export: {
        y: buttonPos(6),
        text: "Share Puzzle",
        bgColor: "#336666",
        textColor: "#ffffff",
        click: this.export.bind(this)
      },
      resume: {
        y: buttonPos(7),
        text: "Resume",
        bgColor: "#777777",
        textColor: "#ffffff",
        click: this.resume.bind(this)
      }
    };
    buttonWidth = this.canvas.width * 0.8;
    this.buttonHeight = this.canvas.height * BUTTON_HEIGHT;
    buttonX = (this.canvas.width - buttonWidth) / 2;
    ref = this.buttons;
    for (buttonName in ref) {
      button = ref[buttonName];
      button.x = buttonX;
      button.y = this.canvas.height * button.y;
      button.w = buttonWidth;
      button.h = this.buttonHeight;
    }
    buttonFontHeight = Math.floor(this.buttonHeight * 0.4);
    this.buttonFont = this.app.registerFont("button", `${buttonFontHeight}px saxMono, monospace`);
    titleFontHeight = Math.floor(this.canvas.height * 0.06);
    this.titleFont = this.app.registerFont("button", `${titleFontHeight}px saxMono, monospace`);
    subtitleFontHeight = Math.floor(this.canvas.height * 0.02);
    this.subtitleFont = this.app.registerFont("button", `${subtitleFontHeight}px saxMono, monospace`);
    return;
  }

  draw() {
    var button, buttonName, ref, shadowOffset, x, y1, y2, y3;
    this.app.drawFill(0, 0, this.canvas.width, this.canvas.height, "#333333");
    x = this.canvas.width / 2;
    shadowOffset = this.canvas.height * 0.005;
    y1 = this.canvas.height * 0.05;
    y2 = y1 + this.canvas.height * 0.06;
    y3 = y2 + this.canvas.height * 0.06;
    this.app.drawTextCentered("Bad Guy", x + shadowOffset, y1 + shadowOffset, this.titleFont, "#000000");
    this.app.drawTextCentered("Sudoku", x + shadowOffset, y2 + shadowOffset, this.titleFont, "#000000");
    this.app.drawTextCentered("Bad Guy", x, y1, this.titleFont, "#ffffff");
    this.app.drawTextCentered("Sudoku", x, y2, this.titleFont, "#ffffff");
    this.app.drawTextCentered("It's like Sudoku, but you are the bad guy.", x, y3, this.subtitleFont, "#ffffff");
    ref = this.buttons;
    for (buttonName in ref) {
      button = ref[buttonName];
      this.app.drawRoundedRect(button.x + shadowOffset, button.y + shadowOffset, button.w, button.h, button.h * 0.3, "black", "black");
      this.app.drawRoundedRect(button.x, button.y, button.w, button.h, button.h * 0.3, button.bgColor, "#999999");
      this.app.drawTextCentered(button.text, button.x + (button.w / 2), button.y + (button.h / 2), this.buttonFont, button.textColor);
    }
    this.app.drawLowerLeft(`${this.app.holeCount()}/81`);
    return this.app.drawVersion();
  }

  click(x, y) {
    var button, buttonName, ref;
    ref = this.buttons;
    for (buttonName in ref) {
      button = ref[buttonName];
      if ((y > button.y) && (y < (button.y + this.buttonHeight))) {
        // console.log "button pressed: #{buttonName}"
        button.click();
      }
    }
  }

  newEasy() {
    return this.app.newGame(SudokuGenerator.difficulty.easy);
  }

  newMedium() {
    return this.app.newGame(SudokuGenerator.difficulty.medium);
  }

  newHard() {
    return this.app.newGame(SudokuGenerator.difficulty.hard);
  }

  newExtreme() {
    return this.app.newGame(SudokuGenerator.difficulty.extreme);
  }

  reset() {
    return this.app.reset();
  }

  resume() {
    return this.app.switchView("sudoku");
  }

  export() {
    if (navigator.share !== void 0) {
      navigator.share({
        title: "Sudoku Shared Game",
        text: this.app.export()
      });
      return;
    }
    return window.prompt("Copy this and paste to a friend:", this.app.export());
  }

  import() {
    var importString;
    importString = window.prompt("Paste an exported game here:", "");
    while (true) {
      if (importString === null) {
        return;
      }
      if (this.app.import(importString)) {
        this.app.switchView("sudoku");
        return;
      }
      importString = window.prompt("Invalid game, try again:", "");
    }
  }

};

module.exports = MenuView;


},{"./SudokuGenerator":4}],3:[function(require,module,exports){
var SudokuGame, SudokuGenerator, ascendingLinkSort, cellIndex, generateLinkPermutations, uniqueLinkFilter;

SudokuGenerator = require('./SudokuGenerator');

// Returns the index of a cell in row major order (though they are stored in column major order)
cellIndex = function(x, y) {
  return y * 9 + x;
};

// Sort by ascending location and then by strength (strong then weak)
ascendingLinkSort = function(a, b) {
  var a0, a1, b0, b1;
  a0 = cellIndex(a.cells[0].x, a.cells[0].y);
  a1 = cellIndex(a.cells[1].x, a.cells[1].y);
  b0 = cellIndex(b.cells[0].x, b.cells[0].y);
  b1 = cellIndex(b.cells[1].x, b.cells[1].y);
  if (a0 > b0 || (a0 === b0 && (a1 > b1 || (a1 === b1 && ((a.strong == null) && (b.strong != null)))))) {
    return 1;
  } else {
    return -1;
  }
};

// Note strength is not compared
uniqueLinkFilter = function(e, i, a) {
  var e0, e1, p, p0, p1;
  if (i === 0) {
    return true;
  }
  p = a[i - 1];
  e0 = cellIndex(e.cells[0].x, e.cells[0].y);
  e1 = cellIndex(e.cells[1].x, e.cells[1].y);
  p0 = cellIndex(p.cells[0].x, p.cells[0].y);
  p1 = cellIndex(p.cells[1].x, p.cells[1].y);
  return e0 !== p0 || e1 !== p1;
};

generateLinkPermutations = function(cells) {
  var count, i, j, l, links, n, ref, ref1, ref2;
  links = [];
  count = cells.length;
  for (i = l = 0, ref = count - 1; (0 <= ref ? l < ref : l > ref); i = 0 <= ref ? ++l : --l) {
    for (j = n = ref1 = i + 1, ref2 = count; (ref1 <= ref2 ? n < ref2 : n > ref2); j = ref1 <= ref2 ? ++n : --n) {
      links.push({
        cells: [cells[i], cells[j]]
      });
    }
  }
  return links;
};

SudokuGame = class SudokuGame {
  constructor() {
    this.clear();
    if (!this.load()) {
      this.newGame(SudokuGenerator.difficulty.easy);
    }
    return;
  }

  clear() {
    var i, j, l, n, o;
    this.grid = new Array(9).fill(null);
    for (i = l = 0; l < 9; i = ++l) {
      this.grid[i] = new Array(9).fill(null);
    }
    for (j = n = 0; n < 9; j = ++n) {
      for (i = o = 0; o < 9; i = ++o) {
        this.grid[i][j] = {
          value: 0,
          error: false,
          locked: false,
          pencil: new Array(9).fill(false)
        };
      }
    }
    this.solved = false;
    this.undoJournal = [];
    return this.redoJournal = [];
  }

  holeCount() {
    var count, i, j, l, n;
    count = 0;
    for (j = l = 0; l < 9; j = ++l) {
      for (i = n = 0; n < 9; i = ++n) {
        if (!this.grid[i][j].locked) {
          count += 1;
        }
      }
    }
    return count;
  }

  export() {
    var exportString, i, j, l, n;
    exportString = "SD";
    for (j = l = 0; l < 9; j = ++l) {
      for (i = n = 0; n < 9; i = ++n) {
        if (this.grid[i][j].locked) {
          exportString += `${this.grid[i][j].value}`;
        } else {
          exportString += "0";
        }
      }
    }
    return exportString;
  }

  validate() {
    var board, generator, i, j, l, n;
    board = new Array(9).fill(null);
    for (i = l = 0; l < 9; i = ++l) {
      board[i] = new Array(9).fill(0);
      for (j = n = 0; n < 9; j = ++n) {
        board[i][j] = this.grid[i][j].value;
      }
    }
    generator = new SudokuGenerator();
    return generator.validateGrid(board);
  }

  import(importString) {
    var i, index, j, l, n, v, zeroCharCode;
    if (importString.indexOf("SD") !== 0) {
      return false;
    }
    importString = importString.substr(2);
    importString = importString.replace(/[^0-9]/g, "");
    if (importString.length !== 81) {
      return false;
    }
    this.clear();
    index = 0;
    zeroCharCode = "0".charCodeAt(0);
    for (j = l = 0; l < 9; j = ++l) {
      for (i = n = 0; n < 9; i = ++n) {
        v = importString.charCodeAt(index) - zeroCharCode;
        index += 1;
        if (v > 0) {
          this.grid[i][j].locked = true;
          this.grid[i][j].value = v;
        }
      }
    }
    if (!this.validate()) {
      return false;
    }
    this.updateCells();
    this.save();
    return true;
  }

  updateCell(x, y) {
    var cell, i, j, l, n, o, sx, sy, v;
    cell = this.grid[x][y];
    for (i = l = 0; l < 9; i = ++l) {
      if (x !== i) {
        v = this.grid[i][y].value;
        if (v > 0) {
          if (v === cell.value) {
            this.grid[i][y].error = true;
            cell.error = true;
          }
        }
      }
      if (y !== i) {
        v = this.grid[x][i].value;
        if (v > 0) {
          if (v === cell.value) {
            this.grid[x][i].error = true;
            cell.error = true;
          }
        }
      }
    }
    sx = Math.floor(x / 3) * 3;
    sy = Math.floor(y / 3) * 3;
    for (j = n = 0; n < 3; j = ++n) {
      for (i = o = 0; o < 3; i = ++o) {
        if ((x !== (sx + i)) && (y !== (sy + j))) {
          v = this.grid[sx + i][sy + j].value;
          if (v > 0) {
            if (v === cell.value) {
              this.grid[sx + i][sy + j].error = true;
              cell.error = true;
            }
          }
        }
      }
    }
  }

  updateCells() {
    var i, j, l, n, o, q, r, s;
    for (j = l = 0; l < 9; j = ++l) {
      for (i = n = 0; n < 9; i = ++n) {
        this.grid[i][j].error = false;
      }
    }
    for (j = o = 0; o < 9; j = ++o) {
      for (i = q = 0; q < 9; i = ++q) {
        this.updateCell(i, j);
      }
    }
    this.solved = true;
    for (j = r = 0; r < 9; j = ++r) {
      for (i = s = 0; s < 9; i = ++s) {
        if (this.grid[i][j].error) {
          this.solved = false;
        }
        if (this.grid[i][j].value === 0) {
          this.solved = false;
        }
      }
    }
    // if @solved
    //   console.log "solved #{@solved}"
    return this.solved;
  }

  done() {
    var counts, d, i, j, l, n, o;
    d = new Array(9).fill(false);
    counts = new Array(9).fill(0);
    for (j = l = 0; l < 9; j = ++l) {
      for (i = n = 0; n < 9; i = ++n) {
        if (this.grid[i][j].value !== 0) {
          counts[this.grid[i][j].value - 1] += 1;
        }
      }
    }
    for (i = o = 0; o < 9; i = ++o) {
      if (counts[i] === 9) {
        d[i] = true;
      }
    }
    return d;
  }

  pencilMarks(x, y) {
    var cell, i, l, marks;
    cell = this.grid[x][y];
    marks = [];
    for (i = l = 0; l < 9; i = ++l) {
      if (cell.pencil[i]) {
        marks.push(i + 1);
      }
    }
    return marks;
  }

  do(action, x, y, values, journal) {
    var cell, l, len, v;
    if (values.length > 0) {
      cell = this.grid[x][y];
      switch (action) {
        case "togglePencil":
          journal.push({
            action: "togglePencil",
            x: x,
            y: y,
            values: values
          });
          for (l = 0, len = values.length; l < len; l++) {
            v = values[l];
            cell.pencil[v - 1] = !cell.pencil[v - 1];
          }
          break;
        case "setValue":
          journal.push({
            action: "setValue",
            x: x,
            y: y,
            values: [cell.value]
          });
          cell.value = values[0];
      }
      this.updateCells();
      return this.save();
    }
  }

  undo() {
    var step;
    if (this.undoJournal.length > 0) {
      step = this.undoJournal.pop();
      this.do(step.action, step.x, step.y, step.values, this.redoJournal);
      return [step.x, step.y];
    }
  }

  redo() {
    var step;
    if (this.redoJournal.length > 0) {
      step = this.redoJournal.pop();
      this.do(step.action, step.x, step.y, step.values, this.undoJournal);
      return [step.x, step.y];
    }
  }

  clearPencil(x, y) {
    var cell, flag, i;
    cell = this.grid[x][y];
    if (cell.locked) {
      return;
    }
    this.do("togglePencil", x, y, (function() {
      var l, len, ref, results;
      ref = cell.pencil;
      results = [];
      for (i = l = 0, len = ref.length; l < len; i = ++l) {
        flag = ref[i];
        if (flag) {
          results.push(i + 1);
        }
      }
      return results;
    })(), this.undoJournal);
    return this.redoJournal = [];
  }

  togglePencil(x, y, v) {
    if (this.grid[x][y].locked) {
      return;
    }
    this.do("togglePencil", x, y, [v], this.undoJournal);
    return this.redoJournal = [];
  }

  setValue(x, y, v) {
    if (this.grid[x][y].locked) {
      return;
    }
    this.do("setValue", x, y, [v], this.undoJournal);
    return this.redoJournal = [];
  }

  reset() {
    var cell, i, j, k, l, n, o;
    console.log("reset()");
    for (j = l = 0; l < 9; j = ++l) {
      for (i = n = 0; n < 9; i = ++n) {
        cell = this.grid[i][j];
        if (!cell.locked) {
          cell.value = 0;
        }
        cell.error = false;
        for (k = o = 0; o < 9; k = ++o) {
          cell.pencil[k] = false;
        }
      }
    }
    this.undoJournal = [];
    this.redoJournal = [];
    this.highlightX = -1;
    this.highlightY = -1;
    this.updateCells();
    return this.save();
  }

  getLinks(value) {
    var boxX, boxY, l, len, len1, link, links, n, o, q, r, s, strong, weak, x, y;
    // Note: the search sorts the links in row major order, first by start cell, then by end cell
    links = [];
// Get row links
    for (y = l = 0; l < 9; y = ++l) {
      links.push(...this.getRowLinks(y, value));
    }
// Get column links
    for (x = n = 0; n < 9; x = ++n) {
      links.push(...this.getColumnLinks(x, value));
    }
// Get box links
    for (boxX = o = 0; o < 3; boxX = ++o) {
      for (boxY = q = 0; q < 3; boxY = ++q) {
        links.push(...this.getBoxLinks(boxX, boxY, value));
      }
    }
    // The box links might have duplicated some row and column links, so duplicates must be filtered out. Note that only
    // locations are considered when finding duplicates, but strong links take precedence when duplicates are removed
    // (because they are ordered before weak links).
    links = links.sort(ascendingLinkSort).filter(uniqueLinkFilter);
    strong = [];
    for (r = 0, len = links.length; r < len; r++) {
      link = links[r];
      if (link.strong != null) {
        strong.push(link.cells);
      }
    }
    weak = [];
    for (s = 0, len1 = links.length; s < len1; s++) {
      link = links[s];
      if (link.strong == null) {
        weak.push(link.cells);
      }
    }
    return {strong, weak};
  }

  getRowLinks(y, value) {
    var cell, cells, l, links, x;
    cells = [];
    for (x = l = 0; l < 9; x = ++l) {
      cell = this.grid[x][y];
      if (cell.value === 0 && cell.pencil[value - 1]) {
        cells.push({x, y});
      }
    }
    if (cells.length > 1) {
      links = generateLinkPermutations(cells);
      if (links.length === 1) {
        links[0].strong = true;
      }
    } else {
      links = [];
    }
    return links;
  }

  getColumnLinks(x, value) {
    var cell, cells, l, links, y;
    cells = [];
    for (y = l = 0; l < 9; y = ++l) {
      cell = this.grid[x][y];
      if (cell.value === 0 && cell.pencil[value - 1]) {
        cells.push({x, y});
      }
    }
    if (cells.length > 1) {
      links = generateLinkPermutations(cells);
      if (links.length === 1) {
        links[0].strong = true;
      }
    } else {
      links = [];
    }
    return links;
  }

  getBoxLinks(boxX, boxY, value) {
    var cell, cells, l, links, n, ref, ref1, ref2, ref3, sx, sy, x, y;
    cells = [];
    sx = boxX * 3;
    sy = boxY * 3;
    for (y = l = ref = sy, ref1 = sy + 3; (ref <= ref1 ? l < ref1 : l > ref1); y = ref <= ref1 ? ++l : --l) {
      for (x = n = ref2 = sx, ref3 = sx + 3; (ref2 <= ref3 ? n < ref3 : n > ref3); x = ref2 <= ref3 ? ++n : --n) {
        cell = this.grid[x][y];
        if (cell.value === 0 && cell.pencil[value - 1]) {
          cells.push({x, y});
        }
      }
    }
    if (cells.length > 1) {
      links = generateLinkPermutations(cells);
      if (links.length === 1) {
        links[0].strong = true;
      }
    } else {
      links = [];
    }
    return links;
  }

  markIsGood(x, y, m) {
    var i, j, l, n, o, q, ref, ref1, ref2, ref3, sx, sy;
// Check if this mark is a known value in the column
    for (j = l = 0; l < 9; j = ++l) {
      if (j !== y) {
        if (this.grid[x][j].value === m) {
          return false;
        }
      }
    }
// Check if this mark is a known value in the row
    for (i = n = 0; n < 9; i = ++n) {
      if (i !== x) {
        if (this.grid[i][y].value === m) {
          return false;
        }
      }
    }
    // Check if this mark is a known value in the box
    sx = Math.floor(x / 3) * 3;
    sy = Math.floor(y / 3) * 3;
    for (i = o = ref = sx, ref1 = sx + 3; (ref <= ref1 ? o < ref1 : o > ref1); i = ref <= ref1 ? ++o : --o) {
      for (j = q = ref2 = sy, ref3 = sy + 3; (ref2 <= ref3 ? q < ref3 : q > ref3); j = ref2 <= ref3 ? ++q : --q) {
        if ((i !== x || j !== y) && this.grid[i][j].value === m) {
          return false;
        }
      }
    }
    return true;
  }

  newGame(difficulty) {
    var cell, generator, i, j, k, l, n, newGrid, o, q, r;
    console.log(`newGame(${difficulty})`);
    for (j = l = 0; l < 9; j = ++l) {
      for (i = n = 0; n < 9; i = ++n) {
        cell = this.grid[i][j];
        cell.value = 0;
        cell.error = false;
        cell.locked = false;
        for (k = o = 0; o < 9; k = ++o) {
          cell.pencil[k] = false;
        }
      }
    }
    generator = new SudokuGenerator();
    [newGrid, this.solution] = generator.generate(difficulty);
// console.log "newGrid", newGrid
    for (j = q = 0; q < 9; j = ++q) {
      for (i = r = 0; r < 9; i = ++r) {
        if (newGrid[i][j] !== 0) {
          this.grid[i][j].value = newGrid[i][j];
          this.grid[i][j].locked = true;
        }
      }
    }
    this.undoJournal = [];
    this.redoJournal = [];
    this.updateCells();
    return this.save();
  }

  load() {
    var dst, gameData, i, j, jsonString, k, l, n, o, src;
    if (!localStorage) {
      alert("No local storage, nothing will work");
      return false;
    }
    jsonString = localStorage.getItem("game");
    if (jsonString === null) {
      return false;
    }
    // console.log jsonString
    gameData = JSON.parse(jsonString);
// console.log "found gameData", gameData
    for (j = l = 0; l < 9; j = ++l) {
      for (i = n = 0; n < 9; i = ++n) {
        src = gameData.grid[i][j];
        dst = this.grid[i][j];
        dst.value = src.v;
        dst.error = src.e > 0 ? true : false;
        dst.locked = src.l > 0 ? true : false;
        for (k = o = 0; o < 9; k = ++o) {
          dst.pencil[k] = src.p[k] > 0 ? true : false;
        }
      }
    }
    this.solution = gameData.solution;
    this.updateCells();
    console.log("Loaded game.");
    return true;
  }

  save() {
    var cell, dst, gameData, i, j, jsonString, k, l, n, o, q, r, s;
    if (!localStorage) {
      alert("No local storage, nothing will work");
      return false;
    }
    gameData = {
      grid: new Array(9).fill(null),
      solution: new Array(9).fill(null)
    };
    for (i = l = 0; l < 9; i = ++l) {
      gameData.grid[i] = new Array(9).fill(null);
      gameData.solution[i] = new Array(9).fill(null);
    }
    for (j = n = 0; n < 9; j = ++n) {
      for (i = o = 0; o < 9; i = ++o) {
        cell = this.grid[i][j];
        gameData.grid[i][j] = {
          v: cell.value,
          e: cell.error ? 1 : 0,
          l: cell.locked ? 1 : 0,
          p: []
        };
        dst = gameData.grid[i][j].p;
        for (k = q = 0; q < 9; k = ++q) {
          dst.push(cell.pencil[k] ? 1 : 0);
        }
      }
    }
    for (i = r = 0; r < 9; i = ++r) {
      gameData.solution[i] = new Array(9).fill(null);
      for (j = s = 0; s < 9; j = ++s) {
        gameData.solution[i][j] = this.solution[i][j];
      }
    }
    jsonString = JSON.stringify(gameData);
    localStorage.setItem("game", jsonString);
    console.log(`Saved game (${jsonString.length} chars)`);
    return true;
  }

};

module.exports = SudokuGame;


},{"./SudokuGenerator":4}],4:[function(require,module,exports){
var Board, SudokuGenerator, shuffle;

shuffle = function(a) {
  var i, j, t;
  i = a.length;
  while (--i > 0) {
    j = ~~(Math.random() * (i + 1));
    t = a[j];
    a[j] = a[i];
    a[i] = t;
  }
  return a;
};

Board = class Board {
  constructor(otherBoard = null) {
    var i, j, l, m, n;
    this.lockedCount = 0;
    this.grid = new Array(9).fill(null);
    this.locked = new Array(9).fill(null);
    for (i = l = 0; l < 9; i = ++l) {
      this.grid[i] = new Array(9).fill(0);
      this.locked[i] = new Array(9).fill(false);
    }
    if (otherBoard !== null) {
      for (j = m = 0; m < 9; j = ++m) {
        for (i = n = 0; n < 9; i = ++n) {
          this.grid[i][j] = otherBoard.grid[i][j];
          this.lock(i, j, otherBoard.locked[i][j]);
        }
      }
    }
    return;
  }

  matches(otherBoard) {
    var i, j, l, m;
    for (j = l = 0; l < 9; j = ++l) {
      for (i = m = 0; m < 9; i = ++m) {
        if (this.grid[i][j] !== otherBoard.grid[i][j]) {
          return false;
        }
      }
    }
    return true;
  }

  lock(x, y, v = true) {
    if (v) {
      if (!this.locked[x][y]) {
        this.lockedCount += 1;
      }
    } else {
      if (this.locked[x][y]) {
        this.lockedCount -= 1;
      }
    }
    return this.locked[x][y] = v;
  }

};

SudokuGenerator = (function() {
  class SudokuGenerator {
    constructor() {}

    boardToGrid(board) {
      var i, j, l, m, n, newBoard;
      newBoard = new Array(9).fill(null);
      for (i = l = 0; l < 9; i = ++l) {
        newBoard[i] = new Array(9).fill(0);
      }
      for (j = m = 0; m < 9; j = ++m) {
        for (i = n = 0; n < 9; i = ++n) {
          if (board.locked[i][j]) {
            newBoard[i][j] = board.grid[i][j];
          }
        }
      }
      return newBoard;
    }

    gridToBoard(grid) {
      var board, l, m, x, y;
      board = new Board();
      for (y = l = 0; l < 9; y = ++l) {
        for (x = m = 0; m < 9; x = ++m) {
          if (grid[x][y] > 0) {
            board.grid[x][y] = grid[x][y];
            board.lock(x, y);
          }
        }
      }
      return board;
    }

    cellValid(board, x, y, v) {
      var i, j, l, m, n, sx, sy;
      if (board.locked[x][y]) {
        return board.grid[x][y] === v;
      }
      for (i = l = 0; l < 9; i = ++l) {
        if ((x !== i) && (board.grid[i][y] === v)) {
          return false;
        }
        if ((y !== i) && (board.grid[x][i] === v)) {
          return false;
        }
      }
      sx = Math.floor(x / 3) * 3;
      sy = Math.floor(y / 3) * 3;
      for (j = m = 0; m < 3; j = ++m) {
        for (i = n = 0; n < 3; i = ++n) {
          if ((x !== (sx + i)) && (y !== (sy + j))) {
            if (board.grid[sx + i][sy + j] === v) {
              return false;
            }
          }
        }
      }
      return true;
    }

    pencilMarks(board, x, y) {
      var l, marks, v;
      if (board.locked[x][y]) {
        return [board.grid[x][y]];
      }
      marks = [];
      for (v = l = 1; l <= 9; v = ++l) {
        if (this.cellValid(board, x, y, v)) {
          marks.push(v);
        }
      }
      if (marks.length > 1) {
        shuffle(marks);
      }
      return marks;
    }

    nextAttempt(board, attempts) {
      var a, fewestIndex, fewestMarks, index, k, l, len, len1, m, marks, n, remainingIndexes, x, y;
      remainingIndexes = (function() {
        var results = [];
        for (var l = 0; l < 81; l++){ results.push(l); }
        return results;
      }).apply(this);
// skip locked cells
      for (index = l = 0; l < 81; index = ++l) {
        x = index % 9;
        y = Math.floor(index / 9);
        if (board.locked[x][y]) {
          k = remainingIndexes.indexOf(index);
          if (k >= 0) {
            remainingIndexes.splice(k, 1);
          }
        }
      }
// skip cells that are already being tried
      for (m = 0, len = attempts.length; m < len; m++) {
        a = attempts[m];
        k = remainingIndexes.indexOf(a.index);
        if (k >= 0) {
          remainingIndexes.splice(k, 1);
        }
      }
      if (remainingIndexes.length === 0) { // abort if there are no cells (should never happen)
        return null;
      }
      fewestIndex = -1;
      fewestMarks = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
      for (n = 0, len1 = remainingIndexes.length; n < len1; n++) {
        index = remainingIndexes[n];
        x = index % 9;
        y = Math.floor(index / 9);
        marks = this.pencilMarks(board, x, y);
        if (marks.length === 0) {
          // abort if there is a cell with no possibilities
          return null;
        }
        if (marks.length === 1) {
          return {
            // done if there is a cell with only one possibility ()
            index: index,
            remaining: marks
          };
        }
        // remember this cell if it has the fewest marks so far
        if (marks.length < fewestMarks.length) {
          fewestIndex = index;
          fewestMarks = marks;
        }
      }
      return {
        index: fewestIndex,
        remaining: fewestMarks
      };
    }

    solve(board) {
      var attempts, solved;
      solved = new Board(board);
      attempts = [];
      return this.solveInternal(solved, attempts);
    }

    hasUniqueSolution(board) {
      var attempts, solved, unlockedCount;
      solved = new Board(board);
      attempts = [];
      if (this.solveInternal(solved, attempts) === null) {
        // if there is no solution, return false
        return false;
      }
      unlockedCount = 81 - solved.lockedCount;
      if (unlockedCount === 0) {
        // if there are no unlocked cells, then this solution must be unique
        return true;
      }
      // check for a second solution
      return this.solveInternal(solved, attempts, unlockedCount - 1) === null;
    }

    solveInternal(solved, attempts, walkIndex = 0) {
      var attempt, unlockedCount, x, y;
      unlockedCount = 81 - solved.lockedCount;
      while (walkIndex < unlockedCount) {
        if (walkIndex >= attempts.length) {
          attempt = this.nextAttempt(solved, attempts);
          if (attempt !== null) {
            attempts.push(attempt);
          }
        } else {
          attempt = attempts[walkIndex];
        }
        if (attempt !== null) {
          x = attempt.index % 9;
          y = Math.floor(attempt.index / 9);
          if (attempt.remaining.length > 0) {
            solved.grid[x][y] = attempt.remaining.pop();
            walkIndex += 1;
          } else {
            attempts.pop();
            solved.grid[x][y] = 0;
            walkIndex -= 1;
          }
        } else {
          walkIndex -= 1;
        }
        if (walkIndex < 0) {
          return null;
        }
      }
      return solved;
    }

    generateInternal(amountToRemove) {
      var board, i, indexesToRemove, j, l, m, nextBoard, removeIndex, removed, rx, ry, solution;
      board = this.solve(new Board());
// hack
      for (j = l = 0; l < 9; j = ++l) {
        for (i = m = 0; m < 9; i = ++m) {
          board.lock(i, j);
        }
      }
      solution = new Board(board);
      indexesToRemove = shuffle((function() {
        var results = [];
        for (var n = 0; n < 81; n++){ results.push(n); }
        return results;
      }).apply(this));
      removed = 0;
      while (removed < amountToRemove) {
        if (indexesToRemove.length === 0) {
          break;
        }
        removeIndex = indexesToRemove.pop();
        rx = removeIndex % 9;
        ry = Math.floor(removeIndex / 9);
        nextBoard = new Board(board);
        nextBoard.grid[rx][ry] = 0;
        nextBoard.lock(rx, ry, false);
        if (this.hasUniqueSolution(nextBoard)) {
          board = nextBoard;
          removed += 1;
        } else {

        }
      }
      // console.log "failed to remove #{rx},#{ry}, creates non-unique solution"
      // console.log "successfully removed #{rx},#{ry}"
      return {board, removed, solution};
    }

    generate(difficulty) {
      var amountToRemove, attempt, best, generated, l;
      amountToRemove = (function() {
        switch (difficulty) {
          case SudokuGenerator.difficulty.extreme:
            return 60;
          case SudokuGenerator.difficulty.hard:
            return 52;
          case SudokuGenerator.difficulty.medium:
            return 46;
          default:
            return 40; // easy / unknown
        }
      })();
      best = null;
      for (attempt = l = 0; l < 2; attempt = ++l) {
        generated = this.generateInternal(amountToRemove);
        if (generated.removed === amountToRemove) {
          console.log(`Removed exact amount ${amountToRemove}, stopping`);
          best = generated;
          break;
        }
        if (best === null) {
          best = generated;
        } else if (best.removed < generated.removed) {
          best = generated;
        }
        console.log(`current best ${best.removed} / ${amountToRemove}`);
      }
      console.log(`giving user board: ${best.removed} / ${amountToRemove}`);
      return [this.boardToGrid(best.board), this.boardToGrid(best.solution)];
    }

    validateGrid(grid) {
      return this.hasUniqueSolution(this.gridToBoard(grid));
    }

    solveString(importString) {
      var answerString, board, i, index, j, l, m, n, o, solved, v, zeroCharCode;
      if (importString.indexOf("SD") !== 0) {
        return false;
      }
      importString = importString.substr(2);
      importString = importString.replace(/[^0-9]/g, "");
      if (importString.length !== 81) {
        return false;
      }
      board = new Board();
      index = 0;
      zeroCharCode = "0".charCodeAt(0);
      for (j = l = 0; l < 9; j = ++l) {
        for (i = m = 0; m < 9; i = ++m) {
          v = importString.charCodeAt(index) - zeroCharCode;
          index += 1;
          if (v > 0) {
            board.grid[j][i] = v;
            board.lock(j, i);
          }
        }
      }
      solved = this.solve(board);
      if (solved === null) {
        console.log("ERROR: Can't be solved.");
        return false;
      }
      if (!this.hasUniqueSolution(board)) {
        console.log("ERROR: Board solve not unique.");
        return false;
      }
      answerString = "";
      for (j = n = 0; n < 9; j = ++n) {
        for (i = o = 0; o < 9; i = ++o) {
          answerString += `${solved.grid[j][i]} `;
        }
        answerString += "\n";
      }
      return answerString;
    }

  };

  SudokuGenerator.difficulty = {
    easy: 1,
    medium: 2,
    hard: 3,
    extreme: 4
  };

  return SudokuGenerator;

}).call(this);

module.exports = SudokuGenerator;


},{}],5:[function(require,module,exports){
var ActionType, CELEBRATION_COLORS, CELEBRATION_INTERVAL_MS, CELEBRATION_STEPS, CHECK_POS_X, CHECK_POS_Y, CLEAR, Color, DOUBLE_TAP_INTERVAL_MS, FLASH_INTERVAL_MS, KEY_MAPPING, MENU_POS_X, MENU_POS_Y, MODE_CENTER_POS_X, MODE_END_POS_X, MODE_POS_Y, MODE_START_POS_X, ModeType, NONE, PENCIL_CLEAR_POS_X, PENCIL_CLEAR_POS_Y, PENCIL_POS_X, PENCIL_POS_Y, PEN_CLEAR_POS_X, PEN_CLEAR_POS_Y, PEN_POS_X, PEN_POS_Y, REDO_POS_X, REDO_POS_Y, SudokuGame, SudokuGenerator, SudokuView, UNDO_POS_X, UNDO_POS_Y, now,
  indexOf = [].indexOf;

SudokuGenerator = require('./SudokuGenerator');

SudokuGame = require('./SudokuGame');

PEN_POS_X = 1;

PEN_POS_Y = 10;

PEN_CLEAR_POS_X = 2;

PEN_CLEAR_POS_Y = 13;

PENCIL_POS_X = 5;

PENCIL_POS_Y = 10;

PENCIL_CLEAR_POS_X = 6;

PENCIL_CLEAR_POS_Y = 13;

MENU_POS_X = 4;

MENU_POS_Y = 13;

MODE_START_POS_X = 2;

MODE_CENTER_POS_X = 4;

MODE_END_POS_X = 6;

MODE_POS_Y = 9;

UNDO_POS_X = 0;

UNDO_POS_Y = 13;

REDO_POS_X = 8;

REDO_POS_Y = 13;

CHECK_POS_X = 8;

CHECK_POS_Y = 9;

Color = {
  value: "black",
  pencil: "#0000ff",
  error: "#ff0000",
  done: "#cccccc",
  menu: "#008833",
  links: "#cc3333",
  backgroundSelected: "#eeeeaa",
  backgroundLocked: "#eeeeee",
  backgroundLockedConflicted: "#ffffee",
  backgroundLockedSelected: "#eeeedd",
  backgroundConflicted: "#ffffdd",
  backgroundError: "#ffdddd",
  modeSelect: "#777744",
  modePen: "#000000",
  modePencil: "#0000ff",
  modeLinks: "#cc3333",
  modeCheck: "#ff0000"
};

ActionType = {
  SELECT: 0,
  PENCIL: 1,
  PEN: 2,
  MENU: 3,
  UNDO: 4,
  REDO: 5,
  MODE: 6,
  CHECK: 7
};

ModeType = {
  VISIBILITY: 0,
  PENCIL: 1,
  PEN: 2,
  LINKS: 3
};

// Special pen/pencil values
NONE = 0;

CLEAR = 10;

// If a second tap on a pen/pencil happens in this interval, toggle value highlighting instead of switching modes
DOUBLE_TAP_INTERVAL_MS = 500;

now = function() {
  return Math.floor(Date.now());
};

KEY_MAPPING = {
  '0': {
    v: CLEAR,
    shift: false
  },
  '1': {
    v: 1,
    shift: false
  },
  '2': {
    v: 2,
    shift: false
  },
  '3': {
    v: 3,
    shift: false
  },
  '4': {
    v: 4,
    shift: false
  },
  '5': {
    v: 5,
    shift: false
  },
  '6': {
    v: 6,
    shift: false
  },
  '7': {
    v: 7,
    shift: false
  },
  '8': {
    v: 8,
    shift: false
  },
  '9': {
    v: 9,
    shift: false
  },
  ')': {
    v: CLEAR,
    shift: true
  },
  '!': {
    v: 1,
    shift: true
  },
  '@': {
    v: 2,
    shift: true
  },
  '#': {
    v: 3,
    shift: true
  },
  '$': {
    v: 4,
    shift: true
  },
  '%': {
    v: 5,
    shift: true
  },
  '^': {
    v: 6,
    shift: true
  },
  '&': {
    v: 7,
    shift: true
  },
  '*': {
    v: 8,
    shift: true
  },
  '(': {
    v: 9,
    shift: true
  }
};

// Celebration color palette
CELEBRATION_COLORS = ["#7f7fff", "#7fff7f", "#7fffff", "#7f7f3f", "#ff7f7f", "#ff7fff", "#ffff7f", "#ffffff"];

CELEBRATION_STEPS = 30; // Number of color changes in a celebration

CELEBRATION_INTERVAL_MS = 33; // Time between celebration color changes

FLASH_INTERVAL_MS = 33; // Length of flash

SudokuView = class SudokuView {
  // -------------------------------------------------------------------------------------
  // Init
  constructor(app, canvas) {
    var fontPixelsL, fontPixelsM, fontPixelsS, heightBasedCellSize, widthBasedCellSize;
    this.app = app;
    this.canvas = canvas;
    console.log(`canvas size ${this.canvas.width}x${this.canvas.height}`);
    widthBasedCellSize = this.canvas.width / 9;
    heightBasedCellSize = this.canvas.height / 14;
    console.log(`widthBasedCellSize ${widthBasedCellSize} heightBasedCellSize ${heightBasedCellSize}`);
    this.cellSize = Math.min(widthBasedCellSize, heightBasedCellSize);
    // calc render constants
    this.lineWidthThin = 1;
    this.lineWidthThick = Math.max(this.cellSize / 20, 3);
    this.linkDotRadius = this.lineWidthThick;
    this.centerX = 4.5 * this.cellSize;
    this.centerY = 4.5 * this.cellSize;
    fontPixelsS = Math.floor(this.cellSize * 0.3);
    fontPixelsM = Math.floor(this.cellSize * 0.5);
    fontPixelsL = Math.floor(this.cellSize * 0.8);
    // init fonts
    this.fonts = {
      pencil: this.app.registerFont("pencil", `${fontPixelsS}px saxMono, monospace`),
      menu: this.app.registerFont("menu", `${fontPixelsM}px saxMono, monospace`),
      pen: this.app.registerFont("pen", `${fontPixelsL}px saxMono, monospace`)
    };
    this.initActions();
    // init state
    this.game = new SudokuGame();
    this.resetState();
    this.draw();
  }

  initActions() {
    var i, index, j, l, n, o, p, q, ref, ref1, t, u;
    this.actions = new Array(9 * 15).fill(null);
    for (j = l = 0; l < 9; j = ++l) {
      for (i = n = 0; n < 9; i = ++n) {
        index = (j * 9) + i;
        this.actions[index] = {
          type: ActionType.SELECT,
          x: i,
          y: j
        };
      }
    }
    for (j = o = 0; o < 3; j = ++o) {
      for (i = p = 0; p < 3; i = ++p) {
        index = ((PEN_POS_Y + j) * 9) + (PEN_POS_X + i);
        this.actions[index] = {
          type: ActionType.PEN,
          value: 1 + (j * 3) + i
        };
      }
    }
    for (j = q = 0; q < 3; j = ++q) {
      for (i = t = 0; t < 3; i = ++t) {
        index = ((PENCIL_POS_Y + j) * 9) + (PENCIL_POS_X + i);
        this.actions[index] = {
          type: ActionType.PENCIL,
          value: 1 + (j * 3) + i
        };
      }
    }
    // Pen clear button
    index = (PEN_CLEAR_POS_Y * 9) + PEN_CLEAR_POS_X;
    this.actions[index] = {
      type: ActionType.PEN,
      value: CLEAR
    };
    // Pencil clear button
    index = (PENCIL_CLEAR_POS_Y * 9) + PENCIL_CLEAR_POS_X;
    this.actions[index] = {
      type: ActionType.PENCIL,
      value: CLEAR
    };
    // Menu button
    index = (MENU_POS_Y * 9) + MENU_POS_X;
    this.actions[index] = {
      type: ActionType.MENU
    };
    // Undo button
    index = (UNDO_POS_Y * 9) + UNDO_POS_X;
    this.actions[index] = {
      type: ActionType.UNDO
    };
    // Redo button
    index = (REDO_POS_Y * 9) + REDO_POS_X;
    this.actions[index] = {
      type: ActionType.REDO
    };
// Mode switch
    for (i = u = ref = (MODE_POS_Y * 9) + MODE_START_POS_X, ref1 = (MODE_POS_Y * 9) + MODE_END_POS_X; (ref <= ref1 ? u <= ref1 : u >= ref1); i = ref <= ref1 ? ++u : --u) {
      this.actions[i] = {
        type: ActionType.MODE
      };
    }
    // Check button
    index = (CHECK_POS_Y * 9) + CHECK_POS_X;
    this.actions[index] = {
      type: ActionType.CHECK
    };
  }

  resetState() {
    this.mode = ModeType.VISIBILITY;
    this.penValue = NONE;
    this.visibilityX = -1;
    this.visibilityY = -1;
    this.preferPencil = false;
    this.strongLinks = [];
    this.weakLinks = [];
    this.highlightingValues = false;
    this.lastValueTapMS = now() - DOUBLE_TAP_INTERVAL_MS; // Ensure the next tap is not a double tap
    return this.celebrationCount = -1; // -1 = never run, 0 = done, > 0 = running
  }

  
    // -------------------------------------------------------------------------------------
  // Rendering
  celebrate() {
    this.draw();
    if (this.celebrationCount > 0) {
      --this.celebrationCount;
      return setTimeout(() => {
        return this.celebrate();
      }, CELEBRATION_INTERVAL_MS);
    }
  }

  chooseCelebrationColor(value) {
    var color, index;
    color = null;
    if (value > 0 && this.celebrationCount > 0) {
      index = (value + this.celebrationCount - 2) % 8;
      color = CELEBRATION_COLORS[index];
    }
    return color;
  }

  chooseBackgroundColor(i, j, value, locked, marks) {
    var color, ref;
    color = null;
    // Locked cells
    if (locked) {
      color = Color.backgroundLocked;
    }
    // Override with any highlighting
    switch (this.mode) {
      case ModeType.VISIBILITY:
        if ((this.visibilityX !== -1) && (this.visibilityY !== -1)) {
          if ((i === this.visibilityX) && (j === this.visibilityY)) {
            if (locked) {
              color = Color.backgroundLockedSelected;
            } else {
              color = Color.backgroundSelected;
            }
          } else if (this.conflicts(i, j, this.visibilityX, this.visibilityY)) {
            if (locked) {
              color = Color.backgroundLockedConflicted;
            } else {
              color = Color.backgroundConflicted;
            }
          }
        }
        break;
      case ModeType.PEN:
        if (this.highlightingValues && this.penValue === value && value !== 0) {
          color = Color.backgroundSelected;
        }
        break;
      case ModeType.PENCIL:
        if (this.highlightingValues && value === 0 && (ref = this.penValue, indexOf.call(marks, ref) >= 0)) {
          color = Color.backgroundSelected;
        }
    }
    // Override if celebrating
    if (this.celebrationCount > 0) {
      color = this.chooseCelebrationColor(value);
    }
    return color;
  }

  markOffset(v) {
    return {
      x: ((v - 1) % 3) * this.cellSize / 3 + this.cellSize / 6,
      y: Math.floor((v - 1) / 3) * this.cellSize / 3 + this.cellSize / 6
    };
  }

  drawCell(x, y, backgroundColor, s, font, color) {
    var px, py;
    px = x * this.cellSize;
    py = y * this.cellSize;
    if (backgroundColor !== null) {
      this.app.drawFill(px, py, this.cellSize, this.cellSize, backgroundColor);
    }
    this.app.drawTextCentered(s, px + (this.cellSize / 2), py + (this.cellSize / 2), font, color);
  }

  drawFlashCell(x, y) {
    var px, py;
    px = x * this.cellSize;
    py = y * this.cellSize;
    this.app.drawFill(px, py, this.cellSize, this.cellSize, "black");
  }

  drawUnsolvedCell(x, y, backgroundColor, marks) {
    var l, len, m, mx, my, offset, px, py, text;
    px = x * this.cellSize;
    py = y * this.cellSize;
    if (backgroundColor !== null) {
      this.app.drawFill(px, py, this.cellSize, this.cellSize, backgroundColor);
    }
    for (l = 0, len = marks.length; l < len; l++) {
      m = marks[l];
      offset = this.markOffset(m.value);
      mx = px + offset.x;
      my = py + offset.y;
      text = String(m.value);
      this.app.drawTextCentered(text, mx, my, this.fonts.pencil, m.color);
    }
  }

  drawSolvedCell(x, y, backgroundColor, color, value) {
    var px, py;
    px = x * this.cellSize;
    py = y * this.cellSize;
    if (backgroundColor !== null) {
      this.app.drawFill(px, py, this.cellSize, this.cellSize, backgroundColor);
    }
    this.app.drawTextCentered(String(value), px + (this.cellSize / 2), py + (this.cellSize / 2), this.fonts.pen, color);
  }

  drawGrid(originX, originY, size, solved = false) {
    var bottom, color, i, l, left, lineWidth, ref, right, top, x, y;
    left = this.cellSize * (originX + 0);
    right = this.cellSize * (originX + size);
    top = this.cellSize * (originY + 0);
    bottom = this.cellSize * (originY + size);
    for (i = l = 0, ref = size; (0 <= ref ? l <= ref : l >= ref); i = 0 <= ref ? ++l : --l) {
      color = solved ? "green" : "black";
      lineWidth = this.lineWidthThin;
      if ((size === 1) || (i % 3) === 0) {
        lineWidth = this.lineWidthThick;
      }
      // Horizontal lines
      y = this.cellSize * (originY + i);
      this.app.drawLine(left, y, right, y, color, lineWidth);
      // Vertical lines
      x = this.cellSize * (originX + i);
      this.app.drawLine(x, top, x, bottom, color, lineWidth);
    }
  }

  drawLink(startX, startY, endX, endY, color, lineWidth, v) {
    var centerIsLeft, curvature, lineDist2, lineMidX, lineMidY, offset, r, squaresDist2, squaresMidX, squaresMidY, x1, x2, y1, y2;
    offset = this.markOffset(v);
    x1 = startX * this.cellSize + offset.x;
    y1 = startY * this.cellSize + offset.y;
    x2 = endX * this.cellSize + offset.x;
    y2 = endY * this.cellSize + offset.y;
    // Ensure that the arc curves inward for marks nearer the outside and curves outward for marks nearer the center.

    // If the distance from the center to the midpoint of the line is greater than the distance from the center to the midpoint of
    // the squares, then the line curves toward the center.
    lineMidX = (x1 + x2) / 2;
    lineMidY = (y1 + y2) / 2;
    squaresMidX = this.cellSize * (startX + endX + 1) / 2;
    squaresMidY = this.cellSize * (startY + endY + 1) / 2;
    lineDist2 = (this.centerX - lineMidX) * (this.centerX - lineMidX) + (this.centerY - lineMidY) * (this.centerY - lineMidY);
    squaresDist2 = (this.centerX - squaresMidX) * (this.centerX - squaresMidX) + (this.centerY - squaresMidY) * (this.centerY - squaresMidY);
    centerIsLeft = (this.centerX - x1) * (y2 - y1) - (this.centerY - y1) * (x2 - x1) < 0;
    // When the grid center is left of the line, then the curve is automatically outward, so we have to swap if we want an inward
    // curve, and vice versa
    if ((centerIsLeft && lineDist2 > squaresDist2) || (!centerIsLeft && lineDist2 < squaresDist2)) {
      [x1, x2] = [x2, x1];
      [y1, y2] = [y2, y1];
    }
    curvature = 2.5; // 2.5 gives the most curve without overlapping other cells
    r = curvature * Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
    this.app.drawArc(x1, y1, x2, y2, r, color, lineWidth);
    this.app.drawPoint(x1, y1, this.linkDotRadius, color);
    return this.app.drawPoint(x2, y2, this.linkDotRadius, color);
  }

  draw(flashX, flashY) {
    var backgroundColor, cell, coloredMarks, currentValue, currentValueString, done, i, j, l, len, len1, link, m, marks, modeColor, modeText, n, o, p, pencilBackgroundColor, pencilColor, q, ref, ref1, t, textColor, valueBackgroundColor, valueColor;
    console.log("draw()");
    // Clear screen to black
    this.app.drawFill(0, 0, this.canvas.width, this.canvas.height, "black");
    // Make white phone-shaped background
    this.app.drawFill(0, 0, this.cellSize * 9, this.canvas.height, "white");
// Draw board numbers
    for (j = l = 0; l < 9; j = ++l) {
      for (i = n = 0; n < 9; i = ++n) {
        if ((i === flashX) && (j === flashY)) {
          // Draw flash
          this.drawFlashCell(i, j);
        } else {
          // Draw solved or unsolved cell
          cell = this.game.grid[i][j];
          marks = this.game.pencilMarks(i, j);
          // Determine background color
          backgroundColor = this.chooseBackgroundColor(i, j, cell.value, cell.locked, marks);
          if (cell.value === 0) {
            if (this.mode === ModeType.CHECK) {
              coloredMarks = (function() {
                var len, o, results;
                results = [];
                for (o = 0, len = marks.length; o < len; o++) {
                  m = marks[o];
                  results.push({
                    value: m,
                    color: this.game.markIsGood(i, j, m) ? Color.pencil : Color.error
                  });
                }
                return results;
              }).call(this);
            } else {
              coloredMarks = (function() {
                var len, o, results;
                results = [];
                for (o = 0, len = marks.length; o < len; o++) {
                  m = marks[o];
                  results.push({
                    value: m,
                    color: Color.pencil
                  });
                }
                return results;
              })();
            }
            this.drawUnsolvedCell(i, j, backgroundColor, coloredMarks);
          } else {
            if (this.mode === ModeType.CHECK) {
              textColor = this.game.solution[i][j] === cell.value ? Color.value : Color.error;
            } else {
              textColor = cell.error ? Color.error : Color.value;
            }
            this.drawSolvedCell(i, j, backgroundColor, textColor, cell.value);
          }
        }
      }
    }
    // Draw links in LINKS mode
    if (this.mode === ModeType.LINKS) {
      ref = this.strongLinks;
      for (o = 0, len = ref.length; o < len; o++) {
        link = ref[o];
        this.drawLink(link[0].x, link[0].y, link[1].x, link[1].y, Color.links, this.lineWidthThick, this.penValue);
      }
      ref1 = this.weakLinks;
      for (p = 0, len1 = ref1.length; p < len1; p++) {
        link = ref1[p];
        this.drawLink(link[0].x, link[0].y, link[1].x, link[1].y, Color.links, this.lineWidthThin, this.penValue);
      }
    }
    // Draw pen and pencil number buttons
    done = this.game.done();
    for (j = q = 0; q < 3; j = ++q) {
      for (i = t = 0; t < 3; i = ++t) {
        currentValue = (j * 3) + i + 1;
        currentValueString = String(currentValue);
        valueColor = Color.value;
        pencilColor = Color.pencil;
        if (done[(j * 3) + i]) {
          valueColor = Color.done;
          pencilColor = Color.done;
        }
        valueBackgroundColor = null;
        pencilBackgroundColor = null;
        if (this.penValue === currentValue) {
          if (this.mode === ModeType.PENCIL || this.mode === ModeType.LINKS) {
            pencilBackgroundColor = Color.backgroundSelected;
          } else {
            valueBackgroundColor = Color.backgroundSelected;
          }
        }
        this.drawCell(PEN_POS_X + i, PEN_POS_Y + j, valueBackgroundColor, currentValueString, this.fonts.pen, valueColor);
        this.drawCell(PENCIL_POS_X + i, PENCIL_POS_Y + j, pencilBackgroundColor, currentValueString, this.fonts.pen, pencilColor);
      }
    }
    // Draw pen and pencil CLEAR buttons
    valueBackgroundColor = null;
    pencilBackgroundColor = null;
    if (this.penValue === CLEAR) {
      if (this.mode === ModeType.PENCIL) {
        pencilBackgroundColor = Color.backgroundSelected;
      } else {
        valueBackgroundColor = Color.backgroundSelected;
      }
    }
    this.drawCell(PEN_CLEAR_POS_X, PEN_CLEAR_POS_Y, valueBackgroundColor, "C", this.fonts.pen, Color.error);
    this.drawCell(PENCIL_CLEAR_POS_X, PENCIL_CLEAR_POS_Y, pencilBackgroundColor, "C", this.fonts.pen, Color.error);
    // Draw mode
    switch (this.mode) {
      case ModeType.VISIBILITY:
        modeColor = Color.modeSelect;
        modeText = "Highlighting";
        break;
      case ModeType.PENCIL:
        modeColor = Color.modePencil;
        modeText = "Pencil";
        break;
      case ModeType.PEN:
        modeColor = Color.modePen;
        modeText = "Pen";
        break;
      case ModeType.LINKS:
        modeColor = Color.modeLinks;
        modeText = "Links";
        break;
      case ModeType.CHECK:
        modeColor = Color.modeCheck;
        modeText = "Checking";
    }
    this.drawCell(MODE_CENTER_POS_X, MODE_POS_Y, null, modeText, this.fonts.menu, modeColor);
    this.drawCell(MENU_POS_X, MENU_POS_Y, null, "Menu", this.fonts.menu, Color.menu);
    if (this.game.undoJournal.length > 0) {
      this.drawCell(UNDO_POS_X, UNDO_POS_Y, null, "\u{25c4}", this.fonts.menu, Color.menu);
    }
    if (this.game.redoJournal.length > 0) {
      this.drawCell(REDO_POS_X, REDO_POS_Y, null, "\u{25ba}", this.fonts.menu, Color.menu);
    }
    this.drawCell(CHECK_POS_X, CHECK_POS_Y, null, "\u{2714}", this.fonts.menu, Color.error);
    // Make the grids
    this.drawGrid(0, 0, 9, this.game.solved);
    this.drawGrid(PEN_POS_X, PEN_POS_Y, 3);
    this.drawGrid(PENCIL_POS_X, PENCIL_POS_Y, 3);
    this.drawGrid(PEN_CLEAR_POS_X, PEN_CLEAR_POS_Y, 1);
    this.drawGrid(PENCIL_CLEAR_POS_X, PENCIL_CLEAR_POS_Y, 1);
    // If the game is solved, then start the celebration
    if (this.game.solved && this.celebrationCount < 0) {
      this.celebrationCount = CELEBRATION_STEPS;
      return setTimeout(() => {
        return this.celebrate();
      }, CELEBRATION_INTERVAL_MS);
    }
  }

  // -------------------------------------------------------------------------------------
  // Input

    // Determines if the interval is short enough to consider an tap to be a double tap.
  doubleTapDetected() {
    var dt;
    // Double tap also depends on other context. This just measures the time.
    dt = now() - this.lastValueTapMS;
    return dt < DOUBLE_TAP_INTERVAL_MS;
  }

  newGame(difficulty) {
    console.log(`SudokuView.newGame(${difficulty})`);
    this.resetState();
    return this.game.newGame(difficulty);
  }

  reset() {
    this.resetState();
    return this.game.reset();
  }

  import(importString) {
    this.resetState();
    return this.game.import(importString);
  }

  export() {
    return this.game.export();
  }

  holeCount() {
    return this.game.holeCount();
  }

  handleSelectAction(action) {
    switch (this.mode) {
      case ModeType.VISIBILITY:
        if ((this.visibilityX === action.x) && (this.visibilityY === action.y)) {
          this.visibilityX = -1;
          this.visibilityY = -1;
        } else {
          this.visibilityX = action.x;
          this.visibilityY = action.y;
        }
        return [];
      case ModeType.PENCIL:
        if (this.penValue === CLEAR) {
          this.game.clearPencil(action.x, action.y);
        } else if (this.penValue !== NONE) {
          this.game.togglePencil(action.x, action.y, this.penValue);
        }
        return [action.x, action.y];
      case ModeType.PEN:
        if (this.penValue === CLEAR) {
          this.game.setValue(action.x, action.y, 0);
        } else if (this.penValue !== NONE) {
          this.game.setValue(action.x, action.y, this.penValue);
        }
        return [action.x, action.y];
    }
  }

  handlePencilAction(action) {
    // First, make sure any VISIBILITY and LINKS mode stuff is reset
    this.visibilityX = -1;
    this.visibilityY = -1;
    this.strongLinks = [];
    this.weakLinks = [];
    switch (this.mode) {
      // In LINKS, all links associated with the number are shown. CLEAR shows nothing.
      case ModeType.LINKS:
        if (action.value === CLEAR) {
          this.penValue = NONE;
          this.strongLinks = [];
          this.weakLinks = [];
        } else {
          this.penValue = action.value;
          ({
            strong: this.strongLinks,
            weak: this.weakLinks
          } = this.game.getLinks(action.value));
        }
        break;
      // In PENCIL, the mode is changed to VISIBILITY if the selected value is already current unless double tap
      // Also, if double tap, then turn on highlighting values
      case ModeType.PENCIL:
        if (this.penValue === action.value) {
          if (this.doubleTapDetected()) {
            this.highlightingValues = true;
          } else {
            this.highlightingValues = false;
            this.lastValueTapMS = now();
            this.mode = ModeType.VISIBILITY;
            this.penValue = NONE;
          }
        } else {
          this.highlightingValues = false;
          this.lastValueTapMS = now();
          this.penValue = action.value;
        }
        this.preferPencil = true; // Make sure the keyboard is also in pencil mode
        break;
      default:
        // It is possible that the first tap changed the mode to VISIBILITY so a double tap must pretend that it didn't

        // Otherwise, switch to PENCIL
        if (this.mode === ModeType.VISIBILITY && this.doubleTapDetected()) {
          this.highlightingValues = true;
        } else {
          this.highlightingValues = false;
          this.lastValueTapMS = now();
        }
        this.mode = ModeType.PENCIL;
        this.penValue = action.value;
        this.preferPencil = true; // Make sure the keyboard is also in pencil mode
    }
  }

  handlePenAction(action) {
    switch (this.mode) {
      // In PEN, the mode is changed to VISIBILITY if the selected value is already current unless double tap
      // Also, if double tap, then turn on highlighting values
      case ModeType.PEN:
        if (this.penValue === action.value) {
          if (this.doubleTapDetected()) {
            this.highlightingValues = true;
          } else {
            this.highlightingValues = false;
            this.lastValueTapMS = now();
            this.mode = ModeType.VISIBILITY;
            this.penValue = NONE;
          }
        } else {
          this.highlightingValues = false;
          this.lastValueTapMS = now();
          this.penValue = action.value;
        }
        this.preferPencil = false; // Make sure the keyboard is also in pen mode
        break;
      
        // Ignored in LINKS
      case ModeType.LINKS:
        return;
      default:
        // It is possible that the first tap changed the mode to VISIBILITY so a double tap must pretend that it didn't
        // Otherwise, the mode is switched to (or remains as) PEN using the selected value
        if (this.mode === ModeType.VISIBILITY && this.doubleTapDetected()) {
          this.highlightingValues = true;
        } else {
          this.highlightingValues = false;
          this.lastValueTapMS = now();
        }
        this.mode = ModeType.PEN;
        this.penValue = action.value;
        this.preferPencil = false; // Make sure the keyboard is also in pen mode
    }
    
    // Make sure any visibility highlighting is off and links are cleared.
    this.visibilityX = -1;
    this.visibilityY = -1;
    this.strongLinks = [];
    this.weakLinks = [];
  }

  handleUndoAction() {
    if (this.mode !== ModeType.LINKS && this.mode !== ModeType.CHECK) {
      return this.game.undo();
    }
  }

  handleRedoAction() {
    if (this.mode !== ModeType.LINKS && this.mode !== ModeType.CHECK) {
      return this.game.redo();
    }
  }

  handleModeAction() {
    switch (this.mode) {
      case ModeType.VISIBILITY:
        this.mode = ModeType.LINKS;
        break;
      case ModeType.PENCIL:
        this.mode = ModeType.PEN;
        break;
      case ModeType.PEN:
        this.mode = ModeType.VISIBILITY;
        break;
      case ModeType.LINKS:
      case ModeType.CHECK:
        this.mode = ModeType.PENCIL;
    }
    this.visibilityX = -1;
    this.visibilityY = -1;
    this.penValue = NONE;
    this.strongLinks = [];
    this.weakLinks = [];
    this.highlightingValues = false;
    this.lastValueTapMS = now() - DOUBLE_TAP_INTERVAL_MS; // Ensure that the next tap is not a double tap
  }

  handleCheckAction() {
    this.mode = ModeType.CHECK;
    this.visibilityX = -1;
    this.visibilityY = -1;
    this.penValue = NONE;
    this.strongLinks = [];
    this.weakLinks = [];
    this.highlightingValues = false;
    this.lastValueTapMS = now() - DOUBLE_TAP_INTERVAL_MS; // Ensure that the next tap is not a double tap
  }

  click(x, y) {
    var action, flashX, flashY, index;
    // console.log "click #{x}, #{y}"
    x = Math.floor(x / this.cellSize);
    y = Math.floor(y / this.cellSize);
    flashX = null;
    flashY = null;
    if ((x < 9) && (y < 15)) {
      index = (y * 9) + x;
      action = this.actions[index];
      if (action !== null) {
        console.log("Action: ", action);
        if (action.type === ActionType.MENU) {
          this.app.switchView("menu");
          return;
        }
        switch (action.type) {
          case ActionType.SELECT:
            [flashX, flashY] = this.handleSelectAction(action);
            break;
          case ActionType.PENCIL:
            this.handlePencilAction(action);
            break;
          case ActionType.PEN:
            this.handlePenAction(action);
            break;
          case ActionType.UNDO:
            [flashX, flashY] = this.handleUndoAction();
            break;
          case ActionType.REDO:
            [flashX, flashY] = this.handleRedoAction();
            break;
          case ActionType.MODE:
            this.handleModeAction();
            break;
          case ActionType.CHECK:
            this.handleCheckAction();
        }
      } else {
        // no action, default to VISIBILITY mode
        this.mode = ModeType.VISIBILITY;
        this.visibilityX = -1;
        this.visibilityY = -1;
        this.penValue = NONE;
        this.strongLinks = [];
        this.weakLinks = [];
        this.highlightingValues = false;
        this.lastValueTapMS = now() - DOUBLE_TAP_INTERVAL_MS; // Ensure that the next tap is not a double tap
      }
      this.draw(flashX, flashY);
      if ((flashX != null) && (flashY != null)) {
        setTimeout(() => {
          return this.draw();
        }, FLASH_INTERVAL_MS);
      }
    }
  }

  key(k) {
    var mapping, usePencil;
    if (k === '.') {
      this.preferPencil = !this.preferPencil;
      if (this.mode === ModeType.PEN) {
        this.handlePencilAction({
          value: this.penValue
        });
      } else if (this.mode === ModeType.PENCIL) {
        this.handlePenAction({
          value: this.penValue
        });
      } else if (this.mode === ModeType.LINKS) {
        this.handleModeAction();
      }
      return this.draw();
    } else if (KEY_MAPPING[k] != null) {
      mapping = KEY_MAPPING[k];
      usePencil = this.preferPencil;
      if (mapping.shift) {
        usePencil = !usePencil;
      }
      if (usePencil || this.mode === ModeType.LINKS) {
        this.handlePencilAction({
          value: mapping.v
        });
      } else {
        this.handlePenAction({
          value: mapping.v
        });
      }
      this.draw();
    }
  }

  // -------------------------------------------------------------------------------------
  // Helpers
  conflicts(x1, y1, x2, y2) {
    var sx1, sx2, sy1, sy2;
    // same row or column?
    if ((x1 === x2) || (y1 === y2)) {
      return true;
    }
    // same section?
    sx1 = Math.floor(x1 / 3) * 3;
    sy1 = Math.floor(y1 / 3) * 3;
    sx2 = Math.floor(x2 / 3) * 3;
    sy2 = Math.floor(y2 / 3) * 3;
    if ((sx1 === sx2) && (sy1 === sy2)) {
      return true;
    }
    return false;
  }

};

// -------------------------------------------------------------------------------------
module.exports = SudokuView;


},{"./SudokuGame":3,"./SudokuGenerator":4}],6:[function(require,module,exports){
var App, init;

App = require('./App');

init = function() {
  var canvas, canvasRect;
  console.log("init");
  canvas = document.createElement("canvas");
  canvas.width = document.documentElement.clientWidth;
  canvas.height = document.documentElement.clientHeight;
  document.body.insertBefore(canvas, document.body.childNodes[0]);
  canvasRect = canvas.getBoundingClientRect();
  window.app = new App(canvas);
  // canvas.addEventListener "touchstart", (e) ->
  //   console.log Object.keys(e.touches[0])
  //   x = e.touches[0].clientX - canvasRect.left
  //   y = e.touches[0].clientY - canvasRect.top
  //   window.app.click(x, y)
  canvas.addEventListener("mousedown", function(e) {
    var x, y;
    x = e.clientX - canvasRect.left;
    y = e.clientY - canvasRect.top;
    return window.app.click(x, y);
  });
  return document.addEventListener('keydown', function(e) {
    return window.app.key(e.key);
  });
};

window.addEventListener('load', function(e) {
  return init();
}, false);


},{"./App":1}],7:[function(require,module,exports){
module.exports = "0.0.18";


},{}],8:[function(require,module,exports){
/* Font Face Observer v2.3.0 - © Bram Stein. License: BSD-3-Clause */(function(){function p(a,c){document.addEventListener?a.addEventListener("scroll",c,!1):a.attachEvent("scroll",c)}function u(a){document.body?a():document.addEventListener?document.addEventListener("DOMContentLoaded",function b(){document.removeEventListener("DOMContentLoaded",b);a()}):document.attachEvent("onreadystatechange",function g(){if("interactive"==document.readyState||"complete"==document.readyState)document.detachEvent("onreadystatechange",g),a()})};function w(a){this.g=document.createElement("div");this.g.setAttribute("aria-hidden","true");this.g.appendChild(document.createTextNode(a));this.h=document.createElement("span");this.i=document.createElement("span");this.m=document.createElement("span");this.j=document.createElement("span");this.l=-1;this.h.style.cssText="max-width:none;display:inline-block;position:absolute;height:100%;width:100%;overflow:scroll;font-size:16px;";this.i.style.cssText="max-width:none;display:inline-block;position:absolute;height:100%;width:100%;overflow:scroll;font-size:16px;";
this.j.style.cssText="max-width:none;display:inline-block;position:absolute;height:100%;width:100%;overflow:scroll;font-size:16px;";this.m.style.cssText="display:inline-block;width:200%;height:200%;font-size:16px;max-width:none;";this.h.appendChild(this.m);this.i.appendChild(this.j);this.g.appendChild(this.h);this.g.appendChild(this.i)}
function x(a,c){a.g.style.cssText="max-width:none;min-width:20px;min-height:20px;display:inline-block;overflow:hidden;position:absolute;width:auto;margin:0;padding:0;top:-999px;white-space:nowrap;font-synthesis:none;font:"+c+";"}function B(a){var c=a.g.offsetWidth,b=c+100;a.j.style.width=b+"px";a.i.scrollLeft=b;a.h.scrollLeft=a.h.scrollWidth+100;return a.l!==c?(a.l=c,!0):!1}function C(a,c){function b(){var e=g;B(e)&&null!==e.g.parentNode&&c(e.l)}var g=a;p(a.h,b);p(a.i,b);B(a)};function D(a,c,b){c=c||{};b=b||window;this.family=a;this.style=c.style||"normal";this.weight=c.weight||"normal";this.stretch=c.stretch||"normal";this.context=b}var E=null,F=null,G=null,H=null;function I(a){null===F&&(M(a)&&/Apple/.test(window.navigator.vendor)?(a=/AppleWebKit\/([0-9]+)(?:\.([0-9]+))(?:\.([0-9]+))/.exec(window.navigator.userAgent),F=!!a&&603>parseInt(a[1],10)):F=!1);return F}function M(a){null===H&&(H=!!a.document.fonts);return H}
function N(a,c){var b=a.style,g=a.weight;if(null===G){var e=document.createElement("div");try{e.style.font="condensed 100px sans-serif"}catch(q){}G=""!==e.style.font}return[b,g,G?a.stretch:"","100px",c].join(" ")}
D.prototype.load=function(a,c){var b=this,g=a||"BESbswy",e=0,q=c||3E3,J=(new Date).getTime();return new Promise(function(K,L){if(M(b.context)&&!I(b.context)){var O=new Promise(function(r,t){function h(){(new Date).getTime()-J>=q?t(Error(""+q+"ms timeout exceeded")):b.context.document.fonts.load(N(b,'"'+b.family+'"'),g).then(function(n){1<=n.length?r():setTimeout(h,25)},t)}h()}),P=new Promise(function(r,t){e=setTimeout(function(){t(Error(""+q+"ms timeout exceeded"))},q)});Promise.race([P,O]).then(function(){clearTimeout(e);
K(b)},L)}else u(function(){function r(){var d;if(d=-1!=k&&-1!=l||-1!=k&&-1!=m||-1!=l&&-1!=m)(d=k!=l&&k!=m&&l!=m)||(null===E&&(d=/AppleWebKit\/([0-9]+)(?:\.([0-9]+))/.exec(window.navigator.userAgent),E=!!d&&(536>parseInt(d[1],10)||536===parseInt(d[1],10)&&11>=parseInt(d[2],10))),d=E&&(k==y&&l==y&&m==y||k==z&&l==z&&m==z||k==A&&l==A&&m==A)),d=!d;d&&(null!==f.parentNode&&f.parentNode.removeChild(f),clearTimeout(e),K(b))}function t(){if((new Date).getTime()-J>=q)null!==f.parentNode&&f.parentNode.removeChild(f),
L(Error(""+q+"ms timeout exceeded"));else{var d=b.context.document.hidden;if(!0===d||void 0===d)k=h.g.offsetWidth,l=n.g.offsetWidth,m=v.g.offsetWidth,r();e=setTimeout(t,50)}}var h=new w(g),n=new w(g),v=new w(g),k=-1,l=-1,m=-1,y=-1,z=-1,A=-1,f=document.createElement("div");f.dir="ltr";x(h,N(b,"sans-serif"));x(n,N(b,"serif"));x(v,N(b,"monospace"));f.appendChild(h.g);f.appendChild(n.g);f.appendChild(v.g);b.context.document.body.appendChild(f);y=h.g.offsetWidth;z=n.g.offsetWidth;A=v.g.offsetWidth;t();
C(h,function(d){k=d;r()});x(h,N(b,'"'+b.family+'",sans-serif'));C(n,function(d){l=d;r()});x(n,N(b,'"'+b.family+'",serif'));C(v,function(d){m=d;r()});x(v,N(b,'"'+b.family+'",monospace'))})})};"object"===typeof module?module.exports=D:(window.FontFaceObserver=D,window.FontFaceObserver.prototype.load=D.prototype.load);}());

},{}]},{},[6])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJnYW1lL3NyYy9BcHAuY29mZmVlIiwiZ2FtZS9zcmMvTWVudVZpZXcuY29mZmVlIiwiZ2FtZS9zcmMvU3Vkb2t1R2FtZS5jb2ZmZWUiLCJnYW1lL3NyYy9TdWRva3VHZW5lcmF0b3IuY29mZmVlIiwiZ2FtZS9zcmMvU3Vkb2t1Vmlldy5jb2ZmZWUiLCJnYW1lL3NyYy9tYWluLmNvZmZlZSIsImdhbWUvc3JjL3ZlcnNpb24uY29mZmVlIiwibm9kZV9tb2R1bGVzL2ZvbnRmYWNlb2JzZXJ2ZXIvZm9udGZhY2VvYnNlcnZlci5zdGFuZGFsb25lLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUEsSUFBQSxHQUFBLEVBQUEsZ0JBQUEsRUFBQSxRQUFBLEVBQUEsVUFBQSxFQUFBOztBQUFBLGdCQUFBLEdBQW1CLE9BQUEsQ0FBUSxrQkFBUjs7QUFFbkIsUUFBQSxHQUFXLE9BQUEsQ0FBUSxZQUFSOztBQUNYLFVBQUEsR0FBYSxPQUFBLENBQVEsY0FBUjs7QUFDYixPQUFBLEdBQVUsT0FBQSxDQUFRLFdBQVI7O0FBRUosTUFBTixNQUFBLElBQUE7RUFDRSxXQUFhLE9BQUEsQ0FBQTtJQUFDLElBQUMsQ0FBQTtJQUNiLElBQUMsQ0FBQSxHQUFELEdBQU8sSUFBQyxDQUFBLE1BQU0sQ0FBQyxVQUFSLENBQW1CLElBQW5CO0lBQ1AsSUFBQyxDQUFBLFFBQUQsQ0FBVSxTQUFWO0lBQ0EsSUFBQyxDQUFBLEtBQUQsR0FBUyxDQUFBO0lBRVQsSUFBQyxDQUFBLGlCQUFELEdBQXFCLElBQUksQ0FBQyxLQUFMLENBQVcsSUFBQyxDQUFBLE1BQU0sQ0FBQyxNQUFSLEdBQWlCLElBQTVCO0lBQ3JCLElBQUMsQ0FBQSxXQUFELEdBQWUsSUFBQyxDQUFBLFlBQUQsQ0FBYyxTQUFkLEVBQXlCLENBQUEsQ0FBQSxDQUFHLElBQUMsQ0FBQSxpQkFBSixDQUFBLHFCQUFBLENBQXpCO0lBRWYsSUFB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QyxLQUFYLENBQWlCLENBQWpCLEVBQW9CLENBQXBCO0VBSG1DLENBQXJDO1NBS0EsUUFBUSxDQUFDLGdCQUFULENBQTBCLFNBQTFCLEVBQXFDLFFBQUEsQ0FBQyxDQUFELENBQUE7V0FDbkMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxHQUFYLENBQWUsQ0FBQyxDQUFDLEdBQWpCO0VBRG1DLENBQXJDO0FBckJLOztBQXdCUCxNQUFNLENBQUMsZ0JBQVAsQ0FBd0IsTUFBeEIsRUFBZ0MsUUFBQSxDQUFDLENBQUQsQ0FBQTtTQUM1QixJQUFBLENBQUE7QUFENEIsQ0FBaEMsRUFFRSxLQUZGOzs7O0FDMUJBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCOzs7O0FDQWpCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsIkZvbnRGYWNlT2JzZXJ2ZXIgPSByZXF1aXJlICdmb250ZmFjZW9ic2VydmVyJ1xyXG5cclxuTWVudVZpZXcgPSByZXF1aXJlICcuL01lbnVWaWV3J1xyXG5TdWRva3VWaWV3ID0gcmVxdWlyZSAnLi9TdWRva3VWaWV3J1xyXG52ZXJzaW9uID0gcmVxdWlyZSAnLi92ZXJzaW9uJ1xyXG5cclxuY2xhc3MgQXBwXHJcbiAgY29uc3RydWN0b3I6IChAY2FudmFzKSAtPlxyXG4gICAgQGN0eCA9IEBjYW52YXMuZ2V0Q29udGV4dChcIjJkXCIpXHJcbiAgICBAbG9hZEZvbnQoXCJzYXhNb25vXCIpXHJcbiAgICBAZm9udHMgPSB7fVxyXG5cclxuICAgIEB2ZXJzaW9uRm9udEhlaWdodCA9IE1hdGguZmxvb3IoQGNhbnZhcy5oZWlnaHQgKiAwLjAyKVxyXG4gICAgQHZlcnNpb25Gb250ID0gQHJlZ2lzdGVyRm9udChcInZlcnNpb25cIiwgXCIje0B2ZXJzaW9uRm9udEhlaWdodH1weCBzYXhNb25vLCBtb25vc3BhY2VcIilcclxuXHJcbiAgICBAZ2VuZXJhdGluZ0ZvbnRIZWlnaHQgPSBNYXRoLmZsb29yKEBjYW52YXMuaGVpZ2h0ICogMC4wNClcclxuICAgIEBnZW5lcmF0aW5nRm9udCA9IEByZWdpc3RlckZvbnQoXCJnZW5lcmF0aW5nXCIsIFwiI3tAZ2VuZXJhdGluZ0ZvbnRIZWlnaHR9cHggc2F4TW9ubywgbW9ub3NwYWNlXCIpXHJcblxyXG4gICAgQHZpZXdzID1cclxuICAgICAgbWVudTogbmV3IE1lbnVWaWV3KHRoaXMsIEBjYW52YXMpXHJcbiAgICAgIHN1ZG9rdTogbmV3IFN1ZG9rdVZpZXcodGhpcywgQGNhbnZhcylcclxuICAgIEBzd2l0Y2hWaWV3KFwic3Vkb2t1XCIpXHJcblxyXG4gIG1lYXN1cmVGb250czogLT5cclxuICAgIGZvciBmb250TmFtZSwgZiBvZiBAZm9udHNcclxuICAgICAgQGN0eC5mb250ID0gZi5zdHlsZVxyXG4gICAgICBAY3R4LmZpbGxTdHlsZSA9IFwiYmxhY2tcIlxyXG4gICAgICBAY3R4LnRleHRBbGlnbiA9IFwiY2VudGVyXCJcclxuICAgICAgZi5oZWlnaHQgPSBNYXRoLmZsb29yKEBjdHgubWVhc3VyZVRleHQoXCJtXCIpLndpZHRoICogMS4xKSAjIGJlc3QgaGFjayBldmVyXHJcbiAgICAgIGNvbnNvbGUubG9nIFwiRm9udCAje2ZvbnROYW1lfSBtZWFzdXJlZCBhdCAje2YuaGVpZ2h0fSBwaXhlbHNcIlxyXG4gICAgcmV0dXJuXHJcblxyXG4gIHJlZ2lzdGVyRm9udDogKG5hbWUsIHN0eWxlKSAtPlxyXG4gICAgZm9udCA9XHJcbiAgICAgIG5hbWU6IG5hbWVcclxuICAgICAgc3R5bGU6IHN0eWxlXHJcbiAgICAgIGhlaWdodDogMFxyXG4gICAgQGZvbnRzW25hbWVdID0gZm9udFxyXG4gICAgQG1lYXN1cmVGb250cygpXHJcbiAgICByZXR1cm4gZm9udFxyXG5cclxuICBsb2FkRm9udDogKGZvbnROYW1lKSAtPlxyXG4gICAgZm9udCA9IG5ldyBGb250RmFjZU9ic2VydmVyKGZvbnROYW1lKVxyXG4gICAgZm9udC5sb2FkKCkudGhlbiA9PlxyXG4gICAgICBjb25zb2xlLmxvZyhcIiN7Zm9udE5hbWV9IGxvYWRlZCwgcmVkcmF3aW5nLi4uXCIpXHJcbiAgICAgIEBtZWFzdXJlRm9udHMoKVxyXG4gICAgICBAZHJhdygpXHJcblxyXG4gIHN3aXRjaFZpZXc6ICh2aWV3KSAtPlxyXG4gICAgQHZpZXcgPSBAdmlld3Nbdmlld11cclxuICAgIEBkcmF3KClcclxuXHJcbiAgbmV3R2FtZTogKGRpZmZpY3VsdHkpIC0+XHJcbiAgICAjIGNvbnNvbGUubG9nIFwiYXBwLm5ld0dhbWUoI3tkaWZmaWN1bHR5fSlcIlxyXG5cclxuICAgICMgQGRyYXdGaWxsKDAsIDAsIEBjYW52YXMud2lkdGgsIEBjYW52YXMuaGVpZ2h0LCBcIiM0NDQ0NDRcIilcclxuICAgICMgQGRyYXdUZXh0Q2VudGVyZWQoXCJHZW5lcmF0aW5nLCBwbGVhc2Ugd2FpdC4uLlwiLCBAY2FudmFzLndpZHRoIC8gMiwgQGNhbnZhcy5oZWlnaHQgLyAyLCBAZ2VuZXJhdGluZ0ZvbnQsIFwiI2ZmZmZmZlwiKVxyXG5cclxuICAgICMgd2luZG93LnNldFRpbWVvdXQgPT5cclxuICAgIEB2aWV3cy5zdWRva3UubmV3R2FtZShkaWZmaWN1bHR5KVxyXG4gICAgQHN3aXRjaFZpZXcoXCJzdWRva3VcIilcclxuICAgICMgLCAwXHJcblxyXG4gIHJlc2V0OiAtPlxyXG4gICAgQHZpZXdzLnN1ZG9rdS5yZXNldCgpXHJcbiAgICBAc3dpdGNoVmlldyhcInN1ZG9rdVwiKVxyXG5cclxuICBpbXBvcnQ6IChpbXBvcnRTdHJpbmcpIC0+XHJcbiAgICByZXR1cm4gQHZpZXdzLnN1ZG9rdS5pbXBvcnQoaW1wb3J0U3RyaW5nKVxyXG5cclxuICBleHBvcnQ6IC0+XHJcbiAgICByZXR1cm4gQHZpZXdzLnN1ZG9rdS5leHBvcnQoKVxyXG5cclxuICBob2xlQ291bnQ6IC0+XHJcbiAgICByZXR1cm4gQHZpZXdzLnN1ZG9rdS5ob2xlQ291bnQoKVxyXG5cclxuICBkcmF3OiAtPlxyXG4gICAgQHZpZXcuZHJhdygpXHJcblxyXG4gIGNsaWNrOiAoeCwgeSkgLT5cclxuICAgIEB2aWV3LmNsaWNrKHgsIHkpXHJcblxyXG4gIGtleTogKGspIC0+XHJcbiAgICBAdmlldy5rZXkoaylcclxuXHJcbiAgZHJhd0ZpbGw6ICh4LCB5LCB3LCBoLCBjb2xvcikgLT5cclxuICAgIEBjdHguYmVnaW5QYXRoKClcclxuICAgIEBjdHgucmVjdCh4LCB5LCB3LCBoKVxyXG4gICAgQGN0eC5maWxsU3R5bGUgPSBjb2xvclxyXG4gICAgQGN0eC5maWxsKClcclxuXHJcbiAgZHJhd1JvdW5kZWRSZWN0OiAoeCwgeSwgdywgaCwgciwgZmlsbENvbG9yID0gbnVsbCwgc3Ryb2tlQ29sb3IgPSBudWxsKSAtPlxyXG4gICAgQGN0eC5yb3VuZFJlY3QoeCwgeSwgdywgaCwgcilcclxuICAgIGlmIGZpbGxDb2xvciAhPSBudWxsXHJcbiAgICAgIEBjdHguZmlsbFN0eWxlID0gZmlsbENvbG9yXHJcbiAgICAgIEBjdHguZmlsbCgpXHJcbiAgICBpZiBzdHJva2VDb2xvciAhPSBudWxsXHJcbiAgICAgIEBjdHguc3Ryb2tlU3R5bGUgPSBzdHJva2VDb2xvclxyXG4gICAgICBAY3R4LnN0cm9rZSgpXHJcbiAgICByZXR1cm5cclxuXHJcbiAgZHJhd1JlY3Q6ICh4LCB5LCB3LCBoLCBjb2xvciwgbGluZVdpZHRoID0gMSkgLT5cclxuICAgIEBjdHguYmVnaW5QYXRoKClcclxuICAgIEBjdHguc3Ryb2tlU3R5bGUgPSBjb2xvclxyXG4gICAgQGN0eC5saW5lV2lkdGggPSBsaW5lV2lkdGhcclxuICAgIEBjdHgucmVjdCh4LCB5LCB3LCBoKVxyXG4gICAgQGN0eC5zdHJva2UoKVxyXG5cclxuICBkcmF3TGluZTogKHgxLCB5MSwgeDIsIHkyLCBjb2xvciA9IFwiYmxhY2tcIiwgbGluZVdpZHRoID0gMSkgLT5cclxuICAgIEBjdHguYmVnaW5QYXRoKClcclxuICAgIEBjdHguc3Ryb2tlU3R5bGUgPSBjb2xvclxyXG4gICAgQGN0eC5saW5lV2lkdGggPSBsaW5lV2lkdGhcclxuICAgIEBjdHgubGluZUNhcCA9IFwiYnV0dFwiXHJcbiAgICBAY3R4Lm1vdmVUbyh4MSwgeTEpXHJcbiAgICBAY3R4LmxpbmVUbyh4MiwgeTIpXHJcbiAgICBAY3R4LnN0cm9rZSgpXHJcblxyXG4gIGRyYXdUZXh0Q2VudGVyZWQ6ICh0ZXh0LCBjeCwgY3ksIGZvbnQsIGNvbG9yKSAtPlxyXG4gICAgQGN0eC5mb250ID0gZm9udC5zdHlsZVxyXG4gICAgQGN0eC5maWxsU3R5bGUgPSBjb2xvclxyXG4gICAgQGN0eC50ZXh0QWxpZ24gPSBcImNlbnRlclwiXHJcbiAgICBAY3R4LmZpbGxUZXh0KHRleHQsIGN4LCBjeSArIChmb250LmhlaWdodCAvIDIpKVxyXG5cclxuICBkcmF3TG93ZXJMZWZ0OiAodGV4dCwgY29sb3IgPSBcIndoaXRlXCIpIC0+XHJcbiAgICBAY3R4ID0gQGNhbnZhcy5nZXRDb250ZXh0KFwiMmRcIilcclxuICAgIEBjdHguZm9udCA9IEB2ZXJzaW9uRm9udC5zdHlsZVxyXG4gICAgQGN0eC5maWxsU3R5bGUgPSBjb2xvclxyXG4gICAgQGN0eC50ZXh0QWxpZ24gPSBcImxlZnRcIlxyXG4gICAgQGN0eC5maWxsVGV4dCh0ZXh0LCAwLCBAY2FudmFzLmhlaWdodCAtIChAdmVyc2lvbkZvbnQuaGVpZ2h0IC8gMikpXHJcblxyXG4gIGRyYXdWZXJzaW9uOiAoY29sb3IgPSBcIndoaXRlXCIpIC0+XHJcbiAgICBAY3R4ID0gQGNhbnZhcy5nZXRDb250ZXh0KFwiMmRcIilcclxuICAgIEBjdHguZm9udCA9IEB2ZXJzaW9uRm9udC5zdHlsZVxyXG4gICAgQGN0eC5maWxsU3R5bGUgPSBjb2xvclxyXG4gICAgQGN0eC50ZXh0QWxpZ24gPSBcInJpZ2h0XCJcclxuICAgIEBjdHguZmlsbFRleHQoXCJ2I3t2ZXJzaW9ufVwiLCBAY2FudmFzLndpZHRoIC0gKEB2ZXJzaW9uRm9udC5oZWlnaHQgLyAyKSwgQGNhbnZhcy5oZWlnaHQgLSAoQHZlcnNpb25Gb250LmhlaWdodCAvIDIpKVxyXG5cclxuICBkcmF3QXJjOiAoeDEsIHkxLCB4MiwgeTIsIHJhZGl1cywgY29sb3IsIGxpbmVXaWR0aCkgLT5cclxuICAgICMgRGVyaXZlZCBmcm9tIGh0dHBzOi8vZ2l0aHViLmNvbS9qYW1ib2xvL2RyYXdBcmMgYXQgNmMzZTBkM1xyXG5cclxuICAgIFAxID0geyB4OiB4MSwgeTogeTEgfVxyXG4gICAgUDIgPSB7IHg6IHgyLCB5OiB5MiB9XHJcblxyXG4gICAgIyBEZXRlcm1pbmUgdGhlIG1pZHBvaW50IChNKSBmcm9tIFAxIHRvIFAyXHJcbiAgICBNID1cclxuICAgICAgeDogKFAxLnggKyBQMi54KSAvIDJcclxuICAgICAgeTogKFAxLnkgKyBQMi55KSAvIDJcclxuXHJcbiAgICAjIERldGVybWluZSB0aGUgZGlzdGFuY2UgZnJvbSBNIHRvIFAxXHJcbiAgICBkTVAxID0gTWF0aC5zcXJ0KChQMS54IC0gTS54KSAqIChQMS54IC0gTS54KSArIChQMS55IC0gTS55KSAqIChQMS55IC0gTS55KSlcclxuXHJcbiAgICAjIFZhbGlkYXRlIHRoZSByYWRpdXNcclxuICAgIGlmIG5vdCByYWRpdXM/IG9yIHJhZGl1cyA8IGRNUDFcclxuICAgICAgcmFkaXVzID0gZE1QMVxyXG5cclxuICAgICMgRGV0ZXJtaW5lIHRoZSB1bml0IHZlY3RvciBmcm9tIE0gdG8gUDFcclxuICAgIHVNUDEgPVxyXG4gICAgICB4OiAoUDEueCAtIE0ueCkgLyBkTVAxXHJcbiAgICAgIHk6IChQMS55IC0gTS55KSAvIGRNUDFcclxuXHJcbiAgICAjIERldGVybWluZSB0aGUgdW5pdCB2ZWN0b3IgZnJvbSBNIHRvIFEgKGp1c3QgdU1QMSByb3RhdGVkIHBpLzIpXHJcbiAgICB1TVEgPSB7IHg6IC11TVAxLnksIHk6IHVNUDEueCB9XHJcblxyXG4gICAgIyBEZXRlcm1pbmUgdGhlIGRpc3RhbmNlIGZyb20gdGhlIGNlbnRlciBvZiB0aGUgY2lyY2xlIChDKSB0byBNXHJcbiAgICBkQ00gPSBNYXRoLnNxcnQocmFkaXVzICogcmFkaXVzIC0gZE1QMSAqIGRNUDEpXHJcblxyXG4gICAgIyBEZXRlcm1pbmUgdGhlIGRpc3RhbmNlIGZyb20gTSB0byBRXHJcbiAgICBkTVEgPSBkTVAxICogZE1QMSAvIGRDTVxyXG5cclxuICAgICMgRGV0ZXJtaW5lIHRoZSBsb2NhdGlvbiBvZiBRXHJcbiAgICBRID1cclxuICAgICAgeDogTS54ICsgdU1RLnggKiBkTVFcclxuICAgICAgeTogTS55ICsgdU1RLnkgKiBkTVFcclxuXHJcbiAgICBAY3R4LmJlZ2luUGF0aCgpXHJcbiAgICBAY3R4LnN0cm9rZVN0eWxlID0gY29sb3JcclxuICAgIEBjdHgubGluZVdpZHRoID0gbGluZVdpZHRoXHJcbiAgICBAY3R4LmxpbmVDYXAgPSBcInJvdW5kXCJcclxuICAgIEBjdHgubW92ZVRvKHgxLCB5MSlcclxuICAgIEBjdHguYXJjVG8oUS54LCBRLnksIHgyLCB5MiwgcmFkaXVzKVxyXG4gICAgQGN0eC5zdHJva2UoKVxyXG4gICAgcmV0dXJuXHJcblxyXG4gIGRyYXdQb2ludDogKHgsIHksIHIsIGNvbG9yKSAtPlxyXG4gICAgQGN0eC5iZWdpblBhdGgoKVxyXG4gICAgQGN0eC5maWxsU3R5bGUgPSBjb2xvclxyXG4gICAgQGN0eC5hcmMoeCwgeSwgciwgMCwgMiAqIE1hdGguUEkpXHJcbiAgICBAY3R4LmZpbGwoKVxyXG4gICAgcmV0dXJuXHJcblxyXG5DYW52YXNSZW5kZXJpbmdDb250ZXh0MkQucHJvdG90eXBlLnJvdW5kUmVjdCA9ICh4LCB5LCB3LCBoLCByKSAtPlxyXG4gIGlmICh3IDwgMiAqIHIpIHRoZW4gciA9IHcgLyAyXHJcbiAgaWYgKGggPCAyICogcikgdGhlbiByID0gaCAvIDJcclxuICBAYmVnaW5QYXRoKClcclxuICBAbW92ZVRvKHggKyByLCB5KVxyXG4gIEBhcmNUbyh4ICsgdywgeSwgICAgIHggKyB3LCB5ICsgaCwgcilcclxuICBAYXJjVG8oeCArIHcsIHkgKyBoLCB4LCAgICAgeSArIGgsIHIpXHJcbiAgQGFyY1RvKHgsICAgICB5ICsgaCwgeCwgICAgIHksICAgICByKVxyXG4gIEBhcmNUbyh4LCAgICAgeSwgICAgIHggKyB3LCB5LCAgICAgcilcclxuICBAY2xvc2VQYXRoKClcclxuICByZXR1cm4gdGhpc1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBBcHBcclxuIiwiU3Vkb2t1R2VuZXJhdG9yID0gcmVxdWlyZSAnLi9TdWRva3VHZW5lcmF0b3InXHJcblxyXG5CVVRUT05fSEVJR0hUID0gMC4wNlxyXG5GSVJTVF9CVVRUT05fWSA9IDAuMjJcclxuQlVUVE9OX1NQQUNJTkcgPSAwLjA4XHJcbkJVVFRPTl9TRVBBUkFUT1IgPSAwLjAzXHJcblxyXG5idXR0b25Qb3MgPSAoaW5kZXgpIC0+XHJcbiAgeSA9IEZJUlNUX0JVVFRPTl9ZICsgKEJVVFRPTl9TUEFDSU5HICogaW5kZXgpXHJcbiAgaWYgaW5kZXggPiAzXHJcbiAgICB5ICs9IEJVVFRPTl9TRVBBUkFUT1JcclxuICBpZiBpbmRleCA+IDRcclxuICAgIHkgKz0gQlVUVE9OX1NFUEFSQVRPUlxyXG4gIGlmIGluZGV4ID4gNlxyXG4gICAgeSArPSBCVVRUT05fU0VQQVJBVE9SXHJcbiAgcmV0dXJuIHlcclxuXHJcbmNsYXNzIE1lbnVWaWV3XHJcbiAgY29uc3RydWN0b3I6IChAYXBwLCBAY2FudmFzKSAtPlxyXG4gICAgQGJ1dHRvbnMgPVxyXG4gICAgICBuZXdFYXN5OlxyXG4gICAgICAgIHk6IGJ1dHRvblBvcygwKVxyXG4gICAgICAgIHRleHQ6IFwiTmV3IEdhbWU6IEVhc3lcIlxyXG4gICAgICAgIGJnQ29sb3I6IFwiIzMzNzczM1wiXHJcbiAgICAgICAgdGV4dENvbG9yOiBcIiNmZmZmZmZcIlxyXG4gICAgICAgIGNsaWNrOiBAbmV3RWFzeS5iaW5kKHRoaXMpXHJcbiAgICAgIG5ld01lZGl1bTpcclxuICAgICAgICB5OiBidXR0b25Qb3MoMSlcclxuICAgICAgICB0ZXh0OiBcIk5ldyBHYW1lOiBNZWRpdW1cIlxyXG4gICAgICAgIGJnQ29sb3I6IFwiIzc3NzczM1wiXHJcbiAgICAgICAgdGV4dENvbG9yOiBcIiNmZmZmZmZcIlxyXG4gICAgICAgIGNsaWNrOiBAbmV3TWVkaXVtLmJpbmQodGhpcylcclxuICAgICAgbmV3SGFyZDpcclxuICAgICAgICB5OiBidXR0b25Qb3MoMilcclxuICAgICAgICB0ZXh0OiBcIk5ldyBHYW1lOiBIYXJkXCJcclxuICAgICAgICBiZ0NvbG9yOiBcIiM3NzMzMzNcIlxyXG4gICAgICAgIHRleHRDb2xvcjogXCIjZmZmZmZmXCJcclxuICAgICAgICBjbGljazogQG5ld0hhcmQuYmluZCh0aGlzKVxyXG4gICAgICBuZXdFeHRyZW1lOlxyXG4gICAgICAgIHk6IGJ1dHRvblBvcygzKVxyXG4gICAgICAgIHRleHQ6IFwiTmV3IEdhbWU6IEV4dHJlbWVcIlxyXG4gICAgICAgIGJnQ29sb3I6IFwiIzc3MTExMVwiXHJcbiAgICAgICAgdGV4dENvbG9yOiBcIiNmZmZmZmZcIlxyXG4gICAgICAgIGNsaWNrOiBAbmV3RXh0cmVtZS5iaW5kKHRoaXMpXHJcbiAgICAgIHJlc2V0OlxyXG4gICAgICAgIHk6IGJ1dHRvblBvcyg0KVxyXG4gICAgICAgIHRleHQ6IFwiUmVzZXQgUHV6emxlXCJcclxuICAgICAgICBiZ0NvbG9yOiBcIiM3NzMzNzdcIlxyXG4gICAgICAgIHRleHRDb2xvcjogXCIjZmZmZmZmXCJcclxuICAgICAgICBjbGljazogQHJlc2V0LmJpbmQodGhpcylcclxuICAgICAgaW1wb3J0OlxyXG4gICAgICAgIHk6IGJ1dHRvblBvcyg1KVxyXG4gICAgICAgIHRleHQ6IFwiTG9hZCBQdXp6bGVcIlxyXG4gICAgICAgIGJnQ29sb3I6IFwiIzMzNjY2NlwiXHJcbiAgICAgICAgdGV4dENvbG9yOiBcIiNmZmZmZmZcIlxyXG4gICAgICAgIGNsaWNrOiBAaW1wb3J0LmJpbmQodGhpcylcclxuICAgICAgZXhwb3J0OlxyXG4gICAgICAgIHk6IGJ1dHRvblBvcyg2KVxyXG4gICAgICAgIHRleHQ6IFwiU2hhcmUgUHV6emxlXCJcclxuICAgICAgICBiZ0NvbG9yOiBcIiMzMzY2NjZcIlxyXG4gICAgICAgIHRleHRDb2xvcjogXCIjZmZmZmZmXCJcclxuICAgICAgICBjbGljazogQGV4cG9ydC5iaW5kKHRoaXMpXHJcbiAgICAgIHJlc3VtZTpcclxuICAgICAgICB5OiBidXR0b25Qb3MoNylcclxuICAgICAgICB0ZXh0OiBcIlJlc3VtZVwiXHJcbiAgICAgICAgYmdDb2xvcjogXCIjNzc3Nzc3XCJcclxuICAgICAgICB0ZXh0Q29sb3I6IFwiI2ZmZmZmZlwiXHJcbiAgICAgICAgY2xpY2s6IEByZXN1bWUuYmluZCh0aGlzKVxyXG5cclxuICAgIGJ1dHRvbldpZHRoID0gQGNhbnZhcy53aWR0aCAqIDAuOFxyXG4gICAgQGJ1dHRvbkhlaWdodCA9IEBjYW52YXMuaGVpZ2h0ICogQlVUVE9OX0hFSUdIVFxyXG4gICAgYnV0dG9uWCA9IChAY2FudmFzLndpZHRoIC0gYnV0dG9uV2lkdGgpIC8gMlxyXG4gICAgZm9yIGJ1dHRvbk5hbWUsIGJ1dHRvbiBvZiBAYnV0dG9uc1xyXG4gICAgICBidXR0b24ueCA9IGJ1dHRvblhcclxuICAgICAgYnV0dG9uLnkgPSBAY2FudmFzLmhlaWdodCAqIGJ1dHRvbi55XHJcbiAgICAgIGJ1dHRvbi53ID0gYnV0dG9uV2lkdGhcclxuICAgICAgYnV0dG9uLmggPSBAYnV0dG9uSGVpZ2h0XHJcblxyXG4gICAgYnV0dG9uRm9udEhlaWdodCA9IE1hdGguZmxvb3IoQGJ1dHRvbkhlaWdodCAqIDAuNClcclxuICAgIEBidXR0b25Gb250ID0gQGFwcC5yZWdpc3RlckZvbnQoXCJidXR0b25cIiwgXCIje2J1dHRvbkZvbnRIZWlnaHR9cHggc2F4TW9ubywgbW9ub3NwYWNlXCIpXHJcbiAgICB0aXRsZUZvbnRIZWlnaHQgPSBNYXRoLmZsb29yKEBjYW52YXMuaGVpZ2h0ICogMC4wNilcclxuICAgIEB0aXRsZUZvbnQgPSBAYXBwLnJlZ2lzdGVyRm9udChcImJ1dHRvblwiLCBcIiN7dGl0bGVGb250SGVpZ2h0fXB4IHNheE1vbm8sIG1vbm9zcGFjZVwiKVxyXG4gICAgc3VidGl0bGVGb250SGVpZ2h0ID0gTWF0aC5mbG9vcihAY2FudmFzLmhlaWdodCAqIDAuMDIpXHJcbiAgICBAc3VidGl0bGVGb250ID0gQGFwcC5yZWdpc3RlckZvbnQoXCJidXR0b25cIiwgXCIje3N1YnRpdGxlRm9udEhlaWdodH1weCBzYXhNb25vLCBtb25vc3BhY2VcIilcclxuICAgIHJldHVyblxyXG5cclxuICBkcmF3OiAtPlxyXG4gICAgQGFwcC5kcmF3RmlsbCgwLCAwLCBAY2FudmFzLndpZHRoLCBAY2FudmFzLmhlaWdodCwgXCIjMzMzMzMzXCIpXHJcblxyXG4gICAgeCA9IEBjYW52YXMud2lkdGggLyAyXHJcbiAgICBzaGFkb3dPZmZzZXQgPSBAY2FudmFzLmhlaWdodCAqIDAuMDA1XHJcblxyXG4gICAgeTEgPSBAY2FudmFzLmhlaWdodCAqIDAuMDVcclxuICAgIHkyID0geTEgKyBAY2FudmFzLmhlaWdodCAqIDAuMDZcclxuICAgIHkzID0geTIgKyBAY2FudmFzLmhlaWdodCAqIDAuMDZcclxuICAgIEBhcHAuZHJhd1RleHRDZW50ZXJlZChcIkJhZCBHdXlcIiwgeCArIHNoYWRvd09mZnNldCwgeTEgKyBzaGFkb3dPZmZzZXQsIEB0aXRsZUZvbnQsIFwiIzAwMDAwMFwiKVxyXG4gICAgQGFwcC5kcmF3VGV4dENlbnRlcmVkKFwiU3Vkb2t1XCIsIHggKyBzaGFkb3dPZmZzZXQsIHkyICsgc2hhZG93T2Zmc2V0LCBAdGl0bGVGb250LCBcIiMwMDAwMDBcIilcclxuICAgIEBhcHAuZHJhd1RleHRDZW50ZXJlZChcIkJhZCBHdXlcIiwgeCwgeTEsIEB0aXRsZUZvbnQsIFwiI2ZmZmZmZlwiKVxyXG4gICAgQGFwcC5kcmF3VGV4dENlbnRlcmVkKFwiU3Vkb2t1XCIsIHgsIHkyLCBAdGl0bGVGb250LCBcIiNmZmZmZmZcIilcclxuICAgIEBhcHAuZHJhd1RleHRDZW50ZXJlZChcIkl0J3MgbGlrZSBTdWRva3UsIGJ1dCB5b3UgYXJlIHRoZSBiYWQgZ3V5LlwiLCB4LCB5MywgQHN1YnRpdGxlRm9udCwgXCIjZmZmZmZmXCIpXHJcblxyXG4gICAgZm9yIGJ1dHRvbk5hbWUsIGJ1dHRvbiBvZiBAYnV0dG9uc1xyXG4gICAgICBAYXBwLmRyYXdSb3VuZGVkUmVjdChidXR0b24ueCArIHNoYWRvd09mZnNldCwgYnV0dG9uLnkgKyBzaGFkb3dPZmZzZXQsIGJ1dHRvbi53LCBidXR0b24uaCwgYnV0dG9uLmggKiAwLjMsIFwiYmxhY2tcIiwgXCJibGFja1wiKVxyXG4gICAgICBAYXBwLmRyYXdSb3VuZGVkUmVjdChidXR0b24ueCwgYnV0dG9uLnksIGJ1dHRvbi53LCBidXR0b24uaCwgYnV0dG9uLmggKiAwLjMsIGJ1dHRvbi5iZ0NvbG9yLCBcIiM5OTk5OTlcIilcclxuICAgICAgQGFwcC5kcmF3VGV4dENlbnRlcmVkKGJ1dHRvbi50ZXh0LCBidXR0b24ueCArIChidXR0b24udyAvIDIpLCBidXR0b24ueSArIChidXR0b24uaCAvIDIpLCBAYnV0dG9uRm9udCwgYnV0dG9uLnRleHRDb2xvcilcclxuXHJcbiAgICBAYXBwLmRyYXdMb3dlckxlZnQoXCIje0BhcHAuaG9sZUNvdW50KCl9LzgxXCIpXHJcbiAgICBAYXBwLmRyYXdWZXJzaW9uKClcclxuXHJcbiAgY2xpY2s6ICh4LCB5KSAtPlxyXG4gICAgZm9yIGJ1dHRvbk5hbWUsIGJ1dHRvbiBvZiBAYnV0dG9uc1xyXG4gICAgICBpZiAoeSA+IGJ1dHRvbi55KSAmJiAoeSA8IChidXR0b24ueSArIEBidXR0b25IZWlnaHQpKVxyXG4gICAgICAgICMgY29uc29sZS5sb2cgXCJidXR0b24gcHJlc3NlZDogI3tidXR0b25OYW1lfVwiXHJcbiAgICAgICAgYnV0dG9uLmNsaWNrKClcclxuICAgIHJldHVyblxyXG5cclxuICBuZXdFYXN5OiAtPlxyXG4gICAgQGFwcC5uZXdHYW1lKFN1ZG9rdUdlbmVyYXRvci5kaWZmaWN1bHR5LmVhc3kpXHJcblxyXG4gIG5ld01lZGl1bTogLT5cclxuICAgIEBhcHAubmV3R2FtZShTdWRva3VHZW5lcmF0b3IuZGlmZmljdWx0eS5tZWRpdW0pXHJcblxyXG4gIG5ld0hhcmQ6IC0+XHJcbiAgICBAYXBwLm5ld0dhbWUoU3Vkb2t1R2VuZXJhdG9yLmRpZmZpY3VsdHkuaGFyZClcclxuXHJcbiAgbmV3RXh0cmVtZTogLT5cclxuICAgIEBhcHAubmV3R2FtZShTdWRva3VHZW5lcmF0b3IuZGlmZmljdWx0eS5leHRyZW1lKVxyXG5cclxuICByZXNldDogLT5cclxuICAgIEBhcHAucmVzZXQoKVxyXG5cclxuICByZXN1bWU6IC0+XHJcbiAgICBAYXBwLnN3aXRjaFZpZXcoXCJzdWRva3VcIilcclxuXHJcbiAgZXhwb3J0OiAtPlxyXG4gICAgaWYgbmF2aWdhdG9yLnNoYXJlICE9IHVuZGVmaW5lZFxyXG4gICAgICBuYXZpZ2F0b3Iuc2hhcmUge1xyXG4gICAgICAgIHRpdGxlOiBcIlN1ZG9rdSBTaGFyZWQgR2FtZVwiXHJcbiAgICAgICAgdGV4dDogQGFwcC5leHBvcnQoKVxyXG4gICAgICB9XHJcbiAgICAgIHJldHVyblxyXG4gICAgd2luZG93LnByb21wdChcIkNvcHkgdGhpcyBhbmQgcGFzdGUgdG8gYSBmcmllbmQ6XCIsIEBhcHAuZXhwb3J0KCkpXHJcblxyXG4gIGltcG9ydDogLT5cclxuICAgIGltcG9ydFN0cmluZyA9IHdpbmRvdy5wcm9tcHQoXCJQYXN0ZSBhbiBleHBvcnRlZCBnYW1lIGhlcmU6XCIsIFwiXCIpXHJcbiAgICBsb29wXHJcbiAgICAgIGlmIGltcG9ydFN0cmluZyA9PSBudWxsXHJcbiAgICAgICAgcmV0dXJuXHJcbiAgICAgIGlmIEBhcHAuaW1wb3J0KGltcG9ydFN0cmluZylcclxuICAgICAgICBAYXBwLnN3aXRjaFZpZXcoXCJzdWRva3VcIilcclxuICAgICAgICByZXR1cm5cclxuICAgICAgaW1wb3J0U3RyaW5nID0gd2luZG93LnByb21wdChcIkludmFsaWQgZ2FtZSwgdHJ5IGFnYWluOlwiLCBcIlwiKVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBNZW51Vmlld1xyXG4iLCJTdWRva3VHZW5lcmF0b3IgPSByZXF1aXJlICcuL1N1ZG9rdUdlbmVyYXRvcidcclxuXHJcbiMgUmV0dXJucyB0aGUgaW5kZXggb2YgYSBjZWxsIGluIHJvdyBtYWpvciBvcmRlciAodGhvdWdoIHRoZXkgYXJlIHN0b3JlZCBpbiBjb2x1bW4gbWFqb3Igb3JkZXIpXHJcbmNlbGxJbmRleCA9ICh4LCB5KSAtPiB5ICogOSArIHhcclxuXHJcbiMgU29ydCBieSBhc2NlbmRpbmcgbG9jYXRpb24gYW5kIHRoZW4gYnkgc3RyZW5ndGggKHN0cm9uZyB0aGVuIHdlYWspXHJcbmFzY2VuZGluZ0xpbmtTb3J0ID0gKGEsIGIpIC0+XHJcbiAgYTAgPSBjZWxsSW5kZXgoYS5jZWxsc1swXS54LCBhLmNlbGxzWzBdLnkpXHJcbiAgYTEgPSBjZWxsSW5kZXgoYS5jZWxsc1sxXS54LCBhLmNlbGxzWzFdLnkpXHJcbiAgYjAgPSBjZWxsSW5kZXgoYi5jZWxsc1swXS54LCBiLmNlbGxzWzBdLnkpXHJcbiAgYjEgPSBjZWxsSW5kZXgoYi5jZWxsc1sxXS54LCBiLmNlbGxzWzFdLnkpXHJcbiAgcmV0dXJuIGlmIGEwID4gYjAgb3IgKGEwID09IGIwIGFuZCAoYTEgPiBiMSBvciAoYTEgPT0gYjEgYW5kIChub3QgYS5zdHJvbmc/IGFuZCBiLnN0cm9uZz8pKSkpIHRoZW4gMSBlbHNlIC0xXHJcblxyXG4jIE5vdGUgc3RyZW5ndGggaXMgbm90IGNvbXBhcmVkXHJcbnVuaXF1ZUxpbmtGaWx0ZXIgPSAoZSwgaSwgYSkgLT5cclxuICBpZiBpID09IDBcclxuICAgIHJldHVybiB0cnVlXHJcbiAgcCA9IGFbaSAtIDFdXHJcbiAgZTAgPSBjZWxsSW5kZXgoZS5jZWxsc1swXS54LCBlLmNlbGxzWzBdLnkpXHJcbiAgZTEgPSBjZWxsSW5kZXgoZS5jZWxsc1sxXS54LCBlLmNlbGxzWzFdLnkpXHJcbiAgcDAgPSBjZWxsSW5kZXgocC5jZWxsc1swXS54LCBwLmNlbGxzWzBdLnkpXHJcbiAgcDEgPSBjZWxsSW5kZXgocC5jZWxsc1sxXS54LCBwLmNlbGxzWzFdLnkpXHJcbiAgcmV0dXJuIGUwICE9IHAwIG9yIGUxICE9IHAxXHJcblxyXG5nZW5lcmF0ZUxpbmtQZXJtdXRhdGlvbnMgPSAoY2VsbHMpIC0+XHJcbiAgbGlua3MgPSBbXVxyXG4gIGNvdW50ID0gY2VsbHMubGVuZ3RoXHJcbiAgZm9yIGkgaW4gWzAuLi5jb3VudCAtIDFdXHJcbiAgICBmb3IgaiBpbiBbaSArIDEuLi5jb3VudF1cclxuICAgICAgbGlua3MucHVzaCh7IGNlbGxzOiBbY2VsbHNbaV0sIGNlbGxzW2pdXSB9KVxyXG4gIHJldHVybiBsaW5rc1xyXG5cclxuY2xhc3MgU3Vkb2t1R2FtZVxyXG4gIGNvbnN0cnVjdG9yOiAtPlxyXG4gICAgQGNsZWFyKClcclxuICAgIGlmIG5vdCBAbG9hZCgpXHJcbiAgICAgIEBuZXdHYW1lKFN1ZG9rdUdlbmVyYXRvci5kaWZmaWN1bHR5LmVhc3kpXHJcbiAgICByZXR1cm5cclxuXHJcbiAgY2xlYXI6IC0+XHJcbiAgICBAZ3JpZCA9IG5ldyBBcnJheSg5KS5maWxsKG51bGwpXHJcbiAgICBmb3IgaSBpbiBbMC4uLjldXHJcbiAgICAgIEBncmlkW2ldID0gbmV3IEFycmF5KDkpLmZpbGwobnVsbClcclxuICAgIGZvciBqIGluIFswLi4uOV1cclxuICAgICAgZm9yIGkgaW4gWzAuLi45XVxyXG4gICAgICAgIEBncmlkW2ldW2pdID1cclxuICAgICAgICAgIHZhbHVlOiAwXHJcbiAgICAgICAgICBlcnJvcjogZmFsc2VcclxuICAgICAgICAgIGxvY2tlZDogZmFsc2VcclxuICAgICAgICAgIHBlbmNpbDogbmV3IEFycmF5KDkpLmZpbGwoZmFsc2UpXHJcblxyXG4gICAgQHNvbHZlZCA9IGZhbHNlXHJcbiAgICBAdW5kb0pvdXJuYWwgPSBbXVxyXG4gICAgQHJlZG9Kb3VybmFsID0gW11cclxuXHJcbiAgaG9sZUNvdW50OiAtPlxyXG4gICAgY291bnQgPSAwXHJcbiAgICBmb3IgaiBpbiBbMC4uLjldXHJcbiAgICAgIGZvciBpIGluIFswLi4uOV1cclxuICAgICAgICBpZiBub3QgQGdyaWRbaV1bal0ubG9ja2VkXHJcbiAgICAgICAgICBjb3VudCArPSAxXHJcbiAgICByZXR1cm4gY291bnRcclxuXHJcbiAgZXhwb3J0OiAtPlxyXG4gICAgZXhwb3J0U3RyaW5nID0gXCJTRFwiXHJcbiAgICBmb3IgaiBpbiBbMC4uLjldXHJcbiAgICAgIGZvciBpIGluIFswLi4uOV1cclxuICAgICAgICBpZiBAZ3JpZFtpXVtqXS5sb2NrZWRcclxuICAgICAgICAgIGV4cG9ydFN0cmluZyArPSBcIiN7QGdyaWRbaV1bal0udmFsdWV9XCJcclxuICAgICAgICBlbHNlXHJcbiAgICAgICAgICBleHBvcnRTdHJpbmcgKz0gXCIwXCJcclxuICAgIHJldHVybiBleHBvcnRTdHJpbmdcclxuXHJcbiAgdmFsaWRhdGU6IC0+XHJcbiAgICBib2FyZCA9IG5ldyBBcnJheSg5KS5maWxsKG51bGwpXHJcbiAgICBmb3IgaSBpbiBbMC4uLjldXHJcbiAgICAgIGJvYXJkW2ldID0gbmV3IEFycmF5KDkpLmZpbGwoMClcclxuICAgICAgZm9yIGogaW4gWzAuLi45XVxyXG4gICAgICAgIGJvYXJkW2ldW2pdID0gQGdyaWRbaV1bal0udmFsdWVcclxuXHJcbiAgICBnZW5lcmF0b3IgPSBuZXcgU3Vkb2t1R2VuZXJhdG9yXHJcbiAgICByZXR1cm4gZ2VuZXJhdG9yLnZhbGlkYXRlR3JpZChib2FyZClcclxuXHJcbiAgaW1wb3J0OiAoaW1wb3J0U3RyaW5nKSAtPlxyXG4gICAgaWYgaW1wb3J0U3RyaW5nLmluZGV4T2YoXCJTRFwiKSAhPSAwXHJcbiAgICAgIHJldHVybiBmYWxzZVxyXG4gICAgaW1wb3J0U3RyaW5nID0gaW1wb3J0U3RyaW5nLnN1YnN0cigyKVxyXG4gICAgaW1wb3J0U3RyaW5nID0gaW1wb3J0U3RyaW5nLnJlcGxhY2UoL1teMC05XS9nLCBcIlwiKVxyXG4gICAgaWYgaW1wb3J0U3RyaW5nLmxlbmd0aCAhPSA4MVxyXG4gICAgICByZXR1cm4gZmFsc2VcclxuXHJcbiAgICBAY2xlYXIoKVxyXG5cclxuICAgIGluZGV4ID0gMFxyXG4gICAgemVyb0NoYXJDb2RlID0gXCIwXCIuY2hhckNvZGVBdCgwKVxyXG4gICAgZm9yIGogaW4gWzAuLi45XVxyXG4gICAgICBmb3IgaSBpbiBbMC4uLjldXHJcbiAgICAgICAgdiA9IGltcG9ydFN0cmluZy5jaGFyQ29kZUF0KGluZGV4KSAtIHplcm9DaGFyQ29kZVxyXG4gICAgICAgIGluZGV4ICs9IDFcclxuICAgICAgICBpZiB2ID4gMFxyXG4gICAgICAgICAgQGdyaWRbaV1bal0ubG9ja2VkID0gdHJ1ZVxyXG4gICAgICAgICAgQGdyaWRbaV1bal0udmFsdWUgPSB2XHJcblxyXG4gICAgcmV0dXJuIGZhbHNlIGlmIG5vdCBAdmFsaWRhdGUoKVxyXG5cclxuICAgIEB1cGRhdGVDZWxscygpXHJcbiAgICBAc2F2ZSgpXHJcbiAgICByZXR1cm4gdHJ1ZVxyXG5cclxuICB1cGRhdGVDZWxsOiAoeCwgeSkgLT5cclxuICAgIGNlbGwgPSBAZ3JpZFt4XVt5XVxyXG5cclxuICAgIGZvciBpIGluIFswLi4uOV1cclxuICAgICAgaWYgeCAhPSBpXHJcbiAgICAgICAgdiA9IEBncmlkW2ldW3ldLnZhbHVlXHJcbiAgICAgICAgaWYgdiA+IDBcclxuICAgICAgICAgIGlmIHYgPT0gY2VsbC52YWx1ZVxyXG4gICAgICAgICAgICBAZ3JpZFtpXVt5XS5lcnJvciA9IHRydWVcclxuICAgICAgICAgICAgY2VsbC5lcnJvciA9IHRydWVcclxuXHJcbiAgICAgIGlmIHkgIT0gaVxyXG4gICAgICAgIHYgPSBAZ3JpZFt4XVtpXS52YWx1ZVxyXG4gICAgICAgIGlmIHYgPiAwXHJcbiAgICAgICAgICBpZiB2ID09IGNlbGwudmFsdWVcclxuICAgICAgICAgICAgQGdyaWRbeF1baV0uZXJyb3IgPSB0cnVlXHJcbiAgICAgICAgICAgIGNlbGwuZXJyb3IgPSB0cnVlXHJcblxyXG4gICAgc3ggPSBNYXRoLmZsb29yKHggLyAzKSAqIDNcclxuICAgIHN5ID0gTWF0aC5mbG9vcih5IC8gMykgKiAzXHJcbiAgICBmb3IgaiBpbiBbMC4uLjNdXHJcbiAgICAgIGZvciBpIGluIFswLi4uM11cclxuICAgICAgICBpZiAoeCAhPSAoc3ggKyBpKSkgJiYgKHkgIT0gKHN5ICsgaikpXHJcbiAgICAgICAgICB2ID0gQGdyaWRbc3ggKyBpXVtzeSArIGpdLnZhbHVlXHJcbiAgICAgICAgICBpZiB2ID4gMFxyXG4gICAgICAgICAgICBpZiB2ID09IGNlbGwudmFsdWVcclxuICAgICAgICAgICAgICBAZ3JpZFtzeCArIGldW3N5ICsgal0uZXJyb3IgPSB0cnVlXHJcbiAgICAgICAgICAgICAgY2VsbC5lcnJvciA9IHRydWVcclxuICAgIHJldHVyblxyXG5cclxuICB1cGRhdGVDZWxsczogLT5cclxuICAgIGZvciBqIGluIFswLi4uOV1cclxuICAgICAgZm9yIGkgaW4gWzAuLi45XVxyXG4gICAgICAgIEBncmlkW2ldW2pdLmVycm9yID0gZmFsc2VcclxuXHJcbiAgICBmb3IgaiBpbiBbMC4uLjldXHJcbiAgICAgIGZvciBpIGluIFswLi4uOV1cclxuICAgICAgICBAdXBkYXRlQ2VsbChpLCBqKVxyXG5cclxuICAgIEBzb2x2ZWQgPSB0cnVlXHJcbiAgICBmb3IgaiBpbiBbMC4uLjldXHJcbiAgICAgIGZvciBpIGluIFswLi4uOV1cclxuICAgICAgICBpZiBAZ3JpZFtpXVtqXS5lcnJvclxyXG4gICAgICAgICAgQHNvbHZlZCA9IGZhbHNlXHJcbiAgICAgICAgaWYgQGdyaWRbaV1bal0udmFsdWUgPT0gMFxyXG4gICAgICAgICAgQHNvbHZlZCA9IGZhbHNlXHJcblxyXG4gICAgIyBpZiBAc29sdmVkXHJcbiAgICAjICAgY29uc29sZS5sb2cgXCJzb2x2ZWQgI3tAc29sdmVkfVwiXHJcblxyXG4gICAgcmV0dXJuIEBzb2x2ZWRcclxuXHJcbiAgZG9uZTogLT5cclxuICAgIGQgPSBuZXcgQXJyYXkoOSkuZmlsbChmYWxzZSlcclxuICAgIGNvdW50cyA9IG5ldyBBcnJheSg5KS5maWxsKDApXHJcbiAgICBmb3IgaiBpbiBbMC4uLjldXHJcbiAgICAgIGZvciBpIGluIFswLi4uOV1cclxuICAgICAgICBpZiBAZ3JpZFtpXVtqXS52YWx1ZSAhPSAwXHJcbiAgICAgICAgICBjb3VudHNbQGdyaWRbaV1bal0udmFsdWUgLSAxXSArPSAxXHJcblxyXG4gICAgZm9yIGkgaW4gWzAuLi45XVxyXG4gICAgICBpZiBjb3VudHNbaV0gPT0gOVxyXG4gICAgICAgIGRbaV0gPSB0cnVlXHJcbiAgICByZXR1cm4gZFxyXG5cclxuICBwZW5jaWxNYXJrczogKHgsIHkpIC0+XHJcbiAgICBjZWxsID0gQGdyaWRbeF1beV1cclxuICAgIG1hcmtzID0gW11cclxuICAgIGZvciBpIGluIFswLi4uOV1cclxuICAgICAgaWYgY2VsbC5wZW5jaWxbaV1cclxuICAgICAgICBtYXJrcy5wdXNoIGkgKyAxXHJcbiAgICByZXR1cm4gbWFya3NcclxuXHJcbiAgZG86IChhY3Rpb24sIHgsIHksIHZhbHVlcywgam91cm5hbCkgLT5cclxuICAgIGlmIHZhbHVlcy5sZW5ndGggPiAwXHJcbiAgICAgIGNlbGwgPSBAZ3JpZFt4XVt5XVxyXG4gICAgICBzd2l0Y2ggYWN0aW9uXHJcbiAgICAgICAgd2hlbiBcInRvZ2dsZVBlbmNpbFwiXHJcbiAgICAgICAgICBqb3VybmFsLnB1c2ggeyBhY3Rpb246IFwidG9nZ2xlUGVuY2lsXCIsIHg6IHgsIHk6IHksIHZhbHVlczogdmFsdWVzIH1cclxuICAgICAgICAgIGNlbGwucGVuY2lsW3YgLSAxXSA9ICFjZWxsLnBlbmNpbFt2IC0gMV0gZm9yIHYgaW4gdmFsdWVzXHJcbiAgICAgICAgd2hlbiBcInNldFZhbHVlXCJcclxuICAgICAgICAgIGpvdXJuYWwucHVzaCB7IGFjdGlvbjogXCJzZXRWYWx1ZVwiLCB4OiB4LCB5OiB5LCB2YWx1ZXM6IFtjZWxsLnZhbHVlXSB9XHJcbiAgICAgICAgICBjZWxsLnZhbHVlID0gdmFsdWVzWzBdXHJcbiAgICAgIEB1cGRhdGVDZWxscygpXHJcbiAgICAgIEBzYXZlKClcclxuXHJcbiAgdW5kbzogLT5cclxuICAgIGlmIChAdW5kb0pvdXJuYWwubGVuZ3RoID4gMClcclxuICAgICAgc3RlcCA9IEB1bmRvSm91cm5hbC5wb3AoKVxyXG4gICAgICBAZG8gc3RlcC5hY3Rpb24sIHN0ZXAueCwgc3RlcC55LCBzdGVwLnZhbHVlcywgQHJlZG9Kb3VybmFsXHJcbiAgICAgIHJldHVybiBbIHN0ZXAueCwgc3RlcC55IF1cclxuXHJcbiAgcmVkbzogLT5cclxuICAgIGlmIChAcmVkb0pvdXJuYWwubGVuZ3RoID4gMClcclxuICAgICAgc3RlcCA9IEByZWRvSm91cm5hbC5wb3AoKVxyXG4gICAgICBAZG8gc3RlcC5hY3Rpb24sIHN0ZXAueCwgc3RlcC55LCBzdGVwLnZhbHVlcywgQHVuZG9Kb3VybmFsXHJcbiAgICAgIHJldHVybiBbIHN0ZXAueCwgc3RlcC55IF1cclxuXHJcbiAgY2xlYXJQZW5jaWw6ICh4LCB5KSAtPlxyXG4gICAgY2VsbCA9IEBncmlkW3hdW3ldXHJcbiAgICBpZiBjZWxsLmxvY2tlZFxyXG4gICAgICByZXR1cm5cclxuICAgIEBkbyBcInRvZ2dsZVBlbmNpbFwiLCB4LCB5LCAoaSArIDEgZm9yIGZsYWcsIGkgaW4gY2VsbC5wZW5jaWwgd2hlbiBmbGFnKSwgQHVuZG9Kb3VybmFsXHJcbiAgICBAcmVkb0pvdXJuYWwgPSBbXVxyXG5cclxuICB0b2dnbGVQZW5jaWw6ICh4LCB5LCB2KSAtPlxyXG4gICAgaWYgQGdyaWRbeF1beV0ubG9ja2VkXHJcbiAgICAgIHJldHVyblxyXG4gICAgQGRvIFwidG9nZ2xlUGVuY2lsXCIsIHgsIHksIFt2XSwgQHVuZG9Kb3VybmFsXHJcbiAgICBAcmVkb0pvdXJuYWwgPSBbXVxyXG5cclxuICBzZXRWYWx1ZTogKHgsIHksIHYpIC0+XHJcbiAgICBpZiBAZ3JpZFt4XVt5XS5sb2NrZWRcclxuICAgICAgcmV0dXJuXHJcbiAgICBAZG8gXCJzZXRWYWx1ZVwiLCB4LCB5LCBbdl0sIEB1bmRvSm91cm5hbFxyXG4gICAgQHJlZG9Kb3VybmFsID0gW11cclxuXHJcbiAgcmVzZXQ6IC0+XHJcbiAgICBjb25zb2xlLmxvZyBcInJlc2V0KClcIlxyXG4gICAgZm9yIGogaW4gWzAuLi45XVxyXG4gICAgICBmb3IgaSBpbiBbMC4uLjldXHJcbiAgICAgICAgY2VsbCA9IEBncmlkW2ldW2pdXHJcbiAgICAgICAgaWYgbm90IGNlbGwubG9ja2VkXHJcbiAgICAgICAgICBjZWxsLnZhbHVlID0gMFxyXG4gICAgICAgIGNlbGwuZXJyb3IgPSBmYWxzZVxyXG4gICAgICAgIGZvciBrIGluIFswLi4uOV1cclxuICAgICAgICAgIGNlbGwucGVuY2lsW2tdID0gZmFsc2VcclxuICAgIEB1bmRvSm91cm5hbCA9IFtdXHJcbiAgICBAcmVkb0pvdXJuYWwgPSBbXVxyXG4gICAgQGhpZ2hsaWdodFggPSAtMVxyXG4gICAgQGhpZ2hsaWdodFkgPSAtMVxyXG4gICAgQHVwZGF0ZUNlbGxzKClcclxuICAgIEBzYXZlKClcclxuXHJcbiAgZ2V0TGlua3M6ICh2YWx1ZSkgLT5cclxuICAgICMgTm90ZTogdGhlIHNlYXJjaCBzb3J0cyB0aGUgbGlua3MgaW4gcm93IG1ham9yIG9yZGVyLCBmaXJzdCBieSBzdGFydCBjZWxsLCB0aGVuIGJ5IGVuZCBjZWxsXHJcbiAgICBsaW5rcyA9IFtdXHJcblxyXG4gICAgIyBHZXQgcm93IGxpbmtzXHJcbiAgICBmb3IgeSBpbiBbMC4uLjldXHJcbiAgICAgIGxpbmtzLnB1c2ggQGdldFJvd0xpbmtzKHksIHZhbHVlKS4uLlxyXG5cclxuICAgICMgR2V0IGNvbHVtbiBsaW5rc1xyXG4gICAgZm9yIHggaW4gWzAuLi45XVxyXG4gICAgICBsaW5rcy5wdXNoIEBnZXRDb2x1bW5MaW5rcyh4LCB2YWx1ZSkuLi5cclxuXHJcbiAgICAjIEdldCBib3ggbGlua3NcclxuICAgIGZvciBib3hYIGluIFswLi4uM11cclxuICAgICAgZm9yIGJveFkgaW4gWzAuLi4zXVxyXG4gICAgICAgIGxpbmtzLnB1c2ggQGdldEJveExpbmtzKGJveFgsIGJveFksIHZhbHVlKS4uLlxyXG5cclxuICAgICMgVGhlIGJveCBsaW5rcyBtaWdodCBoYXZlIGR1cGxpY2F0ZWQgc29tZSByb3cgYW5kIGNvbHVtbiBsaW5rcywgc28gZHVwbGljYXRlcyBtdXN0IGJlIGZpbHRlcmVkIG91dC4gTm90ZSB0aGF0IG9ubHlcclxuICAgICMgbG9jYXRpb25zIGFyZSBjb25zaWRlcmVkIHdoZW4gZmluZGluZyBkdXBsaWNhdGVzLCBidXQgc3Ryb25nIGxpbmtzIHRha2UgcHJlY2VkZW5jZSB3aGVuIGR1cGxpY2F0ZXMgYXJlIHJlbW92ZWRcclxuICAgICMgKGJlY2F1c2UgdGhleSBhcmUgb3JkZXJlZCBiZWZvcmUgd2VhayBsaW5rcykuXHJcbiAgICBsaW5rcyA9IGxpbmtzLnNvcnQoYXNjZW5kaW5nTGlua1NvcnQpLmZpbHRlcih1bmlxdWVMaW5rRmlsdGVyKVxyXG5cclxuICAgIHN0cm9uZyA9IFtdXHJcbiAgICBmb3IgbGluayBpbiBsaW5rc1xyXG4gICAgICBzdHJvbmcucHVzaCBsaW5rLmNlbGxzIGlmIGxpbmsuc3Ryb25nP1xyXG4gICAgd2VhayA9IFtdXHJcbiAgICBmb3IgbGluayBpbiBsaW5rc1xyXG4gICAgICB3ZWFrLnB1c2ggbGluay5jZWxscyBpZiBub3QgbGluay5zdHJvbmc/XHJcblxyXG4gICAgcmV0dXJuIHsgc3Ryb25nLCB3ZWFrIH1cclxuXHJcbiAgZ2V0Um93TGlua3M6ICh5LCB2YWx1ZSkgLT5cclxuICAgIGNlbGxzID0gW11cclxuICAgIGZvciB4IGluIFswLi4uOV1cclxuICAgICAgY2VsbCA9IEBncmlkW3hdW3ldXHJcbiAgICAgIGlmIGNlbGwudmFsdWUgPT0gMCBhbmQgY2VsbC5wZW5jaWxbdmFsdWUgLSAxXVxyXG4gICAgICAgIGNlbGxzLnB1c2goeyB4LCB5IH0pXHJcblxyXG4gICAgaWYgY2VsbHMubGVuZ3RoID4gMVxyXG4gICAgICBsaW5rcyA9IGdlbmVyYXRlTGlua1Blcm11dGF0aW9ucyhjZWxscylcclxuICAgICAgaWYgbGlua3MubGVuZ3RoID09IDFcclxuICAgICAgICBsaW5rc1swXS5zdHJvbmcgPSB0cnVlXHJcbiAgICBlbHNlXHJcbiAgICAgIGxpbmtzID0gW11cclxuICAgIHJldHVybiBsaW5rc1xyXG5cclxuICBnZXRDb2x1bW5MaW5rczogKHgsIHZhbHVlKSAtPlxyXG4gICAgY2VsbHMgPSBbXVxyXG4gICAgZm9yIHkgaW4gWzAuLi45XVxyXG4gICAgICBjZWxsID0gQGdyaWRbeF1beV1cclxuICAgICAgaWYgY2VsbC52YWx1ZSA9PSAwIGFuZCBjZWxsLnBlbmNpbFt2YWx1ZSAtIDFdXHJcbiAgICAgICAgY2VsbHMucHVzaCh7IHgsIHkgfSlcclxuXHJcbiAgICBpZiBjZWxscy5sZW5ndGggPiAxXHJcbiAgICAgIGxpbmtzID0gZ2VuZXJhdGVMaW5rUGVybXV0YXRpb25zKGNlbGxzKVxyXG4gICAgICBpZiBsaW5rcy5sZW5ndGggPT0gMVxyXG4gICAgICAgIGxpbmtzWzBdLnN0cm9uZyA9IHRydWVcclxuICAgIGVsc2VcclxuICAgICAgbGlua3MgPSBbXVxyXG4gICAgcmV0dXJuIGxpbmtzXHJcblxyXG4gIGdldEJveExpbmtzOiAoYm94WCwgYm94WSwgdmFsdWUpIC0+XHJcbiAgICBjZWxscyA9IFtdXHJcbiAgICBzeCA9IGJveFggKiAzXHJcbiAgICBzeSA9IGJveFkgKiAzXHJcbiAgICBmb3IgeSBpbiBbc3kuLi5zeSArIDNdXHJcbiAgICAgIGZvciB4IGluIFtzeC4uLnN4ICsgM11cclxuICAgICAgICBjZWxsID0gQGdyaWRbeF1beV1cclxuICAgICAgICBpZiBjZWxsLnZhbHVlID09IDAgYW5kIGNlbGwucGVuY2lsW3ZhbHVlIC0gMV1cclxuICAgICAgICAgIGNlbGxzLnB1c2goeyB4LCB5IH0pXHJcblxyXG4gICAgaWYgY2VsbHMubGVuZ3RoID4gMVxyXG4gICAgICBsaW5rcyA9IGdlbmVyYXRlTGlua1Blcm11dGF0aW9ucyhjZWxscylcclxuICAgICAgaWYgbGlua3MubGVuZ3RoID09IDFcclxuICAgICAgICBsaW5rc1swXS5zdHJvbmcgPSB0cnVlXHJcbiAgICBlbHNlXHJcbiAgICAgIGxpbmtzID0gW11cclxuICAgIHJldHVybiBsaW5rc1xyXG5cclxuICBtYXJrSXNHb29kOiAoeCwgeSwgbSkgLT5cclxuICAgICMgQ2hlY2sgaWYgdGhpcyBtYXJrIGlzIGEga25vd24gdmFsdWUgaW4gdGhlIGNvbHVtblxyXG4gICAgZm9yIGogaW4gWzAuLi45XSB3aGVuIGogaXNudCB5XHJcbiAgICAgIGlmIEBncmlkW3hdW2pdLnZhbHVlID09IG1cclxuICAgICAgICByZXR1cm4gZmFsc2VcclxuXHJcbiAgICAjIENoZWNrIGlmIHRoaXMgbWFyayBpcyBhIGtub3duIHZhbHVlIGluIHRoZSByb3dcclxuICAgIGZvciBpIGluIFswLi4uOV0gd2hlbiBpIGlzbnQgeFxyXG4gICAgICBpZiBAZ3JpZFtpXVt5XS52YWx1ZSA9PSBtXHJcbiAgICAgICAgcmV0dXJuIGZhbHNlXHJcblxyXG4gICAgIyBDaGVjayBpZiB0aGlzIG1hcmsgaXMgYSBrbm93biB2YWx1ZSBpbiB0aGUgYm94XHJcbiAgICBzeCA9IE1hdGguZmxvb3IoeCAvIDMpICogM1xyXG4gICAgc3kgPSBNYXRoLmZsb29yKHkgLyAzKSAqIDNcclxuICAgIGZvciBpIGluIFtzeC4uLnN4ICsgM11cclxuICAgICAgZm9yIGogaW4gW3N5Li4uc3kgKyAzXVxyXG4gICAgICAgIGlmIChpICE9IHggfHwgaiAhPSB5KSAmJiBAZ3JpZFtpXVtqXS52YWx1ZSA9PSBtXHJcbiAgICAgICAgICByZXR1cm4gZmFsc2VcclxuICBcclxuICAgIHJldHVybiB0cnVlXHJcblxyXG4gIG5ld0dhbWU6IChkaWZmaWN1bHR5KSAtPlxyXG4gICAgY29uc29sZS5sb2cgXCJuZXdHYW1lKCN7ZGlmZmljdWx0eX0pXCJcclxuICAgIGZvciBqIGluIFswLi4uOV1cclxuICAgICAgZm9yIGkgaW4gWzAuLi45XVxyXG4gICAgICAgIGNlbGwgPSBAZ3JpZFtpXVtqXVxyXG4gICAgICAgIGNlbGwudmFsdWUgPSAwXHJcbiAgICAgICAgY2VsbC5lcnJvciA9IGZhbHNlXHJcbiAgICAgICAgY2VsbC5sb2NrZWQgPSBmYWxzZVxyXG4gICAgICAgIGZvciBrIGluIFswLi4uOV1cclxuICAgICAgICAgIGNlbGwucGVuY2lsW2tdID0gZmFsc2VcclxuXHJcbiAgICBnZW5lcmF0b3IgPSBuZXcgU3Vkb2t1R2VuZXJhdG9yKClcclxuICAgIFsgbmV3R3JpZCwgQHNvbHV0aW9uIF0gPSBnZW5lcmF0b3IuZ2VuZXJhdGUoZGlmZmljdWx0eSlcclxuICAgICMgY29uc29sZS5sb2cgXCJuZXdHcmlkXCIsIG5ld0dyaWRcclxuICAgIGZvciBqIGluIFswLi4uOV1cclxuICAgICAgZm9yIGkgaW4gWzAuLi45XVxyXG4gICAgICAgIGlmIG5ld0dyaWRbaV1bal0gIT0gMFxyXG4gICAgICAgICAgQGdyaWRbaV1bal0udmFsdWUgPSBuZXdHcmlkW2ldW2pdXHJcbiAgICAgICAgICBAZ3JpZFtpXVtqXS5sb2NrZWQgPSB0cnVlXHJcbiAgICBAdW5kb0pvdXJuYWwgPSBbXVxyXG4gICAgQHJlZG9Kb3VybmFsID0gW11cclxuICAgIEB1cGRhdGVDZWxscygpXHJcbiAgICBAc2F2ZSgpXHJcblxyXG4gIGxvYWQ6IC0+XHJcbiAgICBpZiBub3QgbG9jYWxTdG9yYWdlXHJcbiAgICAgIGFsZXJ0KFwiTm8gbG9jYWwgc3RvcmFnZSwgbm90aGluZyB3aWxsIHdvcmtcIilcclxuICAgICAgcmV0dXJuIGZhbHNlXHJcbiAgICBqc29uU3RyaW5nID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJnYW1lXCIpXHJcbiAgICBpZiBqc29uU3RyaW5nID09IG51bGxcclxuICAgICAgcmV0dXJuIGZhbHNlXHJcblxyXG4gICAgIyBjb25zb2xlLmxvZyBqc29uU3RyaW5nXHJcbiAgICBnYW1lRGF0YSA9IEpTT04ucGFyc2UoanNvblN0cmluZylcclxuICAgICMgY29uc29sZS5sb2cgXCJmb3VuZCBnYW1lRGF0YVwiLCBnYW1lRGF0YVxyXG5cclxuICAgIGZvciBqIGluIFswLi4uOV1cclxuICAgICAgZm9yIGkgaW4gWzAuLi45XVxyXG4gICAgICAgIHNyYyA9IGdhbWVEYXRhLmdyaWRbaV1bal1cclxuICAgICAgICBkc3QgPSBAZ3JpZFtpXVtqXVxyXG4gICAgICAgIGRzdC52YWx1ZSA9IHNyYy52XHJcbiAgICAgICAgZHN0LmVycm9yID0gaWYgc3JjLmUgPiAwIHRoZW4gdHJ1ZSBlbHNlIGZhbHNlXHJcbiAgICAgICAgZHN0LmxvY2tlZCA9IGlmIHNyYy5sID4gMCB0aGVuIHRydWUgZWxzZSBmYWxzZVxyXG4gICAgICAgIGZvciBrIGluIFswLi4uOV1cclxuICAgICAgICAgIGRzdC5wZW5jaWxba10gPSBpZiBzcmMucFtrXSA+IDAgdGhlbiB0cnVlIGVsc2UgZmFsc2VcclxuICAgIEBzb2x1dGlvbiA9IGdhbWVEYXRhLnNvbHV0aW9uXHJcbiAgICBAdXBkYXRlQ2VsbHMoKVxyXG4gICAgY29uc29sZS5sb2cgXCJMb2FkZWQgZ2FtZS5cIlxyXG4gICAgcmV0dXJuIHRydWVcclxuXHJcbiAgc2F2ZTogLT5cclxuICAgIGlmIG5vdCBsb2NhbFN0b3JhZ2VcclxuICAgICAgYWxlcnQoXCJObyBsb2NhbCBzdG9yYWdlLCBub3RoaW5nIHdpbGwgd29ya1wiKVxyXG4gICAgICByZXR1cm4gZmFsc2VcclxuXHJcbiAgICBnYW1lRGF0YSA9XHJcbiAgICAgIGdyaWQ6IG5ldyBBcnJheSg5KS5maWxsKG51bGwpXHJcbiAgICAgIHNvbHV0aW9uOiBuZXcgQXJyYXkoOSkuZmlsbChudWxsKVxyXG5cclxuICAgIGZvciBpIGluIFswLi4uOV1cclxuICAgICAgZ2FtZURhdGEuZ3JpZFtpXSA9IG5ldyBBcnJheSg5KS5maWxsKG51bGwpXHJcbiAgICAgIGdhbWVEYXRhLnNvbHV0aW9uW2ldID0gbmV3IEFycmF5KDkpLmZpbGwobnVsbClcclxuXHJcbiAgICBmb3IgaiBpbiBbMC4uLjldXHJcbiAgICAgIGZvciBpIGluIFswLi4uOV1cclxuICAgICAgICBjZWxsID0gQGdyaWRbaV1bal1cclxuICAgICAgICBnYW1lRGF0YS5ncmlkW2ldW2pdID1cclxuICAgICAgICAgIHY6IGNlbGwudmFsdWVcclxuICAgICAgICAgIGU6IGlmIGNlbGwuZXJyb3IgdGhlbiAxIGVsc2UgMFxyXG4gICAgICAgICAgbDogaWYgY2VsbC5sb2NrZWQgdGhlbiAxIGVsc2UgMFxyXG4gICAgICAgICAgcDogW11cclxuICAgICAgICBkc3QgPSBnYW1lRGF0YS5ncmlkW2ldW2pdLnBcclxuICAgICAgICBmb3IgayBpbiBbMC4uLjldXHJcbiAgICAgICAgICBkc3QucHVzaChpZiBjZWxsLnBlbmNpbFtrXSB0aGVuIDEgZWxzZSAwKVxyXG5cclxuICAgIGZvciBpIGluIFswLi4uOV1cclxuICAgICAgZ2FtZURhdGEuc29sdXRpb25baV0gPSBuZXcgQXJyYXkoOSkuZmlsbChudWxsKVxyXG4gICAgICBmb3IgaiBpbiBbMC4uLjldXHJcbiAgICAgICAgZ2FtZURhdGEuc29sdXRpb25baV1bal0gPSBAc29sdXRpb25baV1bal1cclxuXHJcbiAgICBqc29uU3RyaW5nID0gSlNPTi5zdHJpbmdpZnkoZ2FtZURhdGEpXHJcbiAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcImdhbWVcIiwganNvblN0cmluZylcclxuICAgIGNvbnNvbGUubG9nIFwiU2F2ZWQgZ2FtZSAoI3tqc29uU3RyaW5nLmxlbmd0aH0gY2hhcnMpXCJcclxuICAgIHJldHVybiB0cnVlXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFN1ZG9rdUdhbWVcclxuIiwic2h1ZmZsZSA9IChhKSAtPlxyXG4gICAgaSA9IGEubGVuZ3RoXHJcbiAgICB3aGlsZSAtLWkgPiAwXHJcbiAgICAgICAgaiA9IH5+KE1hdGgucmFuZG9tKCkgKiAoaSArIDEpKVxyXG4gICAgICAgIHQgPSBhW2pdXHJcbiAgICAgICAgYVtqXSA9IGFbaV1cclxuICAgICAgICBhW2ldID0gdFxyXG4gICAgcmV0dXJuIGFcclxuXHJcbmNsYXNzIEJvYXJkXHJcbiAgY29uc3RydWN0b3I6IChvdGhlckJvYXJkID0gbnVsbCkgLT5cclxuICAgIEBsb2NrZWRDb3VudCA9IDBcclxuICAgIEBncmlkID0gbmV3IEFycmF5KDkpLmZpbGwobnVsbClcclxuICAgIEBsb2NrZWQgPSBuZXcgQXJyYXkoOSkuZmlsbChudWxsKVxyXG4gICAgZm9yIGkgaW4gWzAuLi45XVxyXG4gICAgICBAZ3JpZFtpXSA9IG5ldyBBcnJheSg5KS5maWxsKDApXHJcbiAgICAgIEBsb2NrZWRbaV0gPSBuZXcgQXJyYXkoOSkuZmlsbChmYWxzZSlcclxuICAgIGlmIG90aGVyQm9hcmQgIT0gbnVsbFxyXG4gICAgICBmb3IgaiBpbiBbMC4uLjldXHJcbiAgICAgICAgZm9yIGkgaW4gWzAuLi45XVxyXG4gICAgICAgICAgQGdyaWRbaV1bal0gPSBvdGhlckJvYXJkLmdyaWRbaV1bal1cclxuICAgICAgICAgIEBsb2NrKGksIGosIG90aGVyQm9hcmQubG9ja2VkW2ldW2pdKVxyXG4gICAgcmV0dXJuXHJcblxyXG4gIG1hdGNoZXM6IChvdGhlckJvYXJkKSAtPlxyXG4gICAgZm9yIGogaW4gWzAuLi45XVxyXG4gICAgICBmb3IgaSBpbiBbMC4uLjldXHJcbiAgICAgICAgaWYgQGdyaWRbaV1bal0gIT0gb3RoZXJCb2FyZC5ncmlkW2ldW2pdXHJcbiAgICAgICAgICByZXR1cm4gZmFsc2VcclxuICAgIHJldHVybiB0cnVlXHJcblxyXG4gIGxvY2s6ICh4LCB5LCB2ID0gdHJ1ZSkgLT5cclxuICAgIGlmIHZcclxuICAgICAgQGxvY2tlZENvdW50ICs9IDEgaWYgbm90IEBsb2NrZWRbeF1beV1cclxuICAgIGVsc2VcclxuICAgICAgQGxvY2tlZENvdW50IC09IDEgaWYgQGxvY2tlZFt4XVt5XVxyXG4gICAgQGxvY2tlZFt4XVt5XSA9IHZcclxuXHJcblxyXG5jbGFzcyBTdWRva3VHZW5lcmF0b3JcclxuICBAZGlmZmljdWx0eTpcclxuICAgIGVhc3k6IDFcclxuICAgIG1lZGl1bTogMlxyXG4gICAgaGFyZDogM1xyXG4gICAgZXh0cmVtZTogNFxyXG5cclxuICBjb25zdHJ1Y3RvcjogLT5cclxuXHJcbiAgYm9hcmRUb0dyaWQ6IChib2FyZCkgLT5cclxuICAgIG5ld0JvYXJkID0gbmV3IEFycmF5KDkpLmZpbGwobnVsbClcclxuICAgIGZvciBpIGluIFswLi4uOV1cclxuICAgICAgbmV3Qm9hcmRbaV0gPSBuZXcgQXJyYXkoOSkuZmlsbCgwKVxyXG4gICAgZm9yIGogaW4gWzAuLi45XVxyXG4gICAgICBmb3IgaSBpbiBbMC4uLjldXHJcbiAgICAgICAgaWYgYm9hcmQubG9ja2VkW2ldW2pdXHJcbiAgICAgICAgICBuZXdCb2FyZFtpXVtqXSA9IGJvYXJkLmdyaWRbaV1bal1cclxuICAgIHJldHVybiBuZXdCb2FyZFxyXG5cclxuICBncmlkVG9Cb2FyZDogKGdyaWQpIC0+XHJcbiAgICBib2FyZCA9IG5ldyBCb2FyZFxyXG4gICAgZm9yIHkgaW4gWzAuLi45XVxyXG4gICAgICBmb3IgeCBpbiBbMC4uLjldXHJcbiAgICAgICAgaWYgZ3JpZFt4XVt5XSA+IDBcclxuICAgICAgICAgIGJvYXJkLmdyaWRbeF1beV0gPSBncmlkW3hdW3ldXHJcbiAgICAgICAgICBib2FyZC5sb2NrKHgsIHkpXHJcbiAgICByZXR1cm4gYm9hcmRcclxuXHJcbiAgY2VsbFZhbGlkOiAoYm9hcmQsIHgsIHksIHYpIC0+XHJcbiAgICBpZiBib2FyZC5sb2NrZWRbeF1beV1cclxuICAgICAgcmV0dXJuIGJvYXJkLmdyaWRbeF1beV0gPT0gdlxyXG5cclxuICAgIGZvciBpIGluIFswLi4uOV1cclxuICAgICAgaWYgKHggIT0gaSkgYW5kIChib2FyZC5ncmlkW2ldW3ldID09IHYpXHJcbiAgICAgICAgICByZXR1cm4gZmFsc2VcclxuICAgICAgaWYgKHkgIT0gaSkgYW5kIChib2FyZC5ncmlkW3hdW2ldID09IHYpXHJcbiAgICAgICAgICByZXR1cm4gZmFsc2VcclxuXHJcbiAgICBzeCA9IE1hdGguZmxvb3IoeCAvIDMpICogM1xyXG4gICAgc3kgPSBNYXRoLmZsb29yKHkgLyAzKSAqIDNcclxuICAgIGZvciBqIGluIFswLi4uM11cclxuICAgICAgZm9yIGkgaW4gWzAuLi4zXVxyXG4gICAgICAgIGlmICh4ICE9IChzeCArIGkpKSAmJiAoeSAhPSAoc3kgKyBqKSlcclxuICAgICAgICAgIGlmIGJvYXJkLmdyaWRbc3ggKyBpXVtzeSArIGpdID09IHZcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlXHJcbiAgICByZXR1cm4gdHJ1ZVxyXG5cclxuICBwZW5jaWxNYXJrczogKGJvYXJkLCB4LCB5KSAtPlxyXG4gICAgaWYgYm9hcmQubG9ja2VkW3hdW3ldXHJcbiAgICAgIHJldHVybiBbIGJvYXJkLmdyaWRbeF1beV0gXVxyXG4gICAgbWFya3MgPSBbXVxyXG4gICAgZm9yIHYgaW4gWzEuLjldXHJcbiAgICAgIGlmIEBjZWxsVmFsaWQoYm9hcmQsIHgsIHksIHYpXHJcbiAgICAgICAgbWFya3MucHVzaCB2XHJcbiAgICBpZiBtYXJrcy5sZW5ndGggPiAxXHJcbiAgICAgIHNodWZmbGUobWFya3MpXHJcbiAgICByZXR1cm4gbWFya3NcclxuXHJcbiAgbmV4dEF0dGVtcHQ6IChib2FyZCwgYXR0ZW1wdHMpIC0+XHJcbiAgICByZW1haW5pbmdJbmRleGVzID0gWzAuLi44MV1cclxuXHJcbiAgICAjIHNraXAgbG9ja2VkIGNlbGxzXHJcbiAgICBmb3IgaW5kZXggaW4gWzAuLi44MV1cclxuICAgICAgeCA9IGluZGV4ICUgOVxyXG4gICAgICB5ID0gaW5kZXggLy8gOVxyXG4gICAgICBpZiBib2FyZC5sb2NrZWRbeF1beV1cclxuICAgICAgICBrID0gcmVtYWluaW5nSW5kZXhlcy5pbmRleE9mKGluZGV4KVxyXG4gICAgICAgIHJlbWFpbmluZ0luZGV4ZXMuc3BsaWNlKGssIDEpIGlmIGsgPj0gMFxyXG5cclxuICAgICMgc2tpcCBjZWxscyB0aGF0IGFyZSBhbHJlYWR5IGJlaW5nIHRyaWVkXHJcbiAgICBmb3IgYSBpbiBhdHRlbXB0c1xyXG4gICAgICBrID0gcmVtYWluaW5nSW5kZXhlcy5pbmRleE9mKGEuaW5kZXgpXHJcbiAgICAgIHJlbWFpbmluZ0luZGV4ZXMuc3BsaWNlKGssIDEpIGlmIGsgPj0gMFxyXG5cclxuICAgIHJldHVybiBudWxsIGlmIHJlbWFpbmluZ0luZGV4ZXMubGVuZ3RoID09IDAgIyBhYm9ydCBpZiB0aGVyZSBhcmUgbm8gY2VsbHMgKHNob3VsZCBuZXZlciBoYXBwZW4pXHJcblxyXG4gICAgZmV3ZXN0SW5kZXggPSAtMVxyXG4gICAgZmV3ZXN0TWFya3MgPSBbMC4uOV1cclxuICAgIGZvciBpbmRleCBpbiByZW1haW5pbmdJbmRleGVzXHJcbiAgICAgIHggPSBpbmRleCAlIDlcclxuICAgICAgeSA9IGluZGV4IC8vIDlcclxuICAgICAgbWFya3MgPSBAcGVuY2lsTWFya3MoYm9hcmQsIHgsIHkpXHJcblxyXG4gICAgICAjIGFib3J0IGlmIHRoZXJlIGlzIGEgY2VsbCB3aXRoIG5vIHBvc3NpYmlsaXRpZXNcclxuICAgICAgcmV0dXJuIG51bGwgaWYgbWFya3MubGVuZ3RoID09IDBcclxuXHJcbiAgICAgICMgZG9uZSBpZiB0aGVyZSBpcyBhIGNlbGwgd2l0aCBvbmx5IG9uZSBwb3NzaWJpbGl0eSAoKVxyXG4gICAgICByZXR1cm4geyBpbmRleDogaW5kZXgsIHJlbWFpbmluZzogbWFya3MgfSBpZiBtYXJrcy5sZW5ndGggPT0gMVxyXG5cclxuICAgICAgIyByZW1lbWJlciB0aGlzIGNlbGwgaWYgaXQgaGFzIHRoZSBmZXdlc3QgbWFya3Mgc28gZmFyXHJcbiAgICAgIGlmIG1hcmtzLmxlbmd0aCA8IGZld2VzdE1hcmtzLmxlbmd0aFxyXG4gICAgICAgIGZld2VzdEluZGV4ID0gaW5kZXhcclxuICAgICAgICBmZXdlc3RNYXJrcyA9IG1hcmtzXHJcbiAgICByZXR1cm4geyBpbmRleDogZmV3ZXN0SW5kZXgsIHJlbWFpbmluZzogZmV3ZXN0TWFya3MgfVxyXG5cclxuICBzb2x2ZTogKGJvYXJkKSAtPlxyXG4gICAgc29sdmVkID0gbmV3IEJvYXJkKGJvYXJkKVxyXG4gICAgYXR0ZW1wdHMgPSBbXVxyXG4gICAgcmV0dXJuIEBzb2x2ZUludGVybmFsKHNvbHZlZCwgYXR0ZW1wdHMpXHJcblxyXG4gIGhhc1VuaXF1ZVNvbHV0aW9uOiAoYm9hcmQpIC0+XHJcbiAgICBzb2x2ZWQgPSBuZXcgQm9hcmQoYm9hcmQpXHJcbiAgICBhdHRlbXB0cyA9IFtdXHJcblxyXG4gICAgIyBpZiB0aGVyZSBpcyBubyBzb2x1dGlvbiwgcmV0dXJuIGZhbHNlXHJcbiAgICByZXR1cm4gZmFsc2UgaWYgQHNvbHZlSW50ZXJuYWwoc29sdmVkLCBhdHRlbXB0cykgPT0gbnVsbFxyXG5cclxuICAgIHVubG9ja2VkQ291bnQgPSA4MSAtIHNvbHZlZC5sb2NrZWRDb3VudFxyXG5cclxuICAgICMgaWYgdGhlcmUgYXJlIG5vIHVubG9ja2VkIGNlbGxzLCB0aGVuIHRoaXMgc29sdXRpb24gbXVzdCBiZSB1bmlxdWVcclxuICAgIHJldHVybiB0cnVlIGlmIHVubG9ja2VkQ291bnQgPT0gMFxyXG5cclxuICAgICMgY2hlY2sgZm9yIGEgc2Vjb25kIHNvbHV0aW9uXHJcbiAgICByZXR1cm4gQHNvbHZlSW50ZXJuYWwoc29sdmVkLCBhdHRlbXB0cywgdW5sb2NrZWRDb3VudCAtIDEpID09IG51bGxcclxuXHJcbiAgc29sdmVJbnRlcm5hbDogKHNvbHZlZCwgYXR0ZW1wdHMsIHdhbGtJbmRleCA9IDApIC0+XHJcbiAgICB1bmxvY2tlZENvdW50ID0gODEgLSBzb2x2ZWQubG9ja2VkQ291bnRcclxuICAgIHdoaWxlIHdhbGtJbmRleCA8IHVubG9ja2VkQ291bnRcclxuICAgICAgaWYgd2Fsa0luZGV4ID49IGF0dGVtcHRzLmxlbmd0aFxyXG4gICAgICAgIGF0dGVtcHQgPSBAbmV4dEF0dGVtcHQoc29sdmVkLCBhdHRlbXB0cylcclxuICAgICAgICBhdHRlbXB0cy5wdXNoKGF0dGVtcHQpIGlmIGF0dGVtcHQgIT0gbnVsbFxyXG4gICAgICBlbHNlXHJcbiAgICAgICAgYXR0ZW1wdCA9IGF0dGVtcHRzW3dhbGtJbmRleF1cclxuXHJcbiAgICAgIGlmIGF0dGVtcHQgIT0gbnVsbFxyXG4gICAgICAgIHggPSBhdHRlbXB0LmluZGV4ICUgOVxyXG4gICAgICAgIHkgPSBhdHRlbXB0LmluZGV4IC8vIDlcclxuICAgICAgICBpZiBhdHRlbXB0LnJlbWFpbmluZy5sZW5ndGggPiAwXHJcbiAgICAgICAgICBzb2x2ZWQuZ3JpZFt4XVt5XSA9IGF0dGVtcHQucmVtYWluaW5nLnBvcCgpXHJcbiAgICAgICAgICB3YWxrSW5kZXggKz0gMVxyXG4gICAgICAgIGVsc2VcclxuICAgICAgICAgIGF0dGVtcHRzLnBvcCgpXHJcbiAgICAgICAgICBzb2x2ZWQuZ3JpZFt4XVt5XSA9IDBcclxuICAgICAgICAgIHdhbGtJbmRleCAtPSAxXHJcbiAgICAgIGVsc2VcclxuICAgICAgICB3YWxrSW5kZXggLT0gMVxyXG5cclxuICAgICAgaWYgd2Fsa0luZGV4IDwgMFxyXG4gICAgICAgIHJldHVybiBudWxsXHJcblxyXG4gICAgcmV0dXJuIHNvbHZlZFxyXG5cclxuICBnZW5lcmF0ZUludGVybmFsOiAoYW1vdW50VG9SZW1vdmUpIC0+XHJcbiAgICBib2FyZCA9IEBzb2x2ZShuZXcgQm9hcmQoKSlcclxuICAgICMgaGFja1xyXG4gICAgZm9yIGogaW4gWzAuLi45XVxyXG4gICAgICBmb3IgaSBpbiBbMC4uLjldXHJcbiAgICAgICAgYm9hcmQubG9jayhpLCBqKVxyXG5cclxuICAgIHNvbHV0aW9uID0gbmV3IEJvYXJkKGJvYXJkKVxyXG5cclxuICAgIGluZGV4ZXNUb1JlbW92ZSA9IHNodWZmbGUoWzAuLi44MV0pXHJcbiAgICByZW1vdmVkID0gMFxyXG4gICAgd2hpbGUgcmVtb3ZlZCA8IGFtb3VudFRvUmVtb3ZlXHJcbiAgICAgIGlmIGluZGV4ZXNUb1JlbW92ZS5sZW5ndGggPT0gMFxyXG4gICAgICAgIGJyZWFrXHJcblxyXG4gICAgICByZW1vdmVJbmRleCA9IGluZGV4ZXNUb1JlbW92ZS5wb3AoKVxyXG4gICAgICByeCA9IHJlbW92ZUluZGV4ICUgOVxyXG4gICAgICByeSA9IE1hdGguZmxvb3IocmVtb3ZlSW5kZXggLyA5KVxyXG5cclxuICAgICAgbmV4dEJvYXJkID0gbmV3IEJvYXJkKGJvYXJkKVxyXG4gICAgICBuZXh0Qm9hcmQuZ3JpZFtyeF1bcnldID0gMFxyXG4gICAgICBuZXh0Qm9hcmQubG9jayhyeCwgcnksIGZhbHNlKVxyXG5cclxuICAgICAgaWYgQGhhc1VuaXF1ZVNvbHV0aW9uKG5leHRCb2FyZClcclxuICAgICAgICBib2FyZCA9IG5leHRCb2FyZFxyXG4gICAgICAgIHJlbW92ZWQgKz0gMVxyXG4gICAgICAgICMgY29uc29sZS5sb2cgXCJzdWNjZXNzZnVsbHkgcmVtb3ZlZCAje3J4fSwje3J5fVwiXHJcbiAgICAgIGVsc2VcclxuICAgICAgICAjIGNvbnNvbGUubG9nIFwiZmFpbGVkIHRvIHJlbW92ZSAje3J4fSwje3J5fSwgY3JlYXRlcyBub24tdW5pcXVlIHNvbHV0aW9uXCJcclxuXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICBib2FyZFxyXG4gICAgICByZW1vdmVkXHJcbiAgICAgIHNvbHV0aW9uXHJcbiAgICB9XHJcblxyXG4gIGdlbmVyYXRlOiAoZGlmZmljdWx0eSkgLT5cclxuICAgIGFtb3VudFRvUmVtb3ZlID0gc3dpdGNoIGRpZmZpY3VsdHlcclxuICAgICAgd2hlbiBTdWRva3VHZW5lcmF0b3IuZGlmZmljdWx0eS5leHRyZW1lIHRoZW4gNjBcclxuICAgICAgd2hlbiBTdWRva3VHZW5lcmF0b3IuZGlmZmljdWx0eS5oYXJkICAgIHRoZW4gNTJcclxuICAgICAgd2hlbiBTdWRva3VHZW5lcmF0b3IuZGlmZmljdWx0eS5tZWRpdW0gIHRoZW4gNDZcclxuICAgICAgZWxzZSA0MCAjIGVhc3kgLyB1bmtub3duXHJcblxyXG4gICAgYmVzdCA9IG51bGxcclxuICAgIGZvciBhdHRlbXB0IGluIFswLi4uMl1cclxuICAgICAgZ2VuZXJhdGVkID0gQGdlbmVyYXRlSW50ZXJuYWwoYW1vdW50VG9SZW1vdmUpXHJcbiAgICAgIGlmIGdlbmVyYXRlZC5yZW1vdmVkID09IGFtb3VudFRvUmVtb3ZlXHJcbiAgICAgICAgY29uc29sZS5sb2cgXCJSZW1vdmVkIGV4YWN0IGFtb3VudCAje2Ftb3VudFRvUmVtb3ZlfSwgc3RvcHBpbmdcIlxyXG4gICAgICAgIGJlc3QgPSBnZW5lcmF0ZWRcclxuICAgICAgICBicmVha1xyXG5cclxuICAgICAgaWYgYmVzdCA9PSBudWxsXHJcbiAgICAgICAgYmVzdCA9IGdlbmVyYXRlZFxyXG4gICAgICBlbHNlIGlmIGJlc3QucmVtb3ZlZCA8IGdlbmVyYXRlZC5yZW1vdmVkXHJcbiAgICAgICAgYmVzdCA9IGdlbmVyYXRlZFxyXG4gICAgICBjb25zb2xlLmxvZyBcImN1cnJlbnQgYmVzdCAje2Jlc3QucmVtb3ZlZH0gLyAje2Ftb3VudFRvUmVtb3ZlfVwiXHJcblxyXG4gICAgY29uc29sZS5sb2cgXCJnaXZpbmcgdXNlciBib2FyZDogI3tiZXN0LnJlbW92ZWR9IC8gI3thbW91bnRUb1JlbW92ZX1cIlxyXG4gICAgcmV0dXJuIFtAYm9hcmRUb0dyaWQoYmVzdC5ib2FyZCksIEBib2FyZFRvR3JpZChiZXN0LnNvbHV0aW9uKV1cclxuXHJcbiAgdmFsaWRhdGVHcmlkOiAoZ3JpZCkgLT5cclxuICAgIHJldHVybiBAaGFzVW5pcXVlU29sdXRpb24oQGdyaWRUb0JvYXJkKGdyaWQpKVxyXG5cclxuICBzb2x2ZVN0cmluZzogKGltcG9ydFN0cmluZykgLT5cclxuICAgIGlmIGltcG9ydFN0cmluZy5pbmRleE9mKFwiU0RcIikgIT0gMFxyXG4gICAgICByZXR1cm4gZmFsc2VcclxuICAgIGltcG9ydFN0cmluZyA9IGltcG9ydFN0cmluZy5zdWJzdHIoMilcclxuICAgIGltcG9ydFN0cmluZyA9IGltcG9ydFN0cmluZy5yZXBsYWNlKC9bXjAtOV0vZywgXCJcIilcclxuICAgIGlmIGltcG9ydFN0cmluZy5sZW5ndGggIT0gODFcclxuICAgICAgcmV0dXJuIGZhbHNlXHJcblxyXG4gICAgYm9hcmQgPSBuZXcgQm9hcmQoKVxyXG5cclxuICAgIGluZGV4ID0gMFxyXG4gICAgemVyb0NoYXJDb2RlID0gXCIwXCIuY2hhckNvZGVBdCgwKVxyXG4gICAgZm9yIGogaW4gWzAuLi45XVxyXG4gICAgICBmb3IgaSBpbiBbMC4uLjldXHJcbiAgICAgICAgdiA9IGltcG9ydFN0cmluZy5jaGFyQ29kZUF0KGluZGV4KSAtIHplcm9DaGFyQ29kZVxyXG4gICAgICAgIGluZGV4ICs9IDFcclxuICAgICAgICBpZiB2ID4gMFxyXG4gICAgICAgICAgYm9hcmQuZ3JpZFtqXVtpXSA9IHZcclxuICAgICAgICAgIGJvYXJkLmxvY2soaiwgaSlcclxuXHJcbiAgICBzb2x2ZWQgPSBAc29sdmUoYm9hcmQpXHJcbiAgICBpZiBzb2x2ZWQgPT0gbnVsbFxyXG4gICAgICBjb25zb2xlLmxvZyBcIkVSUk9SOiBDYW4ndCBiZSBzb2x2ZWQuXCJcclxuICAgICAgcmV0dXJuIGZhbHNlXHJcblxyXG4gICAgaWYgbm90IEBoYXNVbmlxdWVTb2x1dGlvbihib2FyZClcclxuICAgICAgY29uc29sZS5sb2cgXCJFUlJPUjogQm9hcmQgc29sdmUgbm90IHVuaXF1ZS5cIlxyXG4gICAgICByZXR1cm4gZmFsc2VcclxuXHJcbiAgICBhbnN3ZXJTdHJpbmcgPSBcIlwiXHJcbiAgICBmb3IgaiBpbiBbMC4uLjldXHJcbiAgICAgIGZvciBpIGluIFswLi4uOV1cclxuICAgICAgICBhbnN3ZXJTdHJpbmcgKz0gXCIje3NvbHZlZC5ncmlkW2pdW2ldfSBcIlxyXG4gICAgICBhbnN3ZXJTdHJpbmcgKz0gXCJcXG5cIlxyXG5cclxuICAgIHJldHVybiBhbnN3ZXJTdHJpbmdcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gU3Vkb2t1R2VuZXJhdG9yXHJcbiIsIlN1ZG9rdUdlbmVyYXRvciA9IHJlcXVpcmUgJy4vU3Vkb2t1R2VuZXJhdG9yJ1xyXG5TdWRva3VHYW1lID0gcmVxdWlyZSAnLi9TdWRva3VHYW1lJ1xyXG5cclxuUEVOX1BPU19YID0gMVxyXG5QRU5fUE9TX1kgPSAxMFxyXG5QRU5fQ0xFQVJfUE9TX1ggPSAyXHJcblBFTl9DTEVBUl9QT1NfWSA9IDEzXHJcblxyXG5QRU5DSUxfUE9TX1ggPSA1XHJcblBFTkNJTF9QT1NfWSA9IDEwXHJcblBFTkNJTF9DTEVBUl9QT1NfWCA9IDZcclxuUEVOQ0lMX0NMRUFSX1BPU19ZID0gMTNcclxuXHJcbk1FTlVfUE9TX1ggPSA0XHJcbk1FTlVfUE9TX1kgPSAxM1xyXG5cclxuTU9ERV9TVEFSVF9QT1NfWCA9IDJcclxuTU9ERV9DRU5URVJfUE9TX1ggPSA0XHJcbk1PREVfRU5EX1BPU19YID0gNlxyXG5NT0RFX1BPU19ZID0gOVxyXG5cclxuVU5ET19QT1NfWCA9IDBcclxuVU5ET19QT1NfWSA9IDEzXHJcblJFRE9fUE9TX1ggPSA4XHJcblJFRE9fUE9TX1kgPSAxM1xyXG5cclxuQ0hFQ0tfUE9TX1ggPSA4XHJcbkNIRUNLX1BPU19ZID0gOVxyXG5cclxuQ29sb3IgPVxyXG4gIHZhbHVlOiBcImJsYWNrXCJcclxuICBwZW5jaWw6IFwiIzAwMDBmZlwiXHJcbiAgZXJyb3I6IFwiI2ZmMDAwMFwiXHJcbiAgZG9uZTogXCIjY2NjY2NjXCJcclxuICBtZW51OiBcIiMwMDg4MzNcIlxyXG4gIGxpbmtzOiBcIiNjYzMzMzNcIlxyXG4gIGJhY2tncm91bmRTZWxlY3RlZDogXCIjZWVlZWFhXCJcclxuICBiYWNrZ3JvdW5kTG9ja2VkOiBcIiNlZWVlZWVcIlxyXG4gIGJhY2tncm91bmRMb2NrZWRDb25mbGljdGVkOiBcIiNmZmZmZWVcIlxyXG4gIGJhY2tncm91bmRMb2NrZWRTZWxlY3RlZDogXCIjZWVlZWRkXCJcclxuICBiYWNrZ3JvdW5kQ29uZmxpY3RlZDogXCIjZmZmZmRkXCJcclxuICBiYWNrZ3JvdW5kRXJyb3I6IFwiI2ZmZGRkZFwiXHJcbiAgbW9kZVNlbGVjdDogXCIjNzc3NzQ0XCJcclxuICBtb2RlUGVuOiBcIiMwMDAwMDBcIlxyXG4gIG1vZGVQZW5jaWw6IFwiIzAwMDBmZlwiXHJcbiAgbW9kZUxpbmtzOiBcIiNjYzMzMzNcIlxyXG4gIG1vZGVDaGVjazogXCIjZmYwMDAwXCJcclxuXHJcbkFjdGlvblR5cGUgPVxyXG4gIFNFTEVDVDogMFxyXG4gIFBFTkNJTDogMVxyXG4gIFBFTjogMlxyXG4gIE1FTlU6IDNcclxuICBVTkRPOiA0XHJcbiAgUkVETzogNVxyXG4gIE1PREU6IDZcclxuICBDSEVDSzogN1xyXG5cclxuTW9kZVR5cGUgPVxyXG4gIFZJU0lCSUxJVFk6IDBcclxuICBQRU5DSUw6IDFcclxuICBQRU46IDJcclxuICBMSU5LUzogM1xyXG5cclxuIyBTcGVjaWFsIHBlbi9wZW5jaWwgdmFsdWVzXHJcbk5PTkUgPSAwXHJcbkNMRUFSID0gMTBcclxuXHJcbiMgSWYgYSBzZWNvbmQgdGFwIG9uIGEgcGVuL3BlbmNpbCBoYXBwZW5zIGluIHRoaXMgaW50ZXJ2YWwsIHRvZ2dsZSB2YWx1ZSBoaWdobGlnaHRpbmcgaW5zdGVhZCBvZiBzd2l0Y2hpbmcgbW9kZXNcclxuRE9VQkxFX1RBUF9JTlRFUlZBTF9NUyA9IDUwMFxyXG5cclxubm93ID0gLT5cclxuICByZXR1cm4gTWF0aC5mbG9vcihEYXRlLm5vdygpKVxyXG5cclxuS0VZX01BUFBJTkcgPVxyXG4gICcwJzogeyB2OiBDTEVBUiwgc2hpZnQ6IGZhbHNlIH1cclxuICAnMSc6IHsgdjogMSwgc2hpZnQ6IGZhbHNlIH1cclxuICAnMic6IHsgdjogMiwgc2hpZnQ6IGZhbHNlIH1cclxuICAnMyc6IHsgdjogMywgc2hpZnQ6IGZhbHNlIH1cclxuICAnNCc6IHsgdjogNCwgc2hpZnQ6IGZhbHNlIH1cclxuICAnNSc6IHsgdjogNSwgc2hpZnQ6IGZhbHNlIH1cclxuICAnNic6IHsgdjogNiwgc2hpZnQ6IGZhbHNlIH1cclxuICAnNyc6IHsgdjogNywgc2hpZnQ6IGZhbHNlIH1cclxuICAnOCc6IHsgdjogOCwgc2hpZnQ6IGZhbHNlIH1cclxuICAnOSc6IHsgdjogOSwgc2hpZnQ6IGZhbHNlIH1cclxuICAnKSc6IHsgdjogQ0xFQVIsIHNoaWZ0OiB0cnVlIH1cclxuICAnISc6IHsgdjogMSwgc2hpZnQ6IHRydWUgfVxyXG4gICdAJzogeyB2OiAyLCBzaGlmdDogdHJ1ZSB9XHJcbiAgJyMnOiB7IHY6IDMsIHNoaWZ0OiB0cnVlIH1cclxuICAnJCc6IHsgdjogNCwgc2hpZnQ6IHRydWUgfVxyXG4gICclJzogeyB2OiA1LCBzaGlmdDogdHJ1ZSB9XHJcbiAgJ14nOiB7IHY6IDYsIHNoaWZ0OiB0cnVlIH1cclxuICAnJic6IHsgdjogNywgc2hpZnQ6IHRydWUgfVxyXG4gICcqJzogeyB2OiA4LCBzaGlmdDogdHJ1ZSB9XHJcbiAgJygnOiB7IHY6IDksIHNoaWZ0OiB0cnVlIH1cclxuXHJcbiMgQ2VsZWJyYXRpb24gY29sb3IgcGFsZXR0ZVxyXG5DRUxFQlJBVElPTl9DT0xPUlMgPSBbXHJcbiAgXCIjN2Y3ZmZmXCIsXHJcbiAgXCIjN2ZmZjdmXCIsXHJcbiAgXCIjN2ZmZmZmXCIsXHJcbiAgXCIjN2Y3ZjNmXCIsXHJcbiAgXCIjZmY3ZjdmXCIsXHJcbiAgXCIjZmY3ZmZmXCIsXHJcbiAgXCIjZmZmZjdmXCIsXHJcbiAgXCIjZmZmZmZmXCJcclxuXVxyXG5cclxuQ0VMRUJSQVRJT05fU1RFUFMgPSAzMCAgICAgICAgICAjIE51bWJlciBvZiBjb2xvciBjaGFuZ2VzIGluIGEgY2VsZWJyYXRpb25cclxuQ0VMRUJSQVRJT05fSU5URVJWQUxfTVMgPSAzMyAgICAjIFRpbWUgYmV0d2VlbiBjZWxlYnJhdGlvbiBjb2xvciBjaGFuZ2VzXHJcblxyXG5GTEFTSF9JTlRFUlZBTF9NUyA9IDMzICAgICAgICAgICMgTGVuZ3RoIG9mIGZsYXNoXHJcblxyXG5jbGFzcyBTdWRva3VWaWV3XHJcbiAgIyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgIyBJbml0XHJcblxyXG4gIGNvbnN0cnVjdG9yOiAoQGFwcCwgQGNhbnZhcykgLT5cclxuICAgIGNvbnNvbGUubG9nIFwiY2FudmFzIHNpemUgI3tAY2FudmFzLndpZHRofXgje0BjYW52YXMuaGVpZ2h0fVwiXHJcblxyXG4gICAgd2lkdGhCYXNlZENlbGxTaXplID0gQGNhbnZhcy53aWR0aCAvIDlcclxuICAgIGhlaWdodEJhc2VkQ2VsbFNpemUgPSBAY2FudmFzLmhlaWdodCAvIDE0XHJcbiAgICBjb25zb2xlLmxvZyBcIndpZHRoQmFzZWRDZWxsU2l6ZSAje3dpZHRoQmFzZWRDZWxsU2l6ZX0gaGVpZ2h0QmFzZWRDZWxsU2l6ZSAje2hlaWdodEJhc2VkQ2VsbFNpemV9XCJcclxuICAgIEBjZWxsU2l6ZSA9IE1hdGgubWluKHdpZHRoQmFzZWRDZWxsU2l6ZSwgaGVpZ2h0QmFzZWRDZWxsU2l6ZSlcclxuXHJcbiAgICAjIGNhbGMgcmVuZGVyIGNvbnN0YW50c1xyXG4gICAgQGxpbmVXaWR0aFRoaW4gPSAxXHJcbiAgICBAbGluZVdpZHRoVGhpY2sgPSBNYXRoLm1heChAY2VsbFNpemUgLyAyMCwgMylcclxuICAgIEBsaW5rRG90UmFkaXVzID0gQGxpbmVXaWR0aFRoaWNrXHJcbiAgICBAY2VudGVyWCA9IDQuNSAqIEBjZWxsU2l6ZVxyXG4gICAgQGNlbnRlclkgPSA0LjUgKiBAY2VsbFNpemVcclxuXHJcbiAgICBmb250UGl4ZWxzUyA9IE1hdGguZmxvb3IoQGNlbGxTaXplICogMC4zKVxyXG4gICAgZm9udFBpeGVsc00gPSBNYXRoLmZsb29yKEBjZWxsU2l6ZSAqIDAuNSlcclxuICAgIGZvbnRQaXhlbHNMID0gTWF0aC5mbG9vcihAY2VsbFNpemUgKiAwLjgpXHJcblxyXG4gICAgIyBpbml0IGZvbnRzXHJcbiAgICBAZm9udHMgPVxyXG4gICAgICBwZW5jaWw6ICBAYXBwLnJlZ2lzdGVyRm9udChcInBlbmNpbFwiLCAgXCIje2ZvbnRQaXhlbHNTfXB4IHNheE1vbm8sIG1vbm9zcGFjZVwiKVxyXG4gICAgICBtZW51OiAgICBAYXBwLnJlZ2lzdGVyRm9udChcIm1lbnVcIiwgICAgXCIje2ZvbnRQaXhlbHNNfXB4IHNheE1vbm8sIG1vbm9zcGFjZVwiKVxyXG4gICAgICBwZW46ICAgICBAYXBwLnJlZ2lzdGVyRm9udChcInBlblwiLCAgICAgXCIje2ZvbnRQaXhlbHNMfXB4IHNheE1vbm8sIG1vbm9zcGFjZVwiKVxyXG5cclxuICAgIEBpbml0QWN0aW9ucygpXHJcblxyXG4gICAgIyBpbml0IHN0YXRlXHJcbiAgICBAZ2FtZSA9IG5ldyBTdWRva3VHYW1lKClcclxuICAgIEByZXNldFN0YXRlKClcclxuXHJcbiAgICBAZHJhdygpXHJcblxyXG4gIGluaXRBY3Rpb25zOiAtPlxyXG4gICAgQGFjdGlvbnMgPSBuZXcgQXJyYXkoOSAqIDE1KS5maWxsKG51bGwpXHJcblxyXG4gICAgZm9yIGogaW4gWzAuLi45XVxyXG4gICAgICBmb3IgaSBpbiBbMC4uLjldXHJcbiAgICAgICAgaW5kZXggPSAoaiAqIDkpICsgaVxyXG4gICAgICAgIEBhY3Rpb25zW2luZGV4XSA9IHsgdHlwZTogQWN0aW9uVHlwZS5TRUxFQ1QsIHg6IGksIHk6IGogfVxyXG5cclxuICAgIGZvciBqIGluIFswLi4uM11cclxuICAgICAgZm9yIGkgaW4gWzAuLi4zXVxyXG4gICAgICAgIGluZGV4ID0gKChQRU5fUE9TX1kgKyBqKSAqIDkpICsgKFBFTl9QT1NfWCArIGkpXHJcbiAgICAgICAgQGFjdGlvbnNbaW5kZXhdID0geyB0eXBlOiBBY3Rpb25UeXBlLlBFTiwgdmFsdWU6IDEgKyAoaiAqIDMpICsgaSB9XHJcblxyXG4gICAgZm9yIGogaW4gWzAuLi4zXVxyXG4gICAgICBmb3IgaSBpbiBbMC4uLjNdXHJcbiAgICAgICAgaW5kZXggPSAoKFBFTkNJTF9QT1NfWSArIGopICogOSkgKyAoUEVOQ0lMX1BPU19YICsgaSlcclxuICAgICAgICBAYWN0aW9uc1tpbmRleF0gPSB7IHR5cGU6IEFjdGlvblR5cGUuUEVOQ0lMLCB2YWx1ZTogMSArIChqICogMykgKyBpIH1cclxuXHJcbiAgICAjIFBlbiBjbGVhciBidXR0b25cclxuICAgIGluZGV4ID0gKFBFTl9DTEVBUl9QT1NfWSAqIDkpICsgUEVOX0NMRUFSX1BPU19YXHJcbiAgICBAYWN0aW9uc1tpbmRleF0gPSB7IHR5cGU6IEFjdGlvblR5cGUuUEVOLCB2YWx1ZTogQ0xFQVIgfVxyXG5cclxuICAgICMgUGVuY2lsIGNsZWFyIGJ1dHRvblxyXG4gICAgaW5kZXggPSAoUEVOQ0lMX0NMRUFSX1BPU19ZICogOSkgKyBQRU5DSUxfQ0xFQVJfUE9TX1hcclxuICAgIEBhY3Rpb25zW2luZGV4XSA9IHsgdHlwZTogQWN0aW9uVHlwZS5QRU5DSUwsIHZhbHVlOiBDTEVBUiB9XHJcblxyXG4gICAgIyBNZW51IGJ1dHRvblxyXG4gICAgaW5kZXggPSAoTUVOVV9QT1NfWSAqIDkpICsgTUVOVV9QT1NfWFxyXG4gICAgQGFjdGlvbnNbaW5kZXhdID0geyB0eXBlOiBBY3Rpb25UeXBlLk1FTlUgfVxyXG5cclxuICAgICMgVW5kbyBidXR0b25cclxuICAgIGluZGV4ID0gKFVORE9fUE9TX1kgKiA5KSArIFVORE9fUE9TX1hcclxuICAgIEBhY3Rpb25zW2luZGV4XSA9IHsgdHlwZTogQWN0aW9uVHlwZS5VTkRPIH1cclxuXHJcbiAgICAjIFJlZG8gYnV0dG9uXHJcbiAgICBpbmRleCA9IChSRURPX1BPU19ZICogOSkgKyBSRURPX1BPU19YXHJcbiAgICBAYWN0aW9uc1tpbmRleF0gPSB7IHR5cGU6IEFjdGlvblR5cGUuUkVETyB9XHJcblxyXG4gICAgIyBNb2RlIHN3aXRjaFxyXG4gICAgZm9yIGkgaW4gWyhNT0RFX1BPU19ZICogOSkgKyBNT0RFX1NUQVJUX1BPU19YLi4oTU9ERV9QT1NfWSAqIDkpICsgTU9ERV9FTkRfUE9TX1hdXHJcbiAgICAgIEBhY3Rpb25zW2ldID0geyB0eXBlOiBBY3Rpb25UeXBlLk1PREUgfVxyXG5cclxuICAgICMgQ2hlY2sgYnV0dG9uXHJcbiAgICBpbmRleCA9IChDSEVDS19QT1NfWSAqIDkpICsgQ0hFQ0tfUE9TX1hcclxuICAgIEBhY3Rpb25zW2luZGV4XSA9IHsgdHlwZTogQWN0aW9uVHlwZS5DSEVDSyB9XHJcblxyXG4gICAgcmV0dXJuXHJcblxyXG4gIHJlc2V0U3RhdGU6IC0+XHJcbiAgICBAbW9kZSA9IE1vZGVUeXBlLlZJU0lCSUxJVFlcclxuICAgIEBwZW5WYWx1ZSA9IE5PTkVcclxuICAgIEB2aXNpYmlsaXR5WCA9IC0xXHJcbiAgICBAdmlzaWJpbGl0eVkgPSAtMVxyXG4gICAgQHByZWZlclBlbmNpbCA9IGZhbHNlXHJcbiAgICBAc3Ryb25nTGlua3MgPSBbXVxyXG4gICAgQHdlYWtMaW5rcyA9IFtdXHJcbiAgICBAaGlnaGxpZ2h0aW5nVmFsdWVzID0gZmFsc2VcclxuICAgIEBsYXN0VmFsdWVUYXBNUyA9IG5vdygpIC0gRE9VQkxFX1RBUF9JTlRFUlZBTF9NUyAgIyBFbnN1cmUgdGhlIG5leHQgdGFwIGlzIG5vdCBhIGRvdWJsZSB0YXBcclxuICAgIEBjZWxlYnJhdGlvbkNvdW50ID0gLTEgICAgICAgICAgICAgICAgICAgICAgICAgICAgIyAtMSA9IG5ldmVyIHJ1biwgMCA9IGRvbmUsID4gMCA9IHJ1bm5pbmdcclxuXHJcbiAgIyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgIyBSZW5kZXJpbmdcclxuXHJcbiAgY2VsZWJyYXRlOiAtPlxyXG4gICAgQGRyYXcoKVxyXG4gICAgaWYgQGNlbGVicmF0aW9uQ291bnQgPiAwXHJcbiAgICAgIC0tQGNlbGVicmF0aW9uQ291bnRcclxuICAgICAgc2V0VGltZW91dCA9PlxyXG4gICAgICAgIEBjZWxlYnJhdGUoKVxyXG4gICAgICAsIENFTEVCUkFUSU9OX0lOVEVSVkFMX01TXHJcblxyXG4gIGNob29zZUNlbGVicmF0aW9uQ29sb3I6ICh2YWx1ZSkgLT5cclxuICAgIGNvbG9yID0gbnVsbFxyXG4gICAgaWYgdmFsdWUgPiAwIGFuZCBAY2VsZWJyYXRpb25Db3VudCA+IDBcclxuICAgICAgaW5kZXggPSAodmFsdWUgKyBAY2VsZWJyYXRpb25Db3VudCAtIDIpICUgOFxyXG4gICAgICBjb2xvciA9IENFTEVCUkFUSU9OX0NPTE9SU1tpbmRleF1cclxuICAgIHJldHVybiBjb2xvclxyXG5cclxuICBjaG9vc2VCYWNrZ3JvdW5kQ29sb3I6IChpLCBqLCB2YWx1ZSwgbG9ja2VkLCBtYXJrcykgLT5cclxuICAgIGNvbG9yID0gbnVsbFxyXG5cclxuICAgICMgTG9ja2VkIGNlbGxzXHJcbiAgICBpZiBsb2NrZWRcclxuICAgICAgY29sb3IgPSBDb2xvci5iYWNrZ3JvdW5kTG9ja2VkXHJcblxyXG4gICAgIyBPdmVycmlkZSB3aXRoIGFueSBoaWdobGlnaHRpbmdcclxuICAgIHN3aXRjaCBAbW9kZVxyXG4gICAgICB3aGVuIE1vZGVUeXBlLlZJU0lCSUxJVFlcclxuICAgICAgICBpZiAoQHZpc2liaWxpdHlYICE9IC0xKSAmJiAoQHZpc2liaWxpdHlZICE9IC0xKVxyXG4gICAgICAgICAgaWYgKGkgPT0gQHZpc2liaWxpdHlYKSAmJiAoaiA9PSBAdmlzaWJpbGl0eVkpXHJcbiAgICAgICAgICAgIGlmIGxvY2tlZFxyXG4gICAgICAgICAgICAgIGNvbG9yID0gQ29sb3IuYmFja2dyb3VuZExvY2tlZFNlbGVjdGVkXHJcbiAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICBjb2xvciA9IENvbG9yLmJhY2tncm91bmRTZWxlY3RlZFxyXG4gICAgICAgICAgZWxzZSBpZiBAY29uZmxpY3RzKGksIGosIEB2aXNpYmlsaXR5WCwgQHZpc2liaWxpdHlZKVxyXG4gICAgICAgICAgICBpZiBsb2NrZWRcclxuICAgICAgICAgICAgICBjb2xvciA9IENvbG9yLmJhY2tncm91bmRMb2NrZWRDb25mbGljdGVkXHJcbiAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICBjb2xvciA9IENvbG9yLmJhY2tncm91bmRDb25mbGljdGVkXHJcbiAgICAgIHdoZW4gTW9kZVR5cGUuUEVOXHJcbiAgICAgICAgaWYgQGhpZ2hsaWdodGluZ1ZhbHVlcyBhbmQgQHBlblZhbHVlID09IHZhbHVlIGFuZCB2YWx1ZSAhPSAwXHJcbiAgICAgICAgICBjb2xvciA9IENvbG9yLmJhY2tncm91bmRTZWxlY3RlZFxyXG4gICAgICB3aGVuIE1vZGVUeXBlLlBFTkNJTFxyXG4gICAgICAgIGlmIEBoaWdobGlnaHRpbmdWYWx1ZXMgYW5kIHZhbHVlID09IDAgYW5kIEBwZW5WYWx1ZSBpbiBtYXJrc1xyXG4gICAgICAgICAgY29sb3IgPSBDb2xvci5iYWNrZ3JvdW5kU2VsZWN0ZWRcclxuXHJcbiAgICAjIE92ZXJyaWRlIGlmIGNlbGVicmF0aW5nXHJcbiAgICBpZiBAY2VsZWJyYXRpb25Db3VudCA+IDBcclxuICAgICAgY29sb3IgPSBAY2hvb3NlQ2VsZWJyYXRpb25Db2xvcih2YWx1ZSlcclxuXHJcbiAgICByZXR1cm4gY29sb3JcclxuXHJcbiAgbWFya09mZnNldDogKHYpIC0+XHJcbiAgICB7XHJcbiAgICAgIHg6ICgodiAtIDEpICUgMykgKiBAY2VsbFNpemUgLyAzICsgQGNlbGxTaXplIC8gNlxyXG4gICAgICB5OiBNYXRoLmZsb29yKCh2IC0gMSkgLyAzKSAqIEBjZWxsU2l6ZSAvIDMgKyBAY2VsbFNpemUgLyA2XHJcbiAgICB9XHJcblxyXG4gIGRyYXdDZWxsOiAoeCwgeSwgYmFja2dyb3VuZENvbG9yLCBzLCBmb250LCBjb2xvcikgLT5cclxuICAgIHB4ID0geCAqIEBjZWxsU2l6ZVxyXG4gICAgcHkgPSB5ICogQGNlbGxTaXplXHJcbiAgICBpZiBiYWNrZ3JvdW5kQ29sb3IgIT0gbnVsbFxyXG4gICAgICBAYXBwLmRyYXdGaWxsKHB4LCBweSwgQGNlbGxTaXplLCBAY2VsbFNpemUsIGJhY2tncm91bmRDb2xvcilcclxuICAgIEBhcHAuZHJhd1RleHRDZW50ZXJlZChzLCBweCArIChAY2VsbFNpemUgLyAyKSwgcHkgKyAoQGNlbGxTaXplIC8gMiksIGZvbnQsIGNvbG9yKVxyXG4gICAgcmV0dXJuXHJcblxyXG4gIGRyYXdGbGFzaENlbGw6ICh4LCB5KSAtPlxyXG4gICAgcHggPSB4ICogQGNlbGxTaXplXHJcbiAgICBweSA9IHkgKiBAY2VsbFNpemVcclxuICAgIEBhcHAuZHJhd0ZpbGwocHgsIHB5LCBAY2VsbFNpemUsIEBjZWxsU2l6ZSwgXCJibGFja1wiKVxyXG4gICAgcmV0dXJuXHJcblxyXG4gIGRyYXdVbnNvbHZlZENlbGw6ICh4LCB5LCBiYWNrZ3JvdW5kQ29sb3IsIG1hcmtzKSAtPlxyXG4gICAgcHggPSB4ICogQGNlbGxTaXplXHJcbiAgICBweSA9IHkgKiBAY2VsbFNpemVcclxuICAgIGlmIGJhY2tncm91bmRDb2xvciAhPSBudWxsXHJcbiAgICAgIEBhcHAuZHJhd0ZpbGwocHgsIHB5LCBAY2VsbFNpemUsIEBjZWxsU2l6ZSwgYmFja2dyb3VuZENvbG9yKVxyXG4gICAgZm9yIG0gaW4gbWFya3NcclxuICAgICAgb2Zmc2V0ID0gQG1hcmtPZmZzZXQobS52YWx1ZSlcclxuICAgICAgbXggPSBweCArIG9mZnNldC54XHJcbiAgICAgIG15ID0gcHkgKyBvZmZzZXQueVxyXG4gICAgICB0ZXh0ID0gU3RyaW5nKG0udmFsdWUpXHJcbiAgICAgIEBhcHAuZHJhd1RleHRDZW50ZXJlZCh0ZXh0LCBteCwgbXksIEBmb250cy5wZW5jaWwsIG0uY29sb3IpXHJcbiAgICByZXR1cm5cclxuXHJcbiAgZHJhd1NvbHZlZENlbGw6ICh4LCB5LCBiYWNrZ3JvdW5kQ29sb3IsIGNvbG9yLCB2YWx1ZSkgLT5cclxuICAgIHB4ID0geCAqIEBjZWxsU2l6ZVxyXG4gICAgcHkgPSB5ICogQGNlbGxTaXplXHJcbiAgICBpZiBiYWNrZ3JvdW5kQ29sb3IgIT0gbnVsbFxyXG4gICAgICBAYXBwLmRyYXdGaWxsKHB4LCBweSwgQGNlbGxTaXplLCBAY2VsbFNpemUsIGJhY2tncm91bmRDb2xvcilcclxuICAgIEBhcHAuZHJhd1RleHRDZW50ZXJlZChTdHJpbmcodmFsdWUpLCBweCArIChAY2VsbFNpemUgLyAyKSwgcHkgKyAoQGNlbGxTaXplIC8gMiksIEBmb250cy5wZW4sIGNvbG9yKVxyXG4gICAgcmV0dXJuXHJcblxyXG4gIGRyYXdHcmlkOiAob3JpZ2luWCwgb3JpZ2luWSwgc2l6ZSwgc29sdmVkID0gZmFsc2UpIC0+XHJcbiAgICBsZWZ0ID0gQGNlbGxTaXplICogKG9yaWdpblggKyAwKVxyXG4gICAgcmlnaHQgPSBAY2VsbFNpemUgKiAob3JpZ2luWCArIHNpemUpXHJcbiAgICB0b3AgPSBAY2VsbFNpemUgKiAob3JpZ2luWSArIDApXHJcbiAgICBib3R0b20gPSBAY2VsbFNpemUgKiAob3JpZ2luWSArIHNpemUpXHJcblxyXG4gICAgZm9yIGkgaW4gWzAuLnNpemVdXHJcbiAgICAgIGNvbG9yID0gaWYgc29sdmVkIHRoZW4gXCJncmVlblwiIGVsc2UgXCJibGFja1wiXHJcbiAgICAgIGxpbmVXaWR0aCA9IEBsaW5lV2lkdGhUaGluXHJcbiAgICAgIGlmICgoc2l6ZSA9PSAxKSB8fCAoaSAlIDMpID09IDApXHJcbiAgICAgICAgbGluZVdpZHRoID0gQGxpbmVXaWR0aFRoaWNrXHJcblxyXG4gICAgICAjIEhvcml6b250YWwgbGluZXNcclxuICAgICAgeSA9IEBjZWxsU2l6ZSAqIChvcmlnaW5ZICsgaSlcclxuICAgICAgQGFwcC5kcmF3TGluZShsZWZ0LCB5LCByaWdodCwgeSwgY29sb3IsIGxpbmVXaWR0aClcclxuXHJcbiAgICAgICMgVmVydGljYWwgbGluZXNcclxuICAgICAgeCA9IEBjZWxsU2l6ZSAqIChvcmlnaW5YICsgaSlcclxuICAgICAgQGFwcC5kcmF3TGluZSh4LCB0b3AsIHgsIGJvdHRvbSwgY29sb3IsIGxpbmVXaWR0aClcclxuICAgIHJldHVyblxyXG5cclxuICBkcmF3TGluazogKHN0YXJ0WCwgc3RhcnRZLCBlbmRYLCBlbmRZLCBjb2xvciwgbGluZVdpZHRoLCB2KSAtPlxyXG4gICAgb2Zmc2V0ID0gQG1hcmtPZmZzZXQodilcclxuICAgIHgxID0gc3RhcnRYICogQGNlbGxTaXplICsgb2Zmc2V0LnhcclxuICAgIHkxID0gc3RhcnRZICogQGNlbGxTaXplICsgb2Zmc2V0LnlcclxuICAgIHgyID0gZW5kWCAqIEBjZWxsU2l6ZSArIG9mZnNldC54XHJcbiAgICB5MiA9IGVuZFkgKiBAY2VsbFNpemUgKyBvZmZzZXQueVxyXG5cclxuICAgICMgRW5zdXJlIHRoYXQgdGhlIGFyYyBjdXJ2ZXMgaW53YXJkIGZvciBtYXJrcyBuZWFyZXIgdGhlIG91dHNpZGUgYW5kIGN1cnZlcyBvdXR3YXJkIGZvciBtYXJrcyBuZWFyZXIgdGhlIGNlbnRlci5cclxuICAgIFxyXG4gICAgIyBJZiB0aGUgZGlzdGFuY2UgZnJvbSB0aGUgY2VudGVyIHRvIHRoZSBtaWRwb2ludCBvZiB0aGUgbGluZSBpcyBncmVhdGVyIHRoYW4gdGhlIGRpc3RhbmNlIGZyb20gdGhlIGNlbnRlciB0byB0aGUgbWlkcG9pbnQgb2ZcclxuICAgICMgdGhlIHNxdWFyZXMsIHRoZW4gdGhlIGxpbmUgY3VydmVzIHRvd2FyZCB0aGUgY2VudGVyLlxyXG4gICAgbGluZU1pZFggPSAoeDEgKyB4MikgLyAyXHJcbiAgICBsaW5lTWlkWSA9ICh5MSArIHkyKSAvIDJcclxuICAgIHNxdWFyZXNNaWRYID0gQGNlbGxTaXplICogKHN0YXJ0WCArIGVuZFggKyAxKSAvIDJcclxuICAgIHNxdWFyZXNNaWRZID0gQGNlbGxTaXplICogKHN0YXJ0WSArIGVuZFkgKyAxKSAvIDJcclxuXHJcbiAgICBsaW5lRGlzdDIgPSAoQGNlbnRlclggLSBsaW5lTWlkWCkgKiAoQGNlbnRlclggLSBsaW5lTWlkWCkgKyAoQGNlbnRlclkgLSBsaW5lTWlkWSkgKiAoQGNlbnRlclkgLSBsaW5lTWlkWSlcclxuICAgIHNxdWFyZXNEaXN0MiA9IChAY2VudGVyWCAtIHNxdWFyZXNNaWRYKSAqIChAY2VudGVyWCAtIHNxdWFyZXNNaWRYKSArIChAY2VudGVyWSAtIHNxdWFyZXNNaWRZKSAqIChAY2VudGVyWSAtIHNxdWFyZXNNaWRZKVxyXG5cclxuICAgIGNlbnRlcklzTGVmdCA9IChAY2VudGVyWCAtIHgxKSAqICh5MiAtIHkxKSAtIChAY2VudGVyWSAtIHkxKSAqICh4MiAtIHgxKSA8IDBcclxuXHJcbiAgICAjIFdoZW4gdGhlIGdyaWQgY2VudGVyIGlzIGxlZnQgb2YgdGhlIGxpbmUsIHRoZW4gdGhlIGN1cnZlIGlzIGF1dG9tYXRpY2FsbHkgb3V0d2FyZCwgc28gd2UgaGF2ZSB0byBzd2FwIGlmIHdlIHdhbnQgYW4gaW53YXJkXHJcbiAgICAjIGN1cnZlLCBhbmQgdmljZSB2ZXJzYVxyXG4gICAgaWYgKGNlbnRlcklzTGVmdCAmJiBsaW5lRGlzdDIgPiBzcXVhcmVzRGlzdDIpIHx8ICghY2VudGVySXNMZWZ0ICYmIGxpbmVEaXN0MiA8IHNxdWFyZXNEaXN0MilcclxuICAgICAgW3gxLCB4Ml0gPSBbeDIsIHgxXVxyXG4gICAgICBbeTEsIHkyXSA9IFt5MiwgeTFdXHJcblxyXG4gICAgY3VydmF0dXJlID0gMi41ICMgMi41IGdpdmVzIHRoZSBtb3N0IGN1cnZlIHdpdGhvdXQgb3ZlcmxhcHBpbmcgb3RoZXIgY2VsbHNcclxuICAgIHIgPSBjdXJ2YXR1cmUgKiBNYXRoLnNxcnQoKHgyIC0geDEpICogKHgyIC0geDEpICsgKHkyIC0geTEpICogKHkyIC0geTEpKVxyXG4gICAgQGFwcC5kcmF3QXJjKHgxLCB5MSwgeDIsIHkyLCByLCBjb2xvciwgbGluZVdpZHRoKVxyXG4gICAgQGFwcC5kcmF3UG9pbnQoeDEsIHkxLCBAbGlua0RvdFJhZGl1cywgY29sb3IpXHJcbiAgICBAYXBwLmRyYXdQb2ludCh4MiwgeTIsIEBsaW5rRG90UmFkaXVzLCBjb2xvcilcclxuXHJcbiAgZHJhdzogKGZsYXNoWCwgZmxhc2hZKSAtPlxyXG4gICAgY29uc29sZS5sb2cgXCJkcmF3KClcIlxyXG5cclxuICAgICMgQ2xlYXIgc2NyZWVuIHRvIGJsYWNrXHJcbiAgICBAYXBwLmRyYXdGaWxsKDAsIDAsIEBjYW52YXMud2lkdGgsIEBjYW52YXMuaGVpZ2h0LCBcImJsYWNrXCIpXHJcblxyXG4gICAgIyBNYWtlIHdoaXRlIHBob25lLXNoYXBlZCBiYWNrZ3JvdW5kXHJcbiAgICBAYXBwLmRyYXdGaWxsKDAsIDAsIEBjZWxsU2l6ZSAqIDksIEBjYW52YXMuaGVpZ2h0LCBcIndoaXRlXCIpXHJcblxyXG4gICAgIyBEcmF3IGJvYXJkIG51bWJlcnNcclxuICAgIGZvciBqIGluIFswLi4uOV1cclxuICAgICAgZm9yIGkgaW4gWzAuLi45XVxyXG4gICAgICAgIGlmIChpID09IGZsYXNoWCkgJiYgKGogPT0gZmxhc2hZKVxyXG4gICAgICAgICAgIyBEcmF3IGZsYXNoXHJcbiAgICAgICAgICBAZHJhd0ZsYXNoQ2VsbChpLCBqKVxyXG4gICAgICAgIGVsc2VcclxuICAgICAgICAgICMgRHJhdyBzb2x2ZWQgb3IgdW5zb2x2ZWQgY2VsbFxyXG4gICAgICAgICAgY2VsbCA9IEBnYW1lLmdyaWRbaV1bal1cclxuICAgICAgICAgIG1hcmtzID0gQGdhbWUucGVuY2lsTWFya3MoaSwgailcclxuXHJcbiAgICAgICAgICAjIERldGVybWluZSBiYWNrZ3JvdW5kIGNvbG9yXHJcbiAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3IgPSBAY2hvb3NlQmFja2dyb3VuZENvbG9yKGksIGosIGNlbGwudmFsdWUsIGNlbGwubG9ja2VkLCBtYXJrcylcclxuXHJcbiAgICAgICAgICBpZiBjZWxsLnZhbHVlID09IDBcclxuICAgICAgICAgICAgaWYgQG1vZGUgPT0gTW9kZVR5cGUuQ0hFQ0tcclxuICAgICAgICAgICAgICBjb2xvcmVkTWFya3MgPSAoeyB2YWx1ZTogbSwgY29sb3I6IGlmIEBnYW1lLm1hcmtJc0dvb2QoaSwgaiwgbSkgdGhlbiBDb2xvci5wZW5jaWwgZWxzZSBDb2xvci5lcnJvciB9IGZvciBtIGluIG1hcmtzKVxyXG4gICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgY29sb3JlZE1hcmtzID0gKHsgdmFsdWU6IG0sIGNvbG9yOiBDb2xvci5wZW5jaWwgfSBmb3IgbSBpbiBtYXJrcylcclxuICAgICAgICAgICAgQGRyYXdVbnNvbHZlZENlbGwoaSwgaiwgYmFja2dyb3VuZENvbG9yLCBjb2xvcmVkTWFya3MpXHJcbiAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIGlmIEBtb2RlID09IE1vZGVUeXBlLkNIRUNLXHJcbiAgICAgICAgICAgICAgdGV4dENvbG9yID0gaWYgQGdhbWUuc29sdXRpb25baV1bal0gPT0gY2VsbC52YWx1ZSB0aGVuIENvbG9yLnZhbHVlIGVsc2UgQ29sb3IuZXJyb3JcclxuICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgIHRleHRDb2xvciA9IGlmIGNlbGwuZXJyb3IgdGhlbiBDb2xvci5lcnJvciBlbHNlIENvbG9yLnZhbHVlXHJcbiAgICAgICAgICAgIEBkcmF3U29sdmVkQ2VsbChpLCBqLCBiYWNrZ3JvdW5kQ29sb3IsIHRleHRDb2xvciwgY2VsbC52YWx1ZSlcclxuXHJcbiAgICAjIERyYXcgbGlua3MgaW4gTElOS1MgbW9kZVxyXG4gICAgaWYgQG1vZGUgaXMgTW9kZVR5cGUuTElOS1NcclxuICAgICAgZm9yIGxpbmsgaW4gQHN0cm9uZ0xpbmtzXHJcbiAgICAgICAgQGRyYXdMaW5rKGxpbmtbMF0ueCwgbGlua1swXS55LCBsaW5rWzFdLngsIGxpbmtbMV0ueSwgQ29sb3IubGlua3MsIEBsaW5lV2lkdGhUaGljaywgQHBlblZhbHVlKVxyXG4gICAgICBmb3IgbGluayBpbiBAd2Vha0xpbmtzXHJcbiAgICAgICAgQGRyYXdMaW5rKGxpbmtbMF0ueCwgbGlua1swXS55LCBsaW5rWzFdLngsIGxpbmtbMV0ueSwgQ29sb3IubGlua3MsIEBsaW5lV2lkdGhUaGluLCBAcGVuVmFsdWUpXHJcblxyXG4gICAgIyBEcmF3IHBlbiBhbmQgcGVuY2lsIG51bWJlciBidXR0b25zXHJcbiAgICBkb25lID0gQGdhbWUuZG9uZSgpXHJcbiAgICBmb3IgaiBpbiBbMC4uLjNdXHJcbiAgICAgIGZvciBpIGluIFswLi4uM11cclxuICAgICAgICBjdXJyZW50VmFsdWUgPSAoaiAqIDMpICsgaSArIDFcclxuICAgICAgICBjdXJyZW50VmFsdWVTdHJpbmcgPSBTdHJpbmcoY3VycmVudFZhbHVlKVxyXG4gICAgICAgIHZhbHVlQ29sb3IgPSBDb2xvci52YWx1ZVxyXG4gICAgICAgIHBlbmNpbENvbG9yID0gQ29sb3IucGVuY2lsXHJcbiAgICAgICAgaWYgZG9uZVsoaiAqIDMpICsgaV1cclxuICAgICAgICAgIHZhbHVlQ29sb3IgPSBDb2xvci5kb25lXHJcbiAgICAgICAgICBwZW5jaWxDb2xvciA9IENvbG9yLmRvbmVcclxuXHJcbiAgICAgICAgdmFsdWVCYWNrZ3JvdW5kQ29sb3IgPSBudWxsXHJcbiAgICAgICAgcGVuY2lsQmFja2dyb3VuZENvbG9yID0gbnVsbFxyXG4gICAgICAgIGlmIEBwZW5WYWx1ZSA9PSBjdXJyZW50VmFsdWVcclxuICAgICAgICAgIGlmIEBtb2RlIGlzIE1vZGVUeXBlLlBFTkNJTCBvciBAbW9kZSBpcyBNb2RlVHlwZS5MSU5LU1xyXG4gICAgICAgICAgICBwZW5jaWxCYWNrZ3JvdW5kQ29sb3IgPSBDb2xvci5iYWNrZ3JvdW5kU2VsZWN0ZWRcclxuICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgdmFsdWVCYWNrZ3JvdW5kQ29sb3IgPSBDb2xvci5iYWNrZ3JvdW5kU2VsZWN0ZWRcclxuXHJcbiAgICAgICAgQGRyYXdDZWxsKFBFTl9QT1NfWCArIGksIFBFTl9QT1NfWSArIGosIHZhbHVlQmFja2dyb3VuZENvbG9yLCBjdXJyZW50VmFsdWVTdHJpbmcsIEBmb250cy5wZW4sIHZhbHVlQ29sb3IpXHJcbiAgICAgICAgQGRyYXdDZWxsKFBFTkNJTF9QT1NfWCArIGksIFBFTkNJTF9QT1NfWSArIGosIHBlbmNpbEJhY2tncm91bmRDb2xvciwgY3VycmVudFZhbHVlU3RyaW5nLCBAZm9udHMucGVuLCBwZW5jaWxDb2xvcilcclxuXHJcbiAgICAjIERyYXcgcGVuIGFuZCBwZW5jaWwgQ0xFQVIgYnV0dG9uc1xyXG4gICAgdmFsdWVCYWNrZ3JvdW5kQ29sb3IgPSBudWxsXHJcbiAgICBwZW5jaWxCYWNrZ3JvdW5kQ29sb3IgPSBudWxsXHJcbiAgICBpZiBAcGVuVmFsdWUgPT0gQ0xFQVJcclxuICAgICAgICBpZiBAbW9kZSBpcyBNb2RlVHlwZS5QRU5DSUxcclxuICAgICAgICAgICAgcGVuY2lsQmFja2dyb3VuZENvbG9yID0gQ29sb3IuYmFja2dyb3VuZFNlbGVjdGVkXHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICB2YWx1ZUJhY2tncm91bmRDb2xvciA9IENvbG9yLmJhY2tncm91bmRTZWxlY3RlZFxyXG5cclxuICAgIEBkcmF3Q2VsbChQRU5fQ0xFQVJfUE9TX1gsIFBFTl9DTEVBUl9QT1NfWSwgdmFsdWVCYWNrZ3JvdW5kQ29sb3IsIFwiQ1wiLCBAZm9udHMucGVuLCBDb2xvci5lcnJvcilcclxuICAgIEBkcmF3Q2VsbChQRU5DSUxfQ0xFQVJfUE9TX1gsIFBFTkNJTF9DTEVBUl9QT1NfWSwgcGVuY2lsQmFja2dyb3VuZENvbG9yLCBcIkNcIiwgQGZvbnRzLnBlbiwgQ29sb3IuZXJyb3IpXHJcblxyXG4gICAgIyBEcmF3IG1vZGVcclxuICAgIHN3aXRjaCBAbW9kZVxyXG4gICAgICB3aGVuIE1vZGVUeXBlLlZJU0lCSUxJVFlcclxuICAgICAgICBtb2RlQ29sb3IgPSBDb2xvci5tb2RlU2VsZWN0XHJcbiAgICAgICAgbW9kZVRleHQgPSBcIkhpZ2hsaWdodGluZ1wiXHJcbiAgICAgIHdoZW4gTW9kZVR5cGUuUEVOQ0lMXHJcbiAgICAgICAgbW9kZUNvbG9yID0gQ29sb3IubW9kZVBlbmNpbFxyXG4gICAgICAgIG1vZGVUZXh0ID0gXCJQZW5jaWxcIlxyXG4gICAgICB3aGVuIE1vZGVUeXBlLlBFTlxyXG4gICAgICAgIG1vZGVDb2xvciA9IENvbG9yLm1vZGVQZW5cclxuICAgICAgICBtb2RlVGV4dCA9IFwiUGVuXCJcclxuICAgICAgd2hlbiBNb2RlVHlwZS5MSU5LU1xyXG4gICAgICAgIG1vZGVDb2xvciA9IENvbG9yLm1vZGVMaW5rc1xyXG4gICAgICAgIG1vZGVUZXh0ID0gXCJMaW5rc1wiXHJcbiAgICAgIHdoZW4gTW9kZVR5cGUuQ0hFQ0tcclxuICAgICAgICBtb2RlQ29sb3IgPSBDb2xvci5tb2RlQ2hlY2tcclxuICAgICAgICBtb2RlVGV4dCA9IFwiQ2hlY2tpbmdcIlxyXG5cclxuICAgIEBkcmF3Q2VsbChNT0RFX0NFTlRFUl9QT1NfWCwgTU9ERV9QT1NfWSwgbnVsbCwgbW9kZVRleHQsIEBmb250cy5tZW51LCBtb2RlQ29sb3IpXHJcblxyXG4gICAgQGRyYXdDZWxsKE1FTlVfUE9TX1gsIE1FTlVfUE9TX1ksIG51bGwsIFwiTWVudVwiLCBAZm9udHMubWVudSwgQ29sb3IubWVudSlcclxuICAgIEBkcmF3Q2VsbChVTkRPX1BPU19YLCBVTkRPX1BPU19ZLCBudWxsLCBcIlxcdXsyNWM0fVwiLCBAZm9udHMubWVudSwgQ29sb3IubWVudSkgaWYgKEBnYW1lLnVuZG9Kb3VybmFsLmxlbmd0aCA+IDApXHJcbiAgICBAZHJhd0NlbGwoUkVET19QT1NfWCwgUkVET19QT1NfWSwgbnVsbCwgXCJcXHV7MjViYX1cIiwgQGZvbnRzLm1lbnUsIENvbG9yLm1lbnUpIGlmIChAZ2FtZS5yZWRvSm91cm5hbC5sZW5ndGggPiAwKVxyXG4gICAgQGRyYXdDZWxsKENIRUNLX1BPU19YLCBDSEVDS19QT1NfWSwgbnVsbCwgXCJcXHV7MjcxNH1cIiwgQGZvbnRzLm1lbnUsIENvbG9yLmVycm9yKVxyXG5cclxuICAgICMgTWFrZSB0aGUgZ3JpZHNcclxuICAgIEBkcmF3R3JpZCgwLCAwLCA5LCBAZ2FtZS5zb2x2ZWQpXHJcbiAgICBAZHJhd0dyaWQoUEVOX1BPU19YLCBQRU5fUE9TX1ksIDMpXHJcbiAgICBAZHJhd0dyaWQoUEVOQ0lMX1BPU19YLCBQRU5DSUxfUE9TX1ksIDMpXHJcbiAgICBAZHJhd0dyaWQoUEVOX0NMRUFSX1BPU19YLCBQRU5fQ0xFQVJfUE9TX1ksIDEpXHJcbiAgICBAZHJhd0dyaWQoUEVOQ0lMX0NMRUFSX1BPU19YLCBQRU5DSUxfQ0xFQVJfUE9TX1ksIDEpXHJcblxyXG4gICAgIyBJZiB0aGUgZ2FtZSBpcyBzb2x2ZWQsIHRoZW4gc3RhcnQgdGhlIGNlbGVicmF0aW9uXHJcbiAgICBpZiBAZ2FtZS5zb2x2ZWQgYW5kIEBjZWxlYnJhdGlvbkNvdW50IDwgMFxyXG4gICAgICBAY2VsZWJyYXRpb25Db3VudCA9IENFTEVCUkFUSU9OX1NURVBTXHJcbiAgICAgIHNldFRpbWVvdXQgPT5cclxuICAgICAgICBAY2VsZWJyYXRlKClcclxuICAgICAgLCBDRUxFQlJBVElPTl9JTlRFUlZBTF9NU1xyXG5cclxuXHJcbiAgIyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgIyBJbnB1dFxyXG5cclxuICAjIERldGVybWluZXMgaWYgdGhlIGludGVydmFsIGlzIHNob3J0IGVub3VnaCB0byBjb25zaWRlciBhbiB0YXAgdG8gYmUgYSBkb3VibGUgdGFwLlxyXG4gIGRvdWJsZVRhcERldGVjdGVkOiAtPlxyXG4gICAgIyBEb3VibGUgdGFwIGFsc28gZGVwZW5kcyBvbiBvdGhlciBjb250ZXh0LiBUaGlzIGp1c3QgbWVhc3VyZXMgdGhlIHRpbWUuXHJcbiAgICBkdCA9IG5vdygpIC0gQGxhc3RWYWx1ZVRhcE1TXHJcbiAgICByZXR1cm4gZHQgPCBET1VCTEVfVEFQX0lOVEVSVkFMX01TXHJcblxyXG4gIG5ld0dhbWU6IChkaWZmaWN1bHR5KSAtPlxyXG4gICAgY29uc29sZS5sb2cgXCJTdWRva3VWaWV3Lm5ld0dhbWUoI3tkaWZmaWN1bHR5fSlcIlxyXG4gICAgQHJlc2V0U3RhdGUoKVxyXG4gICAgQGdhbWUubmV3R2FtZShkaWZmaWN1bHR5KVxyXG5cclxuICByZXNldDogLT5cclxuICAgIEByZXNldFN0YXRlKClcclxuICAgIEBnYW1lLnJlc2V0KClcclxuXHJcbiAgaW1wb3J0OiAoaW1wb3J0U3RyaW5nKSAtPlxyXG4gICAgQHJlc2V0U3RhdGUoKVxyXG4gICAgcmV0dXJuIEBnYW1lLmltcG9ydChpbXBvcnRTdHJpbmcpXHJcblxyXG4gIGV4cG9ydDogLT5cclxuICAgIHJldHVybiBAZ2FtZS5leHBvcnQoKVxyXG5cclxuICBob2xlQ291bnQ6IC0+XHJcbiAgICByZXR1cm4gQGdhbWUuaG9sZUNvdW50KClcclxuXHJcbiAgaGFuZGxlU2VsZWN0QWN0aW9uOiAoYWN0aW9uKSAtPlxyXG4gICAgc3dpdGNoIEBtb2RlXHJcbiAgICAgIHdoZW4gTW9kZVR5cGUuVklTSUJJTElUWVxyXG4gICAgICAgIGlmIChAdmlzaWJpbGl0eVggPT0gYWN0aW9uLngpICYmIChAdmlzaWJpbGl0eVkgPT0gYWN0aW9uLnkpXHJcbiAgICAgICAgICBAdmlzaWJpbGl0eVggPSAtMVxyXG4gICAgICAgICAgQHZpc2liaWxpdHlZID0gLTFcclxuICAgICAgICBlbHNlXHJcbiAgICAgICAgICBAdmlzaWJpbGl0eVggPSBhY3Rpb24ueFxyXG4gICAgICAgICAgQHZpc2liaWxpdHlZID0gYWN0aW9uLnlcclxuICAgICAgICByZXR1cm4gW11cclxuICAgICAgd2hlbiBNb2RlVHlwZS5QRU5DSUxcclxuICAgICAgICBpZiBAcGVuVmFsdWUgPT0gQ0xFQVJcclxuICAgICAgICAgIEBnYW1lLmNsZWFyUGVuY2lsKGFjdGlvbi54LCBhY3Rpb24ueSlcclxuICAgICAgICBlbHNlIGlmIEBwZW5WYWx1ZSAhPSBOT05FXHJcbiAgICAgICAgICBAZ2FtZS50b2dnbGVQZW5jaWwoYWN0aW9uLngsIGFjdGlvbi55LCBAcGVuVmFsdWUpXHJcbiAgICAgICAgcmV0dXJuIFsgYWN0aW9uLngsIGFjdGlvbi55IF1cclxuICAgICAgd2hlbiBNb2RlVHlwZS5QRU5cclxuICAgICAgICBpZiBAcGVuVmFsdWUgPT0gQ0xFQVJcclxuICAgICAgICAgIEBnYW1lLnNldFZhbHVlKGFjdGlvbi54LCBhY3Rpb24ueSwgMClcclxuICAgICAgICBlbHNlIGlmIEBwZW5WYWx1ZSAhPSBOT05FXHJcbiAgICAgICAgICBAZ2FtZS5zZXRWYWx1ZShhY3Rpb24ueCwgYWN0aW9uLnksIEBwZW5WYWx1ZSlcclxuICAgICAgICByZXR1cm4gWyBhY3Rpb24ueCwgYWN0aW9uLnkgXVxyXG5cclxuICBoYW5kbGVQZW5jaWxBY3Rpb246IChhY3Rpb24pIC0+XHJcbiAgICAjIEZpcnN0LCBtYWtlIHN1cmUgYW55IFZJU0lCSUxJVFkgYW5kIExJTktTIG1vZGUgc3R1ZmYgaXMgcmVzZXRcclxuICAgIEB2aXNpYmlsaXR5WCA9IC0xXHJcbiAgICBAdmlzaWJpbGl0eVkgPSAtMVxyXG4gICAgQHN0cm9uZ0xpbmtzID0gW11cclxuICAgIEB3ZWFrTGlua3MgPSBbXVxyXG5cclxuICAgIHN3aXRjaCBAbW9kZVxyXG4gICAgICAjIEluIExJTktTLCBhbGwgbGlua3MgYXNzb2NpYXRlZCB3aXRoIHRoZSBudW1iZXIgYXJlIHNob3duLiBDTEVBUiBzaG93cyBub3RoaW5nLlxyXG4gICAgICB3aGVuIE1vZGVUeXBlLkxJTktTXHJcbiAgICAgICAgaWYgKGFjdGlvbi52YWx1ZSA9PSBDTEVBUilcclxuICAgICAgICAgIEBwZW5WYWx1ZSA9IE5PTkVcclxuICAgICAgICAgIEBzdHJvbmdMaW5rcyA9IFtdXHJcbiAgICAgICAgICBAd2Vha0xpbmtzID0gW11cclxuICAgICAgICBlbHNlXHJcbiAgICAgICAgICBAcGVuVmFsdWUgPSBhY3Rpb24udmFsdWVcclxuICAgICAgICAgIHsgc3Ryb25nOiBAc3Ryb25nTGlua3MsIHdlYWs6IEB3ZWFrTGlua3MgfSA9IEBnYW1lLmdldExpbmtzKGFjdGlvbi52YWx1ZSlcclxuXHJcbiAgICAgICMgSW4gUEVOQ0lMLCB0aGUgbW9kZSBpcyBjaGFuZ2VkIHRvIFZJU0lCSUxJVFkgaWYgdGhlIHNlbGVjdGVkIHZhbHVlIGlzIGFscmVhZHkgY3VycmVudCB1bmxlc3MgZG91YmxlIHRhcFxyXG4gICAgICAjIEFsc28sIGlmIGRvdWJsZSB0YXAsIHRoZW4gdHVybiBvbiBoaWdobGlnaHRpbmcgdmFsdWVzXHJcbiAgICAgIHdoZW4gTW9kZVR5cGUuUEVOQ0lMXHJcbiAgICAgICAgaWYgQHBlblZhbHVlID09IGFjdGlvbi52YWx1ZVxyXG4gICAgICAgICAgaWYgQGRvdWJsZVRhcERldGVjdGVkKClcclxuICAgICAgICAgICAgQGhpZ2hsaWdodGluZ1ZhbHVlcyA9IHRydWVcclxuICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgQGhpZ2hsaWdodGluZ1ZhbHVlcyA9IGZhbHNlXHJcbiAgICAgICAgICAgIEBsYXN0VmFsdWVUYXBNUyA9IG5vdygpXHJcbiAgICAgICAgICAgIEBtb2RlID0gTW9kZVR5cGUuVklTSUJJTElUWVxyXG4gICAgICAgICAgICBAcGVuVmFsdWUgPSBOT05FXHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgICAgQGhpZ2hsaWdodGluZ1ZhbHVlcyA9IGZhbHNlXHJcbiAgICAgICAgICBAbGFzdFZhbHVlVGFwTVMgPSBub3coKVxyXG4gICAgICAgICAgQHBlblZhbHVlID0gYWN0aW9uLnZhbHVlXHJcbiAgICAgICAgQHByZWZlclBlbmNpbCA9IHRydWUgIyBNYWtlIHN1cmUgdGhlIGtleWJvYXJkIGlzIGFsc28gaW4gcGVuY2lsIG1vZGVcclxuXHJcbiAgICAgICMgT3RoZXJ3aXNlLCBzd2l0Y2ggdG8gUEVOQ0lMXHJcbiAgICAgIGVsc2VcclxuICAgICAgICAjIEl0IGlzIHBvc3NpYmxlIHRoYXQgdGhlIGZpcnN0IHRhcCBjaGFuZ2VkIHRoZSBtb2RlIHRvIFZJU0lCSUxJVFkgc28gYSBkb3VibGUgdGFwIG11c3QgcHJldGVuZCB0aGF0IGl0IGRpZG4ndFxyXG4gICAgICAgIGlmIEBtb2RlIGlzIE1vZGVUeXBlLlZJU0lCSUxJVFkgYW5kIEBkb3VibGVUYXBEZXRlY3RlZCgpXHJcbiAgICAgICAgICBAaGlnaGxpZ2h0aW5nVmFsdWVzID0gdHJ1ZVxyXG4gICAgICAgIGVsc2VcclxuICAgICAgICAgIEBoaWdobGlnaHRpbmdWYWx1ZXMgPSBmYWxzZVxyXG4gICAgICAgICAgQGxhc3RWYWx1ZVRhcE1TID0gbm93KClcclxuICAgICAgICBAbW9kZSA9IE1vZGVUeXBlLlBFTkNJTFxyXG4gICAgICAgIEBwZW5WYWx1ZSA9IGFjdGlvbi52YWx1ZVxyXG4gICAgICAgIEBwcmVmZXJQZW5jaWwgPSB0cnVlICMgTWFrZSBzdXJlIHRoZSBrZXlib2FyZCBpcyBhbHNvIGluIHBlbmNpbCBtb2RlXHJcbiAgICByZXR1cm5cclxuXHJcbiAgaGFuZGxlUGVuQWN0aW9uOiAoYWN0aW9uKSAtPlxyXG4gICAgc3dpdGNoIEBtb2RlXHJcbiAgICAgICMgSW4gUEVOLCB0aGUgbW9kZSBpcyBjaGFuZ2VkIHRvIFZJU0lCSUxJVFkgaWYgdGhlIHNlbGVjdGVkIHZhbHVlIGlzIGFscmVhZHkgY3VycmVudCB1bmxlc3MgZG91YmxlIHRhcFxyXG4gICAgICAjIEFsc28sIGlmIGRvdWJsZSB0YXAsIHRoZW4gdHVybiBvbiBoaWdobGlnaHRpbmcgdmFsdWVzXHJcbiAgICAgIHdoZW4gTW9kZVR5cGUuUEVOXHJcbiAgICAgICAgaWYgKEBwZW5WYWx1ZSA9PSBhY3Rpb24udmFsdWUpXHJcbiAgICAgICAgICBpZiBAZG91YmxlVGFwRGV0ZWN0ZWQoKVxyXG4gICAgICAgICAgICBAaGlnaGxpZ2h0aW5nVmFsdWVzID0gdHJ1ZVxyXG4gICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICBAaGlnaGxpZ2h0aW5nVmFsdWVzID0gZmFsc2VcclxuICAgICAgICAgICAgQGxhc3RWYWx1ZVRhcE1TID0gbm93KClcclxuICAgICAgICAgICAgQG1vZGUgPSBNb2RlVHlwZS5WSVNJQklMSVRZXHJcbiAgICAgICAgICAgIEBwZW5WYWx1ZSA9IE5PTkVcclxuICAgICAgICBlbHNlXHJcbiAgICAgICAgICBAaGlnaGxpZ2h0aW5nVmFsdWVzID0gZmFsc2VcclxuICAgICAgICAgIEBsYXN0VmFsdWVUYXBNUyA9IG5vdygpXHJcbiAgICAgICAgICBAcGVuVmFsdWUgPSBhY3Rpb24udmFsdWVcclxuICAgICAgICBAcHJlZmVyUGVuY2lsID0gZmFsc2UgIyBNYWtlIHN1cmUgdGhlIGtleWJvYXJkIGlzIGFsc28gaW4gcGVuIG1vZGVcclxuXHJcbiAgICAgICMgSWdub3JlZCBpbiBMSU5LU1xyXG4gICAgICB3aGVuIE1vZGVUeXBlLkxJTktTXHJcbiAgICAgICAgcmV0dXJuXHJcblxyXG4gICAgICAjIE90aGVyd2lzZSwgdGhlIG1vZGUgaXMgc3dpdGNoZWQgdG8gKG9yIHJlbWFpbnMgYXMpIFBFTiB1c2luZyB0aGUgc2VsZWN0ZWQgdmFsdWVcclxuICAgICAgZWxzZVxyXG4gICAgICAgICMgSXQgaXMgcG9zc2libGUgdGhhdCB0aGUgZmlyc3QgdGFwIGNoYW5nZWQgdGhlIG1vZGUgdG8gVklTSUJJTElUWSBzbyBhIGRvdWJsZSB0YXAgbXVzdCBwcmV0ZW5kIHRoYXQgaXQgZGlkbid0XHJcbiAgICAgICAgaWYgQG1vZGUgaXMgTW9kZVR5cGUuVklTSUJJTElUWSBhbmQgQGRvdWJsZVRhcERldGVjdGVkKClcclxuICAgICAgICAgIEBoaWdobGlnaHRpbmdWYWx1ZXMgPSB0cnVlXHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgICAgQGhpZ2hsaWdodGluZ1ZhbHVlcyA9IGZhbHNlXHJcbiAgICAgICAgICBAbGFzdFZhbHVlVGFwTVMgPSBub3coKVxyXG4gICAgICAgIEBtb2RlID0gTW9kZVR5cGUuUEVOXHJcbiAgICAgICAgQHBlblZhbHVlID0gYWN0aW9uLnZhbHVlXHJcbiAgICAgICAgQHByZWZlclBlbmNpbCA9IGZhbHNlICMgTWFrZSBzdXJlIHRoZSBrZXlib2FyZCBpcyBhbHNvIGluIHBlbiBtb2RlXHJcblxyXG4gICAgIyBNYWtlIHN1cmUgYW55IHZpc2liaWxpdHkgaGlnaGxpZ2h0aW5nIGlzIG9mZiBhbmQgbGlua3MgYXJlIGNsZWFyZWQuXHJcbiAgICBAdmlzaWJpbGl0eVggPSAtMVxyXG4gICAgQHZpc2liaWxpdHlZID0gLTFcclxuICAgIEBzdHJvbmdMaW5rcyA9IFtdXHJcbiAgICBAd2Vha0xpbmtzID0gW11cclxuICAgIHJldHVyblxyXG5cclxuICBoYW5kbGVVbmRvQWN0aW9uOiAtPlxyXG4gICAgcmV0dXJuIEBnYW1lLnVuZG8oKSBpZiBAbW9kZSBpc250IE1vZGVUeXBlLkxJTktTIGFuZCBAbW9kZSBpc250IE1vZGVUeXBlLkNIRUNLXHJcblxyXG4gIGhhbmRsZVJlZG9BY3Rpb246IC0+XHJcbiAgICByZXR1cm4gQGdhbWUucmVkbygpIGlmIEBtb2RlIGlzbnQgTW9kZVR5cGUuTElOS1MgYW5kIEBtb2RlIGlzbnQgTW9kZVR5cGUuQ0hFQ0tcclxuXHJcbiAgaGFuZGxlTW9kZUFjdGlvbjogLT5cclxuICAgIHN3aXRjaCBAbW9kZVxyXG4gICAgICB3aGVuIE1vZGVUeXBlLlZJU0lCSUxJVFlcclxuICAgICAgICBAbW9kZSA9IE1vZGVUeXBlLkxJTktTXHJcbiAgICAgIHdoZW4gTW9kZVR5cGUuUEVOQ0lMXHJcbiAgICAgICAgQG1vZGUgPSBNb2RlVHlwZS5QRU5cclxuICAgICAgd2hlbiBNb2RlVHlwZS5QRU5cclxuICAgICAgICBAbW9kZSA9IE1vZGVUeXBlLlZJU0lCSUxJVFlcclxuICAgICAgd2hlbiBNb2RlVHlwZS5MSU5LUywgTW9kZVR5cGUuQ0hFQ0tcclxuICAgICAgICBAbW9kZSA9IE1vZGVUeXBlLlBFTkNJTFxyXG4gICAgQHZpc2liaWxpdHlYID0gLTFcclxuICAgIEB2aXNpYmlsaXR5WSA9IC0xXHJcbiAgICBAcGVuVmFsdWUgPSBOT05FXHJcbiAgICBAc3Ryb25nTGlua3MgPSBbXVxyXG4gICAgQHdlYWtMaW5rcyA9IFtdXHJcbiAgICBAaGlnaGxpZ2h0aW5nVmFsdWVzID0gZmFsc2VcclxuICAgIEBsYXN0VmFsdWVUYXBNUyA9IG5vdygpIC0gRE9VQkxFX1RBUF9JTlRFUlZBTF9NUyAgICAjIEVuc3VyZSB0aGF0IHRoZSBuZXh0IHRhcCBpcyBub3QgYSBkb3VibGUgdGFwXHJcbiAgICByZXR1cm5cclxuXHJcbiAgaGFuZGxlQ2hlY2tBY3Rpb246IC0+XHJcbiAgICBAbW9kZSA9IE1vZGVUeXBlLkNIRUNLXHJcbiAgICBAdmlzaWJpbGl0eVggPSAtMVxyXG4gICAgQHZpc2liaWxpdHlZID0gLTFcclxuICAgIEBwZW5WYWx1ZSA9IE5PTkVcclxuICAgIEBzdHJvbmdMaW5rcyA9IFtdXHJcbiAgICBAd2Vha0xpbmtzID0gW11cclxuICAgIEBoaWdobGlnaHRpbmdWYWx1ZXMgPSBmYWxzZVxyXG4gICAgQGxhc3RWYWx1ZVRhcE1TID0gbm93KCkgLSBET1VCTEVfVEFQX0lOVEVSVkFMX01TICAgICMgRW5zdXJlIHRoYXQgdGhlIG5leHQgdGFwIGlzIG5vdCBhIGRvdWJsZSB0YXBcclxuICAgIHJldHVyblxyXG5cclxuICBjbGljazogKHgsIHkpIC0+XHJcbiAgICAjIGNvbnNvbGUubG9nIFwiY2xpY2sgI3t4fSwgI3t5fVwiXHJcbiAgICB4ID0gTWF0aC5mbG9vcih4IC8gQGNlbGxTaXplKVxyXG4gICAgeSA9IE1hdGguZmxvb3IoeSAvIEBjZWxsU2l6ZSlcclxuXHJcbiAgICBmbGFzaFggPSBudWxsXHJcbiAgICBmbGFzaFkgPSBudWxsXHJcbiAgICBpZiAoeCA8IDkpICYmICh5IDwgMTUpXHJcbiAgICAgICAgaW5kZXggPSAoeSAqIDkpICsgeFxyXG4gICAgICAgIGFjdGlvbiA9IEBhY3Rpb25zW2luZGV4XVxyXG4gICAgICAgIGlmIGFjdGlvbiAhPSBudWxsXHJcbiAgICAgICAgICBjb25zb2xlLmxvZyBcIkFjdGlvbjogXCIsIGFjdGlvblxyXG5cclxuICAgICAgICAgIGlmIGFjdGlvbi50eXBlIGlzIEFjdGlvblR5cGUuTUVOVVxyXG4gICAgICAgICAgICBAYXBwLnN3aXRjaFZpZXcoXCJtZW51XCIpXHJcbiAgICAgICAgICAgIHJldHVyblxyXG5cclxuICAgICAgICAgIHN3aXRjaCBhY3Rpb24udHlwZVxyXG4gICAgICAgICAgICB3aGVuIEFjdGlvblR5cGUuU0VMRUNUIHRoZW4gWyBmbGFzaFgsIGZsYXNoWSBdID0gQGhhbmRsZVNlbGVjdEFjdGlvbihhY3Rpb24pXHJcbiAgICAgICAgICAgIHdoZW4gQWN0aW9uVHlwZS5QRU5DSUwgdGhlbiBAaGFuZGxlUGVuY2lsQWN0aW9uKGFjdGlvbilcclxuICAgICAgICAgICAgd2hlbiBBY3Rpb25UeXBlLlBFTiB0aGVuIEBoYW5kbGVQZW5BY3Rpb24oYWN0aW9uKVxyXG4gICAgICAgICAgICB3aGVuIEFjdGlvblR5cGUuVU5ETyB0aGVuIFsgZmxhc2hYLCBmbGFzaFkgXSA9IEBoYW5kbGVVbmRvQWN0aW9uKClcclxuICAgICAgICAgICAgd2hlbiBBY3Rpb25UeXBlLlJFRE8gdGhlbiBbIGZsYXNoWCwgZmxhc2hZIF0gPSBAaGFuZGxlUmVkb0FjdGlvbigpXHJcbiAgICAgICAgICAgIHdoZW4gQWN0aW9uVHlwZS5NT0RFIHRoZW4gQGhhbmRsZU1vZGVBY3Rpb24oKVxyXG4gICAgICAgICAgICB3aGVuIEFjdGlvblR5cGUuQ0hFQ0sgdGhlbiBAaGFuZGxlQ2hlY2tBY3Rpb24oKVxyXG4gICAgICAgIGVsc2VcclxuICAgICAgICAgICMgbm8gYWN0aW9uLCBkZWZhdWx0IHRvIFZJU0lCSUxJVFkgbW9kZVxyXG4gICAgICAgICAgQG1vZGUgPSBNb2RlVHlwZS5WSVNJQklMSVRZXHJcbiAgICAgICAgICBAdmlzaWJpbGl0eVggPSAtMVxyXG4gICAgICAgICAgQHZpc2liaWxpdHlZID0gLTFcclxuICAgICAgICAgIEBwZW5WYWx1ZSA9IE5PTkVcclxuICAgICAgICAgIEBzdHJvbmdMaW5rcyA9IFtdXHJcbiAgICAgICAgICBAd2Vha0xpbmtzID0gW11cclxuICAgICAgICAgIEBoaWdobGlnaHRpbmdWYWx1ZXMgPSBmYWxzZVxyXG4gICAgICAgICAgQGxhc3RWYWx1ZVRhcE1TID0gbm93KCkgLSBET1VCTEVfVEFQX0lOVEVSVkFMX01TICAgICMgRW5zdXJlIHRoYXQgdGhlIG5leHQgdGFwIGlzIG5vdCBhIGRvdWJsZSB0YXBcclxuXHJcbiAgICAgICAgQGRyYXcoZmxhc2hYLCBmbGFzaFkpXHJcbiAgICAgICAgaWYgKGZsYXNoWD8gJiYgZmxhc2hZPylcclxuICAgICAgICAgIHNldFRpbWVvdXQgPT5cclxuICAgICAgICAgICAgQGRyYXcoKVxyXG4gICAgICAgICAgLCBGTEFTSF9JTlRFUlZBTF9NU1xyXG4gICAgcmV0dXJuXHJcblxyXG4gIGtleTogKGspIC0+XHJcbiAgICBpZiBrID09ICcuJ1xyXG4gICAgICBAcHJlZmVyUGVuY2lsID0gIUBwcmVmZXJQZW5jaWxcclxuICAgICAgaWYgQG1vZGUgPT0gTW9kZVR5cGUuUEVOXHJcbiAgICAgICAgQGhhbmRsZVBlbmNpbEFjdGlvbih7IHZhbHVlOiBAcGVuVmFsdWUgfSlcclxuICAgICAgZWxzZSBpZiBAbW9kZSA9PSBNb2RlVHlwZS5QRU5DSUxcclxuICAgICAgICBAaGFuZGxlUGVuQWN0aW9uKHsgdmFsdWU6IEBwZW5WYWx1ZSB9KVxyXG4gICAgICBlbHNlIGlmIEBtb2RlID09IE1vZGVUeXBlLkxJTktTXHJcbiAgICAgICAgQGhhbmRsZU1vZGVBY3Rpb24oKVxyXG4gICAgICBAZHJhdygpXHJcbiAgICBlbHNlIGlmIEtFWV9NQVBQSU5HW2tdP1xyXG4gICAgICBtYXBwaW5nID0gS0VZX01BUFBJTkdba11cclxuICAgICAgdXNlUGVuY2lsID0gQHByZWZlclBlbmNpbFxyXG4gICAgICBpZiBtYXBwaW5nLnNoaWZ0XHJcbiAgICAgICAgdXNlUGVuY2lsID0gIXVzZVBlbmNpbFxyXG4gICAgICBpZiB1c2VQZW5jaWwgb3IgQG1vZGUgPT0gTW9kZVR5cGUuTElOS1NcclxuICAgICAgICBAaGFuZGxlUGVuY2lsQWN0aW9uKHsgdmFsdWU6IG1hcHBpbmcudiB9KVxyXG4gICAgICBlbHNlXHJcbiAgICAgICAgQGhhbmRsZVBlbkFjdGlvbih7IHZhbHVlOiBtYXBwaW5nLnYgfSlcclxuICAgICAgQGRyYXcoKVxyXG4gICAgICByZXR1cm5cclxuXHJcbiAgIyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgIyBIZWxwZXJzXHJcblxyXG4gIGNvbmZsaWN0czogKHgxLCB5MSwgeDIsIHkyKSAtPlxyXG4gICAgIyBzYW1lIHJvdyBvciBjb2x1bW4/XHJcbiAgICBpZiAoeDEgPT0geDIpIHx8ICh5MSA9PSB5MilcclxuICAgICAgcmV0dXJuIHRydWVcclxuXHJcbiAgICAjIHNhbWUgc2VjdGlvbj9cclxuICAgIHN4MSA9IE1hdGguZmxvb3IoeDEgLyAzKSAqIDNcclxuICAgIHN5MSA9IE1hdGguZmxvb3IoeTEgLyAzKSAqIDNcclxuICAgIHN4MiA9IE1hdGguZmxvb3IoeDIgLyAzKSAqIDNcclxuICAgIHN5MiA9IE1hdGguZmxvb3IoeTIgLyAzKSAqIDNcclxuICAgIGlmIChzeDEgPT0gc3gyKSAmJiAoc3kxID09IHN5MilcclxuICAgICAgcmV0dXJuIHRydWVcclxuXHJcbiAgICByZXR1cm4gZmFsc2VcclxuXHJcbiAgIyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFN1ZG9rdVZpZXdcclxuIiwiQXBwID0gcmVxdWlyZSAnLi9BcHAnXHJcblxyXG5pbml0ID0gLT5cclxuICBjb25zb2xlLmxvZyBcImluaXRcIlxyXG4gIGNhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJjYW52YXNcIilcclxuICBjYW52YXMud2lkdGggPSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50V2lkdGhcclxuICBjYW52YXMuaGVpZ2h0ID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudEhlaWdodFxyXG4gIGRvY3VtZW50LmJvZHkuaW5zZXJ0QmVmb3JlKGNhbnZhcywgZG9jdW1lbnQuYm9keS5jaGlsZE5vZGVzWzBdKVxyXG4gIGNhbnZhc1JlY3QgPSBjYW52YXMuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KClcclxuXHJcbiAgd2luZG93LmFwcCA9IG5ldyBBcHAoY2FudmFzKVxyXG5cclxuICAjIGNhbnZhcy5hZGRFdmVudExpc3RlbmVyIFwidG91Y2hzdGFydFwiLCAoZSkgLT5cclxuICAjICAgY29uc29sZS5sb2cgT2JqZWN0LmtleXMoZS50b3VjaGVzWzBdKVxyXG4gICMgICB4ID0gZS50b3VjaGVzWzBdLmNsaWVudFggLSBjYW52YXNSZWN0LmxlZnRcclxuICAjICAgeSA9IGUudG91Y2hlc1swXS5jbGllbnRZIC0gY2FudmFzUmVjdC50b3BcclxuICAjICAgd2luZG93LmFwcC5jbGljayh4LCB5KVxyXG5cclxuICBjYW52YXMuYWRkRXZlbnRMaXN0ZW5lciBcIm1vdXNlZG93blwiLCAoZSkgLT5cclxuICAgIHggPSBlLmNsaWVudFggLSBjYW52YXNSZWN0LmxlZnRcclxuICAgIHkgPSBlLmNsaWVudFkgLSBjYW52YXNSZWN0LnRvcFxyXG4gICAgd2luZG93LmFwcC5jbGljayh4LCB5KVxyXG5cclxuICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyICdrZXlkb3duJywgKGUpIC0+XHJcbiAgICB3aW5kb3cuYXBwLmtleShlLmtleSlcclxuXHJcbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgKGUpIC0+XHJcbiAgICBpbml0KClcclxuLCBmYWxzZSlcclxuIiwibW9kdWxlLmV4cG9ydHMgPSBcIjAuMC4xOFwiIiwiLyogRm9udCBGYWNlIE9ic2VydmVyIHYyLjMuMCAtIMKpIEJyYW0gU3RlaW4uIExpY2Vuc2U6IEJTRC0zLUNsYXVzZSAqLyhmdW5jdGlvbigpe2Z1bmN0aW9uIHAoYSxjKXtkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyP2EuYWRkRXZlbnRMaXN0ZW5lcihcInNjcm9sbFwiLGMsITEpOmEuYXR0YWNoRXZlbnQoXCJzY3JvbGxcIixjKX1mdW5jdGlvbiB1KGEpe2RvY3VtZW50LmJvZHk/YSgpOmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXI/ZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIkRPTUNvbnRlbnRMb2FkZWRcIixmdW5jdGlvbiBiKCl7ZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcIkRPTUNvbnRlbnRMb2FkZWRcIixiKTthKCl9KTpkb2N1bWVudC5hdHRhY2hFdmVudChcIm9ucmVhZHlzdGF0ZWNoYW5nZVwiLGZ1bmN0aW9uIGcoKXtpZihcImludGVyYWN0aXZlXCI9PWRvY3VtZW50LnJlYWR5U3RhdGV8fFwiY29tcGxldGVcIj09ZG9jdW1lbnQucmVhZHlTdGF0ZSlkb2N1bWVudC5kZXRhY2hFdmVudChcIm9ucmVhZHlzdGF0ZWNoYW5nZVwiLGcpLGEoKX0pfTtmdW5jdGlvbiB3KGEpe3RoaXMuZz1kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO3RoaXMuZy5zZXRBdHRyaWJ1dGUoXCJhcmlhLWhpZGRlblwiLFwidHJ1ZVwiKTt0aGlzLmcuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoYSkpO3RoaXMuaD1kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTt0aGlzLmk9ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIik7dGhpcy5tPWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpO3RoaXMuaj1kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTt0aGlzLmw9LTE7dGhpcy5oLnN0eWxlLmNzc1RleHQ9XCJtYXgtd2lkdGg6bm9uZTtkaXNwbGF5OmlubGluZS1ibG9jaztwb3NpdGlvbjphYnNvbHV0ZTtoZWlnaHQ6MTAwJTt3aWR0aDoxMDAlO292ZXJmbG93OnNjcm9sbDtmb250LXNpemU6MTZweDtcIjt0aGlzLmkuc3R5bGUuY3NzVGV4dD1cIm1heC13aWR0aDpub25lO2Rpc3BsYXk6aW5saW5lLWJsb2NrO3Bvc2l0aW9uOmFic29sdXRlO2hlaWdodDoxMDAlO3dpZHRoOjEwMCU7b3ZlcmZsb3c6c2Nyb2xsO2ZvbnQtc2l6ZToxNnB4O1wiO1xudGhpcy5qLnN0eWxlLmNzc1RleHQ9XCJtYXgtd2lkdGg6bm9uZTtkaXNwbGF5OmlubGluZS1ibG9jaztwb3NpdGlvbjphYnNvbHV0ZTtoZWlnaHQ6MTAwJTt3aWR0aDoxMDAlO292ZXJmbG93OnNjcm9sbDtmb250LXNpemU6MTZweDtcIjt0aGlzLm0uc3R5bGUuY3NzVGV4dD1cImRpc3BsYXk6aW5saW5lLWJsb2NrO3dpZHRoOjIwMCU7aGVpZ2h0OjIwMCU7Zm9udC1zaXplOjE2cHg7bWF4LXdpZHRoOm5vbmU7XCI7dGhpcy5oLmFwcGVuZENoaWxkKHRoaXMubSk7dGhpcy5pLmFwcGVuZENoaWxkKHRoaXMuaik7dGhpcy5nLmFwcGVuZENoaWxkKHRoaXMuaCk7dGhpcy5nLmFwcGVuZENoaWxkKHRoaXMuaSl9XG5mdW5jdGlvbiB4KGEsYyl7YS5nLnN0eWxlLmNzc1RleHQ9XCJtYXgtd2lkdGg6bm9uZTttaW4td2lkdGg6MjBweDttaW4taGVpZ2h0OjIwcHg7ZGlzcGxheTppbmxpbmUtYmxvY2s7b3ZlcmZsb3c6aGlkZGVuO3Bvc2l0aW9uOmFic29sdXRlO3dpZHRoOmF1dG87bWFyZ2luOjA7cGFkZGluZzowO3RvcDotOTk5cHg7d2hpdGUtc3BhY2U6bm93cmFwO2ZvbnQtc3ludGhlc2lzOm5vbmU7Zm9udDpcIitjK1wiO1wifWZ1bmN0aW9uIEIoYSl7dmFyIGM9YS5nLm9mZnNldFdpZHRoLGI9YysxMDA7YS5qLnN0eWxlLndpZHRoPWIrXCJweFwiO2EuaS5zY3JvbGxMZWZ0PWI7YS5oLnNjcm9sbExlZnQ9YS5oLnNjcm9sbFdpZHRoKzEwMDtyZXR1cm4gYS5sIT09Yz8oYS5sPWMsITApOiExfWZ1bmN0aW9uIEMoYSxjKXtmdW5jdGlvbiBiKCl7dmFyIGU9ZztCKGUpJiZudWxsIT09ZS5nLnBhcmVudE5vZGUmJmMoZS5sKX12YXIgZz1hO3AoYS5oLGIpO3AoYS5pLGIpO0IoYSl9O2Z1bmN0aW9uIEQoYSxjLGIpe2M9Y3x8e307Yj1ifHx3aW5kb3c7dGhpcy5mYW1pbHk9YTt0aGlzLnN0eWxlPWMuc3R5bGV8fFwibm9ybWFsXCI7dGhpcy53ZWlnaHQ9Yy53ZWlnaHR8fFwibm9ybWFsXCI7dGhpcy5zdHJldGNoPWMuc3RyZXRjaHx8XCJub3JtYWxcIjt0aGlzLmNvbnRleHQ9Yn12YXIgRT1udWxsLEY9bnVsbCxHPW51bGwsSD1udWxsO2Z1bmN0aW9uIEkoYSl7bnVsbD09PUYmJihNKGEpJiYvQXBwbGUvLnRlc3Qod2luZG93Lm5hdmlnYXRvci52ZW5kb3IpPyhhPS9BcHBsZVdlYktpdFxcLyhbMC05XSspKD86XFwuKFswLTldKykpKD86XFwuKFswLTldKykpLy5leGVjKHdpbmRvdy5uYXZpZ2F0b3IudXNlckFnZW50KSxGPSEhYSYmNjAzPnBhcnNlSW50KGFbMV0sMTApKTpGPSExKTtyZXR1cm4gRn1mdW5jdGlvbiBNKGEpe251bGw9PT1IJiYoSD0hIWEuZG9jdW1lbnQuZm9udHMpO3JldHVybiBIfVxuZnVuY3Rpb24gTihhLGMpe3ZhciBiPWEuc3R5bGUsZz1hLndlaWdodDtpZihudWxsPT09Ryl7dmFyIGU9ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTt0cnl7ZS5zdHlsZS5mb250PVwiY29uZGVuc2VkIDEwMHB4IHNhbnMtc2VyaWZcIn1jYXRjaChxKXt9Rz1cIlwiIT09ZS5zdHlsZS5mb250fXJldHVybltiLGcsRz9hLnN0cmV0Y2g6XCJcIixcIjEwMHB4XCIsY10uam9pbihcIiBcIil9XG5ELnByb3RvdHlwZS5sb2FkPWZ1bmN0aW9uKGEsYyl7dmFyIGI9dGhpcyxnPWF8fFwiQkVTYnN3eVwiLGU9MCxxPWN8fDNFMyxKPShuZXcgRGF0ZSkuZ2V0VGltZSgpO3JldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihLLEwpe2lmKE0oYi5jb250ZXh0KSYmIUkoYi5jb250ZXh0KSl7dmFyIE89bmV3IFByb21pc2UoZnVuY3Rpb24ocix0KXtmdW5jdGlvbiBoKCl7KG5ldyBEYXRlKS5nZXRUaW1lKCktSj49cT90KEVycm9yKFwiXCIrcStcIm1zIHRpbWVvdXQgZXhjZWVkZWRcIikpOmIuY29udGV4dC5kb2N1bWVudC5mb250cy5sb2FkKE4oYiwnXCInK2IuZmFtaWx5KydcIicpLGcpLnRoZW4oZnVuY3Rpb24obil7MTw9bi5sZW5ndGg/cigpOnNldFRpbWVvdXQoaCwyNSl9LHQpfWgoKX0pLFA9bmV3IFByb21pc2UoZnVuY3Rpb24ocix0KXtlPXNldFRpbWVvdXQoZnVuY3Rpb24oKXt0KEVycm9yKFwiXCIrcStcIm1zIHRpbWVvdXQgZXhjZWVkZWRcIikpfSxxKX0pO1Byb21pc2UucmFjZShbUCxPXSkudGhlbihmdW5jdGlvbigpe2NsZWFyVGltZW91dChlKTtcbksoYil9LEwpfWVsc2UgdShmdW5jdGlvbigpe2Z1bmN0aW9uIHIoKXt2YXIgZDtpZihkPS0xIT1rJiYtMSE9bHx8LTEhPWsmJi0xIT1tfHwtMSE9bCYmLTEhPW0pKGQ9ayE9bCYmayE9bSYmbCE9bSl8fChudWxsPT09RSYmKGQ9L0FwcGxlV2ViS2l0XFwvKFswLTldKykoPzpcXC4oWzAtOV0rKSkvLmV4ZWMod2luZG93Lm5hdmlnYXRvci51c2VyQWdlbnQpLEU9ISFkJiYoNTM2PnBhcnNlSW50KGRbMV0sMTApfHw1MzY9PT1wYXJzZUludChkWzFdLDEwKSYmMTE+PXBhcnNlSW50KGRbMl0sMTApKSksZD1FJiYoaz09eSYmbD09eSYmbT09eXx8az09eiYmbD09eiYmbT09enx8az09QSYmbD09QSYmbT09QSkpLGQ9IWQ7ZCYmKG51bGwhPT1mLnBhcmVudE5vZGUmJmYucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChmKSxjbGVhclRpbWVvdXQoZSksSyhiKSl9ZnVuY3Rpb24gdCgpe2lmKChuZXcgRGF0ZSkuZ2V0VGltZSgpLUo+PXEpbnVsbCE9PWYucGFyZW50Tm9kZSYmZi5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGYpLFxuTChFcnJvcihcIlwiK3ErXCJtcyB0aW1lb3V0IGV4Y2VlZGVkXCIpKTtlbHNle3ZhciBkPWIuY29udGV4dC5kb2N1bWVudC5oaWRkZW47aWYoITA9PT1kfHx2b2lkIDA9PT1kKWs9aC5nLm9mZnNldFdpZHRoLGw9bi5nLm9mZnNldFdpZHRoLG09di5nLm9mZnNldFdpZHRoLHIoKTtlPXNldFRpbWVvdXQodCw1MCl9fXZhciBoPW5ldyB3KGcpLG49bmV3IHcoZyksdj1uZXcgdyhnKSxrPS0xLGw9LTEsbT0tMSx5PS0xLHo9LTEsQT0tMSxmPWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7Zi5kaXI9XCJsdHJcIjt4KGgsTihiLFwic2Fucy1zZXJpZlwiKSk7eChuLE4oYixcInNlcmlmXCIpKTt4KHYsTihiLFwibW9ub3NwYWNlXCIpKTtmLmFwcGVuZENoaWxkKGguZyk7Zi5hcHBlbmRDaGlsZChuLmcpO2YuYXBwZW5kQ2hpbGQodi5nKTtiLmNvbnRleHQuZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChmKTt5PWguZy5vZmZzZXRXaWR0aDt6PW4uZy5vZmZzZXRXaWR0aDtBPXYuZy5vZmZzZXRXaWR0aDt0KCk7XG5DKGgsZnVuY3Rpb24oZCl7az1kO3IoKX0pO3goaCxOKGIsJ1wiJytiLmZhbWlseSsnXCIsc2Fucy1zZXJpZicpKTtDKG4sZnVuY3Rpb24oZCl7bD1kO3IoKX0pO3gobixOKGIsJ1wiJytiLmZhbWlseSsnXCIsc2VyaWYnKSk7Qyh2LGZ1bmN0aW9uKGQpe209ZDtyKCl9KTt4KHYsTihiLCdcIicrYi5mYW1pbHkrJ1wiLG1vbm9zcGFjZScpKX0pfSl9O1wib2JqZWN0XCI9PT10eXBlb2YgbW9kdWxlP21vZHVsZS5leHBvcnRzPUQ6KHdpbmRvdy5Gb250RmFjZU9ic2VydmVyPUQsd2luZG93LkZvbnRGYWNlT2JzZXJ2ZXIucHJvdG90eXBlLmxvYWQ9RC5wcm90b3R5cGUubG9hZCk7fSgpKTtcbiJdfQ==
