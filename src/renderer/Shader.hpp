#pragma once
#include "GL.hpp"
#include <glm/glm.hpp>
#include <string>

class Shader {
    GLuint m_prog = 0;

public:
    Shader() = default;
    Shader(const char* vert_src, const char* frag_src);
    ~Shader();

    // Non-copyable, movable
    Shader(const Shader&) = delete;
    Shader& operator=(const Shader&) = delete;
    Shader(Shader&& o) noexcept : m_prog(o.m_prog) { o.m_prog = 0; }
    Shader& operator=(Shader&& o) noexcept {
        if (this != &o) { if (m_prog) glDeleteProgram(m_prog); m_prog = o.m_prog; o.m_prog = 0; }
        return *this;
    }

    void use() const { glUseProgram(m_prog); }

    void setMat4 (const char* n, const glm::mat4& v) const;
    void setVec4 (const char* n, const glm::vec4& v) const;
    void setVec3 (const char* n, const glm::vec3& v) const;
    void setFloat(const char* n, float v)             const;
    void setBool (const char* n, bool  v)             const;
    void setInt  (const char* n, int   v)             const;
};
