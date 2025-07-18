// --- src/components/SuccessModal/SuccessModal.jsx ---
import React from 'react';
import { Link } from 'react-router-dom'; // Para el botón de "Registrarse"
import './SuccessModal.css'; // Importa los estilos CSS específicos para el modal

function SuccessModal({ isOpen, title, message, publicId, onRegisterClick, onClose, registrationData }) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className={`modal-overlay ${isOpen ? 'open' : ''}`}>
      <div className="modal-content">
        <h3>{title}</h3>
        <p>{message}</p>
        {publicId && (
          <p>
            Tu ID Público es: <span className="public-id-display">{publicId}</span>
          </p>
        )}
        <div className="modal-buttons">
          {/* Botón para registrarse como contribuyente, pasando los datos */}
          {onRegisterClick && registrationData && (
            <Link
              to="/registro-contribuyente"
              state={registrationData} // Pasamos los datos para precargar el formulario
              className="modal-button primary"
              onClick={onRegisterClick} // Puedes añadir una función si necesitas hacer algo al hacer clic
            >
              Registrarme como Contribuyente
            </Link>
          )}
          {/* Botón para cerrar el modal */}
          <button className="modal-button secondary" onClick={onClose}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}

export default SuccessModal;
