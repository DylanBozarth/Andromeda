#pragma once
#include "GL.hpp"
#include "physics/OrbitalElements.hpp"
#include <glm/glm.hpp>
#include <vector>

// Generic GPU mesh. Supports solid geometry (pos + normal, GL_TRIANGLES)
// and wire/point geometry (pos only, GL_LINE_LOOP / GL_POINTS).
class Mesh {
    GLuint m_vao = 0;
    GLuint m_vbo = 0;
    GLuint m_ebo = 0;
    int    m_count = 0;
    GLenum m_mode  = GL_TRIANGLES;

public:
    Mesh() = default;
    ~Mesh();
    Mesh(const Mesh&) = delete;
    Mesh& operator=(const Mesh&) = delete;
    Mesh(Mesh&& o) noexcept;
    Mesh& operator=(Mesh&& o) noexcept;

    void draw() const;
    bool valid() const { return m_vao != 0; }

    // UV sphere: position + normal per vertex, GL_TRIANGLES
    static Mesh sphere(int lat = 24, int lon = 36);

    // Orbit ellipse sampled into N points (AU), GL_LINE_LOOP
    static Mesh orbitPath(const OrbitalElements& elem, int N = 360);

    // Random star field (AU), GL_POINTS
    static Mesh starField(int count = 3000, float radius_AU = 300.0f, uint32_t seed = 42);

    // Simple 3-axis cross marker (AU scale), GL_LINES
    static Mesh crossMarker(float half_size = 0.1f);
};
