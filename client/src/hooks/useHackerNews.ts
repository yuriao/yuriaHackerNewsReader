import { useQuery } from "@tanstack/react-query";
import { StoryWithDetails, CommentWithDetails, StoryType } from "@/types";

export function useTopStories(limit: number = 10) {
  return useQuery<StoryWithDetails[]>({
    queryKey: [`/api/stories/top?limit=${limit}`],
  });
}

export function useNewStories(limit: number = 10) {
  return useQuery<StoryWithDetails[]>({
    queryKey: [`/api/stories/new?limit=${limit}`],
  });
}

export function useBestStories(limit: number = 10) {
  return useQuery<StoryWithDetails[]>({
    queryKey: [`/api/stories/best?limit=${limit}`],
  });
}

export function useAskStories(limit: number = 10) {
  return useQuery<StoryWithDetails[]>({
    queryKey: [`/api/stories/ask?limit=${limit}`],
  });
}

export function useShowStories(limit: number = 10) {
  return useQuery<StoryWithDetails[]>({
    queryKey: [`/api/stories/show?limit=${limit}`],
  });
}

export function useJobStories(limit: number = 10) {
  return useQuery<StoryWithDetails[]>({
    queryKey: [`/api/stories/job?limit=${limit}`],
  });
}

export function useStory(id: number) {
  return useQuery<StoryWithDetails>({
    queryKey: [`/api/story/${id}`],
    enabled: !!id,
  });
}

export function useStoryComments(storyId: number) {
  return useQuery<CommentWithDetails[]>({
    queryKey: [`/api/item/${storyId}/comments`],
    enabled: !!storyId,
  });
}

export function useStoriesByType(type: StoryType, limit: number = 10) {
  return useQuery<StoryWithDetails[]>({
    queryKey: [`/api/stories/${type}?limit=${limit}`],
  });
}
