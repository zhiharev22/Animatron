
import React, { useState, useEffect } from 'react';

const loadingMessages = [
  "Warming up the digital canvas...",
  "Animating pixels into motion...",
  "This can take a few minutes...",
  "Composing the video frames...",
  "Finalizing the animation...",
  "Almost there, crafting your video...",
];

const Loader: React.FC = () => {
  const [message, setMessage] = useState(loadingMessages[0]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setMessage(prevMessage => {
        const currentIndex = loadingMessages.indexOf(prevMessage);
        const nextIndex = (currentIndex + 1) % loadingMessages.length;
        return loadingMessages[nextIndex];
      });
    }, 3000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center text-center space-y-4">
      <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-purple-500"></div>
      <p className="text-lg font-semibold text-gray-300">Generating Video</p>
      <p className="text-gray-400">{message}</p>
    </div>
  );
};

export default Loader;
