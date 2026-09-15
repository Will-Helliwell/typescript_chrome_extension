import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

// jsdom has no real `alert`, and calling the stub logs a "not implemented"
// error. Replace it so the component can call it and tests can assert on it.
let alertSpy: jest.SpyInstance;

beforeEach(() => {
  alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});
});

describe('App', () => {
  it('renders the title it is given', () => {
    render(<App title="My Extension" />);

    expect(
      screen.getByRole('heading', { name: 'My Extension' })
    ).toBeInTheDocument();
  });

  it('starts at a count of zero', () => {
    render(<App title="My Extension" />);

    expect(screen.getByText('Click count: 0')).toBeInTheDocument();
  });

  it('increments the count on each click', async () => {
    const user = userEvent.setup();
    render(<App title="My Extension" />);
    const button = screen.getByRole('button', { name: 'Click Me' });

    await user.click(button);
    expect(screen.getByText('Click count: 1')).toBeInTheDocument();

    await user.click(button);
    expect(screen.getByText('Click count: 2')).toBeInTheDocument();
  });

  it('alerts with the updated count', async () => {
    const user = userEvent.setup();
    render(<App title="My Extension" />);

    await user.click(screen.getByRole('button', { name: 'Click Me' }));

    expect(alertSpy).toHaveBeenCalledWith('Button clicked 1 times!');
  });
});
