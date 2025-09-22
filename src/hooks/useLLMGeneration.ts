import { useState } from 'react';
import { createScrollytellingPrompt } from '../utils/llmPrompt';
import { generateResponse, isConfigured } from '../utils/llmProvider';

export const useLLMGeneration = (config: any) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedHtml, setGeneratedHtml] = useState<string>('');
  const [error, setError] = useState<string>('');

  const generateScrollytelling = async (csvContent: string, fileName: string) => {
    if (!isConfigured()) {
      setError('Please configure your LLM API first');
      return;
    }

    setIsGenerating(true);
    setError('');

    try {
      const prompt = createScrollytellingPrompt(csvContent, fileName);
      
      const result = await generateResponse(prompt, {
        temperature: 0.7,
      });

      const htmlContent = result.text;
      
      if (!htmlContent.includes('<html') || !htmlContent.includes('</html>')) {
        throw new Error('Generated content is not a valid HTML document');
      }

      setGeneratedHtml(htmlContent);
    } catch (err) {
      console.error('LLM Generation Error:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate scrollytelling story');
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    generateScrollytelling,
    isGenerating,
    generatedHtml,
    error,
    setError
  };
};