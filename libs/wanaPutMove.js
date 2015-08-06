var utils = require('./utils');

function wanaPutMove(moves, enemyField, place) {

    var myMoves     = utils.getMovesField(moves);
    var movePoint   = utils.getPoint(place);
    var killedCelss = 0;

    if (myMoves[movePoint.y][movePoint.x] === 1) {
        return 'you are already made move here';
    }

    moves.push(place);

    if (enemyField[movePoint.y][movePoint.x] === 1) {
        return 'GJ bro! You have another move';
    }

    myMoves = utils.getMovesField(moves);

    for (var i = 0; i < 10; i++) {
        for (var j = 0; j < 10; j++) {
            killedCelss += myMoves[i][j] * enemyField[i][j];
        }
    }

    if (killedCelss === 20) {
        return 'YOU WIN';
    }

    return 'you missed :('
 }

 module.exports = wanaPutMove;