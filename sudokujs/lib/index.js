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
    this.ctx.moveTo(x1, y1);
    this.ctx.arcTo(Q.x, Q.y, x2, y2, radius);
    this.ctx.stroke();
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
    return this.app.drawArc(x1, y1, x2, y2, r, color, lineWidth);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJnYW1lXFxzcmNcXEFwcC5jb2ZmZWUiLCJnYW1lXFxzcmNcXE1lbnVWaWV3LmNvZmZlZSIsImdhbWVcXHNyY1xcU3Vkb2t1R2FtZS5jb2ZmZWUiLCJnYW1lXFxzcmNcXFN1ZG9rdUdlbmVyYXRvci5jb2ZmZWUiLCJnYW1lXFxzcmNcXFN1ZG9rdVZpZXcuY29mZmVlIiwiZ2FtZVxcc3JjXFxtYWluLmNvZmZlZSIsImdhbWVcXHNyY1xcdmVyc2lvbi5jb2ZmZWUiLCJub2RlX21vZHVsZXMvZm9udGZhY2VvYnNlcnZlci9mb250ZmFjZW9ic2VydmVyLnN0YW5kYWxvbmUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQSxJQUFBOztBQUFBLGdCQUFBLEdBQW1CLE9BQUEsQ0FBUSxrQkFBUjs7QUFFbkIsUUFBQSxHQUFXLE9BQUEsQ0FBUSxZQUFSOztBQUNYLFVBQUEsR0FBYSxPQUFBLENBQVEsY0FBUjs7QUFDYixPQUFBLEdBQVUsT0FBQSxDQUFRLFdBQVI7O0FBRUo7RUFDUyxhQUFDLE1BQUQ7SUFBQyxJQUFDLENBQUEsU0FBRDtJQUNaLElBQUMsQ0FBQSxHQUFELEdBQU8sSUFBQyxDQUFBLE1BQU0sQ0FBQyxVQUFSLENBQW1CLElBQW5CO0lBQ1AsSUFBQyxDQUFBLFFBQUQsQ0FBVSxTQUFWO0lBQ0EsSUFBQyxDQUFBLEtBQUQsR0FBUztJQUVULElBQUMsQ0FBQSxpQkFBRCxHQUFxQixJQUFJLENBQUMsS0FBTCxDQUFXLElBQUMsQ0FBQSxNQUFNLENBQUMsTUFBUixHQUFpQixJQUE1QjtJQUNyQixJQUFDLENBQUEsV0FBRCxHQUFlLElBQUMsQ0FBQSxZQUFELENBQWMsU0FBZCxFQUE0QixJQUFDLENBQUEsaUJBQUYsR0FBb0IsdUJBQS9DO0lBRWYsSUFBQyxDQUFBLG9CQUFELEdBQXdCLElBQUksQ0FBQyxLQUFMLENBQVcsSUFBQyxDQUFBLE1BQU0sQ0FBQyxNQUFSLEdB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Q0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIkZvbnRGYWNlT2JzZXJ2ZXIgPSByZXF1aXJlICdmb250ZmFjZW9ic2VydmVyJ1xyXG5cclxuTWVudVZpZXcgPSByZXF1aXJlICcuL01lbnVWaWV3J1xyXG5TdWRva3VWaWV3ID0gcmVxdWlyZSAnLi9TdWRva3VWaWV3J1xyXG52ZXJzaW9uID0gcmVxdWlyZSAnLi92ZXJzaW9uJ1xyXG5cclxuY2xhc3MgQXBwXHJcbiAgY29uc3RydWN0b3I6IChAY2FudmFzKSAtPlxyXG4gICAgQGN0eCA9IEBjYW52YXMuZ2V0Q29udGV4dChcIjJkXCIpXHJcbiAgICBAbG9hZEZvbnQoXCJzYXhNb25vXCIpXHJcbiAgICBAZm9udHMgPSB7fVxyXG5cclxuICAgIEB2ZXJzaW9uRm9udEhlaWdodCA9IE1hdGguZmxvb3IoQGNhbnZhcy5oZWlnaHQgKiAwLjAyKVxyXG4gICAgQHZlcnNpb25Gb250ID0gQHJlZ2lzdGVyRm9udChcInZlcnNpb25cIiwgXCIje0B2ZXJzaW9uRm9udEhlaWdodH1weCBzYXhNb25vLCBtb25vc3BhY2VcIilcclxuXHJcbiAgICBAZ2VuZXJhdGluZ0ZvbnRIZWlnaHQgPSBNYXRoLmZsb29yKEBjYW52YXMuaGVpZ2h0ICogMC4wNClcclxuICAgIEBnZW5lcmF0aW5nRm9udCA9IEByZWdpc3RlckZvbnQoXCJnZW5lcmF0aW5nXCIsIFwiI3tAZ2VuZXJhdGluZ0ZvbnRIZWlnaHR9cHggc2F4TW9ubywgbW9ub3NwYWNlXCIpXHJcblxyXG4gICAgQHZpZXdzID1cclxuICAgICAgbWVudTogbmV3IE1lbnVWaWV3KHRoaXMsIEBjYW52YXMpXHJcbiAgICAgIHN1ZG9rdTogbmV3IFN1ZG9rdVZpZXcodGhpcywgQGNhbnZhcylcclxuICAgIEBzd2l0Y2hWaWV3KFwic3Vkb2t1XCIpXHJcblxyXG4gIG1lYXN1cmVGb250czogLT5cclxuICAgIGZvciBmb250TmFtZSwgZiBvZiBAZm9udHNcclxuICAgICAgQGN0eC5mb250ID0gZi5zdHlsZVxyXG4gICAgICBAY3R4LmZpbGxTdHlsZSA9IFwiYmxhY2tcIlxyXG4gICAgICBAY3R4LnRleHRBbGlnbiA9IFwiY2VudGVyXCJcclxuICAgICAgZi5oZWlnaHQgPSBNYXRoLmZsb29yKEBjdHgubWVhc3VyZVRleHQoXCJtXCIpLndpZHRoICogMS4xKSAjIGJlc3QgaGFjayBldmVyXHJcbiAgICAgIGNvbnNvbGUubG9nIFwiRm9udCAje2ZvbnROYW1lfSBtZWFzdXJlZCBhdCAje2YuaGVpZ2h0fSBwaXhlbHNcIlxyXG4gICAgcmV0dXJuXHJcblxyXG4gIHJlZ2lzdGVyRm9udDogKG5hbWUsIHN0eWxlKSAtPlxyXG4gICAgZm9udCA9XHJcbiAgICAgIG5hbWU6IG5hbWVcclxuICAgICAgc3R5bGU6IHN0eWxlXHJcbiAgICAgIGhlaWdodDogMFxyXG4gICAgQGZvbnRzW25hbWVdID0gZm9udFxyXG4gICAgQG1lYXN1cmVGb250cygpXHJcbiAgICByZXR1cm4gZm9udFxyXG5cclxuICBsb2FkRm9udDogKGZvbnROYW1lKSAtPlxyXG4gICAgZm9udCA9IG5ldyBGb250RmFjZU9ic2VydmVyKGZvbnROYW1lKVxyXG4gICAgZm9udC5sb2FkKCkudGhlbiA9PlxyXG4gICAgICBjb25zb2xlLmxvZyhcIiN7Zm9udE5hbWV9IGxvYWRlZCwgcmVkcmF3aW5nLi4uXCIpXHJcbiAgICAgIEBtZWFzdXJlRm9udHMoKVxyXG4gICAgICBAZHJhdygpXHJcblxyXG4gIHN3aXRjaFZpZXc6ICh2aWV3KSAtPlxyXG4gICAgQHZpZXcgPSBAdmlld3Nbdmlld11cclxuICAgIEBkcmF3KClcclxuXHJcbiAgbmV3R2FtZTogKGRpZmZpY3VsdHkpIC0+XHJcbiAgICAjIGNvbnNvbGUubG9nIFwiYXBwLm5ld0dhbWUoI3tkaWZmaWN1bHR5fSlcIlxyXG5cclxuICAgICMgQGRyYXdGaWxsKDAsIDAsIEBjYW52YXMud2lkdGgsIEBjYW52YXMuaGVpZ2h0LCBcIiM0NDQ0NDRcIilcclxuICAgICMgQGRyYXdUZXh0Q2VudGVyZWQoXCJHZW5lcmF0aW5nLCBwbGVhc2Ugd2FpdC4uLlwiLCBAY2FudmFzLndpZHRoIC8gMiwgQGNhbnZhcy5oZWlnaHQgLyAyLCBAZ2VuZXJhdGluZ0ZvbnQsIFwiI2ZmZmZmZlwiKVxyXG5cclxuICAgICMgd2luZG93LnNldFRpbWVvdXQgPT5cclxuICAgIEB2aWV3cy5zdWRva3UubmV3R2FtZShkaWZmaWN1bHR5KVxyXG4gICAgQHN3aXRjaFZpZXcoXCJzdWRva3VcIilcclxuICAgICMgLCAwXHJcblxyXG4gIHJlc2V0OiAtPlxyXG4gICAgQHZpZXdzLnN1ZG9rdS5yZXNldCgpXHJcbiAgICBAc3dpdGNoVmlldyhcInN1ZG9rdVwiKVxyXG5cclxuICBpbXBvcnQ6IChpbXBvcnRTdHJpbmcpIC0+XHJcbiAgICByZXR1cm4gQHZpZXdzLnN1ZG9rdS5pbXBvcnQoaW1wb3J0U3RyaW5nKVxyXG5cclxuICBleHBvcnQ6IC0+XHJcbiAgICByZXR1cm4gQHZpZXdzLnN1ZG9rdS5leHBvcnQoKVxyXG5cclxuICBob2xlQ291bnQ6IC0+XHJcbiAgICByZXR1cm4gQHZpZXdzLnN1ZG9rdS5ob2xlQ291bnQoKVxyXG5cclxuICBkcmF3OiAtPlxyXG4gICAgQHZpZXcuZHJhdygpXHJcblxyXG4gIGNsaWNrOiAoeCwgeSkgLT5cclxuICAgIEB2aWV3LmNsaWNrKHgsIHkpXHJcblxyXG4gIGRyYXdGaWxsOiAoeCwgeSwgdywgaCwgY29sb3IpIC0+XHJcbiAgICBAY3R4LmJlZ2luUGF0aCgpXHJcbiAgICBAY3R4LnJlY3QoeCwgeSwgdywgaClcclxuICAgIEBjdHguZmlsbFN0eWxlID0gY29sb3JcclxuICAgIEBjdHguZmlsbCgpXHJcblxyXG4gIGRyYXdSb3VuZGVkUmVjdDogKHgsIHksIHcsIGgsIHIsIGZpbGxDb2xvciA9IG51bGwsIHN0cm9rZUNvbG9yID0gbnVsbCkgLT5cclxuICAgIEBjdHgucm91bmRSZWN0KHgsIHksIHcsIGgsIHIpXHJcbiAgICBpZiBmaWxsQ29sb3IgIT0gbnVsbFxyXG4gICAgICBAY3R4LmZpbGxTdHlsZSA9IGZpbGxDb2xvclxyXG4gICAgICBAY3R4LmZpbGwoKVxyXG4gICAgaWYgc3Ryb2tlQ29sb3IgIT0gbnVsbFxyXG4gICAgICBAY3R4LnN0cm9rZVN0eWxlID0gc3Ryb2tlQ29sb3JcclxuICAgICAgQGN0eC5zdHJva2UoKVxyXG4gICAgcmV0dXJuXHJcblxyXG4gIGRyYXdSZWN0OiAoeCwgeSwgdywgaCwgY29sb3IsIGxpbmVXaWR0aCA9IDEpIC0+XHJcbiAgICBAY3R4LmJlZ2luUGF0aCgpXHJcbiAgICBAY3R4LnN0cm9rZVN0eWxlID0gY29sb3JcclxuICAgIEBjdHgubGluZVdpZHRoID0gbGluZVdpZHRoXHJcbiAgICBAY3R4LnJlY3QoeCwgeSwgdywgaClcclxuICAgIEBjdHguc3Ryb2tlKClcclxuXHJcbiAgZHJhd0xpbmU6ICh4MSwgeTEsIHgyLCB5MiwgY29sb3IgPSBcImJsYWNrXCIsIGxpbmVXaWR0aCA9IDEpIC0+XHJcbiAgICBAY3R4LmJlZ2luUGF0aCgpXHJcbiAgICBAY3R4LnN0cm9rZVN0eWxlID0gY29sb3JcclxuICAgIEBjdHgubGluZVdpZHRoID0gbGluZVdpZHRoXHJcbiAgICBAY3R4Lm1vdmVUbyh4MSwgeTEpXHJcbiAgICBAY3R4LmxpbmVUbyh4MiwgeTIpXHJcbiAgICBAY3R4LnN0cm9rZSgpXHJcblxyXG4gIGRyYXdUZXh0Q2VudGVyZWQ6ICh0ZXh0LCBjeCwgY3ksIGZvbnQsIGNvbG9yKSAtPlxyXG4gICAgQGN0eC5mb250ID0gZm9udC5zdHlsZVxyXG4gICAgQGN0eC5maWxsU3R5bGUgPSBjb2xvclxyXG4gICAgQGN0eC50ZXh0QWxpZ24gPSBcImNlbnRlclwiXHJcbiAgICBAY3R4LmZpbGxUZXh0KHRleHQsIGN4LCBjeSArIChmb250LmhlaWdodCAvIDIpKVxyXG5cclxuICBkcmF3TG93ZXJMZWZ0OiAodGV4dCwgY29sb3IgPSBcIndoaXRlXCIpIC0+XHJcbiAgICBAY3R4ID0gQGNhbnZhcy5nZXRDb250ZXh0KFwiMmRcIilcclxuICAgIEBjdHguZm9udCA9IEB2ZXJzaW9uRm9udC5zdHlsZVxyXG4gICAgQGN0eC5maWxsU3R5bGUgPSBjb2xvclxyXG4gICAgQGN0eC50ZXh0QWxpZ24gPSBcImxlZnRcIlxyXG4gICAgQGN0eC5maWxsVGV4dCh0ZXh0LCAwLCBAY2FudmFzLmhlaWdodCAtIChAdmVyc2lvbkZvbnQuaGVpZ2h0IC8gMikpXHJcblxyXG4gIGRyYXdWZXJzaW9uOiAoY29sb3IgPSBcIndoaXRlXCIpIC0+XHJcbiAgICBAY3R4ID0gQGNhbnZhcy5nZXRDb250ZXh0KFwiMmRcIilcclxuICAgIEBjdHguZm9udCA9IEB2ZXJzaW9uRm9udC5zdHlsZVxyXG4gICAgQGN0eC5maWxsU3R5bGUgPSBjb2xvclxyXG4gICAgQGN0eC50ZXh0QWxpZ24gPSBcInJpZ2h0XCJcclxuICAgIEBjdHguZmlsbFRleHQoXCJ2I3t2ZXJzaW9ufVwiLCBAY2FudmFzLndpZHRoIC0gKEB2ZXJzaW9uRm9udC5oZWlnaHQgLyAyKSwgQGNhbnZhcy5oZWlnaHQgLSAoQHZlcnNpb25Gb250LmhlaWdodCAvIDIpKVxyXG5cclxuICBkcmF3QXJjOiAoeDEsIHkxLCB4MiwgeTIsIHJhZGl1cywgY29sb3IsIGxpbmVXaWR0aCkgLT5cclxuICAgICMgRGVyaXZlZCBmcm9tIGh0dHBzOi8vZ2l0aHViLmNvbS9qYW1ib2xvL2RyYXdBcmMgYXQgNmMzZTBkM1xyXG5cclxuICAgIFAxID0geyB4OiB4MSwgeTogeTEgfVxyXG4gICAgUDIgPSB7IHg6IHgyLCB5OiB5MiB9XHJcblxyXG4gICAgIyBEZXRlcm1pbmUgdGhlIG1pZHBvaW50IChNKSBmcm9tIFAxIHRvIFAyXHJcbiAgICBNID1cclxuICAgICAgeDogKFAxLnggKyBQMi54KSAvIDJcclxuICAgICAgeTogKFAxLnkgKyBQMi55KSAvIDJcclxuXHJcbiAgICAjIERldGVybWluZSB0aGUgZGlzdGFuY2UgZnJvbSBNIHRvIFAxXHJcbiAgICBkTVAxID0gTWF0aC5zcXJ0KChQMS54IC0gTS54KSooUDEueCAtIE0ueCkgKyAoUDEueSAtIE0ueSkqKFAxLnkgLSBNLnkpKVxyXG5cclxuICAgICMgVmFsaWRhdGUgdGhlIHJhZGl1c1xyXG4gICAgaWYgbm90IHJhZGl1cz8gb3IgcmFkaXVzIDwgZE1QMVxyXG4gICAgICByYWRpdXMgPSBkTVAxXHJcblxyXG4gICAgIyBEZXRlcm1pbmUgdGhlIHVuaXQgdmVjdG9yIGZyb20gTSB0byBQMVxyXG4gICAgdU1QMSA9XHJcbiAgICAgIHg6IChQMS54IC0gTS54KSAvIGRNUDFcclxuICAgICAgeTogKFAxLnkgLSBNLnkpIC8gZE1QMVxyXG5cclxuICAgICMgRGV0ZXJtaW5lIHRoZSB1bml0IHZlY3RvciBmcm9tIE0gdG8gUSAoanVzdCB1TVAxIHJvdGF0ZWQgcGkvMilcclxuICAgIHVNUSA9IHsgeDogLXVNUDEueSwgeTogdU1QMS54IH1cclxuXHJcbiAgICAjIERldGVybWluZSB0aGUgZGlzdGFuY2UgZnJvbSB0aGUgY2VudGVyIG9mIHRoZSBjaXJjbGUgKEMpIHRvIE1cclxuICAgIGRDTSA9IE1hdGguc3FydChyYWRpdXMqcmFkaXVzIC0gZE1QMSpkTVAxKVxyXG5cclxuICAgICMgRGV0ZXJtaW5lIHRoZSBkaXN0YW5jZSBmcm9tIE0gdG8gUVxyXG4gICAgZE1RID0gZE1QMSAqIGRNUDEgLyBkQ01cclxuXHJcbiAgICAjIERldGVybWluZSB0aGUgbG9jYXRpb24gb2YgUVxyXG4gICAgUSA9XHJcbiAgICAgIHg6IE0ueCArIHVNUS54ICogZE1RXHJcbiAgICAgIHk6IE0ueSArIHVNUS55ICogZE1RXHJcblxyXG4gICAgQGN0eC5iZWdpblBhdGgoKVxyXG4gICAgQGN0eC5zdHJva2VTdHlsZSA9IGNvbG9yXHJcbiAgICBAY3R4LmxpbmVXaWR0aCA9IGxpbmVXaWR0aFxyXG4gICAgQGN0eC5tb3ZlVG8oeDEsIHkxKVxyXG4gICAgQGN0eC5hcmNUbyhRLngsIFEueSwgeDIsIHkyLCByYWRpdXMpXHJcbiAgICBAY3R4LnN0cm9rZSgpXHJcbiAgICByZXR1cm5cclxuXHJcbkNhbnZhc1JlbmRlcmluZ0NvbnRleHQyRC5wcm90b3R5cGUucm91bmRSZWN0ID0gKHgsIHksIHcsIGgsIHIpIC0+XHJcbiAgaWYgKHcgPCAyICogcikgdGhlbiByID0gdyAvIDJcclxuICBpZiAoaCA8IDIgKiByKSB0aGVuIHIgPSBoIC8gMlxyXG4gIEBiZWdpblBhdGgoKVxyXG4gIEBtb3ZlVG8oeCtyLCB5KVxyXG4gIEBhcmNUbyh4K3csIHksICAgeCt3LCB5K2gsIHIpXHJcbiAgQGFyY1RvKHgrdywgeStoLCB4LCAgIHkraCwgcilcclxuICBAYXJjVG8oeCwgICB5K2gsIHgsICAgeSwgICByKVxyXG4gIEBhcmNUbyh4LCAgIHksICAgeCt3LCB5LCAgIHIpXHJcbiAgQGNsb3NlUGF0aCgpXHJcbiAgcmV0dXJuIHRoaXNcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gQXBwXHJcbiIsIlN1ZG9rdUdlbmVyYXRvciA9IHJlcXVpcmUgJy4vU3Vkb2t1R2VuZXJhdG9yJ1xyXG5cclxuQlVUVE9OX0hFSUdIVCA9IDAuMDZcclxuRklSU1RfQlVUVE9OX1kgPSAwLjIyXHJcbkJVVFRPTl9TUEFDSU5HID0gMC4wOFxyXG5CVVRUT05fU0VQQVJBVE9SID0gMC4wM1xyXG5cclxuYnV0dG9uUG9zID0gKGluZGV4KSAtPlxyXG4gIHkgPSBGSVJTVF9CVVRUT05fWSArIChCVVRUT05fU1BBQ0lORyAqIGluZGV4KVxyXG4gIGlmIGluZGV4ID4gM1xyXG4gICAgeSArPSBCVVRUT05fU0VQQVJBVE9SXHJcbiAgaWYgaW5kZXggPiA0XHJcbiAgICB5ICs9IEJVVFRPTl9TRVBBUkFUT1JcclxuICBpZiBpbmRleCA+IDZcclxuICAgIHkgKz0gQlVUVE9OX1NFUEFSQVRPUlxyXG4gIHJldHVybiB5XHJcblxyXG5jbGFzcyBNZW51Vmlld1xyXG4gIGNvbnN0cnVjdG9yOiAoQGFwcCwgQGNhbnZhcykgLT5cclxuICAgIEBidXR0b25zID1cclxuICAgICAgbmV3RWFzeTpcclxuICAgICAgICB5OiBidXR0b25Qb3MoMClcclxuICAgICAgICB0ZXh0OiBcIk5ldyBHYW1lOiBFYXN5XCJcclxuICAgICAgICBiZ0NvbG9yOiBcIiMzMzc3MzNcIlxyXG4gICAgICAgIHRleHRDb2xvcjogXCIjZmZmZmZmXCJcclxuICAgICAgICBjbGljazogQG5ld0Vhc3kuYmluZCh0aGlzKVxyXG4gICAgICBuZXdNZWRpdW06XHJcbiAgICAgICAgeTogYnV0dG9uUG9zKDEpXHJcbiAgICAgICAgdGV4dDogXCJOZXcgR2FtZTogTWVkaXVtXCJcclxuICAgICAgICBiZ0NvbG9yOiBcIiM3Nzc3MzNcIlxyXG4gICAgICAgIHRleHRDb2xvcjogXCIjZmZmZmZmXCJcclxuICAgICAgICBjbGljazogQG5ld01lZGl1bS5iaW5kKHRoaXMpXHJcbiAgICAgIG5ld0hhcmQ6XHJcbiAgICAgICAgeTogYnV0dG9uUG9zKDIpXHJcbiAgICAgICAgdGV4dDogXCJOZXcgR2FtZTogSGFyZFwiXHJcbiAgICAgICAgYmdDb2xvcjogXCIjNzczMzMzXCJcclxuICAgICAgICB0ZXh0Q29sb3I6IFwiI2ZmZmZmZlwiXHJcbiAgICAgICAgY2xpY2s6IEBuZXdIYXJkLmJpbmQodGhpcylcclxuICAgICAgbmV3RXh0cmVtZTpcclxuICAgICAgICB5OiBidXR0b25Qb3MoMylcclxuICAgICAgICB0ZXh0OiBcIk5ldyBHYW1lOiBFeHRyZW1lXCJcclxuICAgICAgICBiZ0NvbG9yOiBcIiM3NzExMTFcIlxyXG4gICAgICAgIHRleHRDb2xvcjogXCIjZmZmZmZmXCJcclxuICAgICAgICBjbGljazogQG5ld0V4dHJlbWUuYmluZCh0aGlzKVxyXG4gICAgICByZXNldDpcclxuICAgICAgICB5OiBidXR0b25Qb3MoNClcclxuICAgICAgICB0ZXh0OiBcIlJlc2V0IFB1enpsZVwiXHJcbiAgICAgICAgYmdDb2xvcjogXCIjNzczMzc3XCJcclxuICAgICAgICB0ZXh0Q29sb3I6IFwiI2ZmZmZmZlwiXHJcbiAgICAgICAgY2xpY2s6IEByZXNldC5iaW5kKHRoaXMpXHJcbiAgICAgIGltcG9ydDpcclxuICAgICAgICB5OiBidXR0b25Qb3MoNSlcclxuICAgICAgICB0ZXh0OiBcIkxvYWQgUHV6emxlXCJcclxuICAgICAgICBiZ0NvbG9yOiBcIiMzMzY2NjZcIlxyXG4gICAgICAgIHRleHRDb2xvcjogXCIjZmZmZmZmXCJcclxuICAgICAgICBjbGljazogQGltcG9ydC5iaW5kKHRoaXMpXHJcbiAgICAgIGV4cG9ydDpcclxuICAgICAgICB5OiBidXR0b25Qb3MoNilcclxuICAgICAgICB0ZXh0OiBcIlNoYXJlIFB1enpsZVwiXHJcbiAgICAgICAgYmdDb2xvcjogXCIjMzM2NjY2XCJcclxuICAgICAgICB0ZXh0Q29sb3I6IFwiI2ZmZmZmZlwiXHJcbiAgICAgICAgY2xpY2s6IEBleHBvcnQuYmluZCh0aGlzKVxyXG4gICAgICByZXN1bWU6XHJcbiAgICAgICAgeTogYnV0dG9uUG9zKDcpXHJcbiAgICAgICAgdGV4dDogXCJSZXN1bWVcIlxyXG4gICAgICAgIGJnQ29sb3I6IFwiIzc3Nzc3N1wiXHJcbiAgICAgICAgdGV4dENvbG9yOiBcIiNmZmZmZmZcIlxyXG4gICAgICAgIGNsaWNrOiBAcmVzdW1lLmJpbmQodGhpcylcclxuXHJcbiAgICBidXR0b25XaWR0aCA9IEBjYW52YXMud2lkdGggKiAwLjhcclxuICAgIEBidXR0b25IZWlnaHQgPSBAY2FudmFzLmhlaWdodCAqIEJVVFRPTl9IRUlHSFRcclxuICAgIGJ1dHRvblggPSAoQGNhbnZhcy53aWR0aCAtIGJ1dHRvbldpZHRoKSAvIDJcclxuICAgIGZvciBidXR0b25OYW1lLCBidXR0b24gb2YgQGJ1dHRvbnNcclxuICAgICAgYnV0dG9uLnggPSBidXR0b25YXHJcbiAgICAgIGJ1dHRvbi55ID0gQGNhbnZhcy5oZWlnaHQgKiBidXR0b24ueVxyXG4gICAgICBidXR0b24udyA9IGJ1dHRvbldpZHRoXHJcbiAgICAgIGJ1dHRvbi5oID0gQGJ1dHRvbkhlaWdodFxyXG5cclxuICAgIGJ1dHRvbkZvbnRIZWlnaHQgPSBNYXRoLmZsb29yKEBidXR0b25IZWlnaHQgKiAwLjQpXHJcbiAgICBAYnV0dG9uRm9udCA9IEBhcHAucmVnaXN0ZXJGb250KFwiYnV0dG9uXCIsIFwiI3tidXR0b25Gb250SGVpZ2h0fXB4IHNheE1vbm8sIG1vbm9zcGFjZVwiKVxyXG4gICAgdGl0bGVGb250SGVpZ2h0ID0gTWF0aC5mbG9vcihAY2FudmFzLmhlaWdodCAqIDAuMDYpXHJcbiAgICBAdGl0bGVGb250ID0gQGFwcC5yZWdpc3RlckZvbnQoXCJidXR0b25cIiwgXCIje3RpdGxlRm9udEhlaWdodH1weCBzYXhNb25vLCBtb25vc3BhY2VcIilcclxuICAgIHN1YnRpdGxlRm9udEhlaWdodCA9IE1hdGguZmxvb3IoQGNhbnZhcy5oZWlnaHQgKiAwLjAyKVxyXG4gICAgQHN1YnRpdGxlRm9udCA9IEBhcHAucmVnaXN0ZXJGb250KFwiYnV0dG9uXCIsIFwiI3tzdWJ0aXRsZUZvbnRIZWlnaHR9cHggc2F4TW9ubywgbW9ub3NwYWNlXCIpXHJcbiAgICByZXR1cm5cclxuXHJcbiAgZHJhdzogLT5cclxuICAgIEBhcHAuZHJhd0ZpbGwoMCwgMCwgQGNhbnZhcy53aWR0aCwgQGNhbnZhcy5oZWlnaHQsIFwiIzMzMzMzM1wiKVxyXG5cclxuICAgIHggPSBAY2FudmFzLndpZHRoIC8gMlxyXG4gICAgc2hhZG93T2Zmc2V0ID0gQGNhbnZhcy5oZWlnaHQgKiAwLjAwNVxyXG5cclxuICAgIHkxID0gQGNhbnZhcy5oZWlnaHQgKiAwLjA1XHJcbiAgICB5MiA9IHkxICsgQGNhbnZhcy5oZWlnaHQgKiAwLjA2XHJcbiAgICB5MyA9IHkyICsgQGNhbnZhcy5oZWlnaHQgKiAwLjA2XHJcbiAgICBAYXBwLmRyYXdUZXh0Q2VudGVyZWQoXCJCYWQgR3V5XCIsIHggKyBzaGFkb3dPZmZzZXQsIHkxICsgc2hhZG93T2Zmc2V0LCBAdGl0bGVGb250LCBcIiMwMDAwMDBcIilcclxuICAgIEBhcHAuZHJhd1RleHRDZW50ZXJlZChcIlN1ZG9rdVwiLCB4ICsgc2hhZG93T2Zmc2V0LCB5MiArIHNoYWRvd09mZnNldCwgQHRpdGxlRm9udCwgXCIjMDAwMDAwXCIpXHJcbiAgICBAYXBwLmRyYXdUZXh0Q2VudGVyZWQoXCJCYWQgR3V5XCIsIHgsIHkxLCBAdGl0bGVGb250LCBcIiNmZmZmZmZcIilcclxuICAgIEBhcHAuZHJhd1RleHRDZW50ZXJlZChcIlN1ZG9rdVwiLCB4LCB5MiwgQHRpdGxlRm9udCwgXCIjZmZmZmZmXCIpXHJcbiAgICBAYXBwLmRyYXdUZXh0Q2VudGVyZWQoXCJJdCdzIGxpa2UgU3Vkb2t1LCBidXQgeW91IGFyZSB0aGUgYmFkIGd1eS5cIiwgeCwgeTMsIEBzdWJ0aXRsZUZvbnQsIFwiI2ZmZmZmZlwiKVxyXG5cclxuICAgIGZvciBidXR0b25OYW1lLCBidXR0b24gb2YgQGJ1dHRvbnNcclxuICAgICAgQGFwcC5kcmF3Um91bmRlZFJlY3QoYnV0dG9uLnggKyBzaGFkb3dPZmZzZXQsIGJ1dHRvbi55ICsgc2hhZG93T2Zmc2V0LCBidXR0b24udywgYnV0dG9uLmgsIGJ1dHRvbi5oICogMC4zLCBcImJsYWNrXCIsIFwiYmxhY2tcIilcclxuICAgICAgQGFwcC5kcmF3Um91bmRlZFJlY3QoYnV0dG9uLngsIGJ1dHRvbi55LCBidXR0b24udywgYnV0dG9uLmgsIGJ1dHRvbi5oICogMC4zLCBidXR0b24uYmdDb2xvciwgXCIjOTk5OTk5XCIpXHJcbiAgICAgIEBhcHAuZHJhd1RleHRDZW50ZXJlZChidXR0b24udGV4dCwgYnV0dG9uLnggKyAoYnV0dG9uLncgLyAyKSwgYnV0dG9uLnkgKyAoYnV0dG9uLmggLyAyKSwgQGJ1dHRvbkZvbnQsIGJ1dHRvbi50ZXh0Q29sb3IpXHJcblxyXG4gICAgQGFwcC5kcmF3TG93ZXJMZWZ0KFwiI3tAYXBwLmhvbGVDb3VudCgpfS84MVwiKVxyXG4gICAgQGFwcC5kcmF3VmVyc2lvbigpXHJcblxyXG4gIGNsaWNrOiAoeCwgeSkgLT5cclxuICAgIGZvciBidXR0b25OYW1lLCBidXR0b24gb2YgQGJ1dHRvbnNcclxuICAgICAgaWYgKHkgPiBidXR0b24ueSkgJiYgKHkgPCAoYnV0dG9uLnkgKyBAYnV0dG9uSGVpZ2h0KSlcclxuICAgICAgICAjIGNvbnNvbGUubG9nIFwiYnV0dG9uIHByZXNzZWQ6ICN7YnV0dG9uTmFtZX1cIlxyXG4gICAgICAgIGJ1dHRvbi5jbGljaygpXHJcbiAgICByZXR1cm5cclxuXHJcbiAgbmV3RWFzeTogLT5cclxuICAgIEBhcHAubmV3R2FtZShTdWRva3VHZW5lcmF0b3IuZGlmZmljdWx0eS5lYXN5KVxyXG5cclxuICBuZXdNZWRpdW06IC0+XHJcbiAgICBAYXBwLm5ld0dhbWUoU3Vkb2t1R2VuZXJhdG9yLmRpZmZpY3VsdHkubWVkaXVtKVxyXG5cclxuICBuZXdIYXJkOiAtPlxyXG4gICAgQGFwcC5uZXdHYW1lKFN1ZG9rdUdlbmVyYXRvci5kaWZmaWN1bHR5LmhhcmQpXHJcblxyXG4gIG5ld0V4dHJlbWU6IC0+XHJcbiAgICBAYXBwLm5ld0dhbWUoU3Vkb2t1R2VuZXJhdG9yLmRpZmZpY3VsdHkuZXh0cmVtZSlcclxuXHJcbiAgcmVzZXQ6IC0+XHJcbiAgICBAYXBwLnJlc2V0KClcclxuXHJcbiAgcmVzdW1lOiAtPlxyXG4gICAgQGFwcC5zd2l0Y2hWaWV3KFwic3Vkb2t1XCIpXHJcblxyXG4gIGV4cG9ydDogLT5cclxuICAgIGlmIG5hdmlnYXRvci5zaGFyZSAhPSB1bmRlZmluZWRcclxuICAgICAgbmF2aWdhdG9yLnNoYXJlIHtcclxuICAgICAgICB0aXRsZTogXCJTdWRva3UgU2hhcmVkIEdhbWVcIlxyXG4gICAgICAgIHRleHQ6IEBhcHAuZXhwb3J0KClcclxuICAgICAgfVxyXG4gICAgICByZXR1cm5cclxuICAgIHdpbmRvdy5wcm9tcHQoXCJDb3B5IHRoaXMgYW5kIHBhc3RlIHRvIGEgZnJpZW5kOlwiLCBAYXBwLmV4cG9ydCgpKVxyXG5cclxuICBpbXBvcnQ6IC0+XHJcbiAgICBpbXBvcnRTdHJpbmcgPSB3aW5kb3cucHJvbXB0KFwiUGFzdGUgYW4gZXhwb3J0ZWQgZ2FtZSBoZXJlOlwiLCBcIlwiKVxyXG4gICAgbG9vcFxyXG4gICAgICBpZiBpbXBvcnRTdHJpbmcgPT0gbnVsbFxyXG4gICAgICAgIHJldHVyblxyXG4gICAgICBpZiBAYXBwLmltcG9ydChpbXBvcnRTdHJpbmcpXHJcbiAgICAgICAgQGFwcC5zd2l0Y2hWaWV3KFwic3Vkb2t1XCIpXHJcbiAgICAgICAgcmV0dXJuXHJcbiAgICAgIGltcG9ydFN0cmluZyA9IHdpbmRvdy5wcm9tcHQoXCJJbnZhbGlkIGdhbWUsIHRyeSBhZ2FpbjpcIiwgXCJcIilcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gTWVudVZpZXdcclxuIiwiU3Vkb2t1R2VuZXJhdG9yID0gcmVxdWlyZSAnLi9TdWRva3VHZW5lcmF0b3InXHJcblxyXG4jIFJldHVybnMgdGhlIGluZGV4IG9mIGEgY2VsbCBpbiByb3cgbWFqb3Igb3JkZXIgKHRob3VnaCB0aGV5IGFyZSBzdG9yZWQgaW4gY29sdW1uIG1ham9yIG9yZGVyKVxyXG5jZWxsSW5kZXggPSAoeCwgeSkgLT4geSAqIDkgKyB4XHJcblxyXG4jIFNvcnQgYnkgYXNjZW5kaW5nIGxvY2F0aW9uIGFuZCB0aGVuIGJ5IHN0cmVuZ3RoIChzdHJvbmcgdGhlbiB3ZWFrKVxyXG5hc2NlbmRpbmdMaW5rU29ydCA9IChhLCBiKSAtPlxyXG4gIGEwID0gY2VsbEluZGV4KGEuY2VsbHNbMF0ueCwgYS5jZWxsc1swXS55KVxyXG4gIGExID0gY2VsbEluZGV4KGEuY2VsbHNbMV0ueCwgYS5jZWxsc1sxXS55KVxyXG4gIGIwID0gY2VsbEluZGV4KGIuY2VsbHNbMF0ueCwgYi5jZWxsc1swXS55KVxyXG4gIGIxID0gY2VsbEluZGV4KGIuY2VsbHNbMV0ueCwgYi5jZWxsc1sxXS55KVxyXG4gIHJldHVybiBpZiBhMCA+IGIwIG9yIChhMCA9PSBiMCBhbmQgKGExID4gYjEgb3IgKGExID09IGIxIGFuZCAobm90IGEuc3Ryb25nPyBhbmQgYi5zdHJvbmc/KSkpKSB0aGVuIDEgZWxzZSAtMVxyXG5cclxuIyBOb3RlIHN0cmVuZ3RoIGlzIG5vdCBjb21wYXJlZFxyXG51bmlxdWVMaW5rRmlsdGVyID0gKGUsIGksIGEpIC0+XHJcbiAgaWYgaSA9PSAwXHJcbiAgICByZXR1cm4gdHJ1ZSBcclxuICBwID0gYVtpLTFdXHJcbiAgZTAgPSBjZWxsSW5kZXgoZS5jZWxsc1swXS54LCBlLmNlbGxzWzBdLnkpXHJcbiAgZTEgPSBjZWxsSW5kZXgoZS5jZWxsc1sxXS54LCBlLmNlbGxzWzFdLnkpXHJcbiAgcDAgPSBjZWxsSW5kZXgocC5jZWxsc1swXS54LCBwLmNlbGxzWzBdLnkpXHJcbiAgcDEgPSBjZWxsSW5kZXgocC5jZWxsc1sxXS54LCBwLmNlbGxzWzFdLnkpXHJcbiAgcmV0dXJuIGUwICE9IHAwIG9yIGUxICE9IHAxXHJcblxyXG5nZW5lcmF0ZUxpbmtQZXJtdXRhdGlvbnMgPSAoY2VsbHMpIC0+XHJcbiAgbGlua3MgPSBbXVxyXG4gIGNvdW50ID0gY2VsbHMubGVuZ3RoXHJcbiAgZm9yIGkgaW4gWzAuLi5jb3VudC0xXVxyXG4gICAgZm9yIGogaW4gW2krMS4uLmNvdW50XVxyXG4gICAgICBsaW5rcy5wdXNoKHsgY2VsbHM6IFtjZWxsc1tpXSwgY2VsbHNbal1dIH0pXHJcbiAgcmV0dXJuIGxpbmtzXHJcblxyXG5jbGFzcyBTdWRva3VHYW1lXHJcbiAgY29uc3RydWN0b3I6IC0+XHJcbiAgICBAY2xlYXIoKVxyXG4gICAgaWYgbm90IEBsb2FkKClcclxuICAgICAgQG5ld0dhbWUoU3Vkb2t1R2VuZXJhdG9yLmRpZmZpY3VsdHkuZWFzeSlcclxuICAgIHJldHVyblxyXG5cclxuICBjbGVhcjogLT5cclxuICAgIEBncmlkID0gbmV3IEFycmF5KDkpLmZpbGwobnVsbClcclxuICAgIGZvciBpIGluIFswLi4uOV1cclxuICAgICAgQGdyaWRbaV0gPSBuZXcgQXJyYXkoOSkuZmlsbChudWxsKVxyXG4gICAgZm9yIGogaW4gWzAuLi45XVxyXG4gICAgICBmb3IgaSBpbiBbMC4uLjldXHJcbiAgICAgICAgQGdyaWRbaV1bal0gPVxyXG4gICAgICAgICAgdmFsdWU6IDBcclxuICAgICAgICAgIGVycm9yOiBmYWxzZVxyXG4gICAgICAgICAgbG9ja2VkOiBmYWxzZVxyXG4gICAgICAgICAgcGVuY2lsOiBuZXcgQXJyYXkoOSkuZmlsbChmYWxzZSlcclxuXHJcbiAgICBAc29sdmVkID0gZmFsc2VcclxuICAgIEB1bmRvSm91cm5hbCA9IFtdXHJcbiAgICBAcmVkb0pvdXJuYWwgPSBbXVxyXG5cclxuICBob2xlQ291bnQ6IC0+XHJcbiAgICBjb3VudCA9IDBcclxuICAgIGZvciBqIGluIFswLi4uOV1cclxuICAgICAgZm9yIGkgaW4gWzAuLi45XVxyXG4gICAgICAgIGlmIG5vdCBAZ3JpZFtpXVtqXS5sb2NrZWRcclxuICAgICAgICAgIGNvdW50ICs9IDFcclxuICAgIHJldHVybiBjb3VudFxyXG5cclxuICBleHBvcnQ6IC0+XHJcbiAgICBleHBvcnRTdHJpbmcgPSBcIlNEXCJcclxuICAgIGZvciBqIGluIFswLi4uOV1cclxuICAgICAgZm9yIGkgaW4gWzAuLi45XVxyXG4gICAgICAgIGlmIEBncmlkW2ldW2pdLmxvY2tlZFxyXG4gICAgICAgICAgZXhwb3J0U3RyaW5nICs9IFwiI3tAZ3JpZFtpXVtqXS52YWx1ZX1cIlxyXG4gICAgICAgIGVsc2VcclxuICAgICAgICAgIGV4cG9ydFN0cmluZyArPSBcIjBcIlxyXG4gICAgcmV0dXJuIGV4cG9ydFN0cmluZ1xyXG5cclxuICB2YWxpZGF0ZTogLT5cclxuICAgIGJvYXJkID0gbmV3IEFycmF5KDkpLmZpbGwobnVsbClcclxuICAgIGZvciBpIGluIFswLi4uOV1cclxuICAgICAgYm9hcmRbaV0gPSBuZXcgQXJyYXkoOSkuZmlsbCgwKVxyXG4gICAgICBmb3IgaiBpbiBbMC4uLjldXHJcbiAgICAgICAgYm9hcmRbaV1bal0gPSBAZ3JpZFtpXVtqXS52YWx1ZVxyXG5cclxuICAgIGdlbmVyYXRvciA9IG5ldyBTdWRva3VHZW5lcmF0b3JcclxuICAgIHJldHVybiBnZW5lcmF0b3IudmFsaWRhdGVHcmlkKGJvYXJkKVxyXG5cclxuICBpbXBvcnQ6IChpbXBvcnRTdHJpbmcpIC0+XHJcbiAgICBpZiBpbXBvcnRTdHJpbmcuaW5kZXhPZihcIlNEXCIpICE9IDBcclxuICAgICAgcmV0dXJuIGZhbHNlXHJcbiAgICBpbXBvcnRTdHJpbmcgPSBpbXBvcnRTdHJpbmcuc3Vic3RyKDIpXHJcbiAgICBpbXBvcnRTdHJpbmcgPSBpbXBvcnRTdHJpbmcucmVwbGFjZSgvW14wLTldL2csIFwiXCIpXHJcbiAgICBpZiBpbXBvcnRTdHJpbmcubGVuZ3RoICE9IDgxXHJcbiAgICAgIHJldHVybiBmYWxzZVxyXG5cclxuICAgIEBjbGVhcigpXHJcblxyXG4gICAgaW5kZXggPSAwXHJcbiAgICB6ZXJvQ2hhckNvZGUgPSBcIjBcIi5jaGFyQ29kZUF0KDApXHJcbiAgICBmb3IgaiBpbiBbMC4uLjldXHJcbiAgICAgIGZvciBpIGluIFswLi4uOV1cclxuICAgICAgICB2ID0gaW1wb3J0U3RyaW5nLmNoYXJDb2RlQXQoaW5kZXgpIC0gemVyb0NoYXJDb2RlXHJcbiAgICAgICAgaW5kZXggKz0gMVxyXG4gICAgICAgIGlmIHYgPiAwXHJcbiAgICAgICAgICBAZ3JpZFtpXVtqXS5sb2NrZWQgPSB0cnVlXHJcbiAgICAgICAgICBAZ3JpZFtpXVtqXS52YWx1ZSA9IHZcclxuXHJcbiAgICByZXR1cm4gZmFsc2UgaWYgbm90IEB2YWxpZGF0ZSgpXHJcbiAgICBcclxuICAgIEB1cGRhdGVDZWxscygpXHJcbiAgICBAc2F2ZSgpXHJcbiAgICByZXR1cm4gdHJ1ZVxyXG5cclxuICB1cGRhdGVDZWxsOiAoeCwgeSkgLT5cclxuICAgIGNlbGwgPSBAZ3JpZFt4XVt5XVxyXG5cclxuICAgIGZvciBpIGluIFswLi4uOV1cclxuICAgICAgaWYgeCAhPSBpXHJcbiAgICAgICAgdiA9IEBncmlkW2ldW3ldLnZhbHVlXHJcbiAgICAgICAgaWYgdiA+IDBcclxuICAgICAgICAgIGlmIHYgPT0gY2VsbC52YWx1ZVxyXG4gICAgICAgICAgICBAZ3JpZFtpXVt5XS5lcnJvciA9IHRydWVcclxuICAgICAgICAgICAgY2VsbC5lcnJvciA9IHRydWVcclxuXHJcbiAgICAgIGlmIHkgIT0gaVxyXG4gICAgICAgIHYgPSBAZ3JpZFt4XVtpXS52YWx1ZVxyXG4gICAgICAgIGlmIHYgPiAwXHJcbiAgICAgICAgICBpZiB2ID09IGNlbGwudmFsdWVcclxuICAgICAgICAgICAgQGdyaWRbeF1baV0uZXJyb3IgPSB0cnVlXHJcbiAgICAgICAgICAgIGNlbGwuZXJyb3IgPSB0cnVlXHJcblxyXG4gICAgc3ggPSBNYXRoLmZsb29yKHggLyAzKSAqIDNcclxuICAgIHN5ID0gTWF0aC5mbG9vcih5IC8gMykgKiAzXHJcbiAgICBmb3IgaiBpbiBbMC4uLjNdXHJcbiAgICAgIGZvciBpIGluIFswLi4uM11cclxuICAgICAgICBpZiAoeCAhPSAoc3ggKyBpKSkgJiYgKHkgIT0gKHN5ICsgaikpXHJcbiAgICAgICAgICB2ID0gQGdyaWRbc3ggKyBpXVtzeSArIGpdLnZhbHVlXHJcbiAgICAgICAgICBpZiB2ID4gMFxyXG4gICAgICAgICAgICBpZiB2ID09IGNlbGwudmFsdWVcclxuICAgICAgICAgICAgICBAZ3JpZFtzeCArIGldW3N5ICsgal0uZXJyb3IgPSB0cnVlXHJcbiAgICAgICAgICAgICAgY2VsbC5lcnJvciA9IHRydWVcclxuICAgIHJldHVyblxyXG5cclxuICB1cGRhdGVDZWxsczogLT5cclxuICAgIGZvciBqIGluIFswLi4uOV1cclxuICAgICAgZm9yIGkgaW4gWzAuLi45XVxyXG4gICAgICAgIEBncmlkW2ldW2pdLmVycm9yID0gZmFsc2VcclxuXHJcbiAgICBmb3IgaiBpbiBbMC4uLjldXHJcbiAgICAgIGZvciBpIGluIFswLi4uOV1cclxuICAgICAgICBAdXBkYXRlQ2VsbChpLCBqKVxyXG5cclxuICAgIEBzb2x2ZWQgPSB0cnVlXHJcbiAgICBmb3IgaiBpbiBbMC4uLjldXHJcbiAgICAgIGZvciBpIGluIFswLi4uOV1cclxuICAgICAgICBpZiBAZ3JpZFtpXVtqXS5lcnJvclxyXG4gICAgICAgICAgQHNvbHZlZCA9IGZhbHNlXHJcbiAgICAgICAgaWYgQGdyaWRbaV1bal0udmFsdWUgPT0gMFxyXG4gICAgICAgICAgQHNvbHZlZCA9IGZhbHNlXHJcblxyXG4gICAgIyBpZiBAc29sdmVkXHJcbiAgICAjICAgY29uc29sZS5sb2cgXCJzb2x2ZWQgI3tAc29sdmVkfVwiXHJcblxyXG4gICAgcmV0dXJuIEBzb2x2ZWRcclxuXHJcbiAgZG9uZTogLT5cclxuICAgIGQgPSBuZXcgQXJyYXkoOSkuZmlsbChmYWxzZSlcclxuICAgIGNvdW50cyA9IG5ldyBBcnJheSg5KS5maWxsKDApXHJcbiAgICBmb3IgaiBpbiBbMC4uLjldXHJcbiAgICAgIGZvciBpIGluIFswLi4uOV1cclxuICAgICAgICBpZiBAZ3JpZFtpXVtqXS52YWx1ZSAhPSAwXHJcbiAgICAgICAgICBjb3VudHNbQGdyaWRbaV1bal0udmFsdWUtMV0gKz0gMVxyXG5cclxuICAgIGZvciBpIGluIFswLi4uOV1cclxuICAgICAgaWYgY291bnRzW2ldID09IDlcclxuICAgICAgICBkW2ldID0gdHJ1ZVxyXG4gICAgcmV0dXJuIGRcclxuXHJcbiAgcGVuY2lsU3RyaW5nOiAoeCwgeSkgLT5cclxuICAgIGNlbGwgPSBAZ3JpZFt4XVt5XVxyXG4gICAgcyA9IFwiXCJcclxuICAgIGZvciBpIGluIFswLi4uOV1cclxuICAgICAgaWYgY2VsbC5wZW5jaWxbaV1cclxuICAgICAgICBzICs9IFN0cmluZyhpKzEpXHJcbiAgICByZXR1cm4gc1xyXG5cclxuICBkbzogKGFjdGlvbiwgeCwgeSwgdmFsdWVzLCBqb3VybmFsKSAtPlxyXG4gICAgaWYgdmFsdWVzLmxlbmd0aCA+IDBcclxuICAgICAgY2VsbCA9IEBncmlkW3hdW3ldXHJcbiAgICAgIHN3aXRjaCBhY3Rpb25cclxuICAgICAgICB3aGVuIFwidG9nZ2xlUGVuY2lsXCJcclxuICAgICAgICAgIGpvdXJuYWwucHVzaCB7IGFjdGlvbjogXCJ0b2dnbGVQZW5jaWxcIiwgeDogeCwgeTogeSwgdmFsdWVzOiB2YWx1ZXMgfVxyXG4gICAgICAgICAgY2VsbC5wZW5jaWxbdi0xXSA9ICFjZWxsLnBlbmNpbFt2LTFdIGZvciB2IGluIHZhbHVlc1xyXG4gICAgICAgIHdoZW4gXCJzZXRWYWx1ZVwiXHJcbiAgICAgICAgICBqb3VybmFsLnB1c2ggeyBhY3Rpb246IFwic2V0VmFsdWVcIiwgeDogeCwgeTogeSwgdmFsdWVzOiBbY2VsbC52YWx1ZV0gfVxyXG4gICAgICAgICAgY2VsbC52YWx1ZSA9IHZhbHVlc1swXVxyXG4gICAgICBAdXBkYXRlQ2VsbHMoKVxyXG4gICAgICBAc2F2ZSgpXHJcblxyXG4gIHVuZG86IC0+XHJcbiAgICBpZiAoQHVuZG9Kb3VybmFsLmxlbmd0aCA+IDApXHJcbiAgICAgIHN0ZXAgPSBAdW5kb0pvdXJuYWwucG9wKClcclxuICAgICAgQGRvIHN0ZXAuYWN0aW9uLCBzdGVwLngsIHN0ZXAueSwgc3RlcC52YWx1ZXMsIEByZWRvSm91cm5hbFxyXG4gICAgICByZXR1cm4gWyBzdGVwLngsIHN0ZXAueSBdXHJcblxyXG4gIHJlZG86IC0+XHJcbiAgICBpZiAoQHJlZG9Kb3VybmFsLmxlbmd0aCA+IDApXHJcbiAgICAgIHN0ZXAgPSBAcmVkb0pvdXJuYWwucG9wKClcclxuICAgICAgQGRvIHN0ZXAuYWN0aW9uLCBzdGVwLngsIHN0ZXAueSwgc3RlcC52YWx1ZXMsIEB1bmRvSm91cm5hbFxyXG4gICAgICByZXR1cm4gWyBzdGVwLngsIHN0ZXAueSBdXHJcblxyXG4gIGNsZWFyUGVuY2lsOiAoeCwgeSkgLT5cclxuICAgIGNlbGwgPSBAZ3JpZFt4XVt5XVxyXG4gICAgaWYgY2VsbC5sb2NrZWRcclxuICAgICAgcmV0dXJuXHJcbiAgICBAZG8gXCJ0b2dnbGVQZW5jaWxcIiwgeCwgeSwgKGkrMSBmb3IgZmxhZywgaSBpbiBjZWxsLnBlbmNpbCB3aGVuIGZsYWcpLCBAdW5kb0pvdXJuYWxcclxuICAgIEByZWRvSm91cm5hbCA9IFtdXHJcblxyXG4gIHRvZ2dsZVBlbmNpbDogKHgsIHksIHYpIC0+XHJcbiAgICBpZiBAZ3JpZFt4XVt5XS5sb2NrZWRcclxuICAgICAgcmV0dXJuXHJcbiAgICBAZG8gXCJ0b2dnbGVQZW5jaWxcIiwgeCwgeSwgW3ZdLCBAdW5kb0pvdXJuYWxcclxuICAgIEByZWRvSm91cm5hbCA9IFtdXHJcblxyXG4gIHNldFZhbHVlOiAoeCwgeSwgdikgLT5cclxuICAgIGlmIEBncmlkW3hdW3ldLmxvY2tlZFxyXG4gICAgICByZXR1cm5cclxuICAgIEBkbyBcInNldFZhbHVlXCIsIHgsIHksIFt2XSwgQHVuZG9Kb3VybmFsXHJcbiAgICBAcmVkb0pvdXJuYWwgPSBbXVxyXG5cclxuICByZXNldDogLT5cclxuICAgIGNvbnNvbGUubG9nIFwicmVzZXQoKVwiXHJcbiAgICBmb3IgaiBpbiBbMC4uLjldXHJcbiAgICAgIGZvciBpIGluIFswLi4uOV1cclxuICAgICAgICBjZWxsID0gQGdyaWRbaV1bal1cclxuICAgICAgICBpZiBub3QgY2VsbC5sb2NrZWRcclxuICAgICAgICAgIGNlbGwudmFsdWUgPSAwXHJcbiAgICAgICAgY2VsbC5lcnJvciA9IGZhbHNlXHJcbiAgICAgICAgZm9yIGsgaW4gWzAuLi45XVxyXG4gICAgICAgICAgY2VsbC5wZW5jaWxba10gPSBmYWxzZVxyXG4gICAgQHVuZG9Kb3VybmFsID0gW11cclxuICAgIEByZWRvSm91cm5hbCA9IFtdXHJcbiAgICBAaGlnaGxpZ2h0WCA9IC0xXHJcbiAgICBAaGlnaGxpZ2h0WSA9IC0xXHJcbiAgICBAdXBkYXRlQ2VsbHMoKVxyXG4gICAgQHNhdmUoKVxyXG5cclxuICBnZXRMaW5rczogKHZhbHVlKSAtPlxyXG4gICAgIyBOb3RlOiB0aGUgc2VhcmNoIHNvcnRzIHRoZSBsaW5rcyBpbiByb3cgbWFqb3Igb3JkZXIsIGZpcnN0IGJ5IHN0YXJ0IGNlbGwsIHRoZW4gYnkgZW5kIGNlbGxcclxuICAgIGxpbmtzID0gW11cclxuXHJcbiAgICAjIEdldCByb3cgbGlua3NcclxuICAgIGZvciB5IGluIFswLi4uOV1cclxuICAgICAgbGlua3MucHVzaCBAZ2V0Um93TGlua3MoeSwgdmFsdWUpLi4uXHJcblxyXG4gICAgIyBHZXQgY29sdW1uIGxpbmtzXHJcbiAgICBmb3IgeCBpbiBbMC4uLjldXHJcbiAgICAgIGxpbmtzLnB1c2ggQGdldENvbHVtbkxpbmtzKHgsIHZhbHVlKS4uLlxyXG5cclxuICAgICMgR2V0IGJveCBsaW5rc1xyXG4gICAgZm9yIGJveFggaW4gWzAuLi4zXVxyXG4gICAgICBmb3IgYm94WSBpbiBbMC4uLjNdXHJcbiAgICAgICAgbGlua3MucHVzaCBAZ2V0Qm94TGlua3MoYm94WCwgYm94WSwgdmFsdWUpLi4uXHJcblxyXG4gICAgIyBUaGUgYm94IGxpbmtzIG1pZ2h0IGhhdmUgZHVwbGljYXRlZCBzb21lIHJvdyBhbmQgY29sdW1uIGxpbmtzLCBzbyBkdXBsaWNhdGVzIG11c3QgYmUgZmlsdGVyZWQgb3V0LiBOb3RlIHRoYXQgb25seVxyXG4gICAgIyBsb2NhdGlvbnMgYXJlIGNvbnNpZGVyZWQgd2hlbiBmaW5kaW5nIGR1cGxpY2F0ZXMsIGJ1dCBzdHJvbmcgbGlua3MgdGFrZSBwcmVjZWRlbmNlIHdoZW4gZHVwbGljYXRlcyBhcmUgcmVtb3ZlZCBcclxuICAgICMgKGJlY2F1c2UgdGhleSBhcmUgb3JkZXJlZCBiZWZvcmUgd2VhayBsaW5rcykuXHJcbiAgICBsaW5rcyA9IGxpbmtzLnNvcnQoYXNjZW5kaW5nTGlua1NvcnQpLmZpbHRlcih1bmlxdWVMaW5rRmlsdGVyKVxyXG5cclxuICAgIHN0cm9uZyA9IFtdXHJcbiAgICBmb3IgbGluayBpbiBsaW5rc1xyXG4gICAgICBzdHJvbmcucHVzaCBsaW5rLmNlbGxzIGlmIGxpbmsuc3Ryb25nP1xyXG4gICAgd2VhayA9IFtdXHJcbiAgICBmb3IgbGluayBpbiBsaW5rc1xyXG4gICAgICB3ZWFrLnB1c2ggbGluay5jZWxscyBpZiBub3QgbGluay5zdHJvbmc/XHJcblxyXG4gICAgcmV0dXJuIHsgc3Ryb25nLCB3ZWFrIH1cclxuXHJcbiAgZ2V0Um93TGlua3M6ICh5LCB2YWx1ZSktPlxyXG4gICAgY2VsbHMgPSBbXVxyXG4gICAgZm9yIHggaW4gWzAuLi45XVxyXG4gICAgICBjZWxsID0gQGdyaWRbeF1beV1cclxuICAgICAgaWYgY2VsbC52YWx1ZSA9PSAwIGFuZCBjZWxsLnBlbmNpbFt2YWx1ZS0xXVxyXG4gICAgICAgIGNlbGxzLnB1c2goeyB4LCB5IH0pXHJcblxyXG4gICAgaWYgY2VsbHMubGVuZ3RoID4gMVxyXG4gICAgICBsaW5rcyA9IGdlbmVyYXRlTGlua1Blcm11dGF0aW9ucyhjZWxscylcclxuICAgICAgaWYgbGlua3MubGVuZ3RoID09IDFcclxuICAgICAgICBsaW5rc1swXS5zdHJvbmcgPSB0cnVlXHJcbiAgICBlbHNlXHJcbiAgICAgIGxpbmtzID0gW11cclxuICAgIHJldHVybiBsaW5rc1xyXG5cclxuICBnZXRDb2x1bW5MaW5rczogKHgsIHZhbHVlKS0+XHJcbiAgICBjZWxscyA9IFtdXHJcbiAgICBmb3IgeSBpbiBbMC4uLjldXHJcbiAgICAgIGNlbGwgPSBAZ3JpZFt4XVt5XVxyXG4gICAgICBpZiBjZWxsLnZhbHVlID09IDAgYW5kIGNlbGwucGVuY2lsW3ZhbHVlLTFdXHJcbiAgICAgICAgY2VsbHMucHVzaCh7IHgsIHkgfSlcclxuXHJcbiAgICBpZiBjZWxscy5sZW5ndGggPiAxXHJcbiAgICAgIGxpbmtzID0gZ2VuZXJhdGVMaW5rUGVybXV0YXRpb25zKGNlbGxzKVxyXG4gICAgICBpZiBsaW5rcy5sZW5ndGggPT0gMVxyXG4gICAgICAgIGxpbmtzWzBdLnN0cm9uZyA9IHRydWVcclxuICAgIGVsc2VcclxuICAgICAgbGlua3MgPSBbXVxyXG4gICAgcmV0dXJuIGxpbmtzXHJcblxyXG4gIGdldEJveExpbmtzOiAoYm94WCwgYm94WSwgdmFsdWUpIC0+XHJcbiAgICBjZWxscyA9IFtdXHJcbiAgICBzeCA9IGJveFggKiAzXHJcbiAgICBzeSA9IGJveFkgKiAzXHJcbiAgICBmb3IgeSBpbiBbc3kuLi5zeSszXVxyXG4gICAgICBmb3IgeCBpbiBbc3guLi5zeCszXVxyXG4gICAgICAgIGNlbGwgPSBAZ3JpZFt4XVt5XVxyXG4gICAgICAgIGlmIGNlbGwudmFsdWUgPT0gMCBhbmQgY2VsbC5wZW5jaWxbdmFsdWUtMV1cclxuICAgICAgICAgIGNlbGxzLnB1c2goeyB4LCB5IH0pXHJcblxyXG4gICAgaWYgY2VsbHMubGVuZ3RoID4gMVxyXG4gICAgICBsaW5rcyA9IGdlbmVyYXRlTGlua1Blcm11dGF0aW9ucyhjZWxscylcclxuICAgICAgaWYgbGlua3MubGVuZ3RoID09IDFcclxuICAgICAgICBsaW5rc1swXS5zdHJvbmcgPSB0cnVlXHJcbiAgICBlbHNlXHJcbiAgICAgIGxpbmtzID0gW11cclxuICAgIHJldHVybiBsaW5rc1xyXG5cclxuICBuZXdHYW1lOiAoZGlmZmljdWx0eSkgLT5cclxuICAgIGNvbnNvbGUubG9nIFwibmV3R2FtZSgje2RpZmZpY3VsdHl9KVwiXHJcbiAgICBmb3IgaiBpbiBbMC4uLjldXHJcbiAgICAgIGZvciBpIGluIFswLi4uOV1cclxuICAgICAgICBjZWxsID0gQGdyaWRbaV1bal1cclxuICAgICAgICBjZWxsLnZhbHVlID0gMFxyXG4gICAgICAgIGNlbGwuZXJyb3IgPSBmYWxzZVxyXG4gICAgICAgIGNlbGwubG9ja2VkID0gZmFsc2VcclxuICAgICAgICBmb3IgayBpbiBbMC4uLjldXHJcbiAgICAgICAgICBjZWxsLnBlbmNpbFtrXSA9IGZhbHNlXHJcblxyXG4gICAgZ2VuZXJhdG9yID0gbmV3IFN1ZG9rdUdlbmVyYXRvcigpXHJcbiAgICBuZXdHcmlkID0gZ2VuZXJhdG9yLmdlbmVyYXRlKGRpZmZpY3VsdHkpXHJcbiAgICAjIGNvbnNvbGUubG9nIFwibmV3R3JpZFwiLCBuZXdHcmlkXHJcbiAgICBmb3IgaiBpbiBbMC4uLjldXHJcbiAgICAgIGZvciBpIGluIFswLi4uOV1cclxuICAgICAgICBpZiBuZXdHcmlkW2ldW2pdICE9IDBcclxuICAgICAgICAgIEBncmlkW2ldW2pdLnZhbHVlID0gbmV3R3JpZFtpXVtqXVxyXG4gICAgICAgICAgQGdyaWRbaV1bal0ubG9ja2VkID0gdHJ1ZVxyXG4gICAgQHVuZG9Kb3VybmFsID0gW11cclxuICAgIEByZWRvSm91cm5hbCA9IFtdXHJcbiAgICBAdXBkYXRlQ2VsbHMoKVxyXG4gICAgQHNhdmUoKVxyXG5cclxuICBsb2FkOiAtPlxyXG4gICAgaWYgbm90IGxvY2FsU3RvcmFnZVxyXG4gICAgICBhbGVydChcIk5vIGxvY2FsIHN0b3JhZ2UsIG5vdGhpbmcgd2lsbCB3b3JrXCIpXHJcbiAgICAgIHJldHVybiBmYWxzZVxyXG4gICAganNvblN0cmluZyA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwiZ2FtZVwiKVxyXG4gICAgaWYganNvblN0cmluZyA9PSBudWxsXHJcbiAgICAgIHJldHVybiBmYWxzZVxyXG5cclxuICAgICMgY29uc29sZS5sb2cganNvblN0cmluZ1xyXG4gICAgZ2FtZURhdGEgPSBKU09OLnBhcnNlKGpzb25TdHJpbmcpXHJcbiAgICAjIGNvbnNvbGUubG9nIFwiZm91bmQgZ2FtZURhdGFcIiwgZ2FtZURhdGFcclxuXHJcbiAgICBmb3IgaiBpbiBbMC4uLjldXHJcbiAgICAgIGZvciBpIGluIFswLi4uOV1cclxuICAgICAgICBzcmMgPSBnYW1lRGF0YS5ncmlkW2ldW2pdXHJcbiAgICAgICAgZHN0ID0gQGdyaWRbaV1bal1cclxuICAgICAgICBkc3QudmFsdWUgPSBzcmMudlxyXG4gICAgICAgIGRzdC5lcnJvciA9IGlmIHNyYy5lID4gMCB0aGVuIHRydWUgZWxzZSBmYWxzZVxyXG4gICAgICAgIGRzdC5sb2NrZWQgPSBpZiBzcmMubCA+IDAgdGhlbiB0cnVlIGVsc2UgZmFsc2VcclxuICAgICAgICBmb3IgayBpbiBbMC4uLjldXHJcbiAgICAgICAgICBkc3QucGVuY2lsW2tdID0gaWYgc3JjLnBba10gPiAwIHRoZW4gdHJ1ZSBlbHNlIGZhbHNlXHJcblxyXG4gICAgQHVwZGF0ZUNlbGxzKClcclxuICAgIGNvbnNvbGUubG9nIFwiTG9hZGVkIGdhbWUuXCJcclxuICAgIHJldHVybiB0cnVlXHJcblxyXG4gIHNhdmU6IC0+XHJcbiAgICBpZiBub3QgbG9jYWxTdG9yYWdlXHJcbiAgICAgIGFsZXJ0KFwiTm8gbG9jYWwgc3RvcmFnZSwgbm90aGluZyB3aWxsIHdvcmtcIilcclxuICAgICAgcmV0dXJuIGZhbHNlXHJcblxyXG4gICAgZ2FtZURhdGEgPVxyXG4gICAgICBncmlkOiBuZXcgQXJyYXkoOSkuZmlsbChudWxsKVxyXG4gICAgZm9yIGkgaW4gWzAuLi45XVxyXG4gICAgICBnYW1lRGF0YS5ncmlkW2ldID0gbmV3IEFycmF5KDkpLmZpbGwobnVsbClcclxuXHJcbiAgICBmb3IgaiBpbiBbMC4uLjldXHJcbiAgICAgIGZvciBpIGluIFswLi4uOV1cclxuICAgICAgICBjZWxsID0gQGdyaWRbaV1bal1cclxuICAgICAgICBnYW1lRGF0YS5ncmlkW2ldW2pdID1cclxuICAgICAgICAgIHY6IGNlbGwudmFsdWVcclxuICAgICAgICAgIGU6IGlmIGNlbGwuZXJyb3IgdGhlbiAxIGVsc2UgMFxyXG4gICAgICAgICAgbDogaWYgY2VsbC5sb2NrZWQgdGhlbiAxIGVsc2UgMFxyXG4gICAgICAgICAgcDogW11cclxuICAgICAgICBkc3QgPSBnYW1lRGF0YS5ncmlkW2ldW2pdLnBcclxuICAgICAgICBmb3IgayBpbiBbMC4uLjldXHJcbiAgICAgICAgICBkc3QucHVzaChpZiBjZWxsLnBlbmNpbFtrXSB0aGVuIDEgZWxzZSAwKVxyXG5cclxuICAgIGpzb25TdHJpbmcgPSBKU09OLnN0cmluZ2lmeShnYW1lRGF0YSlcclxuICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwiZ2FtZVwiLCBqc29uU3RyaW5nKVxyXG4gICAgY29uc29sZS5sb2cgXCJTYXZlZCBnYW1lICgje2pzb25TdHJpbmcubGVuZ3RofSBjaGFycylcIlxyXG4gICAgcmV0dXJuIHRydWVcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gU3Vkb2t1R2FtZVxyXG4iLCJzaHVmZmxlID0gKGEpIC0+XHJcbiAgICBpID0gYS5sZW5ndGhcclxuICAgIHdoaWxlIC0taSA+IDBcclxuICAgICAgICBqID0gfn4oTWF0aC5yYW5kb20oKSAqIChpICsgMSkpXHJcbiAgICAgICAgdCA9IGFbal1cclxuICAgICAgICBhW2pdID0gYVtpXVxyXG4gICAgICAgIGFbaV0gPSB0XHJcbiAgICByZXR1cm4gYVxyXG5cclxuY2xhc3MgQm9hcmRcclxuICBjb25zdHJ1Y3RvcjogKG90aGVyQm9hcmQgPSBudWxsKSAtPlxyXG4gICAgQGxvY2tlZENvdW50ID0gMDtcclxuICAgIEBncmlkID0gbmV3IEFycmF5KDkpLmZpbGwobnVsbClcclxuICAgIEBsb2NrZWQgPSBuZXcgQXJyYXkoOSkuZmlsbChudWxsKVxyXG4gICAgZm9yIGkgaW4gWzAuLi45XVxyXG4gICAgICBAZ3JpZFtpXSA9IG5ldyBBcnJheSg5KS5maWxsKDApXHJcbiAgICAgIEBsb2NrZWRbaV0gPSBuZXcgQXJyYXkoOSkuZmlsbChmYWxzZSlcclxuICAgIGlmIG90aGVyQm9hcmQgIT0gbnVsbFxyXG4gICAgICBmb3IgaiBpbiBbMC4uLjldXHJcbiAgICAgICAgZm9yIGkgaW4gWzAuLi45XVxyXG4gICAgICAgICAgQGdyaWRbaV1bal0gPSBvdGhlckJvYXJkLmdyaWRbaV1bal1cclxuICAgICAgICAgIEBsb2NrKGksIGosIG90aGVyQm9hcmQubG9ja2VkW2ldW2pdKVxyXG4gICAgcmV0dXJuXHJcblxyXG4gIG1hdGNoZXM6IChvdGhlckJvYXJkKSAtPlxyXG4gICAgZm9yIGogaW4gWzAuLi45XVxyXG4gICAgICBmb3IgaSBpbiBbMC4uLjldXHJcbiAgICAgICAgaWYgQGdyaWRbaV1bal0gIT0gb3RoZXJCb2FyZC5ncmlkW2ldW2pdXHJcbiAgICAgICAgICByZXR1cm4gZmFsc2VcclxuICAgIHJldHVybiB0cnVlXHJcblxyXG4gIGxvY2s6ICh4LCB5LCB2ID0gdHJ1ZSkgLT5cclxuICAgIGlmIHZcclxuICAgICAgQGxvY2tlZENvdW50ICs9IDEgaWYgbm90IEBsb2NrZWRbeF1beV1cclxuICAgIGVsc2VcclxuICAgICAgQGxvY2tlZENvdW50IC09IDEgaWYgQGxvY2tlZFt4XVt5XVxyXG4gICAgQGxvY2tlZFt4XVt5XSA9IHY7XHJcblxyXG5cclxuY2xhc3MgU3Vkb2t1R2VuZXJhdG9yXHJcbiAgQGRpZmZpY3VsdHk6XHJcbiAgICBlYXN5OiAxXHJcbiAgICBtZWRpdW06IDJcclxuICAgIGhhcmQ6IDNcclxuICAgIGV4dHJlbWU6IDRcclxuXHJcbiAgY29uc3RydWN0b3I6IC0+XHJcblxyXG4gIGJvYXJkVG9HcmlkOiAoYm9hcmQpIC0+XHJcbiAgICBuZXdCb2FyZCA9IG5ldyBBcnJheSg5KS5maWxsKG51bGwpXHJcbiAgICBmb3IgaSBpbiBbMC4uLjldXHJcbiAgICAgIG5ld0JvYXJkW2ldID0gbmV3IEFycmF5KDkpLmZpbGwoMClcclxuICAgIGZvciBqIGluIFswLi4uOV1cclxuICAgICAgZm9yIGkgaW4gWzAuLi45XVxyXG4gICAgICAgIGlmIGJvYXJkLmxvY2tlZFtpXVtqXVxyXG4gICAgICAgICAgbmV3Qm9hcmRbaV1bal0gPSBib2FyZC5ncmlkW2ldW2pdXHJcbiAgICByZXR1cm4gbmV3Qm9hcmRcclxuXHJcbiAgZ3JpZFRvQm9hcmQ6IChncmlkKSAtPlxyXG4gICAgYm9hcmQgPSBuZXcgQm9hcmRcclxuICAgIGZvciB5IGluIFswLi4uOV1cclxuICAgICAgZm9yIHggaW4gWzAuLi45XVxyXG4gICAgICAgIGlmIGdyaWRbeF1beV0gPiAwXHJcbiAgICAgICAgICBib2FyZC5ncmlkW3hdW3ldID0gZ3JpZFt4XVt5XVxyXG4gICAgICAgICAgYm9hcmQubG9jayh4LCB5KVxyXG4gICAgcmV0dXJuIGJvYXJkXHJcblxyXG4gIGNlbGxWYWxpZDogKGJvYXJkLCB4LCB5LCB2KSAtPlxyXG4gICAgaWYgYm9hcmQubG9ja2VkW3hdW3ldXHJcbiAgICAgIHJldHVybiBib2FyZC5ncmlkW3hdW3ldID09IHZcclxuXHJcbiAgICBmb3IgaSBpbiBbMC4uLjldXHJcbiAgICAgIGlmICh4ICE9IGkpIGFuZCAoYm9hcmQuZ3JpZFtpXVt5XSA9PSB2KVxyXG4gICAgICAgICAgcmV0dXJuIGZhbHNlXHJcbiAgICAgIGlmICh5ICE9IGkpIGFuZCAoYm9hcmQuZ3JpZFt4XVtpXSA9PSB2KVxyXG4gICAgICAgICAgcmV0dXJuIGZhbHNlXHJcblxyXG4gICAgc3ggPSBNYXRoLmZsb29yKHggLyAzKSAqIDNcclxuICAgIHN5ID0gTWF0aC5mbG9vcih5IC8gMykgKiAzXHJcbiAgICBmb3IgaiBpbiBbMC4uLjNdXHJcbiAgICAgIGZvciBpIGluIFswLi4uM11cclxuICAgICAgICBpZiAoeCAhPSAoc3ggKyBpKSkgJiYgKHkgIT0gKHN5ICsgaikpXHJcbiAgICAgICAgICBpZiBib2FyZC5ncmlkW3N4ICsgaV1bc3kgKyBqXSA9PSB2XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZVxyXG4gICAgcmV0dXJuIHRydWVcclxuXHJcbiAgcGVuY2lsTWFya3M6IChib2FyZCwgeCwgeSkgLT5cclxuICAgIGlmIGJvYXJkLmxvY2tlZFt4XVt5XVxyXG4gICAgICByZXR1cm4gWyBib2FyZC5ncmlkW3hdW3ldIF1cclxuICAgIG1hcmtzID0gW11cclxuICAgIGZvciB2IGluIFsxLi45XVxyXG4gICAgICBpZiBAY2VsbFZhbGlkKGJvYXJkLCB4LCB5LCB2KVxyXG4gICAgICAgIG1hcmtzLnB1c2ggdlxyXG4gICAgaWYgbWFya3MubGVuZ3RoID4gMVxyXG4gICAgICBzaHVmZmxlKG1hcmtzKVxyXG4gICAgcmV0dXJuIG1hcmtzXHJcblxyXG4gIG5leHRBdHRlbXB0OiAoYm9hcmQsIGF0dGVtcHRzKSAtPlxyXG4gICAgcmVtYWluaW5nSW5kZXhlcyA9IFswLi4uODFdXHJcblxyXG4gICAgIyBza2lwIGxvY2tlZCBjZWxsc1xyXG4gICAgZm9yIGluZGV4IGluIFswLi4uODFdXHJcbiAgICAgIHggPSBpbmRleCAlIDlcclxuICAgICAgeSA9IGluZGV4IC8vIDlcclxuICAgICAgaWYgYm9hcmQubG9ja2VkW3hdW3ldXHJcbiAgICAgICAgayA9IHJlbWFpbmluZ0luZGV4ZXMuaW5kZXhPZihpbmRleClcclxuICAgICAgICByZW1haW5pbmdJbmRleGVzLnNwbGljZShrLCAxKSBpZiBrID49IDBcclxuXHJcbiAgICAjIHNraXAgY2VsbHMgdGhhdCBhcmUgYWxyZWFkeSBiZWluZyB0cmllZFxyXG4gICAgZm9yIGEgaW4gYXR0ZW1wdHNcclxuICAgICAgayA9IHJlbWFpbmluZ0luZGV4ZXMuaW5kZXhPZihhLmluZGV4KVxyXG4gICAgICByZW1haW5pbmdJbmRleGVzLnNwbGljZShrLCAxKSBpZiBrID49IDBcclxuXHJcbiAgICByZXR1cm4gbnVsbCBpZiByZW1haW5pbmdJbmRleGVzLmxlbmd0aCA9PSAwICMgYWJvcnQgaWYgdGhlcmUgYXJlIG5vIGNlbGxzIChzaG91bGQgbmV2ZXIgaGFwcGVuKVxyXG5cclxuICAgIGZld2VzdEluZGV4ID0gLTFcclxuICAgIGZld2VzdE1hcmtzID0gWzAuLjldXHJcbiAgICBmb3IgaW5kZXggaW4gcmVtYWluaW5nSW5kZXhlc1xyXG4gICAgICB4ID0gaW5kZXggJSA5XHJcbiAgICAgIHkgPSBpbmRleCAvLyA5XHJcbiAgICAgIG1hcmtzID0gQHBlbmNpbE1hcmtzKGJvYXJkLCB4LCB5KVxyXG5cclxuICAgICAgIyBhYm9ydCBpZiB0aGVyZSBpcyBhIGNlbGwgd2l0aCBubyBwb3NzaWJpbGl0aWVzXHJcbiAgICAgIHJldHVybiBudWxsIGlmIG1hcmtzLmxlbmd0aCA9PSAwXHJcblxyXG4gICAgICAjIGRvbmUgaWYgdGhlcmUgaXMgYSBjZWxsIHdpdGggb25seSBvbmUgcG9zc2liaWxpdHkgKClcclxuICAgICAgcmV0dXJuIHsgaW5kZXg6IGluZGV4LCByZW1haW5pbmc6IG1hcmtzIH0gaWYgbWFya3MubGVuZ3RoID09IDFcclxuXHJcbiAgICAgICMgcmVtZW1iZXIgdGhpcyBjZWxsIGlmIGl0IGhhcyB0aGUgZmV3ZXN0IG1hcmtzIHNvIGZhclxyXG4gICAgICBpZiBtYXJrcy5sZW5ndGggPCBmZXdlc3RNYXJrcy5sZW5ndGhcclxuICAgICAgICBmZXdlc3RJbmRleCA9IGluZGV4XHJcbiAgICAgICAgZmV3ZXN0TWFya3MgPSBtYXJrc1xyXG4gICAgcmV0dXJuIHsgaW5kZXg6IGZld2VzdEluZGV4LCByZW1haW5pbmc6IGZld2VzdE1hcmtzIH1cclxuXHJcbiAgc29sdmU6IChib2FyZCkgLT5cclxuICAgIHNvbHZlZCA9IG5ldyBCb2FyZChib2FyZClcclxuICAgIGF0dGVtcHRzID0gW11cclxuICAgIHJldHVybiBAc29sdmVJbnRlcm5hbChzb2x2ZWQsIGF0dGVtcHRzKVxyXG5cclxuICBoYXNVbmlxdWVTb2x1dGlvbjogKGJvYXJkKSAtPlxyXG4gICAgc29sdmVkID0gbmV3IEJvYXJkKGJvYXJkKVxyXG4gICAgYXR0ZW1wdHMgPSBbXVxyXG5cclxuICAgICMgaWYgdGhlcmUgaXMgbm8gc29sdXRpb24sIHJldHVybiBmYWxzZVxyXG4gICAgcmV0dXJuIGZhbHNlIGlmIEBzb2x2ZUludGVybmFsKHNvbHZlZCwgYXR0ZW1wdHMpID09IG51bGxcclxuXHJcbiAgICB1bmxvY2tlZENvdW50ID0gODEgLSBzb2x2ZWQubG9ja2VkQ291bnRcclxuXHJcbiAgICAjIGlmIHRoZXJlIGFyZSBubyB1bmxvY2tlZCBjZWxscywgdGhlbiB0aGlzIHNvbHV0aW9uIG11c3QgYmUgdW5pcXVlXHJcbiAgICByZXR1cm4gdHJ1ZSBpZiB1bmxvY2tlZENvdW50ID09IDBcclxuXHJcbiAgICAjIGNoZWNrIGZvciBhIHNlY29uZCBzb2x1dGlvblxyXG4gICAgcmV0dXJuIEBzb2x2ZUludGVybmFsKHNvbHZlZCwgYXR0ZW1wdHMsIHVubG9ja2VkQ291bnQtMSkgPT0gbnVsbFxyXG5cclxuICBzb2x2ZUludGVybmFsOiAoc29sdmVkLCBhdHRlbXB0cywgd2Fsa0luZGV4ID0gMCkgLT5cclxuICAgIHVubG9ja2VkQ291bnQgPSA4MSAtIHNvbHZlZC5sb2NrZWRDb3VudFxyXG4gICAgd2hpbGUgd2Fsa0luZGV4IDwgdW5sb2NrZWRDb3VudFxyXG4gICAgICBpZiB3YWxrSW5kZXggPj0gYXR0ZW1wdHMubGVuZ3RoXHJcbiAgICAgICAgYXR0ZW1wdCA9IEBuZXh0QXR0ZW1wdChzb2x2ZWQsIGF0dGVtcHRzKVxyXG4gICAgICAgIGF0dGVtcHRzLnB1c2goYXR0ZW1wdCkgaWYgYXR0ZW1wdCAhPSBudWxsXHJcbiAgICAgIGVsc2VcclxuICAgICAgICBhdHRlbXB0ID0gYXR0ZW1wdHNbd2Fsa0luZGV4XVxyXG5cclxuICAgICAgaWYgYXR0ZW1wdCAhPSBudWxsXHJcbiAgICAgICAgeCA9IGF0dGVtcHQuaW5kZXggJSA5XHJcbiAgICAgICAgeSA9IGF0dGVtcHQuaW5kZXggLy8gOVxyXG4gICAgICAgIGlmIGF0dGVtcHQucmVtYWluaW5nLmxlbmd0aCA+IDBcclxuICAgICAgICAgIHNvbHZlZC5ncmlkW3hdW3ldID0gYXR0ZW1wdC5yZW1haW5pbmcucG9wKClcclxuICAgICAgICAgIHdhbGtJbmRleCArPSAxXHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgICAgYXR0ZW1wdHMucG9wKClcclxuICAgICAgICAgIHNvbHZlZC5ncmlkW3hdW3ldID0gMFxyXG4gICAgICAgICAgd2Fsa0luZGV4IC09IDFcclxuICAgICAgZWxzZVxyXG4gICAgICAgIHdhbGtJbmRleCAtPSAxXHJcblxyXG4gICAgICBpZiB3YWxrSW5kZXggPCAwXHJcbiAgICAgICAgcmV0dXJuIG51bGxcclxuXHJcbiAgICByZXR1cm4gc29sdmVkXHJcblxyXG4gIGdlbmVyYXRlSW50ZXJuYWw6IChhbW91bnRUb1JlbW92ZSkgLT5cclxuICAgIGJvYXJkID0gQHNvbHZlKG5ldyBCb2FyZCgpKVxyXG4gICAgIyBoYWNrXHJcbiAgICBmb3IgaiBpbiBbMC4uLjldXHJcbiAgICAgIGZvciBpIGluIFswLi4uOV1cclxuICAgICAgICBib2FyZC5sb2NrKGksIGopXHJcblxyXG4gICAgaW5kZXhlc1RvUmVtb3ZlID0gc2h1ZmZsZShbMC4uLjgxXSlcclxuICAgIHJlbW92ZWQgPSAwXHJcbiAgICB3aGlsZSByZW1vdmVkIDwgYW1vdW50VG9SZW1vdmVcclxuICAgICAgaWYgaW5kZXhlc1RvUmVtb3ZlLmxlbmd0aCA9PSAwXHJcbiAgICAgICAgYnJlYWtcclxuXHJcbiAgICAgIHJlbW92ZUluZGV4ID0gaW5kZXhlc1RvUmVtb3ZlLnBvcCgpXHJcbiAgICAgIHJ4ID0gcmVtb3ZlSW5kZXggJSA5XHJcbiAgICAgIHJ5ID0gTWF0aC5mbG9vcihyZW1vdmVJbmRleCAvIDkpXHJcblxyXG4gICAgICBuZXh0Qm9hcmQgPSBuZXcgQm9hcmQoYm9hcmQpXHJcbiAgICAgIG5leHRCb2FyZC5ncmlkW3J4XVtyeV0gPSAwXHJcbiAgICAgIG5leHRCb2FyZC5sb2NrKHJ4LCByeSwgZmFsc2UpXHJcblxyXG4gICAgICBpZiBAaGFzVW5pcXVlU29sdXRpb24obmV4dEJvYXJkKVxyXG4gICAgICAgIGJvYXJkID0gbmV4dEJvYXJkXHJcbiAgICAgICAgcmVtb3ZlZCArPSAxXHJcbiAgICAgICAgIyBjb25zb2xlLmxvZyBcInN1Y2Nlc3NmdWxseSByZW1vdmVkICN7cnh9LCN7cnl9XCJcclxuICAgICAgZWxzZVxyXG4gICAgICAgICMgY29uc29sZS5sb2cgXCJmYWlsZWQgdG8gcmVtb3ZlICN7cnh9LCN7cnl9LCBjcmVhdGVzIG5vbi11bmlxdWUgc29sdXRpb25cIlxyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgIGJvYXJkOiBib2FyZFxyXG4gICAgICByZW1vdmVkOiByZW1vdmVkXHJcbiAgICB9XHJcblxyXG4gIGdlbmVyYXRlOiAoZGlmZmljdWx0eSkgLT5cclxuICAgIGFtb3VudFRvUmVtb3ZlID0gc3dpdGNoIGRpZmZpY3VsdHlcclxuICAgICAgd2hlbiBTdWRva3VHZW5lcmF0b3IuZGlmZmljdWx0eS5leHRyZW1lIHRoZW4gNjBcclxuICAgICAgd2hlbiBTdWRva3VHZW5lcmF0b3IuZGlmZmljdWx0eS5oYXJkICAgIHRoZW4gNTJcclxuICAgICAgd2hlbiBTdWRva3VHZW5lcmF0b3IuZGlmZmljdWx0eS5tZWRpdW0gIHRoZW4gNDZcclxuICAgICAgZWxzZSA0MCAjIGVhc3kgLyB1bmtub3duXHJcblxyXG4gICAgYmVzdCA9IG51bGxcclxuICAgIGZvciBhdHRlbXB0IGluIFswLi4uMl1cclxuICAgICAgZ2VuZXJhdGVkID0gQGdlbmVyYXRlSW50ZXJuYWwoYW1vdW50VG9SZW1vdmUpXHJcbiAgICAgIGlmIGdlbmVyYXRlZC5yZW1vdmVkID09IGFtb3VudFRvUmVtb3ZlXHJcbiAgICAgICAgY29uc29sZS5sb2cgXCJSZW1vdmVkIGV4YWN0IGFtb3VudCAje2Ftb3VudFRvUmVtb3ZlfSwgc3RvcHBpbmdcIlxyXG4gICAgICAgIGJlc3QgPSBnZW5lcmF0ZWRcclxuICAgICAgICBicmVha1xyXG5cclxuICAgICAgaWYgYmVzdCA9PSBudWxsXHJcbiAgICAgICAgYmVzdCA9IGdlbmVyYXRlZFxyXG4gICAgICBlbHNlIGlmIGJlc3QucmVtb3ZlZCA8IGdlbmVyYXRlZC5yZW1vdmVkXHJcbiAgICAgICAgYmVzdCA9IGdlbmVyYXRlZFxyXG4gICAgICBjb25zb2xlLmxvZyBcImN1cnJlbnQgYmVzdCAje2Jlc3QucmVtb3ZlZH0gLyAje2Ftb3VudFRvUmVtb3ZlfVwiXHJcblxyXG4gICAgY29uc29sZS5sb2cgXCJnaXZpbmcgdXNlciBib2FyZDogI3tiZXN0LnJlbW92ZWR9IC8gI3thbW91bnRUb1JlbW92ZX1cIlxyXG4gICAgcmV0dXJuIEBib2FyZFRvR3JpZChiZXN0LmJvYXJkKVxyXG5cclxuICB2YWxpZGF0ZUdyaWQ6IChncmlkKSAtPlxyXG4gICAgcmV0dXJuIEBoYXNVbmlxdWVTb2x1dGlvbihAZ3JpZFRvQm9hcmQoZ3JpZCkpXHJcblxyXG4gIHNvbHZlU3RyaW5nOiAoaW1wb3J0U3RyaW5nKSAtPlxyXG4gICAgaWYgaW1wb3J0U3RyaW5nLmluZGV4T2YoXCJTRFwiKSAhPSAwXHJcbiAgICAgIHJldHVybiBmYWxzZVxyXG4gICAgaW1wb3J0U3RyaW5nID0gaW1wb3J0U3RyaW5nLnN1YnN0cigyKVxyXG4gICAgaW1wb3J0U3RyaW5nID0gaW1wb3J0U3RyaW5nLnJlcGxhY2UoL1teMC05XS9nLCBcIlwiKVxyXG4gICAgaWYgaW1wb3J0U3RyaW5nLmxlbmd0aCAhPSA4MVxyXG4gICAgICByZXR1cm4gZmFsc2VcclxuXHJcbiAgICBib2FyZCA9IG5ldyBCb2FyZCgpXHJcblxyXG4gICAgaW5kZXggPSAwXHJcbiAgICB6ZXJvQ2hhckNvZGUgPSBcIjBcIi5jaGFyQ29kZUF0KDApXHJcbiAgICBmb3IgaiBpbiBbMC4uLjldXHJcbiAgICAgIGZvciBpIGluIFswLi4uOV1cclxuICAgICAgICB2ID0gaW1wb3J0U3RyaW5nLmNoYXJDb2RlQXQoaW5kZXgpIC0gemVyb0NoYXJDb2RlXHJcbiAgICAgICAgaW5kZXggKz0gMVxyXG4gICAgICAgIGlmIHYgPiAwXHJcbiAgICAgICAgICBib2FyZC5ncmlkW2pdW2ldID0gdlxyXG4gICAgICAgICAgYm9hcmQubG9jayhqLCBpKVxyXG5cclxuICAgIHNvbHZlZCA9IEBzb2x2ZShib2FyZClcclxuICAgIGlmIHNvbHZlZCA9PSBudWxsXHJcbiAgICAgIGNvbnNvbGUubG9nIFwiRVJST1I6IENhbid0IGJlIHNvbHZlZC5cIlxyXG4gICAgICByZXR1cm4gZmFsc2VcclxuXHJcbiAgICBpZiBub3QgQGhhc1VuaXF1ZVNvbHV0aW9uKGJvYXJkKVxyXG4gICAgICBjb25zb2xlLmxvZyBcIkVSUk9SOiBCb2FyZCBzb2x2ZSBub3QgdW5pcXVlLlwiXHJcbiAgICAgIHJldHVybiBmYWxzZVxyXG5cclxuICAgIGFuc3dlclN0cmluZyA9IFwiXCJcclxuICAgIGZvciBqIGluIFswLi4uOV1cclxuICAgICAgZm9yIGkgaW4gWzAuLi45XVxyXG4gICAgICAgIGFuc3dlclN0cmluZyArPSBcIiN7c29sdmVkLmdyaWRbal1baV19IFwiXHJcbiAgICAgIGFuc3dlclN0cmluZyArPSBcIlxcblwiXHJcblxyXG4gICAgcmV0dXJuIGFuc3dlclN0cmluZ1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBTdWRva3VHZW5lcmF0b3JcclxuIiwiU3Vkb2t1R2VuZXJhdG9yID0gcmVxdWlyZSAnLi9TdWRva3VHZW5lcmF0b3InXHJcblN1ZG9rdUdhbWUgPSByZXF1aXJlICcuL1N1ZG9rdUdhbWUnXHJcblxyXG5QRU5fUE9TX1ggPSAxXHJcblBFTl9QT1NfWSA9IDEwXHJcblBFTl9DTEVBUl9QT1NfWCA9IDJcclxuUEVOX0NMRUFSX1BPU19ZID0gMTNcclxuXHJcblBFTkNJTF9QT1NfWCA9IDVcclxuUEVOQ0lMX1BPU19ZID0gMTBcclxuUEVOQ0lMX0NMRUFSX1BPU19YID0gNlxyXG5QRU5DSUxfQ0xFQVJfUE9TX1kgPSAxM1xyXG5cclxuTUVOVV9QT1NfWCA9IDRcclxuTUVOVV9QT1NfWSA9IDEzXHJcblxyXG5NT0RFX1NUQVJUX1BPU19YID0gMlxyXG5NT0RFX0NFTlRFUl9QT1NfWCA9IDRcclxuTU9ERV9FTkRfUE9TX1ggPSA2XHJcbk1PREVfUE9TX1kgPSA5XHJcblxyXG5VTkRPX1BPU19YID0gMFxyXG5VTkRPX1BPU19ZID0gMTNcclxuUkVET19QT1NfWCA9IDhcclxuUkVET19QT1NfWSA9IDEzXHJcblxyXG5Db2xvciA9XHJcbiAgdmFsdWU6IFwiYmxhY2tcIlxyXG4gIHBlbmNpbDogXCIjMDAwMGZmXCJcclxuICBlcnJvcjogXCIjZmYwMDAwXCJcclxuICBkb25lOiBcIiNjY2NjY2NcIlxyXG4gIG1lbnU6IFwiIzAwODgzM1wiXHJcbiAgbGlua3M6IFwiI2NjMzMzM1wiXHJcbiAgYmFja2dyb3VuZFNlbGVjdGVkOiBcIiNlZWVlYWFcIlxyXG4gIGJhY2tncm91bmRMb2NrZWQ6IFwiI2VlZWVlZVwiXHJcbiAgYmFja2dyb3VuZExvY2tlZENvbmZsaWN0ZWQ6IFwiI2ZmZmZlZVwiXHJcbiAgYmFja2dyb3VuZExvY2tlZFNlbGVjdGVkOiBcIiNlZWVlZGRcIlxyXG4gIGJhY2tncm91bmRDb25mbGljdGVkOiBcIiNmZmZmZGRcIlxyXG4gIGJhY2tncm91bmRFcnJvcjogXCIjZmZkZGRkXCJcclxuICBtb2RlU2VsZWN0OiBcIiM3Nzc3NDRcIlxyXG4gIG1vZGVQZW46IFwiIzAwMDAwMFwiXHJcbiAgbW9kZVBlbmNpbDogXCIjMDAwMGZmXCJcclxuICBtb2RlTGlua3M6IFwiI2NjMzMzM1wiXHJcblxyXG5BY3Rpb25UeXBlID1cclxuICBTRUxFQ1Q6IDBcclxuICBQRU5DSUw6IDFcclxuICBQRU46IDJcclxuICBNRU5VOiAzXHJcbiAgVU5ETzogNFxyXG4gIFJFRE86IDVcclxuICBNT0RFOiA2XHJcblxyXG5Nb2RlVHlwZSA9XHJcbiAgSElHSExJR0hUSU5HOiAwXHJcbiAgUEVOQ0lMOiAxXHJcbiAgUEVOOiAyXHJcbiAgTElOS1M6IDNcclxuXHJcbiMgU3BlY2lhbCBwZW4vcGVuY2lsIHZhbHVlc1xyXG5OT05FID0gMFxyXG5DTEVBUiA9IDEwXHJcblxyXG5jbGFzcyBTdWRva3VWaWV3XHJcbiAgIyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgIyBJbml0XHJcblxyXG4gIGNvbnN0cnVjdG9yOiAoQGFwcCwgQGNhbnZhcykgLT5cclxuICAgIGNvbnNvbGUubG9nIFwiY2FudmFzIHNpemUgI3tAY2FudmFzLndpZHRofXgje0BjYW52YXMuaGVpZ2h0fVwiXHJcblxyXG4gICAgd2lkdGhCYXNlZENlbGxTaXplID0gQGNhbnZhcy53aWR0aCAvIDlcclxuICAgIGhlaWdodEJhc2VkQ2VsbFNpemUgPSBAY2FudmFzLmhlaWdodCAvIDE0XHJcbiAgICBjb25zb2xlLmxvZyBcIndpZHRoQmFzZWRDZWxsU2l6ZSAje3dpZHRoQmFzZWRDZWxsU2l6ZX0gaGVpZ2h0QmFzZWRDZWxsU2l6ZSAje2hlaWdodEJhc2VkQ2VsbFNpemV9XCJcclxuICAgIEBjZWxsU2l6ZSA9IE1hdGgubWluKHdpZHRoQmFzZWRDZWxsU2l6ZSwgaGVpZ2h0QmFzZWRDZWxsU2l6ZSlcclxuXHJcbiAgICAjIGNhbGMgcmVuZGVyIGNvbnN0YW50c1xyXG4gICAgQGxpbmVXaWR0aFRoaW4gPSAxXHJcbiAgICBAbGluZVdpZHRoVGhpY2sgPSBNYXRoLm1heChAY2VsbFNpemUgLyAyMCwgMylcclxuXHJcbiAgICBmb250UGl4ZWxzUyA9IE1hdGguZmxvb3IoQGNlbGxTaXplICogMC4zKVxyXG4gICAgZm9udFBpeGVsc00gPSBNYXRoLmZsb29yKEBjZWxsU2l6ZSAqIDAuNSlcclxuICAgIGZvbnRQaXhlbHNMID0gTWF0aC5mbG9vcihAY2VsbFNpemUgKiAwLjgpXHJcblxyXG4gICAgIyBpbml0IGZvbnRzXHJcbiAgICBAZm9udHMgPVxyXG4gICAgICBwZW5jaWw6ICBAYXBwLnJlZ2lzdGVyRm9udChcInBlbmNpbFwiLCAgXCIje2ZvbnRQaXhlbHNTfXB4IHNheE1vbm8sIG1vbm9zcGFjZVwiKVxyXG4gICAgICBtZW51OiAgICBAYXBwLnJlZ2lzdGVyRm9udChcIm1lbnVcIiwgICAgXCIje2ZvbnRQaXhlbHNNfXB4IHNheE1vbm8sIG1vbm9zcGFjZVwiKVxyXG4gICAgICBwZW46ICAgICBAYXBwLnJlZ2lzdGVyRm9udChcInBlblwiLCAgICAgXCIje2ZvbnRQaXhlbHNMfXB4IHNheE1vbm8sIG1vbm9zcGFjZVwiKVxyXG5cclxuICAgIEBpbml0QWN0aW9ucygpXHJcblxyXG4gICAgIyBpbml0IHN0YXRlXHJcbiAgICBAZ2FtZSA9IG5ldyBTdWRva3VHYW1lKClcclxuICAgIEByZXNldFN0YXRlKClcclxuXHJcbiAgICBAZHJhdygpXHJcblxyXG4gIGluaXRBY3Rpb25zOiAtPlxyXG4gICAgQGFjdGlvbnMgPSBuZXcgQXJyYXkoOSAqIDE1KS5maWxsKG51bGwpXHJcblxyXG4gICAgZm9yIGogaW4gWzAuLi45XVxyXG4gICAgICBmb3IgaSBpbiBbMC4uLjldXHJcbiAgICAgICAgaW5kZXggPSAoaiAqIDkpICsgaVxyXG4gICAgICAgIEBhY3Rpb25zW2luZGV4XSA9IHsgdHlwZTogQWN0aW9uVHlwZS5TRUxFQ1QsIHg6IGksIHk6IGogfVxyXG5cclxuICAgIGZvciBqIGluIFswLi4uM11cclxuICAgICAgZm9yIGkgaW4gWzAuLi4zXVxyXG4gICAgICAgIGluZGV4ID0gKChQRU5fUE9TX1kgKyBqKSAqIDkpICsgKFBFTl9QT1NfWCArIGkpXHJcbiAgICAgICAgQGFjdGlvbnNbaW5kZXhdID0geyB0eXBlOiBBY3Rpb25UeXBlLlBFTiwgdmFsdWU6IDEgKyAoaiAqIDMpICsgaSB9XHJcblxyXG4gICAgZm9yIGogaW4gWzAuLi4zXVxyXG4gICAgICBmb3IgaSBpbiBbMC4uLjNdXHJcbiAgICAgICAgaW5kZXggPSAoKFBFTkNJTF9QT1NfWSArIGopICogOSkgKyAoUEVOQ0lMX1BPU19YICsgaSlcclxuICAgICAgICBAYWN0aW9uc1tpbmRleF0gPSB7IHR5cGU6IEFjdGlvblR5cGUuUEVOQ0lMLCB2YWx1ZTogMSArIChqICogMykgKyBpIH1cclxuXHJcbiAgICAjIFBlbiBjbGVhciBidXR0b25cclxuICAgIGluZGV4ID0gKFBFTl9DTEVBUl9QT1NfWSAqIDkpICsgUEVOX0NMRUFSX1BPU19YXHJcbiAgICBAYWN0aW9uc1tpbmRleF0gPSB7IHR5cGU6IEFjdGlvblR5cGUuUEVOLCB2YWx1ZTogQ0xFQVIgfVxyXG5cclxuICAgICMgUGVuY2lsIGNsZWFyIGJ1dHRvblxyXG4gICAgaW5kZXggPSAoUEVOQ0lMX0NMRUFSX1BPU19ZICogOSkgKyBQRU5DSUxfQ0xFQVJfUE9TX1hcclxuICAgIEBhY3Rpb25zW2luZGV4XSA9IHsgdHlwZTogQWN0aW9uVHlwZS5QRU5DSUwsIHZhbHVlOiBDTEVBUiB9XHJcblxyXG4gICAgIyBNZW51IGJ1dHRvblxyXG4gICAgaW5kZXggPSAoTUVOVV9QT1NfWSAqIDkpICsgTUVOVV9QT1NfWFxyXG4gICAgQGFjdGlvbnNbaW5kZXhdID0geyB0eXBlOiBBY3Rpb25UeXBlLk1FTlUgfVxyXG5cclxuICAgICMgVW5kbyBidXR0b25cclxuICAgIGluZGV4ID0gKFVORE9fUE9TX1kgKiA5KSArIFVORE9fUE9TX1hcclxuICAgIEBhY3Rpb25zW2luZGV4XSA9IHsgdHlwZTogQWN0aW9uVHlwZS5VTkRPIH1cclxuXHJcbiAgICAjIFJlZG8gYnV0dG9uXHJcbiAgICBpbmRleCA9IChSRURPX1BPU19ZICogOSkgKyBSRURPX1BPU19YXHJcbiAgICBAYWN0aW9uc1tpbmRleF0gPSB7IHR5cGU6IEFjdGlvblR5cGUuUkVETyB9XHJcblxyXG4gICAgIyBNb2RlIHN3aXRjaFxyXG4gICAgZm9yIGkgaW4gWyhNT0RFX1BPU19ZKjkpK01PREVfU1RBUlRfUE9TX1guLihNT0RFX1BPU19ZKjkpK01PREVfRU5EX1BPU19YXVxyXG4gICAgICBAYWN0aW9uc1tpXSA9IHsgdHlwZTogQWN0aW9uVHlwZS5NT0RFIH1cclxuXHJcbiAgICByZXR1cm5cclxuXHJcbiAgcmVzZXRTdGF0ZTogLT5cclxuICAgIEBtb2RlID0gTW9kZVR5cGUuSElHSExJR0hUSU5HXHJcbiAgICBAcGVuVmFsdWUgPSBOT05FXHJcbiAgICBAaGlnaGxpZ2h0WCA9IC0xXHJcbiAgICBAaGlnaGxpZ2h0WSA9IC0xXHJcbiAgICBAc3Ryb25nTGlua3MgPSBbXVxyXG4gICAgQHdlYWtMaW5rcyA9IFtdXHJcblxyXG4gICMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICMgUmVuZGVyaW5nXHJcblxyXG4gIGRyYXdDZWxsOiAoeCwgeSwgYmFja2dyb3VuZENvbG9yLCBzLCBmb250LCBjb2xvcikgLT5cclxuICAgIHB4ID0geCAqIEBjZWxsU2l6ZVxyXG4gICAgcHkgPSB5ICogQGNlbGxTaXplXHJcbiAgICBpZiBiYWNrZ3JvdW5kQ29sb3IgIT0gbnVsbFxyXG4gICAgICBAYXBwLmRyYXdGaWxsKHB4LCBweSwgQGNlbGxTaXplLCBAY2VsbFNpemUsIGJhY2tncm91bmRDb2xvcilcclxuICAgIEBhcHAuZHJhd1RleHRDZW50ZXJlZChzLCBweCArIChAY2VsbFNpemUgLyAyKSwgcHkgKyAoQGNlbGxTaXplIC8gMiksIGZvbnQsIGNvbG9yKVxyXG5cclxuICBkcmF3R3JpZDogKG9yaWdpblgsIG9yaWdpblksIHNpemUsIHNvbHZlZCA9IGZhbHNlKSAtPlxyXG4gICAgZm9yIGkgaW4gWzAuLnNpemVdXHJcbiAgICAgIGNvbG9yID0gaWYgc29sdmVkIHRoZW4gXCJncmVlblwiIGVsc2UgXCJibGFja1wiXHJcbiAgICAgIGxpbmVXaWR0aCA9IEBsaW5lV2lkdGhUaGluXHJcbiAgICAgIGlmICgoc2l6ZSA9PSAxKSB8fCAoaSAlIDMpID09IDApXHJcbiAgICAgICAgbGluZVdpZHRoID0gQGxpbmVXaWR0aFRoaWNrXHJcblxyXG4gICAgICAjIEhvcml6b250YWwgbGluZXNcclxuICAgICAgQGFwcC5kcmF3TGluZShAY2VsbFNpemUgKiAob3JpZ2luWCArIDApLCBAY2VsbFNpemUgKiAob3JpZ2luWSArIGkpLCBAY2VsbFNpemUgKiAob3JpZ2luWCArIHNpemUpLCBAY2VsbFNpemUgKiAob3JpZ2luWSArIGkpLCBjb2xvciwgbGluZVdpZHRoKVxyXG5cclxuICAgICAgIyBWZXJ0aWNhbCBsaW5lc1xyXG4gICAgICBAYXBwLmRyYXdMaW5lKEBjZWxsU2l6ZSAqIChvcmlnaW5YICsgaSksIEBjZWxsU2l6ZSAqIChvcmlnaW5ZICsgMCksIEBjZWxsU2l6ZSAqIChvcmlnaW5YICsgaSksIEBjZWxsU2l6ZSAqIChvcmlnaW5ZICsgc2l6ZSksIGNvbG9yLCBsaW5lV2lkdGgpXHJcbiAgICByZXR1cm5cclxuXHJcbiAgZHJhd0xpbms6IChzdGFydFgsIHN0YXJ0WSwgZW5kWCwgZW5kWSwgY29sb3IsIGxpbmVXaWR0aCkgLT5cclxuICAgIHgxID0gKHN0YXJ0WCArIDAuNSkgKiBAY2VsbFNpemVcclxuICAgIHkxID0gKHN0YXJ0WSArIDAuNSkgKiBAY2VsbFNpemVcclxuICAgIHgyID0gKGVuZFggKyAwLjUpICogQGNlbGxTaXplXHJcbiAgICB5MiA9IChlbmRZICsgMC41KSAqIEBjZWxsU2l6ZVxyXG4gICAgciA9IDIuMiAqIE1hdGguc3FydCgoeDIgLSB4MSkgKiAoeDIgLSB4MSkgKyAoeTIgLSB5MSkgKiAoeTIgLSB5MSkpICMgMi4yIGdpdmVzIHRoZSBtb3N0IGN1cnZlIHdpdGhvdXQgZ29pbmcgb2ZmIHRoZSBib2FyZFxyXG4gICAgQGFwcC5kcmF3QXJjKHgxLCB5MSwgeDIsIHkyLCByLCBjb2xvciwgbGluZVdpZHRoKVxyXG5cclxuICBkcmF3OiAoZmxhc2hYLCBmbGFzaFkpIC0+XHJcbiAgICBjb25zb2xlLmxvZyBcImRyYXcoKVwiXHJcblxyXG4gICAgIyBDbGVhciBzY3JlZW4gdG8gYmxhY2tcclxuICAgIEBhcHAuZHJhd0ZpbGwoMCwgMCwgQGNhbnZhcy53aWR0aCwgQGNhbnZhcy5oZWlnaHQsIFwiYmxhY2tcIilcclxuXHJcbiAgICAjIE1ha2Ugd2hpdGUgcGhvbmUtc2hhcGVkIGJhY2tncm91bmRcclxuICAgIEBhcHAuZHJhd0ZpbGwoMCwgMCwgQGNlbGxTaXplICogOSwgQGNhbnZhcy5oZWlnaHQsIFwid2hpdGVcIilcclxuXHJcbiAgICAjIERyYXcgYm9hcmQgbnVtYmVyc1xyXG4gICAgZm9yIGogaW4gWzAuLi45XVxyXG4gICAgICBmb3IgaSBpbiBbMC4uLjldXHJcbiAgICAgICAgaWYgKGkgIT0gZmxhc2hYKSB8fCAoaiAhPSBmbGFzaFkpXHJcbiAgICAgICAgICBjZWxsID0gQGdhbWUuZ3JpZFtpXVtqXVxyXG5cclxuICAgICAgICAgICMgRGV0ZXJtaW5lIHRleHQgYXR0cmlidXRlc1xyXG4gICAgICAgICAgYmFja2dyb3VuZENvbG9yID0gbnVsbFxyXG4gICAgICAgICAgZm9udCA9IEBmb250cy5wZW5cclxuICAgICAgICAgIHRleHRDb2xvciA9IENvbG9yLnZhbHVlXHJcbiAgICAgICAgICB0ZXh0ID0gXCJcIlxyXG4gICAgICAgICAgaWYgY2VsbC52YWx1ZSA9PSAwXHJcbiAgICAgICAgICAgIGZvbnQgPSBAZm9udHMucGVuY2lsXHJcbiAgICAgICAgICAgIHRleHRDb2xvciA9IENvbG9yLnBlbmNpbFxyXG4gICAgICAgICAgICB0ZXh0ID0gQGdhbWUucGVuY2lsU3RyaW5nKGksIGopXHJcbiAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIGlmIGNlbGwudmFsdWUgPiAwXHJcbiAgICAgICAgICAgICAgdGV4dCA9IFN0cmluZyhjZWxsLnZhbHVlKVxyXG5cclxuICAgICAgICAgIGlmIGNlbGwuZXJyb3JcclxuICAgICAgICAgICAgdGV4dENvbG9yID0gQ29sb3IuZXJyb3JcclxuXHJcbiAgICAgICAgICAjIERldGVybWluZSBiYWNrZ3JvdW5kIGNvbG9yXHJcbiAgICAgICAgICBpZiBjZWxsLmxvY2tlZFxyXG4gICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3IgPSBDb2xvci5iYWNrZ3JvdW5kTG9ja2VkXHJcblxyXG4gICAgICAgICAgaWYgQG1vZGUgaXMgTW9kZVR5cGUuSElHSExJR0hUSU5HXHJcbiAgICAgICAgICAgIGlmIChAaGlnaGxpZ2h0WCAhPSAtMSkgJiYgKEBoaWdobGlnaHRZICE9IC0xKVxyXG4gICAgICAgICAgICAgIGlmIChpID09IEBoaWdobGlnaHRYKSAmJiAoaiA9PSBAaGlnaGxpZ2h0WSlcclxuICAgICAgICAgICAgICAgIGlmIGNlbGwubG9ja2VkXHJcbiAgICAgICAgICAgICAgICAgIGJhY2tncm91bmRDb2xvciA9IENvbG9yLmJhY2tncm91bmRMb2NrZWRTZWxlY3RlZFxyXG4gICAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3IgPSBDb2xvci5iYWNrZ3JvdW5kU2VsZWN0ZWRcclxuICAgICAgICAgICAgICBlbHNlIGlmIEBjb25mbGljdHMoaSwgaiwgQGhpZ2hsaWdodFgsIEBoaWdobGlnaHRZKVxyXG4gICAgICAgICAgICAgICAgaWYgY2VsbC5sb2NrZWRcclxuICAgICAgICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yID0gQ29sb3IuYmFja2dyb3VuZExvY2tlZENvbmZsaWN0ZWRcclxuICAgICAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yID0gQ29sb3IuYmFja2dyb3VuZENvbmZsaWN0ZWRcclxuICAgICAgICBlbHNlXHJcbiAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3IgPSBcImJsYWNrXCJcclxuICAgICAgICAgIGZvbnQgPSBAZm9udHMucGVuXHJcbiAgICAgICAgICB0ZXh0Q29sb3IgPSBcImJsYWNrXCJcclxuICAgICAgICAgIHRleHQgPSBcIlwiXHJcbiAgICAgICAgQGRyYXdDZWxsKGksIGosIGJhY2tncm91bmRDb2xvciwgdGV4dCwgZm9udCwgdGV4dENvbG9yKVxyXG5cclxuICAgICMgRHJhdyBsaW5rcyBpbiBMSU5LUyBtb2RlXHJcbiAgICBpZiBAbW9kZSBpcyBNb2RlVHlwZS5MSU5LU1xyXG4gICAgICBmb3IgbGluayBpbiBAc3Ryb25nTGlua3NcclxuICAgICAgICBAZHJhd0xpbmsobGlua1swXS54LCBsaW5rWzBdLnksIGxpbmtbMV0ueCwgbGlua1sxXS55LCBDb2xvci5saW5rcywgQGxpbmVXaWR0aFRoaWNrKVxyXG4gICAgICBmb3IgbGluayBpbiBAd2Vha0xpbmtzXHJcbiAgICAgICAgQGRyYXdMaW5rKGxpbmtbMF0ueCwgbGlua1swXS55LCBsaW5rWzFdLngsIGxpbmtbMV0ueSwgQ29sb3IubGlua3MsIEBsaW5lV2lkdGhUaGluKVxyXG5cclxuICAgICMgRHJhdyBwZW4gYW5kIHBlbmNpbCBudW1iZXIgYnV0dG9uc1xyXG4gICAgZG9uZSA9IEBnYW1lLmRvbmUoKVxyXG4gICAgZm9yIGogaW4gWzAuLi4zXVxyXG4gICAgICBmb3IgaSBpbiBbMC4uLjNdXHJcbiAgICAgICAgY3VycmVudFZhbHVlID0gKGogKiAzKSArIGkgKyAxXHJcbiAgICAgICAgY3VycmVudFZhbHVlU3RyaW5nID0gU3RyaW5nKGN1cnJlbnRWYWx1ZSlcclxuICAgICAgICB2YWx1ZUNvbG9yID0gQ29sb3IudmFsdWVcclxuICAgICAgICBwZW5jaWxDb2xvciA9IENvbG9yLnBlbmNpbFxyXG4gICAgICAgIGlmIGRvbmVbKGogKiAzKSArIGldXHJcbiAgICAgICAgICB2YWx1ZUNvbG9yID0gQ29sb3IuZG9uZVxyXG4gICAgICAgICAgcGVuY2lsQ29sb3IgPSBDb2xvci5kb25lXHJcblxyXG4gICAgICAgIHZhbHVlQmFja2dyb3VuZENvbG9yID0gbnVsbFxyXG4gICAgICAgIHBlbmNpbEJhY2tncm91bmRDb2xvciA9IG51bGxcclxuICAgICAgICBpZiBAcGVuVmFsdWUgPT0gY3VycmVudFZhbHVlXHJcbiAgICAgICAgICBpZiBAbW9kZSBpcyBNb2RlVHlwZS5QRU5DSUwgb3IgQG1vZGUgaXMgTW9kZVR5cGUuTElOS1NcclxuICAgICAgICAgICAgcGVuY2lsQmFja2dyb3VuZENvbG9yID0gQ29sb3IuYmFja2dyb3VuZFNlbGVjdGVkXHJcbiAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIHZhbHVlQmFja2dyb3VuZENvbG9yID0gQ29sb3IuYmFja2dyb3VuZFNlbGVjdGVkXHJcblxyXG4gICAgICAgIEBkcmF3Q2VsbChQRU5fUE9TX1ggKyBpLCBQRU5fUE9TX1kgKyBqLCB2YWx1ZUJhY2tncm91bmRDb2xvciwgY3VycmVudFZhbHVlU3RyaW5nLCBAZm9udHMucGVuLCB2YWx1ZUNvbG9yKVxyXG4gICAgICAgIEBkcmF3Q2VsbChQRU5DSUxfUE9TX1ggKyBpLCBQRU5DSUxfUE9TX1kgKyBqLCBwZW5jaWxCYWNrZ3JvdW5kQ29sb3IsIGN1cnJlbnRWYWx1ZVN0cmluZywgQGZvbnRzLnBlbiwgcGVuY2lsQ29sb3IpXHJcblxyXG4gICAgIyBEcmF3IHBlbiBhbmQgcGVuY2lsIENMRUFSIGJ1dHRvbnNcclxuICAgIHZhbHVlQmFja2dyb3VuZENvbG9yID0gbnVsbFxyXG4gICAgcGVuY2lsQmFja2dyb3VuZENvbG9yID0gbnVsbFxyXG4gICAgaWYgQHBlblZhbHVlID09IENMRUFSXHJcbiAgICAgICAgaWYgQG1vZGUgaXMgTW9kZVR5cGUuUEVOQ0lMXHJcbiAgICAgICAgICAgIHBlbmNpbEJhY2tncm91bmRDb2xvciA9IENvbG9yLmJhY2tncm91bmRTZWxlY3RlZFxyXG4gICAgICAgIGVsc2VcclxuICAgICAgICAgICAgdmFsdWVCYWNrZ3JvdW5kQ29sb3IgPSBDb2xvci5iYWNrZ3JvdW5kU2VsZWN0ZWRcclxuXHJcbiAgICBAZHJhd0NlbGwoUEVOX0NMRUFSX1BPU19YLCBQRU5fQ0xFQVJfUE9TX1ksIHZhbHVlQmFja2dyb3VuZENvbG9yLCBcIkNcIiwgQGZvbnRzLnBlbiwgQ29sb3IuZXJyb3IpXHJcbiAgICBAZHJhd0NlbGwoUEVOQ0lMX0NMRUFSX1BPU19YLCBQRU5DSUxfQ0xFQVJfUE9TX1ksIHBlbmNpbEJhY2tncm91bmRDb2xvciwgXCJDXCIsIEBmb250cy5wZW4sIENvbG9yLmVycm9yKVxyXG5cclxuICAgICMgRHJhdyBtb2RlXHJcbiAgICBzd2l0Y2ggQG1vZGVcclxuICAgICAgd2hlbiBNb2RlVHlwZS5ISUdITElHSFRJTkdcclxuICAgICAgICBtb2RlQ29sb3IgPSBDb2xvci5tb2RlU2VsZWN0XHJcbiAgICAgICAgbW9kZVRleHQgPSBcIkhpZ2hsaWdodGluZ1wiXHJcbiAgICAgIHdoZW4gTW9kZVR5cGUuUEVOQ0lMXHJcbiAgICAgICAgbW9kZUNvbG9yID0gQ29sb3IubW9kZVBlbmNpbFxyXG4gICAgICAgIG1vZGVUZXh0ID0gXCJQZW5jaWxcIlxyXG4gICAgICB3aGVuIE1vZGVUeXBlLlBFTlxyXG4gICAgICAgIG1vZGVDb2xvciA9IENvbG9yLm1vZGVQZW5cclxuICAgICAgICBtb2RlVGV4dCA9IFwiUGVuXCJcclxuICAgICAgd2hlbiBNb2RlVHlwZS5MSU5LU1xyXG4gICAgICAgIG1vZGVDb2xvciA9IENvbG9yLm1vZGVMaW5rc1xyXG4gICAgICAgIG1vZGVUZXh0ID0gXCJMaW5rc1wiXHJcbiAgICBAZHJhd0NlbGwoTU9ERV9DRU5URVJfUE9TX1gsIE1PREVfUE9TX1ksIG51bGwsIG1vZGVUZXh0LCBAZm9udHMubWVudSwgbW9kZUNvbG9yKVxyXG5cclxuICAgIEBkcmF3Q2VsbChNRU5VX1BPU19YLCBNRU5VX1BPU19ZLCBudWxsLCBcIk1lbnVcIiwgQGZvbnRzLm1lbnUsIENvbG9yLm1lbnUpXHJcbiAgICBAZHJhd0NlbGwoVU5ET19QT1NfWCwgVU5ET19QT1NfWSwgbnVsbCwgXCJcXHV7MjVjNH1cIiwgQGZvbnRzLm1lbnUsIENvbG9yLm1lbnUpIGlmIChAZ2FtZS51bmRvSm91cm5hbC5sZW5ndGggPiAwKVxyXG4gICAgQGRyYXdDZWxsKFJFRE9fUE9TX1gsIFJFRE9fUE9TX1ksIG51bGwsIFwiXFx1ezI1YmF9XCIsIEBmb250cy5tZW51LCBDb2xvci5tZW51KSBpZiAoQGdhbWUucmVkb0pvdXJuYWwubGVuZ3RoID4gMClcclxuXHJcbiAgICAjIE1ha2UgdGhlIGdyaWRzXHJcbiAgICBAZHJhd0dyaWQoMCwgMCwgOSwgQGdhbWUuc29sdmVkKVxyXG4gICAgQGRyYXdHcmlkKFBFTl9QT1NfWCwgUEVOX1BPU19ZLCAzKVxyXG4gICAgQGRyYXdHcmlkKFBFTkNJTF9QT1NfWCwgUEVOQ0lMX1BPU19ZLCAzKVxyXG4gICAgQGRyYXdHcmlkKFBFTl9DTEVBUl9QT1NfWCwgUEVOX0NMRUFSX1BPU19ZLCAxKVxyXG4gICAgQGRyYXdHcmlkKFBFTkNJTF9DTEVBUl9QT1NfWCwgUEVOQ0lMX0NMRUFSX1BPU19ZLCAxKVxyXG5cclxuICAjIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAjIElucHV0XHJcblxyXG4gIG5ld0dhbWU6IChkaWZmaWN1bHR5KSAtPlxyXG4gICAgY29uc29sZS5sb2cgXCJTdWRva3VWaWV3Lm5ld0dhbWUoI3tkaWZmaWN1bHR5fSlcIlxyXG4gICAgQHJlc2V0U3RhdGUoKVxyXG4gICAgQGdhbWUubmV3R2FtZShkaWZmaWN1bHR5KVxyXG5cclxuICByZXNldDogLT5cclxuICAgIEByZXNldFN0YXRlKClcclxuICAgIEBnYW1lLnJlc2V0KClcclxuXHJcbiAgaW1wb3J0OiAoaW1wb3J0U3RyaW5nKSAtPlxyXG4gICAgQHJlc2V0U3RhdGUoKVxyXG4gICAgcmV0dXJuIEBnYW1lLmltcG9ydChpbXBvcnRTdHJpbmcpXHJcblxyXG4gIGV4cG9ydDogLT5cclxuICAgIHJldHVybiBAZ2FtZS5leHBvcnQoKVxyXG5cclxuICBob2xlQ291bnQ6IC0+XHJcbiAgICByZXR1cm4gQGdhbWUuaG9sZUNvdW50KClcclxuXHJcbiAgaGFuZGxlU2VsZWN0QWN0aW9uOiAoYWN0aW9uKSAtPlxyXG4gICAgc3dpdGNoIEBtb2RlXHJcbiAgICAgIHdoZW4gTW9kZVR5cGUuSElHSExJR0hUSU5HXHJcbiAgICAgICAgaWYgKEBoaWdobGlnaHRYID09IGFjdGlvbi54KSAmJiAoQGhpZ2hsaWdodFkgPT0gYWN0aW9uLnkpXHJcbiAgICAgICAgICBAaGlnaGxpZ2h0WCA9IC0xXHJcbiAgICAgICAgICBAaGlnaGxpZ2h0WSA9IC0xXHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgICAgQGhpZ2hsaWdodFggPSBhY3Rpb24ueFxyXG4gICAgICAgICAgQGhpZ2hsaWdodFkgPSBhY3Rpb24ueVxyXG4gICAgICAgIHJldHVybiBbXVxyXG4gICAgICB3aGVuIE1vZGVUeXBlLlBFTkNJTFxyXG4gICAgICAgIGlmIEBwZW5WYWx1ZSA9PSBDTEVBUlxyXG4gICAgICAgICAgQGdhbWUuY2xlYXJQZW5jaWwoYWN0aW9uLngsIGFjdGlvbi55KVxyXG4gICAgICAgIGVsc2UgaWYgQHBlblZhbHVlICE9IE5PTkVcclxuICAgICAgICAgIEBnYW1lLnRvZ2dsZVBlbmNpbChhY3Rpb24ueCwgYWN0aW9uLnksIEBwZW5WYWx1ZSlcclxuICAgICAgICByZXR1cm4gWyBhY3Rpb24ueCwgYWN0aW9uLnkgXVxyXG4gICAgICB3aGVuIE1vZGVUeXBlLlBFTlxyXG4gICAgICAgIGlmIEBwZW5WYWx1ZSA9PSBDTEVBUlxyXG4gICAgICAgICAgQGdhbWUuc2V0VmFsdWUoYWN0aW9uLngsIGFjdGlvbi55LCAwKVxyXG4gICAgICAgIGVsc2UgaWYgQHBlblZhbHVlICE9IE5PTkVcclxuICAgICAgICAgIEBnYW1lLnNldFZhbHVlKGFjdGlvbi54LCBhY3Rpb24ueSwgQHBlblZhbHVlKVxyXG4gICAgICAgIHJldHVybiBbIGFjdGlvbi54LCBhY3Rpb24ueSBdXHJcblxyXG4gIGhhbmRsZVBlbmNpbEFjdGlvbjogKGFjdGlvbikgLT5cclxuICAgICMgSW4gTElOS1MgbW9kZSwgYWxsIGxpbmtzIGFzc29jaWF0ZWQgd2l0aCB0aGUgbnVtYmVyIGFyZSBzaG93bi4gQ0xFQVIgc2hvd3Mgbm90aGluZy5cclxuICAgIGlmIEBtb2RlIGlzIE1vZGVUeXBlLkxJTktTXHJcbiAgICAgIGlmIChhY3Rpb24udmFsdWUgPT0gQ0xFQVIpXHJcbiAgICAgICAgQHBlblZhbHVlID0gTk9ORVxyXG4gICAgICAgIEBzdHJvbmdMaW5rcyA9IFtdXHJcbiAgICAgICAgQHdlYWtMaW5rcyA9IFtdXHJcbiAgICAgIGVsc2VcclxuICAgICAgICBAcGVuVmFsdWUgPSBhY3Rpb24udmFsdWVcclxuICAgICAgICB7IHN0cm9uZzogQHN0cm9uZ0xpbmtzLCB3ZWFrOiBAd2Vha0xpbmtzIH0gPSBAZ2FtZS5nZXRMaW5rcyhhY3Rpb24udmFsdWUpXHJcblxyXG4gICAgIyBJbiBQRU5DSUwgbW9kZSwgdGhlIG1vZGUgaXMgY2hhbmdlZCB0byBISUdITElHSFRJTkcgaWYgdGhlIHNlbGVjdGVkIHZhbHVlIGlzIGFscmVhZHkgY3VycmVudFxyXG4gICAgZWxzZSBpZiBAbW9kZSBpcyBNb2RlVHlwZS5QRU5DSUwgYW5kIChAcGVuVmFsdWUgPT0gYWN0aW9uLnZhbHVlKVxyXG4gICAgICBAbW9kZSA9IE1vZGVUeXBlLkhJR0hMSUdIVElOR1xyXG4gICAgICBAcGVuVmFsdWUgPSBOT05FXHJcblxyXG4gICAgIyBPdGhlcndpc2UsIHRoZSBtb2RlIGlzIHN3aXRjaGVkIHRvIChvciByZW1haW5zIGFzKSBQRU5DSUwgdXNpbmcgdGhlIHNlbGVjdGVkIHZhbHVlXHJcbiAgICBlbHNlXHJcbiAgICAgIEBtb2RlID0gTW9kZVR5cGUuUEVOQ0lMXHJcbiAgICAgIEBwZW5WYWx1ZSA9IGFjdGlvbi52YWx1ZVxyXG5cclxuICAgICAgIyBNYWtlIHN1cmUgYW55IGhpZ2hsaWdodGluZyBpcyBvZmYgYW5kIGxpbmtzIGFyZSBjbGVhcmVkLlxyXG4gICAgICBAaGlnaGxpZ2h0WCA9IC0xXHJcbiAgICAgIEBoaWdobGlnaHRZID0gLTFcclxuICAgICAgQHN0cm9uZ0xpbmtzID0gW11cclxuICAgICAgQHdlYWtMaW5rcyA9IFtdXHJcblxyXG4gIGhhbmRsZVBlbkFjdGlvbjogKGFjdGlvbikgLT5cclxuICAgICMgSWdub3JlZCBpbiBMSU5LUyBtb2RlXHJcbiAgICBpZiBAbW9kZSBpcyBNb2RlVHlwZS5MSU5LU1xyXG4gICAgICByZXR1cm5cclxuXHJcbiAgICAjIEluIFBFTiBtb2RlLCB0aGUgbW9kZSBpcyBjaGFuZ2VkIHRvIEhJR0hMSUdIVElORyBpZiB0aGUgc2VsZWN0ZWQgdmFsdWUgaXMgYWxyZWFkeSBjdXJyZW50XHJcbiAgICBpZiBAbW9kZSBpcyBNb2RlVHlwZS5QRU4gYW5kIChAcGVuVmFsdWUgPT0gYWN0aW9uLnZhbHVlKVxyXG4gICAgICBAbW9kZSA9IE1vZGVUeXBlLkhJR0hMSUdIVElOR1xyXG4gICAgICBAcGVuVmFsdWUgPSBOT05FXHJcblxyXG4gICAgIyBPdGhlcndpc2UsIHRoZSBtb2RlIGlzIHN3aXRjaGVkIHRvIChvciByZW1haW5zIGFzKSBQRU4gdXNpbmcgdGhlIHNlbGVjdGVkIHZhbHVlXHJcbiAgICBlbHNlXHJcbiAgICAgIEBtb2RlID0gTW9kZVR5cGUuUEVOXHJcbiAgICAgIEBwZW5WYWx1ZSA9IGFjdGlvbi52YWx1ZVxyXG5cclxuICAgICAgIyBNYWtlIHN1cmUgYW55IGhpZ2hsaWdodGluZyBpcyBvZmYgYW5kIGxpbmtzIGFyZSBjbGVhcmVkLlxyXG4gICAgQGhpZ2hsaWdodFggPSAtMVxyXG4gICAgQGhpZ2hsaWdodFkgPSAtMVxyXG4gICAgQHN0cm9uZ0xpbmtzID0gW11cclxuICAgIEB3ZWFrTGlua3MgPSBbXVxyXG5cclxuICBoYW5kbGVVbmRvQWN0aW9uOiAtPlxyXG4gICAgcmV0dXJuIEBnYW1lLnVuZG8oKSBpZiBAbW9kZSBpc250IE1vZGVUeXBlLkxJTktTXHJcbiAgICBcclxuICBoYW5kbGVSZWRvQWN0aW9uOiAtPlxyXG4gICAgcmV0dXJuIEBnYW1lLnJlZG8oKSBpZiBAbW9kZSBpc250IE1vZGVUeXBlLkxJTktTXHJcbiAgICBcclxuICBoYW5kbGVNb2RlQWN0aW9uOiAtPlxyXG4gICAgc3dpdGNoIEBtb2RlXHJcbiAgICAgIHdoZW4gTW9kZVR5cGUuSElHSExJR0hUSU5HXHJcbiAgICAgICAgQG1vZGUgPSBNb2RlVHlwZS5MSU5LU1xyXG4gICAgICB3aGVuIE1vZGVUeXBlLlBFTkNJTFxyXG4gICAgICAgIEBtb2RlID0gTW9kZVR5cGUuUEVOXHJcbiAgICAgIHdoZW4gTW9kZVR5cGUuUEVOXHJcbiAgICAgICAgQG1vZGUgPSBNb2RlVHlwZS5ISUdITElHSFRJTkdcclxuICAgICAgd2hlbiBNb2RlVHlwZS5MSU5LU1xyXG4gICAgICAgIEBtb2RlID0gTW9kZVR5cGUuUEVOQ0lMXHJcbiAgICBAaGlnaGxpZ2h0WCA9IC0xXHJcbiAgICBAaGlnaGxpZ2h0WSA9IC0xXHJcbiAgICBAcGVuVmFsdWUgPSBOT05FXHJcbiAgICBAc3Ryb25nTGlua3MgPSBbXVxyXG4gICAgQHdlYWtMaW5rcyA9IFtdXHJcbiAgICBcclxuICBjbGljazogKHgsIHkpIC0+XHJcbiAgICAjIGNvbnNvbGUubG9nIFwiY2xpY2sgI3t4fSwgI3t5fVwiXHJcbiAgICB4ID0gTWF0aC5mbG9vcih4IC8gQGNlbGxTaXplKVxyXG4gICAgeSA9IE1hdGguZmxvb3IoeSAvIEBjZWxsU2l6ZSlcclxuXHJcbiAgICBmbGFzaFggPSBudWxsXHJcbiAgICBmbGFzaFkgPSBudWxsXHJcbiAgICBpZiAoeCA8IDkpICYmICh5IDwgMTUpXHJcbiAgICAgICAgaW5kZXggPSAoeSAqIDkpICsgeFxyXG4gICAgICAgIGFjdGlvbiA9IEBhY3Rpb25zW2luZGV4XVxyXG4gICAgICAgIGlmIGFjdGlvbiAhPSBudWxsXHJcbiAgICAgICAgICBjb25zb2xlLmxvZyBcIkFjdGlvbjogXCIsIGFjdGlvblxyXG5cclxuICAgICAgICAgIGlmIGFjdGlvbi50eXBlIGlzIEFjdGlvblR5cGUuTUVOVVxyXG4gICAgICAgICAgICBAYXBwLnN3aXRjaFZpZXcoXCJtZW51XCIpXHJcbiAgICAgICAgICAgIHJldHVyblxyXG5cclxuICAgICAgICAgIHN3aXRjaCBhY3Rpb24udHlwZSBcclxuICAgICAgICAgICAgd2hlbiBBY3Rpb25UeXBlLlNFTEVDVCB0aGVuIFsgZmxhc2hYLCBmbGFzaFkgXSA9IEBoYW5kbGVTZWxlY3RBY3Rpb24oYWN0aW9uKVxyXG4gICAgICAgICAgICB3aGVuIEFjdGlvblR5cGUuUEVOQ0lMIHRoZW4gQGhhbmRsZVBlbmNpbEFjdGlvbihhY3Rpb24pXHJcbiAgICAgICAgICAgIHdoZW4gQWN0aW9uVHlwZS5QRU4gdGhlbiBAaGFuZGxlUGVuQWN0aW9uKGFjdGlvbilcclxuICAgICAgICAgICAgd2hlbiBBY3Rpb25UeXBlLlVORE8gdGhlbiBbIGZsYXNoWCwgZmxhc2hZIF0gPSBAaGFuZGxlVW5kb0FjdGlvbigpXHJcbiAgICAgICAgICAgIHdoZW4gQWN0aW9uVHlwZS5SRURPIHRoZW4gWyBmbGFzaFgsIGZsYXNoWSBdID0gQGhhbmRsZVJlZG9BY3Rpb24oKVxyXG4gICAgICAgICAgICB3aGVuIEFjdGlvblR5cGUuTU9ERSB0aGVuIEBoYW5kbGVNb2RlQWN0aW9uKClcclxuICAgICAgICBlbHNlXHJcbiAgICAgICAgICAjIG5vIGFjdGlvbiwgZGVmYXVsdCB0byBoaWdobGlnaHRpbmcgbW9kZVxyXG4gICAgICAgICAgQG1vZGUgPSBNb2RlVHlwZS5ISUdITElHSFRJTkdcclxuICAgICAgICAgIEBoaWdobGlnaHRYID0gLTFcclxuICAgICAgICAgIEBoaWdobGlnaHRZID0gLTFcclxuICAgICAgICAgIEBwZW5WYWx1ZSA9IE5PTkVcclxuICAgICAgICAgIEBzdHJvbmdMaW5rcyA9IFtdXHJcbiAgICAgICAgICBAd2Vha0xpbmtzID0gW11cclxuXHJcbiAgICAgICAgQGRyYXcoZmxhc2hYLCBmbGFzaFkpXHJcbiAgICAgICAgaWYgKGZsYXNoWD8gJiYgZmxhc2hZPylcclxuICAgICAgICAgIHNldFRpbWVvdXQgPT5cclxuICAgICAgICAgICAgQGRyYXcoKVxyXG4gICAgICAgICAgLCAzM1xyXG5cclxuICAjIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAjIEhlbHBlcnNcclxuXHJcbiAgY29uZmxpY3RzOiAoeDEsIHkxLCB4MiwgeTIpIC0+XHJcbiAgICAjIHNhbWUgcm93IG9yIGNvbHVtbj9cclxuICAgIGlmICh4MSA9PSB4MikgfHwgKHkxID09IHkyKVxyXG4gICAgICByZXR1cm4gdHJ1ZVxyXG5cclxuICAgICMgc2FtZSBzZWN0aW9uP1xyXG4gICAgc3gxID0gTWF0aC5mbG9vcih4MSAvIDMpICogM1xyXG4gICAgc3kxID0gTWF0aC5mbG9vcih5MSAvIDMpICogM1xyXG4gICAgc3gyID0gTWF0aC5mbG9vcih4MiAvIDMpICogM1xyXG4gICAgc3kyID0gTWF0aC5mbG9vcih5MiAvIDMpICogM1xyXG4gICAgaWYgKHN4MSA9PSBzeDIpICYmIChzeTEgPT0gc3kyKVxyXG4gICAgICByZXR1cm4gdHJ1ZVxyXG5cclxuICAgIHJldHVybiBmYWxzZVxyXG5cclxuICAjIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gU3Vkb2t1Vmlld1xyXG4iLCJBcHAgPSByZXF1aXJlICcuL0FwcCdcclxuXHJcbmluaXQgPSAtPlxyXG4gIGNvbnNvbGUubG9nIFwiaW5pdFwiXHJcbiAgY2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImNhbnZhc1wiKVxyXG4gIGNhbnZhcy53aWR0aCA9IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGllbnRXaWR0aFxyXG4gIGNhbnZhcy5oZWlnaHQgPSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50SGVpZ2h0XHJcbiAgZG9jdW1lbnQuYm9keS5pbnNlcnRCZWZvcmUoY2FudmFzLCBkb2N1bWVudC5ib2R5LmNoaWxkTm9kZXNbMF0pXHJcbiAgY2FudmFzUmVjdCA9IGNhbnZhcy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKVxyXG5cclxuICB3aW5kb3cuYXBwID0gbmV3IEFwcChjYW52YXMpXHJcblxyXG4gICMgY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIgXCJ0b3VjaHN0YXJ0XCIsIChlKSAtPlxyXG4gICMgICBjb25zb2xlLmxvZyBPYmplY3Qua2V5cyhlLnRvdWNoZXNbMF0pXHJcbiAgIyAgIHggPSBlLnRvdWNoZXNbMF0uY2xpZW50WCAtIGNhbnZhc1JlY3QubGVmdFxyXG4gICMgICB5ID0gZS50b3VjaGVzWzBdLmNsaWVudFkgLSBjYW52YXNSZWN0LnRvcFxyXG4gICMgICB3aW5kb3cuYXBwLmNsaWNrKHgsIHkpXHJcblxyXG4gIGNhbnZhcy5hZGRFdmVudExpc3RlbmVyIFwibW91c2Vkb3duXCIsIChlKSAtPlxyXG4gICAgeCA9IGUuY2xpZW50WCAtIGNhbnZhc1JlY3QubGVmdFxyXG4gICAgeSA9IGUuY2xpZW50WSAtIGNhbnZhc1JlY3QudG9wXHJcbiAgICB3aW5kb3cuYXBwLmNsaWNrKHgsIHkpXHJcblxyXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsIChlKSAtPlxyXG4gICAgaW5pdCgpXHJcbiwgZmFsc2UpXHJcbiIsIm1vZHVsZS5leHBvcnRzID0gXCIwLjAuMTFcIiIsIi8qIEZvbnQgRmFjZSBPYnNlcnZlciB2Mi4wLjEzIC0gwqkgQnJhbSBTdGVpbi4gTGljZW5zZTogQlNELTMtQ2xhdXNlICovKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gbChhLGIpe2RvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXI/YS5hZGRFdmVudExpc3RlbmVyKFwic2Nyb2xsXCIsYiwhMSk6YS5hdHRhY2hFdmVudChcInNjcm9sbFwiLGIpfWZ1bmN0aW9uIG0oYSl7ZG9jdW1lbnQuYm9keT9hKCk6ZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcj9kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwiRE9NQ29udGVudExvYWRlZFwiLGZ1bmN0aW9uIGMoKXtkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKFwiRE9NQ29udGVudExvYWRlZFwiLGMpO2EoKX0pOmRvY3VtZW50LmF0dGFjaEV2ZW50KFwib25yZWFkeXN0YXRlY2hhbmdlXCIsZnVuY3Rpb24gaygpe2lmKFwiaW50ZXJhY3RpdmVcIj09ZG9jdW1lbnQucmVhZHlTdGF0ZXx8XCJjb21wbGV0ZVwiPT1kb2N1bWVudC5yZWFkeVN0YXRlKWRvY3VtZW50LmRldGFjaEV2ZW50KFwib25yZWFkeXN0YXRlY2hhbmdlXCIsayksYSgpfSl9O2Z1bmN0aW9uIHIoYSl7dGhpcy5hPWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7dGhpcy5hLnNldEF0dHJpYnV0ZShcImFyaWEtaGlkZGVuXCIsXCJ0cnVlXCIpO3RoaXMuYS5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShhKSk7dGhpcy5iPWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpO3RoaXMuYz1kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTt0aGlzLmg9ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIik7dGhpcy5mPWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpO3RoaXMuZz0tMTt0aGlzLmIuc3R5bGUuY3NzVGV4dD1cIm1heC13aWR0aDpub25lO2Rpc3BsYXk6aW5saW5lLWJsb2NrO3Bvc2l0aW9uOmFic29sdXRlO2hlaWdodDoxMDAlO3dpZHRoOjEwMCU7b3ZlcmZsb3c6c2Nyb2xsO2ZvbnQtc2l6ZToxNnB4O1wiO3RoaXMuYy5zdHlsZS5jc3NUZXh0PVwibWF4LXdpZHRoOm5vbmU7ZGlzcGxheTppbmxpbmUtYmxvY2s7cG9zaXRpb246YWJzb2x1dGU7aGVpZ2h0OjEwMCU7d2lkdGg6MTAwJTtvdmVyZmxvdzpzY3JvbGw7Zm9udC1zaXplOjE2cHg7XCI7XG50aGlzLmYuc3R5bGUuY3NzVGV4dD1cIm1heC13aWR0aDpub25lO2Rpc3BsYXk6aW5saW5lLWJsb2NrO3Bvc2l0aW9uOmFic29sdXRlO2hlaWdodDoxMDAlO3dpZHRoOjEwMCU7b3ZlcmZsb3c6c2Nyb2xsO2ZvbnQtc2l6ZToxNnB4O1wiO3RoaXMuaC5zdHlsZS5jc3NUZXh0PVwiZGlzcGxheTppbmxpbmUtYmxvY2s7d2lkdGg6MjAwJTtoZWlnaHQ6MjAwJTtmb250LXNpemU6MTZweDttYXgtd2lkdGg6bm9uZTtcIjt0aGlzLmIuYXBwZW5kQ2hpbGQodGhpcy5oKTt0aGlzLmMuYXBwZW5kQ2hpbGQodGhpcy5mKTt0aGlzLmEuYXBwZW5kQ2hpbGQodGhpcy5iKTt0aGlzLmEuYXBwZW5kQ2hpbGQodGhpcy5jKX1cbmZ1bmN0aW9uIHQoYSxiKXthLmEuc3R5bGUuY3NzVGV4dD1cIm1heC13aWR0aDpub25lO21pbi13aWR0aDoyMHB4O21pbi1oZWlnaHQ6MjBweDtkaXNwbGF5OmlubGluZS1ibG9jaztvdmVyZmxvdzpoaWRkZW47cG9zaXRpb246YWJzb2x1dGU7d2lkdGg6YXV0bzttYXJnaW46MDtwYWRkaW5nOjA7dG9wOi05OTlweDt3aGl0ZS1zcGFjZTpub3dyYXA7Zm9udC1zeW50aGVzaXM6bm9uZTtmb250OlwiK2IrXCI7XCJ9ZnVuY3Rpb24geShhKXt2YXIgYj1hLmEub2Zmc2V0V2lkdGgsYz1iKzEwMDthLmYuc3R5bGUud2lkdGg9YytcInB4XCI7YS5jLnNjcm9sbExlZnQ9YzthLmIuc2Nyb2xsTGVmdD1hLmIuc2Nyb2xsV2lkdGgrMTAwO3JldHVybiBhLmchPT1iPyhhLmc9YiwhMCk6ITF9ZnVuY3Rpb24geihhLGIpe2Z1bmN0aW9uIGMoKXt2YXIgYT1rO3koYSkmJmEuYS5wYXJlbnROb2RlJiZiKGEuZyl9dmFyIGs9YTtsKGEuYixjKTtsKGEuYyxjKTt5KGEpfTtmdW5jdGlvbiBBKGEsYil7dmFyIGM9Ynx8e307dGhpcy5mYW1pbHk9YTt0aGlzLnN0eWxlPWMuc3R5bGV8fFwibm9ybWFsXCI7dGhpcy53ZWlnaHQ9Yy53ZWlnaHR8fFwibm9ybWFsXCI7dGhpcy5zdHJldGNoPWMuc3RyZXRjaHx8XCJub3JtYWxcIn12YXIgQj1udWxsLEM9bnVsbCxFPW51bGwsRj1udWxsO2Z1bmN0aW9uIEcoKXtpZihudWxsPT09QylpZihKKCkmJi9BcHBsZS8udGVzdCh3aW5kb3cubmF2aWdhdG9yLnZlbmRvcikpe3ZhciBhPS9BcHBsZVdlYktpdFxcLyhbMC05XSspKD86XFwuKFswLTldKykpKD86XFwuKFswLTldKykpLy5leGVjKHdpbmRvdy5uYXZpZ2F0b3IudXNlckFnZW50KTtDPSEhYSYmNjAzPnBhcnNlSW50KGFbMV0sMTApfWVsc2UgQz0hMTtyZXR1cm4gQ31mdW5jdGlvbiBKKCl7bnVsbD09PUYmJihGPSEhZG9jdW1lbnQuZm9udHMpO3JldHVybiBGfVxuZnVuY3Rpb24gSygpe2lmKG51bGw9PT1FKXt2YXIgYT1kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO3RyeXthLnN0eWxlLmZvbnQ9XCJjb25kZW5zZWQgMTAwcHggc2Fucy1zZXJpZlwifWNhdGNoKGIpe31FPVwiXCIhPT1hLnN0eWxlLmZvbnR9cmV0dXJuIEV9ZnVuY3Rpb24gTChhLGIpe3JldHVyblthLnN0eWxlLGEud2VpZ2h0LEsoKT9hLnN0cmV0Y2g6XCJcIixcIjEwMHB4XCIsYl0uam9pbihcIiBcIil9XG5BLnByb3RvdHlwZS5sb2FkPWZ1bmN0aW9uKGEsYil7dmFyIGM9dGhpcyxrPWF8fFwiQkVTYnN3eVwiLHE9MCxEPWJ8fDNFMyxIPShuZXcgRGF0ZSkuZ2V0VGltZSgpO3JldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihhLGIpe2lmKEooKSYmIUcoKSl7dmFyIE09bmV3IFByb21pc2UoZnVuY3Rpb24oYSxiKXtmdW5jdGlvbiBlKCl7KG5ldyBEYXRlKS5nZXRUaW1lKCktSD49RD9iKCk6ZG9jdW1lbnQuZm9udHMubG9hZChMKGMsJ1wiJytjLmZhbWlseSsnXCInKSxrKS50aGVuKGZ1bmN0aW9uKGMpezE8PWMubGVuZ3RoP2EoKTpzZXRUaW1lb3V0KGUsMjUpfSxmdW5jdGlvbigpe2IoKX0pfWUoKX0pLE49bmV3IFByb21pc2UoZnVuY3Rpb24oYSxjKXtxPXNldFRpbWVvdXQoYyxEKX0pO1Byb21pc2UucmFjZShbTixNXSkudGhlbihmdW5jdGlvbigpe2NsZWFyVGltZW91dChxKTthKGMpfSxmdW5jdGlvbigpe2IoYyl9KX1lbHNlIG0oZnVuY3Rpb24oKXtmdW5jdGlvbiB1KCl7dmFyIGI7aWYoYj0tMSE9XG5mJiYtMSE9Z3x8LTEhPWYmJi0xIT1ofHwtMSE9ZyYmLTEhPWgpKGI9ZiE9ZyYmZiE9aCYmZyE9aCl8fChudWxsPT09QiYmKGI9L0FwcGxlV2ViS2l0XFwvKFswLTldKykoPzpcXC4oWzAtOV0rKSkvLmV4ZWMod2luZG93Lm5hdmlnYXRvci51c2VyQWdlbnQpLEI9ISFiJiYoNTM2PnBhcnNlSW50KGJbMV0sMTApfHw1MzY9PT1wYXJzZUludChiWzFdLDEwKSYmMTE+PXBhcnNlSW50KGJbMl0sMTApKSksYj1CJiYoZj09diYmZz09diYmaD09dnx8Zj09dyYmZz09dyYmaD09d3x8Zj09eCYmZz09eCYmaD09eCkpLGI9IWI7YiYmKGQucGFyZW50Tm9kZSYmZC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGQpLGNsZWFyVGltZW91dChxKSxhKGMpKX1mdW5jdGlvbiBJKCl7aWYoKG5ldyBEYXRlKS5nZXRUaW1lKCktSD49RClkLnBhcmVudE5vZGUmJmQucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChkKSxiKGMpO2Vsc2V7dmFyIGE9ZG9jdW1lbnQuaGlkZGVuO2lmKCEwPT09YXx8dm9pZCAwPT09YSlmPWUuYS5vZmZzZXRXaWR0aCxcbmc9bi5hLm9mZnNldFdpZHRoLGg9cC5hLm9mZnNldFdpZHRoLHUoKTtxPXNldFRpbWVvdXQoSSw1MCl9fXZhciBlPW5ldyByKGspLG49bmV3IHIoaykscD1uZXcgcihrKSxmPS0xLGc9LTEsaD0tMSx2PS0xLHc9LTEseD0tMSxkPWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7ZC5kaXI9XCJsdHJcIjt0KGUsTChjLFwic2Fucy1zZXJpZlwiKSk7dChuLEwoYyxcInNlcmlmXCIpKTt0KHAsTChjLFwibW9ub3NwYWNlXCIpKTtkLmFwcGVuZENoaWxkKGUuYSk7ZC5hcHBlbmRDaGlsZChuLmEpO2QuYXBwZW5kQ2hpbGQocC5hKTtkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGQpO3Y9ZS5hLm9mZnNldFdpZHRoO3c9bi5hLm9mZnNldFdpZHRoO3g9cC5hLm9mZnNldFdpZHRoO0koKTt6KGUsZnVuY3Rpb24oYSl7Zj1hO3UoKX0pO3QoZSxMKGMsJ1wiJytjLmZhbWlseSsnXCIsc2Fucy1zZXJpZicpKTt6KG4sZnVuY3Rpb24oYSl7Zz1hO3UoKX0pO3QobixMKGMsJ1wiJytjLmZhbWlseSsnXCIsc2VyaWYnKSk7XG56KHAsZnVuY3Rpb24oYSl7aD1hO3UoKX0pO3QocCxMKGMsJ1wiJytjLmZhbWlseSsnXCIsbW9ub3NwYWNlJykpfSl9KX07XCJvYmplY3RcIj09PXR5cGVvZiBtb2R1bGU/bW9kdWxlLmV4cG9ydHM9QTood2luZG93LkZvbnRGYWNlT2JzZXJ2ZXI9QSx3aW5kb3cuRm9udEZhY2VPYnNlcnZlci5wcm90b3R5cGUubG9hZD1BLnByb3RvdHlwZS5sb2FkKTt9KCkpO1xuIl19
