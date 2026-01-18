'use client';

import { useState, useMemo } from 'react';
import { useCompletion } from 'ai/react';
import { Button } from '@/components/ui/button';
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
        body: {
            skill_level: skillLevel,
        },
        onError: (err) => {
            console.error("Completion Error:", err);
            alert("Error generating roadmap. Check console.");
        }
    });

    const roadmapData: Roadmap | null = useMemo(() => {
        if (!completion) return null;
        try {
            // cleaning: find the first '{' and the last '}'
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
        } catch (error) {
            console.error('Save error:', error);
            alert('Error saving roadmap');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-8">
            <div className="space-y-4">
                <h2 className="text-2xl font-bold">Generate Your Learning Path</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Career Goal</label>
                        <input
                            className="w-full p-2 border rounded-md dark:bg-zinc-800 dark:border-zinc-700"
                            value={input}
                            onChange={handleInputChange}
                            placeholder="e.g. Become a Senior AI Engineer..."
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Current Skill Level</label>
                        <select
                            className="w-full p-2 border rounded-md dark:bg-zinc-800 dark:border-zinc-700"
                            value={skillLevel}
                            onChange={(e) => setSkillLevel(e.target.value)}
                        >
                            <option value="beginner">Beginner</option>
                            <option value="intermediate">Intermediate</option>
                            <option value="advanced">Advanced</option>
                        </select>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
                    >
                        {isLoading ? 'Generating Roadmap...' : 'Create Roadmap'}
                    </button>
                </form>
            </div>

            {error && (
                <div className="p-4 border rounded-md bg-red-50 text-red-600 border-red-200">
                    <p>Error: {error.message}</p>
                </div>
            )}

            {roadmapData ? (
                <div className="space-y-6">
                    <div className="flex justify-end">
                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className={`flex items-center space-x-2 px-6 py-2 rounded-full font-bold transition ${saveSuccess
                                    ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                                    : 'bg-white border-2 border-blue-600 text-blue-600 hover:bg-blue-50'
                                }`}
                        >
                            {isSaving ? (
                                <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></span>
                            ) : saveSuccess ? (
                                <>
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span>Saved to Academy</span>
                                </>
                            ) : (
                                <>
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                                    </svg>
                                    <span>{user ? 'Save to My Academy' : 'Login to Save'}</span>
                                </>
                            )}
                        </button>
                    </div>
                    <RoadmapDisplay data={roadmapData} />
                </div>
            ) : completion && (
                <div className="space-y-4">
                    <div className="p-4 border rounded-md bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 animate-pulse">
                        <h3 className="font-semibold mb-2">Generating Implementation Plan...</h3>
                        <p className="text-zinc-500 text-sm">Processing AI response stream...</p>
                    </div>
                </div>
            )}

            {/* Debug Console - Visible as requested by user */}
            <div className="mt-8 p-4 bg-black rounded-xl border border-zinc-800 font-mono text-xs text-green-400 overflow-hidden">
                <div className="flex items-center justify-between mb-2 border-b border-zinc-800 pb-2">
                    <span className="font-bold">TERMINAL OUTPUT (DEBUG)</span>
                    <span className="text-zinc-500">{isLoading ? '● LIVE' : '○ IDLE'}</span>
                </div>
                <pre className="whitespace-pre-wrap break-all max-h-[200px] overflow-y-auto">
                    {completion || "> Waiting for signal..."}
                </pre>
            </div>
        </div>
    );
}

