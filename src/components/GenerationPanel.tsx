import React, { useState } from 'react';

interface GenerationPanelProps {
  isGenerating: boolean;
  onGenerate: (userPrompt?: string) => void;
  onRefactor: (instructions: string) => void;
  disabled: boolean;
  hasGenerated: boolean;
}

export const GenerationPanel: React.FC<GenerationPanelProps> = ({
  isGenerating,
  onGenerate,
  onRefactor,
  disabled,
  hasGenerated
}) => {
  const [userPrompt, setUserPrompt] = useState('');
  const [refactorInstructions, setRefactorInstructions] = useState('');

  const handleGenerate = () => {
    onGenerate(userPrompt || undefined);
  };

  const handleRefactor = () => {
    if (refactorInstructions.trim()) {
      onRefactor(refactorInstructions);
      setRefactorInstructions('');
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="userPrompt" className="block text-sm font-medium text-gray-700 mb-2">
          Additional Instructions (optional)
        </label>
        <textarea
          id="userPrompt"
          value={userPrompt}
          onChange={(e) => setUserPrompt(e.target.value)}
          placeholder="Any specific requirements, focus areas, or style preferences for your story..."
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={disabled}
        />
      </div>

      <button
        onClick={handleGenerate}
        disabled={disabled || isGenerating}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isGenerating ? 'Generating...' : 'Generate Scrollytelling Story'}
      </button>

      {hasGenerated && (
        <div className="border-t pt-4">
          <label htmlFor="refactorInstructions" className="block text-sm font-medium text-gray-700 mb-2">
            Refactor Instructions
          </label>
          <textarea
            id="refactorInstructions"
            value={refactorInstructions}
            onChange={(e) => setRefactorInstructions(e.target.value)}
            placeholder="Describe what changes you'd like to make to the generated story..."
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={disabled}
          />
          <button
            onClick={handleRefactor}
            disabled={disabled || isGenerating || !refactorInstructions.trim()}
            className="mt-2 w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? 'Refactoring...' : 'Refactor Story'}
          </button>
        </div>
      )}
    </div>
  );
};