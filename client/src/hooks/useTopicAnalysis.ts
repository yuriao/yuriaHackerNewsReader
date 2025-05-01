import { useState, useEffect } from 'react';
import { useNewStories } from './useHackerNews';
import { extractTopicsFromStories } from '../lib/topicExtractor';

interface UseTopicAnalysisOptions {
  maxStories?: number;
  maxTopics?: number;
  refreshInterval?: number;
}

export function useTopicAnalysis({
  maxStories = 100,
  maxTopics = 20,
  refreshInterval = 5 * 60 * 1000  // 5 minutes by default
}: UseTopicAnalysisOptions = {}) {
  const [topicData, setTopicData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  
  // Get new stories from the last 24 hours
  const { data: stories, isLoading: storiesLoading, error: storiesError } = useNewStories(maxStories);
  
  useEffect(() => {
    if (storiesLoading || !stories) {
      return;
    }
    
    if (storiesError) {
      setError(storiesError as Error);
      setIsLoading(false);
      return;
    }
    
    try {
      // Filter stories from the last 24 hours
      const oneDayAgo = Date.now() / 1000 - 24 * 60 * 60; // 24 hours ago in Unix time
      const recentStories = stories.filter(story => story.time > oneDayAgo);
      
      // Extract topics from recent stories
      const extractedTopics = extractTopicsFromStories(recentStories, maxTopics);
      setTopicData(extractedTopics);
      setIsLoading(false);
    } catch (err) {
      setError(err as Error);
      setIsLoading(false);
    }
  }, [stories, storiesLoading, storiesError, maxTopics]);
  
  // Set up auto-refresh
  useEffect(() => {
    const refreshTimer = setInterval(() => {
      setIsLoading(true);
    }, refreshInterval);
    
    return () => clearInterval(refreshTimer);
  }, [refreshInterval]);
  
  return {
    topicData,
    isLoading: isLoading || storiesLoading,
    error: error || storiesError,
  };
}