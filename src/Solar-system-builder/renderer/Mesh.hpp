#pragma once
#include "GL.hpp"
#include "Solar-system-builder/physics/OrbitalElements.hpp"
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

    // Unit circle in the XZ (ecliptic) plane, radius 1 AU, GL_LINE_LOOP
    // Scale via model matrix to draw orbit rings at any radius.
    static Mesh circle(int N = 128);

    // Flat annular disc in the XZ plane (Y=0).
    // inner_r / outer_r are in the same units as the model matrix will scale to.
    // UV: U wraps around circumference (0→1), V = 0 at inner edge, 1 at outer edge.
    static Mesh disc(float inner_r, float outer_r, int segments = 128);
};
