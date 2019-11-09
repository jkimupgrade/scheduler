import React, { useState } from 'react';

import InterviewerList from '../InterviewerList';
import Button from '../Button';

export default function Form(props) {
  const [name, setName] = useState(props.name || '');
  const [interviewer, setInterviewer] = useState(props.interviewer || null);
  const [error, setError] = useState({
    name: '',
    interviewer: ''
  });

  const validate = () => {
    if (name === '' && interviewer === null) {
      setError({ ...error, name: 'Student name cannot be blank', interviewer: 'Please choose an interviewer' });
    } else if (name === '') {
      setError({ ...error, name: 'Student name cannot be blank', interviewer: '' });
    } else if (interviewer === null) {
      setError({ ...error, name: '', interviewer: 'Please choose an interviewer' });
    } else {
      setError({ ...error, name: '', interviewer: '' });
      props.onSave(name, interviewer);
    }
  }

  const reset = () => {
    setName('');
    setInterviewer(null);
    return;
  }

  const cancel = () => {
    reset();
    props.onCancel();
    return;
  }
  
  return (
    <main className="appointment__card appointment__card--create">
      <section className="appointment__card-left">
        <form autoComplete="off" onSubmit={event => event.preventDefault()}>
          <input
            className="appointment__create-input text--semi-bold"
            name="name"
            value={name}
            onChange={event => setName(event.target.value)}
            type="text"
            placeholder="Enter Student Name"
            data-testid='student-name-input'
          />
        </form>
        <section className='appointment__validation'>{error.name}</section>
        <InterviewerList
          interviewers={props.interviewers}
          value={interviewer}
          onChange={setInterviewer}
        />
        <section className='appointment__validation'>{error.interviewer}</section>
      </section>
      <section className="appointment__card-right">
        <section className="appointment__actions">
          <Button danger onClick={cancel}>Cancel</Button>
          <Button confirm onClick={validate}>Save</Button>
        </section>
      </section>
    </main>
  )
}