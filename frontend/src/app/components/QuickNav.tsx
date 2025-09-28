'use client';

import { 
  Mountain, 
  Calendar, 
  MapPin, 
  Backpack, 
  Dumbbell, 
  DollarSign, 
  HelpCircle, 
  Route
} from 'lucide-react';

export function QuickNav() {
  const sections = [
    { id: "is-tmb-right", title: "Is TMB Right for Me?", icon: HelpCircle },
    { id: "when-to-go", title: "When to Go", icon: Calendar },
    { id: "choose-itinerary", title: "Choose Your Itinerary", icon: Route },
    { id: "booking", title: "Booking Your Trip", icon: MapPin },
    { id: "training", title: "Training & Fitness", icon: Dumbbell },
    { id: "packing", title: "Packing & Gear", icon: Backpack },
    { id: "on-trail", title: "On the Trail", icon: Mountain },
    { id: "budgeting", title: "Budgeting", icon: DollarSign },
    { id: "faqs", title: "FAQs", icon: HelpCircle },
  ];

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav style={{
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(10px)',
      border: `1px solid var(--ds-border)`,
      borderRadius: '12px',
      padding: '1.5rem',
      boxShadow: 'var(--shadow-soft)',
      position: 'sticky',
      top: '1rem',
      zIndex: 10,
      marginBottom: '3rem'
    }}>
      <h2 style={{
        fontSize: 'var(--text-lg)',
        fontWeight: '600',
        marginBottom: '1rem',
        color: 'var(--ds-foreground)',
        textAlign: 'center'
      }}>
        Quick Navigation
      </h2>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '0.5rem'
      }}>
        {sections.map((section) => {
          const IconComponent = section.icon;
          return (
            <button
              key={section.id}
              onClick={() => scrollToSection(section.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem',
                background: 'transparent',
                border: 'none',
                borderRadius: '8px',
                fontSize: 'var(--text-sm)',
                color: 'var(--ds-muted-foreground)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                textAlign: 'left'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'var(--ds-muted)';
                e.currentTarget.style.color = 'var(--ds-primary)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = 'var(--ds-muted-foreground)';
              }}
            >
              <IconComponent size={16} />
              {section.title}
            </button>
          );
        })}
      </div>
    </nav>
  );
}