"use client";

import { ApplicationTracker } from "@/components/tambo/application-tracker";

const mockTrackerData = {
  applications: [
    {
      id: "1",
      company: "Google",
      companyLogo: "https://logo.clearbit.com/google.com",
      role: "Software Engineer",
      location: "Mountain View, CA",
      appliedDate: "2024-01-15",
      status: "Interview" as const,
      stage: "Technical Round 2",
      nextStep: "System Design Interview on Feb 20",
      notes: "Went well, hiring manager seemed interested"
    },
    {
      id: "2",
      company: "Meta",
      companyLogo: "https://logo.clearbit.com/meta.com",
      role: "Frontend Engineer",
      location: "Menlo Park, CA",
      appliedDate: "2024-01-10",
      status: "OA Pending" as const,
      stage: "Online Assessment",
      nextStep: "Complete coding assessment by Feb 18",
      notes: "Recruiter reached out, positive feedback"
    },
    {
      id: "3",
      company: "Amazon",
      companyLogo: "https://logo.clearbit.com/amazon.com",
      role: "SDE II",
      location: "Seattle, WA",
      appliedDate: "2024-01-08",
      status: "Applied" as const,
      stage: "Resume Review",
      nextStep: "Waiting for recruiter response",
      notes: "Applied through referral"
    }
  ],
  stats: {
    total: 15,
    pending: 8,
    interviews: 4,
    offers: 1,
    rejected: 2
  }
};

export default function TrackerPage() {
  return (
    <div className="container mx-auto p-6">
      <ApplicationTracker {...mockTrackerData} />
    </div>
  );
}
