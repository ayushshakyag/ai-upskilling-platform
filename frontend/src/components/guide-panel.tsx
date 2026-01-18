'use client';

export default function GuidePanel() {
    return (
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 border border-blue-100 dark:border-blue-800 rounded-3xl p-8 mb-8 shadow-sm">
            <h3 className="text-xl font-bold text-blue-900 dark:text-blue-100 mb-4 flex items-center gap-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" suppressHydrationWarning>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Master Prompting Guide
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                    <h4 className="font-bold text-blue-700 dark:text-blue-400 text-sm mb-2 uppercase tracking-tight">1. Be Specific</h4>
                    <p className="text-xs text-blue-800/70 dark:text-blue-200/60 leading-relaxed">
                        Instead of "Learn Coding", try "Advanced TypeScript for Backend Engineers using NestJS". Specificity helps the AI tailor the modules.
                    </p>
                </div>
                <div>
                    <h4 className="font-bold text-blue-700 dark:text-blue-400 text-sm mb-2 uppercase tracking-tight">2. Define Levels</h4>
                    <p className="text-xs text-blue-800/70 dark:text-blue-200/60 leading-relaxed">
                        Mention your current knowledge. "I know Python but want to learn PyTorch" ensures the roadmap starts at the right difficulty.
                    </p>
                </div>
                <div>
                    <h4 className="font-bold text-blue-700 dark:text-blue-400 text-sm mb-2 uppercase tracking-tight">3. Mention Goals</h4>
                    <p className="text-xs text-blue-800/70 dark:text-blue-200/60 leading-relaxed">
                        Add a goal like "to build a SaaS" or "to pass an interview". The AI will generate relevant capstone projects.
                    </p>
                </div>
            </div>

            <div className="mt-6 pt-6 border-t border-blue-200/50 dark:border-blue-800/50">
                <div className="flex items-center gap-4 text-xs font-medium text-blue-600 dark:text-blue-400">
                    <span className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                        Includes Quizzes
                    </span>
                    <span className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                        Project Base Learning
                    </span>
                    <span className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                        Step-by-step Modules
                    </span>
                </div>
            </div>
        </div>
    );
}
