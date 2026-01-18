import { Roadmap } from '@/types/roadmap';

interface RoadmapDisplayProps {
    data: Roadmap;
}

export default function RoadmapDisplay({ data }: RoadmapDisplayProps) {
    if (!data) return null;

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm">
                <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
                    {data.roadmap_title}
                </h2>
                <p className="text-zinc-600 dark:text-zinc-400">
                    {data.summary}
                </p>
            </div>

            {/* Timeline Stages */}
            <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
                {data.stages && Array.isArray(data.stages) && data.stages.map((stage, index) => (
                    <div key={stage.stage_id || index} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                        {/* Dot */}
                        <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-slate-300 group-[.is-active]:bg-blue-500 text-slate-500 group-[.is-active]:text-emerald-50 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                            <span className="font-bold text-sm text-white">{index + 1}</span>
                        </div>

                        {/* Card */}
                        <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white dark:bg-zinc-900 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
                            <div className="flex items-center justify-between space-x-2 mb-1">
                                <h3 className="font-bold text-zinc-900 dark:text-zinc-100">{stage.title}</h3>
                            </div>
                            <p className="text-zinc-500 dark:text-zinc-400 text-sm mb-4">
                                {stage.description}
                            </p>

                            <div className="space-y-3">
                                <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-lg p-3">
                                    <span className="text-xs font-semibold uppercase text-zinc-400 mb-2 block">Learning Objectives</span>
                                    <ul className="list-disc list-inside text-sm text-zinc-600 dark:text-zinc-300 space-y-1">
                                        {stage.learning_objectives.map((obj, i) => (
                                            <li key={i}>{obj}</li>
                                        ))}
                                    </ul>
                                </div>

                                {stage.project_idea && (
                                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 p-3 rounded-lg">
                                        <span className="text-xs font-semibold uppercase text-blue-600 dark:text-blue-400 mb-1 block">🏆 Capstone Project</span>
                                        <p className="text-sm text-blue-800 dark:text-blue-200">{stage.project_idea}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
