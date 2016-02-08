var mongoose    = require('mongoose');
var config      = require('../../src/config');
var log         = require('./log')(module);

mongoose.connect(config.mongoose.uri);

var db = mongoose.connection;

db.on('error', function (err) {
    log.error('connection error:', err.message);
});
db.once('open', function callback () {
    log.info("Connected to DB!");
});

var Schema = mongoose.Schema;

var gameSchema = new Schema({
    status: String,
    curMove: Number,
    users: [{
        name: String,
        status: String,
        field: [Schema.Types.Mixed],
        moves: [String],
        err: String
    }]
});

var Games = mongoose.model('Games', gameSchema);

module.exports.Games = Games;
