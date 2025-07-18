// --- src/pages/DenunciaListPage/DenunciaListPage.jsx ---
import React, { useState, useEffect, useRef } from 'react'; // Importamos useRef
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './DenunciaListPage.css'; // Importa los estilos CSS específicos para esta página
import ConfirmationModal from '../../components/ConfirmationModal/ConfirmationModal'; // Importa el modal de confirmación

function DenunciaListPage() {
  const [denuncias, setDenuncias] = useState([]);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Estado de carga inicial
  const navigate = useNavigate();

  // Estados para el modal de confirmación
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [denunciaToDeleteId, setDenunciaToDeleteId] = useState(null);

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
    }, 3000); // El mensaje desaparece después de 3 segundos
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

  // Función para obtener las denuncias
  const fetchDenuncias = async (showDefaultMessage = true) => { // Nuevo parámetro
    setIsLoading(true);
    // No limpiar el mensaje aquí si es un mensaje de éxito post-eliminación
    // Esto permite que el mensaje de "eliminado" se mantenga
    if (showDefaultMessage) {
      setMessage('');
      setIsError(false);
    }
    try {
      const authToken = localStorage.getItem('authToken');
      const userRole = localStorage.getItem('userRole');

      // Redirige si no hay token o el rol no es autorizado
      if (!authToken || (userRole !== 'Director' && userRole !== 'Administrador')) { // Corregido 'director_de_obras' a 'Director'
        navigate('/acceso-interno');
        return;
      }

      console.log('DenunciaListPage - Intentando obtener denuncias del backend...');
      const response = await axios.get('http://localhost:3001/api/denuncias', {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
      console.log('DenunciaListPage - Respuesta del backend recibida:', response.data);

      if (response.status === 200) {
        if (Array.isArray(response.data)) {
          setDenuncias(response.data);
          if (showDefaultMessage) { // Solo muestra el mensaje de carga si no hay otro mensaje activo
            showTemporaryMessage('Denuncias cargadas exitosamente.');
          }
        } else {
          console.error('DenunciaListPage - La respuesta del backend no es un array:', response.data);
          showTemporaryMessage('Error: Formato de datos inesperado del servidor.', true);
        }
      } else {
        showTemporaryMessage('Error al cargar las denuncias.', true);
      }
    } catch (error) {
      console.error('DenunciaListPage - Error al obtener denuncias:', error);
      let errorMessage = 'Error al cargar las denuncias. Por favor, inténtalo de nuevo.';
      if (error.response && error.response.status === 401) {
        errorMessage = 'No autorizado. Tu sesión ha expirado o no tienes permisos.';
        navigate('/acceso-interno');
      } else if (error.response && error.response.data && error.response.data.message) {
        errorMessage = `Error: ${error.response.data.message}`;
      } else if (error.request) {
        errorMessage = 'Error de red: No se pudo conectar con el servidor. Asegúrate de que el backend esté corriendo.';
      }
      showTemporaryMessage(errorMessage, true);
    } finally {
      setIsLoading(false);
    }
  };

  // useEffect para cargar denuncias al montar el componente
  useEffect(() => {
    fetchDenuncias();
    // Limpiar el temporizador al desmontar el componente
    return () => clearMessageTimer();
  }, [navigate]); // Dependencia para que se ejecute al montar y si 'navigate' cambia

  // Manejador para editar: navega a DenunciaFormPage con el ID
  const handleEdit = (id_denuncia) => {
    console.log('DenunciaListPage - Editando denuncia con ID:', id_denuncia);
    navigate(`/dashboard/denuncias/editar/${id_denuncia}`);
  };

  // Manejador para abrir el modal de confirmación de eliminación
  const handleDelete = (id_denuncia) => {
    clearMessageTimer(); // Limpiar cualquier mensaje anterior
    setMessage('');
    setIsError(false);
    setDenunciaToDeleteId(id_denuncia); // Guarda el ID de la denuncia a eliminar
    setIsModalOpen(true); // Abre el modal
  };

  // Manejador cuando se confirma la eliminación en el modal
  const handleConfirmDelete = async () => {
    setIsModalOpen(false); // Cierra el modal
    setIsLoading(true); // Muestra el estado de carga
    clearMessageTimer(); // Limpiar cualquier mensaje anterior
    setMessage(''); // Limpiar mensaje antes de la operación de eliminación
    setIsError(false);

    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        showTemporaryMessage('No autorizado. Por favor, inicia sesión.', true);
        setIsLoading(false);
        navigate('/acceso-interno');
        return;
      }

      console.log(`DenunciaListPage - Confirmando eliminación de ID: ${denunciaToDeleteId}`);
      const response = await axios.delete(`http://localhost:3001/api/denuncias/${denunciaToDeleteId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.status === 200) {
        showTemporaryMessage(`Denuncia ${denunciaToDeleteId} eliminada exitosamente.`, false); // Mensaje de éxito
        fetchDenuncias(false); // Vuelve a cargar las denuncias, pero no muestra el mensaje de carga por defecto
      } else {
        showTemporaryMessage(`Error al eliminar la denuncia: ${response.data.message || 'Hubo un problema.'}`, true);
      }
    } catch (error) {
      console.error('DenunciaListPage - Error al eliminar denuncia:', error);
      let errorMessage = 'Error al eliminar la denuncia. Por favor, inténtalo de nuevo.';
      if (error.response && error.response.status === 401) {
        errorMessage = 'No autorizado. Tu sesión ha expirado o no tienes permisos.';
        navigate('/acceso-interno');
      } else if (error.response && error.response.data && error.response.data.message) {
        errorMessage = `Error: ${error.response.data.message}`;
      } else if (error.request) {
        errorMessage = 'Error de red: No se pudo conectar con el servidor. Asegúrate de que el backend esté corriendo.';
      }
      showTemporaryMessage(errorMessage, true);
    } finally {
      setIsLoading(false);
      setDenunciaToDeleteId(null); // Limpia el ID a eliminar
    }
  };

  // Manejador cuando se cancela la eliminación en el modal
  const handleCancelDelete = () => {
    setIsModalOpen(false); // Cierra el modal
    setDenunciaToDeleteId(null); // Limpia el ID a eliminar
    showTemporaryMessage('Eliminación cancelada.', false); // Mensaje de cancelación
  };

  return (
    <main className="main-content list-page">
      <div className="list-container">
        <h2>Listado General de Denuncias</h2>

        {isLoading && <p className="message info">Cargando denuncias...</p>}
        {/* Siempre muestra el mensaje si existe, con el estilo adecuado */}
        {message && !isLoading && ( // No mostrar el mensaje si está cargando, ya hay un mensaje de carga
          <p className={`message ${isError ? 'error' : 'success'}`}> {/* Clase 'success' para mensajes de éxito */}
            {message}
          </p>
        )}

        {!isLoading && denuncias.length === 0 && !isError && (
          <p className="message info">No hay denuncias disponibles.</p>
        )}

        {!isLoading && denuncias.length > 0 && (
          <div className="table-responsive">
            <table className="denuncia-table">
              <thead>
                <tr>
                  <th>ID Público</th>
                  <th>Título</th>
                  <th>Descripción</th>
                  <th>Dirección</th>
                  <th>Comuna</th>
                  <th>Estado</th>
                  <th>Fecha Ingreso</th>
                  <th>Última Actualización</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {denuncias.map((denuncia, index) => (
                  <tr key={denuncia.id_denuncia || `denuncia-${index}`}>
                    <td>{denuncia.public_id}</td>
                    <td>
                      {denuncia.titulo}
                    </td>
                    <td>
                      {denuncia.descripcion_denuncia
                        ? (denuncia.descripcion_denuncia.length > 50
                           ? denuncia.descripcion_denuncia.substring(0, 50) + '...'
                           : denuncia.descripcion_denuncia)
                        : 'N/A'}
                    </td>
                    <td>{denuncia.direccion_incidente}</td>
                    <td>{denuncia.comuna}</td>
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
                    <td>
                      <div className="action-buttons-table">
                        <button className="edit-button" onClick={() => handleEdit(denuncia.id_denuncia)}>
                          <i className="fas fa-edit"></i> Editar
                        </button>
                        <button className="delete-button" onClick={() => handleDelete(denuncia.id_denuncia)}>
                          <i className="fas fa-trash-alt"></i> Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Renderizado del Modal de Confirmación */}
        <ConfirmationModal
          isOpen={isModalOpen}
          title="Confirmar Eliminación"
          message={`¿Estás seguro de que quieres eliminar la denuncia con ID: ${denunciaToDeleteId}? Esta acción no se puede deshacer.`}
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      </div>
    </main>
  );
}

export default DenunciaListPage;