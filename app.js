var express         = require('express');
var path            = require('path'); // модуль для парсинга пути
var _               = require('lodash');
var routes          = require('./routes');
var config          = require('./libs/config');
var log             = require('./libs/log')(module);
var Games           = require('./libs/mongoose').Games;

var app = module.exports = express.createServer();

Games.find(null,
    function (err, Games) {
        if (!err) {
            _.map(Games, function(game) {
                _.map(game.users, function(user) {
                    user.status = null;
                });
              game.save();
            });
        }
    }
 );

app.configure(function(){
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/client'));
 });

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
 });

app.configure('production', function(){
  app.use(express.errorHandler());
 });

app.use(function(req, res, next){
    res.status(404);
    log.debug('Not found URL: %s',req.url);
    res.send({ error: 'Not found' });
    return;
 });

app.use(function(err, req, res, next){
    res.status(err.status || 500);
    log.error('Internal error(%d): %s',res.statusCode,err.message);
    res.send({ error: err.message });
    return;
 });

function getMe(game, name) {
    return _.find(game.users, {'name': name});
 };

function getEnemy(game, name) {
    return _.find(game.users, function(user) {
        return user.name !== name;
    });
 };

function getEmpty(game, name) {
    return _.find(game.users, {'name': null});
 };

function getGameForClienr(game, name) {

    var me          = getMe(    game, name);
    var enemy       = getEnemy( game, name);
    var myField     = [];
    var enemyField  = [];
    var myShip;
    var enemyShip;
    var clientStatusGame;

    if (game.status !== 'fight' && (me && me.status || enemy && enemy.status)) {
        clientStatusGame = 'wait2nd';
    } else {
        clientStatusGame = game.status;
    }

    for (var i = 0; i < 100; i++) {

        myShip    = me    ? me.ships.indexOf(i.toString())    : null;
        enemyShip = enemy ? enemy.ships.indexOf(i.toString()) : null;

        if (me)    myField.push(    myShip    !== -1 ? 'ship' : 'void');
        if (enemy) enemyField.push( enemyShip !== -1 ? 'ship' : 'void');
    };

    return {
        id              :         game._id,
        status          :         clientStatusGame,
        myName          : me    ? me.name           : null,
        enemyName       : enemy ? enemy.name        : null,
        myStatus        : me    ? me.status         : null,
        enemyStatus     : enemy ? enemy.status      : null,
        myField         :         myField,
        enemyField      :         enemyField
    };
 };

// getGameList
app.get('/users/:name', function(req, res) {
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
                return getMe(game, name) || getEmpty(game,name) ? getGameForClienr(game, name) : null;
            }));
            return res.send({ status: 'OK', games: games});
        } else {
            res.statusCode = 500;
            log.error('Internal error(%d): %s',res.statusCode,err.message);
            return res.send({ error: 'Server error' });
        }
    });
 });
// createNewGame
app.post('/users/:name', function(req, res) {

    var name = req.params.name;

    var game = new Games({
        status: null,
        users: [
        {
            name: name,
            status: null,
            ships: [],
            moves: []
        },{
            name: null,
            status: null,
            ships: [],
            moves: []
        }]
    });

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
 });
// chooseGame
app.post('/users/:name/game/:game', function(req, res) {
   var name = req.params.name;
   return Games.findById(req.params.game, function (err, game) {
        if(!game) {
            res.statusCode = 404;
            return res.send({ error: 'Not found' });
        }

        if(!getMe(game, name) && getEmpty(game, name)) getEmpty(game, name).name = name;

        var me = getMe(game, name);
        var enemy = getEnemy(game, name);

        if (!enemy.status) {
            me.status = 'ready'
        } else {
            game.status = game.status || 'placement';
            enemy.status = null;
        }

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
 });
// waitGame
app.get('/game/:game/users/:name', function(req, res) {
   var name = req.params.name;
   return Games.findById(req.params.game, function (err, game) {
        if(!game) {
            res.statusCode = 404;
            return res.send({ error: 'Not found' });
        }
        return res.send({ status: 'OK', game: getGameForClienr(game, name)});
    });
 });
// putShip
app.post('/users/:name/game/:game/place/:place', function(req, res) {
   var name = req.params.name;
   var place = req.params.place;
   return Games.findById(req.params.game, function (err, game) {
        if(!game) {
            res.statusCode = 404;
            return res.send({ error: 'Not found' });
        }

        var me = getMe(game, name);
        var enemy = getEnemy(game, name);

        if (game.status === 'placement') {
            if (me.ships.indexOf(place) !== -1) {
                me.ships = _.without(me.ships, place);
            } else {
                me.ships.push(place);
            }
        }

        if (game.status === 'fight') {
            if (me.moves.indexOf(place) === -1) {
                me.moves.push(place);
            }
        }

        game.save(function(err) {
            if (!err) {
                log.info("ships updated");
                return res.send({ status: 'OK', game: getGameForClienr(game, name), moves: me.moves});
            } else {
                res.statusCode = 500;
                res.send({ error: 'Server error' });
                log.error('Internal error(%d): %s',res.statusCode,err.message);
            }
        });
    });
 });
// readyToFightClick
app.get('/users/:name/game/:game', function(req, res) {
   var name = req.params.name;
   return Games.findById(req.params.game, function (err, game) {
        if(!game) {
            res.statusCode = 404;
            return res.send({ error: 'Not found' });
        }

        var me = getMe(game, name);
        var enemy = getEnemy(game, name);

        if (!enemy.status) {
            me.status = 'ready'
        } else {
            game.status = 'fight';
            enemy.status = null;
        }

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
 });

app.listen(config.get('port'), function(){
    log.info('Express server listening on port ' + config.get('port'));
 });