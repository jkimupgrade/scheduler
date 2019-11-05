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
    // Click the "Add" button on the first empty appointment.
    const appointment = getAllByTestId(container, 'appointment')[0];
    
    fireEvent.click(getByAltText(appointment, 'Add'));

    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: 'Lydia Miller-Jones' }
    });
    
    fireEvent.click(getByAltText(appointment, 'Sylvia Palmer'));

    fireEvent.click(getByText(appointment, 'Save'));

    // 'Saving' should be available while appointment is saving
    expect(getByText(appointment, 'Saving')).toBeInTheDocument();

    // // 2 approaches to waiting for disappearance (Saving)
    // // await waitForElement(() => getByText(appointment, 'Lydia Miller-Jones'));
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

});

