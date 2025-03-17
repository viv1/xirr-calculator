import React from 'react';
import { NumberInputContainer, NumberInput, NumberControls, NumberButton } from './StyledComponents';

interface NumberInputFieldProps {
  id: string;
  name: string;
  value: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onIncrement?: () => void;
  onDecrement?: () => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
}

const NumberInputField: React.FC<NumberInputFieldProps> = ({
  id,
  name,
  value,
  onChange,
  onIncrement,
  onDecrement,
  min,
  max,
  step = 1,
  disabled = false
}) => {
  const handleIncrement = () => {
    if (onIncrement) {
      onIncrement();
    } else {
      const newValue = value + step;
      if (max === undefined || newValue <= max) {
        const event = {
          target: {
            name,
            value: newValue.toString()
          }
        } as React.ChangeEvent<HTMLInputElement>;
        onChange(event);
      }
    }
  };

  const handleDecrement = () => {
    if (onDecrement) {
      onDecrement();
    } else {
      const newValue = value - step;
      if (min === undefined || newValue >= min) {
        const event = {
          target: {
            name,
            value: newValue.toString()
          }
        } as React.ChangeEvent<HTMLInputElement>;
        onChange(event);
      }
    }
  };

  return (
    <NumberInputContainer>
      <NumberInput
        type="number"
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        min={min}
        max={max}
        step={step}
        disabled={disabled}
      />
      <NumberControls>
        <NumberButton 
          type="button" 
          onClick={handleIncrement} 
          disabled={disabled || (max !== undefined && value >= max)}
          aria-label="Increment"
        >
          ▲
        </NumberButton>
        <NumberButton 
          type="button" 
          onClick={handleDecrement} 
          disabled={disabled || (min !== undefined && value <= min)}
          aria-label="Decrement"
        >
          ▼
        </NumberButton>
      </NumberControls>
    </NumberInputContainer>
  );
};

export default NumberInputField; 