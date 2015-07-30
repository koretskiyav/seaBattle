var StartGame = React.createClass({

   getInitialState: function() {
     return {};
   },

  onChange: function(e) {
    this.setState({user: e.target.value});
  },

  getGameList: function(e) {
    e.preventDefault();
    this.props.getGameList(this.state.user);
  },

  render: function() {
    return (
      <div>
        <form onSubmit={this.getGameList}>
          <p>Enter your name:</p>
          <input onChange={this.onChange} value={this.state.text} />
          <button>Go!</button>
        </form>
        <div>
          <button onClick={this.props.createNewGame}>Create new game</button>
          <GameList games={this.props.games}
                    chooseGame={this.props.chooseGame} />
        </div>
      </div>
    );
  }
 });