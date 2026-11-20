#pragma once
#include <glm/glm.hpp>
#include <array>
#include <string_view>

struct BodyVisual {
    const char* name;
    glm::vec3   color;
    float       visual_radius;  // AU — true equatorial radius / AU
};

// True-scale equatorial radii (R_body / AU).  At solar-system zoom planets
// are tiny dots, exactly as they appear in space.  Zoom into a planetary zone
// to see them as resolved discs.
inline constexpr std::array<BodyVisual, 9> BODY_VISUALS = {{
    {"Sun",     {1.00f, 0.95f, 0.70f}, 0.004650f},    // 695700 km
    {"Mercury", {0.60f, 0.55f, 0.50f}, 1.631e-5f},    //   2440 km
    {"Venus",   {0.95f, 0.85f, 0.60f}, 4.046e-5f},    //   6052 km
    {"Earth",   {0.25f, 0.50f, 0.90f}, 4.263e-5f},    //   6378 km
    {"Mars",    {0.80f, 0.35f, 0.20f}, 2.265e-5f},    //   3390 km
    {"Jupiter", {0.90f, 0.75f, 0.55f}, 4.779e-4f},    //  71492 km
    {"Saturn",  {0.95f, 0.88f, 0.65f}, 4.029e-4f},    //  60268 km
    {"Uranus",  {0.55f, 0.85f, 0.90f}, 1.709e-4f},    //  25559 km
    {"Neptune", {0.25f, 0.40f, 0.90f}, 1.656e-4f},    //  24764 km
}};

inline const BodyVisual* findBodyVisual(std::string_view name) {
    for (const auto& v : BODY_VISUALS)
        if (name == v.name) return &v;
    return nullptr;
}

// White spheres for all 171 moons. visual_radius = moon_radius_m / AU.
// Order matches MOONS[] in MoonData.hpp exactly.
inline constexpr std::array<BodyVisual, 171> MOON_VISUALS = {{
    // Earth
    {"Moon",      {1.f, 1.f, 1.f}, 1.161e-5f},   // 1737 km
    // Mars
    {"Phobos",    {1.f, 1.f, 1.f}, 7.53e-8f},    //   11 km
    {"Deimos",    {1.f, 1.f, 1.f}, 4.14e-8f},    //    6 km
    // Jupiter
    {"Io",        {1.f, 1.f, 1.f}, 1.218e-5f},   // 1822 km
    {"Europa",    {1.f, 1.f, 1.f}, 1.044e-5f},   // 1561 km
    {"Ganymede",  {1.f, 1.f, 1.f}, 1.761e-5f},   // 2634 km
    {"Callisto",  {1.f, 1.f, 1.f}, 1.611e-5f},   // 2410 km
    {"Amalthea",  {1.f, 1.f, 1.f}, 5.58e-7f},    //   84 km
    // Saturn
    {"Mimas",     {1.f, 1.f, 1.f}, 1.325e-6f},   //  198 km
    {"Enceladus", {1.f, 1.f, 1.f}, 1.685e-6f},   //  252 km
    {"Tethys",    {1.f, 1.f, 1.f}, 3.563e-6f},   //  533 km
    {"Dione",     {1.f, 1.f, 1.f}, 3.755e-6f},   //  562 km
    {"Rhea",      {1.f, 1.f, 1.f}, 5.11e-6f},    //  764 km
    {"Titan",     {1.f, 1.f, 1.f}, 1.721e-5f},   // 2575 km
    {"Hyperion",  {1.f, 1.f, 1.f}, 9.03e-7f},    //  135 km
    {"Iapetus",   {1.f, 1.f, 1.f}, 4.91e-6f},    //  735 km
    // Uranus
    {"Miranda",   {1.f, 1.f, 1.f}, 1.576e-6f},   //  236 km
    {"Ariel",     {1.f, 1.f, 1.f}, 3.870e-6f},   //  579 km
    {"Umbriel",   {1.f, 1.f, 1.f}, 3.909e-6f},   //  585 km
    {"Titania",   {1.f, 1.f, 1.f}, 5.274e-6f},   //  789 km
    {"Oberon",    {1.f, 1.f, 1.f}, 5.09e-6f},    //  761 km
    // Neptune
    {"Triton",    {1.f, 1.f, 1.f}, 9.047e-6f},   // 1353 km
    {"Nereid",    {1.f, 1.f, 1.f}, 2.386e-6f},   //  357 km
    // Additional Jupiter moons (true-scale radii in AU = radius_m / 1.496e11)
    {"Himalia",      {1.f,1.f,1.f}, 5.68e-7f},   //   85 km
    {"Elara",        {1.f,1.f,1.f}, 2.67e-7f},   //   40 km
    {"Pasiphae",     {1.f,1.f,1.f}, 1.67e-7f},   //   25 km
    {"Sinope",       {1.f,1.f,1.f}, 1.27e-7f},   //   19 km
    {"Lysithea",     {1.f,1.f,1.f}, 1.20e-7f},   //   18 km
    {"Carme",        {1.f,1.f,1.f}, 1.54e-7f},   //   23 km
    {"Ananke",       {1.f,1.f,1.f}, 9.36e-8f},   //   14 km
    {"Leda",         {1.f,1.f,1.f}, 7.35e-8f},   //   11 km
    {"Thebe",        {1.f,1.f,1.f}, 3.28e-7f},   //   49 km
    {"Adrastea",     {1.f,1.f,1.f}, 5.48e-8f},   //  8.2 km
    {"Metis",        {1.f,1.f,1.f}, 1.44e-7f},   // 21.5 km
    {"Callirrhoe",   {1.f,1.f,1.f}, 2.81e-8f},   //  4.2 km
    {"Themisto",     {1.f,1.f,1.f}, 2.67e-8f},   //  4.0 km
    {"Megaclite",    {1.f,1.f,1.f}, 2.01e-8f},   //  3.0 km
    {"Taygete",      {1.f,1.f,1.f}, 1.67e-8f},   //  2.5 km
    {"Chaldene",     {1.f,1.f,1.f}, 1.34e-8f},   //  2.0 km
    {"Harpalyke",    {1.f,1.f,1.f}, 1.34e-8f},   //  2.0 km
    {"Kalyke",       {1.f,1.f,1.f}, 1.67e-8f},   //  2.5 km
    {"Iocaste",      {1.f,1.f,1.f}, 1.67e-8f},   //  2.5 km
    {"Erinome",      {1.f,1.f,1.f}, 1.00e-8f},   //  1.5 km
    {"Isonoe",       {1.f,1.f,1.f}, 1.34e-8f},   //  2.0 km
    {"Praxidike",    {1.f,1.f,1.f}, 2.34e-8f},   //  3.5 km
    {"Autonoe",      {1.f,1.f,1.f}, 1.34e-8f},   //  2.0 km
    {"Thyone",       {1.f,1.f,1.f}, 1.34e-8f},   //  2.0 km
    {"Hermippe",     {1.f,1.f,1.f}, 1.34e-8f},   //  2.0 km
    {"Aitne",        {1.f,1.f,1.f}, 1.00e-8f},   //  1.5 km
    {"Eurydome",     {1.f,1.f,1.f}, 1.00e-8f},   //  1.5 km
    {"Euanthe",      {1.f,1.f,1.f}, 1.00e-8f},   //  1.5 km
    {"Euporie",      {1.f,1.f,1.f}, 6.68e-9f},   //  1.0 km
    {"Orthosie",     {1.f,1.f,1.f}, 6.68e-9f},   //  1.0 km
    {"Sponde",       {1.f,1.f,1.f}, 6.68e-9f},   //  1.0 km
    {"Kale",         {1.f,1.f,1.f}, 6.68e-9f},   //  1.0 km
    {"Pasithee",     {1.f,1.f,1.f}, 6.68e-9f},   //  1.0 km
    {"Hegemone",     {1.f,1.f,1.f}, 1.00e-8f},   //  1.5 km
    {"Mneme",        {1.f,1.f,1.f}, 6.68e-9f},   //  1.0 km
    {"Aoede",        {1.f,1.f,1.f}, 1.34e-8f},   //  2.0 km
    {"Thelxinoe",    {1.f,1.f,1.f}, 6.68e-9f},   //  1.0 km
    {"Arche",        {1.f,1.f,1.f}, 1.00e-8f},   //  1.5 km
    {"Kallichore",   {1.f,1.f,1.f}, 6.68e-9f},   //  1.0 km
    {"Helike",       {1.f,1.f,1.f}, 1.34e-8f},   //  2.0 km
    {"Carpo",        {1.f,1.f,1.f}, 1.00e-8f},   //  1.5 km
    {"Eukelade",     {1.f,1.f,1.f}, 1.00e-8f},   //  1.5 km
    {"Cyllene",      {1.f,1.f,1.f}, 6.68e-9f},   //  1.0 km
    {"Kore",         {1.f,1.f,1.f}, 6.68e-9f},   //  1.0 km
    {"Herse",        {1.f,1.f,1.f}, 6.68e-9f},   //  1.0 km
    {"Dia",          {1.f,1.f,1.f}, 1.34e-8f},   //  2.0 km
    {"Eirene",       {1.f,1.f,1.f}, 1.34e-8f},   //  2.0 km
    {"Philophrosyne",{1.f,1.f,1.f}, 1.34e-8f},   //  2.0 km
    {"Eupheme",      {1.f,1.f,1.f}, 1.34e-8f},   //  2.0 km
    {"Valetudo",     {1.f,1.f,1.f}, 3.34e-9f},   //  0.5 km
    {"Pandia",       {1.f,1.f,1.f}, 1.17e-8f},   // 1.75 km
    {"Ersa",         {1.f,1.f,1.f}, 1.17e-8f},   // 1.75 km
    // Additional Saturn moons
    {"Phoebe",       {1.f,1.f,1.f}, 7.12e-7f},   //  107 km
    {"Janus",        {1.f,1.f,1.f}, 6.02e-7f},   //   90 km
    {"Epimetheus",   {1.f,1.f,1.f}, 3.94e-7f},   //   59 km
    {"Atlas",        {1.f,1.f,1.f}, 1.01e-7f},   // 15.1 km
    {"Prometheus",   {1.f,1.f,1.f}, 2.88e-7f},   // 43.1 km
    {"Pandora",      {1.f,1.f,1.f}, 2.72e-7f},   // 40.7 km
    {"Pan",          {1.f,1.f,1.f}, 9.36e-8f},   //   14 km
    {"Telesto",      {1.f,1.f,1.f}, 8.36e-8f},   // 12.5 km
    {"Calypso",      {1.f,1.f,1.f}, 6.35e-8f},   //  9.5 km
    {"Helene",       {1.f,1.f,1.f}, 1.18e-7f},   // 17.6 km
    {"Polydeuces",   {1.f,1.f,1.f}, 1.14e-8f},   //  1.7 km
    {"Methone",      {1.f,1.f,1.f}, 9.69e-9f},   // 1.45 km
    {"Pallene",      {1.f,1.f,1.f}, 1.47e-8f},   //  2.2 km
    {"Aegaeon",      {1.f,1.f,1.f}, 1.67e-9f},   // 0.25 km
    {"Ymir",         {1.f,1.f,1.f}, 6.02e-8f},   //  9.0 km
    {"Paaliaq",      {1.f,1.f,1.f}, 7.35e-8f},   //   11 km
    {"Tarvos",       {1.f,1.f,1.f}, 5.01e-8f},   //  7.5 km
    {"Ijiraq",       {1.f,1.f,1.f}, 4.01e-8f},   //  6.0 km
    {"Suttungr",     {1.f,1.f,1.f}, 2.34e-8f},   //  3.5 km
    {"Kiviuq",       {1.f,1.f,1.f}, 5.35e-8f},   //  8.0 km
    {"Mundilfari",   {1.f,1.f,1.f}, 2.34e-8f},   //  3.5 km
    {"Albiorix",     {1.f,1.f,1.f}, 1.07e-7f},   //   16 km
    {"Skathi",       {1.f,1.f,1.f}, 2.67e-8f},   //  4.0 km
    {"Erriapus",     {1.f,1.f,1.f}, 3.01e-8f},   //  4.5 km
    {"Siarnaq",      {1.f,1.f,1.f}, 1.34e-7f},   //   20 km
    {"Thrymr",       {1.f,1.f,1.f}, 2.34e-8f},   //  3.5 km
    {"Narvi",        {1.f,1.f,1.f}, 2.34e-8f},   //  3.5 km
    {"Aegir",        {1.f,1.f,1.f}, 2.01e-8f},   //  3.0 km
    {"Bebhionn",     {1.f,1.f,1.f}, 2.01e-8f},   //  3.0 km
    {"Bergelmir",    {1.f,1.f,1.f}, 2.01e-8f},   //  3.0 km
    {"Bestla",       {1.f,1.f,1.f}, 2.34e-8f},   //  3.5 km
    {"Farbauti",     {1.f,1.f,1.f}, 1.67e-8f},   //  2.5 km
    {"Fenrir",       {1.f,1.f,1.f}, 1.34e-8f},   //  2.0 km
    {"Fornjot",      {1.f,1.f,1.f}, 2.01e-8f},   //  3.0 km
    {"Greip",        {1.f,1.f,1.f}, 2.01e-8f},   //  3.0 km
    {"Hati",         {1.f,1.f,1.f}, 2.01e-8f},   //  3.0 km
    {"Hyrrokkin",    {1.f,1.f,1.f}, 2.67e-8f},   //  4.0 km
    {"Jarnsaxa",     {1.f,1.f,1.f}, 2.01e-8f},   //  3.0 km
    {"Kari",         {1.f,1.f,1.f}, 2.34e-8f},   //  3.5 km
    {"Loge",         {1.f,1.f,1.f}, 2.01e-8f},   //  3.0 km
    {"Skoll",        {1.f,1.f,1.f}, 2.01e-8f},   //  3.0 km
    {"Skrymir",      {1.f,1.f,1.f}, 1.67e-8f},   //  2.5 km
    {"Surtur",       {1.f,1.f,1.f}, 1.67e-8f},   //  2.5 km
    {"Anthe",        {1.f,1.f,1.f}, 6.68e-9f},   //  1.0 km
    {"Daphnis",      {1.f,1.f,1.f}, 2.54e-8f},   //  3.8 km
    {"Gridr",        {1.f,1.f,1.f}, 1.67e-8f},   //  2.5 km
    {"Angrboda",     {1.f,1.f,1.f}, 1.67e-8f},   //  2.5 km
    {"Gerd",         {1.f,1.f,1.f}, 1.67e-8f},   //  2.5 km
    {"Geirrod",      {1.f,1.f,1.f}, 1.67e-8f},   //  2.5 km
    {"Eggther",      {1.f,1.f,1.f}, 1.67e-8f},   //  2.5 km
    {"Thiazzi",      {1.f,1.f,1.f}, 1.67e-8f},   //  2.5 km
    {"Beli",         {1.f,1.f,1.f}, 1.67e-8f},   //  2.5 km
    {"Alvaldi",      {1.f,1.f,1.f}, 1.67e-8f},   //  2.5 km
    {"Rymgr",        {1.f,1.f,1.f}, 1.67e-8f},   //  2.5 km
    {"Yngvild",      {1.f,1.f,1.f}, 1.67e-8f},   //  2.5 km
    {"Thyra",        {1.f,1.f,1.f}, 1.67e-8f},   //  2.5 km
    {"Tarqeq",       {1.f,1.f,1.f}, 2.34e-8f},   //  3.5 km
    {"Gunnlod",      {1.f,1.f,1.f}, 1.67e-8f},   //  2.5 km
    // Additional Uranus moons
    {"Puck",         {1.f,1.f,1.f}, 5.41e-7f},   //   81 km
    {"Portia",       {1.f,1.f,1.f}, 4.51e-7f},   // 67.5 km
    {"Juliet",       {1.f,1.f,1.f}, 3.14e-7f},   //   47 km
    {"Cressida",     {1.f,1.f,1.f}, 2.61e-7f},   //   39 km
    {"Desdemona",    {1.f,1.f,1.f}, 2.14e-7f},   //   32 km
    {"Rosalind",     {1.f,1.f,1.f}, 2.41e-7f},   //   36 km
    {"Belinda",      {1.f,1.f,1.f}, 2.71e-7f},   // 40.5 km
    {"Perdita",      {1.f,1.f,1.f}, 1.00e-7f},   //   15 km
    {"Cupid",        {1.f,1.f,1.f}, 6.02e-8f},   //  9.0 km
    {"Mab",          {1.f,1.f,1.f}, 3.34e-8f},   //  5.0 km
    {"Bianca",       {1.f,1.f,1.f}, 1.70e-7f},   // 25.5 km
    {"Cordelia",     {1.f,1.f,1.f}, 1.34e-7f},   //   20 km
    {"Ophelia",      {1.f,1.f,1.f}, 1.44e-7f},   // 21.5 km
    {"Caliban",      {1.f,1.f,1.f}, 2.41e-7f},   //   36 km
    {"Sycorax",      {1.f,1.f,1.f}, 5.01e-7f},   //   75 km
    {"Prospero",     {1.f,1.f,1.f}, 1.67e-7f},   //   25 km
    {"Setebos",      {1.f,1.f,1.f}, 1.60e-7f},   //   24 km
    {"Stephano",     {1.f,1.f,1.f}, 1.07e-7f},   //   16 km
    {"Trinculo",     {1.f,1.f,1.f}, 6.02e-8f},   //  9.0 km
    {"Francisco",    {1.f,1.f,1.f}, 7.35e-8f},   //   11 km
    {"Margaret",     {1.f,1.f,1.f}, 6.68e-8f},   //   10 km
    {"Ferdinand",    {1.f,1.f,1.f}, 8.02e-8f},   //   12 km
    {"S/2023 U1",    {1.f,1.f,1.f}, 2.67e-8f},   //  4.0 km
    {"S/2025 U1",    {1.f,1.f,1.f}, 2.67e-8f},   //  4.0 km
    // Additional Neptune moons
    {"Proteus",      {1.f,1.f,1.f}, 1.40e-6f},   //  209 km
    {"Larissa",      {1.f,1.f,1.f}, 6.49e-7f},   //   97 km
    {"Galatea",      {1.f,1.f,1.f}, 5.28e-7f},   //   79 km
    {"Despina",      {1.f,1.f,1.f}, 4.95e-7f},   //   74 km
    {"Thalassa",     {1.f,1.f,1.f}, 2.67e-7f},   //   40 km
    {"Naiad",        {1.f,1.f,1.f}, 2.21e-7f},   //   33 km
    {"Hippocamp",    {1.f,1.f,1.f}, 1.14e-7f},   //   17 km
    {"Halimede",     {1.f,1.f,1.f}, 2.07e-7f},   //   31 km
    {"Psamathe",     {1.f,1.f,1.f}, 1.34e-7f},   //   20 km
    {"Sao",          {1.f,1.f,1.f}, 1.47e-7f},   //   22 km
    {"Laomedeia",    {1.f,1.f,1.f}, 1.40e-7f},   //   21 km
    {"Neso",         {1.f,1.f,1.f}, 2.01e-7f},   //   30 km
    {"S/2021 N1",    {1.f,1.f,1.f}, 1.00e-7f},   //   15 km
    {"S/2002 N5",    {1.f,1.f,1.f}, 1.00e-7f},   //   15 km
}};

