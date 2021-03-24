import { createContext, useContext, useState } from "react";

/*
```js

const Example = () => {
  const { toggleModal } = useModalCtx();
  return (
    <p>
        Dev Modal button
        <button onClick={toggleModal}>TOGGLE MODAL</button>
      </p>
  )
}

```
*/

type ModalCtxProviderProps = {
  children: React.ReactNode;
};

type ModalCtxValue = {
  modalIsOpen: boolean;
  toggleModal: () => void;
  closeModal: () => void;
  openModal: () => void;
};
const ModalCtx = createContext<ModalCtxValue | undefined>(undefined);

export function ModalCtxProvider(props: ModalCtxProviderProps) {
  const { children } = props;
  //   const { playerID } = useBgioClientInfo();
  const [modalIsOpen, setIsOpen] = useState(false);

  const toggleModal = () => {
    setIsOpen((s) => !s);
  };
  const openModal = () => {
    setIsOpen(true);
  };
  const closeModal = () => {
    setIsOpen(false);
  };
  return (
    <ModalCtx.Provider
      value={{
        modalIsOpen,
        toggleModal,
        openModal,
        closeModal,
      }}
    >
      {children}
    </ModalCtx.Provider>
  );
}

export function useModalCtx() {
  const context = useContext(ModalCtx);
  if (context === undefined) {
    throw new Error("useModalCtx must be used within a ModalCtxProvider");
  }
  return context;
}
