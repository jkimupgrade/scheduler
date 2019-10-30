export function getAppointmentsForDay(state, day) {
  const result = state.days.filter(element => element.name === day);

  if (result.length === 0) {
    return [];
  }
  return result[0].appointments.map(appointmentId => state.appointments[appointmentId]);
}
