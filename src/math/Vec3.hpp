#pragma once
#include <cmath>
#include <string>

struct Vec3 {
    double x{0.0}, y{0.0}, z{0.0};

    constexpr Vec3() = default;
    constexpr Vec3(double x, double y, double z) : x(x), y(y), z(z) {}

    constexpr Vec3 operator+(const Vec3& o) const { return {x+o.x, y+o.y, z+o.z}; }
    constexpr Vec3 operator-(const Vec3& o) const { return {x-o.x, y-o.y, z-o.z}; }
    constexpr Vec3 operator*(double s)      const { return {x*s,   y*s,   z*s};   }
    constexpr Vec3 operator/(double s)      const { return {x/s,   y/s,   z/s};   }
    constexpr Vec3 operator-()              const { return {-x,    -y,    -z};     }

    constexpr Vec3& operator+=(const Vec3& o) { x+=o.x; y+=o.y; z+=o.z; return *this; }
    constexpr Vec3& operator-=(const Vec3& o) { x-=o.x; y-=o.y; z-=o.z; return *this; }
    constexpr Vec3& operator*=(double s)      { x*=s;   y*=s;   z*=s;   return *this; }

    double length()        const { return std::sqrt(x*x + y*y + z*z); }
    double lengthSquared() const { return x*x + y*y + z*z; }

    Vec3 normalized() const {
        double len = length();
        return len > 0.0 ? *this / len : Vec3{};
    }

    constexpr double dot(const Vec3& o)   const { return x*o.x + y*o.y + z*o.z; }
    constexpr Vec3   cross(const Vec3& o) const {
        return {y*o.z - z*o.y, z*o.x - x*o.z, x*o.y - y*o.x};
    }

    std::string str() const {
        return "(" + std::to_string(x) + ", " + std::to_string(y) + ", " + std::to_string(z) + ")";
    }
};

inline constexpr Vec3 operator*(double s, const Vec3& v) { return v * s; }
