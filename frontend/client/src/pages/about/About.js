import React from 'react';
import './About.css';

function Nosotros() {
  return (
    <div className="nosotros-page">
      <main className="nosotros-content">
        <h1>Sobre TRRO</h1>
        <div className="nosotros-grid">
          <section className="nosotros-section">
            <h2>Nuestra Misión</h2>
            <p>
              Proporcionar información actualizada y precisa sobre el tránsito en Rosario,
              facilitando la movilidad urbana y mejorando la experiencia de viaje de todos
              los ciudadanos.
            </p>
          </section>

          <section className="nosotros-section">
            <h2>Nuestra Visión</h2>
            <p>
              Ser la plataforma líder en información de tránsito y transporte público en
              Rosario, contribuyendo a una ciudad más conectada y eficiente.
            </p>
          </section>

          <section className="nosotros-section">
            <h2>Valores</h2>
            <ul>
              <li>Transparencia en la información</li>
              <li>Compromiso con la comunidad</li>
              <li>Innovación continua</li>
              <li>Responsabilidad social</li>
            </ul>
          </section>

          <section className="nosotros-section">
            <h2>Contacto</h2>
            <div className="contacto-info">
              <p><strong>Dirección:</strong> San Martín 1234, Rosario</p>
              <p><strong>Teléfono:</strong> (341) 123-4567</p>
              <p><strong>Email:</strong> info@trro.com.ar</p>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default Nosotros;
