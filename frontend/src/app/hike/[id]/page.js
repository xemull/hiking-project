import Map from '../../components/DynamicMap';
import ElevationProfile from '../../components/ElevationProfile';
import Link from 'next/link';

async function getHike(id) {
  try {
    const res = await fetch(`http://localhost:4000/api/hikes/${id}`, { cache: 'no-store' });
    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    console.error('API Error:', error);
    return null;
  }
}

export default async function HikeDetailPage({ params }) {
  // Correctly await the params object to get the id
  const { id } = await params;
  const hike = await getHike(id);

  if (!hike) {
    return (
      <main style={{ fontFamily: 'sans-serif', padding: '2rem' }}>
        <h1>Hike Not Found</h1>
        <p><Link href="/">← Back to all hikes</Link></p>
      </main>
    );
  }
  
  const hasElevationData = hike.simplified_profile && hike.simplified_profile.length > 0;
  const getRichText = (field) => field?.[0]?.children?.[0]?.text || '';

  return (
    <main style={{ fontFamily: 'sans-serif', padding: '2rem', maxWidth: '800px', margin: 'auto' }}>
      <p style={{ marginBottom: '2rem' }}><Link href="/">← Back to all hikes</Link></p>
      <h1>{hike.name}</h1>
      
      {hike.content && (
        <div style={{ display: 'flex', gap: '2rem', margin: '1rem 0' }}>
            <div>
              <strong>Duration</strong>
              <p>{hike.content.Duration}</p>
            </div>
        </div>
      )}

      <div style={{ marginTop: '1rem', marginBottom: '2rem' }}>
        {hike.track ? <Map track={hike.track} /> : <p>Map data is missing.</p>}
      </div>

      {hasElevationData && (
        <div style={{ marginBottom: '2rem' }}>
          <h2>Elevation Profile</h2>
          <ElevationProfile 
            profileData={hike.simplified_profile} 
            landmarks={hike.content?.landmarks} 
          />
        </div>
      )}

      {hike.content && (
        <div>
          <div style={{ marginBottom: '1.5rem' }}>
            <h2>Guide</h2>
            <p>{getRichText(hike.content.guide)}</p>
          </div>
          <div style={{ marginBottom: '1.5rem' }}>
            <h2>Logistics</h2>
            <p>{getRichText(hike.content.Logistics)}</p>
          </div>
          <div>
            <h2>Resources</h2>
            <p>{getRichText(hike.content.Resources)}</p>
          </div>
        </div>
      )}
    </main>
  );
}