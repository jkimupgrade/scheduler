import React from 'react';

import 'components/Appointment/styles.scss';

import Header from 'components/Appointment/Header';
import Empty from 'components/Appointment/Empty';
import Show from 'components/Appointment/Show';
import Form from 'components/Appointment/Form';
import Status from 'components/Appointment/Status';
import Confirm from 'components/Appointment/Confirm';
import useVisualMode from 'hooks/useVisualMode';

export default function Appointment(props) {
  const EMPTY = 'EMPTY';
  const SHOW = 'SHOW';
  const CREATE = 'CREATE';
  const SAVING = 'SAVING';
  const DELETING = 'DELETING';
  const CONFIRM = 'CONFIRM';

  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  );
  
  // save appointment
  const save = (name, interviewer) => {
    const interview = {
      student: name,
      interviewer
    };
      
    transition(SAVING);
    
    props.bookInterview(props.id, interview)
    .then(() => transition(SHOW));
  }

  // delete appointment
  const deleteAppointment = () => {
    transition(DELETING);

    props.cancelInterview(props.id)
    .then(() => transition(EMPTY));
  }

  return (
    <article className='appointment'>
      <Header time={props.time}/>
        {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
        {mode === SHOW && (
          <Show
            student={props.interview.student}
            interviewer={props.interview.interviewer}
            onDelete={() => transition(CONFIRM)}
          />
        )}
        {mode === 'CREATE' && (
          <Form
            interviewers={props.interviewers}
            onCancel={back}
            onSave={save}
          />
        )}
        {mode === SAVING && <Status message={'Saving'} />}
        {mode === DELETING && <Status message={'Deleting'} />}
        {mode === CONFIRM && (
          <Confirm
            message={'Are you sure you want to cancel?'}
            onConfirm={deleteAppointment}
            onCancel={() => transition(SHOW)}
          />
        )}
        {/* {props.interview ? <Show student={props.interview.student} interviewer={props.interview.interviewer}/> : <Empty />} */}
    </article>
  )
}