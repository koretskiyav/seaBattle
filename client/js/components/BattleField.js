var BattleField = React.createClass({

  render: function() {
    return (
        <div>
            <Field ships    = {this.props.myField} />
            <Field ships    = {this.props.enemyField}
                   onClick  = {this.props.onFieldClick}/>
        </div>
    );
  }
 });