#include "SolarView.hpp"
#include "Solar-system-builder/renderer/SpaceRenderer.hpp"
#include "Solar-system-builder/renderer/Colors.hpp"
#include "math/Constants.hpp"
#include "imgui.h"
#include <glm/gtc/matrix_transform.hpp>
#include <cmath>
#include <string_view>
#include <vector>
#include <algorithm>

// ── Position helpers ──────────────────────────────────────────────────────────

glm::vec3 solarBodyPos(const char* name, glm::vec3 au_pos) {
    for (const auto& d : SOLAR_ILLUST) {
        if (std::string_view(d.name) == std::string_view(name)) {
            if (d.dist == 0.f) return {0.f, 0.f, 0.f};
            // Planets orbit in the ecliptic XY plane (Z ≈ 0).
            // atan2(y, x) gives the in-plane angle; result is in scene XZ (Y=up).
            float angle = std::atan2(au_pos.y, au_pos.x);
            return { d.dist * std::cos(angle), 0.f, d.dist * std::sin(angle) };
        }
    }
    return {-999.f, 0.f, 0.f};
}

glm::vec3 shipSolarPos(Vec3 ship_pos, const SolarSystem& sys, double sim_t) {
    float xAU = (float)(ship_pos.x / Constants::AU);
    float yAU = (float)(ship_pos.y / Constants::AU);
    float real_dist = std::sqrt(xAU*xAU + yAU*yAU);
    float angle     = std::atan2(yAU, xAU);

    std::vector<std::pair<float,float>> bp;
    bp.push_back({0.f, 0.f});
    for (const auto& d : SOLAR_ILLUST) {
        if (d.dist == 0.f) continue;
        try {
            Vec3  rp = sys.getPosition(d.name, sim_t);
            float ru = (float)(std::sqrt(
                (rp.x/Constants::AU)*(rp.x/Constants::AU) +
                (rp.y/Constants::AU)*(rp.y/Constants::AU)));
            bp.push_back({ru, d.dist});
        } catch (...) {}
    }
    std::sort(bp.begin(), bp.end(),
              [](const auto& a, const auto& b){ return a.first < b.first; });

    float illust = bp.back().second;
    for (size_t i = 0; i + 1 < bp.size(); ++i) {
        if (real_dist <= bp[i+1].first) {
            float denom = bp[i+1].first - bp[i].first;
            float t = denom > 1e-6f ? (real_dist - bp[i].first) / denom : 0.f;
            illust = bp[i].second + t * (bp[i+1].second - bp[i].second);
            break;
        }
    }
    return { illust * std::cos(angle), 0.f, illust * std::sin(angle) };
}

// ── SpaceRenderer::toSolarScene ───────────────────────────────────────────────

glm::vec3 SpaceRenderer::toSolarScene(Vec3 v) {
    static constexpr float REAL[] = { 0.f, 0.387f, 0.723f, 1.000f, 1.524f,
                                       5.204f, 9.582f, 19.190f, 30.070f };
    static constexpr float ILLU[] = { 0.f, 3.5f,   5.5f,   7.5f,  10.0f,
                                       14.0f,  19.0f,  25.0f,   31.0f  };
    constexpr int N = 9;

    float xAU = (float)(v.x / Constants::AU);
    float yAU = (float)(v.y / Constants::AU);
    float real_dist = std::sqrt(xAU*xAU + yAU*yAU);

    float illust = ILLU[N-1];
    for (int i = 0; i < N-1; ++i) {
        if (real_dist <= REAL[i+1]) {
            float t = (real_dist - REAL[i]) / (REAL[i+1] - REAL[i]);
            illust = ILLU[i] + t * (ILLU[i+1] - ILLU[i]);
            break;
        }
    }

    float angle = std::atan2(yAU, xAU);
    return { illust * std::cos(angle), 0.f, illust * std::sin(angle) };
}

// ── SpaceRenderer::renderSolarScene ──────────────────────────────────────────

void SpaceRenderer::renderSolarScene(double sim_t,
                                      const SolarSystem& sys,
                                      const Spacecraft& ship,
                                      const LightCone& observer,
                                      const glm::mat4& view,
                                      const glm::mat4& proj,
                                      glm::vec3 cam,
                                      glm::vec3 sun_scene)
{
    // Bodies at illustrative positions with inflated radii
    for (const auto& vis : BODY_VISUALS) {
        glm::vec3 obs_pos;
        try {
            Vec3 p = observer.observePosition(vis.name, sim_t, sys);
            obs_pos = toAU(p);
        } catch (...) {
            if (std::string_view(vis.name) == "Sun") obs_pos = sun_scene;
            else continue;
        }
        obs_pos.z = 0.f;  // zero ecliptic Z; angle uses X and Y
        obs_pos = solarBodyPos(vis.name, obs_pos);

        BodyVisual draw_vis = vis;
        for (const auto& d : SOLAR_ILLUST) {
            if (std::string_view(d.name) == std::string_view(vis.name)) {
                draw_vis.visual_radius = d.radius;
                draw_vis.color = glm::min(vis.color * 1.8f, glm::vec3(1.f));
                break;
            }
        }

        bool is_sun = (std::string_view(vis.name) == "Sun");
        GLuint tex = is_sun ? 0 : findTexture(vis.name);
        drawBody(draw_vis, obs_pos, view, proj, sun_scene, cam, is_sun, 1.0f, tex,
                 0.f, false, 0, 0.f);
    }

    // Ship — 3D dot sphere + cross marker at illustrative position
    glm::vec3 ship_scene = shipSolarPos(ship.position(), sys, sim_t);
    BodyVisual ship_vis = {"ship", {1.0f, 0.08f, 0.55f}, 0.55f};
    drawBody(ship_vis, ship_scene, view, proj, sun_scene, cam, true);

    glm::mat4 model = glm::scale(
        glm::translate(glm::mat4(1.f), ship_scene), glm::vec3(10.0f));
    m_lineShader.use();
    m_lineShader.setMat4("u_vp", proj * view * model);
    m_lineShader.setFloat("u_far", m_solar_cam.far_plane);
    m_lineShader.setVec4("u_color", {1.0f, 0.08f, 0.55f, 1.0f});
    m_cross.draw();

    // Orbit rings
    struct Ring { float radius; glm::vec4 color; };
    static constexpr Ring RINGS[] = {
        {  3.5f, {0.60f, 0.55f, 0.50f, 0.35f} },
        {  5.5f, {0.95f, 0.85f, 0.60f, 0.35f} },
        {  7.5f, {0.25f, 0.60f, 1.00f, 0.40f} },
        { 10.0f, {0.90f, 0.40f, 0.25f, 0.40f} },
        { 14.0f, {0.95f, 0.80f, 0.60f, 0.35f} },
        { 19.0f, {1.00f, 0.95f, 0.70f, 0.35f} },
        { 25.0f, {0.55f, 0.90f, 0.95f, 0.35f} },
        { 31.0f, {0.30f, 0.50f, 1.00f, 0.35f} },
    };

    glDepthMask(GL_FALSE);
    m_lineShader.use();
    m_lineShader.setFloat("u_far", m_solar_cam.far_plane);
    for (const auto& r : RINGS) {
        glm::mat4 ring_model = glm::scale(glm::mat4(1.f), glm::vec3(r.radius));
        m_lineShader.setMat4("u_vp", proj * view * ring_model);
        m_lineShader.setVec4("u_color", r.color);
        m_circle.draw();
    }
    glDepthMask(GL_TRUE);
}

// ── SpaceRenderer::renderImGuiSolar ──────────────────────────────────────────

void SpaceRenderer::renderImGuiSolar(double sim_t,
                                      const SolarSystem& sys,
                                      const Spacecraft& ship,
                                      const LightCone& observer)
{
    struct BodyScreen { const char* name; float sx, sy, screen_r; };
    std::vector<BodyScreen> on_screen;

    float    aspect = (m_h > 0) ? (float)m_w / (float)m_h : 1.f;
    glm::mat4 vp   = m_solar_cam.projMatrix(aspect) * m_solar_cam.viewMatrix();
    ImVec2   dsz   = ImGui::GetIO().DisplaySize;

    for (const auto& vis : BODY_VISUALS) {
        try {
            Vec3 rp = observer.observePosition(vis.name, sim_t, sys);
            glm::vec3 au = toAU(rp);
            au.z = 0.f;
            glm::vec3 illust = solarBodyPos(vis.name, au);
            if (illust.x < -900.f) continue;
            glm::vec4 clip = vp * glm::vec4(illust, 1.f);
            if (clip.w <= 0.f) continue;
            glm::vec3 ndc = glm::vec3(clip) / clip.w;
            float sx = (ndc.x * 0.5f + 0.5f) * dsz.x;
            float sy = (1.f - (ndc.y * 0.5f + 0.5f)) * dsz.y;

            float illust_r = 1.0f;
            for (const auto& d : SOLAR_ILLUST) {
                if (std::string_view(d.name) == std::string_view(vis.name)) {
                    illust_r = d.radius; break;
                }
            }
            float screen_r = 30.f;
            for (int axis = 0; axis < 3; ++axis) {
                glm::vec3 offset(0.f);
                offset[axis] = illust_r;
                glm::vec4 ec = vp * glm::vec4(illust + offset, 1.f);
                if (ec.w > 0.f) {
                    float esx = (ec.x / ec.w * 0.5f + 0.5f) * dsz.x;
                    float esy = (1.f - (ec.y / ec.w * 0.5f + 0.5f)) * dsz.y;
                    float r   = std::sqrt((esx - sx)*(esx - sx) + (esy - sy)*(esy - sy));
                    screen_r  = std::max(screen_r, r);
                }
            }
            on_screen.push_back({vis.name, sx, sy, screen_r});
        } catch (...) {}
    }

    // Planet labels
    auto* dl = ImGui::GetForegroundDrawList();
    for (const auto& b : on_screen) {
        if (std::string_view(b.name) == "Sun") continue;
        if (b.sx < -50.f || b.sx > dsz.x + 50.f) continue;
        if (b.sy < -50.f || b.sy > dsz.y + 50.f) continue;
        dl->AddText({b.sx + 9.f, b.sy - 7.f}, IM_COL32(0, 0, 0, 160), b.name);
        dl->AddText({b.sx + 8.f, b.sy - 8.f}, IM_COL32(190, 215, 255, 220), b.name);
    }

    // Right-click: hit any body whose projected disc contains the cursor
    if (ImGui::IsMouseClicked(ImGuiMouseButton_Right)
        && !ImGui::IsWindowHovered(ImGuiHoveredFlags_AnyWindow)
        && !ImGui::IsAnyItemHovered()) {

        ImVec2 mp = ImGui::GetIO().MousePos;
        m_ctx_planet.clear();
        float best_dist = 1e9f;
        for (const auto& b : on_screen) {
            float dx = mp.x - b.sx, dy = mp.y - b.sy;
            float d  = std::sqrt(dx*dx + dy*dy);
            if (d < b.screen_r && d < best_dist) {
                best_dist = d;
                m_ctx_planet = b.name;
            }
        }
        ImGui::OpenPopup("##solar_ctx");
    }

    if (ImGui::BeginPopup("##solar_ctx")) {
        if (!m_ctx_planet.empty()) {
            ImGui::TextColored({0.3f, 1.f, 0.5f, 1.f}, "%s", m_ctx_planet.c_str());
            ImGui::Separator();
            if (ImGui::MenuItem("Travel to")) {
                try {
                    Vec3 dest = sys.getPosition(m_ctx_planet, sim_t);
                    m_pending_travel = { m_ctx_planet, dest,
                        ship.position(), ship.velocity(),
                        sim_t, 0.0, OrbitType::None, true };
                } catch (...) {}
                ImGui::CloseCurrentPopup();
            }
        } else {
            ImGui::TextColored({0.6f, 0.6f, 0.6f, 1.f}, "Navigate to...");
            ImGui::Separator();
            for (const auto& vis : BODY_VISUALS) {
                if (ImGui::MenuItem(vis.name)) {
                    try {
                        Vec3 dest = sys.getPosition(vis.name, sim_t);
                        m_pending_travel = { vis.name, dest,
                            ship.position(), ship.velocity(),
                            sim_t, 0.0, OrbitType::None, true };
                    } catch (...) {}
                }
            }
        }
        ImGui::EndPopup();
    }
}
