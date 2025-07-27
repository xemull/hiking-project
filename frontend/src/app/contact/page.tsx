import { Mail } from 'lucide-react';
import Navigation from '../components/Navigation';

export default function ContactPage() {
  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-12 max-w-4xl">
          <div className="text-center mb-12">
            <Mail className="h-16 w-16 mx-auto text-green-600 mb-6" />
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Get in Touch</h1>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-8 max-w-2xl mx-auto">
            <div className="prose prose-lg">
              <p className="text-gray-700 leading-relaxed mb-6">
                Have a question about a trail, a suggestion for the site, or just want to share a story from 
                your own adventure? I'd love to hear from you.
              </p>
              
              <p className="text-gray-700 leading-relaxed mb-6">
                This project is a labor of love, and feedback from fellow hikers is the most valuable tool for 
                making it better. Whether you've found a mistake, want to suggest a new trail, or have a question 
                about planning your first multi-day hike, please don't hesitate to reach out.
              </p>

              <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
                <p className="text-gray-700 mb-2">You can email me directly at:</p>
                <a 
                  href="mailto:stan@yourwebsite.com" 
                  className="text-2xl font-semibold text-green-600 hover:text-green-700 transition-colors"
                >
                  stan@yourwebsite.com
                </a>
              </div>

              <p className="text-gray-700 font-medium text-center">
                Happy trails,<br />
                Stan
              </p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}