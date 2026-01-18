'use client';

import React from 'react';
import RoadmapGenerator from '@/components/roadmap-generator';
import GuidePanel from '@/components/guide-panel';
import { useAuth } from '@/contexts/auth-context';

export default function Home() {
  const { user } = useAuth();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <main className="min-h-screen bg-white dark:bg-zinc-950 selection:bg-blue-100 dark:selection:bg-blue-900/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex flex-col items-center">
        {/* Hero Section */}
        <div className="text-center mb-16 space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800 text-blue-600 dark:text-blue-400 text-xs font-bold tracking-widest uppercase mb-4 animate-in fade-in slide-in-from-bottom-2 duration-700">
            <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
            Powered by Advanced Reasoning AI
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight text-zinc-900 dark:text-zinc-100">
            Design Your <span className="text-blue-600 italic">Future</span>
          </h1>
          <p className="text-xl text-zinc-500 dark:text-zinc-400 font-medium">
            Generate industrial-grade learning roadmaps with interactive modules, quizzes, and capstone projects.
          </p>
        </div>

        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-8">
            <RoadmapGenerator />
          </div>
          <div className="lg:col-span-4 sticky top-8 space-y-8">
            <GuidePanel />
            {mounted && user?.is_admin && (
              <div className="p-8 bg-zinc-900 dark:bg-zinc-100 rounded-3xl text-white dark:text-zinc-900 shadow-xl overflow-hidden relative group" suppressHydrationWarning>
                <div className="relative z-10">
                  <h4 className="text-lg font-bold mb-2">Infinite Access</h4>
                  <p className="text-sm opacity-70 mb-6">As an admin tester, you have unlimited course generation credits. Explore any field from Quantum Computing to Haute Couture.</p>
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} className="w-8 h-8 rounded-full border-2 border-zinc-900 dark:border-zinc-100 bg-zinc-700 dark:bg-zinc-300 flex items-center justify-center text-[10px] font-bold">
                        {String.fromCharCode(64 + i)}
                      </div>
                    ))}
                    <div className="w-8 h-8 rounded-full border-2 border-zinc-900 dark:border-zinc-100 bg-blue-600 flex items-center justify-center text-[10px] font-bold text-white">
                      +1k
                    </div>
                  </div>
                </div>
                <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-blue-600/20 rounded-full blur-3xl group-hover:bg-blue-600/40 transition-colors"></div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
