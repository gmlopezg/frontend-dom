// src/pages/HomePage/HomePage.jsx
import React from 'react';
import { Link } from 'react-router-dom'; // Importa Link de React Router para la navegación
import './HomePage.css'; // Importa los estilos específicos de esta página

function HomePage() {
  return (
    // Ya no renderizamos el Header aquí, AppRoutes lo hace condicionalmente
    <main className="main-content">
      <div className="card-container">
        <div className="action-card">
          <h2>Realizar una Nueva Denuncia</h2>
          <p>Reporta un incidente o situación para que la DOM lo investigue.</p>
          <Link to="/denunciar" className="button-link">Iniciar Denuncia</Link> {/* Ruta actualizada a /denunciar */}
        </div>

        <div className="action-card">
          <h2>Consultar Estado de tu Denuncia</h2>
          <p>Introduce tu ID público para conocer el avance de tu caso.</p>
          <Link to="/denuncias/status" className="button-link">Consultar Estado</Link>
        </div>
      </div>
    </main>
  );
}

export default HomePage;
