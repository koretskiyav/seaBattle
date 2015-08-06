var express         = require('express');
var routes          = require('./routes');
var config          = require('./libs/config');
var log             = require('./libs/log')(module);
var Games           = require('./libs/mongoose').Games;
var utils           = require('./libs/utils');

var app = module.exports = express.createServer();

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

utils.resetUsersStatuses(Games);

app.get('/users/:name', routes.getGameList);
app.post('/users/:name', routes.createNewGame);
app.post('/users/:name/game/:game', routes.chooseGame);
app.get('/game/:game/users/:name', routes.waitGame);
app.post('/users/:name/game/:game/place/:place', routes.putShip);
app.get('/users/:name/game/:game', routes.readyToFightClick);

app.listen(config.get('port'), function(){
    log.info('Express server listening on port ' + config.get('port'));
 });