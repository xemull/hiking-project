// src/app/quiz/page.tsx
import type { Metadata } from 'next';
import { Suspense } from 'react';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import TrailheadQuiz from '../components/TrailheadQuiz';
import { getHikes } from '../services/api';

export const metadata: Metadata = {
  title: 'Find Your Perfect Multi-Day Hike | Trailhead Quiz',
  description: 'Discover your ideal trail from our curated selection of the world\'s best multi-day walking routes. Take our 5-question quiz to get your personalized recommendation.',
  keywords: ['hiking quiz', 'trail finder', 'multi-day hikes', 'hiking recommendations', 'trail matching'],
  openGraph: {
    title: 'Find Your Perfect Multi-Day Hike',
    description: 'Take our quiz to discover your ideal trail from the world\'s best multi-day hikes.',
    type: 'website',
    url: 'https://trailhead.at/quiz',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Find Your Perfect Multi-Day Hike',
    description: 'Take our quiz to discover your ideal trail from the world\'s best multi-day hikes.',
  }
};

// Loading component for navigation
function NavigationLoading() {
  return (
    <nav className="sticky top-0 z-50 bg-white/85 backdrop-blur-lg shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="h-7 w-32 bg-gray-200 rounded animate-pulse"></div>
          <div className="hidden md:flex items-center space-x-6">
            <div className="h-6 w-24 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-6 w-20 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-6 w-20 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
      </div>
    </nav>
  );
}

// Separate component for navigation that loads hikes data
async function NavigationWithData() {
  try {
    const hikes = await getHikes();
    return <Navigation hikes={hikes || []} />;
  } catch (error) {
    console.error('Error loading navigation data:', error);
    return <Navigation hikes={[]} />;
  }
}

export default function QuizPage() {
  return (
    <>
      <Suspense fallback={<NavigationLoading />}>
        <NavigationWithData />
      </Suspense>
      
      <main style={{ background: 'var(--ds-background)', minHeight: '100vh' }}>
        <TrailheadQuiz />
      </main>
      
      <Footer />
    </>
  );
}