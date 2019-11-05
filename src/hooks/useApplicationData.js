import { useReducer, useEffect, useState } from 'react';
import axios from 'axios';

import reducer, { SET_INTERVIEW, SET_APPLICATION_DATA, SET_DAY } from 'reducers/application';

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