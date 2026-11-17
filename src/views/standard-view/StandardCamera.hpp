#pragma once
#include <glm/glm.hpp>
#include <glm/gtc/matrix_transform.hpp>
#include <algorithm>
#include <cmath>

// Follow/cockpit camera for the standard (ship) view.
// Sits at target - distance*lookDir and looks forward through target.
// At distance=0 → first-person inside the ship.
// As distance grows → ship visible centred in frame.
// The solar system simulation is entirely unaware of this camera — it is a
// pure observer that reads no simulation state and writes none.
class StandardCamera {
public:
    glm::vec3 target     = {0.f, 0.f, 0.f};
    float     distance   = 0.01f;
    float     fov        = 45.f;
    float     near_plane = 0.001f;
    float     far_plane  = 500.f;
    float     max_distance = 32.f;
    float     azimuth    = 45.f;   // degrees, unrestricted
    float     elevation  = 25.f;   // degrees, clamped to ±85

    glm::vec3 lookDir() const {
        float el = glm::radians(elevation);
        float az = glm::radians(azimuth);
        return { std::cos(el)*std::cos(az),
                 std::sin(el),
                 std::cos(el)*std::sin(az) };
    }

    // Camera position: behind the ship in the look direction.
    glm::vec3 position() const { return target - distance * lookDir(); }

    // View matrix: camera behind ship, looking forward through it.
    glm::mat4 viewMatrix() const {
        glm::vec3 dir = lookDir();
        return glm::lookAt(target - distance * dir,
                           target + dir,
                           glm::vec3(0.f, 1.f, 0.f));
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
