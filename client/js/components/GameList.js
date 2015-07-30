var GameList = React.createClass({

  handleClick: function(index) {
    this.props.chooseGame(index);
  },

  render: function() {
    var liNodes = this.props.games.map(function(game, index) {
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