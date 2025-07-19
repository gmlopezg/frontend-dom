// --- src/pages/LoginPage/LoginPage.jsx ---
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
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
      const response = await axios.post('http://backend-denuncias.onrender.com/api/usuarios/login', { email, password });

      if (response.status === 200 && response.data.token) {
        const { token, user } = response.data;
        
        // --- CAMBIO CLAVE AQUÍ: Asegura que userName siempre tenga un valor válido ---
        // Prioriza nombre_usuario, luego email, luego un genérico
        const displayUserName = user.nombre_usuario || user.email || 'Usuario Interno';
        localStorage.setItem('userName', displayUserName);
        console.log('LoginPage: Guardando userName en localStorage:', displayUserName); // DEBUG

        localStorage.setItem('authToken', token);
        localStorage.setItem('userRole', user.rol); // El rol debe venir del backend (ej. 'director_de_obras', 'inspector', 'administrador')
        console.log('LoginPage: Rol del usuario recibido del backend y guardado:', user.rol); // DEBUG

        setMessage('Inicio de sesión exitoso.');
        setIsError(false);

        // Redirige según el rol del usuario (usando los roles EXACTOS del backend en minúsculas)
        switch (user.rol) {
          case 'director_de_obras': 
            navigate('/dashboard/director');
            break;
          case 'inspector':
            navigate('/dashboard/inspector'); // Asegúrate de tener esta ruta si existe
            break;
          case 'administrador':
            navigate('/dashboard/administrador'); // Asegúrate de tener esta ruta si existe
            break;
          default:
            navigate('/');
            break;
        }
      } else {
        setMessage('Credenciales incorrectas. Por favor, verifica tu email y contraseña.');
        setIsError(true);
      }
    } catch (error) {
      console.error('Error en el inicio de sesión:', error);
      let errorMessage = 'Error en el inicio de sesión. Inténtalo de nuevo.';
      if (error.response && error.response.data && error.response.data.message) {
        errorMessage = `Error: ${error.response.data.message}`;
      } else if (error.response && error.response.status === 401) {
        errorMessage = 'Credenciales incorrectas.';
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
