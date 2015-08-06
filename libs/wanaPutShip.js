var _  = require('lodash');

function isShip (field, point, difY, difX) {
    return  point.y + difY > -1 &&
            point.y + difY < 10 &&
            point.x + difX > -1 &&
            point.x + difX < 10 &&
            field[point.y + difY][point.x + difX] === 1
 }

function lookOneWay (field, point, wayY, wayX) {
    var count = 0;
    while (isShip(field, point, wayY * (count + 1), wayX * (count + 1))) count++;
    return count;
 }

function getCountOfHorShips(field, n) {
    return field.map(function(elem) {
        return elem.join('');
    }).join('0').split('0').filter(function(ship) {
        return ship.length === n;
    }).length;
 }

function getCountOfVerShips(field, n) {
    var arr = [];
    for (var i = 0; i < 10; i++) {
        arr.push(field.map(function(elem) {
            return elem[i];
        }).join(''));
    };

    return arr.join('0').split('0').filter(function(ship) {
        return ship.length === n;
    }).length;
 }

function getCountOfSingleShips(field) {
    var count = 0;
    for (var i = 0; i < 10; i++) {
        for (var j = 0; j < 10; j++) {
            if ( isShip(field, {y: i, x: j},  0,  0) &&
                !isShip(field, {y: i, x: j},  0,  1) &&
                !isShip(field, {y: i, x: j},  0, -1) &&
                !isShip(field, {y: i, x: j},  1,  0) &&
                !isShip(field, {y: i, x: j}, -1,  0)) {
                count++;
            }
        }
    }
    return count;
 }

function wanaPutShip(field, point) {

    var readyField = {
        1: 4,
        2: 3,
        3: 2,
        4: 1
    }

    if (!isShip(field, point, 0, 0) &&
       (isShip(field, point, -1, -1) ||
        isShip(field, point,  1, -1) ||
        isShip(field, point, -1,  1) ||
        isShip(field, point,  1,  1))
    ) {
        return 'bad idea (crooked sihp or contact angles)'
    }

    if (!isShip(field, point, 0, 0) &&
        lookOneWay(field, point,  0,  1) +
        lookOneWay(field, point,  0, -1) +
        lookOneWay(field, point,  1,  0) +
        lookOneWay(field, point, -1,  0) > 3
    ) {
        return 'too powerful ship'
    }

    field[point.y][point.x] = isShip(field, point, 0, 0) ? 0 : 1;

    var curentField = {
        1: getCountOfSingleShips(field),
        2: getCountOfHorShips(field, 2) + getCountOfVerShips(field, 2),
        3: getCountOfHorShips(field, 3) + getCountOfVerShips(field, 3),
        4: getCountOfHorShips(field, 4) + getCountOfVerShips(field, 4)
    };

    if (_.isEqual(curentField, readyField))
    {
        return 'ready';
    }

    for (var i = 1; i < 5; i++) {
        if (curentField[i] > readyField[i])
        {
            return 'too match ' + i + '-deck ships'
        }
    };

    for (var i = 1; i < 5; i++) {
        if (curentField[i] < readyField[i])
        {
            return 'need more ' + i + '-deck ships'
        }
    };

    return 'WTF???'
 };

module.exports = wanaPutShip;