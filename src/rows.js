import React from 'react';

const Rows = props => {
  const { showColours, ...otherProps } = props;
  const className = `rows${showColours ? ' colours' : ''}`;
  return (
    <div className={className} {...otherProps} />
  )
}
export default Rows
