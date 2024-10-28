// src/components/loading/Loading.tsx
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

export default function CircularIndeterminate() {
  return (
    <div className="fixed inset-0 z-[9999] flex justify-center items-center bg-black bg-opacity-0">
      <Box>
        <CircularProgress />
      </Box>
    </div>
  );
}