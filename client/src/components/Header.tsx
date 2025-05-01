import { Link, useLocation } from "wouter";
import { useAuth, useUser } from "@/lib/userContext";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  toggleMobileMenu: () => void;
}

export default function Header({ toggleMobileMenu }: HeaderProps) {
  const [location] = useLocation();
  const { login, logout } = useAuth();
  const user = useUser();

  return (
    <header className="bg-orange-600 text-white shadow-md sticky top-0 z-10">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <button
            className="md:hidden"
            aria-label="Menu"
            onClick={toggleMobileMenu}
          >
            <i className="fas fa-bars text-xl"></i>
          </button>
          <Link href="/">
            <a className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-accent-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1M19 20a2 2 0 002-2V8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2h8zm-9-3h2v-2h-2v2zm0-4h2V9h-2v4z"
                />
              </svg>
              <h1 className="text-xl font-bold ml-2">HackerNews</h1>
            </a>
          </Link>
        </div>
        <div className="hidden md:flex items-center space-x-6">
          <nav>
            <ul className="flex space-x-6">
              <li>
                <Link href="/stories/top">
                  <a className={`hover:text-accent-400 font-medium ${location === "/stories/top" ? "text-accent-400" : ""}`}>
                    Top Stories
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/stories/new">
                  <a className={`hover:text-accent-400 font-medium ${location === "/stories/new" ? "text-accent-400" : ""}`}>
                    New
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/stories/best">
                  <a className={`hover:text-accent-400 font-medium ${location === "/stories/best" ? "text-accent-400" : ""}`}>
                    Best
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/stories/ask">
                  <a className={`hover:text-accent-400 font-medium ${location === "/stories/ask" ? "text-accent-400" : ""}`}>
                    Ask
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/stories/show">
                  <a className={`hover:text-accent-400 font-medium ${location === "/stories/show" ? "text-accent-400" : ""}`}>
                    Show
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/stories/job">
                  <a className={`hover:text-accent-400 font-medium ${location === "/stories/job" ? "text-accent-400" : ""}`}>
                    Jobs
                  </a>
                </Link>
              </li>
            </ul>
          </nav>
        </div>
        <div className="flex items-center space-x-4">
          <button aria-label="Search" className="hover:text-accent-400">
            <i className="fas fa-search text-lg"></i>
          </button>
          <button aria-label="Refresh" className="hover:text-accent-400">
            <i className="fas fa-sync-alt text-lg"></i>
          </button>
          {user ? (
            <div className="flex items-center space-x-2">
              <span className="text-sm hidden md:inline">{user.displayName}</span>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={logout} 
                className="border-white text-white hover:bg-primary-600 hover:text-white"
              >
                Logout
              </Button>
            </div>
          ) : (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={login} 
              className="border-white text-white hover:bg-primary-600 hover:text-white"
            >
              Login
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
