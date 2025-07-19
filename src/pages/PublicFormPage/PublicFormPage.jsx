// --- src/pages/PublicFormPage/PublicFormPage.jsx ---
import React, { useState } from 'react';
import axios from 'axios';
import SuccessModal from '../../components/SuccessModal/SuccessModal'; 

function PublicFormPage() {
  const [formData, setFormData] = useState({
    tipo_denuncia: '',
    titulo: '',
    descripcion: '',
    direccion_incidente: '',
    comuna: '',
    nombre_denunciante: '',
    p_apellido_denunciante: '',
    s_apellido_denunciante: '',
    email_denunciante: '',
    telefono_denunciante: '',
    id_denunciado: null,
  });

  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Nuevos estados para el modal de éxito
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [publicDenunciaId, setPublicDenunciaId] = useState(null);
  const [registrationDataForModal, setRegistrationDataForModal] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setIsError(false);
    setIsLoading(true);

    console.log('Datos a enviar:', formData);

    try {
      const response = await axios.post('http://backend-denuncias.onrender.com/api/public/denuncias/create', formData);

      console.log('Respuesta del backend:', response.data);

      if (response.status === 201) {
        const newPublicId = response.data.denuncia.public_id;
        setPublicDenunciaId(newPublicId);

        setRegistrationDataForModal({
          nombre: formData.nombre_denunciante,
          p_apellido: formData.p_apellido_denunciante,
          s_apellido: formData.s_apellido_denunciante,
          email: formData.email_denunciante,
          telefono: formData.telefono_denunciante
        });

        setIsSuccessModalOpen(true);
        setMessage(''); 
        setIsError(false);
        
        setFormData({ // Limpiar el formulario
          tipo_denuncia: '',
          titulo: '',
          descripcion: '',
          direccion_incidente: '',
          comuna: '',
          nombre_denunciante: '',
          p_apellido_denunciante: '',
          s_apellido_denunciante: '',
          email_denunciante: '',
          telefono_denunciante: '',
          id_denunciado: null,
        });

      } else {
        setMessage(`Error: ${response.data.message || 'Hubo un problema al enviar la denuncia.'}`);
        setIsError(true);
      }
    } catch (error) {
      console.error('Error al enviar la denuncia:', error);
      let errorMessage = 'Error al enviar la denuncia. Por favor, inténtalo de nuevo.';
      if (error.response && error.response.data && error.response.data.message) {
        errorMessage = `Error: ${error.response.data.message}`;
      } else if (error.request) {
        errorMessage = 'Error de red: No se pudo conectar con el servidor. Asegúrate de que el backend esté corriendo.';
      }
      setMessage(errorMessage);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseSuccessModal = () => {
    setIsSuccessModalOpen(false);
    setPublicDenunciaId(null);
    setRegistrationDataForModal(null);
  };

  const handleRegisterFromModal = () => {
    console.log('Navegando a la página de registro desde el modal.');
    handleCloseSuccessModal(); 
    // La navegación la maneja el Link del modal, que ahora irá a /registro-contribuyente
  };

  return (
    <main className="main-content form-page">
      <div className="form-container">
        <h2>Formulario de Denuncia Pública</h2>
        <form onSubmit={handleSubmit}>
          <h3>Información del Incidente</h3>
          <div className="form-group">
            <label htmlFor="tipo_denuncia">Tipo de Denuncia:</label>
            <input
              type="text"
              id="tipo_denuncia"
              name="tipo_denuncia"
              value={formData.tipo_denuncia}
              onChange={handleChange}
              required
              placeholder="Ej: Construcción sin permiso"
            />
          </div>
          <div className="form-group">
            <label htmlFor="titulo">Título de la Denuncia:</label>
            <input
                type="text"
                id="titulo"
                name="titulo"
                value={formData.titulo}
                onChange={handleChange}
                required
                placeholder="Ej: Ruidos Vecinales"
            />
          </div>
          <div className="form-group">
            <label htmlFor="descripcion">Descripción Detallada:</label>
            <textarea
                id="descripcion"
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                required
                placeholder="Describe el incidente con el mayor detalle posible..."
            ></textarea>
          </div>
          <div className="form-group">
            <label htmlFor="direccion_incidente">Dirección del Incidente:</label>
            <input
                type="text"
                id="direccion_incidente"
                name="direccion_incidente"
                value={formData.direccion_incidente}
                onChange={handleChange}
                required
                placeholder="Calle, número, comuna, referencia"
            />
          </div>
          <div className="form-group">
            <label htmlFor="comuna">Comuna:</label>
            <input
                type="text"
                id="comuna"
                name="comuna"
                value={formData.comuna}
                onChange={handleChange}
                required
                placeholder="Ej: Villa Alemana"
            />
          </div>

          <div className="form-group">
              <label htmlFor="evidencia">Adjuntar Evidencia (Opcional):</label>
              <input type="file" id="evidencia" name="evidencia" multiple accept="image/*,application/pdf" />
              <small>Formatos permitidos: imágenes (JPG, PNG), PDF.</small>
          </div>

          <h3>Información del Denunciante (Opcional)</h3>
          <p className="optional-text">Si deseas ser contactado o hacer seguimiento personalizado, por favor ingresa tus datos:</p>
          <div className="form-group">
            <label htmlFor="nombre_denunciante">Nombre:</label>
            <input
              type="text"
              id="nombre_denunciante"
              name="nombre_denunciante"
              value={formData.nombre_denunciante}
              onChange={handleChange}
              placeholder="Tu nombre"
            />
          </div>
          <div className="form-group">
            <label htmlFor="p_apellido_denunciante">Primer Apellido:</label>
            <input
              type="text"
              id="p_apellido_denunciante"
              name="p_apellido_denunciante"
              value={formData.p_apellido_denunciante}
              onChange={handleChange}
              placeholder="Tu primer apellido"
            />
          </div>
          <div className="form-group">
            <label htmlFor="s_apellido_denunciante">Segundo Apellido:</label>
            <input
              type="text"
              id="s_apellido_denunciante"
              name="s_apellido_denunciante"
              value={formData.s_apellido_denunciante}
              onChange={handleChange}
              placeholder="Tu segundo apellido (opcional)"
            />
          </div>
          <div className="form-group">
            <label htmlFor="email_denunciante">Email:</label>
            <input
              type="email"
              id="email_denunciante"
              name="email_denunciante"
              value={formData.email_denunciante}
              onChange={handleChange}
              placeholder="tu.correo@ejemplo.com"
            />
          </div>
          <div className="form-group">
            <label htmlFor="telefono_denunciante">Teléfono:</label>
            <input
              type="tel"
              id="telefono_denunciante"
              name="telefono_denunciante"
              value={formData.telefono_denunciante}
              onChange={handleChange}
              placeholder="+56912345678"
            />
          </div>

          <button type="submit" className="submit-button" disabled={isLoading}>
            {isLoading ? 'Enviando...' : 'Enviar Denuncia'}
          </button>
        </form>

        {message && isError && (
          <p className={`message ${isError ? 'error' : 'success'}`}>
            {message}
          </p>
        )}

        {/* Renderizado del Modal de Éxito */}
        <SuccessModal
          isOpen={isSuccessModalOpen}
          title="¡Denuncia Enviada!"
          message="Tu denuncia ha sido recibida exitosamente."
          publicId={publicDenunciaId}
          onRegisterClick={handleRegisterFromModal}
          onClose={handleCloseSuccessModal}
          registrationData={registrationDataForModal}
        />
      </div>
    </main>
  );
}

export default PublicFormPage;
