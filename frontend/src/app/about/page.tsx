import { User } from 'lucide-react';
import Navigation from '../components/Navigation';

export default function AboutPage() {
  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-12 max-w-4xl">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="mb-8">
              {/* Placeholder for Stan's photo - replace with actual image */}
              <div className="w-48 h-48 mx-auto bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center mb-6 shadow-lg">
                <User className="h-24 w-24 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">About Stan</h1>
            </div>
          </div>

          {/* Content */}
          <div className="prose prose-lg mx-auto">
            <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">It all started with one multi-day hike.</h2>
              <p className="text-gray-700 leading-relaxed mb-6">
                Hi, I'm Stan. Fifteen years ago, I went on my first multi-day trek, and I was immediately hooked. 
                There was something magical about carrying everything I needed on my back and watching the world 
                unfold at the pace of my own two feet. Since then, I've walked thousands of kilometers on trails 
                across the world, mostly solo.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Why This Site Exists</h2>
              <p className="text-gray-700 leading-relaxed mb-6">
                I created this website for the person I was back then—someone who loved day hikes but found 
                the idea of a multi-day trek both exciting and incredibly intimidating.
              </p>
              <p className="text-gray-700 leading-relaxed mb-6">
                Planning a long hike can feel overwhelming. You spend hours jumping between dozens of blogs, 
                official websites, and forums, trying to piece together the critical information: How do I get 
                to the start? Where can I get a GPX file? Which direction should I walk? I wanted to create a 
                single, trusted resource that cuts through the noise.
              </p>
              <p className="text-gray-700 leading-relaxed mb-6">
                Think of this site as your personal library of Cicerone guides, carefully curated and vetted. 
                Every trail featured here has been thoroughly researched to give you all the key, high-level 
                information you need in one place, so you can spend less time planning and more time dreaming 
                about your next adventure.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">More Than Just a Walk</h2>
              <p className="text-gray-700 leading-relaxed mb-6">
                I believe hiking is one of the most powerful and accessible activities available to us. It pulls 
                us out of our organized routines and into a small, manageable adventure. It's a low-carbon way 
                to explore, a powerful tool for physical health, and a meditative practice that calms the mind.
              </p>
              <p className="text-gray-700 leading-relaxed mb-6">
                My ultimate goal is to get more people to experience the unique joy of a long walk. I hope the 
                trails you find here are the start of your own story.
              </p>
              <p className="text-gray-700 font-medium">
                Happy hiking,<br />
                Stan
              </p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
