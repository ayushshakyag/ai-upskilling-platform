'use client';

import { useState } from 'react';
import { Roadmap, Stage, QuizItem } from '@/types/roadmap';

interface RoadmapDisplayProps {
    data: Roadmap;
}

export default function RoadmapDisplay({ data }: RoadmapDisplayProps) {
    const [selectedStageIndex, setSelectedStageIndex] = useState<number | null>(null);
    const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({});
    const [showResults, setShowResults] = useState<Record<string, boolean>>({});

    if (!data) return null;

    const selectedStage = selectedStageIndex !== null ? data.stages[selectedStageIndex] : null;

    const handleAnswerSelect = (quizIndex: number, option: string) => {
        setQuizAnswers(prev => ({
            ...prev,
            [`${selectedStageIndex}-${quizIndex}`]: option
        }));
    };

    const checkQuiz = (quizIndex: number) => {
        setShowResults(prev => ({
            ...prev,
            [`${selectedStageIndex}-${quizIndex}`]: true
        }));
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Timeline Sidebar (Left) */}
            <div className="lg:col-span-4 space-y-4">
                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm mb-6">
                    <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-1">
                        {data.roadmap_title}
                    </h2>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2">
                        {data.summary}
                    </p>
                </div>

                <div className="space-y-3">
                    <h3 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest px-2">Learning Path</h3>
                    {data.stages.map((stage, index) => (
                        <button
                            key={stage.stage_id || index}
                            onClick={() => setSelectedStageIndex(index)}
                            className={`w-full text-left p-4 rounded-2xl border transition-all duration-300 ${selectedStageIndex === index
                                ? 'bg-blue-600 border-blue-600 shadow-lg shadow-blue-200 dark:shadow-none translate-x-1'
                                : 'bg-white dark:bg-zinc-900 border-zinc-100 dark:border-zinc-800 hover:border-blue-400'
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${selectedStageIndex === index ? 'bg-white text-blue-600' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500'
                                    }`}>
                                    {index + 1}
                                </div>
                                <div className="truncate">
                                    <h4 className={`font-bold text-sm truncate ${selectedStageIndex === index ? 'text-white' : 'text-zinc-900 dark:text-zinc-100'}`}>
                                        {stage.title}
                                    </h4>
                                    <p className={`text-[10px] truncate ${selectedStageIndex === index ? 'text-blue-100' : 'text-zinc-500'}`}>
                                        {stage.learning_objectives.length} track items
                                    </p>
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Stage Content (Right) */}
            <div className="lg:col-span-8">
                {selectedStage ? (
                    <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-xl overflow-hidden min-h-[500px] flex flex-col">
                        <div className="p-8 border-b border-zinc-50 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/30">
                            <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold text-[10px] uppercase tracking-widest mb-2">
                                <span className="bg-blue-100 dark:bg-blue-900/40 px-2 py-0.5 rounded">Stage {(selectedStageIndex ?? 0) + 1}</span>
                                <span>•</span>
                                <span>Curriculum Module</span>
                            </div>
                            <h2 className="text-3xl font-black text-zinc-900 dark:text-zinc-100">{selectedStage.title}</h2>
                        </div>

                        <div className="flex-1 p-8 space-y-8 overflow-y-auto max-h-[70vh]">
                            <section>
                                <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-widest mb-4">Module Overview</h3>
                                <p className="text-zinc-600 dark:text-zinc-300 leading-relaxed text-lg italic font-serif">
                                    "{selectedStage.description}"
                                </p>
                            </section>

                            <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl p-6 border border-zinc-100 dark:border-zinc-800">
                                    <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                        <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        Learning Goals
                                    </h3>
                                    <ul className="space-y-3">
                                        {selectedStage.learning_objectives.map((obj, i) => (
                                            <li key={i} className="flex gap-2 text-sm text-zinc-700 dark:text-zinc-300">
                                                <span className="text-emerald-500 mt-1">•</span>
                                                {obj}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="bg-blue-50/50 dark:bg-blue-900/20 rounded-2xl p-6 border border-blue-100 dark:border-blue-800">
                                    <h3 className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                                        </svg>
                                        Capstone Project
                                    </h3>
                                    <p className="text-sm text-blue-800 dark:text-blue-200 font-medium">
                                        {selectedStage.project_idea}
                                    </p>
                                </div>
                            </section>

                            {selectedStage.resources && selectedStage.resources.length > 0 && (
                                <section>
                                    <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                        <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                        </svg>
                                        Official Resources
                                    </h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {selectedStage.resources.map((res, i) => (
                                            <a
                                                key={i}
                                                href={res.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center justify-between p-3 rounded-xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50 hover:bg-white dark:hover:bg-zinc-800 transition-all group"
                                            >
                                                <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 truncate mr-2">
                                                    {res.title}
                                                </span>
                                                <svg className="w-3 h-3 text-zinc-400 group-hover:text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                                </svg>
                                            </a>
                                        ))}
                                    </div>
                                </section>
                            )}

                            {selectedStage && selectedStage.quiz && selectedStage.quiz.length > 0 && (
                                <section className="pt-4">
                                    <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                                        <svg className="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        Knowledge Check
                                    </h3>
                                    <div className="space-y-6">
                                        {selectedStage.quiz.map((q, qIndex) => {
                                            const id = selectedStageIndex !== null ? `${selectedStageIndex}-${qIndex}` : qIndex.toString();
                                            const selected = quizAnswers[id];
                                            const isDone = showResults[id];
                                            const isCorrect = selected === q.correct_answer;

                                            return (
                                                <div key={qIndex} className="bg-purple-50/30 dark:bg-purple-900/10 rounded-2xl p-6 border border-purple-100 dark:border-purple-800/50">
                                                    <p className="font-bold text-zinc-900 dark:text-zinc-100 mb-4">{q.question}</p>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                                        {q.options.map((option, oIndex) => (
                                                            <button
                                                                key={oIndex}
                                                                disabled={isDone}
                                                                onClick={() => handleAnswerSelect(qIndex, option)}
                                                                className={`p-3 rounded-xl border text-sm text-left transition-all ${selected === option
                                                                    ? isDone
                                                                        ? isCorrect ? 'bg-emerald-100 border-emerald-500 text-emerald-700' : 'bg-red-100 border-red-500 text-red-700'
                                                                        : 'bg-purple-600 border-purple-600 text-white shadow-md'
                                                                    : isDone && option === q.correct_answer
                                                                        ? 'bg-emerald-50 border-emerald-200 text-emerald-600'
                                                                        : 'bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 hover:border-purple-300'
                                                                    }`}
                                                            >
                                                                {option}
                                                            </button>
                                                        ))}
                                                    </div>
                                                    {!isDone ? (
                                                        <button
                                                            disabled={!selected}
                                                            onClick={() => checkQuiz(qIndex)}
                                                            className="mt-4 px-6 py-2 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-xl text-xs font-bold disabled:opacity-30 transition"
                                                        >
                                                            CHECK ANSWER
                                                        </button>
                                                    ) : (
                                                        <div className={`mt-4 text-xs font-bold ${isCorrect ? 'text-emerald-600' : 'text-red-600'}`}>
                                                            {isCorrect ? '✓ Correct! Well done.' : `✗ Incorrect. The right answer is: ${q.correct_answer}`}
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </section>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="h-full min-h-[500px] flex flex-col items-center justify-center bg-zinc-50/50 dark:bg-zinc-900/30 rounded-3xl border-2 border-dashed border-zinc-200 dark:border-zinc-800 text-center p-12">
                        <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-6">
                            <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-black mb-2">Ready to Start?</h3>
                        <p className="text-zinc-500 max-w-sm">Select a module from the track on the left to begin your interactive learning journey.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
