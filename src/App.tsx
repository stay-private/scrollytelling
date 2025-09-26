import React, { useState } from 'react';
import { AlertCircle, FileText } from 'lucide-react';
import { ConfigPanel } from './components/ConfigPanel';
import { FileUpload } from './components/FileUpload';
import { GenerationPanel } from './components/GenerationPanel';
import { ResultDisplay } from './components/ResultDisplay';
import { useLLMGeneration } from './hooks/useLLMGeneration';
import { getLLMConfig, showLLMConfigModal, isConfigured } from './utils/llmProvider';
import { useEffect } from 'react';

function App() {
  const [config, setConfig] = useState<any>(null);
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [csvContent, setCsvContent] = useState<string>('');
  const [configLoading, setConfigLoading] = useState(true);

  const { generateScrollytelling, isGenerating, generatedHtml, dataProfile, error, setError } = useLLMGeneration(config);

  const configured = isConfigured(config);
  const hasFile = csvFile !== null;
  const canGenerate = configured && hasFile && !isGenerating;

  useEffect(() => {
    const loadConfig = async () => {
      try {
        const savedConfig = await getLLMConfig();
        setConfig(savedConfig);
      } catch (error) {
        console.error('Failed to load LLM config:', error);
      } finally {
        setConfigLoading(false);
      }
    };
    
    loadConfig();
  }, []);

  const handleConfigureClick = async () => {
    try {
      const newConfig = await showLLMConfigModal();
      setConfig(newConfig);
      setError('');
    } catch (error) {
      if (error.message !== 'cancelled') {
        setError('Failed to configure LLM provider');
      }
    }
  };

  const handleConfigSave = (newConfig: any) => {
    setConfig(newConfig);
    setError('');
  };

  const handleFileUpload = (file: File, content: string) => {
    setCsvFile(file);
    setCsvContent(content);
    setError('');
  };

  const handleGenerate = async (userPrompt?: string) => {
    if (!canGenerate || !csvFile || !csvContent) return;
    
    await generateScrollytelling(csvContent, csvFile.name, undefined, userPrompt);
  };

  const handleRefactor = async (refactorPrompt: string) => {
    if (!canGenerate || !csvFile || !csvContent) return;
    
    await generateScrollytelling(csvContent, csvFile.name, undefined, refactorPrompt);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">CSV Scrollytelling Generator</h1>
                <p className="text-sm text-gray-500">Transform data into compelling stories</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-8">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-red-800">Generation Error</h3>
                <p className="text-red-700 text-sm mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Configuration Panel */}
        <ConfigPanel
          config={config}
          configured={configured}
          onConfigureClick={handleConfigureClick}
        />

        {/* File Upload */}
        <FileUpload
          onFileUpload={handleFileUpload}
          disabled={!configured || isGenerating || configLoading}
        />

        {/* Generation Panel */}
        {hasFile && (
          <GenerationPanel
            isGenerating={isGenerating}
            onGenerate={handleGenerate}
            onRefactor={handleRefactor}
            disabled={!canGenerate}
            hasGenerated={!!generatedHtml}
          />
        )}

        {/* Results */}
        {generatedHtml && (
          <ResultDisplay
            htmlContent={generatedHtml}
            isGenerating={isGenerating}
          />
        )}

        {/* Instructions */}
        {!hasFile && configured && !configLoading && (
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Ready to Get Started!</h2>
              <p className="text-gray-600 mb-6">
                Upload a CSV file to transform your data into an engaging scrollytelling experience. 
                Our AI will analyze your data and create a beautiful, interactive story with charts, 
                insights, and smooth scroll animations.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <span className="text-blue-600 font-bold">1</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Upload CSV</h3>
                  <p className="text-sm text-gray-600">Drag & drop or select your data file</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <span className="text-purple-600 font-bold">2</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">AI Analysis</h3>
                  <p className="text-sm text-gray-600">Our AI finds patterns and insights</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <span className="text-emerald-600 font-bold">3</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Interactive Story</h3>
                  <p className="text-sm text-gray-600">Get a beautiful scrollytelling page</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {configLoading && (
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Loading Configuration...</h2>
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            </div>
          </div>
        )}
      </div>


    </div>
  );
}

export default App;