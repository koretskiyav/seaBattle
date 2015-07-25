var mountNode = document.getElementById('content');

var GameList = React.createClass({

  handleClick: function(e) {
    console.log(e.target.innerHTML);
  },

  render: function() {

    var liNodes = this.props.games.map(function(game) {
      var gameString = 'game: ' + game.id + ' user1: ' + game.user1 + ' user2: ' + game.user2

      return (
        <li onClick={this.handleClick.bind(this)}>{gameString}</li>
      )
    }.bind(this));

    return (
      <ul>{liNodes}</ul>
    );
  }
});

var StartGame = React.createClass({

  getInitialState: function() {
    return {
      user: null,
      myOldGames: [],
      myCreatetGames:[],
      freeJoinGames: []
    };
  },

  onChange: function( e ) {
    this.setState({user: e.target.value});
  },

  handleSubmit: function( e ) {
    e.preventDefault();
    $.get('../users/' + this.state.user)
      .done(function(data) {
        this.setState({
          myOldGames : data.Games.myOldGames,
          myCreatetGames : data.Games.myCreatetGames,
          freeJoinGames : data.Games.freeJoinGames
        });
      }.bind(this));
  },

  createNewGame: function() {
    // $.post('../users/' + this.state.user)
    //   .done(function(data) {
    //     console.log(data);
    //   });
    console.log(this.state);
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
          <h4>You have not completed the games:</h4>
          <GameList games={this.state.myOldGames} />
          <h4>You previously created games:</h4>
          <GameList games={this.state.myCreatetGames} />
          <h4>Games that you can join:</h4>
          <GameList games={this.state.freeJoinGames} />
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

  getInitialState : function() {
  var data = [];

  for (var i = 0; i < 100; i++) {
      data.push({ 'status': 'void' });
  };
    return {value: data};
  },

  handleCellClick: function(i, e) {
    // $.get('../users/' + this.state.value.indexOf(i))
    //   .done(function(data) {
    //     console.log(data);
    //   });
    var curCell = this.state.value[this.state.value.indexOf(i)];
    curCell.status = curCell.status === 'ship' ? 'void' : 'ship';
    this.setState(this.state.value);
  },

  render: function() {
    var cellNodes = this.state.value.map(function(item, index) {
      return (
        <Cell status={item.status} onClick={this.handleCellClick.bind(this, item)}/>
      );
    }.bind(this));

    return (
      <div className="field">
        {cellNodes}
      </div>
    );
  }
});

React.render(<StartGame />, mountNode);