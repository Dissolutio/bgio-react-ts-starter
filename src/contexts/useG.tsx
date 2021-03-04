import * as React from 'react';

type GProviderProps = { children: React.ReactNode; G: any };
const GContext = React.createContext<
  | {
      G: any;
    }
  | undefined
>(undefined);
export function GProvider({ G, children }: GProviderProps) {
  return <GContext.Provider value={{ G }}>{children}</GContext.Provider>;
}
export function useG() {
  const context = React.useContext(GContext);
  if (context === undefined) {
    throw new Error('useG must be used within a GProvider');
  }
  return context;
}
