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
      .then(() => setState(newState))
      .then(() => updateSpots(id, true))
      .catch(e => console.log(e))
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
      .then(() => setState(newState))
      .then(() => updateSpots(id, false))
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

  const updateSpots = (id, adding) => {

    // setState({
    //   ...state,
    //   days: [...state.days, state.days[id]]
    // })

    
    // Old attempt
    console.log('From updateSpots, this is what state looked like:', state); // This state is stale!
    const todayString = state.day;
    const todayObject = state.days.find( d => d.name === todayString);
    const todayObjIndex = state.days.findIndex( d => d.name === todayString);
    console.log(`${id} should always match ${todayObjIndex}`);
    const oldSpots = todayObject.spots;
    const todayAppIds = todayObject.appointments;

    // console.log('Today app ids:', todayAppIds);
    // console.log('State.appointments:',state.appointments);

    const newSpots = adding ? oldSpots-1 : oldSpots+1;


    /*
    // This would work if state wasn't stale, but since state.appointments hasn't been updated
    // and contains an incorrect number of null values I had to try something else.
    let freeSpots = 0;
    for (const appId of todayAppIds) {
      if (state.appointments[appId].interview === null) {
        // console.log('Adding a free spot because the interview was null for appointment id:',appId)
        freeSpots += 1;
      }
    }
    console.log(freeSpots, "is what freeSpots was after the loop");

    */

    const newTodayObject = {...todayObject, spots: newSpots}; // I think this is going to break eventually, because it's creating a stale object.
    const newDays = [...state.days];
    newDays[todayObjIndex] = newTodayObject;

    setState(prev => ({...prev, days: newDays}));

    // console.log('Today has this many spots now: ',freeSpots);

    
  }

  return {state, setState, setDay, bookInterview, cancelInterview, updateSpots}
}


// export default {state, setState, setDay, bookInterview, cancelInterview};