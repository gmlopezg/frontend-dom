// --- src/pages/DirectorDashboardPage/DirectorDashboardPage.jsx ---
import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './DirectorDashboardPage.css'; // Importa los estilos CSS específicos para esta página

function DirectorDashboardPage() {
  const navigate = useNavigate();
  // userName se recupera para mostrar en el mini-header del dashboard
  const userName = localStorage.getItem('userName') || 'Director de Obras';

  // useEffect para verificar la autenticación al cargar la página
  useEffect(() => {
    const authToken = localStorage.getItem('authToken');
    const userRole = localStorage.getItem('userRole');

    console.log('DirectorDashboardPage - Verificando autenticación...');
    console.log('Auth Token:', authToken ? 'Presente' : 'Ausente');
    console.log('User Role (from localStorage):', userRole); // DEBUG

    // Si no hay token o el rol NO es 'director_de_obras', redirigir a la página de login
    // CAMBIO CLAVE AQUÍ: 'director_de_obras' en minúsculas y con guiones bajos
    if (!authToken || userRole !== 'director_de_obras') { 
      console.log('DirectorDashboardPage - Acceso denegado. Redirigiendo a login. Rol:', userRole);
      navigate('/acceso-interno'); // Redirige a la página de login
    } else {
      console.log('DirectorDashboardPage - Acceso permitido. Rol:', userRole);
    }
  }, [navigate]);

  // Función para cerrar sesión
  const handleLogout = () => {
    localStorage.removeItem('authToken'); // Elimina el token
    localStorage.removeItem('userRole'); // Elimina el rol
    localStorage.removeItem('userName'); // Elimina el nombre de usuario
    navigate('/acceso-interno'); // Redirige a la página de login
  };

  return (
    <main className="main-content dashboard-page">
      <div className="dashboard-grid-container">
        {/* Un pequeño header interno para mostrar el nombre del usuario y logout */}
        <div className="dashboard-internal-header">
          <h2>Bienvenido, {userName}</h2>
          <button onClick={handleLogout} className="logout-button-internal">
            <i className="fas fa-sign-out-alt"></i> Cerrar Sesión
          </button>
        </div>

        {/* Sección de Métricas Clave y Reportes (combinada) */}
        <div className="dashboard-section metrics-reports-section">
          <h2>Métricas Clave y Reportes</h2>
          <div className="metrics-container">
            <div className="metric-card">
              <i className="fas fa-exclamation-triangle metric-icon"></i>
              <h3>Denuncias Activas</h3>
              <p className="metric-value">125</p>
            </div>
            <div className="metric-card">
              <i className="fas fa-check-circle metric-icon"></i>
              <h3>Denuncias Resueltas (Mes)</h3>
              <p className="metric-value">48</p>
            </div>
            <div className="metric-card">
              <i className="fas fa-clock metric-icon"></i>
              <h3>Promedio Resolución</h3>
              <p className="metric-value">7 días</p>
            </div>
            <div className="metric-card">
              <i className="fas fa-map-marker-alt metric-icon"></i>
              <h3>Denuncias en Campo</h3>
              <p className="metric-value">62</p>
            </div>
          </div>
          
          <h3 className="subsection-title">Análisis y Generación de Informes</h3>
          <div className="action-buttons single-button">
            <button className="dashboard-button" onClick={() => alert('Redirigiendo a Generador de Reportes')}>
              <i className="fas fa-chart-line"></i> Generar Informes
            </button>
          </div>
        </div>

        {/* Contenedor para los cuadros de Gestión (Debajo del principal) */}
        <div className="bottom-management-grid">
          {/* Sección de Gestión de Denuncias */}
          <div className="dashboard-section management-section">
            <h2>Gestión de Denuncias</h2>
            <div className="action-buttons">
              <Link to="/dashboard/denuncias" className="dashboard-button">
                <i className="fas fa-list-alt"></i> Listado General
              </Link>
              <button className="dashboard-button" onClick={() => alert('Redirigiendo a Asignar Denuncia')}>
                <i className="fas fa-user-plus"></i> Asignar Denuncia
              </button>
            </div>
          </div>

          {/* Sección de Gestión de Usuarios Internos */}
          <div className="dashboard-section user-management-section">
            <h2>Gestión de Usuarios Internos</h2>
            <div className="action-buttons">
              <Link to="/admin/usuarios/crear" className="dashboard-button">
                <i className="fas fa-user-plus"></i> Crear Usuario
              </Link>
              <Link to="/admin/usuarios" className="dashboard-button"> {/* Enlace a la lista de usuarios */}
                <i className="fas fa-user-edit"></i> Listar/Editar Usuarios
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default DirectorDashboardPage;
