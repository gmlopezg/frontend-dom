// --- src/components/ConfirmationModal/ConfirmationModal.jsx ---
import React from 'react';
import './ConfirmationModal.css'; // Importa los estilos CSS específicos para el modal

function ConfirmationModal({ isOpen, title, message, onConfirm, onCancel }) {
  // Si el modal no está abierto, no renderiza nada
  if (!isOpen) {
    return null;
  }

  return (
    <div className={`modal-overlay ${isOpen ? 'open' : ''}`}>
      <div className="modal-content">
        <h3>{title}</h3>
        <p>{message}</p>
        <div className="modal-buttons">
          <button className="modal-button cancel" onClick={onCancel}>
            Cancelar
          </button>
          <button className="modal-button confirm" onClick={onConfirm}>
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmationModal;
