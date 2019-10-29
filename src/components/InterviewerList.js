import React from 'react';

import 'components/InterviewerList.scss';

import InterviewerListItem from 'components/InterviewerListItem';

export default function InterviewerList(props) {
  const list = props.interviewers.map(interviewer => {
    return (
      <InterviewerListItem
        id={interviewer.id}
        name={interviewer.name}
        avatar={interviewer.avatar}
        selected={interviewer.name === props.value}
        setInterviewer={() => props.setInterviewer(interviewer.name)}
      />
    );
  })

  return (
    <section className='interviewers'>
      <h4 className='interviewers_header text--light'>Interviewer</h4>
      <ul className='interviewers__list'>{list}</ul>
    </section>
  );
}