import React, { useState, useEffect } from "react";
import { Check, DeleteOutline, PriorityHigh } from '@mui/icons-material';

interface SuccessfulPromptProps {
  message: string;
  isVisible: boolean;
  onClose: () => void;
}

interface DeletePromptProps {
  message: string;
  isVisible: boolean;
  onClose: () => void;
}

export const SuccessfulPrompt: React.FC<SuccessfulPromptProps> = ({
  message,
  isVisible,
  onClose,
}) => {
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
    <div className="fixed top-4 right-4 bg-white text-gray p-4 rounded-md shadow-lg animate-slide-in" style={{ zIndex: 9999 }}>
      
      <Check style={{ color: '#FCB6D7', fontSize: '2rem', marginRight: '0.5rem' }} />

      {message}
    </div>
  );
};

export const DeletePrompt: React.FC<DeletePromptProps> = ({
  message,
  isVisible,
  onClose,
}) => {
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
    <div className="fixed top-4 right-4 bg-white text-gray p-4 rounded-md shadow-lg animate-slide-in" style={{ zIndex: 9999 }}>
      <DeleteOutline style={{ color: '#ff4d4f', fontSize: '2rem', marginRight: '0.5rem' }} />
      {message}
    </div>
  );
};

export const ErrorPrompt: React.FC<SuccessfulPromptProps> = ({
  message,
  isVisible,
  onClose,
}) => {
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
    <div className="fixed top-4 right-4 bg-white text-gray p-4 rounded-md shadow-lg animate-slide-in" style={{ zIndex: 9999 }}>
      
      <PriorityHigh style={{ color: '#ff4d4f', fontSize: '2rem', marginRight: '0.5rem' }} />
      {message}
    </div>
  );
};
