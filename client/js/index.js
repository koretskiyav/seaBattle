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

  render: function() {
    if (this.state.status === 'start') {
        return <StartGame self={this} />
    } else if (this.state.status === 'wait2nd') {
        return <div>Waiting 2nd player...</div>
    } else if (this.state.status === 'placement') {
        return <ShipsPlacement self={this} />
    } else if (this.state.status === 'fight') {
        return <BattleField self={this} />
    }
  }
 });

var GameList = React.createClass({

  waitGame: function() {
    var game = this.props.self.state.game;
    var wait = setInterval(function() {
        $.get('../game/' + game)
          .done(function(data) {
            if (data.game.users[0].status === 'ready'
             && data.game.users[1].status === 'ready') {
              clearInterval(wait);
              this.props.self.setState({status: data.game.status});
            }
          }.bind(this));
    }.bind(this), 1000);
  },

  handleClick: function(index) {

    var user = this.props.self.state.user;
    var games = this.props.self.state.games;
    var game = games[index].id;

    $.post('../users/' + user + '/game/' + game)
      .done(function(data) {
        this.props.self.setState({game: data.game.id});
        if (data.game.users[0].status === 'ready'
         && data.game.users[1].status === 'ready') {
           this.props.self.setState({status: data.game.status});
        } else {
            this.props.self.setState({status: 'wait2nd'});
            this.waitGame();
        }
      }.bind(this));
  },

  render: function() {
    var games = this.props.self.state.games;
    var liNodes = games.map(function(game, index) {
      return (
        <li onClick={this.handleClick.bind(this, index)}>{game}</li>
      )
    }.bind(this));
    return (
        <div>
            <h4>Available games:</h4>
            <ul>{liNodes}</ul>
        </div>
    )
  }
 });

var StartGame = React.createClass({

  getInitialState: function() {
     return {};
   },

  onChange: function(e) {
    this.props.self.setState({user: e.target.value});
  },

  handleSubmit: function(e) {
    if(e) e.preventDefault();
    $.get('../users/' + this.props.self.state.user)
      .done(function(data) {
        this.props.self.setState({games : data.games});
        console.log(this.props.self.state.games);
      }.bind(this));
  },

  createNewGame: function() {
    $.post('../users/' + this.props.self.state.user)
      .done(function(data) {
        this.handleSubmit();
      }.bind(this));
  },

  render: function() {
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <p>Enter your name:</p>
          <input onChange={this.onChange} value={this.state.text} />
          <button>Go!</button>
        </form>
        <div>
          <button onClick={this.createNewGame}>Create new game</button>
          <GameList self={this.props.self} />
        </div>
      </div>
    );
  }
 });

var Cell = React.createClass({

  handleClick: function(e) {
    if (this.props.onClick) this.props.onClick(e);
  },

  render: function() {
    return (
      <div className={this.props.status + " cell"} onClick={this.handleClick}></div>
    );
  }
 });

var Field = React.createClass({

  handleCellClick: function(i, e) {
    if (this.props.flag === 'inert') return;
    $.post('../users/' + this.props.self.state.user + '/game/' + this.props.self.state.game + '/place/' + e)
      .done(function(data) {
        this.props.self.setState({myShips: data.myShips});
        console.log(data.myShips);
      }.bind(this));
  },

  render: function() {

    var cellShips = [];
    var cell;
    for (var i = 0; i < 100; i++) {
        cell = _.find(this.props.ships, {id: i.toString()}) || {id: i.toString(), status: 'void'};
        cellShips.push(cell);
    };

    var cellNodes = cellShips.map(function(item, index) {
      return (
        <Cell status={item.status} onClick={this.handleCellClick.bind(this, item, index)}/>
      );
    }.bind(this));

    return (
      <div className="field">
        {cellNodes}
      </div>
    );
  }
 });

var ShipsPlacement = React.createClass({

  waitFight: function() {
    var game = this.props.self.state.game;

    var wait = setInterval(function() {
        $.get('../game/' + game)
          .done(function(data) {
            if (data.game.users[0].status === 'ready'
             && data.game.users[1].status === 'ready') {
              clearInterval(wait);
              this.props.self.setState({status: data.game.status});
            }
          }.bind(this));
    }.bind(this), 1000);
  },


  handleClick: function(index) {

    var user = this.props.self.state.user;
    var game = this.props.self.state.game;

    $.get('../users/' + user + '/game/' + game)
      .done(function(data) {
        if (data.game.users[0].status === 'ready'
         && data.game.users[1].status === 'ready') {
           this.props.self.setState({status: data.game.status});
        } else {
            this.props.self.setState({status: 'wait2nd'});
            this.waitFight();
        }
      }.bind(this));
  },

  render: function() {
    return (
        <div>
            <button onClick={this.handleClick.bind(this)}>I am ready to fight!</button>
            <Field self={this.props.self} ships = {this.props.self.state.myShips}/>
        </div>
    );
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