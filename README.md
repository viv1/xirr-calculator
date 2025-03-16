# XIRR Calculator for Insurance Plans

A modern web application to calculate the actual returns (XIRR, IRR, CAGR) on insurance plans, ULIPs, and guaranteed income plans. This tool helps users understand the true value of their investments and compare them with other investment options.

## Features

- Calculate XIRR (Extended Internal Rate of Return) for complex cash flows
- Calculate IRR (Internal Rate of Return) for regular investments
- Calculate CAGR (Compound Annual Growth Rate) for simple investments
- Support for both annual and monthly payment/payout frequencies
- Preset plans for common insurance scenarios
- Visual representation of returns with color-coded indicators
- Comparison with common investment options like FD, PPF, and index funds
- Educational content about investment returns and common misleading practices

## Tech Stack

- React 19
- TypeScript
- Vite (for fast builds and development)
- Framer Motion (for animations)
- Styled Components (for styling)
- Vitest (for testing)

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm (v7 or higher)

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/xirr-calculator.git
   cd xirr-calculator
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Start the development server
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:3000`

## Building for Production

To create a production build:

```bash
npm run build
```

To preview the production build locally:

```bash
npm run preview
```

## Testing

Run tests:

```bash
npm test
```

Run tests in watch mode:

```bash
npm run test:watch
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Financial.js library for core financial calculations
- React community for the amazing ecosystem
- All contributors who have helped improve this tool
