// src/app/guides/tmb-for-beginners/itineraries/gentle-trekker/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Navigation from '../../../../components/Navigation';
import Footer from '../../../../components/Footer';
import { Mountain, TrendingUp, TrendingDown, Clock, Bed, Info } from 'lucide-react';

export default function GentleTrekkerPage() {
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
      title: "Arrival in Les Houches",
      distance: "—",
      elevationGain: "—",
      elevationLoss: "—",
      duration: "—",
      journey: "Arrive in Les Houches, the official starting point of the TMB, located just 6 km from Chamonix. Settle into your comfortable hotel, such as the Hôtel Saint-Antoine or Hotel du Bois, and prepare for the adventure ahead."
    },
    {
      number: 2,
      title: "Les Houches to Les Contamines",
      distance: "12.9 km",
      elevationGain: "380 m",
      elevationLoss: "1010 m",
      duration: "4–5 hours",
      journey: "Modification of Classic Stage 1: This stage covers the same ground as the classic route but with a significant modification for comfort. Instead of the strenuous climb out of the valley, the day begins with a swift 10-minute ride on the Bellevue cable car. This single act saves approximately 800 m of ascent and over two hours of hiking. From the top, the route follows the easier, lower-level trail via the hamlet of Bionnassay, winding through beautiful forests and alpine pastures high above the valley, before descending into Les Contamines-Montjoie."
    },
    {
      number: 3,
      title: "Les Contamines to Les Chapieux",
      distance: "15.3 km",
      elevationGain: "1380 m",
      elevationLoss: "980 m",
      duration: "7–8 hours",
      journey: "Modification of Classic Stage 2: This day tackles the first major mountain passes. To ease the start, a short bus or taxi transfer is taken from Les Contamines to the chapel at Notre Dame de la Gorge, bypassing a flat section of road. From there, the trail begins its long, steady ascent up the old Roman road towards the Col du Bonhomme and the Col de la Croix du Bonhomme. The day is still long and challenging, with significant elevation gain, but the initial transfer shortens the overall distance. The stage ends with a descent into the remote Chapieux valley."
    },
    {
      number: 4,
      title: "Les Chapieux to Rifugio Elisabetta",
      distance: "10 km",
      elevationGain: "1030 m",
      elevationLoss: "390 m",
      duration: "4–5 hours",
      journey: "Modification of Classic Stage 3: This stage is made more manageable by taking the public shuttle bus from Les Chapieux up the road to Refuge des Mottets. This removes a significant section of tarmac walking and positions you directly at the base of the main climb. From there, the trail ascends to the Col de la Seigne, crossing the border into Italy and revealing its spectacular views. The day concludes with a gentle descent to Rifugio Elisabetta. This modification shortens the day's walking distance by several kilometers."
    },
    {
      number: 5,
      title: "Rifugio Elisabetta to Courmayeur",
      distance: "11 km",
      elevationGain: "460 m",
      elevationLoss: "650 m",
      duration: "4–5 hours",
      journey: "Modification of Classic Stage 4: This stage follows the magnificent Val Veny balcony trail, one of the scenic highlights of the entire TMB. The route traverses high above the valley floor towards the Col Chécrouit. To avoid the final, grueling descent into Courmayeur, this itinerary utilizes the cable car from Plan Chécrouit, which whisks you down to the town center, saving your knees and providing more time to enjoy the afternoon in this stylish Italian resort."
    },
    {
      number: 6,
      title: "Rest Day in Courmayeur",
      distance: "—",
      elevationGain: "—",
      elevationLoss: "—",
      duration: "—",
      journey: "This day is dedicated to rest, recovery, and cultural immersion. Wander the charming pedestrian-only streets, explore local shops, and indulge in authentic Italian gelato and cuisine. For a light adventure, consider taking the spectacular Skyway Monte Bianco cable car for unparalleled, close-up views of Mont Blanc and the surrounding peaks without any hiking effort."
    },
    {
      number: 7,
      title: "Courmayeur to Val Ferret (Rifugio Bonatti)",
      distance: "12 km",
      elevationGain: "860 m",
      elevationLoss: "100 m",
      duration: "4–5 hours",
      journey: "Modification of Classic Stage 5: While this stage still begins with a steep climb out of Courmayeur to Rifugio Bertone, the rest of the day is a relatively gentle and incredibly scenic traverse along the Val Ferret balcony path to Rifugio Bonatti. The shorter distance makes this a manageable day even after the rest day. For those seeking an even gentler option, a bus can be taken from Courmayeur further down the Val Ferret, followed by a shorter (but still steep) hike up to the refuge."
    },
    {
      number: 8,
      title: "Val Ferret to La Fouly",
      distance: "11 km",
      elevationGain: "485 m",
      elevationLoss: "945 m",
      duration: "4–5 hours",
      journey: "Modification of Classic Stage 6: This stage covers the crossing of the Grand Col Ferret into Switzerland. Depending on the previous night's accommodation, a short bus transfer can be used to reach the end of the Italian Val Ferret at Arp Nouvaz, positioning you at the start of the main ascent. This trims some distance from what is otherwise a long day. After crossing the high pass, the long, rolling descent leads into the Swiss village of La Fouly."
    },
    {
      number: 9,
      title: "La Fouly to Champex-Lac",
      distance: "15 km",
      elevationGain: "600 m",
      elevationLoss: "500 m",
      duration: "4–5 hours",
      journey: "Identical to Classic Stage 7: This is the easiest day of the tour, a pleasant valley walk with minimal elevation change. The gentle pace allows for ample time to enjoy the charming Swiss villages and serene forests en route to the picturesque lakeside town of Champex-Lac."
    },
    {
      number: 10,
      title: "Champex-Lac to Trient",
      distance: "13 km",
      elevationGain: "770 m",
      elevationLoss: "945 m",
      duration: "5–6 hours",
      journey: "Modification of Classic Stage 8: This itinerary follows the less strenuous but still beautiful Bovine route, avoiding the formidable Fenêtre d'Arpette variant. The trail offers lovely views over the Rhône Valley as it traverses high alpine pastures before descending to Trient. The moderate distance and elevation make it a manageable day."
    },
    {
      number: 11,
      title: "Trient to Chamonix Valley (Argentière)",
      distance: "10.5 km",
      elevationGain: "975 m",
      elevationLoss: "810 m",
      duration: "5–6 hours",
      journey: "Modification of Classic Stage 9: The day involves the climb to Col de Balme and the re-entry into France. To shorten the day and avoid a steep final descent, this itinerary descends directly from the Col de Balme area towards the village of Le Tour, where you can take a bus or short walk to Argentière. This bypasses the additional climb over the Aiguillette des Posettes."
    },
    {
      number: 12,
      title: "Chamonix High Balcony & Departure",
      distance: "5 km",
      elevationGain: "509 m",
      elevationLoss: "321 m",
      duration: "2–3 hours",
      journey: "Modification of Classic Stages 10 & 11: This final day is a \"greatest hits\" of the Chamonix views. From the valley, take the Flégère cable car up to the start of the Grand Balcon Sud. Hike the spectacular traverse to Planpraz, enjoying constant views of the Mont Blanc massif. From Planpraz, take the cable car directly down to Chamonix, completing the journey. This strategy allows you to experience the best views of the final stages without the grueling ascent from the valley or the punishing descent to Les Houches. From Chamonix, you can depart or enjoy a final celebratory evening."
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
            src="/uploads/itineraries/gentle-trekker/DJI_0213-HDR.jpg"
            alt="The Gentle Trekker hero"
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
              The Gentle Trekker
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
              A 12-Day Tour of Scenery & Comfort
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
              This itinerary is designed for the trekker who wishes to immerse themselves in the epic landscapes of the Tour du Mont Blanc without the daily grind of the classic circuit's long, strenuous stages. The philosophy here is to prioritize comfort, scenery, and recovery, creating a more relaxed and sustainable journey. This is achieved by strategically shortening daily distances, leveraging the region's excellent transport network to bypass the most grueling sections, opting for more comfortable accommodation, and incorporating a vital rest day in the middle of the trek. This approach allows for more time to appreciate the views, explore the charming alpine towns, and savor the local cuisine.
            </p>
          </div>
        </div>

        {/* Core Strategies Section */}
        <div style={{ background: 'var(--ds-off-white)', padding: '3rem 1rem', borderBottom: '1px solid var(--ds-border)' }}>
          <div className="container mx-auto px-4" style={{ maxWidth: '900px' }}>
            <h2 style={{
              fontFamily: 'Inter, system-ui, sans-serif',
              fontSize: 'clamp(1.75rem, 3vw, 2.25rem)',
              fontWeight: 600,
              color: 'var(--ds-foreground)',
              marginBottom: '2rem',
              textAlign: 'center'
            }}>
              Core Strategies
            </h2>
            <div style={{ display: 'grid', gap: '1.5rem' }}>
              <div style={{
                background: 'white',
                padding: '1.5rem',
                borderRadius: '12px',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)'
              }}>
                <h3 style={{
                  fontFamily: 'Inter, system-ui, sans-serif',
                  fontSize: '1.25rem',
                  fontWeight: 600,
                  color: 'var(--ds-foreground)',
                  marginBottom: '0.75rem'
                }}>
                  Shorter Stages
                </h3>
                <p style={{
                  fontFamily: 'Inter, system-ui, sans-serif',
                  fontSize: '1rem',
                  color: 'var(--ds-foreground)',
                  lineHeight: 1.7,
                  margin: 0
                }}>
                  Long classic stages are intelligently broken down into more manageable segments, reducing daily hiking time to a comfortable 4-6 hours.
                </p>
              </div>

              <div style={{
                background: 'white',
                padding: '1.5rem',
                borderRadius: '12px',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)'
              }}>
                <h3 style={{
                  fontFamily: 'Inter, system-ui, sans-serif',
                  fontSize: '1.25rem',
                  fontWeight: 600,
                  color: 'var(--ds-foreground)',
                  marginBottom: '0.75rem'
                }}>
                  Strategic Transport
                </h3>
                <p style={{
                  fontFamily: 'Inter, system-ui, sans-serif',
                  fontSize: '1rem',
                  color: 'var(--ds-foreground)',
                  lineHeight: 1.7,
                  margin: 0
                }}>
                  Cable cars and buses are used proactively, not as a last resort, but as a planned part of the itinerary to eliminate punishing ascents and descents or less scenic valley walks.
                </p>
              </div>

              <div style={{
                background: 'white',
                padding: '1.5rem',
                borderRadius: '12px',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)'
              }}>
                <h3 style={{
                  fontFamily: 'Inter, system-ui, sans-serif',
                  fontSize: '1.25rem',
                  fontWeight: 600,
                  color: 'var(--ds-foreground)',
                  marginBottom: '0.75rem'
                }}>
                  Comfort-First Accommodation
                </h3>
                <p style={{
                  fontFamily: 'Inter, system-ui, sans-serif',
                  fontSize: '1rem',
                  color: 'var(--ds-foreground)',
                  lineHeight: 1.7,
                  margin: 0
                }}>
                  The itinerary prioritizes comfortable 3-star hotels in towns and private rooms in auberges, ensuring a good night's rest and recovery. Luggage transfer services are assumed, allowing you to hike with only a light daypack.
                </p>
              </div>

              <div style={{
                background: 'white',
                padding: '1.5rem',
                borderRadius: '12px',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)'
              }}>
                <h3 style={{
                  fontFamily: 'Inter, system-ui, sans-serif',
                  fontSize: '1.25rem',
                  fontWeight: 600,
                  color: 'var(--ds-foreground)',
                  marginBottom: '0.75rem'
                }}>
                  The Rest Day
                </h3>
                <p style={{
                  fontFamily: 'Inter, system-ui, sans-serif',
                  fontSize: '1rem',
                  color: 'var(--ds-foreground)',
                  lineHeight: 1.7,
                  margin: 0
                }}>
                  A full day in Courmayeur is built into the schedule. This is not just a day off from hiking but an opportunity to recharge, do laundry, and immerse oneself in the vibrant Italian alpine culture.
                </p>
              </div>
            </div>
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
              Detailed Day-by-Day Breakdown
            </h2>

            {/* Days */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? '1.5rem' : '2rem' }}>
              {days.map((day) => (
                <React.Fragment key={day.number}>
                  {/* Content Images */}
                  {day.number === 1 && (
                    <img
                      src="/uploads/itineraries/gentle-trekker/IMG_1446.jpg"
                      alt="Gentle Trekker Day 1"
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
                      src="/uploads/itineraries/gentle-trekker/IMG_1543.jpg"
                      alt="Gentle Trekker Day 5"
                      style={{
                        width: '100%',
                        height: isMobile ? '300px' : '600px',
                        objectFit: 'cover',
                        borderRadius: isMobile ? '12px' : '16px',
                        marginBottom: isMobile ? '1rem' : '2rem'
                      }}
                    />
                  )}
                  {day.number === 9 && (
                    <img
                      src="/uploads/itineraries/gentle-trekker/IMG_1676.jpg"
                      alt="Gentle Trekker Day 9"
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

                      {/* Statistics Grid - Only show if not a rest/arrival day */}
                      {day.distance !== "—" && (
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
                      )}

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
                          {day.distance === "—" ? "Overview" : "The Journey"}
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
