import React, { useRef } from 'react';
import { Download, Eye, RefreshCw } from 'lucide-react';

interface ResultDisplayProps {
  htmlContent: string;
  onRegenerate: () => void;
  isGenerating: boolean;
}

export const ResultDisplay: React.FC<ResultDisplayProps> = ({
  htmlContent,
  onRegenerate,
  isGenerating
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const downloadHtml = () => {
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'scrollytelling-story.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const openInNewTab = () => {
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-100 rounded-lg">
              <Eye className="h-5 w-5 text-emerald-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800">Generated Story</h2>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={onRegenerate}
              disabled={isGenerating}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCw className={`h-4 w-4 ${isGenerating ? 'animate-spin' : ''}`} />
              Regenerate
            </button>
            
            <button
              onClick={openInNewTab}
              className="px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              <Eye className="h-4 w-4" />
              Open in New Tab
            </button>
            
            <button
              onClick={downloadHtml}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Download HTML
            </button>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <p className="text-sm text-gray-600">
            Preview of your generated scrollytelling story. Use the buttons above to open in a new tab or download the HTML file.
          </p>
        </div>
        
        <div className="border rounded-lg overflow-hidden" style={{ height: '600px' }}>
          <iframe
            ref={iframeRef}
            srcDoc={htmlContent}
            className="w-full h-full border-0"
            title="Generated Scrollytelling Story"
            sandbox="allow-scripts allow-same-origin"
          />
        </div>
      </div>
    </div>
  );
};