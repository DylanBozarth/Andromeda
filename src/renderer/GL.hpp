#pragma once
// Platform-agnostic OpenGL include.
// macOS ships OpenGL 4.1 core in its system framework — no loader needed.
// Linux/Windows would use GLAD here (see the cmake TODO in CMakeLists.txt).
#ifdef __APPLE__
    #ifndef GL_SILENCE_DEPRECATION
        #define GL_SILENCE_DEPRECATION
    #endif
    #include <OpenGL/gl3.h>
#else
    #include <glad/glad.h>
#endif
#include <GLFW/glfw3.h>
