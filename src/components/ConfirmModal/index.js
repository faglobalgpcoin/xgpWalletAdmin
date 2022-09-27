import React from 'react';
import Modal from 'react-modal';
import { IoIosClose } from 'react-icons/io';
import { inject, observer } from 'mobx-react';

const customStyles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 220,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(130, 130, 130, 0.15)',
    zIndex: 60,
  },
  content: {
    top: '47%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    zIndex: 30,
    width: '350px',
    height: '230px',
    border: '0px',
  },
};

const ConfirmModal = ({
  isOpen,
  setIsOpen,
  message,
  params,
  confirmFunction,
}) => {
  const closeModal = () => {
    setIsOpen(false);
  };

  return (
    <Modal
      isOpen={isOpen}
      closeTimeoutMS={300}
      style={customStyles}
      onRequestClose={closeModal}
      shouldCloseOnOverlayClick={true}
    >
      <div className="frame">
        <div className="scroll">
          <div
            className="modal-header"
            style={{
              width: '350px',
              boxShadow: '0px 17px 10px -17px rgba(131, 131, 131, 0.2)',
            }}
          >
            <div className="header-button">
              <span className="title">Confirm Delete&nbsp;</span>
            </div>
            <div className="header-button">
              <button type="button" onClick={closeModal}>
                <IoIosClose size={30} />
              </button>
            </div>
          </div>
          <div
            className="modal-content"
            style={{
              alignItems: 'center',
              justifyContent: 'space-around',
              height: '160px',
              fontFamily: 'inherit',
            }}
          >
            <p style={{ textAlign: 'center' }}>
              {message}
              <br />
              <b>Serial Number. {params.serialNum}?</b>
            </p>
            <div style={{ display: 'flex' }}>
              <button
                type="button"
                className="simple-button"
                onClick={closeModal}
              >
                Cancel
              </button>
              <button
                type="button"
                className="warning-button"
                onClick={() => confirmFunction(params)}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default inject('snackbarStore')(observer(ConfirmModal));
