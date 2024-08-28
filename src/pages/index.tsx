import Link from 'next/link';
import { AnimatedLogo } from '../../public/icons';

import '@/styles/landing.css';
import { motion } from 'framer-motion';

export default function Home() {
  return (
    <>
      <div className="flex items-center justify-center mb-12">
        <AnimatedLogo />
      </div>
      <div className="landing-content">
        <h1 className="title">Viví la Experiencia Proyecto Garage</h1>
        <p className="subtitle">
          Eventos únicos en un espacio urbano y auténtico
        </p>
        <div className="next-event-container">
          <div className="flex flex-col gap-2 text-left">
            <h1 className="text-white text-4xl">Proyecto Garage</h1>
            <h2 className="text-white text-sm font-normal leading-normal sm:text-base sm:font-normal sm:leading-normal">
              Un espacio cultural en pleno Villa del Parque
            </h2>
          </div>
          <Link href="/events" passHref>
            <motion.button
              whileHover={{
                scale: 1.1,
                boxShadow: '0 0 8px #ff6347',
                textShadow: '0 0 8px #ff6347',
              }}
              className="cta-button"
            >
              Ver Próximos Eventos
            </motion.button>
          </Link>
        </div>
      </div>
    </>
  );
}
