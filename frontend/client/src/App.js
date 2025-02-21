import * as React from 'react';
import { Routes, Route } from 'react-router-dom';  // Usar Routes y Route
import './App.css';
import Home from './pages/home/Home';  // Corregir la importación de la página 'Home'
import Navbar from './components/Navbar/Navbar';  // Corregir la importación de 'Navbar'
import Footer from './components/footer/Footer';  // Importar el componente Footer  
import Buses from './pages/buses/Buses';
import Gallery from './pages/gallery/Gallery';
import About from './pages/about/About';
import Register from './pages/register/Register';
import Login from './pages/login/Login';
import User from './pages/user/User';
import { AuthProvider } from './context/AuthContext';
import { ReportProvider } from './context/ReportContext';

const App = () => {
  return (
    <AuthProvider>
      <ReportProvider>
        <div>
          <Navbar />  {/* Usar el componente Navbar con la primera letra en mayúscula */}
          <Routes>  {/* Usar Routes para definir las rutas */}
            <Route path="/" element={<Home />} />  {/* Usar Home con la primera letra en mayúscula */}
            <Route path="/buses" element={<Buses />} />  {/* Usar Buses con la primera letra en mayúscula */}
            <Route path="/gallery" element={<Gallery />} />  {/* Usar Buses con la primera letra en mayúscula */} 
            <Route path="/about" element={<About />} />  {/* Usar Buses con la primera letra en mayúscula */} 
            <Route path="/register" element={<Register />} />  {/* Usar Buses con la primera letra en mayúscula */} 
            <Route path="/login" element={<Login />} />  {/* Usar Buses con la primera letra en mayúscula */} 
            <Route path="/user" element={<User />} />  {/* Usar Buses con la primera letra en mayúscula */} 
          </Routes>
          <Footer />  {/* Usar el componente Footer */}
        </div>
      </ReportProvider>
    </AuthProvider>
  );
};

export default App;
