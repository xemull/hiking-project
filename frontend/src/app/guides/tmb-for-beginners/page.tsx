// src/app/guides/tmb-for-beginners/page.tsx
import Link from 'next/link';
import Image from 'next/image';
import { Suspense } from 'react';
import Navigation from '../../components/Navigation';
import Footer from '../../components/Footer';
import { getHikes } from '../../services/api';
import { QuickNav } from '../../components/QuickNav';
import { ClientButton } from '../../components/ClientButton';
import { ItineraryCard } from '../../components/ItineraryCard';
import type { HikeSummary } from '../../../types';
import { 
  Mountain, 
  Calendar, 
  MapPin, 
  Backpack, 
  Dumbbell, 
  DollarSign, 
  HelpCircle, 
  Clock,
  CheckCircle,
  XCircle,
  Star,
  Route,
  TrendingUp,
  AlertTriangle,
  Tent,
  Train
} from 'lucide-react';

// Mock TMB hero image - replace with actual image path
const TMB_HERO_IMAGE = '/images/mont-blanc-hero.jpg';

// Itinerary options
const itineraries = [
  {
    title: "Classic TMB",
    duration: "11 days",
    difficulty: "Moderate+",
    whoFor: "The Traditionalist", // ADD THIS
    description: "The traditional full circuit following the classic route with cultural stops in charming alpine villages.",
    highlights: [
      "Complete 170km circuit",
      "All major viewpoints", 
      "Cultural village stays",
      "Traditional route experience"
    ],
    link: "/guides/classic-tmb"
  },
  {
    title: "TMB Highlights", 
    duration: "7 days",
    difficulty: "Moderate",
    whoFor: "The Time-Crunched Hiker", // ADD THIS
    description: "A condensed version hitting the most spectacular sections while skipping some valley walks.",
    highlights: [
      "Best viewpoints only",
      "Skip valley sections", 
      "Perfect for limited time",
      "Still covers 3 countries"
    ],
    link: "/guides/tmb-highlights"
  },
  {
    title: "Leisurely TMB",
    duration: "14 days", 
    difficulty: "Moderate-",
    whoFor: "The Scenery-Seeker", // ADD THIS
    description: "Extended itinerary with rest days, shorter daily distances, and time to explore local culture.",
    highlights: [
      "Rest days included",
      "Shorter daily stages",
      "Cultural exploration time", 
      "Less physical demand"
    ],
    link: "/guides/leisurely-tmb"
  }
];

// Budget options
const budgetOptions = [
  {
    title: "Budget Option",
    price: "€800-1,000",
    description: "per person",
    features: [
      "Dormitory accommodation",
      "Self-catered lunches", 
      "Public transport to/from",
      "Basic gear (if owned)"
    ],
    color: "var(--ds-primary)"
  },
  {
    title: "Standard Option",
    price: "€1,200-1,500", 
    description: "per person",
    features: [
      "Mix of dorms and private rooms",
      "All meals included",
      "Some gear purchases",
      "Transport and transfers"
    ],
    color: "var(--ds-accent)",
    featured: true
  },
  {
    title: "Comfort Option",
    price: "€2,000-2,500",
    description: "per person", 
    features: [
      "Private rooms where possible",
      "Guided tour package",
      "Luggage transfer service",
      "Premium gear and insurance"
    ],
    color: "var(--ds-muted-foreground)"
  }
];

// Component for section containers
function SectionCard({ 
  id, 
  title, 
  children, 
  className = "" 
}: { 
  id: string; 
  title: string; 
  children: React.ReactNode; 
  className?: string; 
}) {
  return (
    <section 
      id={id} 
      style={{ scrollMarginTop: '5rem', marginBottom: '4rem' }}
      className={className}
    >
      <div style={{
        background: 'white',
        border: `1px solid var(--ds-border)`,
        borderRadius: '12px',
        padding: '2rem',
        boxShadow: 'var(--shadow-card)'
      }}>
        <h2 style={{
          fontSize: 'var(--text-2xl)',
          fontWeight: '600',
          marginBottom: '1.5rem',
          color: 'var(--ds-foreground)',
          borderBottom: `1px solid var(--ds-border)`,
          paddingBottom: '0.75rem'
        }}>
          {title}
        </h2>
        <div style={{ fontSize: 'var(--text-base)', lineHeight: '1.7' }}>
          {children}
        </div>
      </div>
    </section>
  );
}

// Main page component
export default async function TMBGuidePage() {
  // Get navigation data with error handling
let allHikes: HikeSummary[] = [];
  try {
const hikesResult = await getHikes();
allHikes = hikesResult || [];  } catch (error) {
    console.error('API not available:', error);
    allHikes = []; // Fallback to empty array
  }

  return (
    <div style={{ 
      background: 'var(--ds-background)', 
      minHeight: '100vh',
      fontFamily: 'Inter, system-ui, sans-serif'
    }}>
      {/* Navigation */}
      <Navigation hikes={allHikes || []} />
      
      {/* Hero Section */}
      <div style={{
        position: 'relative',
        width: '100%',
        height: '100vh',
        minHeight: '600px',
        background: 'var(--gradient-hero)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden'
      }}>
        {/* Hero Background Image */}
        {/* <Image
          src={TMB_HERO_IMAGE}
          alt="Tour du Mont Blanc landscape"
          fill
          sizes="100vw"
          style={{ objectFit: 'cover', zIndex: 0 }}
          priority={true}
        /> */}
        
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(135deg, rgba(45, 55, 72, 0.8), rgba(45, 55, 72, 0.6))',
          zIndex: 1
        }} />
        
        <div style={{
          position: 'relative',
          zIndex: 2,
          textAlign: 'center',
          color: 'white',
          maxWidth: '800px',
          padding: '0 1.5rem'
        }}>
          <Mountain style={{
            width: '4rem',
            height: '4rem',
            margin: '0 auto 1.5rem auto',
            filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))'
          }} />
          <h1 className="hero-title">
            Your Tour du Mont Blanc Adventure Starts Here
          </h1>
          <p className="hero-subtitle">
            A clear, step-by-step guide to help you confidently plan and enjoy
  one of the world's most beautiful treks. No expert experience required.
          </p>
          <ClientButton targetId="is-tmb-right" className="btn-primary" style={{ marginTop: '1rem' }}>
            Start Planning
          </ClientButton>
        </div>
      </div>

      {/* Main Content */}
      <main className="content-container" style={{ 
        paddingTop: '3rem', 
        paddingBottom: '3rem',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {/* Navigation */}
        <QuickNav />

        {/* Is TMB Right for Me */}
        <SectionCard id="is-tmb-right" title="Is the TMB Right for Me?">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1.5rem',
            marginBottom: '2rem'
          }}>
            <div style={{
              padding: '1.5rem',
              borderLeft: `4px solid var(--ds-accent)`,
              background: 'linear-gradient(135deg, white, var(--ds-off-white))',
              borderRadius: '8px'
            }}>
              <h3 style={{
                fontWeight: '600',
                fontSize: 'var(--text-lg)',
                marginBottom: '0.75rem',
                color: 'var(--ds-foreground)'
              }}>
                Difficulty Level
              </h3>
              <p style={{ color: 'var(--ds-muted-foreground)', margin: 0 }}>
                Moderate to challenging. Daily hikes of 4-8 hours with significant elevation gain (500-1,200m per day).
              </p>
            </div>
            <div style={{
              padding: '1.5rem',
              borderLeft: `4px solid var(--ds-primary)`,
              background: 'linear-gradient(135deg, white, var(--ds-off-white))',
              borderRadius: '8px'
            }}>
              <h3 style={{
                fontWeight: '600',
                fontSize: 'var(--text-lg)',
                marginBottom: '0.75rem',
                color: 'var(--ds-foreground)'
              }}>
                Fitness Required
              </h3>
              <p style={{ color: 'var(--ds-muted-foreground)', margin: 0 }}>
                Good cardiovascular fitness and strong legs essential. Regular hiking experience recommended.
              </p>
            </div>
            <div style={{
              padding: '1.5rem',
              borderLeft: `4px solid hsl(140, 40%, 45%)`,
              background: 'linear-gradient(135deg, white, var(--ds-off-white))',
              borderRadius: '8px'
            }}>
              <h3 style={{
                fontWeight: '600',
                fontSize: 'var(--text-lg)',
                marginBottom: '0.75rem',
                color: 'var(--ds-foreground)'
              }}>
                The Rewards
              </h3>
              <p style={{ color: 'var(--ds-muted-foreground)', margin: 0 }}>
                Breathtaking alpine scenery, cultural immersion across 3 countries, and the achievement of a lifetime.
              </p>
            </div>
          </div>
          
          <div style={{
            background: 'var(--ds-muted)',
            borderRadius: '8px',
            padding: '1.5rem'
          }}>
            <h4 style={{
              fontWeight: '600',
              marginBottom: '0.75rem',
              color: 'var(--ds-foreground)'
            }}>
              Honest Assessment:
            </h4>
            <p style={{
              color: 'var(--ds-muted-foreground)',
              marginBottom: '1rem'
            }}>
              The TMB is not a casual walk. You'll hike 6-8 hours daily across challenging terrain, 
              sleep in mountain huts, and face unpredictable weather. However, it's achievable for 
              most people with proper preparation and a reasonable fitness level.
            </p>
   <p style={{
              color: 'var(--ds-muted-foreground)',
              marginBottom: '1rem'
            }}>
  This trek is likely for you if..
</p>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0.75rem 0 0 0', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
  {[
    "You enjoy a full day of walking in the countryside.",
    "You're looking for a challenge, not an extreme sport.",
    "You're comfortable with simple, cozy lodging.",
    "The idea of waking up to mountain views excites you."
  ].map((item, index) => (
    <li key={index} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--ds-muted-foreground)' }}>
      <CheckCircle size={16} style={{ color: 'hsl(140, 40%, 45%)', flexShrink: 0 }} />
      {item}
    </li>
  ))}
</ul>
 
          </div>
        </SectionCard>

        {/* When to Go */}
        <SectionCard id="when-to-go" title="When to Go - Month by Month">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
            marginBottom: '1.5rem'
          }}>
            {[
              {
                month: "June",
                pros: ["Fewer crowds", "Wildflowers blooming"],
                cons: ["Some high passes may have snow", "Weather can be unpredictable"],
                peak: false
              },
              {
                month: "July",
                pros: ["Best weather", "All refuges open"],
                cons: ["Most crowded", "Bookings essential"],
                peak: true
              },
              {
                month: "August", 
                pros: ["Warmest weather", "Long daylight hours"],
                cons: ["Very crowded", "Highest prices"],
                peak: true
              },
              {
                month: "September",
                pros: ["Autumn colors", "Fewer crowds"],
                cons: ["Some refuges close early", "Shorter days"],
                peak: false
              }
            ].map((monthData) => (
              <div key={monthData.month} style={{
                background: monthData.peak 
                  ? 'linear-gradient(135deg, rgba(255, 204, 0, 0.1), rgba(255, 204, 0, 0.05))'
                  : 'linear-gradient(135deg, var(--ds-muted), rgba(255, 255, 255, 0.5))',
                borderRadius: '8px',
                padding: '1rem',
                border: monthData.peak ? `2px solid var(--ds-accent)` : `1px solid var(--ds-border)`
              }}>
                <h4 style={{
                  fontWeight: '600',
                  marginBottom: '0.5rem',
                  color: 'var(--ds-foreground)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  {monthData.month}
                  {monthData.peak && (
                    <span style={{
                      background: 'var(--ds-accent)',
                      color: 'black',
                      fontSize: 'var(--text-xs)',
                      padding: '0.125rem 0.5rem',
                      borderRadius: '4px',
                      fontWeight: '600'
                    }}>
                      PEAK
                    </span>
                  )}
                </h4>
                <div style={{ fontSize: 'var(--text-sm)' }}>
                  {monthData.pros.map((pro, index) => (
                    <div key={index} style={{
                      color: 'hsl(140, 40%, 45%)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem',
                      marginBottom: '0.25rem'
                    }}>
                      <CheckCircle size={12} />
                      {pro}
                    </div>
                  ))}
                  {monthData.cons.map((con, index) => (
                    <div key={index} style={{
                      color: 'hsl(0, 70%, 50%)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem',
                      marginBottom: '0.25rem'
                    }}>
                      <XCircle size={12} />
                      {con}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div style={{
            background: 'rgba(33, 150, 243, 0.1)',
            borderRadius: '8px',
            padding: '1.5rem',
            border: '1px solid rgba(33, 150, 243, 0.2)'
          }}>
            <h4 style={{
              fontWeight: '600',
              marginBottom: '0.75rem',
              color: 'rgb(33, 150, 243)'
            }}>
              Our Recommendation:
            </h4>
            <p style={{ color: 'var(--ds-muted-foreground)', margin: 0 }}>
              <strong>First-time hikers:</strong> July or August for the most predictable conditions and full refuge operations. 
              <strong> Experienced hikers:</strong> Consider June or September for a more peaceful experience.
            </p>
          </div>
        </SectionCard>

        {/* Choose Your Itinerary */}
        <SectionCard id="choose-itinerary" title="Choose Your Itinerary">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '1.5rem'
          }}>
            {itineraries.map((itinerary) => (
              <ItineraryCard 
                key={itinerary.title} 
                title={itinerary.title}
                duration={itinerary.duration}
                difficulty={itinerary.difficulty}
                    whoFor={itinerary.whoFor} // ADD THIS

                description={itinerary.description}
                highlights={itinerary.highlights}
                link={itinerary.link}
              />
            ))}
          </div>
        </SectionCard>

        {/* Booking Your Trip */}
        <SectionCard id="booking" title="Booking Your Trip">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2rem'
          }}>
            <div>
              <div style={{
                background: 'linear-gradient(135deg, white, var(--ds-off-white))',
                borderRadius: '8px',
                padding: '1.5rem',
                border: `1px solid var(--ds-border)`
              }}>
                <h3 style={{
                  fontWeight: '600',
                  fontSize: 'var(--text-lg)',
                  marginBottom: '1rem',
                  color: 'var(--ds-foreground)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <MapPin size={20} style={{ color: 'var(--ds-primary)' }} />
                  Independent Booking
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {[
                    { label: "Flexibility", value: "High", positive: true },
                    { label: "Cost", value: "Lower", positive: true },
                    { label: "Planning Time", value: "High", positive: false },
                    { label: "Support", value: "Self-reliant", positive: false }
                  ].map((item, index) => (
                    <div key={index} style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontSize: 'var(--text-sm)'
                    }}>
                      <span style={{ color: 'var(--ds-muted-foreground)' }}>
                        {item.label}
                      </span>
                      <span style={{
                        color: item.positive ? 'hsl(140, 40%, 45%)' : 'hsl(0, 70%, 50%)',
                        fontWeight: '600'
                      }}>
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>
                <button style={{
                  width: '100%',
                  marginTop: '1rem',
                  background: 'transparent',
                  border: `1px solid var(--ds-border)`,
                  color: 'var(--ds-foreground)',
                  padding: '0.75rem',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: 'var(--text-sm)',
                  fontWeight: '600'
                }}>
                  Refuge Booking Guide
                </button>
              </div>
            </div>
            
            <div>
              <div style={{
                background: 'linear-gradient(135deg, white, var(--ds-off-white))',
                borderRadius: '8px',
                padding: '1.5rem',
                border: `1px solid var(--ds-border)`
              }}>
                <h3 style={{
                  fontWeight: '600',
                  fontSize: 'var(--text-lg)',
                  marginBottom: '1rem',
                  color: 'var(--ds-foreground)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <Backpack size={20} style={{ color: 'var(--ds-primary)' }} />
                  Tour Company
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {[
                    { label: "Flexibility", value: "Limited", positive: false },
                    { label: "Cost", value: "Higher", positive: false },
                    { label: "Planning Time", value: "Minimal", positive: true },
                    { label: "Support", value: "Full support", positive: true }
                  ].map((item, index) => (
                    <div key={index} style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontSize: 'var(--text-sm)'
                    }}>
                      <span style={{ color: 'var(--ds-muted-foreground)' }}>
                        {item.label}
                      </span>
                      <span style={{
                        color: item.positive ? 'hsl(140, 40%, 45%)' : 'hsl(0, 70%, 50%)',
                        fontWeight: '600'
                      }}>
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>
                <button style={{
                  width: '100%',
                  marginTop: '1rem',
                  background: 'var(--ds-primary)',
                  border: 'none',
                  color: 'white',
                  padding: '0.75rem',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: 'var(--text-sm)',
                  fontWeight: '600'
                }}>
                  Find Tour Companies
                </button>
              </div>
            </div>
          </div>
          
          <div style={{
            marginTop: '2rem',
            background: 'rgba(128, 128, 128, 0.1)',
            borderRadius: '8px',
            padding: '1.5rem',
            border: '1px solid rgba(128, 128, 128, 0.2)'
          }}>
            <h4 style={{
              fontWeight: '600',
              marginBottom: '0.75rem',
              color: 'var(--ds-foreground)'
            }}>
              Key Booking Timeline:
            </h4>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
              gap: '1rem',
              fontSize: 'var(--text-sm)',
              textAlign: 'center'
            }}>
              {[
                { time: "6+ months ahead", task: "July/August bookings" },
                { time: "3-4 months ahead", task: "June/September bookings" },
                { time: "2 months ahead", task: "Equipment preparation" },
                { time: "1 month ahead", task: "Final training push" }
              ].map((item, index) => (
                <div key={index}>
                  <div style={{
                    fontWeight: '600',
                    color: 'var(--ds-primary)',
                    marginBottom: '0.25rem'
                  }}>
                    {item.time}
                  </div>
                  <div style={{ color: 'var(--ds-muted-foreground)' }}>
                    {item.task}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </SectionCard>

        {/* Training & Fitness */}
        <SectionCard id="training" title="Training & Fitness">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2rem'
          }}>
            <div>
              <h3 style={{
                fontWeight: '600',
                fontSize: 'var(--text-lg)',
                marginBottom: '1rem',
                color: 'var(--ds-foreground)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <Dumbbell size={20} style={{ color: 'var(--ds-primary)' }} />
                Essential Training Components
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {[
                  {
                    title: "Cardiovascular Endurance",
                    description: "Build your aerobic base with regular hiking, running, or cycling. Aim for 4-5 sessions per week, gradually increasing duration."
                  },
                  {
                    title: "Leg Strength", 
                    description: "Focus on squats, lunges, step-ups, and calf raises. Strong legs are crucial for both ascents and descents."
                  },
                  {
                    title: "Hiking Practice",
                    description: "Practice long hikes with your full pack. Build up to 6-8 hour days with 1,000m+ elevation gain."
                  }
                ].map((component, index) => (
                  <div key={index} style={{
                    background: 'var(--ds-muted)',
                    borderRadius: '8px',
                    padding: '1rem'
                  }}>
                    <h4 style={{
                      fontWeight: '600',
                      color: 'var(--ds-foreground)',
                      marginBottom: '0.5rem'
                    }}>
                      {component.title}
                    </h4>
                    <p style={{
                      fontSize: 'var(--text-sm)',
                      color: 'var(--ds-muted-foreground)',
                      margin: 0
                    }}>
                      {component.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 style={{
                fontWeight: '600',
                fontSize: 'var(--text-lg)',
                marginBottom: '1rem',
                color: 'var(--ds-foreground)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <Clock size={20} style={{ color: 'var(--ds-primary)' }} />
                Training Timeline
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {[
                  { time: "4-6 months before", task: "Start base fitness building" },
                  { time: "3-4 months before", task: "Add strength training" },
                  { time: "2-3 months before", task: "Long hike practice" },
                  { time: "1 month before", task: "Taper and gear testing" }
                ].map((item, index) => (
                  <div key={index} style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.75rem'
                  }}>
                    <div style={{
                      width: '12px',
                      height: '12px',
                      backgroundColor: 'var(--ds-primary)',
                      borderRadius: '50%',
                      marginTop: '0.375rem',
                      flexShrink: 0
                    }} />
                    <div>
                      <div style={{
                        fontWeight: '600',
                        color: 'var(--ds-foreground)'
                      }}>
                        {item.time}
                      </div>
                      <div style={{
                        fontSize: 'var(--text-sm)',
                        color: 'var(--ds-muted-foreground)'
                      }}>
                        {item.task}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
<div style={{ marginTop: '2rem', background: 'var(--ds-muted)', borderRadius: '12px', padding: '2rem', textAlign: 'center', border: `1px solid var(--ds-border)` }}>
  <Backpack size={32} style={{ color: 'var(--ds-primary)', margin: '0 auto 1rem auto' }} />
  <h3 style={{ fontWeight: '600', fontSize: 'var(--text-xl)', marginBottom: '0.5rem' }}>
    Get the Ultimate TMB Packing Checklist
  </h3>
  <p style={{ color: 'var(--ds-muted-foreground)', maxWidth: '450px', margin: '0 auto 1.5rem auto' }}>
    Our free, printable PDF checklist has everything you need (and what to leave behind). We'll send it straight to your inbox.
  </p>
  <button className="btn-primary" style={{
    fontSize: 'var(--text-base)',
    padding: 'var(--space-md) var(--space-2xl)'
  }}>
    Download the Free Checklist
  </button>
</div>
        </SectionCard>

        {/* Packing & Gear */}
        <SectionCard id="packing" title="Packing & Gear Essentials">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1.5rem'
          }}>
            {[
              {
                title: "The Big Four",
                items: [
                  { name: "Backpack (40-50L)", priority: "Essential" },
                  { name: "Hiking Boots", priority: "Essential" },
                  { name: "Rain Jacket", priority: "Essential" },
                  { name: "Sleeping Bag", priority: "Essential" }
                ]
              },
              {
                title: "Clothing System", 
                items: [
                  { name: "Base Layers (2-3)", priority: "Important" },
                  { name: "Insulation Layer", priority: "Important" },
                  { name: "Hiking Pants (2)", priority: "Important" },
                  { name: "Warm Hat & Gloves", priority: "Essential" }
                ]
              },
              {
                title: "Extras & Safety",
                items: [
                  { name: "First Aid Kit", priority: "Essential" },
                  { name: "Headlamp", priority: "Essential" },
                  { name: "Trekking Poles", priority: "Recommended" },
                  { name: "Maps & Navigation", priority: "Recommended" }
                ]
              }
            ].map((category, index) => (
              <div key={index} style={{
                background: 'white',
                padding: '1.5rem',
                borderRadius: '8px',
                border: `1px solid var(--ds-border)`,
                boxShadow: 'var(--shadow-soft)'
              }}>
                <h3 style={{
                  fontWeight: '600',
                  fontSize: 'var(--text-lg)',
                  marginBottom: '1rem',
                  color: 'var(--ds-foreground)'
                }}>
                  {category.title}
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {category.items.map((item, itemIndex) => (
                    <div key={itemIndex} style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      fontSize: 'var(--text-sm)'
                    }}>
                      <span style={{ color: 'var(--ds-muted-foreground)' }}>
                        {item.name}
                      </span>
                      <span style={{
                        color: item.priority === 'Essential' ? 'var(--ds-primary)' : 
                               item.priority === 'Important' ? 'hsl(140, 40%, 45%)' : 
                               'var(--ds-muted-foreground)',
                        fontWeight: '600'
                      }}>
                        {item.priority}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <button className="btn-primary" style={{
            width: '100%',
            marginTop: '1.5rem',
            fontSize: 'var(--text-base)',
            padding: 'var(--space-md) var(--space-2xl)'
          }}>
            Download Complete Packing Checklist
          </button>
        </SectionCard>

        {/* On the Trail */}
        <SectionCard id="on-trail" title="On the Trail - What to Expect">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2rem'
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <h3 style={{
                  fontWeight: '600',
                  fontSize: 'var(--text-lg)',
                  marginBottom: '0.75rem',
                  color: 'var(--ds-foreground)'
                }}>
                  Daily Routine
                </h3>
                <div style={{
                  background: 'var(--ds-muted)',
                  borderRadius: '8px',
                  padding: '1rem',
                  fontSize: 'var(--text-sm)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem'
                }}>
                  {[
                    "6:30 AM: Wake up, pack, breakfast",
                    "8:00 AM: Start hiking", 
                    "12:00 PM: Lunch break",
                    "3-5 PM: Arrive at refuge",
                    "7:00 PM: Dinner",
                    "9:00 PM: Quiet time/sleep"
                  ].map((item, index) => (
                    <div key={index} style={{ color: 'var(--ds-foreground)' }}>
                      <strong>{item.split(':')[0]}:</strong> {item.split(':').slice(1).join(':')}
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 style={{
                  fontWeight: '600',
                  fontSize: 'var(--text-lg)',
                  marginBottom: '0.75rem',
                  color: 'var(--ds-foreground)'
                }}>
                  Navigation
                </h3>
                <p style={{
                  color: 'var(--ds-muted-foreground)',
                  fontSize: 'var(--text-sm)',
                  marginBottom: '0.75rem'
                }}>
                  The TMB is well-marked with white-red paint blazes and TMB signs. However, weather can obscure markings.
                </p>
                <div style={{
                  background: 'rgba(33, 150, 243, 0.1)',
                  borderRadius: '8px',
                  padding: '1rem',
                  fontSize: 'var(--text-sm)'
                }}>
                  <strong>Pro tip:</strong> Download offline maps and carry a backup navigation method. 
                  The trail can be confusing in fog or snow.
                </div>
              </div>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <h3 style={{
                  fontWeight: '600',
                  fontSize: 'var(--text-lg)',
                  marginBottom: '0.75rem',
                  color: 'var(--ds-foreground)'
                }}>
                  Food & Water
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {[
                    {
                      title: "Refuge Meals:",
                      description: "Most refuges offer half-pension (dinner + breakfast). Hearty mountain food, typically 3-4 courses."
                    },
                    {
                      title: "Packed Lunches:",
                      description: "Available from refuges (~€15-20). Or bring your own trail snacks."
                    },
                    {
                      title: "Water:",
                      description: "Refill at refuges and mountain springs. Water is generally safe but carry purification as backup."
                    }
                  ].map((item, index) => (
                    <div key={index} style={{
                      background: 'var(--ds-muted)',
                      borderRadius: '6px',
                      padding: '0.75rem',
                      fontSize: 'var(--text-sm)'
                    }}>
                      <strong>{item.title}</strong> {item.description}
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 style={{
                  fontWeight: '600',
                  fontSize: 'var(--text-lg)',
                  marginBottom: '0.75rem',
                  color: 'var(--ds-foreground)'
                }}>
                  Trail Etiquette
                </h3>
                <ul style={{
                  listStyle: 'none',
                  padding: 0,
                  margin: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem',
                  fontSize: 'var(--text-sm)',
                  color: 'var(--ds-muted-foreground)'
                }}>
                  {[
                    'Greet fellow hikers with "Bonjour" or "Guten Tag"',
                    'Stay on marked trails to protect alpine vegetation',
                    'Pack out all trash',
                    'Be quiet in refuges after 9 PM',
                    'Give way to uphill hikers'
                  ].map((item, index) => (
                    <li key={index} style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '0.5rem'
                    }}>
                      <span style={{
                        color: 'var(--ds-primary)',
                        fontWeight: 'bold',
                        fontSize: '1rem',
                        lineHeight: '1'
                      }}>
                        •
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </SectionCard>

        {/* Budgeting */}
        <SectionCard id="budgeting" title="Budgeting Your TMB Adventure">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1.5rem'
          }}>
            {budgetOptions.map((option) => (
              <div key={option.title} style={{
                padding: '1.5rem',
                borderLeft: `4px solid ${option.color}`,
                background: option.featured 
                  ? 'linear-gradient(135deg, rgba(255, 204, 0, 0.05), white)'
                  : 'white',
                borderRadius: '8px',
                border: option.featured 
                  ? `1px solid rgba(255, 204, 0, 0.3)`
                  : `1px solid var(--ds-border)`,
                boxShadow: 'var(--shadow-soft)',
                position: 'relative'
              }}>
                {option.featured && (
                  <div style={{
                    position: 'absolute',
                    top: '-0.5rem',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: 'var(--ds-accent)',
                    color: 'black',
                    padding: '0.25rem 1rem',
                    borderRadius: '12px',
                    fontSize: 'var(--text-xs)',
                    fontWeight: '600'
                  }}>
                    POPULAR
                  </div>
                )}
                <h3 style={{
                  fontWeight: '600',
                  fontSize: 'var(--text-lg)',
                  marginBottom: '1rem',
                  color: option.color
                }}>
                  {option.title}
                </h3>
                <div style={{
                  fontSize: 'var(--text-3xl)',
                  fontWeight: '700',
                  marginBottom: '0.5rem',
                  color: 'var(--ds-foreground)'
                }}>
                  {option.price}
                </div>
                <div style={{
                  fontSize: 'var(--text-sm)',
                  color: 'var(--ds-muted-foreground)',
                  marginBottom: '1rem'
                }}>
                  {option.description}
                </div>
                <ul style={{
                  listStyle: 'none',
                  padding: 0,
                  margin: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem',
                  fontSize: 'var(--text-sm)',
                  color: 'var(--ds-muted-foreground)'
                }}>
                  {option.features.map((feature, index) => (
                    <li key={index} style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '0.5rem'
                    }}>
                      <span style={{
                        color: 'var(--ds-primary)',
                        fontWeight: 'bold',
                        fontSize: '1rem',
                        lineHeight: '1'
                      }}>
                        •
                      </span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          
          <div style={{
            marginTop: '2rem',
            background: 'linear-gradient(90deg, rgba(33, 150, 243, 0.1), rgba(255, 204, 0, 0.1))',
            borderRadius: '8px',
            padding: '1.5rem',
            border: '1px solid rgba(33, 150, 243, 0.2)'
          }}>
            <h4 style={{
              fontWeight: '600',
              marginBottom: '1rem',
              color: 'var(--ds-foreground)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <DollarSign size={20} style={{ color: 'var(--ds-primary)' }} />
              Budget Breakdown Tool Coming Soon
            </h4>
            <p style={{
              color: 'var(--ds-muted-foreground)',
              marginBottom: '1rem'
            }}>
              We're building an interactive budget calculator to help you plan your TMB costs based on your specific preferences and travel dates.
            </p>
            <button style={{
              background: 'var(--ds-primary)',
              color: 'white',
              border: 'none',
              padding: '0.75rem 1.5rem',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: 'var(--text-sm)',
              fontWeight: '600'
            }}>
              Notify Me When Ready
            </button>
          </div>
        </SectionCard>

        {/* FAQs */}
        <SectionCard id="faqs" title="Frequently Asked Questions">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '1.5rem'
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {[
                {
                  question: "Do I need to be an experienced hiker?",
                  answer: "While experience helps, the TMB is doable for determined beginners with proper preparation. Regular hiking practice and good fitness are more important than technical skills."
                },
                {
                  question: "Can I do the TMB solo?",
                  answer: "Absolutely! The trail is well-marked and refuges are social places where you'll meet other hikers. Many people hike solo and find it rewarding."
                },
                {
                  question: "What if the weather is bad?",
                  answer: "Mountain weather changes quickly. Most refuges have rest days available, and there are lower altitude alternatives for many high passes during storms."
                }
              ].map((faq, index) => (
                <div key={index} style={{
                  border: `1px solid var(--ds-border)`,
                  borderRadius: '8px',
                  padding: '1rem'
                }}>
                  <h4 style={{
                    fontWeight: '600',
                    color: 'var(--ds-foreground)',
                    marginBottom: '0.5rem'
                  }}>
                    {faq.question}
                  </h4>
                  <p style={{
                    fontSize: 'var(--text-sm)',
                    color: 'var(--ds-muted-foreground)',
                    margin: 0
                  }}>
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {[
                {
                  question: "How far in advance should I book?",
                  answer: "For July/August: 6+ months ahead. For June/September: 3-4 months ahead. Last-minute bookings are possible but limit your options."
                },
                {
                  question: "What about language barriers?",
                  answer: "English is widely understood in refuges and tourist areas. Learning basic French, Italian, and German phrases enhances the experience but isn't essential."
                },
                {
                  question: "Is travel insurance necessary?",
                  answer: "Highly recommended. Mountain rescue can be expensive, and weather delays are common. Ensure your policy covers hiking up to 3,000m altitude."
                }
              ].map((faq, index) => (
                <div key={index} style={{
                  border: `1px solid var(--ds-border)`,
                  borderRadius: '8px',
                  padding: '1rem'
                }}>
                  <h4 style={{
                    fontWeight: '600',
                    color: 'var(--ds-foreground)',
                    marginBottom: '0.5rem'
                  }}>
                    {faq.question}
                  </h4>
                  <p style={{
                    fontSize: 'var(--text-sm)',
                    color: 'var(--ds-muted-foreground)',
                    margin: 0
                  }}>
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </SectionCard>

        {/* Call to Action */}
        <div style={{
          textAlign: 'center',
          background: 'linear-gradient(135deg, rgba(33, 150, 243, 0.1), rgba(255, 204, 0, 0.1))',
          borderRadius: '12px',
          padding: '3rem',
          border: '1px solid rgba(33, 150, 243, 0.2)',
          marginTop: '2rem'
        }}>
          <Mountain style={{
            width: '4rem',
            height: '4rem',
            margin: '0 auto 1.5rem auto',
            color: 'var(--ds-primary)'
          }} />
          <h2 style={{
            fontSize: 'var(--text-3xl)',
            fontWeight: '700',
            marginBottom: '1rem',
            color: 'var(--ds-foreground)'
          }}>
            Ready to Start Planning?
          </h2>
          <p style={{
            fontSize: 'var(--text-lg)',
            color: 'var(--ds-muted-foreground)',
            marginBottom: '2rem',
            maxWidth: '600px',
            margin: '0 auto 2rem auto'
          }}>
            You now have the foundation to plan your TMB adventure. The mountains are calling — 
            take the first step towards the experience of a lifetime.
          </p>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <button className="btn-primary" style={{
              fontSize: 'var(--text-base)',
              padding: 'var(--space-md) var(--space-2xl)'
            }}>
              Book Your TMB Now
            </button>
            <button style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'transparent',
              border: `1px solid var(--ds-border)`,
              color: 'var(--ds-foreground)',
              padding: 'var(--space-md) var(--space-2xl)',
              borderRadius: '25px',
              fontSize: 'var(--text-base)',
              fontWeight: '600',
              cursor: 'pointer'
            }}>
              Download Planning Checklist
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}