import { Box, Button, Dialog, Typography } from '@mui/material';
import { createContext, ReactNode, useCallback, useContext, useRef, useState } from 'react';

type ConfirmFn = (message: string) => Promise<boolean>;

const ConfirmContext = createContext<ConfirmFn | null>(null);

function ConfirmProvider({ children }: { children: ReactNode }) {
  const [message, setMessage] = useState<string | null>(null);
  const resolverRef = useRef<((value: boolean) => void) | null>(null);

  const close = useCallback((value: boolean) => {
    resolverRef.current?.(value);
    resolverRef.current = null;
    setMessage(null);
  }, []);

  const confirm = useCallback((nextMessage: string) => {
    return new Promise<boolean>((resolve) => {
      resolverRef.current?.(false);
      resolverRef.current = resolve;
      setMessage(nextMessage);
    });
  }, []);

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      <Dialog
        open={message !== null}
        onClose={() => close(false)}
        sx={{
          zIndex: 20010,
          '& .MuiPaper-root': {
            width: 'min(360px, calc(100vw - 32px))',
            mx: 2,
          },
        }}
      >
        <Box
          sx={{
            p: 2.5,
            display: 'flex',
            flexDirection: 'column',
            gap: 2.25,
          }}
        >
          <Typography sx={{ fontSize: 16, fontWeight: 650, lineHeight: 1.4 }}>
            {message}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1.25 }}>
            <Button variant="outlined" color="inherit" fullWidth onClick={() => close(false)}>
              Cancel
            </Button>
            <Button variant="contained" color="error" fullWidth onClick={() => close(true)}>
              OK
            </Button>
          </Box>
        </Box>
      </Dialog>
    </ConfirmContext.Provider>
  );
}

export function useConfirm() {
  const confirm = useContext(ConfirmContext);
  if (!confirm) {
    throw new Error('useConfirm must be used inside ConfirmProvider');
  }
  return confirm;
}

export default ConfirmProvider;
