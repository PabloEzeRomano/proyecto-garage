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
            En Proyecto Garage nos dedicamos a organizar eventos únicos que combinan lo mejor de la cultura urbana y las experiencias gastronómicas. Aquí encontrarás un espacio para disfrutar de música en vivo, flash days de tatuajes, exposiciones de arte, y mucho más, todo acompañado de comida deliciosa y bebidas artesanales.
          </p>

          <div className="image-container">
            <div className="full-width-image"></div>
          </div>

          <h2 className="about-subtitle">Nuestro Objetivo</h2>
          <p className="about-text">
            Nuestro objetivo es crear un lugar donde las personas puedan compartir, divertirse y disfrutar en un ambiente relajado y acogedor. Nos encanta ver a nuestra comunidad crecer, conectar y celebrar juntos.
          </p>

          <h2 className="about-subtitle">¿Qué Ofrecemos?</h2>
          <ul className="about-list">
            <li>Eventos Únicos: Desde conciertos íntimos hasta noches de DJ y flash days de tatuajes.</li>
            <li>Experiencias Gastronómicas: Platos sorprendentes y bebidas artesanales para deleitar tu paladar.</li>
            <li>Diversión y Comunidad: Un lugar para conocer gente nueva, disfrutar con amigos, y crear recuerdos inolvidables.</li>
          </ul>

          <p className="about-text">
            Te invitamos a ser parte de esta comunidad vibrante. ¡Únete a nuestros eventos y vive la experiencia de Proyecto Garage!
          </p>

          <h2 className="about-subtitle">Nuestro Equipo</h2>
          <div className="team-members">
            <TeamMember
              name="Lucia Garcia"
              role="Co-Fundadora"
              imageUrl="https://cdn.usegalileo.ai/stability/db6b6501-b871-451d-bbd4-535f8dfb59f4.png"
            />
            <TeamMember
              name="Carlos Fernandez"
              role="Co-Fundador"
              imageUrl="https://cdn.usegalileo.ai/stability/8688a36e-7285-4e77-91e3-a9dfbca3bd99.png"
            />
            <TeamMember
              name="Elena Martinez"
              role="Directora Creativa"
              imageUrl="https://cdn.usegalileo.ai/stability/d970758b-0b4e-4f63-b21c-ef6eeea1d09d.png"
            />
          </div>
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
    <div className="member-image" style={{ backgroundImage: `url(${imageUrl})` }}></div>
    <div className="member-info">
      <p className="member-name">{name}</p>
      <p className="member-role">{role}</p>
    </div>
  </div>
);