import React, { useEffect, useRef } from 'react';
import { marked } from 'marked';
import hljs from 'highlight.js/lib/core';
import html from 'highlight.js/lib/languages/xml';
import css from 'highlight.js/lib/languages/css';
import javascript from 'highlight.js/lib/languages/javascript';
import 'highlight.js/styles/github.css';

// Register languages
hljs.registerLanguage('html', html);
hljs.registerLanguage('css', css);
hljs.registerLanguage('javascript', javascript);

interface StreamingDisplayProps {
  content: string;
  isStreaming: boolean;
}

export const StreamingDisplay: React.FC<StreamingDisplayProps> = ({ content, isStreaming }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      // Configure marked to use highlight.js
      marked.setOptions({
        highlight: function(code, lang) {
          if (lang && hljs.getLanguage(lang)) {
            try {
              return hljs.highlight(code, { language: lang }).value;
            } catch (err) {
              console.error('Highlight.js error:', err);
            }
          }
          return hljs.highlightAuto(code).value;
        },
        breaks: true,
        gfm: true
      });

      // Convert markdown to HTML
      const htmlContent = marked(content);
      containerRef.current.innerHTML = htmlContent;

      // Scroll to bottom if streaming
      if (isStreaming) {
        containerRef.current.scrollTop = containerRef.current.scrollHeight;
      }
    }
  }, [content, isStreaming]);

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-800">Generated Code</h3>
          {isStreaming && (
            <div className="flex items-center gap-2 text-blue-600">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              <span className="text-sm font-medium">Generating...</span>
            </div>
          )}
        </div>
      </div>
      
      <div 
        ref={containerRef}
        className="p-6 max-h-96 overflow-y-auto prose prose-sm max-w-none"
        style={{
          fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace'
        }}
      />
      
      {isStreaming && (
        <div className="px-6 pb-4">
          <div className="w-2 h-4 bg-blue-600 animate-pulse"></div>
        </div>
      )}
    </div>
  );
};