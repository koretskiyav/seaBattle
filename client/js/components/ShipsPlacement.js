var ShipsPlacement = React.createClass({

  render: function() {
    return (
        <div>
            <button onClick={this.props.readyToFight}>I am ready to fight!</button>
            <Field ships={this.props.ships}
                   onClick={this.props.onFieldClick}/>
        </div>
    );
  }
 });