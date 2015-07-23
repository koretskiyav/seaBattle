var mountNode = document.getElementById('content');

var data = [];

for (var i = 0; i < 100; i++) {
    data.push({ 'status': 'void' });
};


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

  handleCellClick: function(i, e) {
      console.log(i, e);
  },

  getInitialState : function() {
    return {value: data};
  },

  render: function() {
    var cellNodes = this.state.value.map(function(item, index) {
      return (
        <Cell status={item.status} onClick={this.handleCellClick.bind(this, item)}/>
      );
    });
    return (
      <div className="field">
        {cellNodes}
      </div>
    );
  }
});

React.render(<Field />, mountNode);