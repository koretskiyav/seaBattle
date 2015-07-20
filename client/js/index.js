var mountNode = document.getElementById('content');

var data = [];

for (var i = 0; i < 100; i++) {
    data.push({ 'status': 'void' });
};

var Cell = React.createClass({
  render: function() {
    return (
      <div className={this.props.status}></div>
    );
  }
});

var Field = React.createClass({
  render: function() {
    var cellNode = this.props.data.map( function(item) {
            console.log(item.status);
        return (
            <Cell status={item.status} />
        );
    });
    return (
      <div className="field">
        {cellNode}
      </div>
    );
  }
});

React.render(<Field data = {data}/>, mountNode);