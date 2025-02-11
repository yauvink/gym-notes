import { useContext } from 'react';

import { AppContext } from './AppProvider';

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('use only inside provider');
  }

  return context;
}
