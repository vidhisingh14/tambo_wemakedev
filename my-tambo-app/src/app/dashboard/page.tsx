"use client";

import { Dashboard } from "@/components/tambo/dashboard";
import { useUserData } from "@/hooks/use-user-data";
import { useAuth } from "@/components/auth-provider";

export default function DashboardPage() {
  const { user } = useAuth();
  const { profile, progress, skills, applications, interviews, loading, error } = useUserData();

  if (loading) {
    return (
      <div className="container mx-auto p-6 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0df2a6] mx-auto mb-4"></div>
          <p className="text-slate-400">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-red-400">
          Error loading dashboard: {error}
        </div>
      </div>
    );
  }

  // Get next interview
  const nextInterview = interviews[0];

  // Prepare dashboard data
  const dashboardData = {
    user: {
      name: profile?.full_name || user?.email || "User",
      level: profile?.level || 1,
      avatar: profile?.avatar_url || user?.user_metadata?.avatar_url
    },
    interview: nextInterview ? {
      company: nextInterview.company,
      role: nextInterview.role,
      type: nextInterview.type,
      date: new Date(nextInterview.scheduled_at).toLocaleDateString('en-US', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    } : undefined,
    stats: {
      streak: progress?.streak || 0,
      problemsSolved: progress?.problems_solved || 0,
      globalRank: progress?.global_rank || 0
    },
    skills: skills.length > 0 ? skills.map(skill => ({
      subject: skill.subject,
      A: skill.proficiency,
      fullMark: 150
    })) : [
      // Default skills if none exist
      { subject: "Algorithms", A: 0, fullMark: 150 },
      { subject: "Trees", A: 0, fullMark: 150 },
      { subject: "Data Structures", A: 0, fullMark: 150 },
      { subject: "Graphs", A: 0, fullMark: 150 },
      { subject: "System Design", A: 0, fullMark: 150 },
      { subject: "Dynamic Programming", A: 0, fullMark: 150 }
    ],
    currentFocus: {
      topic: profile?.current_focus_topic || "Getting Started",
      progress: profile?.current_focus_progress || 0,
      module: profile?.current_focus_module || "Introduction to Algorithms"
    },
    recentApplications: applications.slice(0, 3).map(app => ({
      company: app.company,
      role: app.role,
      status: app.status,
      logo: app.company_logo || `https://logo.clearbit.com/${app.company.toLowerCase().replace(/\s/g, '')}.com`
    }))
  };

  return (
    <div className="container mx-auto p-6">
      <Dashboard {...dashboardData} />
    </div>
  );
}
