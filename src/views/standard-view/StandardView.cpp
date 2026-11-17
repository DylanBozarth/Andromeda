#include "StandardView.hpp"
#include "Solar-system-builder/renderer/SpaceRenderer.hpp"
#include "Solar-system-builder/renderer/Colors.hpp"
#include "imgui.h"
#include <glm/gtc/matrix_transform.hpp>
#include <cmath>
#include <string_view>
#include <vector>
#include <algorithm>

// ── SpaceRenderer::renderStandardScene ───────────────────────────────────────

void SpaceRenderer::renderStandardScene(double sim_t,
                                         const SolarSystem& sys,
                                         const Spacecraft& ship,
                                         const LightCone& observer,
                                         const glm::mat4& view,
                                         const glm::mat4& proj,
                                         glm::vec3 cam,
                                         glm::vec3 sun_scene)
{
    (void)ship;

    // Stars — rendered without depth write so they stay in the background
    glDepthMask(GL_FALSE);
    drawStars(view, proj);
    glDepthMask(GL_TRUE);

    // Ship placeholder box at scene origin — purely visual, no solar-system reads.
    m_lineShader.use();
    m_lineShader.setMat4("u_vp", proj * view);
    m_lineShader.setFloat("u_far", m_standard_cam.far_plane);
    m_lineShader.setVec4("u_color", {1.0f, 0.08f, 0.55f, 1.0f});
    m_ship_box.draw();

    // Celestial bodies at observed (light-delayed) positions.
    // Emissive rendering — textures are shown at full brightness with no
    // Lambertian shading, so the appearance is completely static regardless
    // of camera angle or sun position.
    for (const auto& vis : BODY_VISUALS) {
        glm::vec3 obs_pos;
        try {
            Vec3 p = observer.observePosition(vis.name, sim_t, sys);
            obs_pos = toAU_rel(p, m_scene_origin);
        } catch (...) {
            if (std::string_view(vis.name) == "Sun") obs_pos = sun_scene;
            else continue;
        }

        bool   is_sun = (std::string_view(vis.name) == "Sun");
        GLuint tex    = is_sun ? 0 : findTexture(vis.name);
        GLuint clouds = (std::string_view(vis.name) == "Earth")
                        ? findTexture("Earth_clouds") : 0;

        drawBody(vis, obs_pos, view, proj, sun_scene, cam,
                 /*emissive=*/true, 1.0f, tex, 0.f, false, clouds, 0.f);
    }

    // Flash spheres — additive glow, no depth write
    {
        float real_now = (float)glfwGetTime();
        glDepthMask(GL_FALSE);
        glBlendFunc(GL_SRC_ALPHA, GL_ONE);

        for (auto& flash : m_flashes) {
            if (!flash.arrived && sim_t >= flash.t_arrive) {
                flash.arrived     = true;
                flash.real_arrive = real_now;
            }
            if (!flash.arrived) continue;

            float age = real_now - flash.real_arrive;
            constexpr float FLASH_DURATION = 2.5f;
            if (age > FLASH_DURATION) continue;

            float t     = age / FLASH_DURATION;
            float alpha = (1.0f - t) * (1.0f - t);
            float scale = 1.0f + 5.0f * t;

            const BodyVisual* bv = findBodyVisual(flash.planet_name);
            if (!bv) continue;

            BodyVisual glow = *bv;
            glow.color        = glm::min(bv->color * 2.5f, glm::vec3(1.f));
            glow.visual_radius = bv->visual_radius * scale;

            drawBody(glow, toAU_rel(flash.pos_emit, m_scene_origin), view, proj,
                     sun_scene, cam, true, alpha);
        }

        m_flashes.erase(
            std::remove_if(m_flashes.begin(), m_flashes.end(),
                [real_now](const FlashEvent& f) {
                    return f.arrived && (real_now - f.real_arrive) > 4.0f;
                }),
            m_flashes.end());

        glDepthMask(GL_TRUE);
        glBlendFunc(GL_SRC_ALPHA, GL_ONE_MINUS_SRC_ALPHA);
    }
}

// ── SpaceRenderer::renderImGuiStandard ───────────────────────────────────────

void SpaceRenderer::renderImGuiStandard(double sim_t,
                                         const SolarSystem& sys,
                                         const Spacecraft& ship,
                                         const LightCone& observer)
{
    float    aspect = (m_h > 0) ? (float)m_w / (float)m_h : 1.f;
    glm::mat4 vp   = m_standard_cam.projMatrix(aspect) * m_standard_cam.viewMatrix();
    ImVec2   dsz   = ImGui::GetIO().DisplaySize;

    struct BodyScreen { const char* name; float sx, sy, screen_r; };
    std::vector<BodyScreen> on_screen;

    for (const auto& vis : BODY_VISUALS) {
        try {
            Vec3 rp = observer.observePosition(vis.name, sim_t, sys);
            glm::vec3 au = toAU_rel(rp, m_scene_origin);
            glm::vec4 clip = vp * glm::vec4(au, 1.f);
            if (clip.w <= 0.f) continue;
            glm::vec3 ndc = glm::vec3(clip) / clip.w;
            if (ndc.x < -2.f || ndc.x > 2.f || ndc.y < -2.f || ndc.y > 2.f) continue;
            float sx = (ndc.x * 0.5f + 0.5f) * dsz.x;
            float sy = (1.f - (ndc.y * 0.5f + 0.5f)) * dsz.y;

            float screen_r = 40.f;
            for (int axis = 0; axis < 3; ++axis) {
                glm::vec3 offset(0.f);
                offset[axis] = vis.visual_radius;
                glm::vec4 ec = vp * glm::vec4(au + offset, 1.f);
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

    auto* dl = ImGui::GetForegroundDrawList();

    // Planet labels
    for (const auto& b : on_screen) {
        if (b.sx < -50.f || b.sx > dsz.x + 50.f) continue;
        if (b.sy < -50.f || b.sy > dsz.y + 50.f) continue;
        dl->AddText({b.sx + 9.f, b.sy - 7.f}, IM_COL32(0,   0,   0,   160), b.name);
        dl->AddText({b.sx + 8.f, b.sy - 8.f}, IM_COL32(190, 215, 255, 200), b.name);
    }

    // Ship indicator — always at scene origin {0,0,0}
    {
        glm::vec4 clip = vp * glm::vec4(0.f, 0.f, 0.f, 1.f);
        if (clip.w > 0.f) {
            glm::vec3 ndc = glm::vec3(clip) / clip.w;
            float sx = (ndc.x * 0.5f + 0.5f) * dsz.x;
            float sy = (1.f - (ndc.y * 0.5f + 0.5f)) * dsz.y;
            dl->AddCircleFilled({sx, sy}, 5.f, IM_COL32(255, 20, 140, 220));
            dl->AddCircle({sx, sy}, 5.f, IM_COL32(0, 0, 0, 160), 0, 1.5f);
            dl->AddText({sx + 9.f, sy - 7.f}, IM_COL32(0,   0,   0,   180), ship.name().c_str());
            dl->AddText({sx + 8.f, sy - 8.f}, IM_COL32(255, 20, 140, 220),  ship.name().c_str());
        }
    }

    // Right-click context menu
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
        if (!m_ctx_planet.empty())
            ImGui::OpenPopup("##std_ctx");
    }

    if (ImGui::BeginPopup("##std_ctx")) {
        ImGui::TextColored({0.3f, 1.f, 0.5f, 1.f}, "%s", m_ctx_planet.c_str());
        ImGui::Separator();

        auto issue = [&](OrbitType ot) {
            try {
                Vec3 dest = sys.getPosition(m_ctx_planet, sim_t);
                m_pending_travel = { m_ctx_planet, dest,
                    ship.position(), ship.velocity(),
                    sim_t, 0.0, ot, true };
            } catch (...) {}
            ImGui::CloseCurrentPopup();
        };

        if (ImGui::MenuItem("Low Orbit"))               issue(OrbitType::LowPrograde);
        if (ImGui::MenuItem("High Orbit"))              issue(OrbitType::HighPrograde);
        ImGui::Separator();
        if (ImGui::MenuItem("Low Orbit  (Retrograde)")) issue(OrbitType::LowRetrograde);
        if (ImGui::MenuItem("High Orbit (Retrograde)")) issue(OrbitType::HighRetrograde);

        ImGui::EndPopup();
    }
}
