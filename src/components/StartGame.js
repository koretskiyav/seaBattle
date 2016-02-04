import React, { Component, PropTypes } from 'react';

import GameList from 'components/GameList';

export default class StartGame extends Component {

   state = {};

  onChange = e => this.setState({ user: e.target.value });

  getGameList = e => {
    e.preventDefault();
    this.props.getGameList(this.state.user);
  };

  render() {
    if (this.props.haveName) {
        return <div className="GlobalDiv">
                <button onClick={this.props.createNewGame}>Create new game</button>
                <GameList games={this.props.games}
                          chooseGame={this.props.chooseGame} />
            </div>
    } else {
        return <div className="GlobalDiv">
            <form onSubmit={this.getGameList}>
                <span>Enter your name: </span>
                <input onChange={this.onChange} value={this.state.text} />
                <button>Go!</button>
            </form>
            </div>
        }
    }
 }
