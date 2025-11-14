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
    { id: "trail-news", title: "Trail News", icon: Calendar },
    { id: "choose-itinerary", title: "Choose Your Itinerary", icon: Route },
    { id: "accommodations", title: "Accommodations", icon: Mountain },
    { id: "booking", title: "Booking Your Trip", icon: MapPin },
    { id: "training", title: "Training & Fitness", icon: Dumbbell },
    { id: "on-trail", title: "On the Trail", icon: Mountain },
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
      background: 'white',
      border: `1px solid var(--ds-border)`,
      borderRadius: '12px',
      padding: '2rem',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
      marginBottom: '3rem'
    }}>
      <h2 style={{
        fontSize: 'var(--text-xl)',
        fontWeight: '600',
        marginBottom: '1.5rem',
        color: 'var(--ds-foreground)',
        textAlign: 'center'
      }}>
        Quick Navigation
      </h2>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '0.75rem'
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
                gap: '0.75rem',
                padding: '0.875rem 1rem',
                background: 'var(--ds-off-white)',
                border: '1px solid var(--ds-border)',
                borderRadius: '8px',
                fontSize: 'var(--text-sm)',
                color: 'var(--ds-foreground)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                textAlign: 'left',
                fontWeight: '500'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'white';
                e.currentTarget.style.borderColor = 'var(--ds-primary)';
                e.currentTarget.style.color = 'var(--ds-primary)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'var(--ds-off-white)';
                e.currentTarget.style.borderColor = 'var(--ds-border)';
                e.currentTarget.style.color = 'var(--ds-foreground)';
              }}
            >
              <IconComponent size={18} />
              {section.title}
            </button>
          );
        })}
      </div>
    </nav>
  );
}