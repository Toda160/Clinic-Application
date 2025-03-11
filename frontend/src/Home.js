import React from 'react';
import './Home.css';

const Home = () => {
  return (
    <div className="home-container">
      <section className="welcome-section" data-aos="fade-up">
        <h1>Bine ați venit la Cabinet Stomatologic</h1>
        <p>
          Suntem dedicați sănătății dentare a fiecărui pacient. Oferim servicii moderne și personalizate, într-un mediu prietenos și sigur.
        </p>
        <button className="appointment-button" data-aos="zoom-in">
          Creaza-ti cont si beneficeaza de un control gratuit!
        </button>
      </section>
      <section className="services-section">
        <h2 data-aos="fade-in">Serviciile noastre</h2>
        <div className="cards-container">
          <div className="card" data-aos="zoom-in" data-aos-delay="100">
            <h3>Albirea dinților</h3>
            <p>Redă strălucirea zâmbetului tău cu tehnici de albire eficiente.</p>
          </div>
          <div className="card" data-aos="zoom-in" data-aos-delay="200">
            <h3>Implanturi dentare</h3>
            <p>Implanturi sigure și durabile pentru un zâmbet complet.</p>
          </div>
          <div className="card" data-aos="zoom-in" data-aos-delay="300">
            <h3>Control periodic</h3>
            <p>Verifică-ți sănătatea dentară regulat pentru prevenție.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
