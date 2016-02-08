var Games               = require('../libs/mongoose').Games;
var getGameForClienr    = require('../libs/getGameForClienr');

function waitGame(req, res) {
   var name = req.params.name;
   return Games.findById(req.params.game, function (err, game) {
        if(!game) {
            res.statusCode = 404;
            return res.send({ error: 'Not found' });
        }

        return res.send({ status: 'OK', game: getGameForClienr(game, name)});
    });
 }

module.exports = waitGame;