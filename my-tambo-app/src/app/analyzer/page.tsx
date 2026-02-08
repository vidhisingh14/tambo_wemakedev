"use client";

import { Analyzer } from "@/components/tambo/analyzer";
import { useState } from "react";
import { Upload, Sparkles } from "lucide-react";

export default function AnalyzerPage() {
  const [resumeText, setResumeText] = useState("");
  const [targetRole, setTargetRole] = useState("Software Engineer");
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!resumeText.trim()) {
      setError("Please paste your resume text");
      return;
    }

    setAnalyzing(true);
    setError(null);

    try {
      const response = await fetch('/api/analyze-resume', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          resumeText,
          targetRole
        }),
      });

      if (!response.ok) {
        throw new Error('Analysis failed');
      }

      const result = await response.json();
      setAnalysis(result);
    } catch (err: any) {
      console.error('Analysis error:', err);
      setError('Failed to analyze resume. Please try again.');
    } finally {
      setAnalyzing(false);
    }
  };

  // If we have analysis, show the Analyzer component
  if (analysis) {
    const analyzerData = {
      resumeName: "Your Resume",
      targetRole,
      overallScore: analysis.overallScore || 0,
      keywordsFound: analysis.keywordsFound || 0,
      totalKeywords: analysis.totalKeywords || 0,
      impactLevel: analysis.impactLevel || "Medium",
      gapsCount: analysis.criticalGaps?.length || 0,
      criticalGaps: analysis.criticalGaps || [],
      suggestedEdits: analysis.suggestedEdits || []
    };

    return (
      <div className="container mx-auto p-6 space-y-6">
        <button
          onClick={() => {
            setAnalysis(null);
            setResumeText("");
          }}
          className="text-[#0df2a6] hover:underline flex items-center gap-2"
        >
          ← Analyze Another Resume
        </button>
        <Analyzer {...analyzerData} />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="bg-[#101413] border border-[#22493c]/50 rounded-xl p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-[#0df2a6]/10 rounded-2xl flex items-center justify-center border border-[#0df2a6]/20">
              <Sparkles className="w-8 h-8 text-[#0df2a6]" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white">AI Resume Analyzer</h1>
          <p className="text-slate-400">
            Get personalized feedback powered by Cerebras AI
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-red-400">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">
              Target Role
            </label>
            <input
              type="text"
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              className="w-full bg-[#0a0f0d] border border-[#22493c] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#0df2a6]"
              placeholder="e.g., Software Engineer, Data Scientist"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">
              Resume Text
            </label>
            <textarea
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              rows={15}
              className="w-full bg-[#0a0f0d] border border-[#22493c] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#0df2a6] font-mono text-sm"
              placeholder="Paste your resume text here... (or upload a file below)"
            />
            <p className="text-xs text-slate-500 mt-2">
              Tip: Copy and paste the text content of your resume for best results
            </p>
          </div>

          <div className="flex gap-4">
            <button
              onClick={handleAnalyze}
              disabled={analyzing}
              className="flex-1 flex items-center justify-center gap-2 bg-[#0df2a6] hover:bg-[#0bc98b] text-[#101010] px-6 py-3 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {analyzing ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-[#101010]"></div>
                  Analyzing with AI...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Analyze Resume
                </>
              )}
            </button>
          </div>
        </div>

        <div className="border-t border-[#22493c]/50 pt-6">
          <h3 className="text-sm font-semibold text-white mb-3">What you'll get:</h3>
          <ul className="space-y-2 text-sm text-slate-400">
            <li className="flex items-start gap-2">
              <span className="text-[#0df2a6] mt-0.5">✓</span>
              <span>ATS compatibility score (0-100)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#0df2a6] mt-0.5">✓</span>
              <span>Critical skill gaps for your target role</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#0df2a6] mt-0.5">✓</span>
              <span>Specific improvement suggestions with examples</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#0df2a6] mt-0.5">✓</span>
              <span>Keyword optimization recommendations</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
