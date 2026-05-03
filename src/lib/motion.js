import { useReducedMotion } from 'framer-motion';

export const easeOut = [0.22, 1, 0.36, 1];
export const easeInOut = [0.65, 0, 0.35, 1];
export const easeDrawer = [0.32, 0.72, 0, 1];

export const fadeUp = {
  hidden: { opacity: 0, transform: 'translate3d(0,16px,0)' },
  show: {
    opacity: 1,
    transform: 'translate3d(0,0,0)',
    transition: { duration: 0.32, ease: easeOut },
  },
};

export const fadeIn = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.32, ease: easeOut } },
};

export const stagger = (delay = 0.06) => ({
  hidden: {},
  show: { transition: { staggerChildren: delay, delayChildren: 0.04 } },
});

export const viewportOnce = { once: true, margin: '-80px' };

export function useFadeUp() {
  const reduce = useReducedMotion();
  if (reduce) return { hidden: { opacity: 0 }, show: { opacity: 1, transition: { duration: 0.001 } } };
  return fadeUp;
}

export const fadeUpItem = (delay = 0) => ({
  initial: { opacity: 0, transform: 'translate3d(0,16px,0)' },
  whileInView: { opacity: 1, transform: 'translate3d(0,0,0)' },
  viewport: viewportOnce,
  transition: { duration: 0.32, ease: easeOut, delay },
});
