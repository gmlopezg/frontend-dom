// --- src/pages/ContribuyenteLoginPage/ContribuyenteLoginPage.jsx ---
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios'; // Usas axios directamente aquí, no axiosInstance
import './ContribuyenteLoginPage.css'; // Importa los estilos CSS específicos

function ContribuyenteLoginPage() {
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
      const response = await axios.post('https://backend-denuncias.onrender.com/api/contribuyentes/login', {
        email_contribuyente: email,
        password
      });

      if (response.status === 200 && response.data.token) {
        const { token, contribuyente } = response.data;
        localStorage.setItem('authToken', token);
        localStorage.setItem('userRole', 'contribuyente');

        // Asegurar que userName siempre tenga un valor
        const displayUserName = contribuyente.nombre_contribuyente || contribuyente.email_contribuyente || 'Contribuyente';
        localStorage.setItem('userName', displayUserName);

        // --- ¡LA CORRECCIÓN CLAVE ESTÁ AQUÍ! ---
        // Guarda el ID del contribuyente bajo la clave 'userId'
        localStorage.setItem('userId', contribuyente.id_contribuyente);

        setMessage('Inicio de sesión exitoso como Contribuyente.');
        setIsError(false);

        // Redirige al dashboard del contribuyente
        navigate('/contribuyente-dashboard');

      } else {
        setMessage('Credenciales incorrectas. Por favor, verifica tu email y contraseña.');
        setIsError(true);
      }
    } catch (error) {
      console.error('Error en el inicio de sesión del contribuyente:', error);
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
        <h2>Acceso para Contribuyentes</h2>
        <p className="search-description">Ingresa tus credenciales para acceder a tus denuncias.</p>

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
              placeholder="tu.correo@ejemplo.com"
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

        <div className="register-link">
          <p>¿No tienes una cuenta? <Link to="/registro-contribuyente">Regístrate aquí</Link></p>
        </div>
      </div>
    </main>
  );
}

export default ContribuyenteLoginPage;
