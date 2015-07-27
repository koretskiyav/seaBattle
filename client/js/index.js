$.put = function(url, data, callback, type){

  if ( $.isFunction(data) ){
    type = type || callback,
    callback = data,
    data = {}
  }

  return $.ajax({
    url: url,
    type: 'PUT',
    success: callback,
    data: data,
    contentType: type
  });
}

var mountNode = document.getElementById('content');


var GlobalDiv = React.createClass({

  getInitialState: function() {

    var data = [];

    for (var i = 0; i < 100; i++) {
        data.push('void');
    };

    return {
      status: 'start',
      user: '',
      game: '',
      myShips: data,
      myOldGames: [],
      myCreatetGames:[],
      freeJoinGames: []
    };
  },

  render: function() {
    if (this.state.status === 'start') {
        return <StartGame self={this} />
    } else if (this.state.status === 'placement') {
        return <ShipsPlacement self={this} />
    }
  }
});

var GameList = React.createClass({

  waitGame: function(game) {
    var wait = setInterval(function() {
        $.get('../game/' + game)
          .done(function(data) {
            if (data.status === 'OK') {
              clearInterval(wait);
              this.props.self.setState({status: 'placement'});
              // console.log(this.props.self.state);
            }
          }.bind(this));
    }.bind(this), 1000);
  },

  handleClick: function(index) {
    $.put('../users/' + this.props.self.state.user + '/game/' + this.props.games[index].id)
      .done(function(data) {
        this.props.self.state.game = this.props.games[index].id;
        this.props.self.setState(this.props.self.state);
        this.waitGame(this.props.games[index].id);
      }.bind(this));
  },

  render: function() {
    var liNodes = this.props.games.map(function(game, index) {
      return (
        <li onClick={this.handleClick.bind(this, index)}>{game}</li>
      )
    }.bind(this));
    if (this.props.games !== []) {
        return (
            <div>
                <h4>{this.props.title}</h4>
                <ul>{liNodes}</ul>
            </div>
        )
    }
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
    e.preventDefault();
    $.get('../users/' + this.props.self.state.user)
      .done(function(data) {
        this.props.self.setState({
          myOldGames : data.Games.myOldGames,
          myCreatetGames : data.Games.myCreatetGames,
          freeJoinGames : data.Games.freeJoinGames
        });
      }.bind(this));
  },

  createNewGame: function() {
    $.post('../users/' + this.props.self.state.user)
      .done(function(data) {
        this.props.self.state.myCreatetGames.push(data.game);
        this.props.self.setState(this.props.self.state);
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
          <GameList
                self={this.props.self}
                games={this.props.self.state.myOldGames}
                title={'You have not completed the games:'} />
          <GameList
                self={this.props.self}
                games={this.props.self.state.myCreatetGames}
                title={'You previously created games:'} />
          <GameList
                self={this.props.self}
                games={this.props.self.state.freeJoinGames}
                title={'Games that you can join:'} />
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
      <div className={this.props.status} onClick={this.handleClick}></div>
    );
  }
});

var Field = React.createClass({

  handleCellClick: function(i, e, z) {
    var ships = this.props.self.state.myShips;
    $.post('../users/' + this.props.self.state.user + '/game/' + this.props.self.state.game + '/place/' + e)
      .done(function(data) {
        for (var i = 0; i < ships.length; i++) {
            if (data.ships.indexOf(i.toString()) === -1) {
                ships[i] = 'void'
            } else {
                ships[i] = 'ship'
            }
        };
        // console.log(data.ships);
        this.props.self.setState(this.props.self.state);
      }.bind(this));
  },

  render: function() {
    var cellNodes = this.props.self.state.myShips.map(function(item, index) {
      return (
        <Cell status={item} onClick={this.handleCellClick.bind(this, item, index)}/>
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
  render: function() {
    return <Field self={this.props.self} />
  }
});

React.render(<GlobalDiv />, mountNode);