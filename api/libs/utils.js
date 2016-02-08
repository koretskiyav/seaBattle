var _                   = require('lodash');
var Games               = require('./mongoose').Games;
var log                 = require('./log')(module);

function resetUsersStatuses() {
    Games.find(null,
        function (err, Games) {
            if (!err) {
                _.map(Games, function(game) {
                    _.map(game.users, function(user) {
                        user.status = null;
                    });
                    game.markModified('users');
                    game.save();
                });
            }
        }
     );
 }

function getMe(game, name) {
    return _.find(game.users, {'name': name});
 }

function getEnemy(game, name) {
    return _.find(game.users, function(user) {
        return user.name !== name;
    });
 }

function getEmpty(game, name) {
    return _.find(game.users, {'name': null});
 }

function getClearField() {
    var cells = [];
    for (var i = 0; i < 10; i++) {
        cells.push([]);
        for (var j = 0; j < 10; j++) {
            cells[i].push(0);
        };
    };
    return cells;
 }

function getPoint(place) {
    return {
        x : place % 10,
        y : (place - place % 10) / 10
    };
 }

function getMovesField(moves) {
    var cells = [];
    for (var i = 0; i < 10; i++) {
        cells.push([]);
        for (var j = 0; j < 10; j++) {
            cells[i].push(
                moves.indexOf('' + (i * 10 + j)) === -1 ? 0 : 1
            );
        };
    };
    return cells;
 }

module.exports = {
    getMe               : getMe,
    resetUsersStatuses  : resetUsersStatuses,
    getEnemy            : getEnemy,
    getEmpty            : getEmpty,
    getClearField       : getClearField,
    getPoint            : getPoint,
    getMovesField       : getMovesField
}