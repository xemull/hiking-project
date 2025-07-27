// src/app/components/HeroSection.tsx
'use client';

import Link from 'next/link';

export default function HeroSection() {
  const scrollToFeatured = () => {
    document.getElementById('featured-hikes')?.scrollIntoView({
      behavior: 'smooth'
    });
  };

  return (
    <>
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600;700&family=Lato:wght@300;400;700&display=swap');
        
        .hero-section {
          position: relative;
          width: 100%;
          height: 75vh;
          min-height: 600px;
          max-height: 800px;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .hero-background {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-image: url('/IMG_1682.jpg');
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
        }

        .hero-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.3);
          z-index: 1;
        }

        .hero-content {
          position: relative;
          z-index: 2;
          text-align: center;
          color: white;
          max-width: 800px;
          padding: 0 2rem;
          margin-top: -10vh;
        }

        .hero-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(3rem, 8vw, 6rem);
          font-weight: 300;
          margin-bottom: 1.5rem;
          letter-spacing: 2px;
          text-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
          line-height: 1.1;
        }

        .hero-subtitle {
          font-family: 'Lato', sans-serif;
          font-size: clamp(1.1rem, 2.5vw, 1.4rem);
          font-weight: 300;
          margin-bottom: 3rem;
          line-height: 1.6;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
          opacity: 0.95;
        }

        .hero-cta {
          display: inline-block;
          padding: 1rem 2.5rem;
          background: rgba(255, 255, 255, 0.15);
          border: 2px solid rgba(255, 255, 255, 0.8);
          color: white;
          text-decoration: none;
          font-family: 'Lato', sans-serif;
          font-size: 1.1rem;
          font-weight: 400;
          letter-spacing: 1px;
          border-radius: 50px;
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
          position: relative;
          overflow: hidden;
          cursor: pointer;
        }

        .hero-cta::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
          transition: left 0.5s ease;
        }

        .hero-cta:hover {
          background: rgba(255, 255, 255, 0.25);
          border-color: white;
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
        }

        .hero-cta:hover::before {
          left: 100%;
        }

        .hero-cta:active {
          transform: translateY(0);
        }

        @media (max-width: 768px) {
          .hero-section {
            height: 70vh;
            min-height: 500px;
          }

          .hero-content {
            padding: 0 1.5rem;
            margin-top: -5vh;
          }

          .hero-title {
            margin-bottom: 1rem;
          }

          .hero-subtitle {
            margin-bottom: 2rem;
          }

          .hero-cta {
            padding: 0.8rem 2rem;
            font-size: 1rem;
          }
        }

        @media (max-width: 480px) {
          .hero-section {
            height: 65vh;
            min-height: 450px;
          }

          .hero-content {
            padding: 0 1rem;
          }

          .hero-cta {
            padding: 0.7rem 1.5rem;
            font-size: 0.9rem;
          }
        }
      `}</style>
      
      <section className="hero-section">
        <div className="hero-background"></div>
        <div className="hero-overlay"></div>
        
        <div className="hero-content">
          <h1 className="hero-title">Path Unfolding.</h1>
          <p className="hero-subtitle">Discover unforgettable multi-day journeys, with all the essential information at your fingertips.</p>
          <button onClick={scrollToFeatured} className="hero-cta">
            Explore the Trails
          </button>
        </div>
      </section>
    </>
  );
}