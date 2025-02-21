import React, { useState } from 'react';
import Navbar from '../../components/Navbar/Navbar';    
import Footer from '../../components/footer/Footer';
import './Buses.css';



const lineasColectivos = [

  {

    id: 1,

    nombre: "Línea 101",

    recorrido: "Terminal de Ómnibus - Fisherton",

    horarios: "Lunes a Viernes: 5:00 - 23:00",

    paradas: [

      "Terminal de Ómnibus",

      "Plaza 25 de Mayo",

      "Hospital Provincial",

      "Shopping Fisherton",

    ],

    descripcion: "Conecta el centro con la zona oeste de la ciudad"

  },

  {

    id: 2,

    nombre: "Línea 102",

    recorrido: "Zona Sur - Zona Norte",

    horarios: "Lunes a Domingo: 4:30 - 23:30",

    paradas: [

      "Barrio Las Flores",

      "Parque Independencia",

      "Monumento a la Bandera",

      "Barrio Alberdi",

    ],

    descripcion: "Atraviesa la ciudad de sur a norte"

  },

  // Agregar más líneas aquí

];



function Buses() {

  const [lineaSeleccionada, setLineaSeleccionada] = useState(null);



  const handleMouseEnter = (linea) => {

    setLineaSeleccionada(linea);

  };



  const handleMouseLeave = () => {

    setLineaSeleccionada(null);

  };



  return (

    <div className="colectivos-page">

      <main className="colectivos-content">

        <h1>Líneas de Colectivos</h1>

        <div className="lineas-grid">

          {lineasColectivos.map(linea => (

            <div

              key={linea.id}

              className="linea-card"

              onMouseEnter={() => handleMouseEnter(linea)}

              onMouseLeave={handleMouseLeave}

            >

              <h2>{linea.nombre}</h2>

              <p className="recorrido">{linea.recorrido}</p>

              

              {lineaSeleccionada?.id === linea.id && (

                <div className="linea-info">

                  <div className="info-section">

                    <h3>Horarios</h3>

                    <p>{linea.horarios}</p>

                  </div>

                  

                  <div className="info-section">

                    <h3>Paradas Principales</h3>

                    <ul>

                      {linea.paradas.map((parada, index) => (

                        <li key={index}>{parada}</li>

                      ))}

                    </ul>

                  </div>

                  

                  <div className="info-section">

                    <h3>Descripción</h3>

                    <p>{linea.descripcion}</p>

                  </div>

                </div>

              )}

            </div>

          ))}

        </div>

      </main>

    </div>

  );

}



export default Buses;
