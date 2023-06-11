(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
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


},{}],2:[function(require,module,exports){
var SudokuGenerator;

SudokuGenerator = require('./SudokuGenerator');

window.solve = function(arg) {
  var gen;
  gen = new SudokuGenerator();
  return gen.solveString(arg);
};

window.qs = function(name) {
  var regex, results, url;
  url = window.location.href;
  name = name.replace(/[\[\]]/g, '\\$&');
  regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)');
  results = regex.exec(url);
  if (!results || !results[2]) {
    return null;
  }
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
};


},{"./SudokuGenerator":1}]},{},[2])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJnYW1lL3NyYy9TdWRva3VHZW5lcmF0b3IuY29mZmVlIiwiZ2FtZS9zcmMvd2Vic29sdmVyLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBLElBQUEsS0FBQSxFQUFBLGVBQUEsRUFBQTs7QUFBQSxPQUFBLEdBQVUsUUFBQSxDQUFDLENBQUQsQ0FBQTtBQUNWLE1BQUEsQ0FBQSxFQUFBLENBQUEsRUFBQTtFQUFJLENBQUEsR0FBSSxDQUFDLENBQUM7QUFDTixTQUFNLEVBQUUsQ0FBRixHQUFNLENBQVo7SUFDSSxDQUFBLEdBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQUwsQ0FBQSxDQUFBLEdBQWdCLENBQUMsQ0FBQSxHQUFJLENBQUwsQ0FBakI7SUFDTixDQUFBLEdBQUksQ0FBQyxDQUFDLENBQUQ7SUFDTCxDQUFDLENBQUMsQ0FBRCxDQUFELEdBQU8sQ0FBQyxDQUFDLENBQUQ7SUFDUixDQUFDLENBQUMsQ0FBRCxDQUFELEdBQU87RUFKWDtBQUtBLFNBQU87QUFQRDs7QUFTSixRQUFOLE1BQUEsTUFBQTtFQUNFLFdBQWEsQ0FBQyxhQUFhLElBQWQsQ0FBQTtBQUNmLFFBQUEsQ0FBQSxFQUFBLENBQUEsRUFBQSxDQUFBLEVBQUEsQ0FBQSxFQUFBO0lBQUksSUFBQyxDQUFBLFdBQUQsR0FBZTtJQUNmLElBQUMsQ0FBQSxJQUFELEdBQVEsSUFBSSxLQUFKLENBQVUsQ0FBVixDQUFZLENBQUMsSUFBYixDQUFrQixJQUFsQjtJQUNSLElBQUMsQ0FBQSxNQUFELEdBQVUsSUFBSSxLQUFKLENBQVUsQ0FBVixDQUFZLENBQUMsSUFBYixDQUFrQixJQUFsQjtJQUNWLEtBQVMseUJBQVQ7TUFDRSxJQUFDLENBQUEsSUFBSSxDQUFDLENBQUQsQ0FBTCxHQUFXLElBQUksS0FBSixDQUFVLENBQVYsQ0FBWSxDQUFDLElBQWIsQ0FBa0IsQ0FBbEI7TUFDWCxJQUFD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T0FBQSxHQUFVLEtBQUssQ0FBQyxJQUFOLENBQVcsR0FBWDtFQUNWLElBQUcsQ0FBSSxPQUFKLElBQWUsQ0FBSSxPQUFPLENBQUMsQ0FBRCxDQUE3QjtBQUNFLFdBQU8sS0FEVDs7QUFFQSxTQUFPLGtCQUFBLENBQW1CLE9BQU8sQ0FBQyxDQUFELENBQUcsQ0FBQyxPQUFYLENBQW1CLEtBQW5CLEVBQTBCLEdBQTFCLENBQW5CO0FBUEciLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCJzaHVmZmxlID0gKGEpIC0+XHJcbiAgICBpID0gYS5sZW5ndGhcclxuICAgIHdoaWxlIC0taSA+IDBcclxuICAgICAgICBqID0gfn4oTWF0aC5yYW5kb20oKSAqIChpICsgMSkpXHJcbiAgICAgICAgdCA9IGFbal1cclxuICAgICAgICBhW2pdID0gYVtpXVxyXG4gICAgICAgIGFbaV0gPSB0XHJcbiAgICByZXR1cm4gYVxyXG5cclxuY2xhc3MgQm9hcmRcclxuICBjb25zdHJ1Y3RvcjogKG90aGVyQm9hcmQgPSBudWxsKSAtPlxyXG4gICAgQGxvY2tlZENvdW50ID0gMDtcclxuICAgIEBncmlkID0gbmV3IEFycmF5KDkpLmZpbGwobnVsbClcclxuICAgIEBsb2NrZWQgPSBuZXcgQXJyYXkoOSkuZmlsbChudWxsKVxyXG4gICAgZm9yIGkgaW4gWzAuLi45XVxyXG4gICAgICBAZ3JpZFtpXSA9IG5ldyBBcnJheSg5KS5maWxsKDApXHJcbiAgICAgIEBsb2NrZWRbaV0gPSBuZXcgQXJyYXkoOSkuZmlsbChmYWxzZSlcclxuICAgIGlmIG90aGVyQm9hcmQgIT0gbnVsbFxyXG4gICAgICBmb3IgaiBpbiBbMC4uLjldXHJcbiAgICAgICAgZm9yIGkgaW4gWzAuLi45XVxyXG4gICAgICAgICAgQGdyaWRbaV1bal0gPSBvdGhlckJvYXJkLmdyaWRbaV1bal1cclxuICAgICAgICAgIEBsb2NrKGksIGosIG90aGVyQm9hcmQubG9ja2VkW2ldW2pdKVxyXG4gICAgcmV0dXJuXHJcblxyXG4gIG1hdGNoZXM6IChvdGhlckJvYXJkKSAtPlxyXG4gICAgZm9yIGogaW4gWzAuLi45XVxyXG4gICAgICBmb3IgaSBpbiBbMC4uLjldXHJcbiAgICAgICAgaWYgQGdyaWRbaV1bal0gIT0gb3RoZXJCb2FyZC5ncmlkW2ldW2pdXHJcbiAgICAgICAgICByZXR1cm4gZmFsc2VcclxuICAgIHJldHVybiB0cnVlXHJcblxyXG4gIGxvY2s6ICh4LCB5LCB2ID0gdHJ1ZSkgLT5cclxuICAgIGlmIHZcclxuICAgICAgQGxvY2tlZENvdW50ICs9IDEgaWYgbm90IEBsb2NrZWRbeF1beV1cclxuICAgIGVsc2VcclxuICAgICAgQGxvY2tlZENvdW50IC09IDEgaWYgQGxvY2tlZFt4XVt5XVxyXG4gICAgQGxvY2tlZFt4XVt5XSA9IHY7XHJcblxyXG5cclxuY2xhc3MgU3Vkb2t1R2VuZXJhdG9yXHJcbiAgQGRpZmZpY3VsdHk6XHJcbiAgICBlYXN5OiAxXHJcbiAgICBtZWRpdW06IDJcclxuICAgIGhhcmQ6IDNcclxuICAgIGV4dHJlbWU6IDRcclxuXHJcbiAgY29uc3RydWN0b3I6IC0+XHJcblxyXG4gIGJvYXJkVG9HcmlkOiAoYm9hcmQpIC0+XHJcbiAgICBuZXdCb2FyZCA9IG5ldyBBcnJheSg5KS5maWxsKG51bGwpXHJcbiAgICBmb3IgaSBpbiBbMC4uLjldXHJcbiAgICAgIG5ld0JvYXJkW2ldID0gbmV3IEFycmF5KDkpLmZpbGwoMClcclxuICAgIGZvciBqIGluIFswLi4uOV1cclxuICAgICAgZm9yIGkgaW4gWzAuLi45XVxyXG4gICAgICAgIGlmIGJvYXJkLmxvY2tlZFtpXVtqXVxyXG4gICAgICAgICAgbmV3Qm9hcmRbaV1bal0gPSBib2FyZC5ncmlkW2ldW2pdXHJcbiAgICByZXR1cm4gbmV3Qm9hcmRcclxuXHJcbiAgZ3JpZFRvQm9hcmQ6IChncmlkKSAtPlxyXG4gICAgYm9hcmQgPSBuZXcgQm9hcmRcclxuICAgIGZvciB5IGluIFswLi4uOV1cclxuICAgICAgZm9yIHggaW4gWzAuLi45XVxyXG4gICAgICAgIGlmIGdyaWRbeF1beV0gPiAwXHJcbiAgICAgICAgICBib2FyZC5ncmlkW3hdW3ldID0gZ3JpZFt4XVt5XVxyXG4gICAgICAgICAgYm9hcmQubG9jayh4LCB5KVxyXG4gICAgcmV0dXJuIGJvYXJkXHJcblxyXG4gIGNlbGxWYWxpZDogKGJvYXJkLCB4LCB5LCB2KSAtPlxyXG4gICAgaWYgYm9hcmQubG9ja2VkW3hdW3ldXHJcbiAgICAgIHJldHVybiBib2FyZC5ncmlkW3hdW3ldID09IHZcclxuXHJcbiAgICBmb3IgaSBpbiBbMC4uLjldXHJcbiAgICAgIGlmICh4ICE9IGkpIGFuZCAoYm9hcmQuZ3JpZFtpXVt5XSA9PSB2KVxyXG4gICAgICAgICAgcmV0dXJuIGZhbHNlXHJcbiAgICAgIGlmICh5ICE9IGkpIGFuZCAoYm9hcmQuZ3JpZFt4XVtpXSA9PSB2KVxyXG4gICAgICAgICAgcmV0dXJuIGZhbHNlXHJcblxyXG4gICAgc3ggPSBNYXRoLmZsb29yKHggLyAzKSAqIDNcclxuICAgIHN5ID0gTWF0aC5mbG9vcih5IC8gMykgKiAzXHJcbiAgICBmb3IgaiBpbiBbMC4uLjNdXHJcbiAgICAgIGZvciBpIGluIFswLi4uM11cclxuICAgICAgICBpZiAoeCAhPSAoc3ggKyBpKSkgJiYgKHkgIT0gKHN5ICsgaikpXHJcbiAgICAgICAgICBpZiBib2FyZC5ncmlkW3N4ICsgaV1bc3kgKyBqXSA9PSB2XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZVxyXG4gICAgcmV0dXJuIHRydWVcclxuXHJcbiAgcGVuY2lsTWFya3M6IChib2FyZCwgeCwgeSkgLT5cclxuICAgIGlmIGJvYXJkLmxvY2tlZFt4XVt5XVxyXG4gICAgICByZXR1cm4gWyBib2FyZC5ncmlkW3hdW3ldIF1cclxuICAgIG1hcmtzID0gW11cclxuICAgIGZvciB2IGluIFsxLi45XVxyXG4gICAgICBpZiBAY2VsbFZhbGlkKGJvYXJkLCB4LCB5LCB2KVxyXG4gICAgICAgIG1hcmtzLnB1c2ggdlxyXG4gICAgaWYgbWFya3MubGVuZ3RoID4gMVxyXG4gICAgICBzaHVmZmxlKG1hcmtzKVxyXG4gICAgcmV0dXJuIG1hcmtzXHJcblxyXG4gIG5leHRBdHRlbXB0OiAoYm9hcmQsIGF0dGVtcHRzKSAtPlxyXG4gICAgcmVtYWluaW5nSW5kZXhlcyA9IFswLi4uODFdXHJcblxyXG4gICAgIyBza2lwIGxvY2tlZCBjZWxsc1xyXG4gICAgZm9yIGluZGV4IGluIFswLi4uODFdXHJcbiAgICAgIHggPSBpbmRleCAlIDlcclxuICAgICAgeSA9IGluZGV4IC8vIDlcclxuICAgICAgaWYgYm9hcmQubG9ja2VkW3hdW3ldXHJcbiAgICAgICAgayA9IHJlbWFpbmluZ0luZGV4ZXMuaW5kZXhPZihpbmRleClcclxuICAgICAgICByZW1haW5pbmdJbmRleGVzLnNwbGljZShrLCAxKSBpZiBrID49IDBcclxuXHJcbiAgICAjIHNraXAgY2VsbHMgdGhhdCBhcmUgYWxyZWFkeSBiZWluZyB0cmllZFxyXG4gICAgZm9yIGEgaW4gYXR0ZW1wdHNcclxuICAgICAgayA9IHJlbWFpbmluZ0luZGV4ZXMuaW5kZXhPZihhLmluZGV4KVxyXG4gICAgICByZW1haW5pbmdJbmRleGVzLnNwbGljZShrLCAxKSBpZiBrID49IDBcclxuXHJcbiAgICByZXR1cm4gbnVsbCBpZiByZW1haW5pbmdJbmRleGVzLmxlbmd0aCA9PSAwICMgYWJvcnQgaWYgdGhlcmUgYXJlIG5vIGNlbGxzIChzaG91bGQgbmV2ZXIgaGFwcGVuKVxyXG5cclxuICAgIGZld2VzdEluZGV4ID0gLTFcclxuICAgIGZld2VzdE1hcmtzID0gWzAuLjldXHJcbiAgICBmb3IgaW5kZXggaW4gcmVtYWluaW5nSW5kZXhlc1xyXG4gICAgICB4ID0gaW5kZXggJSA5XHJcbiAgICAgIHkgPSBpbmRleCAvLyA5XHJcbiAgICAgIG1hcmtzID0gQHBlbmNpbE1hcmtzKGJvYXJkLCB4LCB5KVxyXG5cclxuICAgICAgIyBhYm9ydCBpZiB0aGVyZSBpcyBhIGNlbGwgd2l0aCBubyBwb3NzaWJpbGl0aWVzXHJcbiAgICAgIHJldHVybiBudWxsIGlmIG1hcmtzLmxlbmd0aCA9PSAwXHJcblxyXG4gICAgICAjIGRvbmUgaWYgdGhlcmUgaXMgYSBjZWxsIHdpdGggb25seSBvbmUgcG9zc2liaWxpdHkgKClcclxuICAgICAgcmV0dXJuIHsgaW5kZXg6IGluZGV4LCByZW1haW5pbmc6IG1hcmtzIH0gaWYgbWFya3MubGVuZ3RoID09IDFcclxuXHJcbiAgICAgICMgcmVtZW1iZXIgdGhpcyBjZWxsIGlmIGl0IGhhcyB0aGUgZmV3ZXN0IG1hcmtzIHNvIGZhclxyXG4gICAgICBpZiBtYXJrcy5sZW5ndGggPCBmZXdlc3RNYXJrcy5sZW5ndGhcclxuICAgICAgICBmZXdlc3RJbmRleCA9IGluZGV4XHJcbiAgICAgICAgZmV3ZXN0TWFya3MgPSBtYXJrc1xyXG4gICAgcmV0dXJuIHsgaW5kZXg6IGZld2VzdEluZGV4LCByZW1haW5pbmc6IGZld2VzdE1hcmtzIH1cclxuXHJcbiAgc29sdmU6IChib2FyZCkgLT5cclxuICAgIHNvbHZlZCA9IG5ldyBCb2FyZChib2FyZClcclxuICAgIGF0dGVtcHRzID0gW11cclxuICAgIHJldHVybiBAc29sdmVJbnRlcm5hbChzb2x2ZWQsIGF0dGVtcHRzKVxyXG5cclxuICBoYXNVbmlxdWVTb2x1dGlvbjogKGJvYXJkKSAtPlxyXG4gICAgc29sdmVkID0gbmV3IEJvYXJkKGJvYXJkKVxyXG4gICAgYXR0ZW1wdHMgPSBbXVxyXG5cclxuICAgICMgaWYgdGhlcmUgaXMgbm8gc29sdXRpb24sIHJldHVybiBmYWxzZVxyXG4gICAgcmV0dXJuIGZhbHNlIGlmIEBzb2x2ZUludGVybmFsKHNvbHZlZCwgYXR0ZW1wdHMpID09IG51bGxcclxuXHJcbiAgICB1bmxvY2tlZENvdW50ID0gODEgLSBzb2x2ZWQubG9ja2VkQ291bnRcclxuXHJcbiAgICAjIGlmIHRoZXJlIGFyZSBubyB1bmxvY2tlZCBjZWxscywgdGhlbiB0aGlzIHNvbHV0aW9uIG11c3QgYmUgdW5pcXVlXHJcbiAgICByZXR1cm4gdHJ1ZSBpZiB1bmxvY2tlZENvdW50ID09IDBcclxuXHJcbiAgICAjIGNoZWNrIGZvciBhIHNlY29uZCBzb2x1dGlvblxyXG4gICAgcmV0dXJuIEBzb2x2ZUludGVybmFsKHNvbHZlZCwgYXR0ZW1wdHMsIHVubG9ja2VkQ291bnQtMSkgPT0gbnVsbFxyXG5cclxuICBzb2x2ZUludGVybmFsOiAoc29sdmVkLCBhdHRlbXB0cywgd2Fsa0luZGV4ID0gMCkgLT5cclxuICAgIHVubG9ja2VkQ291bnQgPSA4MSAtIHNvbHZlZC5sb2NrZWRDb3VudFxyXG4gICAgd2hpbGUgd2Fsa0luZGV4IDwgdW5sb2NrZWRDb3VudFxyXG4gICAgICBpZiB3YWxrSW5kZXggPj0gYXR0ZW1wdHMubGVuZ3RoXHJcbiAgICAgICAgYXR0ZW1wdCA9IEBuZXh0QXR0ZW1wdChzb2x2ZWQsIGF0dGVtcHRzKVxyXG4gICAgICAgIGF0dGVtcHRzLnB1c2goYXR0ZW1wdCkgaWYgYXR0ZW1wdCAhPSBudWxsXHJcbiAgICAgIGVsc2VcclxuICAgICAgICBhdHRlbXB0ID0gYXR0ZW1wdHNbd2Fsa0luZGV4XVxyXG5cclxuICAgICAgaWYgYXR0ZW1wdCAhPSBudWxsXHJcbiAgICAgICAgeCA9IGF0dGVtcHQuaW5kZXggJSA5XHJcbiAgICAgICAgeSA9IGF0dGVtcHQuaW5kZXggLy8gOVxyXG4gICAgICAgIGlmIGF0dGVtcHQucmVtYWluaW5nLmxlbmd0aCA+IDBcclxuICAgICAgICAgIHNvbHZlZC5ncmlkW3hdW3ldID0gYXR0ZW1wdC5yZW1haW5pbmcucG9wKClcclxuICAgICAgICAgIHdhbGtJbmRleCArPSAxXHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgICAgYXR0ZW1wdHMucG9wKClcclxuICAgICAgICAgIHNvbHZlZC5ncmlkW3hdW3ldID0gMFxyXG4gICAgICAgICAgd2Fsa0luZGV4IC09IDFcclxuICAgICAgZWxzZVxyXG4gICAgICAgIHdhbGtJbmRleCAtPSAxXHJcblxyXG4gICAgICBpZiB3YWxrSW5kZXggPCAwXHJcbiAgICAgICAgcmV0dXJuIG51bGxcclxuXHJcbiAgICByZXR1cm4gc29sdmVkXHJcblxyXG4gIGdlbmVyYXRlSW50ZXJuYWw6IChhbW91bnRUb1JlbW92ZSkgLT5cclxuICAgIGJvYXJkID0gQHNvbHZlKG5ldyBCb2FyZCgpKVxyXG4gICAgIyBoYWNrXHJcbiAgICBmb3IgaiBpbiBbMC4uLjldXHJcbiAgICAgIGZvciBpIGluIFswLi4uOV1cclxuICAgICAgICBib2FyZC5sb2NrKGksIGopXHJcblxyXG4gICAgaW5kZXhlc1RvUmVtb3ZlID0gc2h1ZmZsZShbMC4uLjgxXSlcclxuICAgIHJlbW92ZWQgPSAwXHJcbiAgICB3aGlsZSByZW1vdmVkIDwgYW1vdW50VG9SZW1vdmVcclxuICAgICAgaWYgaW5kZXhlc1RvUmVtb3ZlLmxlbmd0aCA9PSAwXHJcbiAgICAgICAgYnJlYWtcclxuXHJcbiAgICAgIHJlbW92ZUluZGV4ID0gaW5kZXhlc1RvUmVtb3ZlLnBvcCgpXHJcbiAgICAgIHJ4ID0gcmVtb3ZlSW5kZXggJSA5XHJcbiAgICAgIHJ5ID0gTWF0aC5mbG9vcihyZW1vdmVJbmRleCAvIDkpXHJcblxyXG4gICAgICBuZXh0Qm9hcmQgPSBuZXcgQm9hcmQoYm9hcmQpXHJcbiAgICAgIG5leHRCb2FyZC5ncmlkW3J4XVtyeV0gPSAwXHJcbiAgICAgIG5leHRCb2FyZC5sb2NrKHJ4LCByeSwgZmFsc2UpXHJcblxyXG4gICAgICBpZiBAaGFzVW5pcXVlU29sdXRpb24obmV4dEJvYXJkKVxyXG4gICAgICAgIGJvYXJkID0gbmV4dEJvYXJkXHJcbiAgICAgICAgcmVtb3ZlZCArPSAxXHJcbiAgICAgICAgIyBjb25zb2xlLmxvZyBcInN1Y2Nlc3NmdWxseSByZW1vdmVkICN7cnh9LCN7cnl9XCJcclxuICAgICAgZWxzZVxyXG4gICAgICAgICMgY29uc29sZS5sb2cgXCJmYWlsZWQgdG8gcmVtb3ZlICN7cnh9LCN7cnl9LCBjcmVhdGVzIG5vbi11bmlxdWUgc29sdXRpb25cIlxyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgIGJvYXJkOiBib2FyZFxyXG4gICAgICByZW1vdmVkOiByZW1vdmVkXHJcbiAgICB9XHJcblxyXG4gIGdlbmVyYXRlOiAoZGlmZmljdWx0eSkgLT5cclxuICAgIGFtb3VudFRvUmVtb3ZlID0gc3dpdGNoIGRpZmZpY3VsdHlcclxuICAgICAgd2hlbiBTdWRva3VHZW5lcmF0b3IuZGlmZmljdWx0eS5leHRyZW1lIHRoZW4gNjBcclxuICAgICAgd2hlbiBTdWRva3VHZW5lcmF0b3IuZGlmZmljdWx0eS5oYXJkICAgIHRoZW4gNTJcclxuICAgICAgd2hlbiBTdWRva3VHZW5lcmF0b3IuZGlmZmljdWx0eS5tZWRpdW0gIHRoZW4gNDZcclxuICAgICAgZWxzZSA0MCAjIGVhc3kgLyB1bmtub3duXHJcblxyXG4gICAgYmVzdCA9IG51bGxcclxuICAgIGZvciBhdHRlbXB0IGluIFswLi4uMl1cclxuICAgICAgZ2VuZXJhdGVkID0gQGdlbmVyYXRlSW50ZXJuYWwoYW1vdW50VG9SZW1vdmUpXHJcbiAgICAgIGlmIGdlbmVyYXRlZC5yZW1vdmVkID09IGFtb3VudFRvUmVtb3ZlXHJcbiAgICAgICAgY29uc29sZS5sb2cgXCJSZW1vdmVkIGV4YWN0IGFtb3VudCAje2Ftb3VudFRvUmVtb3ZlfSwgc3RvcHBpbmdcIlxyXG4gICAgICAgIGJlc3QgPSBnZW5lcmF0ZWRcclxuICAgICAgICBicmVha1xyXG5cclxuICAgICAgaWYgYmVzdCA9PSBudWxsXHJcbiAgICAgICAgYmVzdCA9IGdlbmVyYXRlZFxyXG4gICAgICBlbHNlIGlmIGJlc3QucmVtb3ZlZCA8IGdlbmVyYXRlZC5yZW1vdmVkXHJcbiAgICAgICAgYmVzdCA9IGdlbmVyYXRlZFxyXG4gICAgICBjb25zb2xlLmxvZyBcImN1cnJlbnQgYmVzdCAje2Jlc3QucmVtb3ZlZH0gLyAje2Ftb3VudFRvUmVtb3ZlfVwiXHJcblxyXG4gICAgY29uc29sZS5sb2cgXCJnaXZpbmcgdXNlciBib2FyZDogI3tiZXN0LnJlbW92ZWR9IC8gI3thbW91bnRUb1JlbW92ZX1cIlxyXG4gICAgcmV0dXJuIEBib2FyZFRvR3JpZChiZXN0LmJvYXJkKVxyXG5cclxuICB2YWxpZGF0ZUdyaWQ6IChncmlkKSAtPlxyXG4gICAgcmV0dXJuIEBoYXNVbmlxdWVTb2x1dGlvbihAZ3JpZFRvQm9hcmQoZ3JpZCkpXHJcblxyXG4gIHNvbHZlU3RyaW5nOiAoaW1wb3J0U3RyaW5nKSAtPlxyXG4gICAgaWYgaW1wb3J0U3RyaW5nLmluZGV4T2YoXCJTRFwiKSAhPSAwXHJcbiAgICAgIHJldHVybiBmYWxzZVxyXG4gICAgaW1wb3J0U3RyaW5nID0gaW1wb3J0U3RyaW5nLnN1YnN0cigyKVxyXG4gICAgaW1wb3J0U3RyaW5nID0gaW1wb3J0U3RyaW5nLnJlcGxhY2UoL1teMC05XS9nLCBcIlwiKVxyXG4gICAgaWYgaW1wb3J0U3RyaW5nLmxlbmd0aCAhPSA4MVxyXG4gICAgICByZXR1cm4gZmFsc2VcclxuXHJcbiAgICBib2FyZCA9IG5ldyBCb2FyZCgpXHJcblxyXG4gICAgaW5kZXggPSAwXHJcbiAgICB6ZXJvQ2hhckNvZGUgPSBcIjBcIi5jaGFyQ29kZUF0KDApXHJcbiAgICBmb3IgaiBpbiBbMC4uLjldXHJcbiAgICAgIGZvciBpIGluIFswLi4uOV1cclxuICAgICAgICB2ID0gaW1wb3J0U3RyaW5nLmNoYXJDb2RlQXQoaW5kZXgpIC0gemVyb0NoYXJDb2RlXHJcbiAgICAgICAgaW5kZXggKz0gMVxyXG4gICAgICAgIGlmIHYgPiAwXHJcbiAgICAgICAgICBib2FyZC5ncmlkW2pdW2ldID0gdlxyXG4gICAgICAgICAgYm9hcmQubG9jayhqLCBpKVxyXG5cclxuICAgIHNvbHZlZCA9IEBzb2x2ZShib2FyZClcclxuICAgIGlmIHNvbHZlZCA9PSBudWxsXHJcbiAgICAgIGNvbnNvbGUubG9nIFwiRVJST1I6IENhbid0IGJlIHNvbHZlZC5cIlxyXG4gICAgICByZXR1cm4gZmFsc2VcclxuXHJcbiAgICBpZiBub3QgQGhhc1VuaXF1ZVNvbHV0aW9uKGJvYXJkKVxyXG4gICAgICBjb25zb2xlLmxvZyBcIkVSUk9SOiBCb2FyZCBzb2x2ZSBub3QgdW5pcXVlLlwiXHJcbiAgICAgIHJldHVybiBmYWxzZVxyXG5cclxuICAgIGFuc3dlclN0cmluZyA9IFwiXCJcclxuICAgIGZvciBqIGluIFswLi4uOV1cclxuICAgICAgZm9yIGkgaW4gWzAuLi45XVxyXG4gICAgICAgIGFuc3dlclN0cmluZyArPSBcIiN7c29sdmVkLmdyaWRbal1baV19IFwiXHJcbiAgICAgIGFuc3dlclN0cmluZyArPSBcIlxcblwiXHJcblxyXG4gICAgcmV0dXJuIGFuc3dlclN0cmluZ1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBTdWRva3VHZW5lcmF0b3JcclxuIiwiU3Vkb2t1R2VuZXJhdG9yID0gcmVxdWlyZSAnLi9TdWRva3VHZW5lcmF0b3InXHJcblxyXG53aW5kb3cuc29sdmUgPSAoYXJnKSAtPlxyXG4gIGdlbiA9IG5ldyBTdWRva3VHZW5lcmF0b3JcclxuICByZXR1cm4gZ2VuLnNvbHZlU3RyaW5nKGFyZylcclxuXHJcbndpbmRvdy5xcyA9IChuYW1lKSAtPlxyXG4gIHVybCA9IHdpbmRvdy5sb2NhdGlvbi5ocmVmXHJcbiAgbmFtZSA9IG5hbWUucmVwbGFjZSgvW1xcW1xcXV0vZywgJ1xcXFwkJicpXHJcbiAgcmVnZXggPSBuZXcgUmVnRXhwKCdbPyZdJyArIG5hbWUgKyAnKD0oW14mI10qKXwmfCN8JCknKVxyXG4gIHJlc3VsdHMgPSByZWdleC5leGVjKHVybCk7XHJcbiAgaWYgbm90IHJlc3VsdHMgb3Igbm90IHJlc3VsdHNbMl1cclxuICAgIHJldHVybiBudWxsXHJcbiAgcmV0dXJuIGRlY29kZVVSSUNvbXBvbmVudChyZXN1bHRzWzJdLnJlcGxhY2UoL1xcKy9nLCAnICcpKVxyXG5cclxuIl19
