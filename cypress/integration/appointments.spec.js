describe('Appointments', () => {
  beforeEach(() => {
    // POST to /api/debug/reset
    cy.request('GET', '/api/debug/reset');
    // Visits the root of our web server
    cy.visit('/');
    cy.contains('Monday');
  })


  it('should book an interview', () => {
    // Clicks on the 'Add' button in the second appointment
    // Enters their name
    // Chooses an interviewer
    // Clicks the save button
    // Sees the booked appointment
  
    cy.get('[alt=Add]')
      .first()
      .click();

    cy.get('[data-testid=student-name-input]').type('Lydia Miller-Jones');

    cy.get("[alt='Sylvia Palmer']").click();

    cy.contains('Save').click();

    cy.contains('.appointment__card--show', 'Lydia Miller-Jones');
    cy.contains('.appointment__card--show', 'Sylvia Palmer');
  })

  xit('', () => {
    // POST to /api/debug/reset
    cy.request('GET', '/api/debug/reset');
    // Visits the root of our web server
    // Clicks the edit button for the existing appointment
    // Changes the name and interviewer
    // Clicks the save button
    // Sees the edit to the appointment
    cy.visit('/');
    cy.contains('Monday');
    // POST to /api/debug/reset

  })

  xit('', () => {
    // POST to /api/debug/reset
    cy.request('GET', '/api/debug/reset');
    // Visits the root of our web server
    // Clicks the delete button for the existing appointment
    // Clicks the confirm button
    // Sees that the appointment slot is empty
    cy.visit('/');
    cy.contains('Monday');
    // POST to /api/debug/reset

  })

});