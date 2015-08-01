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

    if (me && me.status) {
        clientStatusGame = 'wait2nd';
    } else {
        clientStatusGame = game.status;
    }

    for (var i = 0; i < 100; i++) {

        myShip    = me    ? me.ships.indexOf(i.toString())    : null;
        enemyShip = enemy ? enemy.ships.indexOf(i.toString()) : null;
        myMove    = me    ? me.moves.indexOf(i.toString())    : null;
        enemyMove = enemy ? enemy.moves.indexOf(i.toString()) : null;

        if (me) myField.push(
                myShip !== -1 ?
                    enemyMove !== -1 ? 'wound' : 'ship'
                :
                    enemyMove !== -1 ? 'miss' : 'void'
                );
        if (enemy) enemyField.push(
                myMove !== -1 ?
                    enemyShip !== -1 ? 'wound' : 'miss'
                : 'void'
            );
    };

    return {
        id              :         game._id,
        status          :         clientStatusGame,
        myName          : me    ? me.name           : null,
        enemyName       : enemy ? enemy.name        : null,
        myStatus        : me    ? me.status         : null,
        enemyStatus     : enemy ? enemy.status      : null,
        myErr           : me    ? me.err            : null,
        myField         :         myField,
        enemyField      :         enemyField
    };
 }

function wanaPutShip(ships, place) {

    var v = place % 10;
    var h = (place - v) / 10;
    var oldShips = _.clone(ships);

    function isShip(ships, h, v) {
        return ships.indexOf((+('' + h + v)).toString()) !== -1
     }

    if (!isShip(ships, h, v) &&
        !isShip(ships, h - 1, v - 1) &&
        !isShip(ships, h + 1, v - 1) &&
        !isShip(ships, h - 1, v + 1) &&
        !isShip(ships, h + 1, v + 1)) {
        ships.push(place);
    } else if (isShip(ships, h, v)) {
        ships = _.without(ships, place);
    }

    function shipsAarr(ships) {

        var v = '';
        var h = '';

        for (var i = 0; i < 10; i++) {
            v = v + '|_';
            h = h + '|_';
            for (var j = 0; j < 10; j++) {
                if (isShip(ships, j, i)) {
                    v = v + 'X';
                } else {
                    v = v + '_';
                }

                if (isShip(ships, i, j)) {
                    h = h + 'X';
                } else {
                    h = h + '_';
                }
            }
            v = v + '_|';
            h = h + '_|';
        }


        var target;
        var pos;
        var ver = {total: 0};
        var hor = {total: 0};

        for (var i = 1; i < 6; i++) {
            target = '_' + _.repeat('X', i) + '_';
            pos = -1;
            while ((pos = v.indexOf(target, pos + 1)) != -1) {
                ver[i] ? ver[i]++ : ver[i] = 1;
                if (i > 1) ver.total += i;
            }
        };

        for (var i = 1; i < 6; i++) {
            target = '_' + _.repeat('X', i) + '_';
            pos = -1;
            while ((pos = h.indexOf(target, pos + 1)) != -1) {
                hor[i] ? hor[i]++ : hor[i] = 1;
                if (i > 1) hor.total += i;
            }
        };

        ver[1] ? ver[1] -= hor.total : null;

        var shipsAsObj = {};

        for (var i = 1; i < 6; i++) {
                shipsAsObj[i] = ver[i] || 0;
            if (i !== 1) {
                shipsAsObj[i] += hor[i] || 0;
            }
        };
        return shipsAsObj;
     }

    if (shipsAarr(ships)[5] > 0 || _.isEqual(ships, oldShips)) {
        return {ships: oldShips, shipsAarr: _.omit(shipsAarr(oldShips), '5'), status: 'err'};
    } else if (
        shipsAarr(ships)[1] === 4 &&
        shipsAarr(ships)[2] === 3 &&
        shipsAarr(ships)[3] === 2 &&
        shipsAarr(ships)[4] === 1) {
        return {ships: ships, shipsAarr: _.omit(shipsAarr(ships), '5'), status: 'ready'};
    } else if (
        shipsAarr(ships)[1] > 4 ||
        shipsAarr(ships)[2] > 3 ||
        shipsAarr(ships)[3] > 2 ||
        shipsAarr(ships)[4] > 1) {
        return {ships: ships, shipsAarr: _.omit(shipsAarr(ships), '5'), status: 'warn'};
    } else {
        return {ships: ships, shipsAarr: _.omit(shipsAarr(ships), '5'), status: 'OK'};
    }
 };

function wanaPutMove(moves, ships, place) {
    if (moves.indexOf(place) === -1) {
        moves.push(place);
        if (ships.indexOf(place) === -1) {
            return {moves: moves, move: 'miss'};
        } else {
            return {moves: moves, move: 'wound'};
        }
    }
 }
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
            enemy.status = null;
            !game.status ? game.status = 'placement'
                :
                game.status === 'placement' ? game.status = 'fight'
                    :
                    null;
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
        var putShip;
        var putMove;

        if (game.status === 'placement') {
            putShip = wanaPutShip(_.clone(me.ships), place);
            me.ships = putShip.ships;
            me.err = _.omit(putShip, 'ships');
        }

        if (game.status === 'fight') {
            if (me === game.users[game.curMove]) {
                putMove = wanaPutMove(me.moves, enemy.ships, place);
                me.moves = putMove.moves;
                if (putMove.move === 'miss') {
                    game.curMove = 1 - game.curMove;
                    me.err = {status: 'enemyMove'};
                    enemy.err = {status: 'myMove'};
                }
            }
        }

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

        game.curMove = Math.floor(Math.random()*2);

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

