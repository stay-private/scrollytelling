import React from 'react';
import { Loader2, Sparkles } from 'lucide-react';

interface GenerationPanelProps {
  isGenerating: boolean;
  onGenerate: () => void;
  disabled: boolean;
}

export const GenerationPanel: React.FC<GenerationPanelProps> = ({
  isGenerating,
  onGenerate,
  disabled
}) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-purple-100 rounded-lg">
          <Sparkles className="h-5 w-5 text-purple-600" />
        </div>
        <h2 className="text-xl font-semibold text-gray-800">Generate Scrollytelling Story</h2>
      </div>

      <p className="text-gray-600 mb-6">
        Transform your CSV data into an interactive, visually compelling scrollytelling experience 
        with AI-powered insights, charts, and narrative flow.
      </p>

      <button
        onClick={onGenerate}
        disabled={disabled || isGenerating}
        className="w-full md:w-auto px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
      >
        {isGenerating ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            Generating Story...
          </>
        ) : (
          <>
            <Sparkles className="h-5 w-5" />
            Generate Scrollytelling Story
          </>
        )}
      </button>
    </div>
  );
};