import { Link } from "wouter";
import { StoryWithDetails } from "@/types";

interface NewStoryItemProps {
  story: StoryWithDetails;
}

export default function NewStoryItem({ story }: NewStoryItemProps) {
  return (
    <li className="hover:bg-gray-50">
      <div className="p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base md:text-lg font-medium">
            <Link href={`/item/${story.id}`}>
              <a className="text-gray-900 hover:text-primary-600">
                {story.title}
              </a>
            </Link>
          </h3>
          <div className="flex items-center space-x-2 ml-4">
            <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
              New
            </span>
          </div>
        </div>
        <div className="flex items-center text-sm text-gray-500 mt-2">
          <span className="mr-3">
            <i className="fas fa-clock mr-1"></i> {story.timeAgo}
          </span>
          {story.url && (
            <span className="mr-3 text-primary-700">{story.domain}</span>
          )}
          <span className="mr-3">
            <i className="fas fa-arrow-up mr-1"></i> {story.score}
          </span>
          <span>
            <i className="fas fa-comment mr-1"></i> {story.descendants || 0}
          </span>
        </div>
      </div>
    </li>
  );
}
