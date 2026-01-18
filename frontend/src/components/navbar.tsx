'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';

export default function Navbar() {
    const { user, logout } = useAuth();
    const router = useRouter();

    const handleLogout = () => {
        logout();
        router.push('/');
    };

    return (
        <nav className="border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <div className="flex items-center">
                        <Link href="/" className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                            AI Upskilling
                        </Link>
                    </div>

                    <div className="hidden md:flex items-center space-x-8">
                        <Link href="/" className="text-sm font-medium hover:text-blue-600 transition">
                            Home
                        </Link>
                        {user && (
                            <Link href="/dashboard" className="text-sm font-medium hover:text-blue-600 transition">
                                My Academy
                            </Link>
                        )}
                        {user?.is_admin && (
                            <Link href="/admin" className="text-sm font-medium text-amber-600 hover:text-amber-700 transition">
                                Admin
                            </Link>
                        )}
                    </div>

                    <div className="flex items-center space-x-4">
                        {user ? (
                            <div className="flex items-center space-x-4">
                                <span className="text-sm text-zinc-500 hidden sm:inline">
                                    {user.email}
                                </span>
                                <button
                                    onClick={handleLogout}
                                    className="text-sm font-medium px-4 py-2 rounded-lg border border-zinc-200 hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800 transition"
                                >
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-2">
                                <Link
                                    href="/login"
                                    className="text-sm font-medium px-4 py-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
                                >
                                    Sign In
                                </Link>
                                <Link
                                    href="/signup"
                                    className="text-sm font-medium px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
                                >
                                    Get Started
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
