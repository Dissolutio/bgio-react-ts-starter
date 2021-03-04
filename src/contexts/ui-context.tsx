import * as React from 'react';

type UIContextProviderProps = {
  children: React.ReactNode;
};

const UIContext = React.createContext<
  | {
      menuOpen: boolean;
      toggleMenu: () => void;
    }
  | undefined
>(undefined);

export function UIContextProvider({ children }: UIContextProviderProps) {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const toggleMenu = () => {
    setMenuOpen((s) => !s);
  };

  return (
    <UIContext.Provider
      value={{
        menuOpen,
        toggleMenu,
      }}
    >
      {children}
    </UIContext.Provider>
  );
}

export function useUIContext() {
  const context = React.useContext(UIContext);
  if (context === undefined) {
    throw new Error('useUIContext must be used within a UIContextProvider');
  }
  return context;
}
