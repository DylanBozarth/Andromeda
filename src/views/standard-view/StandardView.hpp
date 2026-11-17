#pragma once
#include "math/Vec3.hpp"
#include <string>

// A light pulse emitted at a planet; becomes visible when the wavefront
// reaches the ship. Owned by StandardView (flash rendering is standard-only).
struct FlashEvent {
    std::string planet_name;
    Vec3        pos_emit;
    double      t_emitted;
    double      t_arrive;
    float       real_arrive;
    bool        arrived = false;
};
