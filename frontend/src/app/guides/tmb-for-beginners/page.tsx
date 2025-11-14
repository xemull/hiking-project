// src/app/guides/tmb-for-beginners/page.tsx
import Link from 'next/link';
import Image from 'next/image';
import { Suspense } from 'react';
import Navigation from '../../components/Navigation';
import UniversalHero from '../../components/UniversalHero';
import Footer from '../../components/Footer';
import { getHikes, getTrailNews } from '../../services/api';
import { ClientButton } from '../../components/ClientButton';
import { ItineraryCard } from '../../components/ItineraryCard';
import type { HikeSummary, TrailNews } from '../../../types';
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
  Train,
  Building2,
  Home,
  Info,
  AlertCircle,
  Newspaper,
  Hotel,
  TreePine
} from 'lucide-react';
import { CollapsibleFAQItem } from './CollapsibleFAQItem';

// TMB hero image
const TMB_HERO_IMAGE = '/uploads/itineraries/gentle-trekker/DJI_0213-HDR.jpg';

// Itinerary options
const itineraries = [
  {
    title: "The Classic Circuit",
    duration: "11 days",
    difficulty: "Challenging",
    whoFor: "The Traditionalist",
    description: "The quintessential Tour du Mont Blanc. An 11-day journey around Mont Blanc following the traditional route with mountain refuges and challenging stages.",
    highlights: [
      "Complete 170km circuit",
      "Cumulative ascent higher than Everest",
      "Traditional mountain refuges",
      "Crosses 3 countries"
    ],
    link: "/guides/tmb-for-beginners/itineraries/classic-circuit"
  },
  {
    title: "The Gentle Trekker",
    duration: "12 days",
    difficulty: "Moderate",
    whoFor: "The Comfort-Seeker",
    description: "A 12-day tour prioritizing scenery and comfort with strategic transport use, shorter stages, and a rest day in Courmayeur.",
    highlights: [
      "Shorter daily stages (4-6 hours)",
      "Strategic cable car use",
      "Rest day included",
      "Comfortable accommodations"
    ],
    link: "/guides/tmb-for-beginners/itineraries/gentle-trekker"
  },
  {
    title: "The Western Front",
    duration: "5 days",
    difficulty: "Moderate+",
    whoFor: "The Time-Crunched Hiker",
    description: "A 5-day half TMB from Chamonix to Courmayeur covering the western section. Perfect for limited time or splitting the TMB into two years.",
    highlights: [
      "Concentrated high-impact trek",
      "Covers ~70km of terrain",
      "Point-to-point journey",
      "Bus return via Mont Blanc tunnel"
    ],
    link: "/guides/tmb-for-beginners/itineraries/western-front"
  },
  {
    title: "The Italian Taster",
    duration: "4 days",
    difficulty: "Moderate",
    whoFor: "The Weekend Warrior",
    description: "A 4-day loop from Courmayeur showcasing the TMB's most scenic sections. Maximum views in minimum time.",
    highlights: [
      "Perfect for a long weekend",
      "Italian balcony paths",
      "Crosses into Switzerland & France",
      "Logistical loop from Courmayeur"
    ],
    link: "/guides/tmb-for-beginners/itineraries/italian-taster"
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
      style={{ scrollMarginTop: '5rem', marginBottom: '2.5rem' }}
      className={className}
    >
      <div style={{
        background: 'white',
        border: `1px solid var(--ds-border)`,
        borderRadius: '12px',
        padding: 'clamp(1.25rem, 3vw, 2rem)',
        boxShadow: 'var(--shadow-card)'
      }}>
        <h2 style={{
          fontSize: 'var(--text-2xl)',
          fontWeight: '600',
          marginBottom: 'clamp(1rem, 2vw, 1.5rem)',
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
  // Get navigation data and trail news with error handling
  let allHikes: HikeSummary[] = [];
  let trailNews: TrailNews[] = [];

  try {
    const [hikesResult, newsResult] = await Promise.all([
      getHikes(),
      getTrailNews(undefined, 3) // Get max 3 news items (not filtering by trail)
    ]);
    allHikes = hikesResult || [];
    trailNews = newsResult || [];
  } catch (error) {
    console.error('API not available:', error);
    allHikes = [];
    trailNews = [];
  }

  return (
    <div style={{ 
      background: 'var(--ds-background)', 
      minHeight: '100vh',
      fontFamily: 'Inter, system-ui, sans-serif'
    }}>
      {/* Navigation */}
      <Navigation hikes={allHikes || []} />
      
      <UniversalHero title="Your Tour du Mont Blanc Adventure Starts Here" subtitle="A clear, step-by-step guide to help you confidently plan and enjoy one of the world's most beautiful treks. No expert experience required." backgroundSrc="/uploads/itineraries/gentle-trekker/DJI_0213-HDR.jpg" ctas={[{ label: "Start Planning", href: "#is-tmb-right", variant: "primary" }]} overlay="gradient" height="standard" />

      {/* Main Content */}
      <main className="content-container" style={{
        paddingTop: 'clamp(1.5rem, 4vw, 3rem)',
        paddingBottom: 'clamp(1.5rem, 4vw, 3rem)',
        paddingLeft: 'clamp(0.75rem, 3vw, 1rem)',
        paddingRight: 'clamp(0.75rem, 3vw, 1rem)',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
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

        {/* Image Banner after "Is TMB Right for Me?" */}
        <div className="tmb-image-grid-mobile" style={{
          margin: 'clamp(1.5rem, 3vw, 2rem) 0',
          borderRadius: '12px',
          overflow: 'hidden',
          height: 'clamp(250px, 50vw, 400px)',
          position: 'relative',
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '0.5rem'
        }}>
          <div style={{ position: 'relative', height: '100%' }}>
            <Image
              src="/uploads/DJI_0240-HDR.jpg"
              alt="TMB Mountain Vista"
              fill
              className="tmb-section-image"
              style={{ objectFit: 'cover' }}
            />
          </div>
          <div style={{ position: 'relative', height: '100%' }}>
            <Image
              src="/uploads/DJI_0209-HDR.jpg"
              alt="TMB Alpine Trail"
              fill
              className="tmb-section-image"
              style={{ objectFit: 'cover' }}
            />
          </div>
        </div>

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
            <p style={{ color: 'var(--ds-muted-foreground)', marginBottom: '0.5rem' }}>
              <strong>First-time hikers:</strong> July or August for the most predictable conditions and full refuge operations.
            </p>
            <p style={{ color: 'var(--ds-muted-foreground)', margin: 0 }}>
              <strong>Experienced hikers:</strong> Consider June or September for a more peaceful experience.
            </p>
          </div>
        </SectionCard>

        {/* Trail News */}
        {trailNews.length > 0 && (
          <SectionCard id="trail-news" title="Trail News & Updates">
            <div style={{
              marginBottom: '1rem'
            }}>
              <span style={{
                fontSize: 'var(--text-sm)',
                color: 'var(--ds-muted-foreground)'
              }}>
                Last updated: {new Date(Math.max(...trailNews.map(n => new Date(n.date).getTime()))).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
            </div>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1.5rem'
            }}>
              {trailNews.map((news, index) => {
                const Icon = news.severity === 'critical' ? AlertCircle :
                            news.severity === 'warning' ? AlertTriangle :
                            Info;
                const iconColor = news.severity === 'critical' ? 'hsl(0, 70%, 50%)' :
                                 news.severity === 'warning' ? 'hsl(38, 90%, 50%)' :
                                 'hsl(210, 70%, 50%)';
                const borderColor = news.severity === 'critical' ? 'hsl(0, 70%, 50%)' :
                                   news.severity === 'warning' ? 'hsl(38, 90%, 50%)' :
                                   'hsl(210, 70%, 50%)';

                return (
                  <div
                    key={news.id}
                    className="trail-news-item"
                    style={{
                      borderLeft: `4px solid ${borderColor}`,
                      padding: '1rem 0 1rem 1rem',
                      display: 'grid',
                      gridTemplateColumns: 'auto auto 1fr auto',
                      gap: '1rem',
                      alignItems: 'flex-start',
                      background: 'transparent',
                      transition: 'background 0.2s'
                    }}
                  >
                    <div className="trail-news-date" style={{
                      background: borderColor,
                      color: 'white',
                      padding: '0.5rem 0.75rem',
                      borderRadius: '6px',
                      textAlign: 'center',
                      minWidth: '80px',
                      fontWeight: '600'
                    }}>
                      <div style={{ fontSize: 'var(--text-xs)', opacity: 0.9 }}>
                        {new Date(news.date).toLocaleDateString('en-US', { month: 'short' })}
                      </div>
                      <div style={{ fontSize: 'var(--text-xl)', lineHeight: '1' }}>
                        {new Date(news.date).getDate()}
                      </div>
                    </div>

                    <Icon
                      size={20}
                      className="trail-news-icon"
                      style={{
                        color: iconColor,
                        flexShrink: 0,
                        marginTop: '0.25rem'
                      }}
                    />

                    <div className="trail-news-content" style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                        <h4 style={{
                          fontWeight: '600',
                          fontSize: 'var(--text-base)',
                          color: 'var(--ds-foreground)',
                          margin: 0
                        }}>
                          {news.title}
                        </h4>
                      </div>
                      {news.content ? (
                        <div
                          style={{
                            fontSize: 'var(--text-sm)',
                            color: 'var(--ds-muted-foreground)',
                            lineHeight: '1.6',
                            whiteSpace: 'pre-line'
                          }}
                          dangerouslySetInnerHTML={{ __html: news.content }}
                        />
                      ) : (
                        <p style={{
                          fontSize: 'var(--text-sm)',
                          color: 'var(--ds-muted-foreground)',
                          margin: 0,
                          lineHeight: '1.6'
                        }}>
                          {news.summary}
                        </p>
                      )}
                      {news.source && (
                        <a
                          href={news.source}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            fontSize: 'var(--text-xs)',
                            color: iconColor,
                            textDecoration: 'none',
                            display: 'inline-block',
                            marginTop: '0.5rem'
                          }}
                        >
                          View source →
                        </a>
                      )}
                    </div>

                    <span style={{
                      background: 'var(--ds-muted)',
                      color: 'var(--ds-muted-foreground)',
                      padding: '0.25rem 0.75rem',
                      borderRadius: '12px',
                      fontSize: 'var(--text-xs)',
                      fontWeight: '600',
                      whiteSpace: 'nowrap'
                    }}>
                      {news.category}
                    </span>
                  </div>
                );
              })}
            </div>
          </SectionCard>
        )}

        {/* Choose Your Itinerary */}
        <SectionCard id="choose-itinerary" title="Choose Your Itinerary">
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
          }}>
            {itineraries.map((itinerary) => (
              <Link
                key={itinerary.title}
                href={itinerary.link}
                className="itinerary-card-mobile"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1.5rem',
                  padding: '1.25rem',
                  background: 'white',
                  border: '1px solid var(--ds-border)',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  transition: 'all 0.2s'
                }}
              >
                {/* Duration Badge */}
                <div className="itinerary-duration-badge" style={{
                  background: 'var(--ds-accent)',
                  color: 'black',
                  padding: '0.75rem 1rem',
                  borderRadius: '8px',
                  fontWeight: '700',
                  fontSize: 'var(--text-base)',
                  textAlign: 'center',
                  minWidth: '90px',
                  flexShrink: 0
                }}>
                  {itinerary.duration}
                </div>

                {/* Content */}
                <div className="itinerary-content-mobile" style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'baseline',
                    gap: '0.75rem',
                    marginBottom: '0.5rem',
                    flexWrap: 'wrap'
                  }}>
                    <h3 style={{
                      fontSize: 'var(--text-lg)',
                      fontWeight: '600',
                      color: 'var(--ds-foreground)',
                      margin: 0
                    }}>
                      {itinerary.title}
                    </h3>
                    <span style={{
                      fontSize: 'var(--text-sm)',
                      color: 'var(--ds-muted-foreground)',
                      fontStyle: 'italic'
                    }}>
                      {itinerary.whoFor}
                    </span>
                  </div>
                  <p style={{
                    fontSize: 'var(--text-sm)',
                    color: 'var(--ds-muted-foreground)',
                    margin: 0,
                    lineHeight: '1.5'
                  }}>
                    {itinerary.description}
                  </p>
                </div>

                {/* Arrow */}
                <div className="itinerary-arrow-mobile" style={{
                  color: 'var(--ds-primary)',
                  fontSize: 'var(--text-xl)',
                  flexShrink: 0
                }}>
                  →
                </div>
              </Link>
            ))}
          </div>
        </SectionCard>

        {/* Where to Stay on the TMB */}
        <SectionCard id="accommodations" title="Where to Stay on the TMB">
          <p style={{
            color: 'var(--ds-muted-foreground)',
            marginBottom: '2rem',
            fontSize: 'var(--text-base)',
            lineHeight: '1.6'
          }}>
            Your choice of accommodation shapes your TMB experience—from the rustic camaraderie of mountain refuges to the comfort of valley hotels.
          </p>

          <div className="accommodation-grid-mobile" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '1.25rem',
            marginBottom: '2rem'
          }}>
            {[
              {
                icon: Mountain,
                type: "Mountain Refuges",
                price: "€45-70/night",
                items: [
                  { type: 'pro', text: "Authentic mountain experience" },
                  { type: 'pro', text: "On-trail convenience" },
                  { type: 'pro', text: "Half-board included" },
                  { type: 'con', text: "Dormitory sleeping" },
                  { type: 'con', text: "Limited privacy" },
                  { type: 'con', text: "Must book early" }
                ]
              },
              {
                icon: Hotel,
                type: "Hotels",
                price: "€80-150/night",
                items: [
                  { type: 'pro', text: "Private rooms" },
                  { type: 'pro', text: "Comfortable beds" },
                  { type: 'pro', text: "More facilities" },
                  { type: 'con', text: "Often off-trail" },
                  { type: 'con', text: "Higher cost" },
                  { type: 'con', text: "Less authentic" }
                ]
              },
              {
                icon: Home,
                type: "B&Bs/Guesthouses",
                price: "€60-90/night",
                items: [
                  { type: 'pro', text: "Local hospitality" },
                  { type: 'pro', text: "Breakfast included" },
                  { type: 'pro', text: "Good value" },
                  { type: 'con', text: "Variable locations" },
                  { type: 'con', text: "Complex booking" },
                  { type: 'con', text: "Mixed quality" }
                ]
              },
              {
                icon: TreePine,
                type: "Camping",
                price: "€15-30/night",
                items: [
                  { type: 'pro', text: "Budget-friendly" },
                  { type: 'pro', text: "Maximum flexibility" },
                  { type: 'pro', text: "Outdoor experience" },
                  { type: 'con', text: "Carry tent/gear" },
                  { type: 'con', text: "Weather dependent" },
                  { type: 'con', text: "Fewer facilities" }
                ]
              }
            ].map((accommodation, index) => {
              const Icon = accommodation.icon;
              return (
                <div key={index} style={{
                  background: 'linear-gradient(135deg, white, var(--ds-off-white))',
                  border: `1px solid var(--ds-border)`,
                  borderRadius: '12px',
                  padding: '1.25rem',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  height: '100%'
                }}>
                  <Icon size={36} style={{ color: 'var(--ds-primary)', marginBottom: '0.75rem' }} />

                  <h3 style={{
                    fontWeight: '600',
                    fontSize: 'var(--text-base)',
                    color: 'var(--ds-foreground)',
                    margin: 0,
                    marginBottom: '0.375rem'
                  }}>
                    {accommodation.type}
                  </h3>
                  <div style={{
                    fontSize: 'var(--text-sm)',
                    color: 'var(--ds-primary)',
                    fontWeight: '600',
                    marginBottom: '1rem'
                  }}>
                    {accommodation.price}
                  </div>

                  <ul style={{
                    listStyle: 'none',
                    padding: 0,
                    margin: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.375rem',
                    width: '100%',
                    textAlign: 'left'
                  }}>
                    {accommodation.items.map((item, i) => (
                      <li key={i} style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '0.5rem',
                        fontSize: 'var(--text-xs)',
                        color: 'var(--ds-muted-foreground)',
                        lineHeight: '1.4'
                      }}>
                        {item.type === 'pro' ? (
                          <CheckCircle size={14} style={{ color: 'hsl(140, 40%, 45%)', flexShrink: 0, marginTop: '0.125rem' }} />
                        ) : (
                          <XCircle size={14} style={{ color: 'hsl(0, 70%, 50%)', flexShrink: 0, marginTop: '0.125rem' }} />
                        )}
                        <span>{item.text}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>

          <Link
            href="/guides/tmb-for-beginners/accommodations"
            style={{
              display: 'block',
              width: '100%',
              textAlign: 'center',
              background: 'var(--ds-primary)',
              color: 'white',
              padding: '1rem',
              borderRadius: '8px',
              textDecoration: 'none',
              fontWeight: '600',
              fontSize: 'var(--text-base)',
              transition: 'opacity 0.2s'
            }}
          >
            Explore All TMB Accommodations & Build Your Itinerary
          </Link>
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
                <Link
                  href="/guides/tmb-for-beginners/accommodations"
                  style={{
                    display: 'block',
                    width: '100%',
                    marginTop: '1rem',
                    background: 'transparent',
                    border: `1px solid var(--ds-border)`,
                    color: 'var(--ds-foreground)',
                    padding: '0.75rem',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: 'var(--text-sm)',
                    fontWeight: '600',
                    textDecoration: 'none',
                    textAlign: 'center',
                    transition: 'background 0.2s, border-color 0.2s'
                  }}
                >
                  Refuge Booking Guide
                </Link>
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
                <Link
                  href="/guides/tmb-for-beginners/tour-companies"
                  className="tour-companies-link"
                  style={{
                    display: 'block',
                    width: '100%',
                    marginTop: '1rem',
                    background: 'var(--ds-primary)',
                    color: 'white',
                    padding: '0.75rem',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: 'var(--text-sm)',
                    fontWeight: '600',
                    textDecoration: 'none',
                    textAlign: 'center',
                    transition: 'opacity 0.2s'
                  }}
                >
                  Find Tour Companies
                </Link>
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
                { time: "August previous year", task: "Plan ready" },
                { time: "September-October previous year", task: "Accommodation booking crunch time" },
                { time: "3 months ahead", task: "Logistics booked" },
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
                  ].map((item, index) => {
                    const timeEndIndex = item.indexOf(': ');
                    const time = item.substring(0, timeEndIndex);
                    const activity = item.substring(timeEndIndex + 2);
                    return (
                      <div key={index} style={{ color: 'var(--ds-foreground)' }}>
                        <strong>{time}:</strong> {activity}
                      </div>
                    );
                  })}
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

        {/* FAQs */}
        <SectionCard id="faqs" title="Frequently Asked Questions">
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
          }}>
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
              },
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
              <CollapsibleFAQItem key={index} question={faq.question} answer={faq.answer} />
            ))}
          </div>
        </SectionCard>

        {/* Hero Image before Explore More */}
        <div style={{
          margin: 'clamp(1.5rem, 3vw, 2rem) 0',
          borderRadius: '12px',
          overflow: 'hidden',
          height: 'clamp(250px, 50vw, 400px)',
          position: 'relative'
        }}>
          <Image
            src="/uploads/IMG_1615.jpg"
            alt="Epic Alpine Views"
            fill
            className="tmb-section-image"
            style={{ objectFit: 'cover', objectPosition: 'center' }}
          />
        </div>

        {/* Explore More Epic European Treks */}
        <SectionCard id="alternative-hikes" title="Explore More Epic European Treks">
          <p style={{
            color: 'var(--ds-muted-foreground)',
            marginBottom: '2rem',
            fontSize: 'var(--text-base)'
          }}>
            Completed the TMB and want a similar adventure? Or like the idea but want a quieter, yet equally beautiful trail?
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '1.5rem'
          }}>
              {[
                {
                  title: "Alta Via 1",
                  slug: "alta-via-1",
                  location: "Dolomites, Italy",
                  duration: "7-10 days",
                  distance: "~120km",
                  comparison: ["More dramatic jagged peaks", "Better hut food", "Less crowded than TMB"],
                  image: "/IMG_1696.jpg"
                },
                {
                  title: "Tour of Monte Rosa",
                  slug: "tour-of-monte-rosa",
                  location: "Swiss-Italian Alps",
                  duration: "9-11 days",
                  distance: "~160km",
                  comparison: ["Higher altitude passes", "More glaciers", "Similar to TMB but quieter"],
                  image: "/IMG_1420.jpg"
                },
                {
                  title: "Fisherman's Trail",
                  slug: "fishermans-trail-rota-vicentina",
                  location: "Portugal Coast",
                  duration: "4-5 days",
                  distance: "~75km",
                  comparison: ["Coastal instead of alpine", "Much easier terrain", "Better for beginners"],
                  image: "/IMG_1436.jpg"
                }
              ].map((hike, index) => (
                  <Link
                    key={index}
                    href={`/hike/${hike.slug}`}
                    style={{
                      display: 'block',
                      background: 'white',
                      border: `1px solid var(--ds-border)`,
                      borderRadius: '12px',
                      overflow: 'hidden',
                      boxShadow: 'var(--shadow-card)',
                      textDecoration: 'none',
                      transition: 'transform 0.2s, box-shadow 0.2s',
                      height: '100%'
                    }}
                  >
                    <div style={{
                      position: 'relative',
                      width: '100%',
                      height: '300px',
                      background: 'var(--ds-muted)'
                    }}>
                      <Image
                        src={hike.image}
                        alt={hike.title}
                        fill
                        sizes="340px"
                        style={{ objectFit: 'cover' }}
                      />
                    </div>
                    <div style={{ padding: '1.5rem' }}>
                      <h3 style={{
                        fontSize: 'var(--text-xl)',
                        fontWeight: '600',
                        color: 'var(--ds-foreground)',
                        marginBottom: '0.5rem'
                      }}>
                        {hike.title}
                      </h3>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        color: 'var(--ds-muted-foreground)',
                        fontSize: 'var(--text-sm)',
                        marginBottom: '0.75rem'
                      }}>
                        <MapPin size={14} />
                        {hike.location}
                      </div>
                      <div style={{
                        fontSize: 'var(--text-sm)',
                        color: 'var(--ds-muted-foreground)',
                        marginBottom: '1rem'
                      }}>
                        {hike.duration} • {hike.distance}
                      </div>
                      <div style={{
                        borderTop: `1px solid var(--ds-border)`,
                        paddingTop: '1rem'
                      }}>
                        <h4 style={{
                          fontSize: 'var(--text-sm)',
                          fontWeight: '600',
                          color: 'var(--ds-foreground)',
                          marginBottom: '0.5rem'
                        }}>
                          Compared to TMB:
                        </h4>
                        <ul style={{
                          listStyle: 'none',
                          padding: 0,
                          margin: 0,
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '0.25rem'
                        }}>
                          {hike.comparison.map((point, i) => (
                            <li key={i} style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.5rem',
                              fontSize: 'var(--text-sm)',
                              color: 'var(--ds-muted-foreground)'
                            }}>
                              <CheckCircle size={14} style={{ color: 'var(--ds-primary)', flexShrink: 0 }} />
                              {point}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </Link>
              ))}
          </div>
        </SectionCard>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

