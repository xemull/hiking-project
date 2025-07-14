import Link from 'next/link'; // Import the Link component

async function getHikes() {
  try {
    const res = await fetch('http://localhost:4000/api/hikes', { cache: 'no-store' });
    if (!res.ok) {
      throw new Error('Failed to fetch data');
    }
    return res.json();
  } catch (error) {
    console.error('API Error:', error);
    return [];
  }
}

export default async function HomePage() {
  const hikes = await getHikes();

  return (
    <main style={{ fontFamily: 'sans-serif', padding: '2rem' }}>
      <h1>Hiking Trails</h1>
      
      {hikes.length > 0 ? (
        <ul>
          {hikes.map((hike) => (
            <li key={hike.id}>
              {/* Make the hike name a link to its detail page */}
              <Link href={`/hike/${hike.id}`}>
                {hike.name}
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p>No hikes found.</p>
      )}
    </main>
  );
}