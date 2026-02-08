import { z } from "zod";
import {
  Terminal,
  Timer,
  Power,
  Copy,
  Check,
  SkipForward,
  ArrowRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useRef } from "react";

// hljs removed due to build issues
// import hljs from 'highlight.js';
// import 'highlight.js/styles/dracula.css';

const optionSchema = z.object({
  id: z.string(),
  label: z.string(),
  text: z.string(),
  isCorrect: z.boolean().optional(), // In a real quiz, this might be hidden or used for immediate feedback
});

export const skillAssessmentSchema = z.object({
  questionNumber: z.number(),
  totalQuestions: z.number(),
  category: z.string(),
  question: z.string(),
  description: z.string().optional(),
  codeSnippet: z.object({
    language: z.enum(["python", "javascript"]),
    code: z.string(),
    fileName: z.string(),
  }).optional(),
  options: z.array(optionSchema),
  timeLeft: z.string().optional().describe("e.g. 14:32"),
  progress: z.number().describe("Percentage of progress"),
});

export function SkillAssessment({
  questionNumber,
  totalQuestions,
  category,
  question,
  description,
  codeSnippet,
  options,
  timeLeft,
  progress
}: z.infer<typeof skillAssessmentSchema>) {
  
  // const codeRef = useRef<HTMLElement>(null);
  
  // useEffect(() => {
  //   if (codeRef.current && codeSnippet) {
  //      codeRef.current.removeAttribute('data-highlighted');
  //      hljs.highlightElement(codeRef.current);
  //   }
  // }, [codeSnippet]);

  return (
    <div className="flex flex-col h-[700px] w-full bg-background-light dark:bg-[#101010] border border-gray-200 dark:border-white/10 rounded-xl overflow-hidden font-display text-slate-900 dark:text-white shadow-2xl">
      {/* Top Navigation & Progress */}
      <header className="flex-none bg-background-light dark:bg-[#101010] border-b border-gray-200 dark:border-white/10 relative">
          <div className="h-16 flex items-center justify-between px-6">
              <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-[#0df2a6] flex items-center justify-center text-[#101010]">
                      <Terminal className="w-5 h-5" />
                  </div>
                  <span className="text-lg font-bold tracking-tight hidden sm:block">Vidhianusaar</span>
              </div>
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-2 bg-[#1E1E1E]/50 dark:bg-[#1E1E1E] px-4 py-1.5 rounded-full border border-gray-200 dark:border-white/10">
                  <Timer className="w-4 h-4 text-[#0df2a6]" />
                  <span className="font-mono font-medium text-sm sm:text-lg">{timeLeft || "15:00"}</span>
              </div>
              <button className="flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-colors text-sm font-medium px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5">
                  <Power className="w-5 h-5" />
                  <span className="hidden sm:inline">Quit</span>
              </button>
          </div>
          <div className="w-full h-1 bg-slate-200 dark:bg-white/5">
              <div className="h-full bg-[#0df2a6] transition-all duration-500 ease-out" style={{ width: `${progress ?? 0}%` }}></div>
          </div>
      </header>
      
      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column */}
              <div className="lg:col-span-7 flex flex-col gap-6">
                  <div>
                      <div className="flex items-center gap-2 mb-2">
                          <span className="px-2.5 py-0.5 rounded-full bg-[#0df2a6]/10 text-[#0df2a6] text-xs font-bold uppercase tracking-wider border border-[#0df2a6]/20">Question {questionNumber} of {totalQuestions}</span>
                          <span className="px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 text-xs font-bold uppercase tracking-wider border border-blue-500/20">{category}</span>
                      </div>
                      <h2 className="text-xl sm:text-2xl font-bold leading-tight text-slate-900 dark:text-white">
                          {question}
                      </h2>
                      {description && <p className="mt-2 text-slate-500 dark:text-slate-400 text-sm">{description}</p>}
                  </div>
                  
                  {codeSnippet && (
                      <div className="relative group rounded-xl overflow-hidden border border-gray-200 dark:border-white/10 bg-[#282A36] shadow-xl">
                          <div className="flex items-center justify-between px-4 py-3 bg-white/5 border-b border-white/5">
                              <div className="flex gap-2">
                                  <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
                                  <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
                                  <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
                              </div>
                              <span className="text-xs text-slate-400 font-mono">{codeSnippet.fileName}</span>
                              <button className="text-slate-400 hover:text-white transition-colors">
                                  <Copy className="w-4 h-4" />
                              </button>
                          </div>
                          <div className="p-4 overflow-x-auto text-sm">
                              <pre><code className={`language-${codeSnippet.language}`}>{codeSnippet.code}</code></pre>
                          </div>
                      </div>
                  )}
              </div>
              
              {/* Right Column */}
              <div className="lg:col-span-5 flex flex-col h-full justify-center">
                  <div className="space-y-4">
                      <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">Select the correct output:</p>
                      {options.map((opt, i) => (
                           <button key={opt.id} className="group relative w-full flex items-center p-4 rounded-lg border-2 border-gray-200 dark:border-white/10 bg-white dark:bg-[#1E1E1E] hover:border-[#0df2a6] dark:hover:border-[#0df2a6] hover:bg-slate-50 dark:hover:bg-white/5 transition-all text-left focus:outline-none focus:ring-2 focus:ring-[#0df2a6] focus:ring-offset-2 dark:focus:ring-offset-[#101010]">
                               <span className="flex items-center justify-center w-8 h-8 rounded bg-slate-100 dark:bg-white/10 text-slate-500 dark:text-slate-300 font-mono text-sm font-bold group-hover:bg-[#0df2a6] group-hover:text-[#101010] transition-colors mr-4">
                                   {String.fromCharCode(65 + i)}
                               </span>
                               <span className="font-mono text-lg text-slate-800 dark:text-slate-200">{opt.text}</span>
                               <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 text-xs text-slate-400 font-mono border border-slate-600 rounded px-1.5 py-0.5 hidden lg:block">Key: {i + 1}</div>
                           </button>
                      ))}
                  </div>
              </div>
          </div>
      </div>
      
      {/* Footer */}
      <footer className="flex-none bg-background-light dark:bg-[#101010] border-t border-gray-200 dark:border-white/10 py-4 px-6">
           <div className="flex justify-between items-center max-w-7xl mx-auto w-full">
               <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-slate-600 dark:text-slate-300 font-semibold hover:bg-slate-200 dark:hover:bg-white/10 transition-colors text-sm">
                   <SkipForward className="w-4 h-4" />
                   Skip
               </button>
               <div className="flex items-center gap-4">
                   <span className="hidden sm:inline-block text-xs text-slate-400">Press <span className="font-mono bg-slate-200 dark:bg-white/10 px-1 rounded">Enter</span> to submit</span>
                   <button className="flex items-center gap-2 bg-[#0df2a6] hover:bg-[#0bc98b] text-[#101010] px-6 py-2.5 rounded-lg font-bold shadow-lg shadow-[#0df2a6]/20 hover:shadow-[#0df2a6]/40 transition-all transform active:scale-95 text-sm">
                       Submit Answer
                       <ArrowRight className="w-4 h-4" />
                   </button>
               </div>
           </div>
      </footer>
    </div>
  );
}
