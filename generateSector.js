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
    var universe = [];
    var starNumber = 5;
    for (var i = 0; i < starNumber; i++) {
        universe.push({
            systemStar: starList[~~(Math.random() * lengthOfStarList)],
            systemPlanets: Array.from({ length: ~~(Math.random() * 9) }).map(function (x) { return planetList[~~(Math.random() * lengthOfPlanetList)]; }),
            systemName: "A-".concat(Math.floor(Math.random() * 90000) + 10000), /* change from A- whatever sector we are in */
            cords: "A-".concat(Math.floor(Math.random() * 90000) + 100) /* change from A- whatever sector we are in */
        });
    }
    console.log(universe);
};
letThereBeLight();
