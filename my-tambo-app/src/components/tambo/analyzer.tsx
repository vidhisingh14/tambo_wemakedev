import { z } from "zod";
import {
  FileText,
  UploadCloud,
  Maximize2,
  Edit3,
  AlertTriangle,
  Wand2,
  RefreshCcw,
  CheckCircle,
  XCircle,
  Lock,
  ChevronRight,
  ChevronDown
} from "lucide-react";
import { cn } from "@/lib/utils";

export const analyzerSchema = z.object({
  resumeName: z.string().describe("The name of the resume file being analyzed"),
  targetRole: z.string().describe("The target role for the resume"),
  overallScore: z.number().describe("The overall ATS score of the resume out of 100"),
  keywordsFound: z.number().describe("Number of key skills found in the resume"),
  totalKeywords: z.number().describe("Total number of key skills looked for"),
  impactLevel: z.enum(["Low", "Medium", "High"]).describe("The estimated impact of improving the resume"),
  gapsCount: z.number().describe("Number of critical gaps found"),
  criticalGaps: z.array(z.object({
    skill: z.string().describe("The missing skill"),
    description: z.string().describe("Description of why this skill is critical"),
    suggestion: z.string().optional().describe("Suggestion on how to add this skill"),
    priority: z.enum(["High", "Medium", "Low"]).describe("Priority of the gap")
  })).describe("List of critical skills missing from the resume"),
  suggestedEdits: z.array(z.object({
    type: z.string().describe("Type of edit, e.g., 'Quantify Achievement'"),
    original: z.string().describe("Original text in the resume"),
    improved: z.string().describe("Improved version of the text"),
    impact: z.string().optional().describe("Estimated impact of the change")
  })).describe("List of suggested edits to improve the resume")
});

export function Analyzer({
  resumeName,
  targetRole,
  overallScore,
  keywordsFound,
  totalKeywords,
  impactLevel,
  gapsCount,
  criticalGaps,
  suggestedEdits
}: z.infer<typeof analyzerSchema>) {
  
  return (
    <div className="flex flex-col lg:flex-row h-[800px] w-full bg-background-light dark:bg-[#10231d] border border-border-dark rounded-xl overflow-hidden font-display text-slate-900 dark:text-white shadow-2xl">
      {/* Left Panel: Resume Preview (Visual representation) */}
      <div className="flex-1 flex flex-col bg-white dark:bg-[#1e2329] border-r border-[#22493c] overflow-hidden min-w-[300px]">
        {/* Toolbar */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#22493c] bg-white dark:bg-[#10231d]">
          <div className="flex items-center gap-3">
            <div className="bg-red-500/10 text-red-500 p-2 rounded-lg">
              <FileText className="w-5 h-5" />
            </div>
            <div>
                       <h3 className="font-medium text-sm text-slate-900 dark:text-white truncate max-w-[150px]">{resumeName ?? "Resume.pdf"}</h3>
               <p className="text-slate-500 dark:text-[#90cbb7] text-xs">Last analyzed: Just now</p>
             </div>
           </div>
           <div className="flex gap-1">
             <button className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-[#22493c] text-slate-500 dark:text-[#90cbb7] transition-colors" title="Upload New">
               <UploadCloud className="w-4 h-4" />
             </button>
             <button className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-[#22493c] text-slate-500 dark:text-[#90cbb7] transition-colors" title="Full Screen">
               <Maximize2 className="w-4 h-4" />
             </button>
           </div>
         </div>
         
         {/* Resume Content Mockup */}
         <div className="flex-1 overflow-y-auto p-8 bg-slate-50 dark:bg-[#1e2329] relative">
            {/* We use a static mockup here since we don't have the actual PDF content, 
                but we can overlay the analysis highlights */}
           <div className="max-w-[800px] mx-auto bg-white min-h-[800px] shadow-lg p-10 text-slate-800 text-sm relative">
              {/* Simple Layout Mockup */}
              <div className="border-b border-slate-200 pb-6 mb-6">
                 <div className="h-8 w-1/2 bg-slate-200 rounded mb-2"></div>
                 <div className="h-4 w-1/3 bg-slate-100 rounded"></div>
              </div>
              
              <div className="mb-8">
                  <div className="h-5 w-1/4 bg-slate-200 rounded mb-4"></div>
                  <div className="space-y-4">
                     {[1, 2, 3].map((i) => (
                         <div key={i}>
                             <div className="flex justify-between mb-1">
                                 <div className="h-4 w-1/3 bg-slate-200 rounded"></div>
                                 <div className="h-4 w-20 bg-slate-100 rounded"></div>
                             </div>
                             <div className="h-3 w-1/4 bg-slate-100 rounded mb-2"></div>
                             <div className="space-y-1 ml-4">
                                 <div className="h-3 w-full bg-slate-100 rounded"></div>
                                 <div className="h-3 w-5/6 bg-slate-100 rounded"></div>
                             </div>
                         </div>
                     ))}
                  </div>
              </div>
 
              {/* Overlay Highlights (Mocking positions) */}
              <div className="absolute inset-0 pointer-events-none">
                 <div className="absolute top-[320px] left-[40px] right-[40px] h-[60px] bg-green-500/10 border-l-4 border-green-500 opacity-50"></div>
                 <div className="absolute top-[480px] left-[40px] right-[40px] h-[80px] bg-amber-500/10 border-l-4 border-amber-500 opacity-50"></div>
              </div>
           </div>
         </div>
       </div>
 
       {/* Right Panel: AI Analysis */}
       <div className="w-full lg:w-[450px] flex flex-col bg-white dark:bg-[#10231d] border-l border-[#22493c] overflow-hidden shrink-0">
          {/* Analysis Context Header */}
          <div className="p-6 border-b border-[#22493c] bg-slate-50 dark:bg-[#172f28]">
             <div className="flex justify-between items-start mb-4">
                 <div>
                     <p className="text-slate-500 dark:text-[#90cbb7] text-xs font-semibold uppercase tracking-wider mb-1">Target Role</p>
                     <div className="flex items-center gap-2 group cursor-pointer">
                         <h2 className="text-slate-900 dark:text-white text-lg font-bold">{targetRole ?? "Role"}</h2>
                         <Edit3 className="w-3 h-3 text-slate-400 dark:text-[#90cbb7]" />
                     </div>
                 </div>
                 <div className="flex flex-col items-end">
                     {/* Radial Progress Mockup */}
                     <div className="relative w-12 h-12 flex items-center justify-center rounded-full border-4 border-slate-200 dark:border-slate-700">
                         <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                             <circle cx="50" cy="50" r="46" fill="none" strokeWidth="8" stroke="currentColor" className="text-slate-200 dark:text-slate-700" />
                             <circle cx="50" cy="50" r="46" fill="none" strokeWidth="8" stroke="currentColor" className="text-[#0df2a6]" 
                                 strokeDasharray={`${(overallScore ?? 0) * 2.89} 289`} 
                                 strokeLinecap="round"
                             />
                         </svg>
                         <span className="text-slate-900 dark:text-white text-xs font-bold">{overallScore ?? 0}%</span>
                     </div>
                     <span className="text-[10px] text-slate-500 dark:text-[#90cbb7] mt-1">ATS Score</span>
                 </div>
             </div>
             
             <div className="grid grid-cols-3 gap-3">
                 <div className="bg-white dark:bg-[#10231d] rounded p-3 border border-slate-200 dark:border-[#22493c] text-center">
                     <p className="text-xl font-bold text-slate-900 dark:text-white">{keywordsFound ?? 0}</p>
                     <p className="text-[10px] text-slate-500 dark:text-[#90cbb7] uppercase">Keywords</p>
                 </div>
                 <div className="bg-white dark:bg-[#10231d] rounded p-3 border border-slate-200 dark:border-[#22493c] text-center">
                     <p className="text-xl font-bold text-amber-500">{gapsCount ?? 0}</p>
                     <p className="text-[10px] text-slate-500 dark:text-[#90cbb7] uppercase">Gaps</p>
                 </div>
                 <div className="bg-white dark:bg-[#10231d] rounded p-3 border border-slate-200 dark:border-[#22493c] text-center">
                     <p className={cn("text-xl font-bold", 
                         impactLevel === "High" ? "text-red-500" : 
                         impactLevel === "Medium" ? "text-amber-500" : "text-green-500"
                     )}>{impactLevel ?? "Low"}</p>
                     <p className="text-[10px] text-slate-500 dark:text-[#90cbb7] uppercase">Impact</p>
                 </div>
             </div>
         </div>

         {/* Analysis Feed */}
         <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Critical Gaps */}
            {criticalGaps && criticalGaps.length > 0 && (
                <div>
                   <h3 className="text-slate-900 dark:text-white font-semibold text-sm flex items-center gap-2 mb-3">
                      <AlertTriangle className="w-4 h-4 text-amber-500" />
                      Critical Experience Gaps
                   </h3>
                   <div className="space-y-3">
                      {criticalGaps?.map((gap, idx) => (
                          <div key={idx} className="bg-white dark:bg-[#1e3b32] border border-slate-200 dark:border-[#316856] rounded-lg p-4 relative overflow-hidden group hover:border-amber-500/50 transition-colors cursor-pointer shadow-sm">
                             <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-500"></div>
                             <div className="flex justify-between items-start mb-2">
                                <span className="font-mono text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 px-2 py-0.5 rounded border border-amber-200 dark:border-amber-900/50">Missing: {gap.skill}</span>
                                <span className="text-[10px] text-slate-500 dark:text-[#90cbb7]">{gap.priority} Priority</span>
                             </div>
                             <p className="text-slate-600 dark:text-gray-300 text-sm mb-3">{gap.description}</p>
                             {gap.suggestion && (
                                 <div className="bg-slate-50 dark:bg-[#10231d] p-3 rounded text-xs text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-[#22493c]">
                                     <strong className="text-primary block mb-1">Suggestion:</strong>
                                     {gap.suggestion}
                                 </div>
                             )}
                          </div>
                      ))}
                   </div>
                </div>
            )}

            {/* Suggested Edits */}
            {suggestedEdits && suggestedEdits.length > 0 && (
                <div>
                   <h3 className="text-slate-900 dark:text-white font-semibold text-sm flex items-center gap-2 mb-3">
                      <Wand2 className="w-4 h-4 text-primary" />
                      Suggested Edits
                   </h3>
                   <div className="space-y-3">
                      {suggestedEdits?.map((edit, idx) => (
                          <div key={idx} className="bg-white dark:bg-[#1e3b32] border border-slate-200 dark:border-[#316856] rounded-lg p-4 relative overflow-hidden group hover:border-primary/50 transition-colors cursor-pointer shadow-sm">
                              <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary"></div>
                              <div className="flex justify-between items-start mb-2">
                                  <span className="text-xs text-slate-900 dark:text-white font-medium">{edit.type}</span>
                                  {edit.impact && <span className="text-[10px] text-slate-500 dark:text-[#90cbb7]">{edit.impact} Impact</span>}
                              </div>
                              <div className="mb-2 text-sm text-slate-400 line-through decoration-red-400/50">{edit.original}</div>
                              <div className="bg-slate-50 dark:bg-[#10231d] p-3 rounded text-xs text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-[#22493c]">
                                  <strong className="text-primary block mb-1">Optimized Version:</strong>
                                  {edit.improved}
                              </div>
                              <div className="mt-3 flex gap-2">
                                  <button className="flex-1 bg-primary/10 hover:bg-primary/20 text-primary text-xs py-1.5 rounded transition-colors font-medium">Apply Edit</button>
                                  <button className="px-2 bg-transparent hover:bg-slate-100 dark:hover:bg-white/5 text-slate-400 rounded transition-colors">
                                      <RefreshCcw className="w-4 h-4" />
                                  </button>
                              </div>
                          </div>
                      ))}
                   </div>
                </div>
            )}
         </div>

         {/* Footer Action */}
         <div className="p-4 border-t border-[#22493c] bg-white dark:bg-[#10231d] flex flex-col gap-3">
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-[#90cbb7] justify-center">
               <Lock className="w-3 h-3" />
               Your data is encrypted and private.
            </div>
            <button className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-[#0bc286] text-[#10231d] font-bold py-3 px-4 rounded-lg transition-all shadow-lg hover:shadow-xl hover:shadow-primary/20">
               <Wand2 className="w-4 h-4" />
               Generate Optimized Version
            </button>
         </div>
      </div>
    </div>
  );
}
