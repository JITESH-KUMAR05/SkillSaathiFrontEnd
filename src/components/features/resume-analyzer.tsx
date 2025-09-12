'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  DocumentTextIcon,
  ArrowUpTrayIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  SparklesIcon,
  StarIcon
} from '@heroicons/react/24/outline';

export function ResumeAnalyzer() {
  const [uploadedResume, setUploadedResume] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedResume(file);
      setIsAnalyzing(true);
      // Simulate analysis
      setTimeout(() => {
        setIsAnalyzing(false);
        setAnalysisComplete(true);
      }, 3000);
    }
  };

  const mockAnalysis = {
    score: 8.2,
    strengths: [
      'Strong technical skills section',
      'Relevant work experience',
      'Good formatting and structure',
      'Quantified achievements'
    ],
    improvements: [
      'Add more action verbs',
      'Include soft skills',
      'Optimize for ATS systems',
      'Add personal projects section'
    ],
    keywords: ['React', 'Node.js', 'Python', 'AWS', 'MongoDB'],
    suggestions: [
      'Consider adding a professional summary',
      'Include links to GitHub and LinkedIn',
      'Use bullet points consistently',
      'Proofread for grammatical errors'
    ]
  };

  return (
    <div className="h-full overflow-y-auto bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {!uploadedResume ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="bg-white rounded-2xl p-12 shadow-sm border">
              <DocumentTextIcon className="w-16 h-16 text-gray-300 mx-auto mb-6" />
              <h1 className="text-2xl font-bold text-gray-900 mb-4">Resume Analyzer</h1>
              <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                Upload your resume and get AI-powered insights to improve your chances of landing your dream job.
              </p>
              
              <div className="max-w-md mx-auto">
                <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <ArrowUpTrayIcon className="w-10 h-10 text-gray-400 mb-3" />
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">PDF, DOC, DOCX (MAX. 10MB)</p>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileUpload}
                  />
                </label>
              </div>
            </div>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {isAnalyzing ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white rounded-2xl p-8 text-center shadow-sm border"
              >
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Analyzing Resume...</h2>
                <p className="text-gray-600">Our AI is reviewing your resume for optimization opportunities.</p>
              </motion.div>
            ) : analysisComplete ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Score Overview */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">Resume Analysis</h2>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-blue-600">{mockAnalysis.score}/10</div>
                      <div className="text-sm text-gray-600">Overall Score</div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Strengths */}
                    <div>
                      <h3 className="font-medium text-gray-900 mb-3 flex items-center space-x-2">
                        <CheckCircleIcon className="w-5 h-5 text-green-500" />
                        <span>Strengths</span>
                      </h3>
                      <ul className="space-y-2">
                        {mockAnalysis.strengths.map((strength, index) => (
                          <li key={index} className="flex items-start space-x-2">
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2"></div>
                            <span className="text-sm text-gray-700">{strength}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    {/* Improvements */}
                    <div>
                      <h3 className="font-medium text-gray-900 mb-3 flex items-center space-x-2">
                        <ExclamationTriangleIcon className="w-5 h-5 text-yellow-500" />
                        <span>Areas for Improvement</span>
                      </h3>
                      <ul className="space-y-2">
                        {mockAnalysis.improvements.map((improvement, index) => (
                          <li key={index} className="flex items-start space-x-2">
                            <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full mt-2"></div>
                            <span className="text-sm text-gray-700">{improvement}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Keywords & Suggestions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white rounded-2xl p-6 shadow-sm border">
                    <h3 className="font-medium text-gray-900 mb-4">Key Skills Detected</h3>
                    <div className="flex flex-wrap gap-2">
                      {mockAnalysis.keywords.map((keyword) => (
                        <span key={keyword} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-2xl p-6 shadow-sm border">
                    <h3 className="font-medium text-gray-900 mb-4 flex items-center space-x-2">
                      <SparklesIcon className="w-5 h-5 text-purple-500" />
                      <span>AI Suggestions</span>
                    </h3>
                    <ul className="space-y-2">
                      {mockAnalysis.suggestions.slice(0, 3).map((suggestion, index) => (
                        <li key={index} className="text-sm text-gray-700">
                          • {suggestion}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}
