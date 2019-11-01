import { useReducer, useEffect, useState } from 'react';
import axios from 'axios';

// counts available (empty) spots
const countSpots = (id, tmp) => {
  const localDays = [...tmp.days];
  const result = localDays.filter(day => day.appointments.includes(id))[0];    

  const array = result.appointments;
  
  const localAppointments = {...tmp.appointments};

  const spots = array.reduce((acc, cur) => {
    if (localAppointments[cur].interview === null) {
      return acc + 1;
    }
    return acc;
  }, 0);

  result.spots = spots;

  return localDays;

}

const SET_DAY = 'SET_DAY';
const SET_APPLICATION_DATA = 'SET_APPLICATION_DATA';
const SET_INTERVIEW = 'SET_INTERVIEW';

// reducer to update state
const reducer = (state, action) => {
  
  const dict = {
    SET_DAY: () => ({...state, day: action.day }),
    SET_APPLICATION_DATA: () => ({
      ...state, 
      days: action.days, 
      appointments: action.appointments, 
      interviewers: action.interviewers
     }),
    SET_INTERVIEW: () => {
      // update appointments before counting days
      const tmp = {
        ...state,
        appointments: {
          ...state.appointments,
          [action.id]: {
            ...state.appointments[action.id],
            interview: action.interview && {...action.interview }
          }
        }
      };

      // get updated days object
      const days = countSpots(action.id, tmp);
      return {...tmp, days: days };

    },
    default: () => {throw new Error(`Tried to reduce with unsupported action type: ${action.type}`)}
  }

  return (dict[action.type] || dict.default)();
}

export default function useApplicationData () {

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
      dispatch({ type: SET_APPLICATION_DATA, days: all[0].data, appointments: all[1].data, interviewers: all[2].data });
    })
  }, []);
  
  // initialize webSocket state
  let [webSocket, setWebsocket] = useState(null);
  
  // instantiate webSocket class
  useEffect(() => {
    const webSocket = new WebSocket(process.env.REACT_APP_WEBSOCKET_URL);
    setWebsocket(webSocket);
    return () => {
      webSocket.close();
    }
  }, []);

  useEffect(() => {
    // prevent app from crashing on mount (no webSocket object)
    if (!webSocket) {
      return;
    }

    webSocket.onopen = function (event) {
      webSocket.send('ping');
    }
    
    webSocket.onmessage = function (event) {
      const msg = JSON.parse(event.data);

      if (msg.type === 'SET_INTERVIEW') {
        if (msg.interview === null) {
          dispatch({ type: SET_INTERVIEW, id: msg.id, interview: null });

        } else {
          dispatch({ type: SET_INTERVIEW, id: msg.id, interview: {...msg.interview} });

        }
      }
    }

  }, [webSocket, state]);
  
  // set day
  const setDay = (day) => dispatch({ type: SET_DAY, day });
  
  // set interview
  const bookInterview = (id, interview) => {

    return axios.put(`/api/appointments/${id}`, { interview })    
    .then(() => {
      dispatch({ type: SET_INTERVIEW, id, interview });

    })
  }
  // cancel interview (increase spot count for day)
  const cancelInterview = (id) => {

    return axios.delete(`/api/appointments/${id}`)
    .then(() => {
      dispatch({ type: SET_INTERVIEW, id, interview: null });
    })
  }

  return { state, setDay, bookInterview, cancelInterview };
}