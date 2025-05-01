import { Link } from "wouter";
import { StoryWithDetails } from "@/types";

interface StoryCardProps {
  story: StoryWithDetails;
}

export default function StoryCard({ story }: StoryCardProps) {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow hover:shadow-md transition-shadow duration-300">
      <div className="p-5">
        <div className="flex items-center text-sm text-gray-500 mb-2">
          <span className="mr-3">
            <i className="fas fa-clock mr-1"></i> {story.timeAgo}
          </span>
          <span>
            <i className="fas fa-comment mr-1"></i> {story.descendants || 0}
          </span>
        </div>
        <h3 className="font-bold text-lg mb-2 leading-tight">
          <Link href={`/item/${story.id}`}>
            <a className="text-gray-900 hover:text-primary-600">{story.title}</a>
          </Link>
        </h3>
        {story.text && (
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            <span dangerouslySetInnerHTML={{ __html: story.text }}></span>
          </p>
        )}
        <div className="flex items-center justify-between mt-2">
          {story.url && (
            <span className="text-primary-700 text-sm">{story.domain}</span>
          )}
          <div className="flex items-center space-x-3">
            <span className="flex items-center text-sm text-gray-600">
              <i className="fas fa-arrow-up mr-1 text-green-500"></i> {story.score}
            </span>
            <button className="text-gray-500 hover:text-gray-700 text-sm">
              <i className="far fa-bookmark"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
