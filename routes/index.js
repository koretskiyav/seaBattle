var express         = require('express');
var path            = require('path'); // модуль для парсинга пути
var _               = require('lodash');
var config          = require('../libs/config');
var log             = require('../libs/log')(module);
var Games           = require('../libs/mongoose').Games;

var wanaPutShip         = require('../libs/wanaPutShip');
var wanaPutMove         = require('../libs/wanaPutMove');
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

module.exports = {
    getGameList         : getGameList,
    createNewGame       : createNewGame,
    chooseGame          : chooseGame,
    waitGame            : waitGame,
    putShip             : putShip,
    readyToFightClick   : readyToFightClick
};