(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var App, FontFaceObserver, MenuView, SudokuView, version;

FontFaceObserver = require('fontfaceobserver');

MenuView = require('./MenuView');

SudokuView = require('./SudokuView');

version = require('./version');

App = (function() {
  function App(canvas) {
    this.canvas = canvas;
    this.ctx = this.canvas.getContext("2d");
    this.loadFont("saxMono");
    this.fonts = {};
    this.versionFontHeight = Math.floor(this.canvas.height * 0.02);
    this.versionFont = this.registerFont("version", this.versionFontHeight + "px saxMono, monospace");
    this.generatingFontHeight = Math.floor(this.canvas.height * 0.04);
    this.generatingFont = this.registerFont("generating", this.generatingFontHeight + "px saxMono, monospace");
    this.views = {
      menu: new MenuView(this, this.canvas),
      sudoku: new SudokuView(this, this.canvas)
    };
    this.switchView("sudoku");
  }

  App.prototype.measureFonts = function() {
    var f, fontName, ref;
    ref = this.fonts;
    for (fontName in ref) {
      f = ref[fontName];
      this.ctx.font = f.style;
      this.ctx.fillStyle = "black";
      this.ctx.textAlign = "center";
      f.height = Math.floor(this.ctx.measureText("m").width * 1.1);
      console.log("Font " + fontName + " measured at " + f.height + " pixels");
    }
  };

  App.prototype.registerFont = function(name, style) {
    var font;
    font = {
      name: name,
      style: style,
      height: 0
    };
    this.fonts[name] = font;
    this.measureFonts();
    return font;
  };

  App.prototype.loadFont = function(fontName) {
    var font;
    font = new FontFaceObserver(fontName);
    return font.load().then((function(_this) {
      return function() {
        console.log(fontName + " loaded, redrawing...");
        _this.measureFonts();
        return _this.draw();
      };
    })(this));
  };

  App.prototype.switchView = function(view) {
    this.view = this.views[view];
    return this.draw();
  };

  App.prototype.newGame = function(difficulty) {
    this.views.sudoku.newGame(difficulty);
    return this.switchView("sudoku");
  };

  App.prototype.reset = function() {
    this.views.sudoku.reset();
    return this.switchView("sudoku");
  };

  App.prototype["import"] = function(importString) {
    return this.views.sudoku["import"](importString);
  };

  App.prototype["export"] = function() {
    return this.views.sudoku["export"]();
  };

  App.prototype.holeCount = function() {
    return this.views.sudoku.holeCount();
  };

  App.prototype.draw = function() {
    return this.view.draw();
  };

  App.prototype.click = function(x, y) {
    return this.view.click(x, y);
  };

  App.prototype.drawFill = function(x, y, w, h, color) {
    this.ctx.beginPath();
    this.ctx.rect(x, y, w, h);
    this.ctx.fillStyle = color;
    return this.ctx.fill();
  };

  App.prototype.drawRoundedRect = function(x, y, w, h, r, fillColor, strokeColor) {
    if (fillColor == null) {
      fillColor = null;
    }
    if (strokeColor == null) {
      strokeColor = null;
    }
    this.ctx.roundRect(x, y, w, h, r);
    if (fillColor !== null) {
      this.ctx.fillStyle = fillColor;
      this.ctx.fill();
    }
    if (strokeColor !== null) {
      this.ctx.strokeStyle = strokeColor;
      this.ctx.stroke();
    }
  };

  App.prototype.drawRect = function(x, y, w, h, color, lineWidth) {
    if (lineWidth == null) {
      lineWidth = 1;
    }
    this.ctx.beginPath();
    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = lineWidth;
    this.ctx.rect(x, y, w, h);
    return this.ctx.stroke();
  };

  App.prototype.drawLine = function(x1, y1, x2, y2, color, lineWidth) {
    if (color == null) {
      color = "black";
    }
    if (lineWidth == null) {
      lineWidth = 1;
    }
    this.ctx.beginPath();
    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = lineWidth;
    this.ctx.lineCap = "butt";
    this.ctx.moveTo(x1, y1);
    this.ctx.lineTo(x2, y2);
    return this.ctx.stroke();
  };

  App.prototype.drawTextCentered = function(text, cx, cy, font, color) {
    this.ctx.font = font.style;
    this.ctx.fillStyle = color;
    this.ctx.textAlign = "center";
    return this.ctx.fillText(text, cx, cy + (font.height / 2));
  };

  App.prototype.drawLowerLeft = function(text, color) {
    if (color == null) {
      color = "white";
    }
    this.ctx = this.canvas.getContext("2d");
    this.ctx.font = this.versionFont.style;
    this.ctx.fillStyle = color;
    this.ctx.textAlign = "left";
    return this.ctx.fillText(text, 0, this.canvas.height - (this.versionFont.height / 2));
  };

  App.prototype.drawVersion = function(color) {
    if (color == null) {
      color = "white";
    }
    this.ctx = this.canvas.getContext("2d");
    this.ctx.font = this.versionFont.style;
    this.ctx.fillStyle = color;
    this.ctx.textAlign = "right";
    return this.ctx.fillText("v" + version, this.canvas.width - (this.versionFont.height / 2), this.canvas.height - (this.versionFont.height / 2));
  };

  App.prototype.drawArc = function(x1, y1, x2, y2, radius, color, lineWidth) {
    var M, P1, P2, Q, dCM, dMP1, dMQ, uMP1, uMQ;
    P1 = {
      x: x1,
      y: y1
    };
    P2 = {
      x: x2,
      y: y2
    };
    M = {
      x: (P1.x + P2.x) / 2,
      y: (P1.y + P2.y) / 2
    };
    dMP1 = Math.sqrt((P1.x - M.x) * (P1.x - M.x) + (P1.y - M.y) * (P1.y - M.y));
    if ((radius == null) || radius < dMP1) {
      radius = dMP1;
    }
    uMP1 = {
      x: (P1.x - M.x) / dMP1,
      y: (P1.y - M.y) / dMP1
    };
    uMQ = {
      x: -uMP1.y,
      y: uMP1.x
    };
    dCM = Math.sqrt(radius * radius - dMP1 * dMP1);
    dMQ = dMP1 * dMP1 / dCM;
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
  };

  App.prototype.drawPoint = function(x, y, r, color) {
    this.ctx.beginPath();
    this.ctx.fillStyle = color;
    this.ctx.arc(x, y, r, 0, 2 * Math.PI);
    this.ctx.fill();
  };

  return App;

})();

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

MenuView = (function() {
  function MenuView(app, canvas) {
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
      "import": {
        y: buttonPos(5),
        text: "Load Puzzle",
        bgColor: "#336666",
        textColor: "#ffffff",
        click: this["import"].bind(this)
      },
      "export": {
        y: buttonPos(6),
        text: "Share Puzzle",
        bgColor: "#336666",
        textColor: "#ffffff",
        click: this["export"].bind(this)
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
    this.buttonFont = this.app.registerFont("button", buttonFontHeight + "px saxMono, monospace");
    titleFontHeight = Math.floor(this.canvas.height * 0.06);
    this.titleFont = this.app.registerFont("button", titleFontHeight + "px saxMono, monospace");
    subtitleFontHeight = Math.floor(this.canvas.height * 0.02);
    this.subtitleFont = this.app.registerFont("button", subtitleFontHeight + "px saxMono, monospace");
    return;
  }

  MenuView.prototype.draw = function() {
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
    this.app.drawLowerLeft((this.app.holeCount()) + "/81");
    return this.app.drawVersion();
  };

  MenuView.prototype.click = function(x, y) {
    var button, buttonName, ref;
    ref = this.buttons;
    for (buttonName in ref) {
      button = ref[buttonName];
      if ((y > button.y) && (y < (button.y + this.buttonHeight))) {
        button.click();
      }
    }
  };

  MenuView.prototype.newEasy = function() {
    return this.app.newGame(SudokuGenerator.difficulty.easy);
  };

  MenuView.prototype.newMedium = function() {
    return this.app.newGame(SudokuGenerator.difficulty.medium);
  };

  MenuView.prototype.newHard = function() {
    return this.app.newGame(SudokuGenerator.difficulty.hard);
  };

  MenuView.prototype.newExtreme = function() {
    return this.app.newGame(SudokuGenerator.difficulty.extreme);
  };

  MenuView.prototype.reset = function() {
    return this.app.reset();
  };

  MenuView.prototype.resume = function() {
    return this.app.switchView("sudoku");
  };

  MenuView.prototype["export"] = function() {
    if (navigator.share !== void 0) {
      navigator.share({
        title: "Sudoku Shared Game",
        text: this.app["export"]()
      });
      return;
    }
    return window.prompt("Copy this and paste to a friend:", this.app["export"]());
  };

  MenuView.prototype["import"] = function() {
    var importString;
    importString = window.prompt("Paste an exported game here:", "");
    while (true) {
      if (importString === null) {
        return;
      }
      if (this.app["import"](importString)) {
        this.app.switchView("sudoku");
        return;
      }
      importString = window.prompt("Invalid game, try again:", "");
    }
  };

  return MenuView;

})();

module.exports = MenuView;


},{"./SudokuGenerator":4}],3:[function(require,module,exports){
var SudokuGame, SudokuGenerator, ascendingLinkSort, cellIndex, generateLinkPermutations, uniqueLinkFilter;

SudokuGenerator = require('./SudokuGenerator');

cellIndex = function(x, y) {
  return y * 9 + x;
};

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
  for (i = l = 0, ref = count - 1; 0 <= ref ? l < ref : l > ref; i = 0 <= ref ? ++l : --l) {
    for (j = m = ref1 = i + 1, ref2 = count; ref1 <= ref2 ? m < ref2 : m > ref2; j = ref1 <= ref2 ? ++m : --m) {
      links.push({
        cells: [cells[i], cells[j]]
      });
    }
  }
  return links;
};

SudokuGame = (function() {
  function SudokuGame() {
    this.clear();
    if (!this.load()) {
      this.newGame(SudokuGenerator.difficulty.easy);
    }
    return;
  }

  SudokuGame.prototype.clear = function() {
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
  };

  SudokuGame.prototype.holeCount = function() {
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
  };

  SudokuGame.prototype["export"] = function() {
    var exportString, i, j, l, m;
    exportString = "SD";
    for (j = l = 0; l < 9; j = ++l) {
      for (i = m = 0; m < 9; i = ++m) {
        if (this.grid[i][j].locked) {
          exportString += "" + this.grid[i][j].value;
        } else {
          exportString += "0";
        }
      }
    }
    return exportString;
  };

  SudokuGame.prototype.validate = function() {
    var board, generator, i, j, l, m;
    board = new Array(9).fill(null);
    for (i = l = 0; l < 9; i = ++l) {
      board[i] = new Array(9).fill(0);
      for (j = m = 0; m < 9; j = ++m) {
        board[i][j] = this.grid[i][j].value;
      }
    }
    generator = new SudokuGenerator;
    return generator.validateGrid(board);
  };

  SudokuGame.prototype["import"] = function(importString) {
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
  };

  SudokuGame.prototype.updateCell = function(x, y) {
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
  };

  SudokuGame.prototype.updateCells = function() {
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
    return this.solved;
  };

  SudokuGame.prototype.done = function() {
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
  };

  SudokuGame.prototype.pencilString = function(x, y) {
    var cell, i, l, s;
    cell = this.grid[x][y];
    s = "";
    for (i = l = 0; l < 9; i = ++l) {
      if (cell.pencil[i]) {
        s += String(i + 1);
      }
    }
    return s;
  };

  SudokuGame.prototype["do"] = function(action, x, y, values, journal) {
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
  };

  SudokuGame.prototype.undo = function() {
    var step;
    if (this.undoJournal.length > 0) {
      step = this.undoJournal.pop();
      this["do"](step.action, step.x, step.y, step.values, this.redoJournal);
      return [step.x, step.y];
    }
  };

  SudokuGame.prototype.redo = function() {
    var step;
    if (this.redoJournal.length > 0) {
      step = this.redoJournal.pop();
      this["do"](step.action, step.x, step.y, step.values, this.undoJournal);
      return [step.x, step.y];
    }
  };

  SudokuGame.prototype.clearPencil = function(x, y) {
    var cell, flag, i;
    cell = this.grid[x][y];
    if (cell.locked) {
      return;
    }
    this["do"]("togglePencil", x, y, (function() {
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
  };

  SudokuGame.prototype.togglePencil = function(x, y, v) {
    if (this.grid[x][y].locked) {
      return;
    }
    this["do"]("togglePencil", x, y, [v], this.undoJournal);
    return this.redoJournal = [];
  };

  SudokuGame.prototype.setValue = function(x, y, v) {
    if (this.grid[x][y].locked) {
      return;
    }
    this["do"]("setValue", x, y, [v], this.undoJournal);
    return this.redoJournal = [];
  };

  SudokuGame.prototype.reset = function() {
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
  };

  SudokuGame.prototype.getLinks = function(value) {
    var boxX, boxY, l, len, len1, link, links, m, n, o, q, r, strong, weak, x, y;
    links = [];
    for (y = l = 0; l < 9; y = ++l) {
      links.push.apply(links, this.getRowLinks(y, value));
    }
    for (x = m = 0; m < 9; x = ++m) {
      links.push.apply(links, this.getColumnLinks(x, value));
    }
    for (boxX = n = 0; n < 3; boxX = ++n) {
      for (boxY = o = 0; o < 3; boxY = ++o) {
        links.push.apply(links, this.getBoxLinks(boxX, boxY, value));
      }
    }
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
    return {
      strong: strong,
      weak: weak
    };
  };

  SudokuGame.prototype.getRowLinks = function(y, value) {
    var cell, cells, l, links, x;
    cells = [];
    for (x = l = 0; l < 9; x = ++l) {
      cell = this.grid[x][y];
      if (cell.value === 0 && cell.pencil[value - 1]) {
        cells.push({
          x: x,
          y: y
        });
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
  };

  SudokuGame.prototype.getColumnLinks = function(x, value) {
    var cell, cells, l, links, y;
    cells = [];
    for (y = l = 0; l < 9; y = ++l) {
      cell = this.grid[x][y];
      if (cell.value === 0 && cell.pencil[value - 1]) {
        cells.push({
          x: x,
          y: y
        });
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
  };

  SudokuGame.prototype.getBoxLinks = function(boxX, boxY, value) {
    var cell, cells, l, links, m, ref, ref1, ref2, ref3, sx, sy, x, y;
    cells = [];
    sx = boxX * 3;
    sy = boxY * 3;
    for (y = l = ref = sy, ref1 = sy + 3; ref <= ref1 ? l < ref1 : l > ref1; y = ref <= ref1 ? ++l : --l) {
      for (x = m = ref2 = sx, ref3 = sx + 3; ref2 <= ref3 ? m < ref3 : m > ref3; x = ref2 <= ref3 ? ++m : --m) {
        cell = this.grid[x][y];
        if (cell.value === 0 && cell.pencil[value - 1]) {
          cells.push({
            x: x,
            y: y
          });
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
  };

  SudokuGame.prototype.newGame = function(difficulty) {
    var cell, generator, i, j, k, l, m, n, newGrid, o, q;
    console.log("newGame(" + difficulty + ")");
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
  };

  SudokuGame.prototype.load = function() {
    var dst, gameData, i, j, jsonString, k, l, m, n, src;
    if (!localStorage) {
      alert("No local storage, nothing will work");
      return false;
    }
    jsonString = localStorage.getItem("game");
    if (jsonString === null) {
      return false;
    }
    gameData = JSON.parse(jsonString);
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
  };

  SudokuGame.prototype.save = function() {
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
    console.log("Saved game (" + jsonString.length + " chars)");
    return true;
  };

  return SudokuGame;

})();

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

Board = (function() {
  function Board(otherBoard) {
    var i, j, l, m, n;
    if (otherBoard == null) {
      otherBoard = null;
    }
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

  Board.prototype.matches = function(otherBoard) {
    var i, j, l, m;
    for (j = l = 0; l < 9; j = ++l) {
      for (i = m = 0; m < 9; i = ++m) {
        if (this.grid[i][j] !== otherBoard.grid[i][j]) {
          return false;
        }
      }
    }
    return true;
  };

  Board.prototype.lock = function(x, y, v) {
    if (v == null) {
      v = true;
    }
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
  };

  return Board;

})();

SudokuGenerator = (function() {
  SudokuGenerator.difficulty = {
    easy: 1,
    medium: 2,
    hard: 3,
    extreme: 4
  };

  function SudokuGenerator() {}

  SudokuGenerator.prototype.boardToGrid = function(board) {
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
  };

  SudokuGenerator.prototype.gridToBoard = function(grid) {
    var board, l, m, x, y;
    board = new Board;
    for (y = l = 0; l < 9; y = ++l) {
      for (x = m = 0; m < 9; x = ++m) {
        if (grid[x][y] > 0) {
          board.grid[x][y] = grid[x][y];
          board.lock(x, y);
        }
      }
    }
    return board;
  };

  SudokuGenerator.prototype.cellValid = function(board, x, y, v) {
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
  };

  SudokuGenerator.prototype.pencilMarks = function(board, x, y) {
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
  };

  SudokuGenerator.prototype.nextAttempt = function(board, attempts) {
    var a, fewestIndex, fewestMarks, index, k, l, len, len1, m, marks, n, o, remainingIndexes, results, x, y;
    remainingIndexes = (function() {
      results = [];
      for (l = 0; l < 81; l++){ results.push(l); }
      return results;
    }).apply(this);
    for (index = m = 0; m < 81; index = ++m) {
      x = index % 9;
      y = Math.floor(index / 9);
      if (board.locked[x][y]) {
        k = remainingIndexes.indexOf(index);
        if (k >= 0) {
          remainingIndexes.splice(k, 1);
        }
      }
    }
    for (n = 0, len = attempts.length; n < len; n++) {
      a = attempts[n];
      k = remainingIndexes.indexOf(a.index);
      if (k >= 0) {
        remainingIndexes.splice(k, 1);
      }
    }
    if (remainingIndexes.length === 0) {
      return null;
    }
    fewestIndex = -1;
    fewestMarks = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    for (o = 0, len1 = remainingIndexes.length; o < len1; o++) {
      index = remainingIndexes[o];
      x = index % 9;
      y = Math.floor(index / 9);
      marks = this.pencilMarks(board, x, y);
      if (marks.length === 0) {
        return null;
      }
      if (marks.length === 1) {
        return {
          index: index,
          remaining: marks
        };
      }
      if (marks.length < fewestMarks.length) {
        fewestIndex = index;
        fewestMarks = marks;
      }
    }
    return {
      index: fewestIndex,
      remaining: fewestMarks
    };
  };

  SudokuGenerator.prototype.solve = function(board) {
    var attempts, solved;
    solved = new Board(board);
    attempts = [];
    return this.solveInternal(solved, attempts);
  };

  SudokuGenerator.prototype.hasUniqueSolution = function(board) {
    var attempts, solved, unlockedCount;
    solved = new Board(board);
    attempts = [];
    if (this.solveInternal(solved, attempts) === null) {
      return false;
    }
    unlockedCount = 81 - solved.lockedCount;
    if (unlockedCount === 0) {
      return true;
    }
    return this.solveInternal(solved, attempts, unlockedCount - 1) === null;
  };

  SudokuGenerator.prototype.solveInternal = function(solved, attempts, walkIndex) {
    var attempt, unlockedCount, x, y;
    if (walkIndex == null) {
      walkIndex = 0;
    }
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
  };

  SudokuGenerator.prototype.generateInternal = function(amountToRemove) {
    var board, i, indexesToRemove, j, l, m, n, nextBoard, removeIndex, removed, results, rx, ry;
    board = this.solve(new Board());
    for (j = l = 0; l < 9; j = ++l) {
      for (i = m = 0; m < 9; i = ++m) {
        board.lock(i, j);
      }
    }
    indexesToRemove = shuffle((function() {
      results = [];
      for (n = 0; n < 81; n++){ results.push(n); }
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
      board: board,
      removed: removed
    };
  };

  SudokuGenerator.prototype.generate = function(difficulty) {
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
          return 40;
      }
    })();
    best = null;
    for (attempt = l = 0; l < 2; attempt = ++l) {
      generated = this.generateInternal(amountToRemove);
      if (generated.removed === amountToRemove) {
        console.log("Removed exact amount " + amountToRemove + ", stopping");
        best = generated;
        break;
      }
      if (best === null) {
        best = generated;
      } else if (best.removed < generated.removed) {
        best = generated;
      }
      console.log("current best " + best.removed + " / " + amountToRemove);
    }
    console.log("giving user board: " + best.removed + " / " + amountToRemove);
    return this.boardToGrid(best.board);
  };

  SudokuGenerator.prototype.validateGrid = function(grid) {
    return this.hasUniqueSolution(this.gridToBoard(grid));
  };

  SudokuGenerator.prototype.solveString = function(importString) {
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
        answerString += solved.grid[j][i] + " ";
      }
      answerString += "\n";
    }
    return answerString;
  };

  return SudokuGenerator;

})();

module.exports = SudokuGenerator;


},{}],5:[function(require,module,exports){
var ActionType, CLEAR, Color, MENU_POS_X, MENU_POS_Y, MODE_CENTER_POS_X, MODE_END_POS_X, MODE_POS_Y, MODE_START_POS_X, ModeType, NONE, PENCIL_CLEAR_POS_X, PENCIL_CLEAR_POS_Y, PENCIL_POS_X, PENCIL_POS_Y, PEN_CLEAR_POS_X, PEN_CLEAR_POS_Y, PEN_POS_X, PEN_POS_Y, REDO_POS_X, REDO_POS_Y, SudokuGame, SudokuGenerator, SudokuView, UNDO_POS_X, UNDO_POS_Y;

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
  HIGHLIGHTING: 0,
  PENCIL: 1,
  PEN: 2,
  LINKS: 3
};

NONE = 0;

CLEAR = 10;

SudokuView = (function() {
  function SudokuView(app, canvas) {
    var fontPixelsL, fontPixelsM, fontPixelsS, heightBasedCellSize, widthBasedCellSize;
    this.app = app;
    this.canvas = canvas;
    console.log("canvas size " + this.canvas.width + "x" + this.canvas.height);
    widthBasedCellSize = this.canvas.width / 9;
    heightBasedCellSize = this.canvas.height / 14;
    console.log("widthBasedCellSize " + widthBasedCellSize + " heightBasedCellSize " + heightBasedCellSize);
    this.cellSize = Math.min(widthBasedCellSize, heightBasedCellSize);
    this.lineWidthThin = 1;
    this.lineWidthThick = Math.max(this.cellSize / 20, 3);
    this.linkDotRadius = this.lineWidthThick;
    fontPixelsS = Math.floor(this.cellSize * 0.3);
    fontPixelsM = Math.floor(this.cellSize * 0.5);
    fontPixelsL = Math.floor(this.cellSize * 0.8);
    this.fonts = {
      pencil: this.app.registerFont("pencil", fontPixelsS + "px saxMono, monospace"),
      menu: this.app.registerFont("menu", fontPixelsM + "px saxMono, monospace"),
      pen: this.app.registerFont("pen", fontPixelsL + "px saxMono, monospace")
    };
    this.initActions();
    this.game = new SudokuGame();
    this.resetState();
    this.draw();
  }

  SudokuView.prototype.initActions = function() {
    var i, index, j, k, l, m, n, o, p, q, ref, ref1;
    this.actions = new Array(9 * 15).fill(null);
    for (j = k = 0; k < 9; j = ++k) {
      for (i = l = 0; l < 9; i = ++l) {
        index = (j * 9) + i;
        this.actions[index] = {
          type: ActionType.SELECT,
          x: i,
          y: j
        };
      }
    }
    for (j = m = 0; m < 3; j = ++m) {
      for (i = n = 0; n < 3; i = ++n) {
        index = ((PEN_POS_Y + j) * 9) + (PEN_POS_X + i);
        this.actions[index] = {
          type: ActionType.PEN,
          value: 1 + (j * 3) + i
        };
      }
    }
    for (j = o = 0; o < 3; j = ++o) {
      for (i = p = 0; p < 3; i = ++p) {
        index = ((PENCIL_POS_Y + j) * 9) + (PENCIL_POS_X + i);
        this.actions[index] = {
          type: ActionType.PENCIL,
          value: 1 + (j * 3) + i
        };
      }
    }
    index = (PEN_CLEAR_POS_Y * 9) + PEN_CLEAR_POS_X;
    this.actions[index] = {
      type: ActionType.PEN,
      value: CLEAR
    };
    index = (PENCIL_CLEAR_POS_Y * 9) + PENCIL_CLEAR_POS_X;
    this.actions[index] = {
      type: ActionType.PENCIL,
      value: CLEAR
    };
    index = (MENU_POS_Y * 9) + MENU_POS_X;
    this.actions[index] = {
      type: ActionType.MENU
    };
    index = (UNDO_POS_Y * 9) + UNDO_POS_X;
    this.actions[index] = {
      type: ActionType.UNDO
    };
    index = (REDO_POS_Y * 9) + REDO_POS_X;
    this.actions[index] = {
      type: ActionType.REDO
    };
    for (i = q = ref = (MODE_POS_Y * 9) + MODE_START_POS_X, ref1 = (MODE_POS_Y * 9) + MODE_END_POS_X; ref <= ref1 ? q <= ref1 : q >= ref1; i = ref <= ref1 ? ++q : --q) {
      this.actions[i] = {
        type: ActionType.MODE
      };
    }
  };

  SudokuView.prototype.resetState = function() {
    this.mode = ModeType.HIGHLIGHTING;
    this.penValue = NONE;
    this.highlightX = -1;
    this.highlightY = -1;
    this.strongLinks = [];
    return this.weakLinks = [];
  };

  SudokuView.prototype.drawCell = function(x, y, backgroundColor, s, font, color) {
    var px, py;
    px = x * this.cellSize;
    py = y * this.cellSize;
    if (backgroundColor !== null) {
      this.app.drawFill(px, py, this.cellSize, this.cellSize, backgroundColor);
    }
    return this.app.drawTextCentered(s, px + (this.cellSize / 2), py + (this.cellSize / 2), font, color);
  };

  SudokuView.prototype.drawGrid = function(originX, originY, size, solved) {
    var color, i, k, lineWidth, ref;
    if (solved == null) {
      solved = false;
    }
    for (i = k = 0, ref = size; 0 <= ref ? k <= ref : k >= ref; i = 0 <= ref ? ++k : --k) {
      color = solved ? "green" : "black";
      lineWidth = this.lineWidthThin;
      if ((size === 1) || (i % 3) === 0) {
        lineWidth = this.lineWidthThick;
      }
      this.app.drawLine(this.cellSize * (originX + 0), this.cellSize * (originY + i), this.cellSize * (originX + size), this.cellSize * (originY + i), color, lineWidth);
      this.app.drawLine(this.cellSize * (originX + i), this.cellSize * (originY + 0), this.cellSize * (originX + i), this.cellSize * (originY + size), color, lineWidth);
    }
  };

  SudokuView.prototype.drawLink = function(startX, startY, endX, endY, color, lineWidth) {
    var r, x1, x2, y1, y2;
    x1 = (startX + 0.5) * this.cellSize;
    y1 = (startY + 0.5) * this.cellSize;
    x2 = (endX + 0.5) * this.cellSize;
    y2 = (endY + 0.5) * this.cellSize;
    r = 2.2 * Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
    this.app.drawArc(x1, y1, x2, y2, r, color, lineWidth);
    this.app.drawPoint(x1, y1, this.linkDotRadius, color);
    return this.app.drawPoint(x2, y2, this.linkDotRadius, color);
  };

  SudokuView.prototype.draw = function(flashX, flashY) {
    var backgroundColor, cell, currentValue, currentValueString, done, font, i, j, k, l, len, len1, link, m, modeColor, modeText, n, o, p, pencilBackgroundColor, pencilColor, ref, ref1, text, textColor, valueBackgroundColor, valueColor;
    console.log("draw()");
    this.app.drawFill(0, 0, this.canvas.width, this.canvas.height, "black");
    this.app.drawFill(0, 0, this.cellSize * 9, this.canvas.height, "white");
    for (j = k = 0; k < 9; j = ++k) {
      for (i = l = 0; l < 9; i = ++l) {
        if ((i !== flashX) || (j !== flashY)) {
          cell = this.game.grid[i][j];
          backgroundColor = null;
          font = this.fonts.pen;
          textColor = Color.value;
          text = "";
          if (cell.value === 0) {
            font = this.fonts.pencil;
            textColor = Color.pencil;
            text = this.game.pencilString(i, j);
          } else {
            if (cell.value > 0) {
              text = String(cell.value);
            }
          }
          if (cell.error) {
            textColor = Color.error;
          }
          if (cell.locked) {
            backgroundColor = Color.backgroundLocked;
          }
          if (this.mode === ModeType.HIGHLIGHTING) {
            if ((this.highlightX !== -1) && (this.highlightY !== -1)) {
              if ((i === this.highlightX) && (j === this.highlightY)) {
                if (cell.locked) {
                  backgroundColor = Color.backgroundLockedSelected;
                } else {
                  backgroundColor = Color.backgroundSelected;
                }
              } else if (this.conflicts(i, j, this.highlightX, this.highlightY)) {
                if (cell.locked) {
                  backgroundColor = Color.backgroundLockedConflicted;
                } else {
                  backgroundColor = Color.backgroundConflicted;
                }
              }
            }
          }
        } else {
          backgroundColor = "black";
          font = this.fonts.pen;
          textColor = "black";
          text = "";
        }
        this.drawCell(i, j, backgroundColor, text, font, textColor);
      }
    }
    if (this.mode === ModeType.LINKS) {
      ref = this.strongLinks;
      for (m = 0, len = ref.length; m < len; m++) {
        link = ref[m];
        this.drawLink(link[0].x, link[0].y, link[1].x, link[1].y, Color.links, this.lineWidthThick);
      }
      ref1 = this.weakLinks;
      for (n = 0, len1 = ref1.length; n < len1; n++) {
        link = ref1[n];
        this.drawLink(link[0].x, link[0].y, link[1].x, link[1].y, Color.links, this.lineWidthThin);
      }
    }
    done = this.game.done();
    for (j = o = 0; o < 3; j = ++o) {
      for (i = p = 0; p < 3; i = ++p) {
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
    switch (this.mode) {
      case ModeType.HIGHLIGHTING:
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
      this.drawCell(UNDO_POS_X, UNDO_POS_Y, null, "\u25c4", this.fonts.menu, Color.menu);
    }
    if (this.game.redoJournal.length > 0) {
      this.drawCell(REDO_POS_X, REDO_POS_Y, null, "\u25ba", this.fonts.menu, Color.menu);
    }
    this.drawGrid(0, 0, 9, this.game.solved);
    this.drawGrid(PEN_POS_X, PEN_POS_Y, 3);
    this.drawGrid(PENCIL_POS_X, PENCIL_POS_Y, 3);
    this.drawGrid(PEN_CLEAR_POS_X, PEN_CLEAR_POS_Y, 1);
    return this.drawGrid(PENCIL_CLEAR_POS_X, PENCIL_CLEAR_POS_Y, 1);
  };

  SudokuView.prototype.newGame = function(difficulty) {
    console.log("SudokuView.newGame(" + difficulty + ")");
    this.resetState();
    return this.game.newGame(difficulty);
  };

  SudokuView.prototype.reset = function() {
    this.resetState();
    return this.game.reset();
  };

  SudokuView.prototype["import"] = function(importString) {
    this.resetState();
    return this.game["import"](importString);
  };

  SudokuView.prototype["export"] = function() {
    return this.game["export"]();
  };

  SudokuView.prototype.holeCount = function() {
    return this.game.holeCount();
  };

  SudokuView.prototype.handleSelectAction = function(action) {
    switch (this.mode) {
      case ModeType.HIGHLIGHTING:
        if ((this.highlightX === action.x) && (this.highlightY === action.y)) {
          this.highlightX = -1;
          this.highlightY = -1;
        } else {
          this.highlightX = action.x;
          this.highlightY = action.y;
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
  };

  SudokuView.prototype.handlePencilAction = function(action) {
    var ref;
    if (this.mode === ModeType.LINKS) {
      if (action.value === CLEAR) {
        this.penValue = NONE;
        this.strongLinks = [];
        return this.weakLinks = [];
      } else {
        this.penValue = action.value;
        return ref = this.game.getLinks(action.value), this.strongLinks = ref.strong, this.weakLinks = ref.weak, ref;
      }
    } else if (this.mode === ModeType.PENCIL && (this.penValue === action.value)) {
      this.mode = ModeType.HIGHLIGHTING;
      return this.penValue = NONE;
    } else {
      this.mode = ModeType.PENCIL;
      this.penValue = action.value;
      this.highlightX = -1;
      this.highlightY = -1;
      this.strongLinks = [];
      return this.weakLinks = [];
    }
  };

  SudokuView.prototype.handlePenAction = function(action) {
    if (this.mode === ModeType.LINKS) {
      return;
    }
    if (this.mode === ModeType.PEN && (this.penValue === action.value)) {
      this.mode = ModeType.HIGHLIGHTING;
      this.penValue = NONE;
    } else {
      this.mode = ModeType.PEN;
      this.penValue = action.value;
    }
    this.highlightX = -1;
    this.highlightY = -1;
    this.strongLinks = [];
    return this.weakLinks = [];
  };

  SudokuView.prototype.handleUndoAction = function() {
    if (this.mode !== ModeType.LINKS) {
      return this.game.undo();
    }
  };

  SudokuView.prototype.handleRedoAction = function() {
    if (this.mode !== ModeType.LINKS) {
      return this.game.redo();
    }
  };

  SudokuView.prototype.handleModeAction = function() {
    switch (this.mode) {
      case ModeType.HIGHLIGHTING:
        this.mode = ModeType.LINKS;
        break;
      case ModeType.PENCIL:
        this.mode = ModeType.PEN;
        break;
      case ModeType.PEN:
        this.mode = ModeType.HIGHLIGHTING;
        break;
      case ModeType.LINKS:
        this.mode = ModeType.PENCIL;
    }
    this.highlightX = -1;
    this.highlightY = -1;
    this.penValue = NONE;
    this.strongLinks = [];
    return this.weakLinks = [];
  };

  SudokuView.prototype.click = function(x, y) {
    var action, flashX, flashY, index, ref, ref1, ref2;
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
            ref = this.handleSelectAction(action), flashX = ref[0], flashY = ref[1];
            break;
          case ActionType.PENCIL:
            this.handlePencilAction(action);
            break;
          case ActionType.PEN:
            this.handlePenAction(action);
            break;
          case ActionType.UNDO:
            ref1 = this.handleUndoAction(), flashX = ref1[0], flashY = ref1[1];
            break;
          case ActionType.REDO:
            ref2 = this.handleRedoAction(), flashX = ref2[0], flashY = ref2[1];
            break;
          case ActionType.MODE:
            this.handleModeAction();
        }
      } else {
        this.mode = ModeType.HIGHLIGHTING;
        this.highlightX = -1;
        this.highlightY = -1;
        this.penValue = NONE;
        this.strongLinks = [];
        this.weakLinks = [];
      }
      this.draw(flashX, flashY);
      if ((flashX != null) && (flashY != null)) {
        return setTimeout((function(_this) {
          return function() {
            return _this.draw();
          };
        })(this), 33);
      }
    }
  };

  SudokuView.prototype.conflicts = function(x1, y1, x2, y2) {
    var sx1, sx2, sy1, sy2;
    if ((x1 === x2) || (y1 === y2)) {
      return true;
    }
    sx1 = Math.floor(x1 / 3) * 3;
    sy1 = Math.floor(y1 / 3) * 3;
    sx2 = Math.floor(x2 / 3) * 3;
    sy2 = Math.floor(y2 / 3) * 3;
    if ((sx1 === sx2) && (sy1 === sy2)) {
      return true;
    }
    return false;
  };

  return SudokuView;

})();

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
  return canvas.addEventListener("mousedown", function(e) {
    var x, y;
    x = e.clientX - canvasRect.left;
    y = e.clientY - canvasRect.top;
    return window.app.click(x, y);
  });
};

window.addEventListener('load', function(e) {
  return init();
}, false);


},{"./App":1}],7:[function(require,module,exports){
module.exports = "0.0.11";


},{}],8:[function(require,module,exports){
/* Font Face Observer v2.0.13 - © Bram Stein. License: BSD-3-Clause */(function(){function l(a,b){document.addEventListener?a.addEventListener("scroll",b,!1):a.attachEvent("scroll",b)}function m(a){document.body?a():document.addEventListener?document.addEventListener("DOMContentLoaded",function c(){document.removeEventListener("DOMContentLoaded",c);a()}):document.attachEvent("onreadystatechange",function k(){if("interactive"==document.readyState||"complete"==document.readyState)document.detachEvent("onreadystatechange",k),a()})};function r(a){this.a=document.createElement("div");this.a.setAttribute("aria-hidden","true");this.a.appendChild(document.createTextNode(a));this.b=document.createElement("span");this.c=document.createElement("span");this.h=document.createElement("span");this.f=document.createElement("span");this.g=-1;this.b.style.cssText="max-width:none;display:inline-block;position:absolute;height:100%;width:100%;overflow:scroll;font-size:16px;";this.c.style.cssText="max-width:none;display:inline-block;position:absolute;height:100%;width:100%;overflow:scroll;font-size:16px;";
this.f.style.cssText="max-width:none;display:inline-block;position:absolute;height:100%;width:100%;overflow:scroll;font-size:16px;";this.h.style.cssText="display:inline-block;width:200%;height:200%;font-size:16px;max-width:none;";this.b.appendChild(this.h);this.c.appendChild(this.f);this.a.appendChild(this.b);this.a.appendChild(this.c)}
function t(a,b){a.a.style.cssText="max-width:none;min-width:20px;min-height:20px;display:inline-block;overflow:hidden;position:absolute;width:auto;margin:0;padding:0;top:-999px;white-space:nowrap;font-synthesis:none;font:"+b+";"}function y(a){var b=a.a.offsetWidth,c=b+100;a.f.style.width=c+"px";a.c.scrollLeft=c;a.b.scrollLeft=a.b.scrollWidth+100;return a.g!==b?(a.g=b,!0):!1}function z(a,b){function c(){var a=k;y(a)&&a.a.parentNode&&b(a.g)}var k=a;l(a.b,c);l(a.c,c);y(a)};function A(a,b){var c=b||{};this.family=a;this.style=c.style||"normal";this.weight=c.weight||"normal";this.stretch=c.stretch||"normal"}var B=null,C=null,E=null,F=null;function G(){if(null===C)if(J()&&/Apple/.test(window.navigator.vendor)){var a=/AppleWebKit\/([0-9]+)(?:\.([0-9]+))(?:\.([0-9]+))/.exec(window.navigator.userAgent);C=!!a&&603>parseInt(a[1],10)}else C=!1;return C}function J(){null===F&&(F=!!document.fonts);return F}
function K(){if(null===E){var a=document.createElement("div");try{a.style.font="condensed 100px sans-serif"}catch(b){}E=""!==a.style.font}return E}function L(a,b){return[a.style,a.weight,K()?a.stretch:"","100px",b].join(" ")}
A.prototype.load=function(a,b){var c=this,k=a||"BESbswy",q=0,D=b||3E3,H=(new Date).getTime();return new Promise(function(a,b){if(J()&&!G()){var M=new Promise(function(a,b){function e(){(new Date).getTime()-H>=D?b():document.fonts.load(L(c,'"'+c.family+'"'),k).then(function(c){1<=c.length?a():setTimeout(e,25)},function(){b()})}e()}),N=new Promise(function(a,c){q=setTimeout(c,D)});Promise.race([N,M]).then(function(){clearTimeout(q);a(c)},function(){b(c)})}else m(function(){function u(){var b;if(b=-1!=
f&&-1!=g||-1!=f&&-1!=h||-1!=g&&-1!=h)(b=f!=g&&f!=h&&g!=h)||(null===B&&(b=/AppleWebKit\/([0-9]+)(?:\.([0-9]+))/.exec(window.navigator.userAgent),B=!!b&&(536>parseInt(b[1],10)||536===parseInt(b[1],10)&&11>=parseInt(b[2],10))),b=B&&(f==v&&g==v&&h==v||f==w&&g==w&&h==w||f==x&&g==x&&h==x)),b=!b;b&&(d.parentNode&&d.parentNode.removeChild(d),clearTimeout(q),a(c))}function I(){if((new Date).getTime()-H>=D)d.parentNode&&d.parentNode.removeChild(d),b(c);else{var a=document.hidden;if(!0===a||void 0===a)f=e.a.offsetWidth,
g=n.a.offsetWidth,h=p.a.offsetWidth,u();q=setTimeout(I,50)}}var e=new r(k),n=new r(k),p=new r(k),f=-1,g=-1,h=-1,v=-1,w=-1,x=-1,d=document.createElement("div");d.dir="ltr";t(e,L(c,"sans-serif"));t(n,L(c,"serif"));t(p,L(c,"monospace"));d.appendChild(e.a);d.appendChild(n.a);d.appendChild(p.a);document.body.appendChild(d);v=e.a.offsetWidth;w=n.a.offsetWidth;x=p.a.offsetWidth;I();z(e,function(a){f=a;u()});t(e,L(c,'"'+c.family+'",sans-serif'));z(n,function(a){g=a;u()});t(n,L(c,'"'+c.family+'",serif'));
z(p,function(a){h=a;u()});t(p,L(c,'"'+c.family+'",monospace'))})})};"object"===typeof module?module.exports=A:(window.FontFaceObserver=A,window.FontFaceObserver.prototype.load=A.prototype.load);}());

},{}]},{},[6])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJnYW1lXFxzcmNcXEFwcC5jb2ZmZWUiLCJnYW1lXFxzcmNcXE1lbnVWaWV3LmNvZmZlZSIsImdhbWVcXHNyY1xcU3Vkb2t1R2FtZS5jb2ZmZWUiLCJnYW1lXFxzcmNcXFN1ZG9rdUdlbmVyYXRvci5jb2ZmZWUiLCJnYW1lXFxzcmNcXFN1ZG9rdVZpZXcuY29mZmVlIiwiZ2FtZVxcc3JjXFxtYWluLmNvZmZlZSIsImdhbWVcXHNyY1xcdmVyc2lvbi5jb2ZmZWUiLCJub2RlX21vZHVsZXMvZm9udGZhY2VvYnNlcnZlci9mb250ZmFjZW9ic2VydmVyLnN0YW5kYWxvbmUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQSxJQUFBOztBQUFBLGdCQUFBLEdBQW1CLE9BQUEsQ0FBUSxrQkFBUjs7QUFFbkIsUUFBQSxHQUFXLE9BQUEsQ0FBUSxZQUFSOztBQUNYLFVBQUEsR0FBYSxPQUFBLENBQVEsY0FBUjs7QUFDYixPQUFBLEdBQVUsT0FBQSxDQUFRLFdBQVI7O0FBRUo7RUFDUyxhQUFDLE1BQUQ7SUFBQyxJQUFDLENBQUEsU0FBRDtJQUNaLElBQUMsQ0FBQSxHQUFELEdBQU8sSUFBQyxDQUFBLE1BQU0sQ0FBQyxVQUFSLENBQW1CLElBQW5CO0lBQ1AsSUFBQyxDQUFBLFFBQUQsQ0FBVSxTQUFWO0lBQ0EsSUFBQyxDQUFBLEtBQUQsR0FBUztJQUVULElBQUMsQ0FBQSxpQkFBRCxHQUFxQixJQUFJLENBQUMsS0FBTCxDQUFXLElBQUMsQ0FBQSxNQUFNLENBQUMsTUFBUixHQUFpQixJQUE1QjtJQUNyQixJQUFDLENBQUEsV0FBRCxHQUFlLElBQUMsQ0FBQSxZQUFELENBQWMsU0FBZCxFQUE0QixJQUFDLENBQUEsaUJBQUYsR0FBb0IsdUJBQS9DO0lBRWYsSUFBQyxDQUFBLG9CQUFELEdBQXdCLElBQUksQ0FBQyxLQUFMLENBQVcsSUFBQyxDQUFBLE1BQU0sQ0FBQyxNQUFSLEdB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QztFQUN6QyxRQUFRLENBQUMsSUFBSSxDQUFDLFlBQWQsQ0FBMkIsTUFBM0IsRUFBbUMsUUFBUSxDQUFDLElBQUksQ0FBQyxVQUFXLENBQUEsQ0FBQSxDQUE1RDtFQUNBLFVBQUEsR0FBYSxNQUFNLENBQUMscUJBQVAsQ0FBQTtFQUViLE1BQU0sQ0FBQyxHQUFQLEdBQWEsSUFBSSxHQUFKLENBQVEsTUFBUjtTQVFiLE1BQU0sQ0FBQyxnQkFBUCxDQUF3QixXQUF4QixFQUFxQyxTQUFDLENBQUQ7QUFDbkMsUUFBQTtJQUFBLENBQUEsR0FBSSxDQUFDLENBQUMsT0FBRixHQUFZLFVBQVUsQ0FBQztJQUMzQixDQUFBLEdBQUksQ0FBQyxDQUFDLE9BQUYsR0FBWSxVQUFVLENBQUM7V0FDM0IsTUFBTSxDQUFDLEdBQUcsQ0FBQyxLQUFYLENBQWlCLENBQWpCLEVBQW9CLENBQXBCO0VBSG1DLENBQXJDO0FBaEJLOztBQXFCUCxNQUFNLENBQUMsZ0JBQVAsQ0FBd0IsTUFBeEIsRUFBZ0MsU0FBQyxDQUFEO1NBQzVCLElBQUEsQ0FBQTtBQUQ0QixDQUFoQyxFQUVFLEtBRkY7Ozs7QUN2QkEsTUFBTSxDQUFDLE9BQVAsR0FBaUI7Ozs7QUNBakI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIkZvbnRGYWNlT2JzZXJ2ZXIgPSByZXF1aXJlICdmb250ZmFjZW9ic2VydmVyJ1xyXG5cclxuTWVudVZpZXcgPSByZXF1aXJlICcuL01lbnVWaWV3J1xyXG5TdWRva3VWaWV3ID0gcmVxdWlyZSAnLi9TdWRva3VWaWV3J1xyXG52ZXJzaW9uID0gcmVxdWlyZSAnLi92ZXJzaW9uJ1xyXG5cclxuY2xhc3MgQXBwXHJcbiAgY29uc3RydWN0b3I6IChAY2FudmFzKSAtPlxyXG4gICAgQGN0eCA9IEBjYW52YXMuZ2V0Q29udGV4dChcIjJkXCIpXHJcbiAgICBAbG9hZEZvbnQoXCJzYXhNb25vXCIpXHJcbiAgICBAZm9udHMgPSB7fVxyXG5cclxuICAgIEB2ZXJzaW9uRm9udEhlaWdodCA9IE1hdGguZmxvb3IoQGNhbnZhcy5oZWlnaHQgKiAwLjAyKVxyXG4gICAgQHZlcnNpb25Gb250ID0gQHJlZ2lzdGVyRm9udChcInZlcnNpb25cIiwgXCIje0B2ZXJzaW9uRm9udEhlaWdodH1weCBzYXhNb25vLCBtb25vc3BhY2VcIilcclxuXHJcbiAgICBAZ2VuZXJhdGluZ0ZvbnRIZWlnaHQgPSBNYXRoLmZsb29yKEBjYW52YXMuaGVpZ2h0ICogMC4wNClcclxuICAgIEBnZW5lcmF0aW5nRm9udCA9IEByZWdpc3RlckZvbnQoXCJnZW5lcmF0aW5nXCIsIFwiI3tAZ2VuZXJhdGluZ0ZvbnRIZWlnaHR9cHggc2F4TW9ubywgbW9ub3NwYWNlXCIpXHJcblxyXG4gICAgQHZpZXdzID1cclxuICAgICAgbWVudTogbmV3IE1lbnVWaWV3KHRoaXMsIEBjYW52YXMpXHJcbiAgICAgIHN1ZG9rdTogbmV3IFN1ZG9rdVZpZXcodGhpcywgQGNhbnZhcylcclxuICAgIEBzd2l0Y2hWaWV3KFwic3Vkb2t1XCIpXHJcblxyXG4gIG1lYXN1cmVGb250czogLT5cclxuICAgIGZvciBmb250TmFtZSwgZiBvZiBAZm9udHNcclxuICAgICAgQGN0eC5mb250ID0gZi5zdHlsZVxyXG4gICAgICBAY3R4LmZpbGxTdHlsZSA9IFwiYmxhY2tcIlxyXG4gICAgICBAY3R4LnRleHRBbGlnbiA9IFwiY2VudGVyXCJcclxuICAgICAgZi5oZWlnaHQgPSBNYXRoLmZsb29yKEBjdHgubWVhc3VyZVRleHQoXCJtXCIpLndpZHRoICogMS4xKSAjIGJlc3QgaGFjayBldmVyXHJcbiAgICAgIGNvbnNvbGUubG9nIFwiRm9udCAje2ZvbnROYW1lfSBtZWFzdXJlZCBhdCAje2YuaGVpZ2h0fSBwaXhlbHNcIlxyXG4gICAgcmV0dXJuXHJcblxyXG4gIHJlZ2lzdGVyRm9udDogKG5hbWUsIHN0eWxlKSAtPlxyXG4gICAgZm9udCA9XHJcbiAgICAgIG5hbWU6IG5hbWVcclxuICAgICAgc3R5bGU6IHN0eWxlXHJcbiAgICAgIGhlaWdodDogMFxyXG4gICAgQGZvbnRzW25hbWVdID0gZm9udFxyXG4gICAgQG1lYXN1cmVGb250cygpXHJcbiAgICByZXR1cm4gZm9udFxyXG5cclxuICBsb2FkRm9udDogKGZvbnROYW1lKSAtPlxyXG4gICAgZm9udCA9IG5ldyBGb250RmFjZU9ic2VydmVyKGZvbnROYW1lKVxyXG4gICAgZm9udC5sb2FkKCkudGhlbiA9PlxyXG4gICAgICBjb25zb2xlLmxvZyhcIiN7Zm9udE5hbWV9IGxvYWRlZCwgcmVkcmF3aW5nLi4uXCIpXHJcbiAgICAgIEBtZWFzdXJlRm9udHMoKVxyXG4gICAgICBAZHJhdygpXHJcblxyXG4gIHN3aXRjaFZpZXc6ICh2aWV3KSAtPlxyXG4gICAgQHZpZXcgPSBAdmlld3Nbdmlld11cclxuICAgIEBkcmF3KClcclxuXHJcbiAgbmV3R2FtZTogKGRpZmZpY3VsdHkpIC0+XHJcbiAgICAjIGNvbnNvbGUubG9nIFwiYXBwLm5ld0dhbWUoI3tkaWZmaWN1bHR5fSlcIlxyXG5cclxuICAgICMgQGRyYXdGaWxsKDAsIDAsIEBjYW52YXMud2lkdGgsIEBjYW52YXMuaGVpZ2h0LCBcIiM0NDQ0NDRcIilcclxuICAgICMgQGRyYXdUZXh0Q2VudGVyZWQoXCJHZW5lcmF0aW5nLCBwbGVhc2Ugd2FpdC4uLlwiLCBAY2FudmFzLndpZHRoIC8gMiwgQGNhbnZhcy5oZWlnaHQgLyAyLCBAZ2VuZXJhdGluZ0ZvbnQsIFwiI2ZmZmZmZlwiKVxyXG5cclxuICAgICMgd2luZG93LnNldFRpbWVvdXQgPT5cclxuICAgIEB2aWV3cy5zdWRva3UubmV3R2FtZShkaWZmaWN1bHR5KVxyXG4gICAgQHN3aXRjaFZpZXcoXCJzdWRva3VcIilcclxuICAgICMgLCAwXHJcblxyXG4gIHJlc2V0OiAtPlxyXG4gICAgQHZpZXdzLnN1ZG9rdS5yZXNldCgpXHJcbiAgICBAc3dpdGNoVmlldyhcInN1ZG9rdVwiKVxyXG5cclxuICBpbXBvcnQ6IChpbXBvcnRTdHJpbmcpIC0+XHJcbiAgICByZXR1cm4gQHZpZXdzLnN1ZG9rdS5pbXBvcnQoaW1wb3J0U3RyaW5nKVxyXG5cclxuICBleHBvcnQ6IC0+XHJcbiAgICByZXR1cm4gQHZpZXdzLnN1ZG9rdS5leHBvcnQoKVxyXG5cclxuICBob2xlQ291bnQ6IC0+XHJcbiAgICByZXR1cm4gQHZpZXdzLnN1ZG9rdS5ob2xlQ291bnQoKVxyXG5cclxuICBkcmF3OiAtPlxyXG4gICAgQHZpZXcuZHJhdygpXHJcblxyXG4gIGNsaWNrOiAoeCwgeSkgLT5cclxuICAgIEB2aWV3LmNsaWNrKHgsIHkpXHJcblxyXG4gIGRyYXdGaWxsOiAoeCwgeSwgdywgaCwgY29sb3IpIC0+XHJcbiAgICBAY3R4LmJlZ2luUGF0aCgpXHJcbiAgICBAY3R4LnJlY3QoeCwgeSwgdywgaClcclxuICAgIEBjdHguZmlsbFN0eWxlID0gY29sb3JcclxuICAgIEBjdHguZmlsbCgpXHJcblxyXG4gIGRyYXdSb3VuZGVkUmVjdDogKHgsIHksIHcsIGgsIHIsIGZpbGxDb2xvciA9IG51bGwsIHN0cm9rZUNvbG9yID0gbnVsbCkgLT5cclxuICAgIEBjdHgucm91bmRSZWN0KHgsIHksIHcsIGgsIHIpXHJcbiAgICBpZiBmaWxsQ29sb3IgIT0gbnVsbFxyXG4gICAgICBAY3R4LmZpbGxTdHlsZSA9IGZpbGxDb2xvclxyXG4gICAgICBAY3R4LmZpbGwoKVxyXG4gICAgaWYgc3Ryb2tlQ29sb3IgIT0gbnVsbFxyXG4gICAgICBAY3R4LnN0cm9rZVN0eWxlID0gc3Ryb2tlQ29sb3JcclxuICAgICAgQGN0eC5zdHJva2UoKVxyXG4gICAgcmV0dXJuXHJcblxyXG4gIGRyYXdSZWN0OiAoeCwgeSwgdywgaCwgY29sb3IsIGxpbmVXaWR0aCA9IDEpIC0+XHJcbiAgICBAY3R4LmJlZ2luUGF0aCgpXHJcbiAgICBAY3R4LnN0cm9rZVN0eWxlID0gY29sb3JcclxuICAgIEBjdHgubGluZVdpZHRoID0gbGluZVdpZHRoXHJcbiAgICBAY3R4LnJlY3QoeCwgeSwgdywgaClcclxuICAgIEBjdHguc3Ryb2tlKClcclxuXHJcbiAgZHJhd0xpbmU6ICh4MSwgeTEsIHgyLCB5MiwgY29sb3IgPSBcImJsYWNrXCIsIGxpbmVXaWR0aCA9IDEpIC0+XHJcbiAgICBAY3R4LmJlZ2luUGF0aCgpXHJcbiAgICBAY3R4LnN0cm9rZVN0eWxlID0gY29sb3JcclxuICAgIEBjdHgubGluZVdpZHRoID0gbGluZVdpZHRoXHJcbiAgICBAY3R4LmxpbmVDYXAgPSBcImJ1dHRcIlxyXG4gICAgQGN0eC5tb3ZlVG8oeDEsIHkxKVxyXG4gICAgQGN0eC5saW5lVG8oeDIsIHkyKVxyXG4gICAgQGN0eC5zdHJva2UoKVxyXG5cclxuICBkcmF3VGV4dENlbnRlcmVkOiAodGV4dCwgY3gsIGN5LCBmb250LCBjb2xvcikgLT5cclxuICAgIEBjdHguZm9udCA9IGZvbnQuc3R5bGVcclxuICAgIEBjdHguZmlsbFN0eWxlID0gY29sb3JcclxuICAgIEBjdHgudGV4dEFsaWduID0gXCJjZW50ZXJcIlxyXG4gICAgQGN0eC5maWxsVGV4dCh0ZXh0LCBjeCwgY3kgKyAoZm9udC5oZWlnaHQgLyAyKSlcclxuXHJcbiAgZHJhd0xvd2VyTGVmdDogKHRleHQsIGNvbG9yID0gXCJ3aGl0ZVwiKSAtPlxyXG4gICAgQGN0eCA9IEBjYW52YXMuZ2V0Q29udGV4dChcIjJkXCIpXHJcbiAgICBAY3R4LmZvbnQgPSBAdmVyc2lvbkZvbnQuc3R5bGVcclxuICAgIEBjdHguZmlsbFN0eWxlID0gY29sb3JcclxuICAgIEBjdHgudGV4dEFsaWduID0gXCJsZWZ0XCJcclxuICAgIEBjdHguZmlsbFRleHQodGV4dCwgMCwgQGNhbnZhcy5oZWlnaHQgLSAoQHZlcnNpb25Gb250LmhlaWdodCAvIDIpKVxyXG5cclxuICBkcmF3VmVyc2lvbjogKGNvbG9yID0gXCJ3aGl0ZVwiKSAtPlxyXG4gICAgQGN0eCA9IEBjYW52YXMuZ2V0Q29udGV4dChcIjJkXCIpXHJcbiAgICBAY3R4LmZvbnQgPSBAdmVyc2lvbkZvbnQuc3R5bGVcclxuICAgIEBjdHguZmlsbFN0eWxlID0gY29sb3JcclxuICAgIEBjdHgudGV4dEFsaWduID0gXCJyaWdodFwiXHJcbiAgICBAY3R4LmZpbGxUZXh0KFwidiN7dmVyc2lvbn1cIiwgQGNhbnZhcy53aWR0aCAtIChAdmVyc2lvbkZvbnQuaGVpZ2h0IC8gMiksIEBjYW52YXMuaGVpZ2h0IC0gKEB2ZXJzaW9uRm9udC5oZWlnaHQgLyAyKSlcclxuXHJcbiAgZHJhd0FyYzogKHgxLCB5MSwgeDIsIHkyLCByYWRpdXMsIGNvbG9yLCBsaW5lV2lkdGgpIC0+XHJcbiAgICAjIERlcml2ZWQgZnJvbSBodHRwczovL2dpdGh1Yi5jb20vamFtYm9sby9kcmF3QXJjIGF0IDZjM2UwZDNcclxuXHJcbiAgICBQMSA9IHsgeDogeDEsIHk6IHkxIH1cclxuICAgIFAyID0geyB4OiB4MiwgeTogeTIgfVxyXG5cclxuICAgICMgRGV0ZXJtaW5lIHRoZSBtaWRwb2ludCAoTSkgZnJvbSBQMSB0byBQMlxyXG4gICAgTSA9XHJcbiAgICAgIHg6IChQMS54ICsgUDIueCkgLyAyXHJcbiAgICAgIHk6IChQMS55ICsgUDIueSkgLyAyXHJcblxyXG4gICAgIyBEZXRlcm1pbmUgdGhlIGRpc3RhbmNlIGZyb20gTSB0byBQMVxyXG4gICAgZE1QMSA9IE1hdGguc3FydCgoUDEueCAtIE0ueCkqKFAxLnggLSBNLngpICsgKFAxLnkgLSBNLnkpKihQMS55IC0gTS55KSlcclxuXHJcbiAgICAjIFZhbGlkYXRlIHRoZSByYWRpdXNcclxuICAgIGlmIG5vdCByYWRpdXM/IG9yIHJhZGl1cyA8IGRNUDFcclxuICAgICAgcmFkaXVzID0gZE1QMVxyXG5cclxuICAgICMgRGV0ZXJtaW5lIHRoZSB1bml0IHZlY3RvciBmcm9tIE0gdG8gUDFcclxuICAgIHVNUDEgPVxyXG4gICAgICB4OiAoUDEueCAtIE0ueCkgLyBkTVAxXHJcbiAgICAgIHk6IChQMS55IC0gTS55KSAvIGRNUDFcclxuXHJcbiAgICAjIERldGVybWluZSB0aGUgdW5pdCB2ZWN0b3IgZnJvbSBNIHRvIFEgKGp1c3QgdU1QMSByb3RhdGVkIHBpLzIpXHJcbiAgICB1TVEgPSB7IHg6IC11TVAxLnksIHk6IHVNUDEueCB9XHJcblxyXG4gICAgIyBEZXRlcm1pbmUgdGhlIGRpc3RhbmNlIGZyb20gdGhlIGNlbnRlciBvZiB0aGUgY2lyY2xlIChDKSB0byBNXHJcbiAgICBkQ00gPSBNYXRoLnNxcnQocmFkaXVzKnJhZGl1cyAtIGRNUDEqZE1QMSlcclxuXHJcbiAgICAjIERldGVybWluZSB0aGUgZGlzdGFuY2UgZnJvbSBNIHRvIFFcclxuICAgIGRNUSA9IGRNUDEgKiBkTVAxIC8gZENNXHJcblxyXG4gICAgIyBEZXRlcm1pbmUgdGhlIGxvY2F0aW9uIG9mIFFcclxuICAgIFEgPVxyXG4gICAgICB4OiBNLnggKyB1TVEueCAqIGRNUVxyXG4gICAgICB5OiBNLnkgKyB1TVEueSAqIGRNUVxyXG5cclxuICAgIEBjdHguYmVnaW5QYXRoKClcclxuICAgIEBjdHguc3Ryb2tlU3R5bGUgPSBjb2xvclxyXG4gICAgQGN0eC5saW5lV2lkdGggPSBsaW5lV2lkdGhcclxuICAgIEBjdHgubGluZUNhcCA9IFwicm91bmRcIlxyXG4gICAgQGN0eC5tb3ZlVG8oeDEsIHkxKVxyXG4gICAgQGN0eC5hcmNUbyhRLngsIFEueSwgeDIsIHkyLCByYWRpdXMpXHJcbiAgICBAY3R4LnN0cm9rZSgpXHJcbiAgICByZXR1cm5cclxuXHJcbiAgZHJhd1BvaW50OiAoeCwgeSwgciwgY29sb3IpIC0+XHJcbiAgICBAY3R4LmJlZ2luUGF0aCgpXHJcbiAgICBAY3R4LmZpbGxTdHlsZSA9IGNvbG9yXHJcbiAgICBAY3R4LmFyYyh4LCB5LCByLCAwLCAyKk1hdGguUEkpXHJcbiAgICBAY3R4LmZpbGwoKVxyXG4gICAgcmV0dXJuXHJcblxyXG5DYW52YXNSZW5kZXJpbmdDb250ZXh0MkQucHJvdG90eXBlLnJvdW5kUmVjdCA9ICh4LCB5LCB3LCBoLCByKSAtPlxyXG4gIGlmICh3IDwgMiAqIHIpIHRoZW4gciA9IHcgLyAyXHJcbiAgaWYgKGggPCAyICogcikgdGhlbiByID0gaCAvIDJcclxuICBAYmVnaW5QYXRoKClcclxuICBAbW92ZVRvKHgrciwgeSlcclxuICBAYXJjVG8oeCt3LCB5LCAgIHgrdywgeStoLCByKVxyXG4gIEBhcmNUbyh4K3csIHkraCwgeCwgICB5K2gsIHIpXHJcbiAgQGFyY1RvKHgsICAgeStoLCB4LCAgIHksICAgcilcclxuICBAYXJjVG8oeCwgICB5LCAgIHgrdywgeSwgICByKVxyXG4gIEBjbG9zZVBhdGgoKVxyXG4gIHJldHVybiB0aGlzXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEFwcFxyXG4iLCJTdWRva3VHZW5lcmF0b3IgPSByZXF1aXJlICcuL1N1ZG9rdUdlbmVyYXRvcidcclxuXHJcbkJVVFRPTl9IRUlHSFQgPSAwLjA2XHJcbkZJUlNUX0JVVFRPTl9ZID0gMC4yMlxyXG5CVVRUT05fU1BBQ0lORyA9IDAuMDhcclxuQlVUVE9OX1NFUEFSQVRPUiA9IDAuMDNcclxuXHJcbmJ1dHRvblBvcyA9IChpbmRleCkgLT5cclxuICB5ID0gRklSU1RfQlVUVE9OX1kgKyAoQlVUVE9OX1NQQUNJTkcgKiBpbmRleClcclxuICBpZiBpbmRleCA+IDNcclxuICAgIHkgKz0gQlVUVE9OX1NFUEFSQVRPUlxyXG4gIGlmIGluZGV4ID4gNFxyXG4gICAgeSArPSBCVVRUT05fU0VQQVJBVE9SXHJcbiAgaWYgaW5kZXggPiA2XHJcbiAgICB5ICs9IEJVVFRPTl9TRVBBUkFUT1JcclxuICByZXR1cm4geVxyXG5cclxuY2xhc3MgTWVudVZpZXdcclxuICBjb25zdHJ1Y3RvcjogKEBhcHAsIEBjYW52YXMpIC0+XHJcbiAgICBAYnV0dG9ucyA9XHJcbiAgICAgIG5ld0Vhc3k6XHJcbiAgICAgICAgeTogYnV0dG9uUG9zKDApXHJcbiAgICAgICAgdGV4dDogXCJOZXcgR2FtZTogRWFzeVwiXHJcbiAgICAgICAgYmdDb2xvcjogXCIjMzM3NzMzXCJcclxuICAgICAgICB0ZXh0Q29sb3I6IFwiI2ZmZmZmZlwiXHJcbiAgICAgICAgY2xpY2s6IEBuZXdFYXN5LmJpbmQodGhpcylcclxuICAgICAgbmV3TWVkaXVtOlxyXG4gICAgICAgIHk6IGJ1dHRvblBvcygxKVxyXG4gICAgICAgIHRleHQ6IFwiTmV3IEdhbWU6IE1lZGl1bVwiXHJcbiAgICAgICAgYmdDb2xvcjogXCIjNzc3NzMzXCJcclxuICAgICAgICB0ZXh0Q29sb3I6IFwiI2ZmZmZmZlwiXHJcbiAgICAgICAgY2xpY2s6IEBuZXdNZWRpdW0uYmluZCh0aGlzKVxyXG4gICAgICBuZXdIYXJkOlxyXG4gICAgICAgIHk6IGJ1dHRvblBvcygyKVxyXG4gICAgICAgIHRleHQ6IFwiTmV3IEdhbWU6IEhhcmRcIlxyXG4gICAgICAgIGJnQ29sb3I6IFwiIzc3MzMzM1wiXHJcbiAgICAgICAgdGV4dENvbG9yOiBcIiNmZmZmZmZcIlxyXG4gICAgICAgIGNsaWNrOiBAbmV3SGFyZC5iaW5kKHRoaXMpXHJcbiAgICAgIG5ld0V4dHJlbWU6XHJcbiAgICAgICAgeTogYnV0dG9uUG9zKDMpXHJcbiAgICAgICAgdGV4dDogXCJOZXcgR2FtZTogRXh0cmVtZVwiXHJcbiAgICAgICAgYmdDb2xvcjogXCIjNzcxMTExXCJcclxuICAgICAgICB0ZXh0Q29sb3I6IFwiI2ZmZmZmZlwiXHJcbiAgICAgICAgY2xpY2s6IEBuZXdFeHRyZW1lLmJpbmQodGhpcylcclxuICAgICAgcmVzZXQ6XHJcbiAgICAgICAgeTogYnV0dG9uUG9zKDQpXHJcbiAgICAgICAgdGV4dDogXCJSZXNldCBQdXp6bGVcIlxyXG4gICAgICAgIGJnQ29sb3I6IFwiIzc3MzM3N1wiXHJcbiAgICAgICAgdGV4dENvbG9yOiBcIiNmZmZmZmZcIlxyXG4gICAgICAgIGNsaWNrOiBAcmVzZXQuYmluZCh0aGlzKVxyXG4gICAgICBpbXBvcnQ6XHJcbiAgICAgICAgeTogYnV0dG9uUG9zKDUpXHJcbiAgICAgICAgdGV4dDogXCJMb2FkIFB1enpsZVwiXHJcbiAgICAgICAgYmdDb2xvcjogXCIjMzM2NjY2XCJcclxuICAgICAgICB0ZXh0Q29sb3I6IFwiI2ZmZmZmZlwiXHJcbiAgICAgICAgY2xpY2s6IEBpbXBvcnQuYmluZCh0aGlzKVxyXG4gICAgICBleHBvcnQ6XHJcbiAgICAgICAgeTogYnV0dG9uUG9zKDYpXHJcbiAgICAgICAgdGV4dDogXCJTaGFyZSBQdXp6bGVcIlxyXG4gICAgICAgIGJnQ29sb3I6IFwiIzMzNjY2NlwiXHJcbiAgICAgICAgdGV4dENvbG9yOiBcIiNmZmZmZmZcIlxyXG4gICAgICAgIGNsaWNrOiBAZXhwb3J0LmJpbmQodGhpcylcclxuICAgICAgcmVzdW1lOlxyXG4gICAgICAgIHk6IGJ1dHRvblBvcyg3KVxyXG4gICAgICAgIHRleHQ6IFwiUmVzdW1lXCJcclxuICAgICAgICBiZ0NvbG9yOiBcIiM3Nzc3NzdcIlxyXG4gICAgICAgIHRleHRDb2xvcjogXCIjZmZmZmZmXCJcclxuICAgICAgICBjbGljazogQHJlc3VtZS5iaW5kKHRoaXMpXHJcblxyXG4gICAgYnV0dG9uV2lkdGggPSBAY2FudmFzLndpZHRoICogMC44XHJcbiAgICBAYnV0dG9uSGVpZ2h0ID0gQGNhbnZhcy5oZWlnaHQgKiBCVVRUT05fSEVJR0hUXHJcbiAgICBidXR0b25YID0gKEBjYW52YXMud2lkdGggLSBidXR0b25XaWR0aCkgLyAyXHJcbiAgICBmb3IgYnV0dG9uTmFtZSwgYnV0dG9uIG9mIEBidXR0b25zXHJcbiAgICAgIGJ1dHRvbi54ID0gYnV0dG9uWFxyXG4gICAgICBidXR0b24ueSA9IEBjYW52YXMuaGVpZ2h0ICogYnV0dG9uLnlcclxuICAgICAgYnV0dG9uLncgPSBidXR0b25XaWR0aFxyXG4gICAgICBidXR0b24uaCA9IEBidXR0b25IZWlnaHRcclxuXHJcbiAgICBidXR0b25Gb250SGVpZ2h0ID0gTWF0aC5mbG9vcihAYnV0dG9uSGVpZ2h0ICogMC40KVxyXG4gICAgQGJ1dHRvbkZvbnQgPSBAYXBwLnJlZ2lzdGVyRm9udChcImJ1dHRvblwiLCBcIiN7YnV0dG9uRm9udEhlaWdodH1weCBzYXhNb25vLCBtb25vc3BhY2VcIilcclxuICAgIHRpdGxlRm9udEhlaWdodCA9IE1hdGguZmxvb3IoQGNhbnZhcy5oZWlnaHQgKiAwLjA2KVxyXG4gICAgQHRpdGxlRm9udCA9IEBhcHAucmVnaXN0ZXJGb250KFwiYnV0dG9uXCIsIFwiI3t0aXRsZUZvbnRIZWlnaHR9cHggc2F4TW9ubywgbW9ub3NwYWNlXCIpXHJcbiAgICBzdWJ0aXRsZUZvbnRIZWlnaHQgPSBNYXRoLmZsb29yKEBjYW52YXMuaGVpZ2h0ICogMC4wMilcclxuICAgIEBzdWJ0aXRsZUZvbnQgPSBAYXBwLnJlZ2lzdGVyRm9udChcImJ1dHRvblwiLCBcIiN7c3VidGl0bGVGb250SGVpZ2h0fXB4IHNheE1vbm8sIG1vbm9zcGFjZVwiKVxyXG4gICAgcmV0dXJuXHJcblxyXG4gIGRyYXc6IC0+XHJcbiAgICBAYXBwLmRyYXdGaWxsKDAsIDAsIEBjYW52YXMud2lkdGgsIEBjYW52YXMuaGVpZ2h0LCBcIiMzMzMzMzNcIilcclxuXHJcbiAgICB4ID0gQGNhbnZhcy53aWR0aCAvIDJcclxuICAgIHNoYWRvd09mZnNldCA9IEBjYW52YXMuaGVpZ2h0ICogMC4wMDVcclxuXHJcbiAgICB5MSA9IEBjYW52YXMuaGVpZ2h0ICogMC4wNVxyXG4gICAgeTIgPSB5MSArIEBjYW52YXMuaGVpZ2h0ICogMC4wNlxyXG4gICAgeTMgPSB5MiArIEBjYW52YXMuaGVpZ2h0ICogMC4wNlxyXG4gICAgQGFwcC5kcmF3VGV4dENlbnRlcmVkKFwiQmFkIEd1eVwiLCB4ICsgc2hhZG93T2Zmc2V0LCB5MSArIHNoYWRvd09mZnNldCwgQHRpdGxlRm9udCwgXCIjMDAwMDAwXCIpXHJcbiAgICBAYXBwLmRyYXdUZXh0Q2VudGVyZWQoXCJTdWRva3VcIiwgeCArIHNoYWRvd09mZnNldCwgeTIgKyBzaGFkb3dPZmZzZXQsIEB0aXRsZUZvbnQsIFwiIzAwMDAwMFwiKVxyXG4gICAgQGFwcC5kcmF3VGV4dENlbnRlcmVkKFwiQmFkIEd1eVwiLCB4LCB5MSwgQHRpdGxlRm9udCwgXCIjZmZmZmZmXCIpXHJcbiAgICBAYXBwLmRyYXdUZXh0Q2VudGVyZWQoXCJTdWRva3VcIiwgeCwgeTIsIEB0aXRsZUZvbnQsIFwiI2ZmZmZmZlwiKVxyXG4gICAgQGFwcC5kcmF3VGV4dENlbnRlcmVkKFwiSXQncyBsaWtlIFN1ZG9rdSwgYnV0IHlvdSBhcmUgdGhlIGJhZCBndXkuXCIsIHgsIHkzLCBAc3VidGl0bGVGb250LCBcIiNmZmZmZmZcIilcclxuXHJcbiAgICBmb3IgYnV0dG9uTmFtZSwgYnV0dG9uIG9mIEBidXR0b25zXHJcbiAgICAgIEBhcHAuZHJhd1JvdW5kZWRSZWN0KGJ1dHRvbi54ICsgc2hhZG93T2Zmc2V0LCBidXR0b24ueSArIHNoYWRvd09mZnNldCwgYnV0dG9uLncsIGJ1dHRvbi5oLCBidXR0b24uaCAqIDAuMywgXCJibGFja1wiLCBcImJsYWNrXCIpXHJcbiAgICAgIEBhcHAuZHJhd1JvdW5kZWRSZWN0KGJ1dHRvbi54LCBidXR0b24ueSwgYnV0dG9uLncsIGJ1dHRvbi5oLCBidXR0b24uaCAqIDAuMywgYnV0dG9uLmJnQ29sb3IsIFwiIzk5OTk5OVwiKVxyXG4gICAgICBAYXBwLmRyYXdUZXh0Q2VudGVyZWQoYnV0dG9uLnRleHQsIGJ1dHRvbi54ICsgKGJ1dHRvbi53IC8gMiksIGJ1dHRvbi55ICsgKGJ1dHRvbi5oIC8gMiksIEBidXR0b25Gb250LCBidXR0b24udGV4dENvbG9yKVxyXG5cclxuICAgIEBhcHAuZHJhd0xvd2VyTGVmdChcIiN7QGFwcC5ob2xlQ291bnQoKX0vODFcIilcclxuICAgIEBhcHAuZHJhd1ZlcnNpb24oKVxyXG5cclxuICBjbGljazogKHgsIHkpIC0+XHJcbiAgICBmb3IgYnV0dG9uTmFtZSwgYnV0dG9uIG9mIEBidXR0b25zXHJcbiAgICAgIGlmICh5ID4gYnV0dG9uLnkpICYmICh5IDwgKGJ1dHRvbi55ICsgQGJ1dHRvbkhlaWdodCkpXHJcbiAgICAgICAgIyBjb25zb2xlLmxvZyBcImJ1dHRvbiBwcmVzc2VkOiAje2J1dHRvbk5hbWV9XCJcclxuICAgICAgICBidXR0b24uY2xpY2soKVxyXG4gICAgcmV0dXJuXHJcblxyXG4gIG5ld0Vhc3k6IC0+XHJcbiAgICBAYXBwLm5ld0dhbWUoU3Vkb2t1R2VuZXJhdG9yLmRpZmZpY3VsdHkuZWFzeSlcclxuXHJcbiAgbmV3TWVkaXVtOiAtPlxyXG4gICAgQGFwcC5uZXdHYW1lKFN1ZG9rdUdlbmVyYXRvci5kaWZmaWN1bHR5Lm1lZGl1bSlcclxuXHJcbiAgbmV3SGFyZDogLT5cclxuICAgIEBhcHAubmV3R2FtZShTdWRva3VHZW5lcmF0b3IuZGlmZmljdWx0eS5oYXJkKVxyXG5cclxuICBuZXdFeHRyZW1lOiAtPlxyXG4gICAgQGFwcC5uZXdHYW1lKFN1ZG9rdUdlbmVyYXRvci5kaWZmaWN1bHR5LmV4dHJlbWUpXHJcblxyXG4gIHJlc2V0OiAtPlxyXG4gICAgQGFwcC5yZXNldCgpXHJcblxyXG4gIHJlc3VtZTogLT5cclxuICAgIEBhcHAuc3dpdGNoVmlldyhcInN1ZG9rdVwiKVxyXG5cclxuICBleHBvcnQ6IC0+XHJcbiAgICBpZiBuYXZpZ2F0b3Iuc2hhcmUgIT0gdW5kZWZpbmVkXHJcbiAgICAgIG5hdmlnYXRvci5zaGFyZSB7XHJcbiAgICAgICAgdGl0bGU6IFwiU3Vkb2t1IFNoYXJlZCBHYW1lXCJcclxuICAgICAgICB0ZXh0OiBAYXBwLmV4cG9ydCgpXHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuXHJcbiAgICB3aW5kb3cucHJvbXB0KFwiQ29weSB0aGlzIGFuZCBwYXN0ZSB0byBhIGZyaWVuZDpcIiwgQGFwcC5leHBvcnQoKSlcclxuXHJcbiAgaW1wb3J0OiAtPlxyXG4gICAgaW1wb3J0U3RyaW5nID0gd2luZG93LnByb21wdChcIlBhc3RlIGFuIGV4cG9ydGVkIGdhbWUgaGVyZTpcIiwgXCJcIilcclxuICAgIGxvb3BcclxuICAgICAgaWYgaW1wb3J0U3RyaW5nID09IG51bGxcclxuICAgICAgICByZXR1cm5cclxuICAgICAgaWYgQGFwcC5pbXBvcnQoaW1wb3J0U3RyaW5nKVxyXG4gICAgICAgIEBhcHAuc3dpdGNoVmlldyhcInN1ZG9rdVwiKVxyXG4gICAgICAgIHJldHVyblxyXG4gICAgICBpbXBvcnRTdHJpbmcgPSB3aW5kb3cucHJvbXB0KFwiSW52YWxpZCBnYW1lLCB0cnkgYWdhaW46XCIsIFwiXCIpXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IE1lbnVWaWV3XHJcbiIsIlN1ZG9rdUdlbmVyYXRvciA9IHJlcXVpcmUgJy4vU3Vkb2t1R2VuZXJhdG9yJ1xyXG5cclxuIyBSZXR1cm5zIHRoZSBpbmRleCBvZiBhIGNlbGwgaW4gcm93IG1ham9yIG9yZGVyICh0aG91Z2ggdGhleSBhcmUgc3RvcmVkIGluIGNvbHVtbiBtYWpvciBvcmRlcilcclxuY2VsbEluZGV4ID0gKHgsIHkpIC0+IHkgKiA5ICsgeFxyXG5cclxuIyBTb3J0IGJ5IGFzY2VuZGluZyBsb2NhdGlvbiBhbmQgdGhlbiBieSBzdHJlbmd0aCAoc3Ryb25nIHRoZW4gd2VhaylcclxuYXNjZW5kaW5nTGlua1NvcnQgPSAoYSwgYikgLT5cclxuICBhMCA9IGNlbGxJbmRleChhLmNlbGxzWzBdLngsIGEuY2VsbHNbMF0ueSlcclxuICBhMSA9IGNlbGxJbmRleChhLmNlbGxzWzFdLngsIGEuY2VsbHNbMV0ueSlcclxuICBiMCA9IGNlbGxJbmRleChiLmNlbGxzWzBdLngsIGIuY2VsbHNbMF0ueSlcclxuICBiMSA9IGNlbGxJbmRleChiLmNlbGxzWzFdLngsIGIuY2VsbHNbMV0ueSlcclxuICByZXR1cm4gaWYgYTAgPiBiMCBvciAoYTAgPT0gYjAgYW5kIChhMSA+IGIxIG9yIChhMSA9PSBiMSBhbmQgKG5vdCBhLnN0cm9uZz8gYW5kIGIuc3Ryb25nPykpKSkgdGhlbiAxIGVsc2UgLTFcclxuXHJcbiMgTm90ZSBzdHJlbmd0aCBpcyBub3QgY29tcGFyZWRcclxudW5pcXVlTGlua0ZpbHRlciA9IChlLCBpLCBhKSAtPlxyXG4gIGlmIGkgPT0gMFxyXG4gICAgcmV0dXJuIHRydWUgXHJcbiAgcCA9IGFbaS0xXVxyXG4gIGUwID0gY2VsbEluZGV4KGUuY2VsbHNbMF0ueCwgZS5jZWxsc1swXS55KVxyXG4gIGUxID0gY2VsbEluZGV4KGUuY2VsbHNbMV0ueCwgZS5jZWxsc1sxXS55KVxyXG4gIHAwID0gY2VsbEluZGV4KHAuY2VsbHNbMF0ueCwgcC5jZWxsc1swXS55KVxyXG4gIHAxID0gY2VsbEluZGV4KHAuY2VsbHNbMV0ueCwgcC5jZWxsc1sxXS55KVxyXG4gIHJldHVybiBlMCAhPSBwMCBvciBlMSAhPSBwMVxyXG5cclxuZ2VuZXJhdGVMaW5rUGVybXV0YXRpb25zID0gKGNlbGxzKSAtPlxyXG4gIGxpbmtzID0gW11cclxuICBjb3VudCA9IGNlbGxzLmxlbmd0aFxyXG4gIGZvciBpIGluIFswLi4uY291bnQtMV1cclxuICAgIGZvciBqIGluIFtpKzEuLi5jb3VudF1cclxuICAgICAgbGlua3MucHVzaCh7IGNlbGxzOiBbY2VsbHNbaV0sIGNlbGxzW2pdXSB9KVxyXG4gIHJldHVybiBsaW5rc1xyXG5cclxuY2xhc3MgU3Vkb2t1R2FtZVxyXG4gIGNvbnN0cnVjdG9yOiAtPlxyXG4gICAgQGNsZWFyKClcclxuICAgIGlmIG5vdCBAbG9hZCgpXHJcbiAgICAgIEBuZXdHYW1lKFN1ZG9rdUdlbmVyYXRvci5kaWZmaWN1bHR5LmVhc3kpXHJcbiAgICByZXR1cm5cclxuXHJcbiAgY2xlYXI6IC0+XHJcbiAgICBAZ3JpZCA9IG5ldyBBcnJheSg5KS5maWxsKG51bGwpXHJcbiAgICBmb3IgaSBpbiBbMC4uLjldXHJcbiAgICAgIEBncmlkW2ldID0gbmV3IEFycmF5KDkpLmZpbGwobnVsbClcclxuICAgIGZvciBqIGluIFswLi4uOV1cclxuICAgICAgZm9yIGkgaW4gWzAuLi45XVxyXG4gICAgICAgIEBncmlkW2ldW2pdID1cclxuICAgICAgICAgIHZhbHVlOiAwXHJcbiAgICAgICAgICBlcnJvcjogZmFsc2VcclxuICAgICAgICAgIGxvY2tlZDogZmFsc2VcclxuICAgICAgICAgIHBlbmNpbDogbmV3IEFycmF5KDkpLmZpbGwoZmFsc2UpXHJcblxyXG4gICAgQHNvbHZlZCA9IGZhbHNlXHJcbiAgICBAdW5kb0pvdXJuYWwgPSBbXVxyXG4gICAgQHJlZG9Kb3VybmFsID0gW11cclxuXHJcbiAgaG9sZUNvdW50OiAtPlxyXG4gICAgY291bnQgPSAwXHJcbiAgICBmb3IgaiBpbiBbMC4uLjldXHJcbiAgICAgIGZvciBpIGluIFswLi4uOV1cclxuICAgICAgICBpZiBub3QgQGdyaWRbaV1bal0ubG9ja2VkXHJcbiAgICAgICAgICBjb3VudCArPSAxXHJcbiAgICByZXR1cm4gY291bnRcclxuXHJcbiAgZXhwb3J0OiAtPlxyXG4gICAgZXhwb3J0U3RyaW5nID0gXCJTRFwiXHJcbiAgICBmb3IgaiBpbiBbMC4uLjldXHJcbiAgICAgIGZvciBpIGluIFswLi4uOV1cclxuICAgICAgICBpZiBAZ3JpZFtpXVtqXS5sb2NrZWRcclxuICAgICAgICAgIGV4cG9ydFN0cmluZyArPSBcIiN7QGdyaWRbaV1bal0udmFsdWV9XCJcclxuICAgICAgICBlbHNlXHJcbiAgICAgICAgICBleHBvcnRTdHJpbmcgKz0gXCIwXCJcclxuICAgIHJldHVybiBleHBvcnRTdHJpbmdcclxuXHJcbiAgdmFsaWRhdGU6IC0+XHJcbiAgICBib2FyZCA9IG5ldyBBcnJheSg5KS5maWxsKG51bGwpXHJcbiAgICBmb3IgaSBpbiBbMC4uLjldXHJcbiAgICAgIGJvYXJkW2ldID0gbmV3IEFycmF5KDkpLmZpbGwoMClcclxuICAgICAgZm9yIGogaW4gWzAuLi45XVxyXG4gICAgICAgIGJvYXJkW2ldW2pdID0gQGdyaWRbaV1bal0udmFsdWVcclxuXHJcbiAgICBnZW5lcmF0b3IgPSBuZXcgU3Vkb2t1R2VuZXJhdG9yXHJcbiAgICByZXR1cm4gZ2VuZXJhdG9yLnZhbGlkYXRlR3JpZChib2FyZClcclxuXHJcbiAgaW1wb3J0OiAoaW1wb3J0U3RyaW5nKSAtPlxyXG4gICAgaWYgaW1wb3J0U3RyaW5nLmluZGV4T2YoXCJTRFwiKSAhPSAwXHJcbiAgICAgIHJldHVybiBmYWxzZVxyXG4gICAgaW1wb3J0U3RyaW5nID0gaW1wb3J0U3RyaW5nLnN1YnN0cigyKVxyXG4gICAgaW1wb3J0U3RyaW5nID0gaW1wb3J0U3RyaW5nLnJlcGxhY2UoL1teMC05XS9nLCBcIlwiKVxyXG4gICAgaWYgaW1wb3J0U3RyaW5nLmxlbmd0aCAhPSA4MVxyXG4gICAgICByZXR1cm4gZmFsc2VcclxuXHJcbiAgICBAY2xlYXIoKVxyXG5cclxuICAgIGluZGV4ID0gMFxyXG4gICAgemVyb0NoYXJDb2RlID0gXCIwXCIuY2hhckNvZGVBdCgwKVxyXG4gICAgZm9yIGogaW4gWzAuLi45XVxyXG4gICAgICBmb3IgaSBpbiBbMC4uLjldXHJcbiAgICAgICAgdiA9IGltcG9ydFN0cmluZy5jaGFyQ29kZUF0KGluZGV4KSAtIHplcm9DaGFyQ29kZVxyXG4gICAgICAgIGluZGV4ICs9IDFcclxuICAgICAgICBpZiB2ID4gMFxyXG4gICAgICAgICAgQGdyaWRbaV1bal0ubG9ja2VkID0gdHJ1ZVxyXG4gICAgICAgICAgQGdyaWRbaV1bal0udmFsdWUgPSB2XHJcblxyXG4gICAgcmV0dXJuIGZhbHNlIGlmIG5vdCBAdmFsaWRhdGUoKVxyXG4gICAgXHJcbiAgICBAdXBkYXRlQ2VsbHMoKVxyXG4gICAgQHNhdmUoKVxyXG4gICAgcmV0dXJuIHRydWVcclxuXHJcbiAgdXBkYXRlQ2VsbDogKHgsIHkpIC0+XHJcbiAgICBjZWxsID0gQGdyaWRbeF1beV1cclxuXHJcbiAgICBmb3IgaSBpbiBbMC4uLjldXHJcbiAgICAgIGlmIHggIT0gaVxyXG4gICAgICAgIHYgPSBAZ3JpZFtpXVt5XS52YWx1ZVxyXG4gICAgICAgIGlmIHYgPiAwXHJcbiAgICAgICAgICBpZiB2ID09IGNlbGwudmFsdWVcclxuICAgICAgICAgICAgQGdyaWRbaV1beV0uZXJyb3IgPSB0cnVlXHJcbiAgICAgICAgICAgIGNlbGwuZXJyb3IgPSB0cnVlXHJcblxyXG4gICAgICBpZiB5ICE9IGlcclxuICAgICAgICB2ID0gQGdyaWRbeF1baV0udmFsdWVcclxuICAgICAgICBpZiB2ID4gMFxyXG4gICAgICAgICAgaWYgdiA9PSBjZWxsLnZhbHVlXHJcbiAgICAgICAgICAgIEBncmlkW3hdW2ldLmVycm9yID0gdHJ1ZVxyXG4gICAgICAgICAgICBjZWxsLmVycm9yID0gdHJ1ZVxyXG5cclxuICAgIHN4ID0gTWF0aC5mbG9vcih4IC8gMykgKiAzXHJcbiAgICBzeSA9IE1hdGguZmxvb3IoeSAvIDMpICogM1xyXG4gICAgZm9yIGogaW4gWzAuLi4zXVxyXG4gICAgICBmb3IgaSBpbiBbMC4uLjNdXHJcbiAgICAgICAgaWYgKHggIT0gKHN4ICsgaSkpICYmICh5ICE9IChzeSArIGopKVxyXG4gICAgICAgICAgdiA9IEBncmlkW3N4ICsgaV1bc3kgKyBqXS52YWx1ZVxyXG4gICAgICAgICAgaWYgdiA+IDBcclxuICAgICAgICAgICAgaWYgdiA9PSBjZWxsLnZhbHVlXHJcbiAgICAgICAgICAgICAgQGdyaWRbc3ggKyBpXVtzeSArIGpdLmVycm9yID0gdHJ1ZVxyXG4gICAgICAgICAgICAgIGNlbGwuZXJyb3IgPSB0cnVlXHJcbiAgICByZXR1cm5cclxuXHJcbiAgdXBkYXRlQ2VsbHM6IC0+XHJcbiAgICBmb3IgaiBpbiBbMC4uLjldXHJcbiAgICAgIGZvciBpIGluIFswLi4uOV1cclxuICAgICAgICBAZ3JpZFtpXVtqXS5lcnJvciA9IGZhbHNlXHJcblxyXG4gICAgZm9yIGogaW4gWzAuLi45XVxyXG4gICAgICBmb3IgaSBpbiBbMC4uLjldXHJcbiAgICAgICAgQHVwZGF0ZUNlbGwoaSwgailcclxuXHJcbiAgICBAc29sdmVkID0gdHJ1ZVxyXG4gICAgZm9yIGogaW4gWzAuLi45XVxyXG4gICAgICBmb3IgaSBpbiBbMC4uLjldXHJcbiAgICAgICAgaWYgQGdyaWRbaV1bal0uZXJyb3JcclxuICAgICAgICAgIEBzb2x2ZWQgPSBmYWxzZVxyXG4gICAgICAgIGlmIEBncmlkW2ldW2pdLnZhbHVlID09IDBcclxuICAgICAgICAgIEBzb2x2ZWQgPSBmYWxzZVxyXG5cclxuICAgICMgaWYgQHNvbHZlZFxyXG4gICAgIyAgIGNvbnNvbGUubG9nIFwic29sdmVkICN7QHNvbHZlZH1cIlxyXG5cclxuICAgIHJldHVybiBAc29sdmVkXHJcblxyXG4gIGRvbmU6IC0+XHJcbiAgICBkID0gbmV3IEFycmF5KDkpLmZpbGwoZmFsc2UpXHJcbiAgICBjb3VudHMgPSBuZXcgQXJyYXkoOSkuZmlsbCgwKVxyXG4gICAgZm9yIGogaW4gWzAuLi45XVxyXG4gICAgICBmb3IgaSBpbiBbMC4uLjldXHJcbiAgICAgICAgaWYgQGdyaWRbaV1bal0udmFsdWUgIT0gMFxyXG4gICAgICAgICAgY291bnRzW0BncmlkW2ldW2pdLnZhbHVlLTFdICs9IDFcclxuXHJcbiAgICBmb3IgaSBpbiBbMC4uLjldXHJcbiAgICAgIGlmIGNvdW50c1tpXSA9PSA5XHJcbiAgICAgICAgZFtpXSA9IHRydWVcclxuICAgIHJldHVybiBkXHJcblxyXG4gIHBlbmNpbFN0cmluZzogKHgsIHkpIC0+XHJcbiAgICBjZWxsID0gQGdyaWRbeF1beV1cclxuICAgIHMgPSBcIlwiXHJcbiAgICBmb3IgaSBpbiBbMC4uLjldXHJcbiAgICAgIGlmIGNlbGwucGVuY2lsW2ldXHJcbiAgICAgICAgcyArPSBTdHJpbmcoaSsxKVxyXG4gICAgcmV0dXJuIHNcclxuXHJcbiAgZG86IChhY3Rpb24sIHgsIHksIHZhbHVlcywgam91cm5hbCkgLT5cclxuICAgIGlmIHZhbHVlcy5sZW5ndGggPiAwXHJcbiAgICAgIGNlbGwgPSBAZ3JpZFt4XVt5XVxyXG4gICAgICBzd2l0Y2ggYWN0aW9uXHJcbiAgICAgICAgd2hlbiBcInRvZ2dsZVBlbmNpbFwiXHJcbiAgICAgICAgICBqb3VybmFsLnB1c2ggeyBhY3Rpb246IFwidG9nZ2xlUGVuY2lsXCIsIHg6IHgsIHk6IHksIHZhbHVlczogdmFsdWVzIH1cclxuICAgICAgICAgIGNlbGwucGVuY2lsW3YtMV0gPSAhY2VsbC5wZW5jaWxbdi0xXSBmb3IgdiBpbiB2YWx1ZXNcclxuICAgICAgICB3aGVuIFwic2V0VmFsdWVcIlxyXG4gICAgICAgICAgam91cm5hbC5wdXNoIHsgYWN0aW9uOiBcInNldFZhbHVlXCIsIHg6IHgsIHk6IHksIHZhbHVlczogW2NlbGwudmFsdWVdIH1cclxuICAgICAgICAgIGNlbGwudmFsdWUgPSB2YWx1ZXNbMF1cclxuICAgICAgQHVwZGF0ZUNlbGxzKClcclxuICAgICAgQHNhdmUoKVxyXG5cclxuICB1bmRvOiAtPlxyXG4gICAgaWYgKEB1bmRvSm91cm5hbC5sZW5ndGggPiAwKVxyXG4gICAgICBzdGVwID0gQHVuZG9Kb3VybmFsLnBvcCgpXHJcbiAgICAgIEBkbyBzdGVwLmFjdGlvbiwgc3RlcC54LCBzdGVwLnksIHN0ZXAudmFsdWVzLCBAcmVkb0pvdXJuYWxcclxuICAgICAgcmV0dXJuIFsgc3RlcC54LCBzdGVwLnkgXVxyXG5cclxuICByZWRvOiAtPlxyXG4gICAgaWYgKEByZWRvSm91cm5hbC5sZW5ndGggPiAwKVxyXG4gICAgICBzdGVwID0gQHJlZG9Kb3VybmFsLnBvcCgpXHJcbiAgICAgIEBkbyBzdGVwLmFjdGlvbiwgc3RlcC54LCBzdGVwLnksIHN0ZXAudmFsdWVzLCBAdW5kb0pvdXJuYWxcclxuICAgICAgcmV0dXJuIFsgc3RlcC54LCBzdGVwLnkgXVxyXG5cclxuICBjbGVhclBlbmNpbDogKHgsIHkpIC0+XHJcbiAgICBjZWxsID0gQGdyaWRbeF1beV1cclxuICAgIGlmIGNlbGwubG9ja2VkXHJcbiAgICAgIHJldHVyblxyXG4gICAgQGRvIFwidG9nZ2xlUGVuY2lsXCIsIHgsIHksIChpKzEgZm9yIGZsYWcsIGkgaW4gY2VsbC5wZW5jaWwgd2hlbiBmbGFnKSwgQHVuZG9Kb3VybmFsXHJcbiAgICBAcmVkb0pvdXJuYWwgPSBbXVxyXG5cclxuICB0b2dnbGVQZW5jaWw6ICh4LCB5LCB2KSAtPlxyXG4gICAgaWYgQGdyaWRbeF1beV0ubG9ja2VkXHJcbiAgICAgIHJldHVyblxyXG4gICAgQGRvIFwidG9nZ2xlUGVuY2lsXCIsIHgsIHksIFt2XSwgQHVuZG9Kb3VybmFsXHJcbiAgICBAcmVkb0pvdXJuYWwgPSBbXVxyXG5cclxuICBzZXRWYWx1ZTogKHgsIHksIHYpIC0+XHJcbiAgICBpZiBAZ3JpZFt4XVt5XS5sb2NrZWRcclxuICAgICAgcmV0dXJuXHJcbiAgICBAZG8gXCJzZXRWYWx1ZVwiLCB4LCB5LCBbdl0sIEB1bmRvSm91cm5hbFxyXG4gICAgQHJlZG9Kb3VybmFsID0gW11cclxuXHJcbiAgcmVzZXQ6IC0+XHJcbiAgICBjb25zb2xlLmxvZyBcInJlc2V0KClcIlxyXG4gICAgZm9yIGogaW4gWzAuLi45XVxyXG4gICAgICBmb3IgaSBpbiBbMC4uLjldXHJcbiAgICAgICAgY2VsbCA9IEBncmlkW2ldW2pdXHJcbiAgICAgICAgaWYgbm90IGNlbGwubG9ja2VkXHJcbiAgICAgICAgICBjZWxsLnZhbHVlID0gMFxyXG4gICAgICAgIGNlbGwuZXJyb3IgPSBmYWxzZVxyXG4gICAgICAgIGZvciBrIGluIFswLi4uOV1cclxuICAgICAgICAgIGNlbGwucGVuY2lsW2tdID0gZmFsc2VcclxuICAgIEB1bmRvSm91cm5hbCA9IFtdXHJcbiAgICBAcmVkb0pvdXJuYWwgPSBbXVxyXG4gICAgQGhpZ2hsaWdodFggPSAtMVxyXG4gICAgQGhpZ2hsaWdodFkgPSAtMVxyXG4gICAgQHVwZGF0ZUNlbGxzKClcclxuICAgIEBzYXZlKClcclxuXHJcbiAgZ2V0TGlua3M6ICh2YWx1ZSkgLT5cclxuICAgICMgTm90ZTogdGhlIHNlYXJjaCBzb3J0cyB0aGUgbGlua3MgaW4gcm93IG1ham9yIG9yZGVyLCBmaXJzdCBieSBzdGFydCBjZWxsLCB0aGVuIGJ5IGVuZCBjZWxsXHJcbiAgICBsaW5rcyA9IFtdXHJcblxyXG4gICAgIyBHZXQgcm93IGxpbmtzXHJcbiAgICBmb3IgeSBpbiBbMC4uLjldXHJcbiAgICAgIGxpbmtzLnB1c2ggQGdldFJvd0xpbmtzKHksIHZhbHVlKS4uLlxyXG5cclxuICAgICMgR2V0IGNvbHVtbiBsaW5rc1xyXG4gICAgZm9yIHggaW4gWzAuLi45XVxyXG4gICAgICBsaW5rcy5wdXNoIEBnZXRDb2x1bW5MaW5rcyh4LCB2YWx1ZSkuLi5cclxuXHJcbiAgICAjIEdldCBib3ggbGlua3NcclxuICAgIGZvciBib3hYIGluIFswLi4uM11cclxuICAgICAgZm9yIGJveFkgaW4gWzAuLi4zXVxyXG4gICAgICAgIGxpbmtzLnB1c2ggQGdldEJveExpbmtzKGJveFgsIGJveFksIHZhbHVlKS4uLlxyXG5cclxuICAgICMgVGhlIGJveCBsaW5rcyBtaWdodCBoYXZlIGR1cGxpY2F0ZWQgc29tZSByb3cgYW5kIGNvbHVtbiBsaW5rcywgc28gZHVwbGljYXRlcyBtdXN0IGJlIGZpbHRlcmVkIG91dC4gTm90ZSB0aGF0IG9ubHlcclxuICAgICMgbG9jYXRpb25zIGFyZSBjb25zaWRlcmVkIHdoZW4gZmluZGluZyBkdXBsaWNhdGVzLCBidXQgc3Ryb25nIGxpbmtzIHRha2UgcHJlY2VkZW5jZSB3aGVuIGR1cGxpY2F0ZXMgYXJlIHJlbW92ZWQgXHJcbiAgICAjIChiZWNhdXNlIHRoZXkgYXJlIG9yZGVyZWQgYmVmb3JlIHdlYWsgbGlua3MpLlxyXG4gICAgbGlua3MgPSBsaW5rcy5zb3J0KGFzY2VuZGluZ0xpbmtTb3J0KS5maWx0ZXIodW5pcXVlTGlua0ZpbHRlcilcclxuXHJcbiAgICBzdHJvbmcgPSBbXVxyXG4gICAgZm9yIGxpbmsgaW4gbGlua3NcclxuICAgICAgc3Ryb25nLnB1c2ggbGluay5jZWxscyBpZiBsaW5rLnN0cm9uZz9cclxuICAgIHdlYWsgPSBbXVxyXG4gICAgZm9yIGxpbmsgaW4gbGlua3NcclxuICAgICAgd2Vhay5wdXNoIGxpbmsuY2VsbHMgaWYgbm90IGxpbmsuc3Ryb25nP1xyXG5cclxuICAgIHJldHVybiB7IHN0cm9uZywgd2VhayB9XHJcblxyXG4gIGdldFJvd0xpbmtzOiAoeSwgdmFsdWUpLT5cclxuICAgIGNlbGxzID0gW11cclxuICAgIGZvciB4IGluIFswLi4uOV1cclxuICAgICAgY2VsbCA9IEBncmlkW3hdW3ldXHJcbiAgICAgIGlmIGNlbGwudmFsdWUgPT0gMCBhbmQgY2VsbC5wZW5jaWxbdmFsdWUtMV1cclxuICAgICAgICBjZWxscy5wdXNoKHsgeCwgeSB9KVxyXG5cclxuICAgIGlmIGNlbGxzLmxlbmd0aCA+IDFcclxuICAgICAgbGlua3MgPSBnZW5lcmF0ZUxpbmtQZXJtdXRhdGlvbnMoY2VsbHMpXHJcbiAgICAgIGlmIGxpbmtzLmxlbmd0aCA9PSAxXHJcbiAgICAgICAgbGlua3NbMF0uc3Ryb25nID0gdHJ1ZVxyXG4gICAgZWxzZVxyXG4gICAgICBsaW5rcyA9IFtdXHJcbiAgICByZXR1cm4gbGlua3NcclxuXHJcbiAgZ2V0Q29sdW1uTGlua3M6ICh4LCB2YWx1ZSktPlxyXG4gICAgY2VsbHMgPSBbXVxyXG4gICAgZm9yIHkgaW4gWzAuLi45XVxyXG4gICAgICBjZWxsID0gQGdyaWRbeF1beV1cclxuICAgICAgaWYgY2VsbC52YWx1ZSA9PSAwIGFuZCBjZWxsLnBlbmNpbFt2YWx1ZS0xXVxyXG4gICAgICAgIGNlbGxzLnB1c2goeyB4LCB5IH0pXHJcblxyXG4gICAgaWYgY2VsbHMubGVuZ3RoID4gMVxyXG4gICAgICBsaW5rcyA9IGdlbmVyYXRlTGlua1Blcm11dGF0aW9ucyhjZWxscylcclxuICAgICAgaWYgbGlua3MubGVuZ3RoID09IDFcclxuICAgICAgICBsaW5rc1swXS5zdHJvbmcgPSB0cnVlXHJcbiAgICBlbHNlXHJcbiAgICAgIGxpbmtzID0gW11cclxuICAgIHJldHVybiBsaW5rc1xyXG5cclxuICBnZXRCb3hMaW5rczogKGJveFgsIGJveFksIHZhbHVlKSAtPlxyXG4gICAgY2VsbHMgPSBbXVxyXG4gICAgc3ggPSBib3hYICogM1xyXG4gICAgc3kgPSBib3hZICogM1xyXG4gICAgZm9yIHkgaW4gW3N5Li4uc3krM11cclxuICAgICAgZm9yIHggaW4gW3N4Li4uc3grM11cclxuICAgICAgICBjZWxsID0gQGdyaWRbeF1beV1cclxuICAgICAgICBpZiBjZWxsLnZhbHVlID09IDAgYW5kIGNlbGwucGVuY2lsW3ZhbHVlLTFdXHJcbiAgICAgICAgICBjZWxscy5wdXNoKHsgeCwgeSB9KVxyXG5cclxuICAgIGlmIGNlbGxzLmxlbmd0aCA+IDFcclxuICAgICAgbGlua3MgPSBnZW5lcmF0ZUxpbmtQZXJtdXRhdGlvbnMoY2VsbHMpXHJcbiAgICAgIGlmIGxpbmtzLmxlbmd0aCA9PSAxXHJcbiAgICAgICAgbGlua3NbMF0uc3Ryb25nID0gdHJ1ZVxyXG4gICAgZWxzZVxyXG4gICAgICBsaW5rcyA9IFtdXHJcbiAgICByZXR1cm4gbGlua3NcclxuXHJcbiAgbmV3R2FtZTogKGRpZmZpY3VsdHkpIC0+XHJcbiAgICBjb25zb2xlLmxvZyBcIm5ld0dhbWUoI3tkaWZmaWN1bHR5fSlcIlxyXG4gICAgZm9yIGogaW4gWzAuLi45XVxyXG4gICAgICBmb3IgaSBpbiBbMC4uLjldXHJcbiAgICAgICAgY2VsbCA9IEBncmlkW2ldW2pdXHJcbiAgICAgICAgY2VsbC52YWx1ZSA9IDBcclxuICAgICAgICBjZWxsLmVycm9yID0gZmFsc2VcclxuICAgICAgICBjZWxsLmxvY2tlZCA9IGZhbHNlXHJcbiAgICAgICAgZm9yIGsgaW4gWzAuLi45XVxyXG4gICAgICAgICAgY2VsbC5wZW5jaWxba10gPSBmYWxzZVxyXG5cclxuICAgIGdlbmVyYXRvciA9IG5ldyBTdWRva3VHZW5lcmF0b3IoKVxyXG4gICAgbmV3R3JpZCA9IGdlbmVyYXRvci5nZW5lcmF0ZShkaWZmaWN1bHR5KVxyXG4gICAgIyBjb25zb2xlLmxvZyBcIm5ld0dyaWRcIiwgbmV3R3JpZFxyXG4gICAgZm9yIGogaW4gWzAuLi45XVxyXG4gICAgICBmb3IgaSBpbiBbMC4uLjldXHJcbiAgICAgICAgaWYgbmV3R3JpZFtpXVtqXSAhPSAwXHJcbiAgICAgICAgICBAZ3JpZFtpXVtqXS52YWx1ZSA9IG5ld0dyaWRbaV1bal1cclxuICAgICAgICAgIEBncmlkW2ldW2pdLmxvY2tlZCA9IHRydWVcclxuICAgIEB1bmRvSm91cm5hbCA9IFtdXHJcbiAgICBAcmVkb0pvdXJuYWwgPSBbXVxyXG4gICAgQHVwZGF0ZUNlbGxzKClcclxuICAgIEBzYXZlKClcclxuXHJcbiAgbG9hZDogLT5cclxuICAgIGlmIG5vdCBsb2NhbFN0b3JhZ2VcclxuICAgICAgYWxlcnQoXCJObyBsb2NhbCBzdG9yYWdlLCBub3RoaW5nIHdpbGwgd29ya1wiKVxyXG4gICAgICByZXR1cm4gZmFsc2VcclxuICAgIGpzb25TdHJpbmcgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcImdhbWVcIilcclxuICAgIGlmIGpzb25TdHJpbmcgPT0gbnVsbFxyXG4gICAgICByZXR1cm4gZmFsc2VcclxuXHJcbiAgICAjIGNvbnNvbGUubG9nIGpzb25TdHJpbmdcclxuICAgIGdhbWVEYXRhID0gSlNPTi5wYXJzZShqc29uU3RyaW5nKVxyXG4gICAgIyBjb25zb2xlLmxvZyBcImZvdW5kIGdhbWVEYXRhXCIsIGdhbWVEYXRhXHJcblxyXG4gICAgZm9yIGogaW4gWzAuLi45XVxyXG4gICAgICBmb3IgaSBpbiBbMC4uLjldXHJcbiAgICAgICAgc3JjID0gZ2FtZURhdGEuZ3JpZFtpXVtqXVxyXG4gICAgICAgIGRzdCA9IEBncmlkW2ldW2pdXHJcbiAgICAgICAgZHN0LnZhbHVlID0gc3JjLnZcclxuICAgICAgICBkc3QuZXJyb3IgPSBpZiBzcmMuZSA+IDAgdGhlbiB0cnVlIGVsc2UgZmFsc2VcclxuICAgICAgICBkc3QubG9ja2VkID0gaWYgc3JjLmwgPiAwIHRoZW4gdHJ1ZSBlbHNlIGZhbHNlXHJcbiAgICAgICAgZm9yIGsgaW4gWzAuLi45XVxyXG4gICAgICAgICAgZHN0LnBlbmNpbFtrXSA9IGlmIHNyYy5wW2tdID4gMCB0aGVuIHRydWUgZWxzZSBmYWxzZVxyXG5cclxuICAgIEB1cGRhdGVDZWxscygpXHJcbiAgICBjb25zb2xlLmxvZyBcIkxvYWRlZCBnYW1lLlwiXHJcbiAgICByZXR1cm4gdHJ1ZVxyXG5cclxuICBzYXZlOiAtPlxyXG4gICAgaWYgbm90IGxvY2FsU3RvcmFnZVxyXG4gICAgICBhbGVydChcIk5vIGxvY2FsIHN0b3JhZ2UsIG5vdGhpbmcgd2lsbCB3b3JrXCIpXHJcbiAgICAgIHJldHVybiBmYWxzZVxyXG5cclxuICAgIGdhbWVEYXRhID1cclxuICAgICAgZ3JpZDogbmV3IEFycmF5KDkpLmZpbGwobnVsbClcclxuICAgIGZvciBpIGluIFswLi4uOV1cclxuICAgICAgZ2FtZURhdGEuZ3JpZFtpXSA9IG5ldyBBcnJheSg5KS5maWxsKG51bGwpXHJcblxyXG4gICAgZm9yIGogaW4gWzAuLi45XVxyXG4gICAgICBmb3IgaSBpbiBbMC4uLjldXHJcbiAgICAgICAgY2VsbCA9IEBncmlkW2ldW2pdXHJcbiAgICAgICAgZ2FtZURhdGEuZ3JpZFtpXVtqXSA9XHJcbiAgICAgICAgICB2OiBjZWxsLnZhbHVlXHJcbiAgICAgICAgICBlOiBpZiBjZWxsLmVycm9yIHRoZW4gMSBlbHNlIDBcclxuICAgICAgICAgIGw6IGlmIGNlbGwubG9ja2VkIHRoZW4gMSBlbHNlIDBcclxuICAgICAgICAgIHA6IFtdXHJcbiAgICAgICAgZHN0ID0gZ2FtZURhdGEuZ3JpZFtpXVtqXS5wXHJcbiAgICAgICAgZm9yIGsgaW4gWzAuLi45XVxyXG4gICAgICAgICAgZHN0LnB1c2goaWYgY2VsbC5wZW5jaWxba10gdGhlbiAxIGVsc2UgMClcclxuXHJcbiAgICBqc29uU3RyaW5nID0gSlNPTi5zdHJpbmdpZnkoZ2FtZURhdGEpXHJcbiAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcImdhbWVcIiwganNvblN0cmluZylcclxuICAgIGNvbnNvbGUubG9nIFwiU2F2ZWQgZ2FtZSAoI3tqc29uU3RyaW5nLmxlbmd0aH0gY2hhcnMpXCJcclxuICAgIHJldHVybiB0cnVlXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFN1ZG9rdUdhbWVcclxuIiwic2h1ZmZsZSA9IChhKSAtPlxyXG4gICAgaSA9IGEubGVuZ3RoXHJcbiAgICB3aGlsZSAtLWkgPiAwXHJcbiAgICAgICAgaiA9IH5+KE1hdGgucmFuZG9tKCkgKiAoaSArIDEpKVxyXG4gICAgICAgIHQgPSBhW2pdXHJcbiAgICAgICAgYVtqXSA9IGFbaV1cclxuICAgICAgICBhW2ldID0gdFxyXG4gICAgcmV0dXJuIGFcclxuXHJcbmNsYXNzIEJvYXJkXHJcbiAgY29uc3RydWN0b3I6IChvdGhlckJvYXJkID0gbnVsbCkgLT5cclxuICAgIEBsb2NrZWRDb3VudCA9IDA7XHJcbiAgICBAZ3JpZCA9IG5ldyBBcnJheSg5KS5maWxsKG51bGwpXHJcbiAgICBAbG9ja2VkID0gbmV3IEFycmF5KDkpLmZpbGwobnVsbClcclxuICAgIGZvciBpIGluIFswLi4uOV1cclxuICAgICAgQGdyaWRbaV0gPSBuZXcgQXJyYXkoOSkuZmlsbCgwKVxyXG4gICAgICBAbG9ja2VkW2ldID0gbmV3IEFycmF5KDkpLmZpbGwoZmFsc2UpXHJcbiAgICBpZiBvdGhlckJvYXJkICE9IG51bGxcclxuICAgICAgZm9yIGogaW4gWzAuLi45XVxyXG4gICAgICAgIGZvciBpIGluIFswLi4uOV1cclxuICAgICAgICAgIEBncmlkW2ldW2pdID0gb3RoZXJCb2FyZC5ncmlkW2ldW2pdXHJcbiAgICAgICAgICBAbG9jayhpLCBqLCBvdGhlckJvYXJkLmxvY2tlZFtpXVtqXSlcclxuICAgIHJldHVyblxyXG5cclxuICBtYXRjaGVzOiAob3RoZXJCb2FyZCkgLT5cclxuICAgIGZvciBqIGluIFswLi4uOV1cclxuICAgICAgZm9yIGkgaW4gWzAuLi45XVxyXG4gICAgICAgIGlmIEBncmlkW2ldW2pdICE9IG90aGVyQm9hcmQuZ3JpZFtpXVtqXVxyXG4gICAgICAgICAgcmV0dXJuIGZhbHNlXHJcbiAgICByZXR1cm4gdHJ1ZVxyXG5cclxuICBsb2NrOiAoeCwgeSwgdiA9IHRydWUpIC0+XHJcbiAgICBpZiB2XHJcbiAgICAgIEBsb2NrZWRDb3VudCArPSAxIGlmIG5vdCBAbG9ja2VkW3hdW3ldXHJcbiAgICBlbHNlXHJcbiAgICAgIEBsb2NrZWRDb3VudCAtPSAxIGlmIEBsb2NrZWRbeF1beV1cclxuICAgIEBsb2NrZWRbeF1beV0gPSB2O1xyXG5cclxuXHJcbmNsYXNzIFN1ZG9rdUdlbmVyYXRvclxyXG4gIEBkaWZmaWN1bHR5OlxyXG4gICAgZWFzeTogMVxyXG4gICAgbWVkaXVtOiAyXHJcbiAgICBoYXJkOiAzXHJcbiAgICBleHRyZW1lOiA0XHJcblxyXG4gIGNvbnN0cnVjdG9yOiAtPlxyXG5cclxuICBib2FyZFRvR3JpZDogKGJvYXJkKSAtPlxyXG4gICAgbmV3Qm9hcmQgPSBuZXcgQXJyYXkoOSkuZmlsbChudWxsKVxyXG4gICAgZm9yIGkgaW4gWzAuLi45XVxyXG4gICAgICBuZXdCb2FyZFtpXSA9IG5ldyBBcnJheSg5KS5maWxsKDApXHJcbiAgICBmb3IgaiBpbiBbMC4uLjldXHJcbiAgICAgIGZvciBpIGluIFswLi4uOV1cclxuICAgICAgICBpZiBib2FyZC5sb2NrZWRbaV1bal1cclxuICAgICAgICAgIG5ld0JvYXJkW2ldW2pdID0gYm9hcmQuZ3JpZFtpXVtqXVxyXG4gICAgcmV0dXJuIG5ld0JvYXJkXHJcblxyXG4gIGdyaWRUb0JvYXJkOiAoZ3JpZCkgLT5cclxuICAgIGJvYXJkID0gbmV3IEJvYXJkXHJcbiAgICBmb3IgeSBpbiBbMC4uLjldXHJcbiAgICAgIGZvciB4IGluIFswLi4uOV1cclxuICAgICAgICBpZiBncmlkW3hdW3ldID4gMFxyXG4gICAgICAgICAgYm9hcmQuZ3JpZFt4XVt5XSA9IGdyaWRbeF1beV1cclxuICAgICAgICAgIGJvYXJkLmxvY2soeCwgeSlcclxuICAgIHJldHVybiBib2FyZFxyXG5cclxuICBjZWxsVmFsaWQ6IChib2FyZCwgeCwgeSwgdikgLT5cclxuICAgIGlmIGJvYXJkLmxvY2tlZFt4XVt5XVxyXG4gICAgICByZXR1cm4gYm9hcmQuZ3JpZFt4XVt5XSA9PSB2XHJcblxyXG4gICAgZm9yIGkgaW4gWzAuLi45XVxyXG4gICAgICBpZiAoeCAhPSBpKSBhbmQgKGJvYXJkLmdyaWRbaV1beV0gPT0gdilcclxuICAgICAgICAgIHJldHVybiBmYWxzZVxyXG4gICAgICBpZiAoeSAhPSBpKSBhbmQgKGJvYXJkLmdyaWRbeF1baV0gPT0gdilcclxuICAgICAgICAgIHJldHVybiBmYWxzZVxyXG5cclxuICAgIHN4ID0gTWF0aC5mbG9vcih4IC8gMykgKiAzXHJcbiAgICBzeSA9IE1hdGguZmxvb3IoeSAvIDMpICogM1xyXG4gICAgZm9yIGogaW4gWzAuLi4zXVxyXG4gICAgICBmb3IgaSBpbiBbMC4uLjNdXHJcbiAgICAgICAgaWYgKHggIT0gKHN4ICsgaSkpICYmICh5ICE9IChzeSArIGopKVxyXG4gICAgICAgICAgaWYgYm9hcmQuZ3JpZFtzeCArIGldW3N5ICsgal0gPT0gdlxyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2VcclxuICAgIHJldHVybiB0cnVlXHJcblxyXG4gIHBlbmNpbE1hcmtzOiAoYm9hcmQsIHgsIHkpIC0+XHJcbiAgICBpZiBib2FyZC5sb2NrZWRbeF1beV1cclxuICAgICAgcmV0dXJuIFsgYm9hcmQuZ3JpZFt4XVt5XSBdXHJcbiAgICBtYXJrcyA9IFtdXHJcbiAgICBmb3IgdiBpbiBbMS4uOV1cclxuICAgICAgaWYgQGNlbGxWYWxpZChib2FyZCwgeCwgeSwgdilcclxuICAgICAgICBtYXJrcy5wdXNoIHZcclxuICAgIGlmIG1hcmtzLmxlbmd0aCA+IDFcclxuICAgICAgc2h1ZmZsZShtYXJrcylcclxuICAgIHJldHVybiBtYXJrc1xyXG5cclxuICBuZXh0QXR0ZW1wdDogKGJvYXJkLCBhdHRlbXB0cykgLT5cclxuICAgIHJlbWFpbmluZ0luZGV4ZXMgPSBbMC4uLjgxXVxyXG5cclxuICAgICMgc2tpcCBsb2NrZWQgY2VsbHNcclxuICAgIGZvciBpbmRleCBpbiBbMC4uLjgxXVxyXG4gICAgICB4ID0gaW5kZXggJSA5XHJcbiAgICAgIHkgPSBpbmRleCAvLyA5XHJcbiAgICAgIGlmIGJvYXJkLmxvY2tlZFt4XVt5XVxyXG4gICAgICAgIGsgPSByZW1haW5pbmdJbmRleGVzLmluZGV4T2YoaW5kZXgpXHJcbiAgICAgICAgcmVtYWluaW5nSW5kZXhlcy5zcGxpY2UoaywgMSkgaWYgayA+PSAwXHJcblxyXG4gICAgIyBza2lwIGNlbGxzIHRoYXQgYXJlIGFscmVhZHkgYmVpbmcgdHJpZWRcclxuICAgIGZvciBhIGluIGF0dGVtcHRzXHJcbiAgICAgIGsgPSByZW1haW5pbmdJbmRleGVzLmluZGV4T2YoYS5pbmRleClcclxuICAgICAgcmVtYWluaW5nSW5kZXhlcy5zcGxpY2UoaywgMSkgaWYgayA+PSAwXHJcblxyXG4gICAgcmV0dXJuIG51bGwgaWYgcmVtYWluaW5nSW5kZXhlcy5sZW5ndGggPT0gMCAjIGFib3J0IGlmIHRoZXJlIGFyZSBubyBjZWxscyAoc2hvdWxkIG5ldmVyIGhhcHBlbilcclxuXHJcbiAgICBmZXdlc3RJbmRleCA9IC0xXHJcbiAgICBmZXdlc3RNYXJrcyA9IFswLi45XVxyXG4gICAgZm9yIGluZGV4IGluIHJlbWFpbmluZ0luZGV4ZXNcclxuICAgICAgeCA9IGluZGV4ICUgOVxyXG4gICAgICB5ID0gaW5kZXggLy8gOVxyXG4gICAgICBtYXJrcyA9IEBwZW5jaWxNYXJrcyhib2FyZCwgeCwgeSlcclxuXHJcbiAgICAgICMgYWJvcnQgaWYgdGhlcmUgaXMgYSBjZWxsIHdpdGggbm8gcG9zc2liaWxpdGllc1xyXG4gICAgICByZXR1cm4gbnVsbCBpZiBtYXJrcy5sZW5ndGggPT0gMFxyXG5cclxuICAgICAgIyBkb25lIGlmIHRoZXJlIGlzIGEgY2VsbCB3aXRoIG9ubHkgb25lIHBvc3NpYmlsaXR5ICgpXHJcbiAgICAgIHJldHVybiB7IGluZGV4OiBpbmRleCwgcmVtYWluaW5nOiBtYXJrcyB9IGlmIG1hcmtzLmxlbmd0aCA9PSAxXHJcblxyXG4gICAgICAjIHJlbWVtYmVyIHRoaXMgY2VsbCBpZiBpdCBoYXMgdGhlIGZld2VzdCBtYXJrcyBzbyBmYXJcclxuICAgICAgaWYgbWFya3MubGVuZ3RoIDwgZmV3ZXN0TWFya3MubGVuZ3RoXHJcbiAgICAgICAgZmV3ZXN0SW5kZXggPSBpbmRleFxyXG4gICAgICAgIGZld2VzdE1hcmtzID0gbWFya3NcclxuICAgIHJldHVybiB7IGluZGV4OiBmZXdlc3RJbmRleCwgcmVtYWluaW5nOiBmZXdlc3RNYXJrcyB9XHJcblxyXG4gIHNvbHZlOiAoYm9hcmQpIC0+XHJcbiAgICBzb2x2ZWQgPSBuZXcgQm9hcmQoYm9hcmQpXHJcbiAgICBhdHRlbXB0cyA9IFtdXHJcbiAgICByZXR1cm4gQHNvbHZlSW50ZXJuYWwoc29sdmVkLCBhdHRlbXB0cylcclxuXHJcbiAgaGFzVW5pcXVlU29sdXRpb246IChib2FyZCkgLT5cclxuICAgIHNvbHZlZCA9IG5ldyBCb2FyZChib2FyZClcclxuICAgIGF0dGVtcHRzID0gW11cclxuXHJcbiAgICAjIGlmIHRoZXJlIGlzIG5vIHNvbHV0aW9uLCByZXR1cm4gZmFsc2VcclxuICAgIHJldHVybiBmYWxzZSBpZiBAc29sdmVJbnRlcm5hbChzb2x2ZWQsIGF0dGVtcHRzKSA9PSBudWxsXHJcblxyXG4gICAgdW5sb2NrZWRDb3VudCA9IDgxIC0gc29sdmVkLmxvY2tlZENvdW50XHJcblxyXG4gICAgIyBpZiB0aGVyZSBhcmUgbm8gdW5sb2NrZWQgY2VsbHMsIHRoZW4gdGhpcyBzb2x1dGlvbiBtdXN0IGJlIHVuaXF1ZVxyXG4gICAgcmV0dXJuIHRydWUgaWYgdW5sb2NrZWRDb3VudCA9PSAwXHJcblxyXG4gICAgIyBjaGVjayBmb3IgYSBzZWNvbmQgc29sdXRpb25cclxuICAgIHJldHVybiBAc29sdmVJbnRlcm5hbChzb2x2ZWQsIGF0dGVtcHRzLCB1bmxvY2tlZENvdW50LTEpID09IG51bGxcclxuXHJcbiAgc29sdmVJbnRlcm5hbDogKHNvbHZlZCwgYXR0ZW1wdHMsIHdhbGtJbmRleCA9IDApIC0+XHJcbiAgICB1bmxvY2tlZENvdW50ID0gODEgLSBzb2x2ZWQubG9ja2VkQ291bnRcclxuICAgIHdoaWxlIHdhbGtJbmRleCA8IHVubG9ja2VkQ291bnRcclxuICAgICAgaWYgd2Fsa0luZGV4ID49IGF0dGVtcHRzLmxlbmd0aFxyXG4gICAgICAgIGF0dGVtcHQgPSBAbmV4dEF0dGVtcHQoc29sdmVkLCBhdHRlbXB0cylcclxuICAgICAgICBhdHRlbXB0cy5wdXNoKGF0dGVtcHQpIGlmIGF0dGVtcHQgIT0gbnVsbFxyXG4gICAgICBlbHNlXHJcbiAgICAgICAgYXR0ZW1wdCA9IGF0dGVtcHRzW3dhbGtJbmRleF1cclxuXHJcbiAgICAgIGlmIGF0dGVtcHQgIT0gbnVsbFxyXG4gICAgICAgIHggPSBhdHRlbXB0LmluZGV4ICUgOVxyXG4gICAgICAgIHkgPSBhdHRlbXB0LmluZGV4IC8vIDlcclxuICAgICAgICBpZiBhdHRlbXB0LnJlbWFpbmluZy5sZW5ndGggPiAwXHJcbiAgICAgICAgICBzb2x2ZWQuZ3JpZFt4XVt5XSA9IGF0dGVtcHQucmVtYWluaW5nLnBvcCgpXHJcbiAgICAgICAgICB3YWxrSW5kZXggKz0gMVxyXG4gICAgICAgIGVsc2VcclxuICAgICAgICAgIGF0dGVtcHRzLnBvcCgpXHJcbiAgICAgICAgICBzb2x2ZWQuZ3JpZFt4XVt5XSA9IDBcclxuICAgICAgICAgIHdhbGtJbmRleCAtPSAxXHJcbiAgICAgIGVsc2VcclxuICAgICAgICB3YWxrSW5kZXggLT0gMVxyXG5cclxuICAgICAgaWYgd2Fsa0luZGV4IDwgMFxyXG4gICAgICAgIHJldHVybiBudWxsXHJcblxyXG4gICAgcmV0dXJuIHNvbHZlZFxyXG5cclxuICBnZW5lcmF0ZUludGVybmFsOiAoYW1vdW50VG9SZW1vdmUpIC0+XHJcbiAgICBib2FyZCA9IEBzb2x2ZShuZXcgQm9hcmQoKSlcclxuICAgICMgaGFja1xyXG4gICAgZm9yIGogaW4gWzAuLi45XVxyXG4gICAgICBmb3IgaSBpbiBbMC4uLjldXHJcbiAgICAgICAgYm9hcmQubG9jayhpLCBqKVxyXG5cclxuICAgIGluZGV4ZXNUb1JlbW92ZSA9IHNodWZmbGUoWzAuLi44MV0pXHJcbiAgICByZW1vdmVkID0gMFxyXG4gICAgd2hpbGUgcmVtb3ZlZCA8IGFtb3VudFRvUmVtb3ZlXHJcbiAgICAgIGlmIGluZGV4ZXNUb1JlbW92ZS5sZW5ndGggPT0gMFxyXG4gICAgICAgIGJyZWFrXHJcblxyXG4gICAgICByZW1vdmVJbmRleCA9IGluZGV4ZXNUb1JlbW92ZS5wb3AoKVxyXG4gICAgICByeCA9IHJlbW92ZUluZGV4ICUgOVxyXG4gICAgICByeSA9IE1hdGguZmxvb3IocmVtb3ZlSW5kZXggLyA5KVxyXG5cclxuICAgICAgbmV4dEJvYXJkID0gbmV3IEJvYXJkKGJvYXJkKVxyXG4gICAgICBuZXh0Qm9hcmQuZ3JpZFtyeF1bcnldID0gMFxyXG4gICAgICBuZXh0Qm9hcmQubG9jayhyeCwgcnksIGZhbHNlKVxyXG5cclxuICAgICAgaWYgQGhhc1VuaXF1ZVNvbHV0aW9uKG5leHRCb2FyZClcclxuICAgICAgICBib2FyZCA9IG5leHRCb2FyZFxyXG4gICAgICAgIHJlbW92ZWQgKz0gMVxyXG4gICAgICAgICMgY29uc29sZS5sb2cgXCJzdWNjZXNzZnVsbHkgcmVtb3ZlZCAje3J4fSwje3J5fVwiXHJcbiAgICAgIGVsc2VcclxuICAgICAgICAjIGNvbnNvbGUubG9nIFwiZmFpbGVkIHRvIHJlbW92ZSAje3J4fSwje3J5fSwgY3JlYXRlcyBub24tdW5pcXVlIHNvbHV0aW9uXCJcclxuXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICBib2FyZDogYm9hcmRcclxuICAgICAgcmVtb3ZlZDogcmVtb3ZlZFxyXG4gICAgfVxyXG5cclxuICBnZW5lcmF0ZTogKGRpZmZpY3VsdHkpIC0+XHJcbiAgICBhbW91bnRUb1JlbW92ZSA9IHN3aXRjaCBkaWZmaWN1bHR5XHJcbiAgICAgIHdoZW4gU3Vkb2t1R2VuZXJhdG9yLmRpZmZpY3VsdHkuZXh0cmVtZSB0aGVuIDYwXHJcbiAgICAgIHdoZW4gU3Vkb2t1R2VuZXJhdG9yLmRpZmZpY3VsdHkuaGFyZCAgICB0aGVuIDUyXHJcbiAgICAgIHdoZW4gU3Vkb2t1R2VuZXJhdG9yLmRpZmZpY3VsdHkubWVkaXVtICB0aGVuIDQ2XHJcbiAgICAgIGVsc2UgNDAgIyBlYXN5IC8gdW5rbm93blxyXG5cclxuICAgIGJlc3QgPSBudWxsXHJcbiAgICBmb3IgYXR0ZW1wdCBpbiBbMC4uLjJdXHJcbiAgICAgIGdlbmVyYXRlZCA9IEBnZW5lcmF0ZUludGVybmFsKGFtb3VudFRvUmVtb3ZlKVxyXG4gICAgICBpZiBnZW5lcmF0ZWQucmVtb3ZlZCA9PSBhbW91bnRUb1JlbW92ZVxyXG4gICAgICAgIGNvbnNvbGUubG9nIFwiUmVtb3ZlZCBleGFjdCBhbW91bnQgI3thbW91bnRUb1JlbW92ZX0sIHN0b3BwaW5nXCJcclxuICAgICAgICBiZXN0ID0gZ2VuZXJhdGVkXHJcbiAgICAgICAgYnJlYWtcclxuXHJcbiAgICAgIGlmIGJlc3QgPT0gbnVsbFxyXG4gICAgICAgIGJlc3QgPSBnZW5lcmF0ZWRcclxuICAgICAgZWxzZSBpZiBiZXN0LnJlbW92ZWQgPCBnZW5lcmF0ZWQucmVtb3ZlZFxyXG4gICAgICAgIGJlc3QgPSBnZW5lcmF0ZWRcclxuICAgICAgY29uc29sZS5sb2cgXCJjdXJyZW50IGJlc3QgI3tiZXN0LnJlbW92ZWR9IC8gI3thbW91bnRUb1JlbW92ZX1cIlxyXG5cclxuICAgIGNvbnNvbGUubG9nIFwiZ2l2aW5nIHVzZXIgYm9hcmQ6ICN7YmVzdC5yZW1vdmVkfSAvICN7YW1vdW50VG9SZW1vdmV9XCJcclxuICAgIHJldHVybiBAYm9hcmRUb0dyaWQoYmVzdC5ib2FyZClcclxuXHJcbiAgdmFsaWRhdGVHcmlkOiAoZ3JpZCkgLT5cclxuICAgIHJldHVybiBAaGFzVW5pcXVlU29sdXRpb24oQGdyaWRUb0JvYXJkKGdyaWQpKVxyXG5cclxuICBzb2x2ZVN0cmluZzogKGltcG9ydFN0cmluZykgLT5cclxuICAgIGlmIGltcG9ydFN0cmluZy5pbmRleE9mKFwiU0RcIikgIT0gMFxyXG4gICAgICByZXR1cm4gZmFsc2VcclxuICAgIGltcG9ydFN0cmluZyA9IGltcG9ydFN0cmluZy5zdWJzdHIoMilcclxuICAgIGltcG9ydFN0cmluZyA9IGltcG9ydFN0cmluZy5yZXBsYWNlKC9bXjAtOV0vZywgXCJcIilcclxuICAgIGlmIGltcG9ydFN0cmluZy5sZW5ndGggIT0gODFcclxuICAgICAgcmV0dXJuIGZhbHNlXHJcblxyXG4gICAgYm9hcmQgPSBuZXcgQm9hcmQoKVxyXG5cclxuICAgIGluZGV4ID0gMFxyXG4gICAgemVyb0NoYXJDb2RlID0gXCIwXCIuY2hhckNvZGVBdCgwKVxyXG4gICAgZm9yIGogaW4gWzAuLi45XVxyXG4gICAgICBmb3IgaSBpbiBbMC4uLjldXHJcbiAgICAgICAgdiA9IGltcG9ydFN0cmluZy5jaGFyQ29kZUF0KGluZGV4KSAtIHplcm9DaGFyQ29kZVxyXG4gICAgICAgIGluZGV4ICs9IDFcclxuICAgICAgICBpZiB2ID4gMFxyXG4gICAgICAgICAgYm9hcmQuZ3JpZFtqXVtpXSA9IHZcclxuICAgICAgICAgIGJvYXJkLmxvY2soaiwgaSlcclxuXHJcbiAgICBzb2x2ZWQgPSBAc29sdmUoYm9hcmQpXHJcbiAgICBpZiBzb2x2ZWQgPT0gbnVsbFxyXG4gICAgICBjb25zb2xlLmxvZyBcIkVSUk9SOiBDYW4ndCBiZSBzb2x2ZWQuXCJcclxuICAgICAgcmV0dXJuIGZhbHNlXHJcblxyXG4gICAgaWYgbm90IEBoYXNVbmlxdWVTb2x1dGlvbihib2FyZClcclxuICAgICAgY29uc29sZS5sb2cgXCJFUlJPUjogQm9hcmQgc29sdmUgbm90IHVuaXF1ZS5cIlxyXG4gICAgICByZXR1cm4gZmFsc2VcclxuXHJcbiAgICBhbnN3ZXJTdHJpbmcgPSBcIlwiXHJcbiAgICBmb3IgaiBpbiBbMC4uLjldXHJcbiAgICAgIGZvciBpIGluIFswLi4uOV1cclxuICAgICAgICBhbnN3ZXJTdHJpbmcgKz0gXCIje3NvbHZlZC5ncmlkW2pdW2ldfSBcIlxyXG4gICAgICBhbnN3ZXJTdHJpbmcgKz0gXCJcXG5cIlxyXG5cclxuICAgIHJldHVybiBhbnN3ZXJTdHJpbmdcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gU3Vkb2t1R2VuZXJhdG9yXHJcbiIsIlN1ZG9rdUdlbmVyYXRvciA9IHJlcXVpcmUgJy4vU3Vkb2t1R2VuZXJhdG9yJ1xyXG5TdWRva3VHYW1lID0gcmVxdWlyZSAnLi9TdWRva3VHYW1lJ1xyXG5cclxuUEVOX1BPU19YID0gMVxyXG5QRU5fUE9TX1kgPSAxMFxyXG5QRU5fQ0xFQVJfUE9TX1ggPSAyXHJcblBFTl9DTEVBUl9QT1NfWSA9IDEzXHJcblxyXG5QRU5DSUxfUE9TX1ggPSA1XHJcblBFTkNJTF9QT1NfWSA9IDEwXHJcblBFTkNJTF9DTEVBUl9QT1NfWCA9IDZcclxuUEVOQ0lMX0NMRUFSX1BPU19ZID0gMTNcclxuXHJcbk1FTlVfUE9TX1ggPSA0XHJcbk1FTlVfUE9TX1kgPSAxM1xyXG5cclxuTU9ERV9TVEFSVF9QT1NfWCA9IDJcclxuTU9ERV9DRU5URVJfUE9TX1ggPSA0XHJcbk1PREVfRU5EX1BPU19YID0gNlxyXG5NT0RFX1BPU19ZID0gOVxyXG5cclxuVU5ET19QT1NfWCA9IDBcclxuVU5ET19QT1NfWSA9IDEzXHJcblJFRE9fUE9TX1ggPSA4XHJcblJFRE9fUE9TX1kgPSAxM1xyXG5cclxuQ29sb3IgPVxyXG4gIHZhbHVlOiBcImJsYWNrXCJcclxuICBwZW5jaWw6IFwiIzAwMDBmZlwiXHJcbiAgZXJyb3I6IFwiI2ZmMDAwMFwiXHJcbiAgZG9uZTogXCIjY2NjY2NjXCJcclxuICBtZW51OiBcIiMwMDg4MzNcIlxyXG4gIGxpbmtzOiBcIiNjYzMzMzNcIlxyXG4gIGJhY2tncm91bmRTZWxlY3RlZDogXCIjZWVlZWFhXCJcclxuICBiYWNrZ3JvdW5kTG9ja2VkOiBcIiNlZWVlZWVcIlxyXG4gIGJhY2tncm91bmRMb2NrZWRDb25mbGljdGVkOiBcIiNmZmZmZWVcIlxyXG4gIGJhY2tncm91bmRMb2NrZWRTZWxlY3RlZDogXCIjZWVlZWRkXCJcclxuICBiYWNrZ3JvdW5kQ29uZmxpY3RlZDogXCIjZmZmZmRkXCJcclxuICBiYWNrZ3JvdW5kRXJyb3I6IFwiI2ZmZGRkZFwiXHJcbiAgbW9kZVNlbGVjdDogXCIjNzc3NzQ0XCJcclxuICBtb2RlUGVuOiBcIiMwMDAwMDBcIlxyXG4gIG1vZGVQZW5jaWw6IFwiIzAwMDBmZlwiXHJcbiAgbW9kZUxpbmtzOiBcIiNjYzMzMzNcIlxyXG5cclxuQWN0aW9uVHlwZSA9XHJcbiAgU0VMRUNUOiAwXHJcbiAgUEVOQ0lMOiAxXHJcbiAgUEVOOiAyXHJcbiAgTUVOVTogM1xyXG4gIFVORE86IDRcclxuICBSRURPOiA1XHJcbiAgTU9ERTogNlxyXG5cclxuTW9kZVR5cGUgPVxyXG4gIEhJR0hMSUdIVElORzogMFxyXG4gIFBFTkNJTDogMVxyXG4gIFBFTjogMlxyXG4gIExJTktTOiAzXHJcblxyXG4jIFNwZWNpYWwgcGVuL3BlbmNpbCB2YWx1ZXNcclxuTk9ORSA9IDBcclxuQ0xFQVIgPSAxMFxyXG5cclxuY2xhc3MgU3Vkb2t1Vmlld1xyXG4gICMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICMgSW5pdFxyXG5cclxuICBjb25zdHJ1Y3RvcjogKEBhcHAsIEBjYW52YXMpIC0+XHJcbiAgICBjb25zb2xlLmxvZyBcImNhbnZhcyBzaXplICN7QGNhbnZhcy53aWR0aH14I3tAY2FudmFzLmhlaWdodH1cIlxyXG5cclxuICAgIHdpZHRoQmFzZWRDZWxsU2l6ZSA9IEBjYW52YXMud2lkdGggLyA5XHJcbiAgICBoZWlnaHRCYXNlZENlbGxTaXplID0gQGNhbnZhcy5oZWlnaHQgLyAxNFxyXG4gICAgY29uc29sZS5sb2cgXCJ3aWR0aEJhc2VkQ2VsbFNpemUgI3t3aWR0aEJhc2VkQ2VsbFNpemV9IGhlaWdodEJhc2VkQ2VsbFNpemUgI3toZWlnaHRCYXNlZENlbGxTaXplfVwiXHJcbiAgICBAY2VsbFNpemUgPSBNYXRoLm1pbih3aWR0aEJhc2VkQ2VsbFNpemUsIGhlaWdodEJhc2VkQ2VsbFNpemUpXHJcblxyXG4gICAgIyBjYWxjIHJlbmRlciBjb25zdGFudHNcclxuICAgIEBsaW5lV2lkdGhUaGluID0gMVxyXG4gICAgQGxpbmVXaWR0aFRoaWNrID0gTWF0aC5tYXgoQGNlbGxTaXplIC8gMjAsIDMpXHJcbiAgICBAbGlua0RvdFJhZGl1cyA9IEBsaW5lV2lkdGhUaGlja1xyXG5cclxuICAgIGZvbnRQaXhlbHNTID0gTWF0aC5mbG9vcihAY2VsbFNpemUgKiAwLjMpXHJcbiAgICBmb250UGl4ZWxzTSA9IE1hdGguZmxvb3IoQGNlbGxTaXplICogMC41KVxyXG4gICAgZm9udFBpeGVsc0wgPSBNYXRoLmZsb29yKEBjZWxsU2l6ZSAqIDAuOClcclxuXHJcbiAgICAjIGluaXQgZm9udHNcclxuICAgIEBmb250cyA9XHJcbiAgICAgIHBlbmNpbDogIEBhcHAucmVnaXN0ZXJGb250KFwicGVuY2lsXCIsICBcIiN7Zm9udFBpeGVsc1N9cHggc2F4TW9ubywgbW9ub3NwYWNlXCIpXHJcbiAgICAgIG1lbnU6ICAgIEBhcHAucmVnaXN0ZXJGb250KFwibWVudVwiLCAgICBcIiN7Zm9udFBpeGVsc019cHggc2F4TW9ubywgbW9ub3NwYWNlXCIpXHJcbiAgICAgIHBlbjogICAgIEBhcHAucmVnaXN0ZXJGb250KFwicGVuXCIsICAgICBcIiN7Zm9udFBpeGVsc0x9cHggc2F4TW9ubywgbW9ub3NwYWNlXCIpXHJcblxyXG4gICAgQGluaXRBY3Rpb25zKClcclxuXHJcbiAgICAjIGluaXQgc3RhdGVcclxuICAgIEBnYW1lID0gbmV3IFN1ZG9rdUdhbWUoKVxyXG4gICAgQHJlc2V0U3RhdGUoKVxyXG5cclxuICAgIEBkcmF3KClcclxuXHJcbiAgaW5pdEFjdGlvbnM6IC0+XHJcbiAgICBAYWN0aW9ucyA9IG5ldyBBcnJheSg5ICogMTUpLmZpbGwobnVsbClcclxuXHJcbiAgICBmb3IgaiBpbiBbMC4uLjldXHJcbiAgICAgIGZvciBpIGluIFswLi4uOV1cclxuICAgICAgICBpbmRleCA9IChqICogOSkgKyBpXHJcbiAgICAgICAgQGFjdGlvbnNbaW5kZXhdID0geyB0eXBlOiBBY3Rpb25UeXBlLlNFTEVDVCwgeDogaSwgeTogaiB9XHJcblxyXG4gICAgZm9yIGogaW4gWzAuLi4zXVxyXG4gICAgICBmb3IgaSBpbiBbMC4uLjNdXHJcbiAgICAgICAgaW5kZXggPSAoKFBFTl9QT1NfWSArIGopICogOSkgKyAoUEVOX1BPU19YICsgaSlcclxuICAgICAgICBAYWN0aW9uc1tpbmRleF0gPSB7IHR5cGU6IEFjdGlvblR5cGUuUEVOLCB2YWx1ZTogMSArIChqICogMykgKyBpIH1cclxuXHJcbiAgICBmb3IgaiBpbiBbMC4uLjNdXHJcbiAgICAgIGZvciBpIGluIFswLi4uM11cclxuICAgICAgICBpbmRleCA9ICgoUEVOQ0lMX1BPU19ZICsgaikgKiA5KSArIChQRU5DSUxfUE9TX1ggKyBpKVxyXG4gICAgICAgIEBhY3Rpb25zW2luZGV4XSA9IHsgdHlwZTogQWN0aW9uVHlwZS5QRU5DSUwsIHZhbHVlOiAxICsgKGogKiAzKSArIGkgfVxyXG5cclxuICAgICMgUGVuIGNsZWFyIGJ1dHRvblxyXG4gICAgaW5kZXggPSAoUEVOX0NMRUFSX1BPU19ZICogOSkgKyBQRU5fQ0xFQVJfUE9TX1hcclxuICAgIEBhY3Rpb25zW2luZGV4XSA9IHsgdHlwZTogQWN0aW9uVHlwZS5QRU4sIHZhbHVlOiBDTEVBUiB9XHJcblxyXG4gICAgIyBQZW5jaWwgY2xlYXIgYnV0dG9uXHJcbiAgICBpbmRleCA9IChQRU5DSUxfQ0xFQVJfUE9TX1kgKiA5KSArIFBFTkNJTF9DTEVBUl9QT1NfWFxyXG4gICAgQGFjdGlvbnNbaW5kZXhdID0geyB0eXBlOiBBY3Rpb25UeXBlLlBFTkNJTCwgdmFsdWU6IENMRUFSIH1cclxuXHJcbiAgICAjIE1lbnUgYnV0dG9uXHJcbiAgICBpbmRleCA9IChNRU5VX1BPU19ZICogOSkgKyBNRU5VX1BPU19YXHJcbiAgICBAYWN0aW9uc1tpbmRleF0gPSB7IHR5cGU6IEFjdGlvblR5cGUuTUVOVSB9XHJcblxyXG4gICAgIyBVbmRvIGJ1dHRvblxyXG4gICAgaW5kZXggPSAoVU5ET19QT1NfWSAqIDkpICsgVU5ET19QT1NfWFxyXG4gICAgQGFjdGlvbnNbaW5kZXhdID0geyB0eXBlOiBBY3Rpb25UeXBlLlVORE8gfVxyXG5cclxuICAgICMgUmVkbyBidXR0b25cclxuICAgIGluZGV4ID0gKFJFRE9fUE9TX1kgKiA5KSArIFJFRE9fUE9TX1hcclxuICAgIEBhY3Rpb25zW2luZGV4XSA9IHsgdHlwZTogQWN0aW9uVHlwZS5SRURPIH1cclxuXHJcbiAgICAjIE1vZGUgc3dpdGNoXHJcbiAgICBmb3IgaSBpbiBbKE1PREVfUE9TX1kqOSkrTU9ERV9TVEFSVF9QT1NfWC4uKE1PREVfUE9TX1kqOSkrTU9ERV9FTkRfUE9TX1hdXHJcbiAgICAgIEBhY3Rpb25zW2ldID0geyB0eXBlOiBBY3Rpb25UeXBlLk1PREUgfVxyXG5cclxuICAgIHJldHVyblxyXG5cclxuICByZXNldFN0YXRlOiAtPlxyXG4gICAgQG1vZGUgPSBNb2RlVHlwZS5ISUdITElHSFRJTkdcclxuICAgIEBwZW5WYWx1ZSA9IE5PTkVcclxuICAgIEBoaWdobGlnaHRYID0gLTFcclxuICAgIEBoaWdobGlnaHRZID0gLTFcclxuICAgIEBzdHJvbmdMaW5rcyA9IFtdXHJcbiAgICBAd2Vha0xpbmtzID0gW11cclxuXHJcbiAgIyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgIyBSZW5kZXJpbmdcclxuXHJcbiAgZHJhd0NlbGw6ICh4LCB5LCBiYWNrZ3JvdW5kQ29sb3IsIHMsIGZvbnQsIGNvbG9yKSAtPlxyXG4gICAgcHggPSB4ICogQGNlbGxTaXplXHJcbiAgICBweSA9IHkgKiBAY2VsbFNpemVcclxuICAgIGlmIGJhY2tncm91bmRDb2xvciAhPSBudWxsXHJcbiAgICAgIEBhcHAuZHJhd0ZpbGwocHgsIHB5LCBAY2VsbFNpemUsIEBjZWxsU2l6ZSwgYmFja2dyb3VuZENvbG9yKVxyXG4gICAgQGFwcC5kcmF3VGV4dENlbnRlcmVkKHMsIHB4ICsgKEBjZWxsU2l6ZSAvIDIpLCBweSArIChAY2VsbFNpemUgLyAyKSwgZm9udCwgY29sb3IpXHJcblxyXG4gIGRyYXdHcmlkOiAob3JpZ2luWCwgb3JpZ2luWSwgc2l6ZSwgc29sdmVkID0gZmFsc2UpIC0+XHJcbiAgICBmb3IgaSBpbiBbMC4uc2l6ZV1cclxuICAgICAgY29sb3IgPSBpZiBzb2x2ZWQgdGhlbiBcImdyZWVuXCIgZWxzZSBcImJsYWNrXCJcclxuICAgICAgbGluZVdpZHRoID0gQGxpbmVXaWR0aFRoaW5cclxuICAgICAgaWYgKChzaXplID09IDEpIHx8IChpICUgMykgPT0gMClcclxuICAgICAgICBsaW5lV2lkdGggPSBAbGluZVdpZHRoVGhpY2tcclxuXHJcbiAgICAgICMgSG9yaXpvbnRhbCBsaW5lc1xyXG4gICAgICBAYXBwLmRyYXdMaW5lKEBjZWxsU2l6ZSAqIChvcmlnaW5YICsgMCksIEBjZWxsU2l6ZSAqIChvcmlnaW5ZICsgaSksIEBjZWxsU2l6ZSAqIChvcmlnaW5YICsgc2l6ZSksIEBjZWxsU2l6ZSAqIChvcmlnaW5ZICsgaSksIGNvbG9yLCBsaW5lV2lkdGgpXHJcblxyXG4gICAgICAjIFZlcnRpY2FsIGxpbmVzXHJcbiAgICAgIEBhcHAuZHJhd0xpbmUoQGNlbGxTaXplICogKG9yaWdpblggKyBpKSwgQGNlbGxTaXplICogKG9yaWdpblkgKyAwKSwgQGNlbGxTaXplICogKG9yaWdpblggKyBpKSwgQGNlbGxTaXplICogKG9yaWdpblkgKyBzaXplKSwgY29sb3IsIGxpbmVXaWR0aClcclxuICAgIHJldHVyblxyXG5cclxuICBkcmF3TGluazogKHN0YXJ0WCwgc3RhcnRZLCBlbmRYLCBlbmRZLCBjb2xvciwgbGluZVdpZHRoKSAtPlxyXG4gICAgeDEgPSAoc3RhcnRYICsgMC41KSAqIEBjZWxsU2l6ZVxyXG4gICAgeTEgPSAoc3RhcnRZICsgMC41KSAqIEBjZWxsU2l6ZVxyXG4gICAgeDIgPSAoZW5kWCArIDAuNSkgKiBAY2VsbFNpemVcclxuICAgIHkyID0gKGVuZFkgKyAwLjUpICogQGNlbGxTaXplXHJcbiAgICByID0gMi4yICogTWF0aC5zcXJ0KCh4MiAtIHgxKSAqICh4MiAtIHgxKSArICh5MiAtIHkxKSAqICh5MiAtIHkxKSkgIyAyLjIgZ2l2ZXMgdGhlIG1vc3QgY3VydmUgd2l0aG91dCBnb2luZyBvZmYgdGhlIGJvYXJkXHJcbiAgICBAYXBwLmRyYXdBcmMoeDEsIHkxLCB4MiwgeTIsIHIsIGNvbG9yLCBsaW5lV2lkdGgpXHJcbiAgICBAYXBwLmRyYXdQb2ludCh4MSwgeTEsIEBsaW5rRG90UmFkaXVzLCBjb2xvcilcclxuICAgIEBhcHAuZHJhd1BvaW50KHgyLCB5MiwgQGxpbmtEb3RSYWRpdXMsIGNvbG9yKVxyXG5cclxuICBkcmF3OiAoZmxhc2hYLCBmbGFzaFkpIC0+XHJcbiAgICBjb25zb2xlLmxvZyBcImRyYXcoKVwiXHJcblxyXG4gICAgIyBDbGVhciBzY3JlZW4gdG8gYmxhY2tcclxuICAgIEBhcHAuZHJhd0ZpbGwoMCwgMCwgQGNhbnZhcy53aWR0aCwgQGNhbnZhcy5oZWlnaHQsIFwiYmxhY2tcIilcclxuXHJcbiAgICAjIE1ha2Ugd2hpdGUgcGhvbmUtc2hhcGVkIGJhY2tncm91bmRcclxuICAgIEBhcHAuZHJhd0ZpbGwoMCwgMCwgQGNlbGxTaXplICogOSwgQGNhbnZhcy5oZWlnaHQsIFwid2hpdGVcIilcclxuXHJcbiAgICAjIERyYXcgYm9hcmQgbnVtYmVyc1xyXG4gICAgZm9yIGogaW4gWzAuLi45XVxyXG4gICAgICBmb3IgaSBpbiBbMC4uLjldXHJcbiAgICAgICAgaWYgKGkgIT0gZmxhc2hYKSB8fCAoaiAhPSBmbGFzaFkpXHJcbiAgICAgICAgICBjZWxsID0gQGdhbWUuZ3JpZFtpXVtqXVxyXG5cclxuICAgICAgICAgICMgRGV0ZXJtaW5lIHRleHQgYXR0cmlidXRlc1xyXG4gICAgICAgICAgYmFja2dyb3VuZENvbG9yID0gbnVsbFxyXG4gICAgICAgICAgZm9udCA9IEBmb250cy5wZW5cclxuICAgICAgICAgIHRleHRDb2xvciA9IENvbG9yLnZhbHVlXHJcbiAgICAgICAgICB0ZXh0ID0gXCJcIlxyXG4gICAgICAgICAgaWYgY2VsbC52YWx1ZSA9PSAwXHJcbiAgICAgICAgICAgIGZvbnQgPSBAZm9udHMucGVuY2lsXHJcbiAgICAgICAgICAgIHRleHRDb2xvciA9IENvbG9yLnBlbmNpbFxyXG4gICAgICAgICAgICB0ZXh0ID0gQGdhbWUucGVuY2lsU3RyaW5nKGksIGopXHJcbiAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIGlmIGNlbGwudmFsdWUgPiAwXHJcbiAgICAgICAgICAgICAgdGV4dCA9IFN0cmluZyhjZWxsLnZhbHVlKVxyXG5cclxuICAgICAgICAgIGlmIGNlbGwuZXJyb3JcclxuICAgICAgICAgICAgdGV4dENvbG9yID0gQ29sb3IuZXJyb3JcclxuXHJcbiAgICAgICAgICAjIERldGVybWluZSBiYWNrZ3JvdW5kIGNvbG9yXHJcbiAgICAgICAgICBpZiBjZWxsLmxvY2tlZFxyXG4gICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3IgPSBDb2xvci5iYWNrZ3JvdW5kTG9ja2VkXHJcblxyXG4gICAgICAgICAgaWYgQG1vZGUgaXMgTW9kZVR5cGUuSElHSExJR0hUSU5HXHJcbiAgICAgICAgICAgIGlmIChAaGlnaGxpZ2h0WCAhPSAtMSkgJiYgKEBoaWdobGlnaHRZICE9IC0xKVxyXG4gICAgICAgICAgICAgIGlmIChpID09IEBoaWdobGlnaHRYKSAmJiAoaiA9PSBAaGlnaGxpZ2h0WSlcclxuICAgICAgICAgICAgICAgIGlmIGNlbGwubG9ja2VkXHJcbiAgICAgICAgICAgICAgICAgIGJhY2tncm91bmRDb2xvciA9IENvbG9yLmJhY2tncm91bmRMb2NrZWRTZWxlY3RlZFxyXG4gICAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3IgPSBDb2xvci5iYWNrZ3JvdW5kU2VsZWN0ZWRcclxuICAgICAgICAgICAgICBlbHNlIGlmIEBjb25mbGljdHMoaSwgaiwgQGhpZ2hsaWdodFgsIEBoaWdobGlnaHRZKVxyXG4gICAgICAgICAgICAgICAgaWYgY2VsbC5sb2NrZWRcclxuICAgICAgICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yID0gQ29sb3IuYmFja2dyb3VuZExvY2tlZENvbmZsaWN0ZWRcclxuICAgICAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yID0gQ29sb3IuYmFja2dyb3VuZENvbmZsaWN0ZWRcclxuICAgICAgICBlbHNlXHJcbiAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3IgPSBcImJsYWNrXCJcclxuICAgICAgICAgIGZvbnQgPSBAZm9udHMucGVuXHJcbiAgICAgICAgICB0ZXh0Q29sb3IgPSBcImJsYWNrXCJcclxuICAgICAgICAgIHRleHQgPSBcIlwiXHJcbiAgICAgICAgQGRyYXdDZWxsKGksIGosIGJhY2tncm91bmRDb2xvciwgdGV4dCwgZm9udCwgdGV4dENvbG9yKVxyXG5cclxuICAgICMgRHJhdyBsaW5rcyBpbiBMSU5LUyBtb2RlXHJcbiAgICBpZiBAbW9kZSBpcyBNb2RlVHlwZS5MSU5LU1xyXG4gICAgICBmb3IgbGluayBpbiBAc3Ryb25nTGlua3NcclxuICAgICAgICBAZHJhd0xpbmsobGlua1swXS54LCBsaW5rWzBdLnksIGxpbmtbMV0ueCwgbGlua1sxXS55LCBDb2xvci5saW5rcywgQGxpbmVXaWR0aFRoaWNrKVxyXG4gICAgICBmb3IgbGluayBpbiBAd2Vha0xpbmtzXHJcbiAgICAgICAgQGRyYXdMaW5rKGxpbmtbMF0ueCwgbGlua1swXS55LCBsaW5rWzFdLngsIGxpbmtbMV0ueSwgQ29sb3IubGlua3MsIEBsaW5lV2lkdGhUaGluKVxyXG5cclxuICAgICMgRHJhdyBwZW4gYW5kIHBlbmNpbCBudW1iZXIgYnV0dG9uc1xyXG4gICAgZG9uZSA9IEBnYW1lLmRvbmUoKVxyXG4gICAgZm9yIGogaW4gWzAuLi4zXVxyXG4gICAgICBmb3IgaSBpbiBbMC4uLjNdXHJcbiAgICAgICAgY3VycmVudFZhbHVlID0gKGogKiAzKSArIGkgKyAxXHJcbiAgICAgICAgY3VycmVudFZhbHVlU3RyaW5nID0gU3RyaW5nKGN1cnJlbnRWYWx1ZSlcclxuICAgICAgICB2YWx1ZUNvbG9yID0gQ29sb3IudmFsdWVcclxuICAgICAgICBwZW5jaWxDb2xvciA9IENvbG9yLnBlbmNpbFxyXG4gICAgICAgIGlmIGRvbmVbKGogKiAzKSArIGldXHJcbiAgICAgICAgICB2YWx1ZUNvbG9yID0gQ29sb3IuZG9uZVxyXG4gICAgICAgICAgcGVuY2lsQ29sb3IgPSBDb2xvci5kb25lXHJcblxyXG4gICAgICAgIHZhbHVlQmFja2dyb3VuZENvbG9yID0gbnVsbFxyXG4gICAgICAgIHBlbmNpbEJhY2tncm91bmRDb2xvciA9IG51bGxcclxuICAgICAgICBpZiBAcGVuVmFsdWUgPT0gY3VycmVudFZhbHVlXHJcbiAgICAgICAgICBpZiBAbW9kZSBpcyBNb2RlVHlwZS5QRU5DSUwgb3IgQG1vZGUgaXMgTW9kZVR5cGUuTElOS1NcclxuICAgICAgICAgICAgcGVuY2lsQmFja2dyb3VuZENvbG9yID0gQ29sb3IuYmFja2dyb3VuZFNlbGVjdGVkXHJcbiAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIHZhbHVlQmFja2dyb3VuZENvbG9yID0gQ29sb3IuYmFja2dyb3VuZFNlbGVjdGVkXHJcblxyXG4gICAgICAgIEBkcmF3Q2VsbChQRU5fUE9TX1ggKyBpLCBQRU5fUE9TX1kgKyBqLCB2YWx1ZUJhY2tncm91bmRDb2xvciwgY3VycmVudFZhbHVlU3RyaW5nLCBAZm9udHMucGVuLCB2YWx1ZUNvbG9yKVxyXG4gICAgICAgIEBkcmF3Q2VsbChQRU5DSUxfUE9TX1ggKyBpLCBQRU5DSUxfUE9TX1kgKyBqLCBwZW5jaWxCYWNrZ3JvdW5kQ29sb3IsIGN1cnJlbnRWYWx1ZVN0cmluZywgQGZvbnRzLnBlbiwgcGVuY2lsQ29sb3IpXHJcblxyXG4gICAgIyBEcmF3IHBlbiBhbmQgcGVuY2lsIENMRUFSIGJ1dHRvbnNcclxuICAgIHZhbHVlQmFja2dyb3VuZENvbG9yID0gbnVsbFxyXG4gICAgcGVuY2lsQmFja2dyb3VuZENvbG9yID0gbnVsbFxyXG4gICAgaWYgQHBlblZhbHVlID09IENMRUFSXHJcbiAgICAgICAgaWYgQG1vZGUgaXMgTW9kZVR5cGUuUEVOQ0lMXHJcbiAgICAgICAgICAgIHBlbmNpbEJhY2tncm91bmRDb2xvciA9IENvbG9yLmJhY2tncm91bmRTZWxlY3RlZFxyXG4gICAgICAgIGVsc2VcclxuICAgICAgICAgICAgdmFsdWVCYWNrZ3JvdW5kQ29sb3IgPSBDb2xvci5iYWNrZ3JvdW5kU2VsZWN0ZWRcclxuXHJcbiAgICBAZHJhd0NlbGwoUEVOX0NMRUFSX1BPU19YLCBQRU5fQ0xFQVJfUE9TX1ksIHZhbHVlQmFja2dyb3VuZENvbG9yLCBcIkNcIiwgQGZvbnRzLnBlbiwgQ29sb3IuZXJyb3IpXHJcbiAgICBAZHJhd0NlbGwoUEVOQ0lMX0NMRUFSX1BPU19YLCBQRU5DSUxfQ0xFQVJfUE9TX1ksIHBlbmNpbEJhY2tncm91bmRDb2xvciwgXCJDXCIsIEBmb250cy5wZW4sIENvbG9yLmVycm9yKVxyXG5cclxuICAgICMgRHJhdyBtb2RlXHJcbiAgICBzd2l0Y2ggQG1vZGVcclxuICAgICAgd2hlbiBNb2RlVHlwZS5ISUdITElHSFRJTkdcclxuICAgICAgICBtb2RlQ29sb3IgPSBDb2xvci5tb2RlU2VsZWN0XHJcbiAgICAgICAgbW9kZVRleHQgPSBcIkhpZ2hsaWdodGluZ1wiXHJcbiAgICAgIHdoZW4gTW9kZVR5cGUuUEVOQ0lMXHJcbiAgICAgICAgbW9kZUNvbG9yID0gQ29sb3IubW9kZVBlbmNpbFxyXG4gICAgICAgIG1vZGVUZXh0ID0gXCJQZW5jaWxcIlxyXG4gICAgICB3aGVuIE1vZGVUeXBlLlBFTlxyXG4gICAgICAgIG1vZGVDb2xvciA9IENvbG9yLm1vZGVQZW5cclxuICAgICAgICBtb2RlVGV4dCA9IFwiUGVuXCJcclxuICAgICAgd2hlbiBNb2RlVHlwZS5MSU5LU1xyXG4gICAgICAgIG1vZGVDb2xvciA9IENvbG9yLm1vZGVMaW5rc1xyXG4gICAgICAgIG1vZGVUZXh0ID0gXCJMaW5rc1wiXHJcbiAgICBAZHJhd0NlbGwoTU9ERV9DRU5URVJfUE9TX1gsIE1PREVfUE9TX1ksIG51bGwsIG1vZGVUZXh0LCBAZm9udHMubWVudSwgbW9kZUNvbG9yKVxyXG5cclxuICAgIEBkcmF3Q2VsbChNRU5VX1BPU19YLCBNRU5VX1BPU19ZLCBudWxsLCBcIk1lbnVcIiwgQGZvbnRzLm1lbnUsIENvbG9yLm1lbnUpXHJcbiAgICBAZHJhd0NlbGwoVU5ET19QT1NfWCwgVU5ET19QT1NfWSwgbnVsbCwgXCJcXHV7MjVjNH1cIiwgQGZvbnRzLm1lbnUsIENvbG9yLm1lbnUpIGlmIChAZ2FtZS51bmRvSm91cm5hbC5sZW5ndGggPiAwKVxyXG4gICAgQGRyYXdDZWxsKFJFRE9fUE9TX1gsIFJFRE9fUE9TX1ksIG51bGwsIFwiXFx1ezI1YmF9XCIsIEBmb250cy5tZW51LCBDb2xvci5tZW51KSBpZiAoQGdhbWUucmVkb0pvdXJuYWwubGVuZ3RoID4gMClcclxuXHJcbiAgICAjIE1ha2UgdGhlIGdyaWRzXHJcbiAgICBAZHJhd0dyaWQoMCwgMCwgOSwgQGdhbWUuc29sdmVkKVxyXG4gICAgQGRyYXdHcmlkKFBFTl9QT1NfWCwgUEVOX1BPU19ZLCAzKVxyXG4gICAgQGRyYXdHcmlkKFBFTkNJTF9QT1NfWCwgUEVOQ0lMX1BPU19ZLCAzKVxyXG4gICAgQGRyYXdHcmlkKFBFTl9DTEVBUl9QT1NfWCwgUEVOX0NMRUFSX1BPU19ZLCAxKVxyXG4gICAgQGRyYXdHcmlkKFBFTkNJTF9DTEVBUl9QT1NfWCwgUEVOQ0lMX0NMRUFSX1BPU19ZLCAxKVxyXG5cclxuICAjIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAjIElucHV0XHJcblxyXG4gIG5ld0dhbWU6IChkaWZmaWN1bHR5KSAtPlxyXG4gICAgY29uc29sZS5sb2cgXCJTdWRva3VWaWV3Lm5ld0dhbWUoI3tkaWZmaWN1bHR5fSlcIlxyXG4gICAgQHJlc2V0U3RhdGUoKVxyXG4gICAgQGdhbWUubmV3R2FtZShkaWZmaWN1bHR5KVxyXG5cclxuICByZXNldDogLT5cclxuICAgIEByZXNldFN0YXRlKClcclxuICAgIEBnYW1lLnJlc2V0KClcclxuXHJcbiAgaW1wb3J0OiAoaW1wb3J0U3RyaW5nKSAtPlxyXG4gICAgQHJlc2V0U3RhdGUoKVxyXG4gICAgcmV0dXJuIEBnYW1lLmltcG9ydChpbXBvcnRTdHJpbmcpXHJcblxyXG4gIGV4cG9ydDogLT5cclxuICAgIHJldHVybiBAZ2FtZS5leHBvcnQoKVxyXG5cclxuICBob2xlQ291bnQ6IC0+XHJcbiAgICByZXR1cm4gQGdhbWUuaG9sZUNvdW50KClcclxuXHJcbiAgaGFuZGxlU2VsZWN0QWN0aW9uOiAoYWN0aW9uKSAtPlxyXG4gICAgc3dpdGNoIEBtb2RlXHJcbiAgICAgIHdoZW4gTW9kZVR5cGUuSElHSExJR0hUSU5HXHJcbiAgICAgICAgaWYgKEBoaWdobGlnaHRYID09IGFjdGlvbi54KSAmJiAoQGhpZ2hsaWdodFkgPT0gYWN0aW9uLnkpXHJcbiAgICAgICAgICBAaGlnaGxpZ2h0WCA9IC0xXHJcbiAgICAgICAgICBAaGlnaGxpZ2h0WSA9IC0xXHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgICAgQGhpZ2hsaWdodFggPSBhY3Rpb24ueFxyXG4gICAgICAgICAgQGhpZ2hsaWdodFkgPSBhY3Rpb24ueVxyXG4gICAgICAgIHJldHVybiBbXVxyXG4gICAgICB3aGVuIE1vZGVUeXBlLlBFTkNJTFxyXG4gICAgICAgIGlmIEBwZW5WYWx1ZSA9PSBDTEVBUlxyXG4gICAgICAgICAgQGdhbWUuY2xlYXJQZW5jaWwoYWN0aW9uLngsIGFjdGlvbi55KVxyXG4gICAgICAgIGVsc2UgaWYgQHBlblZhbHVlICE9IE5PTkVcclxuICAgICAgICAgIEBnYW1lLnRvZ2dsZVBlbmNpbChhY3Rpb24ueCwgYWN0aW9uLnksIEBwZW5WYWx1ZSlcclxuICAgICAgICByZXR1cm4gWyBhY3Rpb24ueCwgYWN0aW9uLnkgXVxyXG4gICAgICB3aGVuIE1vZGVUeXBlLlBFTlxyXG4gICAgICAgIGlmIEBwZW5WYWx1ZSA9PSBDTEVBUlxyXG4gICAgICAgICAgQGdhbWUuc2V0VmFsdWUoYWN0aW9uLngsIGFjdGlvbi55LCAwKVxyXG4gICAgICAgIGVsc2UgaWYgQHBlblZhbHVlICE9IE5PTkVcclxuICAgICAgICAgIEBnYW1lLnNldFZhbHVlKGFjdGlvbi54LCBhY3Rpb24ueSwgQHBlblZhbHVlKVxyXG4gICAgICAgIHJldHVybiBbIGFjdGlvbi54LCBhY3Rpb24ueSBdXHJcblxyXG4gIGhhbmRsZVBlbmNpbEFjdGlvbjogKGFjdGlvbikgLT5cclxuICAgICMgSW4gTElOS1MgbW9kZSwgYWxsIGxpbmtzIGFzc29jaWF0ZWQgd2l0aCB0aGUgbnVtYmVyIGFyZSBzaG93bi4gQ0xFQVIgc2hvd3Mgbm90aGluZy5cclxuICAgIGlmIEBtb2RlIGlzIE1vZGVUeXBlLkxJTktTXHJcbiAgICAgIGlmIChhY3Rpb24udmFsdWUgPT0gQ0xFQVIpXHJcbiAgICAgICAgQHBlblZhbHVlID0gTk9ORVxyXG4gICAgICAgIEBzdHJvbmdMaW5rcyA9IFtdXHJcbiAgICAgICAgQHdlYWtMaW5rcyA9IFtdXHJcbiAgICAgIGVsc2VcclxuICAgICAgICBAcGVuVmFsdWUgPSBhY3Rpb24udmFsdWVcclxuICAgICAgICB7IHN0cm9uZzogQHN0cm9uZ0xpbmtzLCB3ZWFrOiBAd2Vha0xpbmtzIH0gPSBAZ2FtZS5nZXRMaW5rcyhhY3Rpb24udmFsdWUpXHJcblxyXG4gICAgIyBJbiBQRU5DSUwgbW9kZSwgdGhlIG1vZGUgaXMgY2hhbmdlZCB0byBISUdITElHSFRJTkcgaWYgdGhlIHNlbGVjdGVkIHZhbHVlIGlzIGFscmVhZHkgY3VycmVudFxyXG4gICAgZWxzZSBpZiBAbW9kZSBpcyBNb2RlVHlwZS5QRU5DSUwgYW5kIChAcGVuVmFsdWUgPT0gYWN0aW9uLnZhbHVlKVxyXG4gICAgICBAbW9kZSA9IE1vZGVUeXBlLkhJR0hMSUdIVElOR1xyXG4gICAgICBAcGVuVmFsdWUgPSBOT05FXHJcblxyXG4gICAgIyBPdGhlcndpc2UsIHRoZSBtb2RlIGlzIHN3aXRjaGVkIHRvIChvciByZW1haW5zIGFzKSBQRU5DSUwgdXNpbmcgdGhlIHNlbGVjdGVkIHZhbHVlXHJcbiAgICBlbHNlXHJcbiAgICAgIEBtb2RlID0gTW9kZVR5cGUuUEVOQ0lMXHJcbiAgICAgIEBwZW5WYWx1ZSA9IGFjdGlvbi52YWx1ZVxyXG5cclxuICAgICAgIyBNYWtlIHN1cmUgYW55IGhpZ2hsaWdodGluZyBpcyBvZmYgYW5kIGxpbmtzIGFyZSBjbGVhcmVkLlxyXG4gICAgICBAaGlnaGxpZ2h0WCA9IC0xXHJcbiAgICAgIEBoaWdobGlnaHRZID0gLTFcclxuICAgICAgQHN0cm9uZ0xpbmtzID0gW11cclxuICAgICAgQHdlYWtMaW5rcyA9IFtdXHJcblxyXG4gIGhhbmRsZVBlbkFjdGlvbjogKGFjdGlvbikgLT5cclxuICAgICMgSWdub3JlZCBpbiBMSU5LUyBtb2RlXHJcbiAgICBpZiBAbW9kZSBpcyBNb2RlVHlwZS5MSU5LU1xyXG4gICAgICByZXR1cm5cclxuXHJcbiAgICAjIEluIFBFTiBtb2RlLCB0aGUgbW9kZSBpcyBjaGFuZ2VkIHRvIEhJR0hMSUdIVElORyBpZiB0aGUgc2VsZWN0ZWQgdmFsdWUgaXMgYWxyZWFkeSBjdXJyZW50XHJcbiAgICBpZiBAbW9kZSBpcyBNb2RlVHlwZS5QRU4gYW5kIChAcGVuVmFsdWUgPT0gYWN0aW9uLnZhbHVlKVxyXG4gICAgICBAbW9kZSA9IE1vZGVUeXBlLkhJR0hMSUdIVElOR1xyXG4gICAgICBAcGVuVmFsdWUgPSBOT05FXHJcblxyXG4gICAgIyBPdGhlcndpc2UsIHRoZSBtb2RlIGlzIHN3aXRjaGVkIHRvIChvciByZW1haW5zIGFzKSBQRU4gdXNpbmcgdGhlIHNlbGVjdGVkIHZhbHVlXHJcbiAgICBlbHNlXHJcbiAgICAgIEBtb2RlID0gTW9kZVR5cGUuUEVOXHJcbiAgICAgIEBwZW5WYWx1ZSA9IGFjdGlvbi52YWx1ZVxyXG5cclxuICAgICAgIyBNYWtlIHN1cmUgYW55IGhpZ2hsaWdodGluZyBpcyBvZmYgYW5kIGxpbmtzIGFyZSBjbGVhcmVkLlxyXG4gICAgQGhpZ2hsaWdodFggPSAtMVxyXG4gICAgQGhpZ2hsaWdodFkgPSAtMVxyXG4gICAgQHN0cm9uZ0xpbmtzID0gW11cclxuICAgIEB3ZWFrTGlua3MgPSBbXVxyXG5cclxuICBoYW5kbGVVbmRvQWN0aW9uOiAtPlxyXG4gICAgcmV0dXJuIEBnYW1lLnVuZG8oKSBpZiBAbW9kZSBpc250IE1vZGVUeXBlLkxJTktTXHJcbiAgICBcclxuICBoYW5kbGVSZWRvQWN0aW9uOiAtPlxyXG4gICAgcmV0dXJuIEBnYW1lLnJlZG8oKSBpZiBAbW9kZSBpc250IE1vZGVUeXBlLkxJTktTXHJcbiAgICBcclxuICBoYW5kbGVNb2RlQWN0aW9uOiAtPlxyXG4gICAgc3dpdGNoIEBtb2RlXHJcbiAgICAgIHdoZW4gTW9kZVR5cGUuSElHSExJR0hUSU5HXHJcbiAgICAgICAgQG1vZGUgPSBNb2RlVHlwZS5MSU5LU1xyXG4gICAgICB3aGVuIE1vZGVUeXBlLlBFTkNJTFxyXG4gICAgICAgIEBtb2RlID0gTW9kZVR5cGUuUEVOXHJcbiAgICAgIHdoZW4gTW9kZVR5cGUuUEVOXHJcbiAgICAgICAgQG1vZGUgPSBNb2RlVHlwZS5ISUdITElHSFRJTkdcclxuICAgICAgd2hlbiBNb2RlVHlwZS5MSU5LU1xyXG4gICAgICAgIEBtb2RlID0gTW9kZVR5cGUuUEVOQ0lMXHJcbiAgICBAaGlnaGxpZ2h0WCA9IC0xXHJcbiAgICBAaGlnaGxpZ2h0WSA9IC0xXHJcbiAgICBAcGVuVmFsdWUgPSBOT05FXHJcbiAgICBAc3Ryb25nTGlua3MgPSBbXVxyXG4gICAgQHdlYWtMaW5rcyA9IFtdXHJcbiAgICBcclxuICBjbGljazogKHgsIHkpIC0+XHJcbiAgICAjIGNvbnNvbGUubG9nIFwiY2xpY2sgI3t4fSwgI3t5fVwiXHJcbiAgICB4ID0gTWF0aC5mbG9vcih4IC8gQGNlbGxTaXplKVxyXG4gICAgeSA9IE1hdGguZmxvb3IoeSAvIEBjZWxsU2l6ZSlcclxuXHJcbiAgICBmbGFzaFggPSBudWxsXHJcbiAgICBmbGFzaFkgPSBudWxsXHJcbiAgICBpZiAoeCA8IDkpICYmICh5IDwgMTUpXHJcbiAgICAgICAgaW5kZXggPSAoeSAqIDkpICsgeFxyXG4gICAgICAgIGFjdGlvbiA9IEBhY3Rpb25zW2luZGV4XVxyXG4gICAgICAgIGlmIGFjdGlvbiAhPSBudWxsXHJcbiAgICAgICAgICBjb25zb2xlLmxvZyBcIkFjdGlvbjogXCIsIGFjdGlvblxyXG5cclxuICAgICAgICAgIGlmIGFjdGlvbi50eXBlIGlzIEFjdGlvblR5cGUuTUVOVVxyXG4gICAgICAgICAgICBAYXBwLnN3aXRjaFZpZXcoXCJtZW51XCIpXHJcbiAgICAgICAgICAgIHJldHVyblxyXG5cclxuICAgICAgICAgIHN3aXRjaCBhY3Rpb24udHlwZSBcclxuICAgICAgICAgICAgd2hlbiBBY3Rpb25UeXBlLlNFTEVDVCB0aGVuIFsgZmxhc2hYLCBmbGFzaFkgXSA9IEBoYW5kbGVTZWxlY3RBY3Rpb24oYWN0aW9uKVxyXG4gICAgICAgICAgICB3aGVuIEFjdGlvblR5cGUuUEVOQ0lMIHRoZW4gQGhhbmRsZVBlbmNpbEFjdGlvbihhY3Rpb24pXHJcbiAgICAgICAgICAgIHdoZW4gQWN0aW9uVHlwZS5QRU4gdGhlbiBAaGFuZGxlUGVuQWN0aW9uKGFjdGlvbilcclxuICAgICAgICAgICAgd2hlbiBBY3Rpb25UeXBlLlVORE8gdGhlbiBbIGZsYXNoWCwgZmxhc2hZIF0gPSBAaGFuZGxlVW5kb0FjdGlvbigpXHJcbiAgICAgICAgICAgIHdoZW4gQWN0aW9uVHlwZS5SRURPIHRoZW4gWyBmbGFzaFgsIGZsYXNoWSBdID0gQGhhbmRsZVJlZG9BY3Rpb24oKVxyXG4gICAgICAgICAgICB3aGVuIEFjdGlvblR5cGUuTU9ERSB0aGVuIEBoYW5kbGVNb2RlQWN0aW9uKClcclxuICAgICAgICBlbHNlXHJcbiAgICAgICAgICAjIG5vIGFjdGlvbiwgZGVmYXVsdCB0byBoaWdobGlnaHRpbmcgbW9kZVxyXG4gICAgICAgICAgQG1vZGUgPSBNb2RlVHlwZS5ISUdITElHSFRJTkdcclxuICAgICAgICAgIEBoaWdobGlnaHRYID0gLTFcclxuICAgICAgICAgIEBoaWdobGlnaHRZID0gLTFcclxuICAgICAgICAgIEBwZW5WYWx1ZSA9IE5PTkVcclxuICAgICAgICAgIEBzdHJvbmdMaW5rcyA9IFtdXHJcbiAgICAgICAgICBAd2Vha0xpbmtzID0gW11cclxuXHJcbiAgICAgICAgQGRyYXcoZmxhc2hYLCBmbGFzaFkpXHJcbiAgICAgICAgaWYgKGZsYXNoWD8gJiYgZmxhc2hZPylcclxuICAgICAgICAgIHNldFRpbWVvdXQgPT5cclxuICAgICAgICAgICAgQGRyYXcoKVxyXG4gICAgICAgICAgLCAzM1xyXG5cclxuICAjIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAjIEhlbHBlcnNcclxuXHJcbiAgY29uZmxpY3RzOiAoeDEsIHkxLCB4MiwgeTIpIC0+XHJcbiAgICAjIHNhbWUgcm93IG9yIGNvbHVtbj9cclxuICAgIGlmICh4MSA9PSB4MikgfHwgKHkxID09IHkyKVxyXG4gICAgICByZXR1cm4gdHJ1ZVxyXG5cclxuICAgICMgc2FtZSBzZWN0aW9uP1xyXG4gICAgc3gxID0gTWF0aC5mbG9vcih4MSAvIDMpICogM1xyXG4gICAgc3kxID0gTWF0aC5mbG9vcih5MSAvIDMpICogM1xyXG4gICAgc3gyID0gTWF0aC5mbG9vcih4MiAvIDMpICogM1xyXG4gICAgc3kyID0gTWF0aC5mbG9vcih5MiAvIDMpICogM1xyXG4gICAgaWYgKHN4MSA9PSBzeDIpICYmIChzeTEgPT0gc3kyKVxyXG4gICAgICByZXR1cm4gdHJ1ZVxyXG5cclxuICAgIHJldHVybiBmYWxzZVxyXG5cclxuICAjIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gU3Vkb2t1Vmlld1xyXG4iLCJBcHAgPSByZXF1aXJlICcuL0FwcCdcclxuXHJcbmluaXQgPSAtPlxyXG4gIGNvbnNvbGUubG9nIFwiaW5pdFwiXHJcbiAgY2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImNhbnZhc1wiKVxyXG4gIGNhbnZhcy53aWR0aCA9IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGllbnRXaWR0aFxyXG4gIGNhbnZhcy5oZWlnaHQgPSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50SGVpZ2h0XHJcbiAgZG9jdW1lbnQuYm9keS5pbnNlcnRCZWZvcmUoY2FudmFzLCBkb2N1bWVudC5ib2R5LmNoaWxkTm9kZXNbMF0pXHJcbiAgY2FudmFzUmVjdCA9IGNhbnZhcy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKVxyXG5cclxuICB3aW5kb3cuYXBwID0gbmV3IEFwcChjYW52YXMpXHJcblxyXG4gICMgY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIgXCJ0b3VjaHN0YXJ0XCIsIChlKSAtPlxyXG4gICMgICBjb25zb2xlLmxvZyBPYmplY3Qua2V5cyhlLnRvdWNoZXNbMF0pXHJcbiAgIyAgIHggPSBlLnRvdWNoZXNbMF0uY2xpZW50WCAtIGNhbnZhc1JlY3QubGVmdFxyXG4gICMgICB5ID0gZS50b3VjaGVzWzBdLmNsaWVudFkgLSBjYW52YXNSZWN0LnRvcFxyXG4gICMgICB3aW5kb3cuYXBwLmNsaWNrKHgsIHkpXHJcblxyXG4gIGNhbnZhcy5hZGRFdmVudExpc3RlbmVyIFwibW91c2Vkb3duXCIsIChlKSAtPlxyXG4gICAgeCA9IGUuY2xpZW50WCAtIGNhbnZhc1JlY3QubGVmdFxyXG4gICAgeSA9IGUuY2xpZW50WSAtIGNhbnZhc1JlY3QudG9wXHJcbiAgICB3aW5kb3cuYXBwLmNsaWNrKHgsIHkpXHJcblxyXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsIChlKSAtPlxyXG4gICAgaW5pdCgpXHJcbiwgZmFsc2UpXHJcbiIsIm1vZHVsZS5leHBvcnRzID0gXCIwLjAuMTFcIiIsIi8qIEZvbnQgRmFjZSBPYnNlcnZlciB2Mi4wLjEzIC0gwqkgQnJhbSBTdGVpbi4gTGljZW5zZTogQlNELTMtQ2xhdXNlICovKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gbChhLGIpe2RvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXI/YS5hZGRFdmVudExpc3RlbmVyKFwic2Nyb2xsXCIsYiwhMSk6YS5hdHRhY2hFdmVudChcInNjcm9sbFwiLGIpfWZ1bmN0aW9uIG0oYSl7ZG9jdW1lbnQuYm9keT9hKCk6ZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcj9kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwiRE9NQ29udGVudExvYWRlZFwiLGZ1bmN0aW9uIGMoKXtkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKFwiRE9NQ29udGVudExvYWRlZFwiLGMpO2EoKX0pOmRvY3VtZW50LmF0dGFjaEV2ZW50KFwib25yZWFkeXN0YXRlY2hhbmdlXCIsZnVuY3Rpb24gaygpe2lmKFwiaW50ZXJhY3RpdmVcIj09ZG9jdW1lbnQucmVhZHlTdGF0ZXx8XCJjb21wbGV0ZVwiPT1kb2N1bWVudC5yZWFkeVN0YXRlKWRvY3VtZW50LmRldGFjaEV2ZW50KFwib25yZWFkeXN0YXRlY2hhbmdlXCIsayksYSgpfSl9O2Z1bmN0aW9uIHIoYSl7dGhpcy5hPWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7dGhpcy5hLnNldEF0dHJpYnV0ZShcImFyaWEtaGlkZGVuXCIsXCJ0cnVlXCIpO3RoaXMuYS5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShhKSk7dGhpcy5iPWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpO3RoaXMuYz1kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTt0aGlzLmg9ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIik7dGhpcy5mPWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpO3RoaXMuZz0tMTt0aGlzLmIuc3R5bGUuY3NzVGV4dD1cIm1heC13aWR0aDpub25lO2Rpc3BsYXk6aW5saW5lLWJsb2NrO3Bvc2l0aW9uOmFic29sdXRlO2hlaWdodDoxMDAlO3dpZHRoOjEwMCU7b3ZlcmZsb3c6c2Nyb2xsO2ZvbnQtc2l6ZToxNnB4O1wiO3RoaXMuYy5zdHlsZS5jc3NUZXh0PVwibWF4LXdpZHRoOm5vbmU7ZGlzcGxheTppbmxpbmUtYmxvY2s7cG9zaXRpb246YWJzb2x1dGU7aGVpZ2h0OjEwMCU7d2lkdGg6MTAwJTtvdmVyZmxvdzpzY3JvbGw7Zm9udC1zaXplOjE2cHg7XCI7XG50aGlzLmYuc3R5bGUuY3NzVGV4dD1cIm1heC13aWR0aDpub25lO2Rpc3BsYXk6aW5saW5lLWJsb2NrO3Bvc2l0aW9uOmFic29sdXRlO2hlaWdodDoxMDAlO3dpZHRoOjEwMCU7b3ZlcmZsb3c6c2Nyb2xsO2ZvbnQtc2l6ZToxNnB4O1wiO3RoaXMuaC5zdHlsZS5jc3NUZXh0PVwiZGlzcGxheTppbmxpbmUtYmxvY2s7d2lkdGg6MjAwJTtoZWlnaHQ6MjAwJTtmb250LXNpemU6MTZweDttYXgtd2lkdGg6bm9uZTtcIjt0aGlzLmIuYXBwZW5kQ2hpbGQodGhpcy5oKTt0aGlzLmMuYXBwZW5kQ2hpbGQodGhpcy5mKTt0aGlzLmEuYXBwZW5kQ2hpbGQodGhpcy5iKTt0aGlzLmEuYXBwZW5kQ2hpbGQodGhpcy5jKX1cbmZ1bmN0aW9uIHQoYSxiKXthLmEuc3R5bGUuY3NzVGV4dD1cIm1heC13aWR0aDpub25lO21pbi13aWR0aDoyMHB4O21pbi1oZWlnaHQ6MjBweDtkaXNwbGF5OmlubGluZS1ibG9jaztvdmVyZmxvdzpoaWRkZW47cG9zaXRpb246YWJzb2x1dGU7d2lkdGg6YXV0bzttYXJnaW46MDtwYWRkaW5nOjA7dG9wOi05OTlweDt3aGl0ZS1zcGFjZTpub3dyYXA7Zm9udC1zeW50aGVzaXM6bm9uZTtmb250OlwiK2IrXCI7XCJ9ZnVuY3Rpb24geShhKXt2YXIgYj1hLmEub2Zmc2V0V2lkdGgsYz1iKzEwMDthLmYuc3R5bGUud2lkdGg9YytcInB4XCI7YS5jLnNjcm9sbExlZnQ9YzthLmIuc2Nyb2xsTGVmdD1hLmIuc2Nyb2xsV2lkdGgrMTAwO3JldHVybiBhLmchPT1iPyhhLmc9YiwhMCk6ITF9ZnVuY3Rpb24geihhLGIpe2Z1bmN0aW9uIGMoKXt2YXIgYT1rO3koYSkmJmEuYS5wYXJlbnROb2RlJiZiKGEuZyl9dmFyIGs9YTtsKGEuYixjKTtsKGEuYyxjKTt5KGEpfTtmdW5jdGlvbiBBKGEsYil7dmFyIGM9Ynx8e307dGhpcy5mYW1pbHk9YTt0aGlzLnN0eWxlPWMuc3R5bGV8fFwibm9ybWFsXCI7dGhpcy53ZWlnaHQ9Yy53ZWlnaHR8fFwibm9ybWFsXCI7dGhpcy5zdHJldGNoPWMuc3RyZXRjaHx8XCJub3JtYWxcIn12YXIgQj1udWxsLEM9bnVsbCxFPW51bGwsRj1udWxsO2Z1bmN0aW9uIEcoKXtpZihudWxsPT09QylpZihKKCkmJi9BcHBsZS8udGVzdCh3aW5kb3cubmF2aWdhdG9yLnZlbmRvcikpe3ZhciBhPS9BcHBsZVdlYktpdFxcLyhbMC05XSspKD86XFwuKFswLTldKykpKD86XFwuKFswLTldKykpLy5leGVjKHdpbmRvdy5uYXZpZ2F0b3IudXNlckFnZW50KTtDPSEhYSYmNjAzPnBhcnNlSW50KGFbMV0sMTApfWVsc2UgQz0hMTtyZXR1cm4gQ31mdW5jdGlvbiBKKCl7bnVsbD09PUYmJihGPSEhZG9jdW1lbnQuZm9udHMpO3JldHVybiBGfVxuZnVuY3Rpb24gSygpe2lmKG51bGw9PT1FKXt2YXIgYT1kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO3RyeXthLnN0eWxlLmZvbnQ9XCJjb25kZW5zZWQgMTAwcHggc2Fucy1zZXJpZlwifWNhdGNoKGIpe31FPVwiXCIhPT1hLnN0eWxlLmZvbnR9cmV0dXJuIEV9ZnVuY3Rpb24gTChhLGIpe3JldHVyblthLnN0eWxlLGEud2VpZ2h0LEsoKT9hLnN0cmV0Y2g6XCJcIixcIjEwMHB4XCIsYl0uam9pbihcIiBcIil9XG5BLnByb3RvdHlwZS5sb2FkPWZ1bmN0aW9uKGEsYil7dmFyIGM9dGhpcyxrPWF8fFwiQkVTYnN3eVwiLHE9MCxEPWJ8fDNFMyxIPShuZXcgRGF0ZSkuZ2V0VGltZSgpO3JldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihhLGIpe2lmKEooKSYmIUcoKSl7dmFyIE09bmV3IFByb21pc2UoZnVuY3Rpb24oYSxiKXtmdW5jdGlvbiBlKCl7KG5ldyBEYXRlKS5nZXRUaW1lKCktSD49RD9iKCk6ZG9jdW1lbnQuZm9udHMubG9hZChMKGMsJ1wiJytjLmZhbWlseSsnXCInKSxrKS50aGVuKGZ1bmN0aW9uKGMpezE8PWMubGVuZ3RoP2EoKTpzZXRUaW1lb3V0KGUsMjUpfSxmdW5jdGlvbigpe2IoKX0pfWUoKX0pLE49bmV3IFByb21pc2UoZnVuY3Rpb24oYSxjKXtxPXNldFRpbWVvdXQoYyxEKX0pO1Byb21pc2UucmFjZShbTixNXSkudGhlbihmdW5jdGlvbigpe2NsZWFyVGltZW91dChxKTthKGMpfSxmdW5jdGlvbigpe2IoYyl9KX1lbHNlIG0oZnVuY3Rpb24oKXtmdW5jdGlvbiB1KCl7dmFyIGI7aWYoYj0tMSE9XG5mJiYtMSE9Z3x8LTEhPWYmJi0xIT1ofHwtMSE9ZyYmLTEhPWgpKGI9ZiE9ZyYmZiE9aCYmZyE9aCl8fChudWxsPT09QiYmKGI9L0FwcGxlV2ViS2l0XFwvKFswLTldKykoPzpcXC4oWzAtOV0rKSkvLmV4ZWMod2luZG93Lm5hdmlnYXRvci51c2VyQWdlbnQpLEI9ISFiJiYoNTM2PnBhcnNlSW50KGJbMV0sMTApfHw1MzY9PT1wYXJzZUludChiWzFdLDEwKSYmMTE+PXBhcnNlSW50KGJbMl0sMTApKSksYj1CJiYoZj09diYmZz09diYmaD09dnx8Zj09dyYmZz09dyYmaD09d3x8Zj09eCYmZz09eCYmaD09eCkpLGI9IWI7YiYmKGQucGFyZW50Tm9kZSYmZC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGQpLGNsZWFyVGltZW91dChxKSxhKGMpKX1mdW5jdGlvbiBJKCl7aWYoKG5ldyBEYXRlKS5nZXRUaW1lKCktSD49RClkLnBhcmVudE5vZGUmJmQucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChkKSxiKGMpO2Vsc2V7dmFyIGE9ZG9jdW1lbnQuaGlkZGVuO2lmKCEwPT09YXx8dm9pZCAwPT09YSlmPWUuYS5vZmZzZXRXaWR0aCxcbmc9bi5hLm9mZnNldFdpZHRoLGg9cC5hLm9mZnNldFdpZHRoLHUoKTtxPXNldFRpbWVvdXQoSSw1MCl9fXZhciBlPW5ldyByKGspLG49bmV3IHIoaykscD1uZXcgcihrKSxmPS0xLGc9LTEsaD0tMSx2PS0xLHc9LTEseD0tMSxkPWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7ZC5kaXI9XCJsdHJcIjt0KGUsTChjLFwic2Fucy1zZXJpZlwiKSk7dChuLEwoYyxcInNlcmlmXCIpKTt0KHAsTChjLFwibW9ub3NwYWNlXCIpKTtkLmFwcGVuZENoaWxkKGUuYSk7ZC5hcHBlbmRDaGlsZChuLmEpO2QuYXBwZW5kQ2hpbGQocC5hKTtkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGQpO3Y9ZS5hLm9mZnNldFdpZHRoO3c9bi5hLm9mZnNldFdpZHRoO3g9cC5hLm9mZnNldFdpZHRoO0koKTt6KGUsZnVuY3Rpb24oYSl7Zj1hO3UoKX0pO3QoZSxMKGMsJ1wiJytjLmZhbWlseSsnXCIsc2Fucy1zZXJpZicpKTt6KG4sZnVuY3Rpb24oYSl7Zz1hO3UoKX0pO3QobixMKGMsJ1wiJytjLmZhbWlseSsnXCIsc2VyaWYnKSk7XG56KHAsZnVuY3Rpb24oYSl7aD1hO3UoKX0pO3QocCxMKGMsJ1wiJytjLmZhbWlseSsnXCIsbW9ub3NwYWNlJykpfSl9KX07XCJvYmplY3RcIj09PXR5cGVvZiBtb2R1bGU/bW9kdWxlLmV4cG9ydHM9QTood2luZG93LkZvbnRGYWNlT2JzZXJ2ZXI9QSx3aW5kb3cuRm9udEZhY2VPYnNlcnZlci5wcm90b3R5cGUubG9hZD1BLnByb3RvdHlwZS5sb2FkKTt9KCkpO1xuIl19
