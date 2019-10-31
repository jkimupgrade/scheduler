import { useState, useEffect } from 'react';
import axios from 'axios';

export default function useApplicationData () {

  const [state, setState] = useState({
    day: 'Monday',
    days: [],
    appointments: {},
    interviewers: {}
  });

  useEffect(() => {
    Promise.all([
      Promise.resolve(axios.get('/api/days')),
      Promise.resolve(axios.get('/api/appointments')),
      Promise.resolve(axios.get('/api/interviewers'))
    ]).then((all) => {
      setState(prev => ({...prev, days: all[0].data, appointments: all[1].data, interviewers: all[2].data }));
    })
  }, []);

  const setDay = day => setState({...state, day});

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

  return { state, setDay, bookInterview, cancelInterview };
}