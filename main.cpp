#include "Solar-system-builder/renderer/GL.hpp"   // must come before any other OpenGL header
#include "math/Constants.hpp"
#include "Solar-system-builder/simulation/SimClock.hpp"
#include "Solar-system-builder/simulation/SolarSystem.hpp"
#include "Player-ship/spacecraft/Spacecraft.hpp"
#include "Player-ship/observation/LightCone.hpp"
#include "Solar-system-builder/renderer/SpaceRenderer.hpp"
#include "imgui_impl_glfw.h"
#include "imgui_impl_opengl3.h"
#include <iostream>
#include <algorithm>
#include <cstdio>

static void glfwErrorCB(int code, const char* desc) {
    std::fprintf(stderr, "GLFW error %d: %s\n", code, desc);
}

int main() {
    // ── GLFW + OpenGL context ─────────────────────────────────────────────────
    glfwSetErrorCallback(glfwErrorCB);
    if (!glfwInit()) {
        std::fputs("GLFW init failed\n", stderr);
        return 1;
    }

    glfwWindowHint(GLFW_CONTEXT_VERSION_MAJOR, 3);
    glfwWindowHint(GLFW_CONTEXT_VERSION_MINOR, 3);
    glfwWindowHint(GLFW_OPENGL_PROFILE, GLFW_OPENGL_CORE_PROFILE);
#ifdef __APPLE__
    glfwWindowHint(GLFW_OPENGL_FORWARD_COMPAT, GL_TRUE);
#endif
    glfwWindowHint(GLFW_SAMPLES, 4);  // 4× MSAA

    int   win_w = 1600, win_h = 900;
    GLFWwindow* win = glfwCreateWindow(win_w, win_h, "Andromeda", nullptr, nullptr);
    if (!win) {
        std::fputs("Failed to create GLFW window\n", stderr);
        glfwTerminate();
        return 1;
    }
    glfwMakeContextCurrent(win);
    glfwSwapInterval(1);  // vsync

    // Framebuffer resize callback
    glfwSetFramebufferSizeCallback(win, [](GLFWwindow*, int w, int h) {
        glViewport(0, 0, w, h);
    });

    std::printf("OpenGL %s — GLSL %s\n",
        glGetString(GL_VERSION), glGetString(GL_SHADING_LANGUAGE_VERSION));

    // ── Simulation objects ────────────────────────────────────────────────────
    SolarSystem system;

    // t=0 is J2000. We start the wall-clock there so the ship begins at a
    // well-defined epoch with known planet positions.
    SimClock clock(0.0);

    // Pilgrim-1: starts in low Earth orbit, ready for a trans-solar injection
    StateVector earth_sv = system.getState("Earth", 0.0);
    Vec3 ship_pos = earth_sv.position + Vec3{ Constants::R_EARTH + 5.0e5, 0.0, 0.0 };
    Vec3 ship_vel = earth_sv.velocity + Vec3{ 0.0, 7700.0, 0.0 };

    Spacecraft ship("Dickballs-2", ship_pos, ship_vel,
                    /*dry_mass*/  8000.0,
                    /*propellant*/42000.0);
    ship.setIsp(380.0);

    // ── Renderer ──────────────────────────────────────────────────────────────
    SpaceRenderer renderer;
    renderer.init(win, win_w, win_h);

    // Update framebuffer size on resize (renderer needs to track it)
    glfwSetWindowUserPointer(win, &renderer);
    // Note: scroll callback is registered inside SpaceRenderer::init().

    double last_sim_t = clock.simTime();

    // ── Main loop ─────────────────────────────────────────────────────────────
    while (!glfwWindowShouldClose(win)) {
        glfwPollEvents();

        // Advance simulation
        double now_sim_t = clock.simTime();
        double dt = now_sim_t - last_sim_t;
        // Guard against spiral-of-death if the frame hangs
        dt = std::min(dt, 86400.0 * 7.0);  // cap at 7 sim-days per frame

        if (dt > 0.0) {
            // Use coarser steps in the void (ship far from any planet) and
            // finer steps inside a planetary zone (handled inside Spacecraft).
            // For now we use a fixed 60-s step and let the simulation
            // accumulate sub-steps internally.
            double step = 60.0;
            for (double elapsed = 0.0; elapsed < dt; elapsed += step) {
                double s = std::min(step, dt - elapsed);
                ship.update(s, last_sim_t + elapsed, system);
            }
        }
        last_sim_t = now_sim_t;

        // Observer is always at the ship (we see the universe from the ship)
        LightCone observer(ship.position());

        // Handle keyboard + mouse input
        renderer.processInput(win, ship);

        // ── Travel commands from the solar map ────────────────────────────────
        if (renderer.hasPendingTravel()) {
            TravelRequest tr = renderer.takePendingTravel();
            if (tr.active) {
                if (tr.duration_sim_s <= 0.0) {
                    // Instant travel: arrive at a low orbit above the target body.
                    // The Vec3{offset, 0, 0} keeps the ship above the surface;
                    // the ship inherits the body's velocity so it doesn't free-fall.
                    StateVector sv = system.getState(tr.target_name, now_sim_t);
                    double arrive_offset = (tr.target_name == "Sun") ? 1.0e10 : 1.0e8;
                    ship.teleport(sv.position + Vec3{arrive_offset, 0.0, 0.0}, sv.velocity);
                } else {
                    // Timed travel (future): each frame compute
                    //   frac = (now_sim_t - tr.start_sim_t) / tr.duration_sim_s
                    // then ship.teleport(lerp(tr.origin_pos_m, tr.target_pos_m, frac), ...)
                    // and cancel once frac >= 1.0.
                    // For now, treat any timed request as instant as a fallback.
                    StateVector sv = system.getState(tr.target_name, now_sim_t);
                    double arrive_offset = (tr.target_name == "Sun") ? 1.0e10 : 1.0e8;
                    ship.teleport(sv.position + Vec3{arrive_offset, 0.0, 0.0}, sv.velocity);
                }
            }
        }

        // Update framebuffer dimensions in case the window was resized
        int fb_w, fb_h;
        glfwGetFramebufferSize(win, &fb_w, &fb_h);
        renderer.resize(fb_w, fb_h);

        // Draw everything (3D scene + ImGui overlay)
        renderer.render(now_sim_t, system, ship, observer, win);

        glfwSwapBuffers(win);
    }

    // ── Cleanup ───────────────────────────────────────────────────────────────
    ImGui_ImplOpenGL3_Shutdown();
    ImGui_ImplGlfw_Shutdown();
    ImGui::DestroyContext();
    glfwDestroyWindow(win);
    glfwTerminate();
    return 0;
}
