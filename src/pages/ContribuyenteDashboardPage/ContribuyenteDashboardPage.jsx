// --- src/pages/ContribuyenteDashboardPage/ContribuyenteDashboardPage.jsx ---
import React, { useState, useEffect, useRef } from 'react'; // Importamos useRef
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../../components/Header/Header.jsx'; // Importa el Header
import './ContribuyenteDashboardPage.css'; // Importa los estilos CSS específicos

function ContribuyenteDashboardPage() {
  const [denuncias, setDenuncias] = useState([]);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userName, setUserName] = useState('Contribuyente'); 
  const navigate = useNavigate();

  // Ref para el temporizador del mensaje
  const messageTimerRef = useRef(null);

  // Función para limpiar el temporizador del mensaje
  const clearMessageTimer = () => {
    if (messageTimerRef.current) {
      clearTimeout(messageTimerRef.current);
      messageTimerRef.current = null;
    }
  };

  // Función para mostrar un mensaje temporal
  const showTemporaryMessage = (msg, error = false) => {
    clearMessageTimer(); // Limpia cualquier temporizador existente
    setMessage(msg);
    setIsError(error);
    messageTimerRef.current = setTimeout(() => {
      setMessage('');
      setIsError(false);
    }, 5000); // El mensaje desaparece después de 5 segundos
  };

  // Función para mapear estados a clases CSS
  const getStatusBadgeClass = (status) => {
    if (!status) {
      return '';
    }
    switch (status.toLowerCase()) {
      case 'registrada sin asignar': return 'status-ingresada'; // Ajustado para tu nuevo estado
      case 'asignada': return 'status-en-revision'; // Ajustado para tu nuevo estado
      case 'en proceso': return 'status-en-proceso';
      case 'resuelta': return 'status-resuelta';
      case 'cerrada': return 'status-cerrada';
      default: return '';
    }
  };

  useEffect(() => {
    const authToken = localStorage.getItem('authToken');
    const userRole = localStorage.getItem('userRole');
    const storedUserName = localStorage.getItem('userName');
    const contribuyenteId = localStorage.getItem('contribuyenteId');

    if (storedUserName) {
      setUserName(storedUserName);
    }

    // Redirige si no hay token, el rol no es 'contribuyente' o falta el ID del contribuyente
    if (!authToken || userRole !== 'contribuyente' || !contribuyenteId) {
      console.log('ContribuyenteDashboardPage - Acceso denegado. Redirigiendo a login de contribuyentes.');
      navigate('/acceso-contribuyente');
      return;
    }

    const fetchDenuncias = async () => {
      setIsLoading(true);
      setMessage(''); // Limpiamos el mensaje antes de cargar
      setIsError(false);
      try {
        console.log(`ContribuyenteDashboardPage - Intentando obtener denuncias para contribuyente ID: ${contribuyenteId}`);
        console.log(`ContribuyenteDashboardPage - Usando Token: ${authToken ? 'Presente' : 'Ausente'}`); // Solo indica si está presente

        // Endpoint en el backend para obtener denuncias por contribuyente ID
        // Este endpoint necesitará autenticación y filtrar por id_contribuyente
        const response = await axios.get(`http://backend-denuncias.onrender.com/api/contribuyentes/${contribuyenteId}/denuncias`, {
          headers: {
            'Authorization': `Bearer ${authToken}`
          }
        });

        console.log('ContribuyenteDashboardPage - Respuesta del backend recibida:', response.data);

        if (response.status === 200) {
          if (Array.isArray(response.data)) {
            setDenuncias(response.data);
            showTemporaryMessage('Tus denuncias han sido cargadas exitosamente.');
          } else {
            console.error('ContribuyenteDashboardPage - La respuesta del backend no es un array:', response.data);
            showTemporaryMessage('Error: Formato de datos inesperado del servidor.', true);
          }
        } else {
          showTemporaryMessage('Error al cargar tus denuncias.', true);
        }
      } catch (error) {
        console.error('ContribuyenteDashboardPage - Error al obtener denuncias:', error);
        let errorMessage = 'Error al cargar tus denuncias. Por favor, inténtalo de nuevo.';
        if (error.response && error.response.status === 401) {
          errorMessage = 'No autorizado. Tu sesión ha expirado o no tienes permisos.';
          navigate('/acceso-contribuyente');
        } else if (error.response && error.response.data && error.response.data.message) {
          errorMessage = `Error: ${error.response.data.message}`;
        } else if (error.request) {
          errorMessage = 'Error de red: No se pudo conectar con el servidor. Asegúrate de que el backend esté corriendo y el endpoint de denuncias del contribuyente exista.';
        }
        showTemporaryMessage(errorMessage, true); // Muestra el error de forma temporal
      } finally {
        setIsLoading(false);
      }
    };

    fetchDenuncias();
    return () => clearMessageTimer(); // Limpiar el temporizador al desmontar
  }, [navigate]);

  // Función para cerrar sesión
  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    localStorage.removeItem('contribuyenteId');
    navigate('/acceso-contribuyente');
  };

  return (
    <>
      <Header type="internal" userName={userName} onLogout={handleLogout} />
      <main className="main-content dashboard-page">
        <div className="dashboard-container">
          <h2>Dashboard del Contribuyente</h2>

          <div className="dashboard-info-card">
            <p>Bienvenido, <strong>{userName}</strong>. Aquí puedes ver el estado de las denuncias que has presentado.</p>
          </div>

          <div className="denuncia-list-section">
            <h3>Tus Denuncias</h3>

            {isLoading && <p className="message info">Cargando tus denuncias...</p>}
            {message && !isLoading && ( // Muestra el mensaje si existe y no está cargando
              <p className={`message ${isError ? 'error' : 'success'}`}> {/* Clase 'success' para mensajes de éxito */}
                {message}
              </p>
            )}

            {!isLoading && denuncias.length === 0 && !isError && (
              <p className="message info">No has presentado ninguna denuncia aún.</p>
            )}

            {!isLoading && denuncias.length > 0 && (
              <div className="table-responsive">
                <table className="contribuyente-denuncia-table">
                  <thead>
                    <tr>
                      <th>ID Público</th>
                      <th>Título</th>
                      <th>Descripción</th>
                      <th>Estado</th>
                      <th>Fecha Ingreso</th>
                      <th>Última Actualización</th>
                      <th>Inspector Asignado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {denuncias.map((denuncia) => (
                      <tr key={denuncia.id_denuncia}>
                        <td>{denuncia.public_id}</td>
                        <td>{denuncia.titulo}</td>
                        <td>
                          {denuncia.descripcion_denuncia // Usamos descripcion_denuncia como en tu DenunciaListPage
                            ? (denuncia.descripcion_denuncia.length > 50
                               ? denuncia.descripcion_denuncia.substring(0, 50) + '...'
                               : denuncia.descripcion_denuncia)
                            : 'N/A'}
                        </td>
                        <td>
                          <span className={`status-badge ${getStatusBadgeClass(denuncia.estado_actual)}`}>
                            {denuncia.estado_actual || 'N/A'}
                          </span>
                        </td>
                        <td>
                          {denuncia.fecha_creacion ?
                            (() => {
                              const date = new Date(denuncia.fecha_creacion);
                              return isNaN(date.getTime()) ? 'Fecha Inválida' : date.toLocaleDateString();
                            })()
                            : 'N/A'
                          }
                        </td>
                        <td>
                          {denuncia.fecha_estado_actual ?
                            (() => {
                              const date = new Date(denuncia.fecha_estado_actual);
                              return isNaN(date.getTime()) ? 'Fecha Inválida' : date.toLocaleDateString();
                            })()
                            : 'N/A'
                          }
                        </td>
                        <td>{denuncia.inspector_asignado || 'No Asignado'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}

export default ContribuyenteDashboardPage;
