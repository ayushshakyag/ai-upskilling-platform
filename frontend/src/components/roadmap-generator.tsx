'use client';

import React, { useState, useMemo } from 'react';
import { useCompletion } from 'ai/react';
import RoadmapDisplay from './roadmap-display';
import { Roadmap } from '@/types/roadmap';
import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';

export default function RoadmapGenerator() {
    const [skillLevel, setSkillLevel] = useState('beginner');
    const [isSaving, setIsSaving] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);
    const { user, token } = useAuth();
    const router = useRouter();

    const { completion, input, handleInputChange, handleSubmit, isLoading, error } = useCompletion({
        api: 'http://localhost:8000/api/roadmap/generate',
        headers: {
            'Authorization': `Bearer ${token}`
        },
        body: {
            skill_level: skillLevel,
        },
        onError: (err) => {
            console.error("Completion Error:", err);
            // Error handling is handled in the UI via the 'error' object from useCompletion
        }
    });

    const roadmapData: Roadmap | null = useMemo(() => {
        if (!completion) return null;
        try {
            const start = completion.indexOf('{');
            const end = completion.lastIndexOf('}');

            if (start === -1 || end === -1) return null;

            const jsonStr = completion.substring(start, end + 1);
            return JSON.parse(jsonStr) as Roadmap;
        } catch (e) {
            return null;
        }
    }, [completion]);

    const handleSave = async () => {
        if (!user) {
            router.push('/login');
            return;
        }

        if (!roadmapData) return;

        setIsSaving(true);
        try {
            const response = await fetch('http://localhost:8000/api/roadmap/save', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    title: roadmapData.roadmap_title,
                    user_goal: input,
                    skill_level: skillLevel,
                    roadmap_data: roadmapData
                })
            });

            if (response.ok) {
                setSaveSuccess(true);
                setTimeout(() => setSaveSuccess(false), 3000);
            } else {
                alert('Failed to save roadmap');
            }
        } catch (err) {
            console.error('Save error:', err);
            alert('Error saving roadmap');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-xl overflow-hidden">
            <div className="p-8 border-b border-zinc-100 dark:border-zinc-800">
                <h2 className="text-2xl font-bold mb-6">Create New Journey</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest px-1">Goal / Topic</label>
                            <input
                                className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                                value={input}
                                onChange={handleInputChange}
                                placeholder="e.g. Mastering React Suspense"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest px-1">Expertise Level</label>
                            <select
                                className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                                value={skillLevel}
                                onChange={(e) => setSkillLevel(e.target.value)}
                            >
                                <option value="beginner">Beginner</option>
                                <option value="intermediate">Intermediate</option>
                                <option value="advanced">Advanced</option>
                            </select>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="group w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-bold shadow-lg shadow-blue-200 dark:shadow-none transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {isLoading ? (
                            <>
                                <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                                AI IS ARCHITECTING...
                            </>
                        ) : (
                            <>
                                GENERATE MODULES
                                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" suppressHydrationWarning>
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                            </>
                        )}
                    </button>
                </form>
            </div>

            <div className="p-8 bg-zinc-50/50 dark:bg-zinc-900/50">
                {error && (
                    <div className="p-4 border rounded-2xl bg-red-50 text-red-600 border-red-100 flex items-center gap-3 animate-in fade-in duration-300">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        <p className="text-sm font-semibold">{error.message || 'Generation failed. Please check credits.'}</p>
                    </div>
                )}

                {roadmapData ? (
                    <div className="space-y-8">
                        <div className="flex justify-between items-center bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-zinc-100 dark:border-zinc-800">
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Architected & Ready</span>
                            </div>
                            <button
                                onClick={handleSave}
                                disabled={isSaving}
                                className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-bold text-xs transition-all ${saveSuccess
                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                    : 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900'
                                    }`}
                            >
                                {isSaving ? (
                                    <span className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></span>
                                ) : saveSuccess ? (
                                    <>
                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span>SAVED</span>
                                    </>
                                ) : (
                                    <span>{user ? 'SAVE TO ACADEMY' : 'LOGIN TO SAVE'}</span>
                                )}
                            </button>
                        </div>
                        <RoadmapDisplay data={roadmapData} />
                    </div>
                ) : completion && (
                    <div className="space-y-4">
                        <div className="p-8 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-3xl flex flex-col items-center justify-center text-center">
                            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-4">
                                <span className={`rounded-full h-6 w-6 border-b-2 border-blue-600 ${isLoading ? 'animate-spin' : ''}`}></span>
                            </div>
                            <h3 className="text-lg font-bold mb-1">
                                {isLoading ? 'AI is Architecting...' : 'Generation Interrupted'}
                            </h3>
                            <p className="text-xs text-zinc-500 max-w-[250px]">
                                {completion.includes('[DEBUG] Exception')
                                    ? 'An error occurred during generation. See debug logs below.'
                                    : 'A custom curriculum is being constructed based on your goals.'}
                            </p>
                        </div>

                        {/* Stream Output */}
                        <div className="p-6 bg-zinc-950 rounded-2xl border border-zinc-800 font-mono text-[11px] overflow-hidden">
                            <div className="flex items-center justify-between mb-4 border-b border-zinc-800/50 pb-3">
                                <span className="font-bold text-zinc-400 flex items-center gap-2">
                                    <span className={`w-1.5 h-1.5 rounded-full ${isLoading ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`}></span>
                                    LIVE REASONING ENGINE
                                </span>
                                <span className="text-[9px] text-zinc-600 tracking-widest uppercase">Protocol: SSE-STREAM</span>
                            </div>
                            <pre className="whitespace-pre-wrap break-all max-h-[200px] overflow-y-auto text-zinc-300 custom-scrollbar">
                                {completion}
                            </pre>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
