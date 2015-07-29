var express         = require('express');
var path            = require('path'); // модуль для парсинга пути
var _               = require('lodash');
var routes          = require('./routes');
var config          = require('./libs/config');
var log             = require('./libs/log')(module);
var Games           = require('./libs/mongoose').Games;

var app = module.exports = express.createServer();
var flag;

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

app.get('/users/:name', function(req, res) {
   // Games.remove(null,
   //   function (err, Games) {
   //     return res.send({ status: 'OK', games: Games});
   //   }
   //  );
   return Games.find(null,
    function (err, Games) {
        if (!err) {

            _.map(Games, function(game) {
              if (!flag) {
                _.map(game.users, function(user) {
                    user.status = null;
                });
              };
              game.save();
            });

            flag = 1;

            var name = req.params.name;
            var games = _.compact(Games.map(function(game) {
              if (!game.users[1].name || game.users[0].name === name || game.users[1].name === name) {
                var users = _.map(game.users, function(user) {
                    return {name: user.name, status: user.status};
                });
                return {id: game._id, status: game.status, users: users};
              }
            }));
            return res.send({ status: 'OK', games: games});
        } else {
            res.statusCode = 500;
            log.error('Internal error(%d): %s',res.statusCode,err.message);
            return res.send({ error: 'Server error' });
        }
    });
 });

app.post('/users/:name', function(req, res) {

    var game = new Games({
        status: null,
        users: [
        {
            name: req.params.name,
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
            var users = _.map(game.users, function(user) {
                return {name: user.name, status: user.status};
            });
            return res.send({ status: 'OK', game: {id: game._id, status: game.status, users: users}});
        } else {
            res.statusCode = 500;
            res.send({ error: 'Server error' });
        }
        log.error('Internal error(%d): %s',res.statusCode,err.message);
    })
 });

app.post('/users/:name/game/:game', function(req, res) {
   var name = req.params.name;
   return Games.findById(req.params.game, function (err, game) {
        if(!game) {
            res.statusCode = 404;
            return res.send({ error: 'Not found' });
        }

        var myUser;

        if (!game.users[0].name || game.users[0].name === name) {
            game.users[0].name = name;
            myUser = game.users[0];
        } else if (!game.users[1].name || game.users[1].name === name) {
            game.users[1].name = name;
            myUser = game.users[1];
        } else {
            res.statusCode = 404;
            return res.send({ error: 'Not found' });
        }

        myUser.status = 'ready'

        if (game.users[0].status === 'ready' && game.users[1].status === 'ready') {
            game.status = game.status || 'placement'
        }

        var users = _.map(game.users, function(user) {
                return {name: user.name, status: user.status};
        });

        game.save(function(err) {
            if (!err) {
                log.info("game updated");
                if (game.status === 'placement') log.info("game started!");
                return res.send({ status: 'OK', game: {id: game._id, status: game.status, users: users}});
            } else {
                res.statusCode = 500;
                res.send({ error: 'Server error' });
                log.error('Internal error(%d): %s',res.statusCode,err.message);
            }
        });
    });
 });

app.get('/game/:game', function(req, res) {
   return Games.findById(req.params.game, function (err, game) {
        if(!game) {
            res.statusCode = 404;
            return res.send({ error: 'Not found' });
        }

        var users = _.map(game.users, function(user) {
                return {name: user.name, status: user.status};
        });

        return res.send({ status: 'OK', game: {id: game._id, status: game.status, users: users}});
    });
 });

app.post('/users/:name/game/:game/place/:place', function(req, res) {
   return Games.findById(req.params.game, function (err, game) {
        if(!game) {
            res.statusCode = 404;
            return res.send({ error: 'Not found' });
        }

        var curPlayer = _.find(game.users, {'name': req.params.name});

        var place = _.find(curPlayer.ships, {'id': req.params.place});

        if (game.status === 'placement') {
            if (game.users[0].status === 'ready' && game.users[1].status === 'ready') {
                game.users[0].status = null;
                game.users[1].status = null;
            }

            if (place) {
                curPlayer.ships = _.without(curPlayer.ships, place);
            } else {
                curPlayer.ships.push({id: req.params.place, status: 'ship'});
            }
        }

   /*     if (game.status === 'fight') {
            if (game.users[0].status === 'ready' && game.users[1].status === 'ready') {
                game.users[0].status = null;
                game.users[1].status = null;
            }

            if (place) {
                curPlayer.ships = _.without(curPlayer.ships, place);
            } else {
                curPlayer.ships.push({id: req.params.place, status: 'ship'});
            }
        }
*/

        game.save(function(err) {
            if (!err) {
                log.info("ships updated");
                return res.send({ status: 'OK', myShips: curPlayer.ships});
            } else {
                res.statusCode = 500;
                res.send({ error: 'Server error' });
                log.error('Internal error(%d): %s',res.statusCode,err.message);
            }
        });
    });
 });

app.get('/users/:name/game/:game', function(req, res) {
   return Games.findById(req.params.game, function (err, game) {
        if(!game) {
            res.statusCode = 404;
            return res.send({ error: 'Not found' });
        }

        console.log(game.users[0].status, game.users[1].status);

        var curPlayer = _.find(game.users, {'name': req.params.name});

        curPlayer.status = 'ready';

        console.log(game.users[0].status, game.users[1].status);

        if (game.users[0].status === 'ready' && game.users[1].status === 'ready') {
            if (game.status === 'placement') {
                game.status = 'fight';
            }
        }

        var users = _.map(game.users, function(user) {
                return {name: user.name, status: user.status};
        });

        game.save(function(err) {
            if (!err) {
                log.info("game updated");
                if (game.status === 'fight') log.info("fight started!");
                return res.send({ status: 'OK', game: {id: game._id, status: game.status, users: users}});
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