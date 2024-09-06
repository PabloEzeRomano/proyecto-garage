import { Event } from '@prisma/client';
import { motion } from 'framer-motion';
import { useRef, useEffect } from 'react';

import '@/styles/modal.css';

interface EventModalProps {
  selectedEvent: Event;
  closeModal: () => void;
  buildURL: () => string;
}

export const EventModal = ({
  selectedEvent,
  closeModal,
  buildURL,
}: EventModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        closeModal();
      }
    };

    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeModal();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyPress);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [closeModal]);

  return (
    <div className="modal-overlay">
      <motion.div
        ref={modalRef}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="modal-container"
      >
        <div className="modal-image-container">
          <div className="modal-image-wrapper">
            <div
              className="modal-image"
              style={{ backgroundImage: `url(${selectedEvent.imageUrl})` }}
            ></div>
          </div>
        </div>
        <div className="modal-title-container">
          <div className="modal-title-wrapper">
            <p className="modal-title">{selectedEvent.title}</p>
            <p className="modal-date">{selectedEvent.date.toLocaleString()}</p>
          </div>
        </div>
        <div className="modal-reminder-button-container">
          <button className="modal-button bg-[#483323]">
            <span className="truncate">Establecer recordatorio</span>
          </button>
        </div>
        <h3 className="modal-section-title">Descripción</h3>
        <p className="modal-description">{selectedEvent.description}</p>
        <h3 className="modal-section-title">Información</h3>
        <div className="modal-info-grid">
          <div className="modal-info-item">
            <p className="modal-info-label">Fecha y Hora</p>
            <p className="modal-info-value">
              {selectedEvent.date.toLocaleString()}
            </p>
          </div>
          {selectedEvent.price && (
            <div className="modal-info-item">
              <p className="modal-info-label">Precio</p>
              <p className="modal-info-value">${selectedEvent.price}</p>
            </div>
          )}
        </div>
        <div className="modal-ticket-button-container">
          <a
            href={buildURL()}
            target="_blank"
            rel="noopener noreferrer"
            className="modal-ticket-button"
          >
            <span className="truncate">Obtener Entradas</span>
          </a>
        </div>
      </motion.div>
    </div>
  );
};
