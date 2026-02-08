import { z } from "zod";
import {
  LayoutDashboard,
  Timer,
  Flame,
  MoreHorizontal,
  Network,
  Play,
  ChevronRight,
  Bell,
  Search,
  Briefcase
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer
} from "recharts";

const skillSchema = z.object({
  subject: z.string(),
  A: z.number().describe("Current proficiency (0-150)"),
  fullMark: z.number().default(150),
});

const applicationSchema = z.object({
  company: z.string(),
  companyLogo: z.string().optional(),
  role: z.string(),
  status: z.enum(["Interview", "OA Pending", "Applied", "Rejected", "Offer"]),
  statusColor: z.string().optional().describe("Tailwind color class for status badge (e.g., text-purple-400)")
});

export const dashboardSchema = z.object({
  user: z.object({
    name: z.string(),
    level: z.number(),
    avatar: z.string().optional()
  }),
  interview: z.object({
    company: z.string(),
    role: z.string(),
    type: z.string().describe("e.g. Onsite, Remote"),
    date: z.string().describe("e.g. 04 Days 12 Hours...")
  }).optional(),
  stats: z.object({
    streak: z.number(),
    problemsSolved: z.number(),
    globalRank: z.number()
  }),
  skills: z.array(skillSchema).describe("Data for radar chart"),
  currentFocus: z.object({
    topic: z.string(),
    progress: z.number(),
    module: z.string().describe("e.g. Dynamic Programming")
  }),
  recentApplications: z.array(applicationSchema)
});

export function Dashboard({
  user,
  interview,
  stats,
  skills,
  currentFocus,
  recentApplications
}: z.infer<typeof dashboardSchema>) {
  
  return (
    <div className="w-full bg-background-light dark:bg-[#101413] border border-[#22493c]/50 rounded-xl overflow-hidden font-display text-slate-900 dark:text-white shadow-2xl">
        {/* Header (Simplified) */}
        <header className="flex items-center justify-between px-6 py-4 border-b border-[#22493c]/50 bg-[#101413]/95">
            <h2 className="text-xl font-bold text-white tracking-tight">Overview</h2>
            <div className="flex items-center gap-4">
                <div className="text-right hidden sm:block">
                    <p className="text-sm font-semibold text-white">{user?.name ?? "User"}</p>
                    <p className="text-xs text-[#0df2a6]">Level {user?.level ?? 1}</p>
                </div>
                <div className="w-10 h-10 rounded-full border-2 border-[#22493c] overflow-hidden bg-slate-800">
                    {user?.avatar && <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />}
                </div>
            </div>
        </header>

        <div className="p-6 space-y-6">
            {/* Top Section: Stats & Timer */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                 {/* Next Interview Timer */}
                 <div className="lg:col-span-2 bg-gradient-to-br from-[#1c2624] to-[#161e1c] border border-[#22493c]/50 rounded-xl p-6 relative overflow-hidden group">
                     {interview && (
                         <>
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <Timer className="w-24 h-24 text-[#0df2a6]" />
                            </div>
                            <div className="flex justify-between items-start mb-6 relative z-10">
                                <div>
                                    <h3 className="text-slate-400 text-sm font-medium uppercase tracking-wider mb-1">Upcoming Interview</h3>
                                    <div className="flex items-center gap-2">
                                        <span className="text-2xl font-bold text-white">{interview.company} - {interview.role}</span>
                                        <span className="bg-[#0df2a6]/20 text-[#0df2a6] text-xs px-2 py-0.5 rounded font-medium border border-[#0df2a6]/20">{interview.type}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="grid grid-cols-4 gap-4 relative z-10">
                                 {interview.date?.split(" ").filter((_, i) => i % 2 === 0).map((val, i) => (
                                     <div key={i} className="bg-[#101413]/50 rounded-lg p-3 text-center border border-[#22493c]/30">
                                         <span className="block text-2xl font-bold text-white font-mono">{val}</span>
                                         <span className="text-[10px] text-slate-500 uppercase font-medium">{interview.date?.split(" ")[i*2+1]}</span>
                                     </div>
                                 ))}
                            </div>
                         </>
                     )}
                     {!interview && (
                         <div className="flex items-center justify-center h-full text-slate-500">
                             No upcoming interviews scheduled.
                         </div>
                     )}
                 </div>

                 {/* Quick Stats / Streak */}
                 <div className="bg-[#1c2624] border border-[#22493c]/50 rounded-xl p-6 flex flex-col justify-between">
                     <div className="flex justify-between items-center mb-4">
                         <h3 className="text-white font-semibold">Daily Streak</h3>
                         <div className="flex items-center gap-1 text-orange-400">
                             <Flame className="w-5 h-5" />
                             <span className="font-bold">{stats?.streak ?? 0} Days</span>
                         </div>
                     </div>
                     {/* Heatmap Visual - Simplified */}
                    <div className="grid grid-cols-7 gap-1 mb-4 opacity-80">
                         {Array.from({length: 14}).map((_, i) => (
                             <div key={i} className={cn("aspect-square rounded-sm", 
                                 Math.random() > 0.5 ? "bg-[#0df2a6]" : "bg-[#22493c]/30"
                             )}></div>
                         ))}
                    </div>
                    <div className="flex justify-between items-end">
                        <div>
                            <p className="text-slate-400 text-xs">Problems Solved</p>
                            <p className="text-2xl font-bold text-white mt-1">{stats?.problemsSolved ?? 0}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-slate-400 text-xs">Global Rank</p>
                             <p className="text-2xl font-bold text-white mt-1">#{stats?.globalRank ?? 0}</p>
                        </div>
                    </div>
                 </div>
            </div>

            {/* Middle Section: Radar Chart & Current Focus */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Radar Chart */}
                <div className="lg:col-span-1 bg-[#1c2624] border border-[#22493c]/50 rounded-xl p-6 flex flex-col h-[300px]">
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="text-white font-semibold">Skill Proficiency</h3>
                        <MoreHorizontal className="w-4 h-4 text-slate-400" />
                    </div>
                    <div className="flex-1 -ml-6">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={skills}>
                                <PolarGrid stroke="#22493c" />
                                <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 10 }} />
                                <Radar
                                    name="Current"
                                    dataKey="A"
                                    stroke="#0df2a6"
                                    fill="#0df2a6"
                                    fillOpacity={0.3}
                                />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Current Focus & Applications */}
                <div className="lg:col-span-2 flex flex-col gap-6">
                     {/* Focus Card */}
                     <div className="bg-gradient-to-r from-[#1c2624] to-[#131a18] border border-[#22493c]/50 rounded-xl p-6 relative overflow-hidden">
                        <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-[#0df2a6]/5 to-transparent pointer-events-none"></div>
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400 border border-blue-500/20">
                                    <Network className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Current Focus</p>
                                    <h3 className="text-white text-xl font-bold mt-0.5">{currentFocus?.module ?? "Loading..."}</h3>
                                </div>
                            </div>
                            <span className="px-2.5 py-1 bg-[#22493c] text-[#0df2a6] text-xs font-medium rounded-full border border-[#0df2a6]/20">Medium</span>
                        </div>
                        <div className="flex items-center gap-4 mt-6">
                             <button className="bg-[#0df2a6] hover:bg-[#0bbd82] text-[#101413] font-bold py-2 px-4 rounded-lg transition-colors flex items-center gap-2 text-sm">
                                 <Play className="w-4 h-4" />
                                 Start Practice
                             </button>
                             <div className="flex-1 flex flex-col">
                                 <div className="flex justify-between text-xs mb-1">
                                     <span className="text-slate-400">Module Progress</span>
                                     <span className="text-white">{currentFocus?.progress ?? 0}%</span>
                                 </div>
                                 <div className="w-full h-1.5 bg-[#101413] rounded-full overflow-hidden">
                                     <div className="h-full bg-blue-500 rounded-full" style={{ width: `${currentFocus?.progress ?? 0}%` }}></div>
                                 </div>
                             </div>
                        </div>
                     </div>

                     {/* Recent Applications */}
                     <div className="flex-1 bg-[#1c2624] border border-[#22493c]/50 rounded-xl overflow-hidden flex flex-col">
                         <div className="p-4 border-b border-[#22493c]/30 flex justify-between items-center bg-[#18211f]">
                             <h3 className="text-white font-semibold text-sm">Recent Applications</h3>
                             <button className="text-xs text-[#0df2a6] hover:underline">View All</button>
                         </div>
                         <div className="overflow-x-auto">
                             <table className="w-full text-left text-sm text-slate-400">
                                 <thead className="bg-[#151b19]">
                                     <tr>
                                         <th className="px-4 py-3 font-medium">Company</th>
                                         <th className="px-4 py-3 font-medium">Role</th>
                                         <th className="px-4 py-3 font-medium">Status</th>
                                         <th className="px-4 py-3 font-medium text-right">Action</th>
                                     </tr>
                                 </thead>
                                 <tbody className="divide-y divide-[#22493c]/30">
                                     {recentApplications?.map((app, i) => (
                                         <tr key={i} className="hover:bg-[#22493c]/10 transition-colors">
                                             <td className="px-4 py-3 text-white font-medium">{app.company}</td>
                                             <td className="px-4 py-3 text-slate-300">{app.role}</td>
                                             <td className="px-4 py-3">
                                                 <span className={cn("inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border", 
                                                     app.status === "Interview" ? "bg-purple-500/10 text-purple-400 border-purple-500/20" :
                                                     app.status === "OA Pending" ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/20" :
                                                     app.status === "Applied" ? "bg-green-500/10 text-green-400 border-green-500/20" :
                                                     "bg-slate-500/10 text-slate-400 border-slate-500/20"
                                                 )}>{app.status}</span>
                                             </td>
                                             <td className="px-4 py-3 text-right">
                                                 <ChevronRight className="w-4 h-4 text-slate-400 inline-block" />
                                             </td>
                                         </tr>
                                     ))}
                                 </tbody>
                             </table>
                         </div>
                     </div>
                </div>
            </div>
        </div>
    </div>
  );
}
