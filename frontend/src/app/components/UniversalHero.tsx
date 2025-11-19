// src/app/components/UniversalHero.tsx
import Image from 'next/image';
import CTAButton from './CTAButton';

type HeroHeight = 'short' | 'standard' | 'tall';
type Overlay = 'none' | 'light' | 'gradient';

interface CTA {
  label: string;
  href?: string;
  variant?: 'primary' | 'secondary' | 'accent';
}

interface UniversalHeroProps {
  title: string;
  subtitle?: string;
  backgroundSrc: string;
  backgroundAlt?: string;
  ctas?: CTA[];
  height?: HeroHeight;
  overlay?: Overlay;
  imageQuality?: number;
}

const heightToVH: Record<HeroHeight, string> = {
  short: '50vh',
  standard: '60vh',
  tall: '70vh',
};

const overlayStyle = (overlay: Overlay) => {
  if (overlay === 'none') return undefined;
  if (overlay === 'light') return 'linear-gradient(180deg, rgba(0,0,0,0.15), rgba(0,0,0,0.4))';
  return 'var(--gradient-hero)';
};

export default function UniversalHero({
  title,
  subtitle,
  backgroundSrc,
  backgroundAlt = '',
  ctas = [],
  height = 'standard',
  overlay = 'gradient',
  imageQuality = 85,
}: UniversalHeroProps) {
  return (
    <section
      style={{
        position: 'relative',
        width: '100%',
        height: heightToVH[height],
        minHeight: '320px',
        maxHeight: '800px',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Image
        src={backgroundSrc}
        alt={backgroundAlt}
        fill
        priority
        fetchPriority="high"
        sizes="(max-width: 480px) 100vw, (max-width: 768px) 90vw, 1200px"
        quality={imageQuality}
        style={{ objectFit: 'cover', objectPosition: 'center' }}
      />

      {overlay !== 'none' && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: overlayStyle(overlay),
            opacity: overlay === 'gradient' ? 0.6 : 1,
            zIndex: 1,
          }}
        />
      )}

      <div
        style={{
          position: 'relative',
          zIndex: 2,
          textAlign: 'center',
          color: 'var(--ds-primary-foreground)',
          maxWidth: '1100px',
          padding: '0 1rem',
        }}
      >
        <h1
          className="hero-title"
          style={{
            fontSize: 'clamp(2rem, 6vw, var(--text-6xl))',
            fontWeight: 700,
            lineHeight: 1.1,
            marginBottom: '0.75rem',
            textShadow: '0 4px 20px rgba(0,0,0,0.3)',
          }}
        >
          {title}
        </h1>
        {subtitle && (
          <p
            className="hero-subtitle"
            style={{
              fontSize: 'clamp(1rem, 2.6vw, var(--text-lg))',
              lineHeight: 1.5,
              maxWidth: '65ch',
              margin: '0 auto 1.25rem',
              color: 'white',
            }}
          >
            {subtitle}
          </p>
        )}

        {ctas.length > 0 && (
          <div
            style={{
              display: 'flex',
              gap: 'var(--space-md)',
              justifyContent: 'center',
              flexWrap: 'wrap',
              marginTop: '0.5rem',
            }}
          >
            {ctas.map((c, i) => (
              <CTAButton key={`${c.label}-${i}`} label={c.label} href={c.href} variant={c.variant || (i === 0 ? 'primary' : 'secondary')} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
