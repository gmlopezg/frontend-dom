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
      {/* Top Navigation Bar - Reemplazando .top-nav */}
      <header className="bg-gray-50 py-2 px-5 flex justify-end items-center border-b border-gray-200 text-sm text-gray-700">
        {/* Lógica condicional para mostrar "Iniciar Sesión" o "Bienvenido, [Rol Dinámico]" */}
        {type === 'public' ? (
          <div className="login-link">
            {/* Usamos Link para navegar a la página de login interno */}
            <Link to="/acceso-interno" className="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-300">
              Iniciar Sesión
            </Link>
          </div>
        ) : (
          <div className="flex items-center gap-4"> {/* Reemplazando .welcome-message */}
            {/* Mensaje dinámico basado en el rol del usuario */}
            <span className="text-gray-700">Bienvenido, {displayRole}</span>
            <div className="flex items-center"> {/* Reemplazando .logout-link */}
              {/* El botón de cerrar sesión llama a la función handleLogout pasada por props */}
              <button
                onClick={handleLogout}
                title="Cerrar Sesión"
                className="text-red-600 hover:text-red-700 transition-colors duration-300 focus:outline-none"
              >
                {/* Ícono de Font Awesome. Asegúrate de que Font Awesome esté enlazado en tu index.html */}
                <i className="fas fa-sign-out-alt text-lg"></i>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Header Branding Section (Logo and Text) - Reemplazando .header-branding */}
      <div className="relative bg-white shadow-md pt-4 pb-2 px-5 sm:px-4 flex items-center justify-center sm:flex-col sm:text-center">
        {/* Stripes - Reemplazando ::before y ::after con divs */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-blue-700"></div> {/* Primera franja (h-1.5 = 6px) */}
        <div className="absolute top-1.5 left-0 right-0 h-1.5 bg-yellow-400"></div> {/* Segunda franja (h-1.5 = 6px) */}

        <div className="flex items-center sm:flex-col sm:mb-2"> {/* Reemplazando .branding-content */}
          {/* Asegúrate de que tengas una imagen logo_VA.png en src/assets/ */}
          <img src={logoVA} alt="Logo Municipalidad" className="h-16 w-auto mr-4 sm:mr-0 sm:mb-2" /> {/* Reemplazando .logo */}
        </div>
        <div className="flex flex-col justify-center sm:items-center"> {/* Reemplazando .text-branding */}
          <span className="text-4xl font-bold text-gray-800 leading-tight sm:text-3xl">DOM</span> {/* Reemplazando .dom-text */}
          <span className="text-lg text-gray-600 leading-tight sm:text-base">Dirección de Obras</span> {/* Reemplazando .sub-text */}
        </div>
      </div>
    </>
  );
}

export default Header;
