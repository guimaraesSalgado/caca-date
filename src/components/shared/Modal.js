import React from "react";
import "./Modal.css";

const Modal = ({ isOpen, onClose, result }) => {
  if (!isOpen) return null; 

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Resultado</h2>
        <p>Você ganhou: {result}</p>
        <button onClick={onClose} className="modal-close-button">Fechar</button>
      </div>
    </div>
  );
};

export default Modal;
