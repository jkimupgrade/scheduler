import React from "react";

import { render, cleanup, waitForElement, getByText, getAllByTestId, getByAltText, getByPlaceholderText, prettyDOM, waitForElementToBeRemoved, queryByText } from "@testing-library/react";

import Application from "components/Application";
import { fireEvent } from "@testing-library/react/dist";

afterEach(cleanup);

describe('Application', () => {
  xit("renders without crashing", () => {
    render(<Application />);
  });
  
  it("defaults to Monday and changes the schedule when a new day is selected", async () => {
    const { getByText } = render(<Application />);
  
    await waitForElement(() => getByText('Monday'));
  
    fireEvent.click(getByText('Tuesday'));
    
    expect(getByText('Leopold Silvers')).toBeInTheDocument();
  });
  
  it('loads data, books an interview and reduces the spots remaining for the first day by 1', async () => {
    // Render the Application.
    const { container, debug } = render(<Application />);
    // Wait until the text "Archie Cohen" is displayed.
    await waitForElement(() => getByText(container, 'Archie Cohen'));
    // get the first empty appointment
    const appointment = getAllByTestId(container, 'appointment')[0];
    // click the Add img
    fireEvent.click(getByAltText(appointment, 'Add'));
    // enter student name 
    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: 'Lydia Miller-Jones' }
    });
    // select interviewer (1st one)
    fireEvent.click(getByAltText(appointment, 'Sylvia Palmer'));
    // click Save button 
    fireEvent.click(getByText(appointment, 'Save'));

    // 'Saving' should be available while appointment is saving
    expect(getByText(appointment, 'Saving')).toBeInTheDocument();

    // // 2 approaches to waiting for disappearance (Saving)
    // await waitForElement(() => getByText(appointment, 'Lydia Miller-Jones'));
    await waitForElementToBeRemoved(() => getByText(appointment, 'Saving'));

    // debug()
    expect(queryByText(appointment, 'Saving')).not.toBeInTheDocument();
    expect(getByText(appointment, 'Lydia Miller-Jones')).toBeInTheDocument();

    // find specific day node that contains the text 'Monday'
    const day = getAllByTestId(container, 'day').find(day => 
      queryByText(day, 'Monday')
    );

    // Monday should have no spots remaining
    expect(getByText(day, 'no spots remaining')).toBeInTheDocument();
    
  });

  it("loads data, cancels an interview and increases the spots reamining for Monday by 1", async () => {
    // 1. Render the Application.
    // 2. Wait until the text "Archie Cohen" is displayed.
    // 3. Click the "Delete" button on the booked appointment.
    // 4. Check that the confirmation message is shown.
    // 5. Click the "Confirm" button on the confirmation.
    // 6. Check that the element with the text "Deleting" is displayed.
    // 7. Wait until the element with the "Add" button is displayed.
    // 8. Check that the DayListItem with the text "Monday" also has the text "2 spots remaining".
    
    const { container, debug } = render(<Application />);

    await waitForElement(() => getByText(container, 'Archie Cohen'));
    
    const appointment = getAllByTestId(container, 'appointment').find(
      appointment => queryByText(appointment, 'Archie Cohen')
    );

    fireEvent.click(getByAltText(appointment, 'Delete'));

    expect(getByText(appointment, 'Are you sure you want to cancel?')).toBeInTheDocument();

    fireEvent.click(getByText(appointment, 'Confirm'));

    expect(getByText(appointment, 'Deleting')).toBeInTheDocument();

    await waitForElement(() => getByAltText(appointment, 'Add'));

    const day = getAllByTestId(container, 'day').find(day =>
      queryByText(day, 'Monday')
    );

    expect(getByText(day, '2 spots remaining'));
  });

  it("loads data, edits an interview and keeps the spots remaining for Monday the same", async () => {
    // 1. Render the Application.
    // 2. Wait until the text "Archie Cohen" is displayed.
    // 3. Click the "Edit" button on the booked appointment.
    // 4. Change student name
    // 5. Click save button
    // 6. Check that the element with the text "Saving" is displayed.
    // 7. Wait until the element with the new student name is displayed.
    // 8. Check that the DayListItem with the text "Monday" also has the text "1 spot remaining".
  
    const { container, debug } = render(<Application />);

    await waitForElement(() => getByText(container, 'Archie Cohen'));

    const appointment = getAllByTestId(container, 'appointment').find(
      appointment => queryByText(appointment, 'Archie Cohen')
    );

    fireEvent.click(getByAltText(appointment, 'Edit'));

    fireEvent.change(getByPlaceholderText(appointment, "Enter Student Name"), {
      target: { value: "Jim Kim" }
    });

    fireEvent.click(getByText(appointment, 'Save'));

    expect(getByText(appointment, 'Saving')).toBeInTheDocument();

    await waitForElement(() => getByText(appointment, 'Jim Kim'));

    const day = getAllByTestId(container, 'day').find(day =>
      queryByText(day, 'Monday')
    );
    
    expect(getByText(day, '1 spot remaining'));
  });

  it("shows the save error when failing to save an appointment", async () => {
    
  });

  it("shows the delete error when failing to delete an existing appointment", async () => {
    
  });

});

