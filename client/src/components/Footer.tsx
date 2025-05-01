import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-primary-900 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="md:flex md:justify-between">
          <div className="mb-6 md:mb-0">
            <div className="flex items-center">
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
              <h2 className="text-xl font-bold ml-2">HackerNews</h2>
            </div>
            <p className="mt-2 text-gray-400 text-sm">
              A modern interface for Hacker News content.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 md:grid-cols-3 md:gap-12">
            <div>
              <h3 className="text-sm font-semibold text-gray-200 uppercase tracking-wider mb-4">
                Categories
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/stories/top">
                    <a className="text-gray-400 hover:text-accent-400 text-sm">
                      Top Stories
                    </a>
                  </Link>
                </li>
                <li>
                  <Link href="/stories/new">
                    <a className="text-gray-400 hover:text-accent-400 text-sm">
                      New Stories
                    </a>
                  </Link>
                </li>
                <li>
                  <Link href="/stories/best">
                    <a className="text-gray-400 hover:text-accent-400 text-sm">
                      Best Stories
                    </a>
                  </Link>
                </li>
                <li>
                  <Link href="/stories/ask">
                    <a className="text-gray-400 hover:text-accent-400 text-sm">
                      Ask HN
                    </a>
                  </Link>
                </li>
                <li>
                  <Link href="/stories/show">
                    <a className="text-gray-400 hover:text-accent-400 text-sm">
                      Show HN
                    </a>
                  </Link>
                </li>
                <li>
                  <Link href="/stories/job">
                    <a className="text-gray-400 hover:text-accent-400 text-sm">
                      Jobs
                    </a>
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-200 uppercase tracking-wider mb-4">
                Resources
              </h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="https://github.com/HackerNews/API"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-accent-400 text-sm"
                  >
                    API Documentation
                  </a>
                </li>
                <li>
                  <a
                    href="https://news.ycombinator.com/newsfaq.html"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-accent-400 text-sm"
                  >
                    Hacker News FAQ
                  </a>
                </li>
                <li>
                  <a
                    href="https://news.ycombinator.com/newsguidelines.html"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-accent-400 text-sm"
                  >
                    Guidelines
                  </a>
                </li>
                <li>
                  <a
                    href="https://news.ycombinator.com/security.html"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-accent-400 text-sm"
                  >
                    Security
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-200 uppercase tracking-wider mb-4">
                About
              </h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="https://news.ycombinator.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-accent-400 text-sm"
                  >
                    Original Hacker News
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.ycombinator.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-accent-400 text-sm"
                  >
                    Y Combinator
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-accent-400 text-sm"
                  >
                    Contact
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-accent-400 text-sm"
                  >
                    Privacy Policy
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-700 md:flex md:items-center md:justify-between">
          <div className="flex space-x-6 md:order-2">
            <a
              href="https://github.com/yuriao"
              className="text-gray-400 hover:text-accent-400"
            >
              <i className="fab fa-github text-xl"></i>
            </a>

            <a
              href="https://www.linkedin.com/in/lujiachen-158298a1/"
              className="text-gray-400 hover:text-accent-400"
            >
              <i className="fab fa-linkedin text-xl"></i>
            </a>
          </div>
          <p className="mt-8 md:mt-0 md:order-1 text-sm text-gray-400">
            &copy; {new Date().getFullYear()} Lujia Chen. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
