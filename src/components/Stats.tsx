import { Box } from '@mui/material';

function Stats() {
  return (
    <Box
      sx={{
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        minHeight: '500px',
      }}
    >
      <span className="loader"></span>
    </Box>
  );
}

export default Stats;
