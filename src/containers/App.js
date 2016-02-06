import React, { Component, PropTypes } from 'react';
const { string, array, object, bool, func } = PropTypes;
import { connect } from 'react-redux';

import { StartGame, ShipsPlacement, BattleField } from 'components';
import { setUser } from 'redux/modules/user';
import { load as loadGameList } from 'redux/modules/games';
import {
  create as createGame,
  choose as chooseGame,
  ready as readyToFight,
  load as loadGame,
  move as moveGame,
} from 'redux/modules/currentGame';

@connect(
  store => ({
    user: store.user,
    games: store.games.data,
    currentGame: store.currentGame.data,
    loading: store.currentGame.loading,
  }),
  {
    loadGameList,
    setUser,
    createGame,
    chooseGame,
    readyToFight,
    loadGame,
    moveGame,
  },
)
export default class App extends Component {

  static propTypes = {
    user: string.isRequired,
    games: array.isRequired,
    currentGame: object.isRequired,
    loading: bool.isRequired,
    setUser: func.isRequired,
    loadGameList: func.isRequired,
    createGame: func.isRequired,
    chooseGame: func.isRequired,
    readyToFight: func.isRequired,
    loadGame: func.isRequired,
    moveGame: func.isRequired,
  };

  componentWillReceiveProps = nextProps => {
    if (this.props.loading && !nextProps.loading) {
      const user = this.props.user;
      const { status, curMove, id: gameId } = nextProps.currentGame;
      if (status === 'wait2nd' || (status === 'fight' && curMove !== 'me')) {
        setTimeout(() => this.props.loadGame(gameId, user), 1000);
      }
    }
  }

  getGameList = (user) => {
    this.props.setUser(user);
    this.props.loadGameList(user);
  };

  createGame = () => {
    this.props.createGame(this.props.user);
  };

  chooseGame = (index) => {
    const { user, games } = this.props;
    this.props.chooseGame(games[index].id, user);
  };

  readyToFightClick = () => {
    const { user, currentGame: { id } } = this.props;
    this.props.readyToFight(id, user);
  };

  putShip = (place) => {
    const { user, currentGame: { id } } = this.props;
    this.props.moveGame(id, user, place);
  };

    render() {
      const { user, games, currentGame } = this.props;
      const { status, myField, enemyField, myErr } = currentGame;

      if (!currentGame || !status) {
        return (
            <StartGame
              games = {games}
              haveName = {!!user}
              getGameList = {this.getGameList}
              createGame = {this.createGame}
              chooseGame = {this.chooseGame}
            />
        );
      } else if (status === 'wait2nd') {
        return (
          <div className="GlobalDiv">Waiting 2nd player...</div>
        );
      } else if (status === 'placement') {
        return (
          <ShipsPlacement
            ships = {myField}
            onFieldClick = {this.putShip}
            readyToFight = {this.readyToFightClick}
            myErr = {myErr}
          />
        );
      } else if (status === 'fight') {
        return (
          <BattleField
            myField = {myField}
            enemyField = {enemyField}
            onFieldClick = {this.putShip}
            myErr = {myErr}
          />
        );
      }
    }
}
