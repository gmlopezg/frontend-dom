// --- src/pages/LoginPage/LoginPage.jsx ---
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Usaremos axios directamente ya que no estás usando axiosInstance aquí
import './LoginPage.css';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setIsError(false);
    setIsLoading(true);

    try {
      // Asegúrate de que esta URL sea la correcta para tu backend
      const response = await axios.post('https://backend-denuncias.onrender.com/api/usuarios/login', { email, password });

      if (response.status === 200 && response.data.token) {
        const { token, user } = response.data;
        
        // --- CAMBIO CLAVE AQUÍ: Guardar el userId ---
        // user.id_usuario es el ID del usuario/contribuyente que viene del backend
        localStorage.setItem('userId', user.id_usuario); 
        console.log('LoginPage: Guardando userId en localStorage:', user.id_usuario); // DEBUG

        // Asegura que userName siempre tenga un valor válido
        const displayUserName = user.nombre_usuario || user.email || 'Usuario';
        localStorage.setItem('userName', displayUserName);
        console.log('LoginPage: Guardando userName en localStorage:', displayUserName); // DEBUG

        localStorage.setItem('authToken', token);
        localStorage.setItem('userRole', user.rol); // El rol debe venir del backend (ej. 'director_de_obras', 'inspector', 'administrador', 'contribuyente')
        console.log('LoginPage: Rol del usuario recibido del backend y guardado:', user.rol); // DEBUG

        setMessage('Inicio de sesión exitoso.');
        setIsError(false);

        // Redirige según el rol del usuario (usando los roles EXACTOS del backend en minúsculas)
        switch (user.rol) {
          case 'director_de_obras':
          case 'inspector':
          case 'administrador':
            navigate('/dashboard'); // Redirige al dashboard general para usuarios DOM
            break;
          case 'contribuyente':
            navigate('/contribuyente-dashboard'); // Redirige al dashboard del contribuyente
            break;
          default:
            // Si el rol no es reconocido, redirige a una página por defecto o muestra un error
            setMessage('Rol de usuario no reconocido. Contacta al administrador.');
            setIsError(true);
            localStorage.clear(); // Limpia la sesión si el rol no es válido
            navigate('/'); // O a una página de error/login
            break;
        }
      } else {
        setMessage('Credenciales incorrectas. Por favor, verifica tu email y contraseña.');
        setIsError(true);
      }
    } catch (error) {
      console.error('Error en el inicio de sesión:', error);
      let errorMessage = 'Error en el inicio de sesión. Inténtalo de nuevo.';
      if (error.response) {
        if (error.response.status === 401) {
          errorMessage = 'Credenciales incorrectas.';
        } else if (error.response.data && error.response.data.message) {
          errorMessage = `Error: ${error.response.data.message}`;
        }
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
      <div className="form-container login-container">
        <h2>Acceso para Usuarios Internos</h2>
        <p className="search-description">Ingresa tus credenciales para acceder al panel de gestión.</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Correo Electrónico:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="tu.usuario@dom.cl"
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Contraseña:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="********"
            />
          </div>
          <button type="submit" className="submit-button" disabled={isLoading}>
            {isLoading ? 'Ingresando...' : 'Iniciar Sesión'}
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

export default LoginPage;
