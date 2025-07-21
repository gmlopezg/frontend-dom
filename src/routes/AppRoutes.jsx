// --- src/routes/AppRoutes.jsx ---
import React, { useState, useEffect, useRef } from 'react';
import { Routes, Route, useNavigate, Link, Outlet, useOutletContext } from 'react-router-dom';

// Importa tu instancia de Axios (asegúrate de que la ruta sea correcta)
import axiosInstance from '../api/axiosInstance';

// --- Importamos el componente Header ---
import Header from '../components/Header/Header.jsx';

// --- Importamos todos los componentes de las páginas ---
// Componentes Públicos
import HomePage from '../pages/HomePage/HomePage.jsx';
import PublicFormPage from '../pages/PublicFormPage/PublicFormPage.jsx';
import DenunciaStatusPage from '../pages/DenunciaStatusPage/DenunciaStatusPage.jsx';
import RegistroContribuyentePage from '../pages/RegistroContribuyentePage/RegistroContribuyentePage.jsx';

// Componentes de Login
import LoginPage from '../pages/LoginPage/LoginPage.jsx'; // Login para usuarios internos (DOM)
import ContribuyenteLoginPage from '../pages/ContribuyenteLoginPage/ContribuyenteLoginPage.jsx'; // Login para contribuyentes

// Componentes de Dashboards y Gestión Interna
import DirectorDashboardPage from '../pages/DirectorDashboardPage/DirectorDashboardPage.jsx';
import ContribuyenteDashboardPage from '../pages/ContribuyenteDashboardPage/ContribuyenteDashboardPage.jsx';
import DenunciaListPage from '../pages/DenunciaListPage/DenunciaListPage.jsx';
import DenunciaFormPage from '../pages/DenunciaFormPage/DenunciaFormPage.jsx';
import UserListPage from '../pages/UserListPage/UserListPage.jsx';
import UserFormPage from '../pages/UserFormPage/UserFormPage.jsx';

// --- Componente ProtectedLayout ---
// Este componente envuelve las rutas que requieren autenticación
const ProtectedLayout = () => {
  const [userRole, setUserRole] = useState(null);
  const [userName, setUserName] = useState(null);
  const [userId, setUserId] = useState(null); // Para pasar el userId a los componentes hijos si es necesario
  const navigate = useNavigate();

  useEffect(() => {
    const storedAuthToken = localStorage.getItem('authToken');
    const storedUserRole = localStorage.getItem('userRole');
    const storedUserName = localStorage.getItem('userName');
    const storedUserId = localStorage.getItem('userId'); // Obtener el userId/contribuyenteId

    // Definir los roles que pueden usar este layout
    const allowedRoles = ['director_de_obras', 'contribuyente', 'administrador', 'inspector'];

    // Verificar si hay token y el rol es uno de los permitidos
    if (storedAuthToken && allowedRoles.includes(storedUserRole)) {
      setUserRole(storedUserRole);
      setUserName(storedUserName);
      setUserId(storedUserId); // Establecer el userId
    } else {
      // Si no está autenticado o el rol no es correcto, limpiar y redirigir
      localStorage.clear(); // Limpia todos los datos de sesión
      setUserRole(null);
      setUserName(null);
      setUserId(null);
      console.log('ProtectedLayout: Acceso denegado. Redirigiendo a login.');
      // Redirige al login apropiado
      if (storedUserRole === 'contribuyente') {
        navigate('/acceso-contribuyente', { replace: true });
      } else {
        navigate('/acceso-interno', { replace: true });
      }
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear(); // Limpia todo el localStorage relacionado con la sesión
    setUserRole(null);
    setUserName(null);
    setUserId(null);
    console.log('ProtectedLayout: Sesión cerrada. Redirigiendo a login.');
    // Redirige al login apropiado después de cerrar sesión
    // Podrías tener una lógica más sofisticada aquí si hay múltiples tipos de login
    navigate('/acceso-interno', { replace: true });
  };

  // Mostrar un spinner o nada mientras se verifica la autenticación
  if (!userRole) {
    return (
      <div className="loading-message-container">
        <div className="loading-message">Cargando...</div>
      </div>
    );
  }

  // Si está autenticado, renderizar el Header y el contenido de la ruta hija
  return (
    <div className="protected-layout-container">
      {/* Aquí usamos el componente Header. Le pasamos el tipo 'private' y los datos del usuario */}
      <Header type="private" userName={userName} userRole={userRole} handleLogout={handleLogout} />
      <div className="protected-layout-content">
        {/* Outlet pasa las props userRole, userName, userId, handleLogout a los componentes hijos */}
        <Outlet context={{ userRole, userName, userId, handleLogout }} />
      </div>
    </div>
  );
};


// --- Componente principal de rutas ---
const AppRoutes = () => {
  return (
    <Routes>
      {/* Rutas Públicas (no requieren autenticación) */}
      {/* La HomePage también usará el Header, pero con type="public" */}
      <Route path="/" element={<><Header type="public" /><HomePage /></>} />
      <Route path="/denunciar" element={<><Header type="public" /><PublicFormPage /></>} />
      <Route path="/denuncias/status" element={<><Header type="public" /><DenunciaStatusPage /></>} />
      <Route path="/denuncias/status/:publicId" element={<><Header type="public" /><DenunciaStatusPage /></>} />
      <Route path="/registro-contribuyente" element={<><Header type="public" /><RegistroContribuyentePage /></>} />

      {/* Rutas de Login */}
      <Route path="/acceso-interno" element={<LoginPage />} />
      <Route path="/acceso-contribuyente" element={<ContribuyenteLoginPage />} />

      {/* Rutas Protegidas por el ProtectedLayout */}
      {/* Todas las rutas anidadas aquí tendrán el Header y la lógica de autenticación */}
      <Route element={<ProtectedLayout />}>
        {/* Rutas para Director de Obras y otros usuarios DOM */}
        <Route path="/dashboard" element={<DirectorDashboardPage />} />
        <Route path="/dashboard/denuncias" element={<DenunciaListPage />} />
        <Route path="/dashboard/denuncias/crear" element={<DenunciaFormPage />} />
        <Route path="/dashboard/denuncias/editar/:id" element={<DenunciaFormPage />} />

        {/* Rutas de Administración de Usuarios (para el rol de Administrador/Director) */}
        <Route path="/admin/usuarios" element={<UserListPage />} />
        <Route path="/admin/usuarios/crear" element={<UserFormPage />} />
        <Route path="/admin/usuarios/editar/:id" element={<UserFormPage />} />

        {/* Rutas para Contribuyente */}
        <Route path="/contribuyente-dashboard" element={<ContribuyenteDashboardPage />} />
        {/* Puedes añadir más rutas específicas para el contribuyente aquí */}
      </Route>

      {/* Ruta de fallback para cualquier otra URL no definida */}
      <Route path="*" element={
        <div className="not-found-message">
          Página no encontrada (404)
        </div>
      } />
    </Routes>
  );
};

export default AppRoutes;
