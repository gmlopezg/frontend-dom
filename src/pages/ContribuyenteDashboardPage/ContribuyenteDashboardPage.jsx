// --- src/pages/ContribuyenteDashboardPage/ContribuyenteDashboardPage.jsx ---
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom'; // Importamos useOutletContext
import axiosInstance from '../../api/axiosInstance'; // Importa tu instancia de Axios
import './ContribuyenteDashboardPage.css'; // Importa los estilos CSS específicos

function ContribuyenteDashboardPage() {
  // Obtener el contexto del ProtectedLayout
  const { userId, userName, handleLogout } = useOutletContext(); // userId será el id_contribuyente
  const navigate = useNavigate();

  const [denuncias, setDenuncias] = useState([]);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

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
      case 'registrada sin asignar': return 'status-ingresada';
      case 'asignada': return 'status-en-revision';
      case 'en proceso': return 'status-en-proceso';
      case 'resuelta': return 'status-resuelta';
      case 'cerrada': return 'status-cerrada';
      default: return '';
    }
  };

  // useEffect para cargar denuncias al montar el componente o cuando el userId esté disponible
  useEffect(() => {
    // La autenticación ya fue verificada por ProtectedLayout
    // Solo necesitamos el userId para hacer la llamada a la API
    if (!userId) {
      // Esto no debería ocurrir si ProtectedLayout funciona correctamente,
      // pero es una salvaguarda.
      console.error("ContribuyenteDashboardPage: userId no disponible. Redirigiendo a login.");
      handleLogout(); // Forzar cierre de sesión si el ID no está disponible
      return;
    }

    const fetchDenuncias = async () => {
      setIsLoading(true);
      setMessage(''); // Limpiamos el mensaje antes de cargar
      setIsError(false);
      try {
        console.log(`ContribuyenteDashboardPage - Intentando obtener denuncias para contribuyente ID: ${userId}`);

        // Usar axiosInstance para que el token se adjunte automáticamente
        const response = await axiosInstance.get(`/api/contribuyentes/${userId}/denuncias`);
        console.log('ContribuyenteDashboardPage - Denuncias recibidas:', response.data);

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
        if (error.response) {
          if (error.response.status === 401) {
            errorMessage = 'No autorizado. Tu sesión ha expirado o no tienes permisos.';
            handleLogout(); // Forzar cierre de sesión si el token no es válido
          } else if (error.response.status === 403) {
            errorMessage = 'Acceso denegado. No tienes permiso para ver estas denuncias (ID de URL vs ID de token no coinciden o rol no autorizado).';
          } else if (error.response.data && error.response.data.message) {
            errorMessage = `Error: ${error.response.data.message}`;
          }
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
  }, [userId, handleLogout]); // Dependencia del userId y handleLogout (del contexto)

  // ELIMINADO: La función handleLogout interna de este componente.
  // Ahora se usa la función handleLogout del contexto.
  // ELIMINADO: La importación de Header y su uso directo.

  return (
    <main className="main-content dashboard-page">
      <div className="dashboard-container">
        <h2>Dashboard del Contribuyente</h2>

        <div className="dashboard-info-card">
          <p>Bienvenido, <strong>{userName || 'Contribuyente'}</strong>. Aquí puedes ver el estado de las denuncias que has presentado.</p>
          {userId && <p className="text-sm text-gray-500">Tu ID de Contribuyente: {userId}</p>}
        </div>

        <div className="denuncia-list-section">
          <h3>Tus Denuncias</h3>

          {isLoading && <p className="message info">Cargando tus denuncias...</p>}
          {message && !isLoading && (
            <p className={`message ${isError ? 'error' : 'success'}`}>
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
                      <td>{denuncia.public_id || 'N/A'}</td> {/* Asegúrate de que el backend envíe 'public_id' */}
                      <td>{denuncia.titulo}</td>
                      <td>
                        {denuncia.descripcion_denuncia
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
  );
}

export default ContribuyenteDashboardPage;
