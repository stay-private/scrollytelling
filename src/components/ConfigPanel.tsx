import React from 'react';
import { Settings, Check } from 'lucide-react';

interface ConfigPanelProps {
  config: any;
  configured: boolean;
  onConfigureClick: () => void;
}

export const ConfigPanel: React.FC<ConfigPanelProps> = ({ config, configured, onConfigureClick }) => {

  const getProviderName = () => {
    if (!config?.baseUrl) return 'Unknown Provider';
    
    const url = config.baseUrl;
    if (url.includes('openai.com')) return 'OpenAI';
    if (url.includes('generativelanguage.googleapis.com')) return 'Google Gemini';
    if (url.includes('aipipe.org')) return 'AI Pipe';
    return 'Custom Provider';
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            {configured ? (
              <Check className="h-5 w-5 text-green-600" />
            ) : (
              <Settings className="h-5 w-5 text-blue-600" />
            )}
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-800">LLM Configuration</h2>
            <p className="text-sm text-gray-600">
              {configured 
                ? `Connected to ${getProviderName()}`
                : 'Configure your AI provider to generate stories'
              }
            </p>
          </div>
          {configured && (
            <span className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full font-medium">
              Ready
            </span>
          )}
        </div>
        
        <button
          onClick={onConfigureClick}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors flex items-center gap-2"
        >
          <Settings className="h-4 w-4" />
          {configured ? 'Reconfigure' : 'Configure'}
        </button>
      </div>
    </div>
  );
};