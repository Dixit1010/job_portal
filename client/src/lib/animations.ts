export const DROPDOWN_VARIANTS = {
  hidden: { opacity: 0, y: -6, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring" as const, damping: 30, stiffness: 400 },
  },
  exit: { opacity: 0, y: -6, scale: 0.96, transition: { duration: 0.12 } },
};

export const MOBILE_PANEL_VARIANTS = {
  hidden: { x: "-100%" },
  visible: {
    x: 0,
    transition: { type: "spring" as const, damping: 28, stiffness: 300 },
  },
  exit: { x: "-100%", transition: { duration: 0.22, ease: "easeIn" as const } },
};

export const TAB_VARIANTS = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -16 },
};

export const FADE_IN_UP = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export const STAGGER_CONTAINER = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};
