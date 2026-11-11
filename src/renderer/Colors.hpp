#pragma once
#include <glm/glm.hpp>
#include <array>
#include <string_view>

struct BodyVisual {
    const char* name;
    glm::vec3   color;
    float       visual_radius;  // AU — dramatically scaled up for visibility at solar-system zoom
};

// Visual appearance for all rendered bodies.
// True-scale radii would be invisible dots at the AU overview scale; these
// are exaggerated to give a readable hierarchy.  When zoomed in to a zone
// the camera-distance naturally makes bodies look larger anyway.
inline constexpr std::array<BodyVisual, 16> BODY_VISUALS = {{
    {"Sun",      {1.00f, 0.95f, 0.70f}, 0.12f},
    {"Mercury",  {0.60f, 0.55f, 0.50f}, 0.018f},
    {"Venus",    {0.95f, 0.85f, 0.60f}, 0.028f},
    {"Earth",    {0.25f, 0.50f, 0.90f}, 0.030f},
    {"Mars",     {0.80f, 0.35f, 0.20f}, 0.022f},
    {"Jupiter",  {0.90f, 0.75f, 0.55f}, 0.070f},
    {"Saturn",   {0.95f, 0.88f, 0.65f}, 0.062f},
    {"Uranus",   {0.55f, 0.85f, 0.90f}, 0.042f},
    {"Neptune",  {0.25f, 0.40f, 0.90f}, 0.038f},
    {"Moon",     {0.80f, 0.80f, 0.80f}, 0.008f},
    {"Titan",    {0.90f, 0.75f, 0.45f}, 0.010f},
    {"Io",       {0.95f, 0.90f, 0.30f}, 0.008f},
    {"Europa",   {0.80f, 0.80f, 0.90f}, 0.007f},
    {"Ganymede", {0.70f, 0.70f, 0.70f}, 0.010f},
    {"Callisto", {0.55f, 0.50f, 0.45f}, 0.009f},
    {"Triton",   {0.70f, 0.85f, 0.90f}, 0.008f},
}};

inline const BodyVisual* findBodyVisual(std::string_view name) {
    for (const auto& v : BODY_VISUALS)
        if (name == v.name) return &v;
    return nullptr;
}

// Orbital line colors, indexed parallel to PLANETS array order
inline constexpr std::array<glm::vec4, 8> ORBIT_COLORS = {{
    {0.60f, 0.55f, 0.50f, 0.30f},  // Mercury
    {0.95f, 0.85f, 0.60f, 0.30f},  // Venus
    {0.25f, 0.50f, 0.90f, 0.30f},  // Earth
    {0.80f, 0.35f, 0.20f, 0.30f},  // Mars
    {0.90f, 0.75f, 0.55f, 0.30f},  // Jupiter
    {0.95f, 0.88f, 0.65f, 0.30f},  // Saturn
    {0.55f, 0.85f, 0.90f, 0.30f},  // Uranus
    {0.25f, 0.40f, 0.90f, 0.30f},  // Neptune
}};
