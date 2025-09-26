import { useState } from 'react';
import { createScrollytellingPrompt, createRefactorPrompt } from '../utils/llmPrompt';
import { generateResponse, isConfigured } from '../utils/llmProvider';
import { createDataProfile } from '../utils/dataProfile';

export const useLLMGeneration = (config: any) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedHtml, setGeneratedHtml] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [dataProfile, setDataProfile] = useState<any>(null);

  const extractHtmlFromResponse = (responseText: string): string => {
    // Remove markdown code fences if present
    let cleanText = responseText.replace(/```html\s*/g, '').replace(/```\s*$/g, '');
    
    // Find the first occurrence of <!doctype html> or <html> (case insensitive)
    const doctypeMatch = cleanText.match(/<!doctype\s+html[^>]*>/i);
    const htmlMatch = cleanText.match(/<html[^>]*>/i);
    
    let startIndex = 0;
    if (doctypeMatch) {
      startIndex = cleanText.indexOf(doctypeMatch[0]);
    } else if (htmlMatch) {
      startIndex = cleanText.indexOf(htmlMatch[0]);
    }
    
    // Find the last </html> tag
    const endMatch = cleanText.lastIndexOf('</html>');
    
    if (endMatch === -1) {
      throw new Error('No valid HTML document found in response');
    }
    
    // Extract the HTML content
    const htmlContent = cleanText.substring(startIndex, endMatch + 7).trim();
    
    // Validate that we have a complete HTML document
    if (!htmlContent.toLowerCase().includes('<html') || !htmlContent.toLowerCase().includes('</html>')) {
      throw new Error('Generated content is not a complete HTML document');
    }
    
    return htmlContent;
  };

  const generateScrollytelling = async (csvContent: string, fileName: string, storyStyle?: string, promptInput?: string) => {
    if (!isConfigured(config)) {
      setError('Please configure your LLM API first');
      return;
    }

    setIsGenerating(true);
    setError('');

    try {
      // Create data profile instead of sending full CSV
      const profile = createDataProfile(csvContent);
      setDataProfile(profile);
      
      console.log('Data Profile:', profile);
      
      let result;
      
      if (promptInput && generatedHtml) {
        // For refactoring, include the existing HTML as context
        const refactorPromptWithContext = createRefactorPrompt(promptInput, generatedHtml, profile, fileName);
        result = await generateResponse(config, refactorPromptWithContext, {
          temperature: 0.7,
        });
      } else {
        // For initial generation, use the optional user prompt
        const prompt = createScrollytellingPrompt(profile, fileName, storyStyle, promptInput);
        console.log('Generated Prompt Length:', prompt.length);
        result = await generateResponse(config, prompt, {
          temperature: 0.7,
        });
      }

      const htmlContent = extractHtmlFromResponse(result.text);
      
      // Additional validation for D3 and Scrollama
      if (!htmlContent.includes('d3.v7.min.js') && !htmlContent.includes('d3js.org')) {
        console.warn('Generated HTML may not include D3.js library');
      }
      
      if (!htmlContent.includes('scrollama')) {
        console.warn('Generated HTML may not include Scrollama library');
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
    dataProfile,
    error,
    setError
  };
};
