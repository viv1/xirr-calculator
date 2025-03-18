# CheckMyReturns.in - XIRR Calculator for Insurance Plans

[![Website](https://img.shields.io/website?url=https%3A%2F%2Fcheckmyreturns.in&label=Website)](https://checkmyreturns.in)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React 19](https://img.shields.io/badge/React-19-61DAFB?style=flat&logo=react&logoColor=white)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Styled Components](https://img.shields.io/badge/Styled_Components-DB7093?style=flat&logo=styled-components&logoColor=white)](https://styled-components.com/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-0055FF?style=flat&logo=framer&logoColor=white)](https://www.framer.com/motion/)
[![Vitest](https://img.shields.io/badge/Vitest-6E9F18?style=flat&logo=vitest&logoColor=white)](https://vitest.dev/)

## 🔍 Overview

**CheckMyReturns.in** is a powerful financial tool designed to help investors understand the true value of their insurance plans, ULIPs, and guaranteed income plans. Using rigorous financial calculations, this tool reveals the actual returns (XIRR, IRR, CAGR) on your investments, allowing you to make informed financial decisions.

> 💡 **Visit the live site**: [https://checkmyreturns.in](https://checkmyreturns.in)

## 🌟 Key Features

- **Comprehensive Return Calculations**
  - Calculate XIRR (Extended Internal Rate of Return) for complex cash flows
  - Calculate IRR (Internal Rate of Return) for regular investments
  - Calculate CAGR (Compound Annual Growth Rate) for simple investments

- **Flexible Payment Options**
  - Support for annual, half-yearly, quarterly, and monthly payment frequencies
  - Customizable payment periods and amounts

- **Advanced Analysis Tools**
  - Tax-adjusted returns based on your income tax bracket
  - Visual representation of returns with color-coded indicators
  - Comparison with other investment options (FD, PPF, index funds)

- **Educational Content**
  - Detailed explanations of financial concepts
  - Information about misleading marketing practices in insurance
  - Guides on how to evaluate investment returns correctly

- **User-Friendly Experience**
  - Modern, responsive interface
  - Preset plans for common insurance scenarios
  - Easy sharing of results via social media and email

## 🔬 Advanced Capabilities

Unlike basic XIRR calculators available online, CheckMyReturns.in offers sophisticated features specifically designed for complex financial products:

- **Multi-phase Investment Analysis**: Accurately model insurance plans with different phases (payment period, waiting period, payout period)
- **Guaranteed Income Plan Evaluation**: Specialized tools to analyze the true returns of guaranteed income plans, which typically have complex payment structures
- **Comprehensive Cash Flow Modeling**: Handle any combination of premiums, payouts, and lump sum amounts over different time periods
- **Accurate Tax Impact Assessment**: Calculate the actual post-tax returns based on different tax treatments of various investment products
- **Realistic Return Projections**: Account for factors like payment frequency, which many simple calculators ignore but significantly impact actual returns

## 🔄 Sharing & Collaboration

CheckMyReturns.in makes it easy to share your analysis:

- **Shareable Links**: Generate unique URLs that capture all your calculation parameters
- **Social Media Integration**: Share your results directly on multiple platforms:
  - WhatsApp
  - Email
  - X (formerly Twitter)
  - Reddit
- **Clipboard Support**: Copy calculation results with a single click
- **Persistent State**: All calculation parameters are saved in URL parameters, allowing you to easily bookmark or share specific scenarios

## 🔒 Privacy & Data Handling

CheckMyReturns.in is designed with privacy in mind:

- **100% Browser-Based Calculations**: All calculations are performed locally in your browser
- **No Backend Database**: We don't store any of your financial information on servers
- **No Account Required**: Use the full functionality without creating an account or providing personal details
- **Stateless Architecture**: Your data remains on your device and is never transmitted to us
- **URL Parameter Storage**: All calculation parameters are stored only in URL parameters for sharing

**Note on Analytics**: We currently use Google Analytics to collect anonymous usage data to help improve the application. This tracking is limited to basic interaction metrics and contains no personal or financial information. We plan to phase out Google Analytics in a future update in favor of a more privacy-focused analytics solution.

## 📊 Why Use This Tool?

Many insurance and investment products advertise attractive returns without clearly explaining how these numbers are calculated. Our tool helps you:

- **Cut through marketing jargon** and understand the true returns on your investments
- **Compare different plans** objectively using standardized financial metrics
- **Make informed decisions** about where to invest your hard-earned money
- **Understand tax implications** of different investment options

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm (v7 or higher)

### Installation and Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/xirr-calculator.git
   cd xirr-calculator
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser** and navigate to `http://localhost:5173`

## 🛠️ Building for Production

To create a production build:

```bash
npm run build
```

To preview the production build locally:

```bash
npm run preview
```

## 🧪 Testing

Run tests:

```bash
npm test
```

Run tests in watch mode:

```bash
npm test -- --run
```

Generate test coverage report:

```bash
npm run test:coverage
```

## 🧩 Tech Stack

- **Frontend Framework**: React 19 with TypeScript
- **Build Tool**: Vite
- **Styling**: Styled Components
- **Animations**: Framer Motion
- **Financial Calculations**: Custom implementations of XIRR, IRR, CAGR
- **Testing**: Vitest with React Testing Library
- **Deployment**: GitHub Pages

## 📱 Responsive Design

The application is fully responsive and works seamlessly on:
- Desktop computers
- Tablets
- Mobile phones

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- [Financial.js](https://github.com/lmammino/financial.js) library for core financial calculations
- The React community for the amazing ecosystem

---

<p align="center">Made with ❤️ for transparency in financial products</p>
<p align="center"><a href="https://checkmyreturns.in">https://checkmyreturns.in</a></p>
