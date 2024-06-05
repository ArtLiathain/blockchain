import React from "react";
import errorP from "../assets/errorPic.jpg";
import tick from "../assets/success.jpg";
const Modal = ({ open, onClose, messageToDisplay, error }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-[#39393994] z-50" onClick={onClose}>
      <div className="max-w-lg w-full fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex bg-white shadow-lg  p-4">
        <img className="FailIMG"></img>
        <p onClick={onClose} className="fixed top-2 right-2">
          X
        </p>
        <img src={error ? errorP : tick} alt="" className="w-1/2 " />
        <div className="flex-col justify-center items-center w-full h-full text-center ">
          <div className="text-2xl font-bold">Notice!</div>
          <div className="text-black text-xl">{messageToDisplay}</div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
