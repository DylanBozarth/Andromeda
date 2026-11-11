#pragma once
#include <glm/glm.hpp>
#include <glm/gtc/matrix_transform.hpp>
#include <algorithm>
#include <cmath>

// Orbit camera locked to a target point.
//
// Azimuth:   unrestricted — full 360° horizontal spin, wraps continuously.
// Elevation: clamped to ±85° — goes well above and below the ecliptic, but
//            stops before the ±90° pole.  At exactly ±90° the world-Y up
//            vector becomes collinear with the view direction and any camera
//            model must either snap or go upside-down; the clamp prevents
//            that entirely.  Every production space game uses this approach.
class Camera3D {
public:
    glm::vec3 target     = {0.f, 0.f, 0.f};
    float     distance   = 0.01f;    // scene units (AU) — ~1.5 Mkm, frames a ship near Earth
    float     fov        = 45.f;     // degrees
    float     near_plane = 0.001f;   // AU
    float     far_plane  = 500.f;    // AU

    float azimuth   = 45.f;    // degrees, unrestricted
    float elevation = 25.f;    // degrees, clamped to ±85

    glm::vec3 position() const {
        float el = glm::radians(elevation);
        float az = glm::radians(azimuth);
        return target + distance * glm::vec3(
            std::cos(el) * std::cos(az),
            std::sin(el),
            std::cos(el) * std::sin(az)
        );
    }

    glm::mat4 viewMatrix() const {
        // With elevation clamped to ±85°, dir.y < 0.996, so world-Y is never
        // collinear with the view direction — no pole fallback needed.
        return glm::lookAt(position(), target, glm::vec3(0.f, 1.f, 0.f));
    }

    glm::mat4 projMatrix(float aspect) const {
        return glm::perspective(glm::radians(fov), aspect, near_plane, far_plane);
    }

    void handleMouse(float dx, float dy, bool orbit, bool /*pan*/) {
        if (!orbit) return;
        azimuth   += dx * 0.3f;
        elevation -= dy * 0.3f;
        elevation  = std::clamp(elevation, -85.f, 85.f);
    }

    void handleScroll(float delta) {
        distance *= std::pow(0.9f, delta);
        distance  = std::clamp(distance, 0.0005f, 400.f);
    }

    void focusOn(glm::vec3 pos, float d) { target = pos; distance = d; }
};
