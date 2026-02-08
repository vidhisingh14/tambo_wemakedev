import { z } from "zod";
import {
  LayoutDashboard,
  Map as MapIcon,
  Kanban,
  Video,
  ClipboardList,
  Settings,
  Search,
  Filter,
  Plus,
  MoreHorizontal,
  Calendar,
  CheckSquare,
  PartyPopper,
  XCircle,
  ChevronDown,
  Building2
} from "lucide-react";
import { cn } from "@/lib/utils";

const applicationSchema = z.object({
  id: z.string().describe("Unique identifier for the application"),
  company: z.string().describe("Company name"),
  role: z.string().describe("Job role"),
  location: z.string().optional().describe("Job location"),
  logo: z.string().optional().describe("URL to company logo"),
  tags: z.array(z.string()).describe("List of tech stack tags"),
  status: z.enum(["To Apply", "OA/Screening", "Interviewing", "Offer", "Rejected"]).describe("Current status of the application"),
  date: z.string().describe("Date added or due date (e.g., 'Added today', 'Due in 2d')"),
  checklist: z.object({
    completed: z.number(),
    total: z.number()
  }).optional().describe("Checklist progress"),
  score: z.number().optional().describe("Prep score or match percentage"),
  isRemote: z.boolean().optional().describe("Is the job remote?")
});

export const applicationTrackerSchema = z.object({
  applications: z.array(applicationSchema).describe("List of job applications to track")
});

export function ApplicationTracker({
  applications
}: z.infer<typeof applicationTrackerSchema>) {
  
  const columns = [
    { title: "To Apply", status: "To Apply", count: applications?.filter(a => a.status === "To Apply").length },
    { title: "OA/Screening", status: "OA/Screening", count: applications?.filter(a => a.status === "OA/Screening").length },
    { title: "Interviewing", status: "Interviewing", count: applications?.filter(a => a.status === "Interviewing").length },
    { title: "Offer", status: "Offer", count: applications?.filter(a => a.status === "Offer").length },
    { title: "Rejected", status: "Rejected", count: applications?.filter(a => a.status === "Rejected").length },
  ];

  return (
    <div className="h-[600px] w-full bg-background-light dark:bg-[#10231d] border border-border-dark rounded-xl overflow-hidden font-display text-slate-900 dark:text-white flex flex-col shadow-2xl">
      {/* Header */}
      <header className="h-16 border-b border-[#316856] bg-[#10231d] flex items-center justify-between px-6 shrink-0">
        <div className="flex flex-col">
          <h2 className="text-white text-lg font-bold tracking-tight">Application Tracker</h2>
          <p className="text-[#90cbb7] text-xs">Track your progress and manage your applications.</p>
        </div>
        <button className="bg-[#0df2a6] hover:bg-[#0bbd82] text-[#10231d] font-bold text-xs px-3 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-lg shadow-[#0df2a6]/20">
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">New Application</span>
        </button>
      </header>

      {/* Kanban Board */}
      <div className="flex-1 overflow-x-auto p-6 bg-[#10231d]">
        <div className="flex h-full gap-4 min-w-max pb-2">
           {columns.map((col) => (
               <div key={col.status} className={cn("flex flex-col w-72 bg-[#10231d] rounded-xl h-full border-l border-[#316856]/30 pl-2", 
                   col.status === "Rejected" && "opacity-60 hover:opacity-100 transition-opacity"
               )}>
                   <div className="flex items-center justify-between mb-3 px-2">
                       <div className="flex items-center gap-2">
                           <h3 className="text-white font-bold text-xs uppercase tracking-wider">{col.title}</h3>
                           <span className="bg-[#22493c] text-[#0df2a6] text-[10px] font-bold px-2 py-0.5 rounded-full border border-[#316856]">{col.count}</span>
                       </div>
                       <button className="text-[#90cbb7] hover:text-white transition-colors">
                           <MoreHorizontal className="w-4 h-4" />
                       </button>
                   </div>
                   
                   <div className="flex-1 overflow-y-auto pr-2 flex flex-col gap-3">
                       {applications?.filter(app => app.status === col.status).map((app) => (
                           <div key={app.id} className="group bg-[#18342b] hover:bg-[#22493c] border border-[#316856] rounded-lg p-4 cursor-grab active:cursor-grabbing shadow-sm transition-all hover:border-[#0df2a6]/50 relative overflow-hidden">
                               {/* Progress Bar for specific columns */}
                               {(col.status === "OA/Screening" || col.status === "Interviewing") && (
                                   <div className="absolute top-0 left-0 w-full h-1 bg-[#10231d]">
                                       <div className="h-full bg-[#0df2a6]" style={{ width: app.score ? `${app.score}%` : '50%' }}></div>
                                   </div>
                               )}
                               
                               <div className="flex justify-between items-start mb-2 mt-1">
                                   <div className="flex items-center gap-3">
                                       <div className="w-8 h-8 rounded bg-white flex items-center justify-center overflow-hidden border border-[#316856] p-1">
                                           {app.logo ? (
                                               <img src={app.logo} alt={app.company} className="w-full h-full object-contain" />
                                           ) : (
                                               <Building2 className="w-4 h-4 text-black" />
                                           )}
                                       </div>
                                       <h4 className="text-white font-bold text-sm">{app.company}</h4>
                                   </div>
                                   {col.status === "To Apply" && app.isRemote && (
                                       <span className="text-[10px] font-medium text-[#90cbb7] bg-[#10231d] px-2 py-1 rounded border border-[#316856]">Remote</span>
                                    )}
                                   {col.status === "OA/Screening" && (
                                        <span className="text-[10px] font-medium text-amber-400 bg-amber-400/10 px-2 py-1 rounded border border-amber-400/20">{app.date}</span>
                                   )}
                                   {col.status === "Interviewing" && (
                                        <span className="text-[10px] font-bold text-[#0df2a6] bg-[#0df2a6]/10 px-2 py-1 rounded border border-[#0df2a6]/20 animate-pulse">On-site</span>
                                   )}
                               </div>
                               
                               <p className="text-white text-sm font-medium mb-1">{app.role}</p>
                               
                               <div className="flex flex-wrap gap-2 mt-3 mb-3">
                                   {app.tags?.map((tag, i) => (
                                       <span key={i} className={cn("text-[10px] px-2 py-0.5 rounded font-medium", 
                                           i === 0 ? "text-[#0df2a6] bg-[#0df2a6]/10" : "text-[#90cbb7] bg-[#10231d] border border-[#316856]"
                                       )}>{tag}</span>
                                   ))}
                               </div>
                               
                               <div className="flex items-center justify-between border-t border-[#316856]/50 pt-3 mt-1">
                                   <div className="flex items-center gap-1.5">
                                       <Calendar className="w-3 h-3 text-[#90cbb7]" />
                                       <span className="text-xs text-[#90cbb7]">{app.date}</span>
                                   </div>
                                   
                                   {app.checklist && (
                                       <div className="flex items-center gap-1">
                                           <CheckSquare className="w-3 h-3 text-[#0df2a6]" />
                                           <span className="text-xs text-white font-medium">{app.checklist.completed}/{app.checklist.total}</span>
                                       </div>
                                   )}
                                   
                                   {app.score && (
                                       <div className="flex items-center gap-2">
                                           <div className="w-12 h-1 bg-[#10231d] rounded-full overflow-hidden">
                                               <div className="h-full bg-[#0df2a6]" style={{ width: `${app.score}%` }}></div>
                                           </div>
                                           <span className="text-xs text-[#0df2a6] font-bold">{app.score}%</span>
                                       </div>
                                   )}
                                   
                                   {col.status === "Rejected" && (
                                       <XCircle className="w-4 h-4 text-red-400" />
                                   )}
                               </div>
                           </div>
                       ))}
                       {applications?.filter(app => app.status === col.status).length === 0 && col.status === "Offer" && (
                           <div className="flex-1 border-2 border-dashed border-[#316856] rounded-lg flex flex-col items-center justify-center p-6 text-center h-32 bg-[#18342b]/20">
                               <div className="w-10 h-10 bg-[#22493c] rounded-full flex items-center justify-center mb-2 text-[#0df2a6]">
                                   <PartyPopper className="w-5 h-5" />
                               </div>
                               <h4 className="text-white font-semibold text-xs mb-1">No offers yet</h4>
                           </div>
                       )}
                   </div>
               </div>
           ))}
        </div>
      </div>
    </div>
  );
}
