import { LogoIcon, InstagramIcon, FacebookIcon } from '../../public/icons';
import Link from 'next/link';

export const Footer = () => {
  return (
    <footer className="footer-container theme-surface">
      <div className="footer-content">
        <div className="footer-section">
          <Link href="/" className="footer-logo">
            <LogoIcon />
            <span>Proyecto Garage</span>
          </Link>
          <p className="footer-description">
            Tu lugar de encuentro para eventos únicos y experiencias memorables
          </p>
        </div>

        <div className="footer-section">
          <h3 className="footer-title">Enlaces Rápidos</h3>
          <nav className="footer-links">
            <Link href="/items">Menú</Link>
            <Link href="/events">Eventos</Link>
            <Link href="/about-us">Sobre Nosotros</Link>
          </nav>
        </div>

        <div className="footer-section">
          <h3 className="footer-title">Seguinos en nuestras redes</h3>
          <div className="social-links">
            <a
              href="https://instagram.com/proyectogarage_ok"
              target="_blank"
              rel="noopener noreferrer"
              className="social-link"
            >
              <InstagramIcon />
              <span>Instagram</span>
            </a>
            <a
              href="https://facebook.com/ProyectoGarage.Ok"
              target="_blank"
              rel="noopener noreferrer"
              className="social-link"
            >
              <FacebookIcon />
              <span>Facebook</span>
            </a>
          </div>
        </div>

        <div className="footer-section">
          <h3 className="footer-title">Contacto</h3>
          <address className="contact-info">
            <p>Buenos Aires, Argentina</p>
            <p>
              <a href="mailto:proyecto.garage.dp@gmail.com">proyecto.garage.dp@gmail.com</a>
            </p>
          </address>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} Proyecto Garage. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
};