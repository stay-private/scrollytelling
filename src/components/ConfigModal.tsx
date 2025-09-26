import React, { useState, useEffect } from 'react';
import { X, Settings, Check, AlertCircle, Zap } from 'lucide-react';
import { isConfigured, getAvailableModels } from '../utils/llmProvider';

interface ConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfigChange: (config: any) => void;
  currentConfig?: any;
}

export const ConfigModal: React.FC<ConfigModalProps> = ({
  isOpen,
  onClose,
  onConfigChange,
  currentConfig
}) => {
  const [apiKey, setApiKey] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  
  const configured = isConfigured(currentConfig);
  const availableModels = getAvailableModels();

  useEffect(() => {
    if (isOpen) {
      setError('');
      if (currentConfig) {
        setApiKey(currentConfig.apiKey || '');
        setSelectedModel(currentConfig.model || availableModels[0].id);
      } else {
        setSelectedModel(availableModels[0].id);
      }
    }
  }, [isOpen, currentConfig]);

  const handleSave = async () => {
    if (!apiKey.trim()) {
      setError('Please enter your OpenRouter API key');
      return;
    }

    if (!selectedModel) {
      setError('Please select a model');
      return;
    }

    setIsLoading(true);
    setError('');
    
    try {
      const config = {
        baseUrl: "https://openrouter.ai/api/v1",
        apiKey: apiKey.trim(),
        model: selectedModel
      };

      // Test the configuration with a simple request
      const testResponse = await fetch('https://openrouter.ai/api/v1/models', {
        headers: {
          'Authorization': `Bearer ${config.apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': window.location.origin,
          'X-Title': 'CSV Scrollytelling Generator'
        }
      });

      if (!testResponse.ok) {
        throw new Error('Invalid API key or connection failed');
      }

      onConfigChange(config);
      onClose();
    } catch (error: any) {
      console.error('Configuration error:', error);
      setError(error.message || 'Configuration failed. Please check your API key.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
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
              <p className="text-sm text-gray-600">Access multiple AI models through OpenRouter</p>
              {configured && (
                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium mt-1 inline-block">
                  Configured
                </span>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            disabled={isLoading}
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-red-600 flex-shrink-0" />
                <span className="text-red-800 font-medium text-sm">{error}</span>
              </div>
            </div>
          )}

          <div className="space-y-6">
            {/* API Key Input */}
            <div>
              <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700 mb-2">
                OpenRouter API Key
              </label>
              <input
                id="apiKey"
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="sk-or-v1-..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                disabled={isLoading}
              />
              <p className="text-xs text-gray-500 mt-1">
                Get your API key from{' '}
                <a 
                  href="https://openrouter.ai/keys" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-700 underline"
                >
                  openrouter.ai/keys
                </a>
              </p>
            </div>

            {/* Model Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Choose AI Model
              </label>
              <div className="grid grid-cols-1 gap-3 max-h-64 overflow-y-auto">
                {availableModels.map((model) => (
                  <label
                    key={model.id}
                    className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedModel === model.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="model"
                      value={model.id}
                      checked={selectedModel === model.id}
                      onChange={(e) => setSelectedModel(e.target.value)}
                      className="sr-only"
                    />
                    <div className={`w-4 h-4 rounded-full border-2 mr-3 ${
                      selectedModel === model.id
                        ? 'border-blue-500 bg-blue-500'
                        : 'border-gray-300'
                    }`}>
                      {selectedModel === model.id && (
                        <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5"></div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{model.name}</div>
                      <div className="text-sm text-gray-500">{model.provider} • {model.id}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Info Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Zap className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-medium text-blue-800 mb-1">About OpenRouter</h3>
                  <p className="text-blue-700 text-sm">
                    OpenRouter provides unified access to multiple AI models including GPT, Claude, Gemini, and more. 
                    Your API key is stored locally and never shared with our servers.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg font-medium transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isLoading || !apiKey.trim() || !selectedModel}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Testing...
              </>
            ) : (
              <>
                <Settings className="h-4 w-4" />
                Save Configuration
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};