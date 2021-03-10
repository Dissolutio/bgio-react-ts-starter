import * as React from 'react';

type BgioGProviderProps = { children: React.ReactNode; G: any };

const BgioGContext = React.createContext<
  | {
      G: any;
    }
  | undefined
>(undefined);

export function BgioGProvider({ G, children }: BgioGProviderProps) {
  return <BgioGContext.Provider value={{ G }}>{children}</BgioGContext.Provider>;
}
export function useBgioG() {
  const context = React.useContext(BgioGContext);
  if (context === undefined) {
    throw new Error('useBgioG must be used within a BgioGProvider');
  }
  return context;
}
