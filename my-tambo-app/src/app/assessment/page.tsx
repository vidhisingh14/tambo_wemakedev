"use client";

import { SkillAssessment } from "@/components/tambo/skill-assessment";

const mockAssessmentData = {
  questionNumber: 3,
  totalQuestions: 10,
  category: "Dynamic Programming",
  question: "What will be the output of this memoized Fibonacci function?",
  description: "Analyze the code and determine the final output value.",
  codeSnippet: {
    language: "python" as const,
    code: `def fib(n, memo={}):
    if n in memo:
        return memo[n]
    if n <= 2:
        return 1
    memo[n] = fib(n-1, memo) + fib(n-2, memo)
    return memo[n]

print(fib(7))`,
    fileName: "fibonacci.py"
  },
  options: [
    {
      id: "a",
      label: "A",
      text: "5",
      isCorrect: false
    },
    {
      id: "b",
      label: "B",
      text: "8",
      isCorrect: false
    },
    {
      id: "c",
      label: "C",
      text: "13",
      isCorrect: true
    },
    {
      id: "d",
      label: "D",
      text: "21",
      isCorrect: false
    }
  ],
  timeLeft: "14:32",
  progress: 30
};

export default function AssessmentPage() {
  return (
    <div className="container mx-auto p-6">
      <SkillAssessment {...mockAssessmentData} />
    </div>
  );
}
