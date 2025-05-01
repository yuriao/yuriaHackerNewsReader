import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth, useUser } from "@/lib/userContext";

interface MobileMenuProps {
  isOpen: boolean;
}

export default function MobileMenu({ isOpen }: MobileMenuProps) {
  const { login, logout } = useAuth();
  const user = useUser();
  
  if (!isOpen) return null;

  return (
    <div className="md:hidden" id="mobileMenu">
      <nav className="bg-primary-900 px-4 py-3">
        <ul className="space-y-3">
          <li>
            <Link href="/stories/top">
              <a className="block text-white hover:text-accent-400 py-2">
                Top Stories
              </a>
            </Link>
          </li>
          <li>
            <Link href="/stories/new">
              <a className="block text-white hover:text-accent-400 py-2">
                New
              </a>
            </Link>
          </li>
          <li>
            <Link href="/stories/best">
              <a className="block text-white hover:text-accent-400 py-2">
                Best
              </a>
            </Link>
          </li>
          <li>
            <Link href="/stories/ask">
              <a className="block text-white hover:text-accent-400 py-2">
                Ask
              </a>
            </Link>
          </li>
          <li>
            <Link href="/stories/show">
              <a className="block text-white hover:text-accent-400 py-2">
                Show
              </a>
            </Link>
          </li>
          <li>
            <Link href="/stories/job">
              <a className="block text-white hover:text-accent-400 py-2">
                Jobs
              </a>
            </Link>
          </li>
          <li className="border-t border-primary-700 mt-2 pt-2">
            {user ? (
              <div className="flex flex-col space-y-2">
                <span className="text-white py-2">{user.displayName}</span>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={logout} 
                  className="border-white text-white hover:bg-primary-800 hover:text-white w-full"
                >
                  Logout
                </Button>
              </div>
            ) : (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={login} 
                className="border-white text-white hover:bg-primary-800 hover:text-white w-full mt-2"
              >
                Login
              </Button>
            )}
          </li>
        </ul>
      </nav>
    </div>
  );
}
