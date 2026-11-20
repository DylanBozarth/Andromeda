#pragma once
#include <array>
#include <cstring>

// Descriptive properties for all known moons, sourced from moons.json.
// Covers atmosphere composition, terrain, and average temperature.
// Physics (orbital elements, GM, radius) lives in MoonData.hpp.

static constexpr int MOON_TEMP_UNKNOWN = -9999;

struct MoonAtmosphere {
    const char* type;        // nullptr if no atmosphere
    const char* gases[4];    // null-padded composition list
    int         gasCount;
};

struct MoonProperties {
    const char*     name;
    const char*     parentPlanet;
    int             avgTemperatureC;        // MOON_TEMP_UNKNOWN if not measured
    const char*     terrain[4];
    int             terrainCount;
    MoonAtmosphere  atmosphere;
    double          avgOrbitalDistanceKm;
    bool            orbitalDistanceEstimated;
};

inline constexpr std::array<MoonProperties, 171> MOON_PROPERTIES = {{

    // ── Earth ────────────────────────────────────────────────────────────────
    {
        "Moon", "Earth", -20,
        {"impact craters", "basalt plains", "highlands", "mountains"}, 4,
        {"extremely thin exosphere", {"helium", "neon", "argon", "hydrogen"}, 4},
        384400.0, false
    },

    // ── Mars ─────────────────────────────────────────────────────────────────
    {
        "Phobos", "Mars", -40,
        {"cratered", "regolith", "rocky"}, 3,
        {nullptr, {}, 0},
        9375.0, false
    },
    {
        "Deimos", "Mars", -40,
        {"dusty", "cratered", "rocky"}, 3,
        {nullptr, {}, 0},
        23457.0, false
    },

    // ── Jupiter ───────────────────────────────────────────────────────────────
    {
        "Io", "Jupiter", -130,
        {"volcanic plains", "lava flows", "sulfur deposits", "mountains"}, 4,
        {"thin", {"sulfur dioxide"}, 1},
        421800.0, false
    },
    {
        "Europa", "Jupiter", -160,
        {"ice crust", "chaos terrain", "ridges", "cracks"}, 4,
        {"very thin", {"oxygen"}, 1},
        671100.0, false
    },
    {
        "Ganymede", "Jupiter", -163,
        {"ice", "rock", "grooved terrain", "impact craters"}, 4,
        {"very thin", {"oxygen"}, 1},
        1070400.0, false
    },
    {
        "Callisto", "Jupiter", -139,
        {"heavily cratered", "ice", "rock"}, 3,
        {"very thin", {"carbon dioxide", "oxygen"}, 2},
        1882700.0, false
    },
    {
        "Amalthea", "Jupiter", -150,
        {"rocky", "irregular"}, 2,
        {nullptr, {}, 0},
        181400.0, false
    },
    {
        "Himalia", "Jupiter", -150,
        {"rocky"}, 1,
        {nullptr, {}, 0},
        11439000.0, false
    },
    {
        "Elara", "Jupiter", MOON_TEMP_UNKNOWN,
        {"rocky"}, 1,
        {nullptr, {}, 0},
        11710700.0, false
    },
    {
        "Pasiphae", "Jupiter", MOON_TEMP_UNKNOWN,
        {"rocky"}, 1,
        {nullptr, {}, 0},
        23463200.0, false
    },
    {
        "Sinope", "Jupiter", MOON_TEMP_UNKNOWN,
        {"rocky"}, 1,
        {nullptr, {}, 0},
        23679300.0, false
    },
    {
        "Lysithea", "Jupiter", MOON_TEMP_UNKNOWN,
        {"rocky"}, 1,
        {nullptr, {}, 0},
        11699100.0, false
    },
    {
        "Carme", "Jupiter", MOON_TEMP_UNKNOWN,
        {"rocky"}, 1,
        {nullptr, {}, 0},
        23139200.0, false
    },
    {
        "Ananke", "Jupiter", MOON_TEMP_UNKNOWN,
        {"rocky"}, 1,
        {nullptr, {}, 0},
        21029500.0, false
    },
    {
        "Leda", "Jupiter", MOON_TEMP_UNKNOWN,
        {"rocky"}, 1,
        {nullptr, {}, 0},
        11145200.0, false
    },
    {
        "Thebe", "Jupiter", MOON_TEMP_UNKNOWN,
        {"rocky", "irregular"}, 2,
        {nullptr, {}, 0},
        221900.0, false
    },
    {
        "Adrastea", "Jupiter", MOON_TEMP_UNKNOWN,
        {"rocky"}, 1,
        {nullptr, {}, 0},
        129000.0, false
    },
    {
        "Metis", "Jupiter", MOON_TEMP_UNKNOWN,
        {"rocky"}, 1,
        {nullptr, {}, 0},
        128000.0, false
    },
    {
        "Callirrhoe", "Jupiter", MOON_TEMP_UNKNOWN,
        {"rocky"}, 1,
        {nullptr, {}, 0},
        23789400.0, false
    },
    {
        "Themisto", "Jupiter", MOON_TEMP_UNKNOWN,
        {"rocky"}, 1,
        {nullptr, {}, 0},
        7397000.0, false
    },
    {
        "Megaclite", "Jupiter", MOON_TEMP_UNKNOWN,
        {"rocky"}, 1,
        {nullptr, {}, 0},
        23807000.0, true
    },
    {
        "Taygete", "Jupiter", MOON_TEMP_UNKNOWN,
        {"rocky"}, 1,
        {nullptr, {}, 0},
        23404000.0, true
    },
    {
        "Chaldene", "Jupiter", MOON_TEMP_UNKNOWN,
        {"rocky"}, 1,
        {nullptr, {}, 0},
        23005000.0, true
    },
    {
        "Harpalyke", "Jupiter", MOON_TEMP_UNKNOWN,
        {"rocky"}, 1,
        {nullptr, {}, 0},
        21105000.0, true
    },
    {
        "Kalyke", "Jupiter", MOON_TEMP_UNKNOWN,
        {"rocky"}, 1,
        {nullptr, {}, 0},
        23298000.0, false
    },
    {
        "Iocaste", "Jupiter", MOON_TEMP_UNKNOWN,
        {"rocky"}, 1,
        {nullptr, {}, 0},
        21062300.0, false
    },
    {
        "Erinome", "Jupiter", MOON_TEMP_UNKNOWN,
        {"rocky"}, 1,
        {nullptr, {}, 0},
        23027200.0, false
    },
    {
        "Isonoe", "Jupiter", MOON_TEMP_UNKNOWN,
        {"rocky"}, 1,
        {nullptr, {}, 0},
        22976300.0, false
    },
    {
        "Praxidike", "Jupiter", MOON_TEMP_UNKNOWN,
        {"rocky"}, 1,
        {nullptr, {}, 0},
        20931100.0, false
    },
    {
        "Autonoe", "Jupiter", MOON_TEMP_UNKNOWN,
        {"rocky"}, 1,
        {nullptr, {}, 0},
        23785200.0, false
    },
    {
        "Thyone", "Jupiter", MOON_TEMP_UNKNOWN,
        {"rocky"}, 1,
        {nullptr, {}, 0},
        20972700.0, false
    },
    {
        "Hermippe", "Jupiter", MOON_TEMP_UNKNOWN,
        {"rocky"}, 1,
        {nullptr, {}, 0},
        21103600.0, false
    },
    {
        "Aitne", "Jupiter", MOON_TEMP_UNKNOWN,
        {"rocky"}, 1,
        {nullptr, {}, 0},
        23059400.0, false
    },
    {
        "Eurydome", "Jupiter", MOON_TEMP_UNKNOWN,
        {"rocky"}, 1,
        {nullptr, {}, 0},
        22894500.0, false
    },
    {
        "Euanthe", "Jupiter", MOON_TEMP_UNKNOWN,
        {"rocky"}, 1,
        {nullptr, {}, 0},
        20822900.0, false
    },
    {
        "Euporie", "Jupiter", MOON_TEMP_UNKNOWN,
        {"rocky"}, 1,
        {nullptr, {}, 0},
        19261900.0, false
    },
    {
        "Orthosie", "Jupiter", MOON_TEMP_UNKNOWN,
        {"rocky"}, 1,
        {nullptr, {}, 0},
        20897800.0, false
    },
    {
        "Sponde", "Jupiter", MOON_TEMP_UNKNOWN,
        {"rocky"}, 1,
        {nullptr, {}, 0},
        23538700.0, false
    },
    {
        "Kale", "Jupiter", MOON_TEMP_UNKNOWN,
        {"rocky"}, 1,
        {nullptr, {}, 0},
        23047800.0, false
    },
    {
        "Pasithee", "Jupiter", MOON_TEMP_UNKNOWN,
        {"rocky"}, 1,
        {nullptr, {}, 0},
        22840800.0, false
    },
    {
        "Hegemone", "Jupiter", MOON_TEMP_UNKNOWN,
        {"rocky"}, 1,
        {nullptr, {}, 0},
        23342600.0, false
    },
    {
        "Mneme", "Jupiter", MOON_TEMP_UNKNOWN,
        {"rocky"}, 1,
        {nullptr, {}, 0},
        20815800.0, false
    },
    {
        "Aoede", "Jupiter", MOON_TEMP_UNKNOWN,
        {"rocky"}, 1,
        {nullptr, {}, 0},
        23773100.0, false
    },
    {
        "Thelxinoe", "Jupiter", MOON_TEMP_UNKNOWN,
        {"rocky"}, 1,
        {nullptr, {}, 0},
        20972300.0, false
    },
    {
        "Arche", "Jupiter", MOON_TEMP_UNKNOWN,
        {"rocky"}, 1,
        {nullptr, {}, 0},
        23093200.0, false
    },
    {
        "Kallichore", "Jupiter", MOON_TEMP_UNKNOWN,
        {"rocky"}, 1,
        {nullptr, {}, 0},
        23017100.0, false
    },
    {
        "Helike", "Jupiter", MOON_TEMP_UNKNOWN,
        {"rocky"}, 1,
        {nullptr, {}, 0},
        20911400.0, false
    },
    {
        "Carpo", "Jupiter", MOON_TEMP_UNKNOWN,
        {"rocky"}, 1,
        {nullptr, {}, 0},
        17039500.0, false
    },
    {
        "Eukelade", "Jupiter", MOON_TEMP_UNKNOWN,
        {"rocky"}, 1,
        {nullptr, {}, 0},
        23062400.0, false
    },
    {
        "Cyllene", "Jupiter", MOON_TEMP_UNKNOWN,
        {"rocky"}, 1,
        {nullptr, {}, 0},
        23650000.0, false
    },
    {
        "Kore", "Jupiter", MOON_TEMP_UNKNOWN,
        {"rocky"}, 1,
        {nullptr, {}, 0},
        24203300.0, false
    },
    {
        "Herse", "Jupiter", MOON_TEMP_UNKNOWN,
        {"rocky"}, 1,
        {nullptr, {}, 0},
        23146700.0, false
    },
    {
        "Dia", "Jupiter", MOON_TEMP_UNKNOWN,
        {"rocky"}, 1,
        {nullptr, {}, 0},
        12257900.0, false
    },
    {
        "Eirene", "Jupiter", MOON_TEMP_UNKNOWN,
        {"rocky"}, 1,
        {nullptr, {}, 0},
        23051300.0, false
    },
    {
        "Philophrosyne", "Jupiter", MOON_TEMP_UNKNOWN,
        {"rocky"}, 1,
        {nullptr, {}, 0},
        22600200.0, false
    },
    {
        "Eupheme", "Jupiter", MOON_TEMP_UNKNOWN,
        {"rocky"}, 1,
        {nullptr, {}, 0},
        20763400.0, false
    },
    {
        "Valetudo", "Jupiter", MOON_TEMP_UNKNOWN,
        {"rocky"}, 1,
        {nullptr, {}, 0},
        18690100.0, false
    },
    {
        "Pandia", "Jupiter", MOON_TEMP_UNKNOWN,
        {"rocky"}, 1,
        {nullptr, {}, 0},
        11494000.0, true
    },
    {
        "Ersa", "Jupiter", MOON_TEMP_UNKNOWN,
        {"rocky"}, 1,
        {nullptr, {}, 0},
        11399400.0, false
    },

    // ── Saturn ───────────────────────────────────────────────────────────────
    {
        "Titan", "Saturn", -179,
        {"hydrocarbon lakes", "sand dunes", "water-ice bedrock", "river channels"}, 4,
        {"thick", {"nitrogen", "methane", "hydrogen"}, 3},
        1221900.0, false
    },
    {
        "Enceladus", "Saturn", -201,
        {"ice", "cryovolcanoes", "tiger stripes"}, 3,
        {"very thin", {"water vapor"}, 1},
        238400.0, false
    },
    {
        "Mimas", "Saturn", -198,
        {"heavily cratered", "ice"}, 2,
        {nullptr, {}, 0},
        186000.0, false
    },
    {
        "Tethys", "Saturn", -187,
        {"ice", "impact craters", "canyons"}, 3,
        {nullptr, {}, 0},
        295000.0, false
    },
    {
        "Dione", "Saturn", -186,
        {"ice cliffs", "craters", "fractures"}, 3,
        {"extremely thin", {"oxygen"}, 1},
        377700.0, false
    },
    {
        "Rhea", "Saturn", -174,
        {"ice", "craters"}, 2,
        {"extremely thin", {"oxygen", "carbon dioxide"}, 2},
        527200.0, false
    },
    {
        "Iapetus", "Saturn", -143,
        {"dark hemisphere", "bright ice", "equatorial ridge"}, 3,
        {nullptr, {}, 0},
        3561700.0, false
    },
    {
        "Hyperion", "Saturn", -180,
        {"porous", "cratered"}, 2,
        {nullptr, {}, 0},
        1481500.0, false
    },
    {
        "Phoebe", "Saturn", -200,
        {"dark rocky", "cratered"}, 2,
        {nullptr, {}, 0},
        12929400.0, false
    },
    {
        "Janus", "Saturn", MOON_TEMP_UNKNOWN,
        {"rocky", "cratered"}, 2,
        {nullptr, {}, 0},
        151500.0, false
    },
    {
        "Epimetheus", "Saturn", MOON_TEMP_UNKNOWN,
        {"rocky", "cratered"}, 2,
        {nullptr, {}, 0},
        151400.0, false
    },
    {
        "Atlas", "Saturn", MOON_TEMP_UNKNOWN,
        {"ridge", "dust-covered"}, 2,
        {nullptr, {}, 0},
        137700.0, false
    },
    {
        "Prometheus", "Saturn", MOON_TEMP_UNKNOWN,
        {"irregular", "rocky"}, 2,
        {nullptr, {}, 0},
        139400.0, false
    },
    {
        "Pandora", "Saturn", MOON_TEMP_UNKNOWN,
        {"rocky"}, 1,
        {nullptr, {}, 0},
        141700.0, false
    },
    {
        "Pan", "Saturn", MOON_TEMP_UNKNOWN,
        {"equatorial ridge"}, 1,
        {nullptr, {}, 0},
        133600.0, false
    },
    {
        "Telesto", "Saturn", MOON_TEMP_UNKNOWN,
        {"ice", "rock"}, 2,
        {nullptr, {}, 0},
        295000.0, false
    },
    {
        "Calypso", "Saturn", MOON_TEMP_UNKNOWN,
        {"ice", "rock"}, 2,
        {nullptr, {}, 0},
        295000.0, false
    },
    {
        "Helene", "Saturn", MOON_TEMP_UNKNOWN,
        {"ice", "rock"}, 2,
        {nullptr, {}, 0},
        377600.0, false
    },
    {
        "Polydeuces", "Saturn", MOON_TEMP_UNKNOWN,
        {"ice"}, 1,
        {nullptr, {}, 0},
        377200.0, false
    },
    {
        "Methone", "Saturn", MOON_TEMP_UNKNOWN,
        {"smooth ice"}, 1,
        {nullptr, {}, 0},
        194000.0, false
    },
    {
        "Pallene", "Saturn", MOON_TEMP_UNKNOWN,
        {"ice"}, 1,
        {nullptr, {}, 0},
        212300.0, false
    },
    {
        "Aegaeon", "Saturn", MOON_TEMP_UNKNOWN,
        {"ice"}, 1,
        {nullptr, {}, 0},
        167500.0, false
    },
    {
        "Ymir", "Saturn", MOON_TEMP_UNKNOWN,
        {"rocky"}, 1,
        {nullptr, {}, 0},
        22955600.0, false
    },
    {
        "Paaliaq", "Saturn", MOON_TEMP_UNKNOWN,
        {"rocky"}, 1,
        {nullptr, {}, 0},
        14997700.0, false
    },
    {
        "Tarvos", "Saturn", MOON_TEMP_UNKNOWN,
        {"rocky"}, 1,
        {nullptr, {}, 0},
        18216600.0, false
    },
    {
        "Ijiraq", "Saturn", MOON_TEMP_UNKNOWN,
        {"rocky"}, 1,
        {nullptr, {}, 0},
        11344700.0, false
    },
    {
        "Suttungr", "Saturn", MOON_TEMP_UNKNOWN,
        {"rocky"}, 1,
        {nullptr, {}, 0},
        19391900.0, false
    },
    {
        "Kiviuq", "Saturn", MOON_TEMP_UNKNOWN,
        {"rocky"}, 1,
        {nullptr, {}, 0},
        11307400.0, false
    },
    {
        "Mundilfari", "Saturn", MOON_TEMP_UNKNOWN,
        {"rocky"}, 1,
        {nullptr, {}, 0},
        18588200.0, false
    },
    {
        "Albiorix", "Saturn", MOON_TEMP_UNKNOWN,
        {"rocky"}, 1,
        {nullptr, {}, 0},
        16329200.0, false
    },
    {
        "Skathi", "Saturn", MOON_TEMP_UNKNOWN,
        {"rocky"}, 1,
        {nullptr, {}, 0},
        15575400.0, false
    },
    {
        "Erriapus", "Saturn", MOON_TEMP_UNKNOWN,
        {"rocky"}, 1,
        {nullptr, {}, 0},
        17506900.0, false
    },
    {
        "Siarnaq", "Saturn", MOON_TEMP_UNKNOWN,
        {"rocky"}, 1,
        {nullptr, {}, 0},
        17881100.0, false
    },
    {
        "Thrymr", "Saturn", MOON_TEMP_UNKNOWN,
        {"rocky"}, 1,
        {nullptr, {}, 0},
        20330500.0, false
    },
    {
        "Narvi", "Saturn", MOON_TEMP_UNKNOWN,
        {"rocky"}, 1,
        {nullptr, {}, 0},
        19285000.0, false
    },
    {
        "Aegir", "Saturn", MOON_TEMP_UNKNOWN,
        {"rocky"}, 1,
        {nullptr, {}, 0},
        20664400.0, false
    },
    {
        "Bebhionn", "Saturn", MOON_TEMP_UNKNOWN,
        {"rocky"}, 1,
        {nullptr, {}, 0},
        17027300.0, false
    },
    {
        "Bergelmir", "Saturn", MOON_TEMP_UNKNOWN,
        {"rocky"}, 1,
        {nullptr, {}, 0},
        19268100.0, false
    },
    {
        "Bestla", "Saturn", MOON_TEMP_UNKNOWN,
        {"rocky"}, 1,
        {nullptr, {}, 0},
        20337800.0, false
    },
    {
        "Farbauti", "Saturn", MOON_TEMP_UNKNOWN,
        {"rocky"}, 1,
        {nullptr, {}, 0},
        20290700.0, false
    },
    {
        "Fenrir", "Saturn", MOON_TEMP_UNKNOWN,
        {"rocky"}, 1,
        {nullptr, {}, 0},
        22045000.0, true
    },
    {
        "Fornjot", "Saturn", MOON_TEMP_UNKNOWN,
        {"rocky"}, 1,
        {nullptr, {}, 0},
        25108000.0, true
    },
    {
        "Greip", "Saturn", MOON_TEMP_UNKNOWN,
        {"rocky"}, 1,
        {nullptr, {}, 0},
        18361000.0, true
    },
    {
        "Hati", "Saturn", MOON_TEMP_UNKNOWN,
        {"rocky"}, 1,
        {nullptr, {}, 0},
        19800000.0, true
    },
    {
        "Hyrrokkin", "Saturn", MOON_TEMP_UNKNOWN,
        {"rocky"}, 1,
        {nullptr, {}, 0},
        18437000.0, true
    },
    {
        "Jarnsaxa", "Saturn", MOON_TEMP_UNKNOWN,
        {"rocky"}, 1,
        {nullptr, {}, 0},
        20080000.0, true
    },
    {
        "Kari", "Saturn", MOON_TEMP_UNKNOWN,
        {"rocky"}, 1,
        {nullptr, {}, 0},
        22094000.0, true
    },
    {
        "Loge", "Saturn", MOON_TEMP_UNKNOWN,
        {"rocky"}, 1,
        {nullptr, {}, 0},
        23058000.0, true
    },
    {
        "Skoll", "Saturn", MOON_TEMP_UNKNOWN,
        {"rocky"}, 1,
        {nullptr, {}, 0},
        17665000.0, true
    },
    {
        "Skrymir", "Saturn", MOON_TEMP_UNKNOWN,
        {"rocky"}, 1,
        {nullptr, {}, 0},
        21447400.0, false
    },
    {
        "Surtur", "Saturn", MOON_TEMP_UNKNOWN,
        {"rocky"}, 1,
        {nullptr, {}, 0},
        22189000.0, true
    },
    {
        "Anthe", "Saturn", MOON_TEMP_UNKNOWN,
        {"icy", "rocky"}, 2,
        {nullptr, {}, 0},
        19810000.0, false
    },
    {
        "Daphnis", "Saturn", MOON_TEMP_UNKNOWN,
        {"icy", "equatorial ridge"}, 2,
        {nullptr, {}, 0},
        136500.0, false
    },
    {
        "Gridr", "Saturn", MOON_TEMP_UNKNOWN,
        {"rocky"}, 1,
        {nullptr, {}, 0},
        19887000.0, true
    },
    {
        "Angrboda", "Saturn", MOON_TEMP_UNKNOWN,
        {"rocky"}, 1,
        {nullptr, {}, 0},
        20591500.0, false
    },
    {
        "Gerd", "Saturn", MOON_TEMP_UNKNOWN,
        {"rocky"}, 1,
        {nullptr, {}, 0},
        20947500.0, false
    },
    {
        "Geirrod", "Saturn", MOON_TEMP_UNKNOWN,
        {"rocky"}, 1,
        {nullptr, {}, 0},
        22259400.0, false
    },
    {
        "Eggther", "Saturn", MOON_TEMP_UNKNOWN,
        {"rocky"}, 1,
        {nullptr, {}, 0},
        19844600.0, false
    },
    {
        "Thiazzi", "Saturn", MOON_TEMP_UNKNOWN,
        {"rocky"}, 1,
        {nullptr, {}, 0},
        23577500.0, false
    },
    {
        "Beli", "Saturn", MOON_TEMP_UNKNOWN,
        {"rocky"}, 1,
        {nullptr, {}, 0},
        20703700.0, false
    },
    {
        "Alvaldi", "Saturn", MOON_TEMP_UNKNOWN,
        {"rocky"}, 1,
        {nullptr, {}, 0},
        21993800.0, false
    },
    {
        "Rymgr", "Saturn", MOON_TEMP_UNKNOWN,
        {"rocky"}, 1,
        {nullptr, {}, 0},
        23000000.0, true
    },
    {
        "Yngvild", "Saturn", MOON_TEMP_UNKNOWN,
        {"rocky"}, 1,
        {nullptr, {}, 0},
        23000000.0, true
    },
    {
        "Thyra", "Saturn", MOON_TEMP_UNKNOWN,
        {"rocky"}, 1,
        {nullptr, {}, 0},
        23000000.0, true
    },
    {
        "Tarqeq", "Saturn", MOON_TEMP_UNKNOWN,
        {"rocky"}, 1,
        {nullptr, {}, 0},
        17910000.0, false
    },
    {
        "Gunnlod", "Saturn", MOON_TEMP_UNKNOWN,
        {"rocky"}, 1,
        {nullptr, {}, 0},
        21141800.0, false
    },

    // ── Uranus ────────────────────────────────────────────────────────────────
    {
        "Titania", "Uranus", -203,
        {"ice", "rock", "canyons", "impact craters"}, 4,
        {nullptr, {}, 0},
        436298.0, false
    },
    {
        "Oberon", "Uranus", -203,
        {"ice", "rock", "craters", "cliffs"}, 4,
        {nullptr, {}, 0},
        583511.0, false
    },
    {
        "Umbriel", "Uranus", -203,
        {"dark ice", "craters"}, 2,
        {nullptr, {}, 0},
        265986.0, false
    },
    {
        "Ariel", "Uranus", -213,
        {"ice", "canyons", "fault valleys", "craters"}, 4,
        {nullptr, {}, 0},
        190929.0, false
    },
    {
        "Miranda", "Uranus", -187,
        {"ice cliffs", "coronae", "canyons", "rock"}, 4,
        {nullptr, {}, 0},
        129846.0, false
    },
    {
        "Puck", "Uranus", MOON_TEMP_UNKNOWN,
        {"rocky", "cratered"}, 2,
        {nullptr, {}, 0},
        86004.0, false
    },
    {
        "Portia", "Uranus", MOON_TEMP_UNKNOWN,
        {"rocky"}, 1,
        {nullptr, {}, 0},
        66101.0, false
    },
    {
        "Juliet", "Uranus", MOON_TEMP_UNKNOWN,
        {"rocky"}, 1,
        {nullptr, {}, 0},
        64362.0, false
    },
    {
        "Cressida", "Uranus", MOON_TEMP_UNKNOWN,
        {"rocky"}, 1,
        {nullptr, {}, 0},
        61770.0, false
    },
    {
        "Desdemona", "Uranus", MOON_TEMP_UNKNOWN,
        {"rocky"}, 1,
        {nullptr, {}, 0},
        62663.0, false
    },
    {
        "Rosalind", "Uranus", MOON_TEMP_UNKNOWN,
        {"rocky"}, 1,
        {nullptr, {}, 0},
        69930.0, false
    },
    {
        "Belinda", "Uranus", MOON_TEMP_UNKNOWN,
        {"rocky"}, 1,
        {nullptr, {}, 0},
        75258.0, false
    },
    {
        "Perdita", "Uranus", MOON_TEMP_UNKNOWN,
        {"rocky"}, 1,
        {nullptr, {}, 0},
        76418.0, false
    },
    {
        "Cupid", "Uranus", MOON_TEMP_UNKNOWN,
        {"rocky"}, 1,
        {nullptr, {}, 0},
        74396.0, false
    },
    {
        "Mab", "Uranus", MOON_TEMP_UNKNOWN,
        {"ice", "rock"}, 2,
        {nullptr, {}, 0},
        97737.0, false
    },
    {
        "Bianca", "Uranus", MOON_TEMP_UNKNOWN,
        {"rocky"}, 1,
        {nullptr, {}, 0},
        59170.0, false
    },
    {
        "Cordelia", "Uranus", MOON_TEMP_UNKNOWN,
        {"rocky"}, 1,
        {nullptr, {}, 0},
        49755.0, false
    },
    {
        "Ophelia", "Uranus", MOON_TEMP_UNKNOWN,
        {"rocky"}, 1,
        {nullptr, {}, 0},
        53765.0, false
    },
    {
        "Caliban", "Uranus", MOON_TEMP_UNKNOWN,
        {"rocky"}, 1,
        {nullptr, {}, 0},
        7167000.0, false
    },
    {
        "Sycorax", "Uranus", MOON_TEMP_UNKNOWN,
        {"rocky"}, 1,
        {nullptr, {}, 0},
        12193200.0, false
    },
    {
        "Prospero", "Uranus", MOON_TEMP_UNKNOWN,
        {"rocky"}, 1,
        {nullptr, {}, 0},
        16221000.0, false
    },
    {
        "Setebos", "Uranus", MOON_TEMP_UNKNOWN,
        {"rocky"}, 1,
        {nullptr, {}, 0},
        17519800.0, false
    },
    {
        "Stephano", "Uranus", MOON_TEMP_UNKNOWN,
        {"rocky"}, 1,
        {nullptr, {}, 0},
        7951400.0, false
    },
    {
        "Trinculo", "Uranus", MOON_TEMP_UNKNOWN,
        {"rocky"}, 1,
        {nullptr, {}, 0},
        8502600.0, false
    },
    {
        "Francisco", "Uranus", MOON_TEMP_UNKNOWN,
        {"rocky"}, 1,
        {nullptr, {}, 0},
        4275700.0, false
    },
    {
        "Margaret", "Uranus", MOON_TEMP_UNKNOWN,
        {"rocky"}, 1,
        {nullptr, {}, 0},
        14425000.0, false
    },
    {
        "Ferdinand", "Uranus", MOON_TEMP_UNKNOWN,
        {"rocky"}, 1,
        {nullptr, {}, 0},
        20421400.0, false
    },
    {
        "S/2023 U1", "Uranus", MOON_TEMP_UNKNOWN,
        {"rocky"}, 1,
        {nullptr, {}, 0},
        7976600.0, false
    },
    {
        "S/2025 U1", "Uranus", MOON_TEMP_UNKNOWN,
        {"rocky"}, 1,
        {nullptr, {}, 0},
        57844.0, false
    },

    // ── Neptune ───────────────────────────────────────────────────────────────
    {
        "Triton", "Neptune", -235,
        {"nitrogen ice", "cryovolcanoes", "ice plains", "rock"}, 4,
        {"thin", {"nitrogen", "methane"}, 2},
        354800.0, false
    },
    {
        "Nereid", "Neptune", -223,
        {"rocky", "ice", "cratered"}, 3,
        {nullptr, {}, 0},
        5513900.0, false
    },
    {
        "Proteus", "Neptune", -222,
        {"rocky", "cratered", "irregular"}, 3,
        {nullptr, {}, 0},
        117700.0, false
    },
    {
        "Larissa", "Neptune", MOON_TEMP_UNKNOWN,
        {"rocky", "cratered"}, 2,
        {nullptr, {}, 0},
        73600.0, false
    },
    {
        "Galatea", "Neptune", MOON_TEMP_UNKNOWN,
        {"rocky"}, 1,
        {nullptr, {}, 0},
        62000.0, false
    },
    {
        "Despina", "Neptune", MOON_TEMP_UNKNOWN,
        {"rocky"}, 1,
        {nullptr, {}, 0},
        52600.0, false
    },
    {
        "Thalassa", "Neptune", MOON_TEMP_UNKNOWN,
        {"rocky"}, 1,
        {nullptr, {}, 0},
        50100.0, false
    },
    {
        "Naiad", "Neptune", MOON_TEMP_UNKNOWN,
        {"rocky"}, 1,
        {nullptr, {}, 0},
        48300.0, false
    },
    {
        "Hippocamp", "Neptune", MOON_TEMP_UNKNOWN,
        {"rocky"}, 1,
        {nullptr, {}, 0},
        105300.0, false
    },
    {
        "Halimede", "Neptune", MOON_TEMP_UNKNOWN,
        {"rocky"}, 1,
        {nullptr, {}, 0},
        16611000.0, false
    },
    {
        "Psamathe", "Neptune", MOON_TEMP_UNKNOWN,
        {"rocky"}, 1,
        {nullptr, {}, 0},
        46695000.0, false
    },
    {
        "Sao", "Neptune", MOON_TEMP_UNKNOWN,
        {"rocky"}, 1,
        {nullptr, {}, 0},
        22422000.0, false
    },
    {
        "Laomedeia", "Neptune", MOON_TEMP_UNKNOWN,
        {"rocky"}, 1,
        {nullptr, {}, 0},
        23571000.0, false
    },
    {
        "Neso", "Neptune", MOON_TEMP_UNKNOWN,
        {"rocky"}, 1,
        {nullptr, {}, 0},
        48387000.0, false
    },
    {
        "S/2021 N1", "Neptune", MOON_TEMP_UNKNOWN,
        {"rocky"}, 1,
        {nullptr, {}, 0},
        50000000.0, true
    },
    {
        "S/2002 N5", "Neptune", MOON_TEMP_UNKNOWN,
        {"rocky"}, 1,
        {nullptr, {}, 0},
        25000000.0, true
    },
}};

// Linear lookup by name.
inline const MoonProperties* findMoonProperties(const char* name) {
    for (const auto& m : MOON_PROPERTIES)
        if (m.name && std::strcmp(m.name, name) == 0) return &m;
    return nullptr;
}
