var Cell = React.createClass({

  handleClick: function(e) {
    if (this.props.onClick) this.props.onClick(e);
  },

  render: function() {
    return (
      <div className={this.props.status + " cell"}
           onClick={this.handleClick} ></div>
    );
  }
 });