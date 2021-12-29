var kingMoves = 0;
var promo = 'q';
document.getElementById("prom").innerHTML = 'Queen';

function promoQ(){
  promo = 'q';
  document.getElementById("prom").innerHTML = 'Queen';
}

function promoR(){
  promo = 'r';
  document.getElementById("prom").innerHTML = 'Rook';
}

function promoB(){
  promo = 'b';
  document.getElementById("prom").innerHTML = 'Bishop';
}

function promoN(){
  promo = 'n';
  document.getElementById("prom").innerHTML = 'Knight';
}

var board = null
var game = new Chess()
var $status = $('#status')
var $fen = $('#fen')
var $pgn = $('#pgn')
var $eval = $('#eval')
var whiteSquareGrey = '#a9a9a9'
var blackSquareGrey = '#696969'

var weights = { 
    p: 100, n: 305, b: 333, r: 563, q: 950, k: 50
} 

// Piece-Square Tables https://www.chessprogramming.org/Piece-Square_Tables
// taken from https://www.chessprogramming.org/Simplified_Evaluation_Function
var white_pst = {
    p: [
        [0,0,0,0,0,0,0,0],
        [50, 50, 50, 50, 50, 50, 50, 50],
        [10, 10, 20, 30, 30, 20, 10, 10],
        [5,  5, 10, 25, 25, 10,  5,  5],
        [0,  0,  0, 20, 20,  0,  0,  0],
        [5, -5,-10,  0,  0,-10, -5,  5],
        [5, 10, 10,-20,-20, 10, 10,  5],
        [0,0,0,0,0,0,0,0]
    ],
    n: [
        [-50,-40,-30,-30,-30,-30,-40,-50],
        [-40,-20,  0,  0,  0,  0,-20,-40],
        [-30,  0, 10, 15, 15, 10,  0,-30],
        [-30,  5, 15, 20, 20, 15,  5,-30],
        [-30,  0, 15, 20, 20, 15,  0,-30],
        [-30,  5, 10, 15, 15, 10,  5,-30],
        [-40,-20,  0,  5,  5,  0,-20,-40],
        [-50,-40,-30,-30,-30,-30,-40,-50]
    ],
    b: [
        [-20,-10,-10,-10,-10,-10,-10,-20],
        [-10,  0,  0,  0,  0,  0,  0,-10],
        [-10,  0,  5, 10, 10,  5,  0,-10],
        [-10,  5,  5, 10, 10,  5,  5,-10],
        [-10,  0, 10, 10, 10, 10,  0,-10],
        [-10, 10, 10, 10, 10, 10, 10,-10],
        [-10,  5,  0,  0,  0,  0,  5,-10],
        [-20,-10,-10,-10,-10,-10,-10,-20]
    ],
    r: [
        [0,  0,  0,  0,  0,  0,  0,  0],
        [5, 10, 10, 10, 10, 10, 10,  5],
        [-5,  0,  0,  0,  0,  0,  0, -5],
        [-5,  0,  0,  0,  0,  0,  0, -5],
        [-5,  0,  0,  0,  0,  0,  0, -5],
        [-5,  0,  0,  0,  0,  0,  0, -5],
        [-5,  0,  0,  0,  0,  0,  0, -5],
        [0,  0,  0,  5,  5,  0,  0,  0]
    ],
    q: [
        [-20,-10,-10, -5, -5,-10,-10,-20],
        [-10,  0,  0,  0,  0,  0,  0,-10],
        [-10,  0,  5,  5,  5,  5,  0,-10],
        [-5,  0,  5,  5,  5,  5,  0, -5],
        [0,  0,  5,  5,  5,  5,  0, -5],
        [-10,  5,  5,  5,  5,  5,  0,-10],
        [-10,  0,  5,  0,  0,  0,  0,-10],
        [-20,-10,-10, -5, -5,-10,-10,-20]
    ],
    k: [
        [-30,-40,-40,-50,-50,-40,-40,-30],
        [-30,-40,-40,-50,-50,-40,-40,-30],
        [-30,-40,-40,-50,-50,-40,-40,-30],
        [-30,-40,-40,-50,-50,-40,-40,-30],
        [-20,-30,-30,-40,-40,-30,-30,-20],
        [-10,-20,-20,-20,-20,-20,-20,-10],
        [20, 20,  0,  0,  0,  0, 20, 20],
        [20, 30, 10,  0,  0, 10, 30, 20]
    ]
}

// for black just flip pst
var black_pst = {
    p: white_pst['p'].slice().reverse(),
    n: white_pst['n'].slice().reverse(),
    b: white_pst['b'].slice().reverse(),
    r: white_pst['r'].slice().reverse(),
    q: white_pst['q'].slice().reverse(),
    k: white_pst['k'].slice().reverse(),
}


// PST for endgame
var white_pst_end = {
    p: [
      [0,0,0,0,0,0,0,0],
      [50, 50, 50, 50, 50, 50, 50, 50],
      [10, 10, 20, 30, 30, 20, 10, 10],
      [5,  5, 10, 25, 25, 10,  5,  5],
      [0,  0,  0, 20, 20,  0,  0,  0],
      [5, -5,-10,  0,  0,-10, -5,  5],
      [5, 10, 10,-20,-20, 10, 10,  5],
      [0,0,0,0,0,0,0,0]
  ],
  n: [
      [-50,-40,-30,-30,-30,-30,-40,-50],
      [-40,-20,  0,  0,  0,  0,-20,-40],
      [-30,  0, 10, 15, 15, 10,  0,-30],
      [-30,  5, 15, 20, 20, 15,  5,-30],
      [-30,  0, 15, 20, 20, 15,  0,-30],
      [-30,  5, 10, 15, 15, 10,  5,-30],
      [-40,-20,  0,  5,  5,  0,-20,-40],
      [-50,-40,-30,-30,-30,-30,-40,-50]
  ],
  b: [
      [-20,-10,-10,-10,-10,-10,-10,-20],
      [-10,  0,  0,  0,  0,  0,  0,-10],
      [-10,  0,  5, 10, 10,  5,  0,-10],
      [-10,  5,  5, 10, 10,  5,  5,-10],
      [-10,  0, 10, 10, 10, 10,  0,-10],
      [-10, 10, 10, 10, 10, 10, 10,-10],
      [-10,  5,  0,  0,  0,  0,  5,-10],
      [-20,-10,-10,-10,-10,-10,-10,-20]
  ],
  r: [
      [0,  0,  0,  0,  0,  0,  0,  0],
      [5, 10, 10, 10, 10, 10, 10,  5],
      [-5,  0,  0,  0,  0,  0,  0, -5],
      [-5,  0,  0,  0,  0,  0,  0, -5],
      [-5,  0,  0,  0,  0,  0,  0, -5],
      [-5,  0,  0,  0,  0,  0,  0, -5],
      [-5,  0,  0,  0,  0,  0,  0, -5],
      [0,  0,  0,  5,  5,  0,  0,  0]
  ],
  q: [
      [-20,-10,-10, -5, -5,-10,-10,-20],
      [-10,  0,  0,  0,  0,  0,  0,-10],
      [-10,  0,  5,  5,  5,  5,  0,-10],
      [-5,  0,  5,  5,  5,  5,  0, -5],
      [0,  0,  5,  5,  5,  5,  0, -5],
      [-10,  5,  5,  5,  5,  5,  0,-10],
      [-10,  0,  5,  0,  0,  0,  0,-10],
      [-20,-10,-10, -5, -5,-10,-10,-20]
  ],
  k: [
      [-50,-40,-30,-20,-20,-30,-40,-50],
      [-30,-20,-10,  0,  0,-10,-20,-30],
      [-30,-10, 20, 30, 30, 20,-10,-30],
      [-30,-10, 30, 40, 40, 30,-10,-30],
      [-30,-10, 30, 40, 40, 30,-10,-30],
      [-30,-10, 20, 30, 30, 20,-10,-30],
      [-30,-30,  0,  0,  0,  0,-30,-30],
      [-50,-30,-30,-30,-30,-30,-30,-50]
  ]
}

// again for black just flip pst
var black_pst_end = {
    p: white_pst_end['p'].slice().reverse(),
    n: white_pst_end['n'].slice().reverse(),
    b: white_pst_end['b'].slice().reverse(),
    r: white_pst_end['r'].slice().reverse(),
    q: white_pst_end['q'].slice().reverse(),
    k: white_pst_end['k'].slice().reverse(),
}

var currPSTwht = white_pst;
var currPSTblk = black_pst;

function resetState() {
  game.reset()
  //clearInterval(comp);
  currPSTwht = white_pst;
  currPSTblk = black_pst;
  board.position(game.fen())
  updateStatus();
}

var alphabet = { 0: 'a', 1: 'b', 2: 'c', 3: 'd', 4: 'e', 5: 'f', 6: 'g', 7: 'h'}

function evaluatePosition() {
  var sum = 0

  for (var i = 0; i < 8; i++){
    for (var j = 1; j <= 8; j++){
        if (game.get(alphabet[i]+j.toString()) !== null) {
          var type = game.get(alphabet[i]+j.toString()).type
          var color = game.get(alphabet[i]+j.toString()).color
          if ( color === 'w') {
          var value = currPSTwht[type][8-j][i]+weights[type];
          sum += value;
          } else {
          var value = currPSTblk[type][8-j][i]+weights[type];
          sum -= value;
          }
        }
    }
  }

  if ( game.move.piece === 'k'){
    if (kingMoves > 2){
      currPSTwht = white_pst_end;
      currPSTblk = black_pst_end;
      weights[k] = 250;
    } else {
      currPSTwht = white_pst;
      currPSTblk = black_pst;
      kingMoves += 1;
      weights[k] = 50;
    }
  }

  if (game.turn() === 'w'){
    if( game.in_checkmate() ) {
      sum = -(10**14);
    } else if( game.in_check() ) {
      sum -= 80;
    }
  } else {
    if( game.in_checkmate() ) {
      sum = 10**14;
    } else if( game.in_check() ) {
      sum += 80;
    }
  }

  if (game.in_draw() || game.in_threefold_repetition() || game.in_stalemate())
  {
    sum = 0;
  }

  return sum;
}

function evaluatePositionNote(){
  var eval = evaluatePosition()
  if (eval <= -300){
    return "Black has advantage: " + eval.toFixed(2)
  } else if (eval >= 300){
    return "White has advantage: " + eval.toFixed(2)
  } else {
    return "Even standing: " + eval.toFixed(2)
  }
}

function minmax(depth, alpha, beta, isMaxing) {
    var nodes = game.moves()
    var maxVal = Number.NEGATIVE_INFINITY
    var minVal = Number.POSITIVE_INFINITY
    var bestMove;
    var tryMove;

    nodes = nodes.sort((a,b) => - Math.random());

    if (depth === 0 || nodes.length === 0) {
      return [null, evaluatePosition()];
    }

    for (var i = 0; i < nodes.length; i++) {
      tryMove = nodes[i];
      game.move(tryMove);
      var [nodeBestMove, nodeValue] = minmax(depth - 1, alpha, beta, !isMaxing);
      game.undo();

      if ( isMaxing ) {
        if ( nodeValue > maxVal) {
          maxVal = nodeValue;
          bestMove = tryMove;
        }
        if ( nodeValue > alpha ) {
          alpha = nodeValue;
        }
      } else {
        if ( nodeValue < minVal) {
          minVal = nodeValue;
          bestMove = tryMove;
        }
        if ( nodeValue < beta ) {
          beta = nodeValue;
        }
      }

      if (alpha >= beta) {
        break;
      }
    }
  
    if ( isMaxing ) {
      return [bestMove, maxVal];
    } else {
      return [bestMove, minVal];
    }
}

var best = null

function playBestMove() {
  board.position(game.fen())
  if ( game.turn() === 'w'){
    best = minmax(4, Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY, true)
  } else {
    best = minmax(4, Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY, false)
  }
  game.move(best[0])
  board.position(game.fen())
  updateStatus()
}

function removeGreySquares () {
    $('#board .square-55d63').css('background', '')
}

function greySquare (square) {
    var $square = $('#board .square-' + square)
  
    var background = whiteSquareGrey
    if ($square.hasClass('black-3c85d')) {
      background = blackSquareGrey
    }
  
    $square.css('background', background)
}

function onDragStart (source, piece, position, orientation) {
  // do not pick up pieces if the game is over
  if (game.game_over()) return false

  // only pick up pieces for the side to move
  if ((game.turn() === 'w' && piece.search(/^b/) !== -1) ||
      (game.turn() === 'b' && piece.search(/^w/) !== -1)) {
    return false
  }

}

function onDrop (source, target) {
    removeGreySquares()

  // see if the move is legal
  var move = game.move({
    from: source,
    to: target,
    promotion: promo 
  })

  // illegal move
  if (move === null) return 'snapback'

  window.setTimeout(playBestMove(), 250);

  updateStatus()
}

function onMouseoverSquare (square, piece) {
    // get list of possible moves for this square
    var moves = game.moves({
      square: square,
      verbose: true
    })
  
    // exit if there are no moves available for this square
    if (moves.length === 0) return
  
    // highlight the square they moused over
    greySquare(square)
  
    // highlight the possible squares for this piece
    for (var i = 0; i < moves.length; i++) {
      greySquare(moves[i].to)
    }
}

function onMouseoutSquare (square, piece) {
    removeGreySquares()
}

// update the board position after the piece snap
// for castling, en passant, pawn promotion
function onSnapEnd () {
  board.position(game.fen())
}

function updateStatus () {
  var status = ''

  var moveColor = 'White'
  if (game.turn() === 'b') {
    moveColor = 'Black'
  }

  // checkmate?
  if (game.in_checkmate()) {
    status = 'Game over, ' + moveColor + ' is in checkmate.'
  }

  // draw?
  else if (game.in_draw()) {
    status = 'Game over, drawn position'
  }

  // game still on
  else {
    status = moveColor + ' to move'

    // check?
    if (game.in_check()) {
      status += ', ' + moveColor + ' is in check'
    }
  }

  $status.html(status)
  $fen.html(game.fen())
  $pgn.html(game.pgn())
  $eval.html(evaluatePositionNote())
}

var config = {
  draggable: true,
  position: 'start',
  onDragStart: onDragStart,
  onDrop: onDrop,
  onMouseoutSquare: onMouseoutSquare,
  onMouseoverSquare: onMouseoverSquare,
  onSnapEnd: onSnapEnd
}
board = Chessboard('board', config)

updateStatus()

function compVsComp(){
  resetState();
  //var comp = 
  window.setInterval(playBestMove, 2000);
}

function asWhite(){
  resetState();
  board.orientation('white');
}

function asBlack(){
  resetState();
  board.orientation('black');
  window.setTimeout(playBestMove(), 250);
}