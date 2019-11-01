import { useReducer, useEffect, useState } from 'react';
import axios from 'axios';

const SET_DAY = 'SET_DAY';
const SET_APPLICATION_DATA = 'SET_APPLICATION_DATA';
const SET_INTERVIEW = 'SET_INTERVIEW';

// reducer to update state
const reducer = (state, action) => {
  
  const dict = {
    SET_DAY: {...state, ...action.values },
    SET_APPLICATION_DATA: {...state, ...action.values },
    SET_INTERVIEW: {...state, ...action.values},
    default: () => {throw new Error(`Tried to reduce with unsupported action type: ${action.type}`)}
  }
  
  return (dict[action.type] || dict.default);
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
      dispatch({ type: SET_APPLICATION_DATA, values: {days: all[0].data, appointments: all[1].data, interviewers: all[2].data } });
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
      console.log('Message Received:', msg);
      if (msg.type === 'SET_INTERVIEW') {
        if (msg.interview === null) {
          
          const temp = {...state};

          console.log('temp_state:', temp);

          const appointment = {
            ...temp.appointments[msg.id],
            interview: null
          };
      
          const appointments = {
            ...temp.appointments,
            [msg.id]: appointment
          };

          console.log('appointments_canceling:', appointments);
          
          dispatch({ type: SET_INTERVIEW, values: {appointments} });

        } else {
          
          const temp = {...state};

          const appointment = {
            ...temp.appointments[msg.id],
            interview: {...msg.interview}
          };
            
          const appointments = {
            ...temp.appointments,
            [msg.id]: appointment
          };

          console.log('appointments_booking:', appointments);

          dispatch({ type: SET_INTERVIEW, values: {appointments} });

        }
      }
    }

  }, [webSocket, state])
  
  // set day
  const setDay = (day) => dispatch({ type: SET_DAY, values: {day}});
  
  // set interview (if edit=true, no change to spot count; if edit=false, decrease spot count)
  const bookInterview = (id, interview) => {
    const temp = {...state};

    const appointment = {
      ...temp.appointments[id],
      interview: { ...interview }
    };
      
    const appointments = {
      ...temp.appointments,
      [id]: appointment
    };

    // create a intermediary state to count available spots
    const temp_mid = {...temp, appointments};
    const days = countSpots(id, temp_mid);

    return axios.put(`/api/appointments/${id}`, { interview })    
    .then(() => {
      dispatch({ type: SET_INTERVIEW, values: {appointments, days} });
    })
  }
  // cancel interview (increase spot count for day)
  const cancelInterview = (id) => {
    const temp = {...state};

    const appointment = {
      ...temp.appointments[id],
      interview: null
    };

    const appointments = {
      ...temp.appointments,
      [id]: appointment
    };
    
    // create a intermediary state to count available spots
    const temp_mid = {...temp, appointments};
    const days = countSpots(id, temp_mid);

    return axios.delete(`/api/appointments/${id}`)
    .then(() => {
      dispatch({ type: SET_INTERVIEW, values: {appointments, days} });
    })
  }

  // counts available (empty) spots
  const countSpots = (id, temp_mid) => {
    const localDays = [...temp_mid.days];
    const result = localDays.filter(day => day.appointments.includes(id))[0];    

    const array = result.appointments;
    
    const localAppointments = {...temp_mid.appointments};

    const spots = array.reduce((acc, cur) => {
      if (localAppointments[cur].interview === null) {
        return acc + 1;
      }
      return acc;
    }, 0);

    result.spots = spots;

    return localDays;

  }
  return { state, setDay, bookInterview, cancelInterview };
}