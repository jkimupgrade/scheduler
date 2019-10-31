export function getAppointmentsForDay(state, day) {
  const result = state.days.filter(element => element.name === day);

  if (result.length === 0) {
    return [];
  }
  return result[0].appointments.map(appointmentId => state.appointments[appointmentId]);
}

export function getInterview(state, interview) {
  if (!interview) {
    return null;
  }
  return {
    student: interview.student,
    interviewer: state.interviewers[String(interview.interviewer)]
  }
}

export function getInterviewersForDay(state, day) {
  const result = state.days.filter(element => element.name === day);

  if (result.length === 0) {
    return [];
  }
  return result[0].interviewers.map(interviewerId => state.interviewers[interviewerId]);
}