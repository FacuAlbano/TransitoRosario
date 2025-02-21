import React from 'react';
import { Routes, Route } from 'react-router-dom';  // Usar Routes y Route
import './App.css';
import Home from './pages/Home';  // Corregir la importación de la página 'Home'
import Navbar from './components/Navbar/Navbar';  // Corregir la importación de 'Navbar'

const App = () => {
  return (
    <div>
      <Navbar />  {/* Usar el componente Navbar con la primera letra en mayúscula */}
      <Routes>  {/* Usar Routes para definir las rutas */}
        <Route path="/" element={<Home />} />  {/* Usar Home con la primera letra en mayúscula */}
      </Routes>
    </div>
  );
};

export default App;
