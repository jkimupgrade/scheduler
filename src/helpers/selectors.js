export function getAppointmentsForDay(state, day) {
  const temp = {...state};
  const result = temp.days.filter(element => element.name === day);

  if (result.length === 0) {
    return [];
  }
  return result[0].appointments.map(appointmentId => temp.appointments[appointmentId]);
}

export function getInterview(state, interview) {
  const temp = {...state};
  
  if (!interview) {
    return null;
  }
  return {
    student: interview.student,
    interviewer: temp.interviewers[String(interview.interviewer)]
  }
}

export function getInterviewersForDay(state, day) {
  const temp = {...state};
  
  const result = temp.days.filter(element => element.name === day);

  if (result.length === 0) {
    return [];
  }
  return result[0].interviewers.map(interviewerId => temp.interviewers[interviewerId]);
}