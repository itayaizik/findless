// Logo options for the home page. "stamp" is the built-in 失 stamp; the rest are
// thrine.app 3D model projects. Any other project id can be typed in the admin.
export const HERO_LOGOS = [
  { id: "e_97b1b0db855ae00695cd", label: "3D model C (newest)" },
  { id: "e_2a935dd89e4427c616f3", label: "3D model B" },
  { id: "e_fb350f6603257caeb8bf", label: "3D model A (grey background)" },
  { id: "stamp", label: "Stamp (no 3D)" },
];

export const HERO_LOGO_RE = /^(stamp|e_[a-z0-9]{8,40})$/;
