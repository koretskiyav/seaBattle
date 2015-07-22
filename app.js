var express         = require('express');
var path            = require('path'); // модуль для парсинга пути
var routes          = require('./routes');
var config          = require('./libs/config');
var log             = require('./libs/log')(module);

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  // app.set('views', __dirname + '/views');
  // app.set('view engine', 'jade');
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

// Routes

// app.get('/', routes.index);

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

app.get('/gameID', function(req, res) {
    res.send('This is not implemented now');
});

app.post('/gameID', function(req, res) {
    res.send('This is not implemented now');
});

app.put('/gameID', function (req, res){
    res.send('This is not implemented now');
});

app.delete('/gameID', function (req, res){
    res.send('This is not implemented now');
});

app.listen(config.get('port'), function(){
    log.info('Express server listening on port ' + config.get('port'));
});
