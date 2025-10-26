// src/app/guides/tmb-for-beginners/tour-companies/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Navigation from '../../../components/Navigation';
import Footer from '../../../components/Footer';
import Link from 'next/link';
import Image from 'next/image';
import { CheckCircle, XCircle, ExternalLink, Users, Mountain, Shield, MapPin } from 'lucide-react';

export default function TourCompaniesPage() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const localCompanies = [
    {
      name: "Altitude Mont Blanc",
      url: "https://www.altitude-montblanc.com/",
      location: "Chamonix, France",
      description: "Based in Chamonix, Altitude Mont Blanc is one of the most respected local guiding companies with decades of experience on the TMB. They specialize in small group treks with highly qualified mountain guides.",
      strengths: ["Local expertise and knowledge", "Qualified IFMGA mountain guides", "Small group sizes (6-8 people)", "Flexible itineraries"],
      groupSize: "6-8 people"
    },
    {
      name: "Mont Blanc Treks",
      url: "https://www.montblanctreks.com/",
      location: "Chamonix, France",
      description: "A family-run business based in the heart of the Mont Blanc region, offering guided and self-guided TMB tours. Known for their personal touch and deep local connections.",
      strengths: ["Family-run with personal service", "Both guided and self-guided options", "Excellent local accommodation network", "Luggage transfer services"],
      groupSize: "4-10 people"
    },
    {
      name: "Cloud 9 Adventure",
      url: "https://www.cloud9adventure.com/",
      location: "Chamonix, France",
      description: "Specialized trekking company focusing exclusively on multi-day mountain treks in the Alps. They pride themselves on sustainable tourism and supporting local communities.",
      strengths: ["Sustainability focused", "Expert local guides", "Premium accommodation options", "Small groups with personal attention"],
      groupSize: "6-8 people"
    }
  ];

  const globalCompanies = [
    {
      name: "Pygmy Elephant",
      url: "https://www.pygmy-elephant.com/",
      location: "UK-based",
      description: "A boutique adventure travel company offering small-group treks worldwide. Their TMB tours are known for carefully curated accommodations and experienced trip leaders.",
      strengths: ["Small groups", "Curated accommodations", "Experienced trip leaders", "UK customer support"],
      groupSize: "8-12 people"
    },
    {
      name: "Macs Adventure",
      url: "https://www.macsadventure.com/",
      location: "UK-based",
      description: "One of Europe's largest self-guided and guided walking tour operators. They offer flexible TMB packages with comprehensive support and logistics.",
      strengths: ["Self-guided and guided options", "Flexible dates and durations", "Comprehensive support", "Competitive pricing"],
      groupSize: "Varies (self-guided or small groups)"
    }
  ];

  return (
    <div style={{ background: 'var(--ds-background)', minHeight: '100vh' }}>
      <style jsx>{`
        .company-link-primary:hover {
          opacity: 0.9;
        }
        .company-link-outline:hover {
          background: var(--ds-primary) !important;
          color: white !important;
        }
        .back-link:hover {
          opacity: 0.9;
        }
      `}</style>
      <Navigation />

      {/* Hero Section */}
      <div style={{
        position: 'relative',
        height: isMobile ? '50vh' : '60vh',
        minHeight: isMobile ? '400px' : '500px',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <Image
          src="/uploads/itineraries/gentle-trekker/DJI_0213-HDR.jpg"
          alt="Guided TMB Tour"
          fill
          sizes="100vw"
          style={{ objectFit: 'cover', zIndex: 0 }}
          priority={true}
        />
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(135deg, rgba(45, 55, 72, 0.7), rgba(45, 55, 72, 0.5))',
          zIndex: 1
        }} />
        <div style={{
          position: 'relative',
          zIndex: 2,
          textAlign: 'center',
          color: 'white',
          maxWidth: '900px',
          padding: '0 2rem'
        }}>
          <h1 style={{
            fontSize: isMobile ? 'clamp(2rem, 8vw, 3.5rem)' : 'clamp(2.5rem, 5vw, 4rem)',
            fontWeight: '700',
            marginBottom: '1rem',
            textShadow: '0 2px 8px rgba(0,0,0,0.3)'
          }}>
            TMB Tour Companies
          </h1>
          <p style={{
            fontSize: isMobile ? 'var(--text-base)' : 'var(--text-xl)',
            maxWidth: '700px',
            margin: '0 auto',
            textShadow: '0 1px 4px rgba(0,0,0,0.3)'
          }}>
            Should you trek independently or join a guided tour? Find the right tour company for your TMB adventure.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <main style={{
        paddingTop: isMobile ? '2rem' : '3rem',
        paddingBottom: isMobile ? '2rem' : '3rem',
        maxWidth: '1200px',
        margin: '0 auto',
        padding: isMobile ? '2rem 0.75rem' : '3rem 1rem'
      }}>

        {/* Introduction */}
        <section style={{
          background: 'white',
          border: `1px solid var(--ds-border)`,
          borderRadius: '12px',
          padding: isMobile ? '1.5rem' : '2rem',
          marginBottom: '3rem'
        }}>
          <h2 style={{
            fontSize: 'var(--text-2xl)',
            fontWeight: '600',
            marginBottom: '1.5rem',
            color: 'var(--ds-foreground)'
          }}>
            Guided vs Independent Trekking
          </h2>
          <div style={{
            fontSize: 'var(--text-base)',
            lineHeight: '1.8',
            color: 'var(--ds-muted-foreground)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
          }}>
            <p>
              The Tour du Mont Blanc can be trekked independently or with a guided tour company. Both approaches have their merits, and the right choice depends on your experience level, preferences, and budget.
            </p>
            <p>
              Joining a guided tour provides expert leadership, pre-arranged logistics, and the camaraderie of a small group. It's ideal for first-time trekkers, those who prefer not to handle booking complexities, or anyone who values the insights of an experienced mountain guide.
            </p>
            <p>
              Independent trekking offers maximum flexibility, the freedom to set your own pace, and the satisfaction of navigating the trail yourself. It requires more planning but can be more rewarding for experienced hikers who enjoy self-sufficiency.
            </p>
          </div>
        </section>

        {/* Benefits and Drawbacks */}
        <section style={{
          background: 'white',
          border: `1px solid var(--ds-border)`,
          borderRadius: '12px',
          padding: isMobile ? '1.5rem' : '2rem',
          marginBottom: '3rem'
        }}>
          <h2 style={{
            fontSize: 'var(--text-2xl)',
            fontWeight: '600',
            marginBottom: '2rem',
            color: 'var(--ds-foreground)'
          }}>
            Pros & Cons of Guided Tours
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
            gap: '2rem'
          }}>
            {/* Benefits */}
            <div>
              <h3 style={{
                fontSize: 'var(--text-lg)',
                fontWeight: '600',
                marginBottom: '1rem',
                color: 'hsl(140, 40%, 45%)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <CheckCircle size={24} />
                Benefits
              </h3>
              <ul style={{
                listStyle: 'none',
                padding: 0,
                margin: 0,
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem'
              }}>
                {[
                  "All logistics handled (bookings, transfers, meals)",
                  "Expert mountain guide with local knowledge",
                  "Group safety and support throughout",
                  "Meet like-minded trekkers from around the world",
                  "No stress about navigation or route-finding",
                  "Insider tips on the region, culture, and wildlife",
                  "Emergency support and problem-solving",
                  "Often includes luggage transfer between refuges"
                ].map((benefit, i) => (
                  <li key={i} style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.75rem',
                    fontSize: 'var(--text-sm)',
                    color: 'var(--ds-muted-foreground)',
                    lineHeight: '1.6'
                  }}>
                    <CheckCircle size={18} style={{
                      color: 'hsl(140, 40%, 45%)',
                      flexShrink: 0,
                      marginTop: '0.125rem'
                    }} />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Drawbacks */}
            <div>
              <h3 style={{
                fontSize: 'var(--text-lg)',
                fontWeight: '600',
                marginBottom: '1rem',
                color: 'hsl(0, 70%, 50%)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <XCircle size={24} />
                Drawbacks
              </h3>
              <ul style={{
                listStyle: 'none',
                padding: 0,
                margin: 0,
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem'
              }}>
                {[
                  "Significantly higher cost (€2,000-3,500 per person)",
                  "Fixed dates and limited flexibility",
                  "Must match the group's pace",
                  "Less personal freedom and spontaneity",
                  "Limited choice in accommodations",
                  "Scheduled rest days and side trips",
                  "Group dynamics can vary",
                  "Less sense of personal achievement"
                ].map((drawback, i) => (
                  <li key={i} style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.75rem',
                    fontSize: 'var(--text-sm)',
                    color: 'var(--ds-muted-foreground)',
                    lineHeight: '1.6'
                  }}>
                    <XCircle size={18} style={{
                      color: 'hsl(0, 70%, 50%)',
                      flexShrink: 0,
                      marginTop: '0.125rem'
                    }} />
                    <span>{drawback}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div style={{
            marginTop: '2rem',
            padding: '1.5rem',
            background: 'var(--ds-off-white)',
            borderRadius: '8px',
            borderLeft: '4px solid var(--ds-primary)'
          }}>
            <p style={{
              fontSize: 'var(--text-sm)',
              lineHeight: '1.6',
              color: 'var(--ds-muted-foreground)',
              margin: 0
            }}>
              <strong>Our recommendation:</strong> Guided tours are excellent for first-time alpine trekkers, those traveling solo who want companionship, or anyone who values convenience over cost. Independent trekking is ideal for experienced hikers who enjoy planning and want maximum flexibility.
            </p>
          </div>
        </section>

        {/* Local Companies */}
        <section style={{
          background: 'white',
          border: `1px solid var(--ds-border)`,
          borderRadius: '12px',
          padding: isMobile ? '1.5rem' : '2rem',
          marginBottom: '3rem'
        }}>
          <div style={{ marginBottom: '2rem' }}>
            <h2 style={{
              fontSize: 'var(--text-2xl)',
              fontWeight: '600',
              marginBottom: '0.5rem',
              color: 'var(--ds-foreground)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem'
            }}>
              <Mountain size={28} style={{ color: 'var(--ds-primary)' }} />
              Local Companies (Recommended)
            </h2>
            <p style={{
              fontSize: 'var(--text-sm)',
              color: 'var(--ds-muted-foreground)',
              lineHeight: '1.6'
            }}>
              These companies are based in the Mont Blanc region and offer the deepest local expertise, best accommodation connections, and most authentic experience.
            </p>
          </div>

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '2rem'
          }}>
            {localCompanies.map((company, index) => (
              <div key={index} style={{
                border: `1px solid var(--ds-border)`,
                borderRadius: '8px',
                padding: '1.5rem',
                background: 'linear-gradient(135deg, white, var(--ds-off-white))'
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: '1rem',
                  gap: '1rem',
                  flexWrap: 'wrap'
                }}>
                  <div>
                    <h3 style={{
                      fontSize: 'var(--text-xl)',
                      fontWeight: '600',
                      marginBottom: '0.5rem',
                      color: 'var(--ds-foreground)'
                    }}>
                      {company.name}
                    </h3>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      fontSize: 'var(--text-sm)',
                      color: 'var(--ds-muted-foreground)',
                      marginBottom: '0.5rem'
                    }}>
                      <MapPin size={16} />
                      {company.location}
                    </div>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      fontSize: 'var(--text-sm)',
                      color: 'var(--ds-muted-foreground)'
                    }}>
                      <Users size={16} />
                      Group size: {company.groupSize}
                    </div>
                  </div>
                  <a
                    href={company.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="company-link-primary"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.75rem 1.25rem',
                      background: 'var(--ds-primary)',
                      color: 'white',
                      borderRadius: '6px',
                      textDecoration: 'none',
                      fontSize: 'var(--text-sm)',
                      fontWeight: '600',
                      transition: 'opacity 0.2s'
                    }}
                  >
                    Visit Website
                    <ExternalLink size={16} />
                  </a>
                </div>

                <p style={{
                  fontSize: 'var(--text-sm)',
                  lineHeight: '1.6',
                  color: 'var(--ds-muted-foreground)',
                  marginBottom: '1rem'
                }}>
                  {company.description}
                </p>

                <div>
                  <h4 style={{
                    fontSize: 'var(--text-sm)',
                    fontWeight: '600',
                    marginBottom: '0.75rem',
                    color: 'var(--ds-foreground)'
                  }}>
                    Key Strengths:
                  </h4>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
                    gap: '0.5rem'
                  }}>
                    {company.strengths.map((strength, i) => (
                      <div key={i} style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        fontSize: 'var(--text-sm)',
                        color: 'var(--ds-muted-foreground)'
                      }}>
                        <CheckCircle size={14} style={{
                          color: 'hsl(140, 40%, 45%)',
                          flexShrink: 0
                        }} />
                        <span>{strength}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Global Companies */}
        <section style={{
          background: 'white',
          border: `1px solid var(--ds-border)`,
          borderRadius: '12px',
          padding: isMobile ? '1.5rem' : '2rem',
          marginBottom: '3rem'
        }}>
          <div style={{ marginBottom: '2rem' }}>
            <h2 style={{
              fontSize: 'var(--text-2xl)',
              fontWeight: '600',
              marginBottom: '0.5rem',
              color: 'var(--ds-foreground)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem'
            }}>
              <Shield size={28} style={{ color: 'var(--ds-primary)' }} />
              Global Companies
            </h2>
            <p style={{
              fontSize: 'var(--text-sm)',
              color: 'var(--ds-muted-foreground)',
              lineHeight: '1.6'
            }}>
              Established international operators offering TMB tours with comprehensive support and flexible options. Good alternatives if local companies are fully booked.
            </p>
          </div>

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '2rem'
          }}>
            {globalCompanies.map((company, index) => (
              <div key={index} style={{
                border: `1px solid var(--ds-border)`,
                borderRadius: '8px',
                padding: '1.5rem',
                background: 'white'
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: '1rem',
                  gap: '1rem',
                  flexWrap: 'wrap'
                }}>
                  <div>
                    <h3 style={{
                      fontSize: 'var(--text-xl)',
                      fontWeight: '600',
                      marginBottom: '0.5rem',
                      color: 'var(--ds-foreground)'
                    }}>
                      {company.name}
                    </h3>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      fontSize: 'var(--text-sm)',
                      color: 'var(--ds-muted-foreground)',
                      marginBottom: '0.5rem'
                    }}>
                      <MapPin size={16} />
                      {company.location}
                    </div>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      fontSize: 'var(--text-sm)',
                      color: 'var(--ds-muted-foreground)'
                    }}>
                      <Users size={16} />
                      Group size: {company.groupSize}
                    </div>
                  </div>
                  <a
                    href={company.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="company-link-outline"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.75rem 1.25rem',
                      background: 'white',
                      color: 'var(--ds-primary)',
                      border: '1px solid var(--ds-primary)',
                      borderRadius: '6px',
                      textDecoration: 'none',
                      fontSize: 'var(--text-sm)',
                      fontWeight: '600',
                      transition: 'all 0.2s'
                    }}
                  >
                    Visit Website
                    <ExternalLink size={16} />
                  </a>
                </div>

                <p style={{
                  fontSize: 'var(--text-sm)',
                  lineHeight: '1.6',
                  color: 'var(--ds-muted-foreground)',
                  marginBottom: '1rem'
                }}>
                  {company.description}
                </p>

                <div>
                  <h4 style={{
                    fontSize: 'var(--text-sm)',
                    fontWeight: '600',
                    marginBottom: '0.75rem',
                    color: 'var(--ds-foreground)'
                  }}>
                    Key Strengths:
                  </h4>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
                    gap: '0.5rem'
                  }}>
                    {company.strengths.map((strength, i) => (
                      <div key={i} style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        fontSize: 'var(--text-sm)',
                        color: 'var(--ds-muted-foreground)'
                      }}>
                        <CheckCircle size={14} style={{
                          color: 'hsl(140, 40%, 45%)',
                          flexShrink: 0
                        }} />
                        <span>{strength}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Back to Guide */}
        <div style={{ textAlign: 'center' }}>
          <Link
            href="/guides/tmb-for-beginners"
            className="back-link"
            style={{
              display: 'inline-block',
              padding: '1rem 2rem',
              background: 'var(--ds-primary)',
              color: 'white',
              borderRadius: '8px',
              textDecoration: 'none',
              fontSize: 'var(--text-base)',
              fontWeight: '600',
              transition: 'opacity 0.2s'
            }}
          >
            ← Back to TMB Guide
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
