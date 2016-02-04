import React, { Component, PropTypes } from 'react';

export default class GameList extends Component {

  handleClick(index) {
    this.props.chooseGame(index);
  }

  render() {
    var liNodes = this.props.games.map(function(game, index) {
      return (
        <li key={index}>
            {                                       'game: '     + game.id                      }
            {game.status                          ? ', status: ' + game.status            : null}
            {game.myName                          ? ', me: '     + game.myName            : null}
            {game.myName && game.myStatus         ? ' ('         + game.myStatus + ')'   : null}
            {game.enemyName                       ? ', enemy: '  + game.enemyName         : null}
            {game.enemyName && game.enemyStatus   ? ' ('         + game.enemyStatus + ')': null}
            <button className="join" onClick={this.handleClick.bind(this, index)}>join</button>
        </li>
      )
    }.bind(this));
    return (
        <div className="GameList">
            <h4>Available games:</h4>
            <ul>{liNodes}</ul>
        </div>
    )
  }
 }
