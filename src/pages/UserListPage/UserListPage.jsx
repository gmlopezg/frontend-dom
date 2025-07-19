// --- src/pages/UserListPage/UserListPage.jsx ---
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './UserListPage.css'; // Importa los estilos CSS específicos para esta página
import ConfirmationModal from '../../components/ConfirmationModal/ConfirmationModal'; // Importa el modal de confirmación

function UserListPage() {
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Estado de carga inicial
  const navigate = useNavigate();

  // Estados para el modal de confirmación de eliminación
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userToDeleteId, setUserToDeleteId] = useState(null);
  const [userToDeleteName, setUserToDeleteName] = useState('');

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

  // Función para mapear roles a clases CSS
  const getRoleBadgeClass = (rol) => {
    if (!rol) {
      return '';
    }
    switch (rol.toLowerCase()) {
      case 'director_de_obras': return 'role-director'; // CAMBIO: Coincide con el backend
      case 'inspector': return 'role-inspector';
      case 'administrador': return 'role-administrador';
      default: return '';
    }
  };

  // Función para obtener los usuarios
  const fetchUsers = async (showDefaultMessage = true) => {
    setIsLoading(true);
    if (showDefaultMessage) {
      setMessage('');
      setIsError(false);
    }
    try {
      const authToken = localStorage.getItem('authToken');
      const userRole = localStorage.getItem('userRole');

      // Redirige si no hay token o el rol no es autorizado (solo Director/Administrador)
      // CAMBIO CLAVE AQUÍ: 'director_de_obras' en minúsculas y con guiones bajos
      if (!authToken || (userRole !== 'director_de_obras' && userRole !== 'Administrador')) { 
        console.log('UserListPage - Acceso denegado. Redirigiendo a login interno. Rol:', userRole);
        navigate('/acceso-interno');
        return;
      }

      console.log('UserListPage - Intentando obtener usuarios del backend...');
      // Asumimos que tu backend tiene un endpoint GET /api/usuarios
      const response = await axios.get('http://backend-denuncias.onrender.com/api/usuarios', {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
      console.log('UserListPage - Respuesta del backend recibida:', response.data);

      if (response.status === 200) {
        if (Array.isArray(response.data)) {
          setUsers(response.data);
          if (showDefaultMessage) {
            showTemporaryMessage('Usuarios cargados exitosamente.');
          }
        } else {
          console.error('UserListPage - La respuesta del backend no es un array:', response.data);
          showTemporaryMessage('Error: Formato de datos inesperado del servidor.', true);
        }
      } else {
        showTemporaryMessage('Error al cargar los usuarios.', true);
      }
    } catch (error) {
      console.error('UserListPage - Error al obtener usuarios:', error);
      let errorMessage = 'Error al cargar los usuarios. Por favor, inténtalo de nuevo.';
      if (error.response && error.response.status === 401) {
        errorMessage = 'No autorizado. Tu sesión ha expirado o no tienes permisos.';
        navigate('/acceso-interno');
      } else if (error.response && error.response.data && error.response.data.message) {
        errorMessage = `Error: ${error.response.data.message}`;
      } else if (error.request) {
        errorMessage = 'Error de red: No se pudo conectar con el servidor. Asegúrate de que el backend esté corriendo y el endpoint /api/usuarios exista.';
      }
      showTemporaryMessage(errorMessage, true);
    } finally {
      setIsLoading(false);
    }
  };

  // useEffect para cargar usuarios al montar el componente
  useEffect(() => {
    fetchUsers();
    return () => clearMessageTimer(); // Limpiar el temporizador al desmontar
  }, [navigate]);

  // Manejador para editar: navega a UserFormPage con el ID
  const handleEdit = (id_usuario) => {
    console.log('UserListPage - Editando usuario con ID:', id_usuario);
    navigate(`/admin/usuarios/editar/${id_usuario}`);
  };

  // Manejador para abrir el modal de confirmación de eliminación
  const handleDelete = (id_usuario, nombre_usuario, p_apellido_usuario) => {
    clearMessageTimer(); // Limpiar cualquier mensaje anterior
    setMessage('');
    setIsError(false);
    setUserToDeleteId(id_usuario); // Guarda el ID del usuario a eliminar
    setUserToDeleteName(`${nombre_usuario} ${p_apellido_usuario}`); // Guarda el nombre para el mensaje
    setIsModalOpen(true); // Abre el modal
  };

  // Manejador cuando se confirma la eliminación en el modal
  const handleConfirmDelete = async () => {
    setIsModalOpen(false); // Cierra el modal
    setIsLoading(true); // Muestra el estado de carga
    clearMessageTimer(); // Limpiar cualquier mensaje anterior
    setMessage('');
    setIsError(false);

    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        showTemporaryMessage('No autorizado. Por favor, inicia sesión.', true);
        setIsLoading(false);
        navigate('/acceso-interno');
        return;
      }

      console.log(`UserListPage - Confirmando eliminación de usuario ID: ${userToDeleteId}`);
      // Asumimos que tu backend tiene un endpoint DELETE /api/usuarios/:id
      const response = await axios.delete(`http://backend-denuncias.onrender.com/api/usuarios/${userToDeleteId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.status === 200) {
        showTemporaryMessage(`Usuario ${userToDeleteName} eliminado exitosamente.`, false);
        fetchUsers(false); // Vuelve a cargar los usuarios, sin mostrar el mensaje de carga por defecto
      } else {
        showTemporaryMessage(`Error al eliminar el usuario: ${response.data.message || 'Hubo un problema.'}`, true);
      }
    } catch (error) {
      console.error('UserListPage - Error al eliminar usuario:', error);
      let errorMessage = 'Error al eliminar el usuario. Por favor, inténtalo de nuevo.';
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
      setUserToDeleteId(null);
      setUserToDeleteName('');
    }
  };

  // Manejador cuando se cancela la eliminación en el modal
  const handleCancelDelete = () => {
    setIsModalOpen(false); // Cierra el modal
    setUserToDeleteId(null);
    setUserToDeleteName('');
    showTemporaryMessage('Eliminación cancelada.', false);
  };

  return (
    <main className="main-content list-page">
      <div className="list-container">
        <h2>Listado de Usuarios Internos</h2>

        <div className="create-user-button-container">
          <Link to="/admin/usuarios/crear" className="create-user-button">
            <i className="fas fa-user-plus"></i> Crear Nuevo Usuario
          </Link>
        </div>

        {isLoading && <p className="message info">Cargando usuarios...</p>}
        {message && !isLoading && (
          <p className={`message ${isError ? 'error' : 'success'}`}>
            {message}
          </p>
        )}

        {!isLoading && users.length === 0 && !isError && (
          <p className="message info">No hay usuarios internos registrados.</p>
        )}

        {!isLoading && users.length > 0 && (
          <div className="table-responsive">
            <table className="user-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre Completo</th>
                  <th>Email</th>
                  <th>Rol</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id_usuario}>
                    <td>{user.id_usuario}</td>
                    <td>{user.nombre_usuario} {user.p_apellido_usuario} {user.s_apellido_usuario}</td>
                    <td>{user.email}</td>
                    <td>
                      <span className={`role-badge ${getRoleBadgeClass(user.rol)}`}>
                        {user.rol}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons-table">
                        <button className="edit-button" onClick={() => handleEdit(user.id_usuario)}>
                          <i className="fas fa-edit"></i> Editar
                        </button>
                        <button className="delete-button" onClick={() => handleDelete(user.id_usuario, user.nombre_usuario, user.p_apellido_usuario)}>
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
          title="Confirmar Eliminación de Usuario"
          message={`¿Estás seguro de que quieres eliminar al usuario "${userToDeleteName}" (ID: ${userToDeleteId})? Esta acción no se puede deshacer.`}
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      </div>
    </main>
  );
}

export default UserListPage;
