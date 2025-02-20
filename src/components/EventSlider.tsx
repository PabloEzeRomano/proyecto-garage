import { Event } from '@/types/database';
import {
  animate,
  AnimatePresence,
  AnimationPlaybackControls,
  motion,
  useMotionValue
} from 'framer-motion';
import Image from 'next/image';
import { useEffect, useMemo, useRef, useState } from 'react';
import { getOptimizedImageUrl } from '@/utils/imageUtils';

import '@/styles/eventSlider.css';

interface EventSliderProps {
  events: Event[];
  onEventClick: (id: string) => void;
}

const EventImage = ({
  event,
  onClick,
}: {
  event: Event;
  onClick: (id: string) => void;
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageSrc, setImageSrc] = useState('/placeholder.jpg');
  const [isLoading, setIsLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const loadImage = async () => {
      try {
        setIsLoading(true);
        const optimizedUrl = await getOptimizedImageUrl(event.image_url, 'thumbnail');
        setImageSrc(optimizedUrl);
      } catch (error) {
        console.error('Error loading image:', error);
        setImageSrc('/placeholder.jpg');
      } finally {
        setIsLoading(false);
      }
    };

    loadImage();
  }, [event.image_url]);

  return (
    <motion.div
      className="event-image-container"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={() => onClick(event.id)}
    >
      <AnimatePresence>
        {isHovered && (
          <motion.div
            className="event-image-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="event-image-overlay-background" />
            <motion.h1
              className="event-image-overlay-text"
              initial={{ y: 10 }}
              animate={{ y: 0 }}
              exit={{ y: 10 }}
            >
              <span>Ir a evento</span>
            </motion.h1>
          </motion.div>
        )}
      </AnimatePresence>
      {!imageError ? (
        <Image
          src={imageSrc}
          alt={event.title}
          width={150}
          height={150}
          className="object-cover h-[150px] w-[150px]"
          onError={() => setImageError(true)}
          onLoad={() => setIsLoading(false)}
          priority
        />
      ) : (
        <div className="event-image-overlay">
          <span className="event-image-overlay-text">No image</span>
        </div>
      )}
      {isLoading && (
        <div className="event-image-overlay">
          <span className="event-image-overlay-text">Loading...</span>
        </div>
      )}
    </motion.div>
  );
};

export const EventSlider = ({ events, onEventClick }: EventSliderProps) => {
  const [controls, setControls] = useState<AnimationPlaybackControls | null>(
    null
  );

  // Double the events array to ensure smooth infinite scroll
  const displayEvents = useMemo(() => [...events, ...events], [events]);

  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);

  useEffect(() => {
    const width = ref.current?.clientWidth || 0;
    const maxWidth = -width / 2;

    const motionControls = animate(x, [0, maxWidth], {
      duration: 25,
      ease: 'linear',
      repeat: Infinity,
      repeatType: 'loop',
      repeatDelay: 0,
    });
    setControls(motionControls);

    return () => motionControls.stop();
  }, [x, displayEvents]);

  return (
    <div className="event-slider-container">
      <motion.div
        className="event-slider"
        ref={ref}
        style={{ x }}
        onHoverStart={() => controls?.pause()}
        onHoverEnd={() => controls?.play()}
      >
        {displayEvents.map((event, index) => (
          <EventImage
            key={`${event.id}-${index}`}
            event={event}
            onClick={onEventClick}
          />
        ))}
      </motion.div>
    </div>
  );
};
