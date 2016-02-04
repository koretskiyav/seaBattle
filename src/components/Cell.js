import React, { Component, PropTypes } from 'react';

export default class Cell extends Component {
  render() {
    return (
      <div className={this.props.status + " cell"}
           onClick={this.props.onClick} ></div>
    );
  }
 }
