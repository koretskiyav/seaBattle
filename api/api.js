var express         = require('express');
var http            = require('http');
var bodyParser      = require('body-parser');
var routes          = require('./routes');
var config          = require('../src/config');
var log             = require('./libs/log')(module);
var Games           = require('./libs/mongoose').Games;
var utils           = require('./libs/utils');

var app = module.exports = express();
var server = new http.Server(app);

app.use(express.static(__dirname + '/../static'));
app.use(bodyParser.json());

utils.resetUsersStatuses(Games);

app.get('/users/:name', routes.getGameList);
app.post('/users/:name', routes.createNewGame);
app.post('/users/:name/game/:game', routes.chooseGame);
app.get('/game/:game/users/:name', routes.waitGame);
app.post('/users/:name/game/:game/place/:place', routes.putShip);
app.get('/users/:name/game/:game', routes.readyToFightClick);

app.listen(config.apiPort, function(){
    log.info('Express server listening on port ' + config.apiPort);
 });
