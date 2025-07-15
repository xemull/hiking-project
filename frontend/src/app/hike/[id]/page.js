import Map from '../../components/DynamicMap';
import ElevationProfile from '../../components/ElevationProfile';

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
  const hike = await getHike(params.id);

  if (!hike) {
    return (
      <main style={{ fontFamily: 'sans-serif', padding: '2rem' }}>
        <h1>Hike Not Found</h1>
      </main>
    );
  }

  // --- NEW LOGIC ---
  // Check for elevation data here, in the parent component.
  const hasElevationData = hike.track?.coordinates?.[0]?.length > 2;

  const getRichText = (field) => field?.[0]?.children?.[0]?.text || '';

  return (
    <main style={{ fontFamily: 'sans-serif', padding: '2rem', maxWidth: '800px', margin: 'auto' }}>
      <h1>{hike.name}</h1>

      <div style={{ display: 'flex', gap: '2rem', margin: '1rem 0' }}>
        <div>
          <strong>Distance</strong>
          <p>{hike.distance_km} km</p>
        </div>
        <div>
          <strong>Ascent</strong>
          <p>{hike.ascent_m} m (placeholder)</p>
        </div>
        {hike.content && (
          <div>
            <strong>Duration</strong>
            <p>{hike.content.Duration}</p>
          </div>
        )}
      </div>

      <div style={{ marginTop: '1rem', marginBottom: '2rem' }}>
        {hike.track ? <Map track={hike.track} /> : <p>Map data is missing.</p>}
      </div>

      {/* This entire section will now only appear if there is elevation data */}
      {hasElevationData && (
        <div style={{ marginBottom: '2rem' }}>
          <h2>Elevation Profile</h2>
          <ElevationProfile track={hike.track} />
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