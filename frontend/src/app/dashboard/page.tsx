'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import RoadmapDisplay from '@/components/roadmap-display';

interface Roadmap {
    id: string;
    title: string;
    user_goal: string;
    skill_level: string;
    roadmap_data: any;
    created_at: string;
}

export default function DashboardPage() {
    const { user, token, isLoading: authLoading } = useAuth();
    const [roadmaps, setRoadmaps] = useState<Roadmap[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedRoadmap, setSelectedRoadmap] = useState<Roadmap | null>(null);
    const router = useRouter();

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login');
        }
    }, [user, authLoading, router]);

    useEffect(() => {
        if (token) {
            fetchRoadmaps();
        }
    }, [token]);

    const fetchRoadmaps = async () => {
        try {
            const response = await fetch('http://localhost:8000/api/roadmap/list', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                setRoadmaps(data);
            }
        } catch (error) {
            console.error('Failed to fetch roadmaps:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const deleteRoadmap = async (id: string) => {
        if (!confirm('Are you sure you want to delete this roadmap?')) return;

        try {
            const response = await fetch(`http://localhost:8000/api/roadmap/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                setRoadmaps(roadmaps.filter(r => r.id !== id));
                if (selectedRoadmap?.id === id) setSelectedRoadmap(null);
            }
        } catch (error) {
            console.error('Failed to delete roadmap:', error);
        }
    };

    if (authLoading || isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold">My Personal Academy</h1>
                    <p className="text-zinc-500 mt-1">Manage all your personalized AI learning journeys</p>
                </div>
                <Link
                    href="/"
                    className="bg-blue-600 text-white px-6 py-2 rounded-xl font-semibold hover:bg-blue-700 transition"
                >
                    Create New Roadmap
                </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Sidebar List */}
                <div className="lg:col-span-1 space-y-4">
                    <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-2">Saved Roadmaps</h2>
                    {roadmaps.length === 0 ? (
                        <div className="p-6 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl text-center">
                            <p className="text-sm text-zinc-500">No roadmaps saved yet.</p>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {roadmaps.map((roadmap) => (
                                <div
                                    key={roadmap.id}
                                    className={`group relative p-4 rounded-xl border transition cursor-pointer ${selectedRoadmap?.id === roadmap.id
                                            ? 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800 shadow-sm'
                                            : 'bg-white border-zinc-200 dark:bg-zinc-900 dark:border-zinc-800 hover:border-blue-400'
                                        }`}
                                    onClick={() => setSelectedRoadmap(roadmap)}
                                >
                                    <h3 className="font-semibold text-sm truncate pr-6">{roadmap.title}</h3>
                                    <p className="text-xs text-zinc-500 mt-1 line-clamp-1">{roadmap.user_goal}</p>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            deleteRoadmap(roadmap.id);
                                        }}
                                        className="absolute top-2 right-2 p-1 text-zinc-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Detail View */}
                <div className="lg:col-span-3">
                    {selectedRoadmap ? (
                        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-1">
                            <RoadmapDisplay data={selectedRoadmap.roadmap_data} />
                        </div>
                    ) : (
                        <div className="h-full min-h-[400px] flex flex-col items-center justify-center border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl bg-zinc-50/50 dark:bg-zinc-900/20 text-center p-10">
                            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-4">
                                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold">Select a Roadmap</h3>
                            <p className="text-zinc-500 max-w-sm mt-2">Pick a learning journey from the list on the left to view your progress and details.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
