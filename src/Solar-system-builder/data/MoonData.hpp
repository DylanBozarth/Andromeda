#pragma once
#include "Solar-system-builder/physics/OrbitalElements.hpp"
#include "math/Constants.hpp"
#include <array>

// Major moon orbital elements, referenced to the J2000 ecliptic plane.
// Semi-major axes and GM values from JPL satellite physical parameters.
//
// NOTE: Moon inclinations here are approximate ecliptic-frame values.
// Precise values require accounting for each planet's pole orientation.
// Initial mean anomalies (M0) are intentionally varied to distribute
// moons around their orbits visually. Exact values can be fetched from
// JPL Horizons for a given epoch.

namespace {
    constexpr double d2r_m(double deg) { return deg * Constants::DEG2RAD; }
}

inline constexpr std::array<CelestialBody, 171> MOONS = {{

    // ── Earth ──────────────────────────────────────────────────────────────
    {
        "Moon", "Earth",
        { 3.84400e8, 0.0549, d2r_m(5.145), d2r_m(125.08), d2r_m(318.15),
          d2r_m(134.9), Constants::GM_EARTH },
        Constants::GM_MOON, 1.7374e6
    },

    // ── Mars ───────────────────────────────────────────────────────────────
    {
        "Phobos", "Mars",
        { 9.3760e6, 0.0151, d2r_m(1.08), d2r_m(207.8), d2r_m(357.0),
          d2r_m(0.0), Constants::GM_MARS },
        Constants::GM_PHOBOS, 1.1267e4
    },
    {
        "Deimos", "Mars",
        { 2.3463e7, 0.0002, d2r_m(1.79), d2r_m(24.3), d2r_m(260.7),
          d2r_m(180.0), Constants::GM_MARS },
        Constants::GM_DEIMOS, 6.2e3
    },

    // ── Jupiter (Galilean + Amalthea) ──────────────────────────────────────
    {
        "Io", "Jupiter",
        { 4.21700e8, 0.0041, d2r_m(0.036), d2r_m(43.977), d2r_m(84.129),
          d2r_m(0.0), Constants::GM_JUPITER },
        Constants::GM_IO, 1.8216e6
    },
    {
        "Europa", "Jupiter",
        { 6.71034e8, 0.0094, d2r_m(0.47), d2r_m(219.106), d2r_m(88.970),
          d2r_m(120.0), Constants::GM_JUPITER },
        Constants::GM_EUROPA, 1.5608e6
    },
    {
        "Ganymede", "Jupiter",
        { 1.070412e9, 0.0013, d2r_m(0.177), d2r_m(63.552), d2r_m(192.417),
          d2r_m(240.0), Constants::GM_JUPITER },
        Constants::GM_GANYMEDE, 2.6341e6
    },
    {
        "Callisto", "Jupiter",
        { 1.882709e9, 0.0074, d2r_m(0.192), d2r_m(298.848), d2r_m(52.643),
          d2r_m(60.0), Constants::GM_JUPITER },
        Constants::GM_CALLISTO, 2.4103e6
    },
    {
        "Amalthea", "Jupiter",
        { 1.81366e8, 0.0032, d2r_m(0.374), d2r_m(0.0), d2r_m(0.0),
          d2r_m(90.0), Constants::GM_JUPITER },
        2.8e8, 8.35e4   // GM estimated, mean radius
    },

    // ── Saturn ─────────────────────────────────────────────────────────────
    {
        "Mimas", "Saturn",
        { 1.85539e8, 0.0196, d2r_m(1.574), d2r_m(0.0), d2r_m(0.0),
          d2r_m(0.0), Constants::GM_SATURN },
        2.503e9, 1.982e5
    },
    {
        "Enceladus", "Saturn",
        { 2.38042e8, 0.0047, d2r_m(0.009), d2r_m(0.0), d2r_m(0.0),
          d2r_m(72.0), Constants::GM_SATURN },
        7.211e9, 2.521e5
    },
    {
        "Tethys", "Saturn",
        { 2.94672e8, 0.0001, d2r_m(1.091), d2r_m(0.0), d2r_m(0.0),
          d2r_m(144.0), Constants::GM_SATURN },
        4.121e10, 5.330e5
    },
    {
        "Dione", "Saturn",
        { 3.77415e8, 0.0022, d2r_m(0.028), d2r_m(0.0), d2r_m(0.0),
          d2r_m(216.0), Constants::GM_SATURN },
        7.311e10, 5.617e5
    },
    {
        "Rhea", "Saturn",
        { 5.27108e8, 0.0013, d2r_m(0.345), d2r_m(0.0), d2r_m(0.0),
          d2r_m(288.0), Constants::GM_SATURN },
        1.5394e11, 7.643e5
    },
    {
        "Titan", "Saturn",
        { 1.221870e9, 0.0288, d2r_m(0.348), d2r_m(28.06), d2r_m(180.532),
          d2r_m(180.0), Constants::GM_SATURN },
        Constants::GM_TITAN, 2.5747e6
    },
    {
        "Hyperion", "Saturn",
        { 1.481009e9, 0.1230, d2r_m(0.615), d2r_m(0.0), d2r_m(0.0),
          d2r_m(45.0), Constants::GM_SATURN },
        3.72e8, 1.350e5    // chaotic rotation — GM approximate
    },
    {
        "Iapetus", "Saturn",
        { 3.560820e9, 0.0286, d2r_m(14.72), d2r_m(0.0), d2r_m(0.0),
          d2r_m(270.0), Constants::GM_SATURN },
        1.2054e11, 7.345e5
    },

    // ── Uranus ─────────────────────────────────────────────────────────────
    // Uranus has 97.8° axial tilt — moon inclinations are to its equatorial plane
    {
        "Miranda", "Uranus",
        { 1.29390e8, 0.0013, d2r_m(4.338), d2r_m(0.0), d2r_m(0.0),
          d2r_m(0.0), Constants::GM_URANUS },
        4.4e9, 2.358e5
    },
    {
        "Ariel", "Uranus",
        { 1.91020e8, 0.0012, d2r_m(0.041), d2r_m(0.0), d2r_m(0.0),
          d2r_m(90.0), Constants::GM_URANUS },
        9.0e10, 5.789e5
    },
    {
        "Umbriel", "Uranus",
        { 2.66300e8, 0.0039, d2r_m(0.128), d2r_m(0.0), d2r_m(0.0),
          d2r_m(180.0), Constants::GM_URANUS },
        7.8e10, 5.847e5
    },
    {
        "Titania", "Uranus",
        { 4.35910e8, 0.0011, d2r_m(0.079), d2r_m(0.0), d2r_m(0.0),
          d2r_m(270.0), Constants::GM_URANUS },
        2.352e11, 7.889e5
    },
    {
        "Oberon", "Uranus",
        { 5.83520e8, 0.0014, d2r_m(0.068), d2r_m(0.0), d2r_m(0.0),
          d2r_m(45.0), Constants::GM_URANUS },
        2.011e11, 7.614e5
    },

    // ── Neptune ────────────────────────────────────────────────────────────
    {
        // Triton: retrograde orbit, i > 90°. Inclination 156.885° gives natural retrograde.
        "Triton", "Neptune",
        { 3.54759e8, 0.000016, d2r_m(156.885), d2r_m(177.608), d2r_m(66.142),
          d2r_m(0.0), Constants::GM_NEPTUNE },
        Constants::GM_TRITON, 1.3534e6
    },
    {
        "Nereid", "Neptune",
        { 5.513818e9, 0.7507, d2r_m(7.232), d2r_m(0.0), d2r_m(0.0),
          d2r_m(90.0), Constants::GM_NEPTUNE },
        2.062e9, 3.57e5
    },

    // ── Additional Jupiter moons — approximate group inclinations ────────────
    // Himalia group ~27°, Carme group ~165°, Ananke group ~149°, Pasiphae group ~152°
    // M0 distributed evenly (step≈6.923°)
    { "Himalia",      "Jupiter", { 1.1439e10,  0.0, d2r_m(27.5),  0.0, 0.0, d2r_m(0.0),   Constants::GM_JUPITER }, 0.0, 8.5e4   },
    { "Elara",        "Jupiter", { 1.17107e10, 0.0, d2r_m(26.6),  0.0, 0.0, d2r_m(6.923), Constants::GM_JUPITER }, 0.0, 4.0e4   },
    { "Pasiphae",     "Jupiter", { 2.34632e10, 0.0, d2r_m(147.9), 0.0, 0.0, d2r_m(13.846),Constants::GM_JUPITER }, 0.0, 2.5e4   },
    { "Sinope",       "Jupiter", { 2.36793e10, 0.0, d2r_m(153.3), 0.0, 0.0, d2r_m(20.769),Constants::GM_JUPITER }, 0.0, 1.9e4   },
    { "Lysithea",     "Jupiter", { 1.16991e10, 0.0, d2r_m(28.3),  0.0, 0.0, d2r_m(27.692),Constants::GM_JUPITER }, 0.0, 1.8e4   },
    { "Carme",        "Jupiter", { 2.31392e10, 0.0, d2r_m(165.0), 0.0, 0.0, d2r_m(34.615),Constants::GM_JUPITER }, 0.0, 2.3e4   },
    { "Ananke",       "Jupiter", { 2.10295e10, 0.0, d2r_m(148.9), 0.0, 0.0, d2r_m(41.538),Constants::GM_JUPITER }, 0.0, 1.4e4   },
    { "Leda",         "Jupiter", { 1.11452e10, 0.0, d2r_m(27.5),  0.0, 0.0, d2r_m(48.462),Constants::GM_JUPITER }, 0.0, 1.1e4   },
    { "Thebe",        "Jupiter", { 2.219e8,    0.0, d2r_m(1.1),   0.0, 0.0, d2r_m(55.385),Constants::GM_JUPITER }, 0.0, 4.9e4   },
    { "Adrastea",     "Jupiter", { 1.29e8,     0.0, d2r_m(0.1),   0.0, 0.0, d2r_m(62.308),Constants::GM_JUPITER }, 0.0, 8.2e3   },
    { "Metis",        "Jupiter", { 1.28e8,     0.0, d2r_m(0.1),   0.0, 0.0, d2r_m(69.231),Constants::GM_JUPITER }, 0.0, 2.15e4  },
    { "Callirrhoe",   "Jupiter", { 2.37894e10, 0.0, d2r_m(147.1), 0.0, 0.0, d2r_m(76.154),Constants::GM_JUPITER }, 0.0, 4.2e3   },
    { "Themisto",     "Jupiter", { 7.397e9,    0.0, d2r_m(43.1),  0.0, 0.0, d2r_m(83.077),Constants::GM_JUPITER }, 0.0, 4.0e3   },
    { "Megaclite",    "Jupiter", { 2.3807e10,  0.0, d2r_m(152.8), 0.0, 0.0, d2r_m(90.0),  Constants::GM_JUPITER }, 0.0, 3.0e3   },
    { "Taygete",      "Jupiter", { 2.3404e10,  0.0, d2r_m(165.2), 0.0, 0.0, d2r_m(96.923),Constants::GM_JUPITER }, 0.0, 2.5e3   },
    { "Chaldene",     "Jupiter", { 2.3005e10,  0.0, d2r_m(165.4), 0.0, 0.0, d2r_m(103.846),Constants::GM_JUPITER},0.0, 2.0e3   },
    { "Harpalyke",    "Jupiter", { 2.1105e10,  0.0, d2r_m(148.6), 0.0, 0.0, d2r_m(110.769),Constants::GM_JUPITER},0.0, 2.0e3   },
    { "Kalyke",       "Jupiter", { 2.3298e10,  0.0, d2r_m(165.2), 0.0, 0.0, d2r_m(117.692),Constants::GM_JUPITER},0.0, 2.5e3   },
    { "Iocaste",      "Jupiter", { 2.10623e10, 0.0, d2r_m(149.4), 0.0, 0.0, d2r_m(124.615),Constants::GM_JUPITER},0.0, 2.5e3   },
    { "Erinome",      "Jupiter", { 2.30272e10, 0.0, d2r_m(164.9), 0.0, 0.0, d2r_m(131.538),Constants::GM_JUPITER},0.0, 1.5e3   },
    { "Isonoe",       "Jupiter", { 2.29763e10, 0.0, d2r_m(165.1), 0.0, 0.0, d2r_m(138.462),Constants::GM_JUPITER},0.0, 2.0e3   },
    { "Praxidike",    "Jupiter", { 2.09311e10, 0.0, d2r_m(149.0), 0.0, 0.0, d2r_m(145.385),Constants::GM_JUPITER},0.0, 3.5e3   },
    { "Autonoe",      "Jupiter", { 2.37852e10, 0.0, d2r_m(152.9), 0.0, 0.0, d2r_m(152.308),Constants::GM_JUPITER},0.0, 2.0e3   },
    { "Thyone",       "Jupiter", { 2.09727e10, 0.0, d2r_m(148.8), 0.0, 0.0, d2r_m(159.231),Constants::GM_JUPITER},0.0, 2.0e3   },
    { "Hermippe",     "Jupiter", { 2.11036e10, 0.0, d2r_m(150.7), 0.0, 0.0, d2r_m(166.154),Constants::GM_JUPITER},0.0, 2.0e3   },
    { "Aitne",        "Jupiter", { 2.30594e10, 0.0, d2r_m(165.1), 0.0, 0.0, d2r_m(173.077),Constants::GM_JUPITER},0.0, 1.5e3   },
    { "Eurydome",     "Jupiter", { 2.28945e10, 0.0, d2r_m(150.3), 0.0, 0.0, d2r_m(180.0),  Constants::GM_JUPITER},0.0, 1.5e3   },
    { "Euanthe",      "Jupiter", { 2.08229e10, 0.0, d2r_m(148.9), 0.0, 0.0, d2r_m(186.923),Constants::GM_JUPITER},0.0, 1.5e3   },
    { "Euporie",      "Jupiter", { 1.92619e10, 0.0, d2r_m(145.8), 0.0, 0.0, d2r_m(193.846),Constants::GM_JUPITER},0.0, 1.0e3   },
    { "Orthosie",     "Jupiter", { 2.08978e10, 0.0, d2r_m(145.9), 0.0, 0.0, d2r_m(200.769),Constants::GM_JUPITER},0.0, 1.0e3   },
    { "Sponde",       "Jupiter", { 2.35387e10, 0.0, d2r_m(151.0), 0.0, 0.0, d2r_m(207.692),Constants::GM_JUPITER},0.0, 1.0e3   },
    { "Kale",         "Jupiter", { 2.30478e10, 0.0, d2r_m(165.0), 0.0, 0.0, d2r_m(214.615),Constants::GM_JUPITER},0.0, 1.0e3   },
    { "Pasithee",     "Jupiter", { 2.28408e10, 0.0, d2r_m(165.1), 0.0, 0.0, d2r_m(221.538),Constants::GM_JUPITER},0.0, 1.0e3   },
    { "Hegemone",     "Jupiter", { 2.33426e10, 0.0, d2r_m(152.5), 0.0, 0.0, d2r_m(228.462),Constants::GM_JUPITER},0.0, 1.5e3   },
    { "Mneme",        "Jupiter", { 2.08158e10, 0.0, d2r_m(148.6), 0.0, 0.0, d2r_m(235.385),Constants::GM_JUPITER},0.0, 1.0e3   },
    { "Aoede",        "Jupiter", { 2.37731e10, 0.0, d2r_m(158.3), 0.0, 0.0, d2r_m(242.308),Constants::GM_JUPITER},0.0, 2.0e3   },
    { "Thelxinoe",    "Jupiter", { 2.09723e10, 0.0, d2r_m(151.4), 0.0, 0.0, d2r_m(249.231),Constants::GM_JUPITER},0.0, 1.0e3   },
    { "Arche",        "Jupiter", { 2.30932e10, 0.0, d2r_m(165.0), 0.0, 0.0, d2r_m(256.154),Constants::GM_JUPITER},0.0, 1.5e3   },
    { "Kallichore",   "Jupiter", { 2.30171e10, 0.0, d2r_m(165.5), 0.0, 0.0, d2r_m(263.077),Constants::GM_JUPITER},0.0, 1.0e3   },
    { "Helike",       "Jupiter", { 2.09114e10, 0.0, d2r_m(154.8), 0.0, 0.0, d2r_m(270.0),  Constants::GM_JUPITER},0.0, 2.0e3   },
    { "Carpo",        "Jupiter", { 1.70395e10, 0.0, d2r_m(51.4),  0.0, 0.0, d2r_m(276.923),Constants::GM_JUPITER},0.0, 1.5e3   },
    { "Eukelade",     "Jupiter", { 2.30624e10, 0.0, d2r_m(165.2), 0.0, 0.0, d2r_m(283.846),Constants::GM_JUPITER},0.0, 1.5e3   },
    { "Cyllene",      "Jupiter", { 2.365e10,   0.0, d2r_m(149.3), 0.0, 0.0, d2r_m(290.769),Constants::GM_JUPITER},0.0, 1.0e3   },
    { "Kore",         "Jupiter", { 2.42033e10, 0.0, d2r_m(152.4), 0.0, 0.0, d2r_m(297.692),Constants::GM_JUPITER},0.0, 1.0e3   },
    { "Herse",        "Jupiter", { 2.31467e10, 0.0, d2r_m(162.5), 0.0, 0.0, d2r_m(304.615),Constants::GM_JUPITER},0.0, 1.0e3   },
    { "Dia",          "Jupiter", { 1.22579e10, 0.0, d2r_m(27.5),  0.0, 0.0, d2r_m(311.538),Constants::GM_JUPITER},0.0, 2.0e3   },
    { "Eirene",       "Jupiter", { 2.30513e10, 0.0, d2r_m(165.4), 0.0, 0.0, d2r_m(318.462),Constants::GM_JUPITER},0.0, 2.0e3   },
    { "Philophrosyne","Jupiter", { 2.26002e10, 0.0, d2r_m(164.9), 0.0, 0.0, d2r_m(325.385),Constants::GM_JUPITER},0.0, 2.0e3   },
    { "Eupheme",      "Jupiter", { 2.07634e10, 0.0, d2r_m(148.8), 0.0, 0.0, d2r_m(332.308),Constants::GM_JUPITER},0.0, 2.0e3   },
    { "Valetudo",     "Jupiter", { 1.86901e10, 0.0, d2r_m(34.0),  0.0, 0.0, d2r_m(339.231),Constants::GM_JUPITER},0.0, 5.0e2   },
    { "Pandia",       "Jupiter", { 1.1494e10,  0.0, d2r_m(28.1),  0.0, 0.0, d2r_m(346.154),Constants::GM_JUPITER},0.0, 1.75e3  },
    { "Ersa",         "Jupiter", { 1.13994e10, 0.0, d2r_m(29.4),  0.0, 0.0, d2r_m(353.077),Constants::GM_JUPITER},0.0, 1.75e3  },

    // ── Additional Saturn moons — Gallic ~36°, Inuit ~46°, Norse ~150-179° ───
    // Anthe uses corrected orbital distance (197700 km); JSON value appears erroneous.
    { "Phoebe",       "Saturn",  { 1.29294e10, 0.0, d2r_m(173.1), 0.0, 0.0, d2r_m(0.0),   Constants::GM_SATURN  }, 0.0, 1.065e5 },
    { "Janus",        "Saturn",  { 1.515e8,    0.0, d2r_m(0.2),   0.0, 0.0, d2r_m(6.207), Constants::GM_SATURN  }, 0.0, 9.0e4   },
    { "Epimetheus",   "Saturn",  { 1.514e8,    0.0, d2r_m(0.4),   0.0, 0.0, d2r_m(12.414),Constants::GM_SATURN  }, 0.0, 5.9e4   },
    { "Atlas",        "Saturn",  { 1.377e8,    0.0, d2r_m(0.0),   0.0, 0.0, d2r_m(18.621),Constants::GM_SATURN  }, 0.0, 1.51e4  },
    { "Prometheus",   "Saturn",  { 1.394e8,    0.0, d2r_m(0.1),   0.0, 0.0, d2r_m(24.828),Constants::GM_SATURN  }, 0.0, 4.31e4  },
    { "Pandora",      "Saturn",  { 1.417e8,    0.0, d2r_m(0.1),   0.0, 0.0, d2r_m(31.034),Constants::GM_SATURN  }, 0.0, 4.07e4  },
    { "Pan",          "Saturn",  { 1.336e8,    0.0, d2r_m(0.0),   0.0, 0.0, d2r_m(37.241),Constants::GM_SATURN  }, 0.0, 1.4e4   },
    { "Telesto",      "Saturn",  { 2.95e8,     0.0, d2r_m(1.2),   0.0, 0.0, d2r_m(43.448),Constants::GM_SATURN  }, 0.0, 1.25e4  },
    { "Calypso",      "Saturn",  { 2.95e8,     0.0, d2r_m(1.5),   0.0, 0.0, d2r_m(49.655),Constants::GM_SATURN  }, 0.0, 9.5e3   },
    { "Helene",       "Saturn",  { 3.776e8,    0.0, d2r_m(0.2),   0.0, 0.0, d2r_m(55.862),Constants::GM_SATURN  }, 0.0, 1.76e4  },
    { "Polydeuces",   "Saturn",  { 3.772e8,    0.0, d2r_m(0.2),   0.0, 0.0, d2r_m(62.069),Constants::GM_SATURN  }, 0.0, 1.7e3   },
    { "Methone",      "Saturn",  { 1.94e8,     0.0, d2r_m(0.0),   0.0, 0.0, d2r_m(68.276),Constants::GM_SATURN  }, 0.0, 1.45e3  },
    { "Pallene",      "Saturn",  { 2.123e8,    0.0, d2r_m(0.2),   0.0, 0.0, d2r_m(74.483),Constants::GM_SATURN  }, 0.0, 2.2e3   },
    { "Aegaeon",      "Saturn",  { 1.675e8,    0.0, d2r_m(0.0),   0.0, 0.0, d2r_m(80.690),Constants::GM_SATURN  }, 0.0, 2.5e2   },
    { "Ymir",         "Saturn",  { 2.29556e10, 0.0, d2r_m(172.9), 0.0, 0.0, d2r_m(86.897),Constants::GM_SATURN  }, 0.0, 9.0e3   },
    { "Paaliaq",      "Saturn",  { 1.49977e10, 0.0, d2r_m(45.1),  0.0, 0.0, d2r_m(93.103),Constants::GM_SATURN  }, 0.0, 1.1e4   },
    { "Tarvos",       "Saturn",  { 1.82166e10, 0.0, d2r_m(33.8),  0.0, 0.0, d2r_m(99.310),Constants::GM_SATURN  }, 0.0, 7.5e3   },
    { "Ijiraq",       "Saturn",  { 1.13447e10, 0.0, d2r_m(46.4),  0.0, 0.0, d2r_m(105.517),Constants::GM_SATURN }, 0.0, 6.0e3   },
    { "Suttungr",     "Saturn",  { 1.93919e10, 0.0, d2r_m(175.8), 0.0, 0.0, d2r_m(111.724),Constants::GM_SATURN }, 0.0, 3.5e3   },
    { "Kiviuq",       "Saturn",  { 1.13074e10, 0.0, d2r_m(45.7),  0.0, 0.0, d2r_m(117.931),Constants::GM_SATURN }, 0.0, 8.0e3   },
    { "Mundilfari",   "Saturn",  { 1.85882e10, 0.0, d2r_m(167.3), 0.0, 0.0, d2r_m(124.138),Constants::GM_SATURN }, 0.0, 3.5e3   },
    { "Albiorix",     "Saturn",  { 1.63292e10, 0.0, d2r_m(38.0),  0.0, 0.0, d2r_m(130.345),Constants::GM_SATURN }, 0.0, 1.6e4   },
    { "Skathi",       "Saturn",  { 1.55754e10, 0.0, d2r_m(152.7), 0.0, 0.0, d2r_m(136.552),Constants::GM_SATURN }, 0.0, 4.0e3   },
    { "Erriapus",     "Saturn",  { 1.75069e10, 0.0, d2r_m(34.5),  0.0, 0.0, d2r_m(142.759),Constants::GM_SATURN }, 0.0, 4.5e3   },
    { "Siarnaq",      "Saturn",  { 1.78811e10, 0.0, d2r_m(46.0),  0.0, 0.0, d2r_m(148.966),Constants::GM_SATURN }, 0.0, 2.0e4   },
    { "Thrymr",       "Saturn",  { 2.03305e10, 0.0, d2r_m(176.0), 0.0, 0.0, d2r_m(155.172),Constants::GM_SATURN }, 0.0, 3.5e3   },
    { "Narvi",        "Saturn",  { 1.9285e10,  0.0, d2r_m(145.8), 0.0, 0.0, d2r_m(161.379),Constants::GM_SATURN }, 0.0, 3.5e3   },
    { "Aegir",        "Saturn",  { 2.06644e10, 0.0, d2r_m(166.7), 0.0, 0.0, d2r_m(167.586),Constants::GM_SATURN }, 0.0, 3.0e3   },
    { "Bebhionn",     "Saturn",  { 1.70273e10, 0.0, d2r_m(35.0),  0.0, 0.0, d2r_m(173.793),Constants::GM_SATURN }, 0.0, 3.0e3   },
    { "Bergelmir",    "Saturn",  { 1.92681e10, 0.0, d2r_m(158.5), 0.0, 0.0, d2r_m(180.0),  Constants::GM_SATURN }, 0.0, 3.0e3   },
    { "Bestla",       "Saturn",  { 2.03378e10, 0.0, d2r_m(145.0), 0.0, 0.0, d2r_m(186.207),Constants::GM_SATURN }, 0.0, 3.5e3   },
    { "Farbauti",     "Saturn",  { 2.02907e10, 0.0, d2r_m(156.4), 0.0, 0.0, d2r_m(192.414),Constants::GM_SATURN }, 0.0, 2.5e3   },
    { "Fenrir",       "Saturn",  { 2.2045e10,  0.0, d2r_m(164.9), 0.0, 0.0, d2r_m(198.621),Constants::GM_SATURN }, 0.0, 2.0e3   },
    { "Fornjot",      "Saturn",  { 2.5108e10,  0.0, d2r_m(170.4), 0.0, 0.0, d2r_m(204.828),Constants::GM_SATURN }, 0.0, 3.0e3   },
    { "Greip",        "Saturn",  { 1.8361e10,  0.0, d2r_m(179.0), 0.0, 0.0, d2r_m(211.034),Constants::GM_SATURN }, 0.0, 3.0e3   },
    { "Hati",         "Saturn",  { 1.98e10,    0.0, d2r_m(165.8), 0.0, 0.0, d2r_m(217.241),Constants::GM_SATURN }, 0.0, 3.0e3   },
    { "Hyrrokkin",    "Saturn",  { 1.8437e10,  0.0, d2r_m(151.5), 0.0, 0.0, d2r_m(223.448),Constants::GM_SATURN }, 0.0, 4.0e3   },
    { "Jarnsaxa",     "Saturn",  { 2.008e10,   0.0, d2r_m(163.3), 0.0, 0.0, d2r_m(229.655),Constants::GM_SATURN }, 0.0, 3.0e3   },
    { "Kari",         "Saturn",  { 2.2094e10,  0.0, d2r_m(156.3), 0.0, 0.0, d2r_m(235.862),Constants::GM_SATURN }, 0.0, 3.5e3   },
    { "Loge",         "Saturn",  { 2.3058e10,  0.0, d2r_m(167.8), 0.0, 0.0, d2r_m(242.069),Constants::GM_SATURN }, 0.0, 3.0e3   },
    { "Skoll",        "Saturn",  { 1.7665e10,  0.0, d2r_m(161.2), 0.0, 0.0, d2r_m(248.276),Constants::GM_SATURN }, 0.0, 3.0e3   },
    { "Skrymir",      "Saturn",  { 2.14474e10, 0.0, d2r_m(162.4), 0.0, 0.0, d2r_m(254.483),Constants::GM_SATURN }, 0.0, 2.5e3   },
    { "Surtur",       "Saturn",  { 2.2189e10,  0.0, d2r_m(177.5), 0.0, 0.0, d2r_m(260.690),Constants::GM_SATURN }, 0.0, 2.5e3   },
    { "Anthe",        "Saturn",  { 1.977e8,    0.0, d2r_m(0.1),   0.0, 0.0, d2r_m(266.897),Constants::GM_SATURN }, 0.0, 1.0e3   },
    { "Daphnis",      "Saturn",  { 1.365e8,    0.0, d2r_m(0.0),   0.0, 0.0, d2r_m(273.103),Constants::GM_SATURN }, 0.0, 3.8e3   },
    { "Gridr",        "Saturn",  { 1.9887e10,  0.0, d2r_m(179.5), 0.0, 0.0, d2r_m(279.310),Constants::GM_SATURN }, 0.0, 2.5e3   },
    { "Angrboda",     "Saturn",  { 2.05915e10, 0.0, d2r_m(169.8), 0.0, 0.0, d2r_m(285.517),Constants::GM_SATURN }, 0.0, 2.5e3   },
    { "Gerd",         "Saturn",  { 2.09475e10, 0.0, d2r_m(139.8), 0.0, 0.0, d2r_m(291.724),Constants::GM_SATURN }, 0.0, 2.5e3   },
    { "Geirrod",      "Saturn",  { 2.22594e10, 0.0, d2r_m(173.3), 0.0, 0.0, d2r_m(297.931),Constants::GM_SATURN }, 0.0, 2.5e3   },
    { "Eggther",      "Saturn",  { 1.98446e10, 0.0, d2r_m(173.0), 0.0, 0.0, d2r_m(304.138),Constants::GM_SATURN }, 0.0, 2.5e3   },
    { "Thiazzi",      "Saturn",  { 2.35775e10, 0.0, d2r_m(170.0), 0.0, 0.0, d2r_m(310.345),Constants::GM_SATURN }, 0.0, 2.5e3   },
    { "Beli",         "Saturn",  { 2.07037e10, 0.0, d2r_m(158.0), 0.0, 0.0, d2r_m(316.552),Constants::GM_SATURN }, 0.0, 2.5e3   },
    { "Alvaldi",      "Saturn",  { 2.19938e10, 0.0, d2r_m(169.0), 0.0, 0.0, d2r_m(322.759),Constants::GM_SATURN }, 0.0, 2.5e3   },
    { "Rymgr",        "Saturn",  { 2.3e10,     0.0, d2r_m(175.0), 0.0, 0.0, d2r_m(328.966),Constants::GM_SATURN }, 0.0, 2.5e3   },
    { "Yngvild",      "Saturn",  { 2.3e10,     0.0, d2r_m(165.0), 0.0, 0.0, d2r_m(335.172),Constants::GM_SATURN }, 0.0, 2.5e3   },
    { "Thyra",        "Saturn",  { 2.3e10,     0.0, d2r_m(170.0), 0.0, 0.0, d2r_m(341.379),Constants::GM_SATURN }, 0.0, 2.5e3   },
    { "Tarqeq",       "Saturn",  { 1.791e10,   0.0, d2r_m(46.1),  0.0, 0.0, d2r_m(347.586),Constants::GM_SATURN }, 0.0, 3.5e3   },
    { "Gunnlod",      "Saturn",  { 2.11418e10, 0.0, d2r_m(172.0), 0.0, 0.0, d2r_m(353.793),Constants::GM_SATURN }, 0.0, 2.5e3   },

    // ── Additional Uranus moons — inner ~0°, irregular retrograde ~140-170° ───
    { "Puck",         "Uranus",  { 8.6004e7,   0.0, d2r_m(0.3),   0.0, 0.0, d2r_m(0.0),   Constants::GM_URANUS  }, 0.0, 8.1e4   },
    { "Portia",       "Uranus",  { 6.6101e7,   0.0, d2r_m(0.1),   0.0, 0.0, d2r_m(15.0),  Constants::GM_URANUS  }, 0.0, 6.75e4  },
    { "Juliet",       "Uranus",  { 6.4362e7,   0.0, d2r_m(0.1),   0.0, 0.0, d2r_m(30.0),  Constants::GM_URANUS  }, 0.0, 4.7e4   },
    { "Cressida",     "Uranus",  { 6.177e7,    0.0, d2r_m(0.0),   0.0, 0.0, d2r_m(45.0),  Constants::GM_URANUS  }, 0.0, 3.9e4   },
    { "Desdemona",    "Uranus",  { 6.2663e7,   0.0, d2r_m(0.2),   0.0, 0.0, d2r_m(60.0),  Constants::GM_URANUS  }, 0.0, 3.2e4   },
    { "Rosalind",     "Uranus",  { 6.993e7,    0.0, d2r_m(0.3),   0.0, 0.0, d2r_m(75.0),  Constants::GM_URANUS  }, 0.0, 3.6e4   },
    { "Belinda",      "Uranus",  { 7.5258e7,   0.0, d2r_m(0.0),   0.0, 0.0, d2r_m(90.0),  Constants::GM_URANUS  }, 0.0, 4.05e4  },
    { "Perdita",      "Uranus",  { 7.6418e7,   0.0, d2r_m(0.0),   0.0, 0.0, d2r_m(105.0), Constants::GM_URANUS  }, 0.0, 1.5e4   },
    { "Cupid",        "Uranus",  { 7.4396e7,   0.0, d2r_m(0.1),   0.0, 0.0, d2r_m(120.0), Constants::GM_URANUS  }, 0.0, 9.0e3   },
    { "Mab",          "Uranus",  { 9.7737e7,   0.0, d2r_m(0.1),   0.0, 0.0, d2r_m(135.0), Constants::GM_URANUS  }, 0.0, 5.0e3   },
    { "Bianca",       "Uranus",  { 5.917e7,    0.0, d2r_m(0.2),   0.0, 0.0, d2r_m(150.0), Constants::GM_URANUS  }, 0.0, 2.55e4  },
    { "Cordelia",     "Uranus",  { 4.9755e7,   0.0, d2r_m(0.1),   0.0, 0.0, d2r_m(165.0), Constants::GM_URANUS  }, 0.0, 2.0e4   },
    { "Ophelia",      "Uranus",  { 5.3765e7,   0.0, d2r_m(0.1),   0.0, 0.0, d2r_m(180.0), Constants::GM_URANUS  }, 0.0, 2.15e4  },
    { "Caliban",      "Uranus",  { 7.167e9,    0.0, d2r_m(139.9), 0.0, 0.0, d2r_m(195.0), Constants::GM_URANUS  }, 0.0, 3.6e4   },
    { "Sycorax",      "Uranus",  { 1.21932e10, 0.0, d2r_m(153.6), 0.0, 0.0, d2r_m(210.0), Constants::GM_URANUS  }, 0.0, 7.5e4   },
    { "Prospero",     "Uranus",  { 1.6221e10,  0.0, d2r_m(151.9), 0.0, 0.0, d2r_m(225.0), Constants::GM_URANUS  }, 0.0, 2.5e4   },
    { "Setebos",      "Uranus",  { 1.75198e10, 0.0, d2r_m(158.2), 0.0, 0.0, d2r_m(240.0), Constants::GM_URANUS  }, 0.0, 2.4e4   },
    { "Stephano",     "Uranus",  { 7.9514e9,   0.0, d2r_m(143.8), 0.0, 0.0, d2r_m(255.0), Constants::GM_URANUS  }, 0.0, 1.6e4   },
    { "Trinculo",     "Uranus",  { 8.5026e9,   0.0, d2r_m(167.1), 0.0, 0.0, d2r_m(270.0), Constants::GM_URANUS  }, 0.0, 9.0e3   },
    { "Francisco",    "Uranus",  { 4.2757e9,   0.0, d2r_m(147.3), 0.0, 0.0, d2r_m(285.0), Constants::GM_URANUS  }, 0.0, 1.1e4   },
    { "Margaret",     "Uranus",  { 1.4425e10,  0.0, d2r_m(57.4),  0.0, 0.0, d2r_m(300.0), Constants::GM_URANUS  }, 0.0, 1.0e4   },
    { "Ferdinand",    "Uranus",  { 2.04214e10, 0.0, d2r_m(169.9), 0.0, 0.0, d2r_m(315.0), Constants::GM_URANUS  }, 0.0, 1.2e4   },
    { "S/2023 U1",    "Uranus",  { 7.9766e9,   0.0, d2r_m(150.0), 0.0, 0.0, d2r_m(330.0), Constants::GM_URANUS  }, 0.0, 4.0e3   },
    { "S/2025 U1",    "Uranus",  { 5.7844e7,   0.0, d2r_m(0.5),   0.0, 0.0, d2r_m(345.0), Constants::GM_URANUS  }, 0.0, 4.0e3   },

    // ── Additional Neptune moons — inner ~0-5°, irregular retrograde ~133-137° ─
    { "Proteus",      "Neptune", { 1.177e8,    0.0, d2r_m(0.5),   0.0, 0.0, d2r_m(0.0),   Constants::GM_NEPTUNE }, 0.0, 2.09e5  },
    { "Larissa",      "Neptune", { 7.36e7,     0.0, d2r_m(0.2),   0.0, 0.0, d2r_m(25.714),Constants::GM_NEPTUNE }, 0.0, 9.7e4   },
    { "Galatea",      "Neptune", { 6.2e7,      0.0, d2r_m(0.1),   0.0, 0.0, d2r_m(51.429),Constants::GM_NEPTUNE }, 0.0, 7.9e4   },
    { "Despina",      "Neptune", { 5.26e7,     0.0, d2r_m(0.1),   0.0, 0.0, d2r_m(77.143),Constants::GM_NEPTUNE }, 0.0, 7.4e4   },
    { "Thalassa",     "Neptune", { 5.01e7,     0.0, d2r_m(0.1),   0.0, 0.0, d2r_m(102.857),Constants::GM_NEPTUNE}, 0.0, 4.0e4   },
    { "Naiad",        "Neptune", { 4.83e7,     0.0, d2r_m(4.7),   0.0, 0.0, d2r_m(128.571),Constants::GM_NEPTUNE}, 0.0, 3.3e4   },
    { "Hippocamp",    "Neptune", { 1.053e8,    0.0, d2r_m(0.0),   0.0, 0.0, d2r_m(154.286),Constants::GM_NEPTUNE}, 0.0, 1.7e4   },
    { "Halimede",     "Neptune", { 1.6611e10,  0.0, d2r_m(134.1), 0.0, 0.0, d2r_m(180.0),  Constants::GM_NEPTUNE}, 0.0, 3.1e4   },
    { "Psamathe",     "Neptune", { 4.6695e10,  0.0, d2r_m(137.4), 0.0, 0.0, d2r_m(205.714),Constants::GM_NEPTUNE}, 0.0, 2.0e4   },
    { "Sao",          "Neptune", { 2.2422e10,  0.0, d2r_m(49.9),  0.0, 0.0, d2r_m(231.429),Constants::GM_NEPTUNE}, 0.0, 2.2e4   },
    { "Laomedeia",    "Neptune", { 2.3571e10,  0.0, d2r_m(34.7),  0.0, 0.0, d2r_m(257.143),Constants::GM_NEPTUNE}, 0.0, 2.1e4   },
    { "Neso",         "Neptune", { 4.8387e10,  0.0, d2r_m(132.6), 0.0, 0.0, d2r_m(282.857),Constants::GM_NEPTUNE}, 0.0, 3.0e4   },
    { "S/2021 N1",    "Neptune", { 5.0e10,     0.0, d2r_m(130.0), 0.0, 0.0, d2r_m(308.571),Constants::GM_NEPTUNE}, 0.0, 1.5e4   },
    { "S/2002 N5",    "Neptune", { 2.5e10,     0.0, d2r_m(132.0), 0.0, 0.0, d2r_m(334.286),Constants::GM_NEPTUNE}, 0.0, 1.5e4   }
}};
