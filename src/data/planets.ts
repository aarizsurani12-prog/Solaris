export interface PlanetData {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  color: string;
  emissive?: string;
  texture?: string;         // path to real surface texture map (omit for flat-color fallback)
  bumpMap?: string;         // grayscale relief map — real surface elevation, not just a flat photo
  radius: number;           // visual radius in scene units
  orbitRadius: number;      // distance from sun in scene units
  rotationSpeed: number;    // radians per second (self-spin only; orbital position is fixed)
  side: "left" | "right";   // which side the planet frames on as camera arrives
  stats: Array<{ label: string; value: string }>;
  funFacts?: string[];
  moons?: number;
}

export const PLANETS: PlanetData[] = [
  {
    id: "mercury",
    name: "Mercury",
    subtitle: "Closest to the Sun",
    description:
      "A crater-scarred world of extremes — daytime temperatures soar above 430 °C, nights plummet to −180 °C. Its thin exosphere and iron-rich core make it one of the densest planets in the Solar System.",
    color: "#b0b0b0",
    texture: "/textures/planets/2k_mercury.jpg",
    bumpMap: "/textures/planets/mercury-bump.jpg",
    radius: 0.4,
    orbitRadius: 13,
    rotationSpeed: 0.01,
    side: "left",
    stats: [
      { label: "Distance from Sun", value: "57.9 M km" },
      { label: "Diameter", value: "4,879 km" },
      { label: "Day Length", value: "58.6 Earth days" },
      { label: "Year Length", value: "88 Earth days" },
      { label: "Gravity", value: "3.7 m/s²" },
      { label: "Moons", value: "0" },
    ],
  },
  {
    id: "venus",
    name: "Venus",
    subtitle: "Earth's Twin",
    description:
      "Shrouded in thick sulphuric-acid clouds, Venus is the hottest planet despite being farther from the Sun than Mercury. A runaway greenhouse effect drives surface temperatures to 465 °C — hot enough to melt lead.",
    color: "#d4a574",
    emissive: "#8a6040",
    texture: "/textures/planets/2k_venus_surface.jpg",
    bumpMap: "/textures/planets/venus-bump.jpg",
    radius: 0.8,
    orbitRadius: 17,
    rotationSpeed: -0.005,
    side: "right",
    stats: [
      { label: "Distance from Sun", value: "108.2 M km" },
      { label: "Diameter", value: "12,104 km" },
      { label: "Day Length", value: "243 Earth days" },
      { label: "Year Length", value: "225 Earth days" },
      { label: "Gravity", value: "8.87 m/s²" },
      { label: "Moons", value: "0" },
    ],
  },
  {
    id: "earth",
    name: "Earth",
    subtitle: "The Pale Blue Dot",
    description:
      "Our home — the only known world to harbour life. Liquid oceans cover 71% of its surface, a magnetic field shields its biosphere, and a dynamic atmosphere drives weather, seasons, and climate. A rotating cloud layer and shimmering aurorae make it the jewel of the Solar System.",
    color: "#4a90d9",
    emissive: "#1a5a9a",
    texture: "/textures/planets/8k_earth_daymap.jpg",
    bumpMap: "/textures/planets/earth-bump.jpg",
    radius: 0.85,
    orbitRadius: 21,
    rotationSpeed: 0.02,
    side: "left",
    moons: 1,
    stats: [
      { label: "Distance from Sun", value: "149.6 M km" },
      { label: "Diameter", value: "12,756 km" },
      { label: "Day Length", value: "24 hours" },
      { label: "Year Length", value: "365.25 days" },
      { label: "Gravity", value: "9.81 m/s²" },
      { label: "Moons", value: "1 (Luna)" },
    ],
  },
  {
    id: "mars",
    name: "Mars",
    subtitle: "The Red Planet",
    description:
      "Home to the tallest mountain (Olympus Mons, 21.9 km) and the deepest canyon (Valles Marineris, 7 km deep) in the Solar System. Its rusted, iron-rich soil gives Mars its iconic red hue.",
    color: "#c1440e",
    emissive: "#8a2e0a",
    texture: "/textures/planets/2k_mars.jpg",
    bumpMap: "/textures/planets/mars-bump.jpg",
    radius: 0.55,
    orbitRadius: 25,
    rotationSpeed: 0.019,
    side: "right",
    moons: 2,
    stats: [
      { label: "Distance from Sun", value: "227.9 M km" },
      { label: "Diameter", value: "6,792 km" },
      { label: "Day Length", value: "24.6 hours" },
      { label: "Year Length", value: "687 Earth days" },
      { label: "Gravity", value: "3.72 m/s²" },
      { label: "Moons", value: "2 (Phobos, Deimos)" },
    ],
  },
  {
    id: "jupiter",
    name: "Jupiter",
    subtitle: "The Giant of the Solar System",
    description:
      "The largest planet — more massive than all other planets combined. Its Great Red Spot, a storm larger than Earth, has raged for centuries. Dozens of moons orbit this gas giant, including Europa and Ganymede.",
    color: "#d4a06a",
    emissive: "#a08050",
    texture: "/textures/planets/8k_jupiter.jpg",
    radius: 2.0,
    orbitRadius: 31,
    rotationSpeed: 0.04,
    side: "left",
    moons: 95,
    stats: [
      { label: "Distance from Sun", value: "778.5 M km" },
      { label: "Diameter", value: "142,984 km" },
      { label: "Day Length", value: "9.9 hours" },
      { label: "Year Length", value: "11.86 Earth years" },
      { label: "Gravity", value: "24.79 m/s²" },
      { label: "Moons", value: "95 known" },
    ],
  },
  {
    id: "saturn",
    name: "Saturn",
    subtitle: "The Ringed World",
    description:
      "Saturn's magnificent ring system spans over 280,000 km yet is only 10 metres thick in places. Composed of billions of ice and rock particles, the rings are visible even through small telescopes from Earth.",
    color: "#e8d5a3",
    emissive: "#c0a870",
    texture: "/textures/planets/8k_saturn.jpg",
    radius: 1.7,
    orbitRadius: 37,
    rotationSpeed: 0.038,
    side: "right",
    moons: 146,
    stats: [
      { label: "Distance from Sun", value: "1.43 B km" },
      { label: "Diameter", value: "120,536 km" },
      { label: "Day Length", value: "10.7 hours" },
      { label: "Year Length", value: "29.46 Earth years" },
      { label: "Gravity", value: "10.44 m/s²" },
      { label: "Moons", value: "146 known" },
    ],
  },
  {
    id: "uranus",
    name: "Uranus",
    subtitle: "The Ice Giant",
    description:
      "Uranus rotates on its side — its axial tilt of 98° means it essentially rolls around the Sun. Its blue-green hue comes from methane in its atmosphere absorbing red wavelengths of sunlight.",
    color: "#7ec8e3",
    emissive: "#4a90b0",
    texture: "/textures/planets/2k_uranus.jpg",
    radius: 1.1,
    orbitRadius: 43,
    rotationSpeed: -0.03,
    side: "left",
    moons: 27,
    stats: [
      { label: "Distance from Sun", value: "2.87 B km" },
      { label: "Diameter", value: "51,118 km" },
      { label: "Day Length", value: "17.2 hours" },
      { label: "Year Length", value: "84.01 Earth years" },
      { label: "Gravity", value: "8.87 m/s²" },
      { label: "Moons", value: "27 known" },
    ],
  },
  {
    id: "neptune",
    name: "Neptune",
    subtitle: "The Windiest Planet",
    description:
      "Neptune boasts the fastest winds in the Solar System — reaching 2,100 km/h. Its vivid blue colour comes from methane absorbing red light, and its dark storm systems appear and disappear over years.",
    color: "#3b5ba5",
    emissive: "#1a3060",
    texture: "/textures/planets/2k_neptune.jpg",
    radius: 1.0,
    orbitRadius: 49,
    rotationSpeed: 0.032,
    side: "right",
    moons: 16,
    stats: [
      { label: "Distance from Sun", value: "4.5 B km" },
      { label: "Diameter", value: "49,528 km" },
      { label: "Day Length", value: "16.1 hours" },
      { label: "Year Length", value: "164.8 Earth years" },
      { label: "Gravity", value: "11.15 m/s²" },
      { label: "Moons", value: "16 known" },
    ],
  },
  {
    id: "pluto",
    name: "Pluto",
    subtitle: "The Former Ninth Planet",
    description:
      "Once the ninth planet, Pluto was reclassified as a dwarf planet in 2006. Its heart-shaped glacier (Sputnik Planitia), icy mountains, and thin nitrogen atmosphere make it far more complex than imagined before New Horizons flew past in 2015.",
    color: "#b0a090",
    emissive: "#807060",
    radius: 0.3,
    orbitRadius: 55,
    rotationSpeed: -0.015,
    side: "left",
    moons: 5,
    stats: [
      { label: "Distance from Sun", value: "5.91 B km" },
      { label: "Diameter", value: "2,377 km" },
      { label: "Day Length", value: "6.4 Earth days" },
      { label: "Year Length", value: "248 Earth years" },
      { label: "Gravity", value: "0.62 m/s²" },
      { label: "Moons", value: "5" },
    ],
  },
];

// Golden-angle spacing gives each planet a fixed, well-distributed position
// on its orbit ring — shared by the planet mesh and the camera path so the
// camera always frames the actual planet, not an empty point on the ring.
const GOLDEN_ANGLE = 2.399963229728653;
export const getOrbitAngle = (index: number) => index * GOLDEN_ANGLE;

// Single source of truth for the scroll timeline: the camera path
// (CameraController) and the "which planet is active" detection both read
// from this, so the info panel can never show a planet the camera isn't
// actually looking at.
//
// Each planet gets TWO waypoints (holdStart, holdEnd) at the identical
// position — lerping between two identical points holds the camera still,
// which is what lets the planet sit enlarged and steady (just spinning on
// its own axis) for the whole time its content is on screen, instead of
// only ever being framed for a single instant mid-transit.
export const INTRO_SEGMENT_COUNT = 3;
export const WAYPOINTS_PER_PLANET = 2;

const INTRO_WEIGHTS = [0.02, 0.02, 0.02];
const HOLD_WEIGHTS = PLANETS.map((p) => {
  if (p.id === "earth") return 0.13;
  if (p.id === "jupiter" || p.id === "saturn") return 0.11;
  return 0.08;
});
const TRANSIT_WEIGHT = 0.035;

// One weight per segment (21 segments connect 22 waypoints): 3 intro
// segments, then for each planet a hold segment followed by a transit
// segment (the last planet's "transit" is the final pull-back shot).
const ALL_WEIGHTS = [
  ...INTRO_WEIGHTS,
  ...PLANETS.flatMap((_, i) => [HOLD_WEIGHTS[i], TRANSIT_WEIGHT]),
];
const TOTAL_WEIGHT = ALL_WEIGHTS.reduce((a, b) => a + b, 0);

export const SCROLL_BREAKPOINTS: number[] = (() => {
  const bp: number[] = [];
  let acc = 0;
  for (const w of ALL_WEIGHTS) {
    bp.push(acc);
    acc += w / TOTAL_WEIGHT;
  }
  bp.push(1);
  return bp;
})();

// Waypoint index of planet i's holdStart (where it arrives and enlarges).
export const getHoldStartWaypoint = (i: number) => INTRO_SEGMENT_COUNT + i * WAYPOINTS_PER_PLANET;

// Progress value at which the last planet's hold ends and the final
// pull-back shot begins — the UI switches from the info panel to the
// closing footer here. Reusing content, not a re-tuned dead sentinel.
export const FINAL_PULLBACK_START =
  SCROLL_BREAKPOINTS[getHoldStartWaypoint(PLANETS.length - 1) + 1];
