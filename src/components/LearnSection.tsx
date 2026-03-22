import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, Subtitle, colors, fadeIn } from './StyledComponents';
import InfoSection from './InfoSection';
import GuaranteedIncomePlansInfo from './GuaranteedIncomePlansInfo';
import FAQ from './FAQ';

interface LearnSectionProps {
  onTabChange?: (tab: string) => void;
  initialSection?: string;
}

const sections = [
  { id: 'faq', label: 'FAQ' },
  { id: 'returns', label: 'Understanding Returns' },
  { id: 'plans', label: 'Guaranteed Plans' },
];

const LearnSection: React.FC<LearnSectionProps> = ({ onTabChange, initialSection = 'faq' }) => {
  const [activeSection, setActiveSection] = useState(initialSection);

  return (
    <motion.div variants={fadeIn} initial="hidden" animate="visible">
      {/* Sub-navigation */}
      <div style={{
        display: 'flex',
        gap: '0.5rem',
        marginBottom: '1.5rem',
        flexWrap: 'wrap'
      }}>
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => setActiveSection(section.id)}
            style={{
              padding: '0.6rem 1.2rem',
              borderRadius: '20px',
              border: activeSection === section.id ? 'none' : `1px solid ${colors.neutral.light}`,
              backgroundColor: activeSection === section.id ? colors.primary.main : colors.neutral.white,
              color: activeSection === section.id ? colors.neutral.white : colors.neutral.darker,
              fontWeight: activeSection === section.id ? 600 : 400,
              fontSize: '0.85rem',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            {section.label}
          </button>
        ))}
      </div>

      {/* Section content */}
      {activeSection === 'faq' && <FAQ />}
      {activeSection === 'returns' && <InfoSection onTabChange={onTabChange} />}
      {activeSection === 'plans' && <GuaranteedIncomePlansInfo />}
    </motion.div>
  );
};

export default LearnSection;
