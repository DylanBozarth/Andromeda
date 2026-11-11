#pragma once
#include <glm/glm.hpp>
#include <glm/gtc/matrix_transform.hpp>
#include <algorithm>
#include <cmath>

// Spherical orbit camera. The camera orbits a target point in scene space
// (1 scene unit = 1 AU).  Right-drag to orbit, middle-drag to pan, scroll
// to zoom.  Press F in the main loop to focus on the ship.
class Camera3D {
public:
    glm::vec3 target   = {0.f, 0.f, 0.f};
    float elevation    = 25.f;    // degrees above ecliptic
    float azimuth      = 45.f;    // degrees around ecliptic
    float distance     = 20.f;    // scene units (AU)
    float fov          = 45.f;    // vertical FOV degrees
    float near_plane   = 0.001f;  // AU
    float far_plane    = 500.f;   // AU

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
        glm::vec3 pos = position();
        glm::vec3 dir = glm::normalize(target - pos);
        glm::vec3 up  = (std::abs(dir.y) > 0.99f)
                        ? glm::vec3(0.f, 0.f, 1.f)
                        : glm::vec3(0.f, 1.f, 0.f);
        return glm::lookAt(pos, target, up);
    }

    glm::mat4 projMatrix(float aspect) const {
        return glm::perspective(glm::radians(fov), aspect, near_plane, far_plane);
    }

    // dx/dy in screen pixels; orbit = right-drag, pan = middle-drag
    void handleMouse(float dx, float dy, bool orbit, bool pan) {
        if (orbit) {
            azimuth   += dx * 0.3f;
            elevation -= dy * 0.3f;
            elevation  = std::clamp(elevation, -89.f, 89.f);
        }
        if (pan) {
            glm::mat4 v = viewMatrix();
            glm::vec3 right(v[0][0], v[1][0], v[2][0]);
            glm::vec3 up   (v[0][1], v[1][1], v[2][1]);
            float spd = distance * 0.001f;
            target -= right * dx * spd;
            target += up    * dy * spd;
        }
    }

    void handleScroll(float delta) {
        distance *= std::pow(0.9f, delta);
        distance  = std::clamp(distance, 0.0005f, 400.f);
    }

    void focusOn(glm::vec3 pos, float view_dist) {
        target   = pos;
        distance = view_dist;
    }
};
