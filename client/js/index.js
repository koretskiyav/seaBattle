var mountNode = document.getElementById('content');

var GlobalDiv = React.createClass({

  getInitialState: function() {

    return {
      status: 'start',
      user: '',
      game: '',
      myShips: [],
      enemyShips: [],
      games: [],
    };
  },

  putShip: function(index) {
    $.post('../users/' + this.state.user + '/game/' + this.state.game + '/place/' + index)
      .done(function(data) {
        this.setState({myShips: data.myShips});
      }.bind(this));

  },

 waitFight: function() {

    var wait = setInterval(function() {
        $.get('../game/' + this.state.game)
          .done(function(data) {
            if (data.game.users[0].status === 'ready'
             && data.game.users[1].status === 'ready') {
              clearInterval(wait);
              this.setState({status: data.game.status});
            }
          }.bind(this));
    }.bind(this), 1000);
  },

  readyToFightClick: function() {
    $.get('../users/' + this.state.user + '/game/' + this.state.game)
      .done(function(data) {
        if (data.game.users[0].status === 'ready'
         && data.game.users[1].status === 'ready') {
           this.setState({status: data.game.status});
        } else {
            this.setState({status: 'wait2nd'});
            this.waitFight();
        }
      }.bind(this));
  },

  getGameList: function(user) {
    $.get('../users/' + user)
      .done(function(data) {
        this.setState({games : data.games, user: user});
      }.bind(this));
  },

  createNewGame: function() {
    $.post('../users/' + this.state.user)
      .done(function(data) {
        this.getGameList(this.state.user);
      }.bind(this));
  },

  chooseGame: function(index) {

    $.post('../users/' + this.state.user + '/game/' + this.state.games[index].id)
      .done(function(data) {
        this.setState({game: data.game.id});
        if (data.game.users[0].status === 'ready'
         && data.game.users[1].status === 'ready') {
           this.setState({status: data.game.status});
        } else {
            this.setState({status: 'wait2nd'});
            this.waitFight();
        }
      }.bind(this));
  },


  render: function() {

    var cellShips = [];
    var cell;
    for (var i = 0; i < 100; i++) {
        cell = _.find(this.state.myShips, {id: i.toString()}) || {id: i.toString(), status: 'void'};
        cellShips.push(cell.status);
    };

    if (this.state.status === 'start') {
        return <StartGame games={this.state.games}
                          getGameList={this.getGameList}
                          createNewGame={this.createNewGame}
                          chooseGame={this.chooseGame}/>
    } else if (this.state.status === 'wait2nd') {
        return <div>Waiting 2nd player...</div>
    } else if (this.state.status === 'placement') {
        return <ShipsPlacement ships={cellShips}
                               onFieldClick={this.putShip}
                               readyToFight={this.readyToFightClick}/>
    } else if (this.state.status === 'fight') {
        return <BattleField self={this} />
    }
  }
 });

var BattleField = React.createClass({

  render: function() {
    return (
        <div>
            <Field self={this.props.self} />
            <Field self={this.props.self} />
        </div>
    );
  }
 });

React.render(<GlobalDiv />, mountNode);