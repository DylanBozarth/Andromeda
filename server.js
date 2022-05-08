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
    "Rocky",
    "Temperate",
    "Ocean",
    "Frozen",
    "Lava",
    "Gas"
];
var lengthOfStarList = starList.length;
var lengthOfPlanetList = planetList.length;
var letThereBeLight = function () {
    var sector = [];
    var starNumber = 99;
    for (var i = 0; i < starNumber; i++) {
        sector.push({
            systemStar: starList[~~(Math.random() * lengthOfStarList)],
            systemName: "A".concat(Math.floor(Math.random() * 90000) + 10000),
            systemPlanets: Array.from({ length: ~~(Math.random() * 9) }).map(function (x) { return planetList[~~(Math.random() * lengthOfPlanetList)]; }),
            distanceFromTop: (Math.floor(Math.random() * 900) + 10),
            distanceFromLeft: (Math.floor(Math.random() * 900) + 10)
        });
    }
    console.log(sector);
};
letThereBeLight();
