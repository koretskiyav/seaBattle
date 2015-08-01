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
    if (this.props.haveName) {
        return <div>
                <button onClick={this.props.createNewGame}>Create new game</button>
                <GameList games={this.props.games}
                          chooseGame={this.props.chooseGame} />
            </div>
    } else {
        return <div>
            <form onSubmit={this.getGameList}>
                <span>Enter your name: </span>
                <input onChange={this.onChange} value={this.state.text} />
                <button>Go!</button>
            </form>
            </div>
        }
    }
 });