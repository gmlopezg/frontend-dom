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
                // Mantiene algunas clases Tailwind aquí para el hover y el focus,
                // ya que el CSS define el estilo para 'a' dentro de logout-link, no para 'button'.
                className="text-white hover:text-gray-200 transition-colors duration-300 focus:outline-none"
              >
                {/* Ícono de Font Awesome. Font Awesome enlazado en el index.html */}
                <i className="fas fa-sign-out-alt text-lg"></i>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* 2. Franja Intermedia (Gruesa - Blanca) - Usar la clase 'header-branding' de tu CSS */}
      {/* top-0, left-0, right-0 la posicionan en la parte superior del contenedor relativo */}
      {/* h-[6px] le da la altura, bg-[#004080] el color, z-10 asegura que esté por encima */}
      <div className="relative header-branding">
        {/* Franja azul oscura (la más superior) */}
        <div className="absolute top-0 left-0 right-0 h-[6px] bg-[#004080] z-10"></div>
        {/* Franja blanca (justo debajo de la azul) */}
        <div className="absolute top-[6px] left-0 right-0 h-[6px] bg-white z-10"></div>

        {/* Contenido principal: Logo y Texto. Aseguramos que este contenido esté debajo de las franjas */}
        {/* Añadimos pt-[12px] para que el contenido empiece debajo de las dos franjas de 6px cada una */}
        <div className="flex items-center justify-between w-full pt-[12px]"> {/* Usamos justify-between aquí */}
          {/* Logo - Usa la clase 'logo' de tu CSS */}
          {/* Asegúrate de que tengas una imagen logo_VA.png en src/assets/ */}
          <img src={logoVA} alt="Logo Municipalidad" className="logo" />

          {/* Contenedor del texto "DOM Dirección de Obras" - Usa la clase 'text-branding' de tu CSS */}
          <div className="text-branding">
            {/* Texto "DOM" - Usa la clase 'dom-text' de tu CSS */}
            <span className="dom-text">DOM</span>
            {/* Texto "Dirección de Obras" - Usa la clase 'sub-text' de tu CSS */}
            <span className="sub-text">Dirección de Obras</span>
          </div>
        </div>
      </div>
    </>
  );
}

export default Header;
