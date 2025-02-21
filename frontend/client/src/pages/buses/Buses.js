import React, { useState } from 'react';
import './Buses.css';

const lineasColectivos = [
  {
    id: 1,
    nombre: "Enlace Avellaneda Oeste",
    recorrido: "Desde calle Rouillón y Av. Pte. Perón hasta Aborígenes Argentino",
    horarios: "Lunes a Viernes: 5:00 - 23:00",
    paradas: [
      "Rouillón y Av. Pte. Perón",
      "Cisneros",
      "Matienzo",
      "Felipe More",
      "Aborígenes Argentino"
    ],
    descripcion: "Conecta la zona oeste de Avellaneda"
  },
  {
    id: 2,
    nombre: "Línea 101 Negra",
    recorrido: "Terminal de Ómnibus - Riobamba",
    horarios: "Lunes a Domingo: 4:30 - 23:30",
    paradas: [
      "Terminal de Ómnibus",
      "Av. Provincias Unidas",
      "Bv. Avellaneda",
      "San Lorenzo",
      "Riobamba"
    ],
    descripcion: "Conecta la Terminal de Ómnibus con el centro y zona norte"
  },
  {
    id: 3,
    nombre: "Línea 101 Roja",
    recorrido: "Av. Provincias Unidas - Riobamba",
    horarios: "Lunes a Domingo: 5:00 - 22:30",
    paradas: [
      "Av. Provincias Unidas",
      "Bv. Avellaneda",
      "San Lorenzo",
      "Av. Pellegrini",
      "Riobamba"
    ],
    descripcion: "Conecta la zona oeste con el centro de la ciudad"
  },
  {
    id: 4,
    nombre: "Línea 102 144 Negra",
    recorrido: "Chumbicha - J.M. Gutiérrez",
    horarios: "Lunes a Domingo: 5:00 - 23:00",
    paradas: [
      "Chumbicha",
      "Palestina",
      "Av. Kennedy",
      "Bv. Rondeau",
      "J.M. Gutiérrez"
    ],
    descripcion: "Conecta la zona noroeste con el sur de la ciudad"
  },
  {
    id: 5,
    nombre: "Línea 102 Roja",
    recorrido: "Ibarlucea - Riobamba",
    horarios: "Lunes a Domingo: 4:30 - 23:00",
    paradas: [
      "Canal arroyo Ibarlucea",
      "Villa del Parque",
      "Av. Casiano Casas",
      "Bv. Avellaneda",
      "Riobamba"
    ],
    descripcion: "Conecta Ibarlucea con el centro de Rosario"
  },
  {
    id: 6,
    nombre: "Línea 103 Negra",
    recorrido: "Granadero Baigorria - Villa Gobernador Gálvez",
    horarios: "Lunes a Domingo: 4:00 - 23:00",
    paradas: [
      "Granadero Baigorria",
      "Bv. Rondeau",
      "Av. Alberdi",
      "Centro",
      "Villa Gobernador Gálvez"
    ],
    descripcion: "Conecta Granadero Baigorria con Villa Gobernador Gálvez atravesando la ciudad"
  },
  {
    id: 7,
    nombre: "Línea 103 Roja",
    recorrido: "Villa Gobernador Gálvez - Barrio Rucci",
    horarios: "Lunes a Domingo: 4:30 - 23:30",
    paradas: [
      "Villa Gobernador Gálvez",
      "Av. San Martín",
      "Bv. Rondeau",
      "Av. Casiano Casas",
      "Barrio Rucci"
    ],
    descripcion: "Conecta Villa Gobernador Gálvez con el norte de la ciudad"
  },
  {
    id: 8,
    nombre: "Línea 106 Negra",
    recorrido: "Ibarlucea - M. Santafesinos",
    horarios: "Lunes a Domingo: 5:00 - 22:30",
    paradas: [
      "Ibarlucea",
      "Bv. J. Granel",
      "Av. Casiano Casas",
      "Centro",
      "M. Santafesinos"
    ],
    descripcion: "Une Ibarlucea con la zona sur pasando por el centro"
  },
  {
    id: 9,
    nombre: "Línea 106 Roja",
    recorrido: "M. García - Isola",
    horarios: "Lunes a Domingo: 5:00 - 23:00",
    paradas: [
      "M. García",
      "Av. Casiano Casas",
      "Av. Alberdi",
      "Centro",
      "Isola"
    ],
    descripcion: "Conecta el norte con el sur de la ciudad"
  },
  {
    id: 10,
    nombre: "Línea 107 Negra",
    recorrido: "Arequipa - Buenos Aires",
    horarios: "Lunes a Domingo: 4:30 - 23:30",
    paradas: [
      "Arequipa",
      "Villa del Parque",
      "Bv. Rondeau",
      "Centro",
      "Buenos Aires"
    ],
    descripcion: "Une la zona noroeste con el centro de la ciudad"
  },
  {
    id: 11,
    nombre: "Línea 107 Roja",
    recorrido: "L. Batlle - Isola",
    horarios: "Lunes a Domingo: 5:00 - 23:00",
    paradas: [
      "L. Batlle",
      "Villa del Parque",
      "Bv. Rondeau",
      "Centro",
      "Isola"
    ],
    descripcion: "Conecta la zona oeste con el sur de la ciudad"
  },
  {
    id: 12,
    nombre: "Línea 110 Único",
    recorrido: "Génova - Cisnero",
    horarios: "Lunes a Domingo: 5:00 - 23:00",
    paradas: [
      "Génova y Acevedo",
      "Av. Provincias Unidas",
      "Bv. Avellaneda",
      "Centro",
      "Juan Pablo II"
    ],
    descripcion: "Conecta la zona noroeste con el suroeste de la ciudad"
  },
  {
    id: 13,
    nombre: "Línea 113 Único",
    recorrido: "Grandoli - Nansen",
    horarios: "Lunes a Domingo: 4:30 - 23:30",
    paradas: [
      "Grandoli y J.M. Gutiérrez",
      "Av. San Martín",
      "Centro",
      "Av. Francia",
      "Av. Salvador Allende"
    ],
    descripcion: "Une el sur con el noroeste de la ciudad"
  },
  {
    id: 14,
    nombre: "Línea 115 Aeropuerto",
    recorrido: "Aeropuerto - Riobamba",
    horarios: "Lunes a Domingo: 5:00 - 22:00",
    paradas: [
      "Aeropuerto",
      "Av. Jorge Newbery",
      "Av. Eva Perón",
      "Centro",
      "Riobamba"
    ],
    descripcion: "Conecta el Aeropuerto con el centro de la ciudad"
  },
  {
    id: 15,
    nombre: "Línea 115 Único",
    recorrido: "Bv. Wilde - Riobamba",
    horarios: "Lunes a Domingo: 5:00 - 23:00",
    paradas: [
      "Bv. Wilde",
      "Juan José Paso",
      "Av. Eva Perón",
      "Centro",
      "Riobamba"
    ],
    descripcion: "Une la zona oeste con el centro de la ciudad"
  },
  {
    id: 16,
    nombre: "Línea 116 Único",
    recorrido: "Suinda - Bv. Oroño",
    horarios: "Lunes a Domingo: 4:30 - 23:30",
    paradas: [
      "Suinda",
      "Av. Mendoza",
      "Centro",
      "Bv. Oroño",
      "Av. J. Cura"
    ],
    descripcion: "Conecta el noroeste con el sur por Bv. Oroño"
  },
  {
    id: 17,
    nombre: "Línea 120 Único",
    recorrido: "Provincias Unidas - Montevideo",
    horarios: "Lunes a Domingo: 5:00 - 23:00",
    paradas: [
      "Av. Provincias Unidas",
      "Av. Pellegrini",
      "Centro",
      "Entre Ríos",
      "Montevideo"
    ],
    descripcion: "Une el oeste con el centro de la ciudad"
  },
  {
    id: 18,
    nombre: "Línea 121 Único",
    recorrido: "Límite Municipio - Santa Fe",
    horarios: "Lunes a Domingo: 5:00 - 23:00",
    paradas: [
      "Camino Límite de Municipio",
      "Av. Rivarola",
      "Bv. 27 de Febrero",
      "Bv. Avellaneda",
      "Santa Fe"
    ],
    descripcion: "Conecta el límite oeste con el centro de la ciudad"
  },
  {
    id: 19,
    nombre: "Línea K",
    recorrido: "Wilde - Riobamba",
    horarios: "Lunes a Domingo: 5:00 - 23:00",
    paradas: [
      "Wilde y Mendoza",
      "Mendoza",
      "Alem",
      "Cerrito",
      "Riobamba"
    ],
    descripcion: "Línea que conecta el oeste con el centro",
    horarioSeguridad: "De 00:00 a 06:00 hs: Recorrido especial por zonas seguras"
  },
  {
    id: 20,
    nombre: "Línea Q Único",
    recorrido: "Francia - Riobamba",
    horarios: "Lunes a Domingo: 5:00 - 23:00",
    paradas: [
      "Colectora Juan Pablo II",
      "Av. Francia",
      "Mendoza",
      "Centro",
      "Riobamba"
    ],
    descripcion: "Une la zona oeste con el centro de la ciudad"
  },
  {
    id: 21,
    nombre: "Ronda CUR Sur",
    recorrido: "B. y Ordóñez - Riobamba",
    horarios: "Lunes a Viernes: 7:00 - 22:00",
    paradas: [
      "B. y Ordóñez",
      "Av. Ovidio Lagos",
      "Av. San Martín",
      "Centro",
      "Riobamba (C.U.R)"
    ],
    descripcion: "Conecta la zona sur con el Centro Universitario Rosario (C.U.R)"
  },
  {
    id: 22,
    nombre: "Enlace Noroeste",
    recorrido: "Palos Verdes - Av. Eva Perón",
    horarios: "Lunes a Domingo: 5:30 - 23:00",
    paradas: [
      "G. del Cossio",
      "Av. J. Newbery",
      "Bv. Wilde",
      "Av. Eva Perón",
      "Rodo"
    ],
    descripcion: "Conecta el complejo Palos Verdes con la zona oeste"
  },
  {
    id: 23,
    nombre: "Enlace Santa Lucía",
    recorrido: "Riobamba - Calle 1752",
    horarios: "Lunes a Domingo: 5:30 - 0:30",
    paradas: [
      "Riobamba",
      "Av. Provincias Unidas",
      "Colectora Juan Pablo II",
      "Barrio Santa Lucía",
      "Calle 1752"
    ],
    descripcion: "Conecta el centro con el Barrio Santa Lucía",
    transbordo: "Gratuito con líneas 120 y 122 bandera Roja en Av. Provincias Unidas y Riobamba"
  },
  {
    id: 24,
    nombre: "Línea 122 Roja",
    recorrido: "Fisherton - Centro",
    horarios: "Lunes a Domingo: 5:00 - 23:00",
    paradas: [
      "Fisherton",
      "Av. Eva Perón",
      "Centro",
      "Pellegrini",
      "Terminal"
    ],
    descripcion: "Conecta Fisherton con el centro de la ciudad"
  },
  {
    id: 25,
    nombre: "Línea 122 Verde",
    recorrido: "Fisherton - Terminal",
    horarios: "Lunes a Domingo: 5:00 - 23:00",
    paradas: [
      "Fisherton",
      "Av. Eva Perón",
      "Centro",
      "Pellegrini",
      "Terminal"
    ],
    descripcion: "Variante de la línea que llega hasta la Terminal"
  },
  {
    id: 26,
    nombre: "Línea 123 Único",
    recorrido: "Norte - Sur",
    horarios: "Lunes a Domingo: 5:00 - 23:00",
    paradas: [
      "Zona Norte",
      "Alberdi",
      "Centro",
      "Pellegrini",
      "Zona Sur"
    ],
    descripcion: "Conecta la zona norte con el sur de la ciudad"
  },
  {
    id: 27,
    nombre: "Línea 126 Negra",
    recorrido: "Ibarlucea - M. Santafesinos",
    horarios: "Lunes a Domingo: 5:00 - 22:30",
    paradas: [
      "Ibarlucea",
      "Bv. J. Granel",
      "Av. Casiano Casas",
      "Centro",
      "M. Santafesinos"
    ],
    descripcion: "Une Ibarlucea con la zona sur pasando por el centro"
  },
  {
    id: 28,
    nombre: "Línea 126 Roja",
    recorrido: "M. García - Isola",
    horarios: "Lunes a Domingo: 5:00 - 23:00",
    paradas: [
      "M. García",
      "Av. Casiano Casas",
      "Av. Alberdi",
      "Centro",
      "Isola"
    ],
    descripcion: "Conecta el norte con el sur de la ciudad"
  },
  {
    id: 29,
    nombre: "Línea 127 Único",
    recorrido: "Arequipa - Buenos Aires",
    horarios: "Lunes a Domingo: 4:30 - 23:30",
    paradas: [
      "Arequipa",
      "Villa del Parque",
      "Bv. Rondeau",
      "Centro",
      "Buenos Aires"
    ],
    descripcion: "Une la zona noroeste con el centro de la ciudad"
  },
  {
    id: 30,
    nombre: "Línea 128 Negra",
    recorrido: "L. Batlle - Isola",
    horarios: "Lunes a Domingo: 5:00 - 23:00",
    paradas: [
      "L. Batlle",
      "Villa del Parque",
      "Bv. Rondeau",
      "Centro",
      "Isola"
    ],
    descripcion: "Conecta la zona oeste con el sur de la ciudad"
  },
  {
    id: 31,
    nombre: "Línea 128 Roja",
    recorrido: "Génova - Cisnero",
    horarios: "Lunes a Domingo: 5:00 - 23:00",
    paradas: [
      "Génova y Acevedo",
      "Av. Provincias Unidas",
      "Bv. Avellaneda",
      "Centro",
      "Juan Pablo II"
    ],
    descripcion: "Conecta la zona noroeste con el suroeste de la ciudad"
  },
  {
    id: 32,
    nombre: "Línea 129 Único",
    recorrido: "Grandoli - Nansen",
    horarios: "Lunes a Domingo: 4:30 - 23:30",
    paradas: [
      "Grandoli y J.M. Gutiérrez",
      "Av. San Martín",
      "Centro",
      "Av. Francia",
      "Av. Salvador Allende"
    ],
    descripcion: "Une el sur con el noroeste de la ciudad"
  },
  {
    id: 33,
    nombre: "Línea 130 Único",
    recorrido: "Aeropuerto - Riobamba",
    horarios: "Lunes a Domingo: 5:00 - 22:00",
    paradas: [
      "Aeropuerto",
      "Av. Jorge Newbery",
      "Av. Eva Perón",
      "Centro",
      "Riobamba"
    ],
    descripcion: "Conecta el Aeropuerto con el centro de la ciudad"
  },
  {
    id: 34,
    nombre: "Línea 131 Único",
    recorrido: "Bv. Wilde - Riobamba",
    horarios: "Lunes a Domingo: 5:00 - 23:00",
    paradas: [
      "Bv. Wilde",
      "Juan José Paso",
      "Av. Eva Perón",
      "Centro",
      "Riobamba"
    ],
    descripcion: "Une la zona oeste con el centro de la ciudad"
  },
  {
    id: 35,
    nombre: "Línea 132 Único",
    recorrido: "Suinda - Bv. Oroño",
    horarios: "Lunes a Domingo: 4:30 - 23:30",
    paradas: [
      "Suinda",
      "Av. Mendoza",
      "Centro",
      "Bv. Oroño",
      "Av. J. Cura"
    ],
    descripcion: "Conecta el noroeste con el sur por Bv. Oroño"
  },
  {
    id: 36,
    nombre: "Línea 133 125 Negra",
    recorrido: "Provincias Unidas - Montevideo",
    horarios: "Lunes a Domingo: 5:00 - 23:00",
    paradas: [
      "Av. Provincias Unidas",
      "Av. Pellegrini",
      "Centro",
      "Entre Ríos",
      "Montevideo"
    ],
    descripcion: "Une el oeste con el centro de la ciudad"
  },
  {
    id: 37,
    nombre: "Línea 133 125 Verde",
    recorrido: "Límite Municipio - Santa Fe",
    horarios: "Lunes a Domingo: 5:00 - 23:00",
    paradas: [
      "Camino Límite de Municipio",
      "Av. Rivarola",
      "Bv. 27 de Febrero",
      "Bv. Avellaneda",
      "Santa Fe"
    ],
    descripcion: "Conecta el límite oeste con el centro de la ciudad"
  },
  {
    id: 38,
    nombre: "Línea 134 Único",
    recorrido: "Wilde - Riobamba",
    horarios: "Lunes a Domingo: 5:00 - 23:00",
    paradas: [
      "Wilde y Mendoza",
      "Mendoza",
      "Alem",
      "Cerrito",
      "Riobamba"
    ],
    descripcion: "Línea que conecta el oeste con el centro",
    horarioSeguridad: "De 00:00 a 06:00 hs: Recorrido especial por zonas seguras"
  },
  {
    id: 39,
    nombre: "Línea 135 Único",
    recorrido: "Francia - Riobamba",
    horarios: "Lunes a Domingo: 5:00 - 23:00",
    paradas: [
      "Colectora Juan Pablo II",
      "Av. Francia",
      "Mendoza",
      "Centro",
      "Riobamba"
    ],
    descripcion: "Une la zona oeste con el centro de la ciudad"
  },
  {
    id: 40,
    nombre: "Línea 138 139 Único",
    recorrido: "B. y Ordóñez - Riobamba",
    horarios: "Lunes a Viernes: 7:00 - 22:00",
    paradas: [
      "B. y Ordóñez",
      "Av. Ovidio Lagos",
      "Av. San Martín",
      "Centro",
      "Riobamba (C.U.R)"
    ],
    descripcion: "Conecta la zona sur con el Centro Universitario Rosario (C.U.R)"
  },
  {
    id: 41,
    nombre: "Línea 140 Único",
    recorrido: "Palos Verdes - Av. Eva Perón",
    horarios: "Lunes a Domingo: 5:30 - 23:00",
    paradas: [
      "G. del Cossio",
      "Av. J. Newbery",
      "Bv. Wilde",
      "Av. Eva Perón",
      "Rodo"
    ],
    descripcion: "Conecta el complejo Palos Verdes con la zona oeste"
  },
  {
    id: 42,
    nombre: "Línea 141 Único",
    recorrido: "Riobamba - Calle 1752",
    horarios: "Lunes a Domingo: 5:30 - 0:30",
    paradas: [
      "Riobamba",
      "Av. Provincias Unidas",
      "Colectora Juan Pablo II",
      "Barrio Santa Lucía",
      "Calle 1752"
    ],
    descripcion: "Conecta el centro con el Barrio Santa Lucía",
    transbordo: "Gratuito con líneas 120 y 122 bandera Roja en Av. Provincias Unidas y Riobamba"
  },
  {
    id: 43,
    nombre: "Línea 142 Negra",
    recorrido: "Ibarlucea - M. Santafesinos",
    horarios: "Lunes a Domingo: 5:00 - 22:30",
    paradas: [
      "Ibarlucea",
      "Bv. J. Granel",
      "Av. Casiano Casas",
      "Centro",
      "M. Santafesinos"
    ],
    descripcion: "Une Ibarlucea con la zona sur pasando por el centro"
  },
  {
    id: 44,
    nombre: "Línea 142 Roja",
    recorrido: "M. García - Isola",
    horarios: "Lunes a Domingo: 5:00 - 23:00",
    paradas: [
      "M. García",
      "Av. Casiano Casas",
      "Av. Alberdi",
      "Centro",
      "Isola"
    ],
    descripcion: "Conecta el norte con el sur de la ciudad"
  },
  {
    id: 45,
    nombre: "Línea 143 136 137 Negra",
    recorrido: "Arequipa - Buenos Aires",
    horarios: "Lunes a Domingo: 4:30 - 23:30",
    paradas: [
      "Arequipa",
      "Villa del Parque",
      "Bv. Rondeau",
      "Centro",
      "Buenos Aires"
    ],
    descripcion: "Une la zona noroeste con el centro de la ciudad"
  },
  {
    id: 46,
    nombre: "Línea 143 136 137 Roja",
    recorrido: "L. Batlle - Isola",
    horarios: "Lunes a Domingo: 5:00 - 23:00",
    paradas: [
      "L. Batlle",
      "Villa del Parque",
      "Bv. Rondeau",
      "Centro",
      "Isola"
    ],
    descripcion: "Conecta la zona oeste con el sur de la ciudad"
  },
  {
    id: 47,
    nombre: "Línea 145 133 Cabin 9",
    recorrido: "Génova - Cisnero",
    horarios: "Lunes a Domingo: 5:00 - 23:00",
    paradas: [
      "Génova y Acevedo",
      "Av. Provincias Unidas",
      "Bv. Avellaneda",
      "Centro",
      "Juan Pablo II"
    ],
    descripcion: "Conecta la zona noroeste con el suroeste de la ciudad"
  },
  {
    id: 48,
    nombre: "Línea 145 133 Soldini",
    recorrido: "Grandoli - Nansen",
    horarios: "Lunes a Domingo: 4:30 - 23:30",
    paradas: [
      "Grandoli y J.M. Gutiérrez",
      "Av. San Martín",
      "Centro",
      "Av. Francia",
      "Av. Salvador Allende"
    ],
    descripcion: "Une el sur con el noroeste de la ciudad"
  },
  {
    id: 49,
    nombre: "Línea 146 Negra",
    recorrido: "Ibarlucea - M. Santafesinos",
    horarios: "Lunes a Domingo: 5:00 - 22:30",
    paradas: [
      "Ibarlucea",
      "Bv. J. Granel",
      "Av. Casiano Casas",
      "Centro",
      "M. Santafesinos"
    ],
    descripcion: "Une Ibarlucea con la zona sur pasando por el centro"
  },
  {
    id: 50,
    nombre: "Línea 146 Roja",
    recorrido: "M. García - Isola",
    horarios: "Lunes a Domingo: 5:00 - 23:00",
    paradas: [
      "M. García",
      "Av. Casiano Casas",
      "Av. Alberdi",
      "Centro",
      "Isola"
    ],
    descripcion: "Conecta el norte con el sur de la ciudad"
  },
  {
    id: 51,
    nombre: "Línea 153 Negra",
    recorrido: "Arequipa - Buenos Aires",
    horarios: "Lunes a Domingo: 4:30 - 23:30",
    paradas: [
      "Arequipa",
      "Villa del Parque",
      "Bv. Rondeau",
      "Centro",
      "Buenos Aires"
    ],
    descripcion: "Une la zona noroeste con el centro de la ciudad"
  },
  {
    id: 52,
    nombre: "Línea 153 Roja",
    recorrido: "L. Batlle - Isola",
    horarios: "Lunes a Domingo: 5:00 - 23:00",
    paradas: [
      "L. Batlle",
      "Villa del Parque",
      "Bv. Rondeau",
      "Centro",
      "Isola"
    ],
    descripcion: "Conecta la zona oeste con el sur de la ciudad"
  }
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
                    {linea.horarioSeguridad && (
                      <p className="horario-seguridad">
                        <strong>Horario de Seguridad:</strong> {linea.horarioSeguridad}
                      </p>
                    )}
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
                    {linea.transbordo && (
                      <p className="transbordo">
                        <strong>Transbordo:</strong> {linea.transbordo}
                      </p>
                    )}
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
