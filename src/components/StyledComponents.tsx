import styled from 'styled-components';
import { motion } from 'framer-motion';

// Color palette
export const colors = {
  primary: {
    light: '#63B3ED',
    main: '#4299E1',
    dark: '#3182CE',
  },
  secondary: {
    light: '#B794F4',
    main: '#805AD5',
    dark: '#6B46C1',
  },
  success: {
    light: '#68D391',
    main: '#48BB78',
    dark: '#38A169',
  },
  warning: {
    light: '#F6AD55',
    main: '#ED8936',
    dark: '#DD6B20',
  },
  error: {
    light: '#FC8181',
    main: '#E53E3E',
    dark: '#C53030',
  },
  neutral: {
    white: '#FFFFFF',
    lightest: '#F7FAFC',
    lighter: '#EDF2F7',
    light: '#E2E8F0',
    medium: '#CBD5E0',
    dark: '#718096',
    darker: '#4A5568',
    darkest: '#2D3748',
    black: '#1A202C',
  },
  gradient: {
    blue: 'linear-gradient(135deg, #63B3ED 0%, #4299E1 100%)',
    purple: 'linear-gradient(135deg, #B794F4 0%, #805AD5 100%)',
    green: 'linear-gradient(135deg, #68D391 0%, #48BB78 100%)',
    orange: 'linear-gradient(135deg, #F6AD55 0%, #ED8936 100%)',
  }
};

// Container components
export const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  font-family: 'Poppins', sans-serif;
  background-color: ${colors.neutral.lightest};
  min-height: 100vh;
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

export const Card = styled(motion.div)`
  background-color: ${colors.neutral.white};
  border-radius: 16px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
  padding: 2rem;
  margin-bottom: 2rem;
  overflow: hidden;
  border: 1px solid ${colors.neutral.lighter};
  transition: all 0.3s ease;
  
  &:hover {
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }
  
  @media (max-width: 768px) {
    padding: 1.5rem;
  }
  
  @media (max-width: 480px) {
    padding: 1rem;
  }
`;

export const FormContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

export const ResultsContainer = styled(motion.div)`
  margin-top: 2rem;
`;

// Typography components
export const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  color: ${colors.neutral.darkest};
  margin-bottom: 1rem;
  text-align: center;
  background: ${colors.gradient.blue};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1.75rem;
  }
`;

export const Subtitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: ${colors.neutral.darker};
  margin-bottom: 1rem;
  
  @media (max-width: 768px) {
    font-size: 1.3rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1.2rem;
  }
`;

export const Paragraph = styled.p`
  font-size: 1rem;
  line-height: 1.6;
  color: ${colors.neutral.darker};
  margin-bottom: 1rem;
`;

export const InfoText = styled.p`
  font-size: 0.875rem;
  color: ${colors.neutral.dark};
  margin-top: 0.5rem;
`;

export const ErrorText = styled.p`
  color: ${colors.error.main};
  font-size: 0.875rem;
  margin-top: 0.5rem;
`;

// Form components
export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 1.5rem;
  position: relative;
  
  @media (max-width: 480px) {
    margin-bottom: 1.25rem;
  }
`;

export const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 500;
  color: ${colors.neutral.darker};
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  
  svg {
    margin-left: 0.5rem;
    color: ${colors.neutral.dark};
  }
  
  @media (max-width: 480px) {
    font-size: 0.8rem;
  }
`;

export const Input = styled.input`
  padding: 0.75rem 1rem;
  border: 1px solid ${colors.neutral.light};
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.2s;
  background-color: ${colors.neutral.white};
  
  &:focus {
    outline: none;
    border-color: ${colors.primary.main};
    box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.2);
  }
  
  &:disabled {
    background-color: ${colors.neutral.lighter};
    cursor: not-allowed;
  }
  
  @media (max-width: 480px) {
    padding: 0.6rem 0.8rem;
    font-size: 0.9rem;
  }
`;

export const Select = styled.select`
  padding: 0.75rem 1rem;
  border: 1px solid ${colors.neutral.light};
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.2s;
  background-color: ${colors.neutral.white};
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23718096' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 1rem center;
  padding-right: 2.5rem;
  
  &:focus {
    outline: none;
    border-color: ${colors.primary.main};
    box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.2);
  }
  
  &:disabled {
    background-color: ${colors.neutral.lighter};
    cursor: not-allowed;
  }
  
  @media (max-width: 480px) {
    padding: 0.6rem 0.8rem;
    font-size: 0.9rem;
    padding-right: 2.2rem;
    background-position: right 0.8rem center;
  }
`;

export const Slider = styled.input.attrs({ type: 'range' })`
  -webkit-appearance: none;
  width: 100%;
  height: 6px;
  border-radius: 5px;
  background: ${colors.neutral.light};
  outline: none;
  margin: 1rem 0;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: ${colors.primary.main};
    cursor: pointer;
    transition: all 0.2s;
    
    &:hover {
      background: ${colors.primary.dark};
      transform: scale(1.1);
    }
  }

  &::-moz-range-thumb {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: ${colors.primary.main};
    cursor: pointer;
    border: none;
    transition: all 0.2s;
    
    &:hover {
      background: ${colors.primary.dark};
      transform: scale(1.1);
    }
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const SliderValue = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 0.5rem;
  font-size: 0.875rem;
  color: ${colors.neutral.dark};
`;

export const Button = styled(motion.button)`
  padding: 0.75rem 1.5rem;
  background: ${colors.gradient.blue};
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  
  svg {
    margin-right: 0.5rem;
  }
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(66, 153, 225, 0.2);
  }
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
  
  @media (max-width: 480px) {
    padding: 0.6rem 1.2rem;
    font-size: 0.9rem;
  }
`;

export const SecondaryButton = styled(Button)`
  background: white;
  color: ${colors.primary.main};
  border: 1px solid ${colors.primary.main};
  
  &:hover {
    background: ${colors.neutral.lightest};
    box-shadow: 0 4px 12px rgba(66, 153, 225, 0.1);
  }
  
  @media (max-width: 480px) {
    padding: 0.6rem 1.2rem;
    font-size: 0.9rem;
  }
`;

export const IconButton = styled(motion.button)`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${colors.neutral.white};
  border: 1px solid ${colors.neutral.light};
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: ${colors.neutral.lightest};
    border-color: ${colors.primary.main};
  }
  
  svg {
    width: 20px;
    height: 20px;
    color: ${colors.neutral.darker};
  }
`;

// Results components
export const ResultCard = styled(motion.div)`
  background-color: ${colors.neutral.lightest};
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  border-left: 4px solid ${colors.primary.main};
  transition: all 0.3s ease;
  
  &:hover {
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
    transform: translateX(2px);
  }
`;

export const ResultRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.75rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid ${colors.neutral.light};
  
  &:last-child {
    border-bottom: none;
    margin-bottom: 0;
    padding-bottom: 0;
  }
`;

export const ResultLabel = styled.span`
  font-weight: 500;
  color: ${colors.neutral.darker};
`;

export const ResultValue = styled.span`
  font-weight: 600;
  color: ${colors.neutral.darkest};
`;

export const HighlightValue = styled.span`
  font-weight: 700;
  font-size: 1.25rem;
  color: ${colors.primary.dark};
`;

// Layout components
export const Flex = styled.div`
  display: flex;
  gap: 1rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
`;

export const Divider = styled.div`
  height: 1px;
  background-color: ${colors.neutral.light};
  margin: 2rem 0;
  width: 100%;
`;

// Collapsible components
export const CollapsibleHeader = styled.div<{ isOpen?: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  padding: 1rem;
  border-radius: 8px;
  background-color: ${colors.neutral.lightest};
  margin-bottom: ${props => props.isOpen ? '1rem' : '0'};
  transition: all 0.3s ease;
  
  &:hover {
    background-color: ${colors.neutral.lighter};
  }
`;

export const CollapsibleContent = styled(motion.div)`
  overflow: hidden;
`;

// Tab components
export const Tabs = styled.div`
  display: flex;
  border-bottom: 1px solid ${colors.neutral.light};
  margin-bottom: 2rem;
  overflow-x: auto;
  scrollbar-width: none;
  
  &::-webkit-scrollbar {
    display: none;
  }
  
  @media (max-width: 768px) {
    padding-bottom: 0.5rem;
  }
`;

export const TabButton = styled.button<{ isActive?: boolean }>`
  padding: 1rem 1.5rem;
  background: transparent;
  border: none;
  border-bottom: 3px solid ${props => props.isActive ? colors.primary.main : 'transparent'};
  color: ${props => props.isActive ? colors.primary.dark : colors.neutral.dark};
  font-weight: ${props => props.isActive ? '600' : '500'};
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
  
  &:hover {
    color: ${colors.primary.main};
    background-color: ${colors.neutral.lightest};
  }
  
  @media (max-width: 768px) {
    padding: 0.75rem 1rem;
    font-size: 0.9rem;
  }
`;

export const TabContent = styled.div<{ isActive: boolean }>`
  display: ${props => props.isActive ? 'block' : 'none'};
  opacity: 1;
  transition: opacity 0.5s ease;
`;

// Badge component
export const Badge = styled.span`
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  background-color: ${props => props.color || colors.primary.light};
  color: ${colors.neutral.white};
  margin-left: 0.5rem;
`;

// Table components
export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin: 1.5rem 0;
  font-size: 0.9rem;
  table-layout: fixed;
  
  @media (max-width: 768px) {
    display: block;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    table-layout: auto;
  }
  
  @media (max-width: 480px) {
    display: block;
    white-space: normal;
    
    thead {
      display: none;
    }
    
    tbody {
      display: block;
    }
  }
`;

export const TableHeader = styled.th`
  text-align: left;
  padding: 1rem;
  background-color: ${colors.neutral.lightest};
  color: ${colors.neutral.darkest};
  font-weight: 600;
  border-bottom: 2px solid ${colors.neutral.light};
`;

export const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: ${colors.neutral.lightest};
  }
  
  &:hover {
    background-color: ${colors.primary.light}10;
  }
  
  @media (max-width: 480px) {
    display: block;
    margin-bottom: 1.5rem;
    border: 1px solid ${colors.neutral.light};
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    background-color: white;
    
    &:nth-child(even) {
      background-color: white;
    }
    
    &:hover {
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }
  }
`;

export const TableCell = styled.td`
  padding: 1rem;
  border-bottom: 1px solid ${colors.neutral.light};
  color: ${colors.neutral.darker};
  vertical-align: top;
  word-wrap: break-word;
  white-space: normal;
  
  @media (max-width: 768px) {
    white-space: normal;
  }
  
  @media (max-width: 480px) {
    display: block;
    padding: 0.75rem 1rem;
    text-align: right;
    border-bottom: 1px solid ${colors.neutral.lighter};
    position: relative;
    white-space: normal;
    
    &:before {
      content: attr(data-label);
      float: left;
      font-weight: 600;
      color: ${colors.neutral.darkest};
    }
    
    &:last-child {
      border-bottom: none;
      padding-bottom: 1rem;
    }
    
    &:first-child {
      padding-top: 1rem;
      font-weight: 600;
      background-color: ${colors.neutral.lightest};
      border-radius: 8px 8px 0 0;
    }
  }
`;

// Animation variants
export const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5 } }
};

export const slideUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

export const collapse = {
  hidden: { height: 0, opacity: 0 },
  visible: { 
    height: 'auto', 
    opacity: 1,
    transition: { 
      height: { duration: 0.3 },
      opacity: { duration: 0.3, delay: 0.1 }
    }
  }
};

export const NumberInputContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

export const NumberInput = styled(Input)`
  padding-right: 2.5rem;
  width: 100%;
  
  /* Hide default arrows in number inputs */
  &::-webkit-inner-spin-button,
  &::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  
  /* Firefox */
  -moz-appearance: textfield;
`;

export const NumberControls = styled.div`
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  width: 2rem;
  border-left: 1px solid ${colors.neutral.light};
`;

export const NumberButton = styled.button`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  cursor: pointer;
  color: ${colors.neutral.dark};
  padding: 0;
  transition: all 0.2s;
  
  &:hover {
    background-color: ${colors.neutral.lighter};
    color: ${colors.primary.main};
  }
  
  &:first-child {
    border-bottom: 1px solid ${colors.neutral.light};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`; 