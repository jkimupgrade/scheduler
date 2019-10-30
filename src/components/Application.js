import React, { useState, useEffect } from 'react';
import axios from 'axios';

import 'components/Application.scss';
import Appointment from 'components/Appointment';

import DayList from './DayList';

const appointments = [
  {
    id: 1,
    time: "12pm",
  },
  {
    id: 2,
    time: "1pm",
    interview: {
      student: "Lydia Miller-Jones",
      interviewer: {
        id: 1,
        name: "Sylvia Palmer",
        avatar: "https://i.imgur.com/LpaY82x.png",
      }
    }
  },
  {
    id: 3,
    time: "3pm",
    interview: {
      student: "Student 3",
      interviewer: {
        id: 3,
        name: "Mildred Nazir", 
        avatar: "https://i.imgur.com/T2WwVfS.png",
      }
    }
  },
  {
    id: 4,
    time: "4pm",
    interview: {
      student: "Student 4",
      interviewer: {
        id: 4, 
        name: "Cohana Roy", 
        avatar: "https://i.imgur.com/FK8V841.jpg",
      }
    }
  },
  {
    id: 5,
    time: "5pm",
    interview: {
      student: "Student 5",
      interviewer: {
        id: 1,
        name: "Sylvia Palmer",
        avatar: "https://i.imgur.com/LpaY82x.png",
      }
    }
  }
];

export default function Application(props) {
  const [day, setDay] = useState('Monday');

  const [days, setDays] = useState([]);

  useEffect(() => {
    axios.get('/api/days')
    .then((response) => {
      setDays(response.data);
    })
    .catch((error) => {
      console.log(error.response.status);
      console.log(error.response.headers);
      console.log(error.response.data);
    })
  }, []);

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
              days={days}
              day={day}
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
        {appointments.map((appointment) => {
          return (
            <Appointment key={appointment.id} {...appointment} />
          )
        })}
        <Appointment key="last" time="7pm" />
      </section>
    </main>
  );
}