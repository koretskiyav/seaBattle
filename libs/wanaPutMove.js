var utils = require('./utils');

function wanaPutMove(moves, enemyField, place) {

    if (moves.indexOf(place) !== -1) {
        return 'you are already made move here';
    }

    moves.push(place);

    var killedCelss = 0;
    var myMoves     = utils.getMovesField(moves);
    var movePoint   = utils.getPoint(place);

    for (var i = 0; i < 10; i++) {
        for (var j = 0; j < 10; j++) {
            killedCelss += myMoves[i][j] * enemyField[i][j];
        }
    }

    if (killedCelss === 20) {
        return 'YOU WIN';
    }

    if (enemyField[movePoint.y][movePoint.x] === 1) {
        return 'GJ bro! You have another move';
    }

    return 'you missed :('
 }

 module.exports = wanaPutMove;