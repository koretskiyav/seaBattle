import React, { Component, PropTypes } from 'react';
const { string, number, func } = PropTypes;
import cssModules from 'react-css-modules';
import styles from './Cell.css';

@cssModules(styles)
export default class Cell extends Component {

  static propTypes = {
    status: string.isRequired,
    index: number.isRequired,
    onClick: func.isRequired,
  };

  onClick = () => this.props.onClick(this.props.index);

  render() {
    return (
      <div
        className={this.props.status}
        styleName="cell"
        onClick={this.onClick}
      />
    );
  }
 }
