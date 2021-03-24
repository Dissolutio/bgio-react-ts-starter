import Modal from "react-modal";
import { useModalCtx } from "hooks/useModalCtx";
// Make sure to bind modal to your appElement (http://reactcommunity.org/react-modal/accessibility/)
Modal.setAppElement("#root");
const modalStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};

export const MyModal = () => {
  const { modalIsOpen, closeModal } = useModalCtx();
  return (
    <Modal
      isOpen={modalIsOpen}
      style={modalStyles}
      contentLabel="Example Modal"
    >
      <h2>Hello</h2>
      <button onClick={closeModal}>close</button>
      <div>I am a modal</div>
      <form>
        <input />
        <button>tab navigation</button>
        <button>stays</button>
        <button>inside</button>
        <button>the modal</button>
      </form>
    </Modal>
  );
};
