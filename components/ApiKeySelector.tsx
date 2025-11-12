import React from 'react';

interface ApiKeySelectorProps {
  onSelectKey: () => void;
  error?: string | null;
}

const ApiKeySelector: React.FC<ApiKeySelectorProps> = ({ onSelectKey, error }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
      <div className="max-w-md w-full bg-gray-800/50 backdrop-blur-sm p-8 rounded-2xl shadow-2xl border border-gray-700 text-center">
        <h2 className="text-2xl font-bold text-white mb-4">API Key Required</h2>
        <p className="text-gray-400 mb-6">
          To use Аниматрон, you need to select a valid Google AI API key. This service may incur costs.
        </p>
        <div className="space-y-4">
            <button
            onClick={onSelectKey}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3 px-4 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-300 ease-in-out"
            >
            Select API Key
            </button>
            <a
            href="https://ai.google.dev/gemini-api/docs/billing"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-purple-400 hover:text-purple-300 transition-colors"
            >
            Learn more about billing
            </a>
        </div>
        {error && <p className="mt-6 text-red-400">{error}</p>}
      </div>
    </div>
  );
};

export default ApiKeySelector;