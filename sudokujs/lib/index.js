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
  var count, i, j, l, links, m, ref, ref1, ref2;
  links = [];
  count = cells.length;
  for (i = l = 0, ref = count - 1; (0 <= ref ? l < ref : l > ref); i = 0 <= ref ? ++l : --l) {
    for (j = m = ref1 = i + 1, ref2 = count; (ref1 <= ref2 ? m < ref2 : m > ref2); j = ref1 <= ref2 ? ++m : --m) {
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
    var i, j, l, m, n;
    this.grid = new Array(9).fill(null);
    for (i = l = 0; l < 9; i = ++l) {
      this.grid[i] = new Array(9).fill(null);
    }
    for (j = m = 0; m < 9; j = ++m) {
      for (i = n = 0; n < 9; i = ++n) {
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
    var count, i, j, l, m;
    count = 0;
    for (j = l = 0; l < 9; j = ++l) {
      for (i = m = 0; m < 9; i = ++m) {
        if (!this.grid[i][j].locked) {
          count += 1;
        }
      }
    }
    return count;
  }

  export() {
    var exportString, i, j, l, m;
    exportString = "SD";
    for (j = l = 0; l < 9; j = ++l) {
      for (i = m = 0; m < 9; i = ++m) {
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
    var board, generator, i, j, l, m;
    board = new Array(9).fill(null);
    for (i = l = 0; l < 9; i = ++l) {
      board[i] = new Array(9).fill(0);
      for (j = m = 0; m < 9; j = ++m) {
        board[i][j] = this.grid[i][j].value;
      }
    }
    generator = new SudokuGenerator();
    return generator.validateGrid(board);
  }

  import(importString) {
    var i, index, j, l, m, v, zeroCharCode;
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
      for (i = m = 0; m < 9; i = ++m) {
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
    var cell, i, j, l, m, n, sx, sy, v;
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
    for (j = m = 0; m < 3; j = ++m) {
      for (i = n = 0; n < 3; i = ++n) {
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
    var i, j, l, m, n, o, q, r;
    for (j = l = 0; l < 9; j = ++l) {
      for (i = m = 0; m < 9; i = ++m) {
        this.grid[i][j].error = false;
      }
    }
    for (j = n = 0; n < 9; j = ++n) {
      for (i = o = 0; o < 9; i = ++o) {
        this.updateCell(i, j);
      }
    }
    this.solved = true;
    for (j = q = 0; q < 9; j = ++q) {
      for (i = r = 0; r < 9; i = ++r) {
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
    var counts, d, i, j, l, m, n;
    d = new Array(9).fill(false);
    counts = new Array(9).fill(0);
    for (j = l = 0; l < 9; j = ++l) {
      for (i = m = 0; m < 9; i = ++m) {
        if (this.grid[i][j].value !== 0) {
          counts[this.grid[i][j].value - 1] += 1;
        }
      }
    }
    for (i = n = 0; n < 9; i = ++n) {
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
    var cell, i, j, k, l, m, n;
    console.log("reset()");
    for (j = l = 0; l < 9; j = ++l) {
      for (i = m = 0; m < 9; i = ++m) {
        cell = this.grid[i][j];
        if (!cell.locked) {
          cell.value = 0;
        }
        cell.error = false;
        for (k = n = 0; n < 9; k = ++n) {
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
    var boxX, boxY, l, len, len1, link, links, m, n, o, q, r, strong, weak, x, y;
    // Note: the search sorts the links in row major order, first by start cell, then by end cell
    links = [];
// Get row links
    for (y = l = 0; l < 9; y = ++l) {
      links.push(...this.getRowLinks(y, value));
    }
// Get column links
    for (x = m = 0; m < 9; x = ++m) {
      links.push(...this.getColumnLinks(x, value));
    }
// Get box links
    for (boxX = n = 0; n < 3; boxX = ++n) {
      for (boxY = o = 0; o < 3; boxY = ++o) {
        links.push(...this.getBoxLinks(boxX, boxY, value));
      }
    }
    // The box links might have duplicated some row and column links, so duplicates must be filtered out. Note that only
    // locations are considered when finding duplicates, but strong links take precedence when duplicates are removed
    // (because they are ordered before weak links).
    links = links.sort(ascendingLinkSort).filter(uniqueLinkFilter);
    strong = [];
    for (q = 0, len = links.length; q < len; q++) {
      link = links[q];
      if (link.strong != null) {
        strong.push(link.cells);
      }
    }
    weak = [];
    for (r = 0, len1 = links.length; r < len1; r++) {
      link = links[r];
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
    var cell, cells, l, links, m, ref, ref1, ref2, ref3, sx, sy, x, y;
    cells = [];
    sx = boxX * 3;
    sy = boxY * 3;
    for (y = l = ref = sy, ref1 = sy + 3; (ref <= ref1 ? l < ref1 : l > ref1); y = ref <= ref1 ? ++l : --l) {
      for (x = m = ref2 = sx, ref3 = sx + 3; (ref2 <= ref3 ? m < ref3 : m > ref3); x = ref2 <= ref3 ? ++m : --m) {
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

  newGame(difficulty) {
    var cell, generator, i, j, k, l, m, n, newGrid, o, q;
    console.log(`newGame(${difficulty})`);
    for (j = l = 0; l < 9; j = ++l) {
      for (i = m = 0; m < 9; i = ++m) {
        cell = this.grid[i][j];
        cell.value = 0;
        cell.error = false;
        cell.locked = false;
        for (k = n = 0; n < 9; k = ++n) {
          cell.pencil[k] = false;
        }
      }
    }
    generator = new SudokuGenerator();
    newGrid = generator.generate(difficulty);
// console.log "newGrid", newGrid
    for (j = o = 0; o < 9; j = ++o) {
      for (i = q = 0; q < 9; i = ++q) {
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
    var dst, gameData, i, j, jsonString, k, l, m, n, src;
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
      for (i = m = 0; m < 9; i = ++m) {
        src = gameData.grid[i][j];
        dst = this.grid[i][j];
        dst.value = src.v;
        dst.error = src.e > 0 ? true : false;
        dst.locked = src.l > 0 ? true : false;
        for (k = n = 0; n < 9; k = ++n) {
          dst.pencil[k] = src.p[k] > 0 ? true : false;
        }
      }
    }
    this.updateCells();
    console.log("Loaded game.");
    return true;
  }

  save() {
    var cell, dst, gameData, i, j, jsonString, k, l, m, n, o;
    if (!localStorage) {
      alert("No local storage, nothing will work");
      return false;
    }
    gameData = {
      grid: new Array(9).fill(null)
    };
    for (i = l = 0; l < 9; i = ++l) {
      gameData.grid[i] = new Array(9).fill(null);
    }
    for (j = m = 0; m < 9; j = ++m) {
      for (i = n = 0; n < 9; i = ++n) {
        cell = this.grid[i][j];
        gameData.grid[i][j] = {
          v: cell.value,
          e: cell.error ? 1 : 0,
          l: cell.locked ? 1 : 0,
          p: []
        };
        dst = gameData.grid[i][j].p;
        for (k = o = 0; o < 9; k = ++o) {
          dst.push(cell.pencil[k] ? 1 : 0);
        }
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
      var board, i, indexesToRemove, j, l, m, nextBoard, removeIndex, removed, rx, ry;
      board = this.solve(new Board());
// hack
      for (j = l = 0; l < 9; j = ++l) {
        for (i = m = 0; m < 9; i = ++m) {
          board.lock(i, j);
        }
      }
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
      return {
        // console.log "failed to remove #{rx},#{ry}, creates non-unique solution"
        // console.log "successfully removed #{rx},#{ry}"
        board: board,
        removed: removed
      };
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
      return this.boardToGrid(best.board);
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
var ActionType, CELEBRATION_COLORS, CELEBRATION_INTERVAL_MS, CELEBRATION_STEPS, CLEAR, Color, DOUBLE_TAP_INTERVAL_MS, FLASH_INTERVAL_MS, KEY_MAPPING, MENU_POS_X, MENU_POS_Y, MODE_CENTER_POS_X, MODE_END_POS_X, MODE_POS_Y, MODE_START_POS_X, ModeType, NONE, PENCIL_CLEAR_POS_X, PENCIL_CLEAR_POS_Y, PENCIL_POS_X, PENCIL_POS_Y, PEN_CLEAR_POS_X, PEN_CLEAR_POS_Y, PEN_POS_X, PEN_POS_Y, REDO_POS_X, REDO_POS_Y, SudokuGame, SudokuGenerator, SudokuView, UNDO_POS_X, UNDO_POS_Y, now,
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
  modeLinks: "#cc3333"
};

ActionType = {
  SELECT: 0,
  PENCIL: 1,
  PEN: 2,
  MENU: 3,
  UNDO: 4,
  REDO: 5,
  MODE: 6
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
      offset = this.markOffset(m);
      mx = px + offset.x;
      my = py + offset.y;
      text = String(m);
      this.app.drawTextCentered(text, mx, my, this.fonts.pencil, Color.pencil);
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
    var color, i, l, lineWidth, ref;
    for (i = l = 0, ref = size; (0 <= ref ? l <= ref : l >= ref); i = 0 <= ref ? ++l : --l) {
      color = solved ? "green" : "black";
      lineWidth = this.lineWidthThin;
      if ((size === 1) || (i % 3) === 0) {
        lineWidth = this.lineWidthThick;
      }
      // Horizontal lines
      this.app.drawLine(this.cellSize * (originX + 0), this.cellSize * (originY + i), this.cellSize * (originX + size), this.cellSize * (originY + i), color, lineWidth);
      // Vertical lines
      this.app.drawLine(this.cellSize * (originX + i), this.cellSize * (originY + 0), this.cellSize * (originX + i), this.cellSize * (originY + size), color, lineWidth);
    }
  }

  drawLink(startX, startY, endX, endY, color, lineWidth, v) {
    var offset, r, x1, x2, y1, y2;
    offset = this.markOffset(v);
    x1 = startX * this.cellSize + offset.x;
    y1 = startY * this.cellSize + offset.y;
    x2 = endX * this.cellSize + offset.x;
    y2 = endY * this.cellSize + offset.y;
    // Ensure that the arc curves toward the center
    if ((this.centerX - x1) * (y2 - y1) - (this.centerY - y1) * (x2 - x1) < 0) {
      [x1, x2] = [x2, x1];
      [y1, y2] = [y2, y1];
    }
    r = 1.3 * Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1)); // 1.3 gives the most curve minimizing overlap of marks in other cells
    this.app.drawArc(x1, y1, x2, y2, r, color, lineWidth);
    this.app.drawPoint(x1, y1, this.linkDotRadius, color);
    return this.app.drawPoint(x2, y2, this.linkDotRadius, color);
  }

  draw(flashX, flashY) {
    var backgroundColor, cell, currentValue, currentValueString, done, i, j, l, len, len1, link, marks, modeColor, modeText, n, o, p, pencilBackgroundColor, pencilColor, q, ref, ref1, t, textColor, valueBackgroundColor, valueColor;
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
            this.drawUnsolvedCell(i, j, backgroundColor, marks);
          } else {
            textColor = cell.error ? Color.error : Color.value;
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
    }
    this.drawCell(MODE_CENTER_POS_X, MODE_POS_Y, null, modeText, this.fonts.menu, modeColor);
    this.drawCell(MENU_POS_X, MENU_POS_Y, null, "Menu", this.fonts.menu, Color.menu);
    if (this.game.undoJournal.length > 0) {
      this.drawCell(UNDO_POS_X, UNDO_POS_Y, null, "\u{25c4}", this.fonts.menu, Color.menu);
    }
    if (this.game.redoJournal.length > 0) {
      this.drawCell(REDO_POS_X, REDO_POS_Y, null, "\u{25ba}", this.fonts.menu, Color.menu);
    }
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
    }
    // Make sure any visibility highlighting is off and links are cleared.
    this.visibilityX = -1;
    this.visibilityY = -1;
    this.strongLinks = [];
    this.weakLinks = [];
  }

  handleUndoAction() {
    if (this.mode !== ModeType.LINKS) {
      return this.game.undo();
    }
  }

  handleRedoAction() {
    if (this.mode !== ModeType.LINKS) {
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
      }
      return this.draw();
    } else if (KEY_MAPPING[k] != null) {
      mapping = KEY_MAPPING[k];
      usePencil = this.preferPencil;
      if (mapping.shift) {
        usePencil = !usePencil;
      }
      if (usePencil) {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJnYW1lL3NyYy9BcHAuY29mZmVlIiwiZ2FtZS9zcmMvTWVudVZpZXcuY29mZmVlIiwiZ2FtZS9zcmMvU3Vkb2t1R2FtZS5jb2ZmZWUiLCJnYW1lL3NyYy9TdWRva3VHZW5lcmF0b3IuY29mZmVlIiwiZ2FtZS9zcmMvU3Vkb2t1Vmlldy5jb2ZmZWUiLCJnYW1lL3NyYy9tYWluLmNvZmZlZSIsImdhbWUvc3JjL3ZlcnNpb24uY29mZmVlIiwibm9kZV9tb2R1bGVzL2ZvbnRmYWNlb2JzZXJ2ZXIvZm9udGZhY2VvYnNlcnZlci5zdGFuZGFsb25lLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUEsSUFBQSxHQUFBLEVBQUEsZ0JBQUEsRUFBQSxRQUFBLEVBQUEsVUFBQSxFQUFBOztBQUFBLGdCQUFBLEdBQW1CLE9BQUEsQ0FBUSxrQkFBUjs7QUFFbkIsUUFBQSxHQUFXLE9BQUEsQ0FBUSxZQUFSOztBQUNYLFVBQUEsR0FBYSxPQUFBLENBQVEsY0FBUjs7QUFDYixPQUFBLEdBQVUsT0FBQSxDQUFRLFdBQVI7O0FBRUosTUFBTixNQUFBLElBQUE7RUFDRSxXQUFhLE9BQUEsQ0FBQTtJQUFDLElBQUMsQ0FBQTtJQUNiLElBQUMsQ0FBQSxHQUFELEdBQU8sSUFBQyxDQUFBLE1BQU0sQ0FBQyxVQUFSLENBQW1CLElBQW5CO0lBQ1AsSUFBQyxDQUFBLFFBQUQsQ0FBVSxTQUFWO0lBQ0EsSUFBQyxDQUFBLEtBQUQsR0FBUyxDQUFBO0lBRVQsSUFBQyxDQUFBLGlCQUFELEdBQXFCLElBQUksQ0FBQyxLQUFMLENBQVcsSUFBQyxDQUFBLE1BQU0sQ0FBQyxNQUFSLEdBQWlCLElBQTVCO0lBQ3JCLElBQUMsQ0FBQSxXQUFELEdBQWUsSUFBQyxDQUFBLFlBQUQsQ0FBYyxTQUFkLEVBQXlCLENBQUEsQ0FBQSxDQUFHLElBQUMsQ0FBQSxpQkFBSixDQUFBLHFCQUFBLENBQXpCO0lBRWYsSUFB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dGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCJGb250RmFjZU9ic2VydmVyID0gcmVxdWlyZSAnZm9udGZhY2VvYnNlcnZlcidcclxuXHJcbk1lbnVWaWV3ID0gcmVxdWlyZSAnLi9NZW51VmlldydcclxuU3Vkb2t1VmlldyA9IHJlcXVpcmUgJy4vU3Vkb2t1VmlldydcclxudmVyc2lvbiA9IHJlcXVpcmUgJy4vdmVyc2lvbidcclxuXHJcbmNsYXNzIEFwcFxyXG4gIGNvbnN0cnVjdG9yOiAoQGNhbnZhcykgLT5cclxuICAgIEBjdHggPSBAY2FudmFzLmdldENvbnRleHQoXCIyZFwiKVxyXG4gICAgQGxvYWRGb250KFwic2F4TW9ub1wiKVxyXG4gICAgQGZvbnRzID0ge31cclxuXHJcbiAgICBAdmVyc2lvbkZvbnRIZWlnaHQgPSBNYXRoLmZsb29yKEBjYW52YXMuaGVpZ2h0ICogMC4wMilcclxuICAgIEB2ZXJzaW9uRm9udCA9IEByZWdpc3RlckZvbnQoXCJ2ZXJzaW9uXCIsIFwiI3tAdmVyc2lvbkZvbnRIZWlnaHR9cHggc2F4TW9ubywgbW9ub3NwYWNlXCIpXHJcblxyXG4gICAgQGdlbmVyYXRpbmdGb250SGVpZ2h0ID0gTWF0aC5mbG9vcihAY2FudmFzLmhlaWdodCAqIDAuMDQpXHJcbiAgICBAZ2VuZXJhdGluZ0ZvbnQgPSBAcmVnaXN0ZXJGb250KFwiZ2VuZXJhdGluZ1wiLCBcIiN7QGdlbmVyYXRpbmdGb250SGVpZ2h0fXB4IHNheE1vbm8sIG1vbm9zcGFjZVwiKVxyXG5cclxuICAgIEB2aWV3cyA9XHJcbiAgICAgIG1lbnU6IG5ldyBNZW51Vmlldyh0aGlzLCBAY2FudmFzKVxyXG4gICAgICBzdWRva3U6IG5ldyBTdWRva3VWaWV3KHRoaXMsIEBjYW52YXMpXHJcbiAgICBAc3dpdGNoVmlldyhcInN1ZG9rdVwiKVxyXG5cclxuICBtZWFzdXJlRm9udHM6IC0+XHJcbiAgICBmb3IgZm9udE5hbWUsIGYgb2YgQGZvbnRzXHJcbiAgICAgIEBjdHguZm9udCA9IGYuc3R5bGVcclxuICAgICAgQGN0eC5maWxsU3R5bGUgPSBcImJsYWNrXCJcclxuICAgICAgQGN0eC50ZXh0QWxpZ24gPSBcImNlbnRlclwiXHJcbiAgICAgIGYuaGVpZ2h0ID0gTWF0aC5mbG9vcihAY3R4Lm1lYXN1cmVUZXh0KFwibVwiKS53aWR0aCAqIDEuMSkgIyBiZXN0IGhhY2sgZXZlclxyXG4gICAgICBjb25zb2xlLmxvZyBcIkZvbnQgI3tmb250TmFtZX0gbWVhc3VyZWQgYXQgI3tmLmhlaWdodH0gcGl4ZWxzXCJcclxuICAgIHJldHVyblxyXG5cclxuICByZWdpc3RlckZvbnQ6IChuYW1lLCBzdHlsZSkgLT5cclxuICAgIGZvbnQgPVxyXG4gICAgICBuYW1lOiBuYW1lXHJcbiAgICAgIHN0eWxlOiBzdHlsZVxyXG4gICAgICBoZWlnaHQ6IDBcclxuICAgIEBmb250c1tuYW1lXSA9IGZvbnRcclxuICAgIEBtZWFzdXJlRm9udHMoKVxyXG4gICAgcmV0dXJuIGZvbnRcclxuXHJcbiAgbG9hZEZvbnQ6IChmb250TmFtZSkgLT5cclxuICAgIGZvbnQgPSBuZXcgRm9udEZhY2VPYnNlcnZlcihmb250TmFtZSlcclxuICAgIGZvbnQubG9hZCgpLnRoZW4gPT5cclxuICAgICAgY29uc29sZS5sb2coXCIje2ZvbnROYW1lfSBsb2FkZWQsIHJlZHJhd2luZy4uLlwiKVxyXG4gICAgICBAbWVhc3VyZUZvbnRzKClcclxuICAgICAgQGRyYXcoKVxyXG5cclxuICBzd2l0Y2hWaWV3OiAodmlldykgLT5cclxuICAgIEB2aWV3ID0gQHZpZXdzW3ZpZXddXHJcbiAgICBAZHJhdygpXHJcblxyXG4gIG5ld0dhbWU6IChkaWZmaWN1bHR5KSAtPlxyXG4gICAgIyBjb25zb2xlLmxvZyBcImFwcC5uZXdHYW1lKCN7ZGlmZmljdWx0eX0pXCJcclxuXHJcbiAgICAjIEBkcmF3RmlsbCgwLCAwLCBAY2FudmFzLndpZHRoLCBAY2FudmFzLmhlaWdodCwgXCIjNDQ0NDQ0XCIpXHJcbiAgICAjIEBkcmF3VGV4dENlbnRlcmVkKFwiR2VuZXJhdGluZywgcGxlYXNlIHdhaXQuLi5cIiwgQGNhbnZhcy53aWR0aCAvIDIsIEBjYW52YXMuaGVpZ2h0IC8gMiwgQGdlbmVyYXRpbmdGb250LCBcIiNmZmZmZmZcIilcclxuXHJcbiAgICAjIHdpbmRvdy5zZXRUaW1lb3V0ID0+XHJcbiAgICBAdmlld3Muc3Vkb2t1Lm5ld0dhbWUoZGlmZmljdWx0eSlcclxuICAgIEBzd2l0Y2hWaWV3KFwic3Vkb2t1XCIpXHJcbiAgICAjICwgMFxyXG5cclxuICByZXNldDogLT5cclxuICAgIEB2aWV3cy5zdWRva3UucmVzZXQoKVxyXG4gICAgQHN3aXRjaFZpZXcoXCJzdWRva3VcIilcclxuXHJcbiAgaW1wb3J0OiAoaW1wb3J0U3RyaW5nKSAtPlxyXG4gICAgcmV0dXJuIEB2aWV3cy5zdWRva3UuaW1wb3J0KGltcG9ydFN0cmluZylcclxuXHJcbiAgZXhwb3J0OiAtPlxyXG4gICAgcmV0dXJuIEB2aWV3cy5zdWRva3UuZXhwb3J0KClcclxuXHJcbiAgaG9sZUNvdW50OiAtPlxyXG4gICAgcmV0dXJuIEB2aWV3cy5zdWRva3UuaG9sZUNvdW50KClcclxuXHJcbiAgZHJhdzogLT5cclxuICAgIEB2aWV3LmRyYXcoKVxyXG5cclxuICBjbGljazogKHgsIHkpIC0+XHJcbiAgICBAdmlldy5jbGljayh4LCB5KVxyXG5cclxuICBrZXk6IChrKSAtPlxyXG4gICAgQHZpZXcua2V5KGspXHJcblxyXG4gIGRyYXdGaWxsOiAoeCwgeSwgdywgaCwgY29sb3IpIC0+XHJcbiAgICBAY3R4LmJlZ2luUGF0aCgpXHJcbiAgICBAY3R4LnJlY3QoeCwgeSwgdywgaClcclxuICAgIEBjdHguZmlsbFN0eWxlID0gY29sb3JcclxuICAgIEBjdHguZmlsbCgpXHJcblxyXG4gIGRyYXdSb3VuZGVkUmVjdDogKHgsIHksIHcsIGgsIHIsIGZpbGxDb2xvciA9IG51bGwsIHN0cm9rZUNvbG9yID0gbnVsbCkgLT5cclxuICAgIEBjdHgucm91bmRSZWN0KHgsIHksIHcsIGgsIHIpXHJcbiAgICBpZiBmaWxsQ29sb3IgIT0gbnVsbFxyXG4gICAgICBAY3R4LmZpbGxTdHlsZSA9IGZpbGxDb2xvclxyXG4gICAgICBAY3R4LmZpbGwoKVxyXG4gICAgaWYgc3Ryb2tlQ29sb3IgIT0gbnVsbFxyXG4gICAgICBAY3R4LnN0cm9rZVN0eWxlID0gc3Ryb2tlQ29sb3JcclxuICAgICAgQGN0eC5zdHJva2UoKVxyXG4gICAgcmV0dXJuXHJcblxyXG4gIGRyYXdSZWN0OiAoeCwgeSwgdywgaCwgY29sb3IsIGxpbmVXaWR0aCA9IDEpIC0+XHJcbiAgICBAY3R4LmJlZ2luUGF0aCgpXHJcbiAgICBAY3R4LnN0cm9rZVN0eWxlID0gY29sb3JcclxuICAgIEBjdHgubGluZVdpZHRoID0gbGluZVdpZHRoXHJcbiAgICBAY3R4LnJlY3QoeCwgeSwgdywgaClcclxuICAgIEBjdHguc3Ryb2tlKClcclxuXHJcbiAgZHJhd0xpbmU6ICh4MSwgeTEsIHgyLCB5MiwgY29sb3IgPSBcImJsYWNrXCIsIGxpbmVXaWR0aCA9IDEpIC0+XHJcbiAgICBAY3R4LmJlZ2luUGF0aCgpXHJcbiAgICBAY3R4LnN0cm9rZVN0eWxlID0gY29sb3JcclxuICAgIEBjdHgubGluZVdpZHRoID0gbGluZVdpZHRoXHJcbiAgICBAY3R4LmxpbmVDYXAgPSBcImJ1dHRcIlxyXG4gICAgQGN0eC5tb3ZlVG8oeDEsIHkxKVxyXG4gICAgQGN0eC5saW5lVG8oeDIsIHkyKVxyXG4gICAgQGN0eC5zdHJva2UoKVxyXG5cclxuICBkcmF3VGV4dENlbnRlcmVkOiAodGV4dCwgY3gsIGN5LCBmb250LCBjb2xvcikgLT5cclxuICAgIEBjdHguZm9udCA9IGZvbnQuc3R5bGVcclxuICAgIEBjdHguZmlsbFN0eWxlID0gY29sb3JcclxuICAgIEBjdHgudGV4dEFsaWduID0gXCJjZW50ZXJcIlxyXG4gICAgQGN0eC5maWxsVGV4dCh0ZXh0LCBjeCwgY3kgKyAoZm9udC5oZWlnaHQgLyAyKSlcclxuXHJcbiAgZHJhd0xvd2VyTGVmdDogKHRleHQsIGNvbG9yID0gXCJ3aGl0ZVwiKSAtPlxyXG4gICAgQGN0eCA9IEBjYW52YXMuZ2V0Q29udGV4dChcIjJkXCIpXHJcbiAgICBAY3R4LmZvbnQgPSBAdmVyc2lvbkZvbnQuc3R5bGVcclxuICAgIEBjdHguZmlsbFN0eWxlID0gY29sb3JcclxuICAgIEBjdHgudGV4dEFsaWduID0gXCJsZWZ0XCJcclxuICAgIEBjdHguZmlsbFRleHQodGV4dCwgMCwgQGNhbnZhcy5oZWlnaHQgLSAoQHZlcnNpb25Gb250LmhlaWdodCAvIDIpKVxyXG5cclxuICBkcmF3VmVyc2lvbjogKGNvbG9yID0gXCJ3aGl0ZVwiKSAtPlxyXG4gICAgQGN0eCA9IEBjYW52YXMuZ2V0Q29udGV4dChcIjJkXCIpXHJcbiAgICBAY3R4LmZvbnQgPSBAdmVyc2lvbkZvbnQuc3R5bGVcclxuICAgIEBjdHguZmlsbFN0eWxlID0gY29sb3JcclxuICAgIEBjdHgudGV4dEFsaWduID0gXCJyaWdodFwiXHJcbiAgICBAY3R4LmZpbGxUZXh0KFwidiN7dmVyc2lvbn1cIiwgQGNhbnZhcy53aWR0aCAtIChAdmVyc2lvbkZvbnQuaGVpZ2h0IC8gMiksIEBjYW52YXMuaGVpZ2h0IC0gKEB2ZXJzaW9uRm9udC5oZWlnaHQgLyAyKSlcclxuXHJcbiAgZHJhd0FyYzogKHgxLCB5MSwgeDIsIHkyLCByYWRpdXMsIGNvbG9yLCBsaW5lV2lkdGgpIC0+XHJcbiAgICAjIERlcml2ZWQgZnJvbSBodHRwczovL2dpdGh1Yi5jb20vamFtYm9sby9kcmF3QXJjIGF0IDZjM2UwZDNcclxuXHJcbiAgICBQMSA9IHsgeDogeDEsIHk6IHkxIH1cclxuICAgIFAyID0geyB4OiB4MiwgeTogeTIgfVxyXG5cclxuICAgICMgRGV0ZXJtaW5lIHRoZSBtaWRwb2ludCAoTSkgZnJvbSBQMSB0byBQMlxyXG4gICAgTSA9XHJcbiAgICAgIHg6IChQMS54ICsgUDIueCkgLyAyXHJcbiAgICAgIHk6IChQMS55ICsgUDIueSkgLyAyXHJcblxyXG4gICAgIyBEZXRlcm1pbmUgdGhlIGRpc3RhbmNlIGZyb20gTSB0byBQMVxyXG4gICAgZE1QMSA9IE1hdGguc3FydCgoUDEueCAtIE0ueCkqKFAxLnggLSBNLngpICsgKFAxLnkgLSBNLnkpKihQMS55IC0gTS55KSlcclxuXHJcbiAgICAjIFZhbGlkYXRlIHRoZSByYWRpdXNcclxuICAgIGlmIG5vdCByYWRpdXM/IG9yIHJhZGl1cyA8IGRNUDFcclxuICAgICAgcmFkaXVzID0gZE1QMVxyXG5cclxuICAgICMgRGV0ZXJtaW5lIHRoZSB1bml0IHZlY3RvciBmcm9tIE0gdG8gUDFcclxuICAgIHVNUDEgPVxyXG4gICAgICB4OiAoUDEueCAtIE0ueCkgLyBkTVAxXHJcbiAgICAgIHk6IChQMS55IC0gTS55KSAvIGRNUDFcclxuXHJcbiAgICAjIERldGVybWluZSB0aGUgdW5pdCB2ZWN0b3IgZnJvbSBNIHRvIFEgKGp1c3QgdU1QMSByb3RhdGVkIHBpLzIpXHJcbiAgICB1TVEgPSB7IHg6IC11TVAxLnksIHk6IHVNUDEueCB9XHJcblxyXG4gICAgIyBEZXRlcm1pbmUgdGhlIGRpc3RhbmNlIGZyb20gdGhlIGNlbnRlciBvZiB0aGUgY2lyY2xlIChDKSB0byBNXHJcbiAgICBkQ00gPSBNYXRoLnNxcnQocmFkaXVzKnJhZGl1cyAtIGRNUDEqZE1QMSlcclxuXHJcbiAgICAjIERldGVybWluZSB0aGUgZGlzdGFuY2UgZnJvbSBNIHRvIFFcclxuICAgIGRNUSA9IGRNUDEgKiBkTVAxIC8gZENNXHJcblxyXG4gICAgIyBEZXRlcm1pbmUgdGhlIGxvY2F0aW9uIG9mIFFcclxuICAgIFEgPVxyXG4gICAgICB4OiBNLnggKyB1TVEueCAqIGRNUVxyXG4gICAgICB5OiBNLnkgKyB1TVEueSAqIGRNUVxyXG5cclxuICAgIEBjdHguYmVnaW5QYXRoKClcclxuICAgIEBjdHguc3Ryb2tlU3R5bGUgPSBjb2xvclxyXG4gICAgQGN0eC5saW5lV2lkdGggPSBsaW5lV2lkdGhcclxuICAgIEBjdHgubGluZUNhcCA9IFwicm91bmRcIlxyXG4gICAgQGN0eC5tb3ZlVG8oeDEsIHkxKVxyXG4gICAgQGN0eC5hcmNUbyhRLngsIFEueSwgeDIsIHkyLCByYWRpdXMpXHJcbiAgICBAY3R4LnN0cm9rZSgpXHJcbiAgICByZXR1cm5cclxuXHJcbiAgZHJhd1BvaW50OiAoeCwgeSwgciwgY29sb3IpIC0+XHJcbiAgICBAY3R4LmJlZ2luUGF0aCgpXHJcbiAgICBAY3R4LmZpbGxTdHlsZSA9IGNvbG9yXHJcbiAgICBAY3R4LmFyYyh4LCB5LCByLCAwLCAyKk1hdGguUEkpXHJcbiAgICBAY3R4LmZpbGwoKVxyXG4gICAgcmV0dXJuXHJcblxyXG5DYW52YXNSZW5kZXJpbmdDb250ZXh0MkQucHJvdG90eXBlLnJvdW5kUmVjdCA9ICh4LCB5LCB3LCBoLCByKSAtPlxyXG4gIGlmICh3IDwgMiAqIHIpIHRoZW4gciA9IHcgLyAyXHJcbiAgaWYgKGggPCAyICogcikgdGhlbiByID0gaCAvIDJcclxuICBAYmVnaW5QYXRoKClcclxuICBAbW92ZVRvKHgrciwgeSlcclxuICBAYXJjVG8oeCt3LCB5LCAgIHgrdywgeStoLCByKVxyXG4gIEBhcmNUbyh4K3csIHkraCwgeCwgICB5K2gsIHIpXHJcbiAgQGFyY1RvKHgsICAgeStoLCB4LCAgIHksICAgcilcclxuICBAYXJjVG8oeCwgICB5LCAgIHgrdywgeSwgICByKVxyXG4gIEBjbG9zZVBhdGgoKVxyXG4gIHJldHVybiB0aGlzXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEFwcFxyXG4iLCJTdWRva3VHZW5lcmF0b3IgPSByZXF1aXJlICcuL1N1ZG9rdUdlbmVyYXRvcidcclxuXHJcbkJVVFRPTl9IRUlHSFQgPSAwLjA2XHJcbkZJUlNUX0JVVFRPTl9ZID0gMC4yMlxyXG5CVVRUT05fU1BBQ0lORyA9IDAuMDhcclxuQlVUVE9OX1NFUEFSQVRPUiA9IDAuMDNcclxuXHJcbmJ1dHRvblBvcyA9IChpbmRleCkgLT5cclxuICB5ID0gRklSU1RfQlVUVE9OX1kgKyAoQlVUVE9OX1NQQUNJTkcgKiBpbmRleClcclxuICBpZiBpbmRleCA+IDNcclxuICAgIHkgKz0gQlVUVE9OX1NFUEFSQVRPUlxyXG4gIGlmIGluZGV4ID4gNFxyXG4gICAgeSArPSBCVVRUT05fU0VQQVJBVE9SXHJcbiAgaWYgaW5kZXggPiA2XHJcbiAgICB5ICs9IEJVVFRPTl9TRVBBUkFUT1JcclxuICByZXR1cm4geVxyXG5cclxuY2xhc3MgTWVudVZpZXdcclxuICBjb25zdHJ1Y3RvcjogKEBhcHAsIEBjYW52YXMpIC0+XHJcbiAgICBAYnV0dG9ucyA9XHJcbiAgICAgIG5ld0Vhc3k6XHJcbiAgICAgICAgeTogYnV0dG9uUG9zKDApXHJcbiAgICAgICAgdGV4dDogXCJOZXcgR2FtZTogRWFzeVwiXHJcbiAgICAgICAgYmdDb2xvcjogXCIjMzM3NzMzXCJcclxuICAgICAgICB0ZXh0Q29sb3I6IFwiI2ZmZmZmZlwiXHJcbiAgICAgICAgY2xpY2s6IEBuZXdFYXN5LmJpbmQodGhpcylcclxuICAgICAgbmV3TWVkaXVtOlxyXG4gICAgICAgIHk6IGJ1dHRvblBvcygxKVxyXG4gICAgICAgIHRleHQ6IFwiTmV3IEdhbWU6IE1lZGl1bVwiXHJcbiAgICAgICAgYmdDb2xvcjogXCIjNzc3NzMzXCJcclxuICAgICAgICB0ZXh0Q29sb3I6IFwiI2ZmZmZmZlwiXHJcbiAgICAgICAgY2xpY2s6IEBuZXdNZWRpdW0uYmluZCh0aGlzKVxyXG4gICAgICBuZXdIYXJkOlxyXG4gICAgICAgIHk6IGJ1dHRvblBvcygyKVxyXG4gICAgICAgIHRleHQ6IFwiTmV3IEdhbWU6IEhhcmRcIlxyXG4gICAgICAgIGJnQ29sb3I6IFwiIzc3MzMzM1wiXHJcbiAgICAgICAgdGV4dENvbG9yOiBcIiNmZmZmZmZcIlxyXG4gICAgICAgIGNsaWNrOiBAbmV3SGFyZC5iaW5kKHRoaXMpXHJcbiAgICAgIG5ld0V4dHJlbWU6XHJcbiAgICAgICAgeTogYnV0dG9uUG9zKDMpXHJcbiAgICAgICAgdGV4dDogXCJOZXcgR2FtZTogRXh0cmVtZVwiXHJcbiAgICAgICAgYmdDb2xvcjogXCIjNzcxMTExXCJcclxuICAgICAgICB0ZXh0Q29sb3I6IFwiI2ZmZmZmZlwiXHJcbiAgICAgICAgY2xpY2s6IEBuZXdFeHRyZW1lLmJpbmQodGhpcylcclxuICAgICAgcmVzZXQ6XHJcbiAgICAgICAgeTogYnV0dG9uUG9zKDQpXHJcbiAgICAgICAgdGV4dDogXCJSZXNldCBQdXp6bGVcIlxyXG4gICAgICAgIGJnQ29sb3I6IFwiIzc3MzM3N1wiXHJcbiAgICAgICAgdGV4dENvbG9yOiBcIiNmZmZmZmZcIlxyXG4gICAgICAgIGNsaWNrOiBAcmVzZXQuYmluZCh0aGlzKVxyXG4gICAgICBpbXBvcnQ6XHJcbiAgICAgICAgeTogYnV0dG9uUG9zKDUpXHJcbiAgICAgICAgdGV4dDogXCJMb2FkIFB1enpsZVwiXHJcbiAgICAgICAgYmdDb2xvcjogXCIjMzM2NjY2XCJcclxuICAgICAgICB0ZXh0Q29sb3I6IFwiI2ZmZmZmZlwiXHJcbiAgICAgICAgY2xpY2s6IEBpbXBvcnQuYmluZCh0aGlzKVxyXG4gICAgICBleHBvcnQ6XHJcbiAgICAgICAgeTogYnV0dG9uUG9zKDYpXHJcbiAgICAgICAgdGV4dDogXCJTaGFyZSBQdXp6bGVcIlxyXG4gICAgICAgIGJnQ29sb3I6IFwiIzMzNjY2NlwiXHJcbiAgICAgICAgdGV4dENvbG9yOiBcIiNmZmZmZmZcIlxyXG4gICAgICAgIGNsaWNrOiBAZXhwb3J0LmJpbmQodGhpcylcclxuICAgICAgcmVzdW1lOlxyXG4gICAgICAgIHk6IGJ1dHRvblBvcyg3KVxyXG4gICAgICAgIHRleHQ6IFwiUmVzdW1lXCJcclxuICAgICAgICBiZ0NvbG9yOiBcIiM3Nzc3NzdcIlxyXG4gICAgICAgIHRleHRDb2xvcjogXCIjZmZmZmZmXCJcclxuICAgICAgICBjbGljazogQHJlc3VtZS5iaW5kKHRoaXMpXHJcblxyXG4gICAgYnV0dG9uV2lkdGggPSBAY2FudmFzLndpZHRoICogMC44XHJcbiAgICBAYnV0dG9uSGVpZ2h0ID0gQGNhbnZhcy5oZWlnaHQgKiBCVVRUT05fSEVJR0hUXHJcbiAgICBidXR0b25YID0gKEBjYW52YXMud2lkdGggLSBidXR0b25XaWR0aCkgLyAyXHJcbiAgICBmb3IgYnV0dG9uTmFtZSwgYnV0dG9uIG9mIEBidXR0b25zXHJcbiAgICAgIGJ1dHRvbi54ID0gYnV0dG9uWFxyXG4gICAgICBidXR0b24ueSA9IEBjYW52YXMuaGVpZ2h0ICogYnV0dG9uLnlcclxuICAgICAgYnV0dG9uLncgPSBidXR0b25XaWR0aFxyXG4gICAgICBidXR0b24uaCA9IEBidXR0b25IZWlnaHRcclxuXHJcbiAgICBidXR0b25Gb250SGVpZ2h0ID0gTWF0aC5mbG9vcihAYnV0dG9uSGVpZ2h0ICogMC40KVxyXG4gICAgQGJ1dHRvbkZvbnQgPSBAYXBwLnJlZ2lzdGVyRm9udChcImJ1dHRvblwiLCBcIiN7YnV0dG9uRm9udEhlaWdodH1weCBzYXhNb25vLCBtb25vc3BhY2VcIilcclxuICAgIHRpdGxlRm9udEhlaWdodCA9IE1hdGguZmxvb3IoQGNhbnZhcy5oZWlnaHQgKiAwLjA2KVxyXG4gICAgQHRpdGxlRm9udCA9IEBhcHAucmVnaXN0ZXJGb250KFwiYnV0dG9uXCIsIFwiI3t0aXRsZUZvbnRIZWlnaHR9cHggc2F4TW9ubywgbW9ub3NwYWNlXCIpXHJcbiAgICBzdWJ0aXRsZUZvbnRIZWlnaHQgPSBNYXRoLmZsb29yKEBjYW52YXMuaGVpZ2h0ICogMC4wMilcclxuICAgIEBzdWJ0aXRsZUZvbnQgPSBAYXBwLnJlZ2lzdGVyRm9udChcImJ1dHRvblwiLCBcIiN7c3VidGl0bGVGb250SGVpZ2h0fXB4IHNheE1vbm8sIG1vbm9zcGFjZVwiKVxyXG4gICAgcmV0dXJuXHJcblxyXG4gIGRyYXc6IC0+XHJcbiAgICBAYXBwLmRyYXdGaWxsKDAsIDAsIEBjYW52YXMud2lkdGgsIEBjYW52YXMuaGVpZ2h0LCBcIiMzMzMzMzNcIilcclxuXHJcbiAgICB4ID0gQGNhbnZhcy53aWR0aCAvIDJcclxuICAgIHNoYWRvd09mZnNldCA9IEBjYW52YXMuaGVpZ2h0ICogMC4wMDVcclxuXHJcbiAgICB5MSA9IEBjYW52YXMuaGVpZ2h0ICogMC4wNVxyXG4gICAgeTIgPSB5MSArIEBjYW52YXMuaGVpZ2h0ICogMC4wNlxyXG4gICAgeTMgPSB5MiArIEBjYW52YXMuaGVpZ2h0ICogMC4wNlxyXG4gICAgQGFwcC5kcmF3VGV4dENlbnRlcmVkKFwiQmFkIEd1eVwiLCB4ICsgc2hhZG93T2Zmc2V0LCB5MSArIHNoYWRvd09mZnNldCwgQHRpdGxlRm9udCwgXCIjMDAwMDAwXCIpXHJcbiAgICBAYXBwLmRyYXdUZXh0Q2VudGVyZWQoXCJTdWRva3VcIiwgeCArIHNoYWRvd09mZnNldCwgeTIgKyBzaGFkb3dPZmZzZXQsIEB0aXRsZUZvbnQsIFwiIzAwMDAwMFwiKVxyXG4gICAgQGFwcC5kcmF3VGV4dENlbnRlcmVkKFwiQmFkIEd1eVwiLCB4LCB5MSwgQHRpdGxlRm9udCwgXCIjZmZmZmZmXCIpXHJcbiAgICBAYXBwLmRyYXdUZXh0Q2VudGVyZWQoXCJTdWRva3VcIiwgeCwgeTIsIEB0aXRsZUZvbnQsIFwiI2ZmZmZmZlwiKVxyXG4gICAgQGFwcC5kcmF3VGV4dENlbnRlcmVkKFwiSXQncyBsaWtlIFN1ZG9rdSwgYnV0IHlvdSBhcmUgdGhlIGJhZCBndXkuXCIsIHgsIHkzLCBAc3VidGl0bGVGb250LCBcIiNmZmZmZmZcIilcclxuXHJcbiAgICBmb3IgYnV0dG9uTmFtZSwgYnV0dG9uIG9mIEBidXR0b25zXHJcbiAgICAgIEBhcHAuZHJhd1JvdW5kZWRSZWN0KGJ1dHRvbi54ICsgc2hhZG93T2Zmc2V0LCBidXR0b24ueSArIHNoYWRvd09mZnNldCwgYnV0dG9uLncsIGJ1dHRvbi5oLCBidXR0b24uaCAqIDAuMywgXCJibGFja1wiLCBcImJsYWNrXCIpXHJcbiAgICAgIEBhcHAuZHJhd1JvdW5kZWRSZWN0KGJ1dHRvbi54LCBidXR0b24ueSwgYnV0dG9uLncsIGJ1dHRvbi5oLCBidXR0b24uaCAqIDAuMywgYnV0dG9uLmJnQ29sb3IsIFwiIzk5OTk5OVwiKVxyXG4gICAgICBAYXBwLmRyYXdUZXh0Q2VudGVyZWQoYnV0dG9uLnRleHQsIGJ1dHRvbi54ICsgKGJ1dHRvbi53IC8gMiksIGJ1dHRvbi55ICsgKGJ1dHRvbi5oIC8gMiksIEBidXR0b25Gb250LCBidXR0b24udGV4dENvbG9yKVxyXG5cclxuICAgIEBhcHAuZHJhd0xvd2VyTGVmdChcIiN7QGFwcC5ob2xlQ291bnQoKX0vODFcIilcclxuICAgIEBhcHAuZHJhd1ZlcnNpb24oKVxyXG5cclxuICBjbGljazogKHgsIHkpIC0+XHJcbiAgICBmb3IgYnV0dG9uTmFtZSwgYnV0dG9uIG9mIEBidXR0b25zXHJcbiAgICAgIGlmICh5ID4gYnV0dG9uLnkpICYmICh5IDwgKGJ1dHRvbi55ICsgQGJ1dHRvbkhlaWdodCkpXHJcbiAgICAgICAgIyBjb25zb2xlLmxvZyBcImJ1dHRvbiBwcmVzc2VkOiAje2J1dHRvbk5hbWV9XCJcclxuICAgICAgICBidXR0b24uY2xpY2soKVxyXG4gICAgcmV0dXJuXHJcblxyXG4gIG5ld0Vhc3k6IC0+XHJcbiAgICBAYXBwLm5ld0dhbWUoU3Vkb2t1R2VuZXJhdG9yLmRpZmZpY3VsdHkuZWFzeSlcclxuXHJcbiAgbmV3TWVkaXVtOiAtPlxyXG4gICAgQGFwcC5uZXdHYW1lKFN1ZG9rdUdlbmVyYXRvci5kaWZmaWN1bHR5Lm1lZGl1bSlcclxuXHJcbiAgbmV3SGFyZDogLT5cclxuICAgIEBhcHAubmV3R2FtZShTdWRva3VHZW5lcmF0b3IuZGlmZmljdWx0eS5oYXJkKVxyXG5cclxuICBuZXdFeHRyZW1lOiAtPlxyXG4gICAgQGFwcC5uZXdHYW1lKFN1ZG9rdUdlbmVyYXRvci5kaWZmaWN1bHR5LmV4dHJlbWUpXHJcblxyXG4gIHJlc2V0OiAtPlxyXG4gICAgQGFwcC5yZXNldCgpXHJcblxyXG4gIHJlc3VtZTogLT5cclxuICAgIEBhcHAuc3dpdGNoVmlldyhcInN1ZG9rdVwiKVxyXG5cclxuICBleHBvcnQ6IC0+XHJcbiAgICBpZiBuYXZpZ2F0b3Iuc2hhcmUgIT0gdW5kZWZpbmVkXHJcbiAgICAgIG5hdmlnYXRvci5zaGFyZSB7XHJcbiAgICAgICAgdGl0bGU6IFwiU3Vkb2t1IFNoYXJlZCBHYW1lXCJcclxuICAgICAgICB0ZXh0OiBAYXBwLmV4cG9ydCgpXHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuXHJcbiAgICB3aW5kb3cucHJvbXB0KFwiQ29weSB0aGlzIGFuZCBwYXN0ZSB0byBhIGZyaWVuZDpcIiwgQGFwcC5leHBvcnQoKSlcclxuXHJcbiAgaW1wb3J0OiAtPlxyXG4gICAgaW1wb3J0U3RyaW5nID0gd2luZG93LnByb21wdChcIlBhc3RlIGFuIGV4cG9ydGVkIGdhbWUgaGVyZTpcIiwgXCJcIilcclxuICAgIGxvb3BcclxuICAgICAgaWYgaW1wb3J0U3RyaW5nID09IG51bGxcclxuICAgICAgICByZXR1cm5cclxuICAgICAgaWYgQGFwcC5pbXBvcnQoaW1wb3J0U3RyaW5nKVxyXG4gICAgICAgIEBhcHAuc3dpdGNoVmlldyhcInN1ZG9rdVwiKVxyXG4gICAgICAgIHJldHVyblxyXG4gICAgICBpbXBvcnRTdHJpbmcgPSB3aW5kb3cucHJvbXB0KFwiSW52YWxpZCBnYW1lLCB0cnkgYWdhaW46XCIsIFwiXCIpXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IE1lbnVWaWV3XHJcbiIsIlN1ZG9rdUdlbmVyYXRvciA9IHJlcXVpcmUgJy4vU3Vkb2t1R2VuZXJhdG9yJ1xyXG5cclxuIyBSZXR1cm5zIHRoZSBpbmRleCBvZiBhIGNlbGwgaW4gcm93IG1ham9yIG9yZGVyICh0aG91Z2ggdGhleSBhcmUgc3RvcmVkIGluIGNvbHVtbiBtYWpvciBvcmRlcilcclxuY2VsbEluZGV4ID0gKHgsIHkpIC0+IHkgKiA5ICsgeFxyXG5cclxuIyBTb3J0IGJ5IGFzY2VuZGluZyBsb2NhdGlvbiBhbmQgdGhlbiBieSBzdHJlbmd0aCAoc3Ryb25nIHRoZW4gd2VhaylcclxuYXNjZW5kaW5nTGlua1NvcnQgPSAoYSwgYikgLT5cclxuICBhMCA9IGNlbGxJbmRleChhLmNlbGxzWzBdLngsIGEuY2VsbHNbMF0ueSlcclxuICBhMSA9IGNlbGxJbmRleChhLmNlbGxzWzFdLngsIGEuY2VsbHNbMV0ueSlcclxuICBiMCA9IGNlbGxJbmRleChiLmNlbGxzWzBdLngsIGIuY2VsbHNbMF0ueSlcclxuICBiMSA9IGNlbGxJbmRleChiLmNlbGxzWzFdLngsIGIuY2VsbHNbMV0ueSlcclxuICByZXR1cm4gaWYgYTAgPiBiMCBvciAoYTAgPT0gYjAgYW5kIChhMSA+IGIxIG9yIChhMSA9PSBiMSBhbmQgKG5vdCBhLnN0cm9uZz8gYW5kIGIuc3Ryb25nPykpKSkgdGhlbiAxIGVsc2UgLTFcclxuXHJcbiMgTm90ZSBzdHJlbmd0aCBpcyBub3QgY29tcGFyZWRcclxudW5pcXVlTGlua0ZpbHRlciA9IChlLCBpLCBhKSAtPlxyXG4gIGlmIGkgPT0gMFxyXG4gICAgcmV0dXJuIHRydWVcclxuICBwID0gYVtpLTFdXHJcbiAgZTAgPSBjZWxsSW5kZXgoZS5jZWxsc1swXS54LCBlLmNlbGxzWzBdLnkpXHJcbiAgZTEgPSBjZWxsSW5kZXgoZS5jZWxsc1sxXS54LCBlLmNlbGxzWzFdLnkpXHJcbiAgcDAgPSBjZWxsSW5kZXgocC5jZWxsc1swXS54LCBwLmNlbGxzWzBdLnkpXHJcbiAgcDEgPSBjZWxsSW5kZXgocC5jZWxsc1sxXS54LCBwLmNlbGxzWzFdLnkpXHJcbiAgcmV0dXJuIGUwICE9IHAwIG9yIGUxICE9IHAxXHJcblxyXG5nZW5lcmF0ZUxpbmtQZXJtdXRhdGlvbnMgPSAoY2VsbHMpIC0+XHJcbiAgbGlua3MgPSBbXVxyXG4gIGNvdW50ID0gY2VsbHMubGVuZ3RoXHJcbiAgZm9yIGkgaW4gWzAuLi5jb3VudC0xXVxyXG4gICAgZm9yIGogaW4gW2krMS4uLmNvdW50XVxyXG4gICAgICBsaW5rcy5wdXNoKHsgY2VsbHM6IFtjZWxsc1tpXSwgY2VsbHNbal1dIH0pXHJcbiAgcmV0dXJuIGxpbmtzXHJcblxyXG5jbGFzcyBTdWRva3VHYW1lXHJcbiAgY29uc3RydWN0b3I6IC0+XHJcbiAgICBAY2xlYXIoKVxyXG4gICAgaWYgbm90IEBsb2FkKClcclxuICAgICAgQG5ld0dhbWUoU3Vkb2t1R2VuZXJhdG9yLmRpZmZpY3VsdHkuZWFzeSlcclxuICAgIHJldHVyblxyXG5cclxuICBjbGVhcjogLT5cclxuICAgIEBncmlkID0gbmV3IEFycmF5KDkpLmZpbGwobnVsbClcclxuICAgIGZvciBpIGluIFswLi4uOV1cclxuICAgICAgQGdyaWRbaV0gPSBuZXcgQXJyYXkoOSkuZmlsbChudWxsKVxyXG4gICAgZm9yIGogaW4gWzAuLi45XVxyXG4gICAgICBmb3IgaSBpbiBbMC4uLjldXHJcbiAgICAgICAgQGdyaWRbaV1bal0gPVxyXG4gICAgICAgICAgdmFsdWU6IDBcclxuICAgICAgICAgIGVycm9yOiBmYWxzZVxyXG4gICAgICAgICAgbG9ja2VkOiBmYWxzZVxyXG4gICAgICAgICAgcGVuY2lsOiBuZXcgQXJyYXkoOSkuZmlsbChmYWxzZSlcclxuXHJcbiAgICBAc29sdmVkID0gZmFsc2VcclxuICAgIEB1bmRvSm91cm5hbCA9IFtdXHJcbiAgICBAcmVkb0pvdXJuYWwgPSBbXVxyXG5cclxuICBob2xlQ291bnQ6IC0+XHJcbiAgICBjb3VudCA9IDBcclxuICAgIGZvciBqIGluIFswLi4uOV1cclxuICAgICAgZm9yIGkgaW4gWzAuLi45XVxyXG4gICAgICAgIGlmIG5vdCBAZ3JpZFtpXVtqXS5sb2NrZWRcclxuICAgICAgICAgIGNvdW50ICs9IDFcclxuICAgIHJldHVybiBjb3VudFxyXG5cclxuICBleHBvcnQ6IC0+XHJcbiAgICBleHBvcnRTdHJpbmcgPSBcIlNEXCJcclxuICAgIGZvciBqIGluIFswLi4uOV1cclxuICAgICAgZm9yIGkgaW4gWzAuLi45XVxyXG4gICAgICAgIGlmIEBncmlkW2ldW2pdLmxvY2tlZFxyXG4gICAgICAgICAgZXhwb3J0U3RyaW5nICs9IFwiI3tAZ3JpZFtpXVtqXS52YWx1ZX1cIlxyXG4gICAgICAgIGVsc2VcclxuICAgICAgICAgIGV4cG9ydFN0cmluZyArPSBcIjBcIlxyXG4gICAgcmV0dXJuIGV4cG9ydFN0cmluZ1xyXG5cclxuICB2YWxpZGF0ZTogLT5cclxuICAgIGJvYXJkID0gbmV3IEFycmF5KDkpLmZpbGwobnVsbClcclxuICAgIGZvciBpIGluIFswLi4uOV1cclxuICAgICAgYm9hcmRbaV0gPSBuZXcgQXJyYXkoOSkuZmlsbCgwKVxyXG4gICAgICBmb3IgaiBpbiBbMC4uLjldXHJcbiAgICAgICAgYm9hcmRbaV1bal0gPSBAZ3JpZFtpXVtqXS52YWx1ZVxyXG5cclxuICAgIGdlbmVyYXRvciA9IG5ldyBTdWRva3VHZW5lcmF0b3JcclxuICAgIHJldHVybiBnZW5lcmF0b3IudmFsaWRhdGVHcmlkKGJvYXJkKVxyXG5cclxuICBpbXBvcnQ6IChpbXBvcnRTdHJpbmcpIC0+XHJcbiAgICBpZiBpbXBvcnRTdHJpbmcuaW5kZXhPZihcIlNEXCIpICE9IDBcclxuICAgICAgcmV0dXJuIGZhbHNlXHJcbiAgICBpbXBvcnRTdHJpbmcgPSBpbXBvcnRTdHJpbmcuc3Vic3RyKDIpXHJcbiAgICBpbXBvcnRTdHJpbmcgPSBpbXBvcnRTdHJpbmcucmVwbGFjZSgvW14wLTldL2csIFwiXCIpXHJcbiAgICBpZiBpbXBvcnRTdHJpbmcubGVuZ3RoICE9IDgxXHJcbiAgICAgIHJldHVybiBmYWxzZVxyXG5cclxuICAgIEBjbGVhcigpXHJcblxyXG4gICAgaW5kZXggPSAwXHJcbiAgICB6ZXJvQ2hhckNvZGUgPSBcIjBcIi5jaGFyQ29kZUF0KDApXHJcbiAgICBmb3IgaiBpbiBbMC4uLjldXHJcbiAgICAgIGZvciBpIGluIFswLi4uOV1cclxuICAgICAgICB2ID0gaW1wb3J0U3RyaW5nLmNoYXJDb2RlQXQoaW5kZXgpIC0gemVyb0NoYXJDb2RlXHJcbiAgICAgICAgaW5kZXggKz0gMVxyXG4gICAgICAgIGlmIHYgPiAwXHJcbiAgICAgICAgICBAZ3JpZFtpXVtqXS5sb2NrZWQgPSB0cnVlXHJcbiAgICAgICAgICBAZ3JpZFtpXVtqXS52YWx1ZSA9IHZcclxuXHJcbiAgICByZXR1cm4gZmFsc2UgaWYgbm90IEB2YWxpZGF0ZSgpXHJcblxyXG4gICAgQHVwZGF0ZUNlbGxzKClcclxuICAgIEBzYXZlKClcclxuICAgIHJldHVybiB0cnVlXHJcblxyXG4gIHVwZGF0ZUNlbGw6ICh4LCB5KSAtPlxyXG4gICAgY2VsbCA9IEBncmlkW3hdW3ldXHJcblxyXG4gICAgZm9yIGkgaW4gWzAuLi45XVxyXG4gICAgICBpZiB4ICE9IGlcclxuICAgICAgICB2ID0gQGdyaWRbaV1beV0udmFsdWVcclxuICAgICAgICBpZiB2ID4gMFxyXG4gICAgICAgICAgaWYgdiA9PSBjZWxsLnZhbHVlXHJcbiAgICAgICAgICAgIEBncmlkW2ldW3ldLmVycm9yID0gdHJ1ZVxyXG4gICAgICAgICAgICBjZWxsLmVycm9yID0gdHJ1ZVxyXG5cclxuICAgICAgaWYgeSAhPSBpXHJcbiAgICAgICAgdiA9IEBncmlkW3hdW2ldLnZhbHVlXHJcbiAgICAgICAgaWYgdiA+IDBcclxuICAgICAgICAgIGlmIHYgPT0gY2VsbC52YWx1ZVxyXG4gICAgICAgICAgICBAZ3JpZFt4XVtpXS5lcnJvciA9IHRydWVcclxuICAgICAgICAgICAgY2VsbC5lcnJvciA9IHRydWVcclxuXHJcbiAgICBzeCA9IE1hdGguZmxvb3IoeCAvIDMpICogM1xyXG4gICAgc3kgPSBNYXRoLmZsb29yKHkgLyAzKSAqIDNcclxuICAgIGZvciBqIGluIFswLi4uM11cclxuICAgICAgZm9yIGkgaW4gWzAuLi4zXVxyXG4gICAgICAgIGlmICh4ICE9IChzeCArIGkpKSAmJiAoeSAhPSAoc3kgKyBqKSlcclxuICAgICAgICAgIHYgPSBAZ3JpZFtzeCArIGldW3N5ICsgal0udmFsdWVcclxuICAgICAgICAgIGlmIHYgPiAwXHJcbiAgICAgICAgICAgIGlmIHYgPT0gY2VsbC52YWx1ZVxyXG4gICAgICAgICAgICAgIEBncmlkW3N4ICsgaV1bc3kgKyBqXS5lcnJvciA9IHRydWVcclxuICAgICAgICAgICAgICBjZWxsLmVycm9yID0gdHJ1ZVxyXG4gICAgcmV0dXJuXHJcblxyXG4gIHVwZGF0ZUNlbGxzOiAtPlxyXG4gICAgZm9yIGogaW4gWzAuLi45XVxyXG4gICAgICBmb3IgaSBpbiBbMC4uLjldXHJcbiAgICAgICAgQGdyaWRbaV1bal0uZXJyb3IgPSBmYWxzZVxyXG5cclxuICAgIGZvciBqIGluIFswLi4uOV1cclxuICAgICAgZm9yIGkgaW4gWzAuLi45XVxyXG4gICAgICAgIEB1cGRhdGVDZWxsKGksIGopXHJcblxyXG4gICAgQHNvbHZlZCA9IHRydWVcclxuICAgIGZvciBqIGluIFswLi4uOV1cclxuICAgICAgZm9yIGkgaW4gWzAuLi45XVxyXG4gICAgICAgIGlmIEBncmlkW2ldW2pdLmVycm9yXHJcbiAgICAgICAgICBAc29sdmVkID0gZmFsc2VcclxuICAgICAgICBpZiBAZ3JpZFtpXVtqXS52YWx1ZSA9PSAwXHJcbiAgICAgICAgICBAc29sdmVkID0gZmFsc2VcclxuXHJcbiAgICAjIGlmIEBzb2x2ZWRcclxuICAgICMgICBjb25zb2xlLmxvZyBcInNvbHZlZCAje0Bzb2x2ZWR9XCJcclxuXHJcbiAgICByZXR1cm4gQHNvbHZlZFxyXG5cclxuICBkb25lOiAtPlxyXG4gICAgZCA9IG5ldyBBcnJheSg5KS5maWxsKGZhbHNlKVxyXG4gICAgY291bnRzID0gbmV3IEFycmF5KDkpLmZpbGwoMClcclxuICAgIGZvciBqIGluIFswLi4uOV1cclxuICAgICAgZm9yIGkgaW4gWzAuLi45XVxyXG4gICAgICAgIGlmIEBncmlkW2ldW2pdLnZhbHVlICE9IDBcclxuICAgICAgICAgIGNvdW50c1tAZ3JpZFtpXVtqXS52YWx1ZS0xXSArPSAxXHJcblxyXG4gICAgZm9yIGkgaW4gWzAuLi45XVxyXG4gICAgICBpZiBjb3VudHNbaV0gPT0gOVxyXG4gICAgICAgIGRbaV0gPSB0cnVlXHJcbiAgICByZXR1cm4gZFxyXG5cclxuICBwZW5jaWxNYXJrczogKHgsIHkpIC0+XHJcbiAgICBjZWxsID0gQGdyaWRbeF1beV1cclxuICAgIG1hcmtzID0gW11cclxuICAgIGZvciBpIGluIFswLi4uOV1cclxuICAgICAgaWYgY2VsbC5wZW5jaWxbaV1cclxuICAgICAgICBtYXJrcy5wdXNoIGkgKyAxXHJcbiAgICByZXR1cm4gbWFya3NcclxuXHJcbiAgZG86IChhY3Rpb24sIHgsIHksIHZhbHVlcywgam91cm5hbCkgLT5cclxuICAgIGlmIHZhbHVlcy5sZW5ndGggPiAwXHJcbiAgICAgIGNlbGwgPSBAZ3JpZFt4XVt5XVxyXG4gICAgICBzd2l0Y2ggYWN0aW9uXHJcbiAgICAgICAgd2hlbiBcInRvZ2dsZVBlbmNpbFwiXHJcbiAgICAgICAgICBqb3VybmFsLnB1c2ggeyBhY3Rpb246IFwidG9nZ2xlUGVuY2lsXCIsIHg6IHgsIHk6IHksIHZhbHVlczogdmFsdWVzIH1cclxuICAgICAgICAgIGNlbGwucGVuY2lsW3YtMV0gPSAhY2VsbC5wZW5jaWxbdi0xXSBmb3IgdiBpbiB2YWx1ZXNcclxuICAgICAgICB3aGVuIFwic2V0VmFsdWVcIlxyXG4gICAgICAgICAgam91cm5hbC5wdXNoIHsgYWN0aW9uOiBcInNldFZhbHVlXCIsIHg6IHgsIHk6IHksIHZhbHVlczogW2NlbGwudmFsdWVdIH1cclxuICAgICAgICAgIGNlbGwudmFsdWUgPSB2YWx1ZXNbMF1cclxuICAgICAgQHVwZGF0ZUNlbGxzKClcclxuICAgICAgQHNhdmUoKVxyXG5cclxuICB1bmRvOiAtPlxyXG4gICAgaWYgKEB1bmRvSm91cm5hbC5sZW5ndGggPiAwKVxyXG4gICAgICBzdGVwID0gQHVuZG9Kb3VybmFsLnBvcCgpXHJcbiAgICAgIEBkbyBzdGVwLmFjdGlvbiwgc3RlcC54LCBzdGVwLnksIHN0ZXAudmFsdWVzLCBAcmVkb0pvdXJuYWxcclxuICAgICAgcmV0dXJuIFsgc3RlcC54LCBzdGVwLnkgXVxyXG5cclxuICByZWRvOiAtPlxyXG4gICAgaWYgKEByZWRvSm91cm5hbC5sZW5ndGggPiAwKVxyXG4gICAgICBzdGVwID0gQHJlZG9Kb3VybmFsLnBvcCgpXHJcbiAgICAgIEBkbyBzdGVwLmFjdGlvbiwgc3RlcC54LCBzdGVwLnksIHN0ZXAudmFsdWVzLCBAdW5kb0pvdXJuYWxcclxuICAgICAgcmV0dXJuIFsgc3RlcC54LCBzdGVwLnkgXVxyXG5cclxuICBjbGVhclBlbmNpbDogKHgsIHkpIC0+XHJcbiAgICBjZWxsID0gQGdyaWRbeF1beV1cclxuICAgIGlmIGNlbGwubG9ja2VkXHJcbiAgICAgIHJldHVyblxyXG4gICAgQGRvIFwidG9nZ2xlUGVuY2lsXCIsIHgsIHksIChpKzEgZm9yIGZsYWcsIGkgaW4gY2VsbC5wZW5jaWwgd2hlbiBmbGFnKSwgQHVuZG9Kb3VybmFsXHJcbiAgICBAcmVkb0pvdXJuYWwgPSBbXVxyXG5cclxuICB0b2dnbGVQZW5jaWw6ICh4LCB5LCB2KSAtPlxyXG4gICAgaWYgQGdyaWRbeF1beV0ubG9ja2VkXHJcbiAgICAgIHJldHVyblxyXG4gICAgQGRvIFwidG9nZ2xlUGVuY2lsXCIsIHgsIHksIFt2XSwgQHVuZG9Kb3VybmFsXHJcbiAgICBAcmVkb0pvdXJuYWwgPSBbXVxyXG5cclxuICBzZXRWYWx1ZTogKHgsIHksIHYpIC0+XHJcbiAgICBpZiBAZ3JpZFt4XVt5XS5sb2NrZWRcclxuICAgICAgcmV0dXJuXHJcbiAgICBAZG8gXCJzZXRWYWx1ZVwiLCB4LCB5LCBbdl0sIEB1bmRvSm91cm5hbFxyXG4gICAgQHJlZG9Kb3VybmFsID0gW11cclxuXHJcbiAgcmVzZXQ6IC0+XHJcbiAgICBjb25zb2xlLmxvZyBcInJlc2V0KClcIlxyXG4gICAgZm9yIGogaW4gWzAuLi45XVxyXG4gICAgICBmb3IgaSBpbiBbMC4uLjldXHJcbiAgICAgICAgY2VsbCA9IEBncmlkW2ldW2pdXHJcbiAgICAgICAgaWYgbm90IGNlbGwubG9ja2VkXHJcbiAgICAgICAgICBjZWxsLnZhbHVlID0gMFxyXG4gICAgICAgIGNlbGwuZXJyb3IgPSBmYWxzZVxyXG4gICAgICAgIGZvciBrIGluIFswLi4uOV1cclxuICAgICAgICAgIGNlbGwucGVuY2lsW2tdID0gZmFsc2VcclxuICAgIEB1bmRvSm91cm5hbCA9IFtdXHJcbiAgICBAcmVkb0pvdXJuYWwgPSBbXVxyXG4gICAgQGhpZ2hsaWdodFggPSAtMVxyXG4gICAgQGhpZ2hsaWdodFkgPSAtMVxyXG4gICAgQHVwZGF0ZUNlbGxzKClcclxuICAgIEBzYXZlKClcclxuXHJcbiAgZ2V0TGlua3M6ICh2YWx1ZSkgLT5cclxuICAgICMgTm90ZTogdGhlIHNlYXJjaCBzb3J0cyB0aGUgbGlua3MgaW4gcm93IG1ham9yIG9yZGVyLCBmaXJzdCBieSBzdGFydCBjZWxsLCB0aGVuIGJ5IGVuZCBjZWxsXHJcbiAgICBsaW5rcyA9IFtdXHJcblxyXG4gICAgIyBHZXQgcm93IGxpbmtzXHJcbiAgICBmb3IgeSBpbiBbMC4uLjldXHJcbiAgICAgIGxpbmtzLnB1c2ggQGdldFJvd0xpbmtzKHksIHZhbHVlKS4uLlxyXG5cclxuICAgICMgR2V0IGNvbHVtbiBsaW5rc1xyXG4gICAgZm9yIHggaW4gWzAuLi45XVxyXG4gICAgICBsaW5rcy5wdXNoIEBnZXRDb2x1bW5MaW5rcyh4LCB2YWx1ZSkuLi5cclxuXHJcbiAgICAjIEdldCBib3ggbGlua3NcclxuICAgIGZvciBib3hYIGluIFswLi4uM11cclxuICAgICAgZm9yIGJveFkgaW4gWzAuLi4zXVxyXG4gICAgICAgIGxpbmtzLnB1c2ggQGdldEJveExpbmtzKGJveFgsIGJveFksIHZhbHVlKS4uLlxyXG5cclxuICAgICMgVGhlIGJveCBsaW5rcyBtaWdodCBoYXZlIGR1cGxpY2F0ZWQgc29tZSByb3cgYW5kIGNvbHVtbiBsaW5rcywgc28gZHVwbGljYXRlcyBtdXN0IGJlIGZpbHRlcmVkIG91dC4gTm90ZSB0aGF0IG9ubHlcclxuICAgICMgbG9jYXRpb25zIGFyZSBjb25zaWRlcmVkIHdoZW4gZmluZGluZyBkdXBsaWNhdGVzLCBidXQgc3Ryb25nIGxpbmtzIHRha2UgcHJlY2VkZW5jZSB3aGVuIGR1cGxpY2F0ZXMgYXJlIHJlbW92ZWRcclxuICAgICMgKGJlY2F1c2UgdGhleSBhcmUgb3JkZXJlZCBiZWZvcmUgd2VhayBsaW5rcykuXHJcbiAgICBsaW5rcyA9IGxpbmtzLnNvcnQoYXNjZW5kaW5nTGlua1NvcnQpLmZpbHRlcih1bmlxdWVMaW5rRmlsdGVyKVxyXG5cclxuICAgIHN0cm9uZyA9IFtdXHJcbiAgICBmb3IgbGluayBpbiBsaW5rc1xyXG4gICAgICBzdHJvbmcucHVzaCBsaW5rLmNlbGxzIGlmIGxpbmsuc3Ryb25nP1xyXG4gICAgd2VhayA9IFtdXHJcbiAgICBmb3IgbGluayBpbiBsaW5rc1xyXG4gICAgICB3ZWFrLnB1c2ggbGluay5jZWxscyBpZiBub3QgbGluay5zdHJvbmc/XHJcblxyXG4gICAgcmV0dXJuIHsgc3Ryb25nLCB3ZWFrIH1cclxuXHJcbiAgZ2V0Um93TGlua3M6ICh5LCB2YWx1ZSktPlxyXG4gICAgY2VsbHMgPSBbXVxyXG4gICAgZm9yIHggaW4gWzAuLi45XVxyXG4gICAgICBjZWxsID0gQGdyaWRbeF1beV1cclxuICAgICAgaWYgY2VsbC52YWx1ZSA9PSAwIGFuZCBjZWxsLnBlbmNpbFt2YWx1ZS0xXVxyXG4gICAgICAgIGNlbGxzLnB1c2goeyB4LCB5IH0pXHJcblxyXG4gICAgaWYgY2VsbHMubGVuZ3RoID4gMVxyXG4gICAgICBsaW5rcyA9IGdlbmVyYXRlTGlua1Blcm11dGF0aW9ucyhjZWxscylcclxuICAgICAgaWYgbGlua3MubGVuZ3RoID09IDFcclxuICAgICAgICBsaW5rc1swXS5zdHJvbmcgPSB0cnVlXHJcbiAgICBlbHNlXHJcbiAgICAgIGxpbmtzID0gW11cclxuICAgIHJldHVybiBsaW5rc1xyXG5cclxuICBnZXRDb2x1bW5MaW5rczogKHgsIHZhbHVlKS0+XHJcbiAgICBjZWxscyA9IFtdXHJcbiAgICBmb3IgeSBpbiBbMC4uLjldXHJcbiAgICAgIGNlbGwgPSBAZ3JpZFt4XVt5XVxyXG4gICAgICBpZiBjZWxsLnZhbHVlID09IDAgYW5kIGNlbGwucGVuY2lsW3ZhbHVlLTFdXHJcbiAgICAgICAgY2VsbHMucHVzaCh7IHgsIHkgfSlcclxuXHJcbiAgICBpZiBjZWxscy5sZW5ndGggPiAxXHJcbiAgICAgIGxpbmtzID0gZ2VuZXJhdGVMaW5rUGVybXV0YXRpb25zKGNlbGxzKVxyXG4gICAgICBpZiBsaW5rcy5sZW5ndGggPT0gMVxyXG4gICAgICAgIGxpbmtzWzBdLnN0cm9uZyA9IHRydWVcclxuICAgIGVsc2VcclxuICAgICAgbGlua3MgPSBbXVxyXG4gICAgcmV0dXJuIGxpbmtzXHJcblxyXG4gIGdldEJveExpbmtzOiAoYm94WCwgYm94WSwgdmFsdWUpIC0+XHJcbiAgICBjZWxscyA9IFtdXHJcbiAgICBzeCA9IGJveFggKiAzXHJcbiAgICBzeSA9IGJveFkgKiAzXHJcbiAgICBmb3IgeSBpbiBbc3kuLi5zeSszXVxyXG4gICAgICBmb3IgeCBpbiBbc3guLi5zeCszXVxyXG4gICAgICAgIGNlbGwgPSBAZ3JpZFt4XVt5XVxyXG4gICAgICAgIGlmIGNlbGwudmFsdWUgPT0gMCBhbmQgY2VsbC5wZW5jaWxbdmFsdWUtMV1cclxuICAgICAgICAgIGNlbGxzLnB1c2goeyB4LCB5IH0pXHJcblxyXG4gICAgaWYgY2VsbHMubGVuZ3RoID4gMVxyXG4gICAgICBsaW5rcyA9IGdlbmVyYXRlTGlua1Blcm11dGF0aW9ucyhjZWxscylcclxuICAgICAgaWYgbGlua3MubGVuZ3RoID09IDFcclxuICAgICAgICBsaW5rc1swXS5zdHJvbmcgPSB0cnVlXHJcbiAgICBlbHNlXHJcbiAgICAgIGxpbmtzID0gW11cclxuICAgIHJldHVybiBsaW5rc1xyXG5cclxuICBuZXdHYW1lOiAoZGlmZmljdWx0eSkgLT5cclxuICAgIGNvbnNvbGUubG9nIFwibmV3R2FtZSgje2RpZmZpY3VsdHl9KVwiXHJcbiAgICBmb3IgaiBpbiBbMC4uLjldXHJcbiAgICAgIGZvciBpIGluIFswLi4uOV1cclxuICAgICAgICBjZWxsID0gQGdyaWRbaV1bal1cclxuICAgICAgICBjZWxsLnZhbHVlID0gMFxyXG4gICAgICAgIGNlbGwuZXJyb3IgPSBmYWxzZVxyXG4gICAgICAgIGNlbGwubG9ja2VkID0gZmFsc2VcclxuICAgICAgICBmb3IgayBpbiBbMC4uLjldXHJcbiAgICAgICAgICBjZWxsLnBlbmNpbFtrXSA9IGZhbHNlXHJcblxyXG4gICAgZ2VuZXJhdG9yID0gbmV3IFN1ZG9rdUdlbmVyYXRvcigpXHJcbiAgICBuZXdHcmlkID0gZ2VuZXJhdG9yLmdlbmVyYXRlKGRpZmZpY3VsdHkpXHJcbiAgICAjIGNvbnNvbGUubG9nIFwibmV3R3JpZFwiLCBuZXdHcmlkXHJcbiAgICBmb3IgaiBpbiBbMC4uLjldXHJcbiAgICAgIGZvciBpIGluIFswLi4uOV1cclxuICAgICAgICBpZiBuZXdHcmlkW2ldW2pdICE9IDBcclxuICAgICAgICAgIEBncmlkW2ldW2pdLnZhbHVlID0gbmV3R3JpZFtpXVtqXVxyXG4gICAgICAgICAgQGdyaWRbaV1bal0ubG9ja2VkID0gdHJ1ZVxyXG4gICAgQHVuZG9Kb3VybmFsID0gW11cclxuICAgIEByZWRvSm91cm5hbCA9IFtdXHJcbiAgICBAdXBkYXRlQ2VsbHMoKVxyXG4gICAgQHNhdmUoKVxyXG5cclxuICBsb2FkOiAtPlxyXG4gICAgaWYgbm90IGxvY2FsU3RvcmFnZVxyXG4gICAgICBhbGVydChcIk5vIGxvY2FsIHN0b3JhZ2UsIG5vdGhpbmcgd2lsbCB3b3JrXCIpXHJcbiAgICAgIHJldHVybiBmYWxzZVxyXG4gICAganNvblN0cmluZyA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwiZ2FtZVwiKVxyXG4gICAgaWYganNvblN0cmluZyA9PSBudWxsXHJcbiAgICAgIHJldHVybiBmYWxzZVxyXG5cclxuICAgICMgY29uc29sZS5sb2cganNvblN0cmluZ1xyXG4gICAgZ2FtZURhdGEgPSBKU09OLnBhcnNlKGpzb25TdHJpbmcpXHJcbiAgICAjIGNvbnNvbGUubG9nIFwiZm91bmQgZ2FtZURhdGFcIiwgZ2FtZURhdGFcclxuXHJcbiAgICBmb3IgaiBpbiBbMC4uLjldXHJcbiAgICAgIGZvciBpIGluIFswLi4uOV1cclxuICAgICAgICBzcmMgPSBnYW1lRGF0YS5ncmlkW2ldW2pdXHJcbiAgICAgICAgZHN0ID0gQGdyaWRbaV1bal1cclxuICAgICAgICBkc3QudmFsdWUgPSBzcmMudlxyXG4gICAgICAgIGRzdC5lcnJvciA9IGlmIHNyYy5lID4gMCB0aGVuIHRydWUgZWxzZSBmYWxzZVxyXG4gICAgICAgIGRzdC5sb2NrZWQgPSBpZiBzcmMubCA+IDAgdGhlbiB0cnVlIGVsc2UgZmFsc2VcclxuICAgICAgICBmb3IgayBpbiBbMC4uLjldXHJcbiAgICAgICAgICBkc3QucGVuY2lsW2tdID0gaWYgc3JjLnBba10gPiAwIHRoZW4gdHJ1ZSBlbHNlIGZhbHNlXHJcblxyXG4gICAgQHVwZGF0ZUNlbGxzKClcclxuICAgIGNvbnNvbGUubG9nIFwiTG9hZGVkIGdhbWUuXCJcclxuICAgIHJldHVybiB0cnVlXHJcblxyXG4gIHNhdmU6IC0+XHJcbiAgICBpZiBub3QgbG9jYWxTdG9yYWdlXHJcbiAgICAgIGFsZXJ0KFwiTm8gbG9jYWwgc3RvcmFnZSwgbm90aGluZyB3aWxsIHdvcmtcIilcclxuICAgICAgcmV0dXJuIGZhbHNlXHJcblxyXG4gICAgZ2FtZURhdGEgPVxyXG4gICAgICBncmlkOiBuZXcgQXJyYXkoOSkuZmlsbChudWxsKVxyXG4gICAgZm9yIGkgaW4gWzAuLi45XVxyXG4gICAgICBnYW1lRGF0YS5ncmlkW2ldID0gbmV3IEFycmF5KDkpLmZpbGwobnVsbClcclxuXHJcbiAgICBmb3IgaiBpbiBbMC4uLjldXHJcbiAgICAgIGZvciBpIGluIFswLi4uOV1cclxuICAgICAgICBjZWxsID0gQGdyaWRbaV1bal1cclxuICAgICAgICBnYW1lRGF0YS5ncmlkW2ldW2pdID1cclxuICAgICAgICAgIHY6IGNlbGwudmFsdWVcclxuICAgICAgICAgIGU6IGlmIGNlbGwuZXJyb3IgdGhlbiAxIGVsc2UgMFxyXG4gICAgICAgICAgbDogaWYgY2VsbC5sb2NrZWQgdGhlbiAxIGVsc2UgMFxyXG4gICAgICAgICAgcDogW11cclxuICAgICAgICBkc3QgPSBnYW1lRGF0YS5ncmlkW2ldW2pdLnBcclxuICAgICAgICBmb3IgayBpbiBbMC4uLjldXHJcbiAgICAgICAgICBkc3QucHVzaChpZiBjZWxsLnBlbmNpbFtrXSB0aGVuIDEgZWxzZSAwKVxyXG5cclxuICAgIGpzb25TdHJpbmcgPSBKU09OLnN0cmluZ2lmeShnYW1lRGF0YSlcclxuICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwiZ2FtZVwiLCBqc29uU3RyaW5nKVxyXG4gICAgY29uc29sZS5sb2cgXCJTYXZlZCBnYW1lICgje2pzb25TdHJpbmcubGVuZ3RofSBjaGFycylcIlxyXG4gICAgcmV0dXJuIHRydWVcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gU3Vkb2t1R2FtZVxyXG4iLCJzaHVmZmxlID0gKGEpIC0+XHJcbiAgICBpID0gYS5sZW5ndGhcclxuICAgIHdoaWxlIC0taSA+IDBcclxuICAgICAgICBqID0gfn4oTWF0aC5yYW5kb20oKSAqIChpICsgMSkpXHJcbiAgICAgICAgdCA9IGFbal1cclxuICAgICAgICBhW2pdID0gYVtpXVxyXG4gICAgICAgIGFbaV0gPSB0XHJcbiAgICByZXR1cm4gYVxyXG5cclxuY2xhc3MgQm9hcmRcclxuICBjb25zdHJ1Y3RvcjogKG90aGVyQm9hcmQgPSBudWxsKSAtPlxyXG4gICAgQGxvY2tlZENvdW50ID0gMDtcclxuICAgIEBncmlkID0gbmV3IEFycmF5KDkpLmZpbGwobnVsbClcclxuICAgIEBsb2NrZWQgPSBuZXcgQXJyYXkoOSkuZmlsbChudWxsKVxyXG4gICAgZm9yIGkgaW4gWzAuLi45XVxyXG4gICAgICBAZ3JpZFtpXSA9IG5ldyBBcnJheSg5KS5maWxsKDApXHJcbiAgICAgIEBsb2NrZWRbaV0gPSBuZXcgQXJyYXkoOSkuZmlsbChmYWxzZSlcclxuICAgIGlmIG90aGVyQm9hcmQgIT0gbnVsbFxyXG4gICAgICBmb3IgaiBpbiBbMC4uLjldXHJcbiAgICAgICAgZm9yIGkgaW4gWzAuLi45XVxyXG4gICAgICAgICAgQGdyaWRbaV1bal0gPSBvdGhlckJvYXJkLmdyaWRbaV1bal1cclxuICAgICAgICAgIEBsb2NrKGksIGosIG90aGVyQm9hcmQubG9ja2VkW2ldW2pdKVxyXG4gICAgcmV0dXJuXHJcblxyXG4gIG1hdGNoZXM6IChvdGhlckJvYXJkKSAtPlxyXG4gICAgZm9yIGogaW4gWzAuLi45XVxyXG4gICAgICBmb3IgaSBpbiBbMC4uLjldXHJcbiAgICAgICAgaWYgQGdyaWRbaV1bal0gIT0gb3RoZXJCb2FyZC5ncmlkW2ldW2pdXHJcbiAgICAgICAgICByZXR1cm4gZmFsc2VcclxuICAgIHJldHVybiB0cnVlXHJcblxyXG4gIGxvY2s6ICh4LCB5LCB2ID0gdHJ1ZSkgLT5cclxuICAgIGlmIHZcclxuICAgICAgQGxvY2tlZENvdW50ICs9IDEgaWYgbm90IEBsb2NrZWRbeF1beV1cclxuICAgIGVsc2VcclxuICAgICAgQGxvY2tlZENvdW50IC09IDEgaWYgQGxvY2tlZFt4XVt5XVxyXG4gICAgQGxvY2tlZFt4XVt5XSA9IHY7XHJcblxyXG5cclxuY2xhc3MgU3Vkb2t1R2VuZXJhdG9yXHJcbiAgQGRpZmZpY3VsdHk6XHJcbiAgICBlYXN5OiAxXHJcbiAgICBtZWRpdW06IDJcclxuICAgIGhhcmQ6IDNcclxuICAgIGV4dHJlbWU6IDRcclxuXHJcbiAgY29uc3RydWN0b3I6IC0+XHJcblxyXG4gIGJvYXJkVG9HcmlkOiAoYm9hcmQpIC0+XHJcbiAgICBuZXdCb2FyZCA9IG5ldyBBcnJheSg5KS5maWxsKG51bGwpXHJcbiAgICBmb3IgaSBpbiBbMC4uLjldXHJcbiAgICAgIG5ld0JvYXJkW2ldID0gbmV3IEFycmF5KDkpLmZpbGwoMClcclxuICAgIGZvciBqIGluIFswLi4uOV1cclxuICAgICAgZm9yIGkgaW4gWzAuLi45XVxyXG4gICAgICAgIGlmIGJvYXJkLmxvY2tlZFtpXVtqXVxyXG4gICAgICAgICAgbmV3Qm9hcmRbaV1bal0gPSBib2FyZC5ncmlkW2ldW2pdXHJcbiAgICByZXR1cm4gbmV3Qm9hcmRcclxuXHJcbiAgZ3JpZFRvQm9hcmQ6IChncmlkKSAtPlxyXG4gICAgYm9hcmQgPSBuZXcgQm9hcmRcclxuICAgIGZvciB5IGluIFswLi4uOV1cclxuICAgICAgZm9yIHggaW4gWzAuLi45XVxyXG4gICAgICAgIGlmIGdyaWRbeF1beV0gPiAwXHJcbiAgICAgICAgICBib2FyZC5ncmlkW3hdW3ldID0gZ3JpZFt4XVt5XVxyXG4gICAgICAgICAgYm9hcmQubG9jayh4LCB5KVxyXG4gICAgcmV0dXJuIGJvYXJkXHJcblxyXG4gIGNlbGxWYWxpZDogKGJvYXJkLCB4LCB5LCB2KSAtPlxyXG4gICAgaWYgYm9hcmQubG9ja2VkW3hdW3ldXHJcbiAgICAgIHJldHVybiBib2FyZC5ncmlkW3hdW3ldID09IHZcclxuXHJcbiAgICBmb3IgaSBpbiBbMC4uLjldXHJcbiAgICAgIGlmICh4ICE9IGkpIGFuZCAoYm9hcmQuZ3JpZFtpXVt5XSA9PSB2KVxyXG4gICAgICAgICAgcmV0dXJuIGZhbHNlXHJcbiAgICAgIGlmICh5ICE9IGkpIGFuZCAoYm9hcmQuZ3JpZFt4XVtpXSA9PSB2KVxyXG4gICAgICAgICAgcmV0dXJuIGZhbHNlXHJcblxyXG4gICAgc3ggPSBNYXRoLmZsb29yKHggLyAzKSAqIDNcclxuICAgIHN5ID0gTWF0aC5mbG9vcih5IC8gMykgKiAzXHJcbiAgICBmb3IgaiBpbiBbMC4uLjNdXHJcbiAgICAgIGZvciBpIGluIFswLi4uM11cclxuICAgICAgICBpZiAoeCAhPSAoc3ggKyBpKSkgJiYgKHkgIT0gKHN5ICsgaikpXHJcbiAgICAgICAgICBpZiBib2FyZC5ncmlkW3N4ICsgaV1bc3kgKyBqXSA9PSB2XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZVxyXG4gICAgcmV0dXJuIHRydWVcclxuXHJcbiAgcGVuY2lsTWFya3M6IChib2FyZCwgeCwgeSkgLT5cclxuICAgIGlmIGJvYXJkLmxvY2tlZFt4XVt5XVxyXG4gICAgICByZXR1cm4gWyBib2FyZC5ncmlkW3hdW3ldIF1cclxuICAgIG1hcmtzID0gW11cclxuICAgIGZvciB2IGluIFsxLi45XVxyXG4gICAgICBpZiBAY2VsbFZhbGlkKGJvYXJkLCB4LCB5LCB2KVxyXG4gICAgICAgIG1hcmtzLnB1c2ggdlxyXG4gICAgaWYgbWFya3MubGVuZ3RoID4gMVxyXG4gICAgICBzaHVmZmxlKG1hcmtzKVxyXG4gICAgcmV0dXJuIG1hcmtzXHJcblxyXG4gIG5leHRBdHRlbXB0OiAoYm9hcmQsIGF0dGVtcHRzKSAtPlxyXG4gICAgcmVtYWluaW5nSW5kZXhlcyA9IFswLi4uODFdXHJcblxyXG4gICAgIyBza2lwIGxvY2tlZCBjZWxsc1xyXG4gICAgZm9yIGluZGV4IGluIFswLi4uODFdXHJcbiAgICAgIHggPSBpbmRleCAlIDlcclxuICAgICAgeSA9IGluZGV4IC8vIDlcclxuICAgICAgaWYgYm9hcmQubG9ja2VkW3hdW3ldXHJcbiAgICAgICAgayA9IHJlbWFpbmluZ0luZGV4ZXMuaW5kZXhPZihpbmRleClcclxuICAgICAgICByZW1haW5pbmdJbmRleGVzLnNwbGljZShrLCAxKSBpZiBrID49IDBcclxuXHJcbiAgICAjIHNraXAgY2VsbHMgdGhhdCBhcmUgYWxyZWFkeSBiZWluZyB0cmllZFxyXG4gICAgZm9yIGEgaW4gYXR0ZW1wdHNcclxuICAgICAgayA9IHJlbWFpbmluZ0luZGV4ZXMuaW5kZXhPZihhLmluZGV4KVxyXG4gICAgICByZW1haW5pbmdJbmRleGVzLnNwbGljZShrLCAxKSBpZiBrID49IDBcclxuXHJcbiAgICByZXR1cm4gbnVsbCBpZiByZW1haW5pbmdJbmRleGVzLmxlbmd0aCA9PSAwICMgYWJvcnQgaWYgdGhlcmUgYXJlIG5vIGNlbGxzIChzaG91bGQgbmV2ZXIgaGFwcGVuKVxyXG5cclxuICAgIGZld2VzdEluZGV4ID0gLTFcclxuICAgIGZld2VzdE1hcmtzID0gWzAuLjldXHJcbiAgICBmb3IgaW5kZXggaW4gcmVtYWluaW5nSW5kZXhlc1xyXG4gICAgICB4ID0gaW5kZXggJSA5XHJcbiAgICAgIHkgPSBpbmRleCAvLyA5XHJcbiAgICAgIG1hcmtzID0gQHBlbmNpbE1hcmtzKGJvYXJkLCB4LCB5KVxyXG5cclxuICAgICAgIyBhYm9ydCBpZiB0aGVyZSBpcyBhIGNlbGwgd2l0aCBubyBwb3NzaWJpbGl0aWVzXHJcbiAgICAgIHJldHVybiBudWxsIGlmIG1hcmtzLmxlbmd0aCA9PSAwXHJcblxyXG4gICAgICAjIGRvbmUgaWYgdGhlcmUgaXMgYSBjZWxsIHdpdGggb25seSBvbmUgcG9zc2liaWxpdHkgKClcclxuICAgICAgcmV0dXJuIHsgaW5kZXg6IGluZGV4LCByZW1haW5pbmc6IG1hcmtzIH0gaWYgbWFya3MubGVuZ3RoID09IDFcclxuXHJcbiAgICAgICMgcmVtZW1iZXIgdGhpcyBjZWxsIGlmIGl0IGhhcyB0aGUgZmV3ZXN0IG1hcmtzIHNvIGZhclxyXG4gICAgICBpZiBtYXJrcy5sZW5ndGggPCBmZXdlc3RNYXJrcy5sZW5ndGhcclxuICAgICAgICBmZXdlc3RJbmRleCA9IGluZGV4XHJcbiAgICAgICAgZmV3ZXN0TWFya3MgPSBtYXJrc1xyXG4gICAgcmV0dXJuIHsgaW5kZXg6IGZld2VzdEluZGV4LCByZW1haW5pbmc6IGZld2VzdE1hcmtzIH1cclxuXHJcbiAgc29sdmU6IChib2FyZCkgLT5cclxuICAgIHNvbHZlZCA9IG5ldyBCb2FyZChib2FyZClcclxuICAgIGF0dGVtcHRzID0gW11cclxuICAgIHJldHVybiBAc29sdmVJbnRlcm5hbChzb2x2ZWQsIGF0dGVtcHRzKVxyXG5cclxuICBoYXNVbmlxdWVTb2x1dGlvbjogKGJvYXJkKSAtPlxyXG4gICAgc29sdmVkID0gbmV3IEJvYXJkKGJvYXJkKVxyXG4gICAgYXR0ZW1wdHMgPSBbXVxyXG5cclxuICAgICMgaWYgdGhlcmUgaXMgbm8gc29sdXRpb24sIHJldHVybiBmYWxzZVxyXG4gICAgcmV0dXJuIGZhbHNlIGlmIEBzb2x2ZUludGVybmFsKHNvbHZlZCwgYXR0ZW1wdHMpID09IG51bGxcclxuXHJcbiAgICB1bmxvY2tlZENvdW50ID0gODEgLSBzb2x2ZWQubG9ja2VkQ291bnRcclxuXHJcbiAgICAjIGlmIHRoZXJlIGFyZSBubyB1bmxvY2tlZCBjZWxscywgdGhlbiB0aGlzIHNvbHV0aW9uIG11c3QgYmUgdW5pcXVlXHJcbiAgICByZXR1cm4gdHJ1ZSBpZiB1bmxvY2tlZENvdW50ID09IDBcclxuXHJcbiAgICAjIGNoZWNrIGZvciBhIHNlY29uZCBzb2x1dGlvblxyXG4gICAgcmV0dXJuIEBzb2x2ZUludGVybmFsKHNvbHZlZCwgYXR0ZW1wdHMsIHVubG9ja2VkQ291bnQtMSkgPT0gbnVsbFxyXG5cclxuICBzb2x2ZUludGVybmFsOiAoc29sdmVkLCBhdHRlbXB0cywgd2Fsa0luZGV4ID0gMCkgLT5cclxuICAgIHVubG9ja2VkQ291bnQgPSA4MSAtIHNvbHZlZC5sb2NrZWRDb3VudFxyXG4gICAgd2hpbGUgd2Fsa0luZGV4IDwgdW5sb2NrZWRDb3VudFxyXG4gICAgICBpZiB3YWxrSW5kZXggPj0gYXR0ZW1wdHMubGVuZ3RoXHJcbiAgICAgICAgYXR0ZW1wdCA9IEBuZXh0QXR0ZW1wdChzb2x2ZWQsIGF0dGVtcHRzKVxyXG4gICAgICAgIGF0dGVtcHRzLnB1c2goYXR0ZW1wdCkgaWYgYXR0ZW1wdCAhPSBudWxsXHJcbiAgICAgIGVsc2VcclxuICAgICAgICBhdHRlbXB0ID0gYXR0ZW1wdHNbd2Fsa0luZGV4XVxyXG5cclxuICAgICAgaWYgYXR0ZW1wdCAhPSBudWxsXHJcbiAgICAgICAgeCA9IGF0dGVtcHQuaW5kZXggJSA5XHJcbiAgICAgICAgeSA9IGF0dGVtcHQuaW5kZXggLy8gOVxyXG4gICAgICAgIGlmIGF0dGVtcHQucmVtYWluaW5nLmxlbmd0aCA+IDBcclxuICAgICAgICAgIHNvbHZlZC5ncmlkW3hdW3ldID0gYXR0ZW1wdC5yZW1haW5pbmcucG9wKClcclxuICAgICAgICAgIHdhbGtJbmRleCArPSAxXHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgICAgYXR0ZW1wdHMucG9wKClcclxuICAgICAgICAgIHNvbHZlZC5ncmlkW3hdW3ldID0gMFxyXG4gICAgICAgICAgd2Fsa0luZGV4IC09IDFcclxuICAgICAgZWxzZVxyXG4gICAgICAgIHdhbGtJbmRleCAtPSAxXHJcblxyXG4gICAgICBpZiB3YWxrSW5kZXggPCAwXHJcbiAgICAgICAgcmV0dXJuIG51bGxcclxuXHJcbiAgICByZXR1cm4gc29sdmVkXHJcblxyXG4gIGdlbmVyYXRlSW50ZXJuYWw6IChhbW91bnRUb1JlbW92ZSkgLT5cclxuICAgIGJvYXJkID0gQHNvbHZlKG5ldyBCb2FyZCgpKVxyXG4gICAgIyBoYWNrXHJcbiAgICBmb3IgaiBpbiBbMC4uLjldXHJcbiAgICAgIGZvciBpIGluIFswLi4uOV1cclxuICAgICAgICBib2FyZC5sb2NrKGksIGopXHJcblxyXG4gICAgaW5kZXhlc1RvUmVtb3ZlID0gc2h1ZmZsZShbMC4uLjgxXSlcclxuICAgIHJlbW92ZWQgPSAwXHJcbiAgICB3aGlsZSByZW1vdmVkIDwgYW1vdW50VG9SZW1vdmVcclxuICAgICAgaWYgaW5kZXhlc1RvUmVtb3ZlLmxlbmd0aCA9PSAwXHJcbiAgICAgICAgYnJlYWtcclxuXHJcbiAgICAgIHJlbW92ZUluZGV4ID0gaW5kZXhlc1RvUmVtb3ZlLnBvcCgpXHJcbiAgICAgIHJ4ID0gcmVtb3ZlSW5kZXggJSA5XHJcbiAgICAgIHJ5ID0gTWF0aC5mbG9vcihyZW1vdmVJbmRleCAvIDkpXHJcblxyXG4gICAgICBuZXh0Qm9hcmQgPSBuZXcgQm9hcmQoYm9hcmQpXHJcbiAgICAgIG5leHRCb2FyZC5ncmlkW3J4XVtyeV0gPSAwXHJcbiAgICAgIG5leHRCb2FyZC5sb2NrKHJ4LCByeSwgZmFsc2UpXHJcblxyXG4gICAgICBpZiBAaGFzVW5pcXVlU29sdXRpb24obmV4dEJvYXJkKVxyXG4gICAgICAgIGJvYXJkID0gbmV4dEJvYXJkXHJcbiAgICAgICAgcmVtb3ZlZCArPSAxXHJcbiAgICAgICAgIyBjb25zb2xlLmxvZyBcInN1Y2Nlc3NmdWxseSByZW1vdmVkICN7cnh9LCN7cnl9XCJcclxuICAgICAgZWxzZVxyXG4gICAgICAgICMgY29uc29sZS5sb2cgXCJmYWlsZWQgdG8gcmVtb3ZlICN7cnh9LCN7cnl9LCBjcmVhdGVzIG5vbi11bmlxdWUgc29sdXRpb25cIlxyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgIGJvYXJkOiBib2FyZFxyXG4gICAgICByZW1vdmVkOiByZW1vdmVkXHJcbiAgICB9XHJcblxyXG4gIGdlbmVyYXRlOiAoZGlmZmljdWx0eSkgLT5cclxuICAgIGFtb3VudFRvUmVtb3ZlID0gc3dpdGNoIGRpZmZpY3VsdHlcclxuICAgICAgd2hlbiBTdWRva3VHZW5lcmF0b3IuZGlmZmljdWx0eS5leHRyZW1lIHRoZW4gNjBcclxuICAgICAgd2hlbiBTdWRva3VHZW5lcmF0b3IuZGlmZmljdWx0eS5oYXJkICAgIHRoZW4gNTJcclxuICAgICAgd2hlbiBTdWRva3VHZW5lcmF0b3IuZGlmZmljdWx0eS5tZWRpdW0gIHRoZW4gNDZcclxuICAgICAgZWxzZSA0MCAjIGVhc3kgLyB1bmtub3duXHJcblxyXG4gICAgYmVzdCA9IG51bGxcclxuICAgIGZvciBhdHRlbXB0IGluIFswLi4uMl1cclxuICAgICAgZ2VuZXJhdGVkID0gQGdlbmVyYXRlSW50ZXJuYWwoYW1vdW50VG9SZW1vdmUpXHJcbiAgICAgIGlmIGdlbmVyYXRlZC5yZW1vdmVkID09IGFtb3VudFRvUmVtb3ZlXHJcbiAgICAgICAgY29uc29sZS5sb2cgXCJSZW1vdmVkIGV4YWN0IGFtb3VudCAje2Ftb3VudFRvUmVtb3ZlfSwgc3RvcHBpbmdcIlxyXG4gICAgICAgIGJlc3QgPSBnZW5lcmF0ZWRcclxuICAgICAgICBicmVha1xyXG5cclxuICAgICAgaWYgYmVzdCA9PSBudWxsXHJcbiAgICAgICAgYmVzdCA9IGdlbmVyYXRlZFxyXG4gICAgICBlbHNlIGlmIGJlc3QucmVtb3ZlZCA8IGdlbmVyYXRlZC5yZW1vdmVkXHJcbiAgICAgICAgYmVzdCA9IGdlbmVyYXRlZFxyXG4gICAgICBjb25zb2xlLmxvZyBcImN1cnJlbnQgYmVzdCAje2Jlc3QucmVtb3ZlZH0gLyAje2Ftb3VudFRvUmVtb3ZlfVwiXHJcblxyXG4gICAgY29uc29sZS5sb2cgXCJnaXZpbmcgdXNlciBib2FyZDogI3tiZXN0LnJlbW92ZWR9IC8gI3thbW91bnRUb1JlbW92ZX1cIlxyXG4gICAgcmV0dXJuIEBib2FyZFRvR3JpZChiZXN0LmJvYXJkKVxyXG5cclxuICB2YWxpZGF0ZUdyaWQ6IChncmlkKSAtPlxyXG4gICAgcmV0dXJuIEBoYXNVbmlxdWVTb2x1dGlvbihAZ3JpZFRvQm9hcmQoZ3JpZCkpXHJcblxyXG4gIHNvbHZlU3RyaW5nOiAoaW1wb3J0U3RyaW5nKSAtPlxyXG4gICAgaWYgaW1wb3J0U3RyaW5nLmluZGV4T2YoXCJTRFwiKSAhPSAwXHJcbiAgICAgIHJldHVybiBmYWxzZVxyXG4gICAgaW1wb3J0U3RyaW5nID0gaW1wb3J0U3RyaW5nLnN1YnN0cigyKVxyXG4gICAgaW1wb3J0U3RyaW5nID0gaW1wb3J0U3RyaW5nLnJlcGxhY2UoL1teMC05XS9nLCBcIlwiKVxyXG4gICAgaWYgaW1wb3J0U3RyaW5nLmxlbmd0aCAhPSA4MVxyXG4gICAgICByZXR1cm4gZmFsc2VcclxuXHJcbiAgICBib2FyZCA9IG5ldyBCb2FyZCgpXHJcblxyXG4gICAgaW5kZXggPSAwXHJcbiAgICB6ZXJvQ2hhckNvZGUgPSBcIjBcIi5jaGFyQ29kZUF0KDApXHJcbiAgICBmb3IgaiBpbiBbMC4uLjldXHJcbiAgICAgIGZvciBpIGluIFswLi4uOV1cclxuICAgICAgICB2ID0gaW1wb3J0U3RyaW5nLmNoYXJDb2RlQXQoaW5kZXgpIC0gemVyb0NoYXJDb2RlXHJcbiAgICAgICAgaW5kZXggKz0gMVxyXG4gICAgICAgIGlmIHYgPiAwXHJcbiAgICAgICAgICBib2FyZC5ncmlkW2pdW2ldID0gdlxyXG4gICAgICAgICAgYm9hcmQubG9jayhqLCBpKVxyXG5cclxuICAgIHNvbHZlZCA9IEBzb2x2ZShib2FyZClcclxuICAgIGlmIHNvbHZlZCA9PSBudWxsXHJcbiAgICAgIGNvbnNvbGUubG9nIFwiRVJST1I6IENhbid0IGJlIHNvbHZlZC5cIlxyXG4gICAgICByZXR1cm4gZmFsc2VcclxuXHJcbiAgICBpZiBub3QgQGhhc1VuaXF1ZVNvbHV0aW9uKGJvYXJkKVxyXG4gICAgICBjb25zb2xlLmxvZyBcIkVSUk9SOiBCb2FyZCBzb2x2ZSBub3QgdW5pcXVlLlwiXHJcbiAgICAgIHJldHVybiBmYWxzZVxyXG5cclxuICAgIGFuc3dlclN0cmluZyA9IFwiXCJcclxuICAgIGZvciBqIGluIFswLi4uOV1cclxuICAgICAgZm9yIGkgaW4gWzAuLi45XVxyXG4gICAgICAgIGFuc3dlclN0cmluZyArPSBcIiN7c29sdmVkLmdyaWRbal1baV19IFwiXHJcbiAgICAgIGFuc3dlclN0cmluZyArPSBcIlxcblwiXHJcblxyXG4gICAgcmV0dXJuIGFuc3dlclN0cmluZ1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBTdWRva3VHZW5lcmF0b3JcclxuIiwiU3Vkb2t1R2VuZXJhdG9yID0gcmVxdWlyZSAnLi9TdWRva3VHZW5lcmF0b3InXHJcblN1ZG9rdUdhbWUgPSByZXF1aXJlICcuL1N1ZG9rdUdhbWUnXHJcblxyXG5QRU5fUE9TX1ggPSAxXHJcblBFTl9QT1NfWSA9IDEwXHJcblBFTl9DTEVBUl9QT1NfWCA9IDJcclxuUEVOX0NMRUFSX1BPU19ZID0gMTNcclxuXHJcblBFTkNJTF9QT1NfWCA9IDVcclxuUEVOQ0lMX1BPU19ZID0gMTBcclxuUEVOQ0lMX0NMRUFSX1BPU19YID0gNlxyXG5QRU5DSUxfQ0xFQVJfUE9TX1kgPSAxM1xyXG5cclxuTUVOVV9QT1NfWCA9IDRcclxuTUVOVV9QT1NfWSA9IDEzXHJcblxyXG5NT0RFX1NUQVJUX1BPU19YID0gMlxyXG5NT0RFX0NFTlRFUl9QT1NfWCA9IDRcclxuTU9ERV9FTkRfUE9TX1ggPSA2XHJcbk1PREVfUE9TX1kgPSA5XHJcblxyXG5VTkRPX1BPU19YID0gMFxyXG5VTkRPX1BPU19ZID0gMTNcclxuUkVET19QT1NfWCA9IDhcclxuUkVET19QT1NfWSA9IDEzXHJcblxyXG5Db2xvciA9XHJcbiAgdmFsdWU6IFwiYmxhY2tcIlxyXG4gIHBlbmNpbDogXCIjMDAwMGZmXCJcclxuICBlcnJvcjogXCIjZmYwMDAwXCJcclxuICBkb25lOiBcIiNjY2NjY2NcIlxyXG4gIG1lbnU6IFwiIzAwODgzM1wiXHJcbiAgbGlua3M6IFwiI2NjMzMzM1wiXHJcbiAgYmFja2dyb3VuZFNlbGVjdGVkOiBcIiNlZWVlYWFcIlxyXG4gIGJhY2tncm91bmRMb2NrZWQ6IFwiI2VlZWVlZVwiXHJcbiAgYmFja2dyb3VuZExvY2tlZENvbmZsaWN0ZWQ6IFwiI2ZmZmZlZVwiXHJcbiAgYmFja2dyb3VuZExvY2tlZFNlbGVjdGVkOiBcIiNlZWVlZGRcIlxyXG4gIGJhY2tncm91bmRDb25mbGljdGVkOiBcIiNmZmZmZGRcIlxyXG4gIGJhY2tncm91bmRFcnJvcjogXCIjZmZkZGRkXCJcclxuICBtb2RlU2VsZWN0OiBcIiM3Nzc3NDRcIlxyXG4gIG1vZGVQZW46IFwiIzAwMDAwMFwiXHJcbiAgbW9kZVBlbmNpbDogXCIjMDAwMGZmXCJcclxuICBtb2RlTGlua3M6IFwiI2NjMzMzM1wiXHJcblxyXG5BY3Rpb25UeXBlID1cclxuICBTRUxFQ1Q6IDBcclxuICBQRU5DSUw6IDFcclxuICBQRU46IDJcclxuICBNRU5VOiAzXHJcbiAgVU5ETzogNFxyXG4gIFJFRE86IDVcclxuICBNT0RFOiA2XHJcblxyXG5Nb2RlVHlwZSA9XHJcbiAgVklTSUJJTElUWTogMFxyXG4gIFBFTkNJTDogMVxyXG4gIFBFTjogMlxyXG4gIExJTktTOiAzXHJcblxyXG4jIFNwZWNpYWwgcGVuL3BlbmNpbCB2YWx1ZXNcclxuTk9ORSA9IDBcclxuQ0xFQVIgPSAxMFxyXG5cclxuIyBJZiBhIHNlY29uZCB0YXAgb24gYSBwZW4vcGVuY2lsIGhhcHBlbnMgaW4gdGhpcyBpbnRlcnZhbCwgdG9nZ2xlIHZhbHVlIGhpZ2hsaWdodGluZyBpbnN0ZWFkIG9mIHN3aXRjaGluZyBtb2Rlc1xyXG5ET1VCTEVfVEFQX0lOVEVSVkFMX01TID0gNTAwXHJcblxyXG5ub3cgPSAtPlxyXG4gIHJldHVybiBNYXRoLmZsb29yKERhdGUubm93KCkpXHJcblxyXG5LRVlfTUFQUElORyA9XHJcbiAgJzAnOiB7IHY6IENMRUFSLCBzaGlmdDogZmFsc2UgfVxyXG4gICcxJzogeyB2OiAxLCBzaGlmdDogZmFsc2UgfVxyXG4gICcyJzogeyB2OiAyLCBzaGlmdDogZmFsc2UgfVxyXG4gICczJzogeyB2OiAzLCBzaGlmdDogZmFsc2UgfVxyXG4gICc0JzogeyB2OiA0LCBzaGlmdDogZmFsc2UgfVxyXG4gICc1JzogeyB2OiA1LCBzaGlmdDogZmFsc2UgfVxyXG4gICc2JzogeyB2OiA2LCBzaGlmdDogZmFsc2UgfVxyXG4gICc3JzogeyB2OiA3LCBzaGlmdDogZmFsc2UgfVxyXG4gICc4JzogeyB2OiA4LCBzaGlmdDogZmFsc2UgfVxyXG4gICc5JzogeyB2OiA5LCBzaGlmdDogZmFsc2UgfVxyXG4gICcpJzogeyB2OiBDTEVBUiwgc2hpZnQ6IHRydWUgfVxyXG4gICchJzogeyB2OiAxLCBzaGlmdDogdHJ1ZSB9XHJcbiAgJ0AnOiB7IHY6IDIsIHNoaWZ0OiB0cnVlIH1cclxuICAnIyc6IHsgdjogMywgc2hpZnQ6IHRydWUgfVxyXG4gICckJzogeyB2OiA0LCBzaGlmdDogdHJ1ZSB9XHJcbiAgJyUnOiB7IHY6IDUsIHNoaWZ0OiB0cnVlIH1cclxuICAnXic6IHsgdjogNiwgc2hpZnQ6IHRydWUgfVxyXG4gICcmJzogeyB2OiA3LCBzaGlmdDogdHJ1ZSB9XHJcbiAgJyonOiB7IHY6IDgsIHNoaWZ0OiB0cnVlIH1cclxuICAnKCc6IHsgdjogOSwgc2hpZnQ6IHRydWUgfVxyXG5cclxuIyBDZWxlYnJhdGlvbiBjb2xvciBwYWxldHRlXHJcbkNFTEVCUkFUSU9OX0NPTE9SUyA9IFtcclxuICBcIiM3ZjdmZmZcIixcclxuICBcIiM3ZmZmN2ZcIixcclxuICBcIiM3ZmZmZmZcIixcclxuICBcIiM3ZjdmM2ZcIixcclxuICBcIiNmZjdmN2ZcIixcclxuICBcIiNmZjdmZmZcIixcclxuICBcIiNmZmZmN2ZcIixcclxuICBcIiNmZmZmZmZcIlxyXG5dXHJcblxyXG5DRUxFQlJBVElPTl9TVEVQUyA9IDMwICAgICAgICAgICMgTnVtYmVyIG9mIGNvbG9yIGNoYW5nZXMgaW4gYSBjZWxlYnJhdGlvblxyXG5DRUxFQlJBVElPTl9JTlRFUlZBTF9NUyA9IDMzICAgICMgVGltZSBiZXR3ZWVuIGNlbGVicmF0aW9uIGNvbG9yIGNoYW5nZXNcclxuXHJcbkZMQVNIX0lOVEVSVkFMX01TID0gMzMgICAgICAgICAgIyBMZW5ndGggb2YgZmxhc2hcclxuXHJcbmNsYXNzIFN1ZG9rdVZpZXdcclxuICAjIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAjIEluaXRcclxuXHJcbiAgY29uc3RydWN0b3I6IChAYXBwLCBAY2FudmFzKSAtPlxyXG4gICAgY29uc29sZS5sb2cgXCJjYW52YXMgc2l6ZSAje0BjYW52YXMud2lkdGh9eCN7QGNhbnZhcy5oZWlnaHR9XCJcclxuXHJcbiAgICB3aWR0aEJhc2VkQ2VsbFNpemUgPSBAY2FudmFzLndpZHRoIC8gOVxyXG4gICAgaGVpZ2h0QmFzZWRDZWxsU2l6ZSA9IEBjYW52YXMuaGVpZ2h0IC8gMTRcclxuICAgIGNvbnNvbGUubG9nIFwid2lkdGhCYXNlZENlbGxTaXplICN7d2lkdGhCYXNlZENlbGxTaXplfSBoZWlnaHRCYXNlZENlbGxTaXplICN7aGVpZ2h0QmFzZWRDZWxsU2l6ZX1cIlxyXG4gICAgQGNlbGxTaXplID0gTWF0aC5taW4od2lkdGhCYXNlZENlbGxTaXplLCBoZWlnaHRCYXNlZENlbGxTaXplKVxyXG5cclxuICAgICMgY2FsYyByZW5kZXIgY29uc3RhbnRzXHJcbiAgICBAbGluZVdpZHRoVGhpbiA9IDFcclxuICAgIEBsaW5lV2lkdGhUaGljayA9IE1hdGgubWF4KEBjZWxsU2l6ZSAvIDIwLCAzKVxyXG4gICAgQGxpbmtEb3RSYWRpdXMgPSBAbGluZVdpZHRoVGhpY2tcclxuICAgIEBjZW50ZXJYID0gNC41ICogQGNlbGxTaXplXHJcbiAgICBAY2VudGVyWSA9IDQuNSAqIEBjZWxsU2l6ZVxyXG5cclxuICAgIGZvbnRQaXhlbHNTID0gTWF0aC5mbG9vcihAY2VsbFNpemUgKiAwLjMpXHJcbiAgICBmb250UGl4ZWxzTSA9IE1hdGguZmxvb3IoQGNlbGxTaXplICogMC41KVxyXG4gICAgZm9udFBpeGVsc0wgPSBNYXRoLmZsb29yKEBjZWxsU2l6ZSAqIDAuOClcclxuXHJcbiAgICAjIGluaXQgZm9udHNcclxuICAgIEBmb250cyA9XHJcbiAgICAgIHBlbmNpbDogIEBhcHAucmVnaXN0ZXJGb250KFwicGVuY2lsXCIsICBcIiN7Zm9udFBpeGVsc1N9cHggc2F4TW9ubywgbW9ub3NwYWNlXCIpXHJcbiAgICAgIG1lbnU6ICAgIEBhcHAucmVnaXN0ZXJGb250KFwibWVudVwiLCAgICBcIiN7Zm9udFBpeGVsc019cHggc2F4TW9ubywgbW9ub3NwYWNlXCIpXHJcbiAgICAgIHBlbjogICAgIEBhcHAucmVnaXN0ZXJGb250KFwicGVuXCIsICAgICBcIiN7Zm9udFBpeGVsc0x9cHggc2F4TW9ubywgbW9ub3NwYWNlXCIpXHJcblxyXG4gICAgQGluaXRBY3Rpb25zKClcclxuXHJcbiAgICAjIGluaXQgc3RhdGVcclxuICAgIEBnYW1lID0gbmV3IFN1ZG9rdUdhbWUoKVxyXG4gICAgQHJlc2V0U3RhdGUoKVxyXG5cclxuICAgIEBkcmF3KClcclxuXHJcbiAgaW5pdEFjdGlvbnM6IC0+XHJcbiAgICBAYWN0aW9ucyA9IG5ldyBBcnJheSg5ICogMTUpLmZpbGwobnVsbClcclxuXHJcbiAgICBmb3IgaiBpbiBbMC4uLjldXHJcbiAgICAgIGZvciBpIGluIFswLi4uOV1cclxuICAgICAgICBpbmRleCA9IChqICogOSkgKyBpXHJcbiAgICAgICAgQGFjdGlvbnNbaW5kZXhdID0geyB0eXBlOiBBY3Rpb25UeXBlLlNFTEVDVCwgeDogaSwgeTogaiB9XHJcblxyXG4gICAgZm9yIGogaW4gWzAuLi4zXVxyXG4gICAgICBmb3IgaSBpbiBbMC4uLjNdXHJcbiAgICAgICAgaW5kZXggPSAoKFBFTl9QT1NfWSArIGopICogOSkgKyAoUEVOX1BPU19YICsgaSlcclxuICAgICAgICBAYWN0aW9uc1tpbmRleF0gPSB7IHR5cGU6IEFjdGlvblR5cGUuUEVOLCB2YWx1ZTogMSArIChqICogMykgKyBpIH1cclxuXHJcbiAgICBmb3IgaiBpbiBbMC4uLjNdXHJcbiAgICAgIGZvciBpIGluIFswLi4uM11cclxuICAgICAgICBpbmRleCA9ICgoUEVOQ0lMX1BPU19ZICsgaikgKiA5KSArIChQRU5DSUxfUE9TX1ggKyBpKVxyXG4gICAgICAgIEBhY3Rpb25zW2luZGV4XSA9IHsgdHlwZTogQWN0aW9uVHlwZS5QRU5DSUwsIHZhbHVlOiAxICsgKGogKiAzKSArIGkgfVxyXG5cclxuICAgICMgUGVuIGNsZWFyIGJ1dHRvblxyXG4gICAgaW5kZXggPSAoUEVOX0NMRUFSX1BPU19ZICogOSkgKyBQRU5fQ0xFQVJfUE9TX1hcclxuICAgIEBhY3Rpb25zW2luZGV4XSA9IHsgdHlwZTogQWN0aW9uVHlwZS5QRU4sIHZhbHVlOiBDTEVBUiB9XHJcblxyXG4gICAgIyBQZW5jaWwgY2xlYXIgYnV0dG9uXHJcbiAgICBpbmRleCA9IChQRU5DSUxfQ0xFQVJfUE9TX1kgKiA5KSArIFBFTkNJTF9DTEVBUl9QT1NfWFxyXG4gICAgQGFjdGlvbnNbaW5kZXhdID0geyB0eXBlOiBBY3Rpb25UeXBlLlBFTkNJTCwgdmFsdWU6IENMRUFSIH1cclxuXHJcbiAgICAjIE1lbnUgYnV0dG9uXHJcbiAgICBpbmRleCA9IChNRU5VX1BPU19ZICogOSkgKyBNRU5VX1BPU19YXHJcbiAgICBAYWN0aW9uc1tpbmRleF0gPSB7IHR5cGU6IEFjdGlvblR5cGUuTUVOVSB9XHJcblxyXG4gICAgIyBVbmRvIGJ1dHRvblxyXG4gICAgaW5kZXggPSAoVU5ET19QT1NfWSAqIDkpICsgVU5ET19QT1NfWFxyXG4gICAgQGFjdGlvbnNbaW5kZXhdID0geyB0eXBlOiBBY3Rpb25UeXBlLlVORE8gfVxyXG5cclxuICAgICMgUmVkbyBidXR0b25cclxuICAgIGluZGV4ID0gKFJFRE9fUE9TX1kgKiA5KSArIFJFRE9fUE9TX1hcclxuICAgIEBhY3Rpb25zW2luZGV4XSA9IHsgdHlwZTogQWN0aW9uVHlwZS5SRURPIH1cclxuXHJcbiAgICAjIE1vZGUgc3dpdGNoXHJcbiAgICBmb3IgaSBpbiBbKE1PREVfUE9TX1kqOSkrTU9ERV9TVEFSVF9QT1NfWC4uKE1PREVfUE9TX1kqOSkrTU9ERV9FTkRfUE9TX1hdXHJcbiAgICAgIEBhY3Rpb25zW2ldID0geyB0eXBlOiBBY3Rpb25UeXBlLk1PREUgfVxyXG5cclxuICAgIHJldHVyblxyXG5cclxuICByZXNldFN0YXRlOiAtPlxyXG4gICAgQG1vZGUgPSBNb2RlVHlwZS5WSVNJQklMSVRZXHJcbiAgICBAcGVuVmFsdWUgPSBOT05FXHJcbiAgICBAdmlzaWJpbGl0eVggPSAtMVxyXG4gICAgQHZpc2liaWxpdHlZID0gLTFcclxuICAgIEBwcmVmZXJQZW5jaWwgPSBmYWxzZVxyXG4gICAgQHN0cm9uZ0xpbmtzID0gW11cclxuICAgIEB3ZWFrTGlua3MgPSBbXVxyXG4gICAgQGhpZ2hsaWdodGluZ1ZhbHVlcyA9IGZhbHNlXHJcbiAgICBAbGFzdFZhbHVlVGFwTVMgPSBub3coKSAtIERPVUJMRV9UQVBfSU5URVJWQUxfTVMgICMgRW5zdXJlIHRoZSBuZXh0IHRhcCBpcyBub3QgYSBkb3VibGUgdGFwXHJcbiAgICBAY2VsZWJyYXRpb25Db3VudCA9IC0xICAgICAgICAgICAgICAgICAgICAgICAgICAgICMgLTEgPSBuZXZlciBydW4sIDAgPSBkb25lLCA+IDAgPSBydW5uaW5nXHJcblxyXG4gICMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICMgUmVuZGVyaW5nXHJcblxyXG4gIGNlbGVicmF0ZTogLT5cclxuICAgIEBkcmF3KClcclxuICAgIGlmIEBjZWxlYnJhdGlvbkNvdW50ID4gMFxyXG4gICAgICAtLUBjZWxlYnJhdGlvbkNvdW50XHJcbiAgICAgIHNldFRpbWVvdXQgPT5cclxuICAgICAgICBAY2VsZWJyYXRlKClcclxuICAgICAgLCBDRUxFQlJBVElPTl9JTlRFUlZBTF9NU1xyXG5cclxuICBjaG9vc2VDZWxlYnJhdGlvbkNvbG9yOiAodmFsdWUpIC0+XHJcbiAgICBjb2xvciA9IG51bGxcclxuICAgIGlmIHZhbHVlID4gMCBhbmQgQGNlbGVicmF0aW9uQ291bnQgPiAwXHJcbiAgICAgIGluZGV4ID0gKHZhbHVlICsgQGNlbGVicmF0aW9uQ291bnQgLSAyKSAlIDhcclxuICAgICAgY29sb3IgPSBDRUxFQlJBVElPTl9DT0xPUlNbaW5kZXhdXHJcbiAgICByZXR1cm4gY29sb3JcclxuXHJcbiAgY2hvb3NlQmFja2dyb3VuZENvbG9yOiAoaSwgaiwgdmFsdWUsIGxvY2tlZCwgbWFya3MpIC0+XHJcbiAgICBjb2xvciA9IG51bGxcclxuXHJcbiAgICAjIExvY2tlZCBjZWxsc1xyXG4gICAgaWYgbG9ja2VkXHJcbiAgICAgIGNvbG9yID0gQ29sb3IuYmFja2dyb3VuZExvY2tlZFxyXG5cclxuICAgICMgT3ZlcnJpZGUgd2l0aCBhbnkgaGlnaGxpZ2h0aW5nXHJcbiAgICBzd2l0Y2ggQG1vZGVcclxuICAgICAgd2hlbiBNb2RlVHlwZS5WSVNJQklMSVRZXHJcbiAgICAgICAgaWYgKEB2aXNpYmlsaXR5WCAhPSAtMSkgJiYgKEB2aXNpYmlsaXR5WSAhPSAtMSlcclxuICAgICAgICAgIGlmIChpID09IEB2aXNpYmlsaXR5WCkgJiYgKGogPT0gQHZpc2liaWxpdHlZKVxyXG4gICAgICAgICAgICBpZiBsb2NrZWRcclxuICAgICAgICAgICAgICBjb2xvciA9IENvbG9yLmJhY2tncm91bmRMb2NrZWRTZWxlY3RlZFxyXG4gICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgY29sb3IgPSBDb2xvci5iYWNrZ3JvdW5kU2VsZWN0ZWRcclxuICAgICAgICAgIGVsc2UgaWYgQGNvbmZsaWN0cyhpLCBqLCBAdmlzaWJpbGl0eVgsIEB2aXNpYmlsaXR5WSlcclxuICAgICAgICAgICAgaWYgbG9ja2VkXHJcbiAgICAgICAgICAgICAgY29sb3IgPSBDb2xvci5iYWNrZ3JvdW5kTG9ja2VkQ29uZmxpY3RlZFxyXG4gICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgY29sb3IgPSBDb2xvci5iYWNrZ3JvdW5kQ29uZmxpY3RlZFxyXG4gICAgICB3aGVuIE1vZGVUeXBlLlBFTlxyXG4gICAgICAgIGlmIEBoaWdobGlnaHRpbmdWYWx1ZXMgYW5kIEBwZW5WYWx1ZSA9PSB2YWx1ZSBhbmQgdmFsdWUgIT0gMFxyXG4gICAgICAgICAgY29sb3IgPSBDb2xvci5iYWNrZ3JvdW5kU2VsZWN0ZWRcclxuICAgICAgd2hlbiBNb2RlVHlwZS5QRU5DSUxcclxuICAgICAgICBpZiBAaGlnaGxpZ2h0aW5nVmFsdWVzIGFuZCB2YWx1ZSA9PSAwIGFuZCBAcGVuVmFsdWUgaW4gbWFya3NcclxuICAgICAgICAgIGNvbG9yID0gQ29sb3IuYmFja2dyb3VuZFNlbGVjdGVkXHJcblxyXG4gICAgIyBPdmVycmlkZSBpZiBjZWxlYnJhdGluZ1xyXG4gICAgaWYgQGNlbGVicmF0aW9uQ291bnQgPiAwXHJcbiAgICAgIGNvbG9yID0gQGNob29zZUNlbGVicmF0aW9uQ29sb3IodmFsdWUpXHJcblxyXG4gICAgcmV0dXJuIGNvbG9yXHJcblxyXG4gIG1hcmtPZmZzZXQ6ICh2KSAtPlxyXG4gICAge1xyXG4gICAgICB4OiAoKHYgLSAxKSAlIDMpICogQGNlbGxTaXplIC8gMyArIEBjZWxsU2l6ZSAvIDZcclxuICAgICAgeTogTWF0aC5mbG9vcigodiAtIDEpIC8gMykgKiBAY2VsbFNpemUgLyAzICsgQGNlbGxTaXplIC8gNlxyXG4gICAgfVxyXG5cclxuICBkcmF3Q2VsbDogKHgsIHksIGJhY2tncm91bmRDb2xvciwgcywgZm9udCwgY29sb3IpIC0+XHJcbiAgICBweCA9IHggKiBAY2VsbFNpemVcclxuICAgIHB5ID0geSAqIEBjZWxsU2l6ZVxyXG4gICAgaWYgYmFja2dyb3VuZENvbG9yICE9IG51bGxcclxuICAgICAgQGFwcC5kcmF3RmlsbChweCwgcHksIEBjZWxsU2l6ZSwgQGNlbGxTaXplLCBiYWNrZ3JvdW5kQ29sb3IpXHJcbiAgICBAYXBwLmRyYXdUZXh0Q2VudGVyZWQocywgcHggKyAoQGNlbGxTaXplIC8gMiksIHB5ICsgKEBjZWxsU2l6ZSAvIDIpLCBmb250LCBjb2xvcilcclxuICAgIHJldHVyblxyXG5cclxuICBkcmF3Rmxhc2hDZWxsOiAoeCwgeSkgLT5cclxuICAgIHB4ID0geCAqIEBjZWxsU2l6ZVxyXG4gICAgcHkgPSB5ICogQGNlbGxTaXplXHJcbiAgICBAYXBwLmRyYXdGaWxsKHB4LCBweSwgQGNlbGxTaXplLCBAY2VsbFNpemUsIFwiYmxhY2tcIilcclxuICAgIHJldHVyblxyXG5cclxuICBkcmF3VW5zb2x2ZWRDZWxsOiAoeCwgeSwgYmFja2dyb3VuZENvbG9yLCBtYXJrcykgLT5cclxuICAgIHB4ID0geCAqIEBjZWxsU2l6ZVxyXG4gICAgcHkgPSB5ICogQGNlbGxTaXplXHJcbiAgICBpZiBiYWNrZ3JvdW5kQ29sb3IgIT0gbnVsbFxyXG4gICAgICBAYXBwLmRyYXdGaWxsKHB4LCBweSwgQGNlbGxTaXplLCBAY2VsbFNpemUsIGJhY2tncm91bmRDb2xvcilcclxuICAgIGZvciBtIGluIG1hcmtzXHJcbiAgICAgIG9mZnNldCA9IEBtYXJrT2Zmc2V0KG0pXHJcbiAgICAgIG14ID0gcHggKyBvZmZzZXQueFxyXG4gICAgICBteSA9IHB5ICsgb2Zmc2V0LnlcclxuICAgICAgdGV4dCA9IFN0cmluZyhtKVxyXG4gICAgICBAYXBwLmRyYXdUZXh0Q2VudGVyZWQodGV4dCwgbXgsIG15LCBAZm9udHMucGVuY2lsLCBDb2xvci5wZW5jaWwpXHJcbiAgICByZXR1cm5cclxuXHJcbiAgZHJhd1NvbHZlZENlbGw6ICh4LCB5LCBiYWNrZ3JvdW5kQ29sb3IsIGNvbG9yLCB2YWx1ZSkgLT5cclxuICAgIHB4ID0geCAqIEBjZWxsU2l6ZVxyXG4gICAgcHkgPSB5ICogQGNlbGxTaXplXHJcbiAgICBpZiBiYWNrZ3JvdW5kQ29sb3IgIT0gbnVsbFxyXG4gICAgICBAYXBwLmRyYXdGaWxsKHB4LCBweSwgQGNlbGxTaXplLCBAY2VsbFNpemUsIGJhY2tncm91bmRDb2xvcilcclxuICAgIEBhcHAuZHJhd1RleHRDZW50ZXJlZChTdHJpbmcodmFsdWUpLCBweCArIChAY2VsbFNpemUgLyAyKSwgcHkgKyAoQGNlbGxTaXplIC8gMiksIEBmb250cy5wZW4sIGNvbG9yKVxyXG4gICAgcmV0dXJuXHJcblxyXG4gIGRyYXdHcmlkOiAob3JpZ2luWCwgb3JpZ2luWSwgc2l6ZSwgc29sdmVkID0gZmFsc2UpIC0+XHJcbiAgICBmb3IgaSBpbiBbMC4uc2l6ZV1cclxuICAgICAgY29sb3IgPSBpZiBzb2x2ZWQgdGhlbiBcImdyZWVuXCIgZWxzZSBcImJsYWNrXCJcclxuICAgICAgbGluZVdpZHRoID0gQGxpbmVXaWR0aFRoaW5cclxuICAgICAgaWYgKChzaXplID09IDEpIHx8IChpICUgMykgPT0gMClcclxuICAgICAgICBsaW5lV2lkdGggPSBAbGluZVdpZHRoVGhpY2tcclxuXHJcbiAgICAgICMgSG9yaXpvbnRhbCBsaW5lc1xyXG4gICAgICBAYXBwLmRyYXdMaW5lKEBjZWxsU2l6ZSAqIChvcmlnaW5YICsgMCksIEBjZWxsU2l6ZSAqIChvcmlnaW5ZICsgaSksIEBjZWxsU2l6ZSAqIChvcmlnaW5YICsgc2l6ZSksIEBjZWxsU2l6ZSAqIChvcmlnaW5ZICsgaSksIGNvbG9yLCBsaW5lV2lkdGgpXHJcblxyXG4gICAgICAjIFZlcnRpY2FsIGxpbmVzXHJcbiAgICAgIEBhcHAuZHJhd0xpbmUoQGNlbGxTaXplICogKG9yaWdpblggKyBpKSwgQGNlbGxTaXplICogKG9yaWdpblkgKyAwKSwgQGNlbGxTaXplICogKG9yaWdpblggKyBpKSwgQGNlbGxTaXplICogKG9yaWdpblkgKyBzaXplKSwgY29sb3IsIGxpbmVXaWR0aClcclxuICAgIHJldHVyblxyXG5cclxuICBkcmF3TGluazogKHN0YXJ0WCwgc3RhcnRZLCBlbmRYLCBlbmRZLCBjb2xvciwgbGluZVdpZHRoLCB2KSAtPlxyXG4gICAgb2Zmc2V0ID0gQG1hcmtPZmZzZXQodilcclxuICAgIHgxID0gc3RhcnRYICogQGNlbGxTaXplICsgb2Zmc2V0LnhcclxuICAgIHkxID0gc3RhcnRZICogQGNlbGxTaXplICsgb2Zmc2V0LnlcclxuICAgIHgyID0gZW5kWCAqIEBjZWxsU2l6ZSArIG9mZnNldC54XHJcbiAgICB5MiA9IGVuZFkgKiBAY2VsbFNpemUgKyBvZmZzZXQueVxyXG5cclxuICAgICMgRW5zdXJlIHRoYXQgdGhlIGFyYyBjdXJ2ZXMgdG93YXJkIHRoZSBjZW50ZXJcclxuICAgIGlmIChAY2VudGVyWCAtIHgxKSAqICh5MiAtIHkxKSAtIChAY2VudGVyWSAtIHkxKSAqICh4MiAtIHgxKSA8IDBcclxuICAgICAgW3gxLCB4Ml0gPSBbeDIsIHgxXVxyXG4gICAgICBbeTEsIHkyXSA9IFt5MiwgeTFdXHJcblxyXG4gICAgciA9IDEuMyAqIE1hdGguc3FydCgoeDIgLSB4MSkgKiAoeDIgLSB4MSkgKyAoeTIgLSB5MSkgKiAoeTIgLSB5MSkpICMgMS4zIGdpdmVzIHRoZSBtb3N0IGN1cnZlIG1pbmltaXppbmcgb3ZlcmxhcCBvZiBtYXJrcyBpbiBvdGhlciBjZWxsc1xyXG4gICAgQGFwcC5kcmF3QXJjKHgxLCB5MSwgeDIsIHkyLCByLCBjb2xvciwgbGluZVdpZHRoKVxyXG4gICAgQGFwcC5kcmF3UG9pbnQoeDEsIHkxLCBAbGlua0RvdFJhZGl1cywgY29sb3IpXHJcbiAgICBAYXBwLmRyYXdQb2ludCh4MiwgeTIsIEBsaW5rRG90UmFkaXVzLCBjb2xvcilcclxuXHJcbiAgZHJhdzogKGZsYXNoWCwgZmxhc2hZKSAtPlxyXG4gICAgY29uc29sZS5sb2cgXCJkcmF3KClcIlxyXG5cclxuICAgICMgQ2xlYXIgc2NyZWVuIHRvIGJsYWNrXHJcbiAgICBAYXBwLmRyYXdGaWxsKDAsIDAsIEBjYW52YXMud2lkdGgsIEBjYW52YXMuaGVpZ2h0LCBcImJsYWNrXCIpXHJcblxyXG4gICAgIyBNYWtlIHdoaXRlIHBob25lLXNoYXBlZCBiYWNrZ3JvdW5kXHJcbiAgICBAYXBwLmRyYXdGaWxsKDAsIDAsIEBjZWxsU2l6ZSAqIDksIEBjYW52YXMuaGVpZ2h0LCBcIndoaXRlXCIpXHJcblxyXG4gICAgIyBEcmF3IGJvYXJkIG51bWJlcnNcclxuICAgIGZvciBqIGluIFswLi4uOV1cclxuICAgICAgZm9yIGkgaW4gWzAuLi45XVxyXG4gICAgICAgIGlmIChpID09IGZsYXNoWCkgJiYgKGogPT0gZmxhc2hZKVxyXG4gICAgICAgICAgIyBEcmF3IGZsYXNoXHJcbiAgICAgICAgICBAZHJhd0ZsYXNoQ2VsbChpLCBqKVxyXG4gICAgICAgIGVsc2VcclxuICAgICAgICAgICMgRHJhdyBzb2x2ZWQgb3IgdW5zb2x2ZWQgY2VsbFxyXG4gICAgICAgICAgY2VsbCA9IEBnYW1lLmdyaWRbaV1bal1cclxuICAgICAgICAgIG1hcmtzID0gQGdhbWUucGVuY2lsTWFya3MoaSwgailcclxuXHJcbiAgICAgICAgICAjIERldGVybWluZSBiYWNrZ3JvdW5kIGNvbG9yXHJcbiAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3IgPSBAY2hvb3NlQmFja2dyb3VuZENvbG9yKGksIGosIGNlbGwudmFsdWUsIGNlbGwubG9ja2VkLCBtYXJrcylcclxuXHJcbiAgICAgICAgICBpZiBjZWxsLnZhbHVlID09IDBcclxuICAgICAgICAgICAgQGRyYXdVbnNvbHZlZENlbGwoaSwgaiwgYmFja2dyb3VuZENvbG9yLCBtYXJrcylcclxuICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgdGV4dENvbG9yID0gaWYgY2VsbC5lcnJvciB0aGVuIENvbG9yLmVycm9yIGVsc2UgQ29sb3IudmFsdWVcclxuICAgICAgICAgICAgQGRyYXdTb2x2ZWRDZWxsKGksIGosIGJhY2tncm91bmRDb2xvciwgdGV4dENvbG9yLCBjZWxsLnZhbHVlKVxyXG5cclxuICAgICMgRHJhdyBsaW5rcyBpbiBMSU5LUyBtb2RlXHJcbiAgICBpZiBAbW9kZSBpcyBNb2RlVHlwZS5MSU5LU1xyXG4gICAgICBmb3IgbGluayBpbiBAc3Ryb25nTGlua3NcclxuICAgICAgICBAZHJhd0xpbmsobGlua1swXS54LCBsaW5rWzBdLnksIGxpbmtbMV0ueCwgbGlua1sxXS55LCBDb2xvci5saW5rcywgQGxpbmVXaWR0aFRoaWNrLCBAcGVuVmFsdWUpXHJcbiAgICAgIGZvciBsaW5rIGluIEB3ZWFrTGlua3NcclxuICAgICAgICBAZHJhd0xpbmsobGlua1swXS54LCBsaW5rWzBdLnksIGxpbmtbMV0ueCwgbGlua1sxXS55LCBDb2xvci5saW5rcywgQGxpbmVXaWR0aFRoaW4sIEBwZW5WYWx1ZSlcclxuXHJcbiAgICAjIERyYXcgcGVuIGFuZCBwZW5jaWwgbnVtYmVyIGJ1dHRvbnNcclxuICAgIGRvbmUgPSBAZ2FtZS5kb25lKClcclxuICAgIGZvciBqIGluIFswLi4uM11cclxuICAgICAgZm9yIGkgaW4gWzAuLi4zXVxyXG4gICAgICAgIGN1cnJlbnRWYWx1ZSA9IChqICogMykgKyBpICsgMVxyXG4gICAgICAgIGN1cnJlbnRWYWx1ZVN0cmluZyA9IFN0cmluZyhjdXJyZW50VmFsdWUpXHJcbiAgICAgICAgdmFsdWVDb2xvciA9IENvbG9yLnZhbHVlXHJcbiAgICAgICAgcGVuY2lsQ29sb3IgPSBDb2xvci5wZW5jaWxcclxuICAgICAgICBpZiBkb25lWyhqICogMykgKyBpXVxyXG4gICAgICAgICAgdmFsdWVDb2xvciA9IENvbG9yLmRvbmVcclxuICAgICAgICAgIHBlbmNpbENvbG9yID0gQ29sb3IuZG9uZVxyXG5cclxuICAgICAgICB2YWx1ZUJhY2tncm91bmRDb2xvciA9IG51bGxcclxuICAgICAgICBwZW5jaWxCYWNrZ3JvdW5kQ29sb3IgPSBudWxsXHJcbiAgICAgICAgaWYgQHBlblZhbHVlID09IGN1cnJlbnRWYWx1ZVxyXG4gICAgICAgICAgaWYgQG1vZGUgaXMgTW9kZVR5cGUuUEVOQ0lMIG9yIEBtb2RlIGlzIE1vZGVUeXBlLkxJTktTXHJcbiAgICAgICAgICAgIHBlbmNpbEJhY2tncm91bmRDb2xvciA9IENvbG9yLmJhY2tncm91bmRTZWxlY3RlZFxyXG4gICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICB2YWx1ZUJhY2tncm91bmRDb2xvciA9IENvbG9yLmJhY2tncm91bmRTZWxlY3RlZFxyXG5cclxuICAgICAgICBAZHJhd0NlbGwoUEVOX1BPU19YICsgaSwgUEVOX1BPU19ZICsgaiwgdmFsdWVCYWNrZ3JvdW5kQ29sb3IsIGN1cnJlbnRWYWx1ZVN0cmluZywgQGZvbnRzLnBlbiwgdmFsdWVDb2xvcilcclxuICAgICAgICBAZHJhd0NlbGwoUEVOQ0lMX1BPU19YICsgaSwgUEVOQ0lMX1BPU19ZICsgaiwgcGVuY2lsQmFja2dyb3VuZENvbG9yLCBjdXJyZW50VmFsdWVTdHJpbmcsIEBmb250cy5wZW4sIHBlbmNpbENvbG9yKVxyXG5cclxuICAgICMgRHJhdyBwZW4gYW5kIHBlbmNpbCBDTEVBUiBidXR0b25zXHJcbiAgICB2YWx1ZUJhY2tncm91bmRDb2xvciA9IG51bGxcclxuICAgIHBlbmNpbEJhY2tncm91bmRDb2xvciA9IG51bGxcclxuICAgIGlmIEBwZW5WYWx1ZSA9PSBDTEVBUlxyXG4gICAgICAgIGlmIEBtb2RlIGlzIE1vZGVUeXBlLlBFTkNJTFxyXG4gICAgICAgICAgICBwZW5jaWxCYWNrZ3JvdW5kQ29sb3IgPSBDb2xvci5iYWNrZ3JvdW5kU2VsZWN0ZWRcclxuICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIHZhbHVlQmFja2dyb3VuZENvbG9yID0gQ29sb3IuYmFja2dyb3VuZFNlbGVjdGVkXHJcblxyXG4gICAgQGRyYXdDZWxsKFBFTl9DTEVBUl9QT1NfWCwgUEVOX0NMRUFSX1BPU19ZLCB2YWx1ZUJhY2tncm91bmRDb2xvciwgXCJDXCIsIEBmb250cy5wZW4sIENvbG9yLmVycm9yKVxyXG4gICAgQGRyYXdDZWxsKFBFTkNJTF9DTEVBUl9QT1NfWCwgUEVOQ0lMX0NMRUFSX1BPU19ZLCBwZW5jaWxCYWNrZ3JvdW5kQ29sb3IsIFwiQ1wiLCBAZm9udHMucGVuLCBDb2xvci5lcnJvcilcclxuXHJcbiAgICAjIERyYXcgbW9kZVxyXG4gICAgc3dpdGNoIEBtb2RlXHJcbiAgICAgIHdoZW4gTW9kZVR5cGUuVklTSUJJTElUWVxyXG4gICAgICAgIG1vZGVDb2xvciA9IENvbG9yLm1vZGVTZWxlY3RcclxuICAgICAgICBtb2RlVGV4dCA9IFwiSGlnaGxpZ2h0aW5nXCJcclxuICAgICAgd2hlbiBNb2RlVHlwZS5QRU5DSUxcclxuICAgICAgICBtb2RlQ29sb3IgPSBDb2xvci5tb2RlUGVuY2lsXHJcbiAgICAgICAgbW9kZVRleHQgPSBcIlBlbmNpbFwiXHJcbiAgICAgIHdoZW4gTW9kZVR5cGUuUEVOXHJcbiAgICAgICAgbW9kZUNvbG9yID0gQ29sb3IubW9kZVBlblxyXG4gICAgICAgIG1vZGVUZXh0ID0gXCJQZW5cIlxyXG4gICAgICB3aGVuIE1vZGVUeXBlLkxJTktTXHJcbiAgICAgICAgbW9kZUNvbG9yID0gQ29sb3IubW9kZUxpbmtzXHJcbiAgICAgICAgbW9kZVRleHQgPSBcIkxpbmtzXCJcclxuICAgIEBkcmF3Q2VsbChNT0RFX0NFTlRFUl9QT1NfWCwgTU9ERV9QT1NfWSwgbnVsbCwgbW9kZVRleHQsIEBmb250cy5tZW51LCBtb2RlQ29sb3IpXHJcblxyXG4gICAgQGRyYXdDZWxsKE1FTlVfUE9TX1gsIE1FTlVfUE9TX1ksIG51bGwsIFwiTWVudVwiLCBAZm9udHMubWVudSwgQ29sb3IubWVudSlcclxuICAgIEBkcmF3Q2VsbChVTkRPX1BPU19YLCBVTkRPX1BPU19ZLCBudWxsLCBcIlxcdXsyNWM0fVwiLCBAZm9udHMubWVudSwgQ29sb3IubWVudSkgaWYgKEBnYW1lLnVuZG9Kb3VybmFsLmxlbmd0aCA+IDApXHJcbiAgICBAZHJhd0NlbGwoUkVET19QT1NfWCwgUkVET19QT1NfWSwgbnVsbCwgXCJcXHV7MjViYX1cIiwgQGZvbnRzLm1lbnUsIENvbG9yLm1lbnUpIGlmIChAZ2FtZS5yZWRvSm91cm5hbC5sZW5ndGggPiAwKVxyXG5cclxuICAgICMgTWFrZSB0aGUgZ3JpZHNcclxuICAgIEBkcmF3R3JpZCgwLCAwLCA5LCBAZ2FtZS5zb2x2ZWQpXHJcbiAgICBAZHJhd0dyaWQoUEVOX1BPU19YLCBQRU5fUE9TX1ksIDMpXHJcbiAgICBAZHJhd0dyaWQoUEVOQ0lMX1BPU19YLCBQRU5DSUxfUE9TX1ksIDMpXHJcbiAgICBAZHJhd0dyaWQoUEVOX0NMRUFSX1BPU19YLCBQRU5fQ0xFQVJfUE9TX1ksIDEpXHJcbiAgICBAZHJhd0dyaWQoUEVOQ0lMX0NMRUFSX1BPU19YLCBQRU5DSUxfQ0xFQVJfUE9TX1ksIDEpXHJcblxyXG4gICAgIyBJZiB0aGUgZ2FtZSBpcyBzb2x2ZWQsIHRoZW4gc3RhcnQgdGhlIGNlbGVicmF0aW9uXHJcbiAgICBpZiBAZ2FtZS5zb2x2ZWQgYW5kIEBjZWxlYnJhdGlvbkNvdW50IDwgMFxyXG4gICAgICBAY2VsZWJyYXRpb25Db3VudCA9IENFTEVCUkFUSU9OX1NURVBTXHJcbiAgICAgIHNldFRpbWVvdXQgPT5cclxuICAgICAgICBAY2VsZWJyYXRlKClcclxuICAgICAgLCBDRUxFQlJBVElPTl9JTlRFUlZBTF9NU1xyXG5cclxuXHJcbiAgIyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgIyBJbnB1dFxyXG5cclxuICAjIERldGVybWluZXMgaWYgdGhlIGludGVydmFsIGlzIHNob3J0IGVub3VnaCB0byBjb25zaWRlciBhbiB0YXAgdG8gYmUgYSBkb3VibGUgdGFwLlxyXG4gIGRvdWJsZVRhcERldGVjdGVkOiAtPlxyXG4gICAgIyBEb3VibGUgdGFwIGFsc28gZGVwZW5kcyBvbiBvdGhlciBjb250ZXh0LiBUaGlzIGp1c3QgbWVhc3VyZXMgdGhlIHRpbWUuXHJcbiAgICBkdCA9IG5vdygpIC0gQGxhc3RWYWx1ZVRhcE1TXHJcbiAgICByZXR1cm4gZHQgPCBET1VCTEVfVEFQX0lOVEVSVkFMX01TXHJcblxyXG4gIG5ld0dhbWU6IChkaWZmaWN1bHR5KSAtPlxyXG4gICAgY29uc29sZS5sb2cgXCJTdWRva3VWaWV3Lm5ld0dhbWUoI3tkaWZmaWN1bHR5fSlcIlxyXG4gICAgQHJlc2V0U3RhdGUoKVxyXG4gICAgQGdhbWUubmV3R2FtZShkaWZmaWN1bHR5KVxyXG5cclxuICByZXNldDogLT5cclxuICAgIEByZXNldFN0YXRlKClcclxuICAgIEBnYW1lLnJlc2V0KClcclxuXHJcbiAgaW1wb3J0OiAoaW1wb3J0U3RyaW5nKSAtPlxyXG4gICAgQHJlc2V0U3RhdGUoKVxyXG4gICAgcmV0dXJuIEBnYW1lLmltcG9ydChpbXBvcnRTdHJpbmcpXHJcblxyXG4gIGV4cG9ydDogLT5cclxuICAgIHJldHVybiBAZ2FtZS5leHBvcnQoKVxyXG5cclxuICBob2xlQ291bnQ6IC0+XHJcbiAgICByZXR1cm4gQGdhbWUuaG9sZUNvdW50KClcclxuXHJcbiAgaGFuZGxlU2VsZWN0QWN0aW9uOiAoYWN0aW9uKSAtPlxyXG4gICAgc3dpdGNoIEBtb2RlXHJcbiAgICAgIHdoZW4gTW9kZVR5cGUuVklTSUJJTElUWVxyXG4gICAgICAgIGlmIChAdmlzaWJpbGl0eVggPT0gYWN0aW9uLngpICYmIChAdmlzaWJpbGl0eVkgPT0gYWN0aW9uLnkpXHJcbiAgICAgICAgICBAdmlzaWJpbGl0eVggPSAtMVxyXG4gICAgICAgICAgQHZpc2liaWxpdHlZID0gLTFcclxuICAgICAgICBlbHNlXHJcbiAgICAgICAgICBAdmlzaWJpbGl0eVggPSBhY3Rpb24ueFxyXG4gICAgICAgICAgQHZpc2liaWxpdHlZID0gYWN0aW9uLnlcclxuICAgICAgICByZXR1cm4gW11cclxuICAgICAgd2hlbiBNb2RlVHlwZS5QRU5DSUxcclxuICAgICAgICBpZiBAcGVuVmFsdWUgPT0gQ0xFQVJcclxuICAgICAgICAgIEBnYW1lLmNsZWFyUGVuY2lsKGFjdGlvbi54LCBhY3Rpb24ueSlcclxuICAgICAgICBlbHNlIGlmIEBwZW5WYWx1ZSAhPSBOT05FXHJcbiAgICAgICAgICBAZ2FtZS50b2dnbGVQZW5jaWwoYWN0aW9uLngsIGFjdGlvbi55LCBAcGVuVmFsdWUpXHJcbiAgICAgICAgcmV0dXJuIFsgYWN0aW9uLngsIGFjdGlvbi55IF1cclxuICAgICAgd2hlbiBNb2RlVHlwZS5QRU5cclxuICAgICAgICBpZiBAcGVuVmFsdWUgPT0gQ0xFQVJcclxuICAgICAgICAgIEBnYW1lLnNldFZhbHVlKGFjdGlvbi54LCBhY3Rpb24ueSwgMClcclxuICAgICAgICBlbHNlIGlmIEBwZW5WYWx1ZSAhPSBOT05FXHJcbiAgICAgICAgICBAZ2FtZS5zZXRWYWx1ZShhY3Rpb24ueCwgYWN0aW9uLnksIEBwZW5WYWx1ZSlcclxuICAgICAgICByZXR1cm4gWyBhY3Rpb24ueCwgYWN0aW9uLnkgXVxyXG5cclxuICBoYW5kbGVQZW5jaWxBY3Rpb246IChhY3Rpb24pIC0+XHJcbiAgICAjIEZpcnN0LCBtYWtlIHN1cmUgYW55IFZJU0lCSUxJVFkgYW5kIExJTktTIG1vZGUgc3R1ZmYgaXMgcmVzZXRcclxuICAgIEB2aXNpYmlsaXR5WCA9IC0xXHJcbiAgICBAdmlzaWJpbGl0eVkgPSAtMVxyXG4gICAgQHN0cm9uZ0xpbmtzID0gW11cclxuICAgIEB3ZWFrTGlua3MgPSBbXVxyXG5cclxuICAgIHN3aXRjaCBAbW9kZVxyXG4gICAgICAjIEluIExJTktTLCBhbGwgbGlua3MgYXNzb2NpYXRlZCB3aXRoIHRoZSBudW1iZXIgYXJlIHNob3duLiBDTEVBUiBzaG93cyBub3RoaW5nLlxyXG4gICAgICB3aGVuIE1vZGVUeXBlLkxJTktTXHJcbiAgICAgICAgaWYgKGFjdGlvbi52YWx1ZSA9PSBDTEVBUilcclxuICAgICAgICAgIEBwZW5WYWx1ZSA9IE5PTkVcclxuICAgICAgICAgIEBzdHJvbmdMaW5rcyA9IFtdXHJcbiAgICAgICAgICBAd2Vha0xpbmtzID0gW11cclxuICAgICAgICBlbHNlXHJcbiAgICAgICAgICBAcGVuVmFsdWUgPSBhY3Rpb24udmFsdWVcclxuICAgICAgICAgIHsgc3Ryb25nOiBAc3Ryb25nTGlua3MsIHdlYWs6IEB3ZWFrTGlua3MgfSA9IEBnYW1lLmdldExpbmtzKGFjdGlvbi52YWx1ZSlcclxuXHJcbiAgICAgICMgSW4gUEVOQ0lMLCB0aGUgbW9kZSBpcyBjaGFuZ2VkIHRvIFZJU0lCSUxJVFkgaWYgdGhlIHNlbGVjdGVkIHZhbHVlIGlzIGFscmVhZHkgY3VycmVudCB1bmxlc3MgZG91YmxlIHRhcFxyXG4gICAgICAjIEFsc28sIGlmIGRvdWJsZSB0YXAsIHRoZW4gdHVybiBvbiBoaWdobGlnaHRpbmcgdmFsdWVzXHJcbiAgICAgIHdoZW4gTW9kZVR5cGUuUEVOQ0lMXHJcbiAgICAgICAgaWYgQHBlblZhbHVlID09IGFjdGlvbi52YWx1ZVxyXG4gICAgICAgICAgaWYgQGRvdWJsZVRhcERldGVjdGVkKClcclxuICAgICAgICAgICAgQGhpZ2hsaWdodGluZ1ZhbHVlcyA9IHRydWVcclxuICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgQGhpZ2hsaWdodGluZ1ZhbHVlcyA9IGZhbHNlXHJcbiAgICAgICAgICAgIEBsYXN0VmFsdWVUYXBNUyA9IG5vdygpXHJcbiAgICAgICAgICAgIEBtb2RlID0gTW9kZVR5cGUuVklTSUJJTElUWVxyXG4gICAgICAgICAgICBAcGVuVmFsdWUgPSBOT05FXHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgICAgQGhpZ2hsaWdodGluZ1ZhbHVlcyA9IGZhbHNlXHJcbiAgICAgICAgICBAbGFzdFZhbHVlVGFwTVMgPSBub3coKVxyXG4gICAgICAgICAgQHBlblZhbHVlID0gYWN0aW9uLnZhbHVlXHJcblxyXG4gICAgICAjIE90aGVyd2lzZSwgc3dpdGNoIHRvIFBFTkNJTFxyXG4gICAgICBlbHNlXHJcbiAgICAgICAgIyBJdCBpcyBwb3NzaWJsZSB0aGF0IHRoZSBmaXJzdCB0YXAgY2hhbmdlZCB0aGUgbW9kZSB0byBWSVNJQklMSVRZIHNvIGEgZG91YmxlIHRhcCBtdXN0IHByZXRlbmQgdGhhdCBpdCBkaWRuJ3RcclxuICAgICAgICBpZiBAbW9kZSBpcyBNb2RlVHlwZS5WSVNJQklMSVRZIGFuZCBAZG91YmxlVGFwRGV0ZWN0ZWQoKVxyXG4gICAgICAgICAgQGhpZ2hsaWdodGluZ1ZhbHVlcyA9IHRydWVcclxuICAgICAgICBlbHNlXHJcbiAgICAgICAgICBAaGlnaGxpZ2h0aW5nVmFsdWVzID0gZmFsc2VcclxuICAgICAgICAgIEBsYXN0VmFsdWVUYXBNUyA9IG5vdygpXHJcbiAgICAgICAgQG1vZGUgPSBNb2RlVHlwZS5QRU5DSUxcclxuICAgICAgICBAcGVuVmFsdWUgPSBhY3Rpb24udmFsdWVcclxuICAgIHJldHVyblxyXG5cclxuICBoYW5kbGVQZW5BY3Rpb246IChhY3Rpb24pIC0+XHJcbiAgICBzd2l0Y2ggQG1vZGVcclxuICAgICAgIyBJbiBQRU4sIHRoZSBtb2RlIGlzIGNoYW5nZWQgdG8gVklTSUJJTElUWSBpZiB0aGUgc2VsZWN0ZWQgdmFsdWUgaXMgYWxyZWFkeSBjdXJyZW50IHVubGVzcyBkb3VibGUgdGFwXHJcbiAgICAgICMgQWxzbywgaWYgZG91YmxlIHRhcCwgdGhlbiB0dXJuIG9uIGhpZ2hsaWdodGluZyB2YWx1ZXNcclxuICAgICAgd2hlbiBNb2RlVHlwZS5QRU5cclxuICAgICAgICBpZiAoQHBlblZhbHVlID09IGFjdGlvbi52YWx1ZSlcclxuICAgICAgICAgIGlmIEBkb3VibGVUYXBEZXRlY3RlZCgpXHJcbiAgICAgICAgICAgIEBoaWdobGlnaHRpbmdWYWx1ZXMgPSB0cnVlXHJcbiAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIEBoaWdobGlnaHRpbmdWYWx1ZXMgPSBmYWxzZVxyXG4gICAgICAgICAgICBAbGFzdFZhbHVlVGFwTVMgPSBub3coKVxyXG4gICAgICAgICAgICBAbW9kZSA9IE1vZGVUeXBlLlZJU0lCSUxJVFlcclxuICAgICAgICAgICAgQHBlblZhbHVlID0gTk9ORVxyXG4gICAgICAgIGVsc2VcclxuICAgICAgICAgIEBoaWdobGlnaHRpbmdWYWx1ZXMgPSBmYWxzZVxyXG4gICAgICAgICAgQGxhc3RWYWx1ZVRhcE1TID0gbm93KClcclxuICAgICAgICAgIEBwZW5WYWx1ZSA9IGFjdGlvbi52YWx1ZVxyXG5cclxuICAgICAgIyBJZ25vcmVkIGluIExJTktTXHJcbiAgICAgIHdoZW4gTW9kZVR5cGUuTElOS1NcclxuICAgICAgICByZXR1cm5cclxuXHJcbiAgICAgICMgT3RoZXJ3aXNlLCB0aGUgbW9kZSBpcyBzd2l0Y2hlZCB0byAob3IgcmVtYWlucyBhcykgUEVOIHVzaW5nIHRoZSBzZWxlY3RlZCB2YWx1ZVxyXG4gICAgICBlbHNlXHJcbiAgICAgICAgIyBJdCBpcyBwb3NzaWJsZSB0aGF0IHRoZSBmaXJzdCB0YXAgY2hhbmdlZCB0aGUgbW9kZSB0byBWSVNJQklMSVRZIHNvIGEgZG91YmxlIHRhcCBtdXN0IHByZXRlbmQgdGhhdCBpdCBkaWRuJ3RcclxuICAgICAgICBpZiBAbW9kZSBpcyBNb2RlVHlwZS5WSVNJQklMSVRZIGFuZCBAZG91YmxlVGFwRGV0ZWN0ZWQoKVxyXG4gICAgICAgICAgQGhpZ2hsaWdodGluZ1ZhbHVlcyA9IHRydWVcclxuICAgICAgICBlbHNlXHJcbiAgICAgICAgICBAaGlnaGxpZ2h0aW5nVmFsdWVzID0gZmFsc2VcclxuICAgICAgICAgIEBsYXN0VmFsdWVUYXBNUyA9IG5vdygpXHJcbiAgICAgICAgQG1vZGUgPSBNb2RlVHlwZS5QRU5cclxuICAgICAgICBAcGVuVmFsdWUgPSBhY3Rpb24udmFsdWVcclxuXHJcbiAgICAjIE1ha2Ugc3VyZSBhbnkgdmlzaWJpbGl0eSBoaWdobGlnaHRpbmcgaXMgb2ZmIGFuZCBsaW5rcyBhcmUgY2xlYXJlZC5cclxuICAgIEB2aXNpYmlsaXR5WCA9IC0xXHJcbiAgICBAdmlzaWJpbGl0eVkgPSAtMVxyXG4gICAgQHN0cm9uZ0xpbmtzID0gW11cclxuICAgIEB3ZWFrTGlua3MgPSBbXVxyXG4gICAgcmV0dXJuXHJcblxyXG4gIGhhbmRsZVVuZG9BY3Rpb246IC0+XHJcbiAgICByZXR1cm4gQGdhbWUudW5kbygpIGlmIEBtb2RlIGlzbnQgTW9kZVR5cGUuTElOS1NcclxuXHJcbiAgaGFuZGxlUmVkb0FjdGlvbjogLT5cclxuICAgIHJldHVybiBAZ2FtZS5yZWRvKCkgaWYgQG1vZGUgaXNudCBNb2RlVHlwZS5MSU5LU1xyXG5cclxuICBoYW5kbGVNb2RlQWN0aW9uOiAtPlxyXG4gICAgc3dpdGNoIEBtb2RlXHJcbiAgICAgIHdoZW4gTW9kZVR5cGUuVklTSUJJTElUWVxyXG4gICAgICAgIEBtb2RlID0gTW9kZVR5cGUuTElOS1NcclxuICAgICAgd2hlbiBNb2RlVHlwZS5QRU5DSUxcclxuICAgICAgICBAbW9kZSA9IE1vZGVUeXBlLlBFTlxyXG4gICAgICB3aGVuIE1vZGVUeXBlLlBFTlxyXG4gICAgICAgIEBtb2RlID0gTW9kZVR5cGUuVklTSUJJTElUWVxyXG4gICAgICB3aGVuIE1vZGVUeXBlLkxJTktTXHJcbiAgICAgICAgQG1vZGUgPSBNb2RlVHlwZS5QRU5DSUxcclxuICAgIEB2aXNpYmlsaXR5WCA9IC0xXHJcbiAgICBAdmlzaWJpbGl0eVkgPSAtMVxyXG4gICAgQHBlblZhbHVlID0gTk9ORVxyXG4gICAgQHN0cm9uZ0xpbmtzID0gW11cclxuICAgIEB3ZWFrTGlua3MgPSBbXVxyXG4gICAgQGhpZ2hsaWdodGluZ1ZhbHVlcyA9IGZhbHNlXHJcbiAgICBAbGFzdFZhbHVlVGFwTVMgPSBub3coKSAtIERPVUJMRV9UQVBfSU5URVJWQUxfTVMgICAgIyBFbnN1cmUgdGhhdCB0aGUgbmV4dCB0YXAgaXMgbm90IGEgZG91YmxlIHRhcFxyXG4gICAgcmV0dXJuXHJcblxyXG4gIGNsaWNrOiAoeCwgeSkgLT5cclxuICAgICMgY29uc29sZS5sb2cgXCJjbGljayAje3h9LCAje3l9XCJcclxuICAgIHggPSBNYXRoLmZsb29yKHggLyBAY2VsbFNpemUpXHJcbiAgICB5ID0gTWF0aC5mbG9vcih5IC8gQGNlbGxTaXplKVxyXG5cclxuICAgIGZsYXNoWCA9IG51bGxcclxuICAgIGZsYXNoWSA9IG51bGxcclxuICAgIGlmICh4IDwgOSkgJiYgKHkgPCAxNSlcclxuICAgICAgICBpbmRleCA9ICh5ICogOSkgKyB4XHJcbiAgICAgICAgYWN0aW9uID0gQGFjdGlvbnNbaW5kZXhdXHJcbiAgICAgICAgaWYgYWN0aW9uICE9IG51bGxcclxuICAgICAgICAgIGNvbnNvbGUubG9nIFwiQWN0aW9uOiBcIiwgYWN0aW9uXHJcblxyXG4gICAgICAgICAgaWYgYWN0aW9uLnR5cGUgaXMgQWN0aW9uVHlwZS5NRU5VXHJcbiAgICAgICAgICAgIEBhcHAuc3dpdGNoVmlldyhcIm1lbnVcIilcclxuICAgICAgICAgICAgcmV0dXJuXHJcblxyXG4gICAgICAgICAgc3dpdGNoIGFjdGlvbi50eXBlXHJcbiAgICAgICAgICAgIHdoZW4gQWN0aW9uVHlwZS5TRUxFQ1QgdGhlbiBbIGZsYXNoWCwgZmxhc2hZIF0gPSBAaGFuZGxlU2VsZWN0QWN0aW9uKGFjdGlvbilcclxuICAgICAgICAgICAgd2hlbiBBY3Rpb25UeXBlLlBFTkNJTCB0aGVuIEBoYW5kbGVQZW5jaWxBY3Rpb24oYWN0aW9uKVxyXG4gICAgICAgICAgICB3aGVuIEFjdGlvblR5cGUuUEVOIHRoZW4gQGhhbmRsZVBlbkFjdGlvbihhY3Rpb24pXHJcbiAgICAgICAgICAgIHdoZW4gQWN0aW9uVHlwZS5VTkRPIHRoZW4gWyBmbGFzaFgsIGZsYXNoWSBdID0gQGhhbmRsZVVuZG9BY3Rpb24oKVxyXG4gICAgICAgICAgICB3aGVuIEFjdGlvblR5cGUuUkVETyB0aGVuIFsgZmxhc2hYLCBmbGFzaFkgXSA9IEBoYW5kbGVSZWRvQWN0aW9uKClcclxuICAgICAgICAgICAgd2hlbiBBY3Rpb25UeXBlLk1PREUgdGhlbiBAaGFuZGxlTW9kZUFjdGlvbigpXHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgICAgIyBubyBhY3Rpb24sIGRlZmF1bHQgdG8gVklTSUJJTElUWSBtb2RlXHJcbiAgICAgICAgICBAbW9kZSA9IE1vZGVUeXBlLlZJU0lCSUxJVFlcclxuICAgICAgICAgIEB2aXNpYmlsaXR5WCA9IC0xXHJcbiAgICAgICAgICBAdmlzaWJpbGl0eVkgPSAtMVxyXG4gICAgICAgICAgQHBlblZhbHVlID0gTk9ORVxyXG4gICAgICAgICAgQHN0cm9uZ0xpbmtzID0gW11cclxuICAgICAgICAgIEB3ZWFrTGlua3MgPSBbXVxyXG4gICAgICAgICAgQGhpZ2hsaWdodGluZ1ZhbHVlcyA9IGZhbHNlXHJcbiAgICAgICAgICBAbGFzdFZhbHVlVGFwTVMgPSBub3coKSAtIERPVUJMRV9UQVBfSU5URVJWQUxfTVMgICAgIyBFbnN1cmUgdGhhdCB0aGUgbmV4dCB0YXAgaXMgbm90IGEgZG91YmxlIHRhcFxyXG5cclxuICAgICAgICBAZHJhdyhmbGFzaFgsIGZsYXNoWSlcclxuICAgICAgICBpZiAoZmxhc2hYPyAmJiBmbGFzaFk/KVxyXG4gICAgICAgICAgc2V0VGltZW91dCA9PlxyXG4gICAgICAgICAgICBAZHJhdygpXHJcbiAgICAgICAgICAsIEZMQVNIX0lOVEVSVkFMX01TXHJcbiAgICByZXR1cm5cclxuXHJcbiAga2V5OiAoaykgLT5cclxuICAgIGlmIGsgPT0gJy4nXHJcbiAgICAgIEBwcmVmZXJQZW5jaWwgPSAhQHByZWZlclBlbmNpbFxyXG4gICAgICBpZiBAbW9kZSA9PSBNb2RlVHlwZS5QRU5cclxuICAgICAgICBAaGFuZGxlUGVuY2lsQWN0aW9uKHsgdmFsdWU6IEBwZW5WYWx1ZSB9KVxyXG4gICAgICBlbHNlIGlmIEBtb2RlID09IE1vZGVUeXBlLlBFTkNJTFxyXG4gICAgICAgIEBoYW5kbGVQZW5BY3Rpb24oeyB2YWx1ZTogQHBlblZhbHVlIH0pXHJcbiAgICAgIEBkcmF3KClcclxuICAgIGVsc2UgaWYgS0VZX01BUFBJTkdba10/XHJcbiAgICAgIG1hcHBpbmcgPSBLRVlfTUFQUElOR1trXVxyXG4gICAgICB1c2VQZW5jaWwgPSBAcHJlZmVyUGVuY2lsXHJcbiAgICAgIGlmIG1hcHBpbmcuc2hpZnRcclxuICAgICAgICB1c2VQZW5jaWwgPSAhdXNlUGVuY2lsXHJcbiAgICAgIGlmIHVzZVBlbmNpbFxyXG4gICAgICAgIEBoYW5kbGVQZW5jaWxBY3Rpb24oeyB2YWx1ZTogbWFwcGluZy52IH0pXHJcbiAgICAgIGVsc2VcclxuICAgICAgICBAaGFuZGxlUGVuQWN0aW9uKHsgdmFsdWU6IG1hcHBpbmcudiB9KVxyXG4gICAgICBAZHJhdygpXHJcbiAgICAgIHJldHVyblxyXG5cclxuICAjIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAjIEhlbHBlcnNcclxuXHJcbiAgY29uZmxpY3RzOiAoeDEsIHkxLCB4MiwgeTIpIC0+XHJcbiAgICAjIHNhbWUgcm93IG9yIGNvbHVtbj9cclxuICAgIGlmICh4MSA9PSB4MikgfHwgKHkxID09IHkyKVxyXG4gICAgICByZXR1cm4gdHJ1ZVxyXG5cclxuICAgICMgc2FtZSBzZWN0aW9uP1xyXG4gICAgc3gxID0gTWF0aC5mbG9vcih4MSAvIDMpICogM1xyXG4gICAgc3kxID0gTWF0aC5mbG9vcih5MSAvIDMpICogM1xyXG4gICAgc3gyID0gTWF0aC5mbG9vcih4MiAvIDMpICogM1xyXG4gICAgc3kyID0gTWF0aC5mbG9vcih5MiAvIDMpICogM1xyXG4gICAgaWYgKHN4MSA9PSBzeDIpICYmIChzeTEgPT0gc3kyKVxyXG4gICAgICByZXR1cm4gdHJ1ZVxyXG5cclxuICAgIHJldHVybiBmYWxzZVxyXG5cclxuICAjIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gU3Vkb2t1Vmlld1xyXG4iLCJBcHAgPSByZXF1aXJlICcuL0FwcCdcclxuXHJcbmluaXQgPSAtPlxyXG4gIGNvbnNvbGUubG9nIFwiaW5pdFwiXHJcbiAgY2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImNhbnZhc1wiKVxyXG4gIGNhbnZhcy53aWR0aCA9IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGllbnRXaWR0aFxyXG4gIGNhbnZhcy5oZWlnaHQgPSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50SGVpZ2h0XHJcbiAgZG9jdW1lbnQuYm9keS5pbnNlcnRCZWZvcmUoY2FudmFzLCBkb2N1bWVudC5ib2R5LmNoaWxkTm9kZXNbMF0pXHJcbiAgY2FudmFzUmVjdCA9IGNhbnZhcy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKVxyXG5cclxuICB3aW5kb3cuYXBwID0gbmV3IEFwcChjYW52YXMpXHJcblxyXG4gICMgY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIgXCJ0b3VjaHN0YXJ0XCIsIChlKSAtPlxyXG4gICMgICBjb25zb2xlLmxvZyBPYmplY3Qua2V5cyhlLnRvdWNoZXNbMF0pXHJcbiAgIyAgIHggPSBlLnRvdWNoZXNbMF0uY2xpZW50WCAtIGNhbnZhc1JlY3QubGVmdFxyXG4gICMgICB5ID0gZS50b3VjaGVzWzBdLmNsaWVudFkgLSBjYW52YXNSZWN0LnRvcFxyXG4gICMgICB3aW5kb3cuYXBwLmNsaWNrKHgsIHkpXHJcblxyXG4gIGNhbnZhcy5hZGRFdmVudExpc3RlbmVyIFwibW91c2Vkb3duXCIsIChlKSAtPlxyXG4gICAgeCA9IGUuY2xpZW50WCAtIGNhbnZhc1JlY3QubGVmdFxyXG4gICAgeSA9IGUuY2xpZW50WSAtIGNhbnZhc1JlY3QudG9wXHJcbiAgICB3aW5kb3cuYXBwLmNsaWNrKHgsIHkpXHJcblxyXG4gIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIgJ2tleWRvd24nLCAoZSkgLT5cclxuICAgIHdpbmRvdy5hcHAua2V5KGUua2V5KVxyXG5cclxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCAoZSkgLT5cclxuICAgIGluaXQoKVxyXG4sIGZhbHNlKVxyXG4iLCJtb2R1bGUuZXhwb3J0cyA9IFwiMC4wLjE4XCIiLCIvKiBGb250IEZhY2UgT2JzZXJ2ZXIgdjIuMy4wIC0gwqkgQnJhbSBTdGVpbi4gTGljZW5zZTogQlNELTMtQ2xhdXNlICovKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcChhLGMpe2RvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXI/YS5hZGRFdmVudExpc3RlbmVyKFwic2Nyb2xsXCIsYywhMSk6YS5hdHRhY2hFdmVudChcInNjcm9sbFwiLGMpfWZ1bmN0aW9uIHUoYSl7ZG9jdW1lbnQuYm9keT9hKCk6ZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcj9kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwiRE9NQ29udGVudExvYWRlZFwiLGZ1bmN0aW9uIGIoKXtkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKFwiRE9NQ29udGVudExvYWRlZFwiLGIpO2EoKX0pOmRvY3VtZW50LmF0dGFjaEV2ZW50KFwib25yZWFkeXN0YXRlY2hhbmdlXCIsZnVuY3Rpb24gZygpe2lmKFwiaW50ZXJhY3RpdmVcIj09ZG9jdW1lbnQucmVhZHlTdGF0ZXx8XCJjb21wbGV0ZVwiPT1kb2N1bWVudC5yZWFkeVN0YXRlKWRvY3VtZW50LmRldGFjaEV2ZW50KFwib25yZWFkeXN0YXRlY2hhbmdlXCIsZyksYSgpfSl9O2Z1bmN0aW9uIHcoYSl7dGhpcy5nPWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7dGhpcy5nLnNldEF0dHJpYnV0ZShcImFyaWEtaGlkZGVuXCIsXCJ0cnVlXCIpO3RoaXMuZy5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShhKSk7dGhpcy5oPWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpO3RoaXMuaT1kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTt0aGlzLm09ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIik7dGhpcy5qPWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpO3RoaXMubD0tMTt0aGlzLmguc3R5bGUuY3NzVGV4dD1cIm1heC13aWR0aDpub25lO2Rpc3BsYXk6aW5saW5lLWJsb2NrO3Bvc2l0aW9uOmFic29sdXRlO2hlaWdodDoxMDAlO3dpZHRoOjEwMCU7b3ZlcmZsb3c6c2Nyb2xsO2ZvbnQtc2l6ZToxNnB4O1wiO3RoaXMuaS5zdHlsZS5jc3NUZXh0PVwibWF4LXdpZHRoOm5vbmU7ZGlzcGxheTppbmxpbmUtYmxvY2s7cG9zaXRpb246YWJzb2x1dGU7aGVpZ2h0OjEwMCU7d2lkdGg6MTAwJTtvdmVyZmxvdzpzY3JvbGw7Zm9udC1zaXplOjE2cHg7XCI7XG50aGlzLmouc3R5bGUuY3NzVGV4dD1cIm1heC13aWR0aDpub25lO2Rpc3BsYXk6aW5saW5lLWJsb2NrO3Bvc2l0aW9uOmFic29sdXRlO2hlaWdodDoxMDAlO3dpZHRoOjEwMCU7b3ZlcmZsb3c6c2Nyb2xsO2ZvbnQtc2l6ZToxNnB4O1wiO3RoaXMubS5zdHlsZS5jc3NUZXh0PVwiZGlzcGxheTppbmxpbmUtYmxvY2s7d2lkdGg6MjAwJTtoZWlnaHQ6MjAwJTtmb250LXNpemU6MTZweDttYXgtd2lkdGg6bm9uZTtcIjt0aGlzLmguYXBwZW5kQ2hpbGQodGhpcy5tKTt0aGlzLmkuYXBwZW5kQ2hpbGQodGhpcy5qKTt0aGlzLmcuYXBwZW5kQ2hpbGQodGhpcy5oKTt0aGlzLmcuYXBwZW5kQ2hpbGQodGhpcy5pKX1cbmZ1bmN0aW9uIHgoYSxjKXthLmcuc3R5bGUuY3NzVGV4dD1cIm1heC13aWR0aDpub25lO21pbi13aWR0aDoyMHB4O21pbi1oZWlnaHQ6MjBweDtkaXNwbGF5OmlubGluZS1ibG9jaztvdmVyZmxvdzpoaWRkZW47cG9zaXRpb246YWJzb2x1dGU7d2lkdGg6YXV0bzttYXJnaW46MDtwYWRkaW5nOjA7dG9wOi05OTlweDt3aGl0ZS1zcGFjZTpub3dyYXA7Zm9udC1zeW50aGVzaXM6bm9uZTtmb250OlwiK2MrXCI7XCJ9ZnVuY3Rpb24gQihhKXt2YXIgYz1hLmcub2Zmc2V0V2lkdGgsYj1jKzEwMDthLmouc3R5bGUud2lkdGg9YitcInB4XCI7YS5pLnNjcm9sbExlZnQ9YjthLmguc2Nyb2xsTGVmdD1hLmguc2Nyb2xsV2lkdGgrMTAwO3JldHVybiBhLmwhPT1jPyhhLmw9YywhMCk6ITF9ZnVuY3Rpb24gQyhhLGMpe2Z1bmN0aW9uIGIoKXt2YXIgZT1nO0IoZSkmJm51bGwhPT1lLmcucGFyZW50Tm9kZSYmYyhlLmwpfXZhciBnPWE7cChhLmgsYik7cChhLmksYik7QihhKX07ZnVuY3Rpb24gRChhLGMsYil7Yz1jfHx7fTtiPWJ8fHdpbmRvdzt0aGlzLmZhbWlseT1hO3RoaXMuc3R5bGU9Yy5zdHlsZXx8XCJub3JtYWxcIjt0aGlzLndlaWdodD1jLndlaWdodHx8XCJub3JtYWxcIjt0aGlzLnN0cmV0Y2g9Yy5zdHJldGNofHxcIm5vcm1hbFwiO3RoaXMuY29udGV4dD1ifXZhciBFPW51bGwsRj1udWxsLEc9bnVsbCxIPW51bGw7ZnVuY3Rpb24gSShhKXtudWxsPT09RiYmKE0oYSkmJi9BcHBsZS8udGVzdCh3aW5kb3cubmF2aWdhdG9yLnZlbmRvcik/KGE9L0FwcGxlV2ViS2l0XFwvKFswLTldKykoPzpcXC4oWzAtOV0rKSkoPzpcXC4oWzAtOV0rKSkvLmV4ZWMod2luZG93Lm5hdmlnYXRvci51c2VyQWdlbnQpLEY9ISFhJiY2MDM+cGFyc2VJbnQoYVsxXSwxMCkpOkY9ITEpO3JldHVybiBGfWZ1bmN0aW9uIE0oYSl7bnVsbD09PUgmJihIPSEhYS5kb2N1bWVudC5mb250cyk7cmV0dXJuIEh9XG5mdW5jdGlvbiBOKGEsYyl7dmFyIGI9YS5zdHlsZSxnPWEud2VpZ2h0O2lmKG51bGw9PT1HKXt2YXIgZT1kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO3RyeXtlLnN0eWxlLmZvbnQ9XCJjb25kZW5zZWQgMTAwcHggc2Fucy1zZXJpZlwifWNhdGNoKHEpe31HPVwiXCIhPT1lLnN0eWxlLmZvbnR9cmV0dXJuW2IsZyxHP2Euc3RyZXRjaDpcIlwiLFwiMTAwcHhcIixjXS5qb2luKFwiIFwiKX1cbkQucHJvdG90eXBlLmxvYWQ9ZnVuY3Rpb24oYSxjKXt2YXIgYj10aGlzLGc9YXx8XCJCRVNic3d5XCIsZT0wLHE9Y3x8M0UzLEo9KG5ldyBEYXRlKS5nZXRUaW1lKCk7cmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKEssTCl7aWYoTShiLmNvbnRleHQpJiYhSShiLmNvbnRleHQpKXt2YXIgTz1uZXcgUHJvbWlzZShmdW5jdGlvbihyLHQpe2Z1bmN0aW9uIGgoKXsobmV3IERhdGUpLmdldFRpbWUoKS1KPj1xP3QoRXJyb3IoXCJcIitxK1wibXMgdGltZW91dCBleGNlZWRlZFwiKSk6Yi5jb250ZXh0LmRvY3VtZW50LmZvbnRzLmxvYWQoTihiLCdcIicrYi5mYW1pbHkrJ1wiJyksZykudGhlbihmdW5jdGlvbihuKXsxPD1uLmxlbmd0aD9yKCk6c2V0VGltZW91dChoLDI1KX0sdCl9aCgpfSksUD1uZXcgUHJvbWlzZShmdW5jdGlvbihyLHQpe2U9c2V0VGltZW91dChmdW5jdGlvbigpe3QoRXJyb3IoXCJcIitxK1wibXMgdGltZW91dCBleGNlZWRlZFwiKSl9LHEpfSk7UHJvbWlzZS5yYWNlKFtQLE9dKS50aGVuKGZ1bmN0aW9uKCl7Y2xlYXJUaW1lb3V0KGUpO1xuSyhiKX0sTCl9ZWxzZSB1KGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcigpe3ZhciBkO2lmKGQ9LTEhPWsmJi0xIT1sfHwtMSE9ayYmLTEhPW18fC0xIT1sJiYtMSE9bSkoZD1rIT1sJiZrIT1tJiZsIT1tKXx8KG51bGw9PT1FJiYoZD0vQXBwbGVXZWJLaXRcXC8oWzAtOV0rKSg/OlxcLihbMC05XSspKS8uZXhlYyh3aW5kb3cubmF2aWdhdG9yLnVzZXJBZ2VudCksRT0hIWQmJig1MzY+cGFyc2VJbnQoZFsxXSwxMCl8fDUzNj09PXBhcnNlSW50KGRbMV0sMTApJiYxMT49cGFyc2VJbnQoZFsyXSwxMCkpKSxkPUUmJihrPT15JiZsPT15JiZtPT15fHxrPT16JiZsPT16JiZtPT16fHxrPT1BJiZsPT1BJiZtPT1BKSksZD0hZDtkJiYobnVsbCE9PWYucGFyZW50Tm9kZSYmZi5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGYpLGNsZWFyVGltZW91dChlKSxLKGIpKX1mdW5jdGlvbiB0KCl7aWYoKG5ldyBEYXRlKS5nZXRUaW1lKCktSj49cSludWxsIT09Zi5wYXJlbnROb2RlJiZmLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoZiksXG5MKEVycm9yKFwiXCIrcStcIm1zIHRpbWVvdXQgZXhjZWVkZWRcIikpO2Vsc2V7dmFyIGQ9Yi5jb250ZXh0LmRvY3VtZW50LmhpZGRlbjtpZighMD09PWR8fHZvaWQgMD09PWQpaz1oLmcub2Zmc2V0V2lkdGgsbD1uLmcub2Zmc2V0V2lkdGgsbT12Lmcub2Zmc2V0V2lkdGgscigpO2U9c2V0VGltZW91dCh0LDUwKX19dmFyIGg9bmV3IHcoZyksbj1uZXcgdyhnKSx2PW5ldyB3KGcpLGs9LTEsbD0tMSxtPS0xLHk9LTEsej0tMSxBPS0xLGY9ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtmLmRpcj1cImx0clwiO3goaCxOKGIsXCJzYW5zLXNlcmlmXCIpKTt4KG4sTihiLFwic2VyaWZcIikpO3godixOKGIsXCJtb25vc3BhY2VcIikpO2YuYXBwZW5kQ2hpbGQoaC5nKTtmLmFwcGVuZENoaWxkKG4uZyk7Zi5hcHBlbmRDaGlsZCh2LmcpO2IuY29udGV4dC5kb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGYpO3k9aC5nLm9mZnNldFdpZHRoO3o9bi5nLm9mZnNldFdpZHRoO0E9di5nLm9mZnNldFdpZHRoO3QoKTtcbkMoaCxmdW5jdGlvbihkKXtrPWQ7cigpfSk7eChoLE4oYiwnXCInK2IuZmFtaWx5KydcIixzYW5zLXNlcmlmJykpO0MobixmdW5jdGlvbihkKXtsPWQ7cigpfSk7eChuLE4oYiwnXCInK2IuZmFtaWx5KydcIixzZXJpZicpKTtDKHYsZnVuY3Rpb24oZCl7bT1kO3IoKX0pO3godixOKGIsJ1wiJytiLmZhbWlseSsnXCIsbW9ub3NwYWNlJykpfSl9KX07XCJvYmplY3RcIj09PXR5cGVvZiBtb2R1bGU/bW9kdWxlLmV4cG9ydHM9RDood2luZG93LkZvbnRGYWNlT2JzZXJ2ZXI9RCx3aW5kb3cuRm9udEZhY2VPYnNlcnZlci5wcm90b3R5cGUubG9hZD1ELnByb3RvdHlwZS5sb2FkKTt9KCkpO1xuIl19
