export const LOGO_URI =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuD7oLlPGkIvdudE-JJ-fdqJL-XkGt_QxVjibg7lXlGIF2V-8mF-rqs2QqPpt3CR38hV3HyOUatViGR8UOqjxq3iMwgGMzhIsadOuRmlUcWa1d4E7SGp-fbgVFWKGP7WM7tZBvYFFZEfNVFXU4dj2vLV7pg7mCqPiQOb_1tlhCiYgqSISqJv2Ajqe--QDWoPMqT_bTYmLxrQVNv_LnZ10bUaJcjWm5ovUqec3x7Wu4V0u-lRBhCCXATK";

export const RADAR_COLORS = {
  goldStart: "#b38538",
  goldMiddle: "#dec2a4",
  goldEnd: "#e8cf9b",
  lightRing: "#d1c4bb",
  darkRing: "#2c2b32",
  lightHalo: "#dec2a4",
  darkHalo: "#d4af37",
};

export const TELEMETRY_STAGES = [
  { at: 20, label: "Syncing Kinetic Nodes..." },
  { at: 45, label: "Calibrating lifts & volume..." },
  { at: 72, label: "Optimizing progressive load..." },
  { at: 92, label: "Athletic telemetry armed..." },
  { at: 100, label: "System Ready to Rise" },
] as const;
