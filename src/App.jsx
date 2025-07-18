// src/App.js
import React from 'react';
import AppRoutes from './routes/AppRoutes.jsx'; // Importa tus rutas
import './App.css'; // O './App.module.css'

function App() {
  return (
    <div className="App">
      {/* Aquí se renderizarán todas las rutas definidas en AppRoutes */}
      <AppRoutes />
    </div>
  );
}

export default App;