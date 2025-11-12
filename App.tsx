import React, { useState, useEffect, useCallback } from 'react';
import { GoogleGenAI, GenerateVideosOperation } from '@google/genai';
import { GenerationStatus, AspectRatio } from './types';
import FileUpload from './components/FileUpload';
import AspectRatioSelector from './components/AspectRatioSelector';
import Loader from './components/Loader';
import VideoPlayer from './components/VideoPlayer';
import ApiKeySelector from './components/ApiKeySelector';

// Helper function to convert file to base64
const fileToBase64 = (file: File): Promise<{ base64: string; mimeType: string }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(',')[1];
      resolve({ base64, mimeType: file.type });
    };
    reader.onerror = (error) => reject(error);
  });
};

const App: React.FC = () => {
  const [apiKeySelected, setApiKeySelected] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [prompt, setPrompt] = useState<string>('Subtle animation, bringing the photo to life.');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('16:9');
  const [status, setStatus] = useState<GenerationStatus>(GenerationStatus.IDLE);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const checkApiKey = useCallback(async () => {
    // @ts-ignore
    if (window.aistudio && await window.aistudio.hasSelectedApiKey()) {
      setApiKeySelected(true);
    } else {
      setApiKeySelected(false);
    }
  }, []);

  useEffect(() => {
    checkApiKey();
  }, [checkApiKey]);

  const handleSelectKey = async () => {
    try {
        // @ts-ignore
        await window.aistudio.openSelectKey();
        // Assume success and update state to re-enable UI
        setApiKeySelected(true);
    } catch (e) {
        console.error("Error opening API key selection:", e);
        setError("Could not open API key selection. Please try again.");
    }
  };
  

  const handleGenerateVideo = async () => {
    if (!imageFile) {
      setError('Please upload an image first.');
      return;
    }
    if (!prompt) {
      setError('Please enter a prompt.');
      return;
    }
    if (!apiKeySelected) {
        setError("Please select an API key before generating a video.");
        return;
    }

    setStatus(GenerationStatus.GENERATING);
    setError(null);
    setVideoUrl(null);

    try {
      // Create a new instance right before the call to use the latest key
      // @ts-ignore
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

      const { base64, mimeType } = await fileToBase64(imageFile);

      let operation: GenerateVideosOperation = await ai.models.generateVideos({
        model: 'veo-3.1-fast-generate-preview',
        prompt: prompt,
        image: {
          imageBytes: base64,
          mimeType: mimeType,
        },
        config: {
          numberOfVideos: 1,
          resolution: '720p', // 720p for faster generation
          aspectRatio: aspectRatio,
        },
      });

      // Polling for completion
      while (!operation.done) {
        await new Promise((resolve) => setTimeout(resolve, 10000)); // Wait 10 seconds
        operation = await ai.operations.getVideosOperation({ operation: operation });
      }

      if (operation.error) {
        throw new Error(`Operation failed: ${operation.error.message}`);
      }

      const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
      if (!downloadLink) {
        throw new Error('Video generation succeeded, but no download link was found.');
      }

      // @ts-ignore
      const videoResponse = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
      if (!videoResponse.ok) {
        throw new Error(`Failed to download video: ${videoResponse.statusText}`);
      }
      const videoBlob = await videoResponse.blob();
      const objectUrl = URL.createObjectURL(videoBlob);

      setVideoUrl(objectUrl);
      setStatus(GenerationStatus.SUCCESS);
    } catch (err: any) {
      console.error(err);
      const errorMessage = err.message || 'An unknown error occurred.';
      setError(errorMessage);
      setStatus(GenerationStatus.ERROR);

      // Handle specific API key error
      if (errorMessage.includes("Requested entity was not found")) {
        setError("Your API key is invalid. Please select a valid key.");
        setApiKeySelected(false);
      }
    }
  };
  
  const isGenerating = status === GenerationStatus.GENERATING;

  if (!apiKeySelected) {
    return <ApiKeySelector onSelectKey={handleSelectKey} error={error}/>;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col items-center justify-center p-4">
      <main className="w-full max-w-5xl mx-auto space-y-8">
        <header className="text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
            Аниматрон
          </h1>
          <p className="mt-2 text-lg text-gray-400">Bring your photos to life with generative video.</p>
        </header>

        <div className="bg-gray-800/50 backdrop-blur-sm p-6 md:p-8 rounded-2xl shadow-2xl border border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column: Controls */}
            <div className="flex flex-col space-y-6">
              <FileUpload onFileSelect={setImageFile} disabled={isGenerating}/>
              
              <div>
                <label htmlFor="prompt" className="block text-sm font-medium text-gray-300 mb-2">
                  Animation Prompt
                </label>
                <textarea
                  id="prompt"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="e.g., A gentle breeze rustles the leaves..."
                  rows={3}
                  disabled={isGenerating}
                  className="w-full bg-gray-900/70 border border-gray-600 rounded-lg p-3 text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition duration-200 resize-none disabled:opacity-50"
                />
              </div>

              <AspectRatioSelector
                selected={aspectRatio}
                onSelect={setAspectRatio}
                disabled={isGenerating}
              />

              <button
                onClick={handleGenerateVideo}
                disabled={isGenerating || !imageFile}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3 px-4 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
              >
                {isGenerating ? 'Animating...' : 'Generate Video'}
              </button>
            </div>

            {/* Right Column: Output */}
            <div className="bg-gray-900/70 rounded-lg border border-gray-700 flex items-center justify-center min-h-[300px] md:min-h-full p-4">
              {status === GenerationStatus.IDLE && <div className="text-gray-500">Video will appear here</div>}
              {status === GenerationStatus.GENERATING && <Loader />}
              {status === GenerationStatus.SUCCESS && videoUrl && <VideoPlayer src={videoUrl} />}
              {status === GenerationStatus.ERROR && (
                <div className="text-center text-red-400">
                  <p className="font-semibold">Generation Failed</p>
                  <p className="text-sm mt-1">{error}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;