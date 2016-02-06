import React, { Component, PropTypes } from 'react';
const { string, array, func } = PropTypes;
import cssModules from 'react-css-modules';
import styles from './Field.css';

import Cell from 'components/Cell';

@cssModules(styles)
export default class Field extends Component {

  static propTypes = {
    title: string.isRequired,
    ships: array.isRequired,
    onClick: func.isRequired,
  };

  render() {
    const { title, ships, onClick } = this.props;

    return (
      <div styleName="wrapper">
        <h3>{title}</h3>
        <div styleName="field">
          {ships.map((status, index) => (
            <Cell
              key={index}
              index={index}
              status={status}
              onClick={onClick}
            />
          ))}
        </div>
      </div>
    );
  }
 }
