import React, { useState, useEffect } from 'react';
import axios from 'axios';

import 'components/Application.scss';
import Appointment from 'components/Appointment';
import DayList from 'components/DayList';
import { getAppointmentsForDay, getInterview, getInterviewersForDay } from "helpers/selectors";

export default function Application(props) {
  const [state, setState] = useState({
    day: 'Monday',
    days: [],
    appointments: {},
    interviewers: {}
  })
 
  const setDay = day => setState({...state, day});
  // const setDays = days => setState(prev => ({...prev, days}));

  useEffect(() => {
    Promise.all([
      Promise.resolve(axios.get('/api/days')),
      Promise.resolve(axios.get('/api/appointments')),
      Promise.resolve(axios.get('/api/interviewers'))
    ]).then((all) => {
      setState(prev => ({...prev, days: all[0].data, appointments: all[1].data, interviewers: all[2].data }));
    })
  }, []);

  const bookInterview = (id, interview) => {

    return axios.put(`/api/appointments/${id}`, { interview })
    .then(() => {

      const appointment = {
        ...state.appointments[id],
        interview: { ...interview }
      };
        
      const appointments = {
        ...state.appointments,
        [id]: appointment
      };
  
      setState({...state, appointments});

    })
      
  }

  const cancelInterview = (id) => {
    // console.log('id to be deleted:', id);

    return axios.delete(`/api/appointments/${id}`)
    .then(() => {
      const appointment = {
        ...state.appointments[id],
        interview: null
      };

      const appointments = {
        ...state.appointments,
        [id]: appointment
      };
      
      setState({...state, appointments});

    })
  }

  const appointments = getAppointmentsForDay(state, state.day);
  const interviewers = getInterviewersForDay(state, state.day);


  const schedule = appointments.map((appointment) => {
    const interview = getInterview(state, appointment.interview);
    return (
      <Appointment 
        {...appointment}
        key={appointment.id}
        interview={interview} 
        interviewers={interviewers} 
        bookInterview={bookInterview}
        cancelInterview={cancelInterview}
      />
    );
  });
    
  return (
    <main className='layout'>
      <section className='sidebar'>
        
          <img
            className='sidebar--centered'
            src='images/logo.png'
            alt='Interview Scheduler'
          />
          <hr className='sidebar__separator sidebar--centered' />
          <nav className='sidebar__menu'>
            <DayList
              day={state.day}
              days={state.days}
              setDay={setDay}
            />
          </nav>
          <img
            className='sidebar__lhl sidebar--centered'
            src='images/lhl.png'
            alt='Lighthouse Labs'
          />
        
      </section>
      <section className='schedule'>
        {schedule}
        <Appointment key="last" time="5pm" />
      </section>
    </main>
  );
}