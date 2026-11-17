#pragma once
#include <glm/glm.hpp>
#include <glm/gtc/matrix_transform.hpp>
#include <algorithm>
#include <cmath>

// Orbital camera for the solar overview.
// Sits at target + distance*lookDir and looks back at target.
// The solar system simulation is entirely unaware of this camera — it is a
// pure observer that reads no simulation state and writes none.
class SolarCamera {
public:
    glm::vec3 target     = {0.f, 0.f, 0.f};
    float     distance   = 50.f;
    float     fov        = 45.f;
    float     near_plane = 0.001f;
    float     far_plane  = 500.f;
    float     max_distance = 400.f;
    float     azimuth    = 45.f;   // degrees, unrestricted
    float     elevation  = 25.f;   // degrees, clamped to ±85

    glm::vec3 lookDir() const {
        float el = glm::radians(elevation);
        float az = glm::radians(azimuth);
        return { std::cos(el)*std::cos(az),
                 std::sin(el),
                 std::cos(el)*std::sin(az) };
    }

    glm::vec3 position() const { return target + distance * lookDir(); }

    glm::mat4 viewMatrix() const {
        return glm::lookAt(position(), target, glm::vec3(0.f, 1.f, 0.f));
    }

    glm::mat4 projMatrix(float aspect) const {
        return glm::perspective(glm::radians(fov), aspect, near_plane, far_plane);
    }

    void handleMouse(float dx, float dy) {
        azimuth   += dx * 0.3f;
        elevation -= dy * 0.3f;
        elevation  = std::clamp(elevation, -85.f, 85.f);
    }

    void handleScroll(float delta) {
        distance *= std::pow(0.95f, delta);
        distance  = std::clamp(distance, 1.0e-9f, max_distance);
    }
};
