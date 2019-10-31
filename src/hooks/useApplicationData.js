import { useReducer, useEffect } from 'react';
import axios from 'axios';

export default function useApplicationData () {
  
  const SET_DAY = 'SET_DAY';
  const SET_APPLICATION_DATA = 'SET_APPLICATION_DATA';
  const SET_INTERVIEW = 'SET_INTERVIEW';

  // reducer to update state
  function reducer(state, action) {
    
    const dict = {
      SET_DAY: {...state, ...action.values },
      SET_APPLICATION_DATA: {...state, ...action.values },
      SET_INTERVIEW: {...state, ...action.values },
      default: () => {throw new Error(`Tried to reduce with unsupported action type: ${action.type}`)}
    }
    
    return (dict[action.type] || dict.default);
  }
  
  // initialize state
  const [state, dispatch] = useReducer(reducer, {
    day: 'Monday',
    days: [],
    appointments: {},
    interviewers: {}
  });
  // set application data
  useEffect(() => {
    Promise.all([
      axios.get('/api/days'),
      axios.get('/api/appointments'),
      axios.get('/api/interviewers')
    ]).then((all) => {
      dispatch({ type: SET_APPLICATION_DATA, values: {days: all[0].data, appointments: all[1].data, interviewers: all[2].data } });
    })
  }, []);
  
  // set day
  const setDay = (day) => dispatch({ type: SET_DAY, values: {day}});
  
  // set interview
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
  
      dispatch({ type: SET_INTERVIEW, values: {appointments} });
    })
      
  }
  // cancel interview
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
      
      dispatch({ type: SET_INTERVIEW, values: {appointments} });
    })
  }

  return { state, setDay, bookInterview, cancelInterview };
}