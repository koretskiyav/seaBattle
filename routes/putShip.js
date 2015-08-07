var _                   = require('lodash');
var log                 = require('../libs/log')(module);
var Games               = require('../libs/mongoose').Games;
var getGameForClienr    = require('../libs/getGameForClienr');
var utils               = require('../libs/utils');
var wanaPutShip         = require('../libs/wanaPutShip');
var wanaPutMove         = require('../libs/wanaPutMove');

function putShip(req, res) {
   var name = req.params.name;
   var place = req.params.place;
   return Games.findById(req.params.game, function (err, game) {
        if(!game) {
            res.statusCode = 404;
            return res.send({ error: 'Not found' });
        }

        var me = utils.getMe(game, name);
        var enemy = utils.getEnemy(game, name);

        if (game.status === 'placement') me.err = wanaPutShip(me.field, utils.getPoint(place));

        if (game.status === 'fight') {
            if (me !== game.users[game.curMove])
            {
                me.err = 'Wait for your move!'
            } else if (me.err !== 'YOU WIN' && me.err !== 'YOU LOSE')
            {
                me.err = wanaPutMove(me.moves, enemy.field, place);
            }
        }

        if (me.err === 'you missed :(') {
            game.curMove = 1 - game.curMove;
            enemy.err = 'Time to move!';
        }

        if (me.err === 'YOU WIN') enemy.err = 'YOU LOSE';

        game.markModified('users');

        game.save(function(err) {
            if (!err) {
                return res.send({ status: 'OK', game: getGameForClienr(game, name)});
            } else {
                res.statusCode = 500;
                res.send({ error: 'Server error' });
                log.error('Internal error(%d): %s',res.statusCode,err.message);
            }
        });
    });
 }

module.exports = putShip;