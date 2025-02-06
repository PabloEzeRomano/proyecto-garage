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

import '@/styles/eventSlider.css';

interface EventSliderProps {
  events: Event[];
  onEventClick: (event: Event) => void;
}

const EventImage = ({
  event,
  onClick,
}: {
  event: Event;
  onClick: (event: Event) => void;
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className="event-image-container"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={() => onClick(event)}
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
      <Image
        src={event.image_url || '/placeholder.jpg'}
        alt={event.title}
        width={150}
        height={150}
        className="object-cover h-[150px] w-[150px]"
      />
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
