import React from 'react';
import { AspectRatio } from '../types';

interface AspectRatioSelectorProps {
  selected: AspectRatio;
  onSelect: (ratio: AspectRatio) => void;
  disabled?: boolean;
}

const AspectRatioSelector: React.FC<AspectRatioSelectorProps> = ({ selected, onSelect, disabled }) => {
  // Fix: Replaced JSX.Element with React.ReactNode to resolve namespace issue.
  const options: { value: AspectRatio; label: string; icon: React.ReactNode }[] = [
    {
      value: '16:9',
      label: 'Landscape',
      icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="currentColor"><path d="M21 5H3a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h18a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2zm-1 12H4V8h16v9z" /></svg>
    },
    {
      value: '9:16',
      label: 'Portrait',
      icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="currentColor"><path d="M7 3H17a2 2 0 0 1 2 2V19a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zm9 16V6H8v13h8z" /></svg>
    }
  ];

  return (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-2">
        Aspect Ratio
      </label>
      <div className={`grid grid-cols-2 gap-4 ${disabled ? 'opacity-50' : ''}`}>
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onSelect(option.value)}
            disabled={disabled}
            className={`flex items-center justify-center p-3 rounded-lg border-2 transition-colors duration-200 ${
              selected === option.value
                ? 'bg-purple-600/30 border-purple-500 text-white'
                : 'bg-gray-900/50 border-gray-600 hover:border-gray-500 text-gray-300'
            } ${disabled ? 'cursor-not-allowed' : ''}`}
          >
            {option.icon}
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default AspectRatioSelector;