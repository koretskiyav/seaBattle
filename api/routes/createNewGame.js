var _                   = require('lodash');
var log                 = require('../libs/log')(module);
var Games               = require('../libs/mongoose').Games;
var getGameForClienr    = require('../libs/getGameForClienr');
var utils               = require('../libs/utils');

function createNewGame(req, res) {

    var name = req.params.name;

    var game = new Games({
        status: null,
        users: [
        {
            name: name,
            status: 'ready',
            field: _.clone(utils.getClearField()),
            moves: [],
            err: null
        },{
            name: null,
            status: null,
            field: _.clone(utils.getClearField()),
            moves: [],
            err: null
        }]
    });

    game.markModified('users');

    game.save(function(err) {
           if (!err) {
            log.info("game created");
            return res.send({ status: 'OK', game: getGameForClienr(game, name)});
        } else {
            res.statusCode = 500;
            res.send({ error: 'Server error' });
        }
        log.error('Internal error(%d): %s',res.statusCode,err.message);
    })
 }

module.exports = createNewGame;
