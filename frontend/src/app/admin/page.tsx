'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';

interface User {
    id: string;
    email: string;
    is_admin: boolean;
    is_blocked: boolean;
    created_at: string;
}

export default function AdminPage() {
    const { user, token, isLoading: authLoading } = useAuth();
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const router = useRouter();

    useEffect(() => {
        if (!authLoading && (!user || !user.is_admin)) {
            router.push('/');
        }
    }, [user, authLoading, router]);

    useEffect(() => {
        if (token && user?.is_admin) {
            fetchUsers();
        }
    }, [token, user]);

    const fetchUsers = async () => {
        try {
            const response = await fetch('http://localhost:8000/api/admin/users', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                setUsers(data);
            } else {
                setError('Failed to fetch users');
            }
        } catch (error) {
            setError('Network error');
        } finally {
            setIsLoading(false);
        }
    };

    const toggleBlock = async (userId: string, currentStatus: boolean) => {
        const action = currentStatus ? 'unblock' : 'block';
        try {
            const response = await fetch(`http://localhost:8000/api/admin/users/${userId}/${action}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                setUsers(users.map(u => u.id === userId ? { ...u, is_blocked: !currentStatus } : u));
            }
        } catch (error) {
            alert(`Failed to ${action} user`);
        }
    };

    const deleteUser = async (userId: string) => {
        if (!confirm('Are you sure you want to delete this user? All their data will be lost.')) return;

        try {
            const response = await fetch(`http://localhost:8000/api/admin/users/${userId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                setUsers(users.filter(u => u.id !== userId));
            }
        } catch (error) {
            alert('Failed to delete user');
        }
    };

    if (authLoading || isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="flex justify-between items-center mb-10">
                <div>
                    <h1 className="text-4xl font-extrabold tracking-tight">Admin Control Center</h1>
                    <p className="text-zinc-500 mt-2">Manage user accounts and platform security</p>
                </div>
                <div className="bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-400 px-4 py-2 rounded-full text-sm font-bold flex items-center">
                    <span className="w-2 h-2 bg-amber-500 rounded-full mr-2 animate-pulse"></span>
                    ADMIN PRIVILEGES ACTIVE
                </div>
            </div>

            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {error}
                </div>
            )}

            <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-2xl overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-zinc-50 dark:bg-zinc-800/50 border-b border-zinc-200 dark:border-zinc-800">
                        <tr>
                            <th className="px-8 py-4 text-xs font-bold text-zinc-400 uppercase tracking-widest">User Details</th>
                            <th className="px-8 py-4 text-xs font-bold text-zinc-400 uppercase tracking-widest">Role</th>
                            <th className="px-8 py-4 text-xs font-bold text-zinc-400 uppercase tracking-widest">Status</th>
                            <th className="px-8 py-4 text-xs font-bold text-zinc-400 uppercase tracking-widest">Joined</th>
                            <th className="px-8 py-4 text-xs font-bold text-zinc-400 uppercase tracking-widest text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                        {users.map((u) => (
                            <tr key={u.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition">
                                <td className="px-8 py-6">
                                    <div className="flex items-center">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-zinc-200 to-zinc-300 dark:from-zinc-700 dark:to-zinc-800 flex items-center justify-center font-bold text-zinc-600 dark:text-zinc-400 mr-4">
                                            {u.email[0].toUpperCase()}
                                        </div>
                                        <div>
                                            <div className="font-semibold">{u.email}</div>
                                            <div className="text-xs text-zinc-500">ID: {u.id.substring(0, 8)}...</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-8 py-6">
                                    {u.is_admin ? (
                                        <span className="px-3 py-1 bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400 rounded-full text-xs font-bold">Admin</span>
                                    ) : (
                                        <span className="px-3 py-1 bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400 rounded-full text-xs font-bold">User</span>
                                    )}
                                </td>
                                <td className="px-8 py-6">
                                    {u.is_blocked ? (
                                        <span className="flex items-center text-red-600 text-sm font-semibold">
                                            <span className="w-2 h-2 bg-red-600 rounded-full mr-2"></span>
                                            Blocked
                                        </span>
                                    ) : (
                                        <span className="flex items-center text-emerald-600 text-sm font-semibold">
                                            <span className="w-2 h-2 bg-emerald-600 rounded-full mr-2"></span>
                                            Active
                                        </span>
                                    )}
                                </td>
                                <td className="px-8 py-6 text-sm text-zinc-500">
                                    {new Date(u.created_at).toLocaleDateString()}
                                </td>
                                <td className="px-8 py-6 text-right">
                                    <div className="flex items-center justify-end space-x-2">
                                        {user?.id !== u.id && (
                                            <>
                                                <button
                                                    onClick={() => toggleBlock(u.id, u.is_blocked)}
                                                    className={`px-4 py-2 rounded-xl text-xs font-bold transition ${u.is_blocked
                                                            ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                                                            : 'bg-red-50 text-red-600 hover:bg-red-100'
                                                        }`}
                                                >
                                                    {u.is_blocked ? 'UNBLOCK' : 'BLOCK'}
                                                </button>
                                                <button
                                                    onClick={() => deleteUser(u.id)}
                                                    className="p-2 text-zinc-400 hover:text-red-600 transition"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
