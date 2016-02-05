import { combineReducers } from 'redux';

import user from './modules/user';
import games from './modules/games';
import currentGame from './modules/currentGame';

export default combineReducers({
  user,
  games,
  currentGame,
});
