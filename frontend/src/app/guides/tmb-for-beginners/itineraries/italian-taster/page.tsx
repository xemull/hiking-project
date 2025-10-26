// src/app/guides/tmb-for-beginners/itineraries/italian-taster/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Navigation from '../../../../components/Navigation';
import Footer from '../../../../components/Footer';
import { Mountain, TrendingUp, TrendingDown, Clock, Info } from 'lucide-react';

export default function ItalianTasterPage() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);
  const days = [
    {
      number: 1,
      title: "Courmayeur to Val Ferret (Rifugio Bonatti)",
      distance: "12–19 km",
      elevationGain: "860–1500 m",
      elevationLoss: "100–750 m",
      duration: "5–7 hours",
      journey: "The adventure begins immediately with one of the TMB's signature stages. From Courmayeur, the trail climbs steeply for nearly 800 m to Rifugio Bertone, a strenuous start that quickly rewards with incredible views. From the refuge, the trail levels out onto a spectacular high-level balcony path. For the rest of the day, you will traverse high above the Italian Val Ferret, with constant, awe-inspiring views of the Grandes Jorasses massif and the southern face of Mont Blanc. The day's hike ends at the beautifully positioned Rifugio Bonatti."
    },
    {
      number: 2,
      title: "Val Ferret to La Fouly & Transfer to Champex-Lac",
      distance: "17 km",
      elevationGain: "1130 m",
      elevationLoss: "1450 m",
      duration: "6–7 hours",
      journey: "Today's goal is the crossing into Switzerland via the Grand Col Ferret (2,537 m). From Rifugio Bonatti, the trail descends to the valley floor before beginning the long, steady ascent to the high pass. The views looking back down the Italian valley are magnificent. Once over the col and into Switzerland, the landscape softens into green pastures. A long descent leads to the village of Ferret and continues to La Fouly. To position for the next stage and maximize the scenic value of this short trip, this itinerary utilizes a short public bus transfer from La Fouly to the lakeside town of Champex-Lac for the overnight stay."
    },
    {
      number: 3,
      title: "Champex-Lac to Trient",
      distance: "14 km",
      elevationGain: "730 m",
      elevationLoss: "920 m",
      duration: "5–7 hours",
      journey: "From the serene shores of Champex-Lac, you have two distinct options for reaching the village of Trient. The standard TMB choice is the \"Bovine Route,\" a scenic and moderately difficult path that climbs over alpine pastures with wonderful views of the Rhône Valley before descending to the Col de la Forclaz and then down to Trient. For very fit hikers in excellent weather, the more challenging Fenêtre d'Arpette variant offers a wilder, more rugged high-mountain experience with dramatic views of the Trient Glacier. Both routes end in the small Swiss village of Trient."
    },
    {
      number: 4,
      title: "Trient to Chamonix & Return to Courmayeur",
      distance: "15 km",
      elevationGain: "1100 m",
      elevationLoss: "1300 m",
      duration: "6–7 hours",
      journey: "The final day involves the crossing back into France. An early start from Trient begins with a steep climb, mostly in the morning shade, up to the Col de Balme. Reaching the col is a climatic moment, revealing the entire Chamonix Valley and the Mont Blanc massif in a stunning panorama. From the pass, a long descent leads to the village of Le Tour or Montroc at the top of the Chamonix Valley. Here, you will take the local train or bus into Chamonix town center to end the hiking portion of the trip. After a celebratory lunch in Chamonix, complete the loop by taking one of the regular cross-border buses (e.g., FlixBus, SAVDA) back through the Mont Blanc tunnel to your starting point in Courmayeur."
    }
  ];

  return (
    <>
      <Navigation />
      <main style={{ background: 'var(--ds-off-white)', minHeight: '100vh' }}>

        {/* Hero Section */}
        <div style={{
          position: 'relative',
          height: isMobile ? '50vh' : '85vh',
          minHeight: isMobile ? '400px' : '600px',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {/* Hero image */}
          <img
            src="/uploads/IMG_1489.jpg"
            alt="The Italian Taster hero"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
          />

          {/* Overlay */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'linear-gradient(180deg, rgba(0, 0, 0, 0.3) 0%, rgba(0, 0, 0, 0.5) 100%)',
            zIndex: 1
          }} />

          {/* Content */}
          <div style={{
            position: 'relative',
            zIndex: 2,
            textAlign: 'center',
            color: 'white',
            padding: '0 2rem',
            maxWidth: '1100px',
            margin: '0 auto'
          }}>
            <h1 style={{
              fontFamily: 'Inter, system-ui, sans-serif',
              fontSize: 'clamp(2.5rem, 7vw, 4.5rem)',
              fontWeight: 700,
              textShadow: '0 2px 20px rgba(0, 0, 0, 0.5)',
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
              margin: 0,
              marginBottom: '1rem'
            }}>
              The Italian Taster
            </h1>
            <p style={{
              fontFamily: 'Inter, system-ui, sans-serif',
              fontSize: 'clamp(1.25rem, 2.5vw, 1.75rem)',
              fontWeight: 400,
              opacity: 0.95,
              textShadow: '0 2px 10px rgba(0, 0, 0, 0.5)',
              lineHeight: 1.4,
              margin: 0
            }}>
              A 4-Day Loop from Courmayeur
            </p>
          </div>
        </div>

        {/* Introduction Section */}
        <div style={{ background: 'white', padding: isMobile ? '2rem 0.75rem' : '4rem 1rem', borderBottom: '1px solid var(--ds-border)' }}>
          <div className="container mx-auto px-4" style={{ maxWidth: '900px', padding: isMobile ? '0 0.5rem' : '0 1rem' }}>
            <p style={{
              fontFamily: 'Inter, system-ui, sans-serif',
              fontSize: 'clamp(1.125rem, 2vw, 1.25rem)',
              color: 'var(--ds-foreground)',
              lineHeight: 1.7,
              marginBottom: '1.5rem'
            }}>
              This short but spectacular itinerary is designed for the time-crunched traveler who wants to experience the essence of the Tour du Mont Blanc over a long weekend. It distills the TMB into its most scenic components, focusing on the grand Italian balcony paths, the crossing into Switzerland, and the return to France, delivering maximum scenic "bang for your buck". The route begins and ends in the charming Italian town of Courmayeur, making logistics straightforward.
            </p>
            <p style={{
              fontFamily: 'Inter, system-ui, sans-serif',
              fontSize: 'clamp(1.125rem, 2vw, 1.25rem)',
              color: 'var(--ds-foreground)',
              lineHeight: 1.7
            }}>
              It is important to understand that this is a "logistical loop," not a physical one. The trek follows a linear path from Italy, through Switzerland, and into France. The loop is completed on the final day by utilizing the efficient public bus system to travel from the trek's end point in the Chamonix Valley back to the starting point in Courmayeur via the Mont Blanc tunnel. This itinerary is a perfect, high-impact introduction to the magic of the TMB.
            </p>
          </div>
        </div>

        {/* Day-by-Day Section */}
        <div style={{ padding: isMobile ? '2rem 0.75rem' : '4rem 1rem', background: 'var(--ds-off-white)' }}>
          <div className="container mx-auto px-4" style={{ maxWidth: '1200px', padding: isMobile ? '0 0.5rem' : '0 1rem' }}>
            <h2 style={{
              fontFamily: 'Inter, system-ui, sans-serif',
              fontSize: 'clamp(2rem, 4vw, 2.5rem)',
              fontWeight: 600,
              color: 'var(--ds-foreground)',
              marginBottom: isMobile ? '2rem' : '3rem',
              textAlign: 'center'
            }}>
              Detailed Stage-by-Stage Breakdown
            </h2>

            {/* Days */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? '1.5rem' : '2rem' }}>
              {days.map((day) => (
                <React.Fragment key={day.number}>
                  {/* Content Images */}
                  {day.number === 1 && (
                    <img
                      src="/uploads/IMG_1516.jpg"
                      alt="Italian Taster Stage 1"
                      style={{
                        width: '100%',
                        height: isMobile ? '300px' : '600px',
                        objectFit: 'cover',
                        borderRadius: isMobile ? '12px' : '16px',
                        marginBottom: isMobile ? '1rem' : '2rem'
                      }}
                    />
                  )}
                  {day.number === 3 && (
                    <img
                      src="/uploads/IMG_1696.jpg"
                      alt="Italian Taster Stage 3"
                      style={{
                        width: '100%',
                        height: isMobile ? '300px' : '600px',
                        objectFit: 'cover',
                        borderRadius: isMobile ? '12px' : '16px',
                        marginBottom: isMobile ? '1rem' : '2rem'
                      }}
                    />
                  )}

                  <div
                    style={{
                      background: 'white',
                      borderRadius: isMobile ? '12px' : '16px',
                      overflow: 'hidden',
                      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.08)',
                      border: '1px solid #f3f4f6'
                    }}
                  >
                    {/* Content */}
                    <div style={{ padding: isMobile ? '1rem' : '2rem' }}>
                      {/* Day Header */}
                      <div style={{ marginBottom: '1.5rem' }}>
                        <div style={{
                          display: 'inline-block',
                          background: 'hsl(208, 70%, 95%)',
                          color: 'hsl(208, 70%, 35%)',
                          padding: '0.375rem 0.875rem',
                          borderRadius: '6px',
                          fontSize: '0.875rem',
                          fontWeight: 600,
                          marginBottom: '0.75rem'
                        }}>
                          Day {day.number}
                        </div>
                        <h3 style={{
                          fontFamily: 'Inter, system-ui, sans-serif',
                          fontSize: 'clamp(1.5rem, 3vw, 2rem)',
                          fontWeight: 600,
                          color: 'var(--ds-foreground)',
                          margin: 0,
                          lineHeight: 1.2
                        }}>
                          {day.title}
                        </h3>
                      </div>

                      {/* Statistics Grid */}
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(auto-fit, minmax(140px, 1fr))',
                        gap: isMobile ? '0.75rem' : '1rem',
                        marginBottom: isMobile ? '1.25rem' : '2rem',
                        padding: isMobile ? '0' : '1.25rem',
                        background: isMobile ? 'transparent' : 'var(--ds-off-white)',
                        borderRadius: isMobile ? '0' : '8px'
                      }}>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                            <Mountain style={{ width: '1rem', height: '1rem', color: 'var(--ds-muted-foreground)' }} />
                            <span style={{
                              fontFamily: 'Inter, system-ui, sans-serif',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              color: 'var(--ds-muted-foreground)',
                              textTransform: 'uppercase'
                            }}>
                              Distance
                            </span>
                          </div>
                          <div style={{
                            fontFamily: 'Inter, system-ui, sans-serif',
                            fontSize: '1.125rem',
                            fontWeight: 600,
                            color: 'var(--ds-foreground)'
                          }}>
                            {day.distance}
                          </div>
                        </div>

                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                            <TrendingUp style={{ width: '1rem', height: '1rem', color: 'var(--ds-muted-foreground)' }} />
                            <span style={{
                              fontFamily: 'Inter, system-ui, sans-serif',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              color: 'var(--ds-muted-foreground)',
                              textTransform: 'uppercase'
                            }}>
                              Ascent
                            </span>
                          </div>
                          <div style={{
                            fontFamily: 'Inter, system-ui, sans-serif',
                            fontSize: '1.125rem',
                            fontWeight: 600,
                            color: 'var(--ds-foreground)'
                          }}>
                            +{day.elevationGain}
                          </div>
                        </div>

                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                            <TrendingDown style={{ width: '1rem', height: '1rem', color: 'var(--ds-muted-foreground)' }} />
                            <span style={{
                              fontFamily: 'Inter, system-ui, sans-serif',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              color: 'var(--ds-muted-foreground)',
                              textTransform: 'uppercase'
                            }}>
                              Descent
                            </span>
                          </div>
                          <div style={{
                            fontFamily: 'Inter, system-ui, sans-serif',
                            fontSize: '1.125rem',
                            fontWeight: 600,
                            color: 'var(--ds-foreground)'
                          }}>
                            -{day.elevationLoss}
                          </div>
                        </div>

                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                            <Clock style={{ width: '1rem', height: '1rem', color: 'var(--ds-muted-foreground)' }} />
                            <span style={{
                              fontFamily: 'Inter, system-ui, sans-serif',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              color: 'var(--ds-muted-foreground)',
                              textTransform: 'uppercase'
                            }}>
                              Duration
                            </span>
                          </div>
                          <div style={{
                            fontFamily: 'Inter, system-ui, sans-serif',
                            fontSize: '1.125rem',
                            fontWeight: 600,
                            color: 'var(--ds-foreground)'
                          }}>
                            {day.duration}
                          </div>
                        </div>
                      </div>

                      {/* The Journey */}
                      <div>
                        <h4 style={{
                          fontFamily: 'Inter, system-ui, sans-serif',
                          fontSize: '1.125rem',
                          fontWeight: 600,
                          color: 'var(--ds-foreground)',
                          marginBottom: '0.75rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem'
                        }}>
                          <Info style={{ width: '1.25rem', height: '1.25rem', color: 'hsl(208, 70%, 45%)' }} />
                          The Journey
                        </h4>
                        <p style={{
                          fontFamily: 'Inter, system-ui, sans-serif',
                          fontSize: '1rem',
                          color: 'var(--ds-foreground)',
                          lineHeight: 1.7,
                          margin: 0
                        }}>
                          {day.journey}
                        </p>
                      </div>
                    </div>
                  </div>
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>

        {/* Other Itineraries Section */}
        <div style={{ padding: isMobile ? '2rem 0.75rem' : '4rem 1rem', background: 'white', borderTop: '1px solid var(--ds-border)' }}>
          <div className="container mx-auto px-4" style={{ maxWidth: '1200px', padding: isMobile ? '0 0.5rem' : '0 1rem' }}>
            <h2 style={{
              fontFamily: 'Inter, system-ui, sans-serif',
              fontSize: 'clamp(1.75rem, 3vw, 2.25rem)',
              fontWeight: 600,
              color: 'var(--ds-foreground)',
              marginBottom: isMobile ? '1.5rem' : '2rem',
              textAlign: 'center'
            }}>
              Explore Other Itineraries
            </h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '1.5rem',
              marginBottom: '2rem'
            }}>
              <a href="/guides/tmb-for-beginners/itineraries/classic-circuit" style={{
                display: 'block',
                background: 'var(--ds-off-white)',
                padding: '1.5rem',
                borderRadius: '12px',
                border: '1px solid var(--ds-border)',
                textDecoration: 'none',
                transition: 'all 0.2s',
                cursor: 'pointer'
              }}
              onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                <h3 style={{
                  fontFamily: 'Inter, system-ui, sans-serif',
                  fontSize: '1.25rem',
                  fontWeight: 600,
                  color: 'var(--ds-foreground)',
                  marginBottom: '0.5rem'
                }}>
                  The Classic Circuit
                </h3>
                <p style={{
                  fontFamily: 'Inter, system-ui, sans-serif',
                  fontSize: '0.875rem',
                  color: 'var(--ds-muted-foreground)',
                  lineHeight: 1.6,
                  margin: 0
                }}>
                  11 days • Challenging • For the Traditionalist
                </p>
              </a>

              <a href="/guides/tmb-for-beginners/itineraries/gentle-trekker" style={{
                display: 'block',
                background: 'var(--ds-off-white)',
                padding: '1.5rem',
                borderRadius: '12px',
                border: '1px solid var(--ds-border)',
                textDecoration: 'none',
                transition: 'all 0.2s',
                cursor: 'pointer'
              }}
              onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                <h3 style={{
                  fontFamily: 'Inter, system-ui, sans-serif',
                  fontSize: '1.25rem',
                  fontWeight: 600,
                  color: 'var(--ds-foreground)',
                  marginBottom: '0.5rem'
                }}>
                  The Gentle Trekker
                </h3>
                <p style={{
                  fontFamily: 'Inter, system-ui, sans-serif',
                  fontSize: '0.875rem',
                  color: 'var(--ds-muted-foreground)',
                  lineHeight: 1.6,
                  margin: 0
                }}>
                  12 days • Moderate • For the Comfort-Seeker
                </p>
              </a>

              <a href="/guides/tmb-for-beginners/itineraries/western-front" style={{
                display: 'block',
                background: 'var(--ds-off-white)',
                padding: '1.5rem',
                borderRadius: '12px',
                border: '1px solid var(--ds-border)',
                textDecoration: 'none',
                transition: 'all 0.2s',
                cursor: 'pointer'
              }}
              onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                <h3 style={{
                  fontFamily: 'Inter, system-ui, sans-serif',
                  fontSize: '1.25rem',
                  fontWeight: 600,
                  color: 'var(--ds-foreground)',
                  marginBottom: '0.5rem'
                }}>
                  The Western Front
                </h3>
                <p style={{
                  fontFamily: 'Inter, system-ui, sans-serif',
                  fontSize: '0.875rem',
                  color: 'var(--ds-muted-foreground)',
                  lineHeight: 1.6,
                  margin: 0
                }}>
                  5 days • Moderate+ • For the Time-Crunched Hiker
                </p>
              </a>
            </div>

            <div style={{ textAlign: 'center' }}>
              <a href="/guides/tmb-for-beginners" style={{
                display: 'inline-block',
                padding: '0.75rem 1.5rem',
                background: 'var(--ds-foreground)',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '8px',
                fontFamily: 'Inter, system-ui, sans-serif',
                fontSize: '1rem',
                fontWeight: 600,
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => e.currentTarget.style.opacity = '0.9'}
              onMouseOut={(e) => e.currentTarget.style.opacity = '1'}>
                ← Back to TMB Planner
              </a>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
