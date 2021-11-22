import { useState, useReducer, useEffect } from "react";
import axios from 'axios';

export default function useApplicationData() {

  const SET_DAY = "SET_DAY";
  const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
  const SET_INTERVIEW = "SET_INTERVIEW";

  const [state, dispatch] = useReducer(
    reducer,
    {
      day: "Monday",
      days: [],
      interviewers: null
    }
  );

  function reducer(state, action) {
    switch (action.type) {
      case SET_DAY:
        return { 
          ...state,
          day: action.value
         }
      case SET_APPLICATION_DATA:
        return { 
          ...state,
          ...action.value
         }
      case SET_INTERVIEW: {
        return /* insert logic */
      }
      default:
        throw new Error(
          `Tried to reduce with unsupported action type: ${action.type}`
        );
    }
  }

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

    return axios.put(`/api/appointments/${id}`, { ...appointment })
      .then(() => {
        const days = updateSpots(state, appointments)
        setState({...state, days, appointments})
      })
  };

  function cancelInterview(id) {
    const appointment = {...state.appointments[id], interview: null}

    const appointments = {
      ...state.appointments,
      [id]: appointment
    };


    return axios.delete(`/api/appointments/${id}`)
      .then(() => {
        const days = updateSpots(state, appointments)
        setState({...state, days, appointments})
      })
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


  const updateSpots = (state, appointments) => {
    const todayString = state.day;
    const todayObject = state.days.find( d => d.name === todayString);
    const todayObjIndex = state.days.findIndex( d => d.name === todayString);
    const todayAppIds = todayObject.appointments;

    
    let freeSpots = 0;
    for (const appId of todayAppIds) {
      if (appointments[appId].interview === null) {
        freeSpots += 1;
      }
    }

    const newTodayObject = {...todayObject, spots: freeSpots};
    const newDays = [...state.days];
    newDays[todayObjIndex] = newTodayObject;

    return newDays;

  }


  return {state, setState, setDay, bookInterview, cancelInterview}
}

