#include "Shader.hpp"
#include <glm/gtc/type_ptr.hpp>
#include <stdexcept>
#include <string>

static GLuint compile(GLenum type, const char* src) {
    GLuint s = glCreateShader(type);
    glShaderSource(s, 1, &src, nullptr);
    glCompileShader(s);
    GLint ok = 0;
    glGetShaderiv(s, GL_COMPILE_STATUS, &ok);
    if (!ok) {
        char log[512]; glGetShaderInfoLog(s, 512, nullptr, log);
        glDeleteShader(s);
        throw std::runtime_error(std::string("Shader compile: ") + log);
    }
    return s;
}

Shader::Shader(const char* vert_src, const char* frag_src) {
    GLuint v = compile(GL_VERTEX_SHADER, vert_src);
    GLuint f = compile(GL_FRAGMENT_SHADER, frag_src);
    m_prog = glCreateProgram();
    glAttachShader(m_prog, v);
    glAttachShader(m_prog, f);
    glLinkProgram(m_prog);
    glDeleteShader(v);
    glDeleteShader(f);
    GLint ok = 0;
    glGetProgramiv(m_prog, GL_LINK_STATUS, &ok);
    if (!ok) {
        char log[512]; glGetProgramInfoLog(m_prog, 512, nullptr, log);
        glDeleteProgram(m_prog); m_prog = 0;
        throw std::runtime_error(std::string("Shader link: ") + log);
    }
}

Shader::~Shader() { if (m_prog) glDeleteProgram(m_prog); }

void Shader::setMat4(const char* n, const glm::mat4& v) const {
    glUniformMatrix4fv(glGetUniformLocation(m_prog, n), 1, GL_FALSE, glm::value_ptr(v));
}
void Shader::setVec4(const char* n, const glm::vec4& v) const {
    glUniform4f(glGetUniformLocation(m_prog, n), v.x, v.y, v.z, v.w);
}
void Shader::setVec3(const char* n, const glm::vec3& v) const {
    glUniform3f(glGetUniformLocation(m_prog, n), v.x, v.y, v.z);
}
void Shader::setFloat(const char* n, float v) const {
    glUniform1f(glGetUniformLocation(m_prog, n), v);
}
void Shader::setBool(const char* n, bool v) const {
    glUniform1i(glGetUniformLocation(m_prog, n), v ? 1 : 0);
}
