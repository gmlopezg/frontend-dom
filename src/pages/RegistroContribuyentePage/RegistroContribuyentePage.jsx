// --- src/pages/RegistroContribuyentePage/RegistroContribuyentePage.jsx ---
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import './RegistroContribuyentePage.css'; // Importa los estilos CSS específicos para esta página

function RegistroContribuyentePage() {
  console.log('RegistroContribuyentePage: Componente cargado.');

  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    nombre_contribuyente: '',
    p_apellido_contribuyente: '',
    s_apellido_contribuyente: '',
    rut: '',
    email_contribuyente: '', 
    telefono: '',
    password: '',
  });

  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    console.log('RegistroContribuyentePage: useEffect - Estado de navegación recibido:', location.state);
    if (location.state) {
      const { nombre, p_apellido, s_apellido, email, telefono } = location.state;
      setFormData(prevData => ({
        ...prevData,
        nombre_contribuyente: nombre || prevData.nombre_contribuyente,
        p_apellido_contribuyente: p_apellido || prevData.p_apellido_contribuyente,
        s_apellido_contribuyente: s_apellido || prevData.s_apellido_contribuyente,
        email_contribuyente: email || prevData.email_contribuyente, 
        telefono: telefono || prevData.telefono,
      }));
      setMessage('Datos precargados desde la denuncia.');
      setIsError(false);
    }
  }, [location.state]);

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
      console.log('RegistroContribuyentePage: Datos de formData a enviar:', formData); 
      
      const response = await axios.post('https://backend-denuncias.onrender.com/api/contribuyentes/register', formData);

      if (response.status === 201) {
        setMessage('¡Registro exitoso! Ya puedes iniciar sesión con tu correo y contraseña.');
        setIsError(false);
        // ¡LÍNEA CLAVE! Redirige al login de contribuyentes
        setTimeout(() => navigate('/acceso-contribuyente'), 3000); 
      } else {
        setMessage(`Error al registrar: ${response.data.message || 'Hubo un problema al intentar registrarte.'}`);
        setIsError(true);
      }
    } catch (error) {
      console.error('RegistroContribuyentePage: Error al registrar contribuyente:', error);
      let errorMessage = 'Error al registrarte. Por favor, inténtalo de nuevo.';
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

  console.log('RegistroContribuyentePage: Renderizando JSX.');

  return (
    <main className="main-content form-page">
      <div className="form-container">
        <h2>Registro de Contribuyente</h2>
        <p className="search-description">
          Crea una cuenta para gestionar tus denuncias y acceder a más funcionalidades.
        </p>

        <form onSubmit={handleSubmit}>
          <h3>Datos Personales</h3>
          <div className="form-group">
            <label htmlFor="nombre_contribuyente">Nombre:</label>
            <input
              type="text"
              id="nombre_contribuyente"
              name="nombre_contribuyente"
              value={formData.nombre_contribuyente}
              onChange={handleChange}
              required
              placeholder="Tu nombre"
            />
          </div>
          <div className="form-group">
            <label htmlFor="p_apellido_contribuyente">Primer Apellido:</label>
            <input
              type="text"
              id="p_apellido_contribuyente"
              name="p_apellido_contribuyente"
              value={formData.p_apellido_contribuyente}
              onChange={handleChange}
              required
              placeholder="Tu primer apellido"
            />
          </div>
          <div className="form-group">
            <label htmlFor="s_apellido_contribuyente">Segundo Apellido:</label>
            <input
              type="text"
              id="s_apellido_contribuyente"
              name="s_apellido_contribuyente"
              value={formData.s_apellido_contribuyente}
              onChange={handleChange}
              placeholder="Tu segundo apellido (opcional)"
            />
          </div>
          <div className="form-group">
            <label htmlFor="rut">RUT:</label>
            <input
              type="text"
              id="rut"
              name="rut"
              value={formData.rut}
              onChange={handleChange}
              required
              placeholder="Ej: 12.345.678-9"
            />
          </div>
          <div className="form-group">
            <label htmlFor="telefono">Teléfono:</label>
            <input
              type="tel"
              id="telefono"
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
              placeholder="+56912345678"
            />
          </div>

          <h3>Datos de Acceso</h3>
          <div className="form-group">
            <label htmlFor="email_contribuyente">Correo Electrónico:</label>
            <input
              type="email"
              id="email_contribuyente"
              name="email_contribuyente"
              value={formData.email_contribuyente}
              onChange={handleChange}
              required
              placeholder="tu.correo@ejemplo.com"
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Contraseña:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="********"
            />
          </div>

          <button type="submit" className="submit-button" disabled={isLoading}>
            {isLoading ? 'Registrando...' : 'Registrarme'}
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

export default RegistroContribuyentePage;