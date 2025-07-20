// --- src/pages/DenunciaFormPage/DenunciaFormPage.jsx ---
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './DenunciaFormPage.css'; // Importa los estilos CSS específicos para esta página

function DenunciaFormPage() {
  const { id } = useParams(); // Para obtener el ID si estamos en modo edición
  const navigate = useNavigate();
  const isEditing = !!id; // Booleano para saber si estamos editando o creando

  const [formData, setFormData] = useState({
    tipo_denuncia: '',
    titulo: '',
    descripcion: '',
    direccion_incidente: '',
    comuna: '',
    estado_actual: 'Ingresada', // Estado por defecto para nuevas denuncias
    fecha_estado_actual: new Date().toISOString().split('T')[0], // Fecha actual por defecto
    nombre_denunciante: '',
    p_apellido_denunciante: '',
    s_apellido_denunciante: '',
    email_denunciante: '',
    telefono_denunciante: '',
    id_denunciado: null, // Asumimos que esto se manejará internamente o se dejará nulo
  });

  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // useEffect para verificar la autenticación y rol (solo Director/Administrador/Inspector)
  useEffect(() => {
    const authToken = localStorage.getItem('authToken');
    const userRole = localStorage.getItem('userRole');

    console.log('DenunciaFormPage - Verificando autenticación...');
    console.log('Auth Token:', authToken ? 'Presente' : 'Ausente');
    console.log('User Role:', userRole);

    // Redirige si no hay token o el rol no es autorizado
    if (!authToken || (userRole !== 'director_de_obras' && userRole !== 'administrador' && userRole !== 'Inspector')) {
      console.log('DenunciaFormPage - Acceso denegado. Redirigiendo a login.');
      navigate('/acceso-interno');
      return;
    }
  }, [navigate]);

  // Cargar datos de la denuncia si estamos editando
  useEffect(() => {
    console.log('DenunciaFormPage - useEffect de carga de datos. isEditing:', isEditing, 'ID:', id);
    if (isEditing && id) { // Asegurarse de que 'id' existe
      const fetchDenuncia = async () => {
        setIsLoading(true);
        try {
          const token = localStorage.getItem('authToken');
          console.log('DenunciaFormPage - Token de autenticación para fetch:', token ? 'Presente' : 'Ausente');
          if (!token) {
            setMessage('No autorizado. Por favor, inicia sesión.');
            setIsError(true);
            setIsLoading(false);
            navigate('/acceso-interno');
            return;
          }

          console.log(`DenunciaFormPage - Intentando obtener denuncia con ID_DENUNCIA: ${id}`);
          const response = await axios.get(`https://backend-denuncias.onrender.com/api/denuncias/${id}`, { // Usamos 'id' directamente
            headers: { 'Authorization': `Bearer ${token}` }
          });
          const denunciaData = response.data;
          console.log('DenunciaFormPage - Datos de denuncia recibidos:', denunciaData);

          // Formatear la fecha para input type="date"
          const formattedDate = denunciaData.fecha_estado_actual 
            ? new Date(denunciaData.fecha_estado_actual).toISOString().split('T')[0] 
            : new Date().toISOString().split('T')[0];

          setFormData({
            tipo_denuncia: denunciaData.tipo_denuncia || '',
            titulo: denunciaData.titulo || '',
            descripcion: denunciaData.descripcion || '',
            direccion_incidente: denunciaData.direccion_incidente || '',
            comuna: denunciaData.comuna || '',
            estado_actual: denunciaData.estado_actual || 'Ingresada',
            fecha_estado_actual: formattedDate,
            nombre_denunciante: denunciaData.nombre_denunciante || '',
            p_apellido_denunciante: denunciaData.p_apellido_denunciante || '',
            s_apellido_denunciante: denunciaData.s_apellido_denunciante || '',
            email_denunciante: denunciaData.email_denunciante || '',
            telefono_denunciante: denunciaData.telefono_denunciante || '',
            id_denunciado: denunciaData.id_denunciado || null,
          });
          setMessage('Datos de denuncia cargados para edición.');
          setIsError(false);
        } catch (error) {
          console.error('DenunciaFormPage - Error al cargar datos de la denuncia:', error);
          let errorMessage = 'Error al cargar datos de la denuncia.';
          if (error.response && error.response.status === 401) {
            errorMessage = 'No autorizado para ver esta denuncia. Por favor, inicia sesión con las credenciales correctas.';
            navigate('/acceso-interno');
          } else if (error.response && error.response.data && error.response.data.message) {
            errorMessage = `Error: ${error.response.data.message}`;
          } else if (error.request) {
            errorMessage = 'Error de red: No se pudo conectar con el servidor. Asegúrate de que el backend esté corriendo y el endpoint /api/denuncias/:id exista.';
          }
          setMessage(errorMessage);
          setIsError(true);
        } finally {
          setIsLoading(false);
        }
      };
      fetchDenuncia();
    }
  }, [id, isEditing, navigate]); // Añadimos 'id' a las dependencias

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
        console.log(`DenunciaFormPage - Enviando PUT para actualizar denuncia con ID: ${id}`, formData);
        response = await axios.put(`https://backend-denuncias.onrender.com/api/denuncias/${id}`, formData, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
      } else {
        console.log('DenunciaFormPage - Enviando POST para crear nueva denuncia:', formData);
        response = await axios.post('https://backend-denuncias.onrender.com/api/denuncias/create', formData, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
      }

      if (response.status === 200 || response.status === 201) {
        setMessage(`Denuncia ${isEditing ? 'actualizada' : 'creada'} exitosamente.`);
        setIsError(false);
        setTimeout(() => navigate('/dashboard/denuncias'), 2000); 
      } else {
        setMessage(`Error: ${response.data.message || 'Hubo un problema al guardar la denuncia.'}`);
        setIsError(true);
      }
    } catch (error) {
      console.error('DenunciaFormPage - Error al guardar la denuncia:', error);
      let errorMessage = `Error al ${isEditing ? 'actualizar' : 'crear'} la denuncia. Por favor, inténtalo de nuevo.`;
      if (error.response && error.response.status === 401) {
        errorMessage = 'No autorizado. Tu sesión ha expirado o no tienes permisos.';
        navigate('/acceso-interno');
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
        <h2>{isEditing ? 'Editar Denuncia' : 'Crear Nueva Denuncia'}</h2>
        <p className="search-description">
          {isEditing ? 'Modifica los datos de la denuncia.' : 'Completa los datos para registrar una nueva denuncia.'}
        </p>

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

          {/* Campos adicionales para edición/uso interno */}
          {isEditing && (
            <>
              <h3>Estado y Gestión Interna</h3>
              <div className="form-group">
                <label htmlFor="estado_actual">Estado Actual:</label>
                <select
                  id="estado_actual"
                  name="estado_actual"
                  value={formData.estado_actual}
                  onChange={handleChange}
                  required
                >
                  <option value="Ingresada">Ingresada</option>
                  <option value="En Revisión">En Revisión</option>
                  <option value="En Proceso">En Proceso</option>
                  <option value="Resuelta">Resuelta</option>
                  <option value="Cerrada">Cerrada</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="fecha_estado_actual">Fecha de Última Actualización de Estado:</label>
                <input
                  type="date"
                  id="fecha_estado_actual"
                  name="fecha_estado_actual"
                  value={formData.fecha_estado_actual}
                  onChange={handleChange}
                  required
                />
              </div>
              {/* Puedes añadir más campos internos aquí como id_denunciado, notas internas, etc. */}
            </>
          )}

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
            {isLoading ? (isEditing ? 'Guardando...' : 'Creando...') : (isEditing ? 'Guardar Cambios' : 'Crear Denuncia')}
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

export default DenunciaFormPage;