// Correct location: src/app/page.js
import { getHikes } from './services/api';
import HikeCard from './components/HikeCard';

export default async function HomePage() {
  const hikes = await getHikes();

  if (!hikes || hikes.length === 0) {
    return (
      <main className="container mx-auto p-4">
        <h1 className="text-3xl font-bold">Hiking Project</h1>
        <p>Could not load hikes or no hikes found.</p>
      </main>
    );
  }

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8">All Hikes</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {hikes.map((hike) => (
          <HikeCard key={hike.id} hike={hike} />
        ))}
      </div>
    </main>
  );
}