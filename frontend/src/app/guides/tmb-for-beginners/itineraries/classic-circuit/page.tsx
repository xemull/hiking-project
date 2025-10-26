// src/app/guides/tmb-for-beginners/itineraries/classic-circuit/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Navigation from '../../../../components/Navigation';
import Footer from '../../../../components/Footer';
import { Mountain, TrendingUp, TrendingDown, Clock, Bed, Info, AlertTriangle, Lightbulb } from 'lucide-react';

export default function ClassicCircuitPage() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);
  const stages = [
    {
      number: 1,
      title: "Les Houches to Refuge Miage",
      distance: "14.7 km",
      elevationGain: "1478 m",
      elevationLoss: "778 m",
      duration: "5–6 hours",
      journey: "The trek begins in Les Houches, at the official TMB archway. This itinerary opts for the spectacular Col du Tricot variant, which has become the de facto standard route for its superior scenery. To begin, take the Bellevue cable car to the Bellevue plateau (1,801 m), bypassing a steep and largely forested ascent. From Bellevue, the trail traverses high meadows with breathtaking views of the Bionnassay glacier before crossing the iconic and thrilling Himalayan-style suspension bridge over a glacial torrent. A steady climb follows to the grassy saddle of the Col du Tricot (2,120 m), which offers panoramic views across the Miage Valley. The day concludes with a very steep, hour-long descent on a switchbacking trail to the valley floor, where the charming Refuge Miage is nestled in an idyllic cluster of old farm buildings.",
      variants: "The classic, original route goes over the Col de Voza. While easier, it involves more road walking and lacks the dramatic glacier views of the Col du Tricot variant. The Col du Tricot route is exposed and should not be attempted in bad weather or thunderstorms.",
      expertCues: "The clearing just after the suspension bridge is an excellent spot for lunch, with wild bilberry bushes and a direct view of the glacier. Use trekking poles on the final descent to save your knees.",
      accommodation: "Refuge Miage or the nearby Auberge du Truc."
    },
    {
      number: 2,
      title: "Refuge Miage to Les Chapieux",
      distance: "18.0 km",
      elevationGain: "1330 m",
      elevationLoss: "940 m",
      duration: "7–8 hours",
      journey: "This is a long and strenuous day, crossing two major mountain passes. From Refuge Miage, a short climb over the Auberge du Truc leads to a long descent through the forest into the town of Les Contamines-Montjoie. This is the last chance to resupply at a supermarket or bakery for several days. The trail continues through the valley to the stunning baroque chapel of Notre Dame de la Gorge. Here, the true wilderness begins. The path climbs steeply along an ancient, slabbed Roman road beside a rushing gorge, passing Refuge Nant Borrant and Refuge de la Balme. The ascent continues relentlessly to the Col du Bonhomme (2,329 m) and then traverses to the slightly higher Col de la Croix du Bonhomme (2,483 m), a wild and desolate landscape that can hold snow well into July. The day finishes with a long descent to the remote hamlet of Les Chapieux in the Vallée des Glaciers.",
      variants: "In July and August, a free shuttle bus (navette) can be taken from Les Contamines to Notre Dame de la Gorge, saving about an hour of walking.",
      expertCues: "Just past Notre Dame de la Gorge, look for a sign to \"pont naturel,\" a natural stone arch over the river just a few minutes off the main trail.",
      accommodation: "Refuge de la Croix du Bonhomme (at the col) or Auberge de la Nova in Les Chapieux. Staying at the high refuge offers incredible views but a more basic experience."
    },
    {
      number: 3,
      title: "Les Chapieux to Rifugio Elisabetta",
      distance: "15.0 km",
      elevationGain: "1000 m",
      elevationLoss: "900 m",
      duration: "5–6 hours",
      journey: "Today marks the crossing from France into Italy. From Les Chapieux, the route follows a quiet road up the Vallée des Glaciers to the Refuge des Mottets. From there, the serious climbing begins with a steady and sustained ascent to the Col de la Seigne (2,516 m). The col marks the unmanned border and reveals one of the most dramatic scenic transitions of the entire TMB. The rugged French landscape gives way to an awe-inspiring panorama of the Italian side of the Mont Blanc massif, with the Aiguille Noire de Peuterey and the immense glaciers of the Val Veny spread before you. The descent into Italy is gentle, leading down into the wide, flat valley floor of Vallon de la Lée Blanche. The stage concludes at the historic Rifugio Elisabetta Soldini, perched impressively on a rocky spur just below the La Lée Blanche and Miage glaciers.",
      variants: "A shuttle bus runs from Les Chapieux to Ville des Glaciers or Refuge des Mottets, which can cut out over an hour of road walking.",
      expertCues: "Take time to explore the Casermetta at the Col de la Seigne, an old customs house now serving as a small museum and information center about the region's history and environment.",
      accommodation: "Rifugio Elisabetta or, about an hour further, Cabane du Combal."
    },
    {
      number: 4,
      title: "Rifugio Elisabetta to Courmayeur",
      distance: "18.0 km",
      elevationGain: "460 m",
      elevationLoss: "1560 m",
      duration: "5–6 hours",
      journey: "This is one of the most beautiful balcony walks of the tour. From Rifugio Elisabetta, the trail passes the turquoise waters of Lac Combal before ascending to the Arp Vieille. From here, it traverses a magnificent balcony path high on the side of the Val Veny, offering constant, jaw-dropping views across to Mont Blanc (or Monte Bianco, as it is now known). The path undulates towards the Col Chécrouit, a hub for the Courmayeur ski area in winter. From here, a very long and steep descent leads down through forests and ski slopes to the village of Dolonne and finally into the charming, bustling Italian town of Courmayeur, the alpine capital of the Aosta Valley.",
      variants: "To save your knees from the punishing 1,500+ m descent, you can take a combination of chairlifts and cable cars down from the Col Chécrouit area directly into Courmayeur.",
      expertCues: "The balcony path after Lac Combal is the highlight. Take your time here to absorb the views of famous peaks like the Aiguille Noire de Peuterey, Dent du Géant, and the Grandes Jorasses.",
      accommodation: "A wide range of hotels in Courmayeur."
    },
    {
      number: 5,
      title: "Courmayeur to Rifugio Bonatti",
      distance: "12.0 km",
      elevationGain: "860 m",
      elevationLoss: "100 m",
      duration: "4–5 hours",
      journey: "After enjoying a proper Italian coffee, the day begins with a sharp, unrelenting climb of nearly 800 m out of Courmayeur to the Rifugio Bertone. This is the day's main effort. Once at the refuge, the trail transforms into another spectacular balcony path, contouring high along the northern flank of the Italian Val Ferret. For the next several hours, the trail offers arguably the most sublime views of the entire TMB, with the Grandes Jorasses and the southern face of the Mont Blanc massif forming a constant, breathtaking panorama to your left. The relatively gentle path leads directly to the architecturally stunning and perfectly situated Rifugio Bonatti.",
      variants: "For fit hikers in good weather, a more challenging and highly recommended variant exists from Rifugio Bertone. This route climbs higher along the Mont de la Saxe ridge, offering even more expansive 360-degree views before descending to rejoin the main trail near Rifugio Bonatti.",
      expertCues: "The terrace at Rifugio Bertone is a perfect spot for a mid-morning break after the initial climb. Watching the sunset behind Mont Blanc from the terrace of Rifugio Bonatti is an unforgettable TMB experience.",
      accommodation: "Rifugio Bonatti."
    },
    {
      number: 6,
      title: "Rifugio Bonatti to La Fouly",
      distance: "20.0 km",
      elevationGain: "890 m",
      elevationLoss: "1140 m",
      duration: "6–7 hours",
      journey: "This stage involves crossing the second major international border, from Italy into Switzerland. The day begins with a gentle traverse from Rifugio Bonatti before descending to the valley floor at Arp Nouva (Chalet Val Ferret). From here, the trail begins the long, steady ascent to the Grand Col Ferret (2,537 m), the highest point on the classic TMB. The views looking back down the Italian Val Ferret are magnificent. The col marks the border, and upon crossing, the landscape changes dramatically once again. The jagged, imposing Italian peaks give way to the gentler, rolling green pastures of Switzerland. A long and gradual descent follows, passing the alpine farm at La Peule (a great spot for local cheese) before reaching the quiet Swiss village of La Fouly.",
      variants: "From the Grand Col Ferret, a short side-trip up to the Tête de Ferret peak is possible for even better views.",
      expertCues: "Rifugio Elena, located partway up the climb to the col, is a good place to rest and refill water bottles.",
      accommodation: "Hotels or auberges in La Fouly, such as L'Edelweiss."
    },
    {
      number: 7,
      title: "La Fouly to Champex-Lac",
      distance: "15.0 km",
      elevationGain: "420 m",
      elevationLoss: "570 m",
      duration: "4–5 hours",
      journey: "This is the easiest and most restful stage of the classic TMB, providing a welcome break for tired legs. The route is predominantly a gentle downhill and flat walk through the Swiss Val Ferret. The trail winds through traditional Swiss farming villages with \"chocolate box\" chalets, alongside the Dranse de Ferret river, and through peaceful pine forests and meadows. The day's only significant climb comes at the end, a steady ascent through the woods up to the beautiful lakeside resort town of Champex-Lac.",
      variants: "This is a straightforward stage with few variants. It's a day to be savored at a leisurely pace.",
      expertCues: "Enjoy a coffee or lunch in the small village of Praz-de-Fort en route. Upon arrival in Champex-Lac, a swim in the cold mountain lake is a refreshing, if bracing, reward.",
      accommodation: "A variety of hotels and auberges in Champex-Lac."
    },
    {
      number: 8,
      title: "Champex-Lac to Trient",
      distance: "16.0 km",
      elevationGain: "730 m",
      elevationLoss: "920 m",
      duration: "5–6 hours (Bovine Route)",
      journey: "Today presents a major choice of routes. The standard TMB route is the \"Bovine route.\" It's a pastoral walk that climbs steadily up through forests to the Alp Bovine (1,987 m), a working cattle farm with a small cafe. This route offers wonderful, expansive views over the Rhône Valley and the distant Bernese Alps. From Alp Bovine, the trail descends to the Col de la Forclaz, a mountain pass with a hotel and restaurant, before a final descent into the small Swiss village of Trient, easily identifiable by its distinctive pink church.",
      variants: "The alternative is the Fenêtre d'Arpette, one of the most challenging variants on the entire TMB. It is a high, wild, and non-technical but very strenuous route over a narrow, rocky col at 2,665 m. It involves a steep ascent up a boulder-filled valley and an equally steep, tricky descent on the other side. This route should only be attempted by very fit, experienced hikers in perfectly clear weather.",
      expertCues: "The blueberry tart at Alp Bovine is legendary among TMB hikers.",
      accommodation: "Auberges in Trient, such as Auberge du Mont Blanc."
    },
    {
      number: 9,
      title: "Trient to Tré-le-Champ",
      distance: "13.6 km",
      elevationGain: "1230 m",
      elevationLoss: "1115 m",
      duration: "5–6 hours",
      journey: "The final border crossing of the trek takes you from Switzerland back into France. From Trient, the trail climbs steadily through the forest to the Col de Balme (2,191 m). Reaching this col is a triumphant moment, as it provides the first stunning view of the Chamonix Valley, with the entire Mont Blanc massif, including the Aiguille Verte and the Drus, laid out in a breathtaking panorama. After descending slightly from the col, the route climbs again over the Aiguillette des Posettes, a fantastic ridge walk with 360-degree views, before a steep descent to the hamlet of Tré-le-Champ in the Chamonix Valley.",
      variants: "An easier option from Col de Balme descends more directly towards the village of Le Tour, avoiding the extra climb over the Aiguillette des Posettes.",
      expertCues: "The Refuge du Col de Balme is a perfect spot for a celebratory drink while taking in the newly revealed views of the Chamonix side of the massif.",
      accommodation: "Auberge La Boërne in Tré-le-Champ or hotels in the nearby village of Argentière."
    },
    {
      number: 10,
      title: "Tré-le-Champ to Refuge La Flégère",
      distance: "8.1 km",
      elevationGain: "1166 m",
      elevationLoss: "685 m",
      duration: "4–5 hours",
      journey: "Though short in distance, this is a technically interesting and physically demanding day. The stage begins with the famous TMB ladders, a series of fixed metal ladders and rungs that ascend a steep rock face. After the ladders, the trail enters the Aiguilles Rouges Nature Reserve and climbs towards the magnificent Lacs des Chéserys and the iconic Lac Blanc. The view from Lac Blanc, with the Mont Blanc massif reflected perfectly in its turquoise waters on a calm day, is one of the most photographed scenes in the Alps. From the lakes, a short traverse leads to the Refuge La Flégère, located at the top of a cable car station.",
      variants: "For those with a fear of heights or in wet conditions, an alternative trail bypasses the ladders by taking a longer, less exposed route.",
      expertCues: "This is the shortest day, allowing plenty of time to linger at the lakes and enjoy the scenery. The area is a prime habitat for ibex.",
      accommodation: "Refuge La Flégère."
    },
    {
      number: 11,
      title: "Refuge La Flégère to Les Houches",
      distance: "17.0 km",
      elevationGain: "770 m",
      elevationLoss: "1545 m",
      duration: "6–7 hours",
      journey: "The grand finale. From La Flégère, the trail follows the Grand Balcon Sud, a fantastic high-level traverse with constant, unparalleled views across the valley to Mont Blanc and its glaciers. The path leads to the Planpraz cable car station and then continues its ascent towards Le Brévent (2,525 m), the final high point of the tour. Many consider the panorama from Le Brévent to be the best of the entire circuit, a fitting reward at the end of the journey. From here, a very long and punishingly steep descent of over 1,500 m on a rocky, switchbacking trail leads all the way down to the starting town of Les Houches, completing the loop.",
      variants: "To avoid the final, brutal descent, many trekkers take the Brévent cable car down from the summit to Chamonix and then a short bus or train ride back to Les Houches.",
      expertCues: "The section of trail between Planpraz and Le Brévent involves some secured sections with ladders and metal handrails.",
      accommodation: "Return to your base in Chamonix or Les Houches."
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
            src="/uploads/DJI_0187-HDR.jpg"
            alt="The Classic Circuit hero"
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
              The Classic Circuit
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
              An 11-Day Journey Around Mont Blanc
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
              This is the quintessential Tour du Mont Blanc, the benchmark against which all other itineraries are measured. It follows the traditional 11 stages in a counter-clockwise direction, beginning and ending in the Chamonix Valley. This route is designed for fit, experienced hillwalkers who are prepared for long, challenging days and wish to complete the entire 170-km circuit largely on foot.
            </p>
            <p style={{
              fontFamily: 'Inter, system-ui, sans-serif',
              fontSize: 'clamp(1.125rem, 2vw, 1.25rem)',
              color: 'var(--ds-foreground)',
              lineHeight: 1.7
            }}>
              It embraces the rustic charm and camaraderie of the mountain refuge system, offering a complete and deeply rewarding immersion into the alpine world. Do not underestimate the demands of this itinerary; with a cumulative elevation gain higher than Everest, it is a serious undertaking even for seasoned trekkers.
            </p>
          </div>
        </div>

        {/* Quick Stats Section */}
        <div style={{ background: 'var(--ds-off-white)', padding: '3rem 1rem', borderBottom: '1px solid var(--ds-border)' }}>
          <div className="container mx-auto px-4" style={{ maxWidth: '1000px' }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1.5rem'
            }}>
              <div style={{
                background: 'white',
                padding: '1.5rem',
                borderRadius: '12px',
                textAlign: 'center',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)'
              }}>
                <Mountain style={{ width: '2rem', height: '2rem', color: 'hsl(208, 70%, 45%)', margin: '0 auto 0.75rem' }} />
                <div style={{
                  fontFamily: 'Inter, system-ui, sans-serif',
                  fontSize: '1.75rem',
                  fontWeight: 700,
                  color: 'var(--ds-foreground)',
                  marginBottom: '0.25rem'
                }}>
                  ~170 km
                </div>
                <div style={{
                  fontFamily: 'Inter, system-ui, sans-serif',
                  fontSize: '0.875rem',
                  color: 'var(--ds-muted-foreground)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  Total Distance
                </div>
              </div>

              <div style={{
                background: 'white',
                padding: '1.5rem',
                borderRadius: '12px',
                textAlign: 'center',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)'
              }}>
                <TrendingUp style={{ width: '2rem', height: '2rem', color: 'hsl(145, 60%, 40%)', margin: '0 auto 0.75rem' }} />
                <div style={{
                  fontFamily: 'Inter, system-ui, sans-serif',
                  fontSize: '1.75rem',
                  fontWeight: 700,
                  color: 'var(--ds-foreground)',
                  marginBottom: '0.25rem'
                }}>
                  ~10,000 m
                </div>
                <div style={{
                  fontFamily: 'Inter, system-ui, sans-serif',
                  fontSize: '0.875rem',
                  color: 'var(--ds-muted-foreground)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  Cumulative Ascent
                </div>
              </div>

              <div style={{
                background: 'white',
                padding: '1.5rem',
                borderRadius: '12px',
                textAlign: 'center',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)'
              }}>
                <Clock style={{ width: '2rem', height: '2rem', color: 'hsl(45, 90%, 55%)', margin: '0 auto 0.75rem' }} />
                <div style={{
                  fontFamily: 'Inter, system-ui, sans-serif',
                  fontSize: '1.75rem',
                  fontWeight: 700,
                  color: 'var(--ds-foreground)',
                  marginBottom: '0.25rem'
                }}>
                  11 Days
                </div>
                <div style={{
                  fontFamily: 'Inter, system-ui, sans-serif',
                  fontSize: '0.875rem',
                  color: 'var(--ds-muted-foreground)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  Duration
                </div>
              </div>

              <div style={{
                background: 'white',
                padding: '1.5rem',
                borderRadius: '12px',
                textAlign: 'center',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)'
              }}>
                <Mountain style={{ width: '2rem', height: '2rem', color: 'hsl(280, 60%, 50%)', margin: '0 auto 0.75rem' }} />
                <div style={{
                  fontFamily: 'Inter, system-ui, sans-serif',
                  fontSize: '1.75rem',
                  fontWeight: 700,
                  color: 'var(--ds-foreground)',
                  marginBottom: '0.25rem'
                }}>
                  2,537 m
                </div>
                <div style={{
                  fontFamily: 'Inter, system-ui, sans-serif',
                  fontSize: '0.875rem',
                  color: 'var(--ds-muted-foreground)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  Highest Point
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stage-by-Stage Section */}
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

            {/* Stages */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? '1.5rem' : '2rem' }}>
              {stages.map((stage) => (
                <React.Fragment key={stage.number}>
                  {/* Content Images */}
                  {stage.number === 1 && (
                    <img
                      src="/uploads/DJI_0240-HDR.jpg"
                      alt="Classic Circuit Stage 1"
                      style={{
                        width: '100%',
                        height: isMobile ? '300px' : '600px',
                        objectFit: 'cover',
                        borderRadius: isMobile ? '12px' : '16px',
                        marginBottom: isMobile ? '1rem' : '2rem'
                      }}
                    />
                  )}
                  {stage.number === 5 && (
                    <img
                      src="/uploads/IMG_1436.jpg"
                      alt="Classic Circuit Stage 5"
                      style={{
                        width: '100%',
                        height: isMobile ? '300px' : '600px',
                        objectFit: 'cover',
                        borderRadius: isMobile ? '12px' : '16px',
                        marginBottom: isMobile ? '1rem' : '2rem'
                      }}
                    />
                  )}
                  {stage.number === 9 && (
                    <img
                      src="/uploads/IMG_1615.jpg"
                      alt="Classic Circuit Stage 9"
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
                      {/* Stage Header */}
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
                          Stage {stage.number}
                        </div>
                        <h3 style={{
                          fontFamily: 'Inter, system-ui, sans-serif',
                          fontSize: 'clamp(1.5rem, 3vw, 2rem)',
                          fontWeight: 600,
                          color: 'var(--ds-foreground)',
                          margin: 0,
                          lineHeight: 1.2
                        }}>
                          {stage.title}
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
                            {stage.distance}
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
                            +{stage.elevationGain}
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
                            -{stage.elevationLoss}
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
                            {stage.duration}
                          </div>
                        </div>
                      </div>

                      {/* The Journey */}
                      <div style={{ marginBottom: stage.variants || stage.expertCues || stage.accommodation ? '1.5rem' : 0 }}>
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
                          {stage.journey}
                        </p>
                      </div>

                      {/* Route Nuances & Variants */}
                      {stage.variants && (
                        <div style={{
                          marginBottom: stage.expertCues || stage.accommodation ? '1.5rem' : 0,
                          padding: '1rem',
                          background: 'hsl(45, 100%, 97%)',
                          border: '1px solid hsl(45, 100%, 85%)',
                          borderRadius: '8px'
                        }}>
                          <h4 style={{
                            fontFamily: 'Inter, system-ui, sans-serif',
                            fontSize: '1rem',
                            fontWeight: 600,
                            color: 'hsl(45, 90%, 30%)',
                            marginBottom: '0.5rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                          }}>
                            <AlertTriangle style={{ width: '1.125rem', height: '1.125rem' }} />
                            Route Nuances & Variants
                          </h4>
                          <p style={{
                            fontFamily: 'Inter, system-ui, sans-serif',
                            fontSize: '0.9375rem',
                            color: 'hsl(45, 90%, 25%)',
                            lineHeight: 1.6,
                            margin: 0
                          }}>
                            {stage.variants}
                          </p>
                        </div>
                      )}

                      {/* Expert's Cues */}
                      {stage.expertCues && (
                        <div style={{
                          marginBottom: stage.accommodation ? '1.5rem' : 0,
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
                            {stage.expertCues}
                          </p>
                        </div>
                      )}

                      {/* Accommodation */}
                      {stage.accommodation && (
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
                            {stage.accommodation}
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
                  5 days • Challenging • For the Time-Limited
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
