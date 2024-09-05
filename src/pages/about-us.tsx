import React from 'react';
import '@/styles/aboutUs.css';

export default function AboutUs() {
  return (
    <div className="about-container">
      <div className="layout-container">
        <div className="layout-content-container">
          <div className="hero-image"></div>
          <h2 className="about-title">¡Bienvenidos a Proyecto Garage! 🌟</h2>
          <p className="about-text">
            En Proyecto Garage nos dedicamos a organizar eventos únicos que
            combinan lo mejor de la cultura urbana y las experiencias
            gastronómicas. Acá vas a encontrar un espacio para disfrutar de música
            en vivo, flash days de tatuajes, exposiciones de arte, y mucho más,
            todo acompañado de comida deliciosa y bebidas artesanales.
          </p>

          <div className="image-container">
            <div className="full-width-image"></div>
          </div>

          <h2 className="about-subtitle">Nuestro Objetivo</h2>
          <p className="about-text">
            Nuestro objetivo es crear un lugar donde las personas puedan
            compartir, divertirse y disfrutar en un ambiente relajado y
            acogedor. Nos encanta ver a nuestra comunidad crecer, conectar y
            celebrar juntos.
          </p>

          <h2 className="about-subtitle">¿Qué Ofrecemos?</h2>
          <ul className="about-list">
            <li>
              Eventos Únicos: Desde conciertos íntimos hasta noches de DJ
            </li>
            <li>
              Experiencias Gastronómicas: Platos sorprendentes y bebidas
              increibles para deleitar tu paladar.
            </li>
            <li>
              Diversión y Comunidad: Un lugar para conocer gente nueva,
              disfrutar con amigos, y crear recuerdos inolvidables.
            </li>
          </ul>

          <p className="about-text">
            Te invitamos a ser parte de esta comunidad. ¡Únite a
            nuestros eventos y viví la experiencia de Proyecto Garage!
          </p>
        </div>
      </div>
    </div>
  );
}

interface TeamMemberProps {
  name: string;
  role: string;
  imageUrl: string;
}

const TeamMember: React.FC<TeamMemberProps> = ({ name, role, imageUrl }) => (
  <div className="team-member">
    <div
      className="member-image"
      style={{ backgroundImage: `url(${imageUrl})` }}
    ></div>
    <div className="member-info">
      <p className="member-name">{name}</p>
      <p className="member-role">{role}</p>
    </div>
  </div>
);
