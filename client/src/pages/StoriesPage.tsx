import { useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";
import { useState } from "react";
import StoryCard from "@/components/StoryCard";
import AskHNItem from "@/components/AskHNItem";
import { StoryWithDetails, StoryType } from "@/types";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

const STORIES_PER_PAGE = 12;

export default function StoriesPage() {
  const { type } = useParams<{ type: StoryType }>();
  const [page, setPage] = useState(1);

  const { data: stories = [], isLoading } = useQuery<StoryWithDetails[]>({
    queryKey: [`/api/stories/${type}?limit=30`],
  });

  const typeTitle = {
    top: "Top Stories",
    new: "New Stories",
    best: "Best Stories",
    ask: "Ask HN",
    show: "Show HN",
    job: "Jobs"
  }[type] || "Stories";

  const loadMore = () => {
    setPage(page + 1);
  };

  const paginatedStories = stories.slice(0, page * STORIES_PER_PAGE);
  const hasMore = stories.length > paginatedStories.length;
  const isAskOrShow = type === "ask" || type === "show";

  return (
    <main className="flex-grow container mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-6 text-primary-700">{typeTitle}</h1>

      {isLoading ? (
        <div className={`grid gap-6 ${isAskOrShow ? "" : "md:grid-cols-2 lg:grid-cols-3"}`}>
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg p-5 shadow">
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
          ))}
        </div>
      ) : (
        <>
          {stories.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No stories found.</p>
            </div>
          ) : (
            <>
              <div className={`${isAskOrShow ? "space-y-4" : "grid gap-6 md:grid-cols-2 lg:grid-cols-3"}`}>
                {paginatedStories.map((story) => 
                  isAskOrShow ? (
                    <AskHNItem key={story.id} story={story} />
                  ) : (
                    <StoryCard key={story.id} story={story} />
                  )
                )}
              </div>

              {hasMore && (
                <div className="mt-8 text-center">
                  <Button onClick={loadMore} variant="outline" size="lg">
                    Load More <i className="fas fa-chevron-down ml-2"></i>
                  </Button>
                </div>
              )}
            </>
          )}
        </>
      )}
    </main>
  );
}
