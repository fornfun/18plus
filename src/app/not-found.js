/* eslint-disable react/no-unescaped-entities */
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header />
      
      <main className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="text-8xl mb-4">🔞</div>
          <h1 className="text-4xl font-bold mb-4">
            <span className="text-orange-500">404</span> - Page Not Found
          </h1>
          <p className="text-gray-400 text-lg mb-8">
            The content you're looking for doesn't exist or has been moved.
          </p>
          
          <div className="space-x-4">
            <Link 
              href="/" 
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg transition-colors font-medium inline-block"
            >
              Back to Home
            </Link>
            <Link 
              href="/search" 
              className="bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-lg transition-colors font-medium inline-block"
            >
              Search Videos
            </Link>
          </div>
          
          <div className="mt-12 text-gray-500 text-sm">
            <p>Need help? <Link href="/contact" className="text-orange-500 hover:underline">Contact us</Link></p>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
