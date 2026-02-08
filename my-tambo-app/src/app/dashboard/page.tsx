"use client";

import { Dashboard } from "@/components/tambo/dashboard";

const mockDashboardData = {
  user: {
    name: "Alex Chen",
    level: 12,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex"
  },
  interview: {
    company: "Google",
    role: "Software Engineer",
    type: "Onsite",
    date: "04 Days 12 Hours 30 Minutes 15 Seconds"
  },
  stats: {
    streak: 28,
    problemsSolved: 342,
    globalRank: 1547
  },
  skills: [
    { subject: "Algorithms", A: 120, fullMark: 150 },
    { subject: "Data Structures", A: 98, fullMark: 150 },
    { subject: "System Design", A: 86, fullMark: 150 },
    { subject: "Dynamic Programming", A: 110, fullMark: 150 },
    { subject: "Graphs", A: 85, fullMark: 150 },
    { subject: "Trees", A: 95, fullMark: 150 }
  ],
  currentFocus: {
    topic: "Graph Algorithms",
    progress: 65,
    module: "Dynamic Programming"
  },
  recentApplications: [
    {
      company: "Meta",
      role: "Frontend Engineer",
      status: "Interview" as const,
      statusColor: "text-purple-400"
    },
    {
      company: "Amazon",
      role: "SDE II",
      status: "OA Pending" as const,
      statusColor: "text-yellow-400"
    },
    {
      company: "Netflix",
      role: "Senior Engineer",
      status: "Applied" as const,
      statusColor: "text-green-400"
    }
  ]
};

export default function DashboardPage() {
  return (
    <div className="container mx-auto p-6">
      <Dashboard {...mockDashboardData} />
    </div>
  );
}
