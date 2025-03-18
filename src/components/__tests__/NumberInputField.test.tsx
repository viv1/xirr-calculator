import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom';
import { useState } from 'react';
import NumberInputField from '../NumberInputField';

interface TestWrapperProps {
  initialValue?: number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
}

// Helper component to test controlled behavior
const TestWrapper: React.FC<TestWrapperProps> = ({
  initialValue = 100,
  onChange = vi.fn(),
  min,
  max,
  step,
  disabled
}) => {
  const [value, setValue] = useState(initialValue);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(Number(e.target.value));
    onChange(e);
  };

  return (
    <NumberInputField
      id="test-input"
      name="test-input"
      value={value}
      onChange={handleChange}
      min={min}
      max={max}
      step={step}
      disabled={disabled}
    />
  );
};

describe('NumberInputField Component', () => {
  it('renders with initial value', () => {
    const onChange = vi.fn();
    render(<TestWrapper initialValue={100} onChange={onChange} />);

    const input = screen.getByRole('spinbutton');
    expect(input).toHaveValue(100);
  });

  it('calls onChange when value is changed', async () => {
    const onChange = vi.fn();
    render(<TestWrapper initialValue={100} onChange={onChange} />);

    const input = screen.getByRole('spinbutton');
    await userEvent.clear(input);
    await userEvent.type(input, '200');
    
    expect(onChange).toHaveBeenCalled();
    const lastCall = onChange.mock.calls[onChange.mock.calls.length - 1];
    const event = lastCall[0];
    expect(event.target.name).toBe('test-input');
    expect(Number(event.target.value)).toBe(200);
  });

  it('handles invalid input gracefully', async () => {
    const onChange = vi.fn();
    render(<TestWrapper initialValue={100} onChange={onChange} />);

    const input = screen.getByRole('spinbutton');
    await userEvent.clear(input);
    
    // Reset the mock to ignore the clear event
    onChange.mockReset();
    
    // Try to type non-numeric input
    await userEvent.type(input, 'abc');
    
    // The browser will prevent non-numeric input, leaving the value as 0 or empty
    expect(input).toHaveValue(0);
    expect(onChange).not.toHaveBeenCalled();
  });

  it('respects min and max constraints', async () => {
    const onChange = vi.fn();
    render(
      <TestWrapper
        initialValue={50}
        onChange={onChange}
        min={0}
        max={100}
      />
    );

    const input = screen.getByRole('spinbutton');
    
    // Verify min/max attributes are set
    expect(input).toHaveAttribute('min', '0');
    expect(input).toHaveAttribute('max', '100');
    
    // Test increment button at max value
    await userEvent.clear(input);
    await userEvent.type(input, '100');
    
    const incrementButton = screen.getByLabelText('Increment');
    await userEvent.click(incrementButton);
    
    // Value should not change when clicking increment at max
    expect(input).toHaveValue(100);
    
    // Test decrement button at min value
    await userEvent.clear(input);
    await userEvent.type(input, '0');
    
    const decrementButton = screen.getByLabelText('Decrement');
    await userEvent.click(decrementButton);
    
    // Value should not change when clicking decrement at min
    expect(input).toHaveValue(0);
  });

  it('handles step increments correctly', async () => {
    const onChange = vi.fn();
    render(<TestWrapper initialValue={100} onChange={onChange} step={10} />);

    const incrementButton = screen.getByLabelText('Increment');
    await userEvent.click(incrementButton);
    
    expect(onChange).toHaveBeenCalled();
    const lastCall = onChange.mock.calls[onChange.mock.calls.length - 1];
    const event = lastCall[0];
    expect(Number(event.target.value)).toBe(110);
  });

  it('handles disabled state correctly', async () => {
    const onChange = vi.fn();
    render(<TestWrapper initialValue={100} onChange={onChange} disabled={true} />);

    const input = screen.getByRole('spinbutton');
    const incrementButton = screen.getByLabelText('Increment');
    const decrementButton = screen.getByLabelText('Decrement');

    expect(input).toBeDisabled();
    expect(incrementButton).toBeDisabled();
    expect(decrementButton).toBeDisabled();

    await userEvent.type(input, '200');
    await userEvent.click(incrementButton);
    await userEvent.click(decrementButton);

    expect(onChange).not.toHaveBeenCalled();
  });

  it('disables buttons when at min/max values', () => {
    const onChange = vi.fn();
    render(
      <TestWrapper
        initialValue={100}
        onChange={onChange}
        min={0}
        max={100}
      />
    );

    const incrementButton = screen.getByLabelText('Increment');
    const decrementButton = screen.getByLabelText('Decrement');

    // When value is at max (100), increment button should be disabled
    expect(incrementButton).toBeDisabled();
    // When value is at max (100), decrement button should be enabled
    expect(decrementButton).not.toBeDisabled();
  });
}); 