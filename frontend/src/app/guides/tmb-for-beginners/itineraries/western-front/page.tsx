// src/app/guides/tmb-for-beginners/itineraries/western-front/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Navigation from '../../../../components/Navigation';
import Footer from '../../../../components/Footer';
import { Mountain, TrendingUp, TrendingDown, Clock, Bed, Info, Lightbulb } from 'lucide-react';

export default function WesternFrontPage() {
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
      title: "Chamonix to Les Houches (via Le Brévent)",
      distance: "13 km",
      elevationGain: "700 m",
      elevationLoss: "1500 m",
      duration: "5–6 hours",
      journey: "This itinerary begins with a spectacular inversion of the classic route. Instead of starting with the climb out of Les Houches, the trek commences in Chamonix town center. Take the Planpraz and then the Le Brévent cable cars up to the summit of Le Brévent (2,525 m). This immediately places you at one of the most stunning viewpoints in the Alps, with a full panorama of Mont Blanc directly opposite. The day's hike follows what is classically the final stage of the TMB, but in reverse. You will descend from Le Brévent along a stunning, airy ridge towards Refuge Bel Lachat, followed by a long, sustained, and challenging descent via Parc Merlet to the village of Les Houches. This tough first day is a trial by fire but rewards you with the best views from the very start.",
      expertCues: "This descent is one of the most punishing of the entire TMB due to its steepness and length. Trekking poles are highly recommended to protect your knees. Starting this way acclimatizes you quickly and front-loads the dramatic scenery."
    },
    {
      number: 2,
      title: "Les Houches to Les Contamines",
      distance: "13 km",
      elevationGain: "800 m",
      elevationLoss: "1300 m",
      duration: "5–6 hours",
      journey: "This day follows the path of Classic Stage 1. Begin with the Bellevue cable car from Les Houches to avoid the initial climb. From the Bellevue plateau, the route follows the highly recommended Col du Tricot variant. Traverse beneath the Bionnassay glacier, cross the Himalayan suspension bridge, and make the steady climb to the Col du Tricot. After soaking in the views, undertake the steep descent to Refuge Miage for a potential lunch stop (the blueberry pie is memorable) before climbing briefly over to Auberge du Truc and then making the final long descent through forests to Les Contamines."
    },
    {
      number: 3,
      title: "Les Contamines to Les Chapieux",
      distance: "20 km",
      elevationGain: "1500 m",
      elevationLoss: "900 m",
      duration: "7–9 hours",
      journey: "This stage mirrors the demanding Classic Stage 2. The day involves ascending over three successive cols: the Col du Bonhomme, the Col de la Croix du Bonhomme, and the optional but highly recommended Col des Fours (2,665 m), the highest point on this itinerary. The landscape becomes progressively wilder and more remote as you climb out of the Val Montjoie into the Beaufortain region. The descent from the Col des Fours is steep and can hold snow early in the season, leading down through a desolate valley to the isolated hamlet of Les Chapieux.",
      expertCues: "This is a very long and strenuous day. An early start is essential to allow plenty of time. The Col des Fours variant offers vast panoramas but should only be attempted in good weather."
    },
    {
      number: 4,
      title: "Les Chapieux to Val Veny (Rifugio Elisabetta)",
      distance: "14 km",
      elevationGain: "1000 m",
      elevationLoss: "900 m",
      duration: "5–6 hours",
      journey: "Today is the dramatic crossing into Italy, following Classic Stage 3. From Les Chapieux, the trail leads up the valley past the Ville des Glaciers, where the famous Beaufort cheese is produced. The route continues to the Refuge des Mottets before beginning the steep climb to the Col de la Seigne (2,516 m) and the Italian border. The view from the col is a pivotal moment of the trek, revealing the sheer, glaciated southern face of the Mont Blanc massif. The descent into Val Veny is relatively gentle, leading to the foot of the Glacier de la Lée Blanche and the overnight stop at a refuge.",
      accommodation: "Rifugio Elisabetta or Cabane Combal. Luggage transfer is not available to these high-mountain refuges."
    },
    {
      number: 5,
      title: "Val Veny to Courmayeur",
      distance: "18 km",
      elevationGain: "460 m",
      elevationLoss: "1560 m",
      duration: "5–6 hours",
      journey: "The final day follows the beautiful balcony trail of Classic Stage 4. From the refuge, the path descends briefly to Lac Combal before climbing to the Arp Vieille pastures. From here, it becomes a splendid balcony trail with continuous, breathtaking views of the iconic peaks of mountaineering history: Noire de Peuterey, Dent du Géant, and Grandes Jorasses. The trail descends towards the ski area above Courmayeur. From here, make the final descent on foot into the picturesque medieval village of Courmayeur, marking the end of the Western Front trek. In the afternoon, take the bus from Courmayeur's bus station back through the Mont Blanc tunnel to Chamonix."
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
            src="/uploads/DJI_0209-HDR.jpg"
            alt="The Western Front hero"
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
              The Western Front
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
              A 5-Day Half TMB from Chamonix to Courmayeur
            </p>
          </div>
        </div>

        {/* Introduction Section */}
        <div style={{ background: 'white', padding: isMobile ? '2rem 0.75rem' : '4rem 1rem', borderBottom: '1px solid var(--ds-border)' }}>
          <div className="container mx-auto" style={{ maxWidth: '900px', padding: isMobile ? '0 0.5rem' : '0 1rem' }}>
            <p style={{
              fontFamily: 'Inter, system-ui, sans-serif',
              fontSize: 'clamp(1.125rem, 2vw, 1.25rem)',
              color: 'var(--ds-foreground)',
              lineHeight: 1.7,
              marginBottom: '1.5rem'
            }}>
              This itinerary is a concentrated, high-impact trek that covers the western half of the Tour du Mont Blanc, beginning in the Chamonix Valley and concluding in the Italian town of Courmayeur. It is an ideal choice for fit trekkers with limited time or for those who wish to complete the full TMB over two consecutive years, as this section constitutes a logical and deeply satisfying first half.
            </p>
            <p style={{
              fontFamily: 'Inter, system-ui, sans-serif',
              fontSize: 'clamp(1.125rem, 2vw, 1.25rem)',
              color: 'var(--ds-foreground)',
              lineHeight: 1.7,
              marginBottom: '1.5rem'
            }}>
              This portion of the tour is often considered the wilder and more remote segment, traversing high, desolate passes in France before making the dramatic crossing into Italy. The journey covers approximately 70 km of rugged alpine terrain.
            </p>
            <p style={{
              fontFamily: 'Inter, system-ui, sans-serif',
              fontSize: 'clamp(1.125rem, 2vw, 1.25rem)',
              color: 'var(--ds-foreground)',
              lineHeight: 1.7
            }}>
              The trek is a point-to-point journey, not a loop. The logistics are straightforward: upon arrival in Courmayeur on the final day, trekkers can easily return to the starting point in Chamonix via a 30-45 minute bus ride through the Mont Blanc tunnel, with several companies offering regular services.
            </p>
          </div>
        </div>

        {/* Day-by-Day Section */}
        <div style={{ padding: isMobile ? '2rem 0.75rem' : '4rem 1rem', background: 'var(--ds-off-white)' }}>
          <div className="container mx-auto" style={{ maxWidth: '1200px', padding: isMobile ? '0 0.5rem' : '0 1rem' }}>
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
                      src="/uploads/DJI_0246.jpg"
                      alt="Western Front Stage 1"
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
                      src="/uploads/DJI_0241-HDR.jpg"
                      alt="Western Front Stage 3"
                      style={{
                        width: '100%',
                        height: isMobile ? '300px' : '600px',
                        objectFit: 'cover',
                        borderRadius: isMobile ? '12px' : '16px',
                        marginBottom: isMobile ? '1rem' : '2rem'
                      }}
                    />
                  )}
                  {day.number === 5 && (
                    <img
                      src="/uploads/IMG_1420.jpg"
                      alt="Western Front Stage 5"
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
                      <div style={{ marginBottom: day.expertCues || day.accommodation ? '1.5rem' : 0 }}>
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

                      {/* Expert's Cues */}
                      {day.expertCues && (
                        <div style={{
                          marginBottom: day.accommodation ? '1.5rem' : 0,
                          padding: '1rem',
                          background: 'hsl(145, 60%, 97%)',
                          border: '1px solid hsl(145, 60%, 85%)',
                          borderRadius: '8px'
                        }}>
                          <h4 style={{
                            fontFamily: 'Inter, system-ui, sans-serif',
                            fontSize: '1rem',
                            fontWeight: 600,
                            color: 'hsl(145, 60%, 30%)',
                            marginBottom: '0.5rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                          }}>
                            <Lightbulb style={{ width: '1.125rem', height: '1.125rem' }} />
                            Expert's Cues
                          </h4>
                          <p style={{
                            fontFamily: 'Inter, system-ui, sans-serif',
                            fontSize: '0.9375rem',
                            color: 'hsl(145, 60%, 25%)',
                            lineHeight: 1.6,
                            margin: 0
                          }}>
                            {day.expertCues}
                          </p>
                        </div>
                      )}

                      {/* Accommodation */}
                      {day.accommodation && (
                        <div style={{
                          padding: '1rem',
                          background: 'hsl(208, 70%, 97%)',
                          border: '1px solid hsl(208, 70%, 90%)',
                          borderRadius: '8px'
                        }}>
                          <h4 style={{
                            fontFamily: 'Inter, system-ui, sans-serif',
                            fontSize: '1rem',
                            fontWeight: 600,
                            color: 'hsl(208, 70%, 30%)',
                            marginBottom: '0.5rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                          }}>
                            <Bed style={{ width: '1.125rem', height: '1.125rem' }} />
                            Accommodation
                          </h4>
                          <p style={{
                            fontFamily: 'Inter, system-ui, sans-serif',
                            fontSize: '0.9375rem',
                            color: 'hsl(208, 70%, 25%)',
                            lineHeight: 1.6,
                            margin: 0
                          }}>
                            {day.accommodation}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>

        {/* Other Itineraries Section */}
        <div style={{ padding: isMobile ? '2rem 0.75rem' : '4rem 1rem', background: 'white', borderTop: '1px solid var(--ds-border)' }}>
          <div className="container mx-auto" style={{ maxWidth: '1200px', padding: isMobile ? '0 0.5rem' : '0 1rem' }}>
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

              <a href="/guides/tmb-for-beginners/itineraries/italian-taster" style={{
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
                  The Italian Taster
                </h3>
                <p style={{
                  fontFamily: 'Inter, system-ui, sans-serif',
                  fontSize: '0.875rem',
                  color: 'var(--ds-muted-foreground)',
                  lineHeight: 1.6,
                  margin: 0
                }}>
                  4 days • Moderate • For the Weekend Warrior
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
