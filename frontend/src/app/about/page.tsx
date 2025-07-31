import { User } from 'lucide-react';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';

export default function AboutPage() {
  const styles = {
    mainContainer: {
      background: 'var(--ds-background)',
      minHeight: '100vh',
      fontFamily: 'Inter, system-ui, sans-serif'
    },
    contentWrapper: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '3rem 2rem'
    },
    heroSection: {
      textAlign: 'center' as const,
      marginBottom: '3rem'
    },
    avatarContainer: {
      width: '200px',
      height: '200px',
      margin: '0 auto 2rem auto',
      background: 'var(--gradient-hero)',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: 'var(--shadow-float)'
    },
    heroTitle: {
      fontFamily: 'Inter, system-ui, sans-serif',
      fontSize: '3rem',
      fontWeight: 700,
      color: 'var(--ds-foreground)',
      marginBottom: '1rem',
      lineHeight: 1.2
    },
    heroSubtitle: {
      color: 'var(--ds-muted-foreground)',
      fontSize: '1.125rem',
      maxWidth: '600px',
      margin: '0 auto',
      lineHeight: 1.75
    },
    contentGrid: {
      display: 'grid',
      gridTemplateColumns: '1fr',
      gap: '3rem',
      maxWidth: '800px',
      margin: '0 auto'
    },
    section: {
      background: 'transparent',
      padding: '0'
    },
    sectionTitle: {
      fontFamily: 'Inter, system-ui, sans-serif',
      fontSize: '1.75rem',
      fontWeight: 600,
      color: 'var(--ds-foreground)',
      marginBottom: '1.5rem',
      paddingBottom: '0.75rem',
      borderBottom: '2px solid var(--ds-border)'
    },
    proseContent: {
      fontFamily: 'Inter, system-ui, sans-serif',
      fontSize: '1rem',
      lineHeight: 1.7,
      color: '#4a5568'
    },
    paragraph: {
      marginBottom: '1.25rem',
      padding: '1rem 0',
      borderLeft: '3px solid #e2e8f0',
      paddingLeft: '1.5rem'
    },
    lastParagraph: {
      marginBottom: '1.25rem',
      padding: '1rem 0',
      borderLeft: '3px solid #e2e8f0',
      paddingLeft: '1.5rem'
    },
    signature: {
      fontWeight: 500,
      color: 'var(--ds-foreground)',
      marginTop: '1rem'
    }
  };

  return (
    <>
      <Navigation />
      <main style={styles.mainContainer}>
        <div style={styles.contentWrapper}>
          
          {/* Hero Section */}
          <div style={styles.heroSection}>
            <div style={styles.avatarContainer}>
              <User className="h-24 w-24 text-white" />
            </div>
            <h1 style={styles.heroTitle}>About Stan</h1>
            <p style={styles.heroSubtitle}>
              From day hikes to epic multi-day adventures across the world
            </p>
          </div>

          {/* Content Sections */}
          <div style={styles.contentGrid}>
            
            {/* First Section */}
            <div style={styles.section}>
              <h2 style={styles.sectionTitle}>It all started with one multi-day hike</h2>
              <div style={styles.proseContent}>
                <p style={styles.paragraph}>
                  Hi, I'm Stan. Fifteen years ago, I went on my first multi-day trek, and I was immediately hooked. 
                  There was something magical about carrying everything I needed on my back and watching the world 
                  unfold at the pace of my own two feet. Since then, I've walked thousands of kilometers on trails 
                  across the world, mostly solo.
                </p>
              </div>
            </div>

            {/* Second Section */}
            <div style={styles.section}>
              <h2 style={styles.sectionTitle}>Why This Site Exists</h2>
              <div style={styles.proseContent}>
                <p style={{...styles.paragraph, borderBottom: '1px solid #f1f5f9', paddingBottom: '1.5rem', marginBottom: '1.5rem'}}>
                  I created this website for the person I was back then—someone who loved day hikes but found 
                  the idea of a multi-day trek both exciting and incredibly intimidating.
                </p>
                <p style={{...styles.paragraph, borderBottom: '1px solid #f1f5f9', paddingBottom: '1.5rem', marginBottom: '1.5rem'}}>
                  Planning a long hike can feel overwhelming. You spend hours jumping between dozens of blogs, 
                  official websites, and forums, trying to piece together the critical information: How do I get 
                  to the start? Where can I get a GPX file? Which direction should I walk? I wanted to create a 
                  single, trusted resource that cuts through the noise.
                </p>
                <p style={styles.lastParagraph}>
                  Think of this site as your personal library of Cicerone guides, carefully curated and vetted. 
                  Every trail featured here has been thoroughly researched to give you all the key, high-level 
                  information you need in one place, so you can spend less time planning and more time dreaming 
                  about your next adventure.
                </p>
              </div>
            </div>

            {/* Third Section */}
            <div style={styles.section}>
              <h2 style={styles.sectionTitle}>More Than Just a Walk</h2>
              <div style={styles.proseContent}>
                <p style={{...styles.paragraph, borderBottom: '1px solid #f1f5f9', paddingBottom: '1.5rem', marginBottom: '1.5rem'}}>
                  I believe hiking is one of the most powerful and accessible activities available to us. It pulls 
                  us out of our organized routines and into a small, manageable adventure. It's a low-carbon way 
                  to explore, a powerful tool for physical health, and a meditative practice that calms the mind.
                </p>
                <p style={{...styles.paragraph, borderBottom: '1px solid #f1f5f9', paddingBottom: '1.5rem', marginBottom: '1.5rem'}}>
                  My ultimate goal is to get more people to experience the unique joy of a long walk. I hope the 
                  trails you find here are the start of your own story.
                </p>
                <p style={styles.lastParagraph}>
                  <span style={styles.signature}>
                    Happy hiking,<br />
                    Stan
                  </span>
                </p>
              </div>
            </div>

          </div>
        </div>
      </main>
      <Footer />  {/* Add this line */}
    </>
  );
}