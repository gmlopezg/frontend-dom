// --- src/components/Header/Header.jsx ---
import React from 'react';
import { Link } from 'react-router-dom';
import logoVA from '../../assets/logo_VA.png'; // Asegúrate de que la ruta sea correcta para tu logo

// ¡LA LÍNEA CLAVE! Importa los estilos CSS específicos para este componente.
import './Header.css';

function Header({ type = 'public', userName = 'Usuario', userRole = '', handleLogout }) {
  // Función para formatear el rol para mostrarlo de forma legible
  const formatRoleForDisplay = (role) => {
    if (!role) return 'Usuario Interno'; // Valor por defecto si el rol no está definido
    // Convierte el rol (ej. 'director_de_obras') a un formato legible (ej. 'Director de Obras')
    return role.replace(/_/g, ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  const displayRole = formatRoleForDisplay(userRole);

  return (
    <>
      {/* 1. Franja Superior (Delgada - Azul Marino) - Usa la clase 'top-nav' de tu Header.css */}
      <header className="top-nav">
        {/* Lógica condicional para mostrar "Iniciar Sesión" o "Bienvenido, [Rol Dinámico]" */}
        {type === 'public' ? (
          <div className="login-link">
            {/* Usamos Link para navegar a la página de login interno */}
            <Link to="/acceso-interno">
              Iniciar Sesión
            </Link>
          </div>
        ) : (
          <div className="welcome-message"> {/* Usa la clase 'welcome-message' de tu Header.css */}
            {/* Mensaje dinámico basado en el rol del usuario */}
            <span>Bienvenido, {displayRole}</span>
            <div className="logout-link"> {/* Usa la clase 'logout-link' de tu Header.css */}
              {/* El botón de cerrar sesión llama a la función handleLogout pasada por props */}
              <button
                onClick={handleLogout}
                title="Cerrar Sesión"
              >
                {/* Ícono de Font Awesome. Asegúrate de que Font Awesome esté enlazado en tu index.html */}
                <i className="fas fa-sign-out-alt"></i>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* 2. Franja Intermedia (Gruesa - Blanca) */}
      {/* Usa la clase 'header-branding' de tu Header.css */}
      <div className="header-branding">
        {/* Logo - Usa la clase 'logo' de tu Header.css */}
        <img src={logoVA} alt="Logo Municipalidad" className="logo" />

        {/* Contenedor del texto "DOM Dirección de Obras" - Usa la clase 'text-branding' de tu Header.css */}
        <div className="text-branding">
          {/* Texto "DOM" - Usa la clase 'dom-text' de tu Header.css */}
          <span className="dom-text">DOM</span>
          {/* Texto "Dirección de Obras" - Usa la clase 'sub-text' de tu Header.css */}
          <span className="sub-text">Dirección de Obras</span>
        </div>
      </div>
    </>
  );
}

export default Header;
