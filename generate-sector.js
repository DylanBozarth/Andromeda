var starList = [
    "Red-Giant",
    "Red-Supergiant",
    "Blue-Giant",
    "White-Dwarf",
    "Yellow-Dwarf",
    "Red-Dwarf",
    "Brown-Dwarf",
];
var planetList = [
    "Rocky1",
    "Rocky2",
    "Rocky3",
    "Rocky4",
    "Rocky5",
    "Temperate1",
    "Temperate2",
    "Temperate3",
    "Temperate4",
    "Temperate5",
    "Ocean1",
    "Ocean2",
    "Ocean3",
    "Ocean4",
    "Ocean5",
    "Frozen1",
    "Frozen2",
    "Frozen3",
    "Frozen4",
    "Frozen5",
    "Lava1",
    "Lava2",
    "Lava3",
    "Lava4",
    "Lava5",
    "Gas1",
    "Gas2",
    "Gas3",
    "Gas4",
    "Gas5",
    "Desert1",
    "Desert2",
    "Desert3",
    "Desert4",
    "Desert5",
    "Greenhouse1",
    "Greenhouse2",
    "Greenhouse3",
    "Greenhouse4",
    "Greenhouse5",
    "Asteroid-Belt1",
    "Asteroid-Belt2",
    "Asteroid-Belt3",
];
var resources = [
    "ore-low",
    "ore-high",
    "ore-medium",
    "ore-trace",
    "water-high",
    "water-medium",
    "water-low",
    "water-trace",
    "gas-low",
    "gas-medium",
    "population-tribal",
    "population-scarce",
    "population-cities",
    "oil-low",
    "oil-medium"
];
//UTILS/RANDOM GENERATORS FILE ========================================
var getRandomString = function (Array) {
    var randIdx = Math.floor(Math.random() * Array.length);
    return Array[randIdx];
};
var generateRandomNumber = function (max, min) {
    if (min === void 0) { min = 1; }
    return Math.floor(Math.random() * max + min);
};
var getRandomSystemStar = function (systemStarArr) {
    return getRandomString(systemStarArr);
};
var getRandomPlanet = function (planetArr) {
    return getRandomString(planetArr);
};
var getRandomResource = function (resourceArr, duplicate) {
    if (duplicate === void 0) { duplicate = ""; }
    var randomResource = getRandomString(resourceArr);
    while (duplicate === randomResource) {
        randomResource = getRandomString(resourceArr);
    }
    return randomResource;
};
var getRandomNumberString = function () {
    var prefixOptions = "A"; // change this variable for each sector
    var value = getRandomString(prefixOptions.split(""));
    var num = generateRandomNumber(90000, 10000);
    return "".concat(value, "-").concat(num);
};
var generateSystem = function (maxPlanets) {
    var system = {
        systemStar: getRandomSystemStar(starList),
        systemPlanets: {},
        systemName: getRandomNumberString(),
        cords: getRandomNumberString(),
        ownership: getRandomNumberString(),
        hangar: []
    };
    var randomPlanetNumber = generateRandomNumber(maxPlanets);
    for (var i = 0; i < randomPlanetNumber; i++) {
        var planetName = getRandomPlanet(planetList);
        var resource1 = getRandomResource(resources);
        var resource2 = getRandomResource(resources, resource1);
        system.systemPlanets[planetName] = [resource1, resource2];
    }
    return system;
};
var generateMultipleSystems = function (maxSystems, maxPlanets) {
    var randomSystemNumber = generateRandomNumber(maxSystems);
    var systems = [];
    for (var i = 0; i < randomSystemNumber; i++) {
        var system = generateSystem(maxPlanets);
        systems.push(system);
    }
    console.log(systems);
};
generateMultipleSystems(10, 8);
