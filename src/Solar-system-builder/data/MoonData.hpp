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

inline constexpr std::array<CelestialBody, 23> MOONS = {{

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
    }
}};
