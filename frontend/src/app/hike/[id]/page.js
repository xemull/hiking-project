import Map from '../../components/DynamicMap';

async function getHike(id) {
  try {
    const res = await fetch(`http://localhost:4000/api/hikes/${id}`, { cache: 'no-store' });
    if (!res.ok) {
      return null;
    }
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
  
  // A helper to safely get text from Strapi's rich text fields
  const getRichText = (field) => {
    return field?.[0]?.children?.[0]?.text || '';
  };

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

      <div style={{ marginTop: '1rem' }}>
        {hike.track ? (
          <Map track={hike.track} />
        ) : (
          <p>Map data is missing for this hike.</p>
        )}
      </div>

      {/* New sections to display the Strapi content */}
      {hike.content && (
        <div style={{ marginTop: '2rem' }}>
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