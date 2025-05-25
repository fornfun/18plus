'use client';
import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Upload, Link, Check, AlertCircle } from 'lucide-react';

export default function UploadPage() {
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const extractTeraBoxId = (url) => {
    const match = url.match(/teraboxapp\.com\/s\/([a-zA-Z0-9_-]+)/);
    return match ? match[1] : null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const teraId = extractTeraBoxId(url);
    if (!teraId) {
      setMessage({ type: 'error', text: 'Invalid TeraBox URL format. Please use: https://teraboxapp.com/s/YOUR_ID' });
      return;
    }

    if (!title.trim()) {
      setMessage({ type: 'error', text: 'Please provide a title for the video.' });
      return;
    }

    setIsSubmitting(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await fetch('/api/videos/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tera_id: teraId,
          title: title.trim(),
          category: category.trim() || 'General',
          tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag),
          url: url
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: `Video uploaded successfully! You can access it at /watch/${teraId}` });
        setUrl('');
        setTitle('');
        setCategory('');
        setTags('');
      } else {
        setMessage({ type: 'error', text: result.error || 'Failed to upload video' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Network error. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header />
      
      <main className="max-w-2xl mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-500 rounded-full mb-4">
            <Upload className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Upload Video</h1>
          <p className="text-gray-400">Share your TeraBox video with the community</p>
        </div>

        <div className="bg-gray-800 rounded-lg p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* URL Input */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <Link className="inline w-4 h-4 mr-2" />
                TeraBox URL *
              </label>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://teraboxapp.com/s/1EWkWY66FhZKS2WfxwBgd0Q"
                className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Format: https://teraboxapp.com/s/YOUR_VIDEO_ID
              </p>
            </div>

            {/* Title Input */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Video Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter a descriptive title..."
                className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                required
                maxLength={200}
              />
              <p className="text-xs text-gray-500 mt-1">
                {title.length}/200 characters
              </p>
            </div>

            {/* Category Input */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
              >
                <option value="">Select a category...</option>
                <option value="Solo">Solo</option>
                <option value="Couples">Couples</option>
                <option value="Lesbian">Lesbian</option>
                <option value="Amateur">Amateur</option>
                <option value="Professional">Professional</option>
                <option value="Fetish">Fetish</option>
                <option value="Vintage">Vintage</option>
                <option value="HD">HD</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Tags Input */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Tags
              </label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="hot, sexy, beautiful (comma separated)"
                className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                Separate tags with commas
              </p>
            </div>

            {/* Message Display */}
            {message.text && (
              <div className={`flex items-center p-4 rounded-lg ${
                message.type === 'success' 
                  ? 'bg-green-500/20 border border-green-500 text-green-400' 
                  : 'bg-red-500/20 border border-red-500 text-red-400'
              }`}>
                {message.type === 'success' ? (
                  <Check className="w-5 h-5 mr-2" />
                ) : (
                  <AlertCircle className="w-5 h-5 mr-2" />
                )}
                <span>{message.text}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium py-3 rounded-lg transition-colors"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Uploading...
                </span>
              ) : (
                'Upload Video'
              )}
            </button>
          </form>

          {/* Guidelines */}
          <div className="mt-8 p-4 bg-gray-700 rounded-lg">
            <h3 className="text-lg font-semibold mb-3 text-orange-400">Upload Guidelines</h3>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>• Only TeraBox URLs are supported</li>
              <li>• Ensure you have rights to share the content</li>
              <li>• Content must comply with our community guidelines</li>
              <li>• Videos will be reviewed before being published</li>
              <li>• Duplicate content may be removed</li>
            </ul>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
