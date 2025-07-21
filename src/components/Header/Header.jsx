// --- src/components/Header/Header.jsx ---
import React from 'react';
import { Link } from 'react-router-dom';
import logoVA from '../../assets/logo_VA.png'; // Asegúrate de que la ruta sea correcta para tu logo

// Componente Header reutilizable
// Recibe props para adaptar su contenido (login/logout, mensaje de bienvenida)
// Añadimos 'userRole' y 'handleLogout' a las props para la lógica de sesión
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
      {/* 1. Franja Superior (Delgada - Azul Marino) - Usa la clase 'top-nav' de tu CSS */}
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
          <div className="welcome-message"> {/* Usa la clase 'welcome-message' de tu CSS */}
            {/* Mensaje dinámico basado en el rol del usuario */}
            <span>Bienvenido, {displayRole}</span>
            <div className="logout-link"> {/* Usa la clase 'logout-link' de tu CSS */}
              {/* El botón de cerrar sesión llama a la función handleLogout pasada por props */}
              <button
                onClick={handleLogout}
                title="Cerrar Sesión"

                className="text-white hover:text-gray-200 transition-colors duration-300 focus:outline-none"
              >
                {/* Ícono de Font Awesome. Font Awesome enlazado en index.html */}
                <i className="fas fa-sign-out-alt text-lg"></i>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* 2. Franja Intermedia (Gruesa - Blanca) */}
      {/* Usa la clase 'header-branding' de tu CSS, que ya tiene display: flex y justify-content: space-between */}
      <div className="header-branding">
        {/* Logo - Es el primer hijo directo, se alineará a la izquierda */}
        <img src={logoVA} alt="Logo Municipalidad" className="logo" />

        {/* Contenedor del texto "DOM Dirección de Obras" - Es el segundo hijo directo, se alineará a la derecha */}
        <div className="text-branding">
          {/* Texto "DOM" - Usa la clase 'dom-text' de tu CSS */}
          <span className="dom-text">DOM</span>
          {/* Texto "Dirección de Obras" - Usa la clase 'sub-text' de tu CSS */}
          <span className="sub-text">Dirección de Obras</span>
        </div>
      </div>
    </>
  );
}

export default Header;
