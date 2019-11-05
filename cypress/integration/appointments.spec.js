describe('Appointments', () => {

  it('should book an interview', () => {
    // Visits the root of our web server
    // Clicks on the 'Add' button in the second appointment
    // Enters their name
    // Chooses an interviewer
    // Clicks the save button
    // Sees the booked appointment
    cy.visit('/');
    cy.contains('Monday');

    
    // POST to /api/debug/reset
  })

  it('', () => {
    // Visits the root of our web server
    // Clicks the edit button for the existing appointment
    // Changes the name and interviewer
    // Clicks the save button
    // Sees the edit to the appointment
    cy.visit('/');
    cy.contains('Monday');
    // POST to /api/debug/reset

  })

  it('', () => {
    // Visits the root of our web server
    // Clicks the delete button for the existing appointment
    // Clicks the confirm button
    // Sees that the appointment slot is empty
    cy.visit('/');
    cy.contains('Monday');
    // POST to /api/debug/reset

  })

});