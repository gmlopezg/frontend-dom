// --- src/components/Header/Header.jsx ---
import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css'; // Importa los estilos CSS específicos para este componente
import logoVA from '../../assets/logo_VA.png'; // Asegúrate de que la ruta sea correcta

// Este componente Header será reutilizable en todas las páginas
// Recibe props para adaptar su contenido (login/logout, mensaje de bienvenida)
// Añadimos 'userRole' a las props para el mensaje dinámico
function Header({ type = 'public', userName = 'Usuario', userRole = '' }) { // Añadimos userRole prop
  // Función para formatear el rol para mostrarlo de forma legible
  const formatRoleForDisplay = (role) => {
    if (!role) return 'Usuario Interno'; // Valor por defecto si el rol no está definido
    // Convierte el rol (ej. 'director_de_obras') a un formato legible (ej. 'Director de Obras')
    return role.replace(/_/g, ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  const displayRole = formatRoleForDisplay(userRole);

  return (
    <> {/* Fragmento para agrupar múltiples elementos */}
      <header className="top-nav">
        {/* Lógica condicional para mostrar "Iniciar Sesión" o "Bienvenido, [Rol Dinámico]" */}
        {type === 'public' ? (
          <div className="login-link">
            <Link to="/acceso-interno">Iniciar Sesión</Link> {/* Usamos Link para navegar */}
          </div>
        ) : (
          <div className="welcome-message">
            {/* CAMBIO AQUÍ: Mensaje dinámico basado en el rol del usuario */}
            <span>Bienvenido, {displayRole}</span> {/* Usa el rol formateado */}
            <div className="logout-link">
              {/* El enlace de cerrar sesión redirige al login. La lógica de limpieza de token
                  se manejará en el componente LoginPage o en un contexto de autenticación. */}
              <Link to="/acceso-interno" title="Cerrar Sesión">
                <i className="fas fa-sign-out-alt"></i> {/* Ícono de Font Awesome */}
              </Link>
            </div>
          </div>
        )}
      </header>

      <div className="header-branding">
        <div className="branding-content">
          {/* Asegúrate de que tengas una imagen logo_VA.png en src/assets/ */}
          <img src={logoVA} alt="Logo Municipalidad" className="logo" />
        </div>
        <div className="text-branding">
          <span className="dom-text">DOM</span>
          <span className="sub-text">Dirección de Obras</span>
        </div>
      </div>
    </>
  );
}

export default Header;
