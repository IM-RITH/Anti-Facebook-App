import React, { createContext, useContext, useState } from "react";

const ModalContext = createContext();

const ModalProvider = ({ children }) => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [postId, setPostId] = useState("");
  const showModal = () => {
    setModalVisible(true);
  };

  const hideModal = () => {
    setModalVisible(false);
    setPostId("");
  };

  return (
    <ModalContext.Provider
      value={{
        isModalVisible,
        showModal,
        hideModal,
        setPostId,
        postId: isModalVisible ? postId : undefined, // Pass postId only when modal is visible
      }}
    >
      {children}
    </ModalContext.Provider>
  );
};

export { ModalProvider, ModalContext };
