#pragma once
#include <glm/glm.hpp>
#include <array>
#include <string_view>

struct BodyVisual {
    const char* name;
    glm::vec3   color;
    float       visual_radius;  // AU — true equatorial radius / AU
};

// True-scale equatorial radii (R_body / AU).  At solar-system zoom planets
// are tiny dots, exactly as they appear in space.  Zoom into a planetary zone
// to see them as resolved discs.
inline constexpr std::array<BodyVisual, 9> BODY_VISUALS = {{
    {"Sun",     {1.00f, 0.95f, 0.70f}, 0.004650f},    // 695700 km
    {"Mercury", {0.60f, 0.55f, 0.50f}, 1.631e-5f},    //   2440 km
    {"Venus",   {0.95f, 0.85f, 0.60f}, 4.046e-5f},    //   6052 km
    {"Earth",   {0.25f, 0.50f, 0.90f}, 4.263e-5f},    //   6378 km
    {"Mars",    {0.80f, 0.35f, 0.20f}, 2.265e-5f},    //   3390 km
    {"Jupiter", {0.90f, 0.75f, 0.55f}, 4.779e-4f},    //  71492 km
    {"Saturn",  {0.95f, 0.88f, 0.65f}, 4.029e-4f},    //  60268 km
    {"Uranus",  {0.55f, 0.85f, 0.90f}, 1.709e-4f},    //  25559 km
    {"Neptune", {0.25f, 0.40f, 0.90f}, 1.656e-4f},    //  24764 km
}};

inline const BodyVisual* findBodyVisual(std::string_view name) {
    for (const auto& v : BODY_VISUALS)
        if (name == v.name) return &v;
    return nullptr;
}

