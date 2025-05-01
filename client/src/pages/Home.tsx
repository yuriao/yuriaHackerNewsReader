import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import FeaturedStoryCard from "@/components/FeaturedStoryCard";
import StoryCard from "@/components/StoryCard";
import AskHNItem from "@/components/AskHNItem";
import NewStoryItem from "@/components/NewStoryItem";
import TopicBarChart from "@/components/TopicBarChart";
import { StoryWithDetails } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import { useTopicAnalysis } from "@/hooks/useTopicAnalysis";

export default function Home() {
  const { data: topStories = [], isLoading: topLoading } = useQuery<StoryWithDetails[]>({
    queryKey: ["/api/stories/top?limit=6"],
  });

  const { data: askStories = [], isLoading: askLoading } = useQuery<StoryWithDetails[]>({
    queryKey: ["/api/stories/ask?limit=2"],
  });

  const { data: newStories = [], isLoading: newLoading } = useQuery<StoryWithDetails[]>({
    queryKey: ["/api/stories/new?limit=5"],
  });

  // Get topic data for visualization
  const { topicData, isLoading: topicLoading } = useTopicAnalysis({
    maxStories: 100,
    maxTopics: 30
  });

  return (
    <main className="flex-grow container mx-auto px-4 py-6">
      {/* Welcome Banner */}
      <section className="mb-8 bg-gradient-to-r from-primary-600 to-primary-800 rounded-lg p-8 text-black-600">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Welcome to HackerNews Reader</h1>
        <p className="text-lg opacity-90 mb-6">
          Stay up-to-date with the latest tech news, insights, and discussions from the Hacker News community.
        </p>
      </section>

      {/* Topic Visualization Section */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-primary-700">Trending Topics (Last 24 Hours)</h2>
        <div className="bg-white rounded-lg shadow-md p-4">
          {topicLoading ? (
            <div className="animate-pulse flex flex-col items-center justify-center h-96">
              <div className="h-16 w-16 bg-gray-200 rounded-full mb-4"></div>
              <div className="h-4 w-48 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 w-64 bg-gray-200 rounded"></div>
              <p className="mt-4 text-gray-500">Analyzing topics from recent stories...</p>
            </div>
          ) : !topicData || topicData.children.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-96 text-gray-500">
              <p>No topic data available. Check back later.</p>
            </div>
          ) : (
            <div className="h-96 w-full overflow-y-auto">
              <TopicBarChart 
                data={topicData}
                maxTopics={15}
              />
            </div>
          )}
        </div>
      </section>

      {/* Featured Story Section */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-primary-700">Featured</h2>
        {topLoading ? (
          <div className="bg-white rounded-lg overflow-hidden shadow-md">
            <div className="md:flex">
              <div className="md:w-2/5 h-56 md:h-64">
                <Skeleton className="h-full w-full" />
              </div>
              <div className="md:w-3/5 p-6">
                <Skeleton className="h-6 w-24 mb-2" />
                <Skeleton className="h-8 w-full mb-4" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4 mb-4" />
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-24" />
                  <div className="flex space-x-4">
                    <Skeleton className="h-4 w-12" />
                    <Skeleton className="h-4 w-4" />
                    <Skeleton className="h-4 w-4" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          topStories.length > 0 && <FeaturedStoryCard story={topStories[0]} />
        )}
      </section>

      {/* Top Stories Section */}
      <section className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-primary-700">Top Stories</h2>
          <Link href="/stories/top">
            <a className="text-primary-600 hover:text-primary-800 text-sm font-medium">
              View All <i className="fas fa-chevron-right ml-1 text-xs"></i>
            </a>
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {topLoading
            ? [...Array(3)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg overflow-hidden shadow p-5">
                  <Skeleton className="h-4 w-32 mb-2" />
                  <Skeleton className="h-6 w-full mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-3/4 mb-3" />
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-16" />
                    <div className="flex space-x-3">
                      <Skeleton className="h-4 w-10" />
                      <Skeleton className="h-4 w-4" />
                    </div>
                  </div>
                </div>
              ))
            : topStories
                .slice(1, 4)
                .map((story) => <StoryCard key={story.id} story={story} />)}
        </div>
      </section>

      {/* Ask HN Section */}
      <section className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-primary-700">Ask HN</h2>
          <Link href="/stories/ask">
            <a className="text-primary-600 hover:text-primary-800 text-sm font-medium">
              View All <i className="fas fa-chevron-right ml-1 text-xs"></i>
            </a>
          </Link>
        </div>

        <div className="space-y-4">
          {askLoading
            ? [...Array(2)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg p-5 shadow">
                  <Skeleton className="h-6 w-full mb-2" />
                  <Skeleton className="h-4 w-full mb-1" />
                  <Skeleton className="h-4 w-full mb-1" />
                  <Skeleton className="h-4 w-3/4 mb-3" />
                  <div className="flex justify-between">
                    <div className="flex space-x-4">
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                    <div className="flex space-x-3">
                      <Skeleton className="h-4 w-10" />
                      <Skeleton className="h-4 w-4" />
                    </div>
                  </div>
                </div>
              ))
            : askStories.map((story) => (
                <AskHNItem key={story.id} story={story} />
              ))}
        </div>
      </section>

      {/* New Stories Section */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-primary-700">New Stories</h2>
          <Link href="/stories/new">
            <a className="text-primary-600 hover:text-primary-800 text-sm font-medium">
              View All <i className="fas fa-chevron-right ml-1 text-xs"></i>
            </a>
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <ul className="divide-y divide-gray-200">
            {newLoading
              ? [...Array(5)].map((_, i) => (
                  <li key={i} className="p-4">
                    <div className="flex items-center justify-between">
                      <Skeleton className="h-5 w-3/4" />
                      <Skeleton className="h-5 w-16 ml-4" />
                    </div>
                    <div className="flex space-x-3 mt-2">
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-4 w-10" />
                      <Skeleton className="h-4 w-10" />
                    </div>
                  </li>
                ))
              : newStories.map((story) => (
                  <NewStoryItem key={story.id} story={story} />
                ))}
          </ul>
          
          <div className="bg-gray-50 px-4 py-3 text-center">
            <Link href="/stories/new">
              <a className="text-primary-600 hover:text-primary-800 font-medium">
                Load More <i className="fas fa-chevron-down ml-1"></i>
              </a>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
