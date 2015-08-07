var _                   = require('lodash');
var log                 = require('../libs/log')(module);
var Games               = require('../libs/mongoose').Games;
var getGameForClienr    = require('../libs/getGameForClienr');
var utils               = require('../libs/utils');

function readyToFightClick(req, res) {
   var name = req.params.name;
   return Games.findById(req.params.game, function (err, game) {
        if(!game) {
            res.statusCode = 404;
            return res.send({ error: 'Not found' });
        }

        var me = utils.getMe(game, name);
        var enemy = utils.getEnemy(game, name);

        game.curMove = Math.floor(Math.random()*2);

        if (!enemy.status) {
            me.status = 'ready'
        } else {
            game.status = 'fight';
            enemy.status = null;
            game.users[game.curMove].err = 'you go first';
            game.users[1 - game.curMove].err = 'enemy go first';
        }

        game.markModified('users');

        game.save(function(err) {
            if (!err) {
                log.info("game updated");
                if (game.status === 'fight') log.info("fight started!");
                return res.send({ status: 'OK', game: getGameForClienr(game, name)});
            } else {
                res.statusCode = 500;
                res.send({ error: 'Server error' });
                log.error('Internal error(%d): %s',res.statusCode,err.message);
            }
        });
    });
 }

module.exports = readyToFightClick;