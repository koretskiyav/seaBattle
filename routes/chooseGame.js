var log                 = require('../libs/log')(module);
var Games               = require('../libs/mongoose').Games;
var getGameForClienr    = require('../libs/getGameForClienr');
var utils               = require('../libs/utils');

 function chooseGame(req, res) {
   var name = req.params.name;
   return Games.findById(req.params.game, function (err, game) {
        if(!game) {
            res.statusCode = 404;
            return res.send({ error: 'Not found' });
        }

        if(!utils.getMe(game, name) && utils.getEmpty(game, name)) utils.getEmpty(game, name).name = name;

        var me = utils.getMe(game, name);
        var enemy = utils.getEnemy(game, name);

        if (enemy.status === 'ready') {
            enemy.status = null;
            game.status === null ? game.status = 'placement'
                :
                game.status === 'placement' &&
                me.err && me.err === 'ready' &&
                enemy.err && enemy.err === 'ready' ? game.status = 'fight'
                    :
                    null;
        } else {
            me.status = 'ready'
        }

        game.markModified('users');
        game.save(function(err) {
            if (!err) {
                log.info("game updated");
                if (game.status === 'placement') log.info("game started!");
                return res.send({ status: 'OK', game: getGameForClienr(game, name)});
            } else {
                res.statusCode = 500;
                res.send({ error: 'Server error' });
                log.error('Internal error(%d): %s',res.statusCode,err.message);
            }
        });
    });
 }

module.exports = chooseGame;
