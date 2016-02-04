import React, { Component, PropTypes } from 'react';
import $ from 'jquery';

import StartGame from 'components/StartGame';
import ShipsPlacement from 'components/ShipsPlacement';
import BattleField from 'components/BattleField';

export default class App extends Component {

  state = {
    user: '',
    game: '',
    games: [],
  };

  getGameList = user => {
    this.setState({ user });
    $.get(`../users/${user}`).done(({ games }) => this.setState({ games }));
  };

    createNewGame = () => {
        $.post('../users/' + this.state.user)
            .done(function(data) {
                this.setState({game: data.game});
                if (this.state.game.status === 'wait2nd') this.waitGame();
            }.bind(this));
    };

    chooseGame = index => {
        $.post('../users/' + this.state.user + '/game/' + this.state.games[index].id)
            .done(function(data) {
                this.setState({game: data.game});
                if (this.state.game.status === 'wait2nd') this.waitGame();
            }.bind(this));
    };

    waitGame = () => {
        var wait = setInterval(function() {
            $.get('../game/' + this.state.game.id + '/users/' + this.state.user)
                .done(function(data) {
                    this.setState({game: data.game});
                    if (this.state.game.status !== 'wait2nd') clearInterval(wait);
                    if (this.state.game.status === 'fight') this.waitMyMove();
                }.bind(this));
        }.bind(this), 1000);
    };

    putShip = (index) => {

        if (this.state.game.status === 'placement') {
            this.state.game.myField[index] = 'wait';
        } else {
            this.state.game.enemyField[index] = 'wait';
        }

        this.setState({game: this.state.game});

        $.post('../users/' + this.state.user + '/game/' + this.state.game.id + '/place/' + index)
            .done(function(data) {
                this.setState({game: data.game});
                if (this.state.game.status === 'fight') this.waitMyMove();
            }.bind(this));
      };

    readyToFightClick = () => {
        $.get('../users/' + this.state.user + '/game/' + this.state.game.id)
            .done(function(data) {
                this.setState({game: data.game});
                if (data.game.status === 'wait2nd') this.waitGame();
                if (this.state.game.status === 'fight') this.waitMyMove();
            }.bind(this));
    };

    waitMyMove = () => {
        var wait = setInterval(function() {
            $.get('../game/' + this.state.game.id + '/users/' + this.state.user)
                .done(function(data) {
                    this.setState({game: data.game});
                    if (this.state.game.curMove === 'me') clearInterval(wait);
                }.bind(this));
        }.bind(this), 1000);
    };

    render() {
        if (!this.state.game || !this.state.game.status) {
            return <StartGame games          = {this.state.games}
                              haveName       = {!!this.state.user}
                              getGameList    = {this.getGameList}
                              createNewGame  = {this.createNewGame}
                              chooseGame     = {this.chooseGame}/>
        } else if (this.state.game.status === 'wait2nd') {
            return <div className="GlobalDiv">Waiting 2nd player...</div>
        } else if (this.state.game.status === 'placement') {
            return <ShipsPlacement ships         = {this.state.game.myField}
                                   onFieldClick  = {this.putShip}
                                   readyToFight  = {this.readyToFightClick}
                                   myErr         = {this.state.game.myErr} />
        } else if (this.state.game.status === 'fight') {
            return <BattleField myField       = {this.state.game.myField}
                                enemyField    = {this.state.game.enemyField}
                                onFieldClick  = {this.putShip}
                                myErr         = {this.state.game.myErr} />
        }
    }
}
