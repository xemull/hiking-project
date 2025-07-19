import Map from '../../components/DynamicMap';
import ElevationProfile from '../../components/ElevationProfile';
import Link from 'next/link';
import Comments from '../../components/Comments';

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

  return (
    <main style={{ fontFamily: 'sans-serif', padding: '2rem', maxWidth: '800px', margin: 'auto' }}>
      <p style={{ marginBottom: '2rem' }}><Link href="/">← Back to all hikes</Link></p>

      <h1>{hike.content?.title || hike.name}</h1>
      {hike.content?.Country && <p style={{ marginTop: '-1rem', color: '#555' }}>{hike.content.Country}</p>}
      
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', margin: '1rem 0', padding: '1rem', background: '#f9f9f9', borderRadius: '8px' }}>
        <div><strong>Distance</strong><p>{hike.distance_km || hike.content?.Length} km</p></div>
        {hike.content?.Elevation_gain && <div><strong>Elevation Gain</strong><p>{hike.content.Elevation_gain} m</p></div>}
        {hike.content?.Difficulty && <div><strong>Difficulty</strong><p>{hike.content.Difficulty}</p></div>}
        {hike.content?.Best_time && <div><strong>Best Time</strong><p>{hike.content.Best_time}</p></div>}
      </div>

      <div style={{ marginTop: '2rem', marginBottom: '2rem' }}>
        {hike.track ? <Map track={hike.track} /> : <p>Map data is missing.</p>}
      </div>
      
      {hasElevationData && (
        <div style={{ marginBottom: '2rem' }}>
          <h2>Elevation Profile</h2>
          <ElevationProfile profileData={hike.simplified_profile} landmarks={hike.content?.landmarks} />
        </div>
      )}

      {/* --- THIS IS THE FIX --- */}
      {/* The sections below now correctly map over all paragraphs */}
      {hike.content && (
        <div>
          {hike.content.Description && (
            <div style={{ marginBottom: '1.5rem' }}>
              <h2>Description</h2>
              {hike.content.Description.map((block, index) => (
                <p key={index}>{block.children.map(child => child.text).join('')}</p>
              ))}
            </div>
          )}
          {hike.content.Logistics && (
            <div style={{ marginBottom: '1.5rem' }}>
              <h2>Logistics</h2>
              {hike.content.Logistics.map((block, index) => (
                <p key={index}>{block.children.map(child => child.text).join('')}</p>
              ))}
            </div>
          )}
          {hike.content.Accommodation && (
            <div style={{ marginBottom: '1.5rem' }}>
              <h2>Accommodation</h2>
              {hike.content.Accommodation.map((block, index) => (
                <p key={index}>{block.children.map(child => child.text).join('')}</p>
              ))}
            </div>
          )}
        </div>
      )}
      
      <Comments hikeId={hike.id} />
    </main>
  );
}