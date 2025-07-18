// --- src/routes/AppRoutes.js ---
import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';

// Importamos todos los componentes de las páginas
import Header from '../components/Header/Header.jsx'; 
import HomePage from '../pages/HomePage/HomePage.jsx';
import PublicFormPage from '../pages/PublicFormPage/PublicFormPage.jsx';
import DenunciaStatusPage from '../pages/DenunciaStatusPage/DenunciaStatusPage.jsx';
import LoginPage from '../pages/LoginPage/LoginPage.jsx'; // Login para usuarios internos (DOM)
import ContribuyenteLoginPage from '../pages/ContribuyenteLoginPage/ContribuyenteLoginPage.jsx'; // Login para contribuyentes
import DirectorDashboardPage from '../pages/DirectorDashboardPage/DirectorDashboardPage.jsx';
import UserFormPage from '../pages/UserFormPage/UserFormPage.jsx'; 
import DenunciaListPage from '../pages/DenunciaListPage/DenunciaListPage.jsx'; 
import DenunciaFormPage from '../pages/DenunciaFormPage/DenunciaFormPage.jsx'; 
import RegistroContribuyentePage from '../pages/RegistroContribuyentePage/RegistroContribuyentePage.jsx'; 
import ContribuyenteDashboardPage from '../pages/ContribuyenteDashboardPage/ContribuyenteDashboardPage.jsx'; 
import UserListPage from '../pages/UserListPage/UserListPage.jsx'; 

const AppRoutes = () => {
  const location = useLocation(); 

  const authToken = localStorage.getItem('authToken');
  const userName = localStorage.getItem('userName') || 'Usuario';
  const userRole = localStorage.getItem('userRole') || ''; // Obtener el rol del usuario

  // --- CORRECCIÓN CLAVE AQUÍ: Definición de headerType ---
  // Determina el tipo de Header a mostrar: 'internal' si hay token, 'public' si no
  const headerType = authToken ? 'internal' : 'public'; 

  // Define las rutas donde NO queremos que aparezca el Header global
  // Estas páginas suelen tener un header interno o no lo necesitan.
  const noGlobalHeaderRoutes = [
    '/dashboard/director', 
    '/dashboard/denuncias', 
    '/dashboard/denuncias/crear', 
    '/dashboard/denuncias/editar/:id',
    '/dashboard/contribuyente', 
    '/admin/usuarios', 
    '/admin/usuarios/crear', 
    '/admin/usuarios/editar/:id' 
  ]; 

  // Verifica si la ruta actual está en la lista de exclusión
  const shouldShowGlobalHeader = !noGlobalHeaderRoutes.includes(location.pathname);

  return (
    <>
      {/* Renderiza el Header condicionalmente, pasando el tipo, nombre y ROL */}
      {shouldShowGlobalHeader && <Header type={headerType} userName={userName} userRole={userRole} />} 
      
      <div className="main-app-content">
        <Routes>
          {/* Rutas Públicas */}
          <Route path="/" element={<HomePage />} />
          <Route path="/denunciar" element={<PublicFormPage />} /> 
          <Route path="/denuncias/status" element={<DenunciaStatusPage />} />
          <Route path="/denuncias/status/:publicId" element={<DenunciaStatusPage />} />
          <Route path="/registro-contribuyente" element={<RegistroContribuyentePage />} /> 
          <Route path="/acceso-contribuyente" element={<ContribuyenteLoginPage />} /> 

          {/* Ruta de Login para Usuarios DOM (Acceso Interno) */}
          <Route path="/acceso-interno" element={<LoginPage />} /> 
          
          {/* Rutas Protegidas de Dashboards y Gestión Interna */}
          <Route path="/dashboard/director" element={<DirectorDashboardPage />} /> 
          <Route path="/dashboard/denuncias" element={<DenunciaListPage />} /> 
          <Route path="/dashboard/denuncias/crear" element={<DenunciaFormPage />} /> 
          <Route path="/dashboard/denuncias/editar/:id" element={<DenunciaFormPage />} />
          <Route path="/dashboard/contribuyente" element={<ContribuyenteDashboardPage />} /> 

          {/* Rutas de Administración de Usuarios (para el rol de Administrador/Director) */}
          <Route path="/admin/usuarios" element={<UserListPage />} />
          <Route path="/admin/usuarios/crear" element={<UserFormPage />} />
          <Route path="/admin/usuarios/editar/:id" element={<UserFormPage />} />

          {/* Ruta por defecto para "no encontrado" (opcional) */}
          <Route path="*" element={<div>Página no encontrada</div>} />
        </Routes>
      </div>
    </>
  );
};

export default AppRoutes;
