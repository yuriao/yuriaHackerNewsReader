import { useState } from "react";
import { Link } from "wouter";
import { StoryWithDetails } from "@/types";
import CommentItem from "./CommentItem";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import StoryUpvoteButton from "./StoryUpvoteButton";
import CommentForm from "./CommentForm";
import { Card } from "@/components/ui/card";
import { useUser } from "@/lib/userContext";

interface StoryDetailProps {
  storyId: number;
}

export default function StoryDetail({ storyId }: StoryDetailProps) {
  const [commentsPage, setCommentsPage] = useState(1);
  const COMMENTS_PER_PAGE = 10;
  const user = useUser();

  const { data: story, isLoading: storyLoading } = useQuery<StoryWithDetails>({
    queryKey: [`/api/story/${storyId}`],
  });

  const { data: comments = [], isLoading: commentsLoading } = useQuery<any[]>({
    queryKey: [`/api/item/${storyId}/comments`],
  });

  if (storyLoading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="bg-white rounded-lg shadow-lg max-w-4xl mx-auto">
          <div className="p-6">
            <Skeleton className="h-8 w-3/4 mb-4" />
            <div className="flex space-x-2 mb-6">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-24" />
            </div>
            <Skeleton className="h-32 w-full mb-6" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
      </div>
    );
  }

  if (!story) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="bg-white rounded-lg shadow-lg max-w-4xl mx-auto">
          <div className="p-6">
            <h2 className="text-2xl font-bold text-red-500">Story not found</h2>
            <p className="mt-4">
              The story you're looking for doesn't exist or may have been removed.
            </p>
            <Link href="/">
              <a className="text-primary-600 hover:text-primary-800 mt-4 inline-block">
                Return to home page
              </a>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const paginatedComments = comments.slice(
    0,
    commentsPage * COMMENTS_PER_PAGE
  );
  const hasMoreComments = comments.length > paginatedComments.length;

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="bg-white rounded-lg shadow-lg max-w-4xl mx-auto">
        <div className="p-6">
          <div className="mb-4">
            <Link href="/">
              <a className="text-primary-600 hover:text-primary-800 mb-4 inline-block">
                <i className="fas fa-arrow-left mr-2"></i> Back to Home
              </a>
            </Link>
            <h2 className="text-2xl font-bold text-gray-900 mt-4">{story.title}</h2>
            <div className="flex items-center text-sm text-gray-600 mt-2">
              <span className="mr-4">
                <i className="fas fa-clock mr-1"></i> {story.timeAgo}
              </span>
              <span className="mr-4">
                <i className="fas fa-user mr-1"></i> {story.by}
              </span>
              {story.url && (
                <a
                  href={story.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-700"
                >
                  {story.domain}
                </a>
              )}
            </div>
          </div>

          {story.text && (
            <div className="prose max-w-none mt-6">
              <div dangerouslySetInnerHTML={{ __html: story.text }}></div>
            </div>
          )}

          <div className="flex items-center justify-between mt-6 border-t border-b border-gray-200 py-4">
            <div className="flex items-center space-x-4">
              <span className="flex items-center text-gray-700">
                <span className="mr-2">Points:</span> {story.score}
              </span>
              
              {/* Add upvote button */}
              {user && <StoryUpvoteButton storyId={story.id} userId={user.id} />}
            </div>
            {story.url && (
              <a
                href={story.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-600 hover:text-primary-800 font-medium"
              >
                Visit Original
              </a>
            )}
          </div>

          {/* Comments Section */}
          <div className="mt-8">
            <h3 className="text-xl font-bold mb-6">
              Comments ({story.descendants || 0})
            </h3>
            
            {/* Add Comment Form */}
            <Card className="p-4 mb-8">
              <h4 className="text-md font-semibold mb-3">Add Your Comment</h4>
              {user ? (
                <CommentForm storyId={story.id} userId={user.id} />
              ) : (
                <p className="text-gray-500 text-sm">Sign in to comment</p>
              )}
            </Card>

            {commentsLoading ? (
              <div className="space-y-6">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="border-l-4 border-gray-200 pl-4">
                    <Skeleton className="h-4 w-32 mb-2" />
                    <Skeleton className="h-4 w-full mb-1" />
                    <Skeleton className="h-4 w-full mb-1" />
                    <Skeleton className="h-4 w-3/4 mb-2" />
                    <div className="flex space-x-2">
                      <Skeleton className="h-3 w-12" />
                      <Skeleton className="h-3 w-12" />
                    </div>
                  </div>
                ))}
              </div>
            ) : comments.length > 0 ? (
              <div className="space-y-6">
                {paginatedComments.map((comment) => (
                  <CommentItem 
                    key={comment.id} 
                    comment={comment} 
                    storyId={story.id}
                    userId={user ? user.id : 0}
                  />
                ))}

                {hasMoreComments && (
                  <div className="text-center pt-4">
                    <Button 
                      onClick={() => setCommentsPage(commentsPage + 1)}
                      variant="outline"
                    >
                      Load More Comments
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No comments yet. Be the first to comment!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
