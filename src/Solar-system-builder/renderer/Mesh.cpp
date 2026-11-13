#include "Mesh.hpp"
#include "Solar-system-builder/physics/KeplerSolver.hpp"
#include "math/Constants.hpp"
#include <glm/gtc/constants.hpp>
#include <cmath>

// ── Move / destroy ────────────────────────────────────────────────────────────

Mesh::~Mesh() {
    if (m_ebo) glDeleteBuffers(1, &m_ebo);
    if (m_vbo) glDeleteBuffers(1, &m_vbo);
    if (m_vao) glDeleteVertexArrays(1, &m_vao);
}

Mesh::Mesh(Mesh&& o) noexcept
    : m_vao(o.m_vao), m_vbo(o.m_vbo), m_ebo(o.m_ebo)
    , m_count(o.m_count), m_mode(o.m_mode)
{
    o.m_vao = o.m_vbo = o.m_ebo = 0;
}

Mesh& Mesh::operator=(Mesh&& o) noexcept {
    if (this != &o) { this->~Mesh(); new(this) Mesh(std::move(o)); }
    return *this;
}

void Mesh::draw() const {
    if (!m_vao) return;
    glBindVertexArray(m_vao);
    if (m_ebo)
        glDrawElements(m_mode, m_count, GL_UNSIGNED_INT, nullptr);
    else
        glDrawArrays(m_mode, 0, m_count);
    glBindVertexArray(0);
}

// ── Sphere ────────────────────────────────────────────────────────────────────
// Interleaved: vec3 position (loc=0), vec3 normal (loc=1)

Mesh Mesh::sphere(int lat, int lon) {
    struct V { glm::vec3 pos, nrm; glm::vec2 uv; };
    std::vector<V> verts;
    std::vector<unsigned int> idx;
    verts.reserve((size_t)(lat+1)*(lon+1));
    idx.reserve((size_t)lat*lon*6);

    for (int i = 0; i <= lat; ++i) {
        float theta = glm::pi<float>() * i / lat;
        for (int j = 0; j <= lon; ++j) {
            float phi = glm::two_pi<float>() * j / lon;
            glm::vec3 p = {
                std::sin(theta) * std::cos(phi),
                std::cos(theta),
                std::sin(theta) * std::sin(phi)
            };
            // u wraps 0→1 around longitude; v goes 0 (north) → 1 (south)
            glm::vec2 uv = { (float)j / lon, (float)i / lat };
            verts.push_back({p, p, uv});
        }
    }
    for (int i = 0; i < lat; ++i) {
        for (int j = 0; j < lon; ++j) {
            unsigned a = (unsigned)(i*(lon+1)+j);
            unsigned b = a+1, c = (unsigned)((i+1)*(lon+1)+j), d = c+1;
            idx.insert(idx.end(), {a,c,b,  b,c,d});
        }
    }

    Mesh m;
    glGenVertexArrays(1, &m.m_vao);
    glGenBuffers(1, &m.m_vbo);
    glGenBuffers(1, &m.m_ebo);
    glBindVertexArray(m.m_vao);

    glBindBuffer(GL_ARRAY_BUFFER, m.m_vbo);
    glBufferData(GL_ARRAY_BUFFER, (GLsizeiptr)(verts.size()*sizeof(V)),
                 verts.data(), GL_STATIC_DRAW);

    glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, m.m_ebo);
    glBufferData(GL_ELEMENT_ARRAY_BUFFER, (GLsizeiptr)(idx.size()*sizeof(unsigned)),
                 idx.data(), GL_STATIC_DRAW);

    glVertexAttribPointer(0, 3, GL_FLOAT, GL_FALSE, sizeof(V),
                          (void*)offsetof(V, pos));
    glEnableVertexAttribArray(0);
    glVertexAttribPointer(1, 3, GL_FLOAT, GL_FALSE, sizeof(V),
                          (void*)offsetof(V, nrm));
    glEnableVertexAttribArray(1);
    glVertexAttribPointer(2, 2, GL_FLOAT, GL_FALSE, sizeof(V),
                          (void*)offsetof(V, uv));
    glEnableVertexAttribArray(2);

    glBindVertexArray(0);
    m.m_count = (int)idx.size();
    m.m_mode  = GL_TRIANGLES;
    return m;
}

// ── Orbit path ────────────────────────────────────────────────────────────────
// Samples N positions uniformly in mean anomaly, converts metres → AU.

Mesh Mesh::orbitPath(const OrbitalElements& elem, int N) {
    std::vector<glm::vec3> pts;
    pts.reserve((size_t)N);

    // Build a temporary element set with M0 stepping through 0..2π
    OrbitalElements e = elem;
    for (int i = 0; i < N; ++i) {
        e.M0 = glm::two_pi<double>() * i / N;
        Vec3 p = KeplerSolver::position(e, 0.0);
        pts.push_back({(float)(p.x/Constants::AU),
                       (float)(p.y/Constants::AU),
                       (float)(p.z/Constants::AU)});
    }

    Mesh m;
    glGenVertexArrays(1, &m.m_vao);
    glGenBuffers(1, &m.m_vbo);
    glBindVertexArray(m.m_vao);
    glBindBuffer(GL_ARRAY_BUFFER, m.m_vbo);
    glBufferData(GL_ARRAY_BUFFER, (GLsizeiptr)(pts.size()*sizeof(glm::vec3)),
                 pts.data(), GL_STATIC_DRAW);
    glVertexAttribPointer(0, 3, GL_FLOAT, GL_FALSE, sizeof(glm::vec3), nullptr);
    glEnableVertexAttribArray(0);
    glBindVertexArray(0);
    m.m_count = N;
    m.m_mode  = GL_LINE_LOOP;
    return m;
}

// ── Star field ────────────────────────────────────────────────────────────────

Mesh Mesh::starField(int count, float radius_AU, uint32_t seed) {
    std::vector<glm::vec3> pts;
    pts.reserve((size_t)count);
    uint32_t rng = seed;
    auto rand01 = [&]() -> float {
        rng = rng*1664525u + 1013904223u;
        return (float)(rng>>8) / (float)(1u<<24);
    };
    for (int i = 0; i < count; ++i) {
        float theta = std::acos(1.0f - 2.0f*rand01());
        float phi   = glm::two_pi<float>() * rand01();
        float r     = radius_AU * (0.85f + 0.15f*rand01());
        pts.push_back({r*std::sin(theta)*std::cos(phi),
                       r*std::cos(theta),
                       r*std::sin(theta)*std::sin(phi)});
    }
    Mesh m;
    glGenVertexArrays(1, &m.m_vao);
    glGenBuffers(1, &m.m_vbo);
    glBindVertexArray(m.m_vao);
    glBindBuffer(GL_ARRAY_BUFFER, m.m_vbo);
    glBufferData(GL_ARRAY_BUFFER, (GLsizeiptr)(pts.size()*sizeof(glm::vec3)),
                 pts.data(), GL_STATIC_DRAW);
    glVertexAttribPointer(0, 3, GL_FLOAT, GL_FALSE, sizeof(glm::vec3), nullptr);
    glEnableVertexAttribArray(0);
    glBindVertexArray(0);
    m.m_count = count;
    m.m_mode  = GL_POINTS;
    return m;
}

// ── Orbit ring (unit circle, XZ plane) ───────────────────────────────────────

Mesh Mesh::circle(int N) {
    std::vector<glm::vec3> pts;
    pts.reserve((size_t)N);
    for (int i = 0; i < N; ++i) {
        float a = glm::two_pi<float>() * i / N;
        pts.push_back({std::cos(a), 0.f, std::sin(a)});
    }
    Mesh m;
    glGenVertexArrays(1, &m.m_vao);
    glGenBuffers(1, &m.m_vbo);
    glBindVertexArray(m.m_vao);
    glBindBuffer(GL_ARRAY_BUFFER, m.m_vbo);
    glBufferData(GL_ARRAY_BUFFER, (GLsizeiptr)(pts.size()*sizeof(glm::vec3)),
                 pts.data(), GL_STATIC_DRAW);
    glVertexAttribPointer(0, 3, GL_FLOAT, GL_FALSE, sizeof(glm::vec3), nullptr);
    glEnableVertexAttribArray(0);
    glBindVertexArray(0);
    m.m_count = N;
    m.m_mode  = GL_LINE_LOOP;
    return m;
}

// ── Annular disc (XZ plane, Y=0) ─────────────────────────────────────────────

Mesh Mesh::disc(float inner_r, float outer_r, int segments) {
    struct V { glm::vec3 pos, nrm; glm::vec2 uv; };
    std::vector<V>        verts;
    std::vector<uint32_t> idx;
    verts.reserve((size_t)(segments + 1) * 2);
    idx.reserve((size_t)segments * 6);

    for (int i = 0; i <= segments; ++i) {
        float u   = (float)i / (float)segments;
        float ang = u * glm::two_pi<float>();
        float cx  = std::cos(ang);
        float cz  = std::sin(ang);
        glm::vec3 nrm = {0.f, 1.f, 0.f};
        verts.push_back({{ inner_r * cx, 0.f, inner_r * cz }, nrm, {u, 0.f}});
        verts.push_back({{ outer_r * cx, 0.f, outer_r * cz }, nrm, {u, 1.f}});
    }

    for (int i = 0; i < segments; ++i) {
        uint32_t base = (uint32_t)i * 2;
        idx.push_back(base);     idx.push_back(base+1); idx.push_back(base+2);
        idx.push_back(base+1);   idx.push_back(base+3); idx.push_back(base+2);
    }

    Mesh m;
    glGenVertexArrays(1, &m.m_vao);
    glGenBuffers(1, &m.m_vbo);
    glGenBuffers(1, &m.m_ebo);
    glBindVertexArray(m.m_vao);
    glBindBuffer(GL_ARRAY_BUFFER, m.m_vbo);
    glBufferData(GL_ARRAY_BUFFER, (GLsizeiptr)(verts.size()*sizeof(V)),
                 verts.data(), GL_STATIC_DRAW);
    glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, m.m_ebo);
    glBufferData(GL_ELEMENT_ARRAY_BUFFER, (GLsizeiptr)(idx.size()*sizeof(uint32_t)),
                 idx.data(), GL_STATIC_DRAW);
    glVertexAttribPointer(0, 3, GL_FLOAT, GL_FALSE, sizeof(V),
                          (void*)offsetof(V, pos));
    glEnableVertexAttribArray(0);
    glVertexAttribPointer(1, 3, GL_FLOAT, GL_FALSE, sizeof(V),
                          (void*)offsetof(V, nrm));
    glEnableVertexAttribArray(1);
    glVertexAttribPointer(2, 2, GL_FLOAT, GL_FALSE, sizeof(V),
                          (void*)offsetof(V, uv));
    glEnableVertexAttribArray(2);
    glBindVertexArray(0);
    m.m_count = (int)idx.size();
    m.m_mode  = GL_TRIANGLES;
    return m;
}

// ── Cross marker ──────────────────────────────────────────────────────────────

Mesh Mesh::crossMarker(float h) {
    std::vector<glm::vec3> pts = {
        {-h,0,0},{h,0,0},  {0,-h,0},{0,h,0},  {0,0,-h},{0,0,h}
    };
    Mesh m;
    glGenVertexArrays(1, &m.m_vao);
    glGenBuffers(1, &m.m_vbo);
    glBindVertexArray(m.m_vao);
    glBindBuffer(GL_ARRAY_BUFFER, m.m_vbo);
    glBufferData(GL_ARRAY_BUFFER, (GLsizeiptr)(pts.size()*sizeof(glm::vec3)),
                 pts.data(), GL_STATIC_DRAW);
    glVertexAttribPointer(0, 3, GL_FLOAT, GL_FALSE, sizeof(glm::vec3), nullptr);
    glEnableVertexAttribArray(0);
    glBindVertexArray(0);
    m.m_count = (int)pts.size();
    m.m_mode  = GL_LINES;
    return m;
}
