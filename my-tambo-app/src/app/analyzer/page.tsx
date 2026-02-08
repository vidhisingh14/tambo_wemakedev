"use client";

import { Analyzer } from "@/components/tambo/analyzer";
import { useState, useRef } from "react";
import { Upload, Sparkles, FileText } from "lucide-react";

export default function AnalyzerPage() {
  const [resumeText, setResumeText] = useState("");
  const [resumeFileName, setResumeFileName] = useState("");
  const [targetRole, setTargetRole] = useState("Software Engineer");
  const [analyzing, setAnalyzing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      setError('Please upload a PDF file');
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/extract-pdf', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to extract PDF text');
      }

      const { text } = await response.json();
      setResumeText(text);
      setResumeFileName(file.name);
    } catch (err: any) {
      console.error('PDF upload error:', err);
      setError('Failed to extract text from PDF. Please try again or paste text manually.');
    } finally {
      setUploading(false);
    }
  };

  const handleAnalyze = async () => {
    if (!resumeText.trim()) {
      setError("Please paste your resume text or upload a PDF");
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
      resumeName: resumeFileName || "Your Resume",
      resumeContent: resumeText, // Pass the actual resume content
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
            setResumeFileName("");
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

          {/* PDF Upload */}
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">
              Upload Resume (PDF)
            </label>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf"
              onChange={handleFileUpload}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="w-full flex items-center justify-center gap-3 bg-[#0a0f0d] border-2 border-dashed border-[#22493c] rounded-lg px-4 py-6 text-slate-400 hover:border-[#0df2a6] hover:text-[#0df2a6] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-[#0df2a6]"></div>
                  Extracting text from PDF...
                </>
              ) : resumeFileName ? (
                <>
                  <FileText className="w-5 h-5 text-[#0df2a6]" />
                  <span className="text-[#0df2a6]">{resumeFileName}</span>
                  <span className="text-xs text-slate-500">(Click to change)</span>
                </>
              ) : (
                <>
                  <Upload className="w-5 h-5" />
                  Click to upload PDF or drag & drop
                </>
              )}
            </button>
          </div>

          <div className="text-center text-sm text-slate-500">
            - OR -
          </div>

          {/* Text Input */}
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">
              Paste Resume Text
            </label>
            <textarea
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              rows={12}
              className="w-full bg-[#0a0f0d] border border-[#22493c] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#0df2a6] font-mono text-sm"
              placeholder="Or paste your resume text here..."
            />
            <p className="text-xs text-slate-500 mt-2">
              {resumeText.length > 0 ? `${resumeText.length} characters` : 'Waiting for input...'}
            </p>
          </div>

          <div className="flex gap-4">
            <button
              onClick={handleAnalyze}
              disabled={analyzing || !resumeText.trim()}
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
