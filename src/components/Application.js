import React from "react";
import DayList from "./DayList";
import Appointment from "components/Appointment";
import { getAppointmentsForDay, getInterview, getInterviewersForDay } from "helpers/selectors";
import useApplicationData from "hooks/useApplicationData";

import "components/Application.scss";

/* Displays a DayList on the sidebar and all the appointments
 * on the schedule.
 * Imports all data handling functions from useApplicationData hook.
 */
export default function Application(props) {
  const {
    state,
    setDay,
    bookInterview,
    cancelInterview
  } = useApplicationData();
  
  // state parameter for these functions provided by useApplicationData
  // through its useEffect hook, which uses Axios to query the server.
  const interviewers = getInterviewersForDay(state, state.day);
  const dailyAppointments = getAppointmentsForDay(state, state.day);

  // Replaces dailyAppointments interview IDs with full interview objects.
  const parsedAppointments = dailyAppointments.map( appointment => {

    const interview = getInterview(state, appointment.interview);

    return (
      <Appointment 
        key={appointment.id}
        {...appointment}
        interview={interview}
        interviewers={interviewers}
        bookInterview={bookInterview}
        cancelInterview={cancelInterview}
        />
      );
  });
  parsedAppointments.push(<Appointment key="last" time="5pm" />)

  

  return (
    <main className="layout">
      <section className="sidebar">
      <img
        className="sidebar--centered"
        src="images/logo.png"
        alt="Interview Scheduler"
      />
      <hr className="sidebar__separator sidebar--centered" />
      <nav className="sidebar__menu">
        <DayList
          days={state.days}
          day={state.day}
          setDay={setDay}
        />
      </nav>
      <img
        className="sidebar__lhl sidebar--centered"
        src="images/lhl.png"
        alt="Lighthouse Labs"
      />
      </section>
      <section className="schedule">
        {parsedAppointments}
      </section>
    </main>
  );
}
