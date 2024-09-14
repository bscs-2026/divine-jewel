import React, { useState, useEffect } from 'react';

interface SuccessfulPromptProps {
  message: string;
  isVisible: boolean;
  onClose: () => void;
}

interface DeletePromptProps {
  isVisible: boolean;
  onClose: () => void;
}

export const SuccessfulPrompt: React.FC<SuccessfulPromptProps> = ({ message, isVisible, onClose }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-[#FCB6D7] text-white p-4 rounded-md shadow-lg animate-slide-in">
      {message}
    </div>
  );
};


export const DeletePrompt: React.FC<DeletePromptProps> = ({ isVisible, onClose }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-red-500 text-white p-4 rounded-md shadow-lg animate-slide-in">
      Employee removed.
    </div>
  );
};

