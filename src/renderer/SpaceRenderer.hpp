#pragma once
#include "GL.hpp"
#include "Shader.hpp"
#include "Mesh.hpp"
#include "Camera3D.hpp"
#include "Colors.hpp"
#include "simulation/SolarSystem.hpp"
#include "spacecraft/Spacecraft.hpp"
#include "observation/LightCone.hpp"
#include <glm/glm.hpp>
#include <vector>
#include <string>

// Represents one triggered flash event: a pulse emitted at a planet at t_emitted
// that travels toward the ship at c and becomes visible when the wavefront arrives.
struct FlashEvent {
    std::string planet_name;
    Vec3        pos_emit;      // solar-frame planet position at emission
    double      t_emitted;    // sim time of emission
    double      t_arrive;     // sim time when wavefront reaches ship
    float       real_arrive;  // glfwGetTime() when first shown (set on arrival)
    bool        arrived = false;
};

class SpaceRenderer {
public:
    // Call once after the GLFW context is current.
    void init(GLFWwindow* win, int width, int height);

    // Call when the framebuffer is resized.
    void resize(int width, int height);

    // Process keyboard + mouse input (call before render each frame).
    void processInput(GLFWwindow* win, const Spacecraft& ship);

    // Draw the full frame including the ImGui overlay.
    // ImGui frame lifecycle is handled internally.
    void render(double sim_t,
                const SolarSystem& sys,
                const Spacecraft& ship,
                const LightCone& observer,
                GLFWwindow* win);

    Camera3D& camera() { return m_cam; }

    // Emit a flash at planet_name's current position and record its arrival time.
    void triggerFlash(const std::string& planet_name, double sim_t,
                      const SolarSystem& sys, const Spacecraft& ship);

private:
    int    m_w = 0, m_h = 0;
    Shader m_bodyShader;
    Shader m_lineShader;

    Mesh m_sphere;
    Mesh m_stars;
    Mesh m_cross;
    std::vector<Mesh> m_orbits;   // 8 planet orbits

    Camera3D m_cam;

    // Mouse state
    glm::dvec2 m_lastMouse{0, 0};
    bool       m_firstMouse = true;
    bool       m_rightDown  = false;
    bool       m_midDown    = false;

    // Active flash events (light-delay test tool)
    std::vector<FlashEvent> m_flashes;

    // ── helpers ──────────────────────────────────────────────────────────────
    // metres → scene AU
    static glm::vec3 toAU(Vec3 v) {
        return {(float)(v.x/Constants::AU),
                (float)(v.y/Constants::AU),
                (float)(v.z/Constants::AU)};
    }

    void drawBody(const BodyVisual& vis, glm::vec3 scene_pos,
                  const glm::mat4& view, const glm::mat4& proj,
                  glm::vec3 sun_scene, glm::vec3 cam_pos, bool emissive,
                  float alpha = 1.0f);

    void drawOrbits(const glm::mat4& vp);
    void drawStars (const glm::mat4& view, const glm::mat4& proj);

    void renderImGui(double sim_t, const SolarSystem& sys,
                     const Spacecraft& ship, const LightCone& observer);
    // triggerFlash is public so renderImGui can call it (renderImGui is non-const)
};
