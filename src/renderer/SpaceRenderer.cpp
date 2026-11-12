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
out vec4 fragColor;
void main(){
    gl_FragDepth = log2(max(1e-6, 1.0 + v_z)) / log2(u_far + 1.0);
    vec3 base = u_textured ? texture(u_tex, v_uv).rgb : u_color;
    if(u_emissive){ fragColor = vec4(base, u_alpha); return; }
    vec3  norm   = normalize(v_norm);
    vec3  ldir   = normalize(u_sunPos - v_pos);
    float diff   = max(dot(norm, ldir), 0.0);
    vec3  vdir   = normalize(u_camPos - v_pos);
    vec3  half_v = normalize(ldir + vdir);
    float spec   = pow(max(dot(norm, half_v), 0.0), 32.0);
    vec3  ambient = 0.07 * base;
    fragColor = vec4(ambient + diff*base + 0.15*spec*vec3(1.0), u_alpha);
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
            r->m_cam.handleScroll((float)yoff);
        else
            r->m_solar_cam.handleScroll((float)yoff);
    });

    // Standard view: zoom-out cap just past Neptune (~32 AU)
    m_cam.max_distance = 32.f;

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

    // Planet textures — stb_image loads top-to-bottom; flip so v=0 is north pole
    stbi_set_flip_vertically_on_load(false);
    auto tex = [this](const char* name, const char* file) {
        m_textures.push_back({name, loadTexture(
            std::string(ASSETS_DIR "/planet-textures/") .append(file).c_str())});
    };
    tex("Mercury", "mercury.jpg");
    tex("Venus",   "venus_surface.jpg");
    tex("Earth",   "earth.jpg");
    tex("Mars",    "mars.jpg");
    tex("Jupiter", "jupiter.jpg");
    tex("Saturn",  "saturn.jpg");
    tex("Uranus",  "uranus.jpg");
    tex("Neptune", "neptune.jpg");

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
            m_cam.handleMouse((float)delta.x, (float)delta.y, true, false);
        else
            m_solar_cam.handleMouse((float)delta.x, (float)delta.y, true, false);
    }
    m_lastMouse = mouse;
    m_rightDown = orbit;

    if (glfwGetKey(win, GLFW_KEY_ESCAPE) == GLFW_PRESS)
        glfwSetWindowShouldClose(win, GLFW_TRUE);
}

// ── Solar-view illustrative layout ───────────────────────────────────────────
// Single source of truth for solar-view planet positions and sizes.
// The render loop, labels, and click detection all call solarBodyPos() so they
// are guaranteed to show the same position.

struct IllustData { const char* name; float dist; float radius; };
static constexpr IllustData SOLAR_ILLUST[] = {
    { "Sun",     0.0f,  2.00f },
    { "Mercury", 3.5f,  0.18f },
    { "Venus",   5.5f,  0.28f },
    { "Earth",   7.5f,  0.30f },
    { "Mars",   10.0f,  0.22f },
    { "Jupiter",14.0f,  0.90f },
    { "Saturn", 19.0f,  0.78f },
    { "Uranus", 25.0f,  0.55f },
    { "Neptune",31.0f,  0.52f },
};

// Returns the solar-view illustrative scene position for a body.
// au_pos is the body's AU-space XZ position (Y already zeroed).
// Sun (dist==0) always returns origin.
static glm::vec3 solarBodyPos(const char* name, glm::vec3 au_pos) {
    for (const auto& d : SOLAR_ILLUST) {
        if (std::string_view(d.name) == std::string_view(name)) {
            if (d.dist == 0.f) return {0.f, 0.f, 0.f};
            float angle = std::atan2(au_pos.z, au_pos.x);
            return { d.dist * std::cos(angle), 0.f, d.dist * std::sin(angle) };
        }
    }
    return {-999.f, 0.f, 0.f};  // body not in solar view
}

// ── Position mappers ─────────────────────────────────────────────────────────

glm::vec3 SpaceRenderer::toSolarScene(Vec3 v) {
    // Piecewise-linear map: real AU distance → illustrative scene distance.
    // Breakpoints match the ILLUST table in the render loop.
    static constexpr float REAL[] = { 0.f, 0.387f, 0.723f, 1.000f, 1.524f,
                                       5.204f, 9.582f, 19.190f, 30.070f };
    static constexpr float ILLU[] = { 0.f, 3.5f,   5.5f,   7.5f,  10.0f,
                                       14.0f,  19.0f,  25.0f,   31.0f  };
    constexpr int N = 9;

    float xAU = (float)(v.x / Constants::AU);
    float zAU = (float)(v.z / Constants::AU);
    float real_dist = std::sqrt(xAU*xAU + zAU*zAU);

    float illust = ILLU[N-1];
    for (int i = 0; i < N-1; ++i) {
        if (real_dist <= REAL[i+1]) {
            float t = (real_dist - REAL[i]) / (REAL[i+1] - REAL[i]);
            illust = ILLU[i] + t * (ILLU[i+1] - ILLU[i]);
            break;
        }
    }

    float angle = std::atan2(zAU, xAU);
    return { illust * std::cos(angle), 0.f, illust * std::sin(angle) };
}

// ── Texture helpers ───────────────────────────────────────────────────────────

GLuint SpaceRenderer::loadTexture(const char* path) {
    int w, h, ch;
    unsigned char* data = stbi_load(path, &w, &h, &ch, 3);
    if (!data) {
        std::fprintf(stderr, "Texture load failed: %s\n", path);
        return 0;
    }
    GLuint id;
    glGenTextures(1, &id);
    glBindTexture(GL_TEXTURE_2D, id);
    glTexImage2D(GL_TEXTURE_2D, 0, GL_RGB, w, h, 0, GL_RGB, GL_UNSIGNED_BYTE, data);
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
                              float alpha, GLuint tex_id)
{
    glm::mat4 model = glm::scale(glm::translate(glm::mat4(1.f), pos),
                                 glm::vec3(vis.visual_radius));
    m_bodyShader.use();
    m_bodyShader.setMat4("u_model", model);
    m_bodyShader.setMat4("u_view",  view);
    m_bodyShader.setMat4("u_proj",  proj);
    m_bodyShader.setVec3("u_color",  vis.color);
    m_bodyShader.setVec3("u_sunPos", sun);
    m_bodyShader.setVec3("u_camPos", cam);
    m_bodyShader.setBool("u_emissive", emissive);
    m_bodyShader.setBool("u_textured", tex_id != 0);
    m_bodyShader.setFloat("u_far",   m_cam.far_plane);
    m_bodyShader.setFloat("u_alpha", alpha);
    if (tex_id) {
        glActiveTexture(GL_TEXTURE0);
        glBindTexture(GL_TEXTURE_2D, tex_id);
        m_bodyShader.setInt("u_tex", 0);
    }
    m_sphere.draw();
    if (tex_id) glBindTexture(GL_TEXTURE_2D, 0);
}

void SpaceRenderer::drawStars(const glm::mat4& view, const glm::mat4& proj) {
    // Stars rotate with the camera (move the star sphere with the camera)
    glm::mat4 vp = proj * glm::mat4(glm::mat3(view));  // strip translation
    m_lineShader.use();
    m_lineShader.setMat4("u_vp", vp);
    m_lineShader.setFloat("u_far", m_cam.far_plane);
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
    // All views track the ship. Each camera uses its own scene-space mapping
    // so the ship stays centred regardless of view. Add new cameras here.
    m_cam.target       = toAU(ship.position());
    m_solar_cam.target = toSolarScene(ship.position());

    Camera3D& active_cam = (m_view == ViewMode::Standard) ? m_cam : m_solar_cam;

    glViewport(0, 0, m_w, m_h);
    if (m_view == ViewMode::Solar)
        glClearColor(0.f, 0.02f, 0.07f, 1.f);   // dark navy for the map
    else
        glClearColor(0.f, 0.f, 0.015f, 1.f);
    glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);

    // Standard view: prevent the camera from clipping inside any nearby body.
    // We compute the ship's altitude above each body's surface and use that
    // as a minimum camera distance — if the ship is in LEO at 500 km, the
    // camera can zoom in to 500 km from the ship before the clamp engages.
    if (m_view == ViewMode::Standard) {
        float safe_min = 1.0e-9f;
        for (const auto& vis : BODY_VISUALS) {
            if (std::string_view(vis.name) == "Sun") continue;
            try {
                Vec3   body_pos  = sys.getPosition(vis.name, sim_t);
                float  d_au      = (float)((ship.position() - body_pos).length()
                                           / Constants::AU);
                float  altitude  = d_au - vis.visual_radius;
                // Only clamp when within 0.01 AU of the body's surface
                if (altitude > 0.f && altitude < 0.01f)
                    safe_min = std::max(safe_min, altitude);
            } catch (...) {}
        }
        m_cam.distance = std::max(m_cam.distance, safe_min);
    }

    // Keep near plane at 1/1000th of camera distance so the scene renders
    // correctly from solar-system scale all the way down to metres.
    active_cam.near_plane = std::max(1.0e-13f, active_cam.distance * 0.001f);

    float aspect = (m_h > 0) ? (float)m_w / (float)m_h : 1.f;
    glm::mat4 view = active_cam.viewMatrix();
    glm::mat4 proj = active_cam.projMatrix(aspect);
    glm::vec3 cam  = active_cam.position();

    // 1. Stars — only in standard view
    if (m_view == ViewMode::Standard) {
        glDepthMask(GL_FALSE);
        drawStars(view, proj);
        glDepthMask(GL_TRUE);
    }

    // 2. Celestial bodies — render at observed (light-delayed) positions
    //    so the visual matches what physics says an observer sees.
    constexpr glm::vec3 sun_scene{0.f, 0.f, 0.f};

    for (const auto& vis : BODY_VISUALS) {
        // Observed position (what the ship sees given finite light speed)
        glm::vec3 obs_pos;
        try {
            Vec3 p = observer.observePosition(vis.name, sim_t, sys);
            obs_pos = toAU(p);
        } catch (...) {
            // Body not in simulation (e.g. queried moon not matching name)
            if (std::string_view(vis.name) == "Sun") {
                obs_pos = sun_scene;
            } else {
                continue;
            }
        }
        bool is_sun = (std::string_view(vis.name) == "Sun");

        // Solar view: flatten onto ecliptic, map each body to an illustrative
        // position via SOLAR_ILLUST (single source of truth shared with labels).
        BodyVisual draw_vis = vis;
        if (m_view == ViewMode::Solar) {
            obs_pos.y = 0.f;
            obs_pos = solarBodyPos(vis.name, obs_pos);
            for (const auto& d : SOLAR_ILLUST) {
                if (std::string_view(d.name) == std::string_view(vis.name)) {
                    draw_vis.visual_radius = d.radius;
                    draw_vis.color = glm::min(vis.color * 1.8f, glm::vec3(1.f));
                    break;
                }
            }
        }
        GLuint tex = is_sun ? 0 : findTexture(vis.name);
        drawBody(draw_vis, obs_pos, view, proj, sun_scene, cam, is_sun, 1.0f, tex);
    }

    // 4. Ship — a small sphere the size of a schoolbus (~12 m, radius ~6 m).
    //    6 m / 1 AU = 4.01e-11 AU.  Solar view inflates it to a nav-map dot.
    glm::vec3 ship_scene = toScene(ship.position());
    {
        bool solar = (m_view == ViewMode::Solar);
        float dot_r = solar ? 0.55f : 4.01e-11f;

        BodyVisual ship_vis = {"ship", {0.0f, 1.0f, 0.4f}, dot_r};
        drawBody(ship_vis, ship_scene, view, proj, sun_scene, cam, true);

        // Cross marker: solar view only (helps locate ship on the map)
        if (solar) {
            glm::mat4 model = glm::scale(
                glm::translate(glm::mat4(1.f), ship_scene),
                glm::vec3(10.0f));
            m_lineShader.use();
            m_lineShader.setMat4("u_vp", proj * view * model);
            m_lineShader.setFloat("u_far", active_cam.far_plane);
            m_lineShader.setVec4("u_color", {0.0f, 1.0f, 0.4f, 1.0f});
            m_cross.draw();
        }
    }

    // 4b. Orbit rings — solar view only
    if (m_view == ViewMode::Solar) {
        // Semi-major axes (AU) and matching body colors (dim, translucent)
        struct Ring { float radius; glm::vec4 color; };
        static constexpr Ring RINGS[] = {
            {  3.5f, {0.60f, 0.55f, 0.50f, 0.35f} },  // Mercury
            {  5.5f, {0.95f, 0.85f, 0.60f, 0.35f} },  // Venus
            {  7.5f, {0.25f, 0.60f, 1.00f, 0.40f} },  // Earth
            { 10.0f, {0.90f, 0.40f, 0.25f, 0.40f} },  // Mars
            { 14.0f, {0.95f, 0.80f, 0.60f, 0.35f} },  // Jupiter
            { 19.0f, {1.00f, 0.95f, 0.70f, 0.35f} },  // Saturn
            { 25.0f, {0.55f, 0.90f, 0.95f, 0.35f} },  // Uranus
            { 31.0f, {0.30f, 0.50f, 1.00f, 0.35f} },  // Neptune
        };

        glDepthMask(GL_FALSE);
        m_lineShader.use();
        m_lineShader.setFloat("u_far", active_cam.far_plane);
        for (const auto& r : RINGS) {
            glm::mat4 ring_model = glm::scale(glm::mat4(1.f), glm::vec3(r.radius));
            m_lineShader.setMat4("u_vp", proj * view * ring_model);
            m_lineShader.setVec4("u_color", r.color);
            m_circle.draw();
        }
        glDepthMask(GL_TRUE);
    }

    // 5. Flash spheres — additive glow, no depth write so they show through bodies
    {
        float real_now = (float)glfwGetTime();
        glDepthMask(GL_FALSE);
        glBlendFunc(GL_SRC_ALPHA, GL_ONE);  // additive for glow effect

        for (auto& flash : m_flashes) {
            if (!flash.arrived && sim_t >= flash.t_arrive) {
                flash.arrived     = true;
                flash.real_arrive = real_now;
            }
            if (!flash.arrived) continue;

            float age = real_now - flash.real_arrive;
            constexpr float FLASH_DURATION = 2.5f;  // real seconds
            if (age > FLASH_DURATION) continue;

            float t     = age / FLASH_DURATION;        // 0→1
            float alpha = (1.0f - t) * (1.0f - t);    // ease-out fade
            float scale = 1.0f + 5.0f * t;             // expand to 6× planet radius

            const BodyVisual* bv = findBodyVisual(flash.planet_name);
            if (!bv) continue;

            BodyVisual glow = *bv;
            // Brighten the glow color — clamp to 1 on each channel
            glow.color        = glm::min(bv->color * 2.5f, glm::vec3(1.f));
            glow.visual_radius = bv->visual_radius * scale;

            drawBody(glow, toAU(flash.pos_emit), view, proj,
                     sun_scene, cam, /*emissive=*/true, alpha);
        }

        // Prune flash events older than FLASH_DURATION + a grace window
        m_flashes.erase(
            std::remove_if(m_flashes.begin(), m_flashes.end(),
                [real_now](const FlashEvent& f) {
                    return f.arrived && (real_now - f.real_arrive) > 4.0f;
                }),
            m_flashes.end());

        glDepthMask(GL_TRUE);
        glBlendFunc(GL_SRC_ALPHA, GL_ONE_MINUS_SRC_ALPHA);
    }

    // 6. ImGui overlay
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
        ImGuiWindowFlags_NoNav);

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
        ImGuiWindowFlags_NoNav);

    ImGui::TextColored({0.3f, 1.f, 0.5f, 1.f}, "%s", ship.name().c_str());
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
        ImGuiWindowFlags_NoNav);
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
        ImGuiWindowFlags_NoNav);
    if (zone) {
        ImGui::TextColored({0.9f, 0.7f, 0.2f, 1.f},
                           "Zone: %s system", (*zone)->planet_name);
    } else {
        ImGui::TextColored({0.5f, 0.7f, 1.0f, 1.f}, "Zone: The Void");
    }
    ImGui::End();

    // ── Solar map: labels + context menu ─────────────────────────────────────
    if (m_view == ViewMode::Solar) {
        // Project every body's illustrative position to screen space.
        // This is the ground truth — it matches exactly where the spheres are drawn.
        struct BodyScreen { const char* name; float sx, sy; };
        std::vector<BodyScreen> on_screen;

        float    aspect = (m_h > 0) ? (float)m_w / (float)m_h : 1.f;
        glm::mat4 vp   = m_solar_cam.projMatrix(aspect) * m_solar_cam.viewMatrix();
        ImVec2   dsz   = ImGui::GetIO().DisplaySize;  // logical pixels

        for (const auto& vis : BODY_VISUALS) {
            try {
                // Use observer.observePosition + solarBodyPos — exact same path as the render loop
                Vec3 rp = observer.observePosition(vis.name, sim_t, sys);
                glm::vec3 au = toAU(rp);
                au.y = 0.f;
                glm::vec3 illust = solarBodyPos(vis.name, au);
                if (illust.x < -900.f) continue;  // not in SOLAR_ILLUST table
                glm::vec4 clip = vp * glm::vec4(illust, 1.f);
                if (clip.w <= 0.f) continue;
                glm::vec3 ndc = glm::vec3(clip) / clip.w;
                float sx = (ndc.x * 0.5f + 0.5f) * dsz.x;
                float sy = (1.f - (ndc.y * 0.5f + 0.5f)) * dsz.y;
                on_screen.push_back({vis.name, sx, sy});
            } catch (...) {}
        }

        // Planet labels — drawn on the ImGui foreground layer, offset from dot
        auto* dl = ImGui::GetForegroundDrawList();
        for (const auto& b : on_screen) {
            if (std::string_view(b.name) == "Sun") continue;
            if (b.sx < -50.f || b.sx > dsz.x + 50.f) continue;
            if (b.sy < -50.f || b.sy > dsz.y + 50.f) continue;
            // Drop shadow for legibility
            dl->AddText({b.sx + 9.f, b.sy - 7.f}, IM_COL32(0, 0, 0, 160), b.name);
            dl->AddText({b.sx + 8.f, b.sy - 8.f}, IM_COL32(190, 215, 255, 220), b.name);
        }

        // Right-click: find nearest body in screen pixels (always correct, no unproject)
        if (ImGui::IsMouseClicked(ImGuiMouseButton_Right)
            && !ImGui::IsWindowHovered(ImGuiHoveredFlags_AnyWindow)
            && !ImGui::IsAnyItemHovered()) {

            ImVec2 mp = ImGui::GetIO().MousePos;
            m_ctx_planet.clear();
            float best_px = 60.f;
            for (const auto& b : on_screen) {
                float dx = mp.x - b.sx, dy = mp.y - b.sy;
                float d  = std::sqrt(dx*dx + dy*dy);
                if (d < best_px) { best_px = d; m_ctx_planet = b.name; }
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
                            sim_t, 0.0, true };
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
                                sim_t, 0.0, true };
                        } catch (...) {}
                        ImGui::CloseCurrentPopup();
                    }
                }
            }
            ImGui::EndPopup();
        }
    }
}
