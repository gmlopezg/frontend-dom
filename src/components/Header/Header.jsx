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
      {/* 1. Franja superior (Top Navigation Bar - equivalente a .top-nav) */}
      {/* Fondo azul oscuro (#004080) y texto blanco, alineado a la derecha */}
      <header className="bg-[#004080] text-white py-1 px-5 flex justify-end items-center text-sm">
        {/* Lógica condicional para mostrar "Iniciar Sesión" o "Bienvenido, [Rol Dinámico]" */}
        {type === 'public' ? (
          <div className="login-link">
            {/* Usamos Link para navegar a la página de login interno */}
            <Link to="/acceso-interno" className="text-white hover:text-gray-200 font-medium transition-colors duration-300">
              Iniciar Sesión
            </Link>
          </div>
        ) : (
          <div className="flex items-center gap-4"> {/* Mensaje de bienvenida y botón de cerrar sesión */}
            {/* Mensaje dinámico basado en el rol del usuario */}
            <span className="text-white">Bienvenido, {displayRole}</span>
            <div className="flex items-center">
              {/* El botón de cerrar sesión llama a la función handleLogout pasada por props */}
              <button
                onClick={handleLogout}
                title="Cerrar Sesión"
                className="text-white hover:text-gray-200 transition-colors duration-300 focus:outline-none"
              >
                {/* Ícono de Font Awesome. Asegúrate de que Font Awesome esté enlazado en tu index.html */}
                <i className="fas fa-sign-out-alt text-lg"></i>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* 2. Sección principal del encabezado (Header Branding - equivalente a .header-branding) */}
      {/* Contiene las franjas azul/blanca, el logo y el texto "DOM Dirección de Obras" */}
      <div className="relative bg-white shadow-md py-4 px-5 sm:px-4 flex items-center min-h-[80px]">
        {/* Franjas decorativas (equivalente a ::before y ::after de .header-branding) */}
        {/* Estas franjas están dentro de esta sección, en la parte superior */}
        <div className="absolute top-0 left-0 right-0 h-[6px] bg-[#004080]"></div> {/* Franja azul oscura */}
        <div className="absolute top-[6px] left-0 right-0 h-[6px] bg-white"></div> {/* Franja blanca */}

        {/* Contenido principal: Logo y Texto */}
        <div className="flex items-center sm:flex-col sm:text-center sm:w-full"> {/* Equivalente a .branding-content */}
          {/* Logo (equivalente a .logo) */}
          {/* Asegúrate de que tengas una imagen logo_VA.png en src/assets/ */}
          <img src={logoVA} alt="Logo Municipalidad" className="h-[60px] w-auto mr-4 sm:mr-0 sm:mb-2" /> {/* Altura de 60px */}

          {/* Contenedor del texto "DOM Dirección de Obras" (equivalente a .text-branding) */}
          <div className="flex flex-col justify-center sm:items-center">
            {/* Texto "DOM" (equivalente a .dom-text) */}
            <span className="text-[2.5em] font-bold text-[#004080] leading-none sm:text-3xl">DOM</span>
            {/* Texto "Dirección de Obras" (equivalente a .sub-text) */}
            <span className="text-[1.1em] text-gray-600 leading-tight sm:text-base">Dirección de Obras</span>
          </div>
        </div>
      </div>
    </>
  );
}

export default Header;
