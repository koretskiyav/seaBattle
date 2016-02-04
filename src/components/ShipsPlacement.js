import React, { Component, PropTypes } from 'react';

import Field from 'components/Field';

export default class ShipsPlacement extends Component {

  render() {
    return (
        <div className="GlobalDiv">
            {this.props.myErr ?
                this.props.myErr === 'ready' ?
                    <button onClick={this.props.readyToFight}>I am ready to fight!</button>
                :
                  <p className="msg">{this.props.myErr}</p>
            :
                <p className="msg">Lets build it!</p>
            }
            <Field ships    = {this.props.ships}
                   title    = 'Your field:'
                   onClick  = {this.props.onFieldClick}/>
        </div>
    );
  }
 }
