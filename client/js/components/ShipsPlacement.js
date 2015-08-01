var ShipsPlacement = React.createClass({

  render: function() {
    return (
        <div>
            {(this.props.myErr && this.props.myErr.status === 'ready') ?
                <button onClick={this.props.readyToFight}>I am ready to fight!</button>
            :
            (this.props.myErr && this.props.myErr.status === 'err') ?
                <p>Нельзя сотворить здесь!</p>
            :(this.props.myErr && this.props.myErr.status === 'warn') ?
                <p>Многовато {
                    this.props.myErr.shipsAarr[1] > 4 ? 1 :
                    this.props.myErr.shipsAarr[2] > 3 ? 2 :
                    this.props.myErr.shipsAarr[3] > 2 ? 3 : 4
                } -палубных кораблей, нада чета решать!</p>
            :
            (this.props.myErr || this.props.myErr.status === 'OK') ?
                <p>Нужно построить корабль!</p>
            : null
            }
            <Field ships={this.props.ships}
                   onClick={this.props.onFieldClick}/>
        </div>
    );
  }
 });