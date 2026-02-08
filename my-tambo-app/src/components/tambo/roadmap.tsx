import { z } from "zod";
import {
  GraduationCap,
  Search,
  Bell,
  User,
  Clock,
  Database,
  Code,
  Check,
  PlayCircle,
  Lock,
  Combine,
  MonitorPlay,
  FileText,
  ExternalLink,
  ChevronRight,
  Play
} from "lucide-react";
import { cn } from "@/lib/utils";

const roadmapNodeSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  status: z.enum(["completed", "in-progress", "locked", "current"]).describe("Status of the node"),
  difficulty: z.enum(["Easy", "Medium", "Hard"]).optional(),
  type: z.enum(["dsa", "system-design", "root"]).optional(),
  progress: z.number().optional().describe("Progress percentage for categories"),
});

const resourceSchema = z.object({
  title: z.string(),
  type: z.enum(["Video", "Article", "Problem"]),
  platform: z.string(),
  url: z.string().optional(),
  duration: z.string().optional(),
  isRecommended: z.boolean().optional(),
  thumbnail: z.string().optional()
});

export const roadmapSchema = z.object({
  title: z.string(),
  description: z.string(),
  estimatedTime: z.string(),
  currentFocusNodeId: z.string().describe("ID of the node currently in focus"),
  nodes: z.array(roadmapNodeSchema).describe("List of roadmap nodes in a flat list (for simplicity in this demo)"),
  resources: z.array(resourceSchema).describe("Resources for the current focus topic")
});

export function Roadmap({
  title,
  description,
  estimatedTime,
  currentFocusNodeId,
  nodes,
  resources
}: z.infer<typeof roadmapSchema>) {
  
  // Helper to find node by ID or type
  const rootNode = nodes?.find(n => n.type === 'root') || nodes?.[0];
  const dsaNodes = nodes?.filter(n => n.type === 'dsa') || [];
  const systemDesignNodes = nodes?.filter(n => n.type === 'system-design') || [];

  return (
    <div className="flex flex-col xl:flex-row h-[800px] w-full bg-background-light dark:bg-[#0d1f19] border border-[#22493c] rounded-xl overflow-hidden font-display text-slate-900 dark:text-white shadow-2xl">
      {/* Main Roadmap Area */}
      <div className="flex-1 flex flex-col relative overflow-hidden bg-[#0d1f19]">
          {/* Header */}
          <div className="flex-none px-6 py-4 border-b border-[#22493c] bg-[#10231d]/95 backdrop-blur z-40">
              <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
                  <div>
                      <div className="flex items-center gap-2 text-[#90cbb7] text-xs mb-1">
                          <span>Home</span>
                          <span>/</span>
                          <span className="text-white">{title}</span>
                      </div>
                      <h1 className="text-2xl font-bold text-white leading-tight">{title}</h1>
                      <p className="text-[#90cbb7] text-xs mt-1 max-w-md truncate">{description}</p>
                  </div>
                  <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-[#162e26] border border-[#22493c] rounded-lg">
                          <div className="bg-[#0df2a6]/20 p-1 rounded text-[#0df2a6]">
                              <Clock className="w-4 h-4" />
                          </div>
                          <div>
                              <div className="text-[10px] uppercase tracking-wider text-[#90cbb7] font-bold">Est. Time</div>
                              <div className="text-white text-xs font-bold leading-none">{estimatedTime}</div>
                          </div>
                      </div>
                  </div>
              </div>
          </div>

          {/* Canvas */}
          <div className="flex-1 overflow-auto p-8 relative custom-scrollbar">
              <div className="max-w-3xl mx-auto min-h-[600px] flex flex-col items-center pb-20">
                  {/* Root Node */}
                  {rootNode && (
                      <div className="relative z-10 w-64 bg-[#162e26] border-2 border-[#0df2a6] rounded-xl p-4 text-center shadow-[0_0_20px_rgba(13,242,166,0.1)] mb-12 group cursor-pointer hover:scale-105 transition-transform duration-300">
                          {rootNode.status === 'current' && (
                              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-[#0df2a6] text-[#10231d] text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap">
                                  CURRENT FOCUS
                              </div>
                          )}
                          <div className="w-10 h-10 bg-[#0df2a6]/20 text-[#0df2a6] rounded-full flex items-center justify-center mx-auto mb-3">
                              <Database className="w-5 h-5" />
                          </div>
                          <h3 className="text-white font-bold text-lg">{rootNode.title}</h3>
                          <p className="text-[#90cbb7] text-xs mt-1">{rootNode.description}</p>
                          <div className="absolute top-full left-1/2 -translate-x-1/2 w-0.5 h-8 bg-[#0df2a6]/30"></div>
                      </div>
                  )}

                  {/* Branching */}
                  <div className="w-full flex justify-center gap-8 relative">
                      {/* Connectors */}
                       <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[50%] h-[2px] bg-[#22493c] -translate-y-[16px]"></div>
                       <div className="absolute top-[-16px] left-[25%] h-[16px] w-[2px] bg-[#22493c]"></div>
                       <div className="absolute top-[-16px] right-[25%] h-[16px] w-[2px] bg-[#22493c]"></div>

                      {/* Left Branch */}
                      <div className="flex flex-col items-center w-72">
                           <div className="relative z-10 w-full bg-[#162e26] border border-[#22493c] rounded-lg p-3 mb-8 flex items-center gap-3">
                               <div className="w-8 h-8 bg-blue-500/20 text-blue-400 rounded-lg flex items-center justify-center">
                                   <Code className="w-4 h-4" />
                               </div>
                               <div className="flex-1">
                                   <h4 className="text-white font-semibold text-sm">DSA</h4>
                                   <div className="w-full bg-gray-700 h-1 mt-1 rounded-full overflow-hidden">
                                       <div className="bg-blue-500 h-full" style={{width: '60%'}}></div>
                                   </div>
                               </div>
                               <div className="absolute top-full left-1/2 -translate-x-1/2 w-0.5 h-8 bg-[#22493c]"></div>
                           </div>
                           {/* DSA Nodes */}
                           {dsaNodes?.map((node, i) => (
                               <div key={i} className={cn("relative z-10 w-full rounded-lg p-4 mb-6 transition-all group",
                                   node.status === 'locked' ? "bg-[#162e26]/30 border border-[#22493c] opacity-75 cursor-not-allowed" :
                                   node.status === 'current' ? "bg-[#162e26] border-l-4 border-l-[#0df2a6] border-y border-r border-[#22493c] shadow-lg scale-105" :
                                   "bg-[#162e26]/50 border border-[#0df2a6]/30 hover:border-[#0df2a6] cursor-pointer"
                               )}>
                                   <div className="flex justify-between items-start mb-2">
                                       {node.difficulty && (
                                           <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded uppercase",
                                               node.difficulty === 'Easy' ? "bg-[#0df2a6]/20 text-[#0df2a6]" :
                                               node.difficulty === 'Medium' ? "bg-yellow-500/20 text-yellow-400" :
                                               "bg-red-500/20 text-red-400"
                                           )}>{node.difficulty}</span>
                                       )}
                                       {node.status === 'completed' && <div className="bg-[#0df2a6] text-[#10231d] rounded-full p-0.5"><Check className="w-3 h-3" /></div>}
                                       {node.status === 'current' && <div className="bg-yellow-500/20 text-yellow-400 rounded-full p-0.5 animate-pulse"><PlayCircle className="w-3 h-3" /></div>}
                                       {node.status === 'locked' && <div className="text-[#90cbb7]"><Lock className="w-3 h-3" /></div>}
                                   </div>
                                   <h5 className={cn("font-bold text-sm", node.status === 'current' ? "text-white" : "text-white group-hover:text-[#0df2a6]")}>{node.title}</h5>
                                   <p className="text-[#90cbb7] text-xs mt-1">{node.description}</p>
                                   { i < dsaNodes.length - 1 && <div className="absolute top-full left-1/2 -translate-x-1/2 w-0.5 h-6 bg-[#22493c]"></div> }
                               </div>
                           ))}
                      </div>

                      {/* Right Branch */}
                      <div className="flex flex-col items-center w-72">
                            <div className="relative z-10 w-full bg-[#162e26] border border-[#22493c] rounded-lg p-3 mb-8 flex items-center gap-3">
                               <div className="w-8 h-8 bg-purple-500/20 text-purple-400 rounded-lg flex items-center justify-center">
                                   <Combine className="w-4 h-4" />
                               </div>
                               <div className="flex-1">
                                   <h4 className="text-white font-semibold text-sm">System Design</h4>
                                   <div className="w-full bg-gray-700 h-1 mt-1 rounded-full overflow-hidden">
                                       <div className="bg-purple-500 h-full" style={{width: '20%'}}></div>
                                   </div>
                               </div>
                               <div className="absolute top-full left-1/2 -translate-x-1/2 w-0.5 h-8 bg-[#22493c]"></div>
                           </div>
                           {/* System Design Nodes */}
                           {systemDesignNodes?.map((node, i) => (
                               <div key={i} className={cn("relative z-10 w-full rounded-lg p-4 mb-6 transition-all group",
                                   node.status === 'locked' ? "bg-[#162e26]/30 border border-[#22493c] opacity-75 cursor-not-allowed" :
                                   "bg-[#162e26]/50 border border-[#22493c]"
                               )}>
                                   <div className="flex justify-between items-start mb-2">
                                       {node.difficulty && (
                                           <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded uppercase",
                                               node.difficulty === 'Easy' ? "bg-[#0df2a6]/20 text-[#0df2a6]" :
                                               node.difficulty === 'Medium' ? "bg-yellow-500/20 text-yellow-400" :
                                               "bg-red-500/20 text-red-400"
                                           )}>{node.difficulty}</span>
                                       )}
                                       {node.status === 'locked' && <div className="text-[#90cbb7]"><Lock className="w-3 h-3" /></div>}
                                   </div>
                                   <h5 className="text-[#90cbb7] font-semibold text-sm">{node.title}</h5>
                                   <p className="text-[#90cbb7] text-xs mt-1">{node.description}</p>
                                   { i < systemDesignNodes.length - 1 && <div className="absolute top-full left-1/2 -translate-x-1/2 w-0.5 h-6 bg-[#22493c]"></div> }
                               </div>
                           ))}
                      </div>
                  </div>
              </div>
          </div>
      </div>

      {/* Right Panel: Resources */}
      <aside className="w-full xl:w-80 flex-none bg-[#10231d] border-l border-[#22493c] flex flex-col z-40">
          <div className="p-6 border-b border-[#22493c]">
              <div className="flex items-center gap-2 mb-4">
                  <span className="px-2 py-1 bg-yellow-500/10 text-yellow-400 text-[10px] font-bold rounded uppercase tracking-wider">In Progress</span>
              </div>
              <h2 className="text-xl font-bold text-white mb-2">Current Topic</h2>
              <p className="text-[#90cbb7] text-xs leading-relaxed">
                  Recommended resources to master this topic based on your learning style.
              </p>
          </div>
          
          <div className="flex-1 overflow-y-auto p-6 custom-scrollbar space-y-6">
              {resources?.map((res, i) => (
                  <div key={i}>
                      <div className="flex items-center justify-between mb-2">
                          <h3 className="text-white font-semibold text-xs flex items-center gap-2">
                              {res.type === 'Video' && <MonitorPlay className="w-4 h-4 text-red-500" />}
                              {res.type === 'Article' && <FileText className="w-4 h-4 text-blue-400" />}
                              {res.type === 'Problem' && <Code className="w-4 h-4 text-yellow-500" />}
                              {res.type}
                          </h3>
                      </div>
                      <a href={res.url || "#"} className="block p-3 bg-[#162e26] hover:bg-[#162e26]/80 rounded-lg border border-[#22493c] transition-all group">
                          {res.thumbnail && (
                              <div className="relative w-full h-24 bg-gray-800 rounded overflow-hidden mb-3">
                                  <img src={res.thumbnail} alt="" className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity" />
                                  <div className="absolute inset-0 flex items-center justify-center">
                                      <PlayCircle className="w-8 h-8 text-white drop-shadow-lg" />
                                  </div>
                              </div>
                          )}
                          <div className="flex items-start justify-between">
                              <div>
                                  <h4 className="text-white text-sm font-medium group-hover:text-[#0df2a6] transition-colors line-clamp-2">{res.title}</h4>
                                  <p className="text-[#90cbb7] text-xs mt-1">{res.platform} • {res.duration || "Read"}</p>
                              </div>
                              {!res.thumbnail && <ExternalLink className="w-3 h-3 text-[#90cbb7] transform group-hover:translate-x-1 transition-transform" />}
                          </div>
                      </a>
                  </div>
              ))}
          </div>
          
          <div className="p-4 border-t border-[#22493c] bg-[#10231d]">
               <button className="w-full bg-[#0df2a6] hover:bg-[#0df2a6]/90 text-[#10231d] font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#0df2a6]/20">
                    <Play className="w-4 h-4" />
                    Start Practice Session
               </button>
          </div>
      </aside>
    </div>
  );
}
