(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJnYW1lL3NyYy9BcHAuY29mZmVlIiwiZ2FtZS9zcmMvTWVudVZpZXcuY29mZmVlIiwiZ2FtZS9zcmMvU3Vkb2t1R2FtZS5jb2ZmZWUiLCJnYW1lL3NyYy9TdWRva3VHZW5lcmF0b3IuY29mZmVlIiwiZ2FtZS9zcmMvU3Vkb2t1Vmlldy5jb2ZmZWUiLCJnYW1lL3NyYy9tYWluLmNvZmZlZSIsImdhbWUvc3JjL3ZlcnNpb24uY29mZmVlIiwibm9kZV9tb2R1bGVzL2ZvbnRmYWNlb2JzZXJ2ZXIvZm9udGZhY2VvYnNlcnZlci5zdGFuZGFsb25lLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUEsSUFBQTs7QUFBQSxnQkFBQSxHQUFtQixPQUFBLENBQVEsa0JBQVI7O0FBRW5CLFFBQUEsR0FBVyxPQUFBLENBQVEsWUFBUjs7QUFDWCxVQUFBLEdBQWEsT0FBQSxDQUFRLGNBQVI7O0FBQ2IsT0FBQSxHQUFVLE9BQUEsQ0FBUSxXQUFSOztBQUVKO0VBQ1MsYUFBQyxNQUFEO0lBQUMsSUFBQyxDQUFBLFNBQUQ7SUFDWixJQUFDLENBQUEsR0FBRCxHQUFPLElBQUMsQ0FBQSxNQUFNLENBQUMsVUFBUixDQUFtQixJQUFuQjtJQUNQLElBQUMsQ0FBQSxRQUFELENBQVUsU0FBVjtJQUNBLElBQUMsQ0FBQSxLQUFELEdBQVM7SUFFVCxJQUFDLENBQUEsaUJBQUQsR0FBcUIsSUFBSSxDQUFDLEtBQUwsQ0FBVyxJQUFDLENBQUEsTUFBTSxDQUFDLE1BQVIsR0FBaUIsSUFBNUI7SUFDckIsSUFBQyxDQUFBLFdBQUQsR0FBZSxJQUFDLENBQUEsWUFBRCxDQUFjLFNBQWQsRUFBNEIsSUFBQyxDQUFBLGlCQUFGLEdBQW9CLHVCQUEvQztJQUVmLElBQUMsQ0FBQSxvQkFBRCxHQUF3QixJQUFJLENBQUMsS0FBTCxDQUFXLElBQUMsQ0FBQSxNQUFNLENBQUMsTUFBUixHQUFpQixJQUE1QjtJQUN4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ImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsIkZvbnRGYWNlT2JzZXJ2ZXIgPSByZXF1aXJlICdmb250ZmFjZW9ic2VydmVyJ1xuXG5NZW51VmlldyA9IHJlcXVpcmUgJy4vTWVudVZpZXcnXG5TdWRva3VWaWV3ID0gcmVxdWlyZSAnLi9TdWRva3VWaWV3J1xudmVyc2lvbiA9IHJlcXVpcmUgJy4vdmVyc2lvbidcblxuY2xhc3MgQXBwXG4gIGNvbnN0cnVjdG9yOiAoQGNhbnZhcykgLT5cbiAgICBAY3R4ID0gQGNhbnZhcy5nZXRDb250ZXh0KFwiMmRcIilcbiAgICBAbG9hZEZvbnQoXCJzYXhNb25vXCIpXG4gICAgQGZvbnRzID0ge31cblxuICAgIEB2ZXJzaW9uRm9udEhlaWdodCA9IE1hdGguZmxvb3IoQGNhbnZhcy5oZWlnaHQgKiAwLjAyKVxuICAgIEB2ZXJzaW9uRm9udCA9IEByZWdpc3RlckZvbnQoXCJ2ZXJzaW9uXCIsIFwiI3tAdmVyc2lvbkZvbnRIZWlnaHR9cHggc2F4TW9ubywgbW9ub3NwYWNlXCIpXG5cbiAgICBAZ2VuZXJhdGluZ0ZvbnRIZWlnaHQgPSBNYXRoLmZsb29yKEBjYW52YXMuaGVpZ2h0ICogMC4wNClcbiAgICBAZ2VuZXJhdGluZ0ZvbnQgPSBAcmVnaXN0ZXJGb250KFwiZ2VuZXJhdGluZ1wiLCBcIiN7QGdlbmVyYXRpbmdGb250SGVpZ2h0fXB4IHNheE1vbm8sIG1vbm9zcGFjZVwiKVxuXG4gICAgQHZpZXdzID1cbiAgICAgIG1lbnU6IG5ldyBNZW51Vmlldyh0aGlzLCBAY2FudmFzKVxuICAgICAgc3Vkb2t1OiBuZXcgU3Vkb2t1Vmlldyh0aGlzLCBAY2FudmFzKVxuICAgIEBzd2l0Y2hWaWV3KFwic3Vkb2t1XCIpXG5cbiAgbWVhc3VyZUZvbnRzOiAtPlxuICAgIGZvciBmb250TmFtZSwgZiBvZiBAZm9udHNcbiAgICAgIEBjdHguZm9udCA9IGYuc3R5bGVcbiAgICAgIEBjdHguZmlsbFN0eWxlID0gXCJibGFja1wiXG4gICAgICBAY3R4LnRleHRBbGlnbiA9IFwiY2VudGVyXCJcbiAgICAgIGYuaGVpZ2h0ID0gTWF0aC5mbG9vcihAY3R4Lm1lYXN1cmVUZXh0KFwibVwiKS53aWR0aCAqIDEuMSkgIyBiZXN0IGhhY2sgZXZlclxuICAgICAgY29uc29sZS5sb2cgXCJGb250ICN7Zm9udE5hbWV9IG1lYXN1cmVkIGF0ICN7Zi5oZWlnaHR9IHBpeGVsc1wiXG4gICAgcmV0dXJuXG5cbiAgcmVnaXN0ZXJGb250OiAobmFtZSwgc3R5bGUpIC0+XG4gICAgZm9udCA9XG4gICAgICBuYW1lOiBuYW1lXG4gICAgICBzdHlsZTogc3R5bGVcbiAgICAgIGhlaWdodDogMFxuICAgIEBmb250c1tuYW1lXSA9IGZvbnRcbiAgICBAbWVhc3VyZUZvbnRzKClcbiAgICByZXR1cm4gZm9udFxuXG4gIGxvYWRGb250OiAoZm9udE5hbWUpIC0+XG4gICAgZm9udCA9IG5ldyBGb250RmFjZU9ic2VydmVyKGZvbnROYW1lKVxuICAgIGZvbnQubG9hZCgpLnRoZW4gPT5cbiAgICAgIGNvbnNvbGUubG9nKFwiI3tmb250TmFtZX0gbG9hZGVkLCByZWRyYXdpbmcuLi5cIilcbiAgICAgIEBtZWFzdXJlRm9udHMoKVxuICAgICAgQGRyYXcoKVxuXG4gIHN3aXRjaFZpZXc6ICh2aWV3KSAtPlxuICAgIEB2aWV3ID0gQHZpZXdzW3ZpZXddXG4gICAgQGRyYXcoKVxuXG4gIG5ld0dhbWU6IChkaWZmaWN1bHR5KSAtPlxuICAgICMgY29uc29sZS5sb2cgXCJhcHAubmV3R2FtZSgje2RpZmZpY3VsdHl9KVwiXG5cbiAgICAjIEBkcmF3RmlsbCgwLCAwLCBAY2FudmFzLndpZHRoLCBAY2FudmFzLmhlaWdodCwgXCIjNDQ0NDQ0XCIpXG4gICAgIyBAZHJhd1RleHRDZW50ZXJlZChcIkdlbmVyYXRpbmcsIHBsZWFzZSB3YWl0Li4uXCIsIEBjYW52YXMud2lkdGggLyAyLCBAY2FudmFzLmhlaWdodCAvIDIsIEBnZW5lcmF0aW5nRm9udCwgXCIjZmZmZmZmXCIpXG5cbiAgICAjIHdpbmRvdy5zZXRUaW1lb3V0ID0+XG4gICAgQHZpZXdzLnN1ZG9rdS5uZXdHYW1lKGRpZmZpY3VsdHkpXG4gICAgQHN3aXRjaFZpZXcoXCJzdWRva3VcIilcbiAgICAjICwgMFxuXG4gIHJlc2V0OiAtPlxuICAgIEB2aWV3cy5zdWRva3UucmVzZXQoKVxuICAgIEBzd2l0Y2hWaWV3KFwic3Vkb2t1XCIpXG5cbiAgaW1wb3J0OiAoaW1wb3J0U3RyaW5nKSAtPlxuICAgIHJldHVybiBAdmlld3Muc3Vkb2t1LmltcG9ydChpbXBvcnRTdHJpbmcpXG5cbiAgZXhwb3J0OiAtPlxuICAgIHJldHVybiBAdmlld3Muc3Vkb2t1LmV4cG9ydCgpXG5cbiAgaG9sZUNvdW50OiAtPlxuICAgIHJldHVybiBAdmlld3Muc3Vkb2t1LmhvbGVDb3VudCgpXG5cbiAgZHJhdzogLT5cbiAgICBAdmlldy5kcmF3KClcblxuICBjbGljazogKHgsIHkpIC0+XG4gICAgQHZpZXcuY2xpY2soeCwgeSlcblxuICBkcmF3RmlsbDogKHgsIHksIHcsIGgsIGNvbG9yKSAtPlxuICAgIEBjdHguYmVnaW5QYXRoKClcbiAgICBAY3R4LnJlY3QoeCwgeSwgdywgaClcbiAgICBAY3R4LmZpbGxTdHlsZSA9IGNvbG9yXG4gICAgQGN0eC5maWxsKClcblxuICBkcmF3Um91bmRlZFJlY3Q6ICh4LCB5LCB3LCBoLCByLCBmaWxsQ29sb3IgPSBudWxsLCBzdHJva2VDb2xvciA9IG51bGwpIC0+XG4gICAgQGN0eC5yb3VuZFJlY3QoeCwgeSwgdywgaCwgcilcbiAgICBpZiBmaWxsQ29sb3IgIT0gbnVsbFxuICAgICAgQGN0eC5maWxsU3R5bGUgPSBmaWxsQ29sb3JcbiAgICAgIEBjdHguZmlsbCgpXG4gICAgaWYgc3Ryb2tlQ29sb3IgIT0gbnVsbFxuICAgICAgQGN0eC5zdHJva2VTdHlsZSA9IHN0cm9rZUNvbG9yXG4gICAgICBAY3R4LnN0cm9rZSgpXG4gICAgcmV0dXJuXG5cbiAgZHJhd1JlY3Q6ICh4LCB5LCB3LCBoLCBjb2xvciwgbGluZVdpZHRoID0gMSkgLT5cbiAgICBAY3R4LmJlZ2luUGF0aCgpXG4gICAgQGN0eC5zdHJva2VTdHlsZSA9IGNvbG9yXG4gICAgQGN0eC5saW5lV2lkdGggPSBsaW5lV2lkdGhcbiAgICBAY3R4LnJlY3QoeCwgeSwgdywgaClcbiAgICBAY3R4LnN0cm9rZSgpXG5cbiAgZHJhd0xpbmU6ICh4MSwgeTEsIHgyLCB5MiwgY29sb3IgPSBcImJsYWNrXCIsIGxpbmVXaWR0aCA9IDEpIC0+XG4gICAgQGN0eC5iZWdpblBhdGgoKVxuICAgIEBjdHguc3Ryb2tlU3R5bGUgPSBjb2xvclxuICAgIEBjdHgubGluZVdpZHRoID0gbGluZVdpZHRoXG4gICAgQGN0eC5tb3ZlVG8oeDEsIHkxKVxuICAgIEBjdHgubGluZVRvKHgyLCB5MilcbiAgICBAY3R4LnN0cm9rZSgpXG5cbiAgZHJhd1RleHRDZW50ZXJlZDogKHRleHQsIGN4LCBjeSwgZm9udCwgY29sb3IpIC0+XG4gICAgQGN0eC5mb250ID0gZm9udC5zdHlsZVxuICAgIEBjdHguZmlsbFN0eWxlID0gY29sb3JcbiAgICBAY3R4LnRleHRBbGlnbiA9IFwiY2VudGVyXCJcbiAgICBAY3R4LmZpbGxUZXh0KHRleHQsIGN4LCBjeSArIChmb250LmhlaWdodCAvIDIpKVxuXG4gIGRyYXdMb3dlckxlZnQ6ICh0ZXh0LCBjb2xvciA9IFwid2hpdGVcIikgLT5cbiAgICBAY3R4ID0gQGNhbnZhcy5nZXRDb250ZXh0KFwiMmRcIilcbiAgICBAY3R4LmZvbnQgPSBAdmVyc2lvbkZvbnQuc3R5bGVcbiAgICBAY3R4LmZpbGxTdHlsZSA9IGNvbG9yXG4gICAgQGN0eC50ZXh0QWxpZ24gPSBcImxlZnRcIlxuICAgIEBjdHguZmlsbFRleHQodGV4dCwgMCwgQGNhbnZhcy5oZWlnaHQgLSAoQHZlcnNpb25Gb250LmhlaWdodCAvIDIpKVxuXG4gIGRyYXdWZXJzaW9uOiAoY29sb3IgPSBcIndoaXRlXCIpIC0+XG4gICAgQGN0eCA9IEBjYW52YXMuZ2V0Q29udGV4dChcIjJkXCIpXG4gICAgQGN0eC5mb250ID0gQHZlcnNpb25Gb250LnN0eWxlXG4gICAgQGN0eC5maWxsU3R5bGUgPSBjb2xvclxuICAgIEBjdHgudGV4dEFsaWduID0gXCJyaWdodFwiXG4gICAgQGN0eC5maWxsVGV4dChcInYje3ZlcnNpb259XCIsIEBjYW52YXMud2lkdGggLSAoQHZlcnNpb25Gb250LmhlaWdodCAvIDIpLCBAY2FudmFzLmhlaWdodCAtIChAdmVyc2lvbkZvbnQuaGVpZ2h0IC8gMikpXG5cbiAgZHJhd0FyYzogKHgxLCB5MSwgeDIsIHkyLCByYWRpdXMsIGNvbG9yLCBsaW5lV2lkdGgpIC0+XG4gICAgIyBEZXJpdmVkIGZyb20gaHR0cHM6Ly9naXRodWIuY29tL2phbWJvbG8vZHJhd0FyYyBhdCA2YzNlMGQzXG5cbiAgICBQMSA9IHsgeDogeDEsIHk6IHkxIH1cbiAgICBQMiA9IHsgeDogeDIsIHk6IHkyIH1cblxuICAgICMgRGV0ZXJtaW5lIHRoZSBtaWRwb2ludCAoTSkgZnJvbSBQMSB0byBQMlxuICAgIE0gPVxuICAgICAgeDogKFAxLnggKyBQMi54KSAvIDJcbiAgICAgIHk6IChQMS55ICsgUDIueSkgLyAyXG5cbiAgICAjIERldGVybWluZSB0aGUgZGlzdGFuY2UgZnJvbSBNIHRvIFAxXG4gICAgZE1QMSA9IE1hdGguc3FydCgoUDEueCAtIE0ueCkqKFAxLnggLSBNLngpICsgKFAxLnkgLSBNLnkpKihQMS55IC0gTS55KSlcblxuICAgICMgVmFsaWRhdGUgdGhlIHJhZGl1c1xuICAgIGlmIG5vdCByYWRpdXM/IG9yIHJhZGl1cyA8IGRNUDFcbiAgICAgIHJhZGl1cyA9IGRNUDFcblxuICAgICMgRGV0ZXJtaW5lIHRoZSB1bml0IHZlY3RvciBmcm9tIE0gdG8gUDFcbiAgICB1TVAxID1cbiAgICAgIHg6IChQMS54IC0gTS54KSAvIGRNUDFcbiAgICAgIHk6IChQMS55IC0gTS55KSAvIGRNUDFcblxuICAgICMgRGV0ZXJtaW5lIHRoZSB1bml0IHZlY3RvciBmcm9tIE0gdG8gUSAoanVzdCB1TVAxIHJvdGF0ZWQgcGkvMilcbiAgICB1TVEgPSB7IHg6IC11TVAxLnksIHk6IHVNUDEueCB9XG5cbiAgICAjIERldGVybWluZSB0aGUgZGlzdGFuY2UgZnJvbSB0aGUgY2VudGVyIG9mIHRoZSBjaXJjbGUgKEMpIHRvIE1cbiAgICBkQ00gPSBNYXRoLnNxcnQocmFkaXVzKnJhZGl1cyAtIGRNUDEqZE1QMSlcblxuICAgICMgRGV0ZXJtaW5lIHRoZSBkaXN0YW5jZSBmcm9tIE0gdG8gUVxuICAgIGRNUSA9IGRNUDEgKiBkTVAxIC8gZENNXG5cbiAgICAjIERldGVybWluZSB0aGUgbG9jYXRpb24gb2YgUVxuICAgIFEgPVxuICAgICAgeDogTS54ICsgdU1RLnggKiBkTVFcbiAgICAgIHk6IE0ueSArIHVNUS55ICogZE1RXG5cbiAgICBAY3R4LmJlZ2luUGF0aCgpXG4gICAgQGN0eC5zdHJva2VTdHlsZSA9IGNvbG9yXG4gICAgQGN0eC5saW5lV2lkdGggPSBsaW5lV2lkdGhcbiAgICBAY3R4Lm1vdmVUbyh4MSwgeTEpXG4gICAgQGN0eC5hcmNUbyhRLngsIFEueSwgeDIsIHkyLCByYWRpdXMpXG4gICAgQGN0eC5zdHJva2UoKVxuICAgIHJldHVyblxuXG5DYW52YXNSZW5kZXJpbmdDb250ZXh0MkQucHJvdG90eXBlLnJvdW5kUmVjdCA9ICh4LCB5LCB3LCBoLCByKSAtPlxuICBpZiAodyA8IDIgKiByKSB0aGVuIHIgPSB3IC8gMlxuICBpZiAoaCA8IDIgKiByKSB0aGVuIHIgPSBoIC8gMlxuICBAYmVnaW5QYXRoKClcbiAgQG1vdmVUbyh4K3IsIHkpXG4gIEBhcmNUbyh4K3csIHksICAgeCt3LCB5K2gsIHIpXG4gIEBhcmNUbyh4K3csIHkraCwgeCwgICB5K2gsIHIpXG4gIEBhcmNUbyh4LCAgIHkraCwgeCwgICB5LCAgIHIpXG4gIEBhcmNUbyh4LCAgIHksICAgeCt3LCB5LCAgIHIpXG4gIEBjbG9zZVBhdGgoKVxuICByZXR1cm4gdGhpc1xuXG5tb2R1bGUuZXhwb3J0cyA9IEFwcFxuIiwiU3Vkb2t1R2VuZXJhdG9yID0gcmVxdWlyZSAnLi9TdWRva3VHZW5lcmF0b3InXG5cbkJVVFRPTl9IRUlHSFQgPSAwLjA2XG5GSVJTVF9CVVRUT05fWSA9IDAuMjJcbkJVVFRPTl9TUEFDSU5HID0gMC4wOFxuQlVUVE9OX1NFUEFSQVRPUiA9IDAuMDNcblxuYnV0dG9uUG9zID0gKGluZGV4KSAtPlxuICB5ID0gRklSU1RfQlVUVE9OX1kgKyAoQlVUVE9OX1NQQUNJTkcgKiBpbmRleClcbiAgaWYgaW5kZXggPiAzXG4gICAgeSArPSBCVVRUT05fU0VQQVJBVE9SXG4gIGlmIGluZGV4ID4gNFxuICAgIHkgKz0gQlVUVE9OX1NFUEFSQVRPUlxuICBpZiBpbmRleCA+IDZcbiAgICB5ICs9IEJVVFRPTl9TRVBBUkFUT1JcbiAgcmV0dXJuIHlcblxuY2xhc3MgTWVudVZpZXdcbiAgY29uc3RydWN0b3I6IChAYXBwLCBAY2FudmFzKSAtPlxuICAgIEBidXR0b25zID1cbiAgICAgIG5ld0Vhc3k6XG4gICAgICAgIHk6IGJ1dHRvblBvcygwKVxuICAgICAgICB0ZXh0OiBcIk5ldyBHYW1lOiBFYXN5XCJcbiAgICAgICAgYmdDb2xvcjogXCIjMzM3NzMzXCJcbiAgICAgICAgdGV4dENvbG9yOiBcIiNmZmZmZmZcIlxuICAgICAgICBjbGljazogQG5ld0Vhc3kuYmluZCh0aGlzKVxuICAgICAgbmV3TWVkaXVtOlxuICAgICAgICB5OiBidXR0b25Qb3MoMSlcbiAgICAgICAgdGV4dDogXCJOZXcgR2FtZTogTWVkaXVtXCJcbiAgICAgICAgYmdDb2xvcjogXCIjNzc3NzMzXCJcbiAgICAgICAgdGV4dENvbG9yOiBcIiNmZmZmZmZcIlxuICAgICAgICBjbGljazogQG5ld01lZGl1bS5iaW5kKHRoaXMpXG4gICAgICBuZXdIYXJkOlxuICAgICAgICB5OiBidXR0b25Qb3MoMilcbiAgICAgICAgdGV4dDogXCJOZXcgR2FtZTogSGFyZFwiXG4gICAgICAgIGJnQ29sb3I6IFwiIzc3MzMzM1wiXG4gICAgICAgIHRleHRDb2xvcjogXCIjZmZmZmZmXCJcbiAgICAgICAgY2xpY2s6IEBuZXdIYXJkLmJpbmQodGhpcylcbiAgICAgIG5ld0V4dHJlbWU6XG4gICAgICAgIHk6IGJ1dHRvblBvcygzKVxuICAgICAgICB0ZXh0OiBcIk5ldyBHYW1lOiBFeHRyZW1lXCJcbiAgICAgICAgYmdDb2xvcjogXCIjNzcxMTExXCJcbiAgICAgICAgdGV4dENvbG9yOiBcIiNmZmZmZmZcIlxuICAgICAgICBjbGljazogQG5ld0V4dHJlbWUuYmluZCh0aGlzKVxuICAgICAgcmVzZXQ6XG4gICAgICAgIHk6IGJ1dHRvblBvcyg0KVxuICAgICAgICB0ZXh0OiBcIlJlc2V0IFB1enpsZVwiXG4gICAgICAgIGJnQ29sb3I6IFwiIzc3MzM3N1wiXG4gICAgICAgIHRleHRDb2xvcjogXCIjZmZmZmZmXCJcbiAgICAgICAgY2xpY2s6IEByZXNldC5iaW5kKHRoaXMpXG4gICAgICBpbXBvcnQ6XG4gICAgICAgIHk6IGJ1dHRvblBvcyg1KVxuICAgICAgICB0ZXh0OiBcIkxvYWQgUHV6emxlXCJcbiAgICAgICAgYmdDb2xvcjogXCIjMzM2NjY2XCJcbiAgICAgICAgdGV4dENvbG9yOiBcIiNmZmZmZmZcIlxuICAgICAgICBjbGljazogQGltcG9ydC5iaW5kKHRoaXMpXG4gICAgICBleHBvcnQ6XG4gICAgICAgIHk6IGJ1dHRvblBvcyg2KVxuICAgICAgICB0ZXh0OiBcIlNoYXJlIFB1enpsZVwiXG4gICAgICAgIGJnQ29sb3I6IFwiIzMzNjY2NlwiXG4gICAgICAgIHRleHRDb2xvcjogXCIjZmZmZmZmXCJcbiAgICAgICAgY2xpY2s6IEBleHBvcnQuYmluZCh0aGlzKVxuICAgICAgcmVzdW1lOlxuICAgICAgICB5OiBidXR0b25Qb3MoNylcbiAgICAgICAgdGV4dDogXCJSZXN1bWVcIlxuICAgICAgICBiZ0NvbG9yOiBcIiM3Nzc3NzdcIlxuICAgICAgICB0ZXh0Q29sb3I6IFwiI2ZmZmZmZlwiXG4gICAgICAgIGNsaWNrOiBAcmVzdW1lLmJpbmQodGhpcylcblxuICAgIGJ1dHRvbldpZHRoID0gQGNhbnZhcy53aWR0aCAqIDAuOFxuICAgIEBidXR0b25IZWlnaHQgPSBAY2FudmFzLmhlaWdodCAqIEJVVFRPTl9IRUlHSFRcbiAgICBidXR0b25YID0gKEBjYW52YXMud2lkdGggLSBidXR0b25XaWR0aCkgLyAyXG4gICAgZm9yIGJ1dHRvbk5hbWUsIGJ1dHRvbiBvZiBAYnV0dG9uc1xuICAgICAgYnV0dG9uLnggPSBidXR0b25YXG4gICAgICBidXR0b24ueSA9IEBjYW52YXMuaGVpZ2h0ICogYnV0dG9uLnlcbiAgICAgIGJ1dHRvbi53ID0gYnV0dG9uV2lkdGhcbiAgICAgIGJ1dHRvbi5oID0gQGJ1dHRvbkhlaWdodFxuXG4gICAgYnV0dG9uRm9udEhlaWdodCA9IE1hdGguZmxvb3IoQGJ1dHRvbkhlaWdodCAqIDAuNClcbiAgICBAYnV0dG9uRm9udCA9IEBhcHAucmVnaXN0ZXJGb250KFwiYnV0dG9uXCIsIFwiI3tidXR0b25Gb250SGVpZ2h0fXB4IHNheE1vbm8sIG1vbm9zcGFjZVwiKVxuICAgIHRpdGxlRm9udEhlaWdodCA9IE1hdGguZmxvb3IoQGNhbnZhcy5oZWlnaHQgKiAwLjA2KVxuICAgIEB0aXRsZUZvbnQgPSBAYXBwLnJlZ2lzdGVyRm9udChcImJ1dHRvblwiLCBcIiN7dGl0bGVGb250SGVpZ2h0fXB4IHNheE1vbm8sIG1vbm9zcGFjZVwiKVxuICAgIHN1YnRpdGxlRm9udEhlaWdodCA9IE1hdGguZmxvb3IoQGNhbnZhcy5oZWlnaHQgKiAwLjAyKVxuICAgIEBzdWJ0aXRsZUZvbnQgPSBAYXBwLnJlZ2lzdGVyRm9udChcImJ1dHRvblwiLCBcIiN7c3VidGl0bGVGb250SGVpZ2h0fXB4IHNheE1vbm8sIG1vbm9zcGFjZVwiKVxuICAgIHJldHVyblxuXG4gIGRyYXc6IC0+XG4gICAgQGFwcC5kcmF3RmlsbCgwLCAwLCBAY2FudmFzLndpZHRoLCBAY2FudmFzLmhlaWdodCwgXCIjMzMzMzMzXCIpXG5cbiAgICB4ID0gQGNhbnZhcy53aWR0aCAvIDJcbiAgICBzaGFkb3dPZmZzZXQgPSBAY2FudmFzLmhlaWdodCAqIDAuMDA1XG5cbiAgICB5MSA9IEBjYW52YXMuaGVpZ2h0ICogMC4wNVxuICAgIHkyID0geTEgKyBAY2FudmFzLmhlaWdodCAqIDAuMDZcbiAgICB5MyA9IHkyICsgQGNhbnZhcy5oZWlnaHQgKiAwLjA2XG4gICAgQGFwcC5kcmF3VGV4dENlbnRlcmVkKFwiQmFkIEd1eVwiLCB4ICsgc2hhZG93T2Zmc2V0LCB5MSArIHNoYWRvd09mZnNldCwgQHRpdGxlRm9udCwgXCIjMDAwMDAwXCIpXG4gICAgQGFwcC5kcmF3VGV4dENlbnRlcmVkKFwiU3Vkb2t1XCIsIHggKyBzaGFkb3dPZmZzZXQsIHkyICsgc2hhZG93T2Zmc2V0LCBAdGl0bGVGb250LCBcIiMwMDAwMDBcIilcbiAgICBAYXBwLmRyYXdUZXh0Q2VudGVyZWQoXCJCYWQgR3V5XCIsIHgsIHkxLCBAdGl0bGVGb250LCBcIiNmZmZmZmZcIilcbiAgICBAYXBwLmRyYXdUZXh0Q2VudGVyZWQoXCJTdWRva3VcIiwgeCwgeTIsIEB0aXRsZUZvbnQsIFwiI2ZmZmZmZlwiKVxuICAgIEBhcHAuZHJhd1RleHRDZW50ZXJlZChcIkl0J3MgbGlrZSBTdWRva3UsIGJ1dCB5b3UgYXJlIHRoZSBiYWQgZ3V5LlwiLCB4LCB5MywgQHN1YnRpdGxlRm9udCwgXCIjZmZmZmZmXCIpXG5cbiAgICBmb3IgYnV0dG9uTmFtZSwgYnV0dG9uIG9mIEBidXR0b25zXG4gICAgICBAYXBwLmRyYXdSb3VuZGVkUmVjdChidXR0b24ueCArIHNoYWRvd09mZnNldCwgYnV0dG9uLnkgKyBzaGFkb3dPZmZzZXQsIGJ1dHRvbi53LCBidXR0b24uaCwgYnV0dG9uLmggKiAwLjMsIFwiYmxhY2tcIiwgXCJibGFja1wiKVxuICAgICAgQGFwcC5kcmF3Um91bmRlZFJlY3QoYnV0dG9uLngsIGJ1dHRvbi55LCBidXR0b24udywgYnV0dG9uLmgsIGJ1dHRvbi5oICogMC4zLCBidXR0b24uYmdDb2xvciwgXCIjOTk5OTk5XCIpXG4gICAgICBAYXBwLmRyYXdUZXh0Q2VudGVyZWQoYnV0dG9uLnRleHQsIGJ1dHRvbi54ICsgKGJ1dHRvbi53IC8gMiksIGJ1dHRvbi55ICsgKGJ1dHRvbi5oIC8gMiksIEBidXR0b25Gb250LCBidXR0b24udGV4dENvbG9yKVxuXG4gICAgQGFwcC5kcmF3TG93ZXJMZWZ0KFwiI3tAYXBwLmhvbGVDb3VudCgpfS84MVwiKVxuICAgIEBhcHAuZHJhd1ZlcnNpb24oKVxuXG4gIGNsaWNrOiAoeCwgeSkgLT5cbiAgICBmb3IgYnV0dG9uTmFtZSwgYnV0dG9uIG9mIEBidXR0b25zXG4gICAgICBpZiAoeSA+IGJ1dHRvbi55KSAmJiAoeSA8IChidXR0b24ueSArIEBidXR0b25IZWlnaHQpKVxuICAgICAgICAjIGNvbnNvbGUubG9nIFwiYnV0dG9uIHByZXNzZWQ6ICN7YnV0dG9uTmFtZX1cIlxuICAgICAgICBidXR0b24uY2xpY2soKVxuICAgIHJldHVyblxuXG4gIG5ld0Vhc3k6IC0+XG4gICAgQGFwcC5uZXdHYW1lKFN1ZG9rdUdlbmVyYXRvci5kaWZmaWN1bHR5LmVhc3kpXG5cbiAgbmV3TWVkaXVtOiAtPlxuICAgIEBhcHAubmV3R2FtZShTdWRva3VHZW5lcmF0b3IuZGlmZmljdWx0eS5tZWRpdW0pXG5cbiAgbmV3SGFyZDogLT5cbiAgICBAYXBwLm5ld0dhbWUoU3Vkb2t1R2VuZXJhdG9yLmRpZmZpY3VsdHkuaGFyZClcblxuICBuZXdFeHRyZW1lOiAtPlxuICAgIEBhcHAubmV3R2FtZShTdWRva3VHZW5lcmF0b3IuZGlmZmljdWx0eS5leHRyZW1lKVxuXG4gIHJlc2V0OiAtPlxuICAgIEBhcHAucmVzZXQoKVxuXG4gIHJlc3VtZTogLT5cbiAgICBAYXBwLnN3aXRjaFZpZXcoXCJzdWRva3VcIilcblxuICBleHBvcnQ6IC0+XG4gICAgaWYgbmF2aWdhdG9yLnNoYXJlICE9IHVuZGVmaW5lZFxuICAgICAgbmF2aWdhdG9yLnNoYXJlIHtcbiAgICAgICAgdGl0bGU6IFwiU3Vkb2t1IFNoYXJlZCBHYW1lXCJcbiAgICAgICAgdGV4dDogQGFwcC5leHBvcnQoKVxuICAgICAgfVxuICAgICAgcmV0dXJuXG4gICAgd2luZG93LnByb21wdChcIkNvcHkgdGhpcyBhbmQgcGFzdGUgdG8gYSBmcmllbmQ6XCIsIEBhcHAuZXhwb3J0KCkpXG5cbiAgaW1wb3J0OiAtPlxuICAgIGltcG9ydFN0cmluZyA9IHdpbmRvdy5wcm9tcHQoXCJQYXN0ZSBhbiBleHBvcnRlZCBnYW1lIGhlcmU6XCIsIFwiXCIpXG4gICAgbG9vcFxuICAgICAgaWYgaW1wb3J0U3RyaW5nID09IG51bGxcbiAgICAgICAgcmV0dXJuXG4gICAgICBpZiBAYXBwLmltcG9ydChpbXBvcnRTdHJpbmcpXG4gICAgICAgIEBhcHAuc3dpdGNoVmlldyhcInN1ZG9rdVwiKVxuICAgICAgICByZXR1cm5cbiAgICAgIGltcG9ydFN0cmluZyA9IHdpbmRvdy5wcm9tcHQoXCJJbnZhbGlkIGdhbWUsIHRyeSBhZ2FpbjpcIiwgXCJcIilcblxubW9kdWxlLmV4cG9ydHMgPSBNZW51Vmlld1xuIiwiU3Vkb2t1R2VuZXJhdG9yID0gcmVxdWlyZSAnLi9TdWRva3VHZW5lcmF0b3InXG5cbiMgUmV0dXJucyB0aGUgaW5kZXggb2YgYSBjZWxsIGluIHJvdyBtYWpvciBvcmRlciAodGhvdWdoIHRoZXkgYXJlIHN0b3JlZCBpbiBjb2x1bW4gbWFqb3Igb3JkZXIpXG5jZWxsSW5kZXggPSAoeCwgeSkgLT4geSAqIDkgKyB4XG5cbiMgU29ydCBieSBhc2NlbmRpbmcgbG9jYXRpb24gYW5kIHRoZW4gYnkgc3RyZW5ndGggKHN0cm9uZyB0aGVuIHdlYWspXG5hc2NlbmRpbmdMaW5rU29ydCA9IChhLCBiKSAtPlxuICBhMCA9IGNlbGxJbmRleChhLmNlbGxzWzBdLngsIGEuY2VsbHNbMF0ueSlcbiAgYTEgPSBjZWxsSW5kZXgoYS5jZWxsc1sxXS54LCBhLmNlbGxzWzFdLnkpXG4gIGIwID0gY2VsbEluZGV4KGIuY2VsbHNbMF0ueCwgYi5jZWxsc1swXS55KVxuICBiMSA9IGNlbGxJbmRleChiLmNlbGxzWzFdLngsIGIuY2VsbHNbMV0ueSlcbiAgcmV0dXJuIGlmIGEwID4gYjAgb3IgKGEwID09IGIwIGFuZCAoYTEgPiBiMSBvciAoYTEgPT0gYjEgYW5kIChub3QgYS5zdHJvbmc/IGFuZCBiLnN0cm9uZz8pKSkpIHRoZW4gMSBlbHNlIC0xXG5cbiMgTm90ZSBzdHJlbmd0aCBpcyBub3QgY29tcGFyZWRcbnVuaXF1ZUxpbmtGaWx0ZXIgPSAoZSwgaSwgYSkgLT5cbiAgaWYgaSA9PSAwXG4gICAgcmV0dXJuIHRydWUgXG4gIHAgPSBhW2ktMV1cbiAgZTAgPSBjZWxsSW5kZXgoZS5jZWxsc1swXS54LCBlLmNlbGxzWzBdLnkpXG4gIGUxID0gY2VsbEluZGV4KGUuY2VsbHNbMV0ueCwgZS5jZWxsc1sxXS55KVxuICBwMCA9IGNlbGxJbmRleChwLmNlbGxzWzBdLngsIHAuY2VsbHNbMF0ueSlcbiAgcDEgPSBjZWxsSW5kZXgocC5jZWxsc1sxXS54LCBwLmNlbGxzWzFdLnkpXG4gIHJldHVybiBlMCAhPSBwMCBvciBlMSAhPSBwMVxuXG5nZW5lcmF0ZUxpbmtQZXJtdXRhdGlvbnMgPSAoY2VsbHMpIC0+XG4gIGxpbmtzID0gW11cbiAgY291bnQgPSBjZWxscy5sZW5ndGhcbiAgZm9yIGkgaW4gWzAuLi5jb3VudC0xXVxuICAgIGZvciBqIGluIFtpKzEuLi5jb3VudF1cbiAgICAgIGxpbmtzLnB1c2goeyBjZWxsczogW2NlbGxzW2ldLCBjZWxsc1tqXV0gfSlcbiAgcmV0dXJuIGxpbmtzXG5cbmNsYXNzIFN1ZG9rdUdhbWVcbiAgY29uc3RydWN0b3I6IC0+XG4gICAgQGNsZWFyKClcbiAgICBpZiBub3QgQGxvYWQoKVxuICAgICAgQG5ld0dhbWUoU3Vkb2t1R2VuZXJhdG9yLmRpZmZpY3VsdHkuZWFzeSlcbiAgICByZXR1cm5cblxuICBjbGVhcjogLT5cbiAgICBAZ3JpZCA9IG5ldyBBcnJheSg5KS5maWxsKG51bGwpXG4gICAgZm9yIGkgaW4gWzAuLi45XVxuICAgICAgQGdyaWRbaV0gPSBuZXcgQXJyYXkoOSkuZmlsbChudWxsKVxuICAgIGZvciBqIGluIFswLi4uOV1cbiAgICAgIGZvciBpIGluIFswLi4uOV1cbiAgICAgICAgQGdyaWRbaV1bal0gPVxuICAgICAgICAgIHZhbHVlOiAwXG4gICAgICAgICAgZXJyb3I6IGZhbHNlXG4gICAgICAgICAgbG9ja2VkOiBmYWxzZVxuICAgICAgICAgIHBlbmNpbDogbmV3IEFycmF5KDkpLmZpbGwoZmFsc2UpXG5cbiAgICBAc29sdmVkID0gZmFsc2VcbiAgICBAdW5kb0pvdXJuYWwgPSBbXVxuICAgIEByZWRvSm91cm5hbCA9IFtdXG5cbiAgaG9sZUNvdW50OiAtPlxuICAgIGNvdW50ID0gMFxuICAgIGZvciBqIGluIFswLi4uOV1cbiAgICAgIGZvciBpIGluIFswLi4uOV1cbiAgICAgICAgaWYgbm90IEBncmlkW2ldW2pdLmxvY2tlZFxuICAgICAgICAgIGNvdW50ICs9IDFcbiAgICByZXR1cm4gY291bnRcblxuICBleHBvcnQ6IC0+XG4gICAgZXhwb3J0U3RyaW5nID0gXCJTRFwiXG4gICAgZm9yIGogaW4gWzAuLi45XVxuICAgICAgZm9yIGkgaW4gWzAuLi45XVxuICAgICAgICBpZiBAZ3JpZFtpXVtqXS5sb2NrZWRcbiAgICAgICAgICBleHBvcnRTdHJpbmcgKz0gXCIje0BncmlkW2ldW2pdLnZhbHVlfVwiXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBleHBvcnRTdHJpbmcgKz0gXCIwXCJcbiAgICByZXR1cm4gZXhwb3J0U3RyaW5nXG5cbiAgdmFsaWRhdGU6IC0+XG4gICAgYm9hcmQgPSBuZXcgQXJyYXkoOSkuZmlsbChudWxsKVxuICAgIGZvciBpIGluIFswLi4uOV1cbiAgICAgIGJvYXJkW2ldID0gbmV3IEFycmF5KDkpLmZpbGwoMClcbiAgICAgIGZvciBqIGluIFswLi4uOV1cbiAgICAgICAgYm9hcmRbaV1bal0gPSBAZ3JpZFtpXVtqXS52YWx1ZVxuXG4gICAgZ2VuZXJhdG9yID0gbmV3IFN1ZG9rdUdlbmVyYXRvclxuICAgIHJldHVybiBnZW5lcmF0b3IudmFsaWRhdGVHcmlkKGJvYXJkKVxuXG4gIGltcG9ydDogKGltcG9ydFN0cmluZykgLT5cbiAgICBpZiBpbXBvcnRTdHJpbmcuaW5kZXhPZihcIlNEXCIpICE9IDBcbiAgICAgIHJldHVybiBmYWxzZVxuICAgIGltcG9ydFN0cmluZyA9IGltcG9ydFN0cmluZy5zdWJzdHIoMilcbiAgICBpbXBvcnRTdHJpbmcgPSBpbXBvcnRTdHJpbmcucmVwbGFjZSgvW14wLTldL2csIFwiXCIpXG4gICAgaWYgaW1wb3J0U3RyaW5nLmxlbmd0aCAhPSA4MVxuICAgICAgcmV0dXJuIGZhbHNlXG5cbiAgICBAY2xlYXIoKVxuXG4gICAgaW5kZXggPSAwXG4gICAgemVyb0NoYXJDb2RlID0gXCIwXCIuY2hhckNvZGVBdCgwKVxuICAgIGZvciBqIGluIFswLi4uOV1cbiAgICAgIGZvciBpIGluIFswLi4uOV1cbiAgICAgICAgdiA9IGltcG9ydFN0cmluZy5jaGFyQ29kZUF0KGluZGV4KSAtIHplcm9DaGFyQ29kZVxuICAgICAgICBpbmRleCArPSAxXG4gICAgICAgIGlmIHYgPiAwXG4gICAgICAgICAgQGdyaWRbaV1bal0ubG9ja2VkID0gdHJ1ZVxuICAgICAgICAgIEBncmlkW2ldW2pdLnZhbHVlID0gdlxuXG4gICAgcmV0dXJuIGZhbHNlIGlmIG5vdCBAdmFsaWRhdGUoKVxuICAgIFxuICAgIEB1cGRhdGVDZWxscygpXG4gICAgQHNhdmUoKVxuICAgIHJldHVybiB0cnVlXG5cbiAgdXBkYXRlQ2VsbDogKHgsIHkpIC0+XG4gICAgY2VsbCA9IEBncmlkW3hdW3ldXG5cbiAgICBmb3IgaSBpbiBbMC4uLjldXG4gICAgICBpZiB4ICE9IGlcbiAgICAgICAgdiA9IEBncmlkW2ldW3ldLnZhbHVlXG4gICAgICAgIGlmIHYgPiAwXG4gICAgICAgICAgaWYgdiA9PSBjZWxsLnZhbHVlXG4gICAgICAgICAgICBAZ3JpZFtpXVt5XS5lcnJvciA9IHRydWVcbiAgICAgICAgICAgIGNlbGwuZXJyb3IgPSB0cnVlXG5cbiAgICAgIGlmIHkgIT0gaVxuICAgICAgICB2ID0gQGdyaWRbeF1baV0udmFsdWVcbiAgICAgICAgaWYgdiA+IDBcbiAgICAgICAgICBpZiB2ID09IGNlbGwudmFsdWVcbiAgICAgICAgICAgIEBncmlkW3hdW2ldLmVycm9yID0gdHJ1ZVxuICAgICAgICAgICAgY2VsbC5lcnJvciA9IHRydWVcblxuICAgIHN4ID0gTWF0aC5mbG9vcih4IC8gMykgKiAzXG4gICAgc3kgPSBNYXRoLmZsb29yKHkgLyAzKSAqIDNcbiAgICBmb3IgaiBpbiBbMC4uLjNdXG4gICAgICBmb3IgaSBpbiBbMC4uLjNdXG4gICAgICAgIGlmICh4ICE9IChzeCArIGkpKSAmJiAoeSAhPSAoc3kgKyBqKSlcbiAgICAgICAgICB2ID0gQGdyaWRbc3ggKyBpXVtzeSArIGpdLnZhbHVlXG4gICAgICAgICAgaWYgdiA+IDBcbiAgICAgICAgICAgIGlmIHYgPT0gY2VsbC52YWx1ZVxuICAgICAgICAgICAgICBAZ3JpZFtzeCArIGldW3N5ICsgal0uZXJyb3IgPSB0cnVlXG4gICAgICAgICAgICAgIGNlbGwuZXJyb3IgPSB0cnVlXG4gICAgcmV0dXJuXG5cbiAgdXBkYXRlQ2VsbHM6IC0+XG4gICAgZm9yIGogaW4gWzAuLi45XVxuICAgICAgZm9yIGkgaW4gWzAuLi45XVxuICAgICAgICBAZ3JpZFtpXVtqXS5lcnJvciA9IGZhbHNlXG5cbiAgICBmb3IgaiBpbiBbMC4uLjldXG4gICAgICBmb3IgaSBpbiBbMC4uLjldXG4gICAgICAgIEB1cGRhdGVDZWxsKGksIGopXG5cbiAgICBAc29sdmVkID0gdHJ1ZVxuICAgIGZvciBqIGluIFswLi4uOV1cbiAgICAgIGZvciBpIGluIFswLi4uOV1cbiAgICAgICAgaWYgQGdyaWRbaV1bal0uZXJyb3JcbiAgICAgICAgICBAc29sdmVkID0gZmFsc2VcbiAgICAgICAgaWYgQGdyaWRbaV1bal0udmFsdWUgPT0gMFxuICAgICAgICAgIEBzb2x2ZWQgPSBmYWxzZVxuXG4gICAgIyBpZiBAc29sdmVkXG4gICAgIyAgIGNvbnNvbGUubG9nIFwic29sdmVkICN7QHNvbHZlZH1cIlxuXG4gICAgcmV0dXJuIEBzb2x2ZWRcblxuICBkb25lOiAtPlxuICAgIGQgPSBuZXcgQXJyYXkoOSkuZmlsbChmYWxzZSlcbiAgICBjb3VudHMgPSBuZXcgQXJyYXkoOSkuZmlsbCgwKVxuICAgIGZvciBqIGluIFswLi4uOV1cbiAgICAgIGZvciBpIGluIFswLi4uOV1cbiAgICAgICAgaWYgQGdyaWRbaV1bal0udmFsdWUgIT0gMFxuICAgICAgICAgIGNvdW50c1tAZ3JpZFtpXVtqXS52YWx1ZS0xXSArPSAxXG5cbiAgICBmb3IgaSBpbiBbMC4uLjldXG4gICAgICBpZiBjb3VudHNbaV0gPT0gOVxuICAgICAgICBkW2ldID0gdHJ1ZVxuICAgIHJldHVybiBkXG5cbiAgcGVuY2lsU3RyaW5nOiAoeCwgeSkgLT5cbiAgICBjZWxsID0gQGdyaWRbeF1beV1cbiAgICBzID0gXCJcIlxuICAgIGZvciBpIGluIFswLi4uOV1cbiAgICAgIGlmIGNlbGwucGVuY2lsW2ldXG4gICAgICAgIHMgKz0gU3RyaW5nKGkrMSlcbiAgICByZXR1cm4gc1xuXG4gIGRvOiAoYWN0aW9uLCB4LCB5LCB2YWx1ZXMsIGpvdXJuYWwpIC0+XG4gICAgaWYgdmFsdWVzLmxlbmd0aCA+IDBcbiAgICAgIGNlbGwgPSBAZ3JpZFt4XVt5XVxuICAgICAgc3dpdGNoIGFjdGlvblxuICAgICAgICB3aGVuIFwidG9nZ2xlUGVuY2lsXCJcbiAgICAgICAgICBqb3VybmFsLnB1c2ggeyBhY3Rpb246IFwidG9nZ2xlUGVuY2lsXCIsIHg6IHgsIHk6IHksIHZhbHVlczogdmFsdWVzIH1cbiAgICAgICAgICBjZWxsLnBlbmNpbFt2LTFdID0gIWNlbGwucGVuY2lsW3YtMV0gZm9yIHYgaW4gdmFsdWVzXG4gICAgICAgIHdoZW4gXCJzZXRWYWx1ZVwiXG4gICAgICAgICAgam91cm5hbC5wdXNoIHsgYWN0aW9uOiBcInNldFZhbHVlXCIsIHg6IHgsIHk6IHksIHZhbHVlczogW2NlbGwudmFsdWVdIH1cbiAgICAgICAgICBjZWxsLnZhbHVlID0gdmFsdWVzWzBdXG4gICAgICBAdXBkYXRlQ2VsbHMoKVxuICAgICAgQHNhdmUoKVxuXG4gIHVuZG86IC0+XG4gICAgaWYgKEB1bmRvSm91cm5hbC5sZW5ndGggPiAwKVxuICAgICAgc3RlcCA9IEB1bmRvSm91cm5hbC5wb3AoKVxuICAgICAgQGRvIHN0ZXAuYWN0aW9uLCBzdGVwLngsIHN0ZXAueSwgc3RlcC52YWx1ZXMsIEByZWRvSm91cm5hbFxuICAgICAgcmV0dXJuIFsgc3RlcC54LCBzdGVwLnkgXVxuXG4gIHJlZG86IC0+XG4gICAgaWYgKEByZWRvSm91cm5hbC5sZW5ndGggPiAwKVxuICAgICAgc3RlcCA9IEByZWRvSm91cm5hbC5wb3AoKVxuICAgICAgQGRvIHN0ZXAuYWN0aW9uLCBzdGVwLngsIHN0ZXAueSwgc3RlcC52YWx1ZXMsIEB1bmRvSm91cm5hbFxuICAgICAgcmV0dXJuIFsgc3RlcC54LCBzdGVwLnkgXVxuXG4gIGNsZWFyUGVuY2lsOiAoeCwgeSkgLT5cbiAgICBjZWxsID0gQGdyaWRbeF1beV1cbiAgICBpZiBjZWxsLmxvY2tlZFxuICAgICAgcmV0dXJuXG4gICAgQGRvIFwidG9nZ2xlUGVuY2lsXCIsIHgsIHksIChpKzEgZm9yIGZsYWcsIGkgaW4gY2VsbC5wZW5jaWwgd2hlbiBmbGFnKSwgQHVuZG9Kb3VybmFsXG4gICAgQHJlZG9Kb3VybmFsID0gW11cblxuICB0b2dnbGVQZW5jaWw6ICh4LCB5LCB2KSAtPlxuICAgIGlmIEBncmlkW3hdW3ldLmxvY2tlZFxuICAgICAgcmV0dXJuXG4gICAgQGRvIFwidG9nZ2xlUGVuY2lsXCIsIHgsIHksIFt2XSwgQHVuZG9Kb3VybmFsXG4gICAgQHJlZG9Kb3VybmFsID0gW11cblxuICBzZXRWYWx1ZTogKHgsIHksIHYpIC0+XG4gICAgaWYgQGdyaWRbeF1beV0ubG9ja2VkXG4gICAgICByZXR1cm5cbiAgICBAZG8gXCJzZXRWYWx1ZVwiLCB4LCB5LCBbdl0sIEB1bmRvSm91cm5hbFxuICAgIEByZWRvSm91cm5hbCA9IFtdXG5cbiAgcmVzZXQ6IC0+XG4gICAgY29uc29sZS5sb2cgXCJyZXNldCgpXCJcbiAgICBmb3IgaiBpbiBbMC4uLjldXG4gICAgICBmb3IgaSBpbiBbMC4uLjldXG4gICAgICAgIGNlbGwgPSBAZ3JpZFtpXVtqXVxuICAgICAgICBpZiBub3QgY2VsbC5sb2NrZWRcbiAgICAgICAgICBjZWxsLnZhbHVlID0gMFxuICAgICAgICBjZWxsLmVycm9yID0gZmFsc2VcbiAgICAgICAgZm9yIGsgaW4gWzAuLi45XVxuICAgICAgICAgIGNlbGwucGVuY2lsW2tdID0gZmFsc2VcbiAgICBAdW5kb0pvdXJuYWwgPSBbXVxuICAgIEByZWRvSm91cm5hbCA9IFtdXG4gICAgQGhpZ2hsaWdodFggPSAtMVxuICAgIEBoaWdobGlnaHRZID0gLTFcbiAgICBAdXBkYXRlQ2VsbHMoKVxuICAgIEBzYXZlKClcblxuICBnZXRMaW5rczogKHZhbHVlKSAtPlxuICAgICMgTm90ZTogdGhlIHNlYXJjaCBzb3J0cyB0aGUgbGlua3MgaW4gcm93IG1ham9yIG9yZGVyLCBmaXJzdCBieSBzdGFydCBjZWxsLCB0aGVuIGJ5IGVuZCBjZWxsXG4gICAgbGlua3MgPSBbXVxuXG4gICAgIyBHZXQgcm93IGxpbmtzXG4gICAgZm9yIHkgaW4gWzAuLi45XVxuICAgICAgbGlua3MucHVzaCBAZ2V0Um93TGlua3MoeSwgdmFsdWUpLi4uXG5cbiAgICAjIEdldCBjb2x1bW4gbGlua3NcbiAgICBmb3IgeCBpbiBbMC4uLjldXG4gICAgICBsaW5rcy5wdXNoIEBnZXRDb2x1bW5MaW5rcyh4LCB2YWx1ZSkuLi5cblxuICAgICMgR2V0IGJveCBsaW5rc1xuICAgIGZvciBib3hYIGluIFswLi4uM11cbiAgICAgIGZvciBib3hZIGluIFswLi4uM11cbiAgICAgICAgbGlua3MucHVzaCBAZ2V0Qm94TGlua3MoYm94WCwgYm94WSwgdmFsdWUpLi4uXG5cbiAgICAjIFRoZSBib3ggbGlua3MgbWlnaHQgaGF2ZSBkdXBsaWNhdGVkIHNvbWUgcm93IGFuZCBjb2x1bW4gbGlua3MsIHNvIGR1cGxpY2F0ZXMgbXVzdCBiZSBmaWx0ZXJlZCBvdXQuIE5vdGUgdGhhdCBvbmx5XG4gICAgIyBsb2NhdGlvbnMgYXJlIGNvbnNpZGVyZWQgd2hlbiBmaW5kaW5nIGR1cGxpY2F0ZXMsIGJ1dCBzdHJvbmcgbGlua3MgdGFrZSBwcmVjZWRlbmNlIHdoZW4gZHVwbGljYXRlcyBhcmUgcmVtb3ZlZCBcbiAgICAjIChiZWNhdXNlIHRoZXkgYXJlIG9yZGVyZWQgYmVmb3JlIHdlYWsgbGlua3MpLlxuICAgIGxpbmtzID0gbGlua3Muc29ydChhc2NlbmRpbmdMaW5rU29ydCkuZmlsdGVyKHVuaXF1ZUxpbmtGaWx0ZXIpXG5cbiAgICBzdHJvbmcgPSBbXVxuICAgIGZvciBsaW5rIGluIGxpbmtzXG4gICAgICBzdHJvbmcucHVzaCBsaW5rLmNlbGxzIGlmIGxpbmsuc3Ryb25nP1xuICAgIHdlYWsgPSBbXVxuICAgIGZvciBsaW5rIGluIGxpbmtzXG4gICAgICB3ZWFrLnB1c2ggbGluay5jZWxscyBpZiBub3QgbGluay5zdHJvbmc/XG5cbiAgICByZXR1cm4geyBzdHJvbmcsIHdlYWsgfVxuXG4gIGdldFJvd0xpbmtzOiAoeSwgdmFsdWUpLT5cbiAgICBjZWxscyA9IFtdXG4gICAgZm9yIHggaW4gWzAuLi45XVxuICAgICAgY2VsbCA9IEBncmlkW3hdW3ldXG4gICAgICBpZiBjZWxsLnZhbHVlID09IDAgYW5kIGNlbGwucGVuY2lsW3ZhbHVlLTFdXG4gICAgICAgIGNlbGxzLnB1c2goeyB4LCB5IH0pXG5cbiAgICBpZiBjZWxscy5sZW5ndGggPiAxXG4gICAgICBsaW5rcyA9IGdlbmVyYXRlTGlua1Blcm11dGF0aW9ucyhjZWxscylcbiAgICAgIGlmIGxpbmtzLmxlbmd0aCA9PSAxXG4gICAgICAgIGxpbmtzWzBdLnN0cm9uZyA9IHRydWVcbiAgICBlbHNlXG4gICAgICBsaW5rcyA9IFtdXG4gICAgcmV0dXJuIGxpbmtzXG5cbiAgZ2V0Q29sdW1uTGlua3M6ICh4LCB2YWx1ZSktPlxuICAgIGNlbGxzID0gW11cbiAgICBmb3IgeSBpbiBbMC4uLjldXG4gICAgICBjZWxsID0gQGdyaWRbeF1beV1cbiAgICAgIGlmIGNlbGwudmFsdWUgPT0gMCBhbmQgY2VsbC5wZW5jaWxbdmFsdWUtMV1cbiAgICAgICAgY2VsbHMucHVzaCh7IHgsIHkgfSlcblxuICAgIGlmIGNlbGxzLmxlbmd0aCA+IDFcbiAgICAgIGxpbmtzID0gZ2VuZXJhdGVMaW5rUGVybXV0YXRpb25zKGNlbGxzKVxuICAgICAgaWYgbGlua3MubGVuZ3RoID09IDFcbiAgICAgICAgbGlua3NbMF0uc3Ryb25nID0gdHJ1ZVxuICAgIGVsc2VcbiAgICAgIGxpbmtzID0gW11cbiAgICByZXR1cm4gbGlua3NcblxuICBnZXRCb3hMaW5rczogKGJveFgsIGJveFksIHZhbHVlKSAtPlxuICAgIGNlbGxzID0gW11cbiAgICBzeCA9IGJveFggKiAzXG4gICAgc3kgPSBib3hZICogM1xuICAgIGZvciB5IGluIFtzeS4uLnN5KzNdXG4gICAgICBmb3IgeCBpbiBbc3guLi5zeCszXVxuICAgICAgICBjZWxsID0gQGdyaWRbeF1beV1cbiAgICAgICAgaWYgY2VsbC52YWx1ZSA9PSAwIGFuZCBjZWxsLnBlbmNpbFt2YWx1ZS0xXVxuICAgICAgICAgIGNlbGxzLnB1c2goeyB4LCB5IH0pXG5cbiAgICBpZiBjZWxscy5sZW5ndGggPiAxXG4gICAgICBsaW5rcyA9IGdlbmVyYXRlTGlua1Blcm11dGF0aW9ucyhjZWxscylcbiAgICAgIGlmIGxpbmtzLmxlbmd0aCA9PSAxXG4gICAgICAgIGxpbmtzWzBdLnN0cm9uZyA9IHRydWVcbiAgICBlbHNlXG4gICAgICBsaW5rcyA9IFtdXG4gICAgcmV0dXJuIGxpbmtzXG5cbiAgbmV3R2FtZTogKGRpZmZpY3VsdHkpIC0+XG4gICAgY29uc29sZS5sb2cgXCJuZXdHYW1lKCN7ZGlmZmljdWx0eX0pXCJcbiAgICBmb3IgaiBpbiBbMC4uLjldXG4gICAgICBmb3IgaSBpbiBbMC4uLjldXG4gICAgICAgIGNlbGwgPSBAZ3JpZFtpXVtqXVxuICAgICAgICBjZWxsLnZhbHVlID0gMFxuICAgICAgICBjZWxsLmVycm9yID0gZmFsc2VcbiAgICAgICAgY2VsbC5sb2NrZWQgPSBmYWxzZVxuICAgICAgICBmb3IgayBpbiBbMC4uLjldXG4gICAgICAgICAgY2VsbC5wZW5jaWxba10gPSBmYWxzZVxuXG4gICAgZ2VuZXJhdG9yID0gbmV3IFN1ZG9rdUdlbmVyYXRvcigpXG4gICAgbmV3R3JpZCA9IGdlbmVyYXRvci5nZW5lcmF0ZShkaWZmaWN1bHR5KVxuICAgICMgY29uc29sZS5sb2cgXCJuZXdHcmlkXCIsIG5ld0dyaWRcbiAgICBmb3IgaiBpbiBbMC4uLjldXG4gICAgICBmb3IgaSBpbiBbMC4uLjldXG4gICAgICAgIGlmIG5ld0dyaWRbaV1bal0gIT0gMFxuICAgICAgICAgIEBncmlkW2ldW2pdLnZhbHVlID0gbmV3R3JpZFtpXVtqXVxuICAgICAgICAgIEBncmlkW2ldW2pdLmxvY2tlZCA9IHRydWVcbiAgICBAdW5kb0pvdXJuYWwgPSBbXVxuICAgIEByZWRvSm91cm5hbCA9IFtdXG4gICAgQHVwZGF0ZUNlbGxzKClcbiAgICBAc2F2ZSgpXG5cbiAgbG9hZDogLT5cbiAgICBpZiBub3QgbG9jYWxTdG9yYWdlXG4gICAgICBhbGVydChcIk5vIGxvY2FsIHN0b3JhZ2UsIG5vdGhpbmcgd2lsbCB3b3JrXCIpXG4gICAgICByZXR1cm4gZmFsc2VcbiAgICBqc29uU3RyaW5nID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJnYW1lXCIpXG4gICAgaWYganNvblN0cmluZyA9PSBudWxsXG4gICAgICByZXR1cm4gZmFsc2VcblxuICAgICMgY29uc29sZS5sb2cganNvblN0cmluZ1xuICAgIGdhbWVEYXRhID0gSlNPTi5wYXJzZShqc29uU3RyaW5nKVxuICAgICMgY29uc29sZS5sb2cgXCJmb3VuZCBnYW1lRGF0YVwiLCBnYW1lRGF0YVxuXG4gICAgZm9yIGogaW4gWzAuLi45XVxuICAgICAgZm9yIGkgaW4gWzAuLi45XVxuICAgICAgICBzcmMgPSBnYW1lRGF0YS5ncmlkW2ldW2pdXG4gICAgICAgIGRzdCA9IEBncmlkW2ldW2pdXG4gICAgICAgIGRzdC52YWx1ZSA9IHNyYy52XG4gICAgICAgIGRzdC5lcnJvciA9IGlmIHNyYy5lID4gMCB0aGVuIHRydWUgZWxzZSBmYWxzZVxuICAgICAgICBkc3QubG9ja2VkID0gaWYgc3JjLmwgPiAwIHRoZW4gdHJ1ZSBlbHNlIGZhbHNlXG4gICAgICAgIGZvciBrIGluIFswLi4uOV1cbiAgICAgICAgICBkc3QucGVuY2lsW2tdID0gaWYgc3JjLnBba10gPiAwIHRoZW4gdHJ1ZSBlbHNlIGZhbHNlXG5cbiAgICBAdXBkYXRlQ2VsbHMoKVxuICAgIGNvbnNvbGUubG9nIFwiTG9hZGVkIGdhbWUuXCJcbiAgICByZXR1cm4gdHJ1ZVxuXG4gIHNhdmU6IC0+XG4gICAgaWYgbm90IGxvY2FsU3RvcmFnZVxuICAgICAgYWxlcnQoXCJObyBsb2NhbCBzdG9yYWdlLCBub3RoaW5nIHdpbGwgd29ya1wiKVxuICAgICAgcmV0dXJuIGZhbHNlXG5cbiAgICBnYW1lRGF0YSA9XG4gICAgICBncmlkOiBuZXcgQXJyYXkoOSkuZmlsbChudWxsKVxuICAgIGZvciBpIGluIFswLi4uOV1cbiAgICAgIGdhbWVEYXRhLmdyaWRbaV0gPSBuZXcgQXJyYXkoOSkuZmlsbChudWxsKVxuXG4gICAgZm9yIGogaW4gWzAuLi45XVxuICAgICAgZm9yIGkgaW4gWzAuLi45XVxuICAgICAgICBjZWxsID0gQGdyaWRbaV1bal1cbiAgICAgICAgZ2FtZURhdGEuZ3JpZFtpXVtqXSA9XG4gICAgICAgICAgdjogY2VsbC52YWx1ZVxuICAgICAgICAgIGU6IGlmIGNlbGwuZXJyb3IgdGhlbiAxIGVsc2UgMFxuICAgICAgICAgIGw6IGlmIGNlbGwubG9ja2VkIHRoZW4gMSBlbHNlIDBcbiAgICAgICAgICBwOiBbXVxuICAgICAgICBkc3QgPSBnYW1lRGF0YS5ncmlkW2ldW2pdLnBcbiAgICAgICAgZm9yIGsgaW4gWzAuLi45XVxuICAgICAgICAgIGRzdC5wdXNoKGlmIGNlbGwucGVuY2lsW2tdIHRoZW4gMSBlbHNlIDApXG5cbiAgICBqc29uU3RyaW5nID0gSlNPTi5zdHJpbmdpZnkoZ2FtZURhdGEpXG4gICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJnYW1lXCIsIGpzb25TdHJpbmcpXG4gICAgY29uc29sZS5sb2cgXCJTYXZlZCBnYW1lICgje2pzb25TdHJpbmcubGVuZ3RofSBjaGFycylcIlxuICAgIHJldHVybiB0cnVlXG5cbm1vZHVsZS5leHBvcnRzID0gU3Vkb2t1R2FtZVxuIiwic2h1ZmZsZSA9IChhKSAtPlxuICAgIGkgPSBhLmxlbmd0aFxuICAgIHdoaWxlIC0taSA+IDBcbiAgICAgICAgaiA9IH5+KE1hdGgucmFuZG9tKCkgKiAoaSArIDEpKVxuICAgICAgICB0ID0gYVtqXVxuICAgICAgICBhW2pdID0gYVtpXVxuICAgICAgICBhW2ldID0gdFxuICAgIHJldHVybiBhXG5cbmNsYXNzIEJvYXJkXG4gIGNvbnN0cnVjdG9yOiAob3RoZXJCb2FyZCA9IG51bGwpIC0+XG4gICAgQGxvY2tlZENvdW50ID0gMDtcbiAgICBAZ3JpZCA9IG5ldyBBcnJheSg5KS5maWxsKG51bGwpXG4gICAgQGxvY2tlZCA9IG5ldyBBcnJheSg5KS5maWxsKG51bGwpXG4gICAgZm9yIGkgaW4gWzAuLi45XVxuICAgICAgQGdyaWRbaV0gPSBuZXcgQXJyYXkoOSkuZmlsbCgwKVxuICAgICAgQGxvY2tlZFtpXSA9IG5ldyBBcnJheSg5KS5maWxsKGZhbHNlKVxuICAgIGlmIG90aGVyQm9hcmQgIT0gbnVsbFxuICAgICAgZm9yIGogaW4gWzAuLi45XVxuICAgICAgICBmb3IgaSBpbiBbMC4uLjldXG4gICAgICAgICAgQGdyaWRbaV1bal0gPSBvdGhlckJvYXJkLmdyaWRbaV1bal1cbiAgICAgICAgICBAbG9jayhpLCBqLCBvdGhlckJvYXJkLmxvY2tlZFtpXVtqXSlcbiAgICByZXR1cm5cblxuICBtYXRjaGVzOiAob3RoZXJCb2FyZCkgLT5cbiAgICBmb3IgaiBpbiBbMC4uLjldXG4gICAgICBmb3IgaSBpbiBbMC4uLjldXG4gICAgICAgIGlmIEBncmlkW2ldW2pdICE9IG90aGVyQm9hcmQuZ3JpZFtpXVtqXVxuICAgICAgICAgIHJldHVybiBmYWxzZVxuICAgIHJldHVybiB0cnVlXG5cbiAgbG9jazogKHgsIHksIHYgPSB0cnVlKSAtPlxuICAgIGlmIHZcbiAgICAgIEBsb2NrZWRDb3VudCArPSAxIGlmIG5vdCBAbG9ja2VkW3hdW3ldXG4gICAgZWxzZVxuICAgICAgQGxvY2tlZENvdW50IC09IDEgaWYgQGxvY2tlZFt4XVt5XVxuICAgIEBsb2NrZWRbeF1beV0gPSB2O1xuXG5cbmNsYXNzIFN1ZG9rdUdlbmVyYXRvclxuICBAZGlmZmljdWx0eTpcbiAgICBlYXN5OiAxXG4gICAgbWVkaXVtOiAyXG4gICAgaGFyZDogM1xuICAgIGV4dHJlbWU6IDRcblxuICBjb25zdHJ1Y3RvcjogLT5cblxuICBib2FyZFRvR3JpZDogKGJvYXJkKSAtPlxuICAgIG5ld0JvYXJkID0gbmV3IEFycmF5KDkpLmZpbGwobnVsbClcbiAgICBmb3IgaSBpbiBbMC4uLjldXG4gICAgICBuZXdCb2FyZFtpXSA9IG5ldyBBcnJheSg5KS5maWxsKDApXG4gICAgZm9yIGogaW4gWzAuLi45XVxuICAgICAgZm9yIGkgaW4gWzAuLi45XVxuICAgICAgICBpZiBib2FyZC5sb2NrZWRbaV1bal1cbiAgICAgICAgICBuZXdCb2FyZFtpXVtqXSA9IGJvYXJkLmdyaWRbaV1bal1cbiAgICByZXR1cm4gbmV3Qm9hcmRcblxuICBncmlkVG9Cb2FyZDogKGdyaWQpIC0+XG4gICAgYm9hcmQgPSBuZXcgQm9hcmRcbiAgICBmb3IgeSBpbiBbMC4uLjldXG4gICAgICBmb3IgeCBpbiBbMC4uLjldXG4gICAgICAgIGlmIGdyaWRbeF1beV0gPiAwXG4gICAgICAgICAgYm9hcmQuZ3JpZFt4XVt5XSA9IGdyaWRbeF1beV1cbiAgICAgICAgICBib2FyZC5sb2NrKHgsIHkpXG4gICAgcmV0dXJuIGJvYXJkXG5cbiAgY2VsbFZhbGlkOiAoYm9hcmQsIHgsIHksIHYpIC0+XG4gICAgaWYgYm9hcmQubG9ja2VkW3hdW3ldXG4gICAgICByZXR1cm4gYm9hcmQuZ3JpZFt4XVt5XSA9PSB2XG5cbiAgICBmb3IgaSBpbiBbMC4uLjldXG4gICAgICBpZiAoeCAhPSBpKSBhbmQgKGJvYXJkLmdyaWRbaV1beV0gPT0gdilcbiAgICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgIGlmICh5ICE9IGkpIGFuZCAoYm9hcmQuZ3JpZFt4XVtpXSA9PSB2KVxuICAgICAgICAgIHJldHVybiBmYWxzZVxuXG4gICAgc3ggPSBNYXRoLmZsb29yKHggLyAzKSAqIDNcbiAgICBzeSA9IE1hdGguZmxvb3IoeSAvIDMpICogM1xuICAgIGZvciBqIGluIFswLi4uM11cbiAgICAgIGZvciBpIGluIFswLi4uM11cbiAgICAgICAgaWYgKHggIT0gKHN4ICsgaSkpICYmICh5ICE9IChzeSArIGopKVxuICAgICAgICAgIGlmIGJvYXJkLmdyaWRbc3ggKyBpXVtzeSArIGpdID09IHZcbiAgICAgICAgICAgIHJldHVybiBmYWxzZVxuICAgIHJldHVybiB0cnVlXG5cbiAgcGVuY2lsTWFya3M6IChib2FyZCwgeCwgeSkgLT5cbiAgICBpZiBib2FyZC5sb2NrZWRbeF1beV1cbiAgICAgIHJldHVybiBbIGJvYXJkLmdyaWRbeF1beV0gXVxuICAgIG1hcmtzID0gW11cbiAgICBmb3IgdiBpbiBbMS4uOV1cbiAgICAgIGlmIEBjZWxsVmFsaWQoYm9hcmQsIHgsIHksIHYpXG4gICAgICAgIG1hcmtzLnB1c2ggdlxuICAgIGlmIG1hcmtzLmxlbmd0aCA+IDFcbiAgICAgIHNodWZmbGUobWFya3MpXG4gICAgcmV0dXJuIG1hcmtzXG5cbiAgbmV4dEF0dGVtcHQ6IChib2FyZCwgYXR0ZW1wdHMpIC0+XG4gICAgcmVtYWluaW5nSW5kZXhlcyA9IFswLi4uODFdXG5cbiAgICAjIHNraXAgbG9ja2VkIGNlbGxzXG4gICAgZm9yIGluZGV4IGluIFswLi4uODFdXG4gICAgICB4ID0gaW5kZXggJSA5XG4gICAgICB5ID0gaW5kZXggLy8gOVxuICAgICAgaWYgYm9hcmQubG9ja2VkW3hdW3ldXG4gICAgICAgIGsgPSByZW1haW5pbmdJbmRleGVzLmluZGV4T2YoaW5kZXgpXG4gICAgICAgIHJlbWFpbmluZ0luZGV4ZXMuc3BsaWNlKGssIDEpIGlmIGsgPj0gMFxuXG4gICAgIyBza2lwIGNlbGxzIHRoYXQgYXJlIGFscmVhZHkgYmVpbmcgdHJpZWRcbiAgICBmb3IgYSBpbiBhdHRlbXB0c1xuICAgICAgayA9IHJlbWFpbmluZ0luZGV4ZXMuaW5kZXhPZihhLmluZGV4KVxuICAgICAgcmVtYWluaW5nSW5kZXhlcy5zcGxpY2UoaywgMSkgaWYgayA+PSAwXG5cbiAgICByZXR1cm4gbnVsbCBpZiByZW1haW5pbmdJbmRleGVzLmxlbmd0aCA9PSAwICMgYWJvcnQgaWYgdGhlcmUgYXJlIG5vIGNlbGxzIChzaG91bGQgbmV2ZXIgaGFwcGVuKVxuXG4gICAgZmV3ZXN0SW5kZXggPSAtMVxuICAgIGZld2VzdE1hcmtzID0gWzAuLjldXG4gICAgZm9yIGluZGV4IGluIHJlbWFpbmluZ0luZGV4ZXNcbiAgICAgIHggPSBpbmRleCAlIDlcbiAgICAgIHkgPSBpbmRleCAvLyA5XG4gICAgICBtYXJrcyA9IEBwZW5jaWxNYXJrcyhib2FyZCwgeCwgeSlcblxuICAgICAgIyBhYm9ydCBpZiB0aGVyZSBpcyBhIGNlbGwgd2l0aCBubyBwb3NzaWJpbGl0aWVzXG4gICAgICByZXR1cm4gbnVsbCBpZiBtYXJrcy5sZW5ndGggPT0gMFxuXG4gICAgICAjIGRvbmUgaWYgdGhlcmUgaXMgYSBjZWxsIHdpdGggb25seSBvbmUgcG9zc2liaWxpdHkgKClcbiAgICAgIHJldHVybiB7IGluZGV4OiBpbmRleCwgcmVtYWluaW5nOiBtYXJrcyB9IGlmIG1hcmtzLmxlbmd0aCA9PSAxXG5cbiAgICAgICMgcmVtZW1iZXIgdGhpcyBjZWxsIGlmIGl0IGhhcyB0aGUgZmV3ZXN0IG1hcmtzIHNvIGZhclxuICAgICAgaWYgbWFya3MubGVuZ3RoIDwgZmV3ZXN0TWFya3MubGVuZ3RoXG4gICAgICAgIGZld2VzdEluZGV4ID0gaW5kZXhcbiAgICAgICAgZmV3ZXN0TWFya3MgPSBtYXJrc1xuICAgIHJldHVybiB7IGluZGV4OiBmZXdlc3RJbmRleCwgcmVtYWluaW5nOiBmZXdlc3RNYXJrcyB9XG5cbiAgc29sdmU6IChib2FyZCkgLT5cbiAgICBzb2x2ZWQgPSBuZXcgQm9hcmQoYm9hcmQpXG4gICAgYXR0ZW1wdHMgPSBbXVxuICAgIHJldHVybiBAc29sdmVJbnRlcm5hbChzb2x2ZWQsIGF0dGVtcHRzKVxuXG4gIGhhc1VuaXF1ZVNvbHV0aW9uOiAoYm9hcmQpIC0+XG4gICAgc29sdmVkID0gbmV3IEJvYXJkKGJvYXJkKVxuICAgIGF0dGVtcHRzID0gW11cblxuICAgICMgaWYgdGhlcmUgaXMgbm8gc29sdXRpb24sIHJldHVybiBmYWxzZVxuICAgIHJldHVybiBmYWxzZSBpZiBAc29sdmVJbnRlcm5hbChzb2x2ZWQsIGF0dGVtcHRzKSA9PSBudWxsXG5cbiAgICB1bmxvY2tlZENvdW50ID0gODEgLSBzb2x2ZWQubG9ja2VkQ291bnRcblxuICAgICMgaWYgdGhlcmUgYXJlIG5vIHVubG9ja2VkIGNlbGxzLCB0aGVuIHRoaXMgc29sdXRpb24gbXVzdCBiZSB1bmlxdWVcbiAgICByZXR1cm4gdHJ1ZSBpZiB1bmxvY2tlZENvdW50ID09IDBcblxuICAgICMgY2hlY2sgZm9yIGEgc2Vjb25kIHNvbHV0aW9uXG4gICAgcmV0dXJuIEBzb2x2ZUludGVybmFsKHNvbHZlZCwgYXR0ZW1wdHMsIHVubG9ja2VkQ291bnQtMSkgPT0gbnVsbFxuXG4gIHNvbHZlSW50ZXJuYWw6IChzb2x2ZWQsIGF0dGVtcHRzLCB3YWxrSW5kZXggPSAwKSAtPlxuICAgIHVubG9ja2VkQ291bnQgPSA4MSAtIHNvbHZlZC5sb2NrZWRDb3VudFxuICAgIHdoaWxlIHdhbGtJbmRleCA8IHVubG9ja2VkQ291bnRcbiAgICAgIGlmIHdhbGtJbmRleCA+PSBhdHRlbXB0cy5sZW5ndGhcbiAgICAgICAgYXR0ZW1wdCA9IEBuZXh0QXR0ZW1wdChzb2x2ZWQsIGF0dGVtcHRzKVxuICAgICAgICBhdHRlbXB0cy5wdXNoKGF0dGVtcHQpIGlmIGF0dGVtcHQgIT0gbnVsbFxuICAgICAgZWxzZVxuICAgICAgICBhdHRlbXB0ID0gYXR0ZW1wdHNbd2Fsa0luZGV4XVxuXG4gICAgICBpZiBhdHRlbXB0ICE9IG51bGxcbiAgICAgICAgeCA9IGF0dGVtcHQuaW5kZXggJSA5XG4gICAgICAgIHkgPSBhdHRlbXB0LmluZGV4IC8vIDlcbiAgICAgICAgaWYgYXR0ZW1wdC5yZW1haW5pbmcubGVuZ3RoID4gMFxuICAgICAgICAgIHNvbHZlZC5ncmlkW3hdW3ldID0gYXR0ZW1wdC5yZW1haW5pbmcucG9wKClcbiAgICAgICAgICB3YWxrSW5kZXggKz0gMVxuICAgICAgICBlbHNlXG4gICAgICAgICAgYXR0ZW1wdHMucG9wKClcbiAgICAgICAgICBzb2x2ZWQuZ3JpZFt4XVt5XSA9IDBcbiAgICAgICAgICB3YWxrSW5kZXggLT0gMVxuICAgICAgZWxzZVxuICAgICAgICB3YWxrSW5kZXggLT0gMVxuXG4gICAgICBpZiB3YWxrSW5kZXggPCAwXG4gICAgICAgIHJldHVybiBudWxsXG5cbiAgICByZXR1cm4gc29sdmVkXG5cbiAgZ2VuZXJhdGVJbnRlcm5hbDogKGFtb3VudFRvUmVtb3ZlKSAtPlxuICAgIGJvYXJkID0gQHNvbHZlKG5ldyBCb2FyZCgpKVxuICAgICMgaGFja1xuICAgIGZvciBqIGluIFswLi4uOV1cbiAgICAgIGZvciBpIGluIFswLi4uOV1cbiAgICAgICAgYm9hcmQubG9jayhpLCBqKVxuXG4gICAgaW5kZXhlc1RvUmVtb3ZlID0gc2h1ZmZsZShbMC4uLjgxXSlcbiAgICByZW1vdmVkID0gMFxuICAgIHdoaWxlIHJlbW92ZWQgPCBhbW91bnRUb1JlbW92ZVxuICAgICAgaWYgaW5kZXhlc1RvUmVtb3ZlLmxlbmd0aCA9PSAwXG4gICAgICAgIGJyZWFrXG5cbiAgICAgIHJlbW92ZUluZGV4ID0gaW5kZXhlc1RvUmVtb3ZlLnBvcCgpXG4gICAgICByeCA9IHJlbW92ZUluZGV4ICUgOVxuICAgICAgcnkgPSBNYXRoLmZsb29yKHJlbW92ZUluZGV4IC8gOSlcblxuICAgICAgbmV4dEJvYXJkID0gbmV3IEJvYXJkKGJvYXJkKVxuICAgICAgbmV4dEJvYXJkLmdyaWRbcnhdW3J5XSA9IDBcbiAgICAgIG5leHRCb2FyZC5sb2NrKHJ4LCByeSwgZmFsc2UpXG5cbiAgICAgIGlmIEBoYXNVbmlxdWVTb2x1dGlvbihuZXh0Qm9hcmQpXG4gICAgICAgIGJvYXJkID0gbmV4dEJvYXJkXG4gICAgICAgIHJlbW92ZWQgKz0gMVxuICAgICAgICAjIGNvbnNvbGUubG9nIFwic3VjY2Vzc2Z1bGx5IHJlbW92ZWQgI3tyeH0sI3tyeX1cIlxuICAgICAgZWxzZVxuICAgICAgICAjIGNvbnNvbGUubG9nIFwiZmFpbGVkIHRvIHJlbW92ZSAje3J4fSwje3J5fSwgY3JlYXRlcyBub24tdW5pcXVlIHNvbHV0aW9uXCJcblxuICAgIHJldHVybiB7XG4gICAgICBib2FyZDogYm9hcmRcbiAgICAgIHJlbW92ZWQ6IHJlbW92ZWRcbiAgICB9XG5cbiAgZ2VuZXJhdGU6IChkaWZmaWN1bHR5KSAtPlxuICAgIGFtb3VudFRvUmVtb3ZlID0gc3dpdGNoIGRpZmZpY3VsdHlcbiAgICAgIHdoZW4gU3Vkb2t1R2VuZXJhdG9yLmRpZmZpY3VsdHkuZXh0cmVtZSB0aGVuIDYwXG4gICAgICB3aGVuIFN1ZG9rdUdlbmVyYXRvci5kaWZmaWN1bHR5LmhhcmQgICAgdGhlbiA1MlxuICAgICAgd2hlbiBTdWRva3VHZW5lcmF0b3IuZGlmZmljdWx0eS5tZWRpdW0gIHRoZW4gNDZcbiAgICAgIGVsc2UgNDAgIyBlYXN5IC8gdW5rbm93blxuXG4gICAgYmVzdCA9IG51bGxcbiAgICBmb3IgYXR0ZW1wdCBpbiBbMC4uLjJdXG4gICAgICBnZW5lcmF0ZWQgPSBAZ2VuZXJhdGVJbnRlcm5hbChhbW91bnRUb1JlbW92ZSlcbiAgICAgIGlmIGdlbmVyYXRlZC5yZW1vdmVkID09IGFtb3VudFRvUmVtb3ZlXG4gICAgICAgIGNvbnNvbGUubG9nIFwiUmVtb3ZlZCBleGFjdCBhbW91bnQgI3thbW91bnRUb1JlbW92ZX0sIHN0b3BwaW5nXCJcbiAgICAgICAgYmVzdCA9IGdlbmVyYXRlZFxuICAgICAgICBicmVha1xuXG4gICAgICBpZiBiZXN0ID09IG51bGxcbiAgICAgICAgYmVzdCA9IGdlbmVyYXRlZFxuICAgICAgZWxzZSBpZiBiZXN0LnJlbW92ZWQgPCBnZW5lcmF0ZWQucmVtb3ZlZFxuICAgICAgICBiZXN0ID0gZ2VuZXJhdGVkXG4gICAgICBjb25zb2xlLmxvZyBcImN1cnJlbnQgYmVzdCAje2Jlc3QucmVtb3ZlZH0gLyAje2Ftb3VudFRvUmVtb3ZlfVwiXG5cbiAgICBjb25zb2xlLmxvZyBcImdpdmluZyB1c2VyIGJvYXJkOiAje2Jlc3QucmVtb3ZlZH0gLyAje2Ftb3VudFRvUmVtb3ZlfVwiXG4gICAgcmV0dXJuIEBib2FyZFRvR3JpZChiZXN0LmJvYXJkKVxuXG4gIHZhbGlkYXRlR3JpZDogKGdyaWQpIC0+XG4gICAgcmV0dXJuIEBoYXNVbmlxdWVTb2x1dGlvbihAZ3JpZFRvQm9hcmQoZ3JpZCkpXG5cbiAgc29sdmVTdHJpbmc6IChpbXBvcnRTdHJpbmcpIC0+XG4gICAgaWYgaW1wb3J0U3RyaW5nLmluZGV4T2YoXCJTRFwiKSAhPSAwXG4gICAgICByZXR1cm4gZmFsc2VcbiAgICBpbXBvcnRTdHJpbmcgPSBpbXBvcnRTdHJpbmcuc3Vic3RyKDIpXG4gICAgaW1wb3J0U3RyaW5nID0gaW1wb3J0U3RyaW5nLnJlcGxhY2UoL1teMC05XS9nLCBcIlwiKVxuICAgIGlmIGltcG9ydFN0cmluZy5sZW5ndGggIT0gODFcbiAgICAgIHJldHVybiBmYWxzZVxuXG4gICAgYm9hcmQgPSBuZXcgQm9hcmQoKVxuXG4gICAgaW5kZXggPSAwXG4gICAgemVyb0NoYXJDb2RlID0gXCIwXCIuY2hhckNvZGVBdCgwKVxuICAgIGZvciBqIGluIFswLi4uOV1cbiAgICAgIGZvciBpIGluIFswLi4uOV1cbiAgICAgICAgdiA9IGltcG9ydFN0cmluZy5jaGFyQ29kZUF0KGluZGV4KSAtIHplcm9DaGFyQ29kZVxuICAgICAgICBpbmRleCArPSAxXG4gICAgICAgIGlmIHYgPiAwXG4gICAgICAgICAgYm9hcmQuZ3JpZFtqXVtpXSA9IHZcbiAgICAgICAgICBib2FyZC5sb2NrKGosIGkpXG5cbiAgICBzb2x2ZWQgPSBAc29sdmUoYm9hcmQpXG4gICAgaWYgc29sdmVkID09IG51bGxcbiAgICAgIGNvbnNvbGUubG9nIFwiRVJST1I6IENhbid0IGJlIHNvbHZlZC5cIlxuICAgICAgcmV0dXJuIGZhbHNlXG5cbiAgICBpZiBub3QgQGhhc1VuaXF1ZVNvbHV0aW9uKGJvYXJkKVxuICAgICAgY29uc29sZS5sb2cgXCJFUlJPUjogQm9hcmQgc29sdmUgbm90IHVuaXF1ZS5cIlxuICAgICAgcmV0dXJuIGZhbHNlXG5cbiAgICBhbnN3ZXJTdHJpbmcgPSBcIlwiXG4gICAgZm9yIGogaW4gWzAuLi45XVxuICAgICAgZm9yIGkgaW4gWzAuLi45XVxuICAgICAgICBhbnN3ZXJTdHJpbmcgKz0gXCIje3NvbHZlZC5ncmlkW2pdW2ldfSBcIlxuICAgICAgYW5zd2VyU3RyaW5nICs9IFwiXFxuXCJcblxuICAgIHJldHVybiBhbnN3ZXJTdHJpbmdcblxubW9kdWxlLmV4cG9ydHMgPSBTdWRva3VHZW5lcmF0b3JcbiIsIlN1ZG9rdUdlbmVyYXRvciA9IHJlcXVpcmUgJy4vU3Vkb2t1R2VuZXJhdG9yJ1xuU3Vkb2t1R2FtZSA9IHJlcXVpcmUgJy4vU3Vkb2t1R2FtZSdcblxuUEVOX1BPU19YID0gMVxuUEVOX1BPU19ZID0gMTBcblBFTl9DTEVBUl9QT1NfWCA9IDJcblBFTl9DTEVBUl9QT1NfWSA9IDEzXG5cblBFTkNJTF9QT1NfWCA9IDVcblBFTkNJTF9QT1NfWSA9IDEwXG5QRU5DSUxfQ0xFQVJfUE9TX1ggPSA2XG5QRU5DSUxfQ0xFQVJfUE9TX1kgPSAxM1xuXG5NRU5VX1BPU19YID0gNFxuTUVOVV9QT1NfWSA9IDEzXG5cbk1PREVfU1RBUlRfUE9TX1ggPSAyXG5NT0RFX0NFTlRFUl9QT1NfWCA9IDRcbk1PREVfRU5EX1BPU19YID0gNlxuTU9ERV9QT1NfWSA9IDlcblxuVU5ET19QT1NfWCA9IDBcblVORE9fUE9TX1kgPSAxM1xuUkVET19QT1NfWCA9IDhcblJFRE9fUE9TX1kgPSAxM1xuXG5Db2xvciA9XG4gIHZhbHVlOiBcImJsYWNrXCJcbiAgcGVuY2lsOiBcIiMwMDAwZmZcIlxuICBlcnJvcjogXCIjZmYwMDAwXCJcbiAgZG9uZTogXCIjY2NjY2NjXCJcbiAgbWVudTogXCIjMDA4ODMzXCJcbiAgbGlua3M6IFwiI2NjMzMzM1wiXG4gIGJhY2tncm91bmRTZWxlY3RlZDogXCIjZWVlZWFhXCJcbiAgYmFja2dyb3VuZExvY2tlZDogXCIjZWVlZWVlXCJcbiAgYmFja2dyb3VuZExvY2tlZENvbmZsaWN0ZWQ6IFwiI2ZmZmZlZVwiXG4gIGJhY2tncm91bmRMb2NrZWRTZWxlY3RlZDogXCIjZWVlZWRkXCJcbiAgYmFja2dyb3VuZENvbmZsaWN0ZWQ6IFwiI2ZmZmZkZFwiXG4gIGJhY2tncm91bmRFcnJvcjogXCIjZmZkZGRkXCJcbiAgbW9kZVNlbGVjdDogXCIjNzc3NzQ0XCJcbiAgbW9kZVBlbjogXCIjMDAwMDAwXCJcbiAgbW9kZVBlbmNpbDogXCIjMDAwMGZmXCJcbiAgbW9kZUxpbmtzOiBcIiNjYzMzMzNcIlxuXG5BY3Rpb25UeXBlID1cbiAgU0VMRUNUOiAwXG4gIFBFTkNJTDogMVxuICBQRU46IDJcbiAgTUVOVTogM1xuICBVTkRPOiA0XG4gIFJFRE86IDVcbiAgTU9ERTogNlxuXG5Nb2RlVHlwZSA9XG4gIEhJR0hMSUdIVElORzogMFxuICBQRU5DSUw6IDFcbiAgUEVOOiAyXG4gIExJTktTOiAzXG5cbiMgU3BlY2lhbCBwZW4vcGVuY2lsIHZhbHVlc1xuTk9ORSA9IDBcbkNMRUFSID0gMTBcblxuY2xhc3MgU3Vkb2t1Vmlld1xuICAjIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgIyBJbml0XG5cbiAgY29uc3RydWN0b3I6IChAYXBwLCBAY2FudmFzKSAtPlxuICAgIGNvbnNvbGUubG9nIFwiY2FudmFzIHNpemUgI3tAY2FudmFzLndpZHRofXgje0BjYW52YXMuaGVpZ2h0fVwiXG5cbiAgICB3aWR0aEJhc2VkQ2VsbFNpemUgPSBAY2FudmFzLndpZHRoIC8gOVxuICAgIGhlaWdodEJhc2VkQ2VsbFNpemUgPSBAY2FudmFzLmhlaWdodCAvIDE0XG4gICAgY29uc29sZS5sb2cgXCJ3aWR0aEJhc2VkQ2VsbFNpemUgI3t3aWR0aEJhc2VkQ2VsbFNpemV9IGhlaWdodEJhc2VkQ2VsbFNpemUgI3toZWlnaHRCYXNlZENlbGxTaXplfVwiXG4gICAgQGNlbGxTaXplID0gTWF0aC5taW4od2lkdGhCYXNlZENlbGxTaXplLCBoZWlnaHRCYXNlZENlbGxTaXplKVxuXG4gICAgIyBjYWxjIHJlbmRlciBjb25zdGFudHNcbiAgICBAbGluZVdpZHRoVGhpbiA9IDFcbiAgICBAbGluZVdpZHRoVGhpY2sgPSBNYXRoLm1heChAY2VsbFNpemUgLyAyMCwgMylcblxuICAgIGZvbnRQaXhlbHNTID0gTWF0aC5mbG9vcihAY2VsbFNpemUgKiAwLjMpXG4gICAgZm9udFBpeGVsc00gPSBNYXRoLmZsb29yKEBjZWxsU2l6ZSAqIDAuNSlcbiAgICBmb250UGl4ZWxzTCA9IE1hdGguZmxvb3IoQGNlbGxTaXplICogMC44KVxuXG4gICAgIyBpbml0IGZvbnRzXG4gICAgQGZvbnRzID1cbiAgICAgIHBlbmNpbDogIEBhcHAucmVnaXN0ZXJGb250KFwicGVuY2lsXCIsICBcIiN7Zm9udFBpeGVsc1N9cHggc2F4TW9ubywgbW9ub3NwYWNlXCIpXG4gICAgICBtZW51OiAgICBAYXBwLnJlZ2lzdGVyRm9udChcIm1lbnVcIiwgICAgXCIje2ZvbnRQaXhlbHNNfXB4IHNheE1vbm8sIG1vbm9zcGFjZVwiKVxuICAgICAgcGVuOiAgICAgQGFwcC5yZWdpc3RlckZvbnQoXCJwZW5cIiwgICAgIFwiI3tmb250UGl4ZWxzTH1weCBzYXhNb25vLCBtb25vc3BhY2VcIilcblxuICAgIEBpbml0QWN0aW9ucygpXG5cbiAgICAjIGluaXQgc3RhdGVcbiAgICBAZ2FtZSA9IG5ldyBTdWRva3VHYW1lKClcbiAgICBAcmVzZXRTdGF0ZSgpXG5cbiAgICBAZHJhdygpXG5cbiAgaW5pdEFjdGlvbnM6IC0+XG4gICAgQGFjdGlvbnMgPSBuZXcgQXJyYXkoOSAqIDE1KS5maWxsKG51bGwpXG5cbiAgICBmb3IgaiBpbiBbMC4uLjldXG4gICAgICBmb3IgaSBpbiBbMC4uLjldXG4gICAgICAgIGluZGV4ID0gKGogKiA5KSArIGlcbiAgICAgICAgQGFjdGlvbnNbaW5kZXhdID0geyB0eXBlOiBBY3Rpb25UeXBlLlNFTEVDVCwgeDogaSwgeTogaiB9XG5cbiAgICBmb3IgaiBpbiBbMC4uLjNdXG4gICAgICBmb3IgaSBpbiBbMC4uLjNdXG4gICAgICAgIGluZGV4ID0gKChQRU5fUE9TX1kgKyBqKSAqIDkpICsgKFBFTl9QT1NfWCArIGkpXG4gICAgICAgIEBhY3Rpb25zW2luZGV4XSA9IHsgdHlwZTogQWN0aW9uVHlwZS5QRU4sIHZhbHVlOiAxICsgKGogKiAzKSArIGkgfVxuXG4gICAgZm9yIGogaW4gWzAuLi4zXVxuICAgICAgZm9yIGkgaW4gWzAuLi4zXVxuICAgICAgICBpbmRleCA9ICgoUEVOQ0lMX1BPU19ZICsgaikgKiA5KSArIChQRU5DSUxfUE9TX1ggKyBpKVxuICAgICAgICBAYWN0aW9uc1tpbmRleF0gPSB7IHR5cGU6IEFjdGlvblR5cGUuUEVOQ0lMLCB2YWx1ZTogMSArIChqICogMykgKyBpIH1cblxuICAgICMgUGVuIGNsZWFyIGJ1dHRvblxuICAgIGluZGV4ID0gKFBFTl9DTEVBUl9QT1NfWSAqIDkpICsgUEVOX0NMRUFSX1BPU19YXG4gICAgQGFjdGlvbnNbaW5kZXhdID0geyB0eXBlOiBBY3Rpb25UeXBlLlBFTiwgdmFsdWU6IENMRUFSIH1cblxuICAgICMgUGVuY2lsIGNsZWFyIGJ1dHRvblxuICAgIGluZGV4ID0gKFBFTkNJTF9DTEVBUl9QT1NfWSAqIDkpICsgUEVOQ0lMX0NMRUFSX1BPU19YXG4gICAgQGFjdGlvbnNbaW5kZXhdID0geyB0eXBlOiBBY3Rpb25UeXBlLlBFTkNJTCwgdmFsdWU6IENMRUFSIH1cblxuICAgICMgTWVudSBidXR0b25cbiAgICBpbmRleCA9IChNRU5VX1BPU19ZICogOSkgKyBNRU5VX1BPU19YXG4gICAgQGFjdGlvbnNbaW5kZXhdID0geyB0eXBlOiBBY3Rpb25UeXBlLk1FTlUgfVxuXG4gICAgIyBVbmRvIGJ1dHRvblxuICAgIGluZGV4ID0gKFVORE9fUE9TX1kgKiA5KSArIFVORE9fUE9TX1hcbiAgICBAYWN0aW9uc1tpbmRleF0gPSB7IHR5cGU6IEFjdGlvblR5cGUuVU5ETyB9XG5cbiAgICAjIFJlZG8gYnV0dG9uXG4gICAgaW5kZXggPSAoUkVET19QT1NfWSAqIDkpICsgUkVET19QT1NfWFxuICAgIEBhY3Rpb25zW2luZGV4XSA9IHsgdHlwZTogQWN0aW9uVHlwZS5SRURPIH1cblxuICAgICMgTW9kZSBzd2l0Y2hcbiAgICBmb3IgaSBpbiBbKE1PREVfUE9TX1kqOSkrTU9ERV9TVEFSVF9QT1NfWC4uKE1PREVfUE9TX1kqOSkrTU9ERV9FTkRfUE9TX1hdXG4gICAgICBAYWN0aW9uc1tpXSA9IHsgdHlwZTogQWN0aW9uVHlwZS5NT0RFIH1cblxuICAgIHJldHVyblxuXG4gIHJlc2V0U3RhdGU6IC0+XG4gICAgQG1vZGUgPSBNb2RlVHlwZS5ISUdITElHSFRJTkdcbiAgICBAcGVuVmFsdWUgPSBOT05FXG4gICAgQGhpZ2hsaWdodFggPSAtMVxuICAgIEBoaWdobGlnaHRZID0gLTFcbiAgICBAc3Ryb25nTGlua3MgPSBbXVxuICAgIEB3ZWFrTGlua3MgPSBbXVxuXG4gICMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAjIFJlbmRlcmluZ1xuXG4gIGRyYXdDZWxsOiAoeCwgeSwgYmFja2dyb3VuZENvbG9yLCBzLCBmb250LCBjb2xvcikgLT5cbiAgICBweCA9IHggKiBAY2VsbFNpemVcbiAgICBweSA9IHkgKiBAY2VsbFNpemVcbiAgICBpZiBiYWNrZ3JvdW5kQ29sb3IgIT0gbnVsbFxuICAgICAgQGFwcC5kcmF3RmlsbChweCwgcHksIEBjZWxsU2l6ZSwgQGNlbGxTaXplLCBiYWNrZ3JvdW5kQ29sb3IpXG4gICAgQGFwcC5kcmF3VGV4dENlbnRlcmVkKHMsIHB4ICsgKEBjZWxsU2l6ZSAvIDIpLCBweSArIChAY2VsbFNpemUgLyAyKSwgZm9udCwgY29sb3IpXG5cbiAgZHJhd0dyaWQ6IChvcmlnaW5YLCBvcmlnaW5ZLCBzaXplLCBzb2x2ZWQgPSBmYWxzZSkgLT5cbiAgICBmb3IgaSBpbiBbMC4uc2l6ZV1cbiAgICAgIGNvbG9yID0gaWYgc29sdmVkIHRoZW4gXCJncmVlblwiIGVsc2UgXCJibGFja1wiXG4gICAgICBsaW5lV2lkdGggPSBAbGluZVdpZHRoVGhpblxuICAgICAgaWYgKChzaXplID09IDEpIHx8IChpICUgMykgPT0gMClcbiAgICAgICAgbGluZVdpZHRoID0gQGxpbmVXaWR0aFRoaWNrXG5cbiAgICAgICMgSG9yaXpvbnRhbCBsaW5lc1xuICAgICAgQGFwcC5kcmF3TGluZShAY2VsbFNpemUgKiAob3JpZ2luWCArIDApLCBAY2VsbFNpemUgKiAob3JpZ2luWSArIGkpLCBAY2VsbFNpemUgKiAob3JpZ2luWCArIHNpemUpLCBAY2VsbFNpemUgKiAob3JpZ2luWSArIGkpLCBjb2xvciwgbGluZVdpZHRoKVxuXG4gICAgICAjIFZlcnRpY2FsIGxpbmVzXG4gICAgICBAYXBwLmRyYXdMaW5lKEBjZWxsU2l6ZSAqIChvcmlnaW5YICsgaSksIEBjZWxsU2l6ZSAqIChvcmlnaW5ZICsgMCksIEBjZWxsU2l6ZSAqIChvcmlnaW5YICsgaSksIEBjZWxsU2l6ZSAqIChvcmlnaW5ZICsgc2l6ZSksIGNvbG9yLCBsaW5lV2lkdGgpXG4gICAgcmV0dXJuXG5cbiAgZHJhd0xpbms6IChzdGFydFgsIHN0YXJ0WSwgZW5kWCwgZW5kWSwgY29sb3IsIGxpbmVXaWR0aCkgLT5cbiAgICB4MSA9IChzdGFydFggKyAwLjUpICogQGNlbGxTaXplXG4gICAgeTEgPSAoc3RhcnRZICsgMC41KSAqIEBjZWxsU2l6ZVxuICAgIHgyID0gKGVuZFggKyAwLjUpICogQGNlbGxTaXplXG4gICAgeTIgPSAoZW5kWSArIDAuNSkgKiBAY2VsbFNpemVcbiAgICByID0gMi4yICogTWF0aC5zcXJ0KCh4MiAtIHgxKSAqICh4MiAtIHgxKSArICh5MiAtIHkxKSAqICh5MiAtIHkxKSkgIyAyLjIgZ2l2ZXMgdGhlIG1vc3QgY3VydmUgd2l0aG91dCBnb2luZyBvZmYgdGhlIGJvYXJkXG4gICAgQGFwcC5kcmF3QXJjKHgxLCB5MSwgeDIsIHkyLCByLCBjb2xvciwgbGluZVdpZHRoKVxuXG4gIGRyYXc6IChmbGFzaFgsIGZsYXNoWSkgLT5cbiAgICBjb25zb2xlLmxvZyBcImRyYXcoKVwiXG5cbiAgICAjIENsZWFyIHNjcmVlbiB0byBibGFja1xuICAgIEBhcHAuZHJhd0ZpbGwoMCwgMCwgQGNhbnZhcy53aWR0aCwgQGNhbnZhcy5oZWlnaHQsIFwiYmxhY2tcIilcblxuICAgICMgTWFrZSB3aGl0ZSBwaG9uZS1zaGFwZWQgYmFja2dyb3VuZFxuICAgIEBhcHAuZHJhd0ZpbGwoMCwgMCwgQGNlbGxTaXplICogOSwgQGNhbnZhcy5oZWlnaHQsIFwid2hpdGVcIilcblxuICAgICMgRHJhdyBib2FyZCBudW1iZXJzXG4gICAgZm9yIGogaW4gWzAuLi45XVxuICAgICAgZm9yIGkgaW4gWzAuLi45XVxuICAgICAgICBpZiAoaSAhPSBmbGFzaFgpIHx8IChqICE9IGZsYXNoWSlcbiAgICAgICAgICBjZWxsID0gQGdhbWUuZ3JpZFtpXVtqXVxuXG4gICAgICAgICAgIyBEZXRlcm1pbmUgdGV4dCBhdHRyaWJ1dGVzXG4gICAgICAgICAgYmFja2dyb3VuZENvbG9yID0gbnVsbFxuICAgICAgICAgIGZvbnQgPSBAZm9udHMucGVuXG4gICAgICAgICAgdGV4dENvbG9yID0gQ29sb3IudmFsdWVcbiAgICAgICAgICB0ZXh0ID0gXCJcIlxuICAgICAgICAgIGlmIGNlbGwudmFsdWUgPT0gMFxuICAgICAgICAgICAgZm9udCA9IEBmb250cy5wZW5jaWxcbiAgICAgICAgICAgIHRleHRDb2xvciA9IENvbG9yLnBlbmNpbFxuICAgICAgICAgICAgdGV4dCA9IEBnYW1lLnBlbmNpbFN0cmluZyhpLCBqKVxuICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIGlmIGNlbGwudmFsdWUgPiAwXG4gICAgICAgICAgICAgIHRleHQgPSBTdHJpbmcoY2VsbC52YWx1ZSlcblxuICAgICAgICAgIGlmIGNlbGwuZXJyb3JcbiAgICAgICAgICAgIHRleHRDb2xvciA9IENvbG9yLmVycm9yXG5cbiAgICAgICAgICAjIERldGVybWluZSBiYWNrZ3JvdW5kIGNvbG9yXG4gICAgICAgICAgaWYgY2VsbC5sb2NrZWRcbiAgICAgICAgICAgIGJhY2tncm91bmRDb2xvciA9IENvbG9yLmJhY2tncm91bmRMb2NrZWRcblxuICAgICAgICAgIGlmIEBtb2RlIGlzIE1vZGVUeXBlLkhJR0hMSUdIVElOR1xuICAgICAgICAgICAgaWYgKEBoaWdobGlnaHRYICE9IC0xKSAmJiAoQGhpZ2hsaWdodFkgIT0gLTEpXG4gICAgICAgICAgICAgIGlmIChpID09IEBoaWdobGlnaHRYKSAmJiAoaiA9PSBAaGlnaGxpZ2h0WSlcbiAgICAgICAgICAgICAgICBpZiBjZWxsLmxvY2tlZFxuICAgICAgICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yID0gQ29sb3IuYmFja2dyb3VuZExvY2tlZFNlbGVjdGVkXG4gICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yID0gQ29sb3IuYmFja2dyb3VuZFNlbGVjdGVkXG4gICAgICAgICAgICAgIGVsc2UgaWYgQGNvbmZsaWN0cyhpLCBqLCBAaGlnaGxpZ2h0WCwgQGhpZ2hsaWdodFkpXG4gICAgICAgICAgICAgICAgaWYgY2VsbC5sb2NrZWRcbiAgICAgICAgICAgICAgICAgIGJhY2tncm91bmRDb2xvciA9IENvbG9yLmJhY2tncm91bmRMb2NrZWRDb25mbGljdGVkXG4gICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yID0gQ29sb3IuYmFja2dyb3VuZENvbmZsaWN0ZWRcbiAgICAgICAgZWxzZVxuICAgICAgICAgIGJhY2tncm91bmRDb2xvciA9IFwiYmxhY2tcIlxuICAgICAgICAgIGZvbnQgPSBAZm9udHMucGVuXG4gICAgICAgICAgdGV4dENvbG9yID0gXCJibGFja1wiXG4gICAgICAgICAgdGV4dCA9IFwiXCJcbiAgICAgICAgQGRyYXdDZWxsKGksIGosIGJhY2tncm91bmRDb2xvciwgdGV4dCwgZm9udCwgdGV4dENvbG9yKVxuXG4gICAgIyBEcmF3IGxpbmtzIGluIExJTktTIG1vZGVcbiAgICBpZiBAbW9kZSBpcyBNb2RlVHlwZS5MSU5LU1xuICAgICAgZm9yIGxpbmsgaW4gQHN0cm9uZ0xpbmtzXG4gICAgICAgIEBkcmF3TGluayhsaW5rWzBdLngsIGxpbmtbMF0ueSwgbGlua1sxXS54LCBsaW5rWzFdLnksIENvbG9yLmxpbmtzLCBAbGluZVdpZHRoVGhpY2spXG4gICAgICBmb3IgbGluayBpbiBAd2Vha0xpbmtzXG4gICAgICAgIEBkcmF3TGluayhsaW5rWzBdLngsIGxpbmtbMF0ueSwgbGlua1sxXS54LCBsaW5rWzFdLnksIENvbG9yLmxpbmtzLCBAbGluZVdpZHRoVGhpbilcblxuICAgICMgRHJhdyBwZW4gYW5kIHBlbmNpbCBudW1iZXIgYnV0dG9uc1xuICAgIGRvbmUgPSBAZ2FtZS5kb25lKClcbiAgICBmb3IgaiBpbiBbMC4uLjNdXG4gICAgICBmb3IgaSBpbiBbMC4uLjNdXG4gICAgICAgIGN1cnJlbnRWYWx1ZSA9IChqICogMykgKyBpICsgMVxuICAgICAgICBjdXJyZW50VmFsdWVTdHJpbmcgPSBTdHJpbmcoY3VycmVudFZhbHVlKVxuICAgICAgICB2YWx1ZUNvbG9yID0gQ29sb3IudmFsdWVcbiAgICAgICAgcGVuY2lsQ29sb3IgPSBDb2xvci5wZW5jaWxcbiAgICAgICAgaWYgZG9uZVsoaiAqIDMpICsgaV1cbiAgICAgICAgICB2YWx1ZUNvbG9yID0gQ29sb3IuZG9uZVxuICAgICAgICAgIHBlbmNpbENvbG9yID0gQ29sb3IuZG9uZVxuXG4gICAgICAgIHZhbHVlQmFja2dyb3VuZENvbG9yID0gbnVsbFxuICAgICAgICBwZW5jaWxCYWNrZ3JvdW5kQ29sb3IgPSBudWxsXG4gICAgICAgIGlmIEBwZW5WYWx1ZSA9PSBjdXJyZW50VmFsdWVcbiAgICAgICAgICBpZiBAbW9kZSBpcyBNb2RlVHlwZS5QRU5DSUwgb3IgQG1vZGUgaXMgTW9kZVR5cGUuTElOS1NcbiAgICAgICAgICAgIHBlbmNpbEJhY2tncm91bmRDb2xvciA9IENvbG9yLmJhY2tncm91bmRTZWxlY3RlZFxuICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIHZhbHVlQmFja2dyb3VuZENvbG9yID0gQ29sb3IuYmFja2dyb3VuZFNlbGVjdGVkXG5cbiAgICAgICAgQGRyYXdDZWxsKFBFTl9QT1NfWCArIGksIFBFTl9QT1NfWSArIGosIHZhbHVlQmFja2dyb3VuZENvbG9yLCBjdXJyZW50VmFsdWVTdHJpbmcsIEBmb250cy5wZW4sIHZhbHVlQ29sb3IpXG4gICAgICAgIEBkcmF3Q2VsbChQRU5DSUxfUE9TX1ggKyBpLCBQRU5DSUxfUE9TX1kgKyBqLCBwZW5jaWxCYWNrZ3JvdW5kQ29sb3IsIGN1cnJlbnRWYWx1ZVN0cmluZywgQGZvbnRzLnBlbiwgcGVuY2lsQ29sb3IpXG5cbiAgICAjIERyYXcgcGVuIGFuZCBwZW5jaWwgQ0xFQVIgYnV0dG9uc1xuICAgIHZhbHVlQmFja2dyb3VuZENvbG9yID0gbnVsbFxuICAgIHBlbmNpbEJhY2tncm91bmRDb2xvciA9IG51bGxcbiAgICBpZiBAcGVuVmFsdWUgPT0gQ0xFQVJcbiAgICAgICAgaWYgQG1vZGUgaXMgTW9kZVR5cGUuUEVOQ0lMXG4gICAgICAgICAgICBwZW5jaWxCYWNrZ3JvdW5kQ29sb3IgPSBDb2xvci5iYWNrZ3JvdW5kU2VsZWN0ZWRcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgdmFsdWVCYWNrZ3JvdW5kQ29sb3IgPSBDb2xvci5iYWNrZ3JvdW5kU2VsZWN0ZWRcblxuICAgIEBkcmF3Q2VsbChQRU5fQ0xFQVJfUE9TX1gsIFBFTl9DTEVBUl9QT1NfWSwgdmFsdWVCYWNrZ3JvdW5kQ29sb3IsIFwiQ1wiLCBAZm9udHMucGVuLCBDb2xvci5lcnJvcilcbiAgICBAZHJhd0NlbGwoUEVOQ0lMX0NMRUFSX1BPU19YLCBQRU5DSUxfQ0xFQVJfUE9TX1ksIHBlbmNpbEJhY2tncm91bmRDb2xvciwgXCJDXCIsIEBmb250cy5wZW4sIENvbG9yLmVycm9yKVxuXG4gICAgIyBEcmF3IG1vZGVcbiAgICBzd2l0Y2ggQG1vZGVcbiAgICAgIHdoZW4gTW9kZVR5cGUuSElHSExJR0hUSU5HXG4gICAgICAgIG1vZGVDb2xvciA9IENvbG9yLm1vZGVTZWxlY3RcbiAgICAgICAgbW9kZVRleHQgPSBcIkhpZ2hsaWdodGluZ1wiXG4gICAgICB3aGVuIE1vZGVUeXBlLlBFTkNJTFxuICAgICAgICBtb2RlQ29sb3IgPSBDb2xvci5tb2RlUGVuY2lsXG4gICAgICAgIG1vZGVUZXh0ID0gXCJQZW5jaWxcIlxuICAgICAgd2hlbiBNb2RlVHlwZS5QRU5cbiAgICAgICAgbW9kZUNvbG9yID0gQ29sb3IubW9kZVBlblxuICAgICAgICBtb2RlVGV4dCA9IFwiUGVuXCJcbiAgICAgIHdoZW4gTW9kZVR5cGUuTElOS1NcbiAgICAgICAgbW9kZUNvbG9yID0gQ29sb3IubW9kZUxpbmtzXG4gICAgICAgIG1vZGVUZXh0ID0gXCJMaW5rc1wiXG4gICAgQGRyYXdDZWxsKE1PREVfQ0VOVEVSX1BPU19YLCBNT0RFX1BPU19ZLCBudWxsLCBtb2RlVGV4dCwgQGZvbnRzLm1lbnUsIG1vZGVDb2xvcilcblxuICAgIEBkcmF3Q2VsbChNRU5VX1BPU19YLCBNRU5VX1BPU19ZLCBudWxsLCBcIk1lbnVcIiwgQGZvbnRzLm1lbnUsIENvbG9yLm1lbnUpXG4gICAgQGRyYXdDZWxsKFVORE9fUE9TX1gsIFVORE9fUE9TX1ksIG51bGwsIFwiXFx1ezI1YzR9XCIsIEBmb250cy5tZW51LCBDb2xvci5tZW51KSBpZiAoQGdhbWUudW5kb0pvdXJuYWwubGVuZ3RoID4gMClcbiAgICBAZHJhd0NlbGwoUkVET19QT1NfWCwgUkVET19QT1NfWSwgbnVsbCwgXCJcXHV7MjViYX1cIiwgQGZvbnRzLm1lbnUsIENvbG9yLm1lbnUpIGlmIChAZ2FtZS5yZWRvSm91cm5hbC5sZW5ndGggPiAwKVxuXG4gICAgIyBNYWtlIHRoZSBncmlkc1xuICAgIEBkcmF3R3JpZCgwLCAwLCA5LCBAZ2FtZS5zb2x2ZWQpXG4gICAgQGRyYXdHcmlkKFBFTl9QT1NfWCwgUEVOX1BPU19ZLCAzKVxuICAgIEBkcmF3R3JpZChQRU5DSUxfUE9TX1gsIFBFTkNJTF9QT1NfWSwgMylcbiAgICBAZHJhd0dyaWQoUEVOX0NMRUFSX1BPU19YLCBQRU5fQ0xFQVJfUE9TX1ksIDEpXG4gICAgQGRyYXdHcmlkKFBFTkNJTF9DTEVBUl9QT1NfWCwgUEVOQ0lMX0NMRUFSX1BPU19ZLCAxKVxuXG4gICMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAjIElucHV0XG5cbiAgbmV3R2FtZTogKGRpZmZpY3VsdHkpIC0+XG4gICAgY29uc29sZS5sb2cgXCJTdWRva3VWaWV3Lm5ld0dhbWUoI3tkaWZmaWN1bHR5fSlcIlxuICAgIEByZXNldFN0YXRlKClcbiAgICBAZ2FtZS5uZXdHYW1lKGRpZmZpY3VsdHkpXG5cbiAgcmVzZXQ6IC0+XG4gICAgQHJlc2V0U3RhdGUoKVxuICAgIEBnYW1lLnJlc2V0KClcblxuICBpbXBvcnQ6IChpbXBvcnRTdHJpbmcpIC0+XG4gICAgQHJlc2V0U3RhdGUoKVxuICAgIHJldHVybiBAZ2FtZS5pbXBvcnQoaW1wb3J0U3RyaW5nKVxuXG4gIGV4cG9ydDogLT5cbiAgICByZXR1cm4gQGdhbWUuZXhwb3J0KClcblxuICBob2xlQ291bnQ6IC0+XG4gICAgcmV0dXJuIEBnYW1lLmhvbGVDb3VudCgpXG5cbiAgaGFuZGxlU2VsZWN0QWN0aW9uOiAoYWN0aW9uKSAtPlxuICAgIHN3aXRjaCBAbW9kZVxuICAgICAgd2hlbiBNb2RlVHlwZS5ISUdITElHSFRJTkdcbiAgICAgICAgaWYgKEBoaWdobGlnaHRYID09IGFjdGlvbi54KSAmJiAoQGhpZ2hsaWdodFkgPT0gYWN0aW9uLnkpXG4gICAgICAgICAgQGhpZ2hsaWdodFggPSAtMVxuICAgICAgICAgIEBoaWdobGlnaHRZID0gLTFcbiAgICAgICAgZWxzZVxuICAgICAgICAgIEBoaWdobGlnaHRYID0gYWN0aW9uLnhcbiAgICAgICAgICBAaGlnaGxpZ2h0WSA9IGFjdGlvbi55XG4gICAgICAgIHJldHVybiBbXVxuICAgICAgd2hlbiBNb2RlVHlwZS5QRU5DSUxcbiAgICAgICAgaWYgQHBlblZhbHVlID09IENMRUFSXG4gICAgICAgICAgQGdhbWUuY2xlYXJQZW5jaWwoYWN0aW9uLngsIGFjdGlvbi55KVxuICAgICAgICBlbHNlIGlmIEBwZW5WYWx1ZSAhPSBOT05FXG4gICAgICAgICAgQGdhbWUudG9nZ2xlUGVuY2lsKGFjdGlvbi54LCBhY3Rpb24ueSwgQHBlblZhbHVlKVxuICAgICAgICByZXR1cm4gWyBhY3Rpb24ueCwgYWN0aW9uLnkgXVxuICAgICAgd2hlbiBNb2RlVHlwZS5QRU5cbiAgICAgICAgaWYgQHBlblZhbHVlID09IENMRUFSXG4gICAgICAgICAgQGdhbWUuc2V0VmFsdWUoYWN0aW9uLngsIGFjdGlvbi55LCAwKVxuICAgICAgICBlbHNlIGlmIEBwZW5WYWx1ZSAhPSBOT05FXG4gICAgICAgICAgQGdhbWUuc2V0VmFsdWUoYWN0aW9uLngsIGFjdGlvbi55LCBAcGVuVmFsdWUpXG4gICAgICAgIHJldHVybiBbIGFjdGlvbi54LCBhY3Rpb24ueSBdXG5cbiAgaGFuZGxlUGVuY2lsQWN0aW9uOiAoYWN0aW9uKSAtPlxuICAgICMgSW4gTElOS1MgbW9kZSwgYWxsIGxpbmtzIGFzc29jaWF0ZWQgd2l0aCB0aGUgbnVtYmVyIGFyZSBzaG93bi4gQ0xFQVIgc2hvd3Mgbm90aGluZy5cbiAgICBpZiBAbW9kZSBpcyBNb2RlVHlwZS5MSU5LU1xuICAgICAgaWYgKGFjdGlvbi52YWx1ZSA9PSBDTEVBUilcbiAgICAgICAgQHBlblZhbHVlID0gTk9ORVxuICAgICAgICBAc3Ryb25nTGlua3MgPSBbXVxuICAgICAgICBAd2Vha0xpbmtzID0gW11cbiAgICAgIGVsc2VcbiAgICAgICAgQHBlblZhbHVlID0gYWN0aW9uLnZhbHVlXG4gICAgICAgIHsgc3Ryb25nOiBAc3Ryb25nTGlua3MsIHdlYWs6IEB3ZWFrTGlua3MgfSA9IEBnYW1lLmdldExpbmtzKGFjdGlvbi52YWx1ZSlcblxuICAgICMgSW4gUEVOQ0lMIG1vZGUsIHRoZSBtb2RlIGlzIGNoYW5nZWQgdG8gSElHSExJR0hUSU5HIGlmIHRoZSBzZWxlY3RlZCB2YWx1ZSBpcyBhbHJlYWR5IGN1cnJlbnRcbiAgICBlbHNlIGlmIEBtb2RlIGlzIE1vZGVUeXBlLlBFTkNJTCBhbmQgKEBwZW5WYWx1ZSA9PSBhY3Rpb24udmFsdWUpXG4gICAgICBAbW9kZSA9IE1vZGVUeXBlLkhJR0hMSUdIVElOR1xuICAgICAgQHBlblZhbHVlID0gTk9ORVxuXG4gICAgIyBPdGhlcndpc2UsIHRoZSBtb2RlIGlzIHN3aXRjaGVkIHRvIChvciByZW1haW5zIGFzKSBQRU5DSUwgdXNpbmcgdGhlIHNlbGVjdGVkIHZhbHVlXG4gICAgZWxzZVxuICAgICAgQG1vZGUgPSBNb2RlVHlwZS5QRU5DSUxcbiAgICAgIEBwZW5WYWx1ZSA9IGFjdGlvbi52YWx1ZVxuXG4gICAgICAjIE1ha2Ugc3VyZSBhbnkgaGlnaGxpZ2h0aW5nIGlzIG9mZiBhbmQgbGlua3MgYXJlIGNsZWFyZWQuXG4gICAgICBAaGlnaGxpZ2h0WCA9IC0xXG4gICAgICBAaGlnaGxpZ2h0WSA9IC0xXG4gICAgICBAc3Ryb25nTGlua3MgPSBbXVxuICAgICAgQHdlYWtMaW5rcyA9IFtdXG5cbiAgaGFuZGxlUGVuQWN0aW9uOiAoYWN0aW9uKSAtPlxuICAgICMgSWdub3JlZCBpbiBMSU5LUyBtb2RlXG4gICAgaWYgQG1vZGUgaXMgTW9kZVR5cGUuTElOS1NcbiAgICAgIHJldHVyblxuXG4gICAgIyBJbiBQRU4gbW9kZSwgdGhlIG1vZGUgaXMgY2hhbmdlZCB0byBISUdITElHSFRJTkcgaWYgdGhlIHNlbGVjdGVkIHZhbHVlIGlzIGFscmVhZHkgY3VycmVudFxuICAgIGlmIEBtb2RlIGlzIE1vZGVUeXBlLlBFTiBhbmQgKEBwZW5WYWx1ZSA9PSBhY3Rpb24udmFsdWUpXG4gICAgICBAbW9kZSA9IE1vZGVUeXBlLkhJR0hMSUdIVElOR1xuICAgICAgQHBlblZhbHVlID0gTk9ORVxuXG4gICAgIyBPdGhlcndpc2UsIHRoZSBtb2RlIGlzIHN3aXRjaGVkIHRvIChvciByZW1haW5zIGFzKSBQRU4gdXNpbmcgdGhlIHNlbGVjdGVkIHZhbHVlXG4gICAgZWxzZVxuICAgICAgQG1vZGUgPSBNb2RlVHlwZS5QRU5cbiAgICAgIEBwZW5WYWx1ZSA9IGFjdGlvbi52YWx1ZVxuXG4gICAgICAjIE1ha2Ugc3VyZSBhbnkgaGlnaGxpZ2h0aW5nIGlzIG9mZiBhbmQgbGlua3MgYXJlIGNsZWFyZWQuXG4gICAgQGhpZ2hsaWdodFggPSAtMVxuICAgIEBoaWdobGlnaHRZID0gLTFcbiAgICBAc3Ryb25nTGlua3MgPSBbXVxuICAgIEB3ZWFrTGlua3MgPSBbXVxuXG4gIGhhbmRsZVVuZG9BY3Rpb246IC0+XG4gICAgcmV0dXJuIEBnYW1lLnVuZG8oKSBpZiBAbW9kZSBpc250IE1vZGVUeXBlLkxJTktTXG4gICAgXG4gIGhhbmRsZVJlZG9BY3Rpb246IC0+XG4gICAgcmV0dXJuIEBnYW1lLnJlZG8oKSBpZiBAbW9kZSBpc250IE1vZGVUeXBlLkxJTktTXG4gICAgXG4gIGhhbmRsZU1vZGVBY3Rpb246IC0+XG4gICAgc3dpdGNoIEBtb2RlXG4gICAgICB3aGVuIE1vZGVUeXBlLkhJR0hMSUdIVElOR1xuICAgICAgICBAbW9kZSA9IE1vZGVUeXBlLkxJTktTXG4gICAgICB3aGVuIE1vZGVUeXBlLlBFTkNJTFxuICAgICAgICBAbW9kZSA9IE1vZGVUeXBlLlBFTlxuICAgICAgd2hlbiBNb2RlVHlwZS5QRU5cbiAgICAgICAgQG1vZGUgPSBNb2RlVHlwZS5ISUdITElHSFRJTkdcbiAgICAgIHdoZW4gTW9kZVR5cGUuTElOS1NcbiAgICAgICAgQG1vZGUgPSBNb2RlVHlwZS5QRU5DSUxcbiAgICBAaGlnaGxpZ2h0WCA9IC0xXG4gICAgQGhpZ2hsaWdodFkgPSAtMVxuICAgIEBwZW5WYWx1ZSA9IE5PTkVcbiAgICBAc3Ryb25nTGlua3MgPSBbXVxuICAgIEB3ZWFrTGlua3MgPSBbXVxuICAgIFxuICBjbGljazogKHgsIHkpIC0+XG4gICAgIyBjb25zb2xlLmxvZyBcImNsaWNrICN7eH0sICN7eX1cIlxuICAgIHggPSBNYXRoLmZsb29yKHggLyBAY2VsbFNpemUpXG4gICAgeSA9IE1hdGguZmxvb3IoeSAvIEBjZWxsU2l6ZSlcblxuICAgIGZsYXNoWCA9IG51bGxcbiAgICBmbGFzaFkgPSBudWxsXG4gICAgaWYgKHggPCA5KSAmJiAoeSA8IDE1KVxuICAgICAgICBpbmRleCA9ICh5ICogOSkgKyB4XG4gICAgICAgIGFjdGlvbiA9IEBhY3Rpb25zW2luZGV4XVxuICAgICAgICBpZiBhY3Rpb24gIT0gbnVsbFxuICAgICAgICAgIGNvbnNvbGUubG9nIFwiQWN0aW9uOiBcIiwgYWN0aW9uXG5cbiAgICAgICAgICBpZiBhY3Rpb24udHlwZSBpcyBBY3Rpb25UeXBlLk1FTlVcbiAgICAgICAgICAgIEBhcHAuc3dpdGNoVmlldyhcIm1lbnVcIilcbiAgICAgICAgICAgIHJldHVyblxuXG4gICAgICAgICAgc3dpdGNoIGFjdGlvbi50eXBlIFxuICAgICAgICAgICAgd2hlbiBBY3Rpb25UeXBlLlNFTEVDVCB0aGVuIFsgZmxhc2hYLCBmbGFzaFkgXSA9IEBoYW5kbGVTZWxlY3RBY3Rpb24oYWN0aW9uKVxuICAgICAgICAgICAgd2hlbiBBY3Rpb25UeXBlLlBFTkNJTCB0aGVuIEBoYW5kbGVQZW5jaWxBY3Rpb24oYWN0aW9uKVxuICAgICAgICAgICAgd2hlbiBBY3Rpb25UeXBlLlBFTiB0aGVuIEBoYW5kbGVQZW5BY3Rpb24oYWN0aW9uKVxuICAgICAgICAgICAgd2hlbiBBY3Rpb25UeXBlLlVORE8gdGhlbiBbIGZsYXNoWCwgZmxhc2hZIF0gPSBAaGFuZGxlVW5kb0FjdGlvbigpXG4gICAgICAgICAgICB3aGVuIEFjdGlvblR5cGUuUkVETyB0aGVuIFsgZmxhc2hYLCBmbGFzaFkgXSA9IEBoYW5kbGVSZWRvQWN0aW9uKClcbiAgICAgICAgICAgIHdoZW4gQWN0aW9uVHlwZS5NT0RFIHRoZW4gQGhhbmRsZU1vZGVBY3Rpb24oKVxuICAgICAgICBlbHNlXG4gICAgICAgICAgIyBubyBhY3Rpb24sIGRlZmF1bHQgdG8gaGlnaGxpZ2h0aW5nIG1vZGVcbiAgICAgICAgICBAbW9kZSA9IE1vZGVUeXBlLkhJR0hMSUdIVElOR1xuICAgICAgICAgIEBoaWdobGlnaHRYID0gLTFcbiAgICAgICAgICBAaGlnaGxpZ2h0WSA9IC0xXG4gICAgICAgICAgQHBlblZhbHVlID0gTk9ORVxuICAgICAgICAgIEBzdHJvbmdMaW5rcyA9IFtdXG4gICAgICAgICAgQHdlYWtMaW5rcyA9IFtdXG5cbiAgICAgICAgQGRyYXcoZmxhc2hYLCBmbGFzaFkpXG4gICAgICAgIGlmIChmbGFzaFg/ICYmIGZsYXNoWT8pXG4gICAgICAgICAgc2V0VGltZW91dCA9PlxuICAgICAgICAgICAgQGRyYXcoKVxuICAgICAgICAgICwgMzNcblxuICAjIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgIyBIZWxwZXJzXG5cbiAgY29uZmxpY3RzOiAoeDEsIHkxLCB4MiwgeTIpIC0+XG4gICAgIyBzYW1lIHJvdyBvciBjb2x1bW4/XG4gICAgaWYgKHgxID09IHgyKSB8fCAoeTEgPT0geTIpXG4gICAgICByZXR1cm4gdHJ1ZVxuXG4gICAgIyBzYW1lIHNlY3Rpb24/XG4gICAgc3gxID0gTWF0aC5mbG9vcih4MSAvIDMpICogM1xuICAgIHN5MSA9IE1hdGguZmxvb3IoeTEgLyAzKSAqIDNcbiAgICBzeDIgPSBNYXRoLmZsb29yKHgyIC8gMykgKiAzXG4gICAgc3kyID0gTWF0aC5mbG9vcih5MiAvIDMpICogM1xuICAgIGlmIChzeDEgPT0gc3gyKSAmJiAoc3kxID09IHN5MilcbiAgICAgIHJldHVybiB0cnVlXG5cbiAgICByZXR1cm4gZmFsc2VcblxuICAjIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxubW9kdWxlLmV4cG9ydHMgPSBTdWRva3VWaWV3XG4iLCJBcHAgPSByZXF1aXJlICcuL0FwcCdcblxuaW5pdCA9IC0+XG4gIGNvbnNvbGUubG9nIFwiaW5pdFwiXG4gIGNhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJjYW52YXNcIilcbiAgY2FudmFzLndpZHRoID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudFdpZHRoXG4gIGNhbnZhcy5oZWlnaHQgPSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50SGVpZ2h0XG4gIGRvY3VtZW50LmJvZHkuaW5zZXJ0QmVmb3JlKGNhbnZhcywgZG9jdW1lbnQuYm9keS5jaGlsZE5vZGVzWzBdKVxuICBjYW52YXNSZWN0ID0gY2FudmFzLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpXG5cbiAgd2luZG93LmFwcCA9IG5ldyBBcHAoY2FudmFzKVxuXG4gICMgY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIgXCJ0b3VjaHN0YXJ0XCIsIChlKSAtPlxuICAjICAgY29uc29sZS5sb2cgT2JqZWN0LmtleXMoZS50b3VjaGVzWzBdKVxuICAjICAgeCA9IGUudG91Y2hlc1swXS5jbGllbnRYIC0gY2FudmFzUmVjdC5sZWZ0XG4gICMgICB5ID0gZS50b3VjaGVzWzBdLmNsaWVudFkgLSBjYW52YXNSZWN0LnRvcFxuICAjICAgd2luZG93LmFwcC5jbGljayh4LCB5KVxuXG4gIGNhbnZhcy5hZGRFdmVudExpc3RlbmVyIFwibW91c2Vkb3duXCIsIChlKSAtPlxuICAgIHggPSBlLmNsaWVudFggLSBjYW52YXNSZWN0LmxlZnRcbiAgICB5ID0gZS5jbGllbnRZIC0gY2FudmFzUmVjdC50b3BcbiAgICB3aW5kb3cuYXBwLmNsaWNrKHgsIHkpXG5cbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgKGUpIC0+XG4gICAgaW5pdCgpXG4sIGZhbHNlKVxuIiwibW9kdWxlLmV4cG9ydHMgPSBcIjAuMC4xMVwiIiwiLyogRm9udCBGYWNlIE9ic2VydmVyIHYyLjAuMTMgLSDCqSBCcmFtIFN0ZWluLiBMaWNlbnNlOiBCU0QtMy1DbGF1c2UgKi8oZnVuY3Rpb24oKXtmdW5jdGlvbiBsKGEsYil7ZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcj9hLmFkZEV2ZW50TGlzdGVuZXIoXCJzY3JvbGxcIixiLCExKTphLmF0dGFjaEV2ZW50KFwic2Nyb2xsXCIsYil9ZnVuY3Rpb24gbShhKXtkb2N1bWVudC5ib2R5P2EoKTpkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyP2RvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJET01Db250ZW50TG9hZGVkXCIsZnVuY3Rpb24gYygpe2RvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJET01Db250ZW50TG9hZGVkXCIsYyk7YSgpfSk6ZG9jdW1lbnQuYXR0YWNoRXZlbnQoXCJvbnJlYWR5c3RhdGVjaGFuZ2VcIixmdW5jdGlvbiBrKCl7aWYoXCJpbnRlcmFjdGl2ZVwiPT1kb2N1bWVudC5yZWFkeVN0YXRlfHxcImNvbXBsZXRlXCI9PWRvY3VtZW50LnJlYWR5U3RhdGUpZG9jdW1lbnQuZGV0YWNoRXZlbnQoXCJvbnJlYWR5c3RhdGVjaGFuZ2VcIixrKSxhKCl9KX07ZnVuY3Rpb24gcihhKXt0aGlzLmE9ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTt0aGlzLmEuc2V0QXR0cmlidXRlKFwiYXJpYS1oaWRkZW5cIixcInRydWVcIik7dGhpcy5hLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGEpKTt0aGlzLmI9ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIik7dGhpcy5jPWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpO3RoaXMuaD1kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTt0aGlzLmY9ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIik7dGhpcy5nPS0xO3RoaXMuYi5zdHlsZS5jc3NUZXh0PVwibWF4LXdpZHRoOm5vbmU7ZGlzcGxheTppbmxpbmUtYmxvY2s7cG9zaXRpb246YWJzb2x1dGU7aGVpZ2h0OjEwMCU7d2lkdGg6MTAwJTtvdmVyZmxvdzpzY3JvbGw7Zm9udC1zaXplOjE2cHg7XCI7dGhpcy5jLnN0eWxlLmNzc1RleHQ9XCJtYXgtd2lkdGg6bm9uZTtkaXNwbGF5OmlubGluZS1ibG9jaztwb3NpdGlvbjphYnNvbHV0ZTtoZWlnaHQ6MTAwJTt3aWR0aDoxMDAlO292ZXJmbG93OnNjcm9sbDtmb250LXNpemU6MTZweDtcIjtcbnRoaXMuZi5zdHlsZS5jc3NUZXh0PVwibWF4LXdpZHRoOm5vbmU7ZGlzcGxheTppbmxpbmUtYmxvY2s7cG9zaXRpb246YWJzb2x1dGU7aGVpZ2h0OjEwMCU7d2lkdGg6MTAwJTtvdmVyZmxvdzpzY3JvbGw7Zm9udC1zaXplOjE2cHg7XCI7dGhpcy5oLnN0eWxlLmNzc1RleHQ9XCJkaXNwbGF5OmlubGluZS1ibG9jazt3aWR0aDoyMDAlO2hlaWdodDoyMDAlO2ZvbnQtc2l6ZToxNnB4O21heC13aWR0aDpub25lO1wiO3RoaXMuYi5hcHBlbmRDaGlsZCh0aGlzLmgpO3RoaXMuYy5hcHBlbmRDaGlsZCh0aGlzLmYpO3RoaXMuYS5hcHBlbmRDaGlsZCh0aGlzLmIpO3RoaXMuYS5hcHBlbmRDaGlsZCh0aGlzLmMpfVxuZnVuY3Rpb24gdChhLGIpe2EuYS5zdHlsZS5jc3NUZXh0PVwibWF4LXdpZHRoOm5vbmU7bWluLXdpZHRoOjIwcHg7bWluLWhlaWdodDoyMHB4O2Rpc3BsYXk6aW5saW5lLWJsb2NrO292ZXJmbG93OmhpZGRlbjtwb3NpdGlvbjphYnNvbHV0ZTt3aWR0aDphdXRvO21hcmdpbjowO3BhZGRpbmc6MDt0b3A6LTk5OXB4O3doaXRlLXNwYWNlOm5vd3JhcDtmb250LXN5bnRoZXNpczpub25lO2ZvbnQ6XCIrYitcIjtcIn1mdW5jdGlvbiB5KGEpe3ZhciBiPWEuYS5vZmZzZXRXaWR0aCxjPWIrMTAwO2EuZi5zdHlsZS53aWR0aD1jK1wicHhcIjthLmMuc2Nyb2xsTGVmdD1jO2EuYi5zY3JvbGxMZWZ0PWEuYi5zY3JvbGxXaWR0aCsxMDA7cmV0dXJuIGEuZyE9PWI/KGEuZz1iLCEwKTohMX1mdW5jdGlvbiB6KGEsYil7ZnVuY3Rpb24gYygpe3ZhciBhPWs7eShhKSYmYS5hLnBhcmVudE5vZGUmJmIoYS5nKX12YXIgaz1hO2woYS5iLGMpO2woYS5jLGMpO3koYSl9O2Z1bmN0aW9uIEEoYSxiKXt2YXIgYz1ifHx7fTt0aGlzLmZhbWlseT1hO3RoaXMuc3R5bGU9Yy5zdHlsZXx8XCJub3JtYWxcIjt0aGlzLndlaWdodD1jLndlaWdodHx8XCJub3JtYWxcIjt0aGlzLnN0cmV0Y2g9Yy5zdHJldGNofHxcIm5vcm1hbFwifXZhciBCPW51bGwsQz1udWxsLEU9bnVsbCxGPW51bGw7ZnVuY3Rpb24gRygpe2lmKG51bGw9PT1DKWlmKEooKSYmL0FwcGxlLy50ZXN0KHdpbmRvdy5uYXZpZ2F0b3IudmVuZG9yKSl7dmFyIGE9L0FwcGxlV2ViS2l0XFwvKFswLTldKykoPzpcXC4oWzAtOV0rKSkoPzpcXC4oWzAtOV0rKSkvLmV4ZWMod2luZG93Lm5hdmlnYXRvci51c2VyQWdlbnQpO0M9ISFhJiY2MDM+cGFyc2VJbnQoYVsxXSwxMCl9ZWxzZSBDPSExO3JldHVybiBDfWZ1bmN0aW9uIEooKXtudWxsPT09RiYmKEY9ISFkb2N1bWVudC5mb250cyk7cmV0dXJuIEZ9XG5mdW5jdGlvbiBLKCl7aWYobnVsbD09PUUpe3ZhciBhPWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7dHJ5e2Euc3R5bGUuZm9udD1cImNvbmRlbnNlZCAxMDBweCBzYW5zLXNlcmlmXCJ9Y2F0Y2goYil7fUU9XCJcIiE9PWEuc3R5bGUuZm9udH1yZXR1cm4gRX1mdW5jdGlvbiBMKGEsYil7cmV0dXJuW2Euc3R5bGUsYS53ZWlnaHQsSygpP2Euc3RyZXRjaDpcIlwiLFwiMTAwcHhcIixiXS5qb2luKFwiIFwiKX1cbkEucHJvdG90eXBlLmxvYWQ9ZnVuY3Rpb24oYSxiKXt2YXIgYz10aGlzLGs9YXx8XCJCRVNic3d5XCIscT0wLEQ9Ynx8M0UzLEg9KG5ldyBEYXRlKS5nZXRUaW1lKCk7cmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKGEsYil7aWYoSigpJiYhRygpKXt2YXIgTT1uZXcgUHJvbWlzZShmdW5jdGlvbihhLGIpe2Z1bmN0aW9uIGUoKXsobmV3IERhdGUpLmdldFRpbWUoKS1IPj1EP2IoKTpkb2N1bWVudC5mb250cy5sb2FkKEwoYywnXCInK2MuZmFtaWx5KydcIicpLGspLnRoZW4oZnVuY3Rpb24oYyl7MTw9Yy5sZW5ndGg/YSgpOnNldFRpbWVvdXQoZSwyNSl9LGZ1bmN0aW9uKCl7YigpfSl9ZSgpfSksTj1uZXcgUHJvbWlzZShmdW5jdGlvbihhLGMpe3E9c2V0VGltZW91dChjLEQpfSk7UHJvbWlzZS5yYWNlKFtOLE1dKS50aGVuKGZ1bmN0aW9uKCl7Y2xlYXJUaW1lb3V0KHEpO2EoYyl9LGZ1bmN0aW9uKCl7YihjKX0pfWVsc2UgbShmdW5jdGlvbigpe2Z1bmN0aW9uIHUoKXt2YXIgYjtpZihiPS0xIT1cbmYmJi0xIT1nfHwtMSE9ZiYmLTEhPWh8fC0xIT1nJiYtMSE9aCkoYj1mIT1nJiZmIT1oJiZnIT1oKXx8KG51bGw9PT1CJiYoYj0vQXBwbGVXZWJLaXRcXC8oWzAtOV0rKSg/OlxcLihbMC05XSspKS8uZXhlYyh3aW5kb3cubmF2aWdhdG9yLnVzZXJBZ2VudCksQj0hIWImJig1MzY+cGFyc2VJbnQoYlsxXSwxMCl8fDUzNj09PXBhcnNlSW50KGJbMV0sMTApJiYxMT49cGFyc2VJbnQoYlsyXSwxMCkpKSxiPUImJihmPT12JiZnPT12JiZoPT12fHxmPT13JiZnPT13JiZoPT13fHxmPT14JiZnPT14JiZoPT14KSksYj0hYjtiJiYoZC5wYXJlbnROb2RlJiZkLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoZCksY2xlYXJUaW1lb3V0KHEpLGEoYykpfWZ1bmN0aW9uIEkoKXtpZigobmV3IERhdGUpLmdldFRpbWUoKS1IPj1EKWQucGFyZW50Tm9kZSYmZC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGQpLGIoYyk7ZWxzZXt2YXIgYT1kb2N1bWVudC5oaWRkZW47aWYoITA9PT1hfHx2b2lkIDA9PT1hKWY9ZS5hLm9mZnNldFdpZHRoLFxuZz1uLmEub2Zmc2V0V2lkdGgsaD1wLmEub2Zmc2V0V2lkdGgsdSgpO3E9c2V0VGltZW91dChJLDUwKX19dmFyIGU9bmV3IHIoayksbj1uZXcgcihrKSxwPW5ldyByKGspLGY9LTEsZz0tMSxoPS0xLHY9LTEsdz0tMSx4PS0xLGQ9ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtkLmRpcj1cImx0clwiO3QoZSxMKGMsXCJzYW5zLXNlcmlmXCIpKTt0KG4sTChjLFwic2VyaWZcIikpO3QocCxMKGMsXCJtb25vc3BhY2VcIikpO2QuYXBwZW5kQ2hpbGQoZS5hKTtkLmFwcGVuZENoaWxkKG4uYSk7ZC5hcHBlbmRDaGlsZChwLmEpO2RvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoZCk7dj1lLmEub2Zmc2V0V2lkdGg7dz1uLmEub2Zmc2V0V2lkdGg7eD1wLmEub2Zmc2V0V2lkdGg7SSgpO3ooZSxmdW5jdGlvbihhKXtmPWE7dSgpfSk7dChlLEwoYywnXCInK2MuZmFtaWx5KydcIixzYW5zLXNlcmlmJykpO3oobixmdW5jdGlvbihhKXtnPWE7dSgpfSk7dChuLEwoYywnXCInK2MuZmFtaWx5KydcIixzZXJpZicpKTtcbnoocCxmdW5jdGlvbihhKXtoPWE7dSgpfSk7dChwLEwoYywnXCInK2MuZmFtaWx5KydcIixtb25vc3BhY2UnKSl9KX0pfTtcIm9iamVjdFwiPT09dHlwZW9mIG1vZHVsZT9tb2R1bGUuZXhwb3J0cz1BOih3aW5kb3cuRm9udEZhY2VPYnNlcnZlcj1BLHdpbmRvdy5Gb250RmFjZU9ic2VydmVyLnByb3RvdHlwZS5sb2FkPUEucHJvdG90eXBlLmxvYWQpO30oKSk7XG4iXX0=
