import React from 'react';
import classNames from 'classnames/bind';

import 'components/InterviewerListItem.scss';

export default function InterviewerListItem(props) {
  const interviewerClass = classNames('interviewers__item', {
    'interviewers__item--selected': props.selected,
    'interviewers-item-image': props.avatar,
    'interviewers__item--selected-img': props.selected && props.avatar
  })

  return (
    <li 
      onClick={() => props.setInterviewer()}
      className={interviewerClass}
      >
      <img
        className='interviewers__item-image'
        src={props.avatar}
        alt={props.name}
      />
      {props.name}
    </li>
  );
}