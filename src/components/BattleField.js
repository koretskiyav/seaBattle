import React, { Component, PropTypes } from 'react';

import Field from 'components/Field';

export default class BattleField extends Component {

  render() {
    return (
        <div className="GlobalDiv">
            <p className="msg">{this.props.myErr}</p>
            <Field ships    = {this.props.myField}
                   title    = 'Your field:'/>
            <Field ships    = {this.props.enemyField}
                   title    = 'Enemy field:'
                   onClick  = {this.props.onFieldClick}/>
        </div>
    );
  }
 }
