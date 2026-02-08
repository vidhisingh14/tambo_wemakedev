"use client";

import { Roadmap } from "@/components/tambo/roadmap";

const mockRoadmapData = {
  title: "Software Engineer Interview Roadmap",
  description: "Your personalized path to landing your dream job",
  estimatedTime: "6 Months",
  currentFocusNodeId: "2",
  nodes: [
    {
      id: "root",
      title: "Interview Preparation",
      description: "Master DSA and System Design",
      status: "completed" as const,
      type: "root" as const
    },
    {
      id: "1",
      title: "Arrays & Strings",
      description: "Master fundamental data structures",
      status: "completed" as const,
      difficulty: "Easy" as const,
      type: "dsa" as const
    },
    {
      id: "2",
      title: "Dynamic Programming",
      description: "Solve optimization problems",
      status: "current" as const,
      difficulty: "Hard" as const,
      type: "dsa" as const
    },
    {
      id: "3",
      title: "Graph Algorithms",
      description: "BFS, DFS, and shortest paths",
      status: "locked" as const,
      difficulty: "Medium" as const,
      type: "dsa" as const
    },
    {
      id: "4",
      title: "Scalability Basics",
      description: "Load balancing, caching, CDNs",
      status: "locked" as const,
      difficulty: "Medium" as const,
      type: "system-design" as const
    },
    {
      id: "5",
      title: "Database Design",
      description: "SQL vs NoSQL, sharding",
      status: "locked" as const,
      difficulty: "Hard" as const,
      type: "system-design" as const
    }
  ],
  resources: [
    {
      title: "Dynamic Programming Patterns for Coding Interviews",
      type: "Video" as const,
      platform: "YouTube",
      url: "#",
      duration: "45 min",
      isRecommended: true,
      thumbnail: "https://picsum.photos/seed/dp1/400/300"
    },
    {
      title: "LeetCode DP Problem Set",
      type: "Problem" as const,
      platform: "LeetCode",
      url: "#",
      duration: "50 problems"
    },
    {
      title: "Introduction to Dynamic Programming",
      type: "Article" as const,
      platform: "GeeksforGeeks",
      url: "#"
    }
  ]
};

export default function RoadmapPage() {
  return (
    <div className="container mx-auto p-6">
      <Roadmap {...mockRoadmapData} />
    </div>
  );
}
