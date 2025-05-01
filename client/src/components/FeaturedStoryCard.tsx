import { Link } from "wouter";
import { StoryWithDetails } from "@/types";

interface FeaturedStoryCardProps {
  story: StoryWithDetails;
}

export default function FeaturedStoryCard({ story }: FeaturedStoryCardProps) {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
      <div className="md:flex">
        <div className="md:w-2/5 relative h-56 md:h-auto">
          <svg
            className="w-full h-full object-cover bg-gray-200"
            viewBox="0 0 600 400"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect width="100%" height="100%" fill="#e2e8f0" />
            <path
              d="M300,200 L350,150 L400,200 L350,250 Z"
              fill="#CBD5E0"
            />
            <circle cx="250" cy="200" r="50" fill="#CBD5E0" />
            <path
              d="M150,150 L200,150 L200,250 L150,250 Z"
              fill="#CBD5E0"
            />
            <text
              x="300"
              y="380"
              fontSize="12"
              fontFamily="monospace"
              textAnchor="middle"
              fill="#4A5568"
            >
              {story.domain || "hackernews.com"}
            </text>
          </svg>
        </div>
        <div className="md:w-3/5 p-6">
          <div className="flex items-center text-sm text-gray-600 mb-2">
            <span className="bg-accent-400 text-white px-2 py-1 rounded-md text-xs font-medium mr-3">
              TRENDING
            </span>
            <span className="mr-3">
              <i className="fas fa-clock mr-1"></i> {story.timeAgo}
            </span>
            <span>
              <i className="fas fa-comment mr-1"></i> {story.descendants || 0} comments
            </span>
          </div>
          <h3 className="text-xl md:text-2xl font-bold mb-2 leading-tight">
            <Link href={`/item/${story.id}`}>
              <a className="text-gray-900 hover:text-primary-600">
                {story.title}
              </a>
            </Link>
          </h3>
          {story.text && (
            <p className="text-gray-600 mb-4 line-clamp-2">
              <span dangerouslySetInnerHTML={{ __html: story.text }}></span>
            </p>
          )}
          <div className="flex items-center justify-between">
            <div className="flex items-center text-sm">
              {story.url && (
                <span className="text-primary-700 hover:text-primary-600 font-medium">
                  {story.domain}
                </span>
              )}
            </div>
            <div className="flex items-center space-x-4">
              <span className="flex items-center text-gray-600">
                <i className="fas fa-arrow-up mr-1 text-green-500"></i> {story.score}
              </span>
              <button className="text-gray-500 hover:text-gray-700">
                <i className="far fa-bookmark"></i>
              </button>
              <button className="text-gray-500 hover:text-gray-700">
                <i className="fas fa-share-alt"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
