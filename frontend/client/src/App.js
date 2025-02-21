import React from 'react';
import { Routes, Route } from 'react-router-dom';  // Usar Routes y Route
import './App.css';
import Home from './pages/home/Home';  // Corregir la importación de la página 'Home'
import Navbar from './components/Navbar/Navbar';  // Corregir la importación de 'Navbar'
import Footer from './components/footer/Footer';  // Importar el componente Footer  
// eslint-disable-next-line
import Buses from './pages/buses/Buses';

const App = () => {
  return (
    <div>
      <Navbar />  {/* Usar el componente Navbar con la primera letra en mayúscula */}
      <Routes>  {/* Usar Routes para definir las rutas */}
        <Route path="/" element={<Home />} />  {/* Usar Home con la primera letra en mayúscula */}
        <Route path="/Buses" element={<Buses />} />  {/* Usar Buses con la primera letra en mayúscula */}
      </Routes>
      <Footer />  {/* Usar el componente Footer */}
    </div>
  );
};

export default App;
