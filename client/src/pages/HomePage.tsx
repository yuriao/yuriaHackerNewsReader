/**
 * Home page for the web application
 */

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchStories } from '../../../shared/api';
import { extractTopicsFromStories } from '../../../shared/topicExtractor';
import StoryCard from '../components/StoryCard';
import TopicBarChart from '../components/TopicBarChart';

export default function HomePage() {
  // Fetch top stories
  const { data: topStories, isLoading: topLoading, error: topError } = useQuery({
    queryKey: ['stories', 'top'],
    queryFn: () => fetchStories('top', 20),
  });

  // Fetch new stories
  const { data: newStories, isLoading: newLoading } = useQuery({
    queryKey: ['stories', 'new'],
    queryFn: () => fetchStories('new', 6),
  });

  // Fetch ask stories
  const { data: askStories, isLoading: askLoading } = useQuery({
    queryKey: ['stories', 'ask'],
    queryFn: () => fetchStories('ask', 6),
  });

  // Process topic data when available
  const topicData = topStories ? extractTopicsFromStories(topStories, 15) : null;

  return (
    <div>
      <section className="mb-8">
        <h1 className="text-3xl font-bold mb-6">Hacker News Reader</h1>
        <p className="text-gray-600 mb-8">
          Explore the latest tech news, discussions, and job postings from the Hacker News community.
        </p>
      </section>

      {/* Topic visualization section */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-4">Trending Topics</h2>
        {topLoading ? (
          <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
            <p className="text-gray-500">Loading topic data...</p>
          </div>
        ) : topicData ? (
          <div className="bg-white p-4 rounded-lg shadow">
            <TopicBarChart data={topicData} maxTopics={10} />
          </div>
        ) : (
          <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
            <p className="text-gray-500">No topic data available</p>
          </div>
        )}
      </section>

      {/* Top stories section */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-4">Top Stories</h2>
        
        {topLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-gray-100 h-40 rounded-lg animate-pulse"></div>
            ))}
          </div>
        ) : topError ? (
          <div className="bg-red-50 p-4 rounded-lg">
            <p className="text-red-500">Error loading stories. Please try again later.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {topStories?.slice(0, 6).map(story => (
              <StoryCard key={story.id} story={story} />
            ))}
          </div>
        )}
      </section>

      {/* New and Ask HN sections in a grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* New stories section */}
        <section>
          <h2 className="text-2xl font-bold mb-4">New Stories</h2>
          
          {newLoading ? (
            <div className="space-y-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-gray-100 h-24 rounded-lg animate-pulse"></div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {newStories?.slice(0, 4).map(story => (
                <StoryCard key={story.id} story={story} />
              ))}
            </div>
          )}
        </section>

        {/* Ask HN section */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Ask HN</h2>
          
          {askLoading ? (
            <div className="space-y-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-gray-100 h-24 rounded-lg animate-pulse"></div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {askStories?.slice(0, 4).map(story => (
                <StoryCard key={story.id} story={story} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}