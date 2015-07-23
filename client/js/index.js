var mountNode = document.getElementById('content');

var data = [];

for (var i = 0; i < 100; i++) {
    data.push({ 'status': 'void' });
};


var Cell = React.createClass({
  onClick: function(i) {
    return function(e) {
      data[i] = {'status': 'ship'};
      console.log(i, data[i]);
    }.bind(this)
  },
  render: function() {
    return (
      <div className={this.props.status} data-id={this.props.id} onClick={this.onClick(this.props.id)}></div>
    );
  }
});

var Field = React.createClass({

  getInitialState : function() {
    return {value: data};
  },

  render: function() {
    var cellNode = this.state.value.map(function(item, index) {
      return (
        <Cell status={item.status} id={index}/>
      );
    });
    return (
      <div className="field">
        {cellNode}
      </div>
    );
  }
});

React.render(<Field />, mountNode);