export const bottomRowSpringConfig = {
  from: { opacity: 0, y: 100 },
  to: { opacity: 1, y: 0 },
};
export const btnClickSpringConfig = {
  from: {
    opacity: 0.1,
  },
  to: {
    opacity: 1,
  },
};
export const fadeInConfig = {
  from: {
    opacity: 0,
  },
  to: {
    opacity: 1,
  },
};
export const fadeOutConfig = {
  from: {
    opacity: 1,
  },
  to: {
    opacity: 0,
  },
};
export const redWarningConfig = {
  from: {
    backgroundColor: "#17a6e8",
  },
  to: {
    backgroundColor: "#E1341E",
  },
};
export const redWarningReverseConfig = {
  to: {
    backgroundColor: "#17a6e8",
  },
};
export const btnBlinkDeniedConfig = {
  from: { backgroundColor: "grey", x: -3 },
  to: [{ x: 3 }, { backgroundColor: "#17a6e8", x: 0 }],
  config: {
    friction: 50,
    tension: 150,
    duration: 150,
    clamp: true,
  },
};
