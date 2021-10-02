export function getAppointmentsForDay(state, day) {
  const foundDayArr = state.days.filter( dayObj => dayObj.name === day);
  if (!foundDayArr.length) return [];

  const appointmentIds = foundDayArr[0].appointments;

  const appsArray = [];

  for (const id of appointmentIds) {
    appsArray.push(state.appointments[id])
  }

  return appsArray;

}

export function getInterview(state, interview) {
  if (!interview) return null;

  const interviewerId = interview.interviewer;
  const fullInterviewObj = {...interview};

  if (!state.interviewers[interviewerId]) return null;

  fullInterviewObj.interviewer = {...state.interviewers[interviewerId]};

  return fullInterviewObj;

}

export function getInterviewersForDay(state, day) {
  const foundDayArr = state.days.filter( dayObj => dayObj.name === day);
  if (!foundDayArr.length) return [];

  const interviewerIds = foundDayArr[0].interviewers;

  const intsArray = [];

  for (const id of interviewerIds) {
    intsArray.push(state.interviewers[id])
  }

  return intsArray;

}