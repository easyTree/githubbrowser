import React from 'react';
import { Badge } from 'reactstrap';
import { groupsOfThree } from './utils';

const Stat = props => {
  return (
    <div className='stat-display'>
      <img src={props.src} alt={props.text} className='icon' height='26' />
      <span className='stat'>{props.text}</span>
      <Badge color="secondary" pill>
        {groupsOfThree(Number(props.stat))}
      </Badge>
    </div>
  );
};

export default Stat;