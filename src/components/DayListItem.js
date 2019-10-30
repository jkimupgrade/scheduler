import React from 'react';
import classNames from 'classnames/bind';

import 'components/DayListItem.scss';

export default function DayListItem(props) {
  const dayClass = classNames('day-list__item', {
    'day-list__item--selected': props.selected,
    'day-list__item--full': props.spots === 0
  });

  const formatSpots = (num) => {
    if (num === 0) {
      return 'no spots remaining';
    }
      return `${num} spot${num > 1 ? 's' : ''} remaining`;
  }
  
  return (
    <li 
      className={dayClass}
      onClick={() => props.onChange()}
      >
      <h2 className='text--regular'>{props.name}</h2> 
      <h3 className='text--light'>{formatSpots(props.spots)}</h3>
    </li>
  );
}