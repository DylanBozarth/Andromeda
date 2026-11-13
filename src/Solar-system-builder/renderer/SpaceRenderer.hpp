#pragma once
#include "GL.hpp"
#include "Shader.hpp"
#include "Mesh.hpp"
#include "Camera3D.hpp"
#include "Colors.hpp"
#include "Solar-system-builder/simulation/SolarSystem.hpp"
#include "Player-ship/spacecraft/Spacecraft.hpp"
#include "Player-ship/observation/LightCone.hpp"
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

enum class ViewMode  { Standard, Solar };
enum class OrbitType { None, LowPrograde, HighPrograde, LowRetrograde, HighRetrograde };

// Issued by SpaceRenderer when the player selects a travel or orbit option.
// main.cpp owns all physics so the renderer stays pure-visual.
struct TravelRequest {
    std::string target_name;
    Vec3        target_pos_m;      // body centre at time of issue (solar frame, metres)
    Vec3        origin_pos_m;      // ship position when issued
    Vec3        origin_vel_m;      // ship velocity when issued
    double      start_sim_t    = 0;
    double      duration_sim_s = 0; // 0 = instant; >0 reserved for timed transit
    OrbitType   orbit_type     = OrbitType::None;
    bool        active = false;
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

    // Travel API — polled by main.cpp after processInput each frame
    bool          hasPendingTravel() const { return m_pending_travel.active; }
    TravelRequest takePendingTravel() {
        TravelRequest t = m_pending_travel;
        m_pending_travel.active = false;
        return t;
    }

private:
    int    m_w = 0, m_h = 0;
    Shader m_bodyShader;
    Shader m_lineShader;

    Mesh m_sphere;
    Mesh m_stars;
    Mesh m_cross;
    Mesh m_circle;     // unit orbit ring, scaled per planet in solar view
    Mesh m_ring_disc;  // annular disc for Saturn's rings

    Camera3D m_cam;
    Camera3D m_solar_cam;   // overview camera locked to the Sun
    ViewMode m_view = ViewMode::Standard;

    // Double-precision rendering origin set at the top of render() each frame.
    // Standard view: set to ship.position() so all scene offsets are computed
    // in double before casting to float, eliminating the jitter caused by
    // casting kilometre-precision positions in a solar-AU coordinate frame.
    Vec3 m_scene_origin = Vec3{0.0, 0.0, 0.0};

    // Mouse state
    glm::dvec2 m_lastMouse{0, 0};
    bool       m_rightDown  = false;  // previous frame's orbit button state

    // Active flash events (light-delay test tool)
    std::vector<FlashEvent> m_flashes;

    // Planet textures — loaded once in init()
    struct TexEntry { std::string name; GLuint id = 0; };
    std::vector<TexEntry> m_textures;

    // Travel system — renderer populates, main.cpp consumes
    TravelRequest m_pending_travel;
    std::string   m_ctx_planet;    // planet identified by last right-click

    // ── helpers ──────────────────────────────────────────────────────────────
    // metres → true scene AU (Standard view), absolute — loses float precision
    // at solar-system distances.  Use toAU_rel for anything rendered on screen.
    static glm::vec3 toAU(Vec3 v) {
        return {(float)(v.x/Constants::AU),
                (float)(v.y/Constants::AU),
                (float)(v.z/Constants::AU)};
    }

    // metres → scene AU, relative to a double-precision origin.
    // All solar-frame subtraction happens in double before the float cast,
    // so the ~100 km precision loss from casting absolute positions is avoided.
    static glm::vec3 toAU_rel(Vec3 v, Vec3 origin) {
        return {(float)((v.x - origin.x) / Constants::AU),
                (float)((v.y - origin.y) / Constants::AU),
                (float)((v.z - origin.z) / Constants::AU)};
    }

    // metres → solar-view illustrative scene coords.
    // Preserves orbital angle; maps true AU distance through a piecewise-
    // linear table that spreads planets evenly for readability.
    // Add an entry here when adding new bodies to the illustrative layout.
    static glm::vec3 toSolarScene(Vec3 v);

    // Map a real position to scene space for the active view.
    // Add a branch here for every new ViewMode so all callers stay consistent.
    glm::vec3 toScene(Vec3 v) const {
        switch (m_view) {
            case ViewMode::Solar:    return toSolarScene(v);
            case ViewMode::Standard: // fall through
            default:                 return toAU(v);
        }
    }

    GLuint loadTexture(const char* path);
    GLuint findTexture(std::string_view name) const;

    void drawBody(const BodyVisual& vis, glm::vec3 scene_pos,
                  const glm::mat4& view, const glm::mat4& proj,
                  glm::vec3 sun_scene, glm::vec3 cam_pos, bool emissive,
                  float alpha = 1.0f, GLuint tex_id = 0,
                  float tex_offset_u = 0.f, bool use_tex_alpha = false,
                  GLuint overlay_tex_id = 0, float overlay_offset_u = 0.f);

    void drawRing(glm::vec3 scene_pos, const glm::mat4& view, const glm::mat4& proj,
                  glm::vec3 sun_scene, glm::vec3 cam_pos,
                  GLuint tex_id, float tex_offset_u = 0.f);

    void drawStars (const glm::mat4& view, const glm::mat4& proj);

    void renderImGui(double sim_t, const SolarSystem& sys,
                     const Spacecraft& ship, const LightCone& observer);
    // triggerFlash is public so renderImGui can call it (renderImGui is non-const)
};
