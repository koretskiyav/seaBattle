var mountNode = document.getElementById('content');

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
    $.post('../users/' + this.state.value.indexOf(i))
      .done(function(data) {
        console.log(data);
      });
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

React.render(<Field />, mountNode);