import React, { useState, useEffect } from "react";
import axios from 'axios';

export default function useApplicationData() {

  const [state, setState] = useState({
    day: "Monday",
    days: [],
    // you may put the line below, but will have to remove/comment hardcoded appointments variable
    //appointments: {}
    interviewers: null
  });

  const setDay = day => setState(prev => ({ ...prev, day }));

  function bookInterview(id, interview) {
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };
    // console.log('When I create appointment from ...state.appointments[id] it looks like this:', appointment);
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };
    // console.log('After creating a new appointments, this is my state obj:', state);
    // console.log('And I created this new appointments object:', appointments)

    const newState = {
      ...state,
      appointments
    };
    // console.log('This is the old state', state);
    console.log('This is newState, right before setting it and calling updateSpots', newState);

    // setState(newState);
    // console.log(id, interview);

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
      // console.log(all); 
      const days = [...all[0].data];
      const appointments = {...all[1].data};
      const interviewers = {...all[2].data};
      // console.log(interviewers)
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


// export default {state, setState, setDay, bookInterview, cancelInterview};