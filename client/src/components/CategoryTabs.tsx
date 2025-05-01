import { Link, useLocation } from "wouter";

export default function CategoryTabs() {
  const [location] = useLocation();
  
  const getTypeFromLocation = () => {
    const match = location.match(/\/stories\/(\w+)/);
    return match ? match[1] : "top";
  };
  
  const currentType = getTypeFromLocation();

  return (
    <div className="md:hidden bg-white shadow-sm">
      <div className="overflow-x-auto whitespace-nowrap py-3 px-4">
        <Link href="/stories/top">
          <a className={`px-4 py-1 font-medium rounded-full mr-2 ${
            currentType === "top" ? "text-primary-700 bg-primary-50" : "text-gray-600 hover:bg-gray-100"
          }`}>
            Top
          </a>
        </Link>
        <Link href="/stories/new">
          <a className={`px-4 py-1 font-medium rounded-full mr-2 ${
            currentType === "new" ? "text-primary-700 bg-primary-50" : "text-gray-600 hover:bg-gray-100"
          }`}>
            New
          </a>
        </Link>
        <Link href="/stories/best">
          <a className={`px-4 py-1 font-medium rounded-full mr-2 ${
            currentType === "best" ? "text-primary-700 bg-primary-50" : "text-gray-600 hover:bg-gray-100"
          }`}>
            Best
          </a>
        </Link>
        <Link href="/stories/ask">
          <a className={`px-4 py-1 font-medium rounded-full mr-2 ${
            currentType === "ask" ? "text-primary-700 bg-primary-50" : "text-gray-600 hover:bg-gray-100"
          }`}>
            Ask
          </a>
        </Link>
        <Link href="/stories/show">
          <a className={`px-4 py-1 font-medium rounded-full mr-2 ${
            currentType === "show" ? "text-primary-700 bg-primary-50" : "text-gray-600 hover:bg-gray-100"
          }`}>
            Show
          </a>
        </Link>
        <Link href="/stories/job">
          <a className={`px-4 py-1 font-medium rounded-full ${
            currentType === "job" ? "text-primary-700 bg-primary-50" : "text-gray-600 hover:bg-gray-100"
          }`}>
            Jobs
          </a>
        </Link>
      </div>
    </div>
  );
}
