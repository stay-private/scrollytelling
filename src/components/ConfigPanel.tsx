import React from 'react';
import { Settings, Check, Zap } from 'lucide-react';
import { getAvailableModels, getCommonBaseUrls } from '../utils/llmProvider';

interface ConfigPanelProps {
  config: any;
  configured: boolean;
  onConfigureClick: () => void;
}

export const ConfigPanel: React.FC<ConfigPanelProps> = ({ config, configured, onConfigureClick }) => {
  const availableModels = getAvailableModels();
  const commonBaseUrls = getCommonBaseUrls();

  const getCurrentModel = () => {
    if (!config?.model) return 'No model selected';
    const model = availableModels.find(m => m.id === config.model);
    return model ? model.name : config.model;
  };

  const getCurrentProvider = () => {
    if (!config?.baseUrl) return 'OpenRouter';
    const provider = commonBaseUrls.find(p => p.url === config.baseUrl);
    return provider ? provider.name : 'Custom';
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            {configured ? (
              <Check className="h-5 w-5 text-green-600" />
            ) : (
              <Zap className="h-5 w-5 text-blue-600" />
            )}
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-800">OpenRouter Configuration</h2>
            <p className="text-sm text-gray-600">
              {configured 
                ? `Using ${getCurrentModel()} via ${getCurrentProvider()}`
                : 'Configure OpenRouter to access multiple AI models'
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
          <Zap className="h-4 w-4" />
          {configured ? 'Reconfigure' : 'Configure'}
        </button>
      </div>
    </div>
  );
};