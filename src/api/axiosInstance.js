// --- src/api/axiosInstance.js ---
import axios from 'axios';


const axiosInstance = axios.create({
  baseURL: 'https://backend-denuncias.onrender.com/api', 
  headers: {
    'Content-Type': 'application/json',
  },
});


axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken'); // Obtiene el token del localStorage
    if (token) {
      // Si hay un token, lo añade al encabezado de autorización como un Bearer token
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config; // Retorna la configuración modificada de la solicitud
  },
  (error) => {
    // Maneja cualquier error que ocurra antes de enviar la solicitud
    return Promise.reject(error);
  }
);


axiosInstance.interceptors.response.use(
  (response) => response, // Si la respuesta es exitosa, simplemente la retorna
  (error) => {
    // Si la respuesta es un error y el estado es 401 (No autorizado)
    if (error.response && error.response.status === 401) {
      console.error('Axios Interceptor: 401 Unauthorized. Clearing token and redirecting to login.');
      localStorage.clear(); // Limpia todo el localStorage (token, rol, nombre de usuario, etc.)
      // Nota: La redirección a la página de login es manejada por el ProtectedLayout
      // en AppRoutes.jsx al detectar que no hay un token válido o que el rol no es permitido.
      // No necesitamos una redirección explícita aquí con window.location.href.
    }
    return Promise.reject(error); // Retorna el error para que sea manejado por el componente que hizo la solicitud
  }
);

export default axiosInstance; // Exporta la instancia de Axios configurada
