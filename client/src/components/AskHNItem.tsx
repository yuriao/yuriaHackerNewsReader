import { Link } from "wouter";
import { StoryWithDetails } from "@/types";

interface AskHNItemProps {
  story: StoryWithDetails;
}

export default function AskHNItem({ story }: AskHNItemProps) {
  return (
    <div className="bg-white rounded-lg p-5 shadow hover:shadow-md transition-shadow duration-300">
      <h3 className="font-bold text-lg mb-2">
        <Link href={`/item/${story.id}`}>
          <a className="text-gray-900 hover:text-primary-600">{story.title}</a>
        </Link>
      </h3>
      {story.text && (
        <p className="text-gray-600 mb-3">
          <span dangerouslySetInnerHTML={{ __html: story.text.length > 200 ? story.text.slice(0, 200) + '...' : story.text }}></span>
        </p>
      )}
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center text-gray-500">
          <span className="mr-4">
            <i className="fas fa-clock mr-1"></i> {story.timeAgo}
          </span>
          <span className="mr-4">
            <i className="fas fa-user mr-1"></i> {story.by}
          </span>
          <span>
            <i className="fas fa-comment mr-1"></i> {story.descendants || 0} comments
          </span>
        </div>
        <div className="flex items-center space-x-3">
          <span className="flex items-center text-gray-600">
            <i className="fas fa-arrow-up mr-1 text-green-500"></i> {story.score}
          </span>
          <button className="text-gray-500 hover:text-gray-700">
            <i className="far fa-bookmark"></i>
          </button>
        </div>
      </div>
    </div>
  );
}
