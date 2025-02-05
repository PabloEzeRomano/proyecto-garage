import { Event } from '@/types/database';
import {
  animate,
  AnimatePresence,
  AnimationPlaybackControls,
  motion,
  useInView,
  useMotionValue,
} from 'framer-motion';
import Image from 'next/image';
import { useEffect, useMemo, useRef, useState } from 'react';

interface EventSliderProps {
  events: Event[];
  onEventClick: (event: Event) => void;
}

const EventImage = ({ event }: { event: Event }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className="relative cursor-pointer overflow-hidden h-[150px] min-w-[150px] rounded-lg flex items-center justify-center"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <AnimatePresence>
        {isHovered && (
          <motion.div
            className="absolute inset-0 bg-black/60 z-10 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute bg-black/60 w-full h-full pointer-events-none" />
            <motion.h1
              className="absolute rounded-full text-black bg-white z-20  px-2 py-1 flex items-center gap-[0.5]"
              initial={{ y: 10 }}
              animate={{ y: 0 }}
              exit={{ y: 10 }}
            >
              <span>{event.title}</span>
            </motion.h1>
          </motion.div>
        )}
      </AnimatePresence>
      <Image
        src={event.image_url || '/placeholder.jpg'}
        alt={event.title}
        width={150}
        height={150}
        className="mx-4 object-cover"
      />
    </motion.div>
  );
};
export const EventSlider = ({ events, onEventClick }: EventSliderProps) => {
  const [controls, setControls] = useState<AnimationPlaybackControls | null>(
    null
  );

  // Double the events array to ensure smooth infinite scroll
  const displayEvents = useMemo(
    () => [
      ...events,
      ...events,
      ...events,
      ...events,
      ...events,
      ...events,
      ...events,
      ...events,
      ...events,
      ...events,
      ...events,
      ...events,
      ...events,
    ],
    [events]
  );

  const ref = useRef(null);
  const inView = useInView(ref, {
    once: true,
  });

  console.log(inView);

  const x = useMotionValue(-190);

  useEffect(() => {
    if (x.get() !== -1184 && inView) {
      x.set(-1184);
    }

    const motionControls = animate(x, [-190, -1184], {
      duration: 5,
      ease: 'linear',
      repeat: Infinity,
      repeatType: 'loop',
      repeatDelay: 0,
    });
    setControls(motionControls);

    return () => motionControls.stop();
  }, [x, displayEvents, inView]);

  return (
    <div className="logos">
      <motion.div
        className="flex gap-4"
        ref={ref}
        style={{ x }}
        onHoverStart={() => controls?.pause()}
        onHoverEnd={() => controls?.play()}
      >
        {displayEvents.map((event, index) => (
          <EventImage key={`${event.id}-${index}`} event={event} />
        ))}
      </motion.div>
    </div>
  );
};
