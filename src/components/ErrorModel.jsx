import React from "react";

const Modal = ({ open, onClose, errorToDisplay }) => {
  if (!open) return null;
  return (
    <div className="fixed w-full h-full">
      <div className="max-w-lg w-full fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex bg-white shadow-lg rounded-lg p-4">
        <img className="FailIMG"></img>
        <div className="">{errorToDisplay}</div>
        <p onClick={onClose} className="fixed top-2 right-2">
          X
        </p>
      </div>
    </div>
  );
};

export default Modal;
