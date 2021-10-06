import { useState, useEffect } from "react";
import axios from 'axios';

export default function useApplicationData() {

  const [state, setState] = useState({
    day: "Monday",
    days: [],
    interviewers: null
  });

  const setDay = day => setState(prev => ({ ...prev, day }));

  function bookInterview(id, interview) {
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };
    const newState = {
      ...state,
      appointments
    };

    return axios.put(`/api/appointments/${id}`, { ...appointment })
      .then(() => updateSpots(newState))
  };

  function cancelInterview(id) {
    const appointment = {
      ...state.appointments[id]
    }
    appointment.interview = null;

    const appointments = {
      ...state.appointments,
      [id]: appointment
    };

    const newState = {
      ...state,
      appointments
    }

    return axios.delete(`/api/appointments/${id}`)
      .then(() => updateSpots(newState))
  }

  useEffect(() => {
    Promise.all([
      axios.get('/api/days'),
      axios.get('/api/appointments'),
      axios.get('/api/interviewers')
    ]).then((all) => {
      const days = [...all[0].data];
      const appointments = {...all[1].data};
      const interviewers = {...all[2].data};
      setState( prev => ({...prev, days, appointments, interviewers }));
    })
  }, [])


  const updateSpots = (newState) => {
    const todayString = newState.day;
    const todayObject = newState.days.find( d => d.name === todayString);
    const todayObjIndex = newState.days.findIndex( d => d.name === todayString);
    const todayAppIds = todayObject.appointments;

    
    let freeSpots = 0;
    for (const appId of todayAppIds) {
      if (newState.appointments[appId].interview === null) {
        freeSpots += 1;
      }
    }

    const newTodayObject = {...todayObject, spots: freeSpots};
    const newDays = [...newState.days];
    newDays[todayObjIndex] = newTodayObject;

    setState({...newState, days: newDays});

  }


  return {state, setState, setDay, bookInterview, cancelInterview}
}

