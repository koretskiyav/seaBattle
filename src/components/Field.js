import React, { Component, PropTypes } from 'react';

import Cell from 'components/Cell';

export default class Field extends Component {

  handleCellClick(index) {
    if (this.props.onClick) this.props.onClick(index);
  }

  render() {
    var cellNodes = this.props.ships.map(function(status, index) {
      return (
        <Cell status={status}
              onClick={this.handleCellClick.bind(this, index)} />
      );
    }.bind(this));

    return  <div className="bigField">
                <h3>{this.props.title}</h3>
                <div className="field">{cellNodes}</div>
            </div>
    }
 }
