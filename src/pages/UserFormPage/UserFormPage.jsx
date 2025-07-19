// --- src/pages/UserFormPage/UserFormPage.jsx ---
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './UserFormPage.css'; // Importa los estilos CSS específicos para esta página

function UserFormPage() {
  const { id } = useParams(); // Para obtener el ID si estamos en modo edición
  const navigate = useNavigate();
  const isEditing = !!id; // Booleano para saber si estamos editando o creando

  const [formData, setFormData] = useState({
    nombre_usuario: '',
    p_apellido_usuario: '',
    s_apellido_usuario: '',
    email: '',
    password: '', // Solo para creación o cambio de contraseña
    rol: '',
  });

  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userName, setUserName] = useState('Usuario'); // Estado para el nombre de usuario

  // useEffect para verificar la autenticación y rol (solo Administrador/Director puede acceder)
  useEffect(() => {
    const authToken = localStorage.getItem('authToken');
    const userRole = localStorage.getItem('userRole');
    const storedUserName = localStorage.getItem('userName'); // Obtener el nombre de usuario

    if (storedUserName) {
      setUserName(storedUserName); // Establecer el nombre de usuario
    }

    console.log('UserFormPage - Verificando autenticación...');
    console.log('Auth Token:', authToken ? 'Presente' : 'Ausente');
    console.log('User Role (from localStorage):', userRole); // DEBUG

    // Redirige si no hay token o el rol no es 'Administrador' ni 'director_de_obras'
    // CAMBIO CLAVE AQUÍ: 'director_de_obras' en minúsculas y con guiones bajos
    if (!authToken || (userRole !== 'Administrador' && userRole !== 'director_de_obras')) { 
      console.log('UserFormPage - Acceso denegado. Redirigiendo a login interno.');
      navigate('/acceso-interno');
      return;
    }
  }, [navigate]);

  // Cargar datos del usuario si estamos editando
  useEffect(() => {
    console.log('UserFormPage - useEffect de carga de datos. isEditing:', isEditing, 'ID:', id);
    if (isEditing && id) { // Asegurarse de que 'id' existe
      const fetchUser = async () => {
        setIsLoading(true);
        try {
          const token = localStorage.getItem('authToken');
          console.log('UserFormPage - Token de autenticación para fetch:', token ? 'Presente' : 'Ausente');
          if (!token) {
            setMessage('No autorizado. Por favor, inicia sesión.');
            setIsError(true);
            setIsLoading(false);
            navigate('/acceso-interno');
            return;
          }

          console.log(`UserFormPage - Intentando obtener usuario con ID: ${id}`);
          // Asumimos que tu backend tiene un endpoint GET /api/usuarios/:id
          const response = await axios.get(`http://backend-denuncias.onrender.com/api/usuarios/${id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          const userData = response.data;
          console.log('UserFormPage - Datos de usuario recibidos:', userData);

          setFormData({
            nombre_usuario: userData.nombre_usuario || '',
            p_apellido_usuario: userData.p_apellido_usuario || '',
            s_apellido_usuario: userData.s_apellido_usuario || '',
            email: userData.email || '',
            password: '', // Nunca precargar la contraseña
            rol: userData.rol || '',
          });
          setMessage('Datos de usuario cargados para edición.');
          setIsError(false);
        } catch (error) {
          console.error('UserFormPage - Error al cargar datos del usuario:', error);
          let errorMessage = 'Error al cargar datos del usuario.';
          if (error.response && error.response.status === 401) {
            errorMessage = 'No autorizado para ver este usuario. Por favor, inicia sesión con las credenciales correctas.';
            navigate('/acceso-interno');
          } else if (error.response && error.response.status === 404) {
            errorMessage = 'Usuario no encontrado.';
          } else if (error.response && error.response.data && error.response.data.message) {
            errorMessage = `Error: ${error.response.data.message}`;
          } else if (error.request) {
            errorMessage = 'Error de red: No se pudo conectar con el servidor. Asegúrate de que el backend esté corriendo y el endpoint /api/usuarios/:id exista.';
          }
          setMessage(errorMessage);
          setIsError(true);
        } finally {
          setIsLoading(false);
        }
      };
      fetchUser();
    }
  }, [id, isEditing, navigate]);

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

    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setMessage('No autorizado. Por favor, inicia sesión.');
        setIsError(true);
        setIsLoading(false);
        navigate('/acceso-interno');
        return;
      }

      let response;
      if (isEditing) {
        // Para edición, no enviamos la contraseña si no se ha modificado
        const dataToUpdate = { ...formData };
        if (!dataToUpdate.password) {
          delete dataToUpdate.password; // No enviar campo de contraseña vacío
        }
        response = await axios.put(`http://backend-denuncias.onrender.com/api/usuarios/${id}`, dataToUpdate, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
      } else {
        response = await axios.post('http://backend-denuncias.onrender.com/api/usuarios/register', formData, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
      }

      if (response.status === 200 || response.status === 201) {
        setMessage(`Usuario ${isEditing ? 'actualizado' : 'creado'} exitosamente.`);
        setIsError(false);
        // Opcional: Redirigir a una lista de usuarios o al dashboard
        setTimeout(() => navigate('/admin/usuarios'), 2000); // Redirige a la lista de usuarios
      } else {
        setMessage(`Error: ${response.data.message || 'Hubo un problema al guardar el usuario.'}`);
        setIsError(true);
      }
    } catch (error) {
      console.error('UserFormPage - Error al guardar el usuario:', error);
      let errorMessage = `Error al ${isEditing ? 'actualizar' : 'crear'} el usuario. Por favor, inténtalo de nuevo.`;
      if (error.response && error.response.status === 401) {
        errorMessage = 'No autorizado. Tu sesión ha expirado o no tienes permisos para esta acción.';
        navigate('/acceso-interno');
      } else if (error.response && error.response.status === 409) { // Conflicto, ej. email ya existe
        errorMessage = `Error: El email ya está registrado o el usuario ya existe.`;
      } else if (error.response && error.response.data && error.response.data.message) {
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

  return (
    <main className="main-content form-page">
      <div className="form-container">
        <h2>{isEditing ? 'Editar Usuario Interno' : 'Crear Nuevo Usuario Interno'}</h2>
        <p className="search-description">
          {isEditing ? 'Modifica los datos del usuario.' : 'Completa los datos para registrar un nuevo usuario interno.'}
        </p>

        <form onSubmit={handleSubmit}>
          <h3>Datos del Usuario</h3>
          <div className="form-group">
            <label htmlFor="nombre_usuario">Nombre:</label>
            <input
              type="text"
              id="nombre_usuario"
              name="nombre_usuario"
              value={formData.nombre_usuario}
              onChange={handleChange}
              required
              placeholder="Nombre del usuario"
            />
          </div>
          <div className="form-group">
            <label htmlFor="p_apellido_usuario">Primer Apellido:</label>
            <input
              type="text"
              id="p_apellido_usuario"
              name="p_apellido_usuario"
              value={formData.p_apellido_usuario}
              onChange={handleChange}
              required
              placeholder="Primer apellido del usuario"
            />
          </div>
          <div className="form-group">
            <label htmlFor="s_apellido_usuario">Segundo Apellido:</label>
            <input
              type="text"
              id="s_apellido_usuario"
              name="s_apellido_usuario"
              value={formData.s_apellido_usuario}
              onChange={handleChange}
              placeholder="Segundo apellido del usuario (opcional)"
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Correo Electrónico:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="correo@ejemplo.com"
            />
          </div>
          
          {/* La contraseña es obligatoria en creación, opcional en edición para cambiarla */}
          <div className="form-group">
            <label htmlFor="password">Contraseña {isEditing ? '(dejar en blanco para no cambiar)' : '*'}:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required={!isEditing} // Requerido solo si no está editando
              placeholder={isEditing ? '********' : 'Crea una contraseña'}
            />
          </div>

          <div className="form-group">
            <label htmlFor="rol">Rol:</label>
            <select
              id="rol"
              name="rol"
              value={formData.rol}
              onChange={handleChange}
              required
            >
              <option value="">Selecciona un rol</option>
              {/* Asegúrate de que estos valores coincidan con los roles en tu backend */}
              <option value="director_de_obras">Director</option> 
              <option value="inspector">Inspector</option>
              <option value="administrador">Administrador</option>
            </select>
          </div>

          <button type="submit" className="submit-button" disabled={isLoading}>
            {isLoading ? (isEditing ? 'Guardando...' : 'Creando...') : (isEditing ? 'Guardar Cambios' : 'Crear Usuario')}
          </button>
        </form>

        {message && (
          <p className={`message ${isError ? 'error' : 'success'}`}>
            {message}
          </p>
        )}
      </div>
    </main>
  );
}

export default UserFormPage;