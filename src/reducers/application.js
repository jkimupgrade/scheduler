export const SET_DAY = 'SET_DAY';
export const SET_APPLICATION_DATA = 'SET_APPLICATION_DATA';
export const SET_INTERVIEW = 'SET_INTERVIEW';

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

// reducer to update state
export default function reducer(state, action) {
  
  const dict = {
    // SET_DAY: () => ({...state, day: action.day }),
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