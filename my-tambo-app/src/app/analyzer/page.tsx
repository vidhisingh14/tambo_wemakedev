"use client";

import { Analyzer } from "@/components/tambo/analyzer";

const mockAnalyzerData = {
  resumeName: "Alex_Chen_Resume.pdf",
  targetRole: "Senior Software Engineer",
  overallScore: 72,
  keywordsFound: 18,
  totalKeywords: 25,
  impactLevel: "Medium" as const,
  gapsCount: 3,
  criticalGaps: [
    {
      skill: "System Design Experience",
      description: "No mention of designing large-scale distributed systems or architecture decisions",
      suggestion: "Add a project where you designed a scalable system, mention specific architectural patterns used",
      priority: "High" as const
    },
    {
      skill: "Leadership & Mentoring",
      description: "Limited evidence of leading teams or mentoring junior developers",
      suggestion: "Quantify team size led, mention mentorship initiatives or code reviews conducted",
      priority: "High" as const
    },
    {
      skill: "Cloud Platform Expertise",
      description: "AWS/Azure/GCP certifications or hands-on experience not highlighted",
      suggestion: "Add cloud platform certifications, mention specific services used (EC2, Lambda, S3, etc.)",
      priority: "Medium" as const
    }
  ],
  suggestedEdits: [
    {
      type: "Quantify Achievement",
      original: "Improved application performance",
      improved: "Optimized application performance by 40% through caching strategies and database query optimization, reducing average page load time from 3.2s to 1.9s",
      impact: "High"
    },
    {
      type: "Add Technical Context",
      original: "Built a full-stack web application",
      improved: "Architected and developed a full-stack SaaS platform using React, Node.js, PostgreSQL, and Docker, serving 10,000+ active users with 99.9% uptime",
      impact: "High"
    },
    {
      type: "Action-Oriented Language",
      original: "Responsible for code reviews",
      improved: "Led weekly code reviews for a team of 5 engineers, establishing coding standards that reduced production bugs by 30%",
      impact: "Medium"
    }
  ]
};

export default function AnalyzerPage() {
  return (
    <div className="container mx-auto p-6">
      <Analyzer {...mockAnalyzerData} />
    </div>
  );
}
