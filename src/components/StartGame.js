import React, { Component, PropTypes } from 'react';
const { array, bool, func } = PropTypes;
import cssModules from 'react-css-modules';
import styles from './StartGame.css';

import GameList from 'components/GameList';

@cssModules(styles)
export default class StartGame extends Component {

  static propTypes = {
    games: array.isRequired,
    haveName: bool.isRequired,
    getGameList: func.isRequired,
    createGame: func.isRequired,
    chooseGame: func.isRequired,
  };

  state = {};

  onChange = e => this.setState({ user: e.target.value });

  getGameList = e => {
    e.preventDefault();
    this.props.getGameList(this.state.user);
  };

  render() {
    const { haveName, createGame, chooseGame, games } = this.props;
    return (
      haveName ?
        <div styleName="root">
          <button onClick={createGame}>
            Create new game
          </button>
          <GameList
            games={games}
            chooseGame={chooseGame}
          />
        </div>
      :
        <div styleName="root">
          <form onSubmit={this.getGameList}>
            <span>Enter your name: </span>
            <input
              onChange={this.onChange}
              value={this.state.text}
            />
            <button>Go!</button>
          </form>
        </div>
    );
  }
 }
