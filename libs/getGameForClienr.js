var utils = require('./utils');
var _     = require('lodash');


function isCell(field, point, difY, difX) {
    return  point.y + difY > -1 &&
            point.y + difY < 10 &&
            point.x + difX > -1 &&
            point.x + difX < 10 &&
            field[point.y + difY][point.x + difX] === 1
 }

function isMiss(shipsField, movesField, point, difY, difX) {
    return !isCell(shipsField, point, difY, difX) &&
           isCell(movesField, point, difY, difX);
 }

function isSurvivor(shipsField, movesField, point, difY, difX) {
    return isCell(shipsField, point, difY, difX) &&
           !isCell(movesField, point, difY, difX);
 }

function isWound(shipsField, movesField, point, difY, difX) {
    return isCell(shipsField, point, difY, difX) &&
           isCell(movesField, point, difY, difX);
 }

function isKilledOneWay (shipsField, movesField, point, difY, difX, wayY, wayX) {

    var dY = wayY;
    var dX = wayX;

    while (isCell(shipsField, point, dY + difY, dX + difX)) {
        if (isSurvivor(shipsField, movesField, point, dY + difY, dX + difX)) {
            return false;
        }
        dY += wayY;
        dX += wayX;
    }
    return true;
 }

function isKilled(shipsField, movesField, point, difY, difX) {
    return  isWound(shipsField, movesField, point, difY, difX) &&
            isKilledOneWay (shipsField, movesField, point, difY, difX,  0,  1) &&
            isKilledOneWay (shipsField, movesField, point, difY, difX,  0, -1) &&
            isKilledOneWay (shipsField, movesField, point, difY, difX,  1,  0) &&
            isKilledOneWay (shipsField, movesField, point, difY, difX, -1,  0)
}

function canNotBeShip(shipsField, movesField, point) {
    return  isWound( shipsField, movesField, point,  1,  1) ||
            isWound( shipsField, movesField, point,  1, -1) ||
            isWound( shipsField, movesField, point, -1,  1) ||
            isWound( shipsField, movesField, point, -1, -1) ||
            isKilled(shipsField, movesField, point,  0,  1) ||
            isKilled(shipsField, movesField, point,  0, -1) ||
            isKilled(shipsField, movesField, point,  1,  0) ||
            isKilled(shipsField, movesField, point, -1,  0)
}

function getGameForClienr(game, name) {

    var me    = utils.getMe(    game, name);
    var enemy = utils.getEnemy( game, name);

    var myMovesField    = utils.getMovesField(me    ? me.moves    : []);
    var enemyMovesField = utils.getMovesField(enemy ? enemy.moves : []);

    var myShipsField    = me    ? me.field    : _.clone(utils.getClearField());
    var enemyShipsField = enemy ? enemy.field : _.clone(utils.getClearField());

    var myField     = [];
    var enemyField  = [];

    var curMove     = game.users[game.curMove] === me ? 'me' : 'enemy';

    var clientStatusGame = me && me.status === 'ready' ? 'wait2nd' : game.status;

    for (var i = 0; i < 10; i++) {
        for (var j = 0; j < 10; j++) {

            var point = {y: i, x: j};
            var curCell = 'void';

            if (canNotBeShip(   myShipsField, enemyMovesField, point))       curCell = 'noShip';
            if (isSurvivor(     myShipsField, enemyMovesField, point, 0, 0)) curCell = 'ship';
            if (isMiss(         myShipsField, enemyMovesField, point, 0, 0)) curCell = 'miss';
            if (isWound(        myShipsField, enemyMovesField, point, 0, 0)) curCell = 'wound';
            if (isKilled(       myShipsField, enemyMovesField, point, 0, 0)) curCell = 'killed';

            myField.push(curCell);

            curCell = 'void';

            if (canNotBeShip(   enemyShipsField, myMovesField, point))       curCell = 'noShip';
            if (isMiss(         enemyShipsField, myMovesField, point, 0, 0)) curCell = 'miss';
            if (isWound(        enemyShipsField, myMovesField, point, 0, 0)) curCell = 'wound';
            if (isKilled(       enemyShipsField, myMovesField, point, 0, 0)) curCell = 'killed';

            enemyField.push(curCell);
        }
    }

    return {
        id              :         game._id,
        status          :         clientStatusGame,
        myName          : me    ? me.name           : null,
        enemyName       : enemy ? enemy.name        : null,
        myStatus        : me    ? me.status         : null,
        enemyStatus     : enemy ? enemy.status      : null,
        myErr           : me    ? me.err            : null,
        myField         :         myField,
        enemyField      :         enemyField,
        curMove         : curMove
    };
 }

module.exports = getGameForClienr;