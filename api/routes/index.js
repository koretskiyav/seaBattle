var getGameList         = require('./getGameList');
var createNewGame       = require('./createNewGame');
var chooseGame          = require('./chooseGame');
var waitGame            = require('./waitGame');
var putShip             = require('./putShip');
var readyToFightClick   = require('./readyToFightClick');

module.exports = {
    getGameList         : getGameList,
    createNewGame       : createNewGame,
    chooseGame          : chooseGame,
    waitGame            : waitGame,
    putShip             : putShip,
    readyToFightClick   : readyToFightClick
};