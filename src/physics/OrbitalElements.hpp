#pragma once

// Keplerian orbital elements (J2000 ecliptic reference frame)
// All angles in radians, distances in meters
struct OrbitalElements {
    double a;          // semi-major axis (m)
    double e;          // eccentricity [0, 1)
    double i;          // inclination (rad)
    double Omega;      // longitude of ascending node (rad)
    double omega;      // argument of periapsis (rad)
    double M0;         // mean anomaly at J2000 epoch (rad)
    double GM_parent;  // gravitational parameter of parent body (m³/s²)
};

// A body fully described for simulation
struct CelestialBody {
    const char* name;
    const char* parent;      // "Sun", "Earth", "Mars", etc.
    OrbitalElements elements;
    double GM;               // m³/s²
    double radius;           // m
};
