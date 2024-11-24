// src/components/loading/Loading.tsx

import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import React from 'react';

/**
 * Spinner - Fullscreen loading spinner.
 */
export default function Spinner() {
  return (
    <div className="fixed inset-0 z-[9999] flex justify-center items-center bg-black bg-opacity-0">
      <Box>
        <CircularProgress />
      </Box>
    </div>
  );
}

/**
 * ProgressLoader - Inline or contained loading spinner.
 * @param {string} [message] - Optional message to display alongside the spinner.
 * @param {React.CSSProperties} [style] - Additional styles for the container.
 */
export function ProgressLoader({ message, style }: { message?: string; style?: React.CSSProperties }) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        ...style,
      }}
    >
      <CircularProgress />
      {message && <span style={{ marginTop: '10px', fontSize: '14px', color: '#555' }}>{message}</span>}
    </Box>
  );
}
