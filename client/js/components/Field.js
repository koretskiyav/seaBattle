var Field = React.createClass({

  handleCellClick: function(index) {
    if (this.props.onClick) this.props.onClick(index);
  },

  render: function() {
    var cellNodes = this.props.ships.map(function(status, index) {
      return (
        <Cell status={status}
              onClick={this.handleCellClick.bind(this, index)} />
      );
    }.bind(this));

    return  <div className="bigField">
                <h3>{this.props.title}</h3>
                <div className="field">{cellNodes}</div>
            </div>
    }
 });