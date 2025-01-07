import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';

const Navigation = () => {
  const { data: session } = useSession();

  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex space-x-4 items-center">
          {session && (
            <>
            
              <Link
                href="/tasks"
                className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700 transition duration-200"
              >
                Tasks
              </Link>
              {/* Admin Dashboard Button */}
              {session?.user?.role === 'admin' && (
                <Link
                  href="/admin"
                  className="bg-purple-600 px-4 py-2 rounded hover:bg-purple-700 transition duration-200"
                >
                  Admin Dashboard
                </Link>
              )}
            </>
          )}
        </div>
        {session && (
          <div className="flex items-center space-x-4">
            <span className="bg-gray-700 px-3 py-1 rounded">
              {session?.user?.role === 'admin' ? '👑 Admin Access' : '👤 User'}
            </span>
            <button
              onClick={() => signOut()}
              className="bg-red-500 px-4 py-2 rounded hover:bg-red-600 transition duration-200"
            >
              Sign Out
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
