var _                   = require('lodash');
var log                 = require('../libs/log')(module);
var Games               = require('../libs/mongoose').Games;
var getGameForClienr    = require('../libs/getGameForClienr');
var utils               = require('../libs/utils');

function getGameList(req, res) {
   // Games.remove(null,
   //   function (err, Games) {
   //     return res.send({ status: 'OK', games: Games});
   //   }
   //  );
    var name = req.params.name;
    return Games.find(null,
    function (err, Games) {
        if (!err) {
           var games = _.compact(Games.map(function(game) {
                return utils.getMe(game, name) || utils.getEmpty(game,name) ? getGameForClienr(game, name) : null;
            }));
            return res.send({ status: 'OK', games: games});
        } else {
            res.statusCode = 500;
            log.error('Internal error(%d): %s',res.statusCode,err.message);
            return res.send({ error: 'Server error' });
        }
    });
 }

module.exports = getGameList;