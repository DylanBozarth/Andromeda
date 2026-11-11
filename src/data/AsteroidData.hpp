#pragma once
#include "physics/OrbitalElements.hpp"
#include "math/Constants.hpp"
#include <array>

// Notable main-belt asteroids — orbital elements from MPC catalog (J2000)
// Mass estimates are approximate; many are poorly constrained.
// M0 values are set to epoch 2000-01-01.5 TT from MPC data where available,
// otherwise distributed to avoid visual clustering.

namespace {
    constexpr double d2r_a(double deg) { return deg * Constants::DEG2RAD; }
}

struct Asteroid {
    int number;
    const char* name;
    OrbitalElements elements;
    double radius;    // m (mean)
    double mass;      // kg (approximate)
};

inline constexpr std::array<Asteroid, 20> ASTEROIDS = {{
    { 1, "Ceres",
      { 2.7675 * Constants::AU, 0.0760, d2r_a(10.59), d2r_a(80.33),  d2r_a(72.52),  d2r_a(95.99),  Constants::GM_SUN },
      4.73e5, 9.3835e20 },

    { 2, "Pallas",
      { 2.7719 * Constants::AU, 0.2302, d2r_a(34.84), d2r_a(173.09), d2r_a(310.05), d2r_a(78.17),  Constants::GM_SUN },
      2.56e5, 2.04e20 },

    { 3, "Juno",
      { 2.6686 * Constants::AU, 0.2575, d2r_a(12.99), d2r_a(169.87), d2r_a(248.41), d2r_a(23.19),  Constants::GM_SUN },
      1.23e5, 2.67e19 },

    { 4, "Vesta",
      { 2.3615 * Constants::AU, 0.0890, d2r_a(7.14),  d2r_a(103.85), d2r_a(149.84), d2r_a(20.86),  Constants::GM_SUN },
      2.629e5, 2.59e20 },

    { 5, "Astraea",
      { 2.5744 * Constants::AU, 0.1893, d2r_a(5.37),  d2r_a(141.57), d2r_a(358.93), d2r_a(239.36), Constants::GM_SUN },
      5.9e4, 2.3e18 },

    { 6, "Hebe",
      { 2.4252 * Constants::AU, 0.2024, d2r_a(14.75), d2r_a(138.65), d2r_a(239.49), d2r_a(185.18), Constants::GM_SUN },
      9.25e4, 1.28e19 },

    { 7, "Iris",
      { 2.3862 * Constants::AU, 0.2302, d2r_a(5.52),  d2r_a(259.49), d2r_a(145.51), d2r_a(337.17), Constants::GM_SUN },
      1.0e5,  1.56e19 },

    { 8, "Flora",
      { 2.2017 * Constants::AU, 0.1564, d2r_a(5.89),  d2r_a(110.87), d2r_a(285.09), d2r_a(285.09), Constants::GM_SUN },
      6.76e4, 8.47e18 },

    { 10, "Hygiea",
      { 3.1416 * Constants::AU, 0.1127, d2r_a(3.84),  d2r_a(283.44), d2r_a(312.03), d2r_a(312.03), Constants::GM_SUN },
      2.17e5, 8.67e19 },

    { 15, "Eunomia",
      { 2.6436 * Constants::AU, 0.1868, d2r_a(11.74), d2r_a(292.91), d2r_a(97.90),  d2r_a(140.0),  Constants::GM_SUN },
      1.36e5, 3.12e19 },

    { 16, "Psyche",
      { 2.9226 * Constants::AU, 0.1341, d2r_a(3.10),  d2r_a(150.00), d2r_a(227.47), d2r_a(100.0),  Constants::GM_SUN },
      1.13e5, 2.41e19 },

    { 29, "Amphitrite",
      { 2.5547 * Constants::AU, 0.0724, d2r_a(6.08),  d2r_a(356.42), d2r_a(62.21),  d2r_a(60.0),   Constants::GM_SUN },
      9.4e4,  1.18e19 },

    { 52, "Europa",   // asteroid — not to be confused with Jupiter's moon
      { 3.1016 * Constants::AU, 0.1012, d2r_a(7.47),  d2r_a(128.64), d2r_a(343.37), d2r_a(200.0),  Constants::GM_SUN },
      1.57e5, 3.7e19 },

    { 65, "Cybele",
      { 3.4318 * Constants::AU, 0.1047, d2r_a(3.55),  d2r_a(155.38), d2r_a(106.37), d2r_a(300.0),  Constants::GM_SUN },
      1.195e5, 1.78e19 },

    { 87, "Sylvia",
      { 3.4875 * Constants::AU, 0.0795, d2r_a(10.87), d2r_a(73.00),  d2r_a(266.19), d2r_a(45.0),   Constants::GM_SUN },
      1.435e5, 1.478e19 },

    { 107, "Camilla",
      { 3.4849 * Constants::AU, 0.0715, d2r_a(10.00), d2r_a(173.08), d2r_a(296.00), d2r_a(320.0),  Constants::GM_SUN },
      1.065e5, 1.12e19 },

    { 324, "Bamberga",
      { 2.6816 * Constants::AU, 0.3407, d2r_a(11.14), d2r_a(327.86), d2r_a(43.08),  d2r_a(170.0),  Constants::GM_SUN },
      1.14e5, 1.0e19 },

    { 532, "Herculina",
      { 2.7714 * Constants::AU, 0.1758, d2r_a(16.36), d2r_a(107.59), d2r_a(73.27),  d2r_a(220.0),  Constants::GM_SUN },
      1.1e5,  7.9e18 },

    { 704, "Interamnia",
      { 3.0603 * Constants::AU, 0.1529, d2r_a(17.30), d2r_a(280.35), d2r_a(93.73),  d2r_a(10.0),   Constants::GM_SUN },
      1.68e5, 3.9e19 },

    { 2060, "Chiron",   // centaur — unusually large, orbits between Saturn and Uranus
      { 13.648 * Constants::AU, 0.3831, d2r_a(6.93),  d2r_a(209.14), d2r_a(339.56), d2r_a(130.0),  Constants::GM_SUN },
      1.06e5, 4.0e18 }
}};
