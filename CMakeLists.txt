cmake_minimum_required(VERSION 3.20)
project(Andromeda VERSION 0.1.0 LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 20)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_CXX_EXTENSIONS OFF)

if(NOT CMAKE_BUILD_TYPE)
    set(CMAKE_BUILD_TYPE RelWithDebInfo)
endif()

add_compile_options(-Wall -Wextra -Wpedantic)

# ── Dependencies ──────────────────────────────────────────────────────────────
include(FetchContent)

# GLFW: window, input, and OpenGL context creation
FetchContent_Declare(glfw
    GIT_REPOSITORY https://github.com/glfw/glfw.git
    GIT_TAG        3.4
    GIT_SHALLOW    ON
)
set(GLFW_BUILD_DOCS     OFF CACHE BOOL "" FORCE)
set(GLFW_BUILD_TESTS    OFF CACHE BOOL "" FORCE)
set(GLFW_BUILD_EXAMPLES OFF CACHE BOOL "" FORCE)
FetchContent_MakeAvailable(glfw)

# GLM: header-only math (vec3, mat4, perspective, lookAt, …)
FetchContent_Declare(glm
    GIT_REPOSITORY https://github.com/g-truc/glm.git
    GIT_TAG        1.0.1
    GIT_SHALLOW    ON
)
FetchContent_MakeAvailable(glm)

# Dear ImGui: immediate-mode HUD overlay
FetchContent_Declare(imgui
    GIT_REPOSITORY https://github.com/ocornut/imgui.git
    GIT_TAG        v1.91.1
    GIT_SHALLOW    ON
)
FetchContent_MakeAvailable(imgui)

# stb: single-header image loader (stb_image.h) for planet textures
FetchContent_Declare(stb
    GIT_REPOSITORY https://github.com/nothings/stb.git
    GIT_TAG        master
    GIT_SHALLOW    ON
)
FetchContent_MakeAvailable(stb)

# ── Project sources ───────────────────────────────────────────────────────────
file(GLOB_RECURSE SIM_SOURCES src/*.cpp)

set(IMGUI_DIR ${imgui_SOURCE_DIR})
set(IMGUI_SOURCES
    ${IMGUI_DIR}/imgui.cpp
    ${IMGUI_DIR}/imgui_draw.cpp
    ${IMGUI_DIR}/imgui_tables.cpp
    ${IMGUI_DIR}/imgui_widgets.cpp
    ${IMGUI_DIR}/backends/imgui_impl_glfw.cpp
    ${IMGUI_DIR}/backends/imgui_impl_opengl3.cpp
)

add_executable(andromeda ${SIM_SOURCES} ${IMGUI_SOURCES} main.cpp)

target_include_directories(andromeda PRIVATE
    src
    ${IMGUI_DIR}
    ${IMGUI_DIR}/backends
    ${stb_SOURCE_DIR}
)

# Absolute assets path so textures load regardless of working directory
target_compile_definitions(andromeda PRIVATE
    ASSETS_DIR="${CMAKE_SOURCE_DIR}/assets"
)

target_link_libraries(andromeda PRIVATE glfw glm::glm)

# macOS: use system OpenGL framework directly (no GLAD needed)
if(APPLE)
    target_link_libraries(andromeda PRIVATE "-framework OpenGL")
    target_compile_definitions(andromeda PRIVATE GL_SILENCE_DEPRECATION)
endif()

if(UNIX AND NOT APPLE)
    target_link_libraries(andromeda PRIVATE GL m)
endif()
