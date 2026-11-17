#include "SpaceRenderer.hpp"
#include "Player-ship/zones/Zone.hpp"
#include "stb_image.h"
#include "imgui.h"
#include "imgui_impl_glfw.h"
#include "imgui_impl_opengl3.h"
#include <glm/gtc/matrix_transform.hpp>
#include <cmath>
#include <cstdio>

// ── Embedded GLSL shaders ─────────────────────────────────────────────────────
// Logarithmic depth buffer (Outerra technique) handles the extreme depth
// range of a solar-system scene without z-fighting.

static const char* BODY_VERT = R"glsl(
#version 330 core
layout(location=0) in vec3 aPos;
layout(location=1) in vec3 aNorm;
layout(location=2) in vec2 aUV;
uniform mat4 u_model;
uniform mat4 u_view;
uniform mat4 u_proj;
out vec3  v_pos;
out vec3  v_norm;
out vec2  v_uv;
out float v_z;
void main(){
    vec4 wp = u_model * vec4(aPos, 1.0);
    v_pos  = wp.xyz;
    v_norm = mat3(transpose(inverse(u_model))) * aNorm;
    v_uv   = aUV;
    gl_Position = u_proj * u_view * wp;
    v_z = gl_Position.w;
}
)glsl";

static const char* BODY_FRAG = R"glsl(
#version 330 core
in vec3  v_pos;
in vec3  v_norm;
in vec2  v_uv;
in float v_z;
uniform vec3      u_color;
uniform vec3      u_sunPos;
uniform vec3      u_camPos;
uniform bool      u_emissive;
uniform bool      u_textured;
uniform sampler2D u_tex;
uniform float     u_far;
uniform float     u_alpha;
uniform float     u_tex_offset_u;
uniform bool      u_use_tex_alpha;
// Second texture layer (cloud overlay, ring, etc.)
uniform bool      u_has_overlay;
uniform sampler2D u_tex2;
uniform float     u_overlay_offset_u;
out vec4 fragColor;
void main(){
    gl_FragDepth = log2(max(1e-6, 1.0 + v_z)) / log2(u_far + 1.0);
    vec2 uv = vec2(mod(v_uv.x + u_tex_offset_u, 1.0), v_uv.y);
    vec4 tex_sample = u_textured ? texture(u_tex, uv) : vec4(u_color, 1.0);
    vec3 base = u_textured ? tex_sample.rgb : u_color;
    float alpha = u_use_tex_alpha ? tex_sample.a : u_alpha;
    // Cloud overlay: alpha-blend over base using the cloud texture's own alpha
    if(u_has_overlay){
        vec2 uv2 = vec2(mod(v_uv.x + u_overlay_offset_u, 1.0), v_uv.y);
        vec4 ov = texture(u_tex2, uv2);
        base = mix(base, ov.rgb, ov.a);
    }
    if(u_emissive){ fragColor = vec4(base, alpha); return; }
    vec3  norm    = normalize(v_norm);
    vec3  ldir    = normalize(u_sunPos - v_pos);
    float diff    = max(dot(norm, ldir), 0.0);
    vec3  ambient = 0.08 * base;
    fragColor = vec4(ambient + diff*base, alpha);
}
)glsl";

static const char* LINE_VERT = R"glsl(
#version 330 core
layout(location=0) in vec3 aPos;
uniform mat4  u_vp;
uniform float u_far;
out float v_z;
void main(){
    gl_Position  = u_vp * vec4(aPos, 1.0);
    v_z          = gl_Position.w;
    gl_PointSize = 2.0;
}
)glsl";

static const char* LINE_FRAG = R"glsl(
#version 330 core
in float v_z;
uniform vec4  u_color;
uniform float u_far;
out vec4 fragColor;
void main(){
    gl_FragDepth = log2(max(1e-6, 1.0 + v_z)) / log2(u_far + 1.0);
    fragColor = u_color;
}
)glsl";

// ── Init ──────────────────────────────────────────────────────────────────────

void SpaceRenderer::init(GLFWwindow* win, int width, int height) {
    m_w = width; m_h = height;

    // Scroll callback — stored on the window so we can reach the camera
    glfwSetWindowUserPointer(win, this);
    glfwSetScrollCallback(win, [](GLFWwindow* w, double /*xoff*/, double yoff) {
        auto* r = static_cast<SpaceRenderer*>(glfwGetWindowUserPointer(w));
        if (r->m_view == ViewMode::Standard)
            r->m_standard_cam.handleScroll((float)yoff);
        else
            r->m_solar_cam.handleScroll((float)yoff);
    });

    // Solar overview camera — top-down, centred on the Sun
    m_solar_cam.target       = {0.f, 0.f, 0.f};
    m_solar_cam.distance     = 40.f;
    m_solar_cam.elevation    = 80.f;
    m_solar_cam.azimuth      = 0.f;
    m_solar_cam.max_distance = 60.f;

    glEnable(GL_DEPTH_TEST);
    glEnable(GL_BLEND);
    glBlendFunc(GL_SRC_ALPHA, GL_ONE_MINUS_SRC_ALPHA);
    glEnable(GL_PROGRAM_POINT_SIZE);

    m_bodyShader = Shader(BODY_VERT, BODY_FRAG);
    m_lineShader = Shader(LINE_VERT, LINE_FRAG);

    m_sphere = Mesh::sphere();
    m_stars  = Mesh::starField();
    m_cross  = Mesh::crossMarker(0.08f);
    m_circle = Mesh::circle();

    // Saturn ring disc: inner 1.2× Saturn visual_radius, outer 2.3× (in AU)
    constexpr float SAT_VIS_R = 4.029e-4f;
    m_ring_disc = Mesh::disc(SAT_VIS_R * 1.2f, SAT_VIS_R * 2.3f);

    // Ship placeholder box — 5e-4 AU half-side ≈ 75,000 km, comfortably visible
    // at the default camera distance and clearly inside the ship at distance≈0.
    m_ship_box = Mesh::box(5e-4f);

    // Planet textures — stb_image loads top-to-bottom; flip so v=0 is north pole
    stbi_set_flip_vertically_on_load(false);
    auto tex = [this](const char* name, const char* file) {
        m_textures.push_back({name, loadTexture(
            std::string(ASSETS_DIR "/planet-textures/") .append(file).c_str())});
    };
    tex("Mercury",      "mercury.jpg");
    tex("Venus",        "venus_surface.jpg");
    tex("Earth",        "earth.jpg");
    tex("Mars",         "mars.jpg");
    tex("Jupiter",      "jupiter.jpg");
    tex("Saturn",       "saturn.jpg");
    tex("Uranus",       "uranus.jpg");
    tex("Neptune",      "neptune.jpg");
    tex("Earth_clouds", "clouds-texture.png");
    tex("Saturn_ring",  "saturn_ring_alpha.png");

    // ImGui
    IMGUI_CHECKVERSION();
    ImGui::CreateContext();
    ImGui::StyleColorsDark();
    ImGui::GetStyle().WindowRounding = 4.f;
    ImGui::GetStyle().Alpha          = 0.92f;
    ImGui_ImplGlfw_InitForOpenGL(win, true);
    ImGui_ImplOpenGL3_Init("#version 330");
}

void SpaceRenderer::resize(int w, int h) { m_w = w; m_h = h; }

// ── Input ─────────────────────────────────────────────────────────────────────

void SpaceRenderer::processInput(GLFWwindow* win, const Spacecraft& /*ship*/) {
    bool orbit = glfwGetMouseButton(win, GLFW_MOUSE_BUTTON_LEFT) == GLFW_PRESS;

    double mx, my;
    glfwGetCursorPos(win, &mx, &my);
    glm::dvec2 mouse(mx, my);

    // On the rising edge of each drag, snap lastMouse to the current cursor
    // position so the first delta is zero — no camera jump at drag start.
    bool just_pressed = orbit && !m_rightDown;
    if (just_pressed) m_lastMouse = mouse;

    if (orbit && !just_pressed && !ImGui::GetIO().WantCaptureMouse) {
        glm::dvec2 delta = mouse - m_lastMouse;
        if (m_view == ViewMode::Standard)
            m_standard_cam.handleMouse((float)delta.x, (float)delta.y);
        else
            m_solar_cam.handleMouse((float)delta.x, (float)delta.y);
    }
    m_lastMouse = mouse;
    m_rightDown = orbit;

    if (glfwGetKey(win, GLFW_KEY_ESCAPE) == GLFW_PRESS)
        glfwSetWindowShouldClose(win, GLFW_TRUE);
}

// ── Texture helpers ───────────────────────────────────────────────────────────

GLuint SpaceRenderer::loadTexture(const char* path) {
    int w, h, ch;
    unsigned char* data = stbi_load(path, &w, &h, &ch, 4);  // always load as RGBA
    if (!data) {
        std::fprintf(stderr, "Texture load failed: %s\n", path);
        return 0;
    }
    GLuint id;
    glGenTextures(1, &id);
    glBindTexture(GL_TEXTURE_2D, id);
    glTexImage2D(GL_TEXTURE_2D, 0, GL_RGBA, w, h, 0, GL_RGBA, GL_UNSIGNED_BYTE, data);
    glGenerateMipmap(GL_TEXTURE_2D);
    glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_S,     GL_REPEAT);
    glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_T,     GL_CLAMP_TO_EDGE);
    glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_LINEAR_MIPMAP_LINEAR);
    glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, GL_LINEAR);
    glBindTexture(GL_TEXTURE_2D, 0);
    stbi_image_free(data);
    return id;
}

GLuint SpaceRenderer::findTexture(std::string_view name) const {
    for (const auto& e : m_textures)
        if (e.name == name) return e.id;
    return 0;
}

// ── Draw helpers ──────────────────────────────────────────────────────────────

void SpaceRenderer::drawBody(const BodyVisual& vis, glm::vec3 pos,
                              const glm::mat4& view, const glm::mat4& proj,
                              glm::vec3 sun, glm::vec3 cam, bool emissive,
                              float alpha, GLuint tex_id,
                              float tex_offset_u, bool use_tex_alpha,
                              GLuint overlay_tex_id, float overlay_offset_u)
{
    glm::mat4 model =
        glm::translate(glm::mat4(1.f), pos) *
        glm::scale(glm::mat4(1.f), glm::vec3(vis.visual_radius));
    m_bodyShader.use();
    m_bodyShader.setMat4("u_model", model);
    m_bodyShader.setMat4("u_view",  view);
    m_bodyShader.setMat4("u_proj",  proj);
    m_bodyShader.setVec3("u_color",  vis.color);
    m_bodyShader.setVec3("u_sunPos", sun);
    m_bodyShader.setVec3("u_camPos", cam);
    m_bodyShader.setBool("u_emissive",       emissive);
    m_bodyShader.setBool("u_textured",       tex_id != 0);
    m_bodyShader.setFloat("u_far",           m_standard_cam.far_plane);
    m_bodyShader.setFloat("u_alpha",         alpha);
    m_bodyShader.setFloat("u_tex_offset_u",  tex_offset_u);
    m_bodyShader.setBool("u_use_tex_alpha",  use_tex_alpha);
    m_bodyShader.setBool("u_has_overlay",    overlay_tex_id != 0);
    m_bodyShader.setFloat("u_overlay_offset_u", overlay_offset_u);
    if (tex_id) {
        glActiveTexture(GL_TEXTURE0);
        glBindTexture(GL_TEXTURE_2D, tex_id);
        m_bodyShader.setInt("u_tex", 0);
    }
    if (overlay_tex_id) {
        glActiveTexture(GL_TEXTURE1);
        glBindTexture(GL_TEXTURE_2D, overlay_tex_id);
        m_bodyShader.setInt("u_tex2", 1);
    }
    m_sphere.draw();
    if (overlay_tex_id) { glActiveTexture(GL_TEXTURE1); glBindTexture(GL_TEXTURE_2D, 0); }
    if (tex_id)         { glActiveTexture(GL_TEXTURE0); glBindTexture(GL_TEXTURE_2D, 0); }
}

void SpaceRenderer::drawRing(glm::vec3 pos, const glm::mat4& view, const glm::mat4& proj,
                              glm::vec3 sun, glm::vec3 cam,
                              GLuint tex_id, float tex_offset_u)
{
    glm::mat4 model = glm::translate(glm::mat4(1.f), pos);
    m_bodyShader.use();
    m_bodyShader.setMat4("u_model", model);
    m_bodyShader.setMat4("u_view",  view);
    m_bodyShader.setMat4("u_proj",  proj);
    m_bodyShader.setVec3("u_color",  {1.f, 1.f, 1.f});
    m_bodyShader.setVec3("u_sunPos", sun);
    m_bodyShader.setVec3("u_camPos", cam);
    m_bodyShader.setBool("u_emissive",       false);
    m_bodyShader.setBool("u_textured",       tex_id != 0);
    m_bodyShader.setFloat("u_far",           m_standard_cam.far_plane);
    m_bodyShader.setFloat("u_alpha",         1.f);
    m_bodyShader.setFloat("u_tex_offset_u",  tex_offset_u);
    m_bodyShader.setBool("u_use_tex_alpha",  true);
    if (tex_id) {
        glActiveTexture(GL_TEXTURE0);
        glBindTexture(GL_TEXTURE_2D, tex_id);
        m_bodyShader.setInt("u_tex", 0);
    }
    glDisable(GL_CULL_FACE);
    m_ring_disc.draw();
    glEnable(GL_CULL_FACE);
    if (tex_id) glBindTexture(GL_TEXTURE_2D, 0);
}

void SpaceRenderer::drawStars(const glm::mat4& view, const glm::mat4& proj) {
    // Stars rotate with the camera (move the star sphere with the camera)
    glm::mat4 vp = proj * glm::mat4(glm::mat3(view));  // strip translation
    m_lineShader.use();
    m_lineShader.setMat4("u_vp", vp);
    m_lineShader.setFloat("u_far", m_standard_cam.far_plane);
    m_lineShader.setVec4("u_color", {0.9f, 0.9f, 0.9f, 0.8f});
    m_stars.draw();
}

// ── Flash events ─────────────────────────────────────────────────────────────

void SpaceRenderer::triggerFlash(const std::string& planet_name, double sim_t,
                                  const SolarSystem& sys, const Spacecraft& ship)
{
    Vec3 ppos  = sys.getPosition(planet_name, sim_t);
    double dist = (ship.position() - ppos).length();
    FlashEvent f;
    f.planet_name = planet_name;
    f.pos_emit    = ppos;
    f.t_emitted   = sim_t;
    f.t_arrive    = sim_t + dist / Constants::C;
    f.real_arrive = 0.f;
    f.arrived     = false;
    m_flashes.push_back(std::move(f));
}

// ── Main render ───────────────────────────────────────────────────────────────

void SpaceRenderer::render(double sim_t,
                           const SolarSystem& sys,
                           const Spacecraft& ship,
                           const LightCone& observer,
                           GLFWwindow* /*win*/)
{
    // Standard view: use the ship's solar-frame position as the double-precision
    // rendering origin.  All body offsets are subtracted in double before the
    // float cast, so the ~100 km float precision loss at 1 AU is eliminated.
    m_scene_origin = (m_view == ViewMode::Standard)
                   ? ship.position() : Vec3{0.0, 0.0, 0.0};

    // Standard camera target is always scene origin (the ship).
    m_standard_cam.target = {0.f, 0.f, 0.f};

    glViewport(0, 0, m_w, m_h);
    if (m_view == ViewMode::Solar)
        glClearColor(0.f, 0.02f, 0.07f, 1.f);
    else
        glClearColor(0.f, 0.f, 0.015f, 1.f);
    glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);

    // Keep near plane at 1/1000th of camera distance for each view.
    float aspect = (m_h > 0) ? (float)m_w / (float)m_h : 1.f;
    glm::mat4 view, proj;
    glm::vec3 cam;
    if (m_view == ViewMode::Standard) {
        m_standard_cam.near_plane = std::max(1.0e-13f, m_standard_cam.distance * 0.001f);
        view = m_standard_cam.viewMatrix();
        proj = m_standard_cam.projMatrix(aspect);
        cam  = m_standard_cam.position();
    } else {
        m_solar_cam.near_plane = std::max(1.0e-13f, m_solar_cam.distance * 0.001f);
        view = m_solar_cam.viewMatrix();
        proj = m_solar_cam.projMatrix(aspect);
        cam  = m_solar_cam.position();
    }

    // Sun scene position: illustrative origin in solar view, real offset in standard.
    glm::vec3 sun_scene = (m_view == ViewMode::Solar)
                        ? glm::vec3{0.f, 0.f, 0.f}
                        : toAU_rel(Vec3{0.0, 0.0, 0.0}, m_scene_origin);

    if (m_view == ViewMode::Solar)
        renderSolarScene(sim_t, sys, ship, observer, view, proj, cam, sun_scene);
    else
        renderStandardScene(sim_t, sys, ship, observer, view, proj, cam, sun_scene);

    // ImGui overlay
    ImGui_ImplOpenGL3_NewFrame();
    ImGui_ImplGlfw_NewFrame();
    ImGui::NewFrame();
    renderImGui(sim_t, sys, ship, observer);
    ImGui::Render();
    ImGui_ImplOpenGL3_RenderDrawData(ImGui::GetDrawData());
}

// ── ImGui overlay ─────────────────────────────────────────────────────────────

void SpaceRenderer::renderImGui(double sim_t,
                                const SolarSystem& sys,
                                const Spacecraft& ship,
                                const LightCone& observer)
{
    // ── Sim time ──────────────────────────────────────────────────────────────
    ImGui::SetNextWindowPos({10, 10});
    ImGui::SetNextWindowBgAlpha(0.65f);
    ImGui::Begin("##clock", nullptr,
        ImGuiWindowFlags_NoDecoration | ImGuiWindowFlags_NoMove |
        ImGuiWindowFlags_AlwaysAutoResize | ImGuiWindowFlags_NoSavedSettings |
        ImGuiWindowFlags_NoNav | ImGuiWindowFlags_NoMouseInputs);

    double days  = sim_t / 86400.0;
    int    yr    = 2000 + (int)(days / 365.25);
    ImGui::TextColored({0.3f, 1.f, 0.5f, 1.f}, "ANDROMEDA");
    ImGui::Separator();
    ImGui::Text("J2000 + %.1f days  (~%d AD)", days, yr);
    ImGui::Text("Sim speed: 24x  (1 h real = 1 d sim)");
    ImGui::End();

    // ── Ship status ───────────────────────────────────────────────────────────
    ImGui::SetNextWindowPos({(float)m_w - 310.f, 10.f});
    ImGui::SetNextWindowSize({300.f, 0.f});
    ImGui::SetNextWindowBgAlpha(0.65f);
    ImGui::Begin("##ship", nullptr,
        ImGuiWindowFlags_NoDecoration | ImGuiWindowFlags_NoMove |
        ImGuiWindowFlags_AlwaysAutoResize | ImGuiWindowFlags_NoSavedSettings |
        ImGuiWindowFlags_NoNav | ImGuiWindowFlags_NoMouseInputs);

    ImGui::TextColored({1.0f, 0.08f, 0.55f, 1.f}, "%s", ship.name().c_str());
    ImGui::Separator();

    Vec3 earth_pos = sys.getPosition("Earth", sim_t);
    double dist_earth_m = (ship.position() - earth_pos).length();
    ImGui::Text("Dist from Earth:  %.3f AU", dist_earth_m / Constants::AU);

    double spd_vs_earth = ship.speedRelativeTo("Earth", sim_t, sys);
    ImGui::Text("Speed vs Earth:   %.2f km/s", spd_vs_earth / 1000.0);
    ImGui::Text("Propellant:       %.0f kg",   ship.propellantMass());

    ImGui::Spacing();
    ImGui::TextColored({0.8f, 0.8f, 0.4f, 1.f}, "Light delays from ship");
    ImGui::Separator();

    static const char* DELAY_TARGETS[] = {
        "Mercury","Venus","Earth","Mars","Jupiter","Saturn","Uranus","Neptune"
    };
    for (const char* name : DELAY_TARGETS) {
        try {
            ObservedState obs = observer.observe(name, sim_t, sys);
            double delay_min  = obs.light_delay_s / 60.0;
            if (delay_min < 60.0)
                ImGui::Text("  %-8s  %.1f sim-min", name, delay_min);
            else
                ImGui::Text("  %-8s  %.1f sim-hr",  name, delay_min/60.0);
        } catch (...) {}
    }
    ImGui::End();

    // ── Camera / controls ─────────────────────────────────────────────────────
    ImGui::SetNextWindowPos({10.f, (float)m_h - 65.f});
    ImGui::SetNextWindowBgAlpha(0.50f);
    ImGui::Begin("##help", nullptr,
        ImGuiWindowFlags_NoDecoration | ImGuiWindowFlags_NoMove |
        ImGuiWindowFlags_AlwaysAutoResize | ImGuiWindowFlags_NoSavedSettings |
        ImGuiWindowFlags_NoNav | ImGuiWindowFlags_NoMouseInputs);
    ImGui::Text("Left-drag: orbit   Scroll: zoom   (camera locked to ship)");
    ImGui::End();

    // ── Light delay flash tester ──────────────────────────────────────────────
    ImGui::SetNextWindowPos({(float)m_w - 310.f, 220.f}, ImGuiCond_Once);
    ImGui::SetNextWindowSize({300.f, 0.f}, ImGuiCond_Once);
    ImGui::SetNextWindowBgAlpha(0.72f);
    ImGui::Begin("Light Flash Test", nullptr,
        ImGuiWindowFlags_AlwaysAutoResize | ImGuiWindowFlags_NoNav);

    ImGui::TextColored({0.9f, 0.9f, 0.3f, 1.f},
        "Trigger a flash at a planet.");
    ImGui::TextDisabled("Glow appears when wavefront reaches ship.");
    ImGui::Separator();
    ImGui::Spacing();

    // One button per planet, color-coded
    static const char* PLANET_NAMES[] = {
        "Mercury","Venus","Earth","Mars","Jupiter","Saturn","Uranus","Neptune"
    };
    int per_row = 4;
    for (int i = 0; i < 8; ++i) {
        const BodyVisual* bv = findBodyVisual(PLANET_NAMES[i]);
        if (bv) ImGui::PushStyleColor(ImGuiCol_Button,
                     ImVec4(bv->color.r*0.7f, bv->color.g*0.7f, bv->color.b*0.7f, 1.f));
        if (ImGui::Button(PLANET_NAMES[i], {64.f, 0.f}))
            triggerFlash(PLANET_NAMES[i], sim_t, sys, ship);
        if (bv) ImGui::PopStyleColor();
        if ((i+1) % per_row != 0) ImGui::SameLine();
    }

    ImGui::Spacing();
    ImGui::Separator();

    // Status list — pending and recently arrived flashes
    bool any = false;
    float real_now = (float)glfwGetTime();
    for (const auto& f : m_flashes) {
        any = true;
        const BodyVisual* bv = findBodyVisual(f.planet_name);
        glm::vec3 col = bv ? bv->color : glm::vec3(1.f);

        if (!f.arrived) {
            double remaining_sim_s = f.t_arrive - sim_t;
            double remaining_min   = remaining_sim_s / 60.0;
            ImGui::TextColored({col.r, col.g, col.b, 1.f}, "  %s", f.planet_name.c_str());
            ImGui::SameLine();
            if (remaining_min < 60.0)
                ImGui::Text("— arrives in %.1f sim-min", remaining_min);
            else
                ImGui::Text("— arrives in %.1f sim-hr", remaining_min/60.0);
        } else {
            float age = real_now - f.real_arrive;
            if (age <= 4.0f) {
                ImGui::TextColored({0.3f, 1.f, 0.5f, 1.f}, "  \xe2\x9c\x93 %s", f.planet_name.c_str());
                ImGui::SameLine();
                // Show what the delay was (in sim-time)
                double delay_min = (f.t_arrive - f.t_emitted) / 60.0;
                if (delay_min < 60.0)
                    ImGui::Text("— %.1f sim-min delay", delay_min);
                else
                    ImGui::Text("— %.1f sim-hr delay",  delay_min/60.0);
            }
        }
    }
    if (!any) ImGui::TextDisabled("  No active flashes.");

    ImGui::End();

    // ── View toggle ───────────────────────────────────────────────────────────
    {
        float bar_w = 240.f;
        ImGui::SetNextWindowPos({(float)m_w * 0.5f - bar_w * 0.5f, 10.f});
        ImGui::SetNextWindowSize({bar_w, 0.f});
        ImGui::SetNextWindowBgAlpha(0.70f);
        ImGui::Begin("##views", nullptr,
            ImGuiWindowFlags_NoDecoration | ImGuiWindowFlags_NoMove |
            ImGuiWindowFlags_AlwaysAutoResize | ImGuiWindowFlags_NoSavedSettings |
            ImGuiWindowFlags_NoNav);

        ImGui::TextColored({0.6f, 0.6f, 0.6f, 1.f}, "VIEW");
        ImGui::SameLine();

        bool std_active = (m_view == ViewMode::Standard);
        if (std_active)
            ImGui::PushStyleColor(ImGuiCol_Button, {0.15f, 0.55f, 0.25f, 1.f});
        if (ImGui::Button("Standard"))
            m_view = ViewMode::Standard;
        if (std_active)
            ImGui::PopStyleColor();

        ImGui::SameLine();

        bool sol_active = (m_view == ViewMode::Solar);
        if (sol_active)
            ImGui::PushStyleColor(ImGuiCol_Button, {0.15f, 0.45f, 0.65f, 1.f});
        if (ImGui::Button("Solar System"))
            m_view = ViewMode::Solar;
        if (sol_active)
            ImGui::PopStyleColor();

        ImGui::End();
    }

    // ── Zone indicator ────────────────────────────────────────────────────────
    auto planet_states = sys.getPlanetStates(sim_t);
    auto zone = findZone(ship.position(), planet_states);

    ImGui::SetNextWindowPos({(float)m_w*0.5f - 100.f, 50.f});
    ImGui::SetNextWindowBgAlpha(0.60f);
    ImGui::Begin("##zone", nullptr,
        ImGuiWindowFlags_NoDecoration | ImGuiWindowFlags_NoMove |
        ImGuiWindowFlags_AlwaysAutoResize | ImGuiWindowFlags_NoSavedSettings |
        ImGuiWindowFlags_NoNav | ImGuiWindowFlags_NoMouseInputs);
    if (zone) {
        ImGui::TextColored({0.9f, 0.7f, 0.2f, 1.f},
                           "Zone: %s system", (*zone)->planet_name);
    } else {
        ImGui::TextColored({0.5f, 0.7f, 1.0f, 1.f}, "Zone: The Void");
    }
    ImGui::End();

    if (m_view == ViewMode::Standard)
        renderImGuiStandard(sim_t, sys, ship, observer);
    else if (m_view == ViewMode::Solar)
        renderImGuiSolar(sim_t, sys, ship, observer);
}
