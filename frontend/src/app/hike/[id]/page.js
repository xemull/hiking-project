import Map from '../../components/DynamicMap';
import ElevationProfile from '../../components/ElevationProfile';
import Link from 'next/link';
import Comments from '../../components/Comments';

// Helper function to get the YouTube video ID from a URL
function getYouTubeId(url) {
  if (!url) return null;
  const regExp = /^.*(http:\/\/googleusercontent.com\/youtube.com\/0\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}

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

      {hike.content && (
        <div>
          {hike.content.Description?.map((block, index) => (<p key={index}>{block.children.map(child => child.text).join('')}</p>))}
          
          <h2 style={{marginTop: '2rem'}}>Logistics</h2>
          {hike.content.Logistics?.map((block, index) => (<p key={index}>{block.children.map(child => child.text).join('')}</p>))}
          
          <h2 style={{marginTop: '2rem'}}>Accommodation</h2>
          {hike.content.Accommodation?.map((block, index) => (<p key={index}>{block.children.map(child => child.text).join('')}</p>))}

          {hike.content.Videos?.length > 0 && (
            <div style={{ marginTop: '2rem' }}>
              <h2>Videos</h2>
              {hike.content.Videos.map(video => {
                const videoId = getYouTubeId(video.youtube_url);
                return videoId ? (
                  <iframe 
                    key={video.id} 
                    width="560" 
                    height="315" 
                    src={`https://www.youtube.com/embed/${videoId}`} 
                    title={video.title} 
                    frameBorder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen 
                    style={{maxWidth: '100%', marginBottom: '1rem'}}>
                  </iframe>
                ) : null;
              })}
            </div>
          )}

          {hike.content.Books?.length > 0 && (
            <div style={{ marginTop: '2rem' }}>
              <h2>Guidebooks</h2>
              {hike.content.Books.map(book => {
                // FIXED: Correct path for the cover image from your API response
                const imageUrl = book.cover_image?.url;
                return (
                  <div key={book.id} style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem', gap: '1rem' }}>
                    {/* Only render the image if the URL exists */}
                    {imageUrl && (
                      <img 
                        src={`http://localhost:1337${imageUrl}`} 
                        alt={`Cover of ${book.title}`} 
                        style={{ width: '80px', height: 'auto', border: '1px solid #eee', borderRadius: '4px' }} 
                      />
                    )}
                    <div>
                      <a href={book.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: '#0066cc' }}>
                        {book.title}
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          
          {hike.content.Blogs?.length > 0 && (
            <div style={{ marginTop: '2rem' }}>
              <h2>Blogs & Stories</h2>
              {hike.content.Blogs.map(blog => (
                <div key={blog.id} style={{ marginBottom: '0.5rem' }}>
                  <a href={blog.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: '#0066cc' }}>
                    {blog.title}
                  </a>
                </div>
              ))}
            </div>
          )}

        </div>
      )}
      
      <Comments hikeId={hike.id} />
    </main>
  );
}