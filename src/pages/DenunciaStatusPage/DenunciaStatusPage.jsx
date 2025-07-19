// --- src/pages/DenunciaStatusPage/DenunciaStatusPage.jsx ---
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
// import Header from '../../components/Header/Header'; // ELIMINAMOS esta importación
import './DenunciaStatusPage.css'; // Importa los estilos CSS específicos para esta página

function DenunciaStatusPage() {
  const [publicIdInput, setPublicIdInput] = useState('');
  const [denunciaData, setDenunciaData] = useState(null);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { publicId: publicIdFromUrl } = useParams();

  // useEffect para precargar el ID si viene en la URL
  useEffect(() => {
    if (publicIdFromUrl) {
      setPublicIdInput(publicIdFromUrl);
      // Opcional: Podríamos llamar a handleSubmit aquí mismo para cargarla automáticamente
      // Pero por ahora, dejaremos que el usuario presione el botón.
      // Si quieres auto-consulta, podrías descomentar la siguiente línea y manejar el async/await
      // handleSubmit({ preventDefault: () => {} }); // Simula un evento para handleSubmit
    }
  }, [publicIdFromUrl]); // Dependencia para que se ejecute si el publicId de la URL cambia

  const handleChange = (e) => {
    setPublicIdInput(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setIsError(false);
    setDenunciaData(null); // Limpia datos anteriores al buscar
    setIsLoading(true);

    if (!publicIdInput) {
      setMessage('Por favor, ingresa el ID público de la denuncia.');
      setIsError(true);
      setIsLoading(false);
      return;
    }

    console.log('Consultando ID Público:', publicIdInput);

    try {
      // Realiza la petición GET al backend para consultar el estado
      const response = await axios.get(`http://backend-denuncias.onrender.com/api/public/denuncias/status/${publicIdInput}`);

      console.log('Respuesta del backend:', response.data);

      if (response.status === 200 && response.data && response.data.public_id) {
        setDenunciaData(response.data);
        setMessage('Estado de la denuncia encontrado.');
        setIsError(false);
      } else {
        setMessage('No se encontró una denuncia con ese ID público. Verifica el ID e inténtalo de nuevo.');
        setIsError(true);
      }
    } catch (error) {
      console.error('Error al consultar la denuncia:', error);
      let errorMessage = 'Error al consultar la denuncia. Por favor, inténtalo de nuevo.';
      if (error.response && error.response.status === 404) {
        errorMessage = 'No se encontró una denuncia con ese ID público.';
      } else if (error.response && error.response.data && error.response.data.message) {
        errorMessage = `Error: ${error.response.data.message}`;
      }
      setMessage(errorMessage);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // Ya no renderizamos el Header aquí, AppRoutes lo hace condicionalmente
    <main className="main-content form-page"> {/* Reutilizamos form-page para centrar el contenedor */}
      <div className="form-container search-container"> {/* search-container para ancho más pequeño */}
        <h2>Consultar Estado de Denuncia</h2>
        <p className="search-description">Ingresa el ID público de tu denuncia para ver su estado actual.</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="publicId">ID Público de la Denuncia:</label>
            <input
              type="text"
              id="publicId"
              name="publicId"
              value={publicIdInput}
              onChange={handleChange}
              required
              placeholder="Ej: 661811268"
            />
          </div>
          <button type="submit" className="submit-button" disabled={isLoading}>
            {isLoading ? 'Consultando...' : 'Consultar Estado'}
          </button>
        </form>

        {/* Mensajes de respuesta */}
        {message && (
          <p className={`message ${isError ? 'error' : 'success'}`}>
            {message}
          </p>
        )}

        {/* Mostrar los datos de la denuncia si se encontraron */}
        {denunciaData && (
          <div className="search-results"> {/* Contenedor para los resultados */}
            <div className="result-card"> {/* Estilo de tarjeta para los resultados */}
              <h3>Detalles de la Denuncia</h3>
              <p><strong>ID Público:</strong> {denunciaData.public_id}</p>
              <p><strong>Título:</strong> {denunciaData.titulo}</p>
              <p><strong>Descripción:</strong> {denunciaData.descripcion}</p>
              {/* Aplicamos las clases de estado dinámicamente */}
              <p><strong>Estado Actual:</strong> <span className={`status-badge status-${denunciaData.estado_actual.toLowerCase().replace(/\s/g, '-')}`}>{denunciaData.estado_actual}</span></p>
              <p><strong>Fecha de Ingreso:</strong> {new Date(denunciaData.fecha_ingreso).toLocaleDateString()}</p>
              <p><strong>Última Actualización de Estado:</strong> {new Date(denunciaData.fecha_estado_actual).toLocaleDateString()}</p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

export default DenunciaStatusPage;
